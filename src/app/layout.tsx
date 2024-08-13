import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import ToastProvider from "@/app/_toastify/toast-provider";
import {AuthProvider} from "@/app/_providers/auth-provider";
import Header from "@/app/_components/header";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Auction",
    description: "Auction app",
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ToastProvider>
            <AuthProvider>
                <Header></Header>
                {children}
            </AuthProvider>
        </ToastProvider>
        </body>
        </html>
    );
}
