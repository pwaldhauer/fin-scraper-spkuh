# fin-scraper-spkuh

Downloads the most recent csv from Sparkasse Unstrut Hainich, because I am to lazy to implement HBCI.

## Running

Scrape: `USER="x" PASSWORD="y"  casperjs --ssl-protocol=any scrape.js`
Import: `URL="Endpoint" TOKEN="Auth-Token" node import.js --file crawl.csv`
