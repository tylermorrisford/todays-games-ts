import React from 'react';
import './App.css';
import { Leaders } from './Components/Leaders';
import { TodayGames } from './Components/TodayGames';

interface ResponseObject {
  [key: string]: any
}

export default function App() {

  const [season, setSeason] = React.useState('')

  const leaderCategories: Array<string> = ['goals', 'assists', 'points', 'shots', 'timeOnIcePerGame', 'faceOffPct', 'plusMinus', 'shootingPctg', 'hits', 'penaltyMinutes']
  const goaltenderCategories: Array<string> = ['wins', 'gaa', 'shutouts', 'savePct', 'losses', 'otLosses']

  React.useEffect(() => { // Grab season id on load
    fetch('https://statsapi.web.nhl.com/api/v1/seasons/current')
        .then(res => res.json())
        .then((data: ResponseObject = {}) => {
            console.log('current season:', data)
            setSeason(data.seasons[0].seasonId)
        })
}, [])

  return (
    <div className="App">
      <TodayGames />
      <hr />
      <p style={{fontSize: '1.5em'}}><em><strong>Player Leaders</strong></em></p>
      {leaderCategories.map((cat: string, i: number) => {
        return <>
          <Leaders season={season} category={cat} key={cat} />
          {i === leaderCategories.length - 1 ? '' : <hr style={{width: '30%'}} />}
        </>
      })}
      <hr />
      <p style={{fontSize: '1.5em'}}><em><strong>Goaltender Leaders</strong></em></p>
      {goaltenderCategories.map((cat: string) => {
        return <>
          <Leaders season={season} category={cat} key={cat} />
          <hr style={{width: '30%'}} />
        </>
      })}
    </div>
  );
}


