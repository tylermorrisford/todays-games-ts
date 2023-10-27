import React from 'react'
import Table from 'react-bootstrap/Table'
import { Record, StandingsResponse, SeasonProps } from '../types'
import trimName from '../Utils/trim'
import { lastInDivision } from '../constants'
import {getRecord, getSeason} from '../Utils/standings'

export const Standings: React.FunctionComponent<SeasonProps> = ({seasonString}): JSX.Element => {

    const [standings, setStandings] = React.useState<Record[]>([])

    React.useEffect(() => {
        fetch('https://statsapi.web.nhl.com/api/v1/standings')
        .then(res => res.json())
        .then((data: StandingsResponse) => {
            console.log('STANDINGS data.records', data.records);
            console.log('STANDINGS data', data);
            setStandings(data.records)
        })
    }, [])

    return(
        <div className="shadow-sm" style={{border: '1px solid whitesmoke', borderRadius: '5px', padding: '10px'}}>
            <p style={{fontSize: '1.5em'}}>Standings {getSeason(seasonString)}</p>
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
                {standings.map((conf: any, i: number) => {
                    return conf.teamRecords.map((rec: any, idx: number) => {
                        return <React.Fragment key={rec.team.id}>
                            <tr>
                                <td>{rec.divisionRank}</td>
                                <td style={{fontWeight: parseInt(rec.divisionRank) < 4 ? '900' : ''}}>
                                    {window.innerWidth < 768 ? trimName(rec.team.name) : rec.team.name}{rec.clinchIndicator !== undefined ? <small>{" - "}{rec.clinchIndicator}</small> : ''}
                                </td>
                                <td>{getRecord(rec.leagueRecord)}</td>
                                <td>{rec.row}</td>
                                <td>{rec.points}</td>
                            </tr>
                            {rec.divisionRank === lastInDivision && i !== 3 && <tr><td><hr style={{padding: 0}}/></td></tr>}
                            </React.Fragment>
                    })
                })}
                </tbody>
            </Table>
        </div>
    )
}