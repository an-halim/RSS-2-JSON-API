const scrapper = require("./scrapper");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/scrapper", async (req, res) => {
  const url = req.query.url;
  let start = new Date().getTime();
  const data = await scrapper(url);
  console.log(`Time: ${new Date().getTime() - start}ms`);
  if (!url.includes("medium.com")) {
    res.json({
      status: "failed",
      message: "Invalid url",
      loaded_in: `${new Date().getTime() - start}ms`,
    });
  } else if (data.length > 0) {
    res.json({
      status: "success",
      data: data,
      loaded_in: `${new Date().getTime() - start}ms`,
    });
  } else {
    res.json({
      status: "failed",
      message: "No data found",
      loaded_in: `${new Date().getTime() - start}ms`,
    });
  }
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
