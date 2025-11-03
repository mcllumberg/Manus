import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Star,
  Trophy,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoutineOverview = ({ 
  steps, 
  childName, 
  currentStep, 
  setCurrentStep, 
  onCompleteStep, 
  points, 
  stickers 
}) => {
  const navigate = useNavigate();
  const [activeStepIndex, setActiveStepIndex] = useState(currentStep);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTimeLeft(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, startTime]);

  const startTimer = () => {
    if (!currentStepData.completed) {
      setStartTime(Date.now());
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeLeft(0);
    setStartTime(null);
    setIsRunning(false);
  };

  const handleCompleteStep = () => {
    const currentStepData = steps[activeStepIndex];
    if (!currentStepData.completed) {
      const finalElapsedTime = timeLeft; // Use the current timeLeft as final elapsed time
      onCompleteStep(currentStepData.id, finalElapsedTime);
      setIsRunning(false);
      setTimeLeft(0); // Reset for next step
      setStartTime(null);
      
      // Move to next uncompleted step
      const nextUncompletedIndex = steps.findIndex((step, index) => 
        index > activeStepIndex && !step.completed
      );
      
      if (nextUncompletedIndex !== -1) {
        setActiveStepIndex(nextUncompletedIndex);
        setCurrentStep(nextUncompletedIndex);
      }
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const goToStep = (index) => {
    setActiveStepIndex(index);
    setCurrentStep(index);
    resetTimer(index);
  };

  const nextStep = () => {
    if (activeStepIndex < steps.length - 1) {
      goToStep(activeStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (activeStepIndex > 0) {
      goToStep(activeStepIndex - 1);
    }
  };

  const currentStepData = steps[activeStepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Guten Morgen, {childName}! 🌅
          </h1>
          <p className="text-gray-600">Lass uns den Tag beginnen!</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/80 rounded-full px-3 py-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-yellow-600">{points}</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white/80 rounded-full px-3 py-1">
            <Trophy className="w-4 h-4 text-purple-500" />
            <span className="font-bold text-purple-600">{stickers.length}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="bg-white/80"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="white"
              strokeWidth="8"
              fill="transparent"
              opacity="0.3"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - progressPercentage / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - progressPercentage / 100) }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {completedSteps}/{steps.length}
              </div>
              <div className="text-sm text-gray-600">Schritte</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card Carousel */}
      <div className="relative mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStepIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mx-auto max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
              <CardContent className="p-6 text-center">
                {/* Step Image */}
                <div className="relative mb-6">
                  <motion.img
                    src={currentStepData.image}
                    alt={currentStepData.title}
                    className="w-48 h-48 mx-auto rounded-2xl object-cover shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                  
                  {currentStepData.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-2xl">✓</span>
                    </motion.div>
                  )}
                </div>

                {/* Step Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {currentStepData.title}
                </h2>

                {/* Timer Display */}
                <div className="mb-6">
                  <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  
                  {/* Progress bar based on elapsed time, max 60 seconds for visual */}
                  <Progress 
                    value={Math.min(100, (timeLeft / 60000) * 100)} 
                    className="h-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Verstrichene Zeit
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-3 mb-4">
                  {!currentStepData.completed && (
                    <>
                      <Button
                        onClick={() => isRunning ? pauseTimer() : startTimer(activeStepIndex)}
                        size="lg"
                        className="h-12 px-6"
                      >
                        {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                        {isRunning ? 'Pause' : 'Start'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => resetTimer(activeStepIndex)}
                        size="lg"
                        className="h-12 px-6"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Reset
                      </Button>
                    </>
                  )}
                  
                  <Button
                    onClick={handleCompleteStep}
                    disabled={currentStepData.completed}
                    variant={currentStepData.completed ? "secondary" : "default"}
                    size="lg"
                    className="h-12 px-6"
                  >
                    {currentStepData.completed ? 'Erledigt! ✓' : 'Fertig!'}
                  </Button>
                </div>

                {/* Step Counter */}
                <Badge variant="secondary" className="text-sm">
                  Schritt {activeStepIndex + 1} von {steps.length}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          onClick={prevStep}
          disabled={activeStepIndex === 0}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={nextStep}
          disabled={activeStepIndex === steps.length - 1}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center space-x-2 mb-6">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => goToStep(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === activeStepIndex
                ? 'bg-blue-500 scale-125'
                : step.completed
                ? 'bg-green-500'
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Completion Message */}
      {completedSteps === steps.length && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto bg-gradient-to-r from-green-400 to-blue-500 text-white border-0">
            <CardContent className="p-6">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold mb-2">Fantastisch, {childName}!</h3>
              <p>Du hast alle Schritte geschafft! Du bekommst einen Sticker! ⭐</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default RoutineOverview;

