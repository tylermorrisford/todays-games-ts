import React from 'react';
import { Button, Dialog } from '@commercetools/nimbus';
import useSWR, { mutate } from 'swr';
import { getEndpoint, isGameLive } from '../Utils/helpers';
import ReactHlsPlayer from 'react-hls-player';
import GameDetailsBody from './GameDetailsBody';
import GameDetailsScoring from './GameDetailsScoring';

interface GameDetailsModalProps {
    showGameModal: boolean;
    handleCloseModal: () => void;
    gameId: number;
    gameState: string;
    threeMinRecap?: string;
}

const GameDetailsModal: React.FunctionComponent<GameDetailsModalProps> = ({
    showGameModal,
    handleCloseModal,
    gameId,
    gameState,
    threeMinRecap,
}) => {

    const [showRadio, setShowRadio] = React.useState<boolean>(false);
    const [listenHome, setListenHome] = React.useState<boolean>(false);
    const [listenAway, setListenAway] = React.useState<boolean>(false);
    const homeRef = React.useRef<any>(null);
    const awayRef = React.useRef<any>(null);

    const { data } = useSWR(
        showGameModal ? [getEndpoint(`/api/landing`), gameId] : null,
        async ([url, id]) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            return response.json();
        },
    );

    React.useEffect(() => {
        if (showGameModal) {
            mutate([getEndpoint(`/api/landing`), gameId]);
        } else {
            setShowRadio(false);
            setListenHome(false);
            setListenAway(false);
        }
    }, [showGameModal, gameId]);

    const getModalTitle = (): string => {
        if (data) {
            return `${data?.awayTeam?.abbrev} at ${data?.homeTeam?.abbrev}`;
        }
        return gameId.toString();
    };

    return (
        <Dialog.Root
            isOpen={showGameModal}
            onOpenChange={(open) => { if (!open) handleCloseModal(); }}
            isDismissable
        >
            <Dialog.Content size="lg">
                <Dialog.Header>Game Details for {getModalTitle()}</Dialog.Header>
                <Dialog.Body>
                    <GameDetailsBody gameId={gameId} showGameModal={showGameModal} gameState={gameState} />
                    <GameDetailsScoring
                        gameState={gameState}
                        scoring={data?.summary?.scoring}
                        awayTeam={data?.awayTeam?.abbrev}
                        homeTeam={data?.homeTeam?.abbrev}
                    />
                    {gameState && isGameLive(gameState) && (
                        <div>
                            <hr style={{ width: '80%', margin: '5px auto', color: 'grey' }} />
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    isDisabled={listenHome}
                                    onPress={() => {
                                        setShowRadio(!showRadio);
                                        setListenAway(!listenAway);
                                    }}
                                >
                                    Listen Away Radio
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    isDisabled={listenAway}
                                    onPress={() => {
                                        setShowRadio(!showRadio);
                                        setListenHome(!listenHome);
                                    }}
                                >
                                    Listen Home Radio
                                </Button>
                            </div>

                            {(showRadio && listenHome) && (
                                <>
                                    <p style={{ textAlign: 'center' }}>Home Broadcast</p>
                                    <ReactHlsPlayer
                                        src={data?.homeTeam?.radioLink}
                                        autoPlay={true}
                                        controls={true}
                                        width="100%"
                                        height="75px"
                                        playerRef={homeRef}
                                    />
                                </>
                            )}

                            {(showRadio && listenAway) && (
                                <>
                                    <p style={{ textAlign: 'center' }}>Away Broadcast</p>
                                    <ReactHlsPlayer
                                        src={data?.awayTeam?.radioLink}
                                        autoPlay={true}
                                        controls={true}
                                        width="100%"
                                        height="75px"
                                        playerRef={awayRef}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </Dialog.Body>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default GameDetailsModal;
