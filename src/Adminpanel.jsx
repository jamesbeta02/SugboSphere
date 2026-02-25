import { useState, useEffect } from 'react';
import {
  LayoutDashboard, MessageSquare, Users, MapPin,
  X, Trash2, Eye, RefreshCw, LogOut, ChevronDown, ChevronUp,
  Save, Search, Download, CheckCircle, Clock, Megaphone,
  Star, Bell, ShieldOff, ShieldCheck, UserX, UserCheck, AlertTriangle
} from 'lucide-react';
import {
  collection, getDocs, deleteDoc, doc,
  addDoc, updateDoc, serverTimestamp, orderBy, query, setDoc
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';

// ─────────────────────────────────────────────
const TABS = [
  { id: 'dashboard',     label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'feedbacks',     label: 'Feedbacks',    icon: MessageSquare   },
  { id: 'users',         label: 'Users',        icon: Users           },
  { id: 'heritage',      label: 'Heritage',     icon: MapPin          },
  { id: 'announcements', label: 'Announcements',icon: Megaphone       },
];

const CATEGORY_COLORS = {
  'Bug Report':    { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  'Suggestion':    { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Content Issue': { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  'General':       { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
};

const ANN_TYPES = {
  info:    { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', label: '🔵 Info'    },
  warning: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa', label: '🟠 Warning' },
  success: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', label: '🟢 Success' },
  urgent:  { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: '🔴 Urgent'  },
};

// ── Bar chart ──
function BarChart({ data, color = '#3b82f6', height = 80 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{
            width: '100%', borderRadius: '4px 4px 0 0', background: color, opacity: 0.85,
            height: `${(d.value / max) * height}px`, transition: 'height 0.4s ease',
            minHeight: d.value > 0 ? '4px' : '0'
          }} />
          <span style={{ fontSize: '0.65rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Donut chart ──
function DonutChart({ segments, size = 100 }) {
  const r = 35, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="14" />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="14"
            strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x="50" y="54" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e3a5f">{total}</text>
    </svg>
  );
}

// ── Stat card ──
function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', flex: 1, minWidth: '140px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>{label}</span>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} color={color} />
        </div>
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e3a5f', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
function AdminPanel({ onClose }) {
  const [activeTab, setActiveTab]         = useState('dashboard');
  const [feedbacks, setFeedbacks]         = useState([]);
  const [users, setUsers]                 = useState([]);
  const [heritage, setHeritage]           = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  // Feedback filters
  const [fbSearch, setFbSearch]     = useState('');
  const [fbCategory, setFbCategory] = useState('All');
  const [fbStatus, setFbStatus]     = useState('All');

  // Heritage form
  const [heritageForm, setHeritageForm] = useState({ name: '', category: '', location: '', description: '', imageUrl: '' });
  const [editingId, setEditingId]       = useState(null);
  const [savingHeritage, setSavingHeritage] = useState(false);

  // Announcement form
  const [annForm, setAnnForm]   = useState({ title: '', body: '', type: 'info' });
  const [savingAnn, setSavingAnn] = useState(false);

  // User search
  const [userSearch, setUserSearch] = useState('');

  // ── Fetch all ──
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [fbSnap, uSnap, hSnap, aSnap] = await Promise.all([
        getDocs(query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'heritage')),
        getDocs(query(collection(db, 'announcements'), orderBy('createdAt', 'desc'))),
      ]);
      setFeedbacks(fbSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setHeritage(hSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setAnnouncements(aSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error('Fetch error:', e); }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Feedback actions ──
  const deleteFeedback = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    await deleteDoc(doc(db, 'feedbacks', id));
    setFeedbacks(p => p.filter(f => f.id !== id));
  };

  const toggleResolved = async (fb) => {
    const next = fb.status === 'resolved' ? 'pending' : 'resolved';
    await updateDoc(doc(db, 'feedbacks', fb.id), { status: next });
    setFeedbacks(p => p.map(f => f.id === fb.id ? { ...f, status: next } : f));
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Category', 'Rating', 'Message', 'Status', 'Date'];
    const rows = feedbacks.map(f => [
      `"${f.name || ''}"`, `"${f.email || ''}"`, `"${f.category || ''}"`,
      f.rating || 0,
      `"${(f.message || '').replace(/"/g, '""')}"`,
      f.status || 'pending',
      f.createdAt?.toDate ? f.createdAt.toDate().toLocaleDateString() : ''
    ]);
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'feedbacks.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // ── User ban/unban ──
  // Stores banned flag in Firestore users/{uid}
  // Your AuthModal should check this flag on login (see note below)
  const toggleBan = async (u) => {
    const isBanned = u.banned === true;
    const action   = isBanned ? 'unban' : 'ban';
    if (!window.confirm(`Are you sure you want to ${action} ${u.name || u.email}?`)) return;
    const newBanned = !isBanned;
    try {
      await setDoc(doc(db, 'users', u.id), { ...u, banned: newBanned }, { merge: true });
      setUsers(p => p.map(x => x.id === u.id ? { ...x, banned: newBanned } : x));
    } catch (e) {
      console.error('Ban error:', e);
      alert('Failed to update ban status. Check Firestore rules.');
    }
  };

  const deleteUser = async (u) => {
    if (!window.confirm(`Remove ${u.name || u.email}'s record from Firestore?`)) return;
    await deleteDoc(doc(db, 'users', u.id));
    setUsers(p => p.filter(x => x.id !== u.id));
  };

  // ── Heritage actions ──
  const saveHeritage = async () => {
    const { name, category, location } = heritageForm;
    if (!name || !category || !location) { alert('Name, category, and location are required.'); return; }
    setSavingHeritage(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'heritage', editingId), { ...heritageForm, updatedAt: serverTimestamp() });
        setHeritage(p => p.map(h => h.id === editingId ? { ...h, ...heritageForm } : h));
        setEditingId(null);
      } else {
        const ref = await addDoc(collection(db, 'heritage'), { ...heritageForm, createdAt: serverTimestamp() });
        setHeritage(p => [...p, { id: ref.id, ...heritageForm }]);
      }
      setHeritageForm({ name: '', category: '', location: '', description: '', imageUrl: '' });
    } catch (e) { console.error(e); alert('Failed to save. Check Firestore rules.'); }
    setSavingHeritage(false);
  };

  const deleteHeritage = async (id) => {
    if (!window.confirm('Delete this heritage entry?')) return;
    await deleteDoc(doc(db, 'heritage', id));
    setHeritage(p => p.filter(h => h.id !== id));
  };

  const startEdit = (h) => {
    setEditingId(h.id);
    setHeritageForm({ name: h.name, category: h.category, location: h.location, description: h.description || '', imageUrl: h.imageUrl || '' });
  };

  // ── Announcement actions ──
  const saveAnnouncement = async () => {
    if (!annForm.title || !annForm.body) { alert('Title and message are required.'); return; }
    setSavingAnn(true);
    try {
      const ref = await addDoc(collection(db, 'announcements'), { ...annForm, createdAt: serverTimestamp() });
      setAnnouncements(p => [{ id: ref.id, ...annForm }, ...p]);
      setAnnForm({ title: '', body: '', type: 'info' });
    } catch (e) { console.error(e); alert('Failed to save. Check Firestore rules.'); }
    setSavingAnn(false);
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    await deleteDoc(doc(db, 'announcements', id));
    setAnnouncements(p => p.filter(a => a.id !== id));
  };

  // ── Derived stats ──
  const avgRating  = feedbacks.length ? (feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.length).toFixed(1) : '—';
  const resolved   = feedbacks.filter(f => f.status === 'resolved').length;
  const pending    = feedbacks.length - resolved;
  const bannedCount = users.filter(u => u.banned).length;

  const ratingDist = [1,2,3,4,5].map(r => ({ label: `${r}★`, value: feedbacks.filter(f => f.rating === r).length }));
  const catDist    = Object.keys(CATEGORY_COLORS).map(c => ({ label: c, value: feedbacks.filter(f => f.category === c).length, color: CATEGORY_COLORS[c].color }));

  const filteredFeedbacks = feedbacks.filter(f => {
    const s = fbSearch.toLowerCase();
    const matchSearch   = !s || [f.name, f.email, f.message, f.category].some(v => v?.toLowerCase().includes(s));
    const matchCategory = fbCategory === 'All' || f.category === fbCategory;
    const matchStatus   = fbStatus   === 'All' || (f.status || 'pending') === fbStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const filteredUsers = users.filter(u => {
    const s = userSearch.toLowerCase();
    return !s || [u.name, u.email].some(v => v?.toLowerCase().includes(s));
  });

  const inputSt = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: '1px solid #d1d5db', fontSize: '0.9rem', outline: 'none',
    color: '#111827', background: 'white', boxSizing: 'border-box', fontFamily: 'inherit'
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 99998, display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '10px'
    }}>
      <div style={{
        background: '#f8fafc', borderRadius: '18px',
        width: '100%', maxWidth: '100%', height: 'calc(100vh - 20px)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
        overflow: 'hidden', animation: 'authSlideIn 0.3s ease'
      }}>

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f, #2c5282)',
          padding: '18px 26px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexShrink: 0
        }}>
          <div>
            <h4 style={{ color: 'white', fontWeight: '700', margin: 0, fontSize: '1.05rem' }}>⚙️ Admin Panel</h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', margin: 0 }}>SugboSphere Management</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={fetchAll} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px', color: 'white', padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={() => { signOut(auth); onClose(); }} style={{ background: 'rgba(239,68,68,0.25)', border: 'none', borderRadius: '10px', color: 'white', padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
              <LogOut size={14} /> Sign Out
            </button>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px', color: 'white', padding: '7px 10px', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Sidebar + Content ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Sidebar nav */}
          <div style={{ width: '210px', background: '#1e2d4a', display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: '4px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 10px 4px' }}>Navigation</p>
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '11px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  fontWeight: active ? '600' : '400', fontSize: '0.88rem',
                  background: active ? 'rgba(255,255,255,0.13)' : 'transparent',
                  color: active ? 'white' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.18s ease', whiteSpace: 'nowrap', textAlign: 'left',
                  borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent'
                }}>
                  <tab.icon size={16} />
                  <span style={{ flex: 1 }}>{tab.label}</span>
                  {tab.id === 'feedbacks' && pending > 0 && (
                    <span style={{ background: '#ef4444', color: 'white', borderRadius: '20px', fontSize: '0.62rem', fontWeight: '700', padding: '1px 7px' }}>{pending}</span>
                  )}
                  {tab.id === 'users' && bannedCount > 0 && (
                    <span style={{ background: '#f59e0b', color: 'white', borderRadius: '20px', fontSize: '0.62rem', fontWeight: '700', padding: '1px 7px' }}>{bannedCount}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '30px 40px', background: '#f8fafc' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '12px' }}>Loading data...</p>
            </div>
          ) : (<>

            {/* ════════ DASHBOARD ════════ */}
            {activeTab === 'dashboard' && (
              <div>
                <h5 style={{ color: '#1e3a5f', fontWeight: '700', marginBottom: '18px' }}>Overview</h5>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '22px' }}>
                  <StatCard label="Total Feedbacks" value={feedbacks.length} icon={MessageSquare} color="#3b82f6" sub="all time" />
                  <StatCard label="Avg. Rating"     value={avgRating}        icon={Star}          color="#f59e0b" sub="out of 5" />
                  <StatCard label="Pending"         value={pending}          icon={Clock}         color="#ef4444" sub="unresolved" />
                  <StatCard label="Resolved"        value={resolved}         icon={CheckCircle}   color="#10b981" sub="done" />
                  <StatCard label="Heritage Sites"  value={heritage.length}  icon={MapPin}        color="#8b5cf6" sub="in database" />
                  <StatCard label="Users"           value={users.length}     icon={Users}         color="#06b6d4" sub={`${bannedCount} banned`} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
                  <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h6 style={{ color: '#1e3a5f', fontWeight: '600', marginBottom: '16px', fontSize: '0.86rem' }}>⭐ Rating Distribution</h6>
                    <BarChart data={ratingDist} color="#f59e0b" height={80} />
                  </div>
                  <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h6 style={{ color: '#1e3a5f', fontWeight: '600', marginBottom: '12px', fontSize: '0.86rem' }}>📊 Category Breakdown</h6>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <DonutChart segments={catDist} size={90} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {catDist.map(c => (
                          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <div style={{ width: '9px', height: '9px', borderRadius: '3px', background: c.color, flexShrink: 0 }} />
                            <span style={{ fontSize: '0.76rem', color: '#374151' }}>{c.label}</span>
                            <span style={{ fontSize: '0.76rem', color: '#9ca3af', marginLeft: 'auto', paddingLeft: '8px' }}>{c.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <h6 style={{ color: '#374151', fontWeight: '600', marginBottom: '10px', fontSize: '0.86rem' }}>🕐 Recent Feedbacks</h6>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {feedbacks.slice(0, 5).map(f => {
                    const cat = CATEGORY_COLORS[f.category] || { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' };
                    const isResolved = f.status === 'resolved';
                    return (
                      <div key={f.id} style={{ background: 'white', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', opacity: isResolved ? 0.7 : 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: '600', color: '#1e3a5f', fontSize: '0.86rem' }}>{f.name}</span>
                          <span style={{ fontSize: '0.74rem', padding: '2px 8px', borderRadius: '20px', background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>{f.category}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>{'★'.repeat(f.rating || 0)}</span>
                          {isResolved ? <CheckCircle size={13} color="#10b981" /> : <Clock size={13} color="#f59e0b" />}
                        </div>
                      </div>
                    );
                  })}
                  {feedbacks.length === 0 && <p style={{ color: '#9ca3af', fontSize: '0.86rem' }}>No feedbacks yet.</p>}
                </div>
              </div>
            )}

            {/* ════════ FEEDBACKS ════════ */}
            {activeTab === 'feedbacks' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <h5 style={{ color: '#1e3a5f', fontWeight: '700', margin: 0 }}>
                    Feedbacks <span style={{ fontSize: '0.8rem', fontWeight: '400', color: '#9ca3af' }}>({filteredFeedbacks.length}/{feedbacks.length})</span>
                  </h5>
                  <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', fontWeight: '600', fontSize: '0.82rem' }}>
                    <Download size={13} /> Export CSV
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                    <Search size={13} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input value={fbSearch} onChange={e => setFbSearch(e.target.value)} placeholder="Search name, email, message..." style={{ ...inputSt, paddingLeft: '30px' }} />
                  </div>
                  <select value={fbCategory} onChange={e => setFbCategory(e.target.value)} style={{ ...inputSt, width: 'auto', minWidth: '130px' }}>
                    <option value="All">All Categories</option>
                    {Object.keys(CATEGORY_COLORS).map(c => <option key={c}>{c}</option>)}
                  </select>
                  <select value={fbStatus} onChange={e => setFbStatus(e.target.value)} style={{ ...inputSt, width: 'auto', minWidth: '110px' }}>
                    <option value="All">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredFeedbacks.map(f => {
                    const cat = CATEGORY_COLORS[f.category] || { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' };
                    const expanded   = expandedFeedback === f.id;
                    const isResolved = f.status === 'resolved';
                    return (
                      <div key={f.id} style={{ background: 'white', borderRadius: '14px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', overflow: 'hidden', opacity: isResolved ? 0.8 : 1, border: isResolved ? '1px solid #d1fae5' : '1px solid transparent' }}>
                        <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isResolved ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 }}>
                              {(f.name || '?')[0].toUpperCase()}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: '600', color: '#1e3a5f', fontSize: '0.86rem' }}>{f.name}</div>
                              <div style={{ color: '#9ca3af', fontSize: '0.74rem' }}>{f.email}</div>
                            </div>
                            <span style={{ padding: '2px 9px', borderRadius: '20px', fontSize: '0.73rem', fontWeight: '500', background: cat.bg, color: cat.color, border: `1px solid ${cat.border}`, whiteSpace: 'nowrap', flexShrink: 0 }}>{f.category}</span>
                            <div style={{ display: 'flex', gap: '1px', flexShrink: 0 }}>
                              {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= (f.rating||0) ? '#f59e0b' : '#e5e7eb', fontSize: '0.82rem' }}>★</span>)}
                            </div>
                            <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600', flexShrink: 0, background: isResolved ? '#d1fae5' : '#fef3c7', color: isResolved ? '#065f46' : '#92400e' }}>
                              {isResolved ? '✓ Resolved' : '⏳ Pending'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '5px', marginLeft: '8px' }}>
                            <button onClick={() => toggleResolved(f)} title={isResolved ? 'Mark pending' : 'Mark resolved'} style={{ background: isResolved ? '#d1fae5' : '#f0fdf4', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#10b981', display: 'flex', alignItems: 'center' }}>
                              <CheckCircle size={13} />
                            </button>
                            <button onClick={() => setExpandedFeedback(expanded ? null : f.id)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}>
                              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            </button>
                            <button onClick={() => deleteFeedback(f.id)} style={{ background: '#fef2f2', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        {expanded && (
                          <div style={{ padding: '0 16px 13px', borderTop: '1px solid #f3f4f6' }}>
                            <p style={{ color: '#374151', fontSize: '0.86rem', margin: '10px 0 5px', lineHeight: '1.6' }}>{f.message}</p>
                            {f.createdAt?.toDate && <p style={{ color: '#9ca3af', fontSize: '0.72rem', margin: 0 }}>Submitted: {f.createdAt.toDate().toLocaleString()}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {filteredFeedbacks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                      <Search size={28} style={{ marginBottom: '8px', opacity: 0.3 }} />
                      <p style={{ margin: 0, fontSize: '0.88rem' }}>No feedbacks match your filters.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════ USERS ════════ */}
            {activeTab === 'users' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <h5 style={{ color: '#1e3a5f', fontWeight: '700', margin: 0 }}>
                    Users <span style={{ fontSize: '0.8rem', fontWeight: '400', color: '#9ca3af' }}>({filteredUsers.length})</span>
                  </h5>
                  {bannedCount > 0 && (
                    <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '20px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: '600' }}>
                      ⚠️ {bannedCount} banned user{bannedCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Ban info box */}
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <div style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: '1.5' }}>
                    <strong>How banning works:</strong> Banning sets a <code>banned: true</code> flag in Firestore. 
                    To enforce it, add a ban check in your <code>AuthModal.jsx</code> after login — see the note in your code comments. 
                    Banned users show in red below.
                  </div>
                </div>

                {/* User search */}
                <div style={{ position: 'relative', marginBottom: '14px' }}>
                  <Search size={13} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email..." style={{ ...inputSt, paddingLeft: '30px' }} />
                </div>

                {users.length === 0 ? (
                  <div style={{ background: 'white', borderRadius: '14px', padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                    <Users size={32} style={{ marginBottom: '10px', opacity: 0.3 }} />
                    <p style={{ margin: '0 0 6px', fontWeight: '500', fontSize: '0.9rem' }}>No user records yet.</p>
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>
                      To auto-populate this list, save user data to the <code>users</code> Firestore collection on sign-up.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredUsers.map((u, i) => {
                      const isBanned = u.banned === true;
                      return (
                        <div key={u.id} style={{
                          background: 'white', borderRadius: '12px', padding: '14px 18px',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                          border: isBanned ? '1.5px solid #fecaca' : '1.5px solid transparent',
                          opacity: isBanned ? 0.85 : 1
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                            {/* Avatar */}
                            <div style={{
                              width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                              background: isBanned ? '#fecaca' : `hsl(${i * 47 % 360}, 55%, 58%)`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: isBanned ? '#dc2626' : 'white', fontWeight: '700', fontSize: '1rem'
                            }}>
                              {isBanned ? <UserX size={18} /> : (u.name || u.email || '?')[0].toUpperCase()}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: '600', color: isBanned ? '#dc2626' : '#1e3a5f', fontSize: '0.88rem' }}>
                                  {u.name || '—'}
                                </span>
                                {isBanned && (
                                  <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '20px', fontSize: '0.68rem', fontWeight: '700', padding: '1px 8px' }}>
                                    🚫 BANNED
                                  </span>
                                )}
                              </div>
                              <div style={{ color: '#9ca3af', fontSize: '0.76rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {u.email || u.id}
                              </div>
                              {u.createdAt?.toDate && (
                                <div style={{ color: '#d1d5db', fontSize: '0.7rem', marginTop: '1px' }}>
                                  Joined: {u.createdAt.toDate().toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                            {/* Ban / Unban */}
                            <button
                              onClick={() => toggleBan(u)}
                              title={isBanned ? 'Unban user' : 'Ban user'}
                              style={{
                                background: isBanned ? '#f0fdf4' : '#fef2f2',
                                border: 'none', borderRadius: '8px', padding: '7px 10px',
                                cursor: 'pointer',
                                color: isBanned ? '#16a34a' : '#dc2626',
                                display: 'flex', alignItems: 'center', gap: '5px',
                                fontSize: '0.78rem', fontWeight: '600'
                              }}
                            >
                              {isBanned
                                ? <><UserCheck size={14} /> Unban</>
                                : <><UserX    size={14} /> Ban</>
                              }
                            </button>
                            {/* Delete record */}
                            <button onClick={() => deleteUser(u)} title="Delete record" style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {filteredUsers.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '30px', color: '#9ca3af', fontSize: '0.88rem' }}>No users match your search.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ════════ HERITAGE ════════ */}
            {activeTab === 'heritage' && (
              <div>
                <h5 style={{ color: '#1e3a5f', fontWeight: '700', marginBottom: '18px' }}>
                  Heritage Content <span style={{ fontSize: '0.82rem', fontWeight: '400', color: '#9ca3af' }}>({heritage.length})</span>
                </h5>
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                  <h6 style={{ color: '#1e3a5f', fontWeight: '600', marginBottom: '14px', fontSize: '0.9rem' }}>{editingId ? '✏️ Edit Entry' : '➕ Add New Heritage Site'}</h6>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    {[
                      { key: 'name',        label: 'Name *',      placeholder: "e.g. Magellan's Cross" },
                      { key: 'location',    label: 'Location *',  placeholder: 'e.g. Cebu City' },
                      { key: 'description', label: 'Description', placeholder: 'Short description...' },
                      { key: 'imageUrl',    label: 'Image URL',   placeholder: 'https://example.com/photo.jpg' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{f.label}</label>
                        <input value={heritageForm[f.key]} onChange={e => setHeritageForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputSt} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Category *</label>
                    <select value={heritageForm.category} onChange={e => setHeritageForm(p => ({ ...p, category: e.target.value }))} style={{ ...inputSt, width: '50%' }}>
                      <option value="">Select category</option>
                      <option>Culture</option><option>History</option><option>Traditions</option><option>Natural Resources</option>
                    </select>
                  </div>
                  {heritageForm.imageUrl && (
                    <div style={{ marginBottom: '12px' }}>
                      <img src={heritageForm.imageUrl} alt="preview" onError={e => e.target.style.display = 'none'} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={saveHeritage} disabled={savingHeritage} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#1e3a5f,#2c5282)', color: 'white', fontWeight: '600', fontSize: '0.86rem', opacity: savingHeritage ? 0.7 : 1 }}>
                      <Save size={14} /> {editingId ? 'Update' : 'Save'} Entry
                    </button>
                    {editingId && (
                      <button onClick={() => { setEditingId(null); setHeritageForm({ name: '', category: '', location: '', description: '', imageUrl: '' }); }} style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #d1d5db', background: 'white', color: '#6b7280', cursor: 'pointer', fontSize: '0.86rem' }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {heritage.map(h => (
                    <div key={h.id} style={{ background: 'white', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        {h.imageUrl
                          ? <img src={h.imageUrl} alt={h.name} onError={e => e.target.style.display = 'none'} style={{ width: '52px', height: '42px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                          : <div style={{ width: '52px', height: '42px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><MapPin size={16} color="#9ca3af" /></div>
                        }
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: '600', color: '#1e3a5f', fontSize: '0.88rem' }}>{h.name}</div>
                          <div style={{ color: '#6b7280', fontSize: '0.76rem', marginTop: '1px' }}>{h.category} · {h.location}</div>
                          {h.description && <div style={{ color: '#9ca3af', fontSize: '0.72rem', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.description}</div>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button onClick={() => startEdit(h)} style={{ background: '#eff6ff', border: 'none', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center' }}><Eye size={14} /></button>
                        <button onClick={() => deleteHeritage(h.id)} style={{ background: '#fef2f2', border: 'none', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                  {heritage.length === 0 && <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>No heritage entries yet. Add one above!</p>}
                </div>
              </div>
            )}

            {/* ════════ ANNOUNCEMENTS ════════ */}
            {activeTab === 'announcements' && (
              <div>
                <h5 style={{ color: '#1e3a5f', fontWeight: '700', marginBottom: '18px' }}>
                  Announcements <span style={{ fontSize: '0.82rem', fontWeight: '400', color: '#9ca3af' }}>({announcements.length})</span>
                </h5>
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                  <h6 style={{ color: '#1e3a5f', fontWeight: '600', marginBottom: '14px', fontSize: '0.9rem' }}>📢 Post New Announcement</h6>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Title *</label>
                      <input value={annForm.title} onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title..." style={inputSt} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Type</label>
                      <select value={annForm.type} onChange={e => setAnnForm(p => ({ ...p, type: e.target.value }))} style={{ ...inputSt, width: '130px' }}>
                        {Object.entries(ANN_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.79rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Message *</label>
                    <textarea value={annForm.body} onChange={e => setAnnForm(p => ({ ...p, body: e.target.value }))} placeholder="Write your announcement here..." rows={3} style={{ ...inputSt, resize: 'vertical', lineHeight: '1.5' }} />
                  </div>
                  <button onClick={saveAnnouncement} disabled={savingAnn} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: 'white', fontWeight: '600', fontSize: '0.86rem', opacity: savingAnn ? 0.7 : 1 }}>
                    <Bell size={14} /> Post Announcement
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {announcements.map(a => {
                    const tc = ANN_TYPES[a.type] || ANN_TYPES.info;
                    return (
                      <div key={a.id} style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', borderLeft: `4px solid ${tc.color}` }}>
                        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <span style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '0.9rem' }}>{a.title}</span>
                              <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600', background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>{tc.label}</span>
                            </div>
                            <p style={{ color: '#374151', fontSize: '0.85rem', margin: '0 0 6px', lineHeight: '1.5' }}>{a.body}</p>
                            {a.createdAt?.toDate && <span style={{ color: '#9ca3af', fontSize: '0.72rem' }}>{a.createdAt.toDate().toLocaleString()}</span>}
                          </div>
                          <button onClick={() => deleteAnnouncement(a.id)} style={{ background: '#fef2f2', border: 'none', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {announcements.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                      <Megaphone size={28} style={{ marginBottom: '8px', opacity: 0.3 }} />
                      <p style={{ margin: 0, fontSize: '0.88rem' }}>No announcements yet. Post one above!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </>)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes authSlideIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AdminPanel;