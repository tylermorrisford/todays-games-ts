import React from 'react';
import Button from 'react-bootstrap/Button';
// import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import useSWR, { mutate } from 'swr';
import { getEndpoint, isGameLive } from '../Utils/helpers';
import ReactHlsPlayer from 'react-hls-player';
import GameDetailsBody from './GameDetailsBody';

interface GameDetailsModalProps {
    showGameModal: boolean;
    setShowGameModal: React.Dispatch<React.SetStateAction<boolean>>;
    gameId: number;
    gameState: string;
    threeMinRecap?: string;
}

const GameDetailsModal: React.FunctionComponent<GameDetailsModalProps> = ({
    showGameModal,
    setShowGameModal,
    gameId,
    gameState,
    threeMinRecap,
}): JSX.Element => {

    const [showRadio, setShowRadio] = React.useState<boolean>(false);
    const [listenHome, setListenHome] = React.useState<boolean>(false);
    const [listenAway, setListenAway] = React.useState<boolean>(false);
    const homeRef = React.useRef<any>(null);
    const awayRef = React.useRef<any>(null);

    const { data } = useSWR(showGameModal ? getEndpoint(`/api/landing`) : null,
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
        if (showGameModal) {
            mutate(getEndpoint(`/api/landing`));
        }
    }, [showGameModal]);

    const getModalTitle = (): string => {
        if (data) {
            return `${data?.awayTeam?.abbrev} at ${data?.homeTeam?.abbrev}`
        }
        return gameId.toString();
    }
    console.log('game details modal data /landing (not polled): ', data);
    console.log('gameState: ', gameState);
    console.log(isGameLive(gameState));


    return (
        <Modal size='lg' show={showGameModal} onHide={() => setShowGameModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Game Details for {getModalTitle()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <GameDetailsBody gameId={gameId} showGameModal={showGameModal} gameState={gameState} />
                {/* Add scoring details */}
                {gameState && isGameLive(gameState) &&
                    <div>
                        <hr style={{ width: '80%', margin: '5px auto', color: 'grey' }} />
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Button
                                size='sm'
                                variant='light'
                                disabled={listenHome}
                                onClick={() => {
                                    setShowRadio(!showRadio)
                                    setListenAway(!listenAway)
                                }}>Listen Away Radio</Button>
                            <Button
                                size='sm'
                                variant='light'
                                disabled={listenAway}
                                onClick={() => {
                                    setShowRadio(!showRadio)
                                    setListenHome(!listenHome)
                                }}>Listen Home Radio</Button>

                        </div>

                        {(showRadio && listenHome) && (
                            <>
                                <p className='text-center'>Home Broadcast</p>
                                <ReactHlsPlayer
                                    src={data?.homeTeam?.radioLink}
                                    autoPlay={false}
                                    controls={true}
                                    width="100%"
                                    height="75px"
                                    playerRef={homeRef}
                                />
                            </>
                        )}

                        {(showRadio && listenAway) && (
                            <>
                                <p className='text-center'>Away Broadcast</p>
                                <ReactHlsPlayer
                                    src={data?.awayTeam?.radioLink}
                                    autoPlay={false}
                                    controls={true}
                                    width="100%"
                                    height="75px"
                                    playerRef={awayRef}
                                />
                            </>
                        )}
                    </div>}
            </Modal.Body>
        </Modal >
    );
}

export default GameDetailsModal;