import { useEffect, useRef, useState, forwardRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { logoutUser } from "../components/Logout";
import logoHr from "../assets/sewalk_horizontal_logo.png";
import MobileVerificationPopup from './MobileVerificationPopup';
import { NotificationsIcon } from '../components/Notifications';
import PostJobPopup from '../components/PostForm/PostForm';
import Footer from '../components/Footer/Footer';
import ChatBotWidget from './ChatBot/ChatBotWidget';

const NavBar = forwardRef<HTMLElement>((props, ref) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const { user, userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [adminView, setAdminView] = useState(() => user?.role >= 3);
  const [showPostPopup, setShowPostPopup] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const adminDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);
  
  const navRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      const el = navRef.current;
      if (!el) return;
  
      const navItems = el.querySelector('.nav-links'); // div holding nav links
      const rightSide = el.querySelector('.nav-right'); // div holding buttons/icons
  
      if (!navItems || !rightSide) return;
  
      const navWidth = el.offsetWidth;
      const linksWidth = navItems.scrollWidth;
      const rightWidth = rightSide.offsetWidth;
  
      // If they can't both fit
      setShowHamburger(linksWidth + rightWidth > navWidth - 50);
    };
  
    const resizeObserver = new ResizeObserver(() => checkOverflow());
    if (navRef.current) resizeObserver.observe(navRef.current);
  
    window.addEventListener('resize', checkOverflow);
    checkOverflow(); // initial call
  
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  
  const handleAdminStateChange = (state: boolean) => {
    setAdminView(state);
    navigate(state ? "/admin" : "/work");
  };

  // Navigation links
  let navigation: { name: string; path: string }[] = [];
  navigation = [
    { name: 'Available Jobs', path: '/work' },
    { name: 'Hire Workers', path: '/hire' },
    { name: 'Chats', path: '/conversations' },

  ];

  // Profile dropdown options
  let profileOptions: { name: string; path?: string; onClick?: () => void }[] = [];
  profileOptions = [
    { name: 'View Profile', path: '/profile' },
    { name: 'Working Fields', path: '/job-fields' },
    { name: 'Works', path: '/my-jobs' },
    { name: 'Favourites', path: '/favorites' },
    { name: 'Analytics', path: '/analytics' },
    {
      name: 'Logout',
      onClick: () => logoutUser(navigate)
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !profileDropdownRef.current ||
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


    useEffect(() => {
      return () => {
        if (adminDropdownTimeoutRef.current) {
          clearTimeout(adminDropdownTimeoutRef.current);
        }
      };
    }, []);
  

  const defaultProfilePicUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`;

  return (
    <nav ref={ref} className="shadow-lg fixed w-full z-50" 
      style={{ 
        height: "72px", 
        background: "linear-gradient(90deg, #205781 0%, #4F959D 100%)"
      }}>
      <div className="w-[95%] mx-auto py-2">
        
          {mobileMenuOpen && (
            <div className="md:hidden bg-white px-4 py-3 space-y-2 shadow-md absolute top-full left-0 right-0 z-40">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block text-gray-800 font-medium hover:text-primary ${
                    location.pathname === item.path ? 'text-primary' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {user?.role >= 2 && (
                <>
                  <div className="border-t border-gray-200 my-2" />
                  <p className="text-gray-500 font-semibold text-sm">Admin Views</p>
                  <Link to="/admin" className="block text-gray-800 hover:text-primary">Admin Analytics</Link>
                  <Link to="/users" className="block text-gray-800 hover:text-primary">Users</Link>
                </>
              )}
            </div>
          )}

          {/* Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logoHr} alt="Sewa.lk Logo" className="h-12 bg-white rounded-md" />
              <span className="text-white text-3xl font-light ml-1 hidden md:flex">Sewa.lk</span>
            </div>

            {/* Hamburger menu - shown on small screens only */}
            <div className="flex items-center md:hidden gap-4">
              {/* Button for posting a job/service */}
              <div>
                  <button
                  className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br 
                  focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-cyan-500/50 
                  dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-2 py-2 text-center
                  border-1 border-teal-200 border-solid"
                  onClick={() => setShowPostPopup(true)}
                  style={{
                    boxShadow: '0 0 6px 0.5px rgba(74,255,195,0.7)',
                    fontSize: '12px', 
                  }}
                  >
                  Post Job/Task
                  </button>
              </div>

              {/* Notification */}
              <NotificationsIcon />

              {/* Profile dropdown (mobile - no greeting text) */}
              <div ref={profileDropdownRef} className="relative">
                <button onClick={() => setIsProfileOpen((prev) => !prev)}>
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-white">
                    <img
                      src={user?.profile_picture || defaultProfilePicUrl}
                      alt="User profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>

                {/* Dropdown menu */}
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition-transform duration-200 ${
                    isProfileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 pointer-events-none -translate-y-2'
                  }`}
                >
                  {profileOptions.map((item) =>
                    item.path ? (
                      <Link key={item.name} to={item.path} className="block px-4 py-2 text-sm hover:bg-gray-100">
                        {item.name}
                      </Link>
                    ) : (
                      <button key={item.name} onClick={item.onClick} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                        {item.name}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            
            {/* Navigation links - shown on larger screens */}
            <div className="hidden md:flex items-center justify-center 
                gap-x-2 sm:gap-x-3 md:gap-x-4 
                gap-y-1 sm:gap-y-2 md:gap-y-2 
                px-2 sm:px-3 w-full max-w-[90%] md:w-auto">

              {navigation.map((item) => (
                <Link
                to={item.path}
                key={item.path}
                className={`hover:text-gray-200 text-sm font-normal
                  text-center px-2 break-words whitespace-normal leading-snug
                  w-auto min-w-[60px]
                  ${location.pathname === item.path ? 'text-white font-semibold' : ''}`}
                style={{
                  lineHeight: '1.1rem',
                  maxHeight: '2.2rem', // 2 lines * 1.1rem
                  overflow: 'hidden',
                }}
              >
                {item.name}
              </Link>
              
              ))}
              {/* Admin Views dropdown for users with role >= 2 */}
              {user.role >= 2 && (
                <div
                  className="relative"
                  onMouseEnter={() => {
                  if (adminDropdownTimeoutRef.current) clearTimeout(adminDropdownTimeoutRef.current);
                  setIsAdminDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                  adminDropdownTimeoutRef.current = setTimeout(() => {
                    setIsAdminDropdownOpen(false);
                  }, 300);
                  }}
                >
                  <button
                    type="button"
                    className="text-gray-900 hover:text-gray-200 lg:py-0 text-sm font-normal w-[110px] text-center break-words whitespace-normal leading-tight md:leading-normal md:w-[110px] md:max-w-[110px] max-w-[48vw] min-w-[80px] px-1 py-1"
                    style={{
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        maxHeight: '2.5em',
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                    }}
                    title="Admin Views"
                    onClick={() => setIsAdminDropdownOpen((open) => !open)}
                  >
                    <span className="flex items-center justify-center">
                      Admin Views
                      <svg className="w-3 h-3 ml-2 mt-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m1 1 4 4 4-4"/>
                      </svg>
                    </span>
                  </button>
                  {isAdminDropdownOpen  && (
                  <div 
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out transform z-50 ${
                    isAdminDropdownOpen
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    } py-1`}
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm transition-colors hover:bg-gray-200"
                    >
                      Admin Analytics
                    </Link>
                    <Link
                      to="/users"
                      className="block px-4 py-2 text-sm transition-colors hover:bg-gray-200"
                    >
                      Users
                    </Link>
                  </div>
                  )}
                </div>
              )}

            </div>

          {/* Right side - Profile/login*/}  
             <div className="relative items-center gap-4 hidden md:flex">
              {/* Button for posting a job/service */}
              <div>
                  <button
                  className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br 
                  focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-cyan-500/50 
                  dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-2 py-2 text-center
                  border-1 border-teal-200 border-solid min-w-[110px]"
                  onClick={() => setShowPostPopup(true)}
                  style={{
                    boxShadow: '0 0 6px 0.5px rgba(74,255,195,0.7)',
                  }}
                  >
                  Post Task / Job
                  </button>
              </div>

              {/* Notifications and Profile dropdown */}
              {userLoggedIn ? (
                <>
                  <NotificationsIcon />

                  <div
                    ref={profileDropdownRef}
                    onMouseEnter={() => {
                      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
                      setIsProfileOpen(true);
                    }}
                    onMouseLeave={() => {
                      hideTimeoutRef.current = setTimeout(() => {
                        setIsProfileOpen(false);
                      }, 300); // delay in milliseconds
                    }}
                    className="relative inline-block"
                  >
                    <button                 
                      className="flex items-center text-sm focus:outline-none"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-blue-600 overflow-hidden border-2 border-transparent hover:border-primary transition-colors duration-200 cursor-pointer mr-2">
                        <img
                          src={user?.profile_picture || defaultProfilePicUrl}
                          alt="User profile"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="truncate items-center gap-2 hidden md:flex">
                        Hi, {user.name}
                        <svg className="w-2.5 h-2.5 ml-1 mt-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                        </svg>
                      </p>
                    </button>

                    {/* Profile dropdown */}
                    <div
                      className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out transform z-50 ${
                        isProfileOpen
                          ? 'opacity-100 scale-100 translate-y-0'
                          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                      }`}
                      role="menu"
                      aria-orientation="vertical"
                    >
                        <div className="py-1" role="group">
                          {profileOptions.map((item) =>
                            item.path ? (
                              <Link
                                key={item.name}
                                to={item.path}
                                className={`block px-4 py-2 text-sm transition-colors ${
                                  location.pathname === item.path
                                    ? 'text-primary' : ''
                                } hover:bg-gray-200`}
                                role="menuitem"
                                tabIndex={-1}
                              >
                                {item.name}
                              </Link>
                            ) : (
                              <button
                                key={item.name}
                                onClick={() => { item.onClick?.(); }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                                role="menuitem"
                                tabIndex={-1}
                              >
                                {item.name}
                              </button>
                            )
                          )}
                        </div>
                      </div>                  
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Login
                </button>
              )}
            </div>
          </div>


      </div>
      {/* Popup for posting job */}
      {/* <PostJobPopup open={showPostPopup} onClose={() => setShowPostPopup(false)} /> */}
      {showPostPopup && (
        <PostJobPopup open={true} onClose={() => setShowPostPopup(false)} />
      )}
    </nav>
  );
});

const Layout: React.FC = () => {
  const navbarRef = useRef<HTMLElement>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };

    updateNavbarHeight();

    window.addEventListener('resize', updateNavbarHeight);
    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
    };
  }, [navbarRef]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar ref={navbarRef} />
      <main
        className="flex flex-col flex-1 bg-background"
        style={{ paddingTop: `${navbarHeight}px` }}
      >
          <div className="flex-1 flex flex-col">
            <Outlet />
          </div>
          <ChatBotWidget/>
          <MobileVerificationPopup />
          <Footer />
      </main>
    </div>
  );
};

export default Layout;