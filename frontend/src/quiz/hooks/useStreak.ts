import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useStreak = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);

  useEffect(() => {
    // Load from cookies or localStorage
    const savedHighest = Cookies.get('highestStreak');
    if (savedHighest) {
      setHighestStreak(parseInt(savedHighest, 10));
    }
  }, []);

  const incrementStreak = () => {
    const newStreak = currentStreak + 1;
    setCurrentStreak(newStreak);
    
    if (newStreak > highestStreak) {
      setHighestStreak(newStreak);
      Cookies.set('highestStreak', newStreak.toString(), { expires: 365 });
    }
  };

  const resetStreak = () => {
    setCurrentStreak(0);
  };

  return { currentStreak, highestStreak, incrementStreak, resetStreak };
};