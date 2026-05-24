"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/authSlice";
import { OtpModal } from "./otp-modal";
import { useTranslations } from "next-intl";

export function LoginPage() {
  const t = useTranslations("Auth");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, pendingPhone } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOtp, setShowOtp] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.emailOrPhone.trim()) errs.emailOrPhone = t("emailPhoneRequired");
    if (!form.password) errs.password = t("passwordRequired");
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    dispatch(login(form)).then((result) => {
      if (login.fulfilled.match(result)) {
        setShowOtp(true);
      } else {
        toast.error(result.payload as string || t("loginFailed"));
      }
    });
  };

  const handleOtpVerified = () => {
    setShowOtp(false);
    toast.success(t("welcomeBackToast"));
    router.push("/");
  };

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4 py-12 transition-colors duration-500">
        <div className="w-full max-w-md">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-black/50 dark:text-white/50 hover:text-brand-red mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back")}
          </button>

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-brand-red" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black dark:text-white">{t("welcomeBack")}</h1>
            <p className="text-sm text-black/50 dark:text-white/50 mt-2">
              {t("signInSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                {t("emailOrPhone")}
              </label>
              <Input
                value={form.emailOrPhone}
                onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
                placeholder={t("emailPlaceholder")}
                className={errors.emailOrPhone ? "border-red-500" : ""}
              />
              {errors.emailOrPhone && <p className="text-xs text-red-500 mt-1">{errors.emailOrPhone}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                {t("password")}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={t("passwordPlaceholder")}
                  className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs text-brand-red hover:underline font-medium">
                {t("forgotPassword")}
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red hover:bg-brand-red-dark h-11 text-sm font-semibold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t("signingIn")}
                </span>
              ) : (
                t("signIn")
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-black/50 dark:text-white/50 mt-6">
            {t("noAccount")}{" "}
            <a href="/auth/register" className="text-brand-red hover:underline font-semibold">
              {t("createOne")}
            </a>
          </p>
        </div>
      </div>

      {showOtp && (
        <OtpModal
          phone={pendingPhone || form.emailOrPhone}
          onVerified={handleOtpVerified}
          onClose={() => setShowOtp(false)}
          mode="login"
        />
      )}
    </>
  );
}