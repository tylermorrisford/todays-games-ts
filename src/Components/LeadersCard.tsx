import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Leader, LeaderProps } from '../types';
import { getEndpoint, capitalize } from '../Utils/helpers';

// EXAMPLE of the leaders API - needs category name
//https://api-web.nhle.com/v1/skater-stats-leaders/current?categories=goals&limit=5

export const LeadersCard: React.FunctionComponent<LeaderProps> = ({
  category,
  type,
}): JSX.Element => {
  const [leaders, setLeaders] = React.useState<Leader[]>([]);

    fetch(getEndpoint(`/api/${type}-leaders`), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category }),
          }).then((res) => res.json())
          .then((data: any) => {
              setLeaders(data[`${category}`]);
          })
          .catch((err) => console.log(`leaders component (${category}) error: `, err));


  const leaderStyle = {
    display: 'inline-block',
    width: '365px',
    height: '215px',
    borderRadius: '5px',
    padding: '4px 5px',
    margin: '5px',
    textAlign: 'left' as const,
  };

  // conditional style for top in each category
  const topLeaderStyle = {
    fontWeight: '600' as const,
  };

  const columnStyle = {
    paddingRight: 0,
  };
  
  return (
    <>
      {leaders.length ? (
        <Card className='shadow' style={leaderStyle}>
          {' '}
          <Card.Header style={{ fontSize: '1.2em', backgroundColor: 'white' }}>
            <strong>{capitalize(category)}</strong>
          </Card.Header>
          <Card.Body>
            {leaders.map((leader: any, i: number) => {
              const style =
                i === 0 ? { ...topLeaderStyle, ...columnStyle } : columnStyle;
              return (
                <Row key={leader.lastName.default}>
                  <Col xs={9} sm={8} md={9} style={style}>
                    {leader.firstName.default} {leader.lastName.default}, {leader.teamName.default}
                  </Col>
                  <Col xs={3} sm={4} md={3} style={style}>
                    {leader.value}
                  </Col>
                </Row>
              );
            })}
          </Card.Body>
        </Card>
      ) : (
        <div>{`Loading ${category} leaders...`}</div>
      )}
    </>
  );
};
