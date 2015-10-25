var csv = require('csv');
var fs = require('fs');
var request = require('request');
var moment = require('moment');
var argv = require('minimist')(process.argv.slice(2));

var url = process.env.URL;
var token = process.env.TOKEN;

if (!url ||  !token) {
    console.log('url and token needed');
    process.exit();
}

var parser = csv.parse({
    delimiter: ';',
    columns: true,
    trim: true
}, function(err, rows) {
    for (var i in rows) {
        var data = rows[i];
        if (data['Info'] != 'Umsatz gebucht') {
            continue;
        }

        params = {
            'account_id': 1,
            'booked_at': moment(data['Valutadatum'], 'DD.MM.YY').toISOString(),
            'value': parseFloat(data['Betrag'].replace(',', '.')) * 100,
            'original_text': data['Buchungstext'] + ' ' + data['Verwendungszweck'] + ' ' + data['Beguenstigter/Zahlungspflichtiger'],
            'data': data
        }

        console.log(params);
//continue;
        request({
            method: 'POST',
            uri: url,
            headers: {
                'X-Auth-Token': token
            },
            body: params,
            json: true
        }, function(error, response, body) {
            console.log(body);
        })
    }


});

fs.createReadStream(argv.file).pipe(parser);
