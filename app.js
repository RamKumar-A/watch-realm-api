const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('helmet');
const compression = require('compression');

const brandRouter = require('./routes/brandRoute');
const watchRouter = require('./routes/watchRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');
const cartRouter = require('./routes//cartRoute');
const orderRouter = require('./routes/orderRoute');
const wishlistRouter = require('./routes/wishlistRoute');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();

// const corsOptions = (req, callback) => {
//   const origin = req.headers.origin;

//   if (origin) {
//     callback(null, {
//       origin: true, // Allow the request from this origin
//       credentials: true,
//     });
//   } else {
//     callback(new Error('Not allowed by CORS'));
//   }
// };

// app.use(cors(corsOptions));
app.use(cors());
app.options('*', cors());
app.use(helmet());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());

app.use(compression());

app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/watches', watchRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/wishlist', wishlistRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
