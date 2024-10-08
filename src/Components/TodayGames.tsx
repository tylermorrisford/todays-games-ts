import React from 'react';
import dayjs from 'dayjs';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import NHLLogo from '../Assets/NHL_Logo_former.svg';
import { GameStatus } from './GameStatus';
import GameDetailsModal from './GameDetailsModal';
import LoadingGames from './LoadingGames';
import { TeamOdds } from './TeamOdds';
import { Game } from '../types';
import { getEndpoint, showOdds, parseOdds } from '../Utils/helpers';
import { LogoImage } from './LogoImage';

export const TodayGames: React.FunctionComponent = (): JSX.Element => {
  const [games, setGames] = React.useState<Game[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [today, setToday] = React.useState<string>('');
  const [searchDate, setSearchDate] = React.useState<string>(dayjs().format('YYYY-MM-DD'));
  const [noGames, setNoGames] = React.useState<boolean>(false);
  const [showGameModal, setShowGameModal] = React.useState<boolean>(false);
  const [gameDetailsId, setGameDetailsId] = React.useState<number>(0);
  const [gameState, setGameState] = React.useState<string>('');

  const getGameTime = (isoTime: Date): string => {
    return dayjs(isoTime).format('h:mm A');
  };

  // const test = 'https://api-web.nhle.com/v1/schedule/2024-06-24'
  const currentDate = React.useRef<string>(dayjs().format('YYYY-MM-DD'));

  const nextDay = (): void => {
    currentDate.current = dayjs(currentDate.current)
      .add(1, 'day')
      .format('YYYY-MM-DD');
    setSearchDate(currentDate.current);
  };

  const prevDay = (): void => {
    currentDate.current = dayjs(currentDate.current)
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    setSearchDate(currentDate.current);
  };


  React.useEffect(() => {
    let gameDate: string = searchDate ? searchDate : currentDate.current;
    setLoading(true);
    fetch(getEndpoint('/api/schedule'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: gameDate }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.gameWeek[0].numberOfGames === 0) {
          setToday(dayjs(data.gameWeek[0].date).format('ddd, MM-DD-YY'));
          setLoading(false);
          return setNoGames(true);
        }
        setGames(data.gameWeek[0].games);
        console.log(data.gameWeek[0].games);
        setNoGames(false);
        setToday(dayjs(data.gameWeek[0].date).format('ddd, MM-DD-YY'));
        setLoading(false);
      });
  }, [searchDate]);

  const handleShowGameDetails = (id: number, gameState: string): void => {
    setGameDetailsId(id);
    setGameState(gameState);
    setShowGameModal(true);
  }

  const arrowButtonStyle = {
    border: '1px solid grey',
    borderRadius: '5px',
    padding: '5px',
    margin: '5px',
    width: '40%',
    backgroundColor: 'white',
  };

  return (
    <div>
      <p style={{ fontSize: '2em', marginBottom: 0, display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <img src={NHLLogo} width='45px' height='45px' alt='NHL Logo' />
        <strong>NHL Today</strong>
      </p>
      <p className='text-center'>
        <small style={{ color: 'grey' }}>
          ...a dashboard for nerds
        </small>
      </p>
      <h4>Schedule for {today}</h4>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant='light'
          style={arrowButtonStyle}
          onClick={() => prevDay()}
        >
          &larr; previous
        </Button>
        <Button
          variant='light'
          style={arrowButtonStyle}
          onClick={() => nextDay()}
        >
          next &rarr;
        </Button>
      </div>
      <>
        {noGames ? (
          <p>
            No games scheduled :/
            <br />
            Go have a beer
          </p>
        ) : (
          <>
            {loading ? (
              <LoadingGames />
            ) : (
              games.map((g: any, i: number) => {
                // renaming for readability
                let awayTeam: string = g.awayTeam.abbrev;
                let awayLogo: string = g.awayTeam.logo;
                let homeTeam: string = g.homeTeam.abbrev;
                let homeLogo: string = g.homeTeam.logo;
                let aScore: number = g.awayTeam.score;
                let hScore: number = g.homeTeam.score;
                // TODO: show other data based on game state
                let gameState: string = g.gameState;
                // let awayOdds: number = g.awayTeam.odds[0]?.value;
                // let homeOdds: number = g.homeTeam.odds[0]?.value;

                return (
                  <Card
                    className='shadow-sm mt-2 p-2'
                    style={{ fontSize: '1.3em' }}
                    key={i}
                    onClick={() => handleShowGameDetails(g.id, gameState)}
                  >
                    <span
                      style={{
                        color:
                          aScore > hScore
                            ? 'green'
                            : aScore < hScore
                              ? 'grey'
                              : 'black',
                      }}
                    >
                      <LogoImage team={awayTeam} url={awayLogo} />
                      {awayTeam}{' '}
                      {showOdds(gameState, g.startTimeUTC, g.awayTeam.odds) ? <TeamOdds odds={parseOdds(g.awayTeam.odds)} /> : ''}
                      {gameState === 'LIVE' ||
                        gameState === 'FINAL' ||
                        gameState === 'OFF' ||
                        gameState === 'CRIT' ? (
                        <>{aScore}</>
                      ) : (
                        <>
                          {/* ({awayRec.wins}-{awayRec.losses}
                          {awayRec.ot !== 0 && '-' + awayRec.ot}) */}
                        </>
                      )}
                    </span>
                    <span
                      style={{
                        color:
                          hScore > aScore
                            ? 'green'
                            : hScore < aScore
                              ? 'grey'
                              : 'black',
                      }}
                    >
                      <LogoImage team={homeTeam} url={homeLogo} />
                      {homeTeam}{' '}
                      {showOdds(gameState, g.startTimeUTC, g.homeTeam.odds) ? <TeamOdds odds={parseOdds(g.homeTeam.odds)} /> : ''}
                      {gameState === 'LIVE' ||
                        gameState === 'FINAL' ||
                        gameState === 'OFF' ||
                        gameState === 'CRIT' ? (
                        <>
                          {hScore}
                          <span
                            style={{
                              float: 'right',
                            }}
                          >
                            {gameState === 'LIVE' || gameState === 'CRIT' ? (
                              <span>
                                <GameStatus id={g.id} />
                              </span>
                            ) : gameState === "FINAL" || gameState === "OFF" ? (
                              <span>Final</span>
                            ) : ''}
                          </span>
                        </>
                      ) : (
                        <>
                          {/* ({homeRec.wins}-{homeRec.losses}
                          {homeRec.ot ? '-' + homeRec.ot : ''}) */}
                          {(gameState === 'PRE' || gameState === 'FUT') && (
                            <span style={{ float: 'right' }}>
                              {getGameTime(g.startTimeUTC)}
                            </span>
                          )}
                        </>
                      )}
                    </span>
                  </Card>
                );
              })
            )}
          </>
        )}
        <GameDetailsModal
          showGameModal={showGameModal}
          setShowGameModal={setShowGameModal}
          gameId={gameDetailsId}
          gameState={gameState}
        />
      </>
    </div>
  );
};
