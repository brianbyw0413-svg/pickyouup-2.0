import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Landmark, CreditCard, Zap, ChevronLeft } from 'lucide-react';

export default function App() {
const [page, setPage] = useState('home');
const [carType, setCarType] = useState('');
const [mode, setMode] = useState('');
const [paidStep, setPaidStep] = useState('none');

const pricing = {
'small-dropoff': { price: 1200, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/PN8Fwvsnm1m7AdiVeUUp' },
'large-dropoff': { price: 1500, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/NqKaoMvyeJt1m3oRLyVy' },
'small-pickup': { price: 1300, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/N42KcEIcfxs3YbqIOlCq' },
'large-pickup': { price: 1600, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/mFSjuWEYtktw9pT53lXi' },
'small-both': { price: 2500, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/FtFfwera9XoPoePg5qfi' },
'large-both': { price: 3100, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/ENwPsxoEKRnlPuBrSmof' }
};

const currentPrice = pricing[`${carType}-${mode}`] || { price: 0, link: '#' };

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

const Layout = ({ children }) => (
<div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8 flex flex-col items-center overflow-x-hidden relative">
<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
<div className="w-full max-w-[480px] flex flex-col items-center relative z-10">
{children}
</div>
</div>
);

if (page === 'home') {
return (
<Layout>
<nav className="w-full py-6 mb-12 flex justify-center border-b border-white/5">
<h1 className="text-xl font-black italic tracking-tighter text-yellow-500 uppercase">PickYouUP 2.0</h1>
</nav>
<div className="w-full text-center space-y-6 animate-in fade-in duration-1000">
<h2 className="text-[11vw] md:text-6xl font-black italic mb-16 tracking-tighter leading-tight italic">快速預約<br/><span className="text-yellow-500 uppercase">專業接送</span></h2>
<div className="space-y-4 px-2">
{['我要送機', '我要接機', '接送一併預訂'].map((title, i) => (
<button key={title} onClick={() => {
if(i===0) setMode('dropoff'); else if(i===1) setMode('pickup'); else setMode('both');
navigateTo('choice');
}}
className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black active:bg-yellow-500 active:text-black py-8 md:py-10 rounded-[40px] font-black text-2xl md:text-3xl shadow-2xl transition-all duration-300 transform active:scale-95"
>{title}</button>
))}
</div>
<p className="text-zinc-600 text-[10px] mt-24 font-black uppercase tracking-[0.4em]">Premium Service since 2026</p>
</div>
</Layout>
);
}

if (page === 'choice') {
return (
<Layout>
<h2 className="mt-6 mb-10 text-[9vw] md:text-5xl font-black italic text-yellow-500 tracking-widest text-center uppercase leading-none">
{mode === 'pickup' ? '接機服務' : mode === 'dropoff' ? '送機服務' : '來回接送'}
</h2>
<div className="w-full space-y-4 px-2">
<button onClick={() => { setCarType('small'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 md:p-10 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black active:bg-yellow-500 active:text-black transition-all group shadow-xl">
<p className="text-2xl font-black mb-1 group-hover:text-black">小車直達 (5人座)</p>
<p className="text-white text-[11px] md:text-sm font-bold group-hover:text-black/70">乘客1-4人/行李1-3件/直達無加點/無其他需求</p>
</button>
<button onClick={() => { setCarType('large'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 md:p-10 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black active:bg-yellow-500 active:text-black transition-all group shadow-xl">
<p className="text-2xl font-black mb-1 group-hover:text-black">大車直達 (九人座)</p>
<p className="text-white text-[11px] md:text-sm font-bold group-hover:text-black/70">乘客5-8人/行李1-8件/直達無加點/無其他需求</p>
</button>
<a href="https://line.me/ti/p/@085qitid" target="_blank" className="w-full bg-zinc-900 border border-zinc-800 p-8 md:p-10 rounded-[40px] text-left block hover:bg-yellow-500 hover:text-black active:bg-yellow-500 active:text-black transition-all group shadow-xl">
<p className="text-2xl font-black mb-1 group-hover:text-black italic">我真的不確定...</p>
<p className="text-white text-[11px] md:text-sm font-bold group-hover:text-black/70 italic leading-relaxed">我有其他需求 / 加點上下車 / 舉牌 / 安全座椅等</p>
</a>
<button onClick={() => window.history.back()} className="w-full text-white hover:text-black hover:bg-yellow-500 active:bg-yellow-500 active:text-black font-black py-10 rounded-[40px] tracking-widest text-xl uppercase transition-all active:scale-95 mt-4 text-center">返回上一步</button>
</div>
</Layout>
);
}

if (page === 'form') {
return (
<Layout>
<div className="w-full mt-4 space-y-6 pb-24 px-2">
<div className="px-8 py-8 bg-white/5 border border-white/10 rounded-[35px] text-center">
<p className="text-white text-lg font-bold leading-relaxed tracking-tight text-center">
此選項對應 <span className="text-yellow-500 font-black">乘客 1-4 人，行李 1-3 件內</span>，<br/>
如果您無法確認乘客或是行李能否裝載，<br/>
請回到上一頁點選<span className="text-yellow-500 underline underline-offset-4 decoration-white/20 font-black">「我真的不能確定」</span>按鍵，<br/>
讓客服人員來幫助您：）
</p>
</div>
<div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-6">
<h2 className="text-2xl font-black italic text-yellow-500 mb-4 uppercase tracking-widest text-center italic underline underline-offset-8 decoration-zinc-800">預約詳情</h2>
<div className="space-y-4">
<div className="space-y-1">
<p className="text-[10px] font-black text-zinc-500 ml-4 uppercase tracking-widest">出發日期</p>
<input type="date" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-all appearance-none" />
</div>

{/* 修正：增加上車時間欄位 (僅送機或兩者時顯示) */}
{(mode === 'dropoff' || mode === 'both') && (
<div className="space-y-1 animate-in slide-in-from-top-2">
<p className="text-[10px] font-black text-zinc-500 ml-4 uppercase tracking-widest">上車時間</p>
<input type="time" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-all appearance-none" />
</div>
)}

<div className="space-y-1">
<p className="text-[10px] font-black text-zinc-500 ml-4 uppercase tracking-widest">航班編號</p>
<input type="text" placeholder="例如: JX58" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-all" />
</div>
<div className="space-y-1">
<p className="text-[10px] font-black text-zinc-500 ml-4 uppercase tracking-widest">{mode === 'pickup' ? '下車地址' : '上車地址'}</p>
<input type="text" placeholder="請輸入完整街道地址" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-all" />
</div>
<div className="grid grid-cols-2 gap-3">
<div className="space-y-1">
<p className="text-[10px] font-black text-zinc-500 ml-4 uppercase tracking-widest">姓名</p>
<input type="text" placeholder="聯絡人" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-all" />
</div>
<div className="space-y-1">
<p className="text-[10px] font-black text-zinc-500 ml-4 uppercase tracking-widest">電話</p>
<input type="text" placeholder="0912..." className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-all" />
</div>
</div>
</div>
{paidStep === 'none' && (
<button onClick={() => setPaidStep('choice')} className="w-full mt-10 bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 active:scale-95 shadow-xl shadow-yellow-500/20 transition-all">確認預約</button>
)}
</div>

{paidStep !== 'none' && (
<div className="w-full bg-zinc-900 border-2 border-yellow-500 p-8 rounded-[40px] shadow-2xl mt-4 animate-in zoom-in-95 duration-500 space-y-8 text-center">
<div>
<div className="inline-flex items-center gap-2 text-yellow-500 mb-2">
<ShieldCheck size={24}/>
<h3 className="text-xl font-black italic uppercase">待付款單成立</h3>
</div>
<p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">金額：<span className="text-white text-3xl font-black italic ml-1">${currentPrice.price}</span></p>
</div>
<div className="space-y-4">
<p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 font-bold italic">請選擇支付方式</p>
<div className="space-y-3">
<button onClick={() => setPaidStep('transfer')} className={`w-full py-6 rounded-3xl font-black flex items-center justify-center gap-3 transition-all ${paidStep === 'transfer' ? 'bg-yellow-500 text-black' : 'bg-black border border-zinc-800 text-zinc-400 hover:text-white'}`}>
<Landmark size={20}/> 銀行轉帳
</button>
{paidStep === 'transfer' && (
<div className="bg-black/40 border border-yellow-500/20 p-6 rounded-[30px] animate-in slide-in-from-top-4">
<p className="text-zinc-300 text-base font-bold leading-relaxed">渣打銀行 (052) <br/>帳號: <span className="text-white font-mono text-lg tracking-wider">12220000471580</span></p>
<p className="text-[10px] text-zinc-600 mt-4 font-bold">付款後請至 LINE 回報後五碼。汪！</p>
</div>
)}
</div>
<div className="space-y-3">
<button onClick={() => setPaidStep('card')} className={`w-full py-6 rounded-3xl font-black flex items-center justify-center gap-3 transition-all ${paidStep === 'card' ? 'bg-yellow-500 text-black' : 'bg-black text-zinc-400'}`}>
<CreditCard size={20}/> 線上刷卡 (須加 3%)
</button>
{paidStep === 'card' && (
<div className="space-y-4 animate-in slide-in-from-top-4 text-center">
<p className="text-red-500 text-[10px] font-black animate-pulse tracking-widest uppercase">⚠️ 刷卡須另加收 3% 手續費</p>
<a href={currentPrice.link} target="_blank" className="bg-white text-black py-6 rounded-3xl font-black text-lg block hover:bg-yellow-500 shadow-xl transition-all">前往支付 (含手續費)</a>
</div>
)}
</div>
</div>
</div>
)}
<button onClick={() => {setPage('home'); setPaidStep('none');}} className="w-full text-white hover:text-black hover:bg-yellow-500 active:bg-yellow-500 active:text-black font-black py-10 tracking-widest text-xl uppercase text-center transition-all active:scale-95">返回首頁</button>
</div>
</Layout>
);
}
return null;
}
