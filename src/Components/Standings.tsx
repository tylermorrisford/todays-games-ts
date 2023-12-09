import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Record, StandingsResponse, SeasonProps } from '../types';
import { getEndpoint, getRecord } from '../Utils/helpers';
import { StandingsLogoImage } from './LogoImage';
import _ from 'lodash';

export const Standings: React.FunctionComponent = (): JSX.Element => {
  const [leagueStandings, setLeagueStandings] = React.useState<any[]>([]);
  const [conferenceStandings, setConferenceStandings] = React.useState<any[]>([]);
  const [divisionStandings, setDivisionStandings] = React.useState<any[]>([]);
  const [displayGroup, setDisplayGroup] = React.useState<'division' | 'conference' | 'league'>('division');
  const [standingsDate, setStandingsDate] = React.useState<string>('');

  const getDisplayStandings = (displayString: string) => {
    switch (displayString) {
      case 'division':
        return divisionStandings;
      case 'conference':
        return conferenceStandings;
      case 'league':
        return leagueStandings;
      default:
        return divisionStandings;
    }
  }

  const getRank = (record: any): number => {
    switch(displayGroup) {
      case 'division':
        return record.divisionSequence;
      case 'conference':
        return record.conferenceSequence;
      case 'league':
        return record.leagueSequence;
      default:
        return record.divisionSequence;
    }
  }

  React.useEffect(() => {
    fetch(getEndpoint('/api/standings/'))
      .then((res) => res.json())
      .then((data: any) => {
        console.log('standings data', data);
        setLeagueStandings(data?.standings);
        setStandingsDate(data?.standings[0].date);
        setConferenceStandings(_.sortBy(data?.standings, ['conferenceName','conferenceSequence']));
        setDivisionStandings(_.sortBy(data?.standings, ['conferenceName','divisionName','divisionSequence']));
      });
  }, []);

  return (
    <div
      className='shadow-sm'
      style={{
        border: '1px solid whitesmoke',
        borderRadius: '5px',
        padding: '10px',
      }}
    >
      <p style={{ fontSize: '1.5em' }}>Standings as of {standingsDate}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span><Button onClick={() => setDisplayGroup('division')} size="sm" variant="outline-dark">Division</Button></span>
        <span><Button onClick={() => setDisplayGroup('conference')} size="sm" variant="outline-dark">Conference</Button></span>
        <span><Button onClick={() => setDisplayGroup('league')} size="sm" variant="outline-dark">League</Button></span>
      </div>
      <Table responsive borderless hover>
        <thead>
          <tr>
            <td>Rank</td>
            <td>Team</td>
            <td>Rec</td>
            <td>ROW</td>
            <td>Pts</td>
          </tr>
        </thead>
        <tbody>
          {getDisplayStandings(displayGroup).map((record, idx) => {
            return (
              <tr key={record.placeName.default + idx}>
                <td>{getRank(record)}</td>
                <td>
                  <span>
                    <StandingsLogoImage
                      url={record.teamLogo}
                      team={record.teamName}
                    />{' '}
                    {record.teamAbbrev.default}
                  </span>
                </td>
                <td>{getRecord(record)}</td>
                <td>{record.regulationPlusOtWins}</td>
                <td>{record.points}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
