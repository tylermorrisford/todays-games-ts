import React from 'react'
import dayjs from 'dayjs'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import NHLLogo from '../Assets/NHL_Logo_former.svg'
import { GameStatus } from './GameStatus'
import LoadingGames from './LoadingGames'
import trimName from '../Utils/trim'

// TODO: update requests and responses to use the new API!
// https://gitlab.com/dword4/nhlapi/-/blob/master/new-api.md

interface ResponseObject {
    [key: string]: any
}

interface teamRecord {
    wins: number,
    losses: number,
    ot: number
}

export const TodayGames: React.FunctionComponent = (): JSX.Element => {
    const [games, setGames] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [today, setToday] = React.useState('')
    const [searchDate, setSearchDate] = React.useState('')
    const [noGames, setNoGames] = React.useState(false);

    const getGameTime = (isoTime: Date): string => {
        return dayjs(isoTime).format('h:mm A')
    }

    const currentDate = React.useRef(dayjs().format('YYYY-MM-DD'));

    const nextDay = (): void => {
        currentDate.current = dayjs(currentDate.current).add(1, 'day').format('YYYY-MM-DD');
        setSearchDate(currentDate.current);
    }

    const prevDay = (): void => {
        currentDate.current = dayjs(currentDate.current).subtract(1, 'day').format('YYYY-MM-DD');
        setSearchDate(currentDate.current);
    }
    
    React.useEffect(() => {
        let gameDate: string = searchDate ? searchDate : currentDate.current
        setLoading(true)
        fetch(`https://statsapi.web.nhl.com/api/v1/schedule?date=${gameDate}`)
            .then(res => res.json())
            .then((data: ResponseObject = {}) => {
                if (data.totalGames === 0) {return setNoGames(true)}
                // console.log('GAMES', data.dates[0].games);
                // console.log('FULL RES OBJECT', data);
                setGames(data.dates[0].games)
                setNoGames(false)
                setToday(dayjs(data.dates[0].date).format('ddd, MMM D, YYYY'))
                setLoading(false)
            })
    }, [searchDate])

    const arrowButtonStyle = {
        border: '1px solid whitesmoke',
        borderRadius: '5px',
        padding: '5px',
        margin: '5px',
        width: '40%',
        backgroundColor: 'white',
    }
 
    return(
        <div>
            <p style={{fontSize: '2em', marginBottom: 0}}><img src={NHLLogo} width="45px" height="45px" alt="NHL Logo"/>
                {" "}<strong>{today}</strong>
            </p>
            <p className="text-center"><small style={{color: 'grey'}}>NHL Snapshot - a dashboard for nerds</small></p>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant='light' style={arrowButtonStyle} onClick={() => prevDay()}>&larr; previous</Button>
                <Button variant='light' style={arrowButtonStyle} onClick={() => nextDay()}>next &rarr;</Button>
            </div>
            <>{noGames ? <p>No games scheduled :/<br/>Go have a beer</p> : Object.keys(games).length > 0 ? <>
            {loading ? <LoadingGames /> :
                games.map( (g: any, i:number) => {
                // api response is very, very nested
                let awayTeam: string = g.teams.away.team.name
                let awayRec: teamRecord = g.teams.away.leagueRecord
                let aScore: number = g.teams.away.score
                let hScore: number = g.teams.home.score
                let homeTeam: string = g.teams.home.team.name
                let homeRec: teamRecord = g.teams.home.leagueRecord
                let gameState: string = g.status.abstractGameState
                
                // TODO: access all of this data from the linescore endpoint
               return <Card className="shadow-sm mt-2 p-2" style={{fontSize: '1.3em'}} key={i}>
                    <span style={{color:aScore>hScore ? 'green' : aScore<hScore ? 'grey' : 'black'}}>
                       {trimName(awayTeam)} {(gameState === "Live" || gameState === "Final") ?  <>{aScore}</> 
                       : <>({awayRec.wins}-{awayRec.losses}{awayRec.ot !== 0 && '-'+awayRec.ot})</>} 
                    </span>
                    <span style={{color:hScore>aScore ? 'green' : hScore<aScore ? 'grey' : 'black'}}>
                        {trimName(homeTeam)} {(gameState === "Live" || gameState === "Final") ? 
                        <>{hScore}
                            <span style={{float: 'right', color: gameState === 'Live' ? 'green' : 'black'}}>
                                {gameState === "Live" ? <GameStatus id={g.gamePk} /> : gameState}
                            </span>
                        </> 
                        : <>({homeRec.wins}-{homeRec.losses}{homeRec.ot ? '-'+homeRec.ot : ''})
                        {gameState === 'Preview' && <span style={{float: 'right'}}>{getGameTime(g.gameDate)}</span>}
                        </>
                        }</span>
                   </Card>
            } )
        }</>
            : <div>Loading game data...</div> 
        }
        </>
        </div>
    )
}