import { BASE_URL } from '../constants';
import dayjs from 'dayjs';

var utc = require('dayjs/plugin/utc')
var isToday = require('dayjs/plugin/isToday')
var isTomorrow = require('dayjs/plugin/isTomorrow')
dayjs.extend(utc)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)

export const getEndpoint = (path: string) => {
  return `${BASE_URL}${path}`;
};

export const getPeriod = (period: number): string => {
  switch (period) {
    case 1:
      return '1st';
    case 2:
      return '2nd';
    case 3:
      return '3rd';
    case 4:
      return 'OT';
    case 5:
      return 'SO';
    default:
      return 'not found';
  }
};

export const getRecord = (recObj: Object | any): string => {
  return `${recObj.wins}-${recObj.losses}-${recObj.otLosses}`;
};

export const isGameLive = (gameState: string): boolean => {
  return gameState === "LIVE" || gameState === "CRIT";
}

export const showScoring = (gameState: string): boolean => {
  return gameState === "LIVE" 
  || gameState === "CRIT" 
  || gameState === "FINAL" 
  || gameState === "OFF" 
  || gameState === "OT" 
  || gameState === "SO";
}

export const isPreGame = (gameState: string, gameStartTime: string): boolean => {
  return gameState === "PRE" || gameState === "FUT";
}

export const showOdds = (gameState: string, gameStartTime: string) => {
  if (isPreGame(gameState, gameStartTime)) {
    const today = dayjs().utc().format();
    const gameTime = dayjs(gameStartTime).utc().format();
    // only show odds for games within 1 day of today
  return Math.abs(dayjs(today).diff(dayjs(gameTime), 'day')) < 1;
  } else {
    return false;
  }
  }

export const parseOdds = (odds: Array<{providerId: number, value: string}>) => {
  if (odds.some(o => o.providerId === 9)) {
    return Math.floor(parseInt(odds.find(o => o.providerId === 9)?.value!));
  } else if (odds.some(o => o.providerId === 7)) {
    return Math.floor(parseInt(odds.find(o => o.providerId === 7)?.value!));
  } else if (odds.some(o => o.providerId === 2)) {
    return Math.floor(parseInt(odds.find(o => o.providerId === 2)?.value!));
  } else {
    return parseInt(odds[0].value);
  }
}
