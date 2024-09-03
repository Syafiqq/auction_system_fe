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
import {SessionEndException} from "@/common/error/session-end-exception";
import {formatCurrency} from "@/app/_helper/currency-helper";


interface ViewAuctionProps {
    id: string
}

const ViewAuction = ({id}: ViewAuctionProps) => {
    const router = useRouter();
    const authProvider = useAuth();
    const [data, setData] = useState<AuctionDetailResponseDto | null>(null);

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
    }, []);

    const handleChange = (id: string) => {
        router.push(`/auction/${id}/edit`);
    };

    const handleDashboard = () => {
        router.push('/dashboard');
    };

    if (authProvider?.user?.role !== 'admin') return null;

    return (
        <div className="container mx-auto py-8">
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={data?.name ?? ''}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                        disabled
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={data?.description ?? ''}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                        disabled
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Starting Price</label>
                    <input
                        type="text"
                        value={`${formatCurrency(data?.starting_price ?? 0)}`}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                        disabled
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Price</label>
                    <input
                        type="text"
                        value={`${formatCurrency(data?.current_price?.amount ?? data?.starting_price ?? 0)}`}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                        disabled
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                        type="text"
                        value={(new Date(data?.end_time ?? '').toLocaleString())}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                        disabled
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                    {data?.images?.map((image, index) => (
                        <div key={index} className="relative border">
                            <img
                                src={image.url ?? '/image_not_found.png'}
                                alt={`Image ${index}`}
                                className="w-full h-32 object-cover rounded-md"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => handleChange(id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={handleDashboard}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Dashboard
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ViewAuction;
