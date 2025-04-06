import {useEffect, useState} from "react";
import {apiClient} from "../api/client";
import logoImg from "../assets/logo.png";
import {KeyIcon, EnvelopeIcon, PhoneIcon} from "@heroicons/react/24/outline";
import LanguageSelector from "../components/languageSelector/LanguageSelector";
import useI18n from "../locale/useI18n";
import Spinner from "../components/Loading/Spinner";

// const useAuth = () => {
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         const response = await apiClient.get("/api/auth/token");
//         setToken(response.data.accessToken);
//       } catch (error) {
//         console.error("Error fetching token:", error);
//         setToken(null);
//       }
//     };

//     fetchToken();
//   }, []);

//   return token;
// }

// const authProvider = ({children}) => {

//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const fetchToken = async () => {
//       try{
//         const response = await apiClient.get("/api/auth/token");
//         setToken(response.data.accessToken);
//       }catch{
//         setToken(null);
//       }
//   }
//   fetchToken();
//   },[]);
// }

export default function LoginPage() {
  const [backendData, setBackendData] = useState<string>("Loading...");
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const {t} = useI18n("login");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.get("/api"); // Replace with actual API endpoint
        setBackendData(response || "No data received"); // Adjust based on API response
      } catch (error) {
        setBackendData("Error fetching data");
        console.error("API Error:", error);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
        setIsLoading(true);
        console.log("Submitting data:", { email, password });
        const response = await apiClient.post("/api/auth/continue", { email, password });
        console.log("Continue response:", response);
    } catch (error) {
        console.error("Error during continue:", error);
    }
    finally {
        setIsLoading(true);
    }
  };

  return(
  // <p>{backendData}</p>
  <div className="flex-col lg:flex-row flex">
    <div className="flex flex-col flex-1">
      {/* <div className="flex justify-center">
          <img className={"w-1/2 m-8"} src={logoImg} alt="Logo"/>
      </div> */}
      <div className="flex flex-col mt-24 justify-center items-center">
      <h1 className="text-6xl font-bold text-gray-600 text-center w-90">{t("welcome")}</h1>
          <div className="flex flex-col gap-3 w-80 mt-7">
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
                  />
              </div>
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
              </div>

              <div className="relative text-gray-600 rounded">
                <button className="absolute left-2 top-0 bottom-0 mr-4" aria-label="Lock">
                    <KeyIcon className="text-gray-600 h-5 w-5"/>
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
            <button
                onClick={() => handleSubmit()}
                disabled={!email || !password}
                className="w-full bg-secondary m-auto disabled:cursor-not-allowed border-2 border-gray-light h-10 px-5 pl-8 rounded text-sm focus:outline-none flex items-center justify-center"
            >
                {isLoading ? <Spinner colour="#205781" size="20px"/> : t('login')}
            </button>
          </div>
          <div className="flex flex-col gap-3 mt-4 w-80">
            <div className="flex items-center justify-center">
              <div className="flex-1 border-t-2 border-gray-200"></div>
              <span className="mx-2 text-sm font-normal text-gray-300">{t('or')}</span>
              <div className="flex-1 border-t-2 border-gray-200"></div>
            </div>
              <button onClick={() => setIsLogin(false)} className="dashboard-button bg-black w-full">
                  {/* <img height={18} width={18} src={googleIcon}/> */}
                  {t('text1')}
              </button>
              {/* <button onClick={() => login(EAuthType.MS, state?.from.href)}
                      className="dashboard-button bg-black w-full">
                  <img height={18} width={18} src={microsoftIcon}/>
                  {t('text2')}
              </button> */}
          </div>
        </div>
    </div>
    <div
        style={{backgroundImage: `url(${logoImg})`}}
        className="flex-1 bg-cover lg:h-screen items-end flex hidden lg:flex"
    >
        <div className={"text-white ml-20 mb-16"}>
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
