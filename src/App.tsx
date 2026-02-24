import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- 1. 初始化管線 (移至最外層，性能最優) ---
const supabase = createClient(
'https://vtvytcrkoqbluvczyepm.supabase.co',
'sb_publishable_SOp1vthQKdTdQUwoHsMIQA_FCTxzbie'
);

// --- 2. 內建圖案 (移到外面，防止重複渲染) ---
const SvgTruck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const SvgAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const SvgCheck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

// --- 3. 佈局組件 (移到外面，解決輸入卡頓的關鍵！) ---
const Layout = ({ children }) => (
<div className="min-h-screen bg-[#0a0a0c] text-white p-4 flex flex-col items-center overflow-x-hidden relative">
<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
<div className="w-full max-w-[480px] relative z-10 font-sans">
{children}
</div>
</div>
);

export default function App() {
const [page, setPage] = useState('home');
const [carType, setCarType] = useState('');
const [mode, setMode] = useState('');
const [paidStep, setPaidStep] = useState('none');
const [isSubmitting, setIsSubmitting] = useState(false);

// 核心資料
const [form, setForm] = useState({
name: '', phone: '', address: '', date: '', time: '', flight: ''
});

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

// 判斷是否所有必填資料都填了
const isFormComplete = form.name && form.phone && form.address && form.date && form.flight && (mode === 'pickup' ? true : form.time);

const basePrice = isFormComplete ? (pricing[`${carType}-${mode}`] || 0) : 0;
const surcharge = isNightTime(form.time) && isFormComplete ? 100 : 0;
const total = basePrice + surcharge;

useEffect(() => {
const handlePopState = (event) => {
if (event.state && event.state.page) setPage(event.state.page);
else setPage('home');
};
window.addEventListener('popstate', handlePopState);
return () => window.removeEventListener('popstate', handlePopState);
}, []);

const navigateTo = (nextPage) => {
window.history.pushState({ page: nextPage }, '', '');
setPage(nextPage);
};

const handleBooking = async () => {
if (!isFormComplete) {
alert("請填寫完整的預約資料喔！汪！🐶");
return;
}
setIsSubmitting(true);
const { error } = await supabase.from('orders').insert([{
mode, car_type: carType, name: form.name, phone: form.phone,
address: form.address, date: form.date, time: form.time,
flight: form.flight, amount: total, status: 'pending'
}]);

if (!error) {
setPaidStep('choice');
} else {
alert("連線失敗汪！請確認 SQL 表單已建立。");
}
setIsSubmitting(false);
};

const copySummary = () => {
const summary = `【PickYouUP 預約明細】\n01_聯絡人：${form.name}\n02_電話：${form.phone}\n03_航班：${form.flight}\n04_服務：${mode==='pickup'?'接機':'送機'}(${carType==='small'?'5人座':'9人座'})\n05_日期：${form.date}\n06_時間：${form.time || '依航班落地'}\n07_地址：${form.address}\n💰 報價：$${total} 元\n\n(已同步至雲端。汪！🐶)`;
navigator.clipboard.writeText(summary);
alert("明細已複製！請至 LINE 傳送給老皮。");
window.location.href = "https://line.me/ti/p/~@085qitid";
};

// --- 首頁渲染 ---
if (page === 'home') {
return (
<Layout>
<nav className="w-full py-8 mb-12 flex justify-center border-b border-white/5">
<div className="flex flex-col items-center gap-1 text-yellow-500 font-black italic uppercase">
<div className="flex items-center gap-2"><SvgTruck /> <h1>PickYouUP.tw</h1></div>
<p className="text-[10px] text-zinc-400 tracking-widest not-italic">您接送機的好伙伴</p>
</div>
</nav>
<div className="text-center space-y-6 animate-in fade-in duration-1000 px-4 uppercase italic font-black">
<h2 className="text-[11vw] md:text-6xl mb-16 tracking-tighter">快速預約<br/><span className="text-yellow-500">專業接送</span></h2>
<div className="space-y-4 px-2 not-italic">
<button onClick={() => { setMode('dropoff'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all active:scale-95 shadow-xl">我要送機</button>
<button onClick={() => { setMode('pickup'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all active:scale-95 shadow-xl">我要接機</button>
<button onClick={() => { setMode('both'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all active:scale-95 shadow-xl">接送一併預訂</button>
</div>
</div>
</Layout>
);
}

// --- 分流頁渲染 ---
if (page === 'choice') {
return (
<Layout>
<h2 className="mt-6 mb-10 text-4xl font-black italic text-yellow-500 text-center uppercase tracking-widest">
{mode==='pickup'?'接機服務':mode==='dropoff'?'送機服務':'來回接送'}
</h2>
<div className="space-y-4 px-2 text-center">
<button onClick={() => { setCarType('small'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
<p className="text-2xl font-black mb-1 group-hover:text-black">小車直達 (5人座)</p>
<p className="text-white text-[11px] font-bold group-hover:text-black/70 uppercase">乘客1-4人/行李1-3件/直達無加點</p>
</button>
<button onClick={() => { setCarType('large'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
<p className="text-2xl font-black mb-1 group-hover:text-black">大車直達 (9人座)</p>
<p className="text-white text-[11px] font-bold group-hover:text-black/70 uppercase">乘客5-8人/行李1-8件/直達無加點</p>
</button>
<a href="https://line.me/ti/p/~@085qitid" className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left block hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
<p className="text-2xl font-black mb-1 group-hover:text-black italic">我真的不確定...</p>
<p className="text-white text-[11px] font-bold group-hover:text-black/70 uppercase">我有其他需求 / 加點上下車 / 舉牌 / 安全座椅等</p>
</a>
<div className="flex justify-center w-full py-10">
<button onClick={() => window.history.back()} className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black transition-all active:scale-95">回上一頁</button>
</div>
</div>
</Layout>
);
}

// --- 表單頁渲染 ---
if (page === 'form') {
return (
<Layout>
<div className="mt-4 space-y-6 pb-24 px-2 text-center">
<div className="px-8 py-8 bg-white/5 border border-white/10 rounded-[35px] text-center text-white text-lg font-bold leading-relaxed shadow-inner">
此選項對應 <span className="text-yellow-500">{carType==='small'?'乘客1-4人，行李1-3件':'乘客1-8人，行李1-8件'}</span>，<br/>不確定請回上頁點選「我真的不能確認」，讓客服人員來幫助您：）
</div>

<div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-10">
<h2 className="text-3xl font-black italic text-yellow-500 text-center uppercase italic underline underline-offset-8 decoration-zinc-800">預約詳情</h2>
<div className="space-y-6 text-left text-white">
<div className="space-y-2">
<p className="text-base font-bold ml-5 uppercase">聯絡人姓名</p>
<input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} type="text" placeholder="王先生" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
</div>
<div className="space-y-2">
<p className="text-base font-bold ml-5 uppercase">聯絡電話</p>
<input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} type="text" placeholder="0912..." className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
</div>
<div className="space-y-2">
<p className="text-base font-bold ml-5 uppercase">航班編號</p>
<input value={form.flight} onChange={(e)=>setForm({...form, flight:e.target.value})} type="text" placeholder="例如: IT200" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
</div>
<div className="space-y-2">
<p className="text-base font-bold ml-5 uppercase">日期</p>
<input value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} type="date" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
</div>
<div className="space-y-2">
<div className="flex justify-between items-center ml-5 mr-5">
<p className="text-base font-bold uppercase">{mode==='pickup'?'降落時間':'上車時間'}</p>
{isNightTime(form.time) && isFormComplete && <span className="text-[10px] text-red-500 font-black animate-pulse uppercase">此為加價時段哦！</span>}
</div>
<input value={form.time} onChange={(e)=>setForm({...form, time:e.target.value})} type="time" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
</div>
<div className="space-y-2">
<p className="text-base font-bold ml-5 uppercase">地址</p>
<input value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} type="text" placeholder="詳細地址" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
</div>
</div>

<div className="mt-8 pt-8 border-t border-zinc-800 text-center space-y-2">
<p className="text-white text-xs font-black uppercase italic">估算報價明細</p>
<p className="text-zinc-400 text-sm font-bold text-center">車資 ${basePrice} {surcharge>0 ? `+ 夜間加成 $${surcharge}` : ''}</p>
<p className="text-5xl font-black italic text-yellow-500 text-center">${total}</p>
{paidStep === 'none' && (
<button disabled={isSubmitting} onClick={handleBooking} className="w-full mt-6 bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 active:scale-95 shadow-xl text-center uppercase italic">{isSubmitting?'處理中...':'確認預約'}</button>
)}
</div>
</div>

{paidStep !== 'none' && (
<div className="w-full bg-zinc-900 border-2 border-yellow-500 p-8 rounded-[40px] shadow-2xl mt-4 animate-in zoom-in-95 duration-500 space-y-8 text-center text-white">
<div className="flex flex-col items-center"><SvgCheck /><h3 className="text-xl font-black italic uppercase mt-2">待付款單成立</h3><p className="text-3xl font-black italic mt-2 text-yellow-500">${total} TWD</p></div>
<div className="space-y-4">
<button onClick={()=>setPaidStep('transfer')} className={`w-full py-6 rounded-3xl font-black ${paidStep==='transfer'?'bg-yellow-500 text-black shadow-xl':'bg-black text-zinc-400'}`}>銀行轉帳</button>
{paidStep==='transfer' && <div className="bg-black/40 p-6 rounded-3xl border border-yellow-500/20 font-bold">渣打銀行 (052)<br/>12220000471580</div>}
<button onClick={()=>setPaidStep('card')} className={`w-full py-6 rounded-3xl font-black ${paidStep==='card'?'bg-yellow-500 text-black shadow-xl':'bg-black text-zinc-400'}`}>線上刷卡 (須加 3%)</button>
{paidStep==='card' && (
<div className="space-y-4 animate-in slide-in-from-top-4 text-center">
<p className="text-red-500 text-[9px] font-black animate-pulse uppercase italic">⚠️ 刷卡須另加收 3% 手續費</p>
<a href="https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/PN8Fwvsnm1m7AdiVeUUp" target="_blank" className="bg-white text-black py-5 rounded-2xl font-black block hover:bg-yellow-500 italic">前往支付</a>
</div>
)}
<button onClick={copySummary} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg">📋 複製明細回報老皮</button>
</div>
</div>
)}
<div className="flex justify-center w-full py-10">
<button onClick={() => {setPage('home'); setPaidStep('none');}} className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black active:scale-95 transition-all italic text-center">回上一頁</button>
</div>
</div>
</Layout>
);
}
return null;
}
