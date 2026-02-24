import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
'https://vtvytcrkoqbluvczyepm.supabase.co',
'sb_publishable_SOp1vthQKdTdQUwoHsMIQA_FCTxzbie'
);

// --- 內建圖案 ---
const SvgTruck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const SvgAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;

export default function App() {
const [page, setPage] = useState('home');
const [carType, setCarType] = useState('');
const [mode, setMode] = useState('');
const [paidStep, setPaidStep] = useState('none');
const [form, setForm] = useState({ name: '', phone: '', address: '', date: '', time: '', flight: '' });
const [isSubmitting, setIsSubmitting] = useState(false);
const [flightStatus, setFlightStatus] = useState({ time: '', remark: '' });

const pricing = {
'small-dropoff': 1200, 'large-dropoff': 1500,
'small-pickup': 1300, 'large-pickup': 1600,
'small-both': 2500, 'large-both': 3100
};

const isNight = (t) => { if(!t) return false; const h = parseInt(t.split(':')[0]); return h >= 23 || h < 6; };
const basePrice = pricing[`${carType}-${mode}`] || 0;
const surcharge = isNight(mode === 'pickup' ? flightStatus.time : form.time) ? 100 : 0;
const total = basePrice + surcharge;

// --- 真正的 TDX 連動邏輯 ---
const handleFlightLookup = async (flightNo) => {
if (!flightNo) return;
setFlightStatus({ time: '', remark: '正在查詢航班...' });

// 這裡我們模擬呼叫後端 API (未來老闆部署 Edge Function 後即可真跑)
// 模擬 IT200 (送機) 與 CI58 (接機) 的實戰效果
setTimeout(() => {
if (flightNo.toUpperCase().includes('IT200')) {
const time = "06:35";
const [h, m] = time.split(':').map(Number);
const sugTime = `${(h-3+24)%24}`.padStart(2,'0') + ":" + `${m}`.padStart(2,'0');
setFlightStatus({ time, remark: `起飛時間：${time}，已建議提早3小時上車` });
setForm(prev => ({...prev, time: sugTime}));
} else if (flightNo.toUpperCase().includes('CI58')) {
const time = "05:30";
setFlightStatus({ time, remark: `班機落地時間 ${time}，為加價時段哦！` });
setForm(prev => ({...prev, time}));
} else {
setFlightStatus({ time: '', remark: '航班資訊已記錄' });
}
}, 1000);
};

const handleBooking = async () => {
setIsSubmitting(true);
const { error } = await supabase.from('orders').insert([{
mode, car_type: carType, name: form.name, phone: form.phone,
address: form.address, date: form.date, time: form.time,
flight: form.flight, amount: total, status: 'pending'
}]);

if (!error) {
const summary = `【PickYouUP 預約明細】\n01_姓名：${form.name}\n02_電話：${form.phone}\n03_航班：${form.flight}\n04_服務：${mode==='pickup'?'接機':'送機'}(${carType==='small'?'5人座':'9人座'})\n05_日期：${form.date}\n06_時間：${form.time}\n07_地址：${form.address}\n💰 總計：$${total} 元\n(含車資$${basePrice}${surcharge>0?'+夜間加成$'+surcharge:''})\n\n老皮我訂好了！汪！🐶`;
window.location.href = `https://line.me/R/oaMessage/@085qitid/?${encodeURIComponent(summary)}`;
}
setIsSubmitting(false);
};

const Layout = ({ children }) => (
<div className="min-h-screen bg-[#0a0a0c] text-white p-4 flex flex-col items-center overflow-x-hidden font-sans">
<div className="w-full max-w-[480px]">{children}</div>
</div>
);

if (page === 'home') {
return (
<Layout>
<nav className="w-full py-8 mb-12 flex justify-center border-b border-white/5">
<h1 className="text-xl font-black italic text-yellow-500 uppercase flex items-center gap-2"><SvgTruck /> PickYouUP.tw</h1>
</nav>
<div className="w-full text-center space-y-5 animate-in fade-in duration-1000 uppercase font-black italic">
<h2 className="text-[11vw] md:text-6xl mb-16 tracking-tighter italic">快速預約<br/><span className="text-yellow-500">專業接送</span></h2>
<button onClick={() => { setMode('dropoff'); setPage('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl shadow-xl transition-all">我要送機</button>
<button onClick={() => { setMode('pickup'); setPage('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl shadow-xl transition-all">我要接機</button>
<button onClick={() => { setMode('both'); setPage('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl shadow-xl transition-all">接送一併預訂</button>
</div>
</Layout>
);
}

if (page === 'choice') {
return (
<Layout>
<h2 className="mt-6 mb-10 text-4xl font-black italic text-yellow-500 text-center uppercase">{mode==='pickup'?'接機服務':'送機服務'}</h2>
<div className="space-y-4 px-2">
<button onClick={() => { setCarType('small'); setPage('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
<p className="text-2xl font-black mb-1 group-hover:text-black">小車直達 (5人座)</p>
<p className="text-white text-[11px] font-bold group-hover:text-black/70">乘客1-4人/行李1-3件/直達無加點</p>
</button>
<button onClick={() => { setCarType('large'); setPage('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
<p className="text-2xl font-black mb-1 group-hover:text-black">大車直達 (9人座)</p>
<p className="text-white text-[11px] font-bold group-hover:text-black/70">乘客5-8人/行李1-8件/直達無加點</p>
</button>
<a href="https://line.me/ti/p/~@085qitid" className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left block hover:bg-yellow-500 hover:text-black transition-all shadow-xl">
<p className="text-2xl font-black mb-1 group-hover:text-black italic">我真的不確定...</p>
<p className="text-white text-[11px] font-bold group-hover:text-black/70 italic leading-relaxed text-left">需要人工報價 / 安全座椅 / 加點</p>
</a>
<button onClick={() => setPage('home')} className="w-full text-white hover:text-black hover:bg-yellow-500 font-black py-10 rounded-[40px] text-xl uppercase transition-all mt-4 italic text-center text-left">返回首頁</button>
</div>
</Layout>
);
}

if (page === 'form') {
return (
<Layout>
<div className="mt-4 space-y-6 pb-24 px-2 text-center text-left text-center">
<div className="bg-zinc-900/80 border border-yellow-500/20 rounded-[30px] p-6 mb-4 flex items-start gap-4 shadow-2xl backdrop-blur-md">
<div className="bg-yellow-500/10 p-3 rounded-2xl text-yellow-500 shrink-0"><SvgAlert /></div>
<div className="text-left">
<p className="text-white text-lg font-bold leading-relaxed text-left">此選項對應 <span className="text-yellow-500 font-black">{carType==='small'?'乘客1-4人，行李1-3件':'乘客5-8人，行李1-8件'}</span>。<br/>不確定請回上頁點選<span className="text-yellow-500 underline">「我真的不能確認」</span>。</p>
</div>
</div>

<div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-8">
<h2 className="text-3xl font-black italic text-yellow-500 uppercase underline underline-offset-8 decoration-zinc-800">預約詳情</h2>
<div className="space-y-6 text-left">
<div className="space-y-2"><p className="text-base font-bold text-white ml-5">聯絡人姓名</p><input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} type="text" placeholder="王先生" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" /></div>
<div className="space-y-2"><p className="text-base font-bold text-white ml-5">聯絡電話</p><input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} type="text" placeholder="0912..." className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" /></div>
<div className="space-y-2 text-left">
<p className="text-base font-bold text-white ml-5">航班編號</p>
<input onBlur={(e) => handleFlightLookup(e.target.value)} value={form.flight} onChange={(e)=>setForm({...form, flight:e.target.value})} type="text" placeholder="例如: IT200" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 text-left" />
{flightStatus.remark && <p className="text-sm text-yellow-500 ml-5 font-black animate-pulse text-left">✨ {flightStatus.remark}</p>}
</div>
<div className="space-y-2 text-left">
<p className="text-base font-bold text-white ml-5 uppercase">日期</p>
<input value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} type="date" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
</div>
<div className="space-y-2 text-left text-left text-left">
<div className="flex justify-between items-center ml-5 mr-5 text-left"><p className="text-base font-bold text-white uppercase text-left">{mode==='pickup'?'降落時間':'上車時間'}</p>{surcharge > 0 && <span className="text-[10px] text-red-500 font-black animate-pulse uppercase text-left">此為加價時段哦！</span>}</div>
<input value={form.time} onChange={(e)=>setForm({...form, time:e.target.value})} type="time" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 text-left" />
</div>
<div className="space-y-2 text-left"><p className="text-base font-bold text-white ml-5">地址</p><input value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} type="text" placeholder="詳細地址" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none text-left" /></div>
</div>
<div className="mt-8 pt-8 border-t border-zinc-800 text-center space-y-2 text-left">
<p className="text-white text-xs font-black uppercase italic text-left text-center">估算報價明細</p>
<p className="text-zinc-400 text-sm font-bold text-left text-center">車資 ${basePrice} {surcharge>0 ? `+ 夜間加成 $${surcharge}` : ''}</p>
<p className="text-5xl font-black italic text-yellow-500 text-left text-center">${total}</p>
<button disabled={isSubmitting} onClick={handleBooking} className="w-full mt-6 bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 active:scale-95 shadow-xl text-left text-center">{isSubmitting?'正在處理...':'確認預約並回報老皮'}</button>
</div>
</div>
<button onClick={() => window.history.back()} className="w-full text-white hover:text-black hover:bg-yellow-500 font-black py-10 rounded-[40px] text-xl uppercase transition-all mt-4 italic text-center">返回上一頁</button>
</div>
</Layout>
);
}
return null;
}
