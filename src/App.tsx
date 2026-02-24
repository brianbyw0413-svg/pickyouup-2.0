import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 環境變數配置
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vtvytcrkoqbluvczyepm.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_SOp1vthQKdTdQUwoHsMIQA_FCTxzbie';
const API_BASE = import.meta.env.VITE_API_BASE || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============ 圖示元件 ============
const SvgCheck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const SvgCopy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const SvgLoading = () => (
  <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path>
  </svg>
);

const SvgError = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

// ============ 布局元件 ============
const Layout = ({ children }) => (
  <div className="min-h-screen bg-[#0a0a0c] text-white p-4 flex flex-col items-center overflow-x-hidden relative font-sans">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
    <div className="w-full max-w-[480px] relative z-10">{children}</div>
  </div>
);

// ============ 驗證函數 ============
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^09\d{8}$/;
  return phoneRegex.test(phone);
};

const validateName = (name: string): boolean => {
  return name.trim().length > 0;
};

const validateDate = (date: string): boolean => {
  if (!date) return false;
  const orderDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return orderDate >= today;
};

interface FormErrors {
  name?: string;
  phone?: string;
  date?: string;
  address?: string;
  flight?: string;
}

const validateForm = (form: { name: string; phone: string; date: string; address: string; flight?: string }): FormErrors => {
  const errors: FormErrors = {};
  
  if (!validateName(form.name)) {
    errors.name = '請輸入姓名';
  }
  
  if (!form.phone) {
    errors.phone = '請輸入電話';
  } else if (!validatePhone(form.phone)) {
    errors.phone = '電話格式錯誤，請輸入 09 開頭的 10 位數字';
  }
  
  if (!form.date) {
    errors.date = '請選擇日期';
  } else if (!validateDate(form.date)) {
    errors.date = '日期不能是過去日期';
  }
  
  if (!form.address?.trim()) {
    errors.address = '請輸入地址';
  }
  
  return errors;
};

