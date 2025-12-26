import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { LeadersCard } from './LeadersCard';
import { leaderCategories, goaltenderCategories } from '../constants';

export const StatsLeaders: React.FunctionComponent = (): JSX.Element => {
  return (
    <>
      <hr />
      <Row>
        <Col sm={12} md={6}>
          <p style={{ fontSize: '1.5em' }}><strong>Player Stat Leaders</strong></p>
          {leaderCategories.map((cat: string) => {
            return <LeadersCard type="skater" category={cat} key={cat} />
          })}
        </Col>
        <Col sm={12} md={6}>
          <p style={{ fontSize: '1.5em' }}><strong>Goaltending Stat Leaders</strong></p>
          {goaltenderCategories.map((cat: string) => {
            return <LeadersCard type="goalie" category={cat} key={cat} />
          })}
        </Col>
      </Row>
    </>
  );
}
