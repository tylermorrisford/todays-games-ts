import React from 'react';
import { Badge, LoadingSpinner } from '@commercetools/nimbus';
import useSWR from 'swr';
import type { GameIdProps, GamecenterResponse } from '../types';
import { getPeriod, getEndpoint } from '../Utils/helpers';

export const GameStatus: React.FunctionComponent<GameIdProps> = ({ id }) => {
  const { data, isLoading } = useSWR<GamecenterResponse>(
    [getEndpoint('/api/gamecenter'), id],
    async ([url, gameId]) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: gameId }),
      });
      return response.json();
    },
    { refreshInterval: 30_000 }
  );

  if (isLoading || !data) {
    return <LoadingSpinner size="xs" aria-label="Loading game status" />;
  }

  const { clock, periodDescriptor } = data;

  return (
    <Badge colorPalette={clock.running ? 'positive' : clock.inIntermission ? 'warning' : 'neutral'}>
      {clock.timeRemaining} - {clock.inIntermission ? 'Int' : getPeriod(periodDescriptor.number)}
    </Badge>
  );
};
