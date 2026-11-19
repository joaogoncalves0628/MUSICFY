import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('home');

  if (activeScreen === 'explore') {
    return <ExploreScreen onHomePress={() => setActiveScreen('home')} />;
  }

  return <HomeScreen onExplorePress={() => setActiveScreen('explore')} />;
}