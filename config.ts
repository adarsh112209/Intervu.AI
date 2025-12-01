import dotenv from "dotenv";
dotenv.config();

export const API_KEY = process.env.VITE_API_KEY as string;
