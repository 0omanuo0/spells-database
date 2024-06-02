import { getCampignbyId } from "@/app/prueba/getData";
import { User } from "@/lib/types";


export async function GET(request:Request) {
    const id = request.url.split('/').pop();
    // console.log(id);/////////////////////////////////
    const user = await getCampignbyId(id!);
    return new Response(JSON.stringify(user), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}