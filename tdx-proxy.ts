import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// ── TDX 認證 ──
const CLIENT_ID = 'pickyouup.tw-55b24cf0-063a-40a7';
const CLIENT_SECRET = '09ca4a40-fdab-42f9-9102-09a1136f2fae';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);

  const response = await fetch(
    "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    }
  );
  const data = await response.json();
  return data.access_token;
}

// 解析航班編號：BR001 -> { airlineId: "BR", flightNumber: "001" }
function parseFlightNo(raw: string) {
  const cleaned = raw.trim().toUpperCase();
  const match = cleaned.match(/^([A-Z0-9]{2})(\d+)$/);
  if (!match) return null;
  return { airlineId: match[1], flightNumber: match[2] };
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    // ── 取得航班編號（支援 GET 和 POST）──
    let flightNo = '';

    if (req.method === "GET") {
      const url = new URL(req.url);
      flightNo = url.searchParams.get("flight") || '';
    } else {
      const body = await req.json();
      flightNo = body.flightNo || body.flight || '';
    }

    if (!flightNo) {
      return new Response(
        JSON.stringify({ found: false, error: "缺少 flight 參數" }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const parsed = parseFlightNo(flightNo);
    if (!parsed) {
      return new Response(
        JSON.stringify({ found: false, error: "航班格式錯誤，請輸入如 BR001" }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // ── 取得 TDX Token ──
    const token = await getAccessToken();
    if (!token) {
      return new Response(
        JSON.stringify({ found: false, error: "TDX 認證失敗" }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // ── 查詢 4 個端點（桃園出發/抵達 + 松山出發/抵達）──
    const { airlineId, flightNumber } = parsed;
    const filter = `FlightNumber eq '${flightNumber}' and AirlineID eq '${airlineId}'`;

    const targets = [
      { airport: 'TPE', mode: 'Departure' },
      { airport: 'TPE', mode: 'Arrival' },
      { airport: 'TSA', mode: 'Departure' },
      { airport: 'TSA', mode: 'Arrival' },
    ];

    const allResults: any[] = [];

    for (const target of targets) {
      try {
        const url = `https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/${target.mode}/${target.airport}?$filter=${encodeURIComponent(filter)}&$format=JSON`;
        const res = await fetch(url, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          allResults.push(
            ...data.map((item: any) => ({
              ...item,
              _mode: target.mode,
              _airport: target.airport,
            }))
          );
        }
      } catch {
        // 單一端點失敗不影響其他查詢
      }
    }

    if (allResults.length === 0) {
      return new Response(
        JSON.stringify({ found: false, error: "查無此航班（僅支援當日航班）" }),
        { headers: CORS_HEADERS }
      );
    }

    // ── 組合最佳結果 ──
    const depResult = allResults.find((r) => r._mode === 'Departure');
    const arrResult = allResults.find((r) => r._mode === 'Arrival');
    const best = depResult || arrResult;

    const response = {
      found: true,
      FlightNumber: `${best.AirlineID}${best.FlightNumber}`,
      AirlineID: best.AirlineID,
      DepartureAirportID: best.DepartureAirportID || '',
      ArrivalAirportID: best.ArrivalAirportID || '',
      ScheduleDepartureTime: depResult?.ScheduleDepartureTime || '',
      EstimatedDepartureTime: depResult?.EstimatedDepartureTime || '',
      ScheduleArrivalTime: arrResult?.ScheduleArrivalTime || '',
      EstimatedArrivalTime: arrResult?.EstimatedArrivalTime || '',
      Terminal: depResult?.Terminal || arrResult?.Terminal || '',
      Gate: depResult?.Gate || arrResult?.Gate || '',
      _mode: best._mode,
      _airport: best._airport,
      _totalResults: allResults.length,
    };

    return new Response(JSON.stringify(response), { headers: CORS_HEADERS });

  } catch (err) {
    return new Response(
      JSON.stringify({ found: false, error: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
});
