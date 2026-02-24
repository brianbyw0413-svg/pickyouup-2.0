import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
'https://vtvytcrkoqbluvczyepm.supabase.co',
'sb_publishable_SOp1vthQKdTdQUwoHsMIQA_FCTxzbie'
);

// --- 內建圖案 ---
const IconTruck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;

const Layout = ({ children }) => (
<div className="min-h-screen bg-[#0a0a0c] text-white p-4 flex flex-col items-center overflow-x-hidden relative font-sans">
<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
<div className="w-full max-w-[480px] relative z-10">{children}</div>
</div>
);

export default function App() {
const [page, setPage] = useState('home');
const [carType, setCarType] = useState('');
const [mode, setMode] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [form, setForm] = useState({ name: '', phone: '', address: '', date: '', time: '', flight: '' });
const [flightInfoText, setFlightInfoText] = useState('');

const pricing = {
'small-dropoff': 1200, 'large-dropoff': 1500,
'small-pickup': 1300, 'large-pickup': 1600,
'small-both': 2500, 'large-both': 3100
};

const isNightTime = (t) => {
if (!t) return false;
const h = parseInt(t.split(':')[0]);
return h >= 23 || h < 6;
};

const currentPrice = (pricing[`${carType}-${mode}`] || 0) + (isNightTime(form.time) ? 100 : 0);

// --- 關鍵：模擬呼叫 TDX API 並自動推算時間 ---
const handleFlightLookup = async (flightNo) => {
if (!flightNo || mode === 'pickup') return; // 接機暫由客人輸入落地時間

// 這裡未來會透過 Supabase Edge Function 呼叫老皮的 tdx_flight.py
console.log("正在查詢航班:", flightNo);

// 模擬 TDX 回傳資訊 (以 IT200 為例)
if (flightNo.toUpperCase().includes('IT200')) {
const schTime = "06:35";
setFlightDetail(`起飛時間：${schTime}`);

// 自動推算 3 小時前：06:35 -> 03:35
const [h, m] = schTime.split(':').map(Number);
const suggestedH = (h - 3 + 24) % 24;
const formattedTime = `${suggestedH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

setForm(prev => ({...prev, time: formattedTime}));
alert(`汪！🐶 偵測到航班起飛時間為 ${schTime}，已為您自動建議提早3小時上車：${formattedTime}`);
}
};

const handleBooking = async () => {
const { error } = await supabase.from('orders').insert([{
mode, car_type: carType, name: form.name, phone: form.phone,
address: form.address, date: form.date, time: form.time,
flight: form.flight, amount: currentPrice, status: 'pending'
}]);
if (!error) {
// 成功後自動產生成明細文字並跳轉 LINE
const summary = `【PickYouUP 預約明細】\n01_聯絡人：${form.name}\n02_電話：${form.phone}\n03_航班：${form.flight}\n04_服務：${mode==='pickup'?'接機':'送機'}(${carType==='small'?'5人座':'9人座'})\n05_日期：${form.date}\n06_時間：${form.time}\n07_地址：${form.address}\n💰 報價：$${currentPrice} 元\n\n(已在雲端同步。汪！🐶)`;
const lineUrl = `https://line.me/R/oaMessage/@085qitid/?${encodeURIComponent(summary)}`;
window.location.href = lineUrl;
}
};

// --- 頁面渲染邏輯 (簡化呈現) ---
if (page === 'home') {
return (
<Layout>
<nav className="w-full py-6 mb-12 flex justify-center border-b border-white/5">
<h1 className="text-xl font-black italic text-yellow-500 uppercase">PickYouUP.tw</h1>
</nav>
<div className="w-full space-y-6 text-center animate-in fade-in duration-1000">
<h2 className="text-[11vw] md:text-6xl font-black italic mb-16 tracking-tighter uppercase italic">快速預約<br/><span className="text-yellow-500">專業接送</span></h2>
<button onClick={() => { setMode('dropoff'); setPage('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 py-10 rounded-[40px] font-black text-2xl hover:bg-yellow-500 hover:text-black transition-all shadow-xl">我要送機</button>
<button onClick={() => { setMode('pickup'); setPage('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 py-10 rounded-[40px] font-black text-2xl hover:bg-yellow-500 hover:text-black transition-all shadow-xl">我要接機</button>
<button onClick={() => { setMode('both'); setPage('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 py-10 rounded-[40px] font-black text-2xl hover:bg-yellow-500 hover:text-black transition-all shadow-xl">接送一併預訂</button>
</div>
</Layout>
);
}

if (page === 'choice') {
return (
<Layout>
<h2 className="mt-6 mb-10 text-4xl font-black italic text-yellow-500 text-center uppercase">{mode==='pickup'?'接機服務':mode==='dropoff'?'送機服務':'來回接送'}</h2>
<div className="space-y-4 px-2">
<button onClick={() => { setCarType('small'); setPage('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black group transition-all shadow-xl">
<p className="text-2xl font-black mb-1 group-hover:text-black">小車直達 (5人座)</p>
<p className="text-white text-xs font-bold group-hover:text-black/70 uppercase">乘客1-4人/行李1-3件/直達無加點</p>
</button>
<button onClick={() => { setCarType('large'); setPage('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black group transition-all shadow-xl">
<p className="text-2xl font-black mb-1 group-hover:text-black">大車直達 (9人座)</p>
<p className="text-white text-xs font-bold group-hover:text-black/70 uppercase">乘客1-8人/行李1-8件/直達無加點</p>
</button>
<button onClick={() => setPage('home')} className="w-full text-white hover:text-black hover:bg-yellow-500 font-black py-10 rounded-[40px] text-xl uppercase transition-all mt-4 italic">返回首頁</button>
</div>
</Layout>
);
}

if (page === 'form') {
return (
<Layout>
<div className="mt-4 space-y-6 pb-24">
<div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-8">
<h2 className="text-3xl font-black italic text-yellow-500 text-center uppercase italic underline underline-offset-8 decoration-zinc-800">預約詳情</h2>
<div className="space-y-6">
<div className="space-y-2"><p className="text-sm font-bold text-white ml-5">聯絡人</p><input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} type="text" placeholder="姓名" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" /></div>
<div className="space-y-2"><p className="text-sm font-bold text-white ml-5">電話</p><input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} type="text" placeholder="聯絡電話" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" /></div>
<div className="space-y-2">
<p className="text-sm font-bold text-white ml-5">航班編號</p>
<input onBlur={handleFlightBlur} value={form.flight} onChange={(e)=>setForm({...form, flight:e.target.value})} type="text" placeholder="例如: JX58" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
{flightInfoText && <p className="text-[10px] text-yellow-500 ml-5 font-black animate-pulse">✨ {flightInfoText}</p>}
</div>
<div className="space-y-2">
<div className="flex justify-between items-center ml-5 mr-5"><p className="text-sm font-bold text-white uppercase">上車時間</p>{isNightTime(form.time) && <span className="text-[10px] text-red-500 font-black animate-pulse uppercase">此為加價時段喔！</span>}</div>
<input value={form.time} onChange={(e)=>setForm({...form, time:e.target.value})} type="time" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
</div>
<div className="space-y-2"><p className="text-sm font-bold text-white ml-5 uppercase">上車地址</p><input value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} type="text" placeholder="地址" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" /></div>
</div>
<div className="mt-8 pt-8 border-t border-zinc-800 text-center">
<p className="text-white text-xs font-black uppercase mb-1">估算報價</p>
<p className="text-4xl font-black italic text-yellow-500 mb-8">${currentPrice}</p>
<button onClick={handleBooking} className="w-full bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 active:scale-95 shadow-xl shadow-yellow-500/20 italic uppercase">確認預約並回報老皮</button>
</div>
</div>
</div>
</Layout>
);
}

return null;
}
