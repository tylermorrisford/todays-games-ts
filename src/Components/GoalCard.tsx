import React from 'react';
import { Badge } from 'react-bootstrap';
import { Goal } from '../types';

interface GoalProps {
    goal: Goal;
}

const GoalCard: React.FunctionComponent<GoalProps> = ({ goal }): JSX.Element => {
    return (
        <Badge bg='light' text='dark' style={{ border: '1px solid grey', margin: '5px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr', gridTemplateRows: '30px auto' }}>
                <img
                    src={goal.headshot}
                    alt={goal.name.default}
                    width={30}
                    height={30}
                    style={{ borderRadius: '20px', placeSelf: 'center center' }}
                />
                <div style={{ placeSelf: 'end end' }}>
                    {goal.name.default} ({goal.goalsToDate})<br />
                    <small>{goal.timeInPeriod} {goal.shotType} - {goal.strength}</small>
                </div>
                <div style={{ justifySelf: 'center' }}>{goal.teamAbbrev.default}</div>

            </div>
        </Badge>
    );
}

export default GoalCard;