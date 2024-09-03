"use client";

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {showToast} from "@/app/_toastify/toast-helper";
import {useAuth} from "@/app/_providers/auth-provider";
import {SessionEndException} from "@/common/error/session-end-exception";
import {AuctionBillResponseDto} from "@/domain/definition/dto/auction-bill-response-dto.definition";
import auctionRepository from "@/data/repository/auction-repository";
import {FormValidationError} from "@/common/error/form-validation-error";
import {IdResponseDto} from "@/domain/definition/dto/id-response-dto.definition";
import {NotFoundException} from "@/common/error/not-found-exception";
import {formatCurrency} from "@/app/_helper/currency-helper";
import {format} from 'date-fns';

interface AuctionBillLayoutProps {
    id: string
}

const AuctionBillLayout = ({id}: AuctionBillLayoutProps) => {
    const authProvider = useAuth();
    const router = useRouter();
    const [data, setData] = useState<AuctionBillResponseDto | null>(null);

    useEffect(() => {
        fetchData().then()
    }, []);

    const fetchData = async () => {
        try {
            const response = await auctionRepository.getBillFromRemote(id);
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

    const handlePayment = async () => {
        const thatId = id
        try {
            const response = await auctionRepository.payBillToRemote(
                thatId?.toString() ?? '',
                data?.current_price?.id?.toString() ?? '-'
            );

            showToast("success", "Payment has been made successfully.");
            fetchData().then()
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
            } else if (e instanceof Error) {
                showToast("error", e.message);
            }
        }
    }

    if (authProvider?.user?.role !== 'regular') return null;

    return (
        <>
            <div className="flex flex-col justify-center items-center min-h-screen p-4">
                <pre
                    className="bg-white p-4 border border-gray-300 rounded shadow overflow-auto whitespace-pre-wrap text-sm">
{`-----------------------------------------------------
                   AuctionApp
-----------------------------------------------------
                 CONGRATULATIONS!
-----------------------------------------------------
Congratulations! You have won the auction for the item
${data?.name ?? '-'} at the price of ${formatCurrency(data?.current_price?.amount ?? 0)}.

-----------------------------------------------------
                    Details
-----------------------------------------------------
Auction Item Details:
Item Name: ${data?.name ?? '-'}
Item ID: ${data?.bill?.no ?? '-'}

Bidding Details:
Bid Amount: ${formatCurrency(data?.current_price?.amount ?? 0)}.
Bidding Date: ${format(new Date(data?.current_price?.bid_at ?? '0'), 'MMM dd, yyyy HH:mm:ss')}

-----------------------------------------------------

                Final Amount Due:
                ${formatCurrency(data?.current_price?.amount ?? 0)}.

-----------------------------------------------------
**Payment Information:**
- **Accepted Methods:** Credit Card, PayPal,
  Bank Transfer
- **Payment Due Date:** ${format(new Date(data?.bill?.due_at ?? '0'), 'MMM dd, yyyy HH:mm:ss')}

**Overdue Warning:**
- **Status:** Payment is overdue if not received by
  the due date.
- **Penalty:** Late payments may incur a fee of
  $10 or 5% of the total amount due (whichever is higher).
- **Final Payment Deadline:** ${format(new Date(data?.bill?.due_at ?? '0'), 'MMM dd, yyyy HH:mm:ss')}
  after which the auction item may be forfeited.

-----------------------------------------------------
Contact Us:
Customer Service: support@auctionapp.com
Terms and Conditions Apply.

Thank you for your participation!

-----------------------------------------------------`}
                </pre>

                {
                    data?.bill?.paid_at != null
                        ? <span className="mt-6 text-green-600">Payment has been made successfully.</span>
                        :
                        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                onClick={() => handlePayment()}>
                            Complete Payment
                        </button>
                }

            </div>
        </>
    );
};

export default AuctionBillLayout;
