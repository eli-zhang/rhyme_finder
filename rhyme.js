const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const cwait = require('cwait');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const wordsDict = JSON.parse(fs.readFileSync('words_dictionary.json'));
const words = Object.keys(JSON.parse(fs.readFileSync('words_dictionary.json')));

function findPronunciations() {
    let active = 0;
    let finished = 0;
    let scheduled = 0;
    let curr = 0;
    let queueMax = 10;

    function schedule() {
        while (active < queueMax && scheduled < words.length) {
            active++;
            scheduled++;
            let url = `https://www.merriam-webster.com/dictionary/${words[curr]}?utm_campaign=sd&utm_medium=serp&utm_source=jsonld`
            let req = new XMLHttpRequest()
            req.open("GET", url, true)
            req.onreadystatechange = (e) => {
                if (req.readyState == 4) {
                    const html = req.responseText
                    const $ = cheerio.load(html)
                    if ($('.mispelled-word') != "") {
                        console.log(`${words[curr]} - no definition`)
                    } else {
                        text = $('.pr').text()
                        if (text == "") {
                            console.log(html)
                            console.log(words[curr])
                        }
                        console.log(`${words[curr]} - ${text}`);
                    }
                    curr++;
                    active--;
                    finished++;
                    if (finished == words.length)
                    {
                        console.log("Done!");
                        return;
                    } else if (scheduled < words.length)
                        schedule();
                    }
            }
            req.send()
        }
    }
    schedule()
}

findPronunciations()
