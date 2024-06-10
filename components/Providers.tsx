"use client";

import { SessionProvider } from "next-auth/react";
import CanvasProvider from "./tableCanvas/editorProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {/* <CanvasProvider> */}
                {children}
            {/* </CanvasProvider> */}
        </SessionProvider>
    );
}