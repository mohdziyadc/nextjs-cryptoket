import { Form } from "@web3uikit/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import useNftMarket from "../hooks/nftMarket";
import NFTMarket from "../constants/NFTMarket.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification, Button, Tooltip } from "@web3uikit/core";

const NFT_MARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS;
const CONTRACT_OWNER = process.env.NEXT_PUBLIC_CONTRACT_OWNER;
const createNFT = () => {
    const { chainId, isWeb3Enabled, account } = useMoralis();
    const [isLoading, setIsLoading] = useState(false);
    const [mintBtnText, setMintBtnText] = useState("Mint");
    const { createNftTokenUri } = useNftMarket();

    const { runContractFunction } = useWeb3Contract();

    useEffect(() => {}, [isWeb3Enabled]);

    const dispatch = useNotification();

    const handleSuccessNotification = () => {
        dispatch({
            type: "success",
            message: "NFT Minted",
            title: "Minting success",
            position: "topR",
        });
    };

    const handleWithdrawSuccessNotification = () => {
        dispatch({
            type: "success",
            message: "Withdrew proceeds",
            title: "Withdrawal success",
            position: "topR",
        });
    };
    const handleWithdrawFailNotification = () => {
        dispatch({
            type: "error",
            message: "Check contract balance",
            title: "Withdrawal error",
            position: "topR",
        });
    };

    const { runContractFunction: withdrawProceeds } = useWeb3Contract({
        abi: NFTMarket.abi,
        contractAddress: NFT_MARKET_ADDRESS,
        functionName: "withdrawFunds",
        params: {},
    });

    const handleWithdrawProceeds = () => {
        withdrawProceeds({
            onError: (e) => {
                handleWithdrawFailNotification();
                console.log(e);
            },
            onSuccess: async (tx) => {
                try {
                    const reciept = await tx.wait();
                    console.log(reciept);
                } catch (e) {
                    console.log(e);
                }
                handleWithdrawSuccessNotification();
            },
        });
    };

    // const nftMarket = new Contract(NFT_MARKET_ADDRESS, NFTMarket.abi, signer);

    const submitNFT = async (form) => {
        console.log("nft submitted");
        setIsLoading(true);
        setMintBtnText("Minting");
        if (form.data[2].inputResult == "") {
            alert("No image found for NFT");
            return;
        }

        const nftName = form.data[0].inputResult;
        const nftDescription = form.data[1].inputResult;
        const nftImage = form.data[2].inputResult;

        const nftValues = {
            name: nftName,
            desc: nftDescription,
            image: nftImage,
        };

        const tokenUri = await createNftTokenUri(nftValues);
        console.log(`Token URI: ${tokenUri}`);

        const params = {
            abi: NFTMarket.abi,
            contractAddress: NFT_MARKET_ADDRESS,
            functionName: "mintNFT",
            params: {
                tokenURI: tokenUri,
            },
        };

        try {
            console.log("Minting......");
            await runContractFunction({
                params: params,
                onSuccess: async (tx) => {
                    setIsLoading(false);
                    const reciept = await tx.wait();
                    reciept
                        ? setMintBtnText("Minted")
                        : setMintBtnText("Minting");
                    console.log(reciept);
                    handleSuccessNotification();
                },
                onError: (e) => {
                    setIsLoading(false);
                    setMintBtnText("Failed");
                    console.log(e);
                },
            });
            // const transaction = await nftMarket.mintNFT(tokenUri);
            // const reciept = await transaction.wait();
            // console.log(reciept);
        } catch (e) {
            console.log(e);
        }

        // console.log(nftName);
        // console.log(nftDescription);
        // console.log(nftImage);
    };
    return (
        <>
            {isWeb3Enabled ? (
                <div className="flex flex-col h-screen justify-center items-center -mt-1 bg-gradient-to-r from-blue-400 to-emerald-400">
                    <div>
                        <Form
                            onSubmit={submitNFT}
                            buttonConfig={{
                                isLoading: isLoading,
                                loadingText: mintBtnText,
                                text: mintBtnText,
                                theme: "custom",
                                customize: {
                                    backgroundColor: "#FFC300",
                                    color: "black",
                                    fontSize: "14px",
                                    onHover: "darken",
                                    padding: "6px 12px",
                                },
                            }}
                            data={[
                                {
                                    name: "Name",
                                    type: "text",
                                    inputWidth: "100%",
                                    value: "",
                                    key: "nftName",
                                    validation: {
                                        required: true,
                                    },
                                },
                                {
                                    name: "Description",
                                    type: "text",
                                    inputWidth: "100%",
                                    value: "",
                                    validation: {
                                        required: true,
                                    },
                                    key: "nftDescription",
                                },
                                {
                                    name: "Image",
                                    type: "file",
                                    value: "",
                                    inputWidth: "100%",
                                    key: "nftImage",
                                    validation: {
                                        required: true,
                                    },
                                },
                            ]}
                            title="Create an NFT"
                            id="createForm"
                        ></Form>
                    </div>

                    <div className="p-4">
                        {account === CONTRACT_OWNER.toLowerCase() ? (
                            <Button
                                onClick={() => handleWithdrawProceeds()}
                                text="Withdraw Proceeds"
                                theme="secondary"
                            />
                        ) : (
                            <Tooltip
                                content={"You are not the owner"}
                                position="top"
                                maxWidth={300}
                                minWidth={180}
                            >
                                <Button
                                    onClick={() => console.log("clicked")}
                                    text="Withdraw Proceeds"
                                    theme="secondary"
                                    disabled={true}
                                />
                            </Tooltip>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-auto justify-center">
                    Connect Wallet
                </div>
            )}
        </>
    );
};

export default createNFT;
