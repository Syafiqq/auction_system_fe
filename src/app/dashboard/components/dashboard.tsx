'use client';

import {useAuth} from "@/app/_providers/auth-provider";
import DashboardGallery from "@/app/dashboard/components/dashboard-gallery";
import React, {useEffect, useState} from "react";
import SearchForm from "@/app/dashboard/components/search-form";
import auctionRepository from "@/data/repository/auction-repository";
import {useSearchParams} from "next/navigation";
import {showToast} from "@/app/_toastify/toast-helper";
import DashboardTable from "@/app/dashboard/components/dashboard-table";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {AuctionListResponseDto} from "@/domain/definition/dto/auction-list-response-dto.definition";
import {SessionEndException} from "@/common/error/session-end-exception";

export default function Dashboard() {
    const authProvider = useAuth();
    const searchParams = useSearchParams();
    const [queryString, setQueryString] = useState(new URLSearchParams(searchParams));
    const [data, setData] = useState<(PaginatedResponseDto<AuctionListResponseDto> | null)>(null);

    useEffect(() => {
        handleRequestFetchData(searchParams).then()
    }, []);

    if (authProvider?.user == null) return null;

    async function handleRequestFetchData(params: URLSearchParams) {
        try {
            const response = await auctionRepository.fetchListFromRemote(
                {
                    page: params.get('page') ?? '1',
                    name: params.get('name') || null,
                    description: params.get('description') || null,
                    priceOrder: params.get('sort_price') || null,
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

    return (
        <>
            <SearchForm
                requestFetchData={handleRequestFetchData}
                queryString={queryString}>
            </SearchForm>
            <hr className="container mx-auto"/>
            {authProvider?.user.role === 'admin'
                ? <DashboardTable
                    requestFetchData={handleRequestFetchData}
                    queryString={queryString}
                    data={data}
                >
                </DashboardTable>
                : <DashboardGallery
                    requestFetchData={handleRequestFetchData}
                    queryString={queryString}
                    data={data}
                >
                </DashboardGallery>
            }
        </>
    );
}
