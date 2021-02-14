const puppeteer = require('puppeteer');
let scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://lista.mercadolivre.com.br/defeito_OrderId_PRICE*DESC_PublishedToday_YES');
    // await page.goto('http://books.toscrape.com/')

    const result = await page.evaluate(() => {
        const ads = []        
        
        // document.querySelectorAll("div.ui-search-pagination ul li a").forEach(function(pageLink) {
        //     page.click(pageLink)
        //     page.waitForNavigation()

            document.querySelectorAll('section > ol > li.ui-search-layout__item').forEach(function (ad) {
                ads.push({
                    'titulo': ad.getElementsByTagName('h2')[0].innerText,
                    'preço': ad.querySelector('.price-tag.ui-search-price__part').innerText.replace('\n', ' '),
                    'link': ad.querySelector('.ui-search-item__group__element.ui-search-link').getAttribute('href')
                })
            })
        // })  
       
        return ads
    })
    browser.close()
    return result
}

scrape().then((value) => {
    console.log(value)
})
