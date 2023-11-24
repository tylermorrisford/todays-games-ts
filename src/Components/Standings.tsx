import React from 'react';
import Table from 'react-bootstrap/Table';
import { Record, StandingsResponse, SeasonProps } from '../types';
import { getEndpoint, getRecord } from '../Utils/helpers';
import { StandingsLogoImage } from './LogoImage';

export const Standings: React.FunctionComponent = (): JSX.Element => {
  const [standings, setStandings] = React.useState<any[]>([]);
  const [standingsDate, setStandingsDate] = React.useState<string>('');

  React.useEffect(() => {
    fetch(getEndpoint('/api/standings/'))
      .then((res) => res.json())
      .then((data: any) => {
        setStandings(data?.standings);
        setStandingsDate(data?.standings[0].date);
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
          {standings.map((record, idx) => {
            return (
              <tr key={record.placeName.default + idx}>
                <td>{record.leagueSequence}</td>
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
