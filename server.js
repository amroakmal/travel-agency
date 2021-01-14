const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true
}).then(() => console.log("Successfully connected to the DB"));

const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log('App is running...');
})

process.on('unhandledRejection', (err) => {
    console.log(`Error name: ${err.name}`, "\n", `Error Message: ${err.message}`, "\n");
    server.close(() => {
        console.log("SHUTTING DOWN!");
        process.exit(1);
    });
});