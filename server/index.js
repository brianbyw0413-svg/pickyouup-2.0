/**
 * PickYouUP 2.0 後端伺服器
 * 包含: API routes, LINE Webhook, 管理後台
 */

import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3000;

// ============ 環境變數 ============
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vtvytcrkoqbluvczyepm.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dnl0Y3Jrb3FibHV2Y3p5ZXBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.RoL6s3lqhmhXDgDKrHYEUKdCJLXDxqHvyCIVH5x0c3g';
const PAYUNI_MERCHANT_NO = process.env.VITE_PAYUNI_MERCHANT_NO || 'U03424091';
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || '';
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN || '';
const LINE_USER_ID = process.env.LINE_USER_ID || '';

// 初始化 Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============ 中間件 ============
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 驗證 LINE 簽章
function validateLineSignature(body, signature) {
  if (!LINE_CHANNEL_SECRET || !signature) return true;
  const hash = crypto
    .createHmac('sha256', LINE_CHANNEL_SECRET)
    .update(JSON.stringify(body))
    .digest('base64');
  return hash === signature;
}

// 解析 LINE 派單格式
function parseDispatchMessage(text) {
  const patterns = {
    name: /姓名[：:]([^\s]+)/,
    phone: /電話[：:](0\d{9})/,
    address: /地址[：:](.+?)(?=\s+時間|$)/,
    date: /時間[：:](\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
    time: /時間[：:]\d{4[\/\-]\d{1,2[\/\-]\d{1,2}\s+(\d{1,2}:\d{2})/,
    flight: /航班[：:]([A-Z]{2}\d{3,4})/i,
  };

  const result = {
    name: patterns.name.exec(text)?.[1] || '',
    phone: patterns.phone.exec(text)?.[1] || '',
    address: patterns.address.exec(text)?.[1]?.trim() || '',
    date: patterns.date.exec(text)?.[1] || '',
    time: patterns.time.exec(text)?.[1] || '',
    flight: patterns.flight.exec(text)?.[1]?.toUpperCase() || '',
  };

  if (!result.name || !result.phone || !result.address || !result.date) {
    return null;
  }
  return result;
}

// 生成 LINE Flex 訊息
function generateTripCard(order) {
  const statusText = order.status === 'assigned' ? '已派單' : '待派單';
  const statusColor = order.status === 'assigned' ? '#22C55E' : '#FACC15';
  return {
    type: 'bubble',
    header: {
      type: 'box', layout: 'vertical',
      contents: [
        { type: 'text', text: '🚗 PickYouUP 行程資訊', weight: 'bold', size: 'lg', color: '#ffffff' },
        { type: 'text', text: statusText, size: 'sm', color: statusColor, align: 'end' }
      ],
      backgroundColor: '#1a1a1a', paddingAll: '15px'
    },
    body: {
      type: 'box', layout: 'vertical', spacing: 'md',
      contents: [
        { type: 'box', layout: 'horizontal', contents: [{ type: 'text', text: '👤 乘客', weight: 'bold', color: '#888888', flex: 2 }, { type: 'text', text: order.name, color: '#ffffff', flex: 3 }] },
        { type: 'box', layout: 'horizontal', contents: [{ type: 'text', text: '📱 電話', weight: 'bold', color: '#888888', flex: 2 }, { type: 'text', text: order.phone, color: '#ffffff', flex: 3 }] },
        { type: 'box', layout: 'horizontal', contents: [{ type: 'text', text: '📍 地址', weight: 'bold', color: '#888888', flex: 2 }, { type: 'text', text: order.address || '未填寫', color: '#ffffff', flex: 3, wrap: true }] },
        { type: 'box', layout: 'horizontal', contents: [{ type: 'text', text: '✈️ 航班', weight: 'bold', color: '#888888', flex: 2 }, { type: 'text', text: order.flight || '未填寫', color: '#ffffff', flex: 3 }] },
        { type: 'separator', margin: 'md', color: '#333333' },
        { type: 'box', layout: 'horizontal', contents: [{ type: 'text', text: '📅 日期', weight: 'bold', color: '#888888', flex: 2 }, { type: 'text', text: order.date, color: '#ffffff', flex: 3 }] },
        { type: 'box', layout: 'horizontal', contents: [{ type: 'text', text: '🕐 時間', weight: 'bold', color: '#888888', flex: 2 }, { type: 'text', text: order.time || '未填寫', color: '#ffffff', flex: 3 }] },
        { type: 'box', layout: 'horizontal', contents: [{ type: 'text', text: '🚙 車型', weight: 'bold', color: '#888888', flex: 2 }, { type: 'text', text: order.car_type === 'large' ? '9人座' : '5人座', color: '#ffffff', flex: 3 }] },
        { type: 'box', layout: 'horizontal', contents: [{ type: 'text', text: '💰 金額', weight: 'bold', color: '#888888', flex: 2 }, { type: 'text', text: 'TWD ' + order.amount, weight: 'bold', color: '#FACC15', flex: 3 }] }
      ]
    },
    styles: { body: { backgroundColor: '#0a0a0a' } }
  };
}

// 發送 LINE 訊息
async function sendLineMessage(userId, messages) {
  if (!LINE_ACCESS_TOKEN) return { success: false };
  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN },
      body: JSON.stringify({ to: userId, messages: Array.isArray(messages) ? messages : [messages] })
    });
    return { success: response.ok };
  } catch (e) { return { success: false, error: e.message }; }
}

