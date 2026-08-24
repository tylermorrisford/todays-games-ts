// ─── Shared primitives ───────────────────────────────────────────────────────

export type GameState = 'LIVE' | 'CRIT' | 'FINAL' | 'OFF' | 'FUT' | 'PRE';

export type Odds = {
  providerId: number;
  value: string;
};

export type LocalizedName = {
  default: string;
};

// ─── Schedule ─────────────────────────────────────────────────────────────────

export type ScheduleTeam = {
  abbrev: string;
  logo: string;
  score: number;
  odds: Odds[];
};

export type Game = {
  id: number;
  gameState: GameState;
  startTimeUTC: string;
  awayTeam: ScheduleTeam;
  homeTeam: ScheduleTeam;
};

export type ScheduleResponse = {
  gameWeek: Array<{
    date: string;
    numberOfGames: number;
    games: Game[];
  }>;
};

// ─── Gamecenter ───────────────────────────────────────────────────────────────

export type TvBroadcast = {
  network: string;
  market: string;
  countryCode: string;
};

export type GameClock = {
  running: boolean;
  inIntermission: boolean;
  secondsRemaining: number;
  timeRemaining: string;
};

export type PeriodDescriptor = {
  number: number;
  periodType: string;
  maxRegulationPeriods: number;
};

export type GamecenterTeam = {
  abbrev: string;
  logo: string;
  name: LocalizedName;
  score: number;
  sog?: number;
  radioLink?: string;
};

export type SituationTeam = {
  strength: number;
  situationDescriptions: string[];
};

export type GamecenterResponse = {
  gameState: GameState;
  clock: GameClock;
  periodDescriptor: PeriodDescriptor;
  tvBroadcasts: TvBroadcast[];
  awayTeam: GamecenterTeam;
  homeTeam: GamecenterTeam;
  situation?: {
    timeRemaining: string;
    awayTeam: SituationTeam;
    homeTeam: SituationTeam;
  };
};

// ─── Landing (game detail / modal) ────────────────────────────────────────────

export type ScoringPeriod = {
  periodDescriptor: PeriodDescriptor;
  goals: Goal[];
};

export type LandingResponse = {
  awayTeam: GamecenterTeam;
  homeTeam: GamecenterTeam;
  summary: {
    scoring: ScoringPeriod[];
  };
};

// ─── Standings ────────────────────────────────────────────────────────────────

export type StandingRecord = {
  teamAbbrev: LocalizedName;
  teamName: LocalizedName;
  teamLogo: string;
  placeName: LocalizedName;
  conferenceName: string;
  divisionName: string;
  divisionSequence: number;
  conferenceSequence: number;
  leagueSequence: number;
  wins: number;
  losses: number;
  otLosses: number;
  regulationPlusOtWins: number;
  points: number;
};

export type StandingsResponse = {
  standings: StandingRecord[];
};

// ─── Goal (GoalCard + GameDetailsScoring) ────────────────────────────────────

export type Goal = {
  strength: string;
  name: LocalizedName;
  headshot: string;
  shotType: string;
  timeInPeriod: string;
  teamAbbrev: LocalizedName;
  goalsToDate: number;
  period?: number;
  highlightClipSharingUrl?: string;
};

// ─── Shared component props ───────────────────────────────────────────────────

export type GameIdProps = {
  id: number;
};

export type LogoImageProps = {
  team: string;
  url: string;
};
