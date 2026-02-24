import React, { useState, useEffect } from 'react';

// --- 內建圖示組件 ---
const IconTruck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconZap = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

export default function App() {
  const [page, setPage] = useState('home'); 
  const [formData, setFormData] = useState({ date: '', flight: '', name: '', phone: '', address: '', returnDate: '', returnFlight: '' });

  // 偵測掃碼直達
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'quick') setPage('quick-warning');
  }, []);

  // 通用的按鈕樣式
  const largeButtonClass = "w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black active:bg-yellow-500 active:text-black py-8 rounded-[40px] font-black text-xl shadow-xl transition-all duration-300 transform active:scale-95 text-center flex items-center justify-center";

  // --- 頁面 A：純淨首頁 ---
  if (page === 'home') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white font-sans p-6 flex flex-col items-center">
        <nav className="w-full max-w-md py-8 mb-12 flex justify-center border-b border-white/5">
          <h1 className="text-xl font-black italic tracking-tighter text-yellow-500">PickYouUP 2.0</h1>
        </nav>
        <div className="w-full max-w-md space-y-6 text-center animate-in fade-in duration-700">
          <h2 className="text-4xl font-black italic mb-12 tracking-tighter leading-tight">從從容容，<br/><span className="text-yellow-500 text-5xl">遊刃有餘。</span></h2>
          <button onClick={() => setPage('pickup-form')} className={largeButtonClass}>我要接機</button>
          <button onClick={() => setPage('dropoff-form')} className={largeButtonClass}>我要送機</button>
          <button onClick={() => setPage('round-trip-form')} className={largeButtonClass}>接送一併預訂</button>
          <p className="text-zinc-600 text-[10px] mt-16 font-black uppercase tracking-[0.4em]">Premium Service since 2026</p>
        </div>
      </div>
    );
  }

  // --- 頁面 B：快速接機警告 (UBER 攔截模式) ---
  if (page === 'quick-warning') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] p-6 flex flex-col items-center justify-center animate-in zoom-in-95">
        <div className="w-full max-w-md bg-zinc-900 border border-yellow-500/30 p-10 rounded-[50px] shadow-2xl text-center">
          <h3 className="text-3xl font-black mb-6 italic text-yellow-500">您正在 UBER 上嗎？</h3>
          <p className="text-zinc-300 leading-relaxed font-medium mb-12 text-lg">
            「去的時候載得下，<br/>回來的時候我們就接得了：）」<br/><br/>
            <span className="text-zinc-500 text-sm italic">確認回程人數與行李相同，<br/>小弟立刻幫您排車！汪！🐶</span>
          </p>
          <button onClick={() => setPage('pickup-form')} className="w-full bg-white text-black py-6 rounded-[30px] font-black text-xl hover:bg-yellow-500 transition-all active:scale-95">我確認回程人數相同</button>
          <button onClick={() => setPage('home')} className="mt-8 text-zinc-600 font-bold block w-full">返回首頁</button>
        </div>
      </div>
    );
  }

  // --- 頁面 C：功能性表單 (通用框架) ---
  const FormHeader = ({ title }) => (
    <div className="w-full max-w-md py-6 flex justify-between items-center mb-8">
      <h2 className="text-2xl font-black italic text-yellow-500">{title}</h2>
      <button onClick={() => setPage('home')} className="text-zinc-500 text-xs font-bold">取消</button>
    </div>
  );

  const Input = ({ placeholder, type = "text" }) => (
    <input type={type} placeholder={placeholder} className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white outline-none focus:border-yellow-500 transition-all placeholder:text-zinc-700 font-bold shadow-inner" />
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans p-6 flex flex-col items-center animate-in slide-in-from-right-4">
      <FormHeader title={page === 'pickup-form' ? '接機預約' : page === 'dropoff-form' ? '送機預約' : '接送一併預訂'} />
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-4">
        
        {/* 動態顯示對應欄位 */}
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">基本資料</p>
        <Input placeholder="聯絡人姓名" />
        <Input placeholder="聯絡電話" />
        
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 mt-6">行程資訊</p>
        <div className="flex gap-2">
           <Input type="date" />
           <Input type="text" placeholder="航班編號" />
        </div>
        <Input placeholder={page === 'pickup-form' ? "下車完整地址" : "上車完整地址"} />

        {page === 'round-trip-form' && (
          <div className="pt-6 space-y-4 border-t border-zinc-800 mt-6">
            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest ml-2">回程資訊 (接機)</p>
            <div className="flex gap-2">
               <Input type="date" />
               <Input type="text" placeholder="回程航班" />
            </div>
            <Input placeholder="回程下車地址" />
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-zinc-800 flex justify-between items-center">
           <div className="text-left">
              <p className="text-[9px] font-black text-zinc-500 uppercase">預估車資</p>
              <p className="text-3xl font-black italic text-white">$1,300</p>
           </div>
           <button onClick={() => alert('汪！功能開發中，下一步對接資料庫！')} className="bg-yellow-500 text-black px-10 py-5 rounded-[24px] font-black text-lg hover:bg-yellow-400 transition-all shadow-xl active:scale-95">
             立即預約
           </button>
        </div>
      </div>
    </div>
  );
}
