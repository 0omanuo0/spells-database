import { addSpell } from "@/lib/actions";
import { PlusCircleFill } from "react-bootstrap-icons";
// import { useReload } from "./CardsCharacter";




export function AddSpell({ spell, characterId }: { spell: string, characterId: string}) {
    // const { forceReload } = useReload();
    return (
        <form action={
            () => {
                addSpell(characterId, spell).finally(() => {
                    // forceReload();
                })
            }
        }>
            <button
                type="submit"
            >
                <PlusCircleFill className="text-xl text-neutral-700" />
            </button>
        </form>
    )
}