import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useWorkout } from '../context/WorkoutContext';
import { useNotification } from '../context/NotificationContext';

const { FiTarget, FiTrendingUp, FiPlay, FiSettings, FiBell, FiAward } = FiIcons;

const Dashboard = () => {
  const { currentStreak, totalWorkouts, totalPushUps } = useWorkout();
  const { isEnabled, toggleNotifications } = useNotification();

  const stats = [
    { label: 'Current Streak', value: `${currentStreak} days`, icon: FiTarget, color: 'text-orange-500' },
    { label: 'Total Workouts', value: totalWorkouts, icon: FiTrendingUp, color: 'text-blue-500' },
    { label: 'Total Push-ups', value: totalPushUps, icon: FiAward, color: 'text-green-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Fitness Tracker</h1>
            <p className="text-gray-400">Build strength, one push-up at a time</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleNotifications}
              className={`p-3 rounded-xl transition-colors ${
                isEnabled 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-gray-700 text-gray-400 border border-gray-600'
              }`}
            >
              <SafeIcon icon={FiBell} className="text-xl" />
            </motion.button>
            <Link to="/settings">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gray-700 rounded-xl text-gray-300 hover:bg-gray-600 transition-colors border border-gray-600"
              >
                <SafeIcon icon={FiSettings} className="text-xl" />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <SafeIcon icon={stat.icon} className={`text-2xl ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          
          <Link to="/workout">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 flex items-center justify-between group cursor-pointer"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">Start Push-up Workout</h3>
                <p className="text-blue-100">Begin your daily push-up routine</p>
              </div>
              <SafeIcon icon={FiPlay} className="text-3xl text-white group-hover:scale-110 transition-transform" />
            </motion.div>
          </Link>

          <Link to="/progress">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-between group cursor-pointer border border-gray-700/50"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">View Progress</h3>
                <p className="text-gray-400">Track your fitness journey</p>
              </div>
              <SafeIcon icon={FiTrendingUp} className="text-3xl text-gray-400 group-hover:scale-110 transition-transform" />
            </motion.div>
          </Link>
        </div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20"
        >
          <blockquote className="text-center">
            <p className="text-lg italic text-gray-300 mb-2">
              "The groundwork for all happiness is good health."
            </p>
            <footer className="text-orange-400 font-medium">— Leigh Hunt</footer>
          </blockquote>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;