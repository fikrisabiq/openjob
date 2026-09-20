// mengimpor dotenv dan menjalankan konfigurasinya
import 'dotenv/config';

import express from 'express';
import routes from '../routes/index.js';
import ErrorHandler from '../middlewares/error.js';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: '*'
}));

app.use(express.json());
app.use('/uploads', express.static('src/services/documents/file/pdf'));
app.use(routes);

app.use(ErrorHandler);

export default app;