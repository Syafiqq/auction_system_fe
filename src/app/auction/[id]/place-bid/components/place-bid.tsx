"use client";

import React, {useEffect, useState} from 'react';
import {useAuth} from "@/app/_providers/auth-provider";
import auctionRepository from "@/data/repository/auction-repository";
import {showToast} from "@/app/_toastify/toast-helper";
import {NotFoundException} from "@/common/error/not-found-exception";
import {useRouter} from "next/navigation";
import {AuctionDetailResponseDto} from "@/domain/definition/dto/auction-detail-response-dto.definition";
import {FormValidationError} from "@/common/error/form-validation-error";
import {IdResponseDto} from "@/domain/definition/dto/id-response-dto.definition";
import ReactTimeAgo from "react-time-ago";
import {nullableStringToDateLocal} from "@/common/extension/date-extension";

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import Countdown from "@/app/auction/[id]/place-bid/components/countdown";
import {AuctionListCurrentPriceResponseDto} from "@/domain/definition/dto/auction-list-response-dto.definition";
import bidRepository from "@/data/repository/bid-repository";
import {NewerBidPlacedException} from "@/common/error/newer-bid-placed-exception";
import {SessionEndException} from "@/common/error/session-end-exception";

TimeAgo.addDefaultLocale(en)

interface AuctionPlaceBidProps {
    id: string
}

