import { readFile, readdir } from "fs/promises";
import { StockTimeSerie } from "../../types";

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
    await Promise.all(stockJSONPaths.map((x) => this.addStock(x)));
    this.ready = true;
  }
  async addStock(stockJSONPath: string) {
    const stockDataFile = await readFile(stockJSONPath, "utf-8");
    const stockData = JSON.parse(stockDataFile);
    const stockName = stockJSONPath.split("/").pop()!.split(".")[0];
    const stock = new Stock(stockName);
    stockData.forEach((timeSerie: StockTimeSerie) => {
      stock.addTimeSerie(timeSerie);
    });
    this.stocks.set(stockName, stock);
  }

  getStocks() {
    return this.stocks;
  }
  getStock(stockName: string) {
    return this.stocks.get(stockName);
  }
  getCurrentStockMarketPrice(stockName: string, day: string) {
    const stock = this.getStock(stockName);
    if (!stock) return null;
    const timeSerie = stock.getTimeSerie(day);
    if (!timeSerie) return null;
    return timeSerie.close;
  }
}


class Stock {
  private name: string;
  private timeSeries: StockTimeSerie[];

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
