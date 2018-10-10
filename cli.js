#!/usr/bin/env node

const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'http://estagios.di.fct.unl.pt/public/professor/tese.php';

rp(url)
  .then(function(html) {
    //success!
    var thesis = [];
    var $ = cheerio.load(html);
    $('tr').each(function(i, elem) {
      if (i > 1) {
        var name = $('td[class=name_cell]', $(this).html()).text();
        var info = $('td[class=info_cell]', $(this).html()).text();
        var date = info.substring(info.length - 10, info.length);
        if (name) thesis.push({ name, date });
      }
    });
    thesis.sort(function(a, b) {
      var a_date = a.date.split('-');
      var b_date = b.date.split('-');
      return (
        new Date(a_date[0], a_date[1], a_date[2]) -
        new Date(b_date[0], b_date[1], b_date[2])
      );
    });
    thesis.forEach((v, i) => {
      console.log('[' + i + '] (' + v.date + ') ' + v.name);
    });
    //console.log($('td[class=name_cell]').text());
    //console.log($('td[class=info_cell]').text());
  })
  .catch(function(err) {
    //handle error
  });
