import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Heart, Clock, Globe } from 'lucide-react';

const OnboardingScreen = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState('de');
  const [childName, setChildName] = useState('');
  const [wakeUpTime, setWakeUpTime] = useState('07:00');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(childName, wakeUpTime, language);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return language !== '';
      case 2: return childName.trim() !== '';
      case 3: return wakeUpTime !== '';
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mx-auto mb-4"
            >
              {step === 1 && <Globe className="w-16 h-16 text-blue-500" />}
              {step === 2 && <Heart className="w-16 h-16 text-pink-500" />}
              {step === 3 && <Clock className="w-16 h-16 text-green-500" />}
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {step === 1 && 'Willkommen!'}
              {step === 2 && 'Wie heißt du?'}
              {step === 3 && 'Wann stehst du auf?'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Language Selection */}
            {step === 1 && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-4"
              >
                <Label className="text-lg font-medium">Wähle deine Sprache:</Label>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant={language === 'de' ? 'default' : 'outline'}
                    onClick={() => setLanguage('de')}
                    className="h-12 text-lg"
                  >
                    🇩🇪 Deutsch
                  </Button>
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    onClick={() => setLanguage('en')}
                    className="h-12 text-lg"
                  >
                    🇺🇸 English
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Child Name */}
            {step === 2 && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-4"
              >
                <Label htmlFor="childName" className="text-lg font-medium">
                  Wie heißt du, kleiner Held?
                </Label>
                <Input
                  id="childName"
                  type="text"
                  placeholder="Dein Name..."
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="h-12 text-lg text-center"
                  autoFocus
                />
                {childName && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-lg text-green-600 font-medium"
                  >
                    Hallo {childName}! 👋
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* Step 3: Wake Up Time */}
            {step === 3 && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-4"
              >
                <Label htmlFor="wakeUpTime" className="text-lg font-medium">
                  Wann stehst du normalerweise auf?
                </Label>
                <Input
                  id="wakeUpTime"
                  type="time"
                  value={wakeUpTime}
                  onChange={(e) => setWakeUpTime(e.target.value)}
                  className="h-12 text-lg text-center"
                />
                <p className="text-center text-gray-600">
                  Perfekt! Wir helfen dir dabei, pünktlich fertig zu werden.
                </p>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
                className="h-12 px-6"
              >
                Zurück
              </Button>
              
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === step ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="h-12 px-6"
              >
                {step === 3 ? 'Los geht\'s!' : 'Weiter'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingScreen;

