"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockDatabase = void 0;
const promises_1 = require("fs/promises");
const dates_1 = require("../../dates");
const perf_hooks_1 = require("perf_hooks");
class StockDatabase {
    constructor() {
        this.ready = false;
        this.stocks = new Map();
    }
    static getInstance() {
        if (!StockDatabase.instance) {
            StockDatabase.instance = new StockDatabase();
        }
        return StockDatabase.instance;
    }
    loadStocks() {
        return __awaiter(this, void 0, void 0, function* () {
            const baseDir = "./cleanedStockData";
            const stockFiles = yield (0, promises_1.readdir)(baseDir);
            const stockJSONPaths = stockFiles.map((x) => `${baseDir}/${x}`);
            for (const stockJSONPath of stockJSONPaths) {
                if (stockJSONPath.endsWith(".json"))
                    yield this.addStock(stockJSONPath);
            }
            // await Promise.all(
            //   stockJSONPaths.map((x) => {
            //     if (x.endsWith(".json")) return this.addStock(x);
            //   })
            // );
            this.ready = true;
        });
    }
    addStock(stockJSONPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const stockDataFile = yield (0, promises_1.readFile)(stockJSONPath, "utf-8");
            console.log(`Loading stock ${stockJSONPath}`);
            const stockData = JSON.parse(stockDataFile);
            const stockName = stockJSONPath.split("/").pop().split(".")[0];
            const stock = new Stock(stockName);
            stockData.forEach((timeSerie) => {
                stock.addTimeSerie(timeSerie);
            });
            this.stocks.set(stockName, stock);
        });
    }
    getStocks() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ready)
                yield this.waitForReady();
            return this.stocks;
        });
    }
    getStock(stockName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ready)
                yield this.waitForReady();
            return this.stocks.get(stockName);
        });
    }
    getCurrentStockMarketPrice(stockName, day) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ready)
                yield this.waitForReady();
            const stock = yield this.getStock(stockName);
            if (!stock)
                return null;
            const timeSerie = stock.getTimeSerie(day);
            if (!timeSerie)
                return null;
            return timeSerie.close;
        });
    }
    waitForReady() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (this.ready)
                    resolve(true);
                else {
                    const interval = setInterval(() => {
                        if (this.ready) {
                            clearInterval(interval);
                            resolve(true);
                        }
                    }, 100);
                }
            });
        });
    }
    getCurrentMarketPrices(day) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ready)
                yield this.waitForReady();
            const stockPrices = new Map();
            let perf = perf_hooks_1.performance.now();
            const dayInd = dates_1.stockGameDates.findIndex((date) => date === day);
            for (const [stockName, stock] of this.stocks) {
                const price = (_a = stock.timeSeries[dayInd]) === null || _a === void 0 ? void 0 : _a.close;
                if (price)
                    stockPrices.set(stockName, price);
                console.log(`Took ${perf_hooks_1.performance.now() - perf}ms to get stock prices for ${stockName}`);
                perf = perf_hooks_1.performance.now();
            }
            return stockPrices;
        });
    }
    getStockMarketPricesUpTo(day) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ready)
                yield this.waitForReady();
            const endDateIndex = dates_1.stockGameDates.findIndex((date) => date === day);
            const stockMarket = new Map();
            for (let i = 0; i <= endDateIndex; i++) {
                const date = dates_1.stockGameDates[i];
                const stockPrices = new Map();
                let perf = perf_hooks_1.performance.now();
                for (const [stockName, stock] of this.stocks) {
                    const price = (_a = stock.timeSeries[i]) === null || _a === void 0 ? void 0 : _a.close;
                    if (price)
                        stockPrices.set(stockName, price);
                }
                console.log(`Took ${perf_hooks_1.performance.now() - perf}ms to get stock prices for ${date}`);
                perf = perf_hooks_1.performance.now();
                stockMarket.set(date, stockPrices);
                //   const stockPrices = await this.getCurrentMarketPrices(date);
                //   stockMarket.set(date, stockPrices);
            }
            return stockMarket;
        });
    }
}
exports.StockDatabase = StockDatabase;
class Stock {
    constructor(name) {
        this.name = name;
        this.timeSeries = [];
    }
    getName() {
        return this.name;
    }
    getTimeSeries() {
        return this.timeSeries;
    }
    addTimeSerie(timeSerie) {
        // add this time serie to the time series array in ascending order of date
        const index = this.timeSeries.findIndex((ts) => new Date(ts.date).getTime() > new Date(timeSerie.date).getTime());
        if (index === -1) {
            this.timeSeries.push(timeSerie);
        }
        else {
            this.timeSeries.splice(index, 0, timeSerie);
        }
    }
    getTimeSerie(date) {
        // find the time serie closest to the date given and return it
        const index = this.timeSeries.findIndex((ts) => new Date(ts.date).getTime() > new Date(date).getTime());
        if (index === -1) {
            return this.timeSeries[this.timeSeries.length - 1];
        }
        else {
            return this.timeSeries[index - 1];
        }
    }
}
