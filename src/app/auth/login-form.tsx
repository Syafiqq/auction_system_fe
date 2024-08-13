"use client";

import React, {useEffect, useState} from "react";
import "./styles/login.scss";
import {showToast} from "@/app/_toastify/toast-helper";
import {FormValidationError} from "@/common/error/form-validation-error";
import {UserResponseDto} from "@/domain/definition/dto/user-response-dto.definition";
import loginUseCase from "@/domain/usecase/login-use-case";
import {useRouter} from 'next/navigation';
import {useAuth} from "@/app/_providers/auth-provider";


export default function LoginForm() {
    const [usernameMessage, setUsernameMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const authProvider = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (authProvider?.user != null) {
            router.push('/dashboard');
            return;
        }
        setLoading(false);
    }, [authProvider?.user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const username = (form.elements.namedItem("username") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        try {
            await loginUseCase.execute(username, password);
            authProvider?.login();

            form.reset();
            setUsernameMessage('');
            setPasswordMessage('');

            router.replace('/dashboard');
        } catch (e) {
            setUsernameMessage('');
            setPasswordMessage('');
            if (e instanceof FormValidationError) {
                const bag = e.responseBag;
                if (bag as UserResponseDto) {
                    setUsernameMessage(bag.username ?? '');
                    setPasswordMessage(bag.password ?? '');
                }
            } else if (e instanceof Error) {
                showToast("error", e.message);
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        name={"username"}
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <div className={`message ${usernameMessage ? "error-message" : "hidden-message"}`}>
                        {usernameMessage}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        name={"password"}
                        type="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <div className={`message ${passwordMessage ? "error-message" : "hidden-message"}`}>
                        {passwordMessage}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
