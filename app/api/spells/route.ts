import { filterByName, getSpells } from "@/lib/data";

export async function GET(request: Request) {
    // get the query param q
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    // if q is not present, return all spells
    if (!q) {
        const spells = await getSpells();
        return new Response(JSON.stringify(spells), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    // if q is present, filter by name
    const spells = await filterByName(q);
    return new Response(JSON.stringify(spells), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}