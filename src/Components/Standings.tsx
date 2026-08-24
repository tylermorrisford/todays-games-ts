import React from 'react';
import { Button, Table } from '@commercetools/nimbus';
import { getEndpoint, getRecord } from '../Utils/helpers';
import { StandingsLogoImage } from './LogoImage';
import useSWR from 'swr';
import _ from 'lodash';
import type { StandingsResponse, StandingRecord } from '../types';

type DisplayGroup = 'Division' | 'Conference' | 'League';

export const Standings: React.FunctionComponent = React.memo(() => {
  const [displayGroup, setDisplayGroup] = React.useState<DisplayGroup>('Division');

  const { data } = useSWR<StandingsResponse>(
    getEndpoint('/api/standings/'),
    (url) => fetch(url).then((res) => res.json()),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 3_600_000,
    }
  );

  const leagueStandings = data?.standings ?? [];
  const conferenceStandings = _.sortBy(leagueStandings, ['conferenceName', 'conferenceSequence']);
  const divisionStandings = _.sortBy(leagueStandings, ['conferenceName', 'divisionName', 'divisionSequence']);

  const getDisplayStandings = (): any[] => {
    switch (displayGroup) {
      case 'Conference': return conferenceStandings;
      case 'League': return leagueStandings;
      default: return divisionStandings;
    }
  };

  const getRank = (record: any): number => {
    switch (displayGroup) {
      case 'Conference': return record.conferenceSequence;
      case 'League': return record.leagueSequence;
      default: return record.divisionSequence;
    }
  };

  const groups: DisplayGroup[] = ['Division', 'Conference', 'League'];

  return (
    <div
      style={{
        border: '1px solid whitesmoke',
        borderRadius: '5px',
        padding: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <h3>{displayGroup} Standings</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        {groups.map((g) => (
          <Button
            key={g}
            variant={displayGroup === g ? 'solid' : 'secondary'}
            size="sm"
            onPress={() => setDisplayGroup(g)}
            style={{ width: '32%' }}
          >
            {g}
          </Button>
        ))}
      </div>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Rank</Table.ColumnHeader>
            <Table.ColumnHeader>Team</Table.ColumnHeader>
            <Table.ColumnHeader>Rec</Table.ColumnHeader>
            <Table.ColumnHeader>ROW</Table.ColumnHeader>
            <Table.ColumnHeader>Pts</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {getDisplayStandings().map((record: StandingRecord, idx: number) => (
            <Table.Row key={record.placeName.default + idx}>
              <Table.Cell>{getRank(record)}</Table.Cell>
              <Table.Cell>
                <StandingsLogoImage url={record.teamLogo} team={record.teamName} />
                {' '}{record.teamAbbrev.default}
              </Table.Cell>
              <Table.Cell>{getRecord(record)}</Table.Cell>
              <Table.Cell>{record.regulationPlusOtWins}</Table.Cell>
              <Table.Cell>{record.points}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
});
