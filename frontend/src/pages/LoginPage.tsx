import {useEffect, useState} from "react";
import logoImg from "../assets/logo.png";
import googleIcon from "../assets/google.png";
import {KeyIcon, EnvelopeIcon, PhoneIcon} from "@heroicons/react/24/outline";
import LanguageSelector from "../components/languageSelector/LanguageSelector";
import useI18n from "../locale/useI18n";
import Spinner from "../components/Loading/Spinner";
import { auth } from "../../firebase.config";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, sendPasswordResetEmail } from "firebase/auth";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import { useTimedVisibility } from "../hooks/useTimeVisibility";
import { storePhoneNumber } from "../api/authAPI";
import sewalkLogo from "../assets/sewalk_horizontal_logo.png";
import image1 from "../assets/bg1.jpg";
import image2 from "../assets/bg2.jpg";
import image3 from "../assets/bg3.jpg";


const slideshowImages = [image1, image2, image3];

function cleanErrorMessage(message: string): string {
  if (typeof message !== "string") {
    throw new Error("Expected a string error message");
  }

  return message
    .replace(/firebase\s*:?/i, "")            
    // .replace(/\([^)]*\)/g, "")               
    // .replace(/[:()]/g, "")                   
    .replace(/\s+/g, " ")
    .replace(/\./g, " ")                       
    .trim();                                 
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const {user, userLoggedIn} = useAuth();
  const {t} = useI18n("login");
  const navigate = useNavigate();
  const [MagNeeds, showMagicRequirement] = useTimedVisibility();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let provided_email = window.localStorage.getItem('emailForSignIn');
      if (!provided_email) {
        provided_email = window.prompt('Please provide your email for confirmation');
      }
      try {
        if (provided_email) {
          signInWithEmailLink(auth, provided_email, window.location.href);
        } 
        window.localStorage.removeItem('emailForSignIn');
      } catch (error) {
          console.error("Error during sign-in:", error);
      }
    }   
  }, []);

  const validatePhoneNumber = (number: string) => {
    if (number.length == 0) {
      setPhoneError(false);
      return;
    }
    const pattern = /^(\+94\s?\d{9}|94\d{9}|0\d{9})$/;
    const isValid = pattern.test(number);
    setPhoneError(!isValid);
  };

  const resetPassword = async () => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success(t('passwordResetEmailSent'));
    } catch (error) {
      toast.error(cleanErrorMessage(cleanErrorMessage((error as any).message)));
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
        if (confirmPassword !== password){
          setConfirmError(true);
          return;
        }
        setIsLoading(true);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        await sendEmailVerification(user);
        toast.success(t('verificationEmailSent'));
        setIsLogin(true);
        storePhoneNumber(email, phoneNumber);  // store the phone number for user
      } catch (error) {
        toast.error(cleanErrorMessage((error as any).message));
      }
      finally {
        setIsLoading(false);
      }
    };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.error(t('emailNotVerified'));
        await sendEmailVerification(user);
      }

      } catch (error) {
          console.error("Error during continue:", error);
          toast.error(cleanErrorMessage((error as any).message));
      }
      finally {
          setIsLoading(false);
      }
    };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      setIsLoading(true);
      await signInWithPopup(auth, provider)

      } catch (error) {
          console.error("Error during continue:", error);
          toast.error(cleanErrorMessage((error as any).message));
      }
      finally {
          setIsLoading(false);
      }
    };

  const handleMagicLink = async () => {
    const actionCodeSettings = {
      url: 'http://localhost:5173/login',   //change
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.example.ios'
      },
      android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
      },
      // The domain must be configured in Firebase Hosting and owned by the project.
      // linkDomain: 'custom-domain.com'
    };
    setIsLoading(true);
    if (!email) {
      toast.error(t('emailRequired'));
      return;
    }
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      toast.success(t('VerificationEmailSent'));
    } catch (error) {
      toast.error(cleanErrorMessage((error as any).message));
    }
    setIsLoading(false);
  };  

  useEffect(() => {
    if (userLoggedIn) {
      if (user?.role >= 3) {
        navigate("/admin", { replace: true });
      } else if (user?.role <= 2) {
        navigate("/work", { replace: true });
      }
    }
  }, [userLoggedIn, user]);


  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % slideshowImages.length);
    }, 5000); // 5 seconds delay for change the pictires
    return () => clearInterval(interval);
  }, []);



  return(
  <div className="flex-col lg:flex-row flex ">
    <div className="flex flex-1 justify-center items-center min-h-screen" style={{ background: "linear-gradient(90deg, #205781 0%, #4F959D 100%)" }}>
      
      {/* Left side login tile */}
      <div className="bg-white rounded-lg border shadow px-8 py-6 w-full max-w-md">
      {/* Logo and Title */}
        <div className="flex items-center justify-center h-auto">
            <img src={sewalkLogo} alt="Sewa.lk Logo" className="h-12 bg-white border-black border-solid border-2 rounded-md" />
            <span className="text-cyan-800 text-3xl font-normal ml-3">Sewa.lk</span>
        </div>

        {/* <h1 className="text-6xl font-semibold text-gray-600 text-center w-90">{t("welcome")}</h1> */}
          <div className="flex mt-5 mb-3 border-b border-gray-200">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-center font-medium border-b-2 ${isLogin ? 'border-[#253add] text-[#205781]' : 'border-transparent text-[#205781]'}`}
            >
              {t('login')}
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-center font-medium border-b-2 ${!isLogin ? 'border-[#253add] text-[#205781]' : 'border-transparent text-[#205781]'}`}
            >
              {t('register')}
            </button>
          </div>
          <div 
            key={isLogin ? 'login' : 'signup'}
            className="flex flex-col gap-3 mt-7 "
            style={{ 
              animation: isLogin 
                ? 'slideFromLeft 300ms ease-in-out' 
                : 'slideFromRight 300ms ease-in-out' 
            }}
          >
              <div className="relative text-gray-600 rounded">
                  <button className="absolute left-2 top-0 bottom-0 mr-4" aria-label="Lock">
                    <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                  </button>
                  <input
                      onChange={e => setEmail(e.target.value)}
                      value={email}
                      placeholder={t('email')}
                      className="w-full border-2 border-gray-light bg-white h-10 px-5 pl-8 rounded text-sm focus:outline-none"
                      name="email"
                      type="email"
                      required
                  />
                  { MagNeeds && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500">
                      * Required
                    </span>
                  )}
              </div>
              {!isLogin && (
              <div className="relative text-gray-600 rounded">
                <button className="absolute left-2 top-0 bottom-0 mr-4" aria-label="Phone">
                  <PhoneIcon className="w-5 h-5 text-blue-500" />
                </button>
                <input
                  onChange={(e) => {
                    let value = e.target.value.replace(/[\s-]+/g, '')
                    setPhoneNumber(value);
                    validatePhoneNumber(value);
                  }}
                  value={phoneNumber}
                  placeholder={t('Phonenumber')}
                  className="w-full border-2 border-gray-light bg-white h-10 px-5 pl-8 rounded text-sm focus:outline-none"
                  name="phone"
                  type="tel"
                  pattern="^(\+94[\s]?\d{9}|0[\s]?\d{9}|\+94\d{9})$" 
                  title="Phone number must be in the format +94-XXXXXXXXX, +94XXXXXXXXX, or 0XXXXXXXXX"
                />
                {phoneError  && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500">
                    * Invalid
                  </span>
                )}
              </div>)}
              <div className="relative text-gray-600 rounded">
                <button className="absolute left-2 top-0 bottom-0 mr-4" aria-label="Lock">
                    <KeyIcon className="w-5 h-5 text-blue-500"/>
                </button>
                <input
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    placeholder={t('password')}
                    className="w-full border-2 border-gray-light bg-white h-10 px-5 pl-8 rounded text-sm focus:outline-none"
                    name="password"
                    type="password"
                />
              </div>
              {!isLogin && (
              <div className="relative text-gray-600 rounded">
                <button className="absolute left-2 top-0 bottom-0 mr-4" aria-label="Lock">
                    <KeyIcon className="w-5 h-5 text-blue-500"/>
                </button>
                <input
                    onChange={e => {
                      setConfirmPassword(e.target.value);
                      setConfirmError(false);
                    }}
                    onBlur={() => setConfirmError((confirmPassword !== password) && confirmPassword.length > 0)}
                    value={confirmPassword}
                    placeholder={t('Confirm password')}
                    className="w-full border-2 border-gray-light bg-white h-10 px-5 pl-8 rounded text-sm focus:outline-none"
                    name="confirmpassword"
                    type="password"
                />
                {confirmError  && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500">
                    * Mismatch
                  </span>
                )}
              </div>
              )}
            {isLogin && (
              <button
                onClick={resetPassword}
                disabled={!email}
                className="text-xs font-normal text-cyan-600 hover:underline text-left mb-1 ml-2 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {t('forgotPassword')}
              </button>
            )}
            {isLogin ? (
            <button
                onClick={() => handleLogin()}
                disabled={!email || !password}
                className="w-full bg-secondary m-auto disabled:cursor-not-allowed border-2 border-gray-light h-10 px-5 pl-8 rounded-lg text-sm focus:outline-none flex items-center justify-center"
            >
                {isLoading ? <Spinner colour="#205781" size="20px"/> : t('login')}
            </button>) : (
            <button
                onClick={() => handleSignup()}
                disabled={!email || !password || !phoneNumber || !confirmPassword || phoneError || confirmError}
                className="w-full bg-secondary m-auto disabled:cursor-not-allowed border-2 border-gray-light h-10 px-5 pl-8 rounded-lg text-sm focus:outline-none flex items-center justify-center"
            >
                {isLoading ? <Spinner colour="#205781" size="20px"/> : t('register')}
            </button>)}
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center">
              <div className="flex-grow border-t-2 border-gray-200"></div>
              <span className="mx-2 text-sm font-normal text-gray-400">{t('or')}</span>
              <div className="flex-grow border-t-2 border-gray-200"></div>
            </div>
            <div className="flex flex-col gap-3 mt-4 ">
            <button
                onClick={() => handleGoogle()}
                className="w-full bg-black text-white m-auto disabled:cursor-not-allowed border-2 border-gray-light h-10 px-5 pl-8 rounded-lg text-sm focus:outline-none flex items-center justify-center"
            >
                <span className="mr-2">
                  <img height={18} width={18} src={googleIcon} alt="google"/>
                </span>
                {t('google')}
            </button>
            <button
                onClick={() => { email ? handleMagicLink() : showMagicRequirement(); }}
                className="w-full bg-black text-white m-auto disabled:cursor-not-allowed border-2 border-gray-light h-10 px-5 pl-8 rounded-lg text-sm focus:outline-none flex items-center justify-center"
            >
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                      stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>
                  </svg>
                </span>
                {t('magicLink')}
            </button>
            </div>
          </div>
        </div>
    </div>
    
      {/* Right side logo image */}
      <div className="flex-1 relative overflow-hidden hidden lg:flex items-end lg:h-screen">
          {slideshowImages.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Slide ${idx}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${currentImageIndex === idx ? 'opacity-100' : 'opacity-0'}`}
          style={{ filter: "brightness(0.7)" }}
        />
          ))}
    </div>
    <div className="absolute bottom-4 left-4">
        <LanguageSelector/>
    </div>
  </div>
  );
}
