import { useEffect, useRef, useState} from 'react';
import {BellIcon } from "@heroicons/react/24/outline";
import { BellIcon as BellIconSolid } from "@heroicons/react/24/solid";
import {getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead} from '../api/userAPI';

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  iconRef: React.RefObject<HTMLDivElement | null>;
  onRead: (id: number) => void;
  onReadAll: () => void;
  onClose: () => void;
}

const NotificationsDropdown = ({ notifications, iconRef, onRead, onReadAll, onClose }: NotificationsDropdownProps) => {
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconRef.current && iconRef.current.contains(event.target as Node)) {
        return;
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      ref={notificationRef}
      className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div className="p-3 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              onClick={() => onRead(notification.id)}
              className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                !notification.read ? 'bg-gray-100' : ''
              }`}
            >
              <div className="text-sm">{notification.message}</div>
              <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        )}
      </div>
      <div className="p-2 border-t">
        <button className="w-full text-sm text-center text-blue-600 hover:text-blue-800 py-1" onClick={() => onReadAll()}>
          Mark all as read
        </button>
      </div>
    </div>
  );
};

export const NotificationsIcon = () => {
  const bellIconRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await getUserNotifications();
        setNotifications(Array.isArray(fetchedNotifications) ? fetchedNotifications : []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);

  const handleRead = async (id: string | number) => {
    // call the backend to mark as read
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    await markNotificationAsRead(id.toString())
  };

  const handleReadAll = async () => {
    // call the backend
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    await markAllNotificationsAsRead();
  };

  return(
    <div className="relative mt-2">
      <div ref ={bellIconRef}>
        <button
          onClick={() => setIsNotificationsOpen(prev => !prev)}	
          className="relative p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
        >
          {isNotificationsOpen ? (
            <BellIconSolid className="h-6 w-6 text-gray-600" />
          ) : (
            <BellIcon className="h-6 w-6" />
          )}
          {notifications.filter((n) => !n.read).length > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </button>
      </div>
      {isNotificationsOpen ? (
        <div className="absolute top-11 right-[5px]">
          <NotificationsDropdown
            notifications={notifications}
            iconRef={bellIconRef}
            onRead={handleRead}
            onReadAll={handleReadAll}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>
      ) : null}
    </div>
  )};