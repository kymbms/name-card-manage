import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, ArrowLeft, Camera } from 'lucide-react';
import { compressImage } from '../utils/imageUtils';

const ContactForm = ({ initialData, onSubmit, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({

    name: '',
    company: '',
    role: '',
    phone: '',
    fax: '', // Add fax field
    email: '',
    address: '',
    website: '',
    memo: '',
    tags: '', // comma separated string
    category: 'business',
    cardFront: '',
    cardBack: '',
    orientation: 'landscape',
    ...initialData
  });

  useEffect(() => {
    if (initialData) {
      // If tags is array, convert to string
      const tagsStr = Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '';
      
      // Update only if data actually changed to avoid infinite loop or cascading
      setFormData(prev => {
        if (prev.id === initialData.id && prev.tags === tagsStr && prev.photo === initialData.photo) {
          return prev;
        }
        return { ...initialData, tags: tagsStr };
      });
    }
  }, [initialData]);


  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.startsWith('02')) {
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
      if (cleaned.length <= 9) return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    } else {
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      if (cleaned.length <= 11) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'phone' || name === 'fax') {
      // If user is deleting, allow it naturally, but for appending, format it
      // Actually simpler to just always re-format the numeric content
      // But we need to be careful about cursor position if we were doing advanced masking
      // For simple "append" formatting, re-formatting the whole string works fine usually
      newValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Process tags
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      await onSubmit({ ...formData, tags: tagsArray });
    } catch (err) {
      console.error("Form submission error:", err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file, { maxWidth: 600, maxHeight: 600, quality: 0.6 });
        setFormData(prev => ({ ...prev, photo: compressed }));
      } catch (err) {
        console.error("Image compression failed", err);
        // Fallback to normal reader if compression fails
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, photo: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    }
  };




  const handleRescan = (step) => {
    navigate('/scan', { 
      state: { 
        returnPath: location.pathname,
        currentData: formData,
        initialSide: step, // 'front' or 'back'
        singleSide: true   // Only scan this specific side
      } 
    });
  };

  const inputStyle = {
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    fontSize: 'var(--font-size-base)',
    width: '100%',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-primary)'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--text-secondary)'
  };

  const groupStyle = {
    marginBottom: '20px'
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <ArrowLeft size={24} color="var(--text-primary)" />
          </button>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', margin: 0 }}>{title}</h2>
        </div>


      </div>



      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'var(--card-bg)',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Business Card Images Display */}
        {/* Business Card Images Display */}
        {/* Business Card Images Display */}
        {/* Always show placeholders for Front/Back scanning */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
            
            {/* Front Image or Add Button */}
            {formData.cardFront ? (
               <div 
                 onClick={() => handleRescan('front')}
                 title="클릭하여 앞면 재촬영"
                 style={{ flex: '0 0 auto', width: '160px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                 <div style={{ fontSize: '12px', padding: '4px', textAlign: 'center', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>명함 앞면 (재촬영)</div>
                 <img src={formData.cardFront} alt="Card Front" style={{ width: '100%', display: 'block' }} />
               </div>
            ) : (
                <button
                    type="button"
                    onClick={() => handleRescan('front')}
                    style={{
                        flex: '0 0 auto', 
                        width: '160px', 
                        height: '100px', // Approximate height match
                        borderRadius: '8px', 
                        border: '2px dashed var(--border-color)', 
                        cursor: 'pointer',
                        background: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)',
                        gap: '8px'
                    }}
                >
                    <Camera size={24} />
                    <span style={{ fontSize: '12px' }}>앞면 추가 촬영</span>
                </button>
            )}

            {/* Back Image or Add Button */}
            {formData.cardBack ? (
               <div 
                 onClick={() => handleRescan('back')}
                 title="클릭하여 뒷면 재촬영"
                 style={{ flex: '0 0 auto', width: '160px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                 <div style={{ fontSize: '12px', padding: '4px', textAlign: 'center', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>명함 뒷면 (재촬영)</div>
                 <img src={formData.cardBack} alt="Card Back" style={{ width: '100%', display: 'block' }} />
               </div>
            ) : (
                <button
                    type="button"
                    onClick={() => handleRescan('back')}
                    style={{
                        flex: '0 0 auto', 
                        width: '160px', 
                        height: '100px', 
                        borderRadius: '8px', 
                        border: '2px dashed var(--border-color)', 
                        cursor: 'pointer',
                        background: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)',
                        gap: '8px'
                    }}
                >
                    <Camera size={24} />
                    <span style={{ fontSize: '12px' }}>뒷면 추가 촬영</span>
                </button>
            )}
          </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <div 
              onClick={() => document.getElementById('photo-upload').click()}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                backgroundImage: formData.photo ? `url(${formData.photo})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed var(--border-color)',
                overflow: 'hidden'
              }}
            >
              {!formData.photo && <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>프로필 사진</span>}
            </div>
            <input 
              id="photo-upload"
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {formData.photo && (
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  backgroundColor: 'var(--error-color)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>이름 *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={{ ...inputStyle, imeMode: 'active' }}
            placeholder="홍길동"
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>회사</label>
          <input 
            type="text" 
            name="company" 
            value={formData.company} 
            onChange={handleChange} 
            style={{ ...inputStyle, imeMode: 'active' }}
            placeholder="회사명"
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>직함</label>
          <input 
            type="text" 
            name="role" 
            value={formData.role} 
            onChange={handleChange} 
            style={{ ...inputStyle, imeMode: 'active' }}
            placeholder="대표 / 팀장"
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>전화번호</label>
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            style={inputStyle}
            placeholder="010-0000-0000"
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>팩스 번호</label>
          <input 
            type="tel" 
            name="fax" 
            value={formData.fax} 
            onChange={handleChange} 
            style={inputStyle}
            placeholder="02-1234-5678"
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>이메일</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            style={inputStyle}
            placeholder="email@example.com"
          />
        </div>

          <div style={groupStyle}>
            <label style={labelStyle}>주소</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              style={{ ...inputStyle, imeMode: 'active' }}
              placeholder="서울시 강남구 테헤란로 123"
              lang="ko"
            />
          </div>

        <div style={groupStyle}>
          <label style={labelStyle}>웹사이트</label>
          <input 
            type="text" 
            name="website" 
            value={formData.website} 
            onChange={handleChange} 
            style={inputStyle}
            placeholder="www.example.com"
          />
        </div>
        
        <div style={groupStyle}>
          <label style={labelStyle}>태그 (쉼표로 구분)</label>
          <input 
            type="text" 
            name="tags" 
            value={formData.tags} 
            onChange={handleChange} 
            style={{ ...inputStyle, imeMode: 'active' }}
            placeholder="개발, 마케팅, 친목"
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>메모</label>
          <textarea 
            name="memo" 
            value={formData.memo} 
            onChange={handleChange} 
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', imeMode: 'active' }}
            placeholder="메모를 입력하세요..."
          />
        </div>

        <button 
          type="submit" 
          className="btn-interactive"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: isSubmitting ? 'var(--text-secondary)' : 'var(--primary-color)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-md)',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%' }}></div>
              저장 중...
            </>
          ) : (
            <>
              <Save size={20} />
              저장하기
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default ContactForm;
