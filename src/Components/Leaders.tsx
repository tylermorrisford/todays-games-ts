import React from "react";
import Card from "react-bootstrap/Card";
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

  const getShortName = (name: string): string => {
    if (name === "Detroit Red Wings") return "Detroit";
    if (name === "Columbus Blue Jackets") return "Columbus";
    if (name === "Toronto Maple Leafs") return "Toronto";
    if (name === "Vegas Golden Knights") return "Vegas";
    return name.substring(0, name.lastIndexOf(" "));
  };

  const leaderStyle = {
    display: "inline-block",
    width: "365px",
    height: "215px",
    borderRadius: "5px",
    padding: "4px 20px",
    margin: "5px",
    textAlign: "left" as const,
  };

  return (
    <>
      {leaders.length > 0 ? (
        <Card className="shadow" style={leaderStyle}>
          {" "}
          <Card.Header style={{ fontSize: "1.2em", backgroundColor: "white" }}>
            <strong>{category} Leaders &rarr;</strong>
          </Card.Header>
          <Card.Body>
            <table>
              <tbody>
                {leaders.map((leader: any, i: number) => {
                  return (
                    <tr key={i}>
                      <td>
                        {leader.person.fullName},{" "}
                        {getShortName(leader.team.name)}
                      </td>
                      <td>&nbsp; &nbsp;</td>
                      {(category !== "wins" && category !== "hits") && <td>&nbsp; &nbsp;</td>}
                      <td>
                        {category === "shootingPctg"
                          ? Number.parseFloat(leader.value).toFixed(2)
                          : leader.value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card.Body>
        </Card>
      ) : (
        <div>{`Loading ${category} leaders...`}</div>
      )}
    </>
  );
};
