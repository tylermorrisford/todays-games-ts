import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import trimName from "../Utils/trim";
// EXAMPLE of the leaders API - will return an empty response without category/season
// https://statsapi.web.nhl.com/api/v1/stats/leaders?leaderCategories=goals&season=20202021.

interface LeaderProps {
  season: string;
  category: string;
}

interface ResponseObject {
  [key: string]: any;
}

export const Leaders: React.FunctionComponent<LeaderProps> = ({
  season,
  category,
}): JSX.Element => {
  const [leaders, setLeaders] = React.useState([]);

  React.useEffect(() => {
    if (season !== "") {
      // if season exists, use it to fetch leaders
      fetch(
        `https://statsapi.web.nhl.com/api/v1/stats/leaders?leaderCategories=${category}&season=${season}`
      )
        .then((res) => res.json())
        .then((data: ResponseObject = {}) => {
          console.log(`${category} leaders`, data);
          setLeaders(data.leagueLeaders[0].leaders);
        });
    }
  }, [season, category]);

  const leaderStyle = {
    display: "inline-block",
    width: "365px",
    height: "215px",
    borderRadius: "5px",
    padding: "4px 5px",
    margin: "5px",
    textAlign: "left" as const,
  };

  const columnStyle = {
    paddingRight: 0
  }

  return (
    <>
      {leaders.length > 0 ? (
        <Card className="shadow" style={leaderStyle}>
          {" "}
          <Card.Header style={{ fontSize: "1.2em", backgroundColor: "white" }}>
            <strong>{category} Leaders</strong>
          </Card.Header>
          <Card.Body>
                {leaders.map((leader: any, i: number) => {
                  return (
                    <Row key={i}>
                      <Col xs={9} sm={8} md={9} style={columnStyle}>
                        {leader.person.fullName},{" "}
                        {trimName(leader.team.name)}
                      </Col>
                      <Col xs={3} sm={4} md={3} style={columnStyle}>
                        {category === "shootingPctg"
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
