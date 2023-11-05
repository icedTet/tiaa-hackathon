import { readFile, readdir } from "fs/promises";
import { StockTimeSerie } from "../../types";
import { stockGameDates } from "../../dates";
import { readFileSync } from "fs";
import { performance } from "perf_hooks";

export class StockDatabase {
  private static instance: StockDatabase;
  private stocks: Map<string, Stock>;
  ready: boolean = false;
  private constructor() {
    this.stocks = new Map();
  }

  public static getInstance(): StockDatabase {
    if (!StockDatabase.instance) {
      StockDatabase.instance = new StockDatabase();
    }

    return StockDatabase.instance;
  }

  async loadStocks() {
    const baseDir = "./cleanedStockData";
    const stockFiles = await readdir(baseDir);
    const stockJSONPaths = stockFiles.map((x) => `${baseDir}/${x}`);
    for (const stockJSONPath of stockJSONPaths) {
      if (stockJSONPath.endsWith(".json")) await this.addStock(stockJSONPath);
    }

    // await Promise.all(
    //   stockJSONPaths.map((x) => {
    //     if (x.endsWith(".json")) return this.addStock(x);
    //   })
    // );
    this.ready = true;
  }
  async addStock(stockJSONPath: string) {
    const stockDataFile = await readFile(stockJSONPath, "utf-8");
    console.log(`Loading stock ${stockJSONPath}`);
    const stockData = JSON.parse(stockDataFile);
    const stockName = stockJSONPath.split("/").pop()!.split(".")[0];
    const stock = new Stock(stockName);
    stockData.forEach((timeSerie: StockTimeSerie) => {
      stock.addTimeSerie(timeSerie);
    });
    this.stocks.set(stockName, stock);
  }

  async getStocks() {
    if (!this.ready) await this.waitForReady();
    return this.stocks;
  }
  async getStock(stockName: string) {
    if (!this.ready) await this.waitForReady();
    return this.stocks.get(stockName);
  }
  async getCurrentStockMarketPrice(stockName: string, day: string) {
    if (!this.ready) await this.waitForReady();
    const stock = await this.getStock(stockName);
    if (!stock) return null;
    const timeSerie = stock.getTimeSerie(day);
    if (!timeSerie) return null;
    return timeSerie.close;
  }
  async waitForReady() {
    return new Promise((resolve) => {
      if (this.ready) resolve(true);
      else {
        const interval = setInterval(() => {
          if (this.ready) {
            clearInterval(interval);
            resolve(true);
          }
        }, 100);
      }
    });
  }
  async getCurrentMarketPrices(day: string) {
    if (!this.ready) await this.waitForReady();
    const stockPrices = new Map<string, number>();
    let perf = performance.now();
    const dayInd = stockGameDates.findIndex((date) => date === day);
    for (const [stockName, stock] of this.stocks) {
      const price = stock.timeSeries[dayInd]?.close;
      if (price) stockPrices.set(stockName, price);
      console.log(
        `Took ${
          performance.now() - perf
        }ms to get stock prices for ${stockName}`
      );
      perf = performance.now();
    }
    return stockPrices;
  }
  async getStockMarketPricesUpTo(day: string) {
    if (!this.ready) await this.waitForReady();
    const endDateIndex = stockGameDates.findIndex((date) => date === day);
    const stockMarket = new Map<string, Map<string, number>>();

    for (let i = 0; i <= endDateIndex; i++) {
      const date = stockGameDates[i];
      const stockPrices = new Map<string, number>();
      let perf = performance.now();
      for (const [stockName, stock] of this.stocks) {
        const price = stock.timeSeries[i]?.close;
        if (price) stockPrices.set(stockName, price);
      }
      console.log(
        `Took ${performance.now() - perf}ms to get stock prices for ${date}`
      );
      perf = performance.now();
      stockMarket.set(date, stockPrices);
      //   const stockPrices = await this.getCurrentMarketPrices(date);
      //   stockMarket.set(date, stockPrices);
    }
    return stockMarket;
  }
}

class Stock {
  name: string;
  timeSeries: StockTimeSerie[];

  constructor(name: string) {
    this.name = name;
    this.timeSeries = [];
  }

  getName(): string {
    return this.name;
  }

  getTimeSeries(): StockTimeSerie[] {
    return this.timeSeries;
  }
  addTimeSerie(timeSerie: StockTimeSerie): void {
    // add this time serie to the time series array in ascending order of date
    const index = this.timeSeries.findIndex(
      (ts) => new Date(ts.date).getTime() > new Date(timeSerie.date).getTime()
    );
    if (index === -1) {
      this.timeSeries.push(timeSerie);
    } else {
      this.timeSeries.splice(index, 0, timeSerie);
    }
  }
  getTimeSerie(date: string): StockTimeSerie | undefined {
    // find the time serie closest to the date given and return it
    const index = this.timeSeries.findIndex(
      (ts) => new Date(ts.date).getTime() > new Date(date).getTime()
    );
    if (index === -1) {
      return this.timeSeries[this.timeSeries.length - 1];
    } else {
      return this.timeSeries[index - 1];
    }
  }
}
