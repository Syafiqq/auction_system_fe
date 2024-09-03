'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

const statusOptions: { id: number, name: string }[] = [
    {id: 1, name: 'Win'},
    {id: 2, name: 'Lose'},
    {id: 3, name: 'In Progress'},
    {id: 4, name: 'In Progress (Leading)'}
];

const SearchForm = ({requestFetchData, queryString}: {
    requestFetchData: (params: URLSearchParams) => void,
    queryString: URLSearchParams,
}) => {
    const router = useRouter();

    const [name, setName] = useState(queryString.get('name') || '');
    const [description, setDescription] = useState(queryString.get('description') || '');

    const [selectedStatus, setSelectedStatus] = useState<number[]>([1, 2, 3, 4]);

    const handleToggle = (id: number) => {
        setSelectedStatus(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(statusId => statusId !== id)
                : [...prevSelected, id]
        );
    };

    useEffect(() => {
        if (name) queryString.set('name', name);
        else queryString.delete('name');

        if (description) queryString.set('description', description);
        else queryString.delete('description');

        if (selectedStatus) {
            queryString.delete('types[]');
            selectedStatus.forEach(statusId => {
                queryString.append('types[]', statusId.toString());
            })
        } else queryString.delete('types[]');

        router.replace(`?${queryString.toString()}`);
    }, [name, description, selectedStatus]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        requestFetchData(queryString);
    };

    return (
        <div className="container mx-auto py-8">
            <form className="space-y-4" onSubmit={handleSearch}>
                <div>
                    <label className="block text-gray-700">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Enter name"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Enter description"
                    />
                </div>
                <div className="flex space-x-4">
                    {statusOptions.map(option => (
                        <button
                            key={option.id}
                            onClick={() => handleToggle(option.id)}
                            className={`px-4 py-2 rounded-md ${
                                selectedStatus.includes(option.id) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white rounded-md"
                >
                    Search
                </button>
            </form>
        </div>
    );
}

export default SearchForm
