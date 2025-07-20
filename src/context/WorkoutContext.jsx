import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider = ({ children }) => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalPushUps, setTotalPushUps] = useState(0);

  useEffect(() => {
    // Load data from localStorage
    const savedHistory = localStorage.getItem('workoutHistory');
    const savedStreak = localStorage.getItem('currentStreak');
    const savedTotal = localStorage.getItem('totalWorkouts');
    const savedPushUps = localStorage.getItem('totalPushUps');

    if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory));
    if (savedStreak) setCurrentStreak(parseInt(savedStreak));
    if (savedTotal) setTotalWorkouts(parseInt(savedTotal));
    if (savedPushUps) setTotalPushUps(parseInt(savedPushUps));
  }, []);

  const saveWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now(),
      date: new Date().toISOString()
    };

    const updatedHistory = [newWorkout, ...workoutHistory];
    setWorkoutHistory(updatedHistory);
    setTotalWorkouts(prev => prev + 1);
    setTotalPushUps(prev => prev + workout.pushUps);
    
    // Update streak
    const today = new Date().toDateString();
    const lastWorkout = workoutHistory[0];
    const lastWorkoutDate = lastWorkout ? new Date(lastWorkout.date).toDateString() : null;
    
    if (lastWorkoutDate !== today) {
      setCurrentStreak(prev => prev + 1);
    }

    // Save to localStorage
    localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
    localStorage.setItem('totalWorkouts', (totalWorkouts + 1).toString());
    localStorage.setItem('totalPushUps', (totalPushUps + workout.pushUps).toString());
    localStorage.setItem('currentStreak', (currentStreak + 1).toString());
  };

  const value = {
    workoutHistory,
    currentStreak,
    totalWorkouts,
    totalPushUps,
    saveWorkout
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};