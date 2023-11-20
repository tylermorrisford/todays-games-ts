import React from 'react';
import dayjs from 'dayjs';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import NHLLogo from '../Assets/NHL_Logo_former.svg';
import { GameStatus } from './GameStatus';
import LoadingGames from './LoadingGames';
import { Game, TeamRecord, TodayResponse, LogoImageProps } from '../types';
import trimName from '../Utils/trim';

// TODO: Using the new API will require a proxy server to avoid CORS issues
export const TodayGames: React.FunctionComponent = (): JSX.Element => {
  const [games, setGames] = React.useState<Game[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [today, setToday] = React.useState<string>('');
  const [searchDate, setSearchDate] = React.useState<string>('now');
  const [statusDate, setStatusDate] = React.useState<string>('');
  const [noGames, setNoGames] = React.useState<boolean>(false);

  const getGameTime = (isoTime: Date): string => {
    return dayjs(isoTime).format('h:mm A');
  };

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

  //  schedule endpoint https://api-web.nhle.com/v1/schedule/now
  React.useEffect(() => {
    let gameDate: string = searchDate ? searchDate : currentDate.current;
    setLoading(true);
    fetch(`164.90.150.60:4000/api/schedule/${gameDate}`, {
      headers: { Authorization: 'hello' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.gameWeek[0].numberOfGames === 0) {
          setToday(dayjs(data.gameWeek[0].date).format('ddd, MMM D, YYYY'));
          setLoading(false);
          return setNoGames(true);
        }
        console.log('GAMES', data.gameWeek[0].games);
        setGames(data.gameWeek[0].games);
        setNoGames(false);
        setToday(dayjs(data.gameWeek[0].date).format('ddd, MMM D, YYYY'));
        setStatusDate(data.gameWeek[0].date)
        setLoading(false);
      });
  }, [searchDate]);

  const arrowButtonStyle = {
    border: '1px solid whitesmoke',
    borderRadius: '5px',
    padding: '5px',
    margin: '5px',
    width: '40%',
    backgroundColor: 'white',
  };

  // TODO move these to helpers 
  const LogoImage = ({ url, team }: LogoImageProps): JSX.Element => {
    return <img src={url} alt={`${team}_logo`} width='40px' height='40px' />;
  };



  return (
    <div>
      <p style={{ fontSize: '2em', marginBottom: 0 }}>
        <img src={NHLLogo} width='45px' height='45px' alt='NHL Logo' />{' '}
        <strong>{today}</strong>
      </p>
      <p className='text-center'>
        <small style={{ color: 'grey' }}>
          NHL Snapshot - a dashboard for nerds
        </small>
        <small style={{ color: 'grey' }}>
          <br /> <em>NOTE:</em> The NHL recently shut down the API used for this
          app. <br />
          The new API they've created is a touch harder to use but <br />
          I'm working on the fix now.
        </small>
      </p>
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
        ) : Object.keys(games).length > 0 ? (
          <>
            {loading ? (
              <LoadingGames />
            ) : (
              games.map((g: any, i: number) => {
                // renaming for readability
                // use radio link!
                let awayTeam: string = g.awayTeam.abbrev;
                let awayLogo: string = g.awayTeam.logo;
                let homeTeam: string = g.homeTeam.abbrev;
                let homeLogo: string = g.homeTeam.logo;
                let aScore: number = g.awayTeam.score;
                let hScore: number = g.homeTeam.score;
                // let awayRec: TeamRecord = g.teams.away.leagueRecord;
                // let homeRec: TeamRecord = g.teams.home.leagueRecord;
                let gameState: string = g.gameState;

                // TODO: fix team records
                return (
                  <Card
                    className='shadow-sm mt-2 p-2'
                    style={{ fontSize: '1.3em' }}
                    key={i}
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
        ) : (
          <div>Loading game data...</div>
        )}
      </>
    </div>
  );
};
