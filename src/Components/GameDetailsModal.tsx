import React from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import useSWR from 'swr';
import { getEndpoint, getPeriod } from '../Utils/helpers';
import ReactHlsPlayer from 'react-hls-player';
import { LogoImage } from './LogoImage';

interface GameDetailsModalProps {
    showGameModal: boolean;
    setShowGameModal: React.Dispatch<React.SetStateAction<boolean>>;
    gameId: number;
}

const GameDetailsModal: React.FunctionComponent<GameDetailsModalProps> = ({
    showGameModal,
    setShowGameModal,
    gameId,
}): JSX.Element => {

    const [showRadio, setShowRadio] = React.useState<boolean>(false);
    const [listenHome, setListenHome] = React.useState<boolean>(false);
    const [listenAway, setListenAway] = React.useState<boolean>(false);
    const homeRef = React.useRef<any>(null);
    const awayRef = React.useRef<any>(null);

    const { data } = useSWR(
        showGameModal ? getEndpoint(`/api/gamecenter`) : null,
        async (url) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: gameId }),
            });
            return response.json();
        },
        { refreshInterval: (showGameModal && showRadio === false) ? 2000 : 0 }
    );

    console.log('GameDetailsModal data', data);

    return (
        <Modal size='lg' show={showGameModal} onHide={() => setShowGameModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Game Details for {gameId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', paddingBottom: '15px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <LogoImage url={data?.homeTeam?.logo} team={data?.homeTeam?.abbrev} /><br />
                        {data?.homeTeam?.abbrev}<br />
                        {data?.homeTeam?.score}
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
                        {data?.awayTeam?.abbrev}<br />
                        {data?.awayTeam?.score}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>

                    <Button
                        size='sm'
                        variant='light'
                        disabled={listenAway}
                        onClick={() => {
                            setShowRadio(!showRadio)
                            setListenHome(!listenHome)
                        }}>Toggle Home Radio</Button>

                    <Button
                        size='sm'
                        variant='light'
                        disabled={listenHome}
                        onClick={() => {
                            setShowRadio(!showRadio)
                            setListenAway(!listenAway)
                        }}>Toggle Away Radio</Button>
                </div>
                
                {(showRadio && listenHome) && (
                    <>
                        <span>Home Broadcast</span>
                        <ReactHlsPlayer
                            src={data?.homeTeam?.radioLink}
                            autoPlay={false}
                            controls={true}
                            width="100%"
                            height="50px"
                            playerRef={homeRef}
                        />
                    </>
                )}
                <br />
                {(showRadio && listenAway) && (
                    <>
                        <span>Away Broadcast</span>
                        <ReactHlsPlayer
                            src={data?.awayTeam?.radioLink}
                            autoPlay={false}
                            controls={true}
                            width="100%"
                            height="50px"
                            playerRef={awayRef}
                        />
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default GameDetailsModal;