const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkValidID = (req, res, next, val) => {
    if(val * 1 >= tours.length) {
        return res.status(404).json({
            status: 'failed',
            responseTime: new Date() - req.requestTime,
            message: 'Invalid ID'
        })
    }
    next();
}

exports.checkBody = (req, res, next) => {
    const { name, price } = req.body;

    if(!name || !price) {
        return res.status(400).json({
            status: 'failed',
            responseTime: new Date() - req.requestTime,
            message: 'Invalid input data'
        })
    }
    next();
}

exports.checkValidBody = (req, res, next, val) => {
    if(val * 1 >= tours.length) {
        return res.status(404).json({
            status: 'failed',
            responseTime: new Date() - req.requestTime,
            message: 'Invalid ID'
        })
    }
    next();
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        responseTime: new Date() - req.requestTime,
        requestTime: req.requestTime,
        results: tours.length,
        data: {
            tours: tours
        }
    });
}

exports.getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    res.status(200).json({
        status: 'success',
        results: 1,
        responseTime: new Date() - req.requestTime,
        data: {
            tour
        }
    });
}

exports.addTour = (req, res) => {
    const newId = tours.length;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if(err) {
            return console.log(err);
        }
        res.status(201).json({
            status: 'success',
            responseTime: new Date() - req.requestTime,
            results: 1,
            data: {
                tour: newTour
            }
        })
    })
}

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        responseTime: new Date() - req.requestTime,
        results: 1,
        data: {
            tour: 'Update done'
        }
    });
}

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        responseTime: new Date() - req.requestTime,
        results: 0,
        data: null
    });
}


