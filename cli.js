#!/usr/bin/env node

const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'http://estagios.di.fct.unl.pt/public/professor/tese.php';
const _ = require('lodash');

rp(url)
  .then(function(html) {
    var thesis = [];

    var $ = cheerio.load(html);
    $('tr').each(function(i, elem) {
      if (i > 1) {
        var name = $('td[class=name_cell]', $(this).html()).text();
        var info = $('td[class=info_cell]', $(this).html()).text();
        var date = info.substring(info.length - 10, info.length).split('-');
        if (name)
          thesis.push({ name, date: new Date(date[0], date[1] - 1, date[2]) });
      }
    });

    // Sort thesis by date
    thesis.sort(function(a, b) {
      return a.date - b.date;
    });

    // Group thesis by date
    thesis = _.groupBy(thesis, e => e.date);

    // Print
    var j = 1;
    _.each(thesis, (i, e) => {
      console.log('( %s )', e);
      thesis[e].forEach(t => {
        console.log('(%d) %s', j++, t.name);
      });
      console.log(' ');
    });
  })
  .catch(function(err) {
    console.log('An error occured. Please try again.');
  });
