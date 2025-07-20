import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useWorkout } from '../context/WorkoutContext';
import { useNotification } from '../context/NotificationContext';

const { FiArrowLeft, FiPlay, FiPause, FiRotateCcw, FiCheck, FiTarget } = FiIcons;

const WorkoutPage = () => {
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [totalPushUps, setTotalPushUps] = useState(0);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('beginner');

  const { saveWorkout } = useWorkout();
  const { sendMotivationalNotification, scheduleWorkoutReminder } = useNotification();

  const workoutPlans = {
    beginner: { sets: 3, reps: 10, rest: 60, label: 'Beginner (3x10)' },
    intermediate: { sets: 4, reps: 15, rest: 45, label: 'Intermediate (4x15)' },
    advanced: { sets: 5, reps: 20, rest: 30, label: 'Advanced (5x20)' }
  };

  const currentPlan = workoutPlans[selectedPlan];

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused && restTime > 0) {
      interval = setInterval(() => {
        setRestTime(time => {
          if (time <= 1) {
            setIsActive(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, restTime]);

  const startSet = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseSet = () => {
    setIsPaused(!isPaused);
  };

  const completeRep = () => {
    if (currentRep < currentPlan.reps) {
      setCurrentRep(prev => prev + 1);
      setTotalPushUps(prev => prev + 1);
    }
  };

  const completeSet = () => {
    if (currentSet < currentPlan.sets) {
      setCurrentSet(prev => prev + 1);
      setCurrentRep(0);
      setRestTime(currentPlan.rest);
      setIsActive(true);
      setIsPaused(false);
    } else {
      // Workout complete
      setWorkoutComplete(true);
      const workout = {
        plan: selectedPlan,
        sets: currentPlan.sets,
        repsPerSet: currentPlan.reps,
        pushUps: totalPushUps,
        duration: Date.now() - startTime
      };
      saveWorkout(workout);
      sendMotivationalNotification();
      scheduleWorkoutReminder();
    }
  };

  const resetWorkout = () => {
    setCurrentSet(1);
    setCurrentRep(0);
    setIsActive(false);
    setIsPaused(false);
    setRestTime(0);
    setTotalPushUps(0);
    setWorkoutComplete(false);
  };

  const [startTime] = useState(Date.now());

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (workoutComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black text-white flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <SafeIcon icon={FiCheck} className="text-4xl text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-4">Workout Complete! 🎉</h1>
          <p className="text-green-200 mb-6">
            Great job! You completed {totalPushUps} push-ups across {currentPlan.sets} sets.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-green-600 rounded-xl font-semibold hover:bg-green-500 transition-colors"
              >
                Back to Dashboard
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetWorkout}
              className="px-6 py-3 bg-gray-700 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              New Workout
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

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
        <h1 className="text-xl font-semibold">Push-up Workout</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetWorkout}
          className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <SafeIcon icon={FiRotateCcw} className="text-xl" />
        </motion.button>
      </div>

      <div className="px-6 py-8">
        {/* Workout Plan Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Workout Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(workoutPlans).map(([key, plan]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPlan(key)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPlan === key
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-gray-600 bg-gray-800/50'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold mb-1">{plan.label}</div>
                  <div className="text-sm text-gray-400">Rest: {plan.rest}s</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Current Set Info */}
        <div className="text-center mb-8">
          <motion.div
            key={currentSet}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-gray-800/50 rounded-2xl px-6 py-3 border border-gray-700/50 mb-4"
          >
            <SafeIcon icon={FiTarget} className="text-blue-400" />
            <span className="text-lg font-semibold">
              Set {currentSet} of {currentPlan.sets}
            </span>
          </motion.div>
          
          <div className="text-6xl font-bold mb-2">
            {currentRep}/{currentPlan.reps}
          </div>
          <div className="text-gray-400">Push-ups completed</div>
        </div>

        {/* Rest Timer */}
        <AnimatePresence>
          {restTime > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-8"
            >
              <div className="bg-orange-500/20 rounded-2xl p-6 border border-orange-500/30">
                <div className="text-2xl font-bold text-orange-400 mb-2">
                  Rest Time: {formatTime(restTime)}
                </div>
                <div className="text-orange-200">Take a breather, you've earned it!</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          {restTime === 0 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={completeRep}
                disabled={currentRep >= currentPlan.reps}
                className="px-8 py-4 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Rep
              </motion.button>
              
              {currentRep >= currentPlan.reps && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={completeSet}
                  className="px-8 py-4 bg-green-600 rounded-xl font-semibold hover:bg-green-500 transition-colors"
                >
                  {currentSet >= currentPlan.sets ? 'Finish Workout' : 'Complete Set'}
                </motion.button>
              )}
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(((currentSet - 1) * currentPlan.reps + currentRep) / (currentPlan.sets * currentPlan.reps) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentSet - 1) * currentPlan.reps + currentRep) / (currentPlan.sets * currentPlan.reps) * 100}%` 
              }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-blue-400">{totalPushUps}</div>
            <div className="text-sm text-gray-400">Total Push-ups</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-green-400">{currentPlan.sets * currentPlan.reps}</div>
            <div className="text-sm text-gray-400">Target Push-ups</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;