import React from 'react';
import { Box, Button } from '@commercetools/nimbus';
import { getPeriod } from '../Utils/helpers';
import { Goal } from '../types';

interface GoalProps {
    goal: Goal;
}

const GoalCard = ({ goal }: GoalProps) => {
    const hasHighlight = !!goal.highlightClipSharingUrl;

    const handleClick = () => {
        if (goal.highlightClipSharingUrl) {
            window.open(goal.highlightClipSharingUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const inner = (
        <div style={{ display: 'grid', gridTemplateColumns: '45px 1fr' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img
                    src={goal.headshot}
                    alt={goal.name.default}
                    width={30}
                    height={30}
                    style={{ borderRadius: '20px' }}
                />
                <div>{goal.teamAbbrev.default}</div>
            </div>
            <div style={{ placeSelf: 'center start', display: 'flex', flexDirection: 'column', lineHeight: '1.3' }}>
                <span>{goal.name.default} ({goal.goalsToDate})</span>
                <small>{goal.shotType} - {goal.strength}</small>
                <small>{goal.timeInPeriod} {getPeriod(goal.period!)}</small>
            </div>
        </div>
    );

    if (hasHighlight) {
        return (
            <Button
                variant="ghost"
                onPress={handleClick}
                title="Click to watch goal highlight 🎥"
                padding="100"
                margin="100"
                border="2px solid"
                borderColor="primary.9"
                borderRadius="100"
                display="inline-block"
                height="auto"
            >
                {inner}
            </Button>
        );
    }

    return (
        <Box
            display="inline-block"
            border="1px solid"
            borderColor="neutral.7"
            borderRadius="100"
            padding="100"
            margin="100"
        >
            {inner}
        </Box>
    );
};

export default GoalCard;