// ============ API Routes ============

// 取得訂單列表
app.get('/api/orders', async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(parseInt(String(limit)));
    if (status) query = query.eq('status', String(status));
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) { res.status(500).json({ success: false, error: String(error) }); }
});

// 建立訂單
app.post('/api/orders', async (req, res) => {
  try {
    const { name, phone, address, date, time, flight, mode, car_type, amount } = req.body;
    if (!name || !phone || !address || !date || !car_type) {
      return res.status(400).json({ success: false, error: '缺少必填欄位' });
    }
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, error: '電話格式錯誤，請輸入 09 開頭的 10 位數字' });
    }
    const orderDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (orderDate < today) {
      return res.status(400).json({ success: false, error: '日期不能是過去日期' });
    }
    const { data, error } = await supabase.from('orders').insert([{ name, phone, address, date, time, flight, mode, car_type, amount: amount || 0, status: 'pending', payment_status: 'unpaid' }]).select();
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (error) { res.status(500).json({ success: false, error: String(error) }); }
});

// 更新訂單（派單）
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, driver_id, driver_name, driver_phone } = req.body;
    const updateData: any = {};
    if (status) updateData.status = status;
    if (driver_id) updateData.driver_id = driver_id;
    if (driver_name) updateData.driver_name = driver_name;
    if (driver_phone) updateData.driver_phone = driver_phone;
    updateData.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from('orders').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    if (driver_name && LINE_USER_ID) {
      const flexMessage = generateTripCard({ ...data, status: 'assigned' });
      await sendLineMessage(LINE_USER_ID, { type: 'flex', altText: '行程已派單', contents: flexMessage });
    }
    res.json({ success: true, data });
  } catch (error) { res.status(500).json({ success: false, error: String(error) }); }
});

// 刪除訂單
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('orders').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, error: String(error) }); }
});

// 司機 API
app.get('/api/drivers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('drivers').select('*').eq('is_active', true).order('name');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) { res.status(500).json({ success: false, error: String(error) }); }
});

