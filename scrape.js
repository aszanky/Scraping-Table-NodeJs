// const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
// const Kurs = require('./models/kurs');
// const fs = require('fs');
// const writeStream = fs.createWriteStream('kurs.csv');
// const mongoose = require('mongoose');
// const config = require('./config/config');

const url = 'https://www.bca.co.id/individu/sarana/kurs-dan-suku-bunga/kurs-dan-kalkulator';

// writeStream.write(`MataUang,JualER,BeliER,JualTT,BeliTT,JualBN,BeliBN \n`);

request(url, (error, response, html) => {
    const currencyPost = [];
    if (!error) {
        const $ = cheerio.load(html);
        const curr = [];
        const jualER = [];
        const beliER = [];
        const jualTT = [];
        const beliTT = [];
        const jualBN = [];
        const beliBN = [];

        $('.text-right tr').each((i, el) => {
            // const cekCurr = $(el).text();
            curr.push($(el).find('td:nth-child(1)').text());
            jualER.push($(el).find('td:nth-child(2)').text());
            beliER.push($(el).find('td:nth-child(3)').text());
            jualTT.push($(el).find('td:nth-child(4)').text());
            beliTT.push($(el).find('td:nth-child(5)').text());
            jualBN.push($(el).find('td:nth-child(6)').text());
            beliBN.push($(el).find('td:nth-child(7)').text());

            // writeStream.write(`${curr}, ${jualER}, ${beliER}, ${jualTT}, ${beliTT}, ${jualBN}, ${beliBN} \n`);
        });

        curr.forEach((x, idx) => {
            currencyPost.push({
                symbol: x,
                e_rate: {
                    jual: parseFloat(jualER[idx]),
                    beli: parseFloat(beliER[idx]),
                },
                tt_counter: {
                    jual: parseFloat(jualTT[idx]),
                    beli: parseFloat(beliTT[idx])
                },
                bank_notes: {
                    jual: parseFloat(jualBN[idx]),
                    beli: parseFloat(beliBN[idx])
                },
                date: new Date()
            })
        });
        console.log('Kurs Scripping was done');
    }
    console.log(currencyPost);
});
