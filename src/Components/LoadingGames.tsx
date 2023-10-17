import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Card } from 'react-bootstrap';

const LoadingGames: React.FunctionComponent = (): JSX.Element => {
  return (
    <>
      {Array.from(Array(5).keys()).map((i: number) => {
        return (
          <Card
            key={i}
            className='shadow-sm mt-2 p-2'
            style={{
              width: '100%',
              height: '100%',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '1.3em',
              border: '1px solid whitesmoke',
            }}
          >
            
              <Skeleton count={2} />
            
          </Card>
        );
      })}
    </>
  );
};

export default LoadingGames;
