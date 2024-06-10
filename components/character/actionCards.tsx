import { changeCharacteristic } from "@/lib/actions";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";


export function TextEditable(
    { children, className, target, editable }
        : { children: string, className?: string, target: { objective: string, subtitle?: string }, editable?: boolean}
) {
    let characterid = useParams().id;
    // check if characterid is a string or string[]
    if (typeof characterid === 'object') characterid = characterid[0];

    const [content, setContent] = useState(children);

    const handleInput = (e: React.FormEvent<HTMLParagraphElement>) => {
        setContent(e.currentTarget.textContent || '');
    };

    const handleBlur = () => {
        toast.promise(()=>{
            // call changeCharacteristic
                return changeCharacteristic(characterid, target.objective, content);
            },
            {
                pending:"Updating " + target.objective + "...",
                success:"Updated "  + target.objective,
                error: "Promise rejected"
            }
        )
    };

    return (
        <article
            className={className + " mx-[2px]"}
            contentEditable={editable}
            onInput={editable ? handleInput : undefined}
            onBlur={editable ? handleBlur : undefined}
            suppressContentEditableWarning={true}
        >
            <p>
                {children}
            </p>
        </article>
    )
}