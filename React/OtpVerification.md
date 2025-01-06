import "./OtpVerification.css";
import "./OtpVerification.css";
import "./OtpVerification.css";
import OtpVerification from "./OtpVerification";
import React, { useState } from "react";
import React, { useEffect, useState } from "react";
import React from "react";
import React, { useEffect, useState } from "react";

const OtpVerification = ({ onSubmit }) => {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [error, setError] = useState('');

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) { // Allow only numbers
            const newOtp = [...otp];
            newOtp[index] = value;

            // Focus on the next input if current is filled
            if (value && index < otp.length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }

            setOtp(newOtp);
            setError('');
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (otp.some(value => value === '')) {
            setError('Please fill in all OTP fields.');
            return;
        }

        const otpValue = otp.join('');
        onSubmit(otpValue);
    };

    return (
        <div className="otp-verification">
            <h2>Enter OTP</h2>
            <form onSubmit={handleSubmit}>
                <div className="otp-inputs">
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            maxLength={1}
                            className="otp-input"
                        />
                    ))}
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">Verify OTP</button>
            </form>
        </div>
    );
};

export default OtpVerification;

.otp-verification {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 400px;
    margin: 40px auto;
}

.otp-inputs {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 15px;
}

.otp-input {
    width: 50px;
    height: 50px;
    font-size: 1.5em;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.otp-input:focus {
    outline: none;
    border-color: #007bff;
}

.error-message {
    color: red;
    font-size: 0.875em;
}

.submit-button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
}

.submit-button:hover {
    background-color: #0056b3;
}

/************************************************ */


const OtpVerification = ({ onSubmit, onResend }) => {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60); // Countdown timer in seconds
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(countdown);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) { // Allow only numbers
            const newOtp = [...otp];
            newOtp[index] = value;

            // Focus on the next input if current is filled
            if (value && index < otp.length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }

            setOtp(newOtp);
            setError('');
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (otp.some(value => value === '')) {
            setError('Please fill in all OTP fields.');
            return;
        }

        const otpValue = otp.join('');
        onSubmit(otpValue);
    };

    const handleResend = () => {
        setTimer(60); // Reset timer
        setCanResend(false);
        setOtp(Array(6).fill('')); // Clear OTP inputs
        onResend(); // Call the resend function passed from props
    };

    return (
        <div className="otp-verification">
            <h2>Enter OTP</h2>
            <form onSubmit={handleSubmit}>
                <div className="otp-inputs">
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            maxLength={1}
                            className="otp-input"
                        />
                    ))}
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">Verify OTP</button>
            </form>
            <div className="timer">
                {timer > 0 ? (
                    <p>Resend OTP in: {timer} seconds</p>
                ) : (
                    <button className="resend-button" onClick={handleResend} disabled={!canResend}>
                        Resend OTP
                    </button>
                )}
            </div>
        </div>
    );
};

export default OtpVerification;


.otp-verification {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 400px;
    margin: 40px auto;
}

.otp-inputs {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 15px;
}

.otp-input {
    width: 50px;
    height: 50px;
    font-size: 1.5em;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.otp-input:focus {
    outline: none;
    border-color: #007bff;
}

.error-message {
    color: red;
    font-size: 0.875em;
}

.submit-button, .resend-button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
}

.submit-button:hover, .resend-button:hover {
    background-color: #0056b3;
}




const App = () => {
    const handleOtpSubmit = (otp) => {
        // Mock verification logic
        alert(`OTP submitted: ${otp}`);
    };

    const handleResendOtp = () => {
        // Mock resend logic
        alert('OTP has been resent. Check your SMS or email!');
    };

    return (
        <div>
            <h1>OTP Verification</h1>
            <OtpVerification onSubmit={handleOtpSubmit} onResend={handleResendOtp} />
        </div>
    );
};

export default App;


/******************************** */



const OtpVerification = ({ onSubmit }) => {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        const countdown = setInterval(() => {
            if (timer > 0) {
                setTimer((prev) => prev - 1);
            } else {
                clearInterval(countdown);
                setCanResend(true);
            }
        }, 1000);
        return () => clearInterval(countdown);
    }, [timer]);

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;

            if (value && index < otp.length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }

            setOtp(newOtp);
            setError('');
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.some(value => value === '')) {
            setError('Please fill in all OTP fields.');
            return;
        }

        const otpValue = otp.join('');
        const isValid = await verifyOtp(otpValue);
        if (isValid) {
            onSubmit(otpValue);
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    const handleResend = async () => {
        setTimer(60);
        setCanResend(false);
        setOtp(Array(6).fill(''));
        await sendOtp();
    };

    const sendOtp = async () => {
        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ /* include necessary data like phone/email */ }),
            });
            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }
            alert('OTP has been resent. Check your SMS or email!');
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };

    const verifyOtp = async (otp) => {
        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp }),
            });
            if (!response.ok) {
                throw new Error('Invalid OTP');
            }
            const result = await response.json();
            return result.valid; // Assuming the response contains a `valid` field
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return false;
        }
    };

    return (
        <div className="otp-verification">
            <h2>Enter OTP</h2>
            <form onSubmit={handleSubmit}>
                <div className="otp-inputs">
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            maxLength={1}
                            className="otp-input"
                        />
                    ))}
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">Verify OTP</button>
            </form>
            <div className="timer">
                {timer > 0 ? (
                    <p>Resend OTP in: {timer} seconds</p>
                ) : (
                    <button className="resend-button" onClick={handleResend} disabled={!canResend}>
                        Resend OTP
                    </button>
                )}
            </div>
        </div>
    );
};

export default OtpVerification;
