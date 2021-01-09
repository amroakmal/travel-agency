const mongoose = require('mongoose');

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

module.exports = Tour;