import { gql } from "@apollo/client";

const GET_ACTIVE_NFTS = gql`
    query GetOwnedNfts($owner: Bytes!) {
        nfts(where: { to: $owner }) {
            id
            from
            to
            tokenUri
            price
        }
    }
`;

export default GET_ACTIVE_NFTS;
