import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import liff from '@line/liff';

const supabase = createClient(
  'https://vtvytcrkoqbluvczyepm.supabase.co',
  'sb_publishable_SOp1vthQKdTdQUwoHsMIQA_FCTxzbie'
);

// ═══════════════════════════════════════════════════
// 常數
// ═══════════════════════════════════════════════════

const LIFF_ID = '2009262593-SeB2VF83';
const LINE_ID_ID = '@835acfgq';
const LINE_OA_URL = `https://line.me/R/oaMessage/${encodeURIComponent(LINE_ID_ID)}/`;
const LINE_CHANNEL_TOKEN = 'q7bissEGoDlGovi4Z5h2tPPNr2UuiT3PTgVEi7/EtL3aFS9RrUKT00TYDjAqRrgBBN4IDlAXTDL/V9nQtTLxSaAmZUhYxlHc3gS0FJkk0cKj/U2KLAxqg+srSmnJEOLVxW6s79bjC2hWQR2UFzDrgQdB04t89/1O/w1cDnyilFU=';
const BOSS_LINE_UID = 'U835ec891ba538bd68895ccac3b66ce5e';

// 發送訂單通知給老闆
const notifyBoss = async (orderRef, name, phone, service, carType, amount) => {
  const message = `🚨 新訂單來襲！

訂單編號：${orderRef}
姓名：${name}
電話：${phone}
服務：${service}
車型：${carType}
金額：$${amount}

請確認收款並安排車輛！`;

  try {
    console.log('🔔 準備發送 LINE 通知給老闆...');
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_CHANNEL_TOKEN}`
      },
      body: JSON.stringify({
        to: BOSS_LINE_UID,
        messages: [{ type: 'text', text: message }]
      })
    });
    const result = await response.json();
    console.log('📬 LINE 通知結果:', result);
    if (!response.ok) {
      console.error('❌ 發送失敗:', result);
    } else {
      console.log('✅ 通知已發送！');
    }
  } catch (e) {
    console.error('⚠️ 通知錯誤:', e);
  }
};

const BASE_PRICING = {
  'small-dropoff': 1200, 'large-dropoff': 1500,
  'small-pickup': 1300, 'large-pickup': 1600,
};

const CREDIT_CARD_LINKS = {
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
  3200: 'https://api.payuni.com.tw/api/uop/receive_info/2/1/U03424091/Lt3gvazrBKe9A8EDKHf2',
};

const BG_IMAGES = [
  { src: 'https://pickyouup.tw/pexels-bertelli-1.jpg', label: 'Bertelli 1' },
  { src: 'https://pickyouup.tw/pexels-bertelli-2.jpg', label: 'Bertelli 2' },
  { src: 'https://pickyouup.tw/pexels-pixabay-531756.jpg', label: 'Pixabay 飛機' },
  { src: 'https://pickyouup.tw/pexels-tanathip-rattanatum-2026324.jpg', label: 'Tanathip 車輛' },
  { src: 'https://pickyouup.tw/PXL_20240912_093938326.MP.jpg', label: '實拍 1' },
  { src: 'https://pickyouup.tw/PXL_20240912_093945075.MP.jpg', label: '實拍 2' },
];

const EMPTY_FORM = { name: '', phone: '', address: '', date: '', time: '', flight: '' };

// ═══════════════════════════════════════════════════
// 背景設定預設值
// ═══════════════════════════════════════════════════
const DEFAULT_BG = {
  bgIndex: 0,
  overlayOpacity: 0.75,
  gradientDirection: 'to bottom',
  gradientTop: 0.5,
  gradientBottom: 0.9,
  blur: 2,
};

// ═══════════════════════════════════════════════════
// 工具函式
// ═══════════════════════════════════════════════════

const getTodayString = () => new Date().toISOString().slice(0, 10);
const isValidPhone = (phone) => /^09\d{8}$/.test(phone.replace(/[-\s]/g, ''));

const formatLiffPhone = (phone) => {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('886') && digits.length >= 12) return '0' + digits.slice(3);
  if (digits.startsWith('09')) return digits.slice(0, 10);
  return digits;
};

const generateOrderRef = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PYU-${dateStr}-${rand}`;
};

