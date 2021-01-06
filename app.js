const express = require('express');
const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

console.log("Enviroment:", process.env.NODE_ENV);
console.log("Port:", process.env.PORT);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    req.requestTime = new Date();
    const delay = Math.floor(Math.random() * 10) * 1000;
    next();
    // console.log(delay);
    // setTimeout(() => next(), delay);
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use((req, res) => {
    return res.status(404).json({
        status: 'failed',
        message: 'Page not found'
    })
});

module.exports = app;
