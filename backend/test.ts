import CsvReadableStream from "csv-reader";
import fs, { readdir, readdirSync, writeFileSync } from "fs";
import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();
const data = fs.readFileSync("stockData/MMM.csv", "utf-8");
// console.log(data.substring(0, 100));
let inputStream = fs.createReadStream("stockData/MMM.csv", "utf8");
/*
{
  Date: "2023-11-03";
  Open: 93.519997;
  High: 94.82;
  Low: 93.07;
  Close: 93.860001;
  "Adj Close": 93.860001;
  Volume: 2730800;
};
*/
type rawStock = {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  "Adj Close": number;
  Volume: number;
};
type CleanedStock = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
};

let header = [] as string[];

let ready = false;
async function readStockData(ticker: string) {
  return new Promise((resolve, reject) => {
    const stockData = [] as rawStock[];
    inputStream = fs.createReadStream(`stockData/${ticker}.csv`, "utf8");
    inputStream
      .pipe(
        new CsvReadableStream({
          parseNumbers: true,
          parseBooleans: true,
          trim: true,
        })
      )
      .on("header", (h) => {
        header = h;
      })
      .on("data", function (row) {
        if (!ready) {
          ready = true;
          return;
        }
        const formattedRow = {} as any;
        for (let i = 0; i < header.length; i++) {
          //@ts-ignore
          formattedRow[header[i]] = row[i];
        }
        stockData.push(formattedRow);
      })
      .on("end", function () {
        resolve(stockData);
      });
  }) as Promise<rawStock[]>;
}
const dates = new Map<string, number>();
function cleanStockData(raw: rawStock[]) {
  // only keep a ticker every two weeks starting on 1984-1/1
  // 1962-04-19

  const cleaned = [] as any[];
  let lastDate = [0, 0, 0];
  let earliestYear = 99999;
  for (let i = 0; i < raw.length; i++) {
    const row = raw[i];
    const date = row.Date.split("-").map((x) => parseInt(x));
    if (date[0] < earliestYear) earliestYear = date[0];
    if (date[0] < 1984) {
      continue;
    }
    if (
      !lastDate[0] ||
      new Date(date.join("-")).getTime() -
        new Date(lastDate.join("-")).getTime() >=
        1000 * 60 * 60 * 24 * 14
    ) {
      lastDate = date;
    } else {
      continue;
    }
    dates.set(row.Date, (dates.get(row.Date) || 0) + 1);
    cleaned.push({
      date: row.Date,
      open: row.Open,
      high: row.High,
      low: row.Low,
      close: row.Close,
      adjClose: row["Adj Close"],
      volume: row.Volume,
    });
  }
  return { cleaned, earliestYear };
}

(async () => {
  console.log("Starting");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Done", process.env);
  // read directory of stock data

  const stocks = readdirSync("stockData")
    .filter((x) => x.endsWith(".csv"))
    .map((x) => x.split(".")[0]);
  let warningStocks = [] as string[];
  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i];
    const stockData = await readStockData(stock);
    const { cleaned, earliestYear } = cleanStockData(stockData);
    if (earliestYear >= 1984) {
      warningStocks.push(stock);
      console.warn(`Earliest year is ${earliestYear} for ${stock}, skipping`);
      continue;
    }
    // console.log(days);
    // console.log(stockData);
    fs.writeFileSync(`cleanedStockData/${stock}.json`, JSON.stringify(cleaned));

    console.log(`Done with ${stock}`);
  }
  console.warn(
    `List of stocks with earliest year >= 1984: ${warningStocks.join(", ")}`
  );
  const dateArr = Array.from(dates.keys());
  console.log(dates);
  writeFileSync("dates.json", JSON.stringify(dateArr));
  let max = 500;
  dates.forEach((x, y) => {
    if (x !== 109) {
      console.log(`Abnormal amount of ${y}: ${x} times`);
    }
  });
})();

// (async () => {
//   const stockData = [] as any[];
//   inputStream = fs.createReadStream(`dstock.csv`, "utf8");
//   inputStream
//     .pipe(
//       new CsvReadableStream({
//         parseNumbers: true,
//         parseBooleans: true,
//         trim: true,
//       })
//     )
//     .on("header", (h) => {
//       header = h;
//     })
//     .on("data", function (row) {
//       if (!ready) {
//         ready = true;
//         return;
//       }
//       const formattedRow = {} as any;
//       for (let i = 0; i < header.length; i++) {
//         //@ts-ignore
//         formattedRow[header[i]] = row[i];
//       }
//       stockData.push(formattedRow);
//     })
//     .on("end", function () {
//       console.log(stockData);
//       const finalJSON = {} as any;
//       stockData.forEach((x) => {
//         finalJSON[x["ticker"]] = x["name"];
//       });
//       writeFileSync("stockInfo2.json", JSON.stringify(finalJSON));
//     });
// })();
