export type Team = {
  id: number;
  name: string;
  link: string;
};

export type TeamRecord = {
  wins: number;
  losses: number;
  ot: number;
};

export type Game = {
  teams: {
    away: {
      leagueRecord: TeamRecord;
      score: number;
      team: Team;
    };
    home: {
      leagueRecord: TeamRecord;
      score: number;
      team: Team;
    };
  };
  status: {
    abstractGameState: string;
  };
  gameDate: Date;
  gamePk: number;
};

export type GameIdProps = {
  id: number;
};

export type Record = {
  conference: {
    id: number;
    link: string;
    name: string;
  };
  division: {
    abbreviation: string;
    id: number;
    link: string;
    name: string;
    nameShort: string;
  };
  league: {
    id: number;
    link: string;
    name: string;
  };
  teamRecords: [
    {
      divisionRank: string;
      points: number;
      row: number;
      clinchIndicator: string;
      leagueRecord: {
        wins: number;
        losses: number;
        ot: number;
        type: string;
      };
      team: Team;
    }
  ];
};

export type StandingsResponse = {
  copyright: string;
  records: Record[];
};

export type SeasonResponse = {
  copyright: string;
  seasons: [
    {
      seasonId: string;
    }
  ];
};

export type SeasonProps = {
  seasonString: String;
};

export type LeaderProps = {
  season: string;
  category: string;
};

export type Leader = {
  person: {
    fullName: string;
  };
  rank: number;
  season: string;
  team: Team;
  value: string;
};

export type LeagueLeaders = [
  {
    season: string;
    depth: string;
    leaderCategory: string;
    playerStatus: string;
    leaders: Leader[];
  }
];

export type LeaderResponse = {
  copyRight: string;
  leagueLeaders: LeagueLeaders;
};

export type TodayResponse = {
  copyright: string;
  dates: [
    {
      date: string;
      games: Game[];
    }
  ];
  metadata: {
    timeStamp: string;
  };
  totalItems: number;
  totalEvents: number;
  totalGames: number;
  totalMatches: number;
  wait: number;
};

export type LogoImageProps = {
  team: string;
  url: string;
};

// unsure if any of the above types are usable with new API

export type Goal = {
  strength: string;
    name: {
        default: string;
    }
    headshot: string;
    shotType: string;
    timeInPeriod: string;
    teamAbbrev: {
        default: string;
    }
    goalsToDate: number;
}
