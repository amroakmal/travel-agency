const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

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
    let tour = tours.find(e => (e.id === id));
    if(!tour) {
        return res.status(404).json({
            status: 'failed',
            results: 0,
            responseTime: new Date() - req.requestTime,
            message: 'Invalid ID'
        })
    }
    res.status(200).json({
        status: 'success',
        results: 1,
        responseTime: new Date() - req.requestTime,
        data: {
            tour
        }
    });
}

exports.updateTour = (req, res) => {
    const id = req.params.id * 1;
    let tour = tours.find(e => (e.id === id));
    if(!tour) {
        return res.status(404).json({
            status: 'failed',
            responseTime: new Date() - req.requestTime,
            message: 'Invalid ID'
        })
    }
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
    const id = req.params.id * 1;
    let tour = tours.find(e => (e.id === id));
    if(!tour) {
        return res.status(404).json({
            status: 'failed',
            responseTime: new Date() - req.requestTime,
            message: 'Invalid ID'
        })
    }
    res.status(204).json({
        status: 'success',
        responseTime: new Date() - req.requestTime,
        results: 0,
        data: null
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

