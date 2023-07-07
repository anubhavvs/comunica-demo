import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import router from './routes.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running  on port ${port}`));
