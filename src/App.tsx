import React, { useState, useEffect } from 'react';
import { Truck, Plane, Zap, ShieldCheck, ChevronLeft } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState('home'); 
  const [carType, setCarType] = useState(''); 
  const [mode, setMode] = useState(''); 
  const [paid, setPaid] = useState(false);

  const pricing = {
    'small-dropoff': { price: 1200, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/PN8Fwvsnm1m7AdiVeUUp' },
    'large-dropoff': { price: 1500, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/NqKaoMvyeJt1m3oRLyVy' },
    'small-pickup': { price: 1300, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/N42KcEIcfxs3YbqIOlCq' },
    'large-pickup': { price: 1600, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/mFSjuWEYtktw9pT53lXi' }
  };

  const currentPrice = pricing[`${carType}-${mode}`] || { price: 0, link: '#' };

  // --- 處理瀏覽器回退與前進邏輯 (Android/iOS 側滑支援) ---
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

  // 通用的排版容器 (RWD 核心)
  const Container = ({ children }) => (
    <div className="w-full max-w-[500px] flex flex-col items-center animate-in fade-in duration-700 px-4 md:px-0">
      {children}
    </div>
  );

  // --- 頁面 1：強而有力的旗艦首頁 ---
  if (page === 'home') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white p-6 flex flex-col items-center relative overflow-hidden">
        {/* 背景氛圍光 */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        
        <nav className="w-full max-w-md py-8 mb-12 flex justify-center border-b border-white/5 relative z-10">
           <div className="flex items-center gap-2">
              <div className="bg-yellow-500 p-1.5 rounded-lg text-black shadow-lg shadow-yellow-500/20"><Truck size={20} strokeWidth={3}/></div>
              <h1 className="text-xl font-black italic tracking-tighter">PickYouUP 2.0</h1>
           </div>
        </nav>
        
        <Container>
          <h2 className="text-4xl md:text-5xl font-black italic mb-16 tracking-tighter leading-tight text-center">
             快速預約<br/><span className="text-yellow-500 text-5xl md:text-6xl">專業接送</span>
          </h2>
          <div className="w-full space-y-5">
            <button onClick={() => { setMode('dropoff'); navigateTo('choice'); }} className="w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:border-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl shadow-2xl transition-all active:scale-95">我要送機</button>
            <button onClick={() => { setMode('pickup'); navigateTo('choice'); }} className="w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:border-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl shadow-2xl transition-all active:scale-95">我要接機</button>
            <button className="w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 py-10 rounded-[40px] font-black text-2xl opacity-40 shadow-xl cursor-not-allowed">接送一併預訂</button>
          </div>
          <p className="text-zinc-600 text-[10px] mt-24 font-black uppercase tracking-[0.4em] text-center">Premium Service since 2026</p>
        </Container>
      </div>
    );
  }

  // --- 頁面 2：服務分流層 ---
  if (page === 'choice') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white p-6 flex flex-col items-center">
        <h2 className="mt-10 mb-12 text-2xl font-black italic text-yellow-500 tracking-widest text-center uppercase">{mode === 'pickup' ? '接機服務' : '送機服務'}</h2>
        <Container>
          <div className="w-full space-y-4">
            <button onClick={() => { setCarType('small'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:border-yellow-500 transition-all group shadow-xl">
               <p className="text-2xl font-black mb-1 group-hover:text-yellow-500">小車直達 (5人座)</p>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">乘客 1-4 人 / 行李 3 件內</p>
            </button>
            <button onClick={() => { setCarType('large'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:border-yellow-500 transition-all group shadow-xl">
               <p className="text-2xl font-black mb-1 group-hover:text-yellow-500">大車直達 (九人座)</p>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">乘客 1-6 人 / 行李 6 件內</p>
            </button>
            <a href="https://line.me/ti/p/~@085qitid" target="_blank" className="w-full bg-zinc-900/50 border border-zinc-800 p-8 rounded-[40px] text-left block hover:border-blue-500 transition-all group shadow-xl relative overflow-hidden">
               <p className="text-2xl font-black mb-1 group-hover:text-blue-400 italic">我真的不確定...</p>
               <p className="text-zinc-500 text-[10px] font-medium leading-relaxed">我不能確定車型 / 我有其他需求 / 加點上下車 / 舉牌 / 安全座椅等</p>
            </a>
            <button onClick={() => window.history.back()} className="w-full text-zinc-600 font-black py-8 tracking-widest text-xs uppercase text-center">⬅️ 返回上一步</button>
          </div>
        </Container>
      </div>
    );
  }

  // --- 頁面 3：資料填寫與付款 ---
  if (page === 'form') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white p-6 flex flex-col items-center overflow-y-auto">
        <Container>
          <div className="mt-6 mb-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-center w-full">
            <p className="text-white text-[13px] font-bold leading-relaxed">
              {carType === 'small' ? '乘客 1-4 人 / 行李 3 件內' : '乘客 1-6 人 / 行李 6 件內'}，<br/>
              不確定請回上頁點選<span className="text-yellow-500">「我真的不能確定」</span>。
            </p>
          </div>

          <div className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-6">
            <h2 className="text-2xl font-black italic text-yellow-500 mb-4 uppercase tracking-widest text-center">預約詳情</h2>
            <div className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-zinc-500 uppercase ml-4 tracking-widest">日期</label>
                 <input type="date" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-all appearance-none" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-zinc-500 uppercase ml-4 tracking-widest">航班編號</label>
                 <input type="text" placeholder="例如: CI58" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-all" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-zinc-500 uppercase ml-4 tracking-widest">{mode === 'pickup' ? '下車地址' : '上車地址'}</label>
                 <input type="text" placeholder="完整的街道地址" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-all" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-4 tracking-widest">聯絡人</label>
                    <input type="text" placeholder="王先生" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-4 tracking-widest">電話</label>
                    <input type="text" placeholder="0912..." className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-all" />
                  </div>
               </div>
            </div>
            <button onClick={() => setPaid(true)} className="w-full mt-6 bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 active:scale-95 shadow-xl shadow-yellow-500/20 transition-all">確認並支付</button>
          </div>

          {paid && (
            <div className="w-full bg-zinc-900 border-2 border-yellow-500 p-8 rounded-[40px] shadow-2xl mt-8 animate-in zoom-in-95 duration-500">
               <div className="flex items-center gap-3 text-yellow-500 mb-6 justify-center">
                  <ShieldCheck size={28}/>
                  <h3 className="text-xl font-black italic uppercase">待付款訂單成立</h3>
               </div>
               <p className="text-zinc-400 text-xs mb-8 italic text-center leading-relaxed font-bold uppercase tracking-widest">應付金額：<span className="text-white text-3xl font-black italic block mt-2">${currentPrice.price} TWD</span></p>
               <div className="space-y-5">
                  <div className="bg-black p-6 rounded-3xl border border-zinc-800 text-center relative">
                     <p className="text-yellow-500 text-[10px] font-black uppercase mb-2 tracking-[0.2em] font-bold">銀行轉帳 (免手續費)</p>
                     <p className="text-lg font-bold text-zinc-300 leading-relaxed font-mono">渣打銀行 (052)<br/>12220000471580</p>
                  </div>
                  <div className="space-y-2 pt-4">
                    <p className="text-red-500 text-[10px] font-black text-center animate-pulse tracking-widest uppercase">⚠️ 線上刷卡須另加收 3% 手續費</p>
                    <a href={currentPrice.link} target="_blank" className="bg-white text-black py-6 rounded-3xl font-black text-lg text-center block hover:bg-yellow-500 transition-all shadow-2xl active:scale-95">💳 刷卡支付 (+3%)</a>
                  </div>
               </div>
               <p className="text-center text-[10px] text-zinc-600 mt-10 font-bold leading-relaxed uppercase tracking-widest italic">付款後請回傳截圖對帳。汪！✨</p>
            </div>
          )}
          
          <button onClick={() => window.history.back()} className="w-full text-zinc-600 font-black py-10 uppercase tracking-widest text-xs flex items-center justify-center gap-2 group">
            <div className="text-yellow-500 group-hover:scale-125 transition-transform"><ChevronLeft size={18} strokeWidth={3}/></div>
            返回上一頁
          </button>
        </Container>
      </div>
    );
  }

  return null;
}
