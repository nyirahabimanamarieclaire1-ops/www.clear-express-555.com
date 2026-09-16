import React, { useState, useRef } from 'react';
import { Order } from '../../shared/types.ts';
import { Camera, Check, ShieldCheck, PenTool, X, AlertCircle } from 'lucide-react';

interface ProofOfDeliveryModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    recipientName: string;
    otpCode: string;
    signatureDataUrl: string;
    photoUrl: string;
    notes?: string;
  }) => Promise<void>;
}

export const ProofOfDeliveryModal: React.FC<ProofOfDeliveryModalProps> = ({
  order,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [recipientName, setRecipientName] = useState(order.destination.contactName || '');
  const [otpInput, setOtpInput] = useState('');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80'
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  if (!isOpen) return null;

  // Signature pad handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#0A2540';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!recipientName.trim()) {
      setError('Recipient name is required');
      return;
    }

    if (order.otpCode && otpInput !== order.otpCode) {
      setError(`Invalid OTP code. The correct customer OTP for this package is ${order.otpCode}`);
      return;
    }

    const canvas = canvasRef.current;
    const signatureDataUrl = canvas && hasSignature ? canvas.toDataURL() : 'sig_verified_demo';

    setIsSubmitting(true);
    try {
      await onComplete({
        recipientName: recipientName.trim(),
        otpCode: otpInput,
        signatureDataUrl,
        photoUrl,
        notes,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record Proof of Delivery');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0A2540] text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Proof of Delivery (POD)</h3>
              <p className="text-[11px] text-slate-300">Order #{order.trackingNumber}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Recipient Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Recipient Full Name *
            </label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              placeholder="Full name of receiver"
            />
          </div>

          {/* Customer OTP */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Customer OTP Verification Code *</label>
              {order.otpCode && (
                <span className="text-[10px] text-slate-400 font-mono">
                  (Customer OTP: <strong>{order.otpCode}</strong>)
                </span>
              )}
            </div>
            <input
              type="text"
              required
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="w-full px-3 py-2 font-mono text-center tracking-widest text-base font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              placeholder="Enter 4-digit code"
            />
          </div>

          {/* Digital Signature Canvas */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5 text-[#0047AB]" />
                <span>Recipient Digital Signature</span>
              </label>
              <button
                type="button"
                onClick={clearSignature}
                className="text-[10px] text-rose-600 font-semibold hover:underline"
              >
                Clear
              </button>
            </div>
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 relative touch-none">
              <canvas
                ref={canvasRef}
                width={360}
                height={110}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-[110px] cursor-crosshair block"
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs pointer-events-none">
                  Sign with finger or mouse here
                </div>
              )}
            </div>
          </div>

          {/* Photo Confirmation Preview */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>Package Handover Photo (Simulated)</span>
            </label>
            <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-100">
              <img
                src={photoUrl}
                alt="Delivery proof"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                GPS: {order.destination.lat.toFixed(4)}, {order.destination.lng.toFixed(4)}
              </div>
            </div>
          </div>

          {/* Delivery Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Left with office front desk receptionist"
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{isSubmitting ? 'Verifying POD...' : 'COMPLETE DELIVERY'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
