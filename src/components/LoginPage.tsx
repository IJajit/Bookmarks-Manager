import React, { useState } from 'react';
import { User, Lock, Mail, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (email) onLogin(email);
    } else {
      // Simulate sign-up and verification
      setIsVerified(true);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-3xl p-10 shadow-2xl flex flex-col gap-6 text-center">
          <CheckCircle2 className="w-16 h-16 text-white mx-auto" />
          <h1 className="text-2xl font-serif text-white">Verification Sent</h1>
          <p className="text-white/60 text-sm">Please check your inbox ({email}) to verify your account.</p>
          <button onClick={() => setIsVerified(false)} className="text-white/40 underline hover:text-white">Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-3xl p-10 shadow-2xl flex flex-col gap-6"
      >
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-2xl font-serif text-white">{isLogin ? 'Folio Access' : 'Create Account'}</h1>
          <p className="text-white/40 text-xs font-mono uppercase tracking-widest">{isLogin ? 'Sign in to your archival system' : 'Join the archive'}</p>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white transition-all"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
            <input 
              type="email" 
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white transition-all"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white transition-all"
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-white text-black py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-widest hover:bg-white/90 transition-all active:scale-[0.98]"
        >
          {isLogin ? 'Access Registry' : 'Create Account'}
        </button>
        
        <p className="text-center text-white/40 text-xs">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-white underline hover:text-white/80">
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
};
