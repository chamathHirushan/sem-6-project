import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {logoutUser} from "../components/Logout";
import logoHr from "../assets/sewalk_horizontal_logo.png";
import { Outlet } from 'react-router-dom';
import MobileVerificationPopup from './MobileVerificationPopup';

const NavBar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user,userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [adminView, setAdminView] = useState(() => user?.role >= 3);

  const handleAdminStateChange = (state: boolean) => {
    setAdminView(state);
    navigate(state ? "/admin" : "/work");
  }

  // Initialize navigation array
  let navigation: { name: string; path: string }[] = [];
  if (adminView) {
    navigation = [
        { name: 'Admin analytics', path: '/admin' },
        { name: 'Earnings', path: '/earnings' },
        { name: 'Users', path: '/users' },
        { name: 'Conversations', path: '/conversations' },
      ];
  } else{
    navigation = [
        { name: 'To Work', path: '/work' },
        { name: 'To Hire', path: '/hire' },
        { name: 'My Jobs', path: '/my-jobs' },
        { name: 'Conversations', path: '/conversations' },
        { name: 'Analytics', path: '/analytics' },
      ];
  }

  // Initialize profile options
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
    <nav className="bg-white shadow-lg fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center">
            <div
                className="h-10 w-40 bg-no-repeat bg-contain"
                onClick ={() => navigate(adminView ? "/admin" : "/work")}
                style={{ backgroundImage: `url(${logoHr})` }}
            />
            <div className="hidden md:flex space-x-8 ml-10">
              {navigation.map((item) => (
                <Link 
                  to={item.path}
                  key={item.path}
                  className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path ? 'text-primary' : ''
                  }`}
                >
                  {item.name}
              </Link>
              ))}
            </div>
          </div>

          {/* Right side - Profile/login */}
            <div className="flex items-center gap-4">
            {user.role>=2 && (
            	<div className="inline-block py-2 px-1 bg-background rounded-2xl whitespace-nowrap mr-20">
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
                </div>)}
            <div className="relative ml-auto">
              {userLoggedIn ? (
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
                     <p> Hi, {user.name} <span className="text-sm text-muted-foreground">▾</span></p>
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
                        {profileOptions.map((item) => (
                          item.path ? (
                            <Link
                              key={item.name}
                              to={item.path}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                location.pathname === item.path 
                                  ? 'text-primary' : ''
                              }`}
                              role="menuitem"
                              tabIndex={-1}
                            >
                              {item.name}
                            </Link>
                          ) : (
                            <button
                              key={item.name}
                              onClick={() => {item.onClick?.();}}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                              tabIndex={-1}
                            >
                              {item.name}
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                  }}
                  className="bg-blue-600 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pt-16 bg-background">
          <Outlet />
          <MobileVerificationPopup/>
      </main>
    </div>
  );
};

export default Layout;