import React from "react";
import { Badge, LoadingSpinner } from "@commercetools/nimbus";
import useSWR, { mutate } from "swr";
import { getEndpoint, getPeriod, isGameLive } from "../Utils/helpers";
import { LogoImage } from "./LogoImage";

interface GameDetailsBodyProps {
  showGameModal: boolean;
  gameId: number;
  gameState?: string;
}

interface GameClock {
  inIntermission: boolean;
  running: boolean;
  secondsRemaining: number;
  timeRemaining: string;
}

interface PeriodDescriptor {
  maxRegulationPeriods: number;
  number: number;
  periodType: string;
}

const gameClockManager = (
  state: string,
  clock: GameClock,
  periodDescriptor: PeriodDescriptor,
  tvBroadcasts: Array<any>,
): string => {
  if (clock?.inIntermission) {
    return `${getPeriod(periodDescriptor.number)} Int`;
  }
  if (state === "OFF" || state === "FINAL") {
    return `Final - ${getPeriod(periodDescriptor.number)}`;
  }
  if ((state === "FUT" || state === "PRE") && tvBroadcasts?.length) {
    const preferred = tvBroadcasts.filter(
      (b) => b.network === "NHLN" || b.market === "H",
    );
    const broadcasts =
      preferred.length > 0 ? preferred : tvBroadcasts.slice(0, 1);
    return `on ${broadcasts.map((b) => `${b.network} (${b.countryCode})`).join(", ")}`;
  }
  if (state === "LIVE" || state === "CRIT") {
    return clock?.timeRemaining + " - " + getPeriod(periodDescriptor.number);
  }
  return "";
};

const GameDetailsBody: React.FunctionComponent<GameDetailsBodyProps> = ({
  showGameModal,
  gameId,
  gameState,
}) => {
  const { data, error, isLoading } = useSWR(
    showGameModal ? [getEndpoint(`/api/gamecenter`), gameId] : null,
    async ([url, id]) => {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      return response.json();
    },
  );

  React.useEffect(() => {
    if (gameState && isGameLive(gameState)) {
      const interval = setInterval(() => {
        mutate([getEndpoint(`/api/gamecenter`), gameId]);
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [gameState, gameId]);

  const centerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "130px",
    paddingBottom: "15px",
  };

  if (isLoading)
    return (
      <div style={centerStyle}>
        <LoadingSpinner size="sm" aria-label="Loading game details" />
      </div>
    );
  if (error)
    return (
      <div style={centerStyle}>failed to load: {JSON.stringify(error)}</div>
    );
  const clockLabel = gameClockManager(data?.gameState, data?.clock, data?.periodDescriptor, data?.tvBroadcasts);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10%",
          paddingBottom: "15px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <LogoImage url={data?.awayTeam?.logo} team={data?.awayTeam?.abbrev} />
          <br />
          {data?.awayTeam?.name?.default}
          <br />
          <strong>{data?.awayTeam?.score}</strong>
          <br />
          {data?.awayTeam?.sog && <small>SOG: {data?.awayTeam?.sog}</small>}
          <br />
          {data?.situation?.awayTeam?.situationDescriptions?.length > 0 && (
            <small style={{ color: "green" }}>
              {data?.situation?.awayTeam?.situationDescriptions[0]}-
              {data?.situation?.awayTeam?.strength} on{" "}
              {data?.situation?.homeTeam?.strength}
              <br />
              {data?.situation?.timeRemaining}
            </small>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {clockLabel && (
            <Badge
              colorPalette={
                data?.clock?.running
                  ? "positive"
                  : data?.clock?.inIntermission
                    ? "warning"
                    : "neutral"
              }
            >
              {clockLabel}
            </Badge>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <LogoImage url={data?.homeTeam?.logo} team={data?.homeTeam?.abbrev} />
          <br />
          {data?.homeTeam?.name?.default}
          <br />
          <strong>{data?.homeTeam?.score}</strong>
          <br />
          {data?.homeTeam?.sog && <small>SOG: {data?.homeTeam?.sog}</small>}
          <br />
          {data?.situation?.homeTeam?.situationDescriptions?.length > 0 && (
            <small style={{ color: "green" }}>
              {data?.situation?.homeTeam?.situationDescriptions[0]}-
              {data?.situation?.homeTeam?.strength} on{" "}
              {data?.situation?.awayTeam?.strength}
              <br />
              {data?.situation?.timeRemaining}
            </small>
          )}
        </div>
      </div>
    </>
  );
};

export default GameDetailsBody;
