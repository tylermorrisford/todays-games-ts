import React from 'react';
import { Card, SkeletonText } from '@commercetools/nimbus';

const LoadingGames: React.FunctionComponent = () => {
  return (
    <>
      {Array.from(Array(5).keys()).map((i: number) => (
        <Card.Root key={i} variant="elevated" size="sm" marginTop="200">
          <Card.Body>
            <SkeletonText lines={2} />
          </Card.Body>
        </Card.Root>
      ))}
    </>
  );
};

export default LoadingGames;
