//note all the console log statements are commented out to keep the terminal clean

//..................................................................................................
const fs = require("fs");
const http = require("http");
const { json } = require("node:stream/consumers");
const url = require("url");
//we stored the function in another file to increase reusability
const replaceTemplate = require("./modules/replacetemplatefun");
const slugify = require("slugify");

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// // console.log(textIn);
// const textout = `This is the sentence ${textIn} .\n Created on ${Date.now()} `;
// fs.writeFileSync("./txt/output.txt", textout);

// //nonblocking asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   //   console.log(data);
// });
// // console.log(`will read first`);

// //better understanding

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) {
//     //change the above file name to see the effect of the error

//     return console.log(`ERROR!`);
//   }
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     // console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       //   console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         // console.log("your file has been written");
//       });
//     });
//   });
// });

//................................................................................................................................................

//SERVER

//below is a function

//READING THE TEMPLATE HTML FILES ONCE AT THE BEGINNING
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

//since the below two lines of code will be read once so there is no problem making it sync
//this is done so that we read it once instead of reading it again and again
const dataa = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataaObj = JSON.parse(dataa);

const slugs = dataaObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  // console.log(req.url);
  console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW
  const pathName = req.url;
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataaObj
      .map((element) => replaceTemplate(tempCard, element))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    return res.end(output);
  }
  //PRODUCT PAGE
  else if (pathname === "/product") {
    const product = dataaObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.writeHead(200, { "Content-type": "text/html" });
    return res.end(output);
  }
  //API PAGE
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "text/html" });

    return res.end(dataa);
  }
  //NOT FOUND
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      myOwnHeader: "hello world",
    });
    return res.end(" <h1> invalid request </h1>");
  }
  // res.end("Hello from the server"); //this  callback is executed eachtime there is a new req
});

server.listen(8000, () => {
  console.log(`this callback is called as soon as the server started`);
});
