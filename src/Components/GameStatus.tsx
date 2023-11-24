import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import { GameIdProps } from '../types';
import { getPeriod, getEndpoint } from '../Utils/helpers';

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
  const [inIntermission, setIntermission] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (id !== undefined) {
      fetch(getEndpoint(`/api/gamecenter`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      })
        .then((res) => res.json())
        .then((data: ResponseObject = {}) => {
          console.log('\nGame score data:', data);
          setPeriod(data.period);
          setRemaining(data.clock.timeRemaining);
          setRunning(data.clock.running);
          setIntermission(data.clock.inIntermission);
        })
        .catch((err) => console.log('status component error: ', err));
    }
  }, [id]);

  if (remaining === '') {
    return <Spinner animation='grow' variant='success' size='sm' />
  }

  return (  
    <Badge bg={running ? 'success' : 'secondary'}>
        <span>
          {remaining} - {inIntermission ? 'Int' : getPeriod(period) }
        </span>
        </Badge>
  );
};
