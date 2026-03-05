import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from "react-router-dom";

const Connection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
const navigate = useNavigate();

  const slides = [
  {
    title: "Practice Smarter.\nPrepare Confidently.\nSucceed Anywhere.",
    description:
      "From coding challenges to AI-powered mock interviews, our platform helps you practice effectively and prepare for real-world interviews from anywhere."
  },
  {
    title: "Real Interviews.\nStructured Practice.\nMeasurable Progress.",
    description:
      "Access realistic interview simulations, timed coding challenges, and performance analytics designed to mirror real technical and behavioral interviews."
  },
  {
    title: "Track Progress.\nIdentify Weaknesses.\nImprove Faster.",
    description:
      "Monitor your interview readiness with detailed reports, feedback insights, and continuous improvement tracking tailored to your preparation journey."
  }
];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Signup attempt:', { fullName, email, password, confirmPassword });
  };



  return (
    <div className="flex min-h-screen bg-[#fffefe]">
      {/* Left side - Hero section with geometric design */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geometric" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-400"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geometric)" />
          </svg>
        </div>

        {/* Animated geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 opacity-10 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 opacity-10 -rotate-12"></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-indigo-500 opacity-10 rotate-12"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Clyric</span>
          </div>

          {/* Main heading */}
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold leading-tight mb-6 transition-opacity duration-500">
              {slides[currentSlide].title.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < slides[currentSlide].title.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p className="text-lg text-blue-200 leading-relaxed transition-opacity duration-500">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Bottom decoration */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-12 h-1 rounded-full transition-all duration-500 ${
                  index === currentSlide ? 'bg-white' : 'bg-white opacity-30'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Back button */}
        <button
          type="button"
           onClick={() => navigate("/")}
          className="absolute top-8 right-8 z-20 flex items-center space-x-2 text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Right side - Login/Signup form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <span className="text-2xl font-bold text-slate-900">TanviTech</span>
          </div>

          {!isSignup ? (
            // Login Form
            <>
              <div className="mb-8">
                <h2 className="text-4xl font-normal text-gray-900 mb-2">Welcome Back!</h2>
                <p className="text-gray-600">Log in to start creating stunning videos with ease.</p>
              </div>

              <div className="space-y-5">
                {/* Email input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Input your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Password input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Input your password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember me and forgot password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      Remember Me
                    </label>
                  </div>
                  <button type="button" className="text-sm text-gray-600 hover:text-blue-600">
                    Forgot Password?
                  </button>
                </div>

                {/* Login button */}
                <button
                  onClick={handleLogin}
                  className="cursor-pointer w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all focus:ring-4 focus:ring-gray-300"
                >
                  Login
                </button>
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">Or continue with</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Google sign-in */}
              <button className="cursor-pointer w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all">
                <div className="flex items-center justify-center w-6 h-6">
                  <FontAwesomeIcon
                    icon={faGoogle}
                    className="text-[#2f2f2f] text-lg"
                  />
                </div>
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>

              {/* Sign up link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsSignup(true)}
                  className="text-blue-600 font-medium cursor-pointer"
                >
                  Sign up here
                </button>
              </p>
            </>
          ) : (
            // Signup Form
            <>
              <div className="mb-8">
                <h2 className="text-4xl font-normal text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Sign up to start creating stunning videos with ease.</p>
              </div>

              <div className="space-y-5">
                {/* Full Name input */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Input your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Email input */}
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium  text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Input your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Password input */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password input */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Sign up button */}
                <button
                  onClick={handleSignup}
                  className="cursor-pointer w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all focus:ring-4 focus:ring-gray-300"
                >
                  Sign Up
                </button>
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">Or continue with</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Google sign-in */}
              <button className="cursor-pointer w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all">
                <div className="flex items-center justify-center w-6 h-6">
                  <FontAwesomeIcon
                    icon={faGoogle}
                    className="text-[#2f2f2f] text-lg"
                  />
                </div>
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>

              {/* Login link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => setIsSignup(false)}
                  className="text-blue-600 font-medium cursor-pointer"
                >
                  Log in here
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connection;