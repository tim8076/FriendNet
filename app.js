if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
};
require('express-async-errors');
const express = require('express');
const app = express();

// 額外套件
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

// 安全性套件
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// error handlers
const errorHandlerMiddlerware = require('./middleware/error-handler');
const notFoundMiddlerware = require('./middleware/not-found');

// 連接資料庫
const connectDB = require('./db/connect');

// 載入路由
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const postRouter = require('./routes/postRoute');
const commentRouter = require('./routes/commentRoute');
const friendRouter = require('./routes/friendRoute');
const imageUploadRouter = require('./routes/imageUploadRoute');

// middleware

app.set('trust proxy', 1);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}));
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(fileUpload({ useTempFiles: true }));


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
app.use('/api/v1/post', postRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/friend', friendRouter);
app.use('/api/v1/image', imageUploadRouter);

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
