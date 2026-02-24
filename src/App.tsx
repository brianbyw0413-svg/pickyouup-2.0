import React, { useState, useEffect } from 'react';

// --- 內建圖示組件 (零外部依賴，保證絕不全黑) ---
const IconTruck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconCheck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const IconLandmark = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="21" x2="21" y2="21"></line><line x1="3" y1="10" x2="21" y2="10"></line><polyline points="5 21 5 10 12 3 19 10 19 21"></polyline><line x1="9" y1="21" x2="9" y2="14"></line><line x1="15" y1="21" x2="15" y2="14"></line></svg>;
const IconCard = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;

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

  // --- 通用佈局 (RWD) ---
  const Layout = ({ children }) => (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8 flex flex-col items-center overflow-x-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="w-full max-w-[480px] flex flex-col items-center relative z-10 font-sans">
        {children}
      </div>
    </div>
  );

  // --- 返回按鈕 (極簡文字反黃版) ---
  const BackButton = () => (
    <div className="flex justify-center w-full py-10">
      <button 
        onClick={() => window.history.back()} 
        className="px-10 py-3 rounded-full text-white font-black tracking-widest text-lg uppercase transition-all hover:bg-yellow-500 hover:text-black active:bg-yellow-500 active:text-black active:scale-95 border border-white/10 bg-zinc-900/50 shadow-lg"
      >
        回上一頁
      </button>
    </div>
  );

  // --- 首頁 ---
  if (page === 'home') {
    return (
      <Layout>
        <nav className="w-full py-6 mb-12 flex justify-center border-b border-white/5">
           <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-500 p-1 rounded text-black"><IconTruck /></div>
                <h1 className="text-xl font-black italic tracking-tighter text-yellow-500 uppercase">PickYouUP.tw</h1>
              </div>
              <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">您接送機的好伙伴</p>
           </div>
        </nav>
        <div className="w-full text-center space-y-6 animate-in fade-in duration-1000">
          <h2 className="text-[11vw] md:text-6xl font-black italic mb-16 tracking-tighter leading-tight uppercase italic">快速預約<br/><span className="text-yellow-500">專業接送</span></h2>
          <div className="space-y-4 px-2">
            <button onClick={() => { setMode('dropoff'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black active:bg-yellow-500 active:text-black py-8 md:py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl active:scale-95">我要送機</button>
            <button onClick={() => { setMode('pickup'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black active:bg-yellow-500 active:text-black py-8 md:py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl active:scale-95">我要接機</button>
            <button onClick={() => { setMode('both'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black active:bg-yellow-500 active:text-black py-8 md:py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl active:scale-95">接送一併預訂</button>
          </div>
          <p className="text-zinc-600 text-[10px] mt-24 font-black uppercase tracking-[0.4em]">Premium Service since 2026</p>
        </div>
      </Layout>
    );
  }

  // --- 車種選擇頁 ---
  if (page === 'choice') {
    return (
      <Layout>
        <h2 className="mt-6 mb-10 text-[9vw] md:text-5xl font-black italic text-yellow-500 tracking-widest text-center uppercase leading-none">
            {mode === 'pickup' ? '接機服務' : mode === 'dropoff' ? '送機服務' : '來回接送'}
        </h2>
        <div className="w-full space-y-4 px-2">
          <button onClick={() => { setCarType('small'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 md:p-10 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black active:bg-yellow-500 active:text-black transition-all group shadow-xl">
             <p className="text-2xl font-black mb-1 group-hover:text-black">小車直達 (5人座)</p>
             <p className="text-white text-[11px] md:text-sm font-bold group-hover:text-black/70 text-left">乘客1-4人/行李1-3件/直達無加點/無其他需求</p>
          </button>
          <button onClick={() => { setCarType('large'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 md:p-10 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black active:bg-yellow-500 active:text-black transition-all group shadow-xl">
             <p className="text-2xl font-black mb-1 group-hover:text-black">大車直達 (9人座)</p>
             <p className="text-white text-[11px] md:text-sm font-bold group-hover:text-black/70 text-left">乘客5-8人/行李1-8件/直達無加點/無其他需求</p>
          </button>
          <a href="https://line.me/ti/p/~@085qitid" target="_blank" className="w-full bg-zinc-900 border border-zinc-800 p-8 md:p-10 rounded-[40px] text-left block hover:bg-yellow-500 hover:text-black active:bg-yellow-500 active:text-black transition-all group shadow-xl">
             <p className="text-2xl font-black mb-1 group-hover:text-black italic">我真的不確定...</p>
             <p className="text-white text-[11px] md:text-sm font-bold group-hover:text-black/70 italic leading-relaxed text-left">我有其他需求 / 加點上下車 / 舉牌 / 安全座椅等</p>
          </a>
          <BackButton />
        </div>
      </Layout>
    );
  }

  // --- 資料填寫頁 ---
  if (page === 'form') {
    return (
      <Layout>
        <div className="w-full mt-4 space-y-6 pb-24 px-2">
          {/* 置頂高級告示板 */}
          <div className="w-full bg-zinc-900/80 border border-yellow-500/20 rounded-[30px] p-6 mb-8 flex items-start gap-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4">
            <div className="bg-yellow-500/10 p-3 rounded-2xl text-yellow-500 shrink-0"><IconAlert /></div>
            <div className="text-left">
              <p className="text-white text-[15px] md:text-lg font-bold leading-relaxed tracking-tight">
                此選項對應 <span className="text-yellow-500 font-black">{carType === 'small' ? '乘客1-4人，行李1-3件內' : '乘客1-8人，行李1-8件內'}</span>。<br/>
                如果您無法確認細項，請回到上一頁並點選<span className="text-yellow-500 underline underline-offset-4 decoration-white/20 font-black ml-1">「我真的不能確認」</span>按鍵，讓客服人員來幫助您：）
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-8">
            <h2 className="text-3xl font-black italic text-yellow-500 mb-2 uppercase tracking-widest text-center italic underline underline-offset-8 decoration-zinc-800 font-black">預約詳情</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                 <p className="text-base font-bold text-white ml-5 uppercase tracking-widest">聯絡資訊</p>
                 <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} type="text" placeholder="聯絡人姓名" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
                 <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} type="text" placeholder="聯絡電話" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
              </div>
              {(mode === 'dropoff' || mode === 'both') && (
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <p className="text-base font-bold text-yellow-500 ml-5 uppercase tracking-widest">送機行程 (出發)</p>
                  <input type="date" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="time" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
                    <input type="text" placeholder="航班" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
                  </div>
                  <input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} type="text" placeholder="上車地址" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
                </div>
              )}
              {(mode === 'pickup' || mode === 'both') && (
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <p className="text-base font-bold text-yellow-500 ml-5 uppercase tracking-widest">接機行程 (回程)</p>
                  <input type="date" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
                  <input type="text" placeholder="降落航班" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
                  <input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} type="text" placeholder="下車地址" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none" />
                </div>
              )}
            </div>
            {paidStep === 'none' && (
              <button onClick={() => setPaidStep('choice')} className="w-full mt-10 bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 active:scale-95 shadow-xl font-black uppercase italic">確認並支付</button>
            )}
          </div>

          {/* 付款詳情 */}
          {paidStep !== 'none' && (
            <div className="w-full bg-zinc-900 border-2 border-yellow-500 p-8 rounded-[40px] shadow-2xl mt-4 animate-in zoom-in-95 duration-500 space-y-8 text-center">
               <div className="flex flex-col items-center">
                  <div className="text-yellow-500 mb-2"><IconCheck /></div>
                  <h3 className="text-xl font-black italic uppercase">待付款單成立</h3>
                  <p className="text-white text-3xl font-black italic mt-2">${currentPrice.price} TWD</p>
               </div>
               <div className="space-y-4">
                  <p className="text-white text-sm font-black uppercase tracking-widest italic mb-2 font-bold">請選擇支付方式</p>
                  <button onClick={() => setPaidStep('transfer')} className={`w-full py-5 rounded-2xl font-black transition-all ${paidStep === 'transfer' ? 'bg-yellow-500 text-black shadow-xl' : 'bg-black border border-zinc-800 text-zinc-400 hover:text-white'}`}>銀行轉帳</button>
                  {paidStep === 'transfer' && (
                    <div className="bg-black/40 border border-yellow-500/20 p-6 rounded-[30px] animate-in slide-in-from-top-4">
                       <p className="text-zinc-300 text-base font-bold leading-relaxed text-center">渣打銀行 (052)<br/>帳號: <span className="text-white font-mono text-lg tracking-wider">12220000471580</span></p>
                    </div>
                  )}
                  <button onClick={() => setPaidStep('card')} className={`w-full py-5 rounded-2xl font-black transition-all ${paidStep === 'card' ? 'bg-yellow-500 text-black shadow-xl' : 'bg-black border border-zinc-800 text-zinc-400 hover:text-white'}`}>線上刷卡 (須加 3%)</button>
                  {paidStep === 'card' && (
                    <div className="space-y-4 animate-in slide-in-from-top-4 text-center">
                      <p className="text-red-500 text-sm font-black animate-pulse uppercase font-black italic">⚠️ 刷卡須另加收 3% 手續費</p>
                      <a href={currentPrice.link} target="_blank" className="bg-white text-black py-5 rounded-2xl font-black block hover:bg-yellow-500 shadow-xl transition-all font-black uppercase italic">前往支付</a>
                    </div>
                  )}
               </div>
            </div>
          )}
          <BackButton />
        </div>
      </div>
    );
  }
  return null;
}