app.post('/api/drivers', async (req, res) => {
  try {
    const { name, phone, car_type, license_plate } = req.body;
    if (!name || !phone) return res.status(400).json({ success: false, error: '姓名和電話為必填' });
    const { data, error } = await supabase.from('drivers').insert([{ name, phone, car_type, license_plate, is_active: true }]).select();
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (error) { res.status(500).json({ success: false, error: String(error) }); }
});

// LINE Webhook
app.post('/api/webhook/line', async (req, res) => {
  try {
    const signature = req.headers['x-line-signature'];
    if (!validateLineSignature(req.body, signature)) return res.status(401).json({ success: false });
    const events = req.body.events || [];
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text;
        const userId = event.source.userId;
        const orderData = parseDispatchMessage(text);
        if (orderData) {
          const { data } = await supabase.from('orders').insert([{ name: orderData.name, phone: orderData.phone, address: orderData.address, date: orderData.date, time: orderData.time, flight: orderData.flight, car_type: 'small', amount: 1200, status: 'pending', source: 'line' }]).select();
          if (data) {
            await sendLineMessage(userId, { type: 'flex', altText: '訂單已建立', contents: generateTripCard(data[0]) });
          }
        } else if (text.includes('查詢') || text.includes('訂單')) {
          const { data: orders } = await supabase.from('orders').select('*').eq('phone', text.replace(/[^0-9]/g, '')).order('created_at', { ascending: false }).limit(5);
          if (orders?.length) {
            const list = orders.map(o => '📋 ' + o.date + ' ' + (o.time || '') + ' - TWD ' + o.amount + ' (' + o.status + ')').join('\n');
            await sendLineMessage(userId, { type: 'text', text: '您的訂單：\n' + list });
          }
        }
      }
    }
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, error: String(error) }); }
});

// 管理後台
app.get('/admin', (req, res) => {
  res.send(generateAdminHTML());
});

