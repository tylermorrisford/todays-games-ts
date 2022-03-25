import React from 'react';
import './App.css';
import { GoalLeaders } from './Components/GoalLeaders';
import { TodayGames } from './Components/TodayGames';

export default function App() {
  return (
    <div className="App">
      <TodayGames />
      <hr />
      <GoalLeaders />
    </div>
  );
}


