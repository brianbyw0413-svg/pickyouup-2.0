import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Landmark, CreditCard, Zap, ChevronLeft } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState('home'); 
  const [carType, setCarType] = useState(''); 
  const [mode, setMode] = useState(''); 
  const [paidStep, setPaidStep] = useState('none'); 
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

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
      <div className="w-full max-w-[480px] flex flex-col items-center relative z-10 font-sans">
        {children}
      </div>
    </div>
  );

  if (page === 'home') {
    return (
      <Layout>
        {/* 修正後的導航標題 */}
        <nav className="w-full py-6 mb-12 flex justify-center border-b border-white/5">
           <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-500 p-1 rounded text-black"><Truck size={18} strokeWidth={3}/></div>
                <h1 className="text-xl font-black italic tracking-tighter text-yellow-500 uppercase">PickYouUP.tw</h1>
              </div>
              <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">您接送機的好伙伴</p>
           </div>
        </nav>
        <div className="w-full text-center space-y-6 animate-in fade-in duration-1000 px-4">
          <h2 className="text-[11vw] md:text-6xl font-black italic mb-16 tracking-tighter leading-tight uppercase italic">快速預約<br/><span className="text-yellow-500">專業接送</span></h2>
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

  // --- 頁面 2 與 頁面 3 代碼維持之前修正後的完美邏輯 (略) ---
  // (此處內容與上一版本一致，僅更新導航頭部與標語)
  // [此處省略頁面 2 & 3 的代碼，請繼續沿用上一版本]
  
  return null; // (實作時請貼上完整的 page === 'choice' 與 page === 'form' 區塊)
}