const AuctionPlaceBid = ({id}: AuctionPlaceBidProps) => {
    const router = useRouter();
    const authProvider = useAuth();
    const [data, setData] = useState<AuctionDetailResponseDto | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isExpired, setExpiration] = useState(false);
    const [currentPrice, setCurrentPrice] = useState<AuctionListCurrentPriceResponseDto | null>(null);
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [autoBid, setAutoBid] = useState<boolean>(false);
    const [showAutobidConfig, setShowAutobidConfig] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBidAmount(Number(e.target.value));
    };

    const handleSubmit = () => {
        if (bidAmount > 0) {
            placeBid(id, bidAmount).then();
        } else {
            showToast("warning", "Please enter a valid amount");
        }
    };

    const handleAutoBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAutoBid(e.target.checked);
        changeAutobidConfig(id, e.target.checked).then();
    };

    const handleImageClick = (image: string | null) => {
        setSelectedImage(image);
    };

    const placeBid = async (id: string, amount: number) => {
        try {
            const bid = await bidRepository.placeBidToRemote(
                {
                    id: parseInt(id),
                    amount: amount,
                    last_bid_reference: currentPrice?.id?.toString() ?? null
                }
            );
            setCurrentPrice(bid)
            showToast("success", 'Bid Placed');
        } catch (e) {
            if (e instanceof NewerBidPlacedException) {
                if (e.newerBid) {
                    setCurrentPrice(e.newerBid)
                }
                showToast("error", e.message);
            } else if (e instanceof SessionEndException) {
                showToast("error", 'Session has ended. Please login again', {toastId: '401', updateId: '401'});
                authProvider?.logout();
            } else if (e instanceof FormValidationError) {
                showToast("error", e.message);
            } else if (e instanceof Error) {
                showToast("error", e.message);
            }
        }
    }

    const changeAutobidConfig = async (id: string, to: boolean) => {
        try {
            await auctionRepository.changeAutobidStatusToRemote(id, to);
            if (to) {
                showToast("success", `Autobid config enabled`);
            } else {
                showToast("info", `Autobid config disabled`);
            }
        } catch (e) {
            if (e instanceof SessionEndException) {
                showToast("error", 'Session has ended. Please login again', {toastId: '401', updateId: '401'});
                authProvider?.logout();
            } else if (e instanceof Error) {
                showToast("error", e.message);
            }
        }
    }

    const fetchData = async (id: string) => {
        try {
            const response = await auctionRepository.getItemFromRemote(id);
            setData(response);
        } catch (e) {
            if (e instanceof FormValidationError) {
                const bag = e.responseBag;
                if (bag as IdResponseDto) {
                    if (bag.id != null && bag.id.length > 0) {
                        showToast("error", bag.id[0]);
                        setTimeout(() => router.push('/dashboard'), 1500);
                    }
                }
            } else if (e instanceof SessionEndException) {
                showToast("error", 'Session has ended. Please login again', {toastId: '401', updateId: '401'});
                authProvider?.logout();
            } else if (e instanceof NotFoundException) {
                showToast("error", e.message);
                setTimeout(() => router.push('/dashboard'), 1500);
            } else if (e instanceof Error) {
                showToast("error", e.message);
            }
        }
    };

    useEffect(() => {
        fetchData(id).then()
    }, [id]);

    useEffect(() => {
        if (selectedImage === null) {
            setSelectedImage(data?.images?.[0]?.url ?? null);
        }
        setCurrentPrice(data?.current_price ?? null);
        setAutoBid(data?.autobid == true);
        const isEnd = data?.end_time ? new Date(data.end_time) < new Date() : false;
        const hasWinner = data?.has_winner == true;
        setExpiration(isEnd || hasWinner);
    }, [data]);

    useEffect(() => {
        setShowAutobidConfig(showAutobidConfig || autoBid)
    }, [autoBid]);

    if (authProvider?.user?.role !== 'regular') return null;

    return (
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div>
                <div className="w-full h-64 mb-4 border">
                    <img src={selectedImage ?? '/image_not_found.png'} alt="Selected"
                         className="w-full h-full object-cover"/>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {data?.images?.map((image, index) => (
                        <div key={index} className="w-full h-24 border">
                            <img
                                src={image.url ?? '/image_not_found.png'}
                                alt={`Thumbnail ${index}`}
                                className={`w-full h-full object-cover cursor-pointer ${selectedImage === image.url ? 'border-2 border-blue-500' : ''}`}
                                onClick={() => handleImageClick(image.url)}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-2">{data?.name}</h2>
                <p className="mb-4">{data?.description}</p>
                <p className="text-gray-500">Due to:&nbsp;
                    {
                        nullableStringToDateLocal(data?.end_time) &&
                        <ReactTimeAgo date={nullableStringToDateLocal(data?.end_time)!} locale="en-US"/>
                    }
                </p>
            </div>
            <div className="border p-4 flex flex-col items-center">
                <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">Countdown:</p>
                    {
                        nullableStringToDateLocal(data?.end_time) &&
                        <Countdown
                            endDate={nullableStringToDateLocal(data?.end_time)!}
                        />
                    }
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">Starting Price:</p>
                    <p className="text-2xl font-bold">${data?.starting_price}</p>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">Current Price:</p>
                    {
                        currentPrice
                            ? <p className="text-2xl font-bold">${currentPrice.amount ?? data?.starting_price ?? 0}</p>
                            : <p className="text-2xl font-bold">-</p>
                    }
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">Your Bid:</p>
                    <div className="text-center">
                        <input
                            type="number"
                            value={bidAmount}
                            onChange={handleInputChange}
                            className="border p-2 w-48 text-center"
                            min="1"
                            disabled={isExpired}
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="mt-2 bg-blue-500 text-white p-2 rounded"
                        disabled={isExpired}
                    >
                        Place Bid
                    </button>
                </div>
                <div className="mt-2 flex flex-row items-center">
                    <label className="ml-12 text-sm text-gray-500">
                        <input
                            type="checkbox"
                            checked={autoBid}
                            onChange={handleAutoBidChange}
                            className="mr-2"
                            disabled={isExpired}
                        />
                        Enable AutoBid
                    </label>
                    {
                        <button
                            className={`flex items-center justify-center text-white font-bold py-2 px-4 rounded-full h-full ${showAutobidConfig ? '' : 'invisible'}`}
                            onClick={() => router.push('/profile')}
                        >
                            <img src="/ic_fa_gear_solid.svg" alt="Icon"
                                 className="w-5 h-5"/>
                        </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default AuctionPlaceBid;
