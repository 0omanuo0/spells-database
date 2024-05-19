import CharacterCard from "@/components/characterHomeCard"
import Sidebar from "@/components/sidebar"
import { User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CharacterHomepage({ params }: { params: { id: string } }) {
    const id = params.id;
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Sidebar />
            </Suspense>
            <main className=" ml-64">
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                {/* Same as */}
                {/* <ToastContainer /> */}
                <CharacterCard id={id} />
            </main>
        </>
    )
}
