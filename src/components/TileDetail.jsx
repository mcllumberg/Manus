import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowLeft, Play, Pause, RotateCcw, Check } from 'lucide-react';

const TileDetail = ({ steps, onCompleteStep }) => {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const step = steps.find(s => s.id === parseInt(stepId));

  useEffect(() => {
    if (step) {
      setTimeLeft(step.duration);
    }
  }, [step]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, timeLeft]);

  if (!step) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p>Schritt nicht gefunden!</p>
            <Button onClick={() => navigate('/routine')} className="mt-4">
              Zurück zur Übersicht
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const startTimer = () => {
    if (!step.completed) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeLeft(step.duration);
    setIsRunning(false);
  };

  const handleComplete = () => {
    if (!step.completed) {
      onCompleteStep(step.id);
      setIsRunning(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/routine')}
          className="mr-4 bg-white/80"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Schritt Details</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
            <CardContent className="p-8 text-center">
              {/* Large Image */}
              <div className="relative mb-8">
                <motion.img
                  src={step.image}
                  alt={step.title}
                  className="w-64 h-64 mx-auto rounded-3xl object-cover shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                
                {step.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-8 h-8 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {step.title}
              </h2>

              {/* Timer Section */}
              <div className="mb-8">
                <div className="text-6xl font-mono font-bold text-blue-600 mb-4">
                  {formatTime(timeLeft)}
                </div>
                
                {timeLeft < step.duration && (
                  <Progress 
                    value={(1 - timeLeft / step.duration) * 100} 
                    className="h-3 mb-4"
                  />
                )}
                
                <p className="text-gray-600">
                  Geplante Zeit: {formatTime(step.duration)}
                </p>
              </div>

              {/* Control Buttons */}
              <div className="space-y-4">
                {!step.completed && (
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={isRunning ? pauseTimer : startTimer}
                      size="lg"
                      className="h-14 px-8 text-lg"
                    >
                      {isRunning ? (
                        <>
                          <Pause className="w-6 h-6 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-6 h-6 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={resetTimer}
                      size="lg"
                      className="h-14 px-8 text-lg"
                    >
                      <RotateCcw className="w-6 h-6 mr-2" />
                      Reset
                    </Button>
                  </div>
                )}
                
                <Button
                  onClick={handleComplete}
                  disabled={step.completed}
                  variant={step.completed ? "secondary" : "default"}
                  size="lg"
                  className="w-full h-14 text-lg"
                >
                  {step.completed ? (
                    <>
                      <Check className="w-6 h-6 mr-2" />
                      Bereits erledigt!
                    </>
                  ) : (
                    'Schritt abschließen'
                  )}
                </Button>
              </div>

              {/* Motivational Message */}
              {!step.completed && (
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-6 p-4 bg-yellow-100 rounded-xl"
                >
                  <p className="text-yellow-800 font-medium">
                    Du schaffst das! 💪 Nimm dir die Zeit, die du brauchst.
                  </p>
                </motion.div>
              )}

              {step.completed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-100 rounded-xl"
                >
                  <p className="text-green-800 font-medium">
                    Super gemacht! 🎉 Du hast diesen Schritt erfolgreich abgeschlossen.
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TileDetail;

