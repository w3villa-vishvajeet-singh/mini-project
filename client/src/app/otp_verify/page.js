"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../otp_verify/page.css";
import { useRouter } from 'next/navigation';

const OtpInput = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const retrievedToken = searchParams.get('token');

    if (retrievedToken) {
      setToken(retrievedToken);
      console.log('Retrieved Token:', retrievedToken);
    } else {
      setError('No token found in the URL.');
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value.length === 1 && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    if (value.length === 0 && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
  
    if (!token) {
      setError('Token is missing.');
      return;
    }
  
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      console.log('Sending OTP verification request...');
      const response = await axios.post('http://localhost:8001/api/verify-otp', {
        token: token,
        otp: otpString,
      });
  
      console.log('Received response:', response.data);
      const result = response.data;
  
      if (result.msg === 'OTP Verified Successfully') {
        console.log('OTP verified successfully. Setting authToken...');
        localStorage.setItem('authToken', result.token);
  
        // Redirecting directly without alert
        console.log('Attempting to redirect...');
        await router.push('/'); // Wait for the redirection to complete
        console.log('Redirect successful');
        
      } else {
        // Handle unexpected success messages
        console.log('Unexpected success message:', result.msg);
        setError(result.msg || 'Failed to verify OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      const errorMessage = error.response?.data?.msg || 'An error occurred while verifying OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='check_validation'>
      <div className="box">
        <h3 className='heading'>Check your phone for OTP</h3>

        {error && <div className="error">{error}</div>}
        <form className="form" onSubmit={handleSubmit}>
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={value}
              onChange={(e) => handleChange(e, index)}  
              maxLength="1"
              placeholder={`${index + 1} digit`}
              disabled={loading}
            />
          ))}
          <button type='submit' className='submit' disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpInput;
