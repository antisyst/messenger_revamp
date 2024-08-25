import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createJwtToken, validateOtp } from '../../api/apiService';
import LanguageSwitcher from '../Switcher/Switcher';
import './AuthForm.scss';

interface AuthFormProps {
  onAuthSuccess: (accessToken: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [shake, setShake] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const requestOtpMutation = useMutation({
    mutationFn: (email: string) => createJwtToken(email),
    onSuccess: () => setStep(2),
    onError: () => {
      setErrorMessage(t('failedToSendOtp'));
    }
  });

  const validateOtpMutation = useMutation({
    mutationFn: () => validateOtp(email, otp.join('')),
    onSuccess: (response) => {
      const accessToken = response.data.access;
      onAuthSuccess(accessToken);
      navigate('/chat/1', { replace: true });
    },
    onError: () => {
      setErrorMessage(t('invalidOtp'));
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleEmailSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    requestOtpMutation.mutate(email);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5 && value) {
        inputRefs.current[index + 1]?.focus();
      }

      if (index === 5 && value) {
        setIsSubmitting(true);
        validateOtpMutation.mutate();
      }
    }
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Backspace') {
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleSubmitAll = () => {
    if (!isSubmitting && otp.every((digit) => digit !== '')) {
      setIsSubmitting(true);
      validateOtpMutation.mutate();
    } else if (!isSubmitting && step === 1) {
      requestOtpMutation.mutate(email);
    }
  };

  useEffect(() => {
    if (otp.every((digit) => digit !== '') && step === 2 && !isSubmitting) {
      setIsSubmitting(true);
      validateOtpMutation.mutate();
    }
  }, [otp, step, validateOtpMutation, isSubmitting]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [step]);

  return (
    <div className="auth-form">
      <LanguageSwitcher />
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <h1 className="main-content">{t('welcomeBack')}</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('enterYourEmail')}
            required
          />
          <button type="submit" disabled={requestOtpMutation.status === 'pending'}>
            {requestOtpMutation.status === 'pending' ? t('sending') : t('sendOtp')}
          </button>
        </form>
      )}

      {step === 2 && (
        <div className='otp'>
          <form className={`otp-form ${shake ? 'shake' : ''}`}>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <div
                  key={index}
                  className={`input-wrapper ${
                    index === otp.findIndex((digit) => digit === '') ? 'active' : ''
                  }`}
                >
                  <input
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className={`${digit ? 'filled' : ''} ${errorMessage ? 'error' : ''}`}
                    aria-label={`OTP digit ${index + 1}`}
                    aria-invalid={errorMessage ? 'true' : 'false'}
                    autoFocus={index === 0}
                    readOnly={index !== otp.findIndex((digit) => digit === '')}
                    style={{
                      pointerEvents: index === otp.findIndex((digit) => digit === '') ? 'auto' : 'none',
                    }}
                  />
                </div>
              ))}
            </div>
          </form>
          <button onClick={handleSubmitAll} disabled={isSubmitting} className='validate-button'>
            {isSubmitting ? t('validating') : t('validateOtp')}
          </button>
          {errorMessage && (
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthForm;