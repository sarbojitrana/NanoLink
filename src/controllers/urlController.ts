import { Request, Response, NextFunction } from "express"
import {pool} from "../config/db.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {encode, decode} from "../services/urlService.js"


const createShortUrl = asyncHandler(async(req : Request, res : Response, next : NextFunction)=>{
    const {originalUrl} = req.body ;

    if(!originalUrl){
        throw new ApiError(400, "No URL provided");
    }
    const result = await pool.query(`SELECT nextval('urls_id_seq')`);
    const nextID = parseInt(result.rows[0].nextval);

    const encodedString = encode(nextID) ;

    const query = `
        INSERT INTO urls (id, original_url, short_code)
        VALUES($1, $2, $3)
        RETURNING *;
    `

    const data = await pool.query(query, [nextID, originalUrl, encodedString]);
    const urlEntry = data.rows[0];

    return res.status(201).json(
        new ApiResponse(201, urlEntry, "URL shortened successfully")
    )
    
})


const redirectToOriginal = asyncHandler( async(req : Request, res : Response, next : NextFunction) =>{

    const {shortCode} = req.params ;
    const id = decode(shortCode);

    const query = `SELECT original_url FROM urls WHERE id = $1`

    const entry = await pool.query(query, [id])

    if(entry.rowCount === 0){
        throw new ApiError(404, "URL not found")
    }

    const originalUrl = entry.rows[0].original_url

    pool.query("UPDATE urls SET clicks = clicks + 1 WHERE id = $1", [id]);

    return res.redirect(originalUrl)

})


export {createShortUrl, redirectToOriginal}