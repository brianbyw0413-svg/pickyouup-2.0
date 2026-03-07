import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// --- 老皮幫老闆鎖死的最強推播引擎代碼 ---

const LINE_ACCESS_TOKEN = "q7bissEGoDlGovi4Z5h2tPPNr2UuiT3PTgVEi7/EtL3aFS9RrUKT00TYDjAqRrgBBN4IDlAXTDL/V9nQtTLxSaAmZUhYxlHc3gS0FJkk0cKj/U2KLAxqg+srSmnJEOLVxW6s79bjC2hWQR2UFzDrgQdB04t89/1O/w1cDnyilFU=";
const BOSS_LINE_ID = "U835ec891ba538bd68895ccac3b66ce5e";

const SERVICE_MODE_MAP = {
  dropoff: "送機 ✈️",
  pickup: "接機 🛬",
};

const CAR_TYPE_MAP = {
  small: "小車 (5人座)",
  large: "大車 (9人座)",
};

serve(async (req) => {
  try {
    const payload = await req.json();
    console.log("✅ Webhook 觸發成功！");

    const order = payload.record;
    if (!order) {
      console.error("❌ 找不到訂單紀錄");
      return new Response("No record found", { status: 400 });
    }

    const serviceLabel = SERVICE_MODE_MAP[order.service_mode] || order.service_mode || "未知";
    const carLabel = CAR_TYPE_MAP[order.car_type] || order.car_type || "未知";
    const isPickup = order.service_mode === "pickup";

    const lines = [
      `🚨 【新訂單通知】汪！🐶`,
      ``,
      `📋 訂單編號：${order.order_ref || "—"}`,
      `🔖 服務類型：${serviceLabel}`,
      `📅 日期：${order.service_date || "未提供"}`,
      `✈️ 航班：${order.flight_number || "未提供"}`,
      ``,
      `👤 聯絡人：${order.contact_name || "未提供"}`,
      `📞 電話：${order.contact_phone || "未提供"}`,
      ``,
      `🚗 車型：${carLabel}`,
      isPickup
        ? `📍 下車地址：${order.dropoff_address || "未提供"}`
        : `📍 上車地址：${order.pickup_address || "未提供"}`,
      !isPickup ? `🕙 上車時間：${order.pickup_time || "未提供"}` : null,
      ``,
      `💰 金額：NT$ ${order.amount || 0}`,
      order.total_amount && order.total_amount !== order.amount
        ? `💰 訂單總額：NT$ ${order.total_amount}`
        : null,
      `💳 付款狀態：${order.status === "pending" ? "待付款" : order.status}`,
      ``,
      `老皮已同步雲端，請老闆確認。✨`,
    ];

    const message = lines.filter(Boolean).join("\n");

    // 呼叫 LINE Messaging API
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: BOSS_LINE_ID,
        messages: [{ type: "text", text: message }],
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("❌ LINE API 發送失敗:", result);
      return new Response(JSON.stringify(result), { status: response.status });
    }

    console.log("🎉 通知已成功發送至老闆手機！");
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("⚠️ 系統錯誤:", err.message);
    return new Response(err.message, { status: 500 });
  }
});
