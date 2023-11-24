import React from 'react'
import Table from 'react-bootstrap/Table'
import { Record, StandingsResponse, SeasonProps } from '../types'
import trimName from '../Utils/trim'
import { lastInDivision } from '../constants'
import {getRecord, getSeason} from '../Utils/standings'
import { getEndpoint } from '../Utils/urls'
import { StandingsLogoImage } from './LogoImage'

export const Standings: React.FunctionComponent = (): JSX.Element => {

    const [standings, setStandings] = React.useState<any[]>([])
    const [standingsDate, setStandingsDate] = React.useState<string>('')

    React.useEffect(() => {
        fetch(getEndpoint('/api/standings/'))
        .then(res => res.json())
        .then((data: any) => {
            console.log('STANDINGS data.standings', data.standings);
            setStandings(data?.standings)
            setStandingsDate(data?.standings[0].date)
        })
    }, [])

    return(
        <div className="shadow-sm" style={{border: '1px solid whitesmoke', borderRadius: '5px', padding: '10px'}}>
            <p style={{fontSize: '1.5em'}}>Standings as of {standingsDate}</p>
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

                {standings.map(record => {
                    return <tr key={record.placeName.default}>
                        <td>{record.leagueSequence}</td>
                        <td>
                            <span>
                                <StandingsLogoImage url={record.teamLogo} team={record.teamName} />
                                {" "}{record.placeName.default}
                            </span>
                        </td>
                        <td>{getRecord(record)}</td>
                        <td>{record.regulationPlusOtWins}</td>
                        <td>{record.points}</td>
                        </tr>
                })}
                {/* {standings.map((conf: any, i: number) => {
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
                })} */}
                </tbody>
            </Table>
        </div>
    )
}