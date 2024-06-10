import { filterByName, getSpells, getSpellsByClass } from "@/lib/data";

export async function GET(request: Request, { params }: { params: { class: string } }) {

    // the classes are like: rogue, expert_sidekick -> "Rogue", "Expert Sidekick"
    const classParsed = params.class.split('_').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(' ');

    const spells = (await getSpellsByClass(classParsed));
    return new Response(JSON.stringify(spells), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

}