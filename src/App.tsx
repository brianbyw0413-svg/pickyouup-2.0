import React, { useState } from 'react';

const IconTruck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;

export default function App() {
  const [page, setPage] = useState('home'); 
  const [carType, setCarType] = useState(''); // small, large
  const [mode, setMode] = useState(''); // pickup, dropoff
  const [paid, setPaid] = useState(false);

  const pricing = {
    'small-dropoff': { price: 1200, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/PN8Fwvsnm1m7AdiVeUUp' },
    'large-dropoff': { price: 1500, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/NqKaoMvyeJt1m3oRLyVy' },
    'small-pickup': { price: 1300, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/N42KcEIcfxs3YbqIOlCq' },
    'large-pickup': { price: 1600, link: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/mFSjuWEYtktw9pT53lXi' }
  };

  const currentPrice = pricing[`${carType}-${mode}`] || { price: 0, link: '#' };

  if (page === 'home') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white p-6 flex flex-col items-center">
        <h1 className="mt-10 mb-20 text-xl font-black italic tracking-tighter text-yellow-500">PickYouUP 2.0</h1>
        <div className="w-full max-w-md space-y-6">
          <button onClick={() => { setMode('dropoff'); setPage('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 py-10 rounded-[40px] font-black text-2xl hover:bg-yellow-500 hover:text-black transition-all active:scale-95 shadow-xl">我要送機</button>
          <button onClick={() => { setMode('pickup'); setPage('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 py-10 rounded-[40px] font-black text-2xl hover:bg-yellow-500 hover:text-black transition-all active:scale-95 shadow-xl">我要接機</button>
          <button className="w-full bg-zinc-900 border border-zinc-800 py-10 rounded-[40px] font-black text-2xl opacity-40 shadow-xl">接送一併預訂</button>
        </div>
      </div>
    );
  }

  if (page === 'choice') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white p-6 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-500">
        <h2 className="mt-10 mb-12 text-2xl font-black italic text-yellow-500 tracking-widest text-center">
            {mode === 'pickup' ? '接機服務選擇' : '送機服務選擇'}
        </h2>
        <div className="w-full max-w-md space-y-4 text-center">
          <button onClick={() => { setCarType('small'); setPage('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:border-yellow-500 transition-all group shadow-xl">
             <p className="text-2xl font-black mb-1 group-hover:text-yellow-500">小車直達 (5人座)</p>
             <p className="text-zinc-500 text-xs font-bold uppercase">乘客 1-4 人 / 行李 3 件內</p>
          </button>
          <button onClick={() => { setCarType('large'); setPage('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:border-yellow-500 transition-all group shadow-xl">
             <p className="text-2xl font-black mb-1 group-hover:text-yellow-500">大車直達 (九人座)</p>
             <p className="text-zinc-500 text-xs font-bold uppercase">乘客 1-6 人 / 行李 6 件內</p>
          </button>
          <a href={`https://line.me/R/ti/p/@085qitid?msg=【老皮我需要人工報價】我是${mode==='pickup'?'接機':'送機'}不確定車種`} target="_blank" className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left block hover:border-blue-500 transition-all group shadow-xl">
             <p className="text-2xl font-black mb-1 group-hover:text-blue-400 italic">我真的不確定...</p>
             <p className="text-zinc-500 text-[10px] font-medium leading-relaxed">我不能確定車型 / 我有其他需求 / 加點上下車 / 舉牌 / 安全座椅等</p>
          </a>
          <button onClick={() => setPage('home')} className="text-zinc-600 font-bold py-6">⬅️ 返回首頁</button>
        </div>
      </div>
    );
  }

  if (page === 'form') {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white p-6 flex flex-col items-center animate-in slide-in-from-right-4 duration-500">
        <div className="w-full max-w-md mt-10 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl">
            <h2 className="text-2xl font-black italic text-yellow-500 mb-8 uppercase tracking-widest text-center">預約詳情</h2>
            <div className="space-y-4">
               <input type="date" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
               <input type="text" placeholder="航班編號 (例如: JX58)" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
               <input type="text" placeholder={mode === 'pickup' ? "下車完整地址" : "上車完整地址"} className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
               <input type="text" placeholder="聯絡人姓名" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
               <input type="text" placeholder="聯絡電話" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500" />
            </div>
            <button onClick={() => setPaid(true)} className="w-full mt-8 bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400 active:scale-95 shadow-xl shadow-yellow-500/20">確認預約</button>
          </div>
          
          {paid && (
            <div className="bg-zinc-900 border-2 border-yellow-500 p-8 rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300">
               <h3 className="text-xl font-black mb-4">預約已成立 (待付款) 汪！🐶</h3>
               <p className="text-zinc-400 text-xs mb-8 italic leading-relaxed">請選擇以下方式完成支付，金額為 <span className="text-white font-black">${currentPrice.price}</span> 元：</p>
               
               <div className="space-y-4">
                  <div className="bg-black p-6 rounded-3xl border border-zinc-800">
                     <p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-2">銀行轉帳 (免手續費)</p>
                     <p className="text-sm font-bold text-zinc-300">渣打銀行 (052)<br/>帳號: 12220000471580</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-red-400 text-[10px] font-black text-center animate-pulse">⚠️ 提醒：使用線上刷卡須另加收 3% 手續費</p>
                    <a href={currentPrice.link} target="_blank" className="bg-white text-black py-5 rounded-2xl font-black text-center block hover:bg-yellow-500 transition-colors shadow-lg">
                       💳 線上刷卡 (須加 3% 手續費)
                    </a>
                  </div>
               </div>
               <p className="text-center text-[10px] text-zinc-600 mt-8 font-bold leading-relaxed">付款完成後，請務必將【轉帳後五碼】或【刷卡成功截圖】回傳至 LINE 官方帳號以便對帳。汪！✨</p>
            </div>
          )}
          <button onClick={() => {setPage('home'); setPaid(false);}} className="w-full text-zinc-600 font-bold py-6">⬅️ 返回首頁</button>
        </div>
      </div>
    );
  }

  return null;
}
