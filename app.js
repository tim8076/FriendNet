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
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');

// middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));


// 路由表
app.get('/', (req, res) => {
  res.send('歡迎來到friend-net專案');
})

app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies);
  res.send('cookie')
})

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

app.use(notFoundMiddlerware);
app.use(errorHandlerMiddlerware);

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

start();
