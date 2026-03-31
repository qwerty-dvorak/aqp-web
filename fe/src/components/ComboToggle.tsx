'use client';

import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

interface ComboToggleProps {
  accuracy: number;
  onAccuracyChange: (value: number) => void;
}

export function ComboToggle({ accuracy, onAccuracyChange }: ComboToggleProps) {
  const animatedValue = useCountUp(accuracy, 600, true);

  const handleDecrement = () => {
    onAccuracyChange(Math.max(50, accuracy - 5));
  };

  const handleIncrement = () => {
    onAccuracyChange(Math.min(100, accuracy + 5));
  };

  return (
    <div className="bg-bg-panel rounded-panel p-5">
      <div className="mb-3 px-2">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Combo Toggle
        </h2>
        <p className="text-[10px] text-text-muted uppercase tracking-widest">
          Toggle Between Accuracy
        </p>
      </div>

      <div className="bg-black rounded-inner p-6 flex flex-col items-center gap-4">
        {/* Large number display */}
        <motion.div
          key={accuracy}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, type: 'spring' }}
          className="text-8xl font-black text-white tabular-nums leading-none"
        >
          {animatedValue}
        </motion.div>

        {/* Controls row */}
        <div className="flex items-center gap-4 w-full justify-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDecrement}
            className="w-12 h-12 rounded-card bg-purple-vivid flex items-center justify-center text-white text-2xl font-bold hover:bg-purple-light transition-colors"
          >
            −
          </motion.button>

          <span className="text-sm font-bold text-white uppercase tracking-widest">
            Accuracy
          </span>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleIncrement}
            className="w-12 h-12 rounded-card bg-orange-vivid flex items-center justify-center text-white text-2xl font-bold hover:bg-orange-bright transition-colors"
          >
            +
          </motion.button>
        </div>
      </div>
    </div>
  );
}
