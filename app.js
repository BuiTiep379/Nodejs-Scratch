const dotenv = require('dotenv')
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const app = express();

// dotenv config
dotenv.config({ path: './src/config/.env' });

// passport config 
require('./src/config/passport')(passport);

const connectDB = require('./src/db/connect');

const { formatDate } = require('./src/helper/hbs');
// import routes
const router = require('./src/routes');
const authRouter = require('./src/routes/auth');
const storyRouter = require('./src/routes/story');

// app static file 
app.use(express.static(path.join(__dirname,'./src/public')));

/// express-handlebar engine 
app.engine('.hbs', engine({
  helpers: {
    formatDate
  },
    extname: '.hbs',
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './src/views'));

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    })
  )
/// passport middleware 
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// express - session middleware 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

/// router 
app.use('/stories', storyRouter);
app.use('/auth', authRouter);
app.use('/', router);


const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGO_URL);

app.listen(PORT, () => console.log(`App running at http://localhost:${PORT}`));
