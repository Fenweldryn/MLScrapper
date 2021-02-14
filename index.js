const puppeteer = require('puppeteer');
var fs = require('fs');

let scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://lista.mercadolivre.com.br/defeito_OrderId_PRICE*DESC_PublishedToday_YES');

    const pageLinks = await page.evaluate(() => {
        let links = []
        document.querySelectorAll("div.ui-search-pagination ul li a").forEach(function(pageLink) {
            links.push(pageLink.getAttribute("href"))
        })
        return links
    })

    const result = []

    for (let index = 0; index < pageLinks.length; index++) {
        await page.goto(pageLinks[2]);
    
        result.push(await page.evaluate(() => {
            let ads = []
            document.querySelectorAll('section > ol > li.ui-search-layout__item').forEach(function (ad) {
                ads.push({
                    'id': ad.querySelector('.ui-search-item__group__element.ui-search-link').getAttribute('href').match(/MLB-[0-9]+/g)[0],
                    'titulo': ad.getElementsByTagName('h2')[0].innerText,
                    'preço': ad.querySelector('.price-tag.ui-search-price__part').innerText.replace('\n', ' ').replace('\n,\n',','),
                })
            })
            return ads
        }))
    }

    browser.close()
    return result
}

scrape().then((result) => {
    result = result[0]    
    file = JSON.parse(fs.readFileSync('result.json'))
    let difference = result
        .filter(x => !file.includes(x))
        .concat(file.filter(x => !result.includes(x)));

    fs.writeFile('result.json', JSON.stringify(difference), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
})


// let file1 = JSON.parse(fs.readFileSync('result.json','utf8'))
// let file2 = JSON.parse(fs.readFileSync('result2.json', 'utf8'))

// let difference = file1
//     .filter(x => !file2.includes(x))
//     .concat(file2.filter(x => !file1.includes(x)));

// fs.writeFile('diff.json', JSON.stringify(difference), function (err) {
//     if (err) throw err;
//     console.log('Saved!');
// });