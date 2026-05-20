"use client";

import { useState, useRef, useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { verifyLogin } from "@/store/authSlice";
import { useTranslations } from "next-intl";

interface OtpModalProps {
  phone: string;
  onVerified: () => void;
  onClose: () => void;
  mode: "login" | "register";
}

export function OtpModal({ phone, onVerified, onClose, mode }: OtpModalProps) {
  const t = useTranslations("Auth");
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const timer = setInterval(() => {
      setResendCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      if (i < 5) newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((d) => !d);
    inputRefs.current[nextEmpty >= 0 ? nextEmpty : 4]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 5) {
      toast.error(t("otpError"));
      return;
    }
    setLoading(true);
    dispatch(verifyLogin({ phone, otp: code })).then((result) => {
      setLoading(false);
      if (verifyLogin.fulfilled.match(result)) {
        toast.success(mode === "register" ? t("verified") : t("loginSuccessful"));
        onVerified();
      } else {
        toast.error(result.payload as string || t("invalidOtp"));
        setOtp(["", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    });
  };

  const handleResend = () => {
    toast.info(t("codeResent"));
    setResendCooldown(30);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-black rounded-2xl border border-black/6 dark:border-white/10 w-full max-w-sm p-6 md:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-brand-red" fill="currentColor">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM9 21a6 6 0 0 1-6-6h12a6 6 0 0 1-6 6z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-black dark:text-white">{t("otpTitle")}</h2>
          <p className="text-sm text-black/50 dark:text-white/50 mt-2">
            {t("otpDescription")}<br />
            <span className="font-semibold text-black dark:text-white">{phone}</span>
          </p>
        </div>

        <div
          className="flex justify-center gap-2 mb-6"
          onPaste={handlePaste}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-bold bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all text-black dark:text-white"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join("").length < 5}
          className="w-full bg-brand-red hover:bg-brand-red-dark disabled:opacity-60 text-white py-3.5 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("verifying")}
            </>
          ) : (
            t("verify")
          )}
        </button>

        <div className="text-center mt-4">
          {resendCooldown > 0 ? (
            <span className="text-xs text-black/30 dark:text-white/30">
              {t("resendInMsg")}{resendCooldown}s
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-xs text-brand-red hover:underline font-semibold"
            >
              {t("resendCode")}
            </button>
          )}
        </div>

        <p className="text-[10px] text-black/25 dark:text-white/25 text-center mt-3">
          {t("didntReceive")}
        </p>
      </div>
    </div>
  );
}