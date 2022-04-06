import React from 'react'

// generalize this component so it takes a leader category as a prop and renders a top 5 list
// EXAMPLE of the leaders API - will return an empty response without category/season
// https://statsapi.web.nhl.com/api/v1/stats/leaders?leaderCategories=goals&season=20202021.

// GET https://statsapi.web.nhl.com/api/v1/seasons/current --> returns the current season
// also may be helpful to pass as a prop to this component
interface LeaderProps {
    season: string,
    category: string
}

interface ResponseObject {
    [key: string]: any
}

export const Leaders: React.FunctionComponent<LeaderProps> = ({season, category}): JSX.Element => {
    const [leaders, setLeaders] = React.useState([])

    // React.useEffect(() => { // Grab season id on load
    //     fetch('https://statsapi.web.nhl.com/api/v1/seasons/current')
    //         .then(res => res.json())
    //         .then((data: ResponseObject = {}) => {
    //             console.log('current season:', data)
    //             setSeason(data.seasons[0].seasonId)
    //         })
    // }, [])

    React.useEffect(() => {
        if (season !== '') { // if season exists, use it to fetch leaders
            fetch(`https://statsapi.web.nhl.com/api/v1/stats/leaders?leaderCategories=${category}&season=${season}`)
                .then(res => res.json())
                .then((data: ResponseObject = {}) => {
                    console.log(`${category} leaders`, data)
                    setLeaders(data.leagueLeaders[0].leaders)
                })}
    }, [season, category])

    return(
        <>
        {leaders.length > 0 ? <div> <p style={{fontSize: '1.2em'}}><strong>{category} Leaders</strong></p>
            {leaders.map( (leader: any, i: number) => {
                return <p key={i}>{leader.person.fullName}, {leader.team.name} - {leader.value}</p>
            })}</div>
        : <div>Loading leaders...</div>
        }   
        </>
    )
}