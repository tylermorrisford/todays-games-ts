export const getRecord = (recObj: Object | any): string => {
        return `${recObj.wins}-${recObj.losses}-${recObj.ot}`
    }

export const getSeason = (seasString: String): string => {
        return seasString.substring(0,4) + '-' + seasString.substring(4)
    }
