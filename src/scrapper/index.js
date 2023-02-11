const axios = require("axios");
const cheerio = require("cheerio");

let scrapper = async (url) => {
  try {
    return axios.get(url).then((response) => {
      let html = response.data;
      const $ = cheerio.load(html);
      let items = $("item");

      html = Array.from(items).map((item) => {
        let img = $(item).html().match(/<img[^>]+src="?([^"\s]+)"?[^>]*>/g)[0].match(/src="([^"]+)"/)[1];
        let title = $(item).find("title").html().replace(`&lt;![CDATA[`, "").replace(`]]&gt;`, "");
        let link = $(item).text().replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").match(/http\S+/g)[0];
        return {
          title,
          link,
          img
        };
      });
      console.log(html);
      return html;
    });

  } catch (err) {
    console.log(err);
    return [];
  }
};

module.exports = scrapper;
