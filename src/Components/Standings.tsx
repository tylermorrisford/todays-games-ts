import React from 'react'
import Table from 'react-bootstrap/Table'

interface ResponseObject {
    [key: string]: any
}

export const Standings: React.FunctionComponent = (): JSX.Element => {

    const [standings, setStandings] = React.useState([])

    React.useEffect(() => {
        fetch('https://statsapi.web.nhl.com/api/v1/standings')
        .then(res => res.json())
        .then((data: ResponseObject = {}) => {
            console.log('FULL RES OBJECT', data);
            console.log('STANDINGS data.records', data.records);
            setStandings(data.records)
        })
    }, [])

    return(
        <div className="shadow-sm" style={{border: '1px solid whitesmoke', borderRadius: '5px', padding: '10px'}}>
            <p style={{fontSize: '1.5em'}}>League Standings (regular season)</p>
            <Table responsive borderless hover>
                <thead>
                    <tr>
                        <td>Rank</td>
                        <td>Team</td>
                        <td>ROW</td>
                        <td>Pts</td>
                        <td>p%</td>
                    </tr>
                </thead>
                <tbody>
                {standings.map((conf: any, i: number) => {
                    return conf.teamRecords.map((rec: any, idx: number) => {
                        return <tr key={idx + i}>
                            <td>{rec.divisionRank}</td>
                            <td style={{fontWeight: parseInt(rec.divisionRank) < 4 ? '900' : ''}}>
                                {rec.team.name}{rec.clinchIndicator !== undefined ? <small>{" - "}{rec.clinchIndicator}</small> : ''}
                            </td>
                            <td>{rec.row}</td>
                            <td>{rec.points}</td>
                            <td>{rec.pointsPercentage.toFixed(3)}</td>
                            </tr>
                    })
                })}
                </tbody>
            </Table>
        </div>
    )
}