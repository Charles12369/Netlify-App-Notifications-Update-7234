import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useNotification } from '../context/NotificationContext';
import { useWorkout } from '../context/WorkoutContext';

const { FiArrowLeft, FiBell, FiTrash2, FiInfo, FiSettings, FiSmartphone } = FiIcons;

const SettingsPage = () => {
  const { isEnabled, permission, toggleNotifications, requestPermission } = useNotification();
  const { workoutHistory } = useWorkout();

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all workout data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const getNotificationStatus = () => {
    if (permission === 'denied') return { text: 'Blocked', color: 'text-red-400' };
    if (permission === 'granted' && isEnabled) return { text: 'Enabled', color: 'text-green-400' };
    if (permission === 'granted' && !isEnabled) return { text: 'Disabled', color: 'text-yellow-400' };
    return { text: 'Not Requested', color: 'text-gray-400' };
  };

  const notificationStatus = getNotificationStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-700">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl" />
          </motion.button>
        </Link>
        <h1 className="text-xl font-semibold">Settings</h1>
        <div></div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Notifications Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <SafeIcon icon={FiBell} className="text-blue-400" />
            Push Notifications
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
              <div>
                <div className="font-medium">Workout Reminders</div>
                <div className="text-sm text-gray-400">
                  Get notified to maintain your streak
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${notificationStatus.color}`}>
                  {notificationStatus.text}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={permission === 'default' ? requestPermission : toggleNotifications}
                  className="mt-2 px-3 py-1 bg-blue-600 rounded-lg text-xs font-medium hover:bg-blue-500 transition-colors"
                >
                  {permission === 'default' ? 'Enable' : isEnabled ? 'Disable' : 'Enable'}
                </motion.button>
              </div>
            </div>

            {permission === 'denied' && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <SafeIcon icon={FiInfo} className="text-red-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-400 mb-1">Notifications Blocked</div>
                    <div className="text-sm text-red-300">
                      To enable notifications, please allow them in your browser settings and refresh the page.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* App Info Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <SafeIcon icon={FiInfo} className="text-green-400" />
            App Information
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300">Total Workouts</span>
              <span className="font-medium">{workoutHistory.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300">Data Storage</span>
              <span className="font-medium">Local Browser</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <SafeIcon icon={FiSettings} className="text-orange-400" />
            Data Management
          </h2>
          
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearData}
              className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left hover:bg-red-500/20 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <SafeIcon icon={FiTrash2} className="text-red-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-medium text-red-400">Clear All Data</div>
                  <div className="text-sm text-red-300">
                    Delete all workout history and reset progress
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <SafeIcon icon={FiSmartphone} className="text-blue-400" />
            Pro Tips
          </h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span className="text-gray-300">Enable notifications to get daily workout reminders</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span className="text-gray-300">Add this app to your home screen for quick access</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span className="text-gray-300">Consistency is key - aim for daily workouts to build a streak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;