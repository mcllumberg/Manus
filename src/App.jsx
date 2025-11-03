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



const defaultRoutineSteps = [
  { id: 1, title: 'Aufwachen', duration: 300, image: wakeUpImg, completed: false },
  { id: 11, title: 'Toilettengang', duration: 120, image: bathroomVisitImg, completed: false },
  { id: 2, title: 'Gesicht waschen', duration: 180, image: washFaceImg, completed: false },
  { id: 3, title: 'Zähne putzen', duration: 120, image: brushTeethImg, completed: false },
  { id: 4, title: 'Haare kämmen', duration: 120, image: combHairImg, completed: false },
  { id: 5, title: 'Anziehen', duration: 300, image: getDressedImg, completed: false },
  { id: 6, title: 'Bett machen', duration: 180, image: makeBedImg, completed: false },
  { id: 7, title: 'Frühstück essen', duration: 900, image: eatBreakfastImg, completed: false },
  { id: 8, title: 'Rucksack packen', duration: 240, image: packBackpackImg, completed: false },
  { id: 9, title: 'Schuhe anziehen', duration: 180, image: putOnShoesImg, completed: false },
  { id: 10, title: 'Verabschieden', duration: 60, image: sayGoodbyeImg, completed: false }
];

function AppContent() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [childName, setChildName] = useState('');
  const [wakeUpTime, setWakeUpTime] = useState('07:00');
  const [language, setLanguage] = useState('de');
  const [routineSteps, setRoutineSteps] = useState(defaultRoutineSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [points, setPoints] = useState(0);
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    const savedChildName = localStorage.getItem('childName');
    const savedWakeUpTime = localStorage.getItem('wakeUpTime');
    const savedLanguage = localStorage.getItem('language');

    if (onboardingComplete === 'true') {
      setIsOnboarded(true);
      setChildName(savedChildName || '');
      setWakeUpTime(savedWakeUpTime || '07:00');
      setLanguage(savedLanguage || 'de');
    }

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
    localStorage.setItem("onboardingComplete", "true");
    localStorage.setItem("childName", name);
    localStorage.setItem("wakeUpTime", time);
    localStorage.setItem("language", lang);
    setIsOnboarded(true);
    
    // Use navigate to redirect to routine page
    setTimeout(() => {
      navigate('/routine');
    }, 100);
  };

  const updateRoutineSteps = (newSteps) => {
    setRoutineSteps(newSteps);
  };

  const completeStep = (stepId, elapsedTime) => {
    setRoutineSteps(prev => 
      prev.map(step => 
        step.id === stepId 
          ? { ...step, completed: true, elapsedTimes: [...(step.elapsedTimes || []), elapsedTime] } 
          : step
      )
    );
    
    // Award points
    setPoints(prev => prev + 10);
    
    // Check if all steps completed for sticker reward
    const updatedSteps = routineSteps.map(step => 
      step.id === stepId 
        ? { ...step, completed: true, elapsedTimes: [...(step.elapsedTimes || []), elapsedTime] } 
        : step
    );
    
    if (updatedSteps.every(step => step.completed)) {
      setStickers(prev => [...prev, Date.now()]);
    }
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
              setCurrentStep={setCurrentStep}
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

