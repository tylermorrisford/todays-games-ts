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
        if (id !== undefined) { // if id exists, use it to fetch linescore
            fetch(`https://statsapi.web.nhl.com/api/v1/game/${id}/linescore`)
                .then(res => res.json())
                .then((data: ResponseObject = {}) => {
                    // right now we're only using this to get current period and time remaining in the period
                    setPeriod(data.currentPeriodOrdinal)
                    setRemaining(data.currentPeriodTimeRemaining)
                })}
    }, [id])

    return <>
                {period ? 
                <span>{remaining} - {period}</span>
                : <Spinner animation="grow" variant="success" size="sm" />}
           </>

}
