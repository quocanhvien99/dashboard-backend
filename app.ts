import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import 'dotenv/config';
import mysql from 'mysql2';
import userRoute from './routes/user';
import departmentRoute from './routes/department';
import classRoute from './routes/class';
import scoreRoute from './routes/score';
import subjectRoute from './routes/subject';
import timetableRoute from './routes/timetable';
import statisticRoute from './routes/statistic';
import cors from 'cors';
import saveActivity from './middleware/saveActivity';

declare module 'express-session' {
	export interface SessionData {
		uid: string;
		role: string;
	}
}

const app = express();

const RedisStore = connectRedis(session);
const redisClient = new Redis();
app.locals.redisClient = redisClient;
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

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.locals.sqlCon = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
});

app.use(saveActivity);

app.use('/user', userRoute);
app.use('/department', departmentRoute);
app.use('/subject', subjectRoute);
app.use('/class', classRoute);
app.use('/score', scoreRoute);
app.use('/timetable', timetableRoute);
app.use('/statistic', statisticRoute);

app.use(express.static('./public'));

app.listen(process.env.PORT || 3000);
