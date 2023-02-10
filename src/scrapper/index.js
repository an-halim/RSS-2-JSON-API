const chromium = require("chrome-aws-lambda");

let scrapper = async (url) => {
  try {
    const executablePath = await chromium.executablePath;

    // PUPPETEER_EXECUTABLE_PATH is set from my Dockerfile to /usr/bin/chromium-browser
    // for development.
    const browser = await chromium.puppeteer.launch({
      args: await chromium.args,
      executablePath: executablePath || process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
    });

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
