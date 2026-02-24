import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- 1. 初始化 Supabase 靈魂管線 ---
// --- 1. 初始化 Supabase (維持原樣) ---
const supabase = createClient(
  'https://vtvytcrkoqbluvczyepm.supabase.co',
  'sb_publishable_SOp1vthQKdTdQUwoHsMIQA_FCTxzbie'
);

// --- 內建圖示 ---
const IconTruck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
// --- 2. 內建圖案 (移到外面，防止重複渲染) ---
const SvgTruck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
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
  const [form, setForm] = useState({ name: '', phone: '', address: '', date: '', time: '', flight: '' });
  
  // 核心資料
  const [form, setForm] = useState({ 
    name: '', phone: '', address: '', date: '', time: '', flight: '' 
  });

  const pricing = {
    'small-dropoff': 1200, 'large-dropoff': 1500,
@@ -33,7 +49,20 @@ export default function App() {

  const currentPrice = pricing[`${carType}-${mode}`] || 0;

  // --- 核心：將訂單存入 Supabase ---
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
    setIsSubmitting(true);
    const { error } = await supabase.from('orders').insert([{
@@ -43,111 +72,137 @@ export default function App() {
    }]);

    if (error) {
      alert("資料庫連線失敗汪！請檢查 SQL 是否已執行。");
      console.error(error);
      alert("連線失敗汪！請確認 SQL 表單已建立。");
    } else {
      setPaidStep('choice');
    }
    setIsSubmitting(false);
  };

  // --- 生成標準明細文字 ---
  const copySummary = () => {
    const summary = `【PickYouUP 預約明細】\n01_聯絡人姓名：${form.name}\n02_聯絡電話：${form.phone}\n03_航班資訊：${form.flight}\n04_服務類別：${mode==='pickup'?'接機':'送機'}(${carType==='small'?'5人座':'9人座'})\n05_日期：${form.date}\n06_時間：${form.time || '依航班落地'}\n07_地址：${form.address}\n💰 本趟行程報價：$${currentPrice} 元\n\n(老皮已在雲端為您同步存檔！汪！🐶)`;
    const summary = `【PickYouUP 預約明細】\n01_聯絡人：${form.name}\n02_電話：${form.phone}\n03_航班：${form.flight}\n04_服務：${mode==='pickup'?'接機':'送機'}(${carType==='small'?'5人座':'9人座'})\n05_日期：${form.date}\n06_時間：${form.time || '依航班落地'}\n07_地址：${form.address}\n💰 報價：$${currentPrice} 元\n\n(已同步至雲端。汪！🐶)`;
    navigator.clipboard.writeText(summary);
    alert("預約明細已複製！請點擊跳轉至 LINE 傳送給老皮。汪！");
    alert("明細已複製！請至 LINE 傳送給老皮。");
    window.location.href = "https://line.me/ti/p/~@085qitid";
  };

  const Layout = ({ children }) => (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-[480px] font-sans">{children}</div>
    </div>
  );

  // --- 首頁渲染 ---
  if (page === 'home') {
    return (
      <Layout>
        <nav className="w-full py-8 mb-12 flex justify-center border-b border-white/5">
           <div className="flex items-center gap-2">
              <div className="bg-yellow-500 p-1.5 rounded-lg text-black"><IconTruck /></div>
              <h1 className="text-xl font-black italic text-yellow-500">PickYouUP.tw</h1>
        <nav className="w-full py-6 mb-12 flex justify-center border-b border-white/5">
           <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-500 p-1.5 rounded-lg text-black"><SvgTruck /></div>
                <h1 className="text-xl font-black italic tracking-tighter text-yellow-500 uppercase">PickYouUP.tw</h1>
              </div>
              <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">您接送機的好伙伴</p>
           </div>
        </nav>
        <div className="w-full text-center space-y-5 px-2 animate-in fade-in duration-1000">
        <div className="text-center space-y-6 animate-in fade-in duration-1000 px-4">
          <h2 className="text-[11vw] md:text-6xl font-black italic mb-16 leading-tight uppercase italic">快速預約<br/><span className="text-yellow-500">專業接送</span></h2>
          <button onClick={() => { setMode('dropoff'); setPage('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl shadow-xl transition-all">我要送機</button>
          <button onClick={() => { setMode('pickup'); setPage('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl shadow-xl transition-all">我要接機</button>
          <button onClick={() => { setMode('both'); setPage('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl shadow-xl transition-all">接送一併預訂</button>
          <div className="space-y-4 px-2">
            <button onClick={() => { setMode('dropoff'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl active:scale-95">我要送機</button>
            <button onClick={() => { setMode('pickup'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl active:scale-95">我要接機</button>
            <button onClick={() => { setMode('both'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl active:scale-95">接送一併預訂</button>
          </div>
        </div>
      </Layout>
    );
  }

  // --- 分流頁渲染 ---
  if (page === 'choice') {
    return (
      <Layout>
        <h2 className="mt-6 mb-10 text-4xl font-black italic text-yellow-500 text-center uppercase">{mode === 'pickup' ? '接機服務' : '送機服務'}</h2>
        <h2 className="mt-6 mb-10 text-4xl font-black italic text-yellow-500 text-center uppercase leading-none italic">{mode === 'pickup' ? '接機服務' : mode === 'dropoff' ? '送機服務' : '來回接送'}</h2>
        <div className="space-y-4 px-2">
          <button onClick={() => { setCarType('small'); setPage('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black group transition-all shadow-xl">
          <button onClick={() => { setCarType('small'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 md:p-10 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
             <p className="text-2xl font-black mb-1 group-hover:text-black">小車直達 (5人座)</p>
             <p className="text-white text-xs font-bold group-hover:text-black/70">乘客1-4人/行李1-3件/直達無加點</p>
             <p className="text-white text-[11px] font-bold group-hover:text-black/70 text-left">乘客1-4人/行李1-3件/直達無加點/無其他需求</p>
          </button>
          <button onClick={() => { setCarType('large'); setPage('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black group transition-all shadow-xl">
          <button onClick={() => { setCarType('large'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 md:p-10 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
             <p className="text-2xl font-black mb-1 group-hover:text-black">大車直達 (9人座)</p>
             <p className="text-white text-xs font-bold group-hover:text-black/70">乘客5-8人/行李1-8件/直達無加點</p>
             <p className="text-white text-[11px] font-bold group-hover:text-black/70 text-left">乘客5-8人/行李1-8件/直達無加點/無其他需求</p>
          </button>
          <a href="https://line.me/ti/p/~@085qitid" className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left block hover:bg-blue-500 transition-all">
             <p className="text-2xl font-black italic">我真的不確定...</p>
             <p className="text-white text-[11px] font-medium opacity-70">需要人工報價 / 安全座椅 / 加點</p>
          <a href="https://line.me/ti/p/~@085qitid" className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left block hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
             <p className="text-2xl font-black mb-1 group-hover:text-black italic text-left">我真的不確定...</p>
             <p className="text-white text-[11px] font-bold group-hover:text-black/70 text-left">我有其他需求 / 加點上下車 / 舉牌 / 安全座椅等</p>
          </a>
          <div className="flex justify-center w-full py-10"><button onClick={() => setPage('home')} className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black">回上一頁</button></div>
          <div className="flex justify-center w-full py-10">
            <button onClick={() => window.history.back()} className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black">回上一頁</button>
          </div>
        </div>
      </Layout>
    );
  }

  // --- 表單頁渲染 ---
  if (page === 'form') {
    return (
      <Layout>
        <div className="mt-4 space-y-6 pb-24 px-2">
          <div className="px-8 py-8 bg-white/5 border border-white/10 rounded-[35px] text-center text-white text-lg font-bold leading-relaxed shadow-inner">
            此選項對應 <span className="text-yellow-500">{carType==='small'?'乘客1-4人，行李1-3件':'乘客1-8人，行李1-8件'}</span>，<br/>不確定請點選「我真的不能確認」。
            此選項對應 <span className="text-yellow-500">{carType==='small'?'乘客1-4人，行李1-3件':'乘客1-8人，行李1-8件'}</span>，<br/>不確定請回上一頁點選<span className="text-yellow-500 underline">「我真的不能確認」</span>。
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-6">
            <h2 className="text-2xl font-black italic text-yellow-500 text-center uppercase italic underline underline-offset-8 decoration-zinc-800">預約詳情</h2>
            <div className="space-y-4">
               <p className="text-sm font-bold text-white ml-5">聯絡資訊</p>
               <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} type="text" placeholder="聯絡人姓名" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
               <input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} type="text" placeholder="聯絡電話" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
               <p className="text-sm font-bold text-white ml-5">行程詳情</p>
               <input value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} type="date" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
               {(mode==='dropoff'||mode==='both') && <input value={form.time} onChange={(e)=>setForm({...form, time:e.target.value})} type="time" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />}
               <input value={form.flight} onChange={(e)=>setForm({...form, flight:e.target.value})} type="text" placeholder="航班編號" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
               <input value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} type="text" placeholder="完整街道地址" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-10">
            <h2 className="text-3xl font-black italic text-yellow-500 text-center uppercase italic underline underline-offset-8 decoration-zinc-800">預約詳情</h2>
            <div className="space-y-8">
              <div className="space-y-4">
                 <p className="text-base font-bold text-white ml-5 uppercase">聯絡資訊</p>
                 <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} type="text" placeholder="聯絡人姓名" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
                 <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} type="text" placeholder="聯絡電話" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
              </div>
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <p className="text-base font-bold text-white ml-5 uppercase">行程詳情</p>
                <input value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} type="date" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
                {(mode === 'dropoff' || mode === 'both') && (
                  <input value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} type="time" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
                )}
                <input value={form.flight} onChange={(e) => setForm({...form, flight: e.target.value})} type="text" placeholder="航班編號" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
                <input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} type="text" placeholder="地址" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
              </div>
            </div>
            {paidStep === 'none' && (
              <button disabled={isSubmitting} onClick={handleBooking} className="w-full mt-6 bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 shadow-xl">{isSubmitting ? '正在存檔...' : '確認並支付'}</button>
              <button disabled={isSubmitting} onClick={handleBooking} className="w-full mt-10 bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 active:scale-95 shadow-xl italic uppercase">
                {isSubmitting ? '正在處理...' : '確認並支付'}
              </button>
            )}
          </div>

          {paidStep !== 'none' && (
            <div className="w-full bg-zinc-900 border-2 border-yellow-500 p-8 rounded-[40px] shadow-2xl mt-4 animate-in zoom-in-95 space-y-8 text-center">
               <h3 className="text-xl font-black italic text-yellow-500">預約已同步至雲端！✨</h3>
               <button onClick={copySummary} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2">📋 複製明細並回報老皮</button>
               <div className="h-px bg-zinc-800 w-full"></div>
               <p className="text-white text-xs font-black uppercase">請選擇支付方式：$ {currentPrice}</p>
               <button onClick={()=>setPaidStep('transfer')} className={`w-full py-5 rounded-2xl font-black ${paidStep==='transfer'?'bg-yellow-500 text-black':'bg-black text-zinc-400'}`}>銀行轉帳</button>
               {paidStep==='transfer' && <div className="bg-black/40 p-5 rounded-2xl border border-yellow-500/20 text-zinc-300 text-sm font-bold leading-relaxed italic">渣打銀行 (052) 帳號: 12220000471580</div>}
               <button onClick={()=>setPaidStep('card')} className={`w-full py-5 rounded-2xl font-black ${paidStep==='card'?'bg-yellow-500 text-black':'bg-black text-zinc-400'}`}>線上刷卡 (須加 3%)</button>
               {paidStep==='card' && <a href={links[currentPrice]} target="_blank" className="bg-white text-black py-5 rounded-2xl font-black block hover:bg-yellow-500">前往支付</a>}
            <div className="w-full bg-zinc-900 border-2 border-yellow-500 p-8 rounded-[40px] shadow-2xl mt-4 animate-in zoom-in-95 space-y-8 text-center text-white">
               <div className="flex flex-col items-center">
                  <div className="text-yellow-500 mb-2"><SvgCheck /></div>
                  <h3 className="text-xl font-black italic uppercase">待付款單成立</h3>
                  <p className="text-3xl font-black italic mt-2">${currentPrice} TWD</p>
               </div>
               <div className="space-y-4">
                  <button onClick={() => setPaidStep('transfer')} className={`w-full py-5 rounded-2xl font-black ${paidStep === 'transfer' ? 'bg-yellow-500 text-black shadow-xl' : 'bg-black text-zinc-400'}`}>銀行轉帳</button>
                  {paidStep === 'transfer' && (
                    <div className="bg-black/40 border border-yellow-500/20 p-6 rounded-[30px] animate-in slide-in-from-top-4">
                       <p className="text-zinc-300 text-base font-bold leading-relaxed tracking-wider italic">渣打銀行 (052)<br/>帳號: <span className="text-white">12220000471580</span></p>
                    </div>
                  )}
                  <button onClick={() => setPaidStep('card')} className={`w-full py-5 rounded-2xl font-black ${paidStep === 'card' ? 'bg-yellow-500 text-black shadow-xl' : 'bg-black text-zinc-400'}`}>線上刷卡 (須加 3%)</button>
                  {paidStep === 'card' && (
                    <div className="space-y-4 animate-in slide-in-from-top-4">
                      <p className="text-red-500 text-sm font-black animate-pulse">⚠️ 刷卡須另加收 3% 手續費</p>
                      <a href={links[currentPrice]} target="_blank" className="bg-white text-black py-5 rounded-2xl font-black block hover:bg-yellow-500 shadow-xl italic uppercase">前往支付</a>
                    </div>
                  )}
                  <button onClick={copySummary} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg">📋 複製明細回報老皮</button>
               </div>
            </div>
          )}
          <div className="flex justify-center w-full py-10"><button onClick={()=> {setPage('home'); setPaidStep('none');}} className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black">回上一頁</button></div>
          <div className="flex justify-center w-full py-10">
            <button onClick={() => {setPage('home'); setPaidStep('none');}} className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black active:scale-95 transition-all">返回首頁</button>
          </div>
        </div>
      </Layout>
    );
  }

  return null;
}
