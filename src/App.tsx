import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vtvytcrkoqbluvczyepm.supabase.co',
  'sb_publishable_SOp1vthQKdTdQUwoHsMIQA_FCTxzbie'
);

const SvgTruck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const SvgCheck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

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
  const [paidStep, setPaidStep] = useState('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flightHint, setFlightHint] = useState('');
  const [bothStep, setBothStep] = useState(1);
  
  const [dropoffForm, setDropoffForm] = useState({ name: '', phone: '', address: '', date: '', time: '', flight: '' });
  const [pickupForm, setPickupForm] = useState({ name: '', phone: '', address: '', date: '', time: '', flight: '' });

  const pricing = { 'small-dropoff': 1200, 'large-dropoff': 1500, 'small-pickup': 1300, 'large-pickup': 1600, 'small-both': 2500, 'large-both': 3100 };

  const creditCardLinks = {
    1200: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/PN8Fwvsnm1m7AdiVeUUp',
    1300: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/N42KcEIcfxs3YbqIOlCq',
    1400: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/ENwPsxoEKRnlPuBrSmof',
    1500: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/NqKaoMvyeJt1m3oRLyVy',
    1600: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/mFSjuWEYtktw9pT53lXi',
    1700: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/wvYo8iPse2TJA8DoaCgv',
    1800: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/arUDQda2YStEgj0Zckjr',
    1900: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/GT1VZ2GhpVQypVlVXVkM',
    2000: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/3S8SSKwIaTO4qQFFG5ut',
    2100: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/q1ZSvwEqbWuueQgBGWbb',
    2200: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/b3dH6bth8f6baNqrslxk',
    2300: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/FY7KkY2cpxWUdXaiFVAp',
    2400: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/F0FJSY1weNBmHUSP51LC',
    2500: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/0Ki81I3Knx9BgjqN8x1T',
    2600: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/oDgpoE6ZBZflEl2vfe15',
    2700: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/ghIDs1YbPQApJNfGPtzR',
    2800: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/yTmV7m3T9rtdrMLvU28i',
    2900: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/T5lN1BZijoUrwZpEsFju',
    3000: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/b10tDeTF4LU9tikzLBij',
    3100: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/p641ccGnWnzu7JpJ5YDX',
    3200: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/Lt3gvazrBKe9A8EDKHf2'
  };

  const getCreditCardLink = (amount) => creditCardLinks[amount] || creditCardLinks[1200];
  const isNight = (t) => { if(!t) return false; const h = parseInt(t.split(':')[0]); return h >= 23 || h < 6; };
  const isFormComplete = (m, f) => { const common = f.name && f.phone && f.address && f.date && f.flight; return m === 'dropoff' ? common && f.time : common; };
  const getSubTotal = (m, form) => { if (!isFormComplete(m, form)) return 0; return (pricing[`${carType}-${m}`] || 0) + (isNight(form.time) ? 100 : 0); };
  const isBothComplete = isFormComplete('dropoff', dropoffForm) && isFormComplete('pickup', pickupForm);
  const total = mode === 'both' ? (isBothComplete ? pricing[`${carType}-both`] : 0) : getSubTotal(mode, mode === 'pickup' ? pickupForm : dropoffForm);

  const resetAll = () => { setDropoffForm({ name: '', phone: '', address: '', date: '', time: '', flight: '' }); setPickupForm({ name: '', phone: '', address: '', date: '', time: '', flight: '' }); setPaidStep('none'); setFlightHint(''); setBothStep(1); };

  useEffect(() => { const handlePopState = (event) => setPage(event.state?.page || 'home'); window.addEventListener('popstate', handlePopState); return () => window.removeEventListener('popstate', handlePopState); }, []);
  const navigateTo = (nextPage) => { window.history.pushState({ page: nextPage }, '', ''); setPage(nextPage); window.scrollTo(0,0); };

  const handleFlightBlur = async (f, target) => {
    if (!f || f.length < 4) return;
    setFlightHint("正在為您查詢航班資訊...");
    try {
      const response = await fetch("https://vtvytcrkoqbluvczyepm.supabase.co/functions/v1/tdx-proxy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ flightNo: f }) });
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const info = data[0]; const timeStr = info.ScheduleDepartureTime || info.ScheduleArrivalTime || "";
        setFlightHint(`航班：${info.DepartureAirportID} ➔ ${info.ArrivalAirportID} | 預計時間：${timeStr}`);
        if (target === 'dropoff' && timeStr) { const [h, m] = timeStr.split(':').map(Number); setDropoffForm(prev => ({...prev, time: `${(h-3+24)%24}`.padStart(2,'0')+":"+`${m}`.padStart(2,'0')})); }
      } else { setFlightHint("找不到該航班資訊，請手動確認。"); }
    } catch (e) { setFlightHint("航班查詢暫時連線不到，請手動輸入時間。"); }
  };

  const handleBooking = async () => {
    setIsSubmitting(true);
    const orders = [];
    if (mode === 'dropoff' || mode === 'both') orders.push({ ...dropoffForm, mode: 'dropoff', car_type: carType, amount: mode === 'both' ? total/2 : total, status: 'pending' });
    if (mode === 'pickup' || mode === 'both') orders.push({ ...pickupForm, mode: 'pickup', car_type: carType, amount: mode === 'both' ? total/2 : total, status: 'pending' });
    const { error } = await supabase.from('orders').insert(orders);
    if (!error) { setPaidStep('choice'); window.scrollTo(0,0); } else alert("預約暫時無法提交，請稍後再試。");
    setIsSubmitting(false);
  };

  const handleDone = () => { const summary = `【PickYouUP 預約明細】姓名：${mode==='pickup'?pickupForm.name:dropoffForm.name} 總計：$${total} 元 您好，我已完成支付。`; window.open(`https://line.me/R/oaMessage/@085qitid/?${encodeURIComponent(summary)}`, '_blank'); resetAll(); setPage('home'); };

  if (page === 'home') return (<Layout><nav className="w-full py-8 mb-12 flex justify-center border-b border-white/5"><h1 className="text-xl font-black italic text-yellow-500 uppercase flex items-center gap-2"><SvgTruck /> PickYouUP.tw</h1></nav><div className="w-full text-center space-y-6 animate-in fade-in duration-1000 uppercase font-black italic"><h2 className="text-[11vw] md:text-6xl mb-16 tracking-tighter">快速預約<br/><span className="text-yellow-500">專業接送</span></h2><div className="space-y-4 px-2 not-italic"><button onClick={() => { setMode('dropoff'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl">我要送機</button><button onClick={() => { setMode('pickup'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl">我要接機</button><button onClick={() => { setMode('both'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl shadow-xl transition-all">接送機一併預約</button></div></div></Layout>);

  if (page === 'choice') return (<Layout><h2 className="mt-6 mb-10 text-4xl font-black italic text-yellow-500 text-center uppercase tracking-widest leading-none">{mode==='pickup'?'接機服務':mode==='dropoff'?'送機服務':'來回接送'}</h2><div className="space-y-4 px-2 text-center"><button onClick={() => { setCarType('small'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl"><p className="text-2xl font-black mb-1 group-hover:text-black">小車直達 (5人座)</p><p className="text-white text-[11px] font-bold group-hover:text-black/70 uppercase">乘客1-4人 / 行李1-3件 / 直達無加點</p></button><button onClick={() => { setCarType('large'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl"><p className="text-2xl font-black mb-1 group-hover:text-black">大車直達 (9人座)</p><p className="text-white text-[11px] font-bold group-hover:text-black/70 uppercase tracking-widest">乘客1-8人 / 行李1-8件 / 直達無加點</p></button><a href="https://line.me/ti/p/~@085qitid" target="_blank" className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left block hover:bg-yellow-500 hover:text-black transition-all group shadow-xl"><p className="text-2xl font-black mb-1 italic group-hover:text-black">我真的不確定...</p><p className="text-white text-[11px] font-bold opacity-70 italic uppercase group-hover:text-black/70">需要人工報價 / 安全座椅 / 多點加停</p></a><div className="flex justify-center w-full py-10"><button onClick={()=>window.history.back()} className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black transition-all">回上一頁</button></div></div></Layout>);

  if (page === 'form') {
    const isBoth = mode === 'both';
    const currentForm = (isBoth && bothStep === 2) || mode === 'pickup' ? pickupForm : dropoffForm;
    const setForm = (isBoth && bothStep === 2) || mode === 'pickup' ? setPickupForm : setDropoffForm;
    const showPrice = total > 0;
    return (<Layout><div className="mt-4 space-y-6 pb-24 px-2"><div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-10 text-white"><h2 className="text-3xl font-black italic text-yellow-500 text-center uppercase italic underline underline-offset-8 decoration-zinc-800">{isBoth ? (bothStep === 1 ? '第一步：送機詳情' : '第二步：接機詳情') : (mode === 'pickup' ? '接機預約詳情' : '送機預約詳情')}</h2><div className="space-y-6 text-left"><input value={currentForm.name} onChange={(e)=>setForm({...currentForm, name:e.target.value})} type="text" placeholder="聯絡人姓名" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" /><input value={currentForm.phone} onChange={(e)=>setForm({...currentForm, phone:e.target.value})} type="text" placeholder="聯絡電話" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" /><div className="space-y-1"><p className="text-sm font-bold ml-5">日期</p><input value={currentForm.date} onChange={(e)=>setForm({...currentForm, date:e.target.value})} type="date" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" /></div><div className="space-y-2"><p className="text-sm font-bold ml-5">航班編號</p><input onBlur={(e) => handleFlightBlur(e.target.value, (isBoth && bothStep === 2) || mode === 'pickup' ? 'pickup' : 'dropoff')} value={currentForm.flight} onChange={(e)=>setForm({...currentForm, flight:e.target.value})} type="text" placeholder="例如: JX713" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />{flightHint && <p className="text-xs text-yellow-500 ml-5 font-black animate-pulse">{flightHint}</p>}</div>{((isBoth && bothStep === 1) || mode === 'dropoff') && (<div className="space-y-1"><p className="text-sm font-bold ml-5">上車時間</p><input value={currentForm.time} onChange={(e)=>setForm({...currentForm, time:e.target.value})} type="time" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" /></div>)}<input value={currentForm.address} onChange={(e)=>setForm({...currentForm, address:e.target.value})} type="text" placeholder={((isBoth && bothStep === 2) || mode === 'pickup') ? '下單詳情地址' : '上車詳情地址'} className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" /></div><div className="mt-8 pt-8 border-t border-zinc-800 text-center space-y-2">{showPrice && <p className="text-5xl font-black italic text-yellow-500 animate-in zoom-in-90 duration-500">${total}</p>}{paidStep === 'none' && (isBoth && bothStep === 1 ? (<button onClick={() => { setPickupForm(prev => ({...prev, name: dropoffForm.name, phone: dropoffForm.phone, address: dropoffForm.address })); setBothStep(2); window.scrollTo(0,0); }} className="w-full mt-6 bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400">下一步：填寫接機資訊</button>) : (<button disabled={isSubmitting || !showPrice} onClick={handleBooking} className={`w-full mt-6 py-6 rounded-[24px] font-black text-xl shadow-xl transition-all ${isSubmitting || !showPrice ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95'}`}>{isSubmitting?'處理中...':'確認預約'}</button>))}</div></div>{paidStep !== 'none' && (<div className="w-full bg-zinc-900 border-2 border-yellow-500 p-8 rounded-[40px] shadow-2xl mt-4 animate-in zoom-in-95 duration-500 space-y-8 text-center text-white"><div className="flex flex-col items-center"><SvgCheck /><h3 className="text-xl font-black italic uppercase mt-2 text-yellow-500">預約已完成</h3><p className="text-3xl font-black italic mt-2">${total} TWD</p></div><div className="space-y-4"><button onClick={()=>setPaidStep('transfer')} className={`w-full py-6 rounded-3xl font-black ${paidStep==='transfer'?'bg-yellow-500 text-black shadow-xl':'bg-black text-zinc-400'}`}>銀行轉帳</button>{paidStep==='transfer' && <div className="bg-black/40 p-6 rounded-3xl border border-yellow-500/20 font-bold">渣打銀行 (052) 12220000471580</div>}<button onClick={() => window.open(getCreditCardLink(total), '_blank')} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all">信用卡付款 (須加3%手續費)</button><button onClick={handleDone} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all">通知官方對帳</button></div></div>)}<div className="flex justify-center w-full py-10"><button onClick={() => isBoth && bothStep === 2 ? setBothStep(1) : window.history.back()} className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black transition-all italic">回上一頁</button></div></div></Layout>);
  }
  return null;
}
