interface StreakCounterProps {
  current: number;
  highest: number;
}

export const StreakCounter = ({ current, highest }: StreakCounterProps) => {
  return (
    <div className="flex items-center justify-center gap-6 mb-6">
      <div className="text-center">
        <p className="text-sm text-gray-500">Current Streak</p>
        <p className="text-3xl font-bold text-indigo-600">{current}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Highest Streak</p>
        <p className="text-3xl font-bold text-purple-600">{highest}</p>
      </div>
    </div>
  );
};