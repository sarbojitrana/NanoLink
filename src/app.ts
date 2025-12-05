import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))


app.use(express.json({
    limit : "16kb"
}))

app.use(express.static("public"));

app.use(express.urlencoded({
    extended : true,
    limit : "16kb"
}))

app.use(cookieParser());

import { errorHandler } from "./middlewares/errorHandler.js";
import { ApiError } from "./utils/ApiError.js";

app.use((req,res,next)=>{
    next(new ApiError(404, "Route not found"));
})



app.use(errorHandler);


export {app} ;

