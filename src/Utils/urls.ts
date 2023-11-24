import { BASE_URL } from "../constants";

export const getEndpoint = (path: string) => {
    return `${BASE_URL}${path}`;
    }