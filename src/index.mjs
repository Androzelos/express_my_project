import mongoose from 'mongoose';
import { createApp } from './createApp.mjs';
import dotenv from 'dotenv';

dotenv.config();

mongoose    
.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err))

const app = createApp();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})