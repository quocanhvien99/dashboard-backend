import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Redis from 'ioredis';
import redis from 'redis';
import connectRedis from 'connect-redis';
import 'dotenv/config';
import { Pool } from 'pg';
import mysql from 'mysql2';
import userRoute from './routes/user';

const app = express();

const RedisStore = connectRedis(session);
const redisClient = new Redis();
app.use(
	session({
		store: new RedisStore({ client: redisClient }),
		secret: process.env.SESSION_SECRET as string,
		resave: false,
		saveUninitialized: true,
		rolling: true,
		cookie: { maxAge: 30 * 60 * 1000 },
	})
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.locals.sqlCon = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
});

app.use('/user', userRoute);

app.use(express.static('./public'));

app.listen(process.env.PORT || 3000);
