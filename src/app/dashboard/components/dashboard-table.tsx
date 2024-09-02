import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/_providers/auth-provider";
import auctionRepository from "@/data/repository/auction-repository";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {AuctionListResponseDto} from "@/domain/definition/dto/auction-list-response-dto.definition";
import {FormValidationError} from "@/common/error/form-validation-error";
import {IdResponseDto} from "@/domain/definition/dto/id-response-dto.definition";
import {showToast} from "@/app/_toastify/toast-helper";
import {NotFoundException} from "@/common/error/not-found-exception";
import {SessionEndException} from "@/common/error/session-end-exception";
import {formatCurrency} from "@/app/_helper/currency-helper";

const DashboardTable = ({requestFetchData, queryString, data}: {
    requestFetchData: (params: URLSearchParams) => void,
    queryString: URLSearchParams,
    data: PaginatedResponseDto<AuctionListResponseDto> | null
}) => {
    const authProvider = useAuth();
    const router = useRouter();

    const [list, setList] = useState<AuctionListResponseDto[]>([]);
    const [page, setPage] = useState(queryString.get('page') ?? '1');
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);

    useEffect(() => {
        if (page) queryString.set('page', page.toString());
        else queryString.set('page', '1');

        router.replace(`?${queryString.toString()}`);

        requestFetchData(queryString)
    }, [page]);

    useEffect(() => {
        setHasNext(data?.links.next !== null)
        setHasPrev(data?.links.prev !== null)
        setList(data?.data ?? [])
    }, [data]);

    const prepareHandleNext = () => {
        setPage((parseInt(page) + 1).toString())
    };

    const prepareHandlePrevious = () => {
        const destinationPage = parseInt(page) - 1 < 1 ? '1' : (parseInt(page) - 1).toString();
        setPage(destinationPage)
    };

    const handleEdit = (id: number) => {
        router.push(`/auction/${id}/edit`);
    };

    const handleView = (id: number) => {
        router.push(`/auction/${id}`);
    };

    const handleDelete = async (id: number) => {
        try {
            await auctionRepository.deleteFromRemote(id.toString())
            setList(list.filter((item) => item.id !== id))
        } catch (e) {
            if (e instanceof FormValidationError) {
                const bag = e.responseBag;
                if (bag as IdResponseDto) {
                    if (bag.id != null && bag.id.length > 0) {
                        showToast("error", bag.id[0]);
                    }
                }
            } else if (e instanceof SessionEndException) {
                showToast("error", 'Session has ended. Please login again', {toastId: '401', updateId: '401'});
                authProvider?.logout();
            } else if (e instanceof NotFoundException) {
                showToast("error", e.message);
            } else if (e instanceof Error) {
                showToast("error", e.message);
            }
        }
    };

    if (authProvider?.user?.role !== 'admin') return null;

    return (
        <div className="container mx-auto py-8">
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2">Image</th>
                    <th className="py-2">Name</th>
                    <th className="py-2">Description</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Action</th>
                </tr>
                </thead>
                <tbody>
                {list.map((item) => (
                    <tr key={item.id} className="border-t" onClick={() => handleView(item.id ?? -1)}>
                        <td className="py-2">
                            <img src={item.image?.url ?? '/image_not_found.png'} alt={item.name ?? ''}
                                 className="w-24 h-24 object-cover rounded-md"/>
                        </td>
                        <td className="py-2">{item.name ?? '-'}</td>
                        <td className="py-2">{item.description ?? '-'}</td>
                        <td className="py-2 text-right w-20">{formatCurrency(item.current_price?.amount ?? item.starting_price ?? 0)}</td>
                        <td className="py-2 w-56">
                            <nav>
                                <ul className="flex space-x-4 justify-end">
                                    {authProvider?.user === null ? (
                                        <li>
                                            <button
                                                onClick={() => router.push('/auth')}
                                                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                                            >
                                                Login
                                            </button>
                                        </li>
                                    ) : (
                                        <>
                                            {authProvider?.user.role === 'admin'
                                                ? <>
                                                    <li>
                                                        <button
                                                            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full h-full"
                                                            onClick={() => handleEdit(item.id ?? -1)}
                                                        >
                                                            <img src="/ic_fa_pen_to_square_solid.svg" alt="Icon"
                                                                 className="w-5 h-5"/>
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full h-full"
                                                            onClick={() => handleDelete(item.id ?? -1)}
                                                        >
                                                            <img src="/ic_fa_trash_solid.svg" alt="Icon"
                                                                 className="w-5 h-5"/>
                                                        </button>
                                                    </li>
                                                </>
                                                : <></>
                                            }
                                        </>
                                    )}
                                </ul>
                            </nav>
                        </td>
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
    );
};

export default DashboardTable;
