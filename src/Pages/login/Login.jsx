// src/Login.js

import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa'; // Google icon from react-icons
import doc from '../../assets/doc.jpg'; // Ensure the logo image is here

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Define admin emails
      const ADMIN_EMAILS = [
        'admin@medease.com',
        'healthcare@medease.com',
        'provider@medease.com'
      ];
      
      // Redirect based on user role
      if (ADMIN_EMAILS.includes(user.email)) {
        navigate('/dashboard');
      } else {
        navigate('/user');
      }
    } catch (error) {
      setError("User doesn't exist. Sign up first.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Define admin emails
      const ADMIN_EMAILS = [
        'admin@medease.com',
        'healthcare@medease.com',
        'provider@medease.com'
      ];
      
      // Redirect based on user role
      if (ADMIN_EMAILS.includes(user.email)) {
        navigate('/dashboard');
      } else {
        navigate('/user');
      }
    } catch (error) {
      setError("Error logging in with Google. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* Left Side: Image Section */}
      <div className="hidden md:block w-1/2 h-screen relative">
        <img
          src={doc} // You can replace this with any image you'd like
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-indigo-600 mb-6">MedEase Login</h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                className="absolute right-3 top-10 text-gray-600"
              >
                {passwordVisible ? (
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.977 9.977 0 012.283-3.825M6.75 6.75A10.075 10.075 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.977 9.977 0 01-2.283 3.825M9 9a3 3 0 006 0m-7 6l8-8" />
                  </svg>
                )}
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Log In
            </button>

            <p className="text-center text-sm mt-4">
              Not a user?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 flex justify-center items-center"
            >
              <FaGoogle className="mr-2" />
              Log In with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
