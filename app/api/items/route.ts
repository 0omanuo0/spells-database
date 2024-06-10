import { filterByName, getAllItems, getItem, getSpellsByName } from "@/lib/data";

export async function GET(request: Request) {
    // get the query param q
    const url = new URL(request.url);
    const f = url.searchParams.get('f');
    // if q is not present, return all spells
    if(f){
        const spells = (await getItem(f));
        if(!spells) return new Response(JSON.stringify({error: "Item not found"}), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return new Response(JSON.stringify(spells), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    return new Response(JSON.stringify(await getAllItems()), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}