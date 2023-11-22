import React from 'react';
import './App.css';
import { Leaders } from './Components/Leaders';
import { TodayGames } from './Components/TodayGames';
import { Standings } from './Components/Standings'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { teefDev, leaderCategories, goaltenderCategories } from './constants'

export default function App() {

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
      {/* <Row>
        <h2 className='text-center'><strong>Stats Leaders</strong></h2>
        <Col sm={12} md={8}>
      <p style={{fontSize: '1.5em'}}><em><strong>Players</strong></em></p>
      {/* {leaderCategories.map((cat: string) => {
        return <Leaders season={season} category={cat} key={cat} />
      })} */}
        {/* </Col>
        <Col sm={12} md={4}>
        <p style={{fontSize: '1.5em'}}><em><strong>Goaltenders</strong></em></p> */}
          {/* {goaltenderCategories.map((cat: string) => {
            return <Leaders season={season} category={cat} key={cat} />
          })} */}
        {/* </Col>
      </Row> */}
      <Row>
        <Col className="mt-3 mb-5" sm={12} md={{span: 6, offset: 3}}>
          <hr />
          <small>Info about the developer is <a href={teefDev}>here</a>.</small>
        </Col>
      </Row>
    </Container>
  );
}


