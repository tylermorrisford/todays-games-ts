import React from 'react'
import dayjs from 'dayjs'

interface ResponseObject {
    [key: string]: any
}

export const TodayGames: React.FunctionComponent = (): JSX.Element => {
    const [games, setGames] = React.useState([])
    const [today, setToday] = React.useState('')

    React.useEffect(() => {
        fetch('https://statsapi.web.nhl.com/api/v1/schedule')
            .then(res => res.json())
            .then((data: ResponseObject = {}) => {
                setGames(data.dates[0].games)
                setToday(dayjs(data.dates[0].date).format('dddd, MMMM D, YYYY'))
            })
    }, [])

    return(
        <>{ Object.keys(games).length > 0 ? 
        <div style={{paddingTop: '35px'}}>
            <p style={{fontSize: '2em'}}><u>Today's NHL games for <strong>{today}</strong></u></p>
            {games.map( (g: any, i:number) => {
                // api response is very, very nested
                let awayTeam = g.teams.away.team.name
                let awayRec = g.teams.away.leagueRecord
                let homeTeam = g.teams.home.team.name
                let homeRec = g.teams.home.leagueRecord
               return <p style={{fontSize: '1.3em'}} key={i}>
                   {awayTeam} ({awayRec.wins}-{awayRec.losses}-{awayRec.ot}) 
                   vs. {homeTeam} ({homeRec.wins}-{homeRec.losses}-{homeRec.ot})
                   </p>
            } )}
        </div>
        : <div>Loading game data...</div>
        }
        </>
    )
}