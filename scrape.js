
var downloadComplete = false;

var casper = require('casper').create({
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    },
    webSecurityEnabled: false,
    logLevel: "debug",
    verbose: true,
        onWaitTimeout: function() {
            logConsole('Wait TimeOut Occured');
            this.capture('xWait_timeout.png');
            this.exit();
        },
        onStepTimeout: function() {
            logConsole('Step TimeOut Occured');
            this.capture('xStepTimeout.png');
            this.exit();
        },
    onResourceReceived: function(casper, response) {
        if(response.contentType == 'text/comma-separated-values' && !downloadComplete) {
            this.download(response.url, 'spk_____rechnung_' + (new Date()).getTime() + '.csv');
            downloadComplete = true;
        }
    }
});

var env = require('system').env
var user = env.USER;
var password = env.PASSWORD;

if(!user || !password) {
    console.log('User and password needed');

    casper.exit();
}


casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4');

casper.start('https://banking.sparkasse-unstrut-hainich.de/portal/portal/StartenIPSTANDARD?IID=82056060&AID=IPSTANDARD&n=/onlinebanking/startseite/', function() {
    this.fillSelectors('form[action*="?ilu=/Login"]', {
        'input[type=text].il': user,
        'input[type=password]': password,
    }, false);

    this.click('input[id="defaultAction"]');
});

casper.waitForText('Umsätze', function() {
    this.click('a[title="Umsätze"]');
})

casper.waitForText('Umsatzabfrage', function() {
    this.click('input[value="Export"]');
})

casper.run();
