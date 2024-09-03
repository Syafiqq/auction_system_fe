"use client";

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {showToast} from "@/app/_toastify/toast-helper";
import {useAuth} from "@/app/_providers/auth-provider";
import {SessionEndException} from "@/common/error/session-end-exception";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {BidWithUserResponseDto} from "@/domain/definition/dto/bid-with-user-response-dto";
import auctionRepository from "@/data/repository/auction-repository";
import {formatCurrency} from "@/app/_helper/currency-helper";
import {format} from 'date-fns';

interface ParticipantsPreviewProps {
    id: string
}

const ParticipantsPreview = ({id}: ParticipantsPreviewProps) => {
    const authProvider = useAuth();
    const router = useRouter();
    const [data, setData] = useState<PaginatedResponseDto<BidWithUserResponseDto> | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(false);

    useEffect(() => {
        fetchData().then()
    }, []);

    useEffect(() => {
        setHasMore(data?.meta?.last_page !== 1)
    }, [data]);

    const fetchData = async () => {
        try {
            const response = await auctionRepository.participantsToRemote(id, '1');
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

    if (authProvider?.user?.role !== 'regular') return null;

    return (
        <>
            <div className="container mx-auto py-32">
                <div className="flex justify-between items-center">
                    <h1>Participants</h1>
                    <a
                        href="#"
                        className={`px-4 py-2 bg-transparent-500 text-blue-500 rounded-md ${!hasMore ? 'opacity-50 cursor-not-allowed' : ''} text-sm`}
                        onClick={(e) => {
                            if (!hasMore) {
                                e.preventDefault();
                            } else {
                                router.push(`/auction/${id}/participants`)
                            }
                        }}
                    >
                        Show more
                    </a>
                </div>
                <hr/>
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="py-2">Name</th>
                        <th className="py-2 w-32">Bid Amount</th>
                        <th className="py-2 w-60">Bid At</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(data?.data ?? []).map((item, index) => (
                        <tr key={item.id}
                            className={`border-t ${index % 2 === 0 ? 'even:bg-white' : 'odd:bg-gray-100'}`}>
                            <td className="py-2">{item.user?.username ?? '-'}</td>
                            <td className="py-2">{formatCurrency(item.amount ?? 0)}</td>
                            <td className="py-2">{format(new Date(item.bid_at ?? '0'), 'MMM dd, yyyy HH:mm:ss')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ParticipantsPreview;
