import { gql } from "apollo-boost";

export const LOG_IN = gql`
    query AuthUrl {
        authUrl
    }
`;
