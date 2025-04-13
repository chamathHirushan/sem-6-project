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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const {user, userLoggedIn} = useAuth();
  const {t} = useI18n("login");
  const navigate = useNavigate();

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

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(t('passwordResetEmailSent'));
    } catch (error) {
      toast.error(cleanErrorMessage(cleanErrorMessage((error as any).message)));
    }
  };

  const handleSignup = async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        await sendEmailVerification(user);
        toast.success(t('verificationEmailSent'));
      } catch (error) {
        toast.error(cleanErrorMessage((error as any).message));
      }
    };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;

      if (user.emailVerified) {
        toast.success(t('loginSuccess'));
      } else {
        toast.error(t('emailNotVerified'));
      }

      } catch (error) {
          console.error("Error during continue:", error);
          toast.error(cleanErrorMessage((error as any).message));
      }
      finally {
          setIsLoading(true);
      }
    };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider)
      toast.success(t('loginSuccess'));

      } catch (error) {
          console.error("Error during continue:", error);
          toast.error(cleanErrorMessage((error as any).message));
      }
      finally {
          setIsLoading(true);
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

    if (!email) {
      toast.error(t('emailRequired'));
      return;
    }
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      toast.success(t('passwordResetEmailSent'));
    } catch (error) {
      toast.error(cleanErrorMessage((error as any).message));
    }
  };  

  useEffect(() => {
    if (userLoggedIn) {
      if (user?.role >= 2) {
        navigate("/admin", { replace: true });
      } else if (user?.role === 1) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [userLoggedIn, user]);

  return(
  <div className="flex-col lg:flex-row flex ">
    <div className="flex flex-col flex-1 mt-5">
      <div className="flex flex-col mt-24 justify-center items-center">
        <h1 className="text-6xl font-bold text-gray-600 text-center w-90">{t("welcome")}</h1>
          <div className="flex w-80 mt-7 mb-4 border-b border-gray-200">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-center font-medium ${isLogin ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            >
              {t('login')}
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-center font-medium ${!isLogin ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            >
              {t('signup')}
            </button>
          </div>
          <div 
            key={isLogin ? 'login' : 'signup'}
            className="flex flex-col gap-3 w-80 mt-7 "
            style={{ 
              animation: isLogin 
                ? 'slideFromLeft 300ms ease-in-out' 
                : 'slideFromRight 300ms ease-in-out' 
            }}
          >
              <div className="relative text-gray-600 rounded">
                  <button className="absolute left-2 top-0 bottom-0 mr-4" aria-label="Lock">
                    <EnvelopeIcon className="w-6 h-6 text-blue-500" />
                  </button>
                  <input
                      onChange={e => setEmail(e.target.value)}
                      value={email}
                      placeholder={t('email')}
                      className="w-full border-2 border-gray-light bg-white h-10 px-5 pl-8 rounded text-sm focus:outline-none"
                      name="email"
                      type="email"
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      required
                  />
              </div>
              {!isLogin && (
              <div className="relative text-gray-600 rounded">
                <button className="absolute left-2 top-0 bottom-0 mr-4" aria-label="Phone">
                  <PhoneIcon className="w-6 h-6 text-blue-500" />
                </button>
                <input
                  onChange={e => setPhoneNumber(e.target.value.replace(/\s+/g, ''))}  // Remove spaces
                  value={phoneNumber}
                  placeholder={t('Phonenumber')}
                  className="w-full border-2 border-gray-light bg-white h-10 px-5 pl-8 rounded text-sm focus:outline-none"
                  name="phone"
                  type="tel"
                  pattern="^(\+94[\s]?\d{9}|0[\s]?\d{9}|\+94\d{9})$" 
                  title="Phone number must be in the format +94-XXXXXXXXX, +94XXXXXXXXX, or 0XXXXXXXXX"  // Title for better UX
                />
              </div>)}
              <div className="relative text-gray-600 rounded">
                <button className="absolute left-2 top-0 bottom-0 mr-4" aria-label="Lock">
                    <KeyIcon className="text-gray-600 h-5 w-6"/>
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
                    <KeyIcon className="text-gray-600 h-5 w-6"/>
                </button>
                <input
                    onChange={e => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    placeholder={t('Confirm password')}
                    className="w-full border-2 border-gray-light bg-white h-10 px-5 pl-8 rounded text-sm focus:outline-none"
                    name="confirmpassword"
                    type="password"
                />
              </div>
              )}
            {isLogin && (
              <button
                onClick={resetPassword}
                disabled={!email}
                className="text-xs font-normal text-gray-300 hover:underline text-left mb-1 ml-2 disabled:text-gray-200 disabled:cursor-not-allowed"
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
                disabled={!email || !password || !phoneNumber || !confirmPassword}
                className="w-full bg-secondary m-auto disabled:cursor-not-allowed border-2 border-gray-light h-10 px-5 pl-8 rounded-lg text-sm focus:outline-none flex items-center justify-center"
            >
                {isLoading ? <Spinner colour="#205781" size="20px"/> : t('signup')}
            </button>)}
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center">
              <div className="flex-grow border-t-2 border-gray-200"></div>
              <span className="mx-2 text-sm font-normal text-gray-200">{t('or')}</span>
              <div className="flex-grow border-t-2 border-gray-200"></div>
            </div>
            <div className="flex flex-col gap-3 w-80 mt-4 ">
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
                onClick={() => handleMagicLink()}
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
    <div
        style={{backgroundImage: `url(${logoImg})`}}
        className="flex-1 bg-cover lg:h-screen items-end flex hidden lg:flex"
    >
        <div className={"text-black ml-20 mb-16"}>
            <h2>text1</h2>
            <div className={"mt-5"}>
                <h4>text2</h4>
                <span>text3</span>
            </div>
        </div>
    </div>
    <div className="absolute bottom-0">
        <LanguageSelector/>
    </div>
  </div>
  );
}
