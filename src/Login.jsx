import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Mountain, ArrowRight } from 'lucide-react';

function Login() {
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [footerHeight, setFooterHeight] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const navbar = document.querySelector('nav');
      if (navbar) setNavbarHeight(navbar.offsetHeight);
      const footer = document.querySelector('footer');
      if (footer) setFooterHeight(footer.offsetHeight);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Login successful:', formData);
      alert('Login successful! Check console for details.');
      // Add your login logic here
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div 
      style={{ 
        paddingTop: `${navbarHeight}px`,
        paddingBottom: `${footerHeight}px`,
        minHeight: '100vh',
        backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Gradient Overlay */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.85) 0%, rgba(44, 82, 130, 0.75) 50%, rgba(26, 54, 93, 0.9) 100%)'
        }}
      />

      {/* Animated Particles */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ overflow: 'hidden' }}>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="position-absolute"
            style={{
              width: '4px',
              height: '4px',
              backgroundColor: 'rgba(147, 197, 253, 0.3)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Login Form Container */}
      <div className="position-relative d-flex align-items-center justify-content-center py-5" style={{ minHeight: 'calc(100vh - 140px)', zIndex: 1 }}>
        <div 
          className="container"
          style={{
            maxWidth: '450px',
            animation: 'fadeInUp 0.8s ease'
          }}
        >
          <div 
            className="card border-0 shadow-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div 
              className="text-center pt-5 pb-4 px-4"
              style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)'
              }}
            >
              <div className="d-flex justify-content-center mb-3">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: '70px',
                    height: '70px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Mountain size={36} color="#93c5fd" />
                </div>
              </div>
              <h2 className="h3 fw-bold text-white mb-2">Welcome Back</h2>
              <p className="text-white-50 mb-0">Log in to continue your journey</p>
            </div>

            {/* Form */}
            <div className="p-4 p-md-5">
              <div>
                {/* Email Field */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#1e3a5f' }}>
                    Email Address
                  </label>
                  <div className="position-relative">
                    <Mail 
                      size={18} 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3"
                      style={{ color: '#6b7280' }}
                    />
                    <input
                      type="email"
                      name="email"
                      className={`form-control ps-5 py-3 ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#1e3a5f' }}>
                    Password
                  </label>
                  <div className="position-relative">
                    <Lock 
                      size={18} 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3"
                      style={{ color: '#6b7280' }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className={`form-control ps-5 pe-5 py-3 ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ color: '#6b7280' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="rememberMe"
                      style={{ cursor: 'pointer' }}
                    />
                    <label 
                      className="form-check-label small" 
                      htmlFor="rememberMe"
                      style={{ color: '#6b7280', cursor: 'pointer' }}
                    >
                      Remember me
                    </label>
                  </div>
                  <a 
                    href="#" 
                    className="small text-decoration-none"
                    style={{ color: '#3b82f6' }}
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="btn w-100 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                  }}
                >
                  Log In <ArrowRight size={20} />
                </button>
              </div>

              {/* Divider */}
              <div className="position-relative my-4">
                <hr style={{ borderColor: '#e5e7eb' }} />
                <span 
                  className="position-absolute top-50 start-50 translate-middle px-3 small"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#6b7280'
                  }}
                >
                  OR
                </span>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="mb-0" style={{ color: '#6b7280' }}>
                  Don't have an account?{' '}
                  <a 
                    href="/signup" 
                    className="fw-semibold text-decoration-none"
                    style={{ color: '#3b82f6' }}
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        .form-control:focus {
          outline: none;
        }

        .form-check-input:checked {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .form-check-input:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}

export default Login;