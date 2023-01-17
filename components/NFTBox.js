import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import Image from "next/image";
import { ethers } from "ethers";
import { Card } from "@web3uikit/core";
import DialogBox from "./DialogBox";
import { useNotification } from "@web3uikit/core";
import NFTMarket from "../constants/NFTMarket.json";

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr;

    const separator = "...";
    const seperatorLength = separator.length;
    const charsToShow = strLen - seperatorLength;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    );
};

export default function NFTBox({
    price,
    nftAddress,
    tokenId,
    marketplaceAddress,
    seller,
    tokenUri,
}) {
    const { isWeb3Enabled, account } = useMoralis();
    const [imageURI, setImageURI] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [tokenDescription, setTokenDescription] = useState("");
    const [showModal, setShowModal] = useState(false);
    const hideModal = () => setShowModal(false);
    const dispatch = useNotification();

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: NFTMarket.abi,
        contractAddress: marketplaceAddress,
        functionName: "buyNFT",
        msgValue: price,
        params: {
            tokenId: tokenId,
        },
    });

    async function updateUI() {
        const tokenURI = tokenUri;
        console.log(`The TokenURI is ${tokenURI}`);
        // We are going to cheat a little here...
        if (tokenURI) {
            // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
            const requestURL = tokenURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            );
            const tokenURIResponse = await (await fetch(requestURL)).json();
            const imageURI = tokenURIResponse.image;
            const imageURIURL = imageURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            );
            setImageURI(imageURIURL);
            setTokenName(tokenURIResponse.name);
            setTokenDescription(tokenURIResponse.description);
            // We could render the Image on our sever, and just call our sever.
            // For testnets & mainnet -> use moralis server hooks
            // Have the world adopt IPFS
            // Build our own IPFS gateway
        }
        // get the tokenURI
        // using the image tag from the tokenURI, get the image
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const isOwnedByUser = seller === account || seller === undefined;
    const formattedSellerAddress = isOwnedByUser
        ? "you"
        : truncateStr(seller || "", 15);
    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: async (tx) => {
                      try {
                          const reciept = await tx.wait();
                          console.log(reciept);
                      } catch (e) {
                          console.log(e);
                      }
                      handleBuyItemSuccess();
                  },
              });
    };

    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        });
    };

    const tokenID = tokenId;
    console.log(`The image URI is: ${imageURI}`);
    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <DialogBox
                            isVisible={showModal}
                            tokenId={tokenID}
                            onClose={hideModal}
                            price={price}
                            isOwnedByUser={isOwnedByUser}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>#{tokenId}</div>
                                    <div className="italic text-sm">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        alt="NFT"
                                        height="200"
                                        width="200"
                                    />
                                    <div className="font-bold">
                                        {ethers.utils.formatUnits(
                                            price,
                                            "ether"
                                        )}{" "}
                                        ETH
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
}
