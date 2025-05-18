import { useEffect, useRef, useState, forwardRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { logoutUser } from "../components/Logout";
import logoHr from "../assets/sewalk_horizontal_logo.png";
import MobileVerificationPopup from './MobileVerificationPopup';
import LanguageSelector from './languageSelector/LanguageSelector';
import { NotificationsIcon } from '../components/Notifications';
import PostJobPopup from '../components/PostForm/PostForm';


const NavBar = forwardRef<HTMLElement>((props, ref) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [adminView, setAdminView] = useState(() => user?.role >= 3);
  const [showPostPopup, setShowPostPopup] = useState(false);

  const handleAdminStateChange = (state: boolean) => {
    setAdminView(state);
    navigate(state ? "/admin" : "/work");
  };

  // Navigation links
  let navigation: { name: string; path: string }[] = [];
  if (adminView) {
    navigation = [
      { name: 'Admin analytics', path: '/admin' },
      { name: 'Users', path: '/users' },
      { name: 'Chats', path: '/conversations' },
    ];
  } else {
    navigation = [
      { name: 'Available Jobs', path: '/work' },
      { name: 'Hire Workers', path: '/hire' },
      { name: 'My Works', path: '/my-jobs' },
      { name: 'Chats', path: '/conversations' },
    ];
  }

  // Profile dropdown options
  let profileOptions: { name: string; path?: string; onClick?: () => void }[] = [];
  if (adminView) {
    profileOptions = [
      { name: 'View Profile', path: '/profile' },
      { name: 'Favourites', path: '/favorites' },
      {
        name: 'Logout',
        onClick: () => logoutUser(navigate)
      },
    ];
  } else {
    profileOptions = [
      { name: 'View Profile', path: '/profile' },
      { name: 'My Working Fields', path: '/job-fields' },
      { name: 'Favourites', path: '/favorites' },
      { name: 'Analytics', path: '/analytics' },
      {
        name: 'Logout',
        onClick: () => logoutUser(navigate)
      },
    ];
  }

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

  const defaultProfilePicUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`;

  return (
    <nav ref={ref} className="bg-white shadow-lg fixed w-full z-50">
      <div className="w-[90%] mx-auto py-4 lg:py-0">
        <div className="flex flex-col xl:flex-row justify-between items-center h-auto xl:h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center flex-wrap justify-center xl:justify-start lg:flex-grow">
            <div
              className="h-20 w-40 bg-no-repeat bg-contain cursor-pointer mt-3"
              onClick={() => navigate(adminView ? "/admin" : "/work")}
              style={{ backgroundImage: `url(${logoHr})` }}
            />
            <div className="flex flex-wrap items-center justify-center space-x-4">
              {navigation.map((item) => (
                <Link
                  to={item.path}
                  key={item.path}
                  className={`text-gray-700 hover:text-blue-600 px-3 py-1 lg:py-0 rounded-md text-sm font-medium ${
                    location.pathname === item.path ? "text-primary" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Profile/login and Language Selector */}
          <div className="flex-wrap flex items-center justify-center space-x-8 mt-4 lg:mt-0 lg:flex-shrink-0">
            {/* Button for posting a job/service */}
            {!adminView &&(<div>
                <button
                className="bg-primary text-white px-3 py-1 rounded-2xl hover:bg-primary] focus:outline-none focus:ring-1 focus:ring-background transition-shadow"
                onClick={() => setShowPostPopup(true)}
                // style={{
                //   boxShadow: '0 0 6px 2px rgba(239,68,68,0.7)',
                // }}
                >
                Post a Task
                </button>
            </div>)}

            <div className="min-w-[100px] lg:w-auto mt-2">
              <LanguageSelector />
            </div>

            {user.role >= 2 && (
              <div className="inline-block py-2 px-1 bg-background rounded-2xl whitespace-nowrap">
                <span>
                  <input
                    onChange={() => handleAdminStateChange(true)}
                    type="radio"
                    id="admin"
                    className="hidden peer"
                    checked={adminView}
                  />
                  <label
                    htmlFor="admin"
                    className="bg-background rounded-2xl py-1 px-3 select-none cursor-pointer peer-checked:bg-secondary peer-checked:text-white font-normal"
                  >
                    Admin view
                  </label>
                </span>
                <span>
                  <input
                    onChange={() => handleAdminStateChange(false)}
                    type="radio"
                    id="user"
                    className="hidden peer"
                    checked={!adminView}
                  />
                  <label
                    htmlFor="user"
                    className="bg-background rounded-2xl py-1 px-3 select-none cursor-pointer peer-checked:bg-secondary peer-checked:text-white font-normal"
                  >
                    User View
                  </label>
                </span>
              </div>
            )}
            <div className="relative flex items-center gap-4">
              {userLoggedIn ? (
                <>
                  <NotificationsIcon />

                  <div ref={profileDropdownRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center text-sm focus:outline-none"
                      aria-haspopup="true"
                      aria-expanded={isProfileOpen}
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-blue-600 overflow-hidden border-2 border-transparent hover:border-primary transition-colors duration-200 cursor-pointer mr-2">
                        <img
                          src={user?.profile_picture || defaultProfilePicUrl}
                          alt="User profile"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="truncate"> Hi, {user.name} <span className="text-sm text-muted-foreground">▾</span></p>
                    </button>

                    {/* Profile dropdown */}
                    {isProfileOpen && (
                      <div
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
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
                    )}
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
      </div>
      {/* Popup for posting job */}
      <PostJobPopup open={showPostPopup} onClose={() => setShowPostPopup(false)} />
      {/* {showPostPopup && (
        <PostJobPopup open={true} onClose={() => setShowPostPopup(false)} />
      )} */}
      {/* <PostJobPopup open={showPostPopup} onClose={() => setShowPostPopup(false)} /> */}
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
        className="flex-1 bg-background"
        style={{ paddingTop: `${navbarHeight}px` }}
      >
        <br />
        <div className="ml-2">
          <Outlet />
        </div>
        <MobileVerificationPopup />
      </main>
    </div>
  );
};

export default Layout;