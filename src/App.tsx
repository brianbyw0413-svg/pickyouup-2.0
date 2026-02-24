import React, { useState, useEffect } from 'react';

// --- 內建圖示，確保不全黑 ---
const IconTruck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;

export default function App() {
  const [page, setPage] = useState('home'); 
  const [isQuickMode, setIsQuickMode] = useState(false);

  // 偵測掃碼直達
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'quick') {
      setIsQuickMode(true);
      setPage('quick-warning');
    }
  }, []);

  // --- 頁面：正式首頁 ---
  if (page === 'home') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white font-sans p-6 flex flex-col items-center">
        <nav className="w-full max-w-md py-6 border-b border-white/5 mb-20 flex justify-center">
          <h1 className="text-xl font-black italic tracking-tighter text-yellow-500">PickYouUP 2.0</h1>
        </nav>
        <div className="w-full max-w-md space-y-4 text-center">
          <h2 className="text-4xl font-black italic mb-12 tracking-tighter">從從容容，<br/>遊刃有餘。</h2>
          <button onClick={() => setPage('pickup-form')} className="w-full bg-zinc-900 border border-zinc-800 py-8 rounded-[40px] font-black text-xl shadow-xl transition-all active:scale-95">我要接機</button>
          <button className="w-full bg-zinc-900 border border-zinc-800 py-8 rounded-[40px] font-black text-xl shadow-xl opacity-40">我要送機</button>
          <button className="w-full bg-zinc-900 border border-zinc-800 py-8 rounded-[40px] font-black text-xl shadow-xl opacity-40">接送一併預訂</button>
        </div>
      </div>
    );
  }

  // --- 頁面：一般接機資料填寫 ---
  if (page === 'pickup-form') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white font-sans p-6 flex flex-col items-center animate-in slide-in-from-right-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl mt-10">
          <h2 className="text-2xl font-black mb-8 italic text-yellow-500">預約接機資料</h2>
          <div className="space-y-4">
            <input type="date" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-yellow-500" placeholder="降落日期" />
            <input type="text" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-yellow-500" placeholder="航班編號 (例如: CI58)" />
            <input type="text" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-yellow-500" placeholder="聯絡人姓名" />
            <input type="text" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-yellow-500" placeholder="下車完整地址" />
          </div>
          <button onClick={() => alert('汪！資料已暫存，開發中...')} className="w-full mt-8 bg-yellow-500 text-black py-5 rounded-[24px] font-black text-lg">下一步</button>
          <button onClick={() => setPage('home')} className="w-full mt-4 text-zinc-600 text-xs font-bold">返回首頁</button>
        </div>
      </div>
    );
  }

  // --- 頁面：快速接機警告 ( mode=quick 專屬 ) ---
  if (page === 'quick-warning') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white font-sans p-6 flex flex-col items-center">
        <div className="w-full max-w-md bg-zinc-900 border border-yellow-500/30 p-10 rounded-[50px] shadow-2xl text-center mt-20 animate-in zoom-in-95">
          <h3 className="text-2xl font-black mb-6 italic text-yellow-500 text-center">您正在 UBER 上嗎？</h3>
          <p className="text-zinc-300 leading-relaxed font-medium mb-12">
            「去的時候載得下，<br/>回來的時候我們就接得了：）」<br/><br/>
            <span className="text-zinc-500 text-sm">只要確認回程人數與行李相同，<br/>小弟立刻幫您排車！汪！🐶</span>
          </p>
          <button onClick={() => setPage('pickup-form')} className="w-full bg-white text-black py-6 rounded-[30px] font-black text-lg">我確認資訊相同</button>
        </div>
      </div>
    );
  }

  return null;
}
