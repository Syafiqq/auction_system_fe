'use client';

import {useRouter} from 'next/navigation';
import {useAuth} from "@/app/_providers/auth-provider";
import React from "react";

const Header = () => {
    const authProvider = useAuth();
    const router = useRouter();

    const handleCreateNew = () => {
        router.push('/auction/create');
    };

    const handleProfile = () => {
        router.push('/profile');
    };

    const handleInAppNotification = () => {
        router.push('/notification');
    };

    const handleLogout = () => {
        authProvider?.logout();
        router.push('/auth'); // Redirect to the login page after logout
    };

    return (
        <header className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-lg font-bold" onClick={() => router.push('/dashboard')}>Auction</div>
                <nav>
                    <ul className="flex space-x-4">
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
                                    ? <li>
                                        <button
                                            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full h-full"
                                            onClick={handleCreateNew}
                                        >
                                            <img src="/ic_fa_plus_solid.svg" alt="Icon" className="w-5 h-5"/>
                                        </button>
                                    </li>
                                    : <></>
                                }
                                {authProvider?.user.role === 'regular'
                                    ? <>
                                        <li>
                                            <button
                                                className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full h-full"
                                                onClick={handleProfile}
                                            >
                                                <img src="/ic_fa_user_solid.svg" alt="Icon" className="w-5 h-5"/>
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full h-full"
                                                onClick={handleInAppNotification}
                                            >
                                                <img src="/ic_fa_bell_solid.svg" alt="Icon" className="w-5 h-5"/>
                                            </button>
                                        </li>
                                    </>
                                    : <></>
                                }

                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
