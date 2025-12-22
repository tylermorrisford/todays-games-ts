import React from "react";
import GoalCard from "./GoalCard";
import type { Goal } from "../types";
import { showScoring } from "../Utils/helpers";


interface GameDetailsScoringProps {
    gameState: string;
    scoring?: any[];
    awayTeam?: string;
    homeTeam?: string;
}

const GameDetailsScoring: React.FunctionComponent<GameDetailsScoringProps> = ({
    gameState,
    scoring,
    awayTeam,
    homeTeam
}): JSX.Element => {
    console.log('scoring', scoring);

    const allGoals: Goal[] = scoring?.flatMap((period: any) =>
        period.goals.map((goal: Goal) => ({
            ...goal,
            period: period.periodDescriptor.number
        }))
    ) ?? [];
    console.log('allGoals', allGoals);
    
    const awayGoals = allGoals?.filter((goal: Goal) => goal?.teamAbbrev?.default === awayTeam);
    const homeGoals = allGoals?.filter((goal: Goal) => goal?.teamAbbrev?.default === homeTeam);

    return (
        <div>
            {showScoring(gameState) && allGoals?.length > 0 && (
                <>
                    <hr style={{ width: '80%', margin: '5px auto', color: 'grey' }} />
                    <h6 style={{ textAlign: 'center' }}>Scoring</h6>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                            {awayGoals?.map((goal: Goal, i: number) => {
                                return (
                                    <GoalCard key={i} goal={goal} />
                                )
                            }
                            )}
                        </div>
                        <div style={{ placeContent: 'start' }}>
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