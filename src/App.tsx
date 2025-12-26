import './App.css';
import { TodayGames } from './Components/TodayGames';
import { Standings } from './Components/Standings';
import { StatsLeaders } from './Components/StatsLeaders';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { teefDev } from './constants';

export default function App() {

  return (

    <Container>
      <Row className="mt-3">
        <Col sm={12} md={4}>
          <TodayGames />
        </Col>
        <Col sm={12} md={{ span: 6, offset: 1 }} className="mt-3">
          <Standings />
        </Col>
      </Row>
      <StatsLeaders />
      <Row>
        <Col className="mt-3 mb-5" sm={12} md={{ span: 6, offset: 3 }}>
          <hr />
          <small>Info about the developer is <a href={teefDev}>here</a>.</small>
        </Col>
      </Row>
    </Container>
  );
}