function generateAdminHTML() {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PickYouUP 管理後台</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet">
  <style>*{font-family:'Noto Sans TC',sans-serif}.bg-dark{background:#0a0a0c}.card{background:#18181b;border:1px solid #27272a}</style>
</head>
<body class="bg-dark text-white min-h-screen">
<div class="max-w-7xl mx-auto p-6">
<div class="flex justify-between items-center mb-8">
<h1 class="text-3xl font-black text-yellow-500">PickYouUP 管理後台</h1>
<div class="flex gap-4">
<button onclick="refreshData()" class="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700">🔄 重新整理</button>
<button onclick="showAddDriverModal()" class="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400">➕ 新增司機</button>
</div>
</div>
<div class="grid grid-cols-4 gap-4 mb-8">
<div class="card p-6 rounded-2xl"><div class="text-zinc-400 text-sm font-bold">待派單</div><div class="text-3xl font-black text-yellow-500" id="pending-count">0</div></div>
<div class="card p-6 rounded-2xl"><div class="text-zinc-400 text-sm font-bold">已派單</div><div class="text-3xl font-black text-green-500" id="assigned-count">0</div></div>
<div class="card p-6 rounded-2xl"><div class="text-zinc-400 text-sm font-bold">已完成</div><div class="text-3xl font-black text-blue-500" id="completed-count">0</div></div>
<div class="card p-6 rounded-2xl"><div class="text-zinc-400 text-sm font-bold">司機人數</div><div class="text-3xl font-black text-purple-500" id="driver-count">0</div></div>
</div>
<div class="flex gap-4 mb-6">
<button onclick="switchTab('orders')" class="tab-btn px-6 py-3 rounded-xl font-bold bg-yellow-500 text-black" data-tab="orders">📋 訂單管理</button>
<button onclick="switchTab('drivers')" class="tab-btn px-6 py-3 rounded-xl font-bold bg-zinc-800" data-tab="drivers">🚗 司機列表</button>
</div>
<div id="orders-panel" class="card rounded-2xl overflow-hidden">
<div class="p-4 border-b border-zinc-800 flex justify-between items-center">
<h2 class="text-xl font-bold">訂單列表</h2>
<select id="status-filter" onchange="loadOrders()" class="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
<option value="">全部狀態</option><option value="pending">待派單</option><option value="assigned">已派單</option><option value="completed">已完成</option><option value="cancelled">已取消</option>
</select>
</div>
<div class="overflow-x-auto">
<table class="w-full">
<thead class="bg-zinc-900"><tr><th class="p-4 text-left text-zinc-400 font-bold">日期</th><th class="p-4 text-left text-zinc-400 font-bold">姓名</th><th class="p-4 text-left text-zinc-400 font-bold">電話</th><th class="p-4 text-left text-zinc-400 font-bold">地址</th><th class="p-4 text-left text-zinc-400 font-bold">航班</th><th class="p-4 text-left text-zinc-400 font-bold">車型</th><th class="p-4 text-left text-zinc-400 font-bold">金額</th><th class="p-4 text-left text-zinc-400 font-bold">狀態</th><th class="p-4 text-left text-zinc-400 font-bold">司機</th><th class="p-4 text-left text-zinc-400 font-bold">操作</th></tr></thead>
<tbody id="orders-table" class="divide-y divide-zinc-800"><tr><td colspan="10" class="p-8 text-center text-zinc-500">載入中...</td></tr></tbody>
</table>
</div>
</div>
<div id="drivers-panel" class="card rounded-2xl overflow-hidden hidden">
<div class="p-4 border-b border-zinc-800"><h2 class="text-xl font-bold">司機列表</h2></div>
<div class="overflow-x-auto">
<table class="w-full">
<thead class="bg-zinc-900"><tr><th class="p-4 text-left text-zinc-400 font-bold">姓名</th><th class="p-4 text-left text-zinc-400 font-bold">電話</th><th class="p-4 text-left text-zinc-400 font-bold">車型</th><th class="p-4 text-left text-zinc-400 font-bold">車牌</th><th class="p-4 text-left text-zinc-400 font-bold">狀態</th><th class="p-4 text-left text-zinc-400 font-bold">操作</th></tr></thead>
<tbody id="drivers-table" class="divide-y divide-zinc-800"><tr><td colspan="6" class="p-8 text-center text-zinc-500">載入中...</td></tr></tbody>
</table>
</div>
</div>
</div>
<div id="assign-modal" class="fixed inset-0 bg-black/80 hidden items-center justify-center z-50">
<div class="bg-zinc-900 p-8 rounded-3xl max-w-md w-full mx-4 border border-zinc-700">
<h3 class="text-xl font-bold mb-4">派單給司機</h3>
<input type="hidden" id="assign-order-id">
<div id="driver-select" class="space-y-2 mb-6 max-h-60 overflow-y-auto"></div>
<div class="flex gap-3">
<button onclick="closeAssignModal()" class="flex-1 py-3 bg-zinc-800 rounded-xl font-bold">取消</button>
<button onclick="confirmAssign()" class="flex-1 py-3 bg-yellow-500 text-black rounded-xl font-bold">確認派單</button>
</div>
</div>
</div>
<div id="driver-modal" class="fixed inset-0 bg-black/80 hidden items-center justify-center z-50">
<div class="bg-zinc-900 p-8 rounded-3xl max-w-md w-full mx-4 border border-zinc-700">
<h3 class="text-xl font-bold mb-4">新增司機</h3>
<div class="space-y-4">
<input id="new-driver-name" type="text" placeholder="姓名" class="w-full bg-black border border-zinc-700 rounded-xl p-3">
<input id="new-driver-phone" type="text" placeholder="電話" class="w-full bg-black border border-zinc-700 rounded-xl p-3">
<select id="new-driver-car" class="w-full bg-black border border-zinc-700 rounded-xl p-3"><option value="small">5人座</option><option value="large">9人座</option></select>
<input id="new-driver-plate" type="text" placeholder="車牌號碼" class="w-full bg-black border border-zinc-700 rounded-xl p-3">
</div>
<div class="flex gap-3 mt-6">
<button onclick="closeDriverModal()" class="flex-1 py-3 bg-zinc-800 rounded-xl font-bold">取消</button>
<button onclick="addDriver()" class="flex-1 py-3 bg-yellow-500 text-black rounded-xl font-bold">新增</button>
</div>
</div>
</div>
<script>
const API = window.location.origin;
let drivers = [];
async function refreshData(){await loadOrders();await loadDrivers();}
async function loadOrders(){
const status=document.getElementById('status-filter').value;
let url=API+'/api/orders?limit=100';
if(status)url+='&status='+status;
try{
const res=await fetch(url);
const json=await res.json();
const orders=json.data||[];
document.getElementById('pending-count').textContent=orders.filter(o=>o.status==='pending').length;
document.getElementById('assigned-count').textContent=orders.filter(o=>o.status==='assigned').length;
document.getElementById('completed-count').textContent=orders.filter(o=>o.status==='completed').length;
const tbody=document.getElementById('orders-table');
if(orders.length==0){tbody.innerHTML='<tr><td colspan="10" class="p-8 text-center text-zinc-500">尚無訂單</td></tr>';return;}
const statusColors={pending:'bg-yellow-500/20 text-yellow-500',assigned:'bg-green-500/20 text-green-500',completed:'bg-blue-500/20 text-blue-500',cancelled:'bg-red-500/20 text-red-500'};
const statusTexts={pending:'待派單',assigned:'已派單',completed:'已完成',cancelled:'已取消'};
tbody.innerHTML=orders.map(o=>'<tr class="hover:bg-zinc-800/50"><td class="p-4">'+(o.date||'-')+' <span class="text-zinc-500">'+(o.time||'')+'</span></td><td class="p-4 font-bold">'+(o.name||'-')+'</td><td class="p-4">'+(o.phone||'-')+'</td><td class="p-4 max-w-xs truncate">'+(o.address||'-')+'</td><td class="p-4">'+(o.flight||'-')+'</td><td class="p-4">'+(o.car_type==='large'?'🚗 9人座':'🚙 5人座')+'</td><td class="p-4 font-bold text-yellow-500">'+(o.amount||0)+'</td><td class="p-4"><span class="px-3 py-1 rounded-full text-xs font-bold '+(statusColors[o.status]||'bg-zinc-500/20 text-zinc-500')+'">'+(statusTexts[o.status]||o.status)+'</span></td><td class="p-4">'+(o.driver_name||'-')+'</td><td class="p-4">'+(o.status==='pending'?'<button onclick="openAssignModal(\\''+o.id+'\\')" class="px-3 py-1 bg-yellow-500 text-black rounded-lg text-sm font-bold hover:bg-yellow-400">派單</button>':'')+'<button onclick="deleteOrder(\\''+o.id+'\\')" class="px-3 py-1 bg-red-500/20 text-red-500 rounded-lg text-sm font-bold ml-1">刪除</button></td></tr>').join('');
}catch(e){document.getElementById('orders-table').innerHTML='<tr><td colspan="10" class="p-8 text-center text-red-500">載入失敗</td></tr>';}
}
async function loadDrivers(){
try{
const res=await fetch(API+'/api/drivers');
const json=await res.json();
drivers=json.data||[];
document.getElementById('driver-count').textContent=drivers.length;
const tbody=document.getElementById('drivers-table');
if(drivers.length==0){tbody.innerHTML='<tr><td colspan="6" class="p-8 text-center text-zinc-500">尚無司機</td></tr>';return;}
tbody.innerHTML=>'<tr class=drivers.map(d="hover:bg-zinc-800/50"><td class="p-4 font-bold">'+d.name+'</td><td class="p-4">'+d.phone+'</td><td class="p-4">'+(d.car_type==='large'?'🚗 9人座':'🚙 5人座')+'</td><td class="p-4">'+(d.license_plate||'-')+'</td><td class="p-4"><span class="px-3 py-1 rounded-full text-xs font-bold '+(d.is_active?'bg-green-500/20 text-green-500':'bg-zinc-500/20 text-zinc-500')+'">'+(d.is_active?'可派單':'休息中')+'</span></td><td class="p-4"><button onclick="toggleDriver(\\''+d.id+'\\','+(!d.is_active)+')" class="px-3 py-1 bg-zinc-700 rounded-lg text-sm font-bold">'+(d.is_active?'停用':'啟用')+'</button></td></tr>').join('');
}catch(e){}
}
function switchTab(tab){
document.querySelectorAll('.tab-btn').forEach(btn=>{btn.classList.remove('bg-yellow-500','text-black');btn.classList.add('bg-zinc-800');});
document.querySelector('[data-tab="'+tab+'"]').classList.remove('bg-zinc-800');
document.querySelector('[data-tab="'+tab+'"]').classList.add('bg-yellow-500','text-black');
document.getElementById('orders-panel').classList.toggle('hidden',tab!=='orders');
document.getElementById('drivers-panel').classList.toggle('hidden',tab!=='drivers');
}
function openAssignModal(orderId){
document.getElementById('assign-order-id').value=orderId;
const container=document.getElementById('driver-select');
container.innerHTML=drivers.map(d=>'<label class="flex items-center p-3 bg-black rounded-lg cursor-pointer hover:bg-zinc-800"><input type="radio" name="driver" value="'+d.id+'" data-name="'+d.name+'" data-phone="'+d.phone+'" class="mr-3"><span class="font-bold">'+d.name+'</span><span class="text-zinc-400 ml-2">'+d.phone+'</span><span class="text-yellow-500 ml-auto">'+(d.car_type==='large'?'9人座':'5人座')+'</span></label>').join('');
if(drivers.length==0)container.innerHTML='<div class="text-center text-zinc-500 p-4">請先新增司機</div>';
document.getElementById('assign-modal').classList.remove('hidden');
document.getElementById('assign-modal').classList.add('flex');
}
function closeAssignModal(){document.getElementById('assign-modal').classList.add('hidden');document.getElementById('assign-modal').classList.remove('flex');}
async function confirmAssign(){
const orderId=document.getElementById('assign-order-id').value;
const selected=document.querySelector('input[name="driver"]:checked');
if(!selected)return alert('請選擇司機');
const driverId=selected.value;
const driverName=selected.dataset.name;
const driverPhone=selected.dataset.phone;
try{
await fetch(API+'/api/orders/'+orderId,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:'assigned',driver_id:driverId,driver_name:driverName,driver_phone:driverPhone})});
closeAssignModal();refreshData();alert('派單成功！');
}catch(e){alert('派單失敗');}
}
async function deleteOrder(id){if(!confirm('確定刪除此訂單？'))return;
try{await fetch(API+'/api/orders/'+id,{method:'DELETE'});refreshData();}catch(e){alert('刪除失敗');}
}
function showAddDriverModal(){document.getElementById('driver-modal').classList.remove('hidden');document.getElementById('driver-modal').classList.add('flex');}
function closeDriverModal(){document.getElementById('driver-modal').classList.add('hidden');document.getElementById('driver-modal').classList.remove('flex');}
async function addDriver(){
const name=document.getElementById('new-driver-name').value;
const phone=document.getElementById('new-driver-phone').value;
const car=document.getElementById('new-driver-car').value;
const plate=document.getElementById('new-driver-plate').value;
if(!name||!phone)return alert('請填寫姓名和電話');
try{await fetch(API+'/api/drivers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,phone,car_type:car,license_plate:plate})});
closeDriverModal();document.getElementById('new-driver-name').value='';document.getElementById('new-driver-phone').value='';document.getElementById('new-driver-plate').value='';refreshData();alert('司機新增成功！');}catch(e){alert('新增失敗');}
}
async function toggleDriver(id,active){
try{await fetch(API+'/api/drivers/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({is_active:active})});refreshData();}catch(e){}
}
refreshData();
<\/script>
</body>
</html>`;
}

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`PickYouUP 伺服器運行中: http://localhost:${PORT}`);
  console.log(`管理後台: http://localhost:${PORT}/admin`);
});
