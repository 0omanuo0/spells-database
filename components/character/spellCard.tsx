"use client";
import ReactDOMServer from 'react-dom/server';

import { Spell, schoolParser } from "@/lib/types";
import { useState } from "react";

export default function SpellCard({ spell }: { spell: Spell }) {
    const [show, setShow] = useState(false);
    return (
        <>
            {
                show ?
                    <>
                        <h3
                            className="text-lg cursor-pointer"
                        >
                            {spell.name}
                        </h3>
                        <div
                            onClick={() => setShow(false)}
                            className="fixed top-0 left-0 w-full h-full items-center grid text-center z-50 bg-black/60  "
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="w-[550px] mx-auto"
                            >
                                <Card spell={spell} />
                            </div>
                        </div>
                    </>
                    :
                    <h3
                        onClick={() => setShow(true)}
                        className="text-lg cursor-pointer"
                    >
                        {spell.name}
                    </h3>
            }
        </>
    )
}

function parseEntries(entries: string) {
    // check for {@damage 1d8} or {@dice 1d8} and replace with <span>value</span>
    const regex = /{@(damage|dice) (\d+d\d+)}/g;
    // check for {@scaledamage 2d10|2-9|1d10} and replace with <span>{1d10} from level {2}</span>
    const regexScale = /{@(scaledamage|scaledice) (\d+d\d+)\|(\d+-\d+)\|(\d+d\d+)}/g;
    let entry = entries;
    entry = entry.replace(regex, (match, p1, p2) => {
        // Crea el componente con el valor capturado
        const componentString = ReactDOMServer.renderToString(<span className='italic font-semibold'>{p2}</span>);
        return componentString;
    });
    entry = entry.replace(regexScale, (match, p1, p2, p3, p4) => {
        const componentString = ReactDOMServer.renderToString(
                <span className='italic font-semibold'>{p4} </span>
        );
        console.log(componentString);
        return componentString;
    });

    return entry;
}

function Card({ spell }: { spell: Spell }) {
    return (
        <div className=" list-none py-10 min-h-[250px] px-10 text-black bg-zinc-50 shadow-md rounded-xl relative text-left ">
            <div className="" >
                <div className="flex">
                    <h1 className=" text-3xl ">
                        <a href={`/spells/${spell.name}`.replace(" ", "_")}>
                            {spell.name}
                        </a>
                    </h1>
                    <p className=" flex ml-auto text-xl">
                        Lv{spell.level}
                        <img className=" ml-2 w-6 h-6 shadow-md shadow-zinc-300 bg-transparent rounded-full"
                            src={`/static/image/dnd/${schoolParser[spell.school]}.png`} />
                    </p>
                </div>
                <p className=" text-neutral-700 ">
                    {spell.source}, (pg.{spell.page})
                </p>

                <div className="mt-5 flex space-x-2 text-sm">
                    <h3 className="">Components:</h3>
                    {
                        <>
                            {spell.components.v ? <span className="">V</span> : null}
                            {spell.components.s ? <span className="">S</span> : null}
                            {spell.components.m ? <span className="">M</span> : null}
                        </>
                    }
                </div>
            </div>
            <article className="py-10 space-y-10">
                <div className='space-y-2' >
                    {
                        spell.entries.map((entry, index) => {
                            const parsedEntry = parseEntries(entry);
                            return (
                                <p key={index} className="text-sm" dangerouslySetInnerHTML={{ __html: parsedEntry }}></p>
                            )
                        })
                    }
                </div>
                {
                    spell.entriesHigherLevel &&
                    <div>
                        <h3 className="text-lg">At Higher Levels</h3>
                        {
                            spell.entriesHigherLevel.map((entry, index) => {
                                const parsedEntry = parseEntries(entry.entries[0]);
                                console.log("PARSED: ", parsedEntry);
                                return (
                                    <p key={index} className="text-sm" dangerouslySetInnerHTML={{ __html: parsedEntry }}></p>
                                )
                            })
                        }
                    </div>
                }
            </article>
            <div className="absolute bottom-10 left-10">
                <ul className="flex">
                    <li className="flex text-xs">
                        <svg className="mr-2 mt-0.5" fill="#000000" width="14px" height="14px" viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24,12A12,12,0,0,1,0,12a1,1,0,0,1,2,0A10,10,0,1,0,12,2a1,1,0,0,1,0-2A12.013,12.013,0,0,1,24,12ZM10.277,11H8a1,1,0,0,0,0,2h2.277A1.994,1.994,0,1,0,13,10.277V7a1,1,0,0,0-2,0v3.277A2,2,0,0,0,10.277,11ZM1.827,8.784a1,1,0,1,0-1-1A1,1,0,0,0,1.827,8.784ZM4.221,5.207a1,1,0,1,0-1-1A1,1,0,0,0,4.221,5.207ZM7.779,2.841a1,1,0,1,0-1-1A1,1,0,0,0,7.779,2.841Z" />
                        </svg>
                        {spell.time[0].number} &nbsp; {spell.time[0].unit}
                    </li>
                    <li className="flex text-xs ml-6">
                        <svg className="mr-2 mt-0.5" fill="#000000" width="14px" height="14px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M6 8C7.1 8 8 7.1 8 6C8 4.9 7.1 4 6 4C4.9 4 4 4.9 4 6C4 7.1 4.9 8 6 8ZM10 11.43C10 10.62 9.52 9.9 8.78 9.58C7.93 9.21 6.99 9 6 9C5.01 9 4.07 9.21 3.22 9.58C2.48 9.9 2 10.62 2 11.43V12H10V11.43ZM18 8C19.1 8 20 7.1 20 6C20 4.9 19.1 4 18 4C16.9 4 16 4.9 16 6C16 7.1 16.9 8 18 8ZM22 11.43C22 10.62 21.52 9.9 20.78 9.58C19.93 9.21 18.99 9 18 9C17.01 9 16.07 9.21 15.22 9.58C14.48 9.9 14 10.62 14 11.43V12H22V11.43ZM19 19V16.99L5 17V19L2 16L5 13V15.01L19 15V13L22 16L19 19Z"></path>
                            </g>
                        </svg>
                        {
                            spell.range.type == "special" ? "special" : <span>{spell.range.distance.amount} {spell.range.distance.type}</span>
                        }

                    </li>
                    <li className="flex text-xs ml-6">
                        <svg className="mr-2 mt-0.5" fill="#000000" width="14px" height="14px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M15 6H9M20 21H19M19 21H5M19 21C19 18.4898 17.7877 16.1341 15.7451 14.675L12 12M5 21H4M5 21C5 18.4898 6.21228 16.1341 8.25493 14.675L12 12M20 3H19M19 3H5M19 3C19 5.51022 17.7877 7.86592 15.7451 9.32495L12 12M5 3H4M5 3C5 5.51022 6.21228 7.86592 8.25493 9.32495L12 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </g>
                        </svg>
                        {/* {% if spell.duration[0].type == "timed" %}
    {{ spell.duration[0].duration.amount }} &nbsp; {{ spell.duration[0].duration.type }}
    {% else %}
    {{ spell.duration[0].type }}
    {% endif %} */}
                        {
                            // "duration":[{"type":"instant"}],
                            spell.duration[0].type == "timed" ?
                                <span>{spell.duration[0].duration.amount} {spell.duration[0].duration.type}</span>
                                : <span>{spell.duration[0].type}</span>
                        }
                    </li>
                </ul>
            </div>
        </div>

    )
}