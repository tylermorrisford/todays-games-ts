import React from "react";
import GoalCard from "./GoalCard";
import { showScoring } from "../Utils/helpers";

interface GameDetailsScoringProps {
    gameState: string;
    scoring?: any[];
    awayTeam?: string;
    homeTeam?: string;
}

interface Goal {
    strength: string;
    name: {
        default: string;
    }
    headshot: string;
    shotType: string;
    timeInPeriod: string;
    teamAbbrev: {
        default: string;
    }
    goalsToDate: number;
}

const GameDetailsScoring: React.FunctionComponent<GameDetailsScoringProps> = ({
    gameState,
    scoring,
    awayTeam,
    homeTeam
}): JSX.Element => {

    const allGoals = scoring?.reduce((acc: Goal[], period: any) => {
        return acc.concat(period.goals);
    }, [] as Goal[]);

    const awayGoals = allGoals?.filter((goal: Goal) => goal?.teamAbbrev?.default === awayTeam);
    const homeGoals = allGoals?.filter((goal: Goal) => goal?.teamAbbrev?.default === homeTeam);

    return (
        <div>
            {showScoring(gameState) && (
                <>
                    <h6 style={{ textAlign: 'center' }}>Scoring</h6>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
                        <div style={{ placeItems: 'end' }}>
                            <h6 style={{ textAlign: 'center' }}>{awayTeam}</h6>
                            {awayGoals?.map((goal: Goal, i: number) => {
                                return (
                                    <GoalCard key={i} goal={goal} />
                                )
                            }
                            )}
                        </div>
                        <div style={{ placeContent: 'start' }}>
                            <h6 style={{ textAlign: 'center' }}>{homeTeam}</h6>
                            {homeGoals?.map((goal: Goal, i: number) => {
                                return (
                                    <GoalCard key={i} goal={goal} />
                                )
                            }
                            )}
                        </div>
                    </div>
                </>
            )
            }
        </div>
    )
}

export default GameDetailsScoring;