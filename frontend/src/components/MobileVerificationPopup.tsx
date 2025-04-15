import React, { useState } from 'react';
import Modal from './PopupModal';
import { PhoneIcon, KeyIcon } from "@heroicons/react/24/outline";
import Spinner from "../components/Loading/Spinner";
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { sendOTP, verifyOTP } from '../api/userAPI';

const MobileVerificationPopup: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {user} = useAuth();
  const [isOpen, setIsOpen] = useState(user.phone_number ? true : true);
  const [phoneError, setPhoneError] = useState(false);

  const normalizePhoneNumber = (number: string) => {
    if (number.startsWith('+94')) return '0' + number.slice(3);
    if (number.startsWith('94')) return '0' + number.slice(2);
    return number;
  };

  const handleSendOtp = async () => {
    if (phoneError) return;
    const formatted = normalizePhoneNumber(phoneNumber);
  
    if (!/^0\d{9}$/.test(formatted)) {
      setPhoneError(true);
      return;
    }
    setIsLoading(true);
    try {
      await sendOTP(formatted);
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePhoneNumber = (number: string) => {
    if (number.length == 0) {
      setPhoneError(false);
      return;
    }
    const pattern = /^(\+94\s?\d{9}|94\d{9}|0\d{9})$/;
    const isValid = pattern.test(number);
    setPhoneError(!isValid);
  };

  const handleVerifyOtp = async () => {
    if (otp.length == 0) {
      return;
    }
    const formatted = normalizePhoneNumber(phoneNumber);
    
    setIsLoading(true);
    try {
      const success = await verifyOTP(formatted, otp);
      if (!success) {
        toast.error("Invalid OTP. Please try again.");
        return;
      }
      toast.success("Mobile number verified successfully!");
      sessionStorage.removeItem("sewaUser");
      setIsOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={"Confirm your mobile number to unlock all the features"}
      className="max-w-md"
    >
      <div className="p-4">          
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1 ml-1">
            Mobile Number
          </label>
          <div className="relative">
            <div className="absolute left-2 top-0 bottom-0 flex items-center">
              <PhoneIcon className="w-5 h-5 text-blue-500" />
            </div>
            <input
              type="tel"
              id="phone"
              className="w-full border-2 border-gray-light bg-white h-10 px-5 pl-8 rounded-lg text-sm focus:outline-none"
              placeholder="Enter your mobile number"
              value={phoneNumber}
              onChange={(e) => {
                let value = e.target.value.replace(/[\s-]+/g, '')
                setPhoneNumber(value);
                validatePhoneNumber(value);
              }}
              disabled={otpSent}
            />
            {phoneError && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500">
                * Invalid
              </span>
            )}
          </div>
        </div>
        
        {otpSent && (
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-600 mb-1 ml-1">
              OTP
            </label>
            <div className="relative">
              <div className="absolute left-2 top-0 bottom-0 flex items-center">
                <KeyIcon className="w-5 h-5 text-blue-500" />
              </div>
              <input
                type="text"
                id="otp"
                className="w-full border-2 border-gray-light bg-white h-10 px-5 pl-8 rounded-lg text-sm focus:outline-none"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                OTP sent to {phoneNumber}.
                {!isLoading && (
                  <button 
                    onClick={() => setOtpSent(false)} 
                    className="text-secondary hover:text-primary ml-1"
                  >
                    Change?
                  </button>
                )}
              </p>
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="bg-secondary text-white px-12 py-2 rounded-lg hover:bg-primary focus:outline-none transition-colors duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? <Spinner colour="#FFFFFF" size="20px" /> : "Verify"}
              </button>
            </div>
          </div>
        )}

        {!otpSent && (
          <button
            onClick={handleSendOtp}
            disabled={isLoading || !phoneNumber}
            className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-primary focus:outline-none transition-colors duration-300 disabled:opacity-75 disabled:cursor-not-allowed mt-4 flex items-center justify-center"
          >
            {isLoading ? <Spinner colour="#FFFFFF" size="20px"/> : "Send OTP"}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default MobileVerificationPopup;