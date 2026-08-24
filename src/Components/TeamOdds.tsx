import React from 'react';

type TeamOddsProps = {
    odds: number;
}

export const TeamOdds: React.FunctionComponent<TeamOddsProps> = ({ odds }) => {
    return (
        <small style={{ fontSize: '0.6em', color: 'grey' }}>
            {odds > 0 ? '+' : ''}{odds}
        </small>
    );
}
