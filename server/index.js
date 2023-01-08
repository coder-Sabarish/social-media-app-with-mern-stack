import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

/* routes import */
import {register} from "./Controllers/auth.js";


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname,'public/assets')))


/* File Storage */

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/assets");
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    },
});
const upload = multer({storage});

/* Routes */

app.post("/auth.register", upload.single("picture"), register);

/* Mongoose connection */
const PORT = process.env.PORT || 6000;

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useunifiedTopology: true,
})
.then(() => {
    app.listen(PORT, () => console.log(`DB connected Successfully`));
})
.catch((error) => console.log(`${error} did not connect`));

console.log(`Server running at port ${PORT}`);