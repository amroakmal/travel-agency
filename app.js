const express = require('express');
const app = express();
const fs = require('fs');
const { type } = require('os');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// A middleware to add the request data to the req object in the post request, data added in req.body
app.use(express.json())

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    });
}

const getTour = (req, res) => {
    const id = req.params.id * 1;
    let tour = tours.find(e => (e.id === id));
    if(!tour) {
        return res.status(404).json({
            status: 'failed',
            results: 0,
            message: 'Invalid ID'
        })
    }
    res.status(200).json({
        status: 'success',
        results: 1,
        data: {
            tour
        }
    });
}

const updateTour = (req, res) => {
    const id = req.params.id * 1;
    let tour = tours.find(e => (e.id === id));
    if(!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID'
        })
    }
    res.status(200).json({
        status: 'success',
        results: 1,
        data: {
            tour: 'Update done'
        }
    });
}

const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    let tour = tours.find(e => (e.id === id));
    if(!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID'
        })
    }
    res.status(204).json({
        status: 'success',
        results: 0,
        data: null
    });
}

const addTour = (req, res) => {
    const newId = tours.length;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    console.log(JSON.stringify(tours))
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if(err) {
            return console.log(err);
        }
        res.status(201).json({
            status: 'success',
            results: 1,
            data: {
                tour: newTour
            }
        })
    })
}

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(addTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.listen(3000, () => {
    console.log('App is running');
})