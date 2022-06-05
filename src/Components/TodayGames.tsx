import React from 'react'
import dayjs from 'dayjs'
import Card from 'react-bootstrap/Card'
import NHLLogo from '../Assets/NHL_Logo_former.svg'
import { GameStatus } from './GameStatus'

interface ResponseObject {
    [key: string]: any
}

export const TodayGames: React.FunctionComponent = (): JSX.Element => {
    const [games, setGames] = React.useState([])
    const [today, setToday] = React.useState('')
    const [noGames, setNoGames] = React.useState(false);

    React.useEffect(() => {
        const searchToday: string = dayjs().format('YYYY-MM-DD')
        fetch(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${searchToday}`)
            .then(res => res.json())
            .then((data: ResponseObject = {}) => {
                if (data.totalGames === 0) {return setNoGames(true)}
                console.log('GAMES', data.dates[0].games);
                console.log('FULL RES OBJECT', data);
                setGames(data.dates[0].games)
                setToday(dayjs(data.dates[0].date).format('dddd, MMMM D, YYYY'))
            })
    }, [])
 
    return(
        <div>
            <p style={{fontSize: '2em', marginBottom: 0}}><img src={NHLLogo} width="45px" height="45px" alt="NHL Logo"/>
                {" "}<strong>{today ? today : dayjs().format('dddd, MMMM D, YYYY')}</strong>
            </p>
            <p className="text-center"><small style={{color: 'grey'}}>Today in the NHL - a dashboard for nerds</small></p>
            <>{noGames ? <p>No games scheduled :/</p> : Object.keys(games).length > 0 ? 
            games.map( (g: any, i:number) => {
                // api response is very, very nested
                let awayTeam: string = g.teams.away.team.name
                let awayRec = g.teams.away.leagueRecord
                let aScore: number = g.teams.away.score
                let hScore: number = g.teams.home.score
                let homeTeam: string = g.teams.home.team.name
                let homeRec = g.teams.home.leagueRecord
                let gameState: string = g.status.abstractGameState
                console.log('gameState:', gameState)
                // TODO: access all of this data from the linescore endpoint
               return <Card className="shadow-sm mt-2 p-2" style={{fontSize: '1.3em'}} key={i}>
                    <span style={{color:aScore>hScore ? 'green' : aScore<hScore ? 'grey' : 'black'}}>
                       {awayTeam} {(gameState === "Live" || gameState === "Final") ?  <>{aScore}</> 
                       : <>({awayRec.wins}-{awayRec.losses}{awayRec.ot ? '-'+awayRec.ot : ''})</>} 
                    </span>
                   {/* {" "}<small>vs.</small>{" "}  */}
                    <span style={{color:hScore>aScore ? 'green' : hScore<aScore ? 'grey' : 'black'}}>
                        {homeTeam} {(gameState === "Live" || gameState === "Final") ? 
                        <>{hScore}
                            <span style={{float: 'right', color: gameState === 'Live' ? 'green' : 'black'}}>
                                {gameState === "Live" ? <GameStatus id={g.gamePk} /> : gameState}
                            </span>
                        </> 
                        : <>({homeRec.wins}-{homeRec.losses}{homeRec.ot ? '-'+homeRec.ot : ''})</>}</span>
                   </Card>
            } )
            : <div>Loading game data...</div> 
        }
        </>
        </div>
    )
}