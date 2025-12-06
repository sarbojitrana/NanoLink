import {pool} from "../config/db.js"

export interface Url {
    id : number;
    original_url : string;
    short_code : string;
    clicks : number;
    created_at : Date;
}

export const createUrlTable = async () =>{
    const query = `
        CREATE TABLE IF NOT EXISTS urls(
            id SERIAL PRIMARY KEY,
            original_url TEXT NOT NULL,
            short_code VARCHAR(10) UNIQUE NOT NULL,
            clicks INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `

    try{
        await pool.query(query);
        console.log("Table 'urls' created successfully." )
    }
    catch(err){
        console.error("Error while creating 'url' table : ", err);
    }
}
