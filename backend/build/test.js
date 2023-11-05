"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_reader_1 = __importDefault(require("csv-reader"));
const fs_1 = __importStar(require("fs"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const data = fs_1.default.readFileSync("stockData/MMM.csv", "utf-8");
// console.log(data.substring(0, 100));
let inputStream = fs_1.default.createReadStream("stockData/MMM.csv", "utf8");
let header = [];
let ready = false;
function readStockData(ticker) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const stockData = [];
            inputStream = fs_1.default.createReadStream(`stockData/${ticker}.csv`, "utf8");
            inputStream
                .pipe(new csv_reader_1.default({
                parseNumbers: true,
                parseBooleans: true,
                trim: true,
            }))
                .on("header", (h) => {
                header = h;
            })
                .on("data", function (row) {
                if (!ready) {
                    ready = true;
                    return;
                }
                const formattedRow = {};
                for (let i = 0; i < header.length; i++) {
                    //@ts-ignore
                    formattedRow[header[i]] = row[i];
                }
                stockData.push(formattedRow);
            })
                .on("end", function () {
                resolve(stockData);
            });
        });
    });
}
const dates = new Map();
function cleanStockData(raw) {
    // only keep a ticker every two weeks starting on 1984-1/1
    // 1962-04-19
    const cleaned = [];
    let lastDate = [0, 0, 0];
    let earliestYear = 99999;
    for (let i = 0; i < raw.length; i++) {
        const row = raw[i];
        const date = row.Date.split("-").map((x) => parseInt(x));
        if (date[0] < earliestYear)
            earliestYear = date[0];
        if (date[0] < 1984) {
            continue;
        }
        if (date[0] * 1000 + date[1] * 100 + date[2] >=
            lastDate[0] * 1000 + lastDate[1] * 100 + lastDate[2] + 14) {
            lastDate = date;
        }
        else
            continue;
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
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Starting");
    yield new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Done", process.env);
    // read directory of stock data
    const stocks = (0, fs_1.readdirSync)("stockData")
        .filter((x) => x.endsWith(".csv"))
        .map((x) => x.split(".")[0]);
    let warningStocks = [];
    for (let i = 0; i < stocks.length; i++) {
        const stock = stocks[i];
        const stockData = yield readStockData(stock);
        const { cleaned, earliestYear } = cleanStockData(stockData);
        if (earliestYear >= 1984) {
            warningStocks.push(stock);
            console.warn(`Earliest year is ${earliestYear} for ${stock}, skipping`);
            continue;
        }
        // console.log(stockData);
        fs_1.default.writeFileSync(`cleanedStockData/${stock}.json`, JSON.stringify(cleaned));
        console.log(`Done with ${stock}`);
    }
    console.warn(`List of stocks with earliest year >= 1984: ${warningStocks.join(", ")}`);
    const dateArr = Array.from(dates.keys());
    (0, fs_1.writeFileSync)("dates.json", JSON.stringify(dateArr));
    let max = 500;
    dates.forEach((x, y) => {
        if (x !== 109) {
            console.log(`Abnormal amount of ${y}: ${x} times`);
        }
    });
}))();
