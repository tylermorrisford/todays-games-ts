import React from 'react'

// generalize this component so it takes a leader category as a prop and renders a top 5 list
// EXAMPLE of the leaders API - will return an empty response without category/season
// https://statsapi.web.nhl.com/api/v1/stats/leaders?leaderCategories=goals&season=20202021.

// GET https://statsapi.web.nhl.com/api/v1/seasons/current --> returns the current season
// also may be helpful to pass as a prop to this component

interface ResponseObject {
    [key: string]: any
}

export const GoalLeaders: React.FunctionComponent = (): JSX.Element => {
    const [leaders, setLeaders] = React.useState([])
    const [season, setSeason] = React.useState('')

    React.useEffect(() => { // Grab season id on load
        fetch('https://statsapi.web.nhl.com/api/v1/seasons/current')
            .then(res => res.json())
            .then((data: ResponseObject = {}) => {
                console.log('current season:', data)
                setSeason(data.seasons[0].seasonId)
            })
    }, [])

    React.useEffect(() => {
        if (season !== '') {
            fetch(`https://statsapi.web.nhl.com/api/v1/stats/leaders?leaderCategories=goals&season=${season}`)
                .then(res => res.json())
                .then(data => {
                    console.log('goal leaders', data)
                    setLeaders(data.leagueLeaders[0].leaders)
                })
        }
    }, [season])



    return(
        <>
        {leaders.length > 0 ? <div> Goal Leaders
            {leaders.map( (leader: any, i: number) => {
                return <p key={i}>{leader.person.fullName}, {leader.team.name} - {leader.value}</p>
            })}</div>
        : <div>Loading leaders...</div>
        }   
        </>
    )
}