"use client";

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {FormValidationError} from "@/common/error/form-validation-error";
import {showToast} from "@/app/_toastify/toast-helper";
import {useAuth} from "@/app/_providers/auth-provider";
import {NotFoundException} from "@/common/error/not-found-exception";
import {UserDetailResponseDto} from "@/domain/definition/dto/user-detail-response-dto.definition";
import userRepository from "@/data/repository/user-repository";
import {UserAutobidValidationRequestDto} from "@/domain/definition/dto/user-autobid-validation-request-dto.definition";
import {SessionEndException} from "@/common/error/session-end-exception";

const profileSchema = z.object({
    amount: z.number().nonnegative('Autobid amount must be a positive number'),
    percentage: z.number().nonnegative('Autobid limit percentage must be a positive number').min(1).max(100),
});


const EditProfile = () => {
    const authProvider = useAuth();
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}, reset, setValue} = useForm({
        resolver: zodResolver(profileSchema),
    });
    const [data, setData] = useState<UserDetailResponseDto | null>(null);

    useEffect(() => {
        fetchData().then()
    }, []);

    useEffect(() => {
        if (data?.autobid_capacity !== null) {
            setValue('amount', data?.autobid_capacity ?? '');
        }
        if (data?.autobid_percentage_warning !== null) {
            setValue('percentage', data?.autobid_percentage_warning ?? '');
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const response = await userRepository.getProfileFromRemote()
            setData(response);
        } catch (e) {
            if (e instanceof NotFoundException) {
                showToast("error", e.message);
                setTimeout(() => router.push('/dashboard'), 1500);
            } else if (e instanceof SessionEndException) {
                showToast("error", 'Session has ended. Please login again', {toastId: '401', updateId: '401'});
                authProvider?.logout();
            } else if (e instanceof Error) {
                showToast("error", e.message);
            }
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            await userRepository.updateAutobidPreferenceToRemote({
                amount: data.amount,
                percentage: data.percentage,
            });

            showToast("success", 'Profile updated successfully');
        } catch (e) {
            if (e instanceof FormValidationError) {
                const bag = e.responseBag;
                if (bag as UserAutobidValidationRequestDto) {
                    if (bag.amount != null && bag.amount.length > 0) {
                        showToast("error", bag.amount[0]);
                    } else if (bag.percentage != null && bag.percentage.length > 0) {
                        showToast("error", bag.percentage[0]);
                    }
                }
            } else if (e instanceof SessionEndException) {
                showToast("error", 'Session has ended. Please login again', {toastId: '401', updateId: '401'});
                authProvider?.logout();
            } else if (e instanceof Error) {
                showToast("error", e.message);
            }
        }
    };

    const handleCancel = () => {
        router.push('/dashboard');
    };

    if (authProvider?.user?.role !== 'regular') return null;

    return (
        <div className="container mx-auto py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        value={data?.username ?? ''}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                        disabled
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Autobid amount</label>
                    <input
                        type="number"
                        {...register('amount', {valueAsNumber: true})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                    />
                    {errors.amount &&
                        <p className="mt-2 text-sm text-red-600">{String(errors.amount.message)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Autobid limit percentage</label>
                    <input
                        type="number"
                        {...register('amount', {valueAsNumber: true})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                    />
                    {errors.amount &&
                        <p className="mt-2 text-sm text-red-600">{String(errors.amount.message)}</p>}
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
