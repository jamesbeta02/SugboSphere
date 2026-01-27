import { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Mountain, ArrowRight, Check, Phone, Calendar, Globe } from 'lucide-react';

function SignUp() {
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [footerHeight, setFooterHeight] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
      
      if (actualAge < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
      } else if (actualAge > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }
    
    if (!formData.country) {
      newErrors.country = 'Please select your country';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Registration successful:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        country: formData.country
      });
      alert('Registration successful! Check console for details.');
    } else {
      setErrors(newErrors);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    if (strength <= 2) return { strength: 33, label: 'Weak', color: '#ef4444' };
    if (strength <= 3) return { strength: 66, label: 'Medium', color: '#f59e0b' };
    return { strength: 100, label: 'Strong', color: '#10b981' };
  };

  const passwordStrength = getPasswordStrength();

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

      {/* Sign Up Form Container */}
      <div className="position-relative d-flex align-items-center justify-content-center py-5" style={{ minHeight: 'calc(100vh - 140px)', zIndex: 1 }}>
        <div 
          className="container"
          style={{
            maxWidth: '600px',
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
              <h2 className="h3 fw-bold text-white mb-2">Create Account</h2>
              <p className="text-white-50 mb-0 small">Use your active email. If you're a student, enter the ID shown on your registration form.</p>
            </div>

            {/* Form */}
            <div className="p-4 p-md-5">
              <div>
                {/* First Name and Last Name Row */}
                <div className="row mb-4">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <label className="form-label fw-semibold" style={{ color: '#1e3a5f', fontSize: '14px' }}>
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className={`form-control py-2 ${errors.firstName ? 'is-invalid' : ''}`}
                      placeholder=""
                      value={formData.firstName}
                      onChange={handleChange}
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: '#1e3a5f', fontSize: '14px' }}>
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className={`form-control py-2 ${errors.lastName ? 'is-invalid' : ''}`}
                      placeholder=""
                      value={formData.lastName}
                      onChange={handleChange}
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#1e3a5f', fontSize: '14px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control py-2 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder=""
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Phone Number and Date of Birth Row */}
                <div className="row mb-4">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <label className="form-label fw-semibold" style={{ color: '#1e3a5f', fontSize: '14px' }}>
                      Phone number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      className={`form-control py-2 ${errors.phoneNumber ? 'is-invalid' : ''}`}
                      placeholder=""
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.phoneNumber && (
                      <div className="invalid-feedback">{errors.phoneNumber}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: '#1e3a5f', fontSize: '14px' }}>
                      Date of birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className={`form-control py-2 ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.dateOfBirth && (
                      <div className="invalid-feedback">{errors.dateOfBirth}</div>
                    )}
                  </div>
                </div>

                {/* Country Field */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#1e3a5f', fontSize: '14px' }}>
                    Country/Region
                  </label>
                  <select
                    name="country"
                    className={`form-select py-2 ${errors.country ? 'is-invalid' : ''}`}
                    value={formData.country}
                    onChange={handleChange}
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      appearance: 'auto'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select your country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="NL">Netherlands</option>
                    <option value="SE">Sweden</option>
                    <option value="NO">Norway</option>
                    <option value="DK">Denmark</option>
                    <option value="FI">Finland</option>
                    <option value="JP">Japan</option>
                    <option value="KR">South Korea</option>
                    <option value="CN">China</option>
                    <option value="IN">India</option>
                    <option value="BR">Brazil</option>
                    <option value="MX">Mexico</option>
                    <option value="AR">Argentina</option>
                    <option value="NZ">New Zealand</option>
                    <option value="SG">Singapore</option>
                    <option value="PH">Philippines</option>
                    <option value="TH">Thailand</option>
                    <option value="MY">Malaysia</option>
                    <option value="ID">Indonesia</option>
                    <option value="VN">Vietnam</option>
                    <option value="ZA">South Africa</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="SA">Saudi Arabia</option>
                  </select>
                  {errors.country && (
                    <div className="invalid-feedback">{errors.country}</div>
                  )}
                </div>

                {/* Password and Confirm Password Row */}
                <div className="row mb-3">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <label className="form-label fw-semibold" style={{ color: '#1e3a5f', fontSize: '14px' }}>
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className={`form-control py-2 pe-5 ${errors.password ? 'is-invalid' : ''}`}
                        placeholder=""
                        value={formData.password}
                        onChange={handleChange}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#3b82f6';
                          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-1 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ color: '#6b7280' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>
                    
                    {formData.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small style={{ color: '#6b7280', fontSize: '12px' }}>Password Strength:</small>
                          <small style={{ color: passwordStrength.color, fontWeight: '600', fontSize: '12px' }}>
                            {passwordStrength.label}
                          </small>
                        </div>
                        <div 
                          className="w-100 rounded-pill overflow-hidden"
                          style={{ height: '3px', backgroundColor: '#e5e7eb' }}
                        >
                          <div
                            style={{
                              width: `${passwordStrength.strength}%`,
                              height: '100%',
                              backgroundColor: passwordStrength.color,
                              transition: 'all 0.3s ease'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: '#1e3a5f', fontSize: '14px' }}>
                      Confirm password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        className={`form-control py-2 pe-5 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder=""
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#3b82f6';
                          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-1 p-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ color: '#6b7280' }}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="mb-4">
                  <div className="form-check">
                    <input 
                      className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                      type="checkbox" 
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      style={{ cursor: 'pointer' }}
                    />
                    <label 
                      className="form-check-label" 
                      htmlFor="agreeTerms"
                      style={{ color: '#6b7280', cursor: 'pointer', fontSize: '14px' }}
                    >
                      I understand that portal access is for school-related transactions only.
                    </label>
                    {errors.agreeTerms && (
                      <div className="invalid-feedback d-block">{errors.agreeTerms}</div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="btn w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  Create account
                </button>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <p className="mb-0" style={{ color: '#6b7280', fontSize: '14px' }}>
                    Already registered?{' '}
                    <a 
                      href="/login" 
                      className="fw-semibold text-decoration-none"
                      style={{ color: '#3b82f6' }}
                    >
                      Sign in
                    </a>
                  </p>
                </div>
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

        .form-control:focus,
        .form-select:focus {
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

export default SignUp;