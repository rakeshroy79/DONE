import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PaymentPage() {
  const [amount, setAmount] = useState<string>('100');
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const UPI_ID = 'gazit6557@okaxis';
  const APP_NAME = 'Brief App';

  // Generate UPI payment link
  const generateUPILink = (amt: string) => {
    const validAmount = amt && !isNaN(parseFloat(amt)) ? parseFloat(amt) : 0;
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(APP_NAME)}&tn=${encodeURIComponent('Claim Reward')}&am=${validAmount}`;
  };

  const upiLink = generateUPILink(amount);

  // Update QR code when amount changes
  useEffect(() => {
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: 200,
        height: 200,
        type: 'svg',
        data: upiLink,
        margin: 10,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: 'H',
        },
        cornersSquareOptions: {
          type: 'square',
        },
        cornersDotOptions: {
          type: 'dot',
        },
        backgroundOptions: {
          color: '#ffffff',
        },
        dotsOptions: {
          color: '#000000',
        },
      });
    } else {
      qrCodeRef.current.update({
        data: upiLink,
      });
    }

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCodeRef.current.append(qrRef.current);
    }
  }, [upiLink]);

  const handlePayment = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    // Direct PhonePe deep link
    const phonePeLink = `phonepe://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(APP_NAME)}&tn=${encodeURIComponent('Claim Reward')}&am=${parseFloat(amount)}&tr=${Date.now()}`;
    
    // Android Intent URL for PhonePe (direct app launch without dialog)
    const androidIntent = `intent://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(APP_NAME)}&tn=${encodeURIComponent('Claim Reward')}&am=${parseFloat(amount)}#Intent;scheme=phonepe;package=com.phonepe.app;end`;
    
    // Detect platform
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    
    if (isAndroid) {
      // Android: Direct PhonePe via Intent
      window.location.href = androidIntent;
    } else if (isIOS) {
      // iOS: Direct PhonePe via scheme
      window.location.href = phonePeLink;
    } else {
      alert('Please open this page on a mobile device');
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Support Us</h1>
        <p className="text-center text-gray-600 mb-8">Make a donation via UPI</p>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount (₹)
          </label>
          <Input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            min="1"
          />
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">Scan to Pay</p>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 flex items-center justify-center">
            <div ref={qrRef} />
          </div>
        </div>

        {/* UPI ID Display */}
        <div className="bg-indigo-50 rounded-lg p-4 mb-6 text-center">
          <p className="text-xs text-gray-600 mb-1">UPI ID</p>
          <p className="text-lg font-bold text-indigo-600">{UPI_ID}</p>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-200"
        >
          Pay ₹{amount || '0'} via UPI
        </Button>

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center mt-4">
          You will be redirected to your UPI app to complete the payment
        </p>
      </div>
    </div>
  );
}
