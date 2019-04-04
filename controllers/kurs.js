const mongoose = require('mongoose');
const { Router } = require('express');
const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const Kurs = require('../models/kurs');

module.exports = ({config, db}) => {
    let api = Router();

    // /api/indexing
    api.get('/indexing', (req, res) => {
        const url = 'https://www.bca.co.id/individu/sarana/kurs-dan-suku-bunga/kurs-dan-kalkulator';
        request(url, (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                let currencyPost = [];
        
                $('.text-right tr').each((i, el) => {
                    const curr = $(el).find('td:nth-child(1)').text();
                    const jualER = $(el).find('td:nth-child(2)').text();
                    const beliER = $(el).find('td:nth-child(3)').text();
                    const jualTT = $(el).find('td:nth-child(4)').text();
                    const beliTT = $(el).find('td:nth-child(5)').text();
                    const jualBN = $(el).find('td:nth-child(6)').text();
                    const beliBN = $(el).find('td:nth-child(7)').text();

                    let result = {
                        symbol: curr,
                        e_rate: {
                            jual: parseFloat(jualER),
                            beli: parseFloat(beliER),
                        },
                        tt_counter: {
                            jual: parseFloat(jualTT),
                            beli: parseFloat(beliTT)
                        },
                        bank_notes: {
                            jual: parseFloat(jualBN),
                            beli: parseFloat(beliBN)
                        },
                        date: moment(new Date()).format('YYYY-MM-DD')
                    }

                    currencyPost.push(result);
                });
                currencyPost.map( async(curr) => {
                    let newKurs = new Kurs(curr);
                    await newKurs.save(() => {
                        res.json({ message: 'Kurs was scraped successfully'});
                    });
                });
                console.log('Kurs Scripping was done');
            }
        });
    });

    api.post('/kurs', (req, res) => {
        let newKurs = new Kurs();
        newKurs.symbol = req.body.symbol;
        newKurs.e_rate = {
            jual: req.body.jual,
            beli: req.body.beli,
        };
        newKurs.tt_counter = {
            jual: req.body.jual,
            beli: req.body.beli,
        };
        newKurs.bank_notes = {
            jual: req.body.jual,
            beli: req.body.beli,
        };

        newKurs.save(err => {
            if(err) {
                res.send(err);
            }
            res.json({ message: 'Course saved successfully'});
        });
    });

    // '/api/kurs?startdate=''&enddate=endate - READ 1
    // api.get('/kurs', (req, res) => {
    //     const startdate =  moment(req.query.startdate).format('YYYY-MM-DD')
    //     const enddate = moment(req.query.enddate).format('YYYY-MM-DD');

    //     // console.log(startdate);

    //     // Kurs.find({ startdate: startdate, enddate: enddate}, (err, data) => {
    //     //     if (err) {
    //     //         res.send(err);
    //     //     }
    //     //     res.send(data);
    //     // });
    //     res.json({
    //         startdate,
    //         enddate
    //     })
    // });

    // // 'v1/foodTruck/:id' - UPDATE
    // api.put('/:id', (req, res) => {
    //     FoodTruck.findById(req.params.id, (err, foodTruck) => {
    //         if (err) {
    //             res.send(err);
    //         }
    //         foodTruck.name = req.body.name;
    //         foodTruck.save(err => {
    //             if (err) {
    //                 res.send(err);
    //             }
    //             res.json({message : "FoodTruck info updated"});
    //         });
    //     });
    // });

    // // 'v1/foodTruck/:id' - DELETE

    // api.delete('/:id', (req, res) => {
    //     FoodTruck.remove({
    //         _id: req.params.id
    //     }, (err, foodTruck) => {
    //         if(err) {
    //             res.send(err);
    //         }
    //         res.json({message: "FoodTruck successfully removed"});
    //     });
    // });

    // // 'v1/foodtruck/reviews/add/:id' - POST
    // api.post('/reviews/add/:id', (req, res) => {
    //     FoodTruck.findById(req.params.id, (err, foodtruck) => {
    //         if(err) {
    //             res.send(err);
    //         }
    //         let newReview = new Review();
    //         newReview.title = req.body.title;
    //         newReview.text = req.body.text;
    //         newReview.foodtruck = foodtruck._id;
    //         newReview.save((err, review) => {
    //             if(err) {
    //                 res.send(err);
    //             }
    //             foodtruck.reviews.push(newReview);
    //             foodtruck.save(err => {
    //                 if(err) {
    //                     res.send(err);
    //                 }
    //                 res.json({message: 'Food Truck review saved!'});
    //             })
    //         })
    //     })
    // })

    // // get reviews for a spesific foodtruck id
    // // '/v1/foodtruck/reviews/:id'
    // api.get('/reviews/:id', (req, res) => {
    //     Review.find({foodtruck: req.params.id}, (err, reviews) => {
    //         if (err) {
    //             res.send(err);
    //         }
    //         res.json(reviews);
    //     })

    // })

    return api;
}
