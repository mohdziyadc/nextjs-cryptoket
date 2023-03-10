import { useQuery } from "@apollo/client";
import { Loading } from "@web3uikit/core";
import { useMoralis } from "react-moralis";
import NFTBox from "../components/NFTBox";
import GET_ACTIVE_NFTS from "../constants/subGraphQueries";

const NFT_MARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS;

const OwnedNFT = () => {
    const { account, isWeb3Enabled } = useMoralis();
    console.log(account);
    const { loading, error, data } = useQuery(GET_ACTIVE_NFTS, {
        variables: { owner: account },
        skip: !account,
    });
    console.log(`Owned NFTs : ${data?.nfts}`);
    return (
        <>
            {!isWeb3Enabled ? (
                <div className="flex flex-auto justify-center">
                    Connect Wallet
                </div>
            ) : loading ? (
                <div className="flex flex-auto justify-center h-full items-center p-4">
                    <Loading
                        spinnerColor="white"
                        size={10}
                        spinnerType="wave"
                    />
                </div>
            ) : data?.nfts != "" ? (
                <div className="grid grid-cols-4 justify-center items-center gap-4 p-4">
                    {data?.nfts.map((nft) => {
                        const { id, from, to, tokenUri, price } = nft;
                        if (tokenUri) {
                            console.log(`NFT Token URI: ${tokenUri}`);
                        } else {
                            console.log(`NFT Token URI: empty`);
                        }
                        console.log(`Price of NFT: ${price}`);

                        return (
                            <div>
                                <NFTBox
                                    price={price}
                                    tokenId={id}
                                    seller={to}
                                    marketplaceAddress={NFT_MARKET_ADDRESS}
                                    tokenUri={tokenUri}
                                    nftAddress={from}
                                />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex justify-center items-center text-lg text-neutral-800 font-semibold font-mono p-4">
                    You do not own any NFT.
                </div>
            )}
        </>
    );
};

export default OwnedNFT;
