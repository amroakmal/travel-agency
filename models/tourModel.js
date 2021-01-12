const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Tour must have a name'],
        unique: true,
        trim: true
    },
    slug: String,
    price: {
        type: Number,
        required: [true, 'A Tour must have a price']
    },
    duration: {
        type: Number,
        required: [true, 'A duration must be specified']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A group size for the tour must be given']
    },
    difficulty: {
        type: String,
        required: [true, 'Difficulty must be specified']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number, 
        default: 0
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    }, 
    description: {
        type: String,
        trim: true
    }, 
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }, 
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', function(next) {
//     console.log('Saving the new document');
//     next();
// });

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// })

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;