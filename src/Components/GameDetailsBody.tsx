import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import useSWR, { mutate } from 'swr';
import { getEndpoint, getPeriod, isGameLive } from '../Utils/helpers';
import { LogoImage } from './LogoImage';

interface GameDetailsBodyProps {
    showGameModal: boolean;
    gameId: number;
    gameState?: string;
}

const GameDetailsBody: React.FunctionComponent<GameDetailsBodyProps> = ({
    showGameModal,
    gameId,
    gameState,
}): JSX.Element => {
    const { data, error, isLoading } = useSWR(
        showGameModal ? getEndpoint(`/api/gamecenter`) : null,
        async (url) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: gameId }),
            });
            return response.json();
        }
    );

    // effect to handle ditching the cache
    React.useEffect(() => {
        // only poll for live games
        if (gameState && isGameLive(gameState)) {
            const interval = setInterval(() => {
                mutate(getEndpoint(`/api/gamecenter`));
            }, 3000); // Attempt to avoid concurrent requests

            return () => {
                clearInterval(interval);
            };
        }
    }, [gameState]);

    const centerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '130px',
        paddingBottom: '15px',
    };
    console.log('polled game data /gamecenter : ', data);

    if (isLoading)
        return (
            <div style={centerStyle}>
                <Spinner animation='grow' variant='dark' size='sm' />
            </div>
        );
    if (error)
        return (
            <div style={centerStyle}>failed to load: {JSON.stringify(error)}</div>
        );
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10%',
                    paddingBottom: '15px',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <LogoImage url={data?.awayTeam?.logo} team={data?.awayTeam?.abbrev} />
                    <br />
                    {data?.awayTeam?.name?.default}
                    <br />
                    <strong>{data?.awayTeam?.score}</strong>
                    <br />
                    <small>SOG: {data?.awayTeam?.sog}</small>
                    <br />
                    {data?.situation?.awayTeam?.situationDescriptions?.length > 0 && (
                        <small className='text-success'>
                            {data?.situation?.awayTeam?.situationDescriptions[0]}-
                            {data?.situation?.awayTeam?.strength} on{' '}
                            {data?.situation?.homeTeam?.strength}<br />
                            {data?.situation?.timeRemaining && data?.situation?.timeRemaining}
                        </small>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Badge
                        bg={
                            data?.clock?.running
                                ? 'success'
                                : data?.clock?.inIntermission
                                    ? 'warning'
                                    : 'light'
                        }
                        text={
                            !data?.clock?.running && !data?.clock?.inIntermission
                                ? 'dark'
                                : 'light'
                        }
                    >
                        <span>
                            {data?.gameState === 'OFF' || data?.gameState === 'FINAL' ? 'Final' : data?.clock?.timeRemaining} -{' '}
                            {data?.clock?.inIntermission ? 'Int' : getPeriod(data?.period)}
                        </span>
                    </Badge>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <LogoImage url={data?.homeTeam?.logo} team={data?.homeTeam?.abbrev} />
                    <br />
                    {data?.homeTeam?.name?.default}
                    <br />
                    <strong>{data?.homeTeam?.score}</strong>
                    <br />
                    <small>SOG: {data?.homeTeam?.sog}</small>
                    <br />
                    {data?.situation?.homeTeam?.situationDescriptions?.length > 0 && (
                        <small className='text-success'>
                            {data?.situation?.homeTeam?.situationDescriptions[0]}-
                            {data?.situation?.homeTeam?.strength} on{' '}
                            {data?.situation?.awayTeam?.strength}<br />
                            {data?.situation?.timeRemaining && data?.situation?.timeRemaining}
                        </small>
                    )}
                </div>
            </div>

            {/* {data && data?.plays?.slice(-5).reverse().map((play: any, index: number) => {
                return (
                    <div key={index}>
                        <small>{play.timeRemaining} - {play.typeDescKey} {play.details?.reason}</small>
                    </div>
                )
            })
            } */}
        </>
    );
};

export default GameDetailsBody;
