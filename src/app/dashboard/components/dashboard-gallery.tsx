import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {AuctionListResponseDto} from "@/domain/definition/dto/auction-list-response-dto.definition";
import {useAuth} from "@/app/_providers/auth-provider";
import {formatCurrency} from "@/app/_helper/currency-helper";
import useEcho from "@/app/_providers/echo-provider";
import {BidLiteResponseDto} from "@/domain/definition/dto/bid-lite-response-dto";

const DashboardGallery = ({requestFetchData, queryString, data}: {
    requestFetchData: (params: URLSearchParams) => void,
    queryString: URLSearchParams,
    data: PaginatedResponseDto<AuctionListResponseDto> | null
}) => {
    const authProvider = useAuth();
    const router = useRouter();
    const echo = useEcho();

    const [page, setPage] = useState(queryString.get('page') ?? '1');
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [list, setList] = useState<AuctionListResponseDto[]>([]);

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

    useEffect(() => {
        if (echo) {
            echo.channel('global')
                .listen('.auction.bid_placed', (e: BidLiteResponseDto | null) => {
                    if (e) {
                        const newList = list.map(item => {
                            if (item.id === e?.auction_id) {
                                return {
                                    ...item,
                                    current_price: {
                                        bid_at: item.current_price?.bid_at ?? '0',
                                        amount: e.amount,
                                        id: e.id,
                                    }
                                }
                            }
                            return item
                        });
                        setList(newList)
                    }
                });
        }
    }, [echo, list]);

    const prepareHandleNext = () => {
        setPage((parseInt(page) + 1).toString())
    };

    const prepareHandlePrevious = () => {
        const destinationPage = parseInt(page) - 1 < 1 ? '1' : (parseInt(page) - 1).toString();
        setPage(destinationPage)
    };

    if (authProvider?.user?.role !== 'regular') return null;

    return (
        <div className="container mx-auto py-8">
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4`}>
                {list.map((item) => (
                    <div key={item.id} className="border p-4 rounded-md shadow-md">
                        <img src={item.image?.url ?? '/image_not_found.png'} alt={item.name ?? ''}
                             className="w-full h-48 object-cover rounded-md"/>
                        <h2 className="text-lg font-semibold mt-2">{item.name ?? '-'}</h2>
                        <p className="text-gray-500">{item.description ?? '-'}</p>
                        <hr className="mt-4 mb-4"/>
                        <div className="flex justify-between items-center mt-2">
                            <span
                                className="text-lg font-semibold text-gray-700">Price: {formatCurrency(item.current_price?.amount ?? item.starting_price ?? 0)}</span>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={() => router.push(`/auction/${item.id}/place-bid`)}
                            >
                                {
                                    item.has_winner ? 'View Bid' : 'Bid Now!'
                                }
                            </button>
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

export default DashboardGallery;
