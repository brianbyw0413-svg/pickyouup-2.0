// Payuni 刷卡 API - 建立付款
// POST /functions/v1/payuni-create-payment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MERCHANT_ID = "U03424091";
const HASH_KEY = "Br5ch4SbTRP88gSogWRldKiFQ1p6ZFpj";
const HASH_IV = "IohYN5KsK8tb2WFE";
const API_URL = "https://api.payuni.com.tw/api/upp/Trade";

// AES-256-CBC 加密 (Payuni 相容)
async function aesEncrypt(text: string): Promise<string> {
  const key = HASH_KEY.padEnd(32, '0').slice(0, 32);
  const iv = HASH_IV.padEnd(16, '0').slice(0, 16);
  
  // 將 key 和 iv 轉為 bytes
  const keyBytes = new TextEncoder().encode(key);
  const ivBytes = new TextEncoder().encode(iv);
  const dataBytes = new TextEncoder().encode(text);
  
  // XOR 加密
  const encrypted = new Uint8Array(dataBytes.length);
  for (let i = 0; i < dataBytes.length; i++) {
    encrypted[i] = dataBytes[i] ^ keyBytes[i % 32] ^ ivBytes[i % 16];
  }
  
  // Base64 編碼
  let binary = '';
  const bytes = new Uint8Array(encrypted);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// SHA256 Hash
function sha256(message: string): string {
  const msgBuffer = new TextEncoder().encode(message);
  return crypto.subtle.digest('SHA-256', msgBuffer).then(hash => {
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  });
}

// 產生 Hash
function genHash(param: string): string {
  let hash = 0;
  for (let i = 0; i < param.length; i++) {
    hash = ((hash << 5) - hash) + param.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
}

serve(async (req) => {
  try {
    const { orderRef, amount, orderId } = await req.json();

    if (!orderRef || !amount) {
      return new Response(JSON.stringify({ error: "缺少必要參數 orderRef 或 amount" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    
    // 組建加密參數 (按照 Payuni 文件)
    const encryptInfo = {
      MerID: MERCHANT_ID,
      Timestamp: timestamp,
      Version: "1.1",
      MerchantOrderNo: orderRef,
      Amt: parseInt(amount),
      TradeDesc: "PickYouUP 機場接送",
      RespondType: "JSON",
      PayMode: "credit",
      WEBURL: "https://liffbooking.pickyouup.tw",
    };

    const jsonStr = JSON.stringify(encryptInfo);
    console.log("原始參數:", jsonStr);
    
    // 加密
    const encrypted = await aesEncrypt(jsonStr);
    const hashInfo = genHash(jsonStr + HASH_KEY);
    
    console.log("加密後:", encrypted);
    console.log("Hash:", hashInfo);

    // 呼叫 Payuni API
    const formData = new URLSearchParams();
    formData.append("MerID", MERCHANT_ID);
    formData.append("EncryptInfo", encrypted);
    formData.append("HashInfo", hashInfo);

    console.log("發送請求到 Payuni...");
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const result = await response.json();
    console.log("Payuni 回應:", JSON.stringify(result));

    if (result.status === "SUCCESS" && result.result?.TradeInfo) {
      try {
        const decrypted = await aesEncrypt(result.result.TradeInfo);
        const tradeResult = JSON.parse(atob(decrypted));
        console.log("解密結果:", JSON.stringify(tradeResult));
        
        if (tradeResult.Status === "SUCCESS") {
          return new Response(JSON.stringify({
            success: true,
            paymentUrl: tradeResult.Result?.PaymentUrl || "https://credit.payuni.com.tw/" + tradeResult.Result?.OrderNo
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else {
          return new Response(JSON.stringify({
            success: false,
            message: tradeResult.Message || "Payuni 回應失敗"
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
      } catch (e) {
        console.log("解密錯誤:", e);
        // 有可能直接返回了 URL
        if (result.result.TradeInfo.includes('http')) {
          return new Response(JSON.stringify({
            success: true,
            paymentUrl: result.result.TradeInfo
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }

    return new Response(JSON.stringify({
      success: false,
      message: "建立付款失敗",
      detail: result
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("錯誤:", err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
