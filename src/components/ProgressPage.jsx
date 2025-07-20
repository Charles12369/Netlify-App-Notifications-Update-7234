import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useWorkout } from '../context/WorkoutContext';
import { format, subDays } from 'date-fns';

const { FiArrowLeft, FiTrendingUp, FiCalendar, FiAward, FiTarget } = FiIcons;

const ProgressPage = () => {
  const { workoutHistory, currentStreak, totalWorkouts, totalPushUps } = useWorkout();

  // Calculate weekly progress
  const getWeeklyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      const dayWorkouts = workoutHistory.filter(workout => 
        format(new Date(workout.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      return {
        date: format(date, 'EEE'),
        pushUps: dayWorkouts.reduce((sum, workout) => sum + workout.pushUps, 0),
        workouts: dayWorkouts.length
      };
    }).reverse();
    
    return last7Days;
  };

  const weeklyData = getWeeklyData();
  const maxPushUps = Math.max(...weeklyData.map(d => d.pushUps), 1);

  const stats = [
    { label: 'Current Streak', value: `${currentStreak} days`, icon: FiTarget, color: 'text-orange-500' },
    { label: 'Total Workouts', value: totalWorkouts, icon: FiCalendar, color: 'text-blue-500' },
    { label: 'Total Push-ups', value: totalPushUps, icon: FiAward, color: 'text-green-500' },
    { label: 'Average per Workout', value: totalWorkouts > 0 ? Math.round(totalPushUps / totalWorkouts) : 0, icon: FiTrendingUp, color: 'text-purple-500' }
  ];

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
        <h1 className="text-xl font-semibold">Progress Tracking</h1>
        <div></div>
      </div>

      <div className="px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 text-center"
            >
              <SafeIcon icon={stat.icon} className={`text-2xl ${stat.color} mx-auto mb-2`} />
              <div className="text-xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Weekly Progress Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <SafeIcon icon={FiTrendingUp} className="text-blue-400" />
            Weekly Push-ups
          </h2>
          <div className="flex items-end justify-between h-32 gap-2">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.pushUps / maxPushUps) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-gradient-to-t from-blue-600 to-purple-500 rounded-t w-full min-h-[4px] flex items-end justify-center"
                >
                  {day.pushUps > 0 && (
                    <span className="text-xs font-medium text-white mb-1">
                      {day.pushUps}
                    </span>
                  )}
                </motion.div>
                <span className="text-xs text-gray-400 mt-2">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <SafeIcon icon={FiCalendar} className="text-green-400" />
            Recent Workouts
          </h2>
          
          {workoutHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <SafeIcon icon={FiTarget} className="text-4xl mx-auto mb-3 opacity-50" />
              <p>No workouts recorded yet</p>
              <p className="text-sm">Start your first workout to see progress!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {workoutHistory.slice(0, 10).map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/30"
                >
                  <div>
                    <div className="font-medium">
                      {workout.pushUps} push-ups ({workout.sets}×{workout.repsPerSet})
                    </div>
                    <div className="text-sm text-gray-400 capitalize">
                      {workout.plan} • {format(new Date(workout.date), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-400">
                      {Math.round(workout.duration / 60000)}m
                    </div>
                    <div className="text-xs text-gray-400">Duration</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Motivational Section */}
        {currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20"
          >
            <div className="text-center">
              <SafeIcon icon={FiAward} className="text-4xl text-orange-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">
                {currentStreak} Day Streak! 🔥
              </h3>
              <p className="text-gray-300">
                You're building an amazing habit! Keep up the fantastic work.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;