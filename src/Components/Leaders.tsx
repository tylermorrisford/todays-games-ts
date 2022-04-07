import React from 'react'

// EXAMPLE of the leaders API - will return an empty response without category/season
// https://statsapi.web.nhl.com/api/v1/stats/leaders?leaderCategories=goals&season=20202021.

interface LeaderProps {
    season: string,
    category: string
}

interface ResponseObject {
    [key: string]: any
}

export const Leaders: React.FunctionComponent<LeaderProps> = ({season, category}): JSX.Element => {
    const [leaders, setLeaders] = React.useState([])

    React.useEffect(() => {
        if (season !== '') { // if season exists, use it to fetch leaders
            fetch(`https://statsapi.web.nhl.com/api/v1/stats/leaders?leaderCategories=${category}&season=${season}`)
                .then(res => res.json())
                .then((data: ResponseObject = {}) => {
                    console.log(`${category} leaders`, data)
                    setLeaders(data.leagueLeaders[0].leaders)
                })}
    }, [season, category])

    const leaderStyle = {
        display: 'inline-block',
        border: '1px solid grey', 
        width: '365px',
        height: '215px',
        borderRadius: '5px',
        padding: '4px 20px',
        margin: '5px',
        textAlign: "left" as const
    }

    return(
        <>
        {leaders.length > 0 ? <div style={leaderStyle}> <p style={{fontSize: '1.2em'}}><strong>{category} Leaders &rarr;</strong></p>
            <table>
            {leaders.map( (leader: any, i: number) => {
                return <tr key={i}><td>{leader.person.fullName}, {leader.team.name}</td>&nbsp;{" "}&nbsp;<td>{leader.value}</td></tr>
            })}
            </table>
            </div>
        : <div>Loading leaders...</div>
        }   
        </>
    )
}