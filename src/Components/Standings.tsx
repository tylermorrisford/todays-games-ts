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
        <Table responsive borderless hover>
            <thead>
                <tr>
                    <td>Rank</td>
                    <td>Team</td>
                    <td>Pts</td>
                </tr>
            </thead>
            {standings.map((conf: any) => {
                return conf.teamRecords.map((rec: any, i: number) => {
                    return <tr key={i}>
                        <td>{rec.divisionRank}</td>
                        <td style={{fontWeight: parseInt(rec.divisionRank) < 4 ? '900' : ''}}>
                            {rec.team.name}{rec.clinchIndicator !== "" ? <small>{rec.clinchIndicator}</small> : ''}
                        </td>
                        <td>{rec.points}</td>
                        </tr>
                })
            })}

        </Table>
    )
}