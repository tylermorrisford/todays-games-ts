import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { LeadersCard } from './LeadersCard';
import { leaderCategories, goaltenderCategories } from '../constants';

export const StatsLeaders: React.FunctionComponent = React.memo((): JSX.Element => {
  const playerLeaders = React.useMemo(() => 
    leaderCategories.map((cat: string) => (
      <LeadersCard type="skater" category={cat} key={cat} />
    )), 
    []
  );

  const goalieLeaders = React.useMemo(() => 
    goaltenderCategories.map((cat: string) => (
      <LeadersCard type="goalie" category={cat} key={cat} />
    )), 
    []
  );

  return (
    <>
      <hr />
      <Row>
        <Col sm={12} md={6}>
          <p style={{ fontSize: '1.5em' }}><strong>Player Stat Leaders</strong></p>
          {playerLeaders}
        </Col>
        <Col sm={12} md={6}>
          <p style={{ fontSize: '1.5em' }}><strong>Goaltending Stat Leaders</strong></p>
          {goalieLeaders}
        </Col>
      </Row>
    </>
  );
});
