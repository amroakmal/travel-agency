const TourModel = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,summary,ratingsAverage,difficulty';
    next();
}

exports.getTour = async(req, res) => {
    try {
        const tour = await TourModel.findById(req.params.id);
        
        res.status(200).json({
            status: 'success',
            responseTime: new Date() - req.requestTime,
            results: 1,
            data: {
                tour
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.createTour = async (req, res) => {
    try {
        const newTour = await TourModel.create(req.body);

        res.status(201).json({
            status: 'success',
            responseTime: new Date() - req.requestTime,
            results: 1,
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid data sent!'
        })
    }
}

exports.getAllTours = async (req, res) => {
    try {
        console.log("AMR")
        //Another method for querying using mongoose
        // const tours = await TourModel.find()
        //     .where('difficulty').equals("easy")
        //     .where('duration').equals(5)

        const execludedFields = ['sort', 'page', 'fields', 'limit'];
        let queryObj = {...req.query};

        execludedFields.forEach(el => delete queryObj[el]);

        //Filtering operations
        //Query related to gte, gt, lte, lt
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, matched => `$${matched}`);

        let query = TourModel.find(JSON.parse(queryStr));
        //Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        //Limiting by wanted fields only
        if(req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        //Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const toBeSkipped = (page - 1) * limit;

        if(req.query.page) {
            const totalNumberOfTours = await TourModel.countDocuments();
            if(toBeSkipped >= totalNumberOfTours) {
                throw new Error ('This page does not exist!');
            }
        }

        query = query.skip(toBeSkipped).limit(limit);

        //await the "query" variable to get executes, i.e. execute the query variable by making the required
        //query and return the results to the tours variable
        const tours = await query;
        res.status(200).json({
            status: 'success',
            responseTime: new Date() - req.requestTime,
            requestTime: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.updateTour = async (req, res) => {
    try {
        const updatedTour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            responseTime: new Date() - req.requestTime,
            results: 1,
            data: {
                updatedTour
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await TourModel.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            responseTime: new Date() - req.requestTime,
            results: 0,
            data: null
        });
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}
