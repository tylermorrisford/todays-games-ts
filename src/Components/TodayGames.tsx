import React from 'react';
import dayjs from 'dayjs';
import useSWR from 'swr';
import { Button, Card } from '@commercetools/nimbus';
import NHLLogo from '../Assets/NHL_Logo_former.svg';
import { GameStatus } from './GameStatus';
import GameDetailsModal from './GameDetailsModal';
import LoadingGames from './LoadingGames';
import { TeamOdds } from './TeamOdds';
import type { Game, ScheduleResponse } from '../types';
import { getEndpoint, showOdds, parseOdds, isGameScored, isPreGame } from '../Utils/helpers';
import { LogoImage } from './LogoImage';

export const TodayGames: React.FunctionComponent = () => {
  const [searchDate, setSearchDate] = React.useState<string>(dayjs().format('YYYY-MM-DD'));
  const [showGameModal, setShowGameModal] = React.useState<boolean>(false);
  const [gameDetailsId, setGameDetailsId] = React.useState<number>(0);
  const [gameState, setGameState] = React.useState<string>('');

  const currentDate = React.useRef<string>(dayjs().format('YYYY-MM-DD'));

  const { data, isLoading } = useSWR<ScheduleResponse>(
    [getEndpoint('/api/schedule'), searchDate],
    async ([url, date]) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      return response.json();
    }
  );

  const gameDay = data?.gameWeek[0];
  const games: Game[] = gameDay?.games ?? [];
  const today = gameDay ? dayjs(gameDay.date).format('ddd, MM-DD-YY') : '';
  const noGames = gameDay?.numberOfGames === 0;

  const getGameTime = (isoTime: string): string => dayjs(isoTime).format('h:mm A');

  const nextDay = (): void => {
    currentDate.current = dayjs(currentDate.current).add(1, 'day').format('YYYY-MM-DD');
    setSearchDate(currentDate.current);
  };

  const prevDay = (): void => {
    currentDate.current = dayjs(currentDate.current).subtract(1, 'day').format('YYYY-MM-DD');
    setSearchDate(currentDate.current);
  };

  const handleShowGameDetails = (id: number, state: string): void => {
    setGameDetailsId(id);
    setGameState(state);
    setShowGameModal(true);
  };

  const handleCloseModal = (): void => {
    setShowGameModal(false);
    setGameDetailsId(0);
    setGameState('');
  };

  return (
    <div>
      <p style={{ fontSize: '2em', marginBottom: 0, display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <img src={NHLLogo} width='45px' height='45px' alt='NHL Logo' />
        <strong>NHL Today</strong>
      </p>
      <p style={{ textAlign: 'center' }}>
        <small style={{ color: 'grey' }}>...a dashboard for nerds</small>
      </p>
      <h4>Schedule for {today}</h4>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="ghost" size="sm" style={{ width: '45%' }} onPress={prevDay}>
          &larr; previous
        </Button>
        <Button variant="ghost" size="sm" style={{ width: '45%' }} onPress={nextDay}>
          next &rarr;
        </Button>
      </div>
      <>
        {noGames ? (
          <p>No games scheduled :/<br />Go have a beer</p>
        ) : (
          <>
            {isLoading ? (
              <LoadingGames />
            ) : (
              games.map((g: Game, i: number) => {
                const { awayTeam, homeTeam, gameState: gState, startTimeUTC, id } = g;
                const scored = isGameScored(gState);
                const aScore = awayTeam.score;
                const hScore = homeTeam.score;

                const rightElement = (gState === 'LIVE' || gState === 'CRIT') ? <GameStatus id={id} />
                  : (gState === 'FINAL' || gState === 'OFF') ? <>Final</>
                  : isPreGame(gState) ? <>{getGameTime(startTimeUTC)}</>
                  : null;

                return (
                  <Button
                    key={i}
                    variant="ghost"
                    onPress={() => handleShowGameDetails(id, gState)}
                    className="game-card-btn"
                    width="100%"
                    padding="0"
                    display="block"
                    height="auto"
                    _hover={{ boxShadow: 'none', background: 'transparent' }}
                  >
                    <Card.Root variant="outlined" marginTop="200" style={{ fontSize: '1.3em', width: '100%', textAlign: 'left' }}>
                      <Card.Body>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: aScore > hScore ? 'green' : aScore < hScore ? 'grey' : 'black' }}>
                          <LogoImage team={awayTeam.abbrev} url={awayTeam.logo} />
                          <span>{awayTeam.abbrev}</span>
                          {showOdds(gState, startTimeUTC, awayTeam.odds) && <TeamOdds odds={parseOdds(awayTeam.odds)} />}
                          {scored && <span>{aScore}</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hScore > aScore ? 'green' : hScore < aScore ? 'grey' : 'black' }}>
                          <LogoImage team={homeTeam.abbrev} url={homeTeam.logo} />
                          <span>{homeTeam.abbrev}</span>
                          {showOdds(gState, startTimeUTC, homeTeam.odds) && <TeamOdds odds={parseOdds(homeTeam.odds)} />}
                          {scored && <span>{hScore}</span>}
                          {rightElement && <span style={{ marginLeft: 'auto' }}>{rightElement}</span>}
                        </div>
                      </Card.Body>
                    </Card.Root>
                  </Button>
                );
              })
            )}
          </>
        )}
        <GameDetailsModal
          showGameModal={showGameModal}
          handleCloseModal={handleCloseModal}
          gameId={gameDetailsId}
          gameState={gameState}
        />
      </>
    </div>
  );
};
