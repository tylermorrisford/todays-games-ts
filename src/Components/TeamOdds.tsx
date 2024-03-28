type TeamOddsProps = {
    odds: number;
}

export const TeamOdds: React.FunctionComponent<TeamOddsProps> = ({ odds }): JSX.Element => {

    return (
        <small style={{ fontSize: '0.6em' }} className='text-muted small'>
            {odds > 0 ? '+' : ''}{odds}
        </small>
    );
}

