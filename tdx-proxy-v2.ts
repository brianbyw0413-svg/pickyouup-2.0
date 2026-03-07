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
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: params }
  );
  const data = await response.json();
  return data.access_token;
}

// 解析航班編號
function parseFlightNo(raw: string) {
  const cleaned = raw.trim().toUpperCase();
  const match = cleaned.match(/^([A-Z0-9]{2})(\d+)$/);
  if (!match) return null;
  return { airlineId: match[1], flightNumber: match[2] };
}

// 取得星期幾（用於比對時刻表）
const DAY_KEYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function getDayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00+08:00');
  return DAY_KEYS[d.getDay()];
}

// ══════════════════════════════════════
// 策略一：查 FIDS（當日即時航班）
// ══════════════════════════════════════
async function queryFIDS(airlineId: string, flightNumber: string, token: string) {
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
      const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allResults.push(...data.map((item: any) => ({ ...item, _mode: target.mode, _airport: target.airport })));
      }
    } catch { /* skip */ }
  }
  return allResults;
}

// ══════════════════════════════════════
// 策略二：查 GeneralSchedule（未來航班時刻表）
// ══════════════════════════════════════
async function querySchedule(airlineId: string, flightNumber: string, token: string, dateStr: string) {
  const filter = `AirlineID eq '${airlineId}' and FlightNumber eq '${flightNumber}'`;
  const endpoints = [
    'https://tdx.transportdata.tw/api/basic/v2/Air/GeneralSchedule/International',
    'https://tdx.transportdata.tw/api/basic/v2/Air/GeneralSchedule/Domestic',
  ];

  const allResults: any[] = [];
  for (const base of endpoints) {
    try {
      const url = `${base}?$filter=${encodeURIComponent(filter)}&$format=JSON`;
      const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // 如果有日期，過濾該日有飛的航班
        if (dateStr) {
          const dayKey = getDayOfWeek(dateStr);
          const filtered = data.filter((item: any) => {
            if (!item.ServiceDay) return true;
            return item.ServiceDay[dayKey] === 1;
          });
          if (filtered.length > 0) allResults.push(...filtered);
          else allResults.push(...data); // 沒有 ServiceDay 資料就全部回傳
        } else {
          allResults.push(...data);
        }
      }
    } catch { /* skip */ }
  }
  return allResults;
}

// ══════════════════════════════════════
// 組合結果
// ══════════════════════════════════════
function buildResponse(results: any[], source: string) {
  if (results.length === 0) return null;

  if (source === 'FIDS') {
    const depResult = results.find((r) => r._mode === 'Departure');
    const arrResult = results.find((r) => r._mode === 'Arrival');
    const best = depResult || arrResult;
    return {
      found: true,
      source: 'FIDS',
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
    };
  }

  // GeneralSchedule 格式
  const best = results[0];
  return {
    found: true,
    source: 'Schedule',
    FlightNumber: `${best.AirlineID}${best.FlightNumber}`,
    AirlineID: best.AirlineID,
    DepartureAirportID: best.DepartureAirportID || '',
    ArrivalAirportID: best.ArrivalAirportID || '',
    ScheduleDepartureTime: best.ScheduleDepartureTime || '',
    ScheduleArrivalTime: best.ScheduleArrivalTime || '',
    EstimatedDepartureTime: '',
    EstimatedArrivalTime: '',
    Terminal: best.Terminal || best.DepartureTerminal || '',
    Gate: '',
    ServiceDay: best.ServiceDay || null,
  };
}

// ══════════════════════════════════════
// 主程式
// ══════════════════════════════════════
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    // ── 取得參數（支援 GET + POST）──
    let flightNo = '';
    let dateStr = '';

    if (req.method === "GET") {
      const url = new URL(req.url);
      flightNo = url.searchParams.get("flight") || '';
      dateStr = url.searchParams.get("date") || '';
    } else {
      const body = await req.json();
      flightNo = body.flightNo || body.flight || '';
      dateStr = body.date || '';
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

    const token = await getAccessToken();
    if (!token) {
      return new Response(
        JSON.stringify({ found: false, error: "TDX 認證失敗" }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const { airlineId, flightNumber } = parsed;

    // ── 策略一：先查 FIDS（當日即時）──
    const fidsResults = await queryFIDS(airlineId, flightNumber, token);
    const fidsResponse = buildResponse(fidsResults, 'FIDS');
    if (fidsResponse) {
      return new Response(JSON.stringify(fidsResponse), { headers: CORS_HEADERS });
    }

    // ── 策略二：查 GeneralSchedule（未來航班）──
    const schedResults = await querySchedule(airlineId, flightNumber, token, dateStr);
    const schedResponse = buildResponse(schedResults, 'Schedule');
    if (schedResponse) {
      return new Response(JSON.stringify(schedResponse), { headers: CORS_HEADERS });
    }

    // ── 都查不到 ──
    return new Response(
      JSON.stringify({ found: false, error: "查無此航班" }),
      { headers: CORS_HEADERS }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ found: false, error: err.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
});
