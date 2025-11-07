import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Import screens
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';
import RoutineOverview from './components/RoutineOverview';
import TileDetail from './components/TileDetail';
import ParentDashboard from './components/ParentDashboard';

// Import illustrations
import wakeUpImg from './assets/illustrations/wake_up.png';
import brushTeethImg from './assets/illustrations/brush_teeth.png';
import getDressedImg from './assets/illustrations/get_dressed.png';
import eatBreakfastImg from './assets/illustrations/eat_breakfast.png';
import packBackpackImg from './assets/illustrations/pack_backpack.png';
import putOnShoesImg from './assets/illustrations/put_on_shoes.png';
import sayGoodbyeImg from './assets/illustrations/say_goodbye.png';
import washFaceImg from './assets/illustrations/wash_face.png';
import combHairImg from './assets/illustrations/comb_hair.png';
import makeBedImg from './assets/illustrations/make_bed.png';
import bathroomVisitImg from './assets/illustrations/bathroom_visit.png';

// LocalStorage utility functions
const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

const defaultRoutineSteps = [
  { id: 1, title: 'Aufwachen', duration: 300, image: wakeUpImg, completed: false, elapsedTimes: [] },
  { id: 11, title: 'Toilettengang', duration: 120, image: bathroomVisitImg, completed: false, elapsedTimes: [] },
  { id: 2, title: 'Gesicht waschen', duration: 180, image: washFaceImg, completed: false, elapsedTimes: [] },
  { id: 3, title: 'Zähne putzen', duration: 120, image: brushTeethImg, completed: false, elapsedTimes: [] },
  { id: 4, title: 'Haare kämmen', duration: 120, image: combHairImg, completed: false, elapsedTimes: [] },
  { id: 5, title: 'Anziehen', duration: 300, image: getDressedImg, completed: false, elapsedTimes: [] },
  { id: 6, title: 'Bett machen', duration: 180, image: makeBedImg, completed: false, elapsedTimes: [] },
  { id: 7, title: 'Frühstück essen', duration: 900, image: eatBreakfastImg, completed: false, elapsedTimes: [] },
  { id: 8, title: 'Rucksack packen', duration: 240, image: packBackpackImg, completed: false, elapsedTimes: [] },
  { id: 9, title: 'Schuhe anziehen', duration: 180, image: putOnShoesImg, completed: false, elapsedTimes: [] },
  { id: 10, title: 'Verabschieden', duration: 60, image: sayGoodbyeImg, completed: false, elapsedTimes: [] }
];

function AppContent() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(loadFromLocalStorage('onboardingComplete', false));
  const [childName, setChildName] = useState(loadFromLocalStorage('childName', ''));
  const [wakeUpTime, setWakeUpTime] = useState(loadFromLocalStorage('wakeUpTime', '07:00'));
  const [language, setLanguage] = useState(loadFromLocalStorage('language', 'de'));
  const [routineSteps, setRoutineSteps] = useState(loadFromLocalStorage('routineSteps', defaultRoutineSteps));
  const [currentStep, setCurrentStep] = useState(loadFromLocalStorage('currentStep', 0));
  const [points, setPoints] = useState(loadFromLocalStorage('points', 0));
  const [stickers, setStickers] = useState(loadFromLocalStorage('stickers', []));

  useEffect(() => {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const completeOnboarding = (name, time, lang) => {
    setChildName(name);
    setWakeUpTime(time);
    setLanguage(lang);
    setIsOnboarded(true);
    
    // Save to localStorage
    saveToLocalStorage("onboardingComplete", true);
    saveToLocalStorage("childName", name);
    saveToLocalStorage("wakeUpTime", time);
    saveToLocalStorage("language", lang);
    
    // Use navigate to redirect to routine page
    setTimeout(() => {
      navigate('/routine');
    }, 100);
  };

  const updateRoutineSteps = (newSteps) => {
    setRoutineSteps(newSteps);
    saveToLocalStorage('routineSteps', newSteps);
  };

  const completeStep = (stepId, elapsedTime) => {
    const updatedSteps = routineSteps.map(step => 
      step.id === stepId 
        ? { ...step, completed: true, elapsedTimes: [...(step.elapsedTimes || []), elapsedTime] } 
        : step
    );
    
    setRoutineSteps(updatedSteps);
    saveToLocalStorage('routineSteps', updatedSteps);
    
    // Award points
    const newPoints = points + 10;
    setPoints(newPoints);
    saveToLocalStorage('points', newPoints);
    
    // Check if all steps completed for sticker reward
    if (updatedSteps.every(step => step.completed)) {
      const newStickers = [...stickers, Date.now()];
      setStickers(newStickers);
      saveToLocalStorage('stickers', newStickers);
    }
  };

  const updateCurrentStep = (stepIndex) => {
    setCurrentStep(stepIndex);
    saveToLocalStorage('currentStep', stepIndex);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200">
      <Routes>
        <Route 
          path="/" 
          element={
            isOnboarded ? 
              <Navigate to="/routine" replace /> : 
              <Navigate to="/onboarding" replace />
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            <OnboardingScreen 
              onComplete={completeOnboarding}
            />
          } 
        />
        <Route 
          path="/routine" 
          element={
            <RoutineOverview 
              steps={routineSteps}
              childName={childName}
              currentStep={currentStep}
              setCurrentStep={updateCurrentStep}
              onCompleteStep={completeStep}
              points={points}
              stickers={stickers}
            />
          } 
        />
        <Route 
          path="/tile/:stepId" 
          element={
            <TileDetail 
              steps={routineSteps}
              onCompleteStep={completeStep}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ParentDashboard 
              steps={routineSteps}
              onUpdateSteps={updateRoutineSteps}
              childName={childName}
              wakeUpTime={wakeUpTime}
              points={points}
              stickers={stickers}
            />
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

