'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/ToastContainer';
import { useAuthStore, useToastStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { login, signup } = useAuthStore();
  const { addToast } = useToastStore();
  
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  
  // Signup form
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      addToast('Please fill all fields', 'warning');
      return;
    }
    
    const success = login(loginForm.email, loginForm.password);
    
    if (success) {
      addToast('Login successful!', 'success');
      router.push('/');
    } else {
      addToast('Invalid email or password', 'error');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      addToast('Please fill all required fields', 'warning');
      return;
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    
    if (signupForm.password.length < 6) {
      addToast('Password must be at least 6 characters', 'warning');
      return;
    }
    
    const success = signup(signupForm.name, signupForm.email, signupForm.password, signupForm.phone);
    
    if (success) {
      addToast('Account created successfully!', 'success');
      router.push('/');
    } else {
      addToast('Email already exists', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">F6</h1>
            <p className="text-gray-500 text-sm">The Fashion Store</p>
          </div>
          
          {/* Auth Card */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full border-b rounded-none p-0 bg-transparent">
                <TabsTrigger
                  value="login"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login" className="p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Remember me
                    </label>
                    <Link href="#" className="text-gray-600 hover:text-gray-900">
                      Forgot password?
                    </Link>
                  </div>
                  
                  <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800">
                    Login
                  </Button>
                </form>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Button variant="outline">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </div>
                
                {/* Demo Credentials */}
                <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="font-medium text-gray-900 mb-1">Demo Credentials:</p>
                  <p className="text-gray-600">Email: demo@f6fashion.com</p>
                  <p className="text-gray-600">Password: demo123</p>
                </div>
              </TabsContent>
              
              {/* Signup Tab */}
              <TabsContent value="signup" className="p-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-phone">Phone (Optional)</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Confirm your password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <input type="checkbox" className="rounded mt-1" required />
                    <span className="text-gray-600">
                      I agree to the{' '}
                      <Link href="#" className="text-gray-900 underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="#" className="text-gray-900 underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </div>
                  
                  <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Back to home */}
          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
