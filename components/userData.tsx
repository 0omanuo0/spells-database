import { useEffect, useState } from 'react';
import { getUser } from "@/lib/data";

import { User } from "@/lib/types";

export default function UserData({ userid }: { userid: string }) {
    const [user, setUser] = useState<User|null>(null);

    useEffect(() => {
        async function fetchData() {
            const userData = await getUser(userid);
            setUser(userData);
        }

        fetchData();
    }, [userid]);

    if (!user) {
        return <div>Loading...</div>; // Or any other loading indicator
    }

    return (
        <div>
            {/* Render your user data here */}
        </div>
    );
}
