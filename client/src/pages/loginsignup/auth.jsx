import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'; // Import socket.io-client
import './auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [loginData, setLoginData] = useState({ name: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', password: '', confirmPassword: '' });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const PORT = process.env.PORT || 5000;
  const socketUrl = process.env.NODE_ENV === 'production'
  ? `https://fileshare-copy1.onrender.com`
  : `http://localhost:${PORT}`;

  // Initialize socket connection
  const socket = io(socketUrl); // Make sure this URL matches your backend URL

  useEffect(() => {
    // Check if user is already logged in and redirect
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, [navigate]);

  // Toggle between Login and Signup forms
  const toggleForms = () => {
    setIsLoginVisible(!isLoginVisible);
    setError(''); // Clear errors when switching forms
  };

  // Password visibility toggle
  const togglePasswordVisibility = (formType) => {
    const passwordFields =
      formType === 'login'
        ? [document.getElementById('login-password')]
        : [
            document.getElementById('signup-password'),
            document.getElementById('signup-confirm-password'),
          ];
    const isChecked =
      formType === 'login'
        ? document.getElementById('login-show-password').checked
        : document.getElementById('signup-show-password').checked;

    passwordFields.forEach((field) => {
      field.type = isChecked ? 'text' : 'password';
    });
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[@$!%*?&#]/.test(password)) strength += 1;

    if (strength <= 1) setPasswordStrength('Weak');
    else if (strength === 2) setPasswordStrength('Moderate');
    else setPasswordStrength('Strong');
  };

  // Validate signup inputs
  const validateSignup = () => {
    if (!signupData.name || !signupData.password || !signupData.confirmPassword) {
      setError('All fields are required.');
      return false;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  // Handle login
  const handleLogin = async () => {
    if (!loginData.name || !loginData.password) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(`https://fileshare-copy1.onrender.com/auth/login`, loginData);
      if (response.data.token) {
        alert('Login successful!');
        localStorage.setItem('token', response.data.token); // Save JWT token
        if (onAuthSuccess) onAuthSuccess(); // Notify parent component on successful login

        // Register user with socket after login
        socket.emit('register-user', loginData.name); // Emit username to server
        console.log('User registered:', loginData.name);

        navigate('/home'); // Redirect to the Home page
        setLoginData({ name: '', password: '' }); // Clear form
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or server error.');
    }
  };

  // Handle signup
  const handleSignup = async () => {
    const isValid = validateSignup();
    if (!isValid) return;

    try {
      const response = await axios.post(`https://fileshare-copy1.onrender.com/auth/register`, {
        name: signupData.name,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
      });

      if (response.data.message === 'User registered successfully') {
        alert('Signup successful!');
        setSignupData({ name: '', password: '', confirmPassword: '' }); // Clear form
        setIsLoginVisible(true);

        // Register user with socket after signup
        socket.emit('register-user', signupData.name); // Emit username to server
        console.log('User registered:', signupData.name);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Server error.');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        {isLoginVisible ? (
          <div className="form" id="login-form">
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={loginData.name}
              onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
              required
            />
            <input
              type="password"
              id="login-password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <div className="toggle-password">
              <input
                type="checkbox"
                id="login-show-password"
                onClick={() => togglePasswordVisibility('login')}
              />
              <label htmlFor="login-show-password">Show Password</label>
            </div>
            <button type="button" onClick={handleLogin}>
              Login
            </button>
            {error && <div className="error-message">{error}</div>}
            <p>
              Don't have an account?{' '}
              <span className="link" onClick={toggleForms}>
                Signup
              </span>
            </p>
          </div>
        ) : (
          <div className="form" id="signup-form">
            <h2>Signup</h2>
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              required
            />
            <input
              type="password"
              id="signup-password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) => {
                setSignupData({ ...signupData, password: e.target.value });
                checkPasswordStrength(e.target.value);
              }}
              required
            />
            <div className="strength-indicator">Password strength: {passwordStrength}</div>
            <input
              type="password"
              id="signup-confirm-password"
              placeholder="Confirm Password"
              value={signupData.confirmPassword}
              onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
              required
            />
            <div className="toggle-password">
              <input
                type="checkbox"
                id="signup-show-password"
                onClick={() => togglePasswordVisibility('signup')}
              />
              <label htmlFor="signup-show-password">Show Password</label>
            </div>
            <button type="button" onClick={handleSignup}>
              Signup
            </button>
            {error && <div className="error-message">{error}</div>}
            <p>
              Already have an account?{' '}
              <span className="link" onClick={toggleForms}>
                Login
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
