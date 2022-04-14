import React from 'react'
import dayjs from 'dayjs'
import Card from 'react-bootstrap/Card'

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
                console.log('GAMES', data.dates[0].games);
                console.log('FULL RES OBJECT', data);
                setGames(data.dates[0].games)
                setToday(dayjs(data.dates[0].date).format('dddd, MMMM D, YYYY'))
            })
    }, [])
 
    return(
        <>{ Object.keys(games).length > 0 ? 
        <div>
            <p style={{fontSize: '2em'}}>Today's NHL games, <strong>{today}</strong></p>
            {games.map( (g: any, i:number) => {
                // api response is very, very nested
                let awayTeam: string = g.teams.away.team.name
                let awayRec = g.teams.away.leagueRecord
                let aScore: number = g.teams.away.score
                let hScore: number = g.teams.home.score
                let homeTeam: string = g.teams.home.team.name
                let homeRec = g.teams.home.leagueRecord
                let gameState: string = g.status.abstractGameState
               return <Card className="mt-2 p-2" style={{fontSize: '1.3em'}} key={i}>
                    <span style={{color:aScore>hScore ? 'green' : aScore<hScore ? 'grey' : 'black'}}>
                       {awayTeam} {(gameState === "Live" || gameState === "Final") ?  <>{aScore}</> 
                       : <>({awayRec.wins}-{awayRec.losses}-{awayRec.ot})</>} 
                    </span>
                   {/* {" "}<small>vs.</small>{" "}  */}
                    <span style={{color:hScore>aScore ? 'green' : hScore<aScore ? 'grey' : 'black'}}>
                        {homeTeam} {(gameState === "Live" || gameState === "Final") ? 
                        <>{hScore}<span style={{float: 'right', color: gameState === 'Live' ? 'green' : 'black'}}>{gameState}</span></> 
                        : <>({homeRec.wins}-{homeRec.losses}-{homeRec.ot})</>}</span>
                   </Card>
            } )}
        </div>
        : <div>Loading game data...</div>
        }
        </>
    )
}