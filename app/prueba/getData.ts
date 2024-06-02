import { openDb } from "@/lib/data";
import { Campign } from "@/lib/types";



export async function getCampign(name: string) {
    const db = await openDb();
    const campaign: {[n:string]:string} | undefined = await db.get(`SELECT * FROM campaigns WHERE name=?`, [name]);
    let parsedCampaign : any | undefined = {};
    if(campaign){
        Object.entries(campaign).forEach(([key, value]) => {
            try{
                parsedCampaign[key] = JSON.parse(value);
            }
            catch(e){
                parsedCampaign[key] = value;
            }
        });
    }
    db.close();
    return parsedCampaign as Campign | undefined;
}


export async function getCampignbyId(name: string){
    const db = await openDb();
    const campaign: {[n:string]:string} | undefined = await db.get(`SELECT * FROM campaigns WHERE id=?`, [name]);
    let parsedCampaign : any | undefined = {};
    if(campaign){
        Object.entries(campaign).forEach(([key, value]) => {
            try{
                parsedCampaign[key] = JSON.parse(value);
            }
            catch(e){
                parsedCampaign[key] = value;
            }
        });
    }
    db.close();
    return parsedCampaign as Campign | undefined;
}