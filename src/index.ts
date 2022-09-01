import express, { json } from 'express';
import cors from 'cors';
import 'express-async-errors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors(), json());

const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
