//He just used this fs for the file system
const fs = require('fs');

const puppeteer = require('puppeteer');

//This is essentially launching a browser programatically so we can do things like access different pages
async function run() {
    const browser = await puppeteer.launch();

    //This is used to access a page, the newPage function seems to be built in
    const page = await browser.newPage();

    //To go to a specific page 
    await page.goto('https://www.traversymedia.com');

    //To create a screenshot, you can also use the fullPage property to make the screenshot take the whole page
    //await page.screenshot({path: 'example.png', fullPage: true});

    //To get a pdf format of a page 
    await page.pdf({ path:'example.pdf', format: 'A4'});

    //To get all the HTML of a page
    const html = await page.content();
    //console.log(html);

    //If you want to target H3's there is a message called evaluate. Just basically
    // allows you to evaluate on the page object
    const title = await page.evaluate(() => document.title);
    //console.log(title);

    //Here we get all the text on the page
    const text  = await page.evaluate(() => document.body.innerText)
    //console.log(text);

    //Here we use the querySelectorAll to select all the anchor tags. The Array.From method
    // makes a shallow copy of an array from an iterable object such as a node list. The second argument
    // has e represent the element and for each one we get element's href. Hence we get all the links
    const links = await page.evaluate(() => Array.from(document.querySelectorAll('a'), (e)=> e.href));
    //console.log(links);

    //Here we get all the courses from his site
    // const courses = await page.evaluate(() => 
    //     Array.from(document.querySelectorAll('#courses .card'), (e)=> ({
    //         title: e.querySelector('.card-body h3').innerText,
    //         level: e.querySelector('.card-body .level').innerText,
    //         url: e.querySelector('.card-footer a').href,
    //         promo: e.querySelector('.card-footer .promo-code .promo').innerText
    //     }))
    // );
    //console.log(courses);

    //Here we're doing what we did above just in a different way.
    const courses = await page.$$eval('#courses .card', (elements) => elements.map(e => ({
            title: e.querySelector('.card-body h3').innerText,
            level: e.querySelector('.card-body .level').innerText,
            url: e.querySelector('.card-footer a').href,
            promo: e.querySelector('.card-footer .promo-code .promo').innerText
        })));

    console.log(courses);

    //Save data to JSON file
    // fs.writeFile('courses.json', JSON.stringify(courses), (err) => {
    //     if(err) throw err;
    //     console.log('File saved');
    // });

    //closing the browser
    await browser.close();
}

run();