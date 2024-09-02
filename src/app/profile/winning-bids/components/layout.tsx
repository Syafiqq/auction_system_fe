'use client';

import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useAuth} from "@/app/_providers/auth-provider";
import {showToast} from "@/app/_toastify/toast-helper";
import {SessionEndException} from "@/common/error/session-end-exception";
import {formatCurrency} from "@/app/_helper/currency-helper";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import userRepository from "@/data/repository/user-repository";
import {AuctionWinnerResponseDto} from "@/domain/definition/dto/auction-winner-response-dto.definition";
import {AuctionListImageResponseDto} from "@/domain/definition/dto/auction-list-response-dto.definition";
import SearchForm from "@/app/profile/winning-bids/components/search-form";

const WinningBidsTable = () => {
    const authProvider = useAuth();
    const router = useRouter();

    const searchParams = useSearchParams();
    const [queryString, setQueryString] = useState(new URLSearchParams(searchParams));

    const [data, setData] = useState<(PaginatedResponseDto<AuctionWinnerResponseDto> | null)>(null);

    const [page, setPage] = useState(queryString.get('page') ?? '1');
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);

    useEffect(() => {
        handleRequestFetchData(searchParams).then()
    }, []);

    useEffect(() => {
        if (page) queryString.set('page', page.toString());
        else queryString.set('page', '1');

        router.replace(`?${queryString.toString()}`);

        handleRequestFetchData(queryString).then()
    }, [page]);

    useEffect(() => {
        setHasNext(data?.links.next !== null)
        setHasPrev(data?.links.prev !== null)
    }, [data]);

    const prepareHandleNext = () => {
        setPage((parseInt(page) + 1).toString())
    };

    const prepareHandlePrevious = () => {
        const destinationPage = parseInt(page) - 1 < 1 ? '1' : (parseInt(page) - 1).toString();
        setPage(destinationPage)
    };

    async function handleRequestFetchData(params: URLSearchParams) {
        try {
            const response = await userRepository.winningBidsFromRemote(
                {
                    page: params.get('page') ?? '1',
                    name: params.get('name') || null,
                    description: params.get('description') || null
                }
            )
            setData(response);
        } catch (e) {
            if (e instanceof SessionEndException) {
                showToast("error", 'Session has ended. Please login again', {toastId: '401', updateId: '401'});
                authProvider?.logout();
            } else if (e instanceof Error) {
                showToast("error", e.message);
            }
        }
    }

    const handleView = (id: number) => {
        router.push(`/auction/${id}/bill`);
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
            <SearchForm
                requestFetchData={handleRequestFetchData}
                queryString={queryString}>
            </SearchForm>
            <hr className="container mx-auto"/>
            <div className="container mx-auto py-8">
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="py-2 text-left">Image</th>
                        <th className="py-2 text-left">Name</th>
                        <th className="py-2 text-left">Description</th>
                        <th className="py-2 text-right">Price</th>
                        <th className="py-2 text-right">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(data?.data ?? []).map((item) => (
                        <tr key={item.id} className="border-t" onClick={() => handleView(item.id ?? -1)}>
                            <td className="py-2">
                                <img src={firstImage(item.images ?? [])?.url ?? '/image_not_found.png'}
                                     alt={item.name ?? ''}
                                     className="w-24 h-24 object-cover rounded-md"/>
                            </td>
                            <td className="py-2 text-left">{item.name ?? '-'}</td>
                            <td className="py-2 text-left">{item.description ?? '-'}</td>
                            <td className="py-2 text-right w-20">{formatCurrency(item.current_price?.amount ?? item.starting_price ?? 0)}</td>
                            <td className="py-2 text-right">{item.payment_status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="flex justify-between mt-4">
                    <button
                        onClick={prepareHandlePrevious}
                        disabled={!hasPrev}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={prepareHandleNext}
                        disabled={!hasNext}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default WinningBidsTable;
