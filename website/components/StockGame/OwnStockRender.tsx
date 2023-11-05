import { useMemo, useState } from "react";
import { dateToSimulationTime } from "../../pages/stockgame";
import { stockNameMap } from "../../utils/consts/stockMap";
import { Modal } from "../Modal";
import {
  StockGameAllMarketData,
  StockGameUserTimeStamp,
} from "../../utils/types";
import dayjs from "dayjs";
import TextBox from "../Inputs/TextBox";

export const OwnStockRender = (props: {
  stockID: string;
  amount: number;
  stockData: number | undefined;
  marketData: StockGameAllMarketData;
  currentDay: Date;
  portfolio: StockGameUserTimeStamp;
  portfolioValue: number;
  onSell?: (amount: number) => Promise<{
    success: boolean;
    message?: string | undefined;
  }>;
}) => {
  const {
    stockID,
    amount,
    stockData,
    marketData,
    currentDay,
    portfolio,
    portfolioValue,
    onSell,
  } = props;
  const [dataOpen, setDataOpen] = useState(false);
  const [sellAmount, setSellAmount] = useState(0);
  const stockHistory = useMemo(() => {
    const stockHist = portfolio.stocks.filter(
      (stock) => stock.stockID === stockID
    );
    // merge same day stocks
    // boughtAt
    const mergedStockHist = new Map<number, number>();
    const boughtAtPrice = new Map<number, number>();
    stockHist.forEach((stock) => {
      if (mergedStockHist.has(stock.boughtAt)) {
        mergedStockHist.set(
          stock.boughtAt,
          mergedStockHist.get(stock.boughtAt)! + stock.amount
        );
        boughtAtPrice.set(stock.boughtAt, stock.buyPrice);
      } else {
        mergedStockHist.set(stock.boughtAt, stock.amount);
        boughtAtPrice.set(stock.boughtAt, stock.buyPrice);
      }
    });
    const mergedStockHistArr = Array.from(mergedStockHist.entries());
    const sortedStockHistArr = mergedStockHistArr.sort((a, b) => {
      return a[0] - b[0];
    });
    const stockHistArr = sortedStockHistArr.map((stock) => {
      return {
        amount: stock[1],
        boughtAt: stock[0],
        buyPrice: boughtAtPrice.get(stock[0])!,
      };
    });
    return stockHistArr;
  }, [portfolio]);
  const [selling, setSelling] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [sellSuccess, setSellSuccess] = useState(false);
  return (
    <>
      <Modal
        visible={dataOpen}
        onClose={() => {
          setDataOpen(false);
        }}
        className={`p-10 max-w-prose w-full flex flex-col gap-8`}
      >
        <div className={`flex flex-col gap-8 w-fit`}>
          <div className={`flex flex-col gap-2 `}>
            <span className={`text-2xl font-bold font-montserrat`}>
              {stockNameMap[stockID as keyof typeof stockNameMap]}{" "}
              <span className={`text-gray-400`}>(${stockID})</span>
            </span>
            <span className={`text-gray-400`}>
              Stock data for {dayjs(currentDay).format("MMMM D, YYYY")}
            </span>
          </div>
          <div className={`flex flex-col gap-3 font-wsans`}>
            <span className={`font-normal text-sm text-gray-100/50`}>
              Current price:{" "}
            </span>
            <span className={`font-extrabold text-3xl text-gray-100 w-72`}>
              ${stockData?.toFixed(2)}
            </span>
          </div>
          <div className={`flex flex-col gap-4 `}>
            <span className={`text-sm text-gray-100/50 font-wsans`}>
              Stocks Owned
            </span>
            {stockHistory.map((stock) => (
              <div className={`text-gray-100`} key={JSON.stringify(stock)}>
                <span className={`font-bold text-lg`}>
                  x{stock.amount} shares
                </span>{" "}
                on {dayjs(stock.boughtAt).format("MMMM D, YYYY")} at
                <span className={`text-green-500 font-bold`}>
                  {" "}
                  ${stock.buyPrice.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className={`flex flex-row gap-4 `}>
            <button
              className={`flex flex-row gap-2 items-center px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 ease-in-out w-fit`}
              onClick={() => {
                setDataOpen(false);
                setSelling(true);
                setSellAmount(0);
              }}
            >
              <span
                className={`text-sm font-bold text-gray-100 whitespace-nowrap`}
              >
                Sell Stocks
              </span>
            </button>
            <button
              className={`flex flex-row gap-2 items-center px-6 py-3 rounded-2xl hover:bg-gray-100/10 transition-all duration-200 ease-in-out w-fit`}
              onClick={() => {
                setDataOpen(false);
                setSellAmount(0);
              }}
            >
              <span
                className={`text-sm font-bold text-gray-100 whitespace-nowrap`}
              >
                Close
              </span>
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        visible={selling}
        onClose={() => {
          setSelling(false);
          setSellAmount(0);
        }}
        className={`p-10 max-w-prose w-min flex flex-col gap-8`}
      >
        <div className={`flex flex-col gap-2 w-fit`}>
          <span className={`text-2xl font-bold font-montserrat`}>
            Selling {stockNameMap[stockID as keyof typeof stockNameMap]}{" "}
            <span className={`text-gray-400`}>(${stockID})</span>
          </span>
          <span className={`text-gray-400`}>
            Sell a stock to the market, and receive the current market price.
            Increases your account balance.
          </span>
        </div>
        <div className={`flex flex-col gap-3 font-wsans`}>
          <span className={`font-normal text-sm text-gray-100/50`}>
            You are selling{" "}
          </span>

          <span className={`font-extrabold text-3xl text-gray-100 w-72`}>
            {amount} shares{" "}
          </span>
          <span className={`font-normal text-sm text-gray-100/50`}>
            x{" "}
            <span className={`font-bold text-gray-100`}>
              ${stockData?.toFixed(2)}/share
            </span>
          </span>
          <span className={`font-normal text-lg text-gray-100/50`}>
            Total value:{" "}
            <span
              className={`font-bold ${
                sellAmount > amount ? "text-red-500" : "text-green-500"
              }`}
            >
              ${(sellAmount * stockData!).toFixed(2)}
            </span>
          </span>
          <span className={`text-gray-400 text-sm`}>
            You have ${portfolio.money.toFixed(2)} in your account.
          </span>
        </div>
        <div
          className={`flex flex-col items-start gap-4 ${
            false ? "animate-pulse pointer-events-none" : ""
          }`}
        >
          <TextBox
            label={`Shares`}
            className={`w-64 rounded-2xl`}
            value={sellAmount ? `${sellAmount}` : ""}
            onChange={(e) =>
              setSellAmount(
                e.target.value ? Math.min(~~e.target.value, amount) : 0
              )
            }
          />
          <button
            className={`flex flex-row gap-2 bg-indigo-500 hover:bg-indigo-400 px-5 py-2.5 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={async () => {
              if (onSell) {
                setProcessing(true);
                const result = await onSell(sellAmount);
                setProcessing(false);
                if (result.success) {
                  setSelling(false);
                  setSellAmount(0);
                }
              }
              setSellSuccess(true);
              setSelling(false);
            }}
            disabled={!sellAmount || sellAmount > amount! || processing}
          >
            Place Order
          </button>
        </div>
      </Modal>
      <Modal
        visible={sellSuccess}
        onClose={() => {
          setSellSuccess(false);
          setSellAmount(0);
        }}
        className={`w-full max-w-prose`}
      >
        <div className={`flex flex-col gap-4 p-8 grow`}>
          <div className={`flex flex-col gap-4`}>
            <div
              className={`flex flex-row gap-4 items-center w-16 h-16 text-3xl bg-gray-850 justify-center rounded-2xl`}
            >
              🎉
            </div>

            <span className={`text-2xl font-bold font-montserrat`}>
              Order Successfully Executed
            </span>
            <span className={`text-gray-400`}>
              You have successfully sold {amount} shares of{" "}
              {stockNameMap[stockID as keyof typeof stockNameMap]} ($
              {stockID}).
            </span>
            <button
              className={`flex flex-row gap-2 items-center px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 ease-in-out w-fit`}
              onClick={() => {
                setSellSuccess(false);
                setSellAmount(0);
              }}
            >
              <span
                className={`text-sm font-bold text-gray-100 whitespace-nowrap`}
              >
                Close
              </span>
            </button>
          </div>
        </div>
      </Modal>
      <div
        className={`flex flex-row gap-4 w-full bg-gray-900 items-center p-6 rounded-2.5xl hover:brightness-125 transition-all cursor-pointer`}
        onClick={() => {
          setDataOpen(true);
        }}
      >
        <div
          className={`flex flex-col gap-2 items-center justify-center w-16 h-16 bg-gray-850 text-xl font-bold rounded-2xl shrink-0`}
        >
          {stockID}
        </div>
        <div className={`flex flex-col gap-2`}>
          <span className={`text-lg font-bold font-montserrat`}>
            {stockNameMap[stockID as keyof typeof stockNameMap]}
          </span>
          <span className={`text-gray-400`}>{amount} shares</span>
          <span className={`text-gray-400`}> ${stockData?.toFixed(2)}</span>
        </div>
      </div>
    </>
  );
};
