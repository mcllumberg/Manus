import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Settings, 
  BarChart3, 
  Clock, 
  Star, 
  Trophy,
  Edit,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';

const ParentDashboard = ({ 
  steps, 
  onUpdateSteps, 
  childName, 
  wakeUpTime, 
  points, 
  stickers 
}) => {
  const navigate = useNavigate();
  const [editingStep, setEditingStep] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', duration: 0 });

  const completedSteps = steps.filter(step => step.completed).length;
  const totalTime = steps.reduce((sum, step) => sum + step.duration, 0);
  const averageTime = Math.round(totalTime / steps.length);

  const startEdit = (step) => {
    setEditingStep(step.id);
    setEditForm({ title: step.title, duration: step.duration });
  };

  const saveEdit = () => {
    const updatedSteps = steps.map(step => 
      step.id === editingStep 
        ? { ...step, title: editForm.title, duration: editForm.duration }
        : step
    );
    onUpdateSteps(updatedSteps);
    setEditingStep(null);
  };

  const cancelEdit = () => {
    setEditingStep(null);
    setEditForm({ title: '', duration: 0 });
  };

  const deleteStep = (stepId) => {
    const updatedSteps = steps.filter(step => step.id !== stepId);
    onUpdateSteps(updatedSteps);
  };

  const addNewStep = () => {
    const newStep = {
      id: Math.max(...steps.map(s => s.id)) + 1,
      title: 'Neuer Schritt',
      duration: 300,
      image: steps[0].image, // Use first step's image as placeholder
      completed: false
    };
    onUpdateSteps([...steps, newStep]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateAverageTime = (step) => {
    if (!step.elapsedTimes || step.elapsedTimes.length === 0) {
      return null;
    }
    const total = step.elapsedTimes.reduce((sum, time) => sum + time, 0);
    return Math.floor(total / step.elapsedTimes.length);
  };

  const resetAllSteps = () => {
    const resetSteps = steps.map(step => ({ ...step, completed: false, elapsedTimes: [] }));
    onUpdateSteps(resetSteps);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/routine')}
            className="mr-4 bg-white/80"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Eltern-Dashboard</h1>
            <p className="text-gray-600">Verwalte {childName}s Routine</p>
          </div>
        </div>
        
        <Button
          onClick={resetAllSteps}
          variant="outline"
          className="bg-white/80"
        >
          Alle zurücksetzen
        </Button>
      </div>

      <Tabs defaultValue="overview" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Übersicht</span>
          </TabsTrigger>
          <TabsTrigger value="steps" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Schritte</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Statistiken</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Aufstehzeit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{wakeUpTime}</div>
                <p className="text-sm text-gray-600">Geplante Startzeit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Punkte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{points}</div>
                <p className="text-sm text-gray-600">Gesammelte Punkte</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-purple-500" />
                  Sticker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stickers.length}</div>
                <p className="text-sm text-gray-600">Verdiente Sticker</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Heutiger Fortschritt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Abgeschlossene Schritte</span>
                  <Badge variant="secondary">{completedSteps} / {steps.length}</Badge>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedSteps / steps.length) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Gesamtzeit: </span>
                    <span className="font-medium">{formatTime(totalTime)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ø pro Schritt: </span>
                    <span className="font-medium">{formatTime(averageTime)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Steps Management Tab */}
        <TabsContent value="steps" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Routine-Schritte verwalten</h3>
            <Button onClick={addNewStep} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Schritt hinzufügen</span>
            </Button>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card key={step.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-bold text-gray-500">
                        {index + 1}
                      </div>
                      
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1">
                        {editingStep === step.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editForm.title}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                              placeholder="Schritt-Titel"
                            />
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={editForm.duration}
                                onChange={(e) => setEditForm({...editForm, duration: parseInt(e.target.value)})}
                                placeholder="Dauer in Sekunden"
                                className="w-32"
                              />
                              <span className="text-sm text-gray-600">Sekunden</span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-medium">{step.title}</h4>
                            <p className="text-sm text-gray-600">
                              {formatTime(step.duration)} • {step.completed ? 'Erledigt' : 'Ausstehend'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {step.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Erledigt
                        </Badge>
                      )}
                      
                      {editingStep === step.id ? (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={saveEdit}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(step)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => deleteStep(step.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Leistungsübersicht</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Abschlussrate:</span>
                  <span className="font-bold">{Math.round((completedSteps / steps.length) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Gesamtpunkte:</span>
                  <span className="font-bold text-yellow-600">{points}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sticker erhalten:</span>
                  <span className="font-bold text-purple-600">{stickers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Geplante Gesamtzeit:</span>
                  <span className="font-bold">{formatTime(totalTime)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Routine-Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Anzahl Schritte:</span>
                  <span className="font-bold">{steps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kürzester Schritt:</span>
                  <span className="font-bold">{formatTime(Math.min(...steps.map(s => s.duration)))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Längster Schritt:</span>
                  <span className="font-bold">{formatTime(Math.max(...steps.map(s => s.duration)))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durchschnitt:</span>
                  <span className="font-bold">{formatTime(averageTime)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Schritt-für-Schritt Übersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-gray-500">{index + 1}.</span>
                      <span>{step.title}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">{formatTime(step.duration)}</span>
                      {step.completed ? (
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                      ) : (
                        <Badge variant="outline">Ausstehend</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Durchschnittliche Zeiten pro Schritt (Rangliste)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...steps].sort((a, b) => calculateAverageTime(a) - calculateAverageTime(b)).map((step, index) => (
                  calculateAverageTime(step) !== null && (
                    <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-500">{index + 1}.</span>
                        <span>{step.title}</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {formatTime(calculateAverageTime(step))}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentDashboard;

