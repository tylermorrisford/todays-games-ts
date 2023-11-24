import React from "react";
import { LogoImageProps } from "../types"; 

export const LogoImage = ({ url, team }: LogoImageProps): JSX.Element => {
    return <img src={url} alt={`${team}_logo`} width='40px' height='40px' />;
  };

export const StandingsLogoImage = ({ url, team }: LogoImageProps): JSX.Element => {
    return <img src={url} alt={`${team}_logo`} width='30px' height='30px' />;
  }
