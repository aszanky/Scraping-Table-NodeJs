
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Kurs = new Schema({
    symbol: String,
    e_rate: {
        jual: Number,
        beli: Number
    },
    tt_counter: {
        jual: Number,
        beli: Number
    },
    bank_notes: {
        jual: Number,
        beli: Number
    },
    date: Date
});

module.exports = mongoose.model('Kurs', Kurs);
