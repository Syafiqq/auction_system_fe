"use client";

import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useAuth} from "@/app/_providers/auth-provider";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {InAppNotificationResponseDto} from "@/domain/definition/dto/in-app-notification-response-dto.definition";
import {showToast} from "@/app/_toastify/toast-helper";
import inAppNotificationRepository from "@/data/repository/in-app-notification-repository";
import ReactTimeAgo from "react-time-ago";
import {nullableStringToDateLocal} from "@/common/extension/date-extension";

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

const InAppNotificationList = () => {
    const authProvider = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [queryString, setQueryString] = useState(new URLSearchParams(searchParams));
    const [data, setData] = useState<(PaginatedResponseDto<InAppNotificationResponseDto> | null)>(null);
    const [page, setPage] = useState(queryString.get('page') ?? '1');
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);

    useEffect(() => {
        fetchData(queryString).then()
    }, [queryString]);

    useEffect(() => {
        if (page) queryString.set('page', page.toString());
        else queryString.set('page', '1');

        router.replace(`?${queryString.toString()}`);

        fetchData(queryString)
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

    async function fetchData(params: URLSearchParams) {
        try {
            const response = await inAppNotificationRepository.fetchListFromRemote(
                parseInt(params.get('page') ?? '1') ?? 1,
            )
            setData(response);
        } catch (e) {
            if (e instanceof Error) {
                showToast("error", e.message);
            }
        }
    }

    if (authProvider?.user?.role !== 'regular') return null;

    function handleClick(id: number | null) {
        const notifications = data?.data?.filter((item) => item.id === id);
        if (notifications && notifications.length > 0) {
            const notificationRawData = notifications[0].raw_data;
            if (notificationRawData) {
                const notificationData = JSON.parse(notificationRawData);
                if (notificationData.auction) {
                    router.push('/auction/' + notificationData.auction + '/place-bid');
                }
            }
        }
    }

    return (
        <div className="container mx-auto py-8">
            <div className={`grid grid-cols-1 gap-4`}>
                {data?.data?.map((item) => (
                    <div key={item.id} className="border p-4 rounded-md shadow-md" onClick={() => handleClick(item.id)}>
                        <h2 className="text-lg font-semibold mt-2">{item.title ?? '-'}</h2>
                        <p className="text-gray-500">{item.body ?? '-'}</p>
                        <div className="flex justify-between items-center mt-2">
                            <span className=""></span>
                            {
                                nullableStringToDateLocal(item.created_at) &&
                                <span className="text-sm text-gray-500">
                                    <ReactTimeAgo date={nullableStringToDateLocal(item.created_at)!} locale="en-US"/>
                                </span>
                            }
                        </div>
                    </div>
                ))}
            </div>
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
    );
};

export default InAppNotificationList;
