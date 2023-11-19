import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import { GameIdProps } from '../types';
import { getPeriod } from '../Utils/period';

// TODO: type this response object
interface ResponseObject {
  [key: string]: any;
}

export const GameStatus: React.FunctionComponent<GameIdProps> = ({
  id,
}): JSX.Element => {
  const [period, setPeriod] = React.useState<number>(0);
  const [remaining, setRemaining] = React.useState<string>('');
  const [running, setRunning] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (id !== undefined) {
        // 164.90.150.60:4000
      fetch(`http://164.90.150.60:4000/api/gamecenter/${id}/boxscore`, {
        headers: { Authorization: 'hello' },
      })
        .then((res) => res.json())
        .then((data: ResponseObject = {}) => {
          console.log('\n\nGame score data:', data);
          setPeriod(data.period);
          setRemaining(data.clock.timeRemaining);
          setRunning(data.clock.running);
        })
        .catch((err) => console.log('status component error: ', err));
    }
  }, [id]);

  return (
    <Badge bg={running ? 'success' : ''}>
      {remaining ? (
        <span>
          {remaining} - {getPeriod(period)}
        </span>
      ) : (
        <Spinner animation='grow' variant='success' size='sm' />
      )}
    </Badge>
  );
};
