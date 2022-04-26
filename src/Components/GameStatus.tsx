import React from 'react'
import Spinner from 'react-bootstrap/Spinner'

interface GameIdProps {
    id: number,
}

interface ResponseObject {
    [key: string]: any
}


export const GameStatus: React.FunctionComponent<GameIdProps> = ({id}): JSX.Element => {
    const [period, setPeriod] = React.useState('')
    const [remaining, setRemaining] = React.useState('')

    React.useEffect(() => {
        if (id !== undefined) { // if season exists, use it to fetch leaders
            fetch(`https://statsapi.web.nhl.com/api/v1/game/${id}/linescore`)
                .then(res => res.json())
                .then((data: ResponseObject = {}) => {
                    // console.log(`${category} leaders`, data)
                    setPeriod(data.currentPeriodOrdinal)
                    setRemaining(data.currentPeriodTimeRemaining)
                })}
    }, [id])


    return <>{period ? <span>{period} - {remaining}</span>: <Spinner animation="grow" variant="success" size="sm" />}</>


}