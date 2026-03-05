import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Bell, X, Info, AlertTriangle, CheckCircle, AlertOctagon, Clock } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const ANN_TYPES = {
  info:    { icon: Info,          color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', label: 'Info'    },
  warning: { icon: AlertTriangle, color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', label: 'Warning' },
  success: { icon: CheckCircle,   color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Success' },
  urgent:  { icon: AlertOctagon,  color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Urgent'  },
};

function timeAgo(timestamp) {
  if (!timestamp?.toDate) return '';
  const diff  = Date.now() - timestamp.toDate().getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function NotificationBell() {
  const [open, setOpen]                   = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [readIds, setReadIds]             = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('readAnnouncements') || '[]')); }
    catch { return new Set(); }
  });
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const bellRef                       = useRef(null);
  const dropdownRef                   = useRef(null);

  // Real-time Firestore listener
  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Recalculate position every time dropdown opens
  useEffect(() => {
    if (open && bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 10, right: window.innerWidth - rect.right });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        bellRef.current     && !bellRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on scroll or resize
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, []);

  const unreadCount = announcements.filter(a => !readIds.has(a.id)).length;

  const markAllRead = () => {
    const allIds = announcements.map(a => a.id);
    setReadIds(new Set(allIds));
    localStorage.setItem('readAnnouncements', JSON.stringify(allIds));
  };

  // Portal dropdown — renders on document.body, never clipped by navbar
  const dropdown = open && ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top:      `${dropdownPos.top}px`,
        right:    `${dropdownPos.right}px`,
        width:    '360px',
        background:   'white',
        borderRadius: '18px',
        boxShadow:    '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
        border:       '1px solid #e5e7eb',
        zIndex:       999999,
        overflow:     'hidden',
        animation:    'notifSlide 0.2s ease',
      }}
    >
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2c5282)', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} color="white" />
          <span style={{ color: 'white', fontWeight: '700', fontSize: '0.92rem' }}>Announcements</span>
          {unreadCount > 0 && (
            <span style={{ background: '#ef4444', color: 'white', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '700', padding: '1px 7px' }}>
              {unreadCount} new
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.72rem', fontWeight: '600', padding: '4px 10px', cursor: 'pointer' }}>
              Mark all read
            </button>
          )}
          <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: 'white', padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Announcement list */}
      <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {announcements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
            <Bell size={32} style={{ opacity: 0.25, marginBottom: '10px' }} />
            <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '500' }}>No announcements yet</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>Check back later for updates</p>
          </div>
        ) : (
          announcements.map(a => {
            const tc       = ANN_TYPES[a.type] || ANN_TYPES.info;
            const TypeIcon = tc.icon;
            const isUnread = !readIds.has(a.id);
            return (
              <div key={a.id} style={{
                background:   isUnread ? tc.bg : '#fafafa',
                border:       `1px solid ${isUnread ? tc.border : '#f0f0f0'}`,
                borderLeft:   `4px solid ${isUnread ? tc.color : '#e5e7eb'}`,
                borderRadius: '12px',
                padding:      '12px 14px',
                position:     'relative',
                transition:   'all 0.2s ease',
              }}>
                {isUnread && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', background: tc.color, boxShadow: `0 0 6px ${tc.color}88` }} />
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `${tc.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    <TypeIcon size={15} color={tc.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: '700', color: '#1e3a5f', fontSize: '0.86rem', lineHeight: 1.3, display: 'block', marginBottom: '3px' }}>{a.title}</span>
                    <p style={{ color: '#4b5563', fontSize: '0.81rem', margin: '0 0 6px', lineHeight: '1.5' }}>{a.body}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={11} color="#9ca3af" />
                      <span style={{ color: '#9ca3af', fontSize: '0.72rem' }}>{timeAgo(a.createdAt)}</span>
                      <span style={{ marginLeft: '4px', padding: '1px 7px', borderRadius: '20px', fontSize: '0.66rem', fontWeight: '600', background: `${tc.color}18`, color: tc.color }}>{tc.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {announcements.length > 0 && (
        <div style={{ padding: '10px 14px', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
          <span style={{ fontSize: '0.76rem', color: '#9ca3af' }}>
            {announcements.length} total announcement{announcements.length !== 1 ? 's' : ''} from SugboSphere
          </span>
        </div>
      )}

      <style>{`
        @keyframes notifSlide {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );

  return (
    <>
      {/* Bell button */}
      <button
        ref={bellRef}
        onClick={() => setOpen(p => !p)}
        title="Announcements"
        style={{
          position:       'relative',
          background:     open ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.08)',
          border:         `1px solid ${open ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.15)'}`,
          borderRadius:   '12px',
          padding:        '8px 10px',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          transition:     'all 0.2s ease',
          color:          open ? '#3b82f6' : 'white',
        }}
      >
        <Bell size={18} style={{ animation: unreadCount > 0 ? 'bellRing 2s ease infinite' : 'none' }} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-5px', right: '-5px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white', borderRadius: '20px', fontSize: '0.62rem',
            fontWeight: '700', padding: '1px 5px', minWidth: '16px',
            textAlign: 'center', border: '2px solid white', lineHeight: '1.4',
            boxShadow: '0 2px 6px rgba(239,68,68,0.5)', animation: 'badgePop 0.3s ease',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Portal */}
      {dropdown}

      <style>{`
        @keyframes bellRing {
          0%, 100% { transform: rotate(-15deg); }
          25%       { transform: rotate(15deg);  }
          50%       { transform: rotate(-10deg); }
          75%       { transform: rotate(10deg);  }
        }
        @keyframes badgePop {
          0%   { transform: scale(0);   }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1);   }
        }
      `}</style>
    </>
  );
}

export default NotificationBell;