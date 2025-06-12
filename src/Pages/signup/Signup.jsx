import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { db } from '../../firebase'; // Your Firestore instance
import docImg from '../../assets/doc.jpg';
import { FaGoogle } from 'react-icons/fa';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set role as 'patient' by default
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'patient', // default role is patient
      });

      // Redirect to patient landing page after signup
      navigate('/patientlanding');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Set role as 'patient' by default for Google signups
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'patient', // default role is patient
      });

      // Redirect to patient landing page after Google sign-in
      navigate('/patientlanding');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-1/2 h-screen relative">
        <img src={docImg} alt="Medical professional background" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-indigo-600 mb-6">MedEase Signup</h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type={passwordVisible ? 'text' : 'password'} id="password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-10 text-gray-600">{passwordVisible ? 'Hide' : 'Show'}</button>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type={confirmPasswordVisible ? 'text' : 'password'} id="confirmPassword" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute right-3 top-10 text-gray-600">{confirmPasswordVisible ? 'Hide' : 'Show'}</button>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none">Sign Up</button>

            <p className="text-center text-sm mt-4">Already a User? <Link to="/login" className="text-blue-600 hover:underline">Log In</Link></p>
          </form>

          <div className="mt-4">
            <button onClick={handleGoogleSignup} className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 flex justify-center items-center">
              <FaGoogle className="mr-2" /> Sign Up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
