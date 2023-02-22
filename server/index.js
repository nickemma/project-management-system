import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema.js';
import morgan from 'morgan';

const app = express();

// ========= Middlewares ===========

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors());
app.use(morgan('dev'));
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development' ? true : false,
  })
);

// ========= Routes ===========

// ========= Database Connection ===========

const CONNECTION_URL = process.env.MONGO_URI || '';
const port = process.env.PORT;

mongoose.set('strictQuery', false);
mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get('/', (req, res) => {
  res.send('Hello to Memories API');
});
