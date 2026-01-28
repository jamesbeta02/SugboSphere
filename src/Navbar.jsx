import { Home, Compass, Map, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: Compass, label: 'Explore', to: '/explore' },
    { icon: Map, label: 'Destinations', to: '/destinations' },
    { icon: Globe, label: 'About', to: '/about' },
  ];

  if (typeof window !== 'undefined') {
    window.navbarIsOpen = isOpen;
  }
  
  return (
    <nav 
      className="bg-dark text-white position-fixed w-100"
      style={{
        top: 0,
        left: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #1a365d 100%)',
        animation: 'fadeIn 0.5s ease'
      }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-center justify-content-md-between py-3 px-2">
          {/* Logo - Centered for mobile, left for desktop */}
          <div className="d-flex align-items-center">
            <Link to="/" className="text-white text-decoration-none">
              <div className="d-flex align-items-center gap-3">
                {/* Brand Name Only */}
                <div>
                  <h1 
                    className="h4 mb-0 fw-bold" 
                    style={{ 
                      letterSpacing: '2px',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      background: 'linear-gradient(90deg, #fff 0%, #93c5fd 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    SUGBOSPHERE
                  </h1>
                  <small 
                    className="text-muted d-none d-md-block" 
                    style={{ 
                      fontSize: '0.65rem', 
                      letterSpacing: '1.5px', 
                      color: '#60a5fa' 
                    }}
                  >
                    CEBU HERITAGE EXPLORER
                  </small>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="d-none d-md-flex align-items-center gap-1 position-absolute start-50 translate-middle-x">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="d-flex align-items-center gap-2 px-3 py-2 text-white text-decoration-none rounded"
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `slideDown 0.5s ease ${index * 0.1}s backwards`,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                    boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isActive ? 'rgba(59, 130, 246, 0.3)' : 'transparent';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = isActive ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none';
                  }}
                >
                  <item.icon size={18} style={{ transition: 'transform 0.3s' }} />
                  <span className="small fw-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Cebu Heritage Badge - Right side for desktop */}
          <div className="d-none d-md-flex align-items-center gap-2">
            <div style={{
              padding: '8px 16px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: '500',
              animation: 'fadeIn 0.6s ease'
            }}>
              🏝️ Cebu Heritage
            </div>
          </div>

          {/* Hamburger Menu Button - Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-dark p-2 d-md-none position-absolute end-0 me-3"
            style={{ 
              border: 'none',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0)'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div 
            className="d-md-none border-top border-secondary"
            style={{
              animation: 'slideDownMenu 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="py-2">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="d-flex align-items-center gap-3 px-3 py-3 text-white text-decoration-none"
                    style={{
                      transition: 'all 0.3s ease',
                      animation: `slideInLeft 0.4s ease ${index * 0.1}s backwards`,
                      borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                      e.currentTarget.style.borderLeftColor = '#3b82f6';
                      e.currentTarget.style.paddingLeft = '20px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent';
                      e.currentTarget.style.borderLeftColor = isActive ? '#3b82f6' : 'transparent';
                      e.currentTarget.style.paddingLeft = '12px';
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={20} />
                    <span className="small fw-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Project Info - Mobile */}
              <div className="px-3 py-3 mt-2 border-top border-secondary" style={{ animation: 'fadeIn 0.6s ease' }}>
                <div className="text-center">
                  <div style={{
                    padding: '10px 15px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🏝️</span>
                    Cebu Cultural Heritage Explorer
                  </div>
                  <p className="text-white-50 small mt-2 mb-0">
                    Exploring Cebu's rich cultural and natural heritage
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDownMenu {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;