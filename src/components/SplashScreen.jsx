import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Clock, Star } from 'lucide-react';

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-300 flex items-center justify-center">
      <div className="text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 mx-auto bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <Sun className="w-16 h-16 text-orange-600" />
            </motion.div>
            
            {/* Floating stars */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4"
            >
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
            </motion.div>
            
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4"
            >
              <Clock className="w-8 h-8 text-blue-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* App Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Morgen-Routine
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            Deine tägliche Abenteuer-Routine!
          </p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8"
        >
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ 
                  duration: 0.6, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
                className="w-3 h-3 bg-white rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;

