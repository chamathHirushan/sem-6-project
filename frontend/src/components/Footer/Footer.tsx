import React from "react";
import "./Footer.css";
import sewalkLogo from "../../assets/sewalk_horizontal_logo.png";
import LanguageSelector from '../languageSelector/LanguageSelector';


const Footer: React.FC = () => {
  return (
    <footer className="footer">
       
        <div className="flex flex-col items-center justify-center w-full h-full">
            
            <div className="flex flex-col w-11/12 h-full gap-5 justify-between">
                
                <div className="flex flex-row w-full h-auto gap-10 justify-between">
                    {/* logo & subscribe section */}
                    <div className="w-5/12 h-auto srounded-md">
                        {/* logo section */}
                        <div className="flex items-center justify-start h-auto">
                            <img src={sewalkLogo} alt="Sewa.lk Logo" className="h-12 bg-white rounded-md" />
                            <span className="text-white text-3xl font-normal ml-3">Sewa.lk</span>
                        </div>

                        {/* subscribe section */}
                        <div className="items-center justify-center h-auto mt-2">
                            <h3 className="text-white text-lg font-semibold mb-1">Subscribe to our Newsletter</h3>
                            <p className="text-white text-xs mb-4">
                                Stay updated with the latest news and offers from Sewa.lk. Enter your email below to subscribe.
                            </p>
                            <form className="flex flex-row items-center gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="p-2 rounded-md w-64 text-black"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-green-700"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* web page routes section */}
                    <div className="flex flex-col w-7/12 h-auto">
                        
                        <div className="flex flex-row w-full h-auto gap-3 justify-between">
                            {/* Job routes section */}
                            <div className="flex flex-col w-full h-auto">
                                <h1 className="text-white text-xl font-semibold mb-2">Jobs</h1>
                                <ul className="flex flex-col w-full h-auto pl-4 pr-4">
                                    <li className="text-white text-xs mb-1">Full-Time Jobs</li>
                                    <li className="text-white text-xs mb-1">Part-Time Jobs</li>
                                    <li className="text-white text-xs mb-1">Freelance Jobs</li>
                                    <li className="text-white text-xs mb-1">Internships</li>
                                </ul>
                            </div>
                            
                            {/* Services routes section */}
                            <div className="flex flex-col w-full h-auto">
                                <h1 className="text-white text-xl font-semibold mb-2">Services</h1>
                                <ul className="flex flex-col w-full h-auto pl-4 pr-4">
                                    <li className="text-white text-xs mb-1">Full-Time Jobs</li>
                                    <li className="text-white text-xs mb-1">Part-Time Jobs</li>
                                    <li className="text-white text-xs mb-1">Freelance Jobs</li>
                                    <li className="text-white text-xs mb-1">Internships</li>
                                </ul>
                            </div>
                            
                            {/* Contacts routes section */}      
                            <div className="flex flex-col w-full h-auto">
                                <h1 className="text-white text-xl font-semibold mb-2">Support</h1>
                                <ul className="flex flex-col w-full h-auto pl-4 pr-4">
                                    <li className="text-white text-xs mb-1">Contact</li>
                                    <li className="text-white text-xs mb-1">Terms & Conditions</li>
                                    <li className="text-white text-xs mb-1">Privacey Policy</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-4 justify-end flex">
                            <h2 className="flex justify-center items-center pb-3">Select your language</h2>
                            <LanguageSelector/>
                        </div>
                    </div>

                </div>

                {/* all rights reserved part and language selector section */}
                <div className= "w-full h-10 rounded-md">
                    <div className="flex items-center justify-center h-full text-white text-sm">
                        <span>© 2025 Sewa.lk</span>
                        <span className="ml-3">All rights reserved.</span>
                    </div>
                </div>
            </div>

        </div>

    </footer>
  );
};

export default Footer;
