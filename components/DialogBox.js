import { Modal, Input, useNotification, Loading } from "@web3uikit/core";
import { useWeb3Contract } from "react-moralis";
import NFTMarket from "../constants/NFTMarket.json";
import { useState } from "react";
import { ethers } from "ethers";
import { Cross } from "@web3uikit/icons";

const NFT_MARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS;
export default function DialogBox({
    isVisible,
    tokenId,
    onClose,
    price,
    isOwnedByUser,
}) {
    const [listingPrice, setListingPrice] = useState(0);
    const [isListing, setIsListing] = useState(false);
    const [cancelListing, setCancelListing] = useState(false);

    const dispatch = useNotification();

    const handleListingSuccess = (listing, cancelling) => {
        if (listing && !cancelling) {
            dispatch({
                type: "success",
                message: "NFT Listed",
                title: "Listing success",
                position: "topR",
            });

            onClose && onClose();
            setIsListing(false);
        } else {
            dispatch({
                type: "success",
                message: "Cancelled Listing",
                title: "Cancel Success",
                position: "topR",
            });

            onClose && onClose();
            setCancelListing(false);
        }
    };

    const { runContractFunction: listNFT } = useWeb3Contract({
        abi: NFTMarket.abi,
        contractAddress: NFT_MARKET_ADDRESS,
        functionName: "listNFT",
        params: {
            tokenId: tokenId,
            price: ethers.utils.parseEther(listingPrice || "0.001"),
        },
    });

    const { runContractFunction: cancelListingNFT } = useWeb3Contract({
        abi: NFTMarket.abi,
        contractAddress: NFT_MARKET_ADDRESS,
        functionName: "cancelListing",
        params: {
            tokenId: tokenId,
        },
    });

    const wei = 10 ** -18;

    return price != "0" && isOwnedByUser ? (
        <div>
            <Modal
                isVisible={isVisible}
                onCancel={onClose}
                onCloseButtonPressed={onClose}
                okText="Cancel Listing"
                title={`Cancel listing of NFT #${tokenId}`}
                hasCancel={false}
                onOk={() => {
                    setCancelListing(true);
                    cancelListingNFT({
                        onError: (e) => {
                            if (
                                e.message.includes(
                                    "MetaMask Tx Signature: User denied"
                                )
                            ) {
                                onClose && onClose();
                                dispatch({
                                    type: "error",
                                    message: "You cancelled the transaction",
                                    title: "Transaction Rejected",
                                    position: "topR",
                                });
                            }
                        },
                        onSuccess: async (tx) => {
                            setCancelListing(true);

                            console.log(`cancelListing: ${cancelListing}`);

                            console.log("Cancelled listing of this NFT");

                            try {
                                const reciept = await tx.wait();
                                console.log(reciept);
                            } catch (e) {
                                console.log(e);
                            }
                            handleListingSuccess(false, true);
                        },
                    });
                }}
            >
                <div className="flex flex-col justify-center items-center p-4">
                    {cancelListing ? (
                        <Loading
                            size={20}
                            spinnerColor="#2E7DAF"
                            text="Cancelling..."
                        />
                    ) : (
                        <>
                            <Cross fontSize={64} />

                            <div className="p-2 font-semibold font-sans">
                                Are you sure?
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    ) : (
        <div>
            <Modal
                isVisible={isVisible}
                onCancel={onClose}
                onCloseButtonPressed={onClose}
                onOk={() => {
                    setIsListing(true);
                    listNFT({
                        onError: (e) => console.log(e),
                        onSuccess: async (tx) => {
                            console.log("Listed this NFT");
                            console.log(`isListing: ${isListing}`);
                            try {
                                const reciept = await tx.wait();
                                console.log(reciept);
                            } catch (e) {
                                console.log(e);
                            }

                            handleListingSuccess(true, false);
                        },
                    });
                }}
                okText="List"
                title={`List NFT #${tokenId}`}
            >
                <div className="flex flex-row justify-center items-center p-4">
                    {isListing ? (
                        <Loading
                            size={20}
                            spinnerColor="#2E7DAF"
                            text="Listing..."
                        />
                    ) : (
                        <>
                            <Input
                                label="Price"
                                placeholder="Listing price"
                                type="number"
                                onChange={(event) => {
                                    setListingPrice(event.target.value);
                                }}
                                validation={{
                                    min: wei,
                                }}
                            />
                            <div className="p-2 font-semibold font-sans">
                                ETH
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
}
