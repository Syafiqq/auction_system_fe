"use client";

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {showToast} from "@/app/_toastify/toast-helper";
import {useAuth} from "@/app/_providers/auth-provider";
import userRepository from "@/data/repository/user-repository";
import {SessionEndException} from "@/common/error/session-end-exception";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {AuctionListImageResponseDto} from "@/domain/definition/dto/auction-list-response-dto.definition";
import AuctionCard from "@/app/profile/components/auction-card";
import {AuctionParticipationResponseDto} from "@/domain/definition/dto/auction-participation-response-dto.definition";
import {AuctionParticipationRequestStatus} from "@/domain/definition/dto/auction-participation-request-dto.definition";

const AuctionParticipationPreview = () => {
    const authProvider = useAuth();
    const router = useRouter();
    const [data, setData] = useState<PaginatedResponseDto<AuctionParticipationResponseDto> | null>(null);

    useEffect(() => {
        fetchData().then()
    }, []);

    const fetchData = async () => {
        try {
            const response = await userRepository.auctionParticipationFromRemote({
                page: '1',
                name: null,
                description: null,
                types: [
                    AuctionParticipationRequestStatus.WIN,
                    AuctionParticipationRequestStatus.LOSE,
                    AuctionParticipationRequestStatus.IN_PROGRESS,
                    AuctionParticipationRequestStatus.IN_PROGRESS_LEADING
                ]
            });
            setData(response);
        } catch (e) {
            if (e instanceof SessionEndException) {
                showToast("error", 'Session has ended. Please login again', {toastId: '401', updateId: '401'});
                authProvider?.logout();
            } else if (e instanceof Error) {
                showToast("error", e.message);
            }
        }
    };

    const firstImage = (items: AuctionListImageResponseDto[]): AuctionListImageResponseDto | null => {
        if (items.length === 0) {
            return null;
        }
        return items[0];
    };

    if (authProvider?.user?.role !== 'regular') return null;

    return (
        <>
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center">
                    <h1>Auction Participation</h1>
                    <a
                        href="#"
                        className={`px-4 py-2 bg-transparent-500 text-blue-500 rounded-md ${data?.meta?.last_page === 1 ? 'opacity-50 cursor-not-allowed' : ''} text-sm`}
                        onClick={(e) => {
                            if (data?.meta?.last_page === 1) {
                                e.preventDefault();
                            } else {
                                router.push('/profile/auctions')
                            }
                        }}
                    >
                        Show more
                    </a>
                </div>
                <hr/>
                <div className="flex gap-3 overflow-x-auto p-3">
                    {(data?.data ?? []).map((item) => (
                        <AuctionCard
                            key={item.id}
                            onClick={() => router.push(`/auction/${item.id}/place-bid`)}
                            image={firstImage(item.images ?? [])?.url}
                            status={item.status}
                            name={item.name}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default AuctionParticipationPreview;
