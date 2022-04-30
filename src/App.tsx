import React from 'react';
import './App.css';
import { Leaders } from './Components/Leaders';
import { TodayGames } from './Components/TodayGames';
import { Standings } from './Components/Standings'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

interface ResponseObject {
  [key: string]: any
}

export default function App() {

  const [season, setSeason] = React.useState('')
  const [copyright, setCopyright] = React.useState('')

  const leaderCategories: Array<string> = ['goals', 'assists', 'points', 'shots', 'timeOnIcePerGame', 'faceOffPct', 'plusMinus', 'shootingPctg', 'hits', 'penaltyMinutes']
  const goaltenderCategories: Array<string> = ['wins', 'gaa', 'shutouts', 'savePct', 'losses', 'otLosses']

  React.useEffect(() => { // Grab season id on load
    fetch('https://statsapi.web.nhl.com/api/v1/seasons/current')
        .then(res => res.json())
        .then((data: ResponseObject = {}) => {
            console.log('current season:', data)
            setSeason(data.seasons[0].seasonId)
            setCopyright(data.copyright)
        })
}, [])

  return (

    <Container>
      <Row className="mt-3">
        <Col sm={12} md={4}>
          <TodayGames />
        </Col>
        <Col sm={12} md={{span: 6, offset: 1}} className="mt-3">
          <Standings />
        </Col>
      </Row>
      <hr />
      <Row>
        <h2 className='text-center'><strong>Stats Leaders</strong></h2>
        <Col sm={12} md={8}>
      <p style={{fontSize: '1.5em'}}><em><strong>Players</strong></em></p>
      {leaderCategories.map((cat: string, i: number) => {
        return <Leaders season={season} category={cat} key={cat} />
      })}
        </Col>
        <Col sm={12} md={4}>
        <p style={{fontSize: '1.5em'}}><em><strong>Goaltenders</strong></em></p>
          {goaltenderCategories.map((cat: string) => {
            return <Leaders season={season} category={cat} key={cat} />
          })}
        </Col>
      </Row>
      <Row>
        <Col className="mt-3" sm={12} md={{span: 6, offset: 3}}>
        <small>{copyright}</small>
        </Col>
      </Row>
    </Container>
  );
}


