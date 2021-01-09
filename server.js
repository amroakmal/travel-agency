const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true
})
    .then(() => console.log("Connected to the DB"));

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    console.log('App is running...');
})
