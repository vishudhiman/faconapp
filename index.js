import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'; // color the statements in the server side console log
import morgan from 'morgan'; // show the API endpoints
import cors from 'cors'; // allow cross origin requests
import compression from 'compression'; // use gzip compression in the express server
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config()

const app = express();

// use morgan in development mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));


// connect to the mongoDB database
connectDB();


app.use(express.json()); // middleware to use req.body
app.use(cors({
  origin : ["http://localhost:3000"]
})); // to avoid CORS errors
app.use(compression()); // to use gzip)

//configure all the routes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

// app.get('/api/config/paypal', (req, res) =>
//   res.send(process.env.PAYPAL_CLIENT_ID)
// )

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

// middleware to act as fallback for all 404 errors
app.use(notFound);

// configure a custome error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
