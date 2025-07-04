import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, AlertCircle, RotateCcw } from 'lucide-react';
import { BrowserQRCodeReader } from '@zxing/library';
import toast from 'react-hot-toast';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const codeReader = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera if available
        } 
      });
      
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Initialize QR code reader
      codeReader.current = new BrowserQRCodeReader();
      
      try {
        const result = await codeReader.current.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result, error) => {
            if (result) {
              handleQRCodeResult(result.getText());
            }
          }
        );
      } catch (err) {
        console.error('QR scanning error:', err);
      }

    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
      setHasPermission(false);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    // Stop video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Stop QR reader
    if (codeReader.current) {
      codeReader.current.reset();
    }
  };

  const handleQRCodeResult = (data) => {
    try {
      // Parse QR code data - expected format: {"shopId": "123", "shopName": "Mike's Barbershop"}
      const qrData = JSON.parse(data);
      
      if (qrData.shopId) {
        toast.success(`Found ${qrData.shopName || 'barbershop'}!`);
        stopScanning();
        navigate(`/customer/book/${qrData.shopId}`);
      } else {
        toast.error('Invalid QR code format');
      }
    } catch (err) {
      // If it's not JSON, treat it as a simple shop ID
      if (data && data.length > 0) {
        toast.success('Barbershop found!');
        stopScanning();
        navigate(`/customer/book/${data}`);
      } else {
        toast.error('Invalid QR code');
      }
    }
  };

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      setError(null);
    } catch (err) {
      setHasPermission(false);
      setError('Camera permission denied');
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Scan QR Code</h1>
        <p className="page-subtitle">
          Point your camera at a barbershop QR code to book instantly
        </p>
      </div>

      <div className="mb-8">
        {/* Camera Permission State */}
        {hasPermission === null && (
          <div className="card text-center">
            <Camera size={48} className="mx-auto mb-4 text-muted" />
            <h3 className="font-semibold mb-2">Camera Access Required</h3>
            <p className="text-muted mb-4">
              We need access to your camera to scan QR codes
            </p>
            <button 
              onClick={requestPermission}
              className="btn btn-primary btn-full"
            >
              Grant Camera Access
            </button>
          </div>
        )}

        {/* Permission Denied */}
        {hasPermission === false && (
          <div className="card text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h3 className="font-semibold mb-2">Camera Access Denied</h3>
            <p className="text-muted mb-4">
              Please enable camera permissions in your browser settings to scan QR codes
            </p>
            <div className="space-y-2">
              <button 
                onClick={requestPermission}
                className="btn btn-primary btn-full"
              >
                <RotateCcw size={16} />
                Try Again
              </button>
              <p className="text-xs text-muted">
                You can also manually enter a shop code or discover shops nearby
              </p>
            </div>
          </div>
        )}

        {/* Camera View */}
        {hasPermission === true && (
          <div className="space-y-4">
            <div className="qr-scanner-container">
              <video
                ref={videoRef}
                className="w-full h-auto rounded-lg"
                playsInline
                muted
              />
              
              {isScanning && (
                <div className="qr-scanner-overlay">
                  <div className="qr-scanner-frame">
                    <div className="qr-scanner-corner top-left"></div>
                    <div className="qr-scanner-corner top-right"></div>
                    <div className="qr-scanner-corner bottom-left"></div>
                    <div className="qr-scanner-corner bottom-right"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {!isScanning ? (
                <button
                  onClick={startScanning}
                  className="btn btn-primary btn-full"
                >
                  <Camera size={20} />
                  Start Scanning
                </button>
              ) : (
                <button
                  onClick={stopScanning}
                  className="btn btn-secondary btn-full"
                >
                  <X size={20} />
                  Stop Scanning
                </button>
              )}
            </div>

            {/* Scanning Status */}
            {isScanning && (
              <div className="card text-center">
                <div className="animate-pulse">
                  <div className="w-8 h-8 bg-accent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Scanning for QR codes...</p>
                  <p className="text-xs text-muted">
                    Position the QR code within the frame above
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alternative Actions */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted mb-4">
            Don't have a QR code?
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/customer/discover')}
              className="btn btn-secondary btn-full"
            >
              Find Nearby Shops
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="card">
          <h3 className="font-semibold mb-3">How to use QR Scanner</h3>
          <div className="space-y-2 text-sm text-muted">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              <p>Allow camera access when prompted</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
              <p>Point your camera at the barbershop's QR code</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
              <p>The app will automatically detect and process the code</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
              <p>You'll be redirected to book an appointment instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;