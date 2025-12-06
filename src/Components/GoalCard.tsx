import React from 'react';
import { Badge } from 'react-bootstrap';
import { getPeriod } from '../Utils/helpers';
import { Goal } from '../types';

interface GoalProps {
    goal: Goal;
}

const GoalCard: React.FunctionComponent<GoalProps> = ({ goal }): JSX.Element => {
    return (
        <Badge bg='light' text='dark' style={{ border: '1px solid grey', margin: '4px', padding: '5px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '35px 1fr', gridTemplateRows: '35px auto' }}>
                <div style={{ placeSelf: 'center center' }}>
                <img
                    src={goal.headshot}
                    alt={goal.name.default}
                    width={30}
                    height={30}
                    style={{ borderRadius: '20px'}}
                    />
                <div >{goal.teamAbbrev.default}</div>
                    </div>
                <div style={{ placeSelf: 'center end' }}>
                    {goal.name.default} ({goal.goalsToDate})<br />
                    <small>{goal.shotType} - {goal.strength}</small><br/>
                    <small>{goal.timeInPeriod} {getPeriod(goal.period!)}</small>
                </div>

            </div>
        </Badge>
    );
}

export default GoalCard;