'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import "../verify_email/page.css";

const EmailVerification = () => {
    const router = useRouter();
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showContinueButton, setShowContinueButton] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tokenFromURL = searchParams.get('token');
        if (tokenFromURL) {
            setToken(tokenFromURL);
            handleVerification(tokenFromURL);
        } else {
            setStatus('No token provided.');
            alert('No token provided.');
            setIsLoading(false);
        }
    }, []);

    const handleVerification = async (token) => {
        try {
            const response = await axios.get(`http://localhost:8001/api/verify-email`, { params: { token } });

            if (response.status === 200) {
                setStatus('Email verified');
                setShowContinueButton(true);
            } else if (response.status === 203) {
                setStatus('Email  verified');
                setShowContinueButton(true);
            } else {
                setStatus('Email verification failed.');
                setShowContinueButton(false);
            }
        } catch (error) {
            console.error('Verification error:', error);
            setStatus('Email verification failed. Invalid or expired link.');
            setShowContinueButton(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = () => {
        router.push(`/otp_verify?token=${token}`);
    };

    return (
        <div className='verification'>
            <div className="status">
                <h1>{isLoading ? "Loading... genrally it takes 7 seconds to verify" : status}</h1>
                {!isLoading && showContinueButton && (
                    <h3>
                        Click on continue button to proceed
                        <button 
                            className='continue_btn' 
                            onClick={handleContinue}
                        > 
                            Continue 
                        </button>
                    </h3>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;
