import React, { useState, useEffect, useRef } from 'react';
import { Download, Share, Copy, QrCode } from 'lucide-react';
import QRCodeGenerator from 'qrcode';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const QRGenerator = () => {
  const { user } = useAuth();
  const [qrDataURL, setQrDataURL] = useState('');
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    generateQRCode();
  }, [user]);

  const generateQRCode = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Create QR code data
      const qrData = JSON.stringify({
        shopId: user.id,
        shopName: user.shopName,
        barber: user.name,
        type: 'barber_booking'
      });

      // Generate QR code
      const dataURL = await QRCodeGenerator.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });

      setQrDataURL(dataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrDataURL) return;

    const link = document.createElement('a');
    link.download = `${user.shopName.replace(/\s+/g, '_')}_QR_Code.png`;
    link.href = qrDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR code downloaded successfully!');
  };

  const copyQRCode = async () => {
    if (!qrDataURL) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrDataURL);
      const blob = await response.blob();
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      toast.success('QR code copied to clipboard!');
    } catch (error) {
      // Fallback: copy the shop URL instead
      const shopUrl = `${window.location.origin}/customer/book/${user.id}`;
      await navigator.clipboard.writeText(shopUrl);
      toast.success('Shop link copied to clipboard!');
    }
  };

  const shareQRCode = async () => {
    if (!navigator.share) {
      toast.error('Sharing is not supported on this device');
      return;
    }

    try {
      const response = await fetch(qrDataURL);
      const blob = await response.blob();
      const file = new File([blob], `${user.shopName}_QR_Code.png`, { type: 'image/png' });

      await navigator.share({
        title: `${user.shopName} - Book an Appointment`,
        text: `Scan this QR code to book an appointment at ${user.shopName}`,
        files: [file]
      });
    } catch (error) {
      // Fallback: share the shop URL
      const shopUrl = `${window.location.origin}/customer/book/${user.id}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${user.shopName} - Book an Appointment`,
            text: `Book an appointment at ${user.shopName}`,
            url: shopUrl
          });
        } catch (shareError) {
          await navigator.clipboard.writeText(shopUrl);
          toast.success('Shop link copied to clipboard!');
        }
      }
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Your QR Code</h1>
        <p className="page-subtitle">
          Let customers scan this code to book appointments instantly
        </p>
      </div>

      {/* QR Code Display */}
      <div className="card text-center mb-8">
        {loading ? (
          <div className="py-16">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-muted">Generating your QR code...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-block p-4 bg-white rounded-2xl shadow-lg">
                <img
                  src={qrDataURL}
                  alt="Shop QR Code"
                  className="w-64 h-64 mx-auto"
                />
              </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{user?.shopName}</h3>
            <p className="text-muted mb-6">
              Customers can scan this QR code with their camera or the BarberEase app 
              to book appointments instantly.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={downloadQRCode}
                className="btn btn-primary btn-full"
              >
                <Download size={20} />
                Download QR Code
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyQRCode}
                  className="btn btn-secondary"
                >
                  <Copy size={16} />
                  Copy
                </button>
                
                <button
                  onClick={shareQRCode}
                  className="btn btn-secondary"
                >
                  <Share size={16} />
                  Share
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-4">How to use your QR code</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
            <div>
              <p className="font-medium mb-1">Print and Display</p>
              <p className="text-muted">Download and print your QR code. Display it prominently in your shop where customers can easily see and scan it.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
            <div>
              <p className="font-medium mb-1">Customer Scans</p>
              <p className="text-muted">Customers can scan the code using their phone camera or the BarberEase app to access your booking page instantly.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
            <div>
              <p className="font-medium mb-1">Instant Booking</p>
              <p className="text-muted">They'll be taken directly to your appointment booking page where they can select services and available time slots.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
            <div>
              <p className="font-medium mb-1">Receive Notifications</p>
              <p className="text-muted">You'll receive notifications for new bookings and can manage them in your appointment dashboard.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Display Tips */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-4">Display Tips</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <QrCode size={20} className="text-accent flex-shrink-0" />
            <div>
              <p className="font-medium">Size Matters</p>
              <p className="text-muted">Make sure the QR code is at least 2x2 inches when printed for easy scanning</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <QrCode size={20} className="text-accent flex-shrink-0" />
            <div>
              <p className="font-medium">Good Lighting</p>
              <p className="text-muted">Place it in a well-lit area where customers can easily position their phones</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <QrCode size={20} className="text-accent flex-shrink-0" />
            <div>
              <p className="font-medium">Eye Level</p>
              <p className="text-muted">Position at eye level or slightly below for comfortable scanning</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <QrCode size={20} className="text-accent flex-shrink-0" />
            <div>
              <p className="font-medium">Include Instructions</p>
              <p className="text-muted">Add a simple "Scan to Book" message near the QR code</p>
            </div>
          </div>
        </div>
      </div>

      {/* Regenerate Option */}
      <div className="card">
        <h3 className="font-semibold mb-3">Need a new QR code?</h3>
        <p className="text-muted mb-4">
          If you need to regenerate your QR code for any reason, you can create a new one below.
          Note that the old QR code will still work.
        </p>
        <button
          onClick={generateQRCode}
          className="btn btn-secondary"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Regenerate QR Code'}
        </button>
      </div>
    </div>
  );
};

export default QRGenerator;