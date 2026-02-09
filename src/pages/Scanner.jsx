import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { X, RotateCcw, Check, Upload, ArrowRight, SkipForward, RotateCw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { compressImage } from '../utils/imageUtils';
import './Scanner.css';


const Scanner = () => {
  const webcamRef = useRef(null);
  const guideRef = useRef(null);
  const navigate = useNavigate();
  
  // State for dual-side scanning
  const location = useLocation(); // Add useLocation hook
  const { returnPath, currentData, initialSide, singleSide } = location.state || {};

  // State for dual-side scanning
  // Initialize scanSide based on passed state, default to 'front'
  const [scanSide, setScanSide] = useState(initialSide || 'front'); // 'front' or 'back'
  const [orientation, setOrientation] = useState(currentData?.orientation || 'landscape'); // 'landscape' or 'portrait'

  const [scannedImages, setScannedImages] = useState({ 
      front: currentData?.cardFront || null, 
      back: currentData?.cardBack || null 
  });
  const [capturedImage, setCapturedImage] = useState(null); // Current preview image
  const [error, setError] = useState('');

  // Check for secure context or guide user
  useEffect(() => {
    if (window.location.hostname !== 'localhost' && window.location.protocol !== 'https:') {
      // Use a timeout or state check to avoid synchronous setState warning if strictly needed,
      // but usually this is fine if it only runs once on mount. To be safe:
      const timer = setTimeout(() => {
          setError('카메라를 사용하려면 HTTPS 연결이 필요합니다. \n\n1. PC나 모바일 브라우저 주소창이 "https://"로 시작하는지 확인해주세요.\n2. "연결이 비공개로 설정되어 있지 않습니다" 경고가 뜨면 "고급" -> "안전하지 않음으로 이동"을 클릭하여 접속하세요.');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleOrientation = () => {
    setOrientation(prev => prev === 'landscape' ? 'portrait' : 'landscape');
  };

  const capture = useCallback(() => {
    const video = webcamRef.current?.video;
    const guide = guideRef.current;
    
    if (!video || !guide) {
        console.error("Camera or Guide not ready");
        return;
    }

    // 1. Get dimensions
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const videoRect = video.getBoundingClientRect(); 
    const guideRect = guide.getBoundingClientRect();

    // 2. Calculate scale and offsets because of object-fit: cover
    const containerWidth = videoRect.width;
    const containerHeight = videoRect.height;
    const scale = Math.max(containerWidth / videoWidth, containerHeight / videoHeight);
    
    const renderWidth = videoWidth * scale;
    const renderHeight = videoHeight * scale;
    const offsetX = (renderWidth - containerWidth) / 2;
    const offsetY = (renderHeight - containerHeight) / 2;
    
    // 3. Calculate Guide position relative to the video element
    const guideX_container = guideRect.left - videoRect.left;
    const guideY_container = guideRect.top - videoRect.top;
    
    // 4. Map Guide position to the SOURCE video coordinates
    const sourceX = (guideX_container + offsetX) / scale;
    const sourceY = (guideY_container + offsetY) / scale;
    const sourceW = guideRect.width / scale;
    const sourceH = guideRect.height / scale;

    // 5. Draw to canvas
    const canvas = document.createElement('canvas');
    canvas.width = sourceW;
    canvas.height = sourceH;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(video, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);
    
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9); // Quality increased for better OCR
    setCapturedImage(croppedImage);
  }, [webcamRef]);

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleNext = () => {
    // If singleSide mode, treat Next as Save (shouldn't really happen for 'front' in single mode unless we change UI text)
    if (singleSide) {
        handleSave();
        return;
    }

    if (scanSide === 'front') {
        setScannedImages(prev => ({ ...prev, front: capturedImage }));
        setScanSide('back');
        setCapturedImage(null);
    }
  };

  const handleSave = () => {
    // Determine what we are saving
    let finalFront = scannedImages.front;
    let finalBack = scannedImages.back;

    if (scanSide === 'front') {
        finalFront = capturedImage;
    } else if (scanSide === 'back') {
        finalBack = capturedImage;
    }
    
    // Prepare validation or merging data
    const newData = {
        ...currentData,
        cardFront: finalFront,
        cardBack: finalBack,
        orientation: orientation 
    };

    // Navigate back to where we came from (Add or Edit)
    // If no returnPath, default to Add
    const targetPath = returnPath || '/contacts/add';
    
    navigate(targetPath, { 
      state: { 
        ...newData // Pass merged data back
      } 
    });
  };

  const handleSkipBack = () => {
     // Prepare data skipping back image
     const newData = {
        ...currentData,
        cardFront: scannedImages.front || (currentData && currentData.cardFront),
        cardBack: null, 
        orientation: orientation 
    };

    const targetPath = returnPath || '/contacts/add';

     navigate(targetPath, { 
      state: { 
        ...newData
      } 
    });
  };

  // File upload handler with compression
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file, { maxWidth: 2000, maxHeight: 2000, quality: 0.8 });
        setCapturedImage(compressed);
      } catch (err) {
        console.error("Scanner image compression failed", err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setCapturedImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };


  return (
    <div className="page-container scanner-page">
      <Header 
        title={scanSide === 'front' ? "명함 앞면 촬영" : "명함 뒷면 촬영"} 
        subtitle="CAMERA" 
        showProfile={false} 
      />
      
      <div className="scanner-container">
        {!capturedImage ? (
          <div className="camera-view">
            {error ? (
              <div className="camera-error-view" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%', 
                padding: '20px', 
                textAlign: 'center',
                color: 'white'
              }}>
                <p style={{ marginBottom: '20px' }}>{error}</p>
                <label className="save-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', cursor: 'pointer' }}>
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  <Upload size={20} /> 사진 업로드
                </label>
              </div>
            ) : (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ 
                    facingMode: "environment",
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                  }}
                  className="webcam-feed"
                  onUserMediaError={() => setError("카메라 접근 권한이 없거나 지원하지 않는 브라우저입니다.")}
                />
                <div className="scanner-overlay">
                  <div className="scan-line"></div>
                  <div className={`scan-guide ${orientation}`} ref={guideRef}></div>
                  <p className="scan-instruction">
                    {scanSide === 'front' ? "명함 앞면을 가이드에 맞춰주세요" : "명함 뒷면을 가이드에 맞춰주세요"}
                  </p>
                </div>
                
                <button className="capture-btn" onClick={capture}>
                  <div className="capture-inner"></div>
                </button>

                {/* Orientation Toggle Button (Top Right) */}
                <button 
                    onClick={toggleOrientation}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        zIndex: 20,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    <RotateCw size={16} />
                    <span>{orientation === 'landscape' ? '가로' : '세로'}</span>
                </button>
                
                {/* Gallery Upload Button (Left) */}
                <label className="gallery-btn" style={{ 
                  position: 'absolute', 
                  bottom: '40px', 
                  left: '40px', 
                  zIndex: 20,
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '50%', marginBottom: '5px' }}>
                    <Upload size={24} />
                  </div>
                  <span>앨범</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>

                {/* Skip Button (Right) - Only for Back side AND NOT singleSide mode */}
                {scanSide === 'back' && !singleSide && (
                    <button 
                        onClick={handleSkipBack}
                        style={{ 
                            position: 'absolute', 
                            bottom: '40px', 
                            right: '40px', 
                            zIndex: 20,
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            fontSize: '12px',
                            cursor: 'pointer',
                            background: 'transparent',
                            border: 'none'
                        }}
                    >
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '50%', marginBottom: '5px' }}>
                            <SkipForward size={24} />
                        </div>
                        <span>건너뛰기</span>
                    </button>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="preview-view">
            <img src={capturedImage} alt="Captured" className="captured-image" />
            
            <div className="preview-info">
               <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '20px' }}>
                 {scanSide === 'front' 
                    ? "앞면이 선명하게 찍혔나요?" 
                    : "뒷면이 선명하게 찍혔나요?"}
               </p>
            </div>

            <div className="action-buttons">
              <button className="retake-btn" onClick={handleRetake}>
                <RotateCcw size={20} /> 재촬영
              </button>
              
              {/* Show Next only if it's front side AND NOT singleSide mode */}
              {scanSide === 'front' && !singleSide ? (
                <button className="save-btn" onClick={handleNext}>
                    <span>다음 (뒷면 촬영)</span> <ArrowRight size={20} />
                </button>
              ) : (
                <button className="save-btn" onClick={handleSave}>
                    <Check size={20} /> 저장하기
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <button className="close-btn" onClick={() => navigate('/')}>
        <X size={24} />
      </button>
    </div>
  );
};
export default Scanner;
