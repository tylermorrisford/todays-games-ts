import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import useSWR, { mutate } from 'swr';
import { getEndpoint, getPeriod } from '../Utils/helpers';
import { LogoImage } from './LogoImage';

interface GameDetailsBodyProps {
    gameId: number;
}

const GameDetailsBody: React.FunctionComponent<GameDetailsBodyProps> = ({
    gameId,
}): JSX.Element => {

    const { data, error, isLoading } = useSWR(getEndpoint(`/api/gamecenter`),
        async (url) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: gameId }),
            });
            return response.json();
        },
    );

    React.useEffect(() => {
        const interval = setInterval(() => {
            mutate(getEndpoint(`/api/gamecenter`));
        }, 2000); // Refresh every 2 seconds

        return () => {
            clearInterval(interval);
        };
    }, []);

    const centerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '130px',
        paddingBottom: '15px',
    };

    if (isLoading) return <div style={centerStyle}><Spinner animation='grow' variant='dark' size='sm' /></div>
    if (error) return <div style={centerStyle}>failed to load: {JSON.stringify(error)}</div>
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', paddingBottom: '15px' }}>
                <div style={{ textAlign: 'center' }}>
                    <LogoImage url={data?.homeTeam?.logo} team={data?.homeTeam?.abbrev} /><br />
                    {data?.homeTeam?.name?.default}<br />
                    <strong>{data?.homeTeam?.score}</strong><br />
                    <small>SOG: {data?.homeTeam?.sog}</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Badge bg={data?.clock?.running ? 'success' : data?.clock?.inIntermission ? 'warning' : 'light'} text={(!data?.clock?.running && !data?.clock?.inIntermission) ? 'dark' : 'light'}>
                        <span>
                            {data?.clock?.timeRemaining} - {data?.clock?.inIntermission ? 'Int' : getPeriod(data?.period)}
                        </span>
                    </Badge>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <LogoImage url={data?.awayTeam?.logo} team={data?.awayTeam?.abbrev} /><br />
                    {data?.awayTeam?.name?.default}<br />
                    <strong>{data?.awayTeam?.score}</strong><br />
                    <small>SOG: {data?.awayTeam?.sog}</small>
                </div>
            </div>
        </>
    );
}

export default GameDetailsBody;
