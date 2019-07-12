const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const wordsDict = JSON.parse(fs.readFileSync('words_dictionary.json'));
const words = Object.keys(JSON.parse(fs.readFileSync('words_dictionary.json')));

function findPronunciations() {
    let active = 0;
    let finished = 0;
    let scheduled = 0;
    let curr = 0;
    let queueMax = 30;

    function schedule() {
        while (active < queueMax && scheduled < words.length) {
            active++;
            let word = words[scheduled++]
            let url = `https://www.merriam-webster.com/dictionary/${word}?utm_campaign=sd&utm_medium=serp&utm_source=jsonld`

                axios.get(url).then(response => {
                    const html = response.data
                    const $ = cheerio.load(html)
                    if ($('.mispelled-word') != "") {
                        console.log(`${word} - no definition`)
                    } else {
                        text = $('.pr').text().trim()
                        if (text == "") {
                            console.log(`${word} - No pronunciation`);
                        }
                        else {
                            wordsDict[word] = text
                            console.log(`${word} - ${text}`);
                        }
                    }
                }).catch((error) => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        // console.log(error.response.data);
                        // console.log(error.response.status);
                        // console.log(error.response.headers);
                        console.log(`${word} - No definition`)
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        // console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        // console.log('Error', error.message);
                    }
                }).finally(() => {
                    active--;
                    finished++;
                    if (finished == words.length)
                    {
                        console.log("Done!");
                        return;
                    } else if (scheduled < words.length) {
                        schedule();
                    }
                })
        }
    }
    schedule()
}

findPronunciations()