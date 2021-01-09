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

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Tour must have a name'],
        unique: true
    },
    price: {
        type: Number,
        require: [true, 'A Tour must have a price']
    },
    rating: {
        type: Number,
        default: 4.5
    }
})

const Tour = mongoose.model('Tour', tourSchema);

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('App is running...');
})