// ============ 主元件 ============
export default function App() {
  const [page, setPage] = useState('home');
  const [carType, setCarType] = useState('');
  const [mode, setMode] = useState('');
  const [paidStep, setPaidStep] = useState('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bothStep, setBothStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // 表單錯誤狀態
  const [dropoffErrors, setDropoffErrors] = useState<FormErrors>({});
  const [pickupErrors, setPickupErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const [dropoffForm, setDropoffForm] = useState({ name: '', phone: '', address: '', date: '', time: '', flight: '' });
  const [pickupForm, setPickupForm] = useState({ name: '', phone: '', address: '', date: '', time: '', flight: '' });

  const pricing: Record<string, number> = { 'small-dropoff': 1200, 'large-dropoff': 1500, 'small-pickup': 1300, 'large-pickup': 1600, 'small-both': 2500, 'large-both': 3100 };

  const creditCardLinks: Record<number, string> = {
    1200: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/PN8Fwvsnm1m7AdiVeUUp',
    1300: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/N42KcEIcfxs3YbqIOlCq',
    1500: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/NqKaoMvyeJt1m3oRLyVy',
    1600: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/mFSjuWEYtktw9pT53lXi',
    2500: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/0Ki81I3Knx9BgjqN8x1T',
    3100: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/p641ccGnWnzu7JpJ5YDX',
  };

  const getCreditCardLink = (amount: number) => creditCardLinks[amount] || creditCardLinks[1200];
  
  const isFormComplete = (m: string, f: typeof dropoffForm) => { 
    const common = f.name && f.phone && f.address && f.date && f.flight; 
    return m === 'dropoff' ? common && f.time : common; 
  };
  
  const getSubTotal = (m: string, form: typeof dropoffForm) => { 
    if (!isFormComplete(m, form)) return 0; 
    return pricing[`${carType}-${m}`] || 0; 
  };
  
  const isBothComplete = isFormComplete('dropoff', dropoffForm) && isFormComplete('pickup', pickupForm);
  
  const total = mode === 'both' 
    ? (isBothComplete ? pricing[`${carType}-both`] : 0) 
    : getSubTotal(mode, mode === 'pickup' ? pickupForm : dropoffForm);

  const resetAll = () => { 
    setDropoffForm({ name: '', phone: '', address: '', date: '', time: '', flight: '' }); 
    setPickupForm({ name: '', phone: '', address: '', date: '', time: '', flight: '' }); 
    setPaidStep('none'); 
    setBothStep(1); 
    setCopied(false); 
    setSubmitError('');
    setDropoffErrors({});
    setPickupErrors({});
    setTouched({});
  };

  // 處理表單變更並即時驗證
  const handleFormChange = (
    formType: 'dropoff' | 'pickup',
    field: string,
    value: string
  ) => {
    const setForm = formType === 'dropoff' ? setDropoffForm : setPickupForm;
    const setErrors = formType === 'dropoff' ? setDropoffErrors : setPickupErrors;
    const currentForm = formType === 'dropoff' ? dropoffForm : pickupForm;
    
    setForm((prev: typeof dropoffForm) => ({ ...prev, [field]: value }));
    
    // 即時驗證
    const updatedForm = { ...currentForm, [field]: value };
    const errors = validateForm(updatedForm);
    setErrors(errors);
  };

  // 處理 blur 事件（標記為已觸碰）
  const handleBlur = (field: string) => {
    setTouched((prev: Record<string, boolean>) => ({ ...prev, [field]: true }));
  };

  useEffect(() => { 
    const handlePopState = (event: PopStateEvent) => setPage(event.state?.page || 'home'); 
    window.addEventListener('popstate', handlePopState); 
    return () => window.removeEventListener('popstate', handlePopState); 
  }, []);
  
  const navigateTo = (nextPage: string) => { 
    window.history.pushState({ page: nextPage }, '', ''); 
    setPage(nextPage); 
    window.scrollTo(0,0); 
  };

  const copyAccount = () => { 
    navigator.clipboard.writeText('12220000471580'); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const handleBooking = async () => {
    setSubmitError('');
    
    // 驗證表單
    const currentForm = mode === 'pickup' ? pickupForm : dropoffForm;
    const errors = validateForm(currentForm);
    
    if (mode === 'dropoff' || mode === 'both') {
      setDropoffErrors(validateForm(dropoffForm));
    }
    if (mode === 'pickup' || mode === 'both') {
      setPickupErrors(validateForm(pickupForm));
    }
    
    // 標記所有欄位為已觸碰
    const allTouched: Record<string, boolean> = {};
    ['name', 'phone', 'date', 'address', 'flight'].forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orders = [];
      
      if (mode === 'dropoff' || mode === 'both') {
        orders.push({ 
          ...dropoffForm, 
          mode: 'dropoff', 
          car_type: carType, 
          amount: mode === 'both' ? total / 2 : total, 
          status: 'pending' 
        });
      }
      
      if (mode === 'pickup' || mode === 'both') {
        orders.push({ 
          ...pickupForm, 
          mode: 'pickup', 
          car_type: carType, 
          amount: mode === 'both' ? total / 2 : total, 
          status: 'pending' 
        });
      }

      // 嘗試呼叫 API，如果失敗則使用直接 Supabase 寫入
      let success = false;
      
      if (API_BASE) {
        try {
          const response = await fetch(`${API_BASE}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orders[0])
          });
          if (response.ok) {
            success = true;
          }
        } catch (e) {
          console.log('API 呼叫失敗，使用直接寫入');
        }
      }
      
      // 直接寫入 Supabase
      if (!success) {
        const { error } = await supabase.from('orders').insert(orders);
        if (error) throw error;
      }
      
      setPaidStep('choice'); 
      window.scrollTo(0,0);
    } catch (error: any) {
      console.error('預約失敗:', error);
      setSubmitError('預約暫時無法提交，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => { 
    const summary = `【PickYouUP 預約明細】姓名：${mode==='pickup'?pickupForm.name:dropoffForm.name} 總計：$${total} 元 您好，我已完成支付。`; 
    window.open(`https://line.me/th/talk/${encodeURIComponent(summary)}`, '_blank'); 
    resetAll(); 
    setPage('home'); 
  };

  // ============ 頁面渲染 ============
  
  // 首頁
  if (page === 'home') return (
    <Layout>
      <nav className="w-full py-8 mb-12 flex justify-center border-b border-white/5">
        <h1 className="text-3xl font-black text-yellow-500 uppercase">PickYouUP.tw</h1>
      </nav>
      <div className="w-full text-center space-y-6 animate-in fade-in duration-1000 uppercase font-black italic">
        <h2 className="text-[11vw] md:text-6xl mb-16 tracking-tighter">快速預約<br/><span className="text-yellow-500">專業接送</span></h2>
        <div className="space-y-4 px-2 not-italic">
          <button onClick={() => { setMode('dropoff'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl">我要送機</button>
          <button onClick={() => { setMode('pickup'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl transition-all shadow-xl">我要接機</button>
          <button onClick={() => { setMode('both'); navigateTo('choice'); }} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-yellow-500 hover:text-black py-10 rounded-[40px] font-black text-2xl shadow-xl transition-all">接送機一併預約</button>
        </div>
      </div>
    </Layout>
  );

  // 車型選擇
  if (page === 'choice') return (
    <Layout>
      <h2 className="mt-6 mb-10 text-4xl font-black italic text-yellow-500 text-center uppercase tracking-widest leading-none">
        {mode==='pickup'?'接機服務':mode==='dropoff'?'送機服務':'來回接送'}
      </h2>
      <div className="space-y-4 px-2 text-center">
        <button onClick={() => { setCarType('small'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
          <p className="text-2xl font-black mb-1 group-hover:text-black">小車直達 (5人座)</p>
          <p className="text-white text-[11px] font-bold group-hover:text-black/70 uppercase">乘客1-4人 / 行李1-3件 / 直達無加點</p>
        </button>
        <button onClick={() => { setCarType('large'); navigateTo('form'); }} className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
          <p className="text-2xl font-black mb-1 group-hover:text-black">大車直達 (9人座)</p>
          <p className="text-white text-[11px] font-bold group-hover:text-black/70 uppercase tracking-widest">乘客1-8人 / 行李1-8件 / 直達無加點</p>
        </button>
        <a href="https://line.me/ti/p/~@085qitid" target="_blank" className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-left block hover:bg-yellow-500 hover:text-black transition-all group shadow-xl">
          <p className="text-2xl font-black mb-1 italic group-hover:text-black">我真的不確定...</p>
          <p className="text-white text-[11px] font-bold opacity-70 italic uppercase group-hover:text-black/70">需要人工報價 / 安全座椅 / 多點加停</p>
        </a>
        <div className="flex justify-center w-full py-10">
          <button onClick={()=>window.history.back()} className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black transition-all">回上一頁</button>
        </div>
      </div>
    </Layout>
  );

  // 表單頁面
  if (page === 'form') {
    const isBoth = mode === 'both';
    const currentForm = (isBoth && bothStep === 2) || mode === 'pickup' ? pickupForm : dropoffForm;
    const setForm = (isBoth && bothStep === 2) || mode === 'pickup' ? setPickupForm : setDropoffForm;
    const currentErrors = (isBoth && bothStep === 2) || mode === 'pickup' ? pickupErrors : dropoffErrors;
    const setErrors = (isBoth && bothStep === 2) || mode === 'pickup' ? setPickupErrors : setDropoffErrors;
    const formType = (isBoth && bothStep === 2) || mode === 'pickup' ? 'pickup' : 'dropoff';
    
    const showPrice = total > 0;
    
    // 檢查表單是否有錯誤
    const hasErrors = Object.keys(currentErrors).length > 0;
    
    return (
      <Layout>
        <div className="mt-4 space-y-6 pb-24 px-2">
          
          {/* 錯誤提示 */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3">
              <SvgError />
              <span className="text-red-500 font-bold">{submitError}</span>
            </div>
          )}
          
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl space-y-10 text-white">
            <h2 className="text-3xl font-black italic text-yellow-500 text-center uppercase italic underline underline-offset-8 decoration-zinc-800">
              {isBoth ? (bothStep === 1 ? '第一步：送機詳情' : '第二步：接機詳情') : (mode === 'pickup' ? '接機預約詳情' : '送機預約詳情')}
            </h2>
            
            <div className="space-y-6 text-left">
              {/* 姓名 */}
              <div>
                <input 
                  value={currentForm.name} 
                  onChange={(e) => handleFormChange(formType, 'name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  type="text" 
                  placeholder="聯絡人姓名 *" 
                  className={`w-full bg-black border rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-colors ${touched['name'] && currentErrors.name ? 'border-red-500' : 'border-zinc-800'}`}
                />
                {touched['name'] && currentErrors.name && (
                  <p className="text-red-500 text-sm mt-2 ml-2">⚠️ {currentErrors.name}</p>
                )}
              </div>
              
              {/* 電話 */}
              <div>
                <input 
                  value={currentForm.phone} 
                  onChange={(e) => handleFormChange(formType, 'phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  type="tel" 
                  placeholder="聯絡電話 * (09xxxxxxxx)" 
                  className={`w-full bg-black border rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-colors ${touched['phone'] && currentErrors.phone ? 'border-red-500' : 'border-zinc-800'}`}
                />
                {touched['phone'] && currentErrors.phone && (
                  <p className="text-red-500 text-sm mt-2 ml-2">⚠️ {currentErrors.phone}</p>
                )}
              </div>
              
              {/* 日期 */}
              <div className="space-y-1">
                <p className="text-sm font-bold ml-5">日期 *</p>
                <input 
                  value={currentForm.date} 
                  onChange={(e) => handleFormChange(formType, 'date', e.target.value)}
                  onBlur={() => handleBlur('date')}
                  type="date" 
                  className={`w-full bg-black border rounded-2xl p-5 text-white font-bold outline-none ${touched['date'] && currentErrors.date ? 'border-red-500' : 'border-zinc-800'}`}
                />
                {touched['date'] && currentErrors.date && (
                  <p className="text-red-500 text-sm mt-2 ml-2">⚠️ {currentErrors.date}</p>
                )}
              </div>
              
              {/* 航班 */}
              <div className="space-y-2">
                <p className="text-sm font-bold ml-5">航班編號</p>
                <input 
                  value={currentForm.flight} 
                  onChange={(e) => handleFormChange(formType, 'flight', e.target.value)}
                  type="text" 
                  placeholder="例如: JX713" 
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500"
                />
              </div>
              
              {/* 時間（送機） */}
              {((isBoth && bothStep === 1) || mode === 'dropoff') && (
                <div className="space-y-1">
                  <p className="text-sm font-bold ml-5">上車時間 *</p>
                  <input 
                    value={currentForm.time} 
                    onChange={(e) => setForm((prev: typeof dropoffForm) => ({...prev, time: e.target.value}))}
                    type="time" 
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none"
                  />
                </div>
              )}
              
              {/* 地址 */}
              <div>
                <input 
                  value={currentForm.address} 
                  onChange={(e) => handleFormChange(formType, 'address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  type="text" 
                  placeholder={((isBoth && bothStep === 2) || mode === 'pickup') ? '下機詳情地址 *' : '上車詳情地址 *'} 
                  className={`w-full bg-black border rounded-2xl p-5 text-white font-bold outline-none focus:border-yellow-500 transition-colors ${touched['address'] && currentErrors.address ? 'border-red-500' : 'border-zinc-800'}`}
                />
                {touched['address'] && currentErrors.address && (
                  <p className="text-red-500 text-sm mt-2 ml-2">⚠️ {currentErrors.address}</p>
                )}
              </div>
            </div>
            
            {/* 價格顯示 */}
            <div className="mt-8 pt-8 border-t border-zinc-800 text-center space-y-2">
              {showPrice && <p className="text-5xl font-black italic text-yellow-500 animate-in zoom-in-90 duration-500">${total}</p>}
              
              {/* 提交按鈕區域 */}
              {paidStep === 'none' && (
                isBoth && bothStep === 1 ? (
                  <button 
                    onClick={() => { 
                      // 驗證第一步
                      const errors = validateForm(dropoffForm);
                      setDropoffErrors(errors);
                      setTouched({ name: true, phone: true, date: true, address: true, flight: true });
                      
                      if (Object.keys(errors).length === 0) {
                        setPickupForm(prev => ({...prev, name: dropoffForm.name, phone: dropoffForm.phone }));
                        setBothStep(2); 
                        window.scrollTo(0,0);
                      }
                    }} 
                    className="w-full mt-6 bg-yellow-500 text-black py-6 rounded-[24px] font-black text-xl hover:bg-yellow-400"
                  >
                    下一步：填寫接機資訊
                  </button>
                ) : (
                  <button 
                    disabled={isSubmitting || !showPrice || hasErrors} 
                    onClick={handleBooking} 
                    className={`w-full mt-6 py-6 rounded-[24px] font-black text-xl shadow-xl transition-all flex items-center justify-center gap-2 ${isSubmitting || !showPrice || hasErrors ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <SvgLoading /> 處理中...
                      </>
                    ) : (
                      '確認預約'
                    )}
                  </button>
                )
              )}
            </div>
          </div>
          
          {/* 付款資訊 */}
          {paidStep !== 'none' && (
            <div className="w-full bg-zinc-900 border-2 border-yellow-500 p-8 rounded-[40px] shadow-2xl mt-4 animate-in zoom-in-95 duration-500 space-y-8 text-center text-white">
              <div className="flex flex-col items-center">
                <SvgCheck />
                <h3 className="text-xl font-black italic uppercase mt-2 text-yellow-500">預約已完成</h3>
                <p className="text-3xl font-black italic mt-2">${total} TWD</p>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={()=>setPaidStep('transfer')} 
                  className={`w-full py-6 rounded-3xl font-black ${paidStep==='transfer'?'bg-yellow-500 text-black shadow-xl':'bg-black text-zinc-400'}`}
                >
                  銀行轉帳
                </button>
                {paidStep==='transfer' && (
                  <div className="bg-black/40 p-6 rounded-3xl border border-yellow-500/20 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">銀行代號</span>
                      <span className="font-bold text-right w-20">052</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">帳號</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">12220000471580</span>
                        <button onClick={copyAccount} className="p-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 flex items-center gap-1">
                          {copied ? '✓ 已複製' : <><SvgCopy />複製</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <button 
                  onClick={() => window.open(getCreditCardLink(total), '_blank')} 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all"
                >
                  信用卡付款 (須加3%手續費)
                </button>
                <button 
                  onClick={handleDone} 
                  className="w-full bg-green-600 text-white py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all"
                >
                  通知官方對帳
                </button>
              </div>
            </div>
          )}
          
          <div className="flex justify-center w-full py-10">
            <button 
              onClick={() => isBoth && bothStep === 2 ? setBothStep(1) : window.history.back()} 
              className="px-10 py-3 rounded-full text-white font-black text-lg border border-white/10 bg-zinc-900/50 hover:bg-yellow-500 hover:text-black transition-all italic"
            >
              回上一頁
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  return null;
}
