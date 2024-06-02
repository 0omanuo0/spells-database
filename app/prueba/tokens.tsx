"use server";

import { getCampign } from "./getData";



export default async function Tokens() {
    const Campign = await getCampign("campaign1");
    if(!Campign) return null;
    const tokens = Object.keys(Campign.tokens);

    return (
        <ul>
            {tokens.map((token:string) => {
                return (
                    <li key={token} className=" flex gap-2">
                        <h1>{token}</h1>
                        <p> {Campign.tokens[token].health}</p>
                    </li>
                )
            })}
        </ul>
    );
    
}