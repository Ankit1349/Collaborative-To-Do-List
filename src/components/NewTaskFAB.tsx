import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface NewTaskFABProps {
  onClick: () => void;
  showTooltip?: boolean;
}

export const NewTaskFAB: React.FC<NewTaskFABProps> = ({ onClick, showTooltip = true }) => {
  // Handle keyboard shortcut (Alt+N) to create a new task
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+N shortcut for new task
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        onClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute bottom-full right-0 mb-2 w-48 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-white shadow-lg"
          >
            <div className="mb-1">Press Alt+N for new task</div>
            <div className="text-gray-300">Add #high for priority</div>
            <div className="text-gray-300">Select team member to assign</div>
            <div className="absolute right-4 top-full h-2 w-2 -translate-y-1 rotate-45 bg-zinc-800"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <Button
          onClick={onClick}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-lg hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
};
