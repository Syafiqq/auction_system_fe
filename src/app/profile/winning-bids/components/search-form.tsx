'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

const SearchForm = ({requestFetchData, queryString}: {
    requestFetchData: (params: URLSearchParams) => void,
    queryString: URLSearchParams,
}) => {
    const router = useRouter();

    const [name, setName] = useState(queryString.get('name') || '');
    const [description, setDescription] = useState(queryString.get('description') || '');

    useEffect(() => {
        if (name) queryString.set('name', name);
        else queryString.delete('name');

        if (description) queryString.set('description', description);
        else queryString.delete('description');

        router.replace(`?${queryString.toString()}`);
    }, [name, description]);

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
