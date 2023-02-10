const puppeteer = require("puppeteer");

let scrapper = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.evaluate(() => {
      let items = document.querySelectorAll("item");
      return Array.from(items).map((item) => {
        let img = item.innerHTML.match(/<img[^>]+src="?([^"\s]+)"?[^>]*>/g);
        let src = img[0].match(/src="([^"]+)"/);
        // clear title
        let title = item.querySelector("title").innerHTML;
        title = title.replace(`<![CDATA[`, "").replace(`]]>`, "");
        return {
          title: title,
          link: item.querySelector("link").innerHTML,
          img: src[1],
        };
      });
    });

    await browser.close();
    return html;
  } catch (err) {
    console.log(err);
    return [];
  }
};

module.exports = scrapper;
