"use client";

import Sidebar from "@/components/sidebar";
import UserData from "@/components/userData";
import { type User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";


export default function User() {
    

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="w-full h-full flex">
                <Sidebar />
            </div>
        </Suspense>
    )
}