const express = require('express');
const app = express();
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// A middleware to add the request data to the req object in the post request, data added in req.body
app.use(express.json())

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    });
})

app.post('/api/v1/tours', (req, res) => {
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
})

app.listen(3000, () => {
    console.log('App is running');
})