import { BASE_URL } from '../constants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { StandingRecord, Odds } from '../types';

dayjs.extend(utc);

export const getEndpoint = (path: string) => {
  return `${BASE_URL}${path}`;
};

export const getPeriod = (period: number): string => {
  switch (period) {
    case 1: return '1st';
    case 2: return '2nd';
    case 3: return '3rd';
    case 4: return 'OT';
    case 5: return 'SO';
    default: return '';
  }
};

export const getRecord = (record: StandingRecord): string => {
  return `${record.wins}-${record.losses}-${record.otLosses}`;
};

export const isGameLive = (gameState: string): boolean => {
  return gameState === 'LIVE' || gameState === 'CRIT';
};

export const isGameScored = (gameState: string): boolean => {
  return gameState === 'LIVE' || gameState === 'CRIT' || gameState === 'FINAL' || gameState === 'OFF';
};

export const isPreGame = (gameState: string): boolean => {
  return gameState === 'PRE' || gameState === 'FUT';
};

export const showScoring = (gameState: string): boolean => {
  return gameState === 'LIVE'
    || gameState === 'CRIT'
    || gameState === 'FINAL'
    || gameState === 'OFF'
    || gameState === 'OT'
    || gameState === 'SO';
};

export const showOdds = (gameState: string, gameStartTime: string, odds: Odds[]): boolean => {
  if (!odds || !isPreGame(gameState)) return false;
  const today = dayjs().utc().format();
  const gameTime = dayjs(gameStartTime).utc().format();
  return Math.abs(dayjs(today).diff(dayjs(gameTime), 'day')) < 1;
};

export const parseOdds = (odds: Odds[]): number => {
  const pick = (providerId: number) => odds.find(o => o.providerId === providerId);
  const preferred = pick(9) ?? pick(7) ?? pick(2) ?? odds[0];
  return Math.floor(parseInt(preferred.value));
};
