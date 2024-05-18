import { getUser } from "@/lib/data";
import { User } from "@/lib/types";


export async function GET(request:Request) {
    const id = request.url.split('/').pop();
    // console.log(id);/////////////////////////////////
    const user = await getUser(id!);
    return new Response(JSON.stringify(user), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}