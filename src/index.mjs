import mongoose from 'mongoose';
import { createApp } from './createApp.mjs';
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

dotenv.config();

mongoose    
.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err))

const app = createApp();

const PORT = process.env.PORT;

app.use('/resetPassword', express.static(path.join(__dirname, '/front/auth')))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})