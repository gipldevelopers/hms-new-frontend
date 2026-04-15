"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (eEmail = email, ePassword = password) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Pointing to backend port 5050 as defined in backend .env
      const response = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: eEmail, password: ePassword }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.data.user));
        localStorage.setItem("token", result.data.token);
        router.push("/super-admin");
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Unable to connect to service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const autoFillSuperAdmin = () => {
    const creds = {
      email: "super.developer@gohilinfotech.com",
      password: "super@123",
    };
    setEmail(creds.email);
    setPassword(creds.password);
    handleLogin(creds.email, creds.password);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      
      {/* ── LEFT PANEL – 50% ── */}
      <div 
        className="relative hidden lg:flex w-1/2 flex-col items-center justify-center"
        style={{ filter: "drop-shadow(15px 0 25px rgba(0,0,0,0.15))", zIndex: 10 }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-br from-primary to-primary/85 z-0"
          style={{
            width: "115%", 
            clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)",
          }}
        />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-8">
          <div className="absolute top-12 flex items-center justify-center gap-3 text-primary-foreground">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
            <span className="text-3xl font-extrabold tracking-widest uppercase">
              HMS
            </span>
          </div>

          <Image
            src="/assets/loginvector.svg"
            alt="Login illustration"
            width={600}
            height={600}
            priority
            className="w-full max-w-[500px] h-auto object-contain"
          />
        </div>
      </div>

      {/* ── RIGHT PANEL – 50% ── */}
      <div className="relative flex w-full lg:w-1/2 flex-col items-center justify-center p-8 bg-background z-0">
        
        <div className="w-full max-w-[420px] text-center">
          
          <div className="mb-10 text-center text-primary">
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight uppercase">
              Sign In
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Enter your email and password to login
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left w-full">
            
            <div>
              <label className="mb-2 block text-sm font-bold tracking-wide text-foreground">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="h-12 w-full rounded-lg border border-input bg-background pl-11 pr-4 text-sm font-medium text-foreground transition-colors placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold tracking-wide text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="h-12 w-full rounded-lg border border-input bg-background pl-11 pr-4 text-sm font-medium text-foreground transition-colors placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-[52px] w-full items-center justify-center rounded-lg bg-primary text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <div className="h-[22px] w-[22px] animate-spin rounded-full border-[2.5px] border-transparent border-t-primary-foreground border-r-primary-foreground/30" />
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>

          {/* Quick Access Section */}
          <div className="mt-10">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <span className="relative bg-background px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Quick Access
              </span>
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={autoFillSuperAdmin}
                className="flex items-center justify-center gap-3 h-12 w-full rounded-lg border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-slate-900 text-[13px] font-bold text-foreground hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <User className="h-4 w-4" />
                </div>
                Super Admin Demo
              </button>
            </div>
          </div>
        </div>

        <p className="absolute bottom-6 text-xs font-medium tracking-wide text-muted-foreground text-center w-full">
          © 2026. HMS Portal All Rights Reserved.
        </p>
      </div>
    </div>
  );
}