const getModeLabel = (m) => {
  if (m === 'dropoff') return '送機';
  if (m === 'pickup') return '接機';
  return '來回接送';
};
const getCarLabel = (c) => (c === 'small' ? '小車 (5人座)' : '大車 (9人座)');

// ═══════════════════════════════════════════════════
// 樣式常數
// ═══════════════════════════════════════════════════
const S = {
  gold: '#d4af37',
  bg: '#0c0a09',
  cardBg: 'rgba(12,10,9,0.85)',
  cardBorder: 'rgba(255,255,255,0.06)',
  inputBg: 'rgba(0,0,0,0.5)',
  inputBorder: 'rgba(255,255,255,0.1)',
  inputFocus: '#d4af37',
  textDim: '#8a8279',
  radius: 12,
  cardRadius: 20,
};

// ═══════════════════════════════════════════════════
// 共用元件
// ═══════════════════════════════════════════════════

const Background = ({ bg }) => {
  const img = BG_IMAGES[bg.bgIndex] || BG_IMAGES[0];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <img
        src={img.src}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: `blur(${bg.blur}px)`, transform: 'scale(1.05)' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(${bg.gradientDirection}, rgba(12,10,9,${bg.gradientTop}) 0%, rgba(12,10,9,${bg.gradientBottom}) 100%)`,
      }} />
    </div>
  );
};

const Layout = ({ children, bg }) => (
  <div style={{ minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px', fontFamily: "'Inter','Noto Sans TC',sans-serif", position: 'relative' }}>
    <Background bg={bg} />
    <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 10 }}>{children}</div>
  </div>
);

const Header = () => (
  <nav style={{ width: '100%', padding: '20px 0', display: 'flex', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 24 }}>
    <img src="https://pickyouup.tw/logo-gold.png" alt="PickYouUP" style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
  </nav>
);

// LIFF 除錯資訊（已隱藏）
const LiffDebug = ({ debug }) => null;

const Label = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 600, color: S.textDim, marginBottom: 6, letterSpacing: 0.5 }}>{children}</div>
);

const Input = ({ label, error, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <Label>{label}</Label>}
    <input
      {...props}
      style={{
        width: '100%', padding: '14px 16px',
        background: S.inputBg, border: `1px solid ${error ? '#ef5350' : S.inputBorder}`,
        borderRadius: S.radius, color: '#fff', fontSize: 15, fontFamily: 'inherit',
        outline: 'none', transition: 'border-color 0.2s', backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        ...(props.style || {}),
      }}
      onFocus={(e) => { e.target.style.borderColor = S.inputFocus; props.onFocus?.(e); }}
      onBlur={(e) => { e.target.style.borderColor = error ? '#ef5350' : S.inputBorder; props.onBlur?.(e); }}
    />
    {error && <div style={{ marginTop: 4, color: '#ef5350', fontSize: 12, fontWeight: 600 }}>{error}</div>}
  </div>
);

const PrimaryBtn = ({ children, disabled, onClick, style }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: '100%', padding: '16px', border: 'none', borderRadius: S.radius,
      background: disabled ? '#333' : S.gold, color: disabled ? '#666' : '#000',
      fontSize: 16, fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s', ...(style || {}),
    }}
  >
    {children}
  </button>
);

const Card = ({ children, highlight, style }) => (
  <div style={{
    background: S.cardBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    border: highlight ? `2px solid ${S.gold}` : `1px solid ${S.cardBorder}`,
    borderRadius: S.cardRadius, padding: 28, ...(style || {}),
  }}>
    {children}
  </div>
);

const PageTitle = ({ children, sub }) => (
  <div style={{ textAlign: 'center', marginBottom: 24 }}>
    <h2 style={{ fontSize: 22, fontWeight: 800, color: S.gold, margin: 0 }}>{children}</h2>
    {sub && <p style={{ fontSize: 13, color: S.textDim, marginTop: 6 }}>{sub}</p>}
  </div>
);

const BackBtn = ({ onClick, label }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
    <button onClick={onClick} style={{
      padding: '10px 28px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
      color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
    }}>
      {label || '回上一頁'}
    </button>
  </div>
);

const Countdown = ({ createdAt }) => {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    const deadline = createdAt + 2 * 60 * 60 * 1000;
    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) { setRemaining('已逾時'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [createdAt]);
  return (
    <p style={{ fontSize: 13, fontWeight: 700, color: remaining === '已逾時' ? '#ef5350' : S.textDim }}>
      付款時限：{remaining}
    </p>
  );
};

// ═══════════════════════════════════════════════════
// 設計工具 Slider
// ═══════════════════════════════════════════════════
const Slider = ({ label, min, max, step, value, onChange }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
      <span style={{ fontSize: 11, color: '#999' }}>{label}</span>
      <span style={{ fontSize: 11, color: S.gold }}>{value}</span>
    </div>
    <input type="range" min={min} max={max} step={step || 0.01} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: S.gold }}
    />
  </div>
);

// ═══════════════════════════════════════════════════
// 主元件
// ═══════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState('home');
  const [carType, setCarType] = useState('');
  const [mode, setMode] = useState('');
  const [paidStep, setPaidStep] = useState('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bothStep, setBothStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderRef, setOrderRef] = useState('');
  const [orderCreatedAt, setOrderCreatedAt] = useState(null);
  const [dropoffForm, setDropoffForm] = useState({ ...EMPTY_FORM });
  const [pickupForm, setPickupForm] = useState({ ...EMPTY_FORM });

  // 背景設定
  const [bg, setBg] = useState(DEFAULT_BG);
  const [showTool, setShowTool] = useState(false);
  const editMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('edit');
  const uBg = (key, val) => setBg((prev) => ({ ...prev, [key]: val }));

  // ── LIFF 初始化 ──
  useEffect(() => {
    liff.init({ liffId: LIFF_ID })
      .then(() => {
        if (liff.isLoggedIn()) {
          liff.getProfile()
            .then(profile => {
              setDropoffForm(prev => ({ ...prev, name: profile.displayName }));
              setPickupForm(prev => ({ ...prev, name: profile.displayName }));
              
              if (liff.getPhoneNumber) {
                liff.getPhoneNumber()
                  .then(phone => {
                    if (phone) {
                      const formatted = formatLiffPhone(phone);
                      setDropoffForm(prev => ({ ...prev, phone: formatted }));
                      setPickupForm(prev => ({ ...prev, phone: formatted }));
                    }
                  })
                  .catch(() => {});
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  // ── 導覽 ──
  useEffect(() => {
    const handlePopState = (e) => setPage(e.state?.page || 'home');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (nextPage) => {
    window.history.pushState({ page: nextPage }, '', '');
    setPage(nextPage);
    setErrors({});
    window.scrollTo(0, 0);
  };

  // ── 價格 ──
  const dropoffBase = BASE_PRICING[`${carType}-dropoff`] || 0;
  const pickupBase = BASE_PRICING[`${carType}-pickup`] || 0;
  const totalPrice = mode === 'dropoff' ? dropoffBase : mode === 'pickup' ? pickupBase : mode === 'both' ? dropoffBase + pickupBase : 0;

  // ── 表單驗證 ──
  const validateForm = (form, formMode) => {
    const errs = {};
    if (!form.name.trim()) errs.name = '請輸入聯絡人姓名';
    if (!form.phone.trim()) errs.phone = '請輸入聯絡電話';
    else if (!isValidPhone(form.phone)) errs.phone = '請輸入正確的手機號碼（09 開頭，共 10 碼）';
    if (!form.date) errs.date = '請選擇日期';
    else if (form.date < getTodayString()) errs.date = '日期不可選擇過去的日期';
    if (!form.flight.trim()) errs.flight = '請輸入航班編號';
    if (!form.address.trim()) errs.address = formMode === 'pickup' ? '請輸入下車詳細地址' : '請輸入上車詳細地址';
    if (formMode === 'dropoff' && !form.time) errs.time = '請選擇上車時間';
    return errs;
  };

  const resetAll = () => {
    setDropoffForm({ ...EMPTY_FORM }); setPickupForm({ ...EMPTY_FORM });
    setPaidStep('none'); setBothStep(1); setCopied(false); setErrors({});
    setOrderRef(''); setOrderCreatedAt(null);
  };

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText('12220000471580');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = '12220000471580';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToConfirm = () => {
    if (mode === 'both') {
      const dropErrs = validateForm(dropoffForm, 'dropoff');
      const pickErrs = validateForm(pickupForm, 'pickup');
      if (Object.keys(dropErrs).length > 0 || Object.keys(pickErrs).length > 0) { setErrors({ ...dropErrs, ...pickErrs }); return; }
    } else {
      const form = mode === 'pickup' ? pickupForm : dropoffForm;
      const errs = validateForm(form, mode);
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    }
    navigateTo('confirm');
  };

  // ── 提交訂單 ──
  const handleBooking = async () => {
    setIsSubmitting(true);
    const ref = generateOrderRef();
    const orders = [];
    if (mode === 'dropoff' || mode === 'both') {
      orders.push({
        order_ref: ref, service_mode: 'dropoff', car_type: carType,
        contact_name: dropoffForm.name.trim(), contact_phone: dropoffForm.phone.replace(/\D/g, ''),
        pickup_address: dropoffForm.address.trim(), dropoff_address: '',
        service_date: dropoffForm.date, pickup_time: dropoffForm.time,
        flight_number: dropoffForm.flight.trim().toUpperCase(),
        amount: mode === 'both' ? dropoffBase : totalPrice,
        total_amount: totalPrice, status: 'pending', payment_method: '',
      });
    }
    if (mode === 'pickup' || mode === 'both') {
      orders.push({
        order_ref: ref, service_mode: 'pickup', car_type: carType,
        contact_name: pickupForm.name.trim(), contact_phone: pickupForm.phone.replace(/\D/g, ''),
        pickup_address: '', dropoff_address: pickupForm.address.trim(),
        service_date: pickupForm.date, pickup_time: '',
        flight_number: pickupForm.flight.trim().toUpperCase(),
        amount: mode === 'both' ? pickupBase : totalPrice,
        total_amount: totalPrice, status: 'pending', payment_method: '',
      });
    }
    console.log('📝 準備寫入訂單:', orders);
    const { error } = await supabase.from('orders').insert(orders);
    console.log('💾 Supabase 寫入結果:', error ? error : '成功');
    
    if (!error) {
      console.log('✅ 訂單已存入資料庫，準備發送通知...');
      // 發送通知給老闆
      const mainForm = mode === 'pickup' ? pickupForm : dropoffForm;
      console.log('📋 訂單資料:', { ref, name: mainForm.name, phone: mainForm.phone, mode, carType, totalPrice });
      await notifyBoss(ref, mainForm.name, mainForm.phone, getModeLabel(mode), getCarLabel(carType), totalPrice);
      
      setOrderRef(ref); setOrderCreatedAt(Date.now());
      setPaidStep('choice'); navigateTo('payment');
    } else {
      alert('預約暫時無法提交，請稍後再試。' + error.message);
      console.error('Supabase error:', error);
    }
    setIsSubmitting(false);
  };

  const handleDone = () => {
    const mainForm = mode === 'pickup' ? pickupForm : dropoffForm;
    const summary = [
      `【PickYouUP 付款回報】`, `訂單編號：${orderRef}`, `姓名：${mainForm.name}`,
      `電話：${mainForm.phone}`, `服務：${getModeLabel(mode)}`, `車型：${getCarLabel(carType)}`,
      `總計：$${totalPrice} 元`, ``, `您好，我已完成付款，請幫我確認。`,
    ].join('\n');
    if (liff.isInClient()) {
      liff.sendMessages([{ type: 'text', text: summary }])
        .then(() => liff.closeWindow())
        .catch(() => window.open(LINE_OA_URL + encodeURIComponent(summary), '_blank'));
    } else {
      window.open(LINE_OA_URL + encodeURIComponent(summary), '_blank');
    }
  };

  const getCreditCardLink = () => CREDIT_CARD_LINKS[totalPrice] || null;

  // ═══════════════════════════════════════════════════
  // 頁面：首頁
  // ═══════════════════════════════════════════════════
  if (page === 'home') return (
    <Layout bg={bg}>
      <Header />
      <div style={{ textAlign: 'center', padding: '20px 0 40px' }}>
        <h2 style={{ fontSize: 'clamp(36px, 10vw, 52px)', fontWeight: 900, fontStyle: 'italic', lineHeight: 1.1, margin: '0 0 48px', textTransform: 'uppercase' }}>
          快速預約<br /><span style={{ color: S.gold }}>專業接送</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 4px' }}>
          {[
            { label: '我要送機', mode: 'dropoff' },
            { label: '我要接機', mode: 'pickup' },
            { label: '接送一併預訂', mode: 'both' },
          ].map((item) => (
            <button key={item.mode}
              onClick={() => { setMode(item.mode); navigateTo('choice'); }}
              style={{
                width: '100%', padding: '22px', border: `1px solid ${S.cardBorder}`,
                borderRadius: S.cardRadius, background: S.cardBg,
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                color: '#fff', fontSize: 20, fontWeight: 800, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = S.gold; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = S.cardBg; e.currentTarget.style.color = '#fff'; }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 10, color: 'rgba(212,175,55,0.4)', letterSpacing: 4, marginTop: 36, fontWeight: 700 }}>
          PREMIUM SERVICE SINCE 2026
        </p>
      </div>

      {/* ═══ 設計工具（需 ?edit 參數才顯示）═══ */}
      {editMode && (<>
        <button onClick={() => setShowTool(!showTool)} style={{
          position: 'fixed', top: 12, right: 12, zIndex: 9999, padding: '6px 14px', borderRadius: 20,
          background: showTool ? '#333' : S.gold, color: showTool ? S.gold : '#000',
          fontSize: 11, fontWeight: 700, border: showTool ? `1px solid ${S.gold}` : 'none', cursor: 'pointer',
        }}>
          {showTool ? '✕ 關閉' : '⚙ 背景工具'}
        </button>

        {showTool && (
          <div style={{
            position: 'fixed', top: 44, right: 12, zIndex: 9998, width: 280,
            background: 'rgba(0,0,0,0.95)', borderRadius: 14, border: `1px solid ${S.gold}`,
            maxHeight: '75vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div style={{ padding: 14, overflowY: 'auto', flex: 1 }}>
              <div style={{ fontSize: 13, color: S.gold, fontWeight: 700, marginBottom: 12 }}>背景圖片</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                {BG_IMAGES.map((img, i) => (
                  <button key={i} onClick={() => uBg('bgIndex', i)} style={{
                    padding: '7px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer', textAlign: 'left',
                    background: bg.bgIndex === i ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                    border: bg.bgIndex === i ? `1px solid ${S.gold}` : '1px solid rgba(255,255,255,0.08)',
                    color: bg.bgIndex === i ? S.gold : '#aaa',
                  }}>
                    {img.label}
                  </button>
                ))}
              </div>
              <Slider label="模糊度" min={0} max={10} step={0.5} value={bg.blur} onChange={(v) => uBg('blur', v)} />
              <Slider label="頂部遮罩" min={0} max={1} step={0.05} value={bg.gradientTop} onChange={(v) => uBg('gradientTop', v)} />
              <Slider label="底部遮罩" min={0} max={1} step={0.05} value={bg.gradientBottom} onChange={(v) => uBg('gradientBottom', v)} />
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(212,175,55,0.3)' }}>
              <button onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(bg, null, 2));
                alert('已複製背景設定 JSON！');
              }} style={{
                width: '100%', padding: 8, background: S.gold, border: 'none', borderRadius: 8,
                fontWeight: 700, fontSize: 12, cursor: 'pointer', color: '#000',
              }}>
                匯出背景設定
              </button>
            </div>
          </div>
        )}
      </>)}
    </Layout>
  );

  // ═══════════════════════════════════════════════════
  // 頁面：選擇車型
  // ═══════════════════════════════════════════════════
  if (page === 'choice') return (
    <Layout bg={bg}>
      <Header />
      <PageTitle sub="請選擇車型">{getModeLabel(mode)}</PageTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 4px' }}>
        {[
          { type: 'small', title: '小車直達 (5人座)', desc: '乘客1-4人 / 行李1-3件 / 直達無加點' },
          { type: 'large', title: '大車直達 (9人座)', desc: '乘客1-8人 / 行李1-8件 / 直達無加點' },
        ].map((item) => (
          <button key={item.type}
            onClick={() => { setCarType(item.type); navigateTo('form'); }}
            style={{
              width: '100%', padding: 22, border: `1px solid ${S.cardBorder}`, borderRadius: S.cardRadius,
              background: S.cardBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = S.gold; e.currentTarget.querySelector('.t').style.color = '#000'; e.currentTarget.querySelector('.d').style.color = 'rgba(0,0,0,0.6)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = S.cardBg; e.currentTarget.querySelector('.t').style.color = '#fff'; e.currentTarget.querySelector('.d').style.color = S.textDim; }}
          >
            <div className="t" style={{ color: '#fff', fontSize: 18, fontWeight: 800, transition: 'color 0.2s' }}>{item.title}</div>
            <div className="d" style={{ color: S.textDim, fontSize: 13, marginTop: 4, transition: 'color 0.2s' }}>{item.desc}</div>
          </button>
        ))}
        <a href={`https://line.me/ti/p/${LINE_ID_ID}`} target="_blank" rel="noopener noreferrer" style={{
          display: 'block', padding: '18px 22px', border: `1px solid ${S.cardBorder}`,
          borderRadius: S.cardRadius, background: S.cardBg, backdropFilter: 'blur(20px)',
          textAlign: 'center', textDecoration: 'none', transition: 'all 0.2s',
        }}>
          <div style={{ color: S.textDim, fontSize: 13 }}>我真的不確定...</div>
          <div style={{ color: S.gold, fontWeight: 700, fontSize: 14, marginTop: 4 }}>需要人工報價 / 安全座椅 / 多點加停</div>
        </a>
      </div>
      <BackBtn onClick={() => window.history.back()} />
    </Layout>
  );

  // ═══════════════════════════════════════════════════
  // 頁面：填寫表單
  // ═══════════════════════════════════════════════════
  if (page === 'form') {
    const isBoth = mode === 'both';
    const isPickupStep = (isBoth && bothStep === 2) || mode === 'pickup';
    const currentForm = isPickupStep ? pickupForm : dropoffForm;
    const setForm = isPickupStep ? setPickupForm : setDropoffForm;
    const currentMode = isPickupStep ? 'pickup' : 'dropoff';

    const handleNextStep = () => {
      const errs = validateForm(dropoffForm, 'dropoff');
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
      setErrors({});
      setPickupForm((prev) => ({ ...prev, name: prev.name || dropoffForm.name, phone: prev.phone || dropoffForm.phone }));
      setBothStep(2); window.scrollTo(0, 0);
    };

    return (
      <Layout bg={bg}>
        <Header />
        <div style={{ padding: '0 4px 80px' }}>
          <Card>
            <PageTitle sub={isBoth ? `第 ${bothStep}/2 步` : undefined}>
              {isBoth ? (bothStep === 1 ? '送機詳情' : '接機詳情') : (currentMode === 'pickup' ? '接機預約' : '送機預約')}
            </PageTitle>

            <Input label="聯絡人姓名" placeholder="您的姓名" value={currentForm.name} error={errors.name}
              onChange={(e) => { setForm({ ...currentForm, name: e.target.value }); setErrors((p) => ({ ...p, name: '' })); }} />

            <Input label="聯絡電話" placeholder="09XX-XXX-XXX" type="tel" inputMode="numeric" maxLength={10}
              value={currentForm.phone} error={errors.phone}
              onChange={(e) => { const raw = e.target.value.replace(/\D/g, '').slice(0, 10); setForm({ ...currentForm, phone: raw }); setErrors((p) => ({ ...p, phone: '' })); }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label={currentMode === 'pickup' ? '抵達日期' : '出發日期'} type="date" min={getTodayString()}
                value={currentForm.date} error={errors.date}
                onChange={(e) => { setForm({ ...currentForm, date: e.target.value }); setErrors((p) => ({ ...p, date: '' })); }} />

              {currentMode === 'dropoff' ? (
                <Input label="上車時間" type="time" value={currentForm.time} error={errors.time}
                  onChange={(e) => { setForm({ ...currentForm, time: e.target.value }); setErrors((p) => ({ ...p, time: '' })); }} />
              ) : (
                <Input label="航班編號" placeholder="BR001" value={currentForm.flight} error={errors.flight}
                  onChange={(e) => { setForm({ ...currentForm, flight: e.target.value.toUpperCase() }); setErrors((p) => ({ ...p, flight: '' })); }}
                  style={{ textTransform: 'uppercase' }} />
              )}
            </div>

            {currentMode === 'dropoff' && (
              <Input label="航班編號" placeholder="例如 BR001" value={currentForm.flight} error={errors.flight}
                onChange={(e) => { setForm({ ...currentForm, flight: e.target.value.toUpperCase() }); setErrors((p) => ({ ...p, flight: '' })); }}
                style={{ textTransform: 'uppercase' }} />
            )}

            <Input label={currentMode === 'pickup' ? '下車詳細地址' : '上車詳細地址'}
              placeholder="請輸入完整地址" value={currentForm.address} error={errors.address}
              onChange={(e) => { setForm({ ...currentForm, address: e.target.value }); setErrors((p) => ({ ...p, address: '' })); }} />

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${S.cardBorder}` }}>
              {isBoth && bothStep === 1 ? (
                <PrimaryBtn onClick={handleNextStep}>下一步：填寫接機資訊</PrimaryBtn>
              ) : (
                <PrimaryBtn onClick={handleGoToConfirm}>確認明細</PrimaryBtn>
              )}
            </div>
          </Card>
          <BackBtn onClick={() => { if (isBoth && bothStep === 2) { setBothStep(1); setErrors({}); } else { window.history.back(); } }} />
        </div>
      </Layout>
    );
  }

  // ═══════════════════════════════════════════════════
  // 頁面：確認明細
  // ═══════════════════════════════════════════════════
  if (page === 'confirm') {
    const Row = ({ label, value }) => (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
        <span style={{ fontSize: 13, color: S.textDim }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700 }}>{value}</span>
      </div>
    );

    return (
      <Layout bg={bg}>
        <Header />
        <div style={{ padding: '0 4px 80px' }}>
          <Card>
            <PageTitle>請確認預約明細</PageTitle>

            {(mode === 'dropoff' || mode === 'both') && (
              <div style={{ marginBottom: mode === 'both' ? 20 : 0 }}>
                {mode === 'both' && <div style={{ fontSize: 13, fontWeight: 800, color: S.gold, marginBottom: 8 }}>送機</div>}
                <Row label="聯絡人" value={dropoffForm.name} />
                <Row label="電話" value={dropoffForm.phone} />
                <Row label="日期" value={dropoffForm.date} />
                <Row label="航班" value={dropoffForm.flight} />
                <Row label="上車時間" value={dropoffForm.time} />
                <Row label="上車地址" value={dropoffForm.address} />
                <Row label="車型" value={getCarLabel(carType)} />
                <Row label="車資" value={`$${dropoffBase}`} />
              </div>
            )}

            {(mode === 'pickup' || mode === 'both') && (
              <div>
                {mode === 'both' && <div style={{ fontSize: 13, fontWeight: 800, color: S.gold, marginBottom: 8, marginTop: 16, paddingTop: 16, borderTop: `1px solid rgba(212,175,55,0.2)` }}>接機</div>}
                <Row label="聯絡人" value={pickupForm.name} />
                <Row label="電話" value={pickupForm.phone} />
                <Row label="日期" value={pickupForm.date} />
                <Row label="航班" value={pickupForm.flight} />
                <Row label="下車地址" value={pickupForm.address} />
                <Row label="車型" value={getCarLabel(carType)} />
                <Row label="車資" value={`$${pickupBase}`} />
              </div>
            )}

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: `2px solid rgba(212,175,55,0.3)`, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: S.textDim, fontWeight: 600 }}>合計金額</p>
              <p style={{ fontSize: 42, fontWeight: 900, color: S.gold, margin: '4px 0' }}>${totalPrice}</p>
              {mode === 'both' && <p style={{ fontSize: 12, color: S.textDim }}>(送機 ${dropoffBase} + 接機 ${pickupBase})</p>}
            </div>

            <div style={{ marginTop: 24 }}>
              <PrimaryBtn disabled={isSubmitting} onClick={handleBooking}>
                {isSubmitting ? '處理中...' : '確認預約'}
              </PrimaryBtn>
            </div>
          </Card>
          <BackBtn onClick={() => window.history.back()} label="回上一頁修改" />
        </div>
      </Layout>
    );
  }

  // ═══════════════════════════════════════════════════
  // 頁面：付款
  // ═══════════════════════════════════════════════════
  if (page === 'payment') {
    const [isProcessingCC, setIsProcessingCC] = useState(false);
    
    // 呼叫 Payuni API 建立刷卡
    const handleCreditCard = async () => {
      setIsProcessingCC(true);
      try {
        const response = await fetch('https://vtvytcrkoqbluvczyepm.supabase.co/functions/v1/payuni-create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderRef: orderRef,
            amount: totalPrice
          })
        });
        const data = await response.json();
        console.log('Payuni response:', data);
        
        if (data.success && data.paymentUrl) {
          if (liff.isInClient()) {
            liff.openWindow({ url: data.paymentUrl, external: true });
          } else {
            window.open(data.paymentUrl, '_blank');
          }
        } else {
          alert('建立刷卡失敗，請聯繫客服');
        }
      } catch (e) {
        console.error('刷卡錯誤:', e);
        alert('刷卡發生錯誤，請使用轉帳或聯繫客服');
      }
      setIsProcessingCC(false);
    };

    return (
      <Layout bg={bg}>
        <Header />
        <div style={{ padding: '0 4px 80px' }}>
          <Card highlight>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: 'rgba(76,175,80,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
                fontSize: 28,
              }}>✓</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: S.gold, margin: '0 0 4px' }}>預約已完成</h3>
              <p style={{ fontSize: 32, fontWeight: 900, margin: '4px 0' }}>${totalPrice} TWD</p>
              <p style={{ fontSize: 11, color: S.textDim }}>訂單編號：{orderRef}</p>
              {orderCreatedAt && <Countdown createdAt={orderCreatedAt} />}
              <p style={{ fontSize: 11, color: S.textDim, marginTop: 4 }}>請於 2 小時內完成付款，逾時訂單將自動取消</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* 轉帳 */}
              <button onClick={() => setPaidStep('transfer')} style={{
                width: '100%', padding: 16, borderRadius: S.radius, fontWeight: 800, fontSize: 15, cursor: 'pointer', border: 'none',
                background: paidStep === 'transfer' ? S.gold : 'rgba(255,255,255,0.06)',
                color: paidStep === 'transfer' ? '#000' : S.textDim, transition: 'all 0.2s',
              }}>
                銀行轉帳
              </button>

              {paidStep === 'transfer' && (
                <div style={{
                  background: 'rgba(0,0,0,0.4)', padding: 20, borderRadius: S.radius,
                  border: `1px solid rgba(212,175,55,0.2)`,
                }}>
                  {[
                    ['銀行', '渣打銀行'],
                    ['銀行代號', '052'],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: 13, color: S.textDim }}>{l}</span>
                      <span style={{ fontWeight: 700 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 13, color: S.textDim }}>帳號</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>12220000471580</span>
                      <button onClick={copyAccount} style={{
                        padding: '4px 10px', background: S.gold, color: '#000', border: 'none',
                        borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      }}>{copied ? '已複製' : '複製'}</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ fontSize: 13, color: S.textDim }}>金額</span>
                    <span style={{ fontWeight: 800, color: S.gold }}>${totalPrice}</span>
                  </div>
                </div>
              )}

              {/* 刷卡 — 動態呼叫 Payuni API */}
              <button onClick={handleCreditCard} disabled={isProcessingCC} style={{
                width: '100%', padding: 16, borderRadius: S.radius, fontWeight: 800, fontSize: 15,
                cursor: isProcessingCC ? 'not-allowed' : 'pointer', border: 'none', 
                background: isProcessingCC ? '#1565c0aa' : 'linear-gradient(135deg, #1565c0, #1976d2)',
                color: '#fff', transition: 'all 0.2s',
              }}>{isProcessingCC ? '處理中...' : '信用卡付款 (須加 3% 手續費)'}</button>

              {/* 已付款 - 加大加強顯示 */}
              <div style={{ marginTop: 8, padding: '12px', background: 'rgba(46,125,50,0.15)', borderRadius: S.radius, border: '1px solid rgba(46,125,50,0.3)' }}>
                <div style={{ fontSize: 12, color: '#81c784', marginBottom: 8, textAlign: 'center' }}>
                  💳 完成付款後，請務必點擊下方按鈕通知我們！
                </div>
                <button onClick={handleDone} style={{
                  width: '100%', padding: 18, borderRadius: S.radius, fontWeight: 800, fontSize: 16,
                  cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #2e7d32, #43a047)', 
                  color: '#fff', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(46,125,50,0.3)',
                }}>
                  ✅ 已完成付款，點擊通知對帳
                </button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return null;
}
