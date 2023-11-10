import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Leader, LeaderResponse, LeaderProps } from '../types';
import trimName from '../Utils/trim';
// EXAMPLE of the leaders API - will return an empty response without category/season
// https://statsapi.web.nhl.com/api/v1/stats/leaders?leaderCategories=goals&season=20202021.

export const Leaders: React.FunctionComponent<LeaderProps> = ({
  season,
  category,
}): JSX.Element => {
  const [leaders, setLeaders] = React.useState<Leader[]>([]);

  React.useEffect(() => {
    if (season) {
      fetch(
        `https://statsapi.web.nhl.com/api/v1/stats/leaders?leaderCategories=${category}&season=${season}`
      )
        .then((res) => res.json())
        .then((data: LeaderResponse) => {
          // console.log(`${category} leaders`, data);
          setLeaders(data.leagueLeaders[0].leaders);
        });
    }
  }, [season, category]);

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
            <strong>{category} Leaders</strong>
          </Card.Header>
          <Card.Body>
            {leaders.map((leader: Leader, i: number) => {
              const style =
                i === 0 ? { ...topLeaderStyle, ...columnStyle } : columnStyle;
              return (
                <Row key={leader.person.fullName}>
                  <Col xs={9} sm={8} md={9} style={style}>
                    {leader.person.fullName}, {trimName(leader.team.name)}
                  </Col>
                  <Col xs={3} sm={4} md={3} style={columnStyle}>
                    {category === 'shootingPctg'
                      ? Number.parseFloat(leader.value).toFixed(2)
                      : leader.value}
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
