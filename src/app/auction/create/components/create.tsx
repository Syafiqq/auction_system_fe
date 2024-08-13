"use client";

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {FormValidationError} from "@/common/error/form-validation-error";
import {showToast} from "@/app/_toastify/toast-helper";
import auctionRepository from "@/data/repository/auction-repository";
import {AuctionCreateResponseDto} from "@/domain/definition/dto/auction-create-response-dto.definition";
import {convertToDD_MM_YYYY} from "@/common/extension/date-extension";
import {useAuth} from "@/app/_providers/auth-provider";

const auctionSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    starting_price: z.number().nonnegative('Starting price must be a positive number'),
    end_time: z.string().min(1, 'End time is required')
        .refine((val) => !isNaN(Date.parse(val)), 'End time must be a valid date')
        .refine((val) => new Date(val) > new Date(), 'End time must be in the future'),
});

const CreateAuctionForm = () => {
    const authProvider = useAuth();
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: zodResolver(auctionSchema),
    });
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [createdAuction, setCreatedAuction] = useState<string | null>(null);

    const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            const response = await auctionRepository.createItemToRemote({
                name: data.name,
                description: data.description,
                starting_price: data.starting_price,
                end_time: convertToDD_MM_YYYY(data.end_time),
                images: selectedImages,
            });

            const id = response.id;
            if (id !== null) {
                showToast("success", 'Auction created successfully');

                reset();
                setSelectedImages([]);

                setCreatedAuction(id.toString());
            }
        } catch (e) {
            if (e instanceof FormValidationError) {
                const bag = e.responseBag;
                if (bag as AuctionCreateResponseDto) {
                    if (bag.name != null && bag.name.length > 0) {
                        showToast("error", bag.name[0]);
                    } else if (bag.description != null && bag.description.length > 0) {
                        showToast("error", bag.description[0]);
                    } else if (bag.starting_price != null && bag.starting_price.length > 0) {
                        showToast("error", bag.starting_price[0]);
                    } else if (bag.end_time != null && bag.end_time.length > 0) {
                        showToast("error", bag.end_time[0]);
                    } else if (bag.images != null && bag.images.length > 0) {
                        showToast("error", bag.images[0]);
                    }
                }
            } else if (e instanceof Error) {
                showToast("error", e.message);
            }
        }
    };

    const handleCancel = () => {
        router.push('/dashboard');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
        }
    };

    const handleRemoveImage = (index: number) => {
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleView = (id: string) => {
        router.push(`/auction/${id}`);
    };

    if (authProvider?.user?.role !== 'admin') return null;

    return (
        <div className="container mx-auto py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        {...register('name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                    />
                    {errors.name && <p className="mt-2 text-sm text-red-600">{String(errors.name.message)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        {...register('description')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                    />
                    {errors.description &&
                        <p className="mt-2 text-sm text-red-600">{String(errors.description.message)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Starting Price</label>
                    <input
                        type="number"
                        {...register('starting_price', {valueAsNumber: true})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                    />
                    {errors.starting_price &&
                        <p className="mt-2 text-sm text-red-600">{String(errors.starting_price.message)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                        type="date"
                        {...register('end_time')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                        min={today}
                    />
                    {errors.end_time && <p className="mt-2 text-sm text-red-600">{String(errors.end_time.message)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <input
                        type="file"
                        {...register('images')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                    />
                    {errors.images && <p className="mt-2 text-sm text-red-600">{String(errors.images.message)}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                    {selectedImages.map((image, index) => (
                        <div key={index} className="relative border">
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`Selected ${index}`}
                                className="w-full h-32 object-cover rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full size-6"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    {createdAuction !== null
                        ? <button
                            type="button"
                            onClick={() => handleView(createdAuction ?? '')}
                            className="px-4 py-2 bg-green-300 text-gray-700 rounded-md hover:bg-green-400"
                        >
                            Acknowledge
                        </button>
                        : <></>
                    }
                </div>
            </form>
        </div>
    );
};

export default CreateAuctionForm;
