import { filterByName, getSpells, getSpellsByName } from "@/lib/data";

export async function GET(request: Request) {
    // get the query param q
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const f = url.searchParams.get('f');
    // if q is not present, return all spells
    if(q){
        const spells = (await filterByName(q));
        return new Response(JSON.stringify(spells), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    else if(f){
        const spells = (await getSpellsByName(f));
        return new Response(JSON.stringify(spells), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    return new Response(JSON.stringify(await getSpells()), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}