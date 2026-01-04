import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
// import { Record, StandingsResponse, SeasonProps } from '../types';
import { getEndpoint, getRecord } from '../Utils/helpers';
import { StandingsLogoImage } from './LogoImage';
import _ from 'lodash';

export const Standings: React.FunctionComponent = React.memo((): JSX.Element => {
  const [leagueStandings, setLeagueStandings] = React.useState<any[]>([]);
  const [conferenceStandings, setConferenceStandings] = React.useState<any[]>([]);
  const [divisionStandings, setDivisionStandings] = React.useState<any[]>([]);
  const [displayGroup, setDisplayGroup] = React.useState<'Division' | 'Conference' | 'League'>('Division');

  const getDisplayStandings = (displayString: string) => {
    switch (displayString) {
      case 'Division':
        return divisionStandings;
      case 'Conference':
        return conferenceStandings;
      case 'League':
        return leagueStandings;
      default:
        return divisionStandings;
    }
  }

  const getRank = (record: any): number => {
    switch(displayGroup) {
      case 'Division':
        return record.divisionSequence;
      case 'Conference':
        return record.conferenceSequence;
      case 'League':
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
        setConferenceStandings(_.sortBy(data?.standings, ['conferenceName','conferenceSequence']));
        setDivisionStandings(_.sortBy(data?.standings, ['conferenceName','divisionName','divisionSequence']));
      });
  }, []);

  const buttonStyle = {
    border: '1px solid grey',
    borderRadius: '5px',
    padding: '5px',
    margin: '5px',
    width: '40%',
    backgroundColor: 'white',
    color: 'black',
  };

  return (
    <div
      className='shadow-sm'
      style={{
        border: '1px solid whitesmoke',
        borderRadius: '5px',
        padding: '10px',
      }}
    >
      <h3>{displayGroup} Standings</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => setDisplayGroup('Division')} style={buttonStyle}>Division</Button>
        <Button onClick={() => setDisplayGroup('Conference')} style={buttonStyle}>Conference</Button>
        <Button onClick={() => setDisplayGroup('League')} style={buttonStyle}>League</Button>
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
});
