import { useQuery, gql } from "@apollo/client";
import { useMoralis } from "react-moralis";

const GET_ACTIVE_ITEMS = gql`
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

export default function GraphExample() {
  const { account } = useMoralis();
  console.log(account);
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS, {
    variables: { owner: account },
  });
  console.log(data);
  return <div>hi</div>;
}
