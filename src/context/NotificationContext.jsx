import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [permission, setPermission] = useState('default');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setIsEnabled(localStorage.getItem('notificationsEnabled') === 'true');
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setIsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        toast.success('Push notifications enabled!');
      }
      return result;
    }
    return 'denied';
  };

  const sendNotification = (title, options = {}) => {
    if (permission === 'granted' && isEnabled) {
      new Notification(title, {
        icon: '/fitness-icon.png',
        badge: '/fitness-icon.png',
        ...options
      });
    }
    // Also show toast notification as fallback
    toast(title, { icon: '💪' });
  };

  const scheduleWorkoutReminder = () => {
    if (permission === 'granted' && isEnabled) {
      // Schedule reminder for 24 hours later
      setTimeout(() => {
        sendNotification('Time for your workout! 💪', {
          body: 'Keep up your fitness routine and stay strong!',
          tag: 'workout-reminder'
        });
      }, 24 * 60 * 60 * 1000);
    }
  };

  const sendMotivationalNotification = () => {
    const messages = [
      'Great workout! You\'re getting stronger every day! 💪',
      'Awesome job! Your dedication is paying off! 🔥',
      'You crushed it! Keep up the amazing work! ⭐',
      'Fantastic effort! You\'re building healthy habits! 🌟',
      'Well done! Every workout counts towards your goals! 🎯'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    sendNotification('Workout Complete!', {
      body: randomMessage,
      tag: 'workout-complete'
    });
  };

  const toggleNotifications = () => {
    if (!isEnabled && permission !== 'granted') {
      requestPermission();
    } else {
      const newState = !isEnabled;
      setIsEnabled(newState);
      localStorage.setItem('notificationsEnabled', newState.toString());
      toast.success(newState ? 'Notifications enabled' : 'Notifications disabled');
    }
  };

  const value = {
    permission,
    isEnabled,
    requestPermission,
    sendNotification,
    scheduleWorkoutReminder,
    sendMotivationalNotification,
    toggleNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};