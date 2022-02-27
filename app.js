require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// 額外套件
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// error handlers
const errorHandlerMiddlerware = require('./middleware/error-handler');
const notFoundMiddlerware = require('./middleware/not-found');

// 連接資料庫
const connectDB = require('./db/connect');

// 載入路由

// middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));


// 監聽 port
const port = process.env.PORT || 5000;

// 初始化
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`server is listening on port ${port} ...`);
    })
  } catch(err) {
    console.log(err);
  }
}

start()
