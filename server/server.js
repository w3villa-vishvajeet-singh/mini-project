const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const userModels = require('./model/userModel');
const verificationModels = require('./model/verificationModel');
require('./config/dbConnection');
const userRouter = require("./routes/userRoutes");
const cors = require("cors");
const body_parser = require("body-parser");
const auth = require("./controller/auth");
const cookieParser = require("cookie-parser");
const { protect } = require("./helper/authMiddleware");
const morgan = require('morgan');
const { createTable } = require('./model/profile'); // Import the createTable function
const profileRouter = require('./routes/Profileroutes')
const app = express();
const PORT = 8001;

app.use(express.json());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: '0a2fccb9e4b9e8dda57bfcf25b94f934ec861999b909c82f52b117a978cdedb30a134b254a46cf8937d8f80d04401cdc2ff7282f9322d88849b69f592b607827',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(morgan('dev'));

// Create tables
userModels.createTable();
verificationModels.createTable();
createTable(); // Call the createTable function for profiles

// Use routers
app.use('/api', userRouter);
app.use('/api/profile', profileRouter);// Correctly use the profileRouter for /api/profile

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => console.log('Server is running on Port ' + PORT));
