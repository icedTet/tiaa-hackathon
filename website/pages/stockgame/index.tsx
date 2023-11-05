import dynamic from "next/dynamic";
import { SidebarLayout } from "../../components/SidebarLayout";
import { useAPIProp } from "../../utils/hooks/useAPI";
import {
  StockGameAllMarketData,
  StockGameMarketData,
  StockGameUserData,
  StockGameUserTimeStamp,
} from "../../utils/types";
import { apiDomain } from "../../constants";
import dayjs from "dayjs";
import { useCallback, useMemo, useRef, useState } from "react";
import stockGameDates  from "../../utils/consts/dates";
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Modal } from "../../components/Modal";
import TextBox from "../../components/Inputs/TextBox";
import { stockNameMap } from "../../utils/consts/stockMap";
import { StockSearchResult } from "../../components/StockGame/StockSearchResult";
import { fetcher } from "../../utils/Fetcher";
import { OwnStockRender } from "../../components/StockGame/OwnStockRender";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const calculatePortfolioValue = (
  portfolio: StockGameUserTimeStamp,
  marketData: StockGameMarketData
) => {
  let totalValue = portfolio.money;
  portfolio.stocks.forEach((stock) => {
    totalValue += stock.amount * marketData[stock.stockID];
  });
  return ~~(totalValue * 100) / 100;
};
export const dateToSimulationTime = (date: Date) => {
  date = new Date(date);
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
    2,
    "0"
  )}-${`${date.getUTCDate()}`.padStart(2, "0")}`;
};
export const simulationTimeToDate = (simulationTime: string) => {
  const [year, month, day] = simulationTime.split("-").map(Number);
  return new Date(year, month, day);
};
export const StockGame = () => {
  const [gameData, setGameData] = useAPIProp<StockGameUserData>({
    APIPath: `${apiDomain}/stockGame/user/@me/currentGameData`,
  });
  const [stockData, setStockData] = useAPIProp<StockGameAllMarketData>({
    APIPath: `${apiDomain}/stockGame/market`,
  });
  const [portfolios, setPortfolios] = useAPIProp<StockGameUserTimeStamp[]>({
    APIPath: `${apiDomain}/stockGame/user/@me/portfolios`,
  });
  const currentPortfolio = useMemo(() => {
    return portfolios?.find(
      (portfolio) =>
        dateToSimulationTime(portfolio.simulationTime) ===
        dateToSimulationTime(gameData?.currentDay!)
    );
  }, [gameData?.currentDay, portfolios]);
  const currentMarketData = useMemo(() => {
    return stockData?.[dateToSimulationTime(gameData?.currentDay!)];
  }, [gameData?.currentDay, stockData]);

  const portfolioValueData = useMemo(() => {
    let valid = true;
    const mapped = portfolios?.map((portfolio) => {
      const date = dateToSimulationTime(portfolio.simulationTime);
      const sdata = stockData?.[date];
      if (!sdata) {
        valid = false;
        return;
      }
      return {
        x: dayjs(portfolio.simulationTime).format("MMMM D, YYYY"),
        y: calculatePortfolioValue(portfolio, sdata),
      };
    });
    return valid ? (mapped as { x: string; y: number }[]) : [];
  }, [gameData?.currentDay, portfolios, currentMarketData]);
  const graphParentRef = useRef<HTMLDivElement>(null);
  const graphHeight = useMemo(() => {
    if (!graphParentRef.current) return 0;

    return graphParentRef.current.clientHeight;
  }, [graphParentRef.current]);
  const [searchTerm, setSearchTerm] = useState("");
  const [buyStock, setBuyStock] = useState(false);
  const searchResults = useMemo(() => {
    const stockInfo = Object.keys(currentMarketData ?? {}).map((stockID) => {
      const name = stockNameMap[stockID as keyof typeof stockNameMap];
      if (!name) console.log(`Stock ${stockID} not found`);
      return {
        stockID,
        name,
        price: currentMarketData?.[stockID as keyof typeof stockNameMap],
      };
    });
    return stockInfo.filter((stock) => {
      return (
        !searchTerm ||
        stock.stockID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, currentMarketData]);
  const stockList = useMemo(() => {
    // deduplicate stocks
    const stockMap = new Map<string, number>();
    currentPortfolio?.stocks.forEach((stock) => {
      stockMap.set(
        stock.stockID,
        (stockMap.get(stock.stockID) ?? 0) + stock.amount
      );
    });
    return Array.from(stockMap.entries()).map(([stockID, amount]) => {
      return {
        stockID,
        amount,
      };
    });
  }, [currentPortfolio]);
  const portfolioValue = useMemo(() => {
    if (!currentPortfolio || !currentMarketData) return 0;
    return calculatePortfolioValue(currentPortfolio, currentMarketData);
  }, [currentPortfolio, currentMarketData]);

  const [advancing, setAdvancing] = useState(false);
  const [advanceError, setAdvanceError] = useState("");

  return (
    <SidebarLayout title={"SimuStocks"}>
      <div
        className={`flex flex-col gap-4 p-8 items-start justify-start w-full h-full`}
      >
        <div className={`flex flex-col gap-4 items-start`}>
          <span className={`text-2xl font-bold font-montserrat`}>
            SimuStocks Portfolio
          </span>
          {/* <span className={`text-gray-400`}>
            Buy and sell stocks in a simulated environment.
          </span> */}
        </div>
        <div className={`grid grid-cols-12 gap-8 items-start w-full`}>
          <div className={`flex flex-col gap-4 w-full col-span-9`}>
            <span
              className={`text-base font-bold font-montserrat text-gray-100/40`}
            >
              Summary
            </span>
            <div
              className={`w-full aspect-video rounded-3xl bg-gray-900 flex flex-col p-8 gap-6`}
            >
              <div
                className={`grow invert text-gray-900 hue-rotate-180`}
                ref={graphParentRef}
              >
                {!!graphHeight && (
                  <ReactApexChart
                    type="area"
                    series={[
                      {
                        name: "Portfolio Value",
                        data: portfolioValueData?.map((data) => data.y) ?? [],
                      },
                    ]}
                    options={{
                      chart: {
                        id: "apexchart-example",
                      },
                      xaxis: {
                        categories: portfolioValueData?.map((data) => data.x),
                      },
                    }}
                    height={graphHeight}
                  />
                )}
              </div>
              {/* {JSON.stringify(portfolioValueData)} */}
            </div>
          </div>
          <div className={`flex flex-col gap-4 w-full col-span-3`}>
            <div className={`flex flex-col gap-4 w-full`}>
              <button
                className={`flex flex-row gap-2 items-center px-6 py-3 rounded-2.5xl bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 disabled:opacity-50`}
                disabled={advancing}
                onClick={async () => {
                  setAdvancing(true);
                  const end = await fetcher(
                    `${apiDomain}/stockGame/user/@me/portfolio/advance`,
                    {
                      method: "POST",
                    }
                  );
                  const json = await end.json();
                  if (!end.ok) {
                    setAdvanceError(json.message);
                    setAdvancing(false);  
                    return { success: false, message: json.message };
                  }
                  await setPortfolios();
                  await setGameData();
                  await setStockData();
                  setAdvancing(false);
                  // alert(`Day advanced!`);
                  return { success: true };
                }}
              >
                <MoonIcon className={`h-6 w-6 text-gray-100`} />
                <span
                  className={`text-sm font-bold text-gray-100 whitespace-nowrap`}
                >
                  End Current Day
                </span>
              </button>
            </div>
            {advanceError && (
              <div
                className={`p-4 pr-8 flex flex-row gap-4 bg-red-900 rounded-4xl border border-gray-100/5 items-center`}
              >
                <div
                  className={`w-10 h-10 bg-gray-850/10 flex flex-col items-center justify-center text-xl rounded-3xl`}
                >
                  <ExclamationTriangleIcon
                    className={`h-6 w-6 text-gray-100`}
                  />
                </div>
                <div className={`flex flex-col gap-2 justify-center`}>
                  <span className={`text-gray-400 text-sm font-bold`}>
                    Error
                  </span>
                  <span
                    className={`text-xs font-normal font-wsans
                transition-all duration-300
                    ${
                      typeof currentPortfolio?.money === "undefined" &&
                      `blur-md`
                    }
                `}
                  >
                    {advanceError}
                  </span>
                </div>
              </div>
            )}
            <div
              className={`p-4 pr-8 flex flex-row gap-4 bg-gray-900 rounded-4xl border border-gray-100/5 items-center`}
            >
              <div
                className={`w-10 h-10 bg-gray-850 flex flex-col items-center justify-center text-xl rounded-3xl`}
              >
                💵
              </div>
              <div className={`flex flex-col gap-2 justify-center`}>
                <span className={`text-gray-400 text-sm font-bold`}>
                  Current Cash Balance
                </span>
                <span
                  className={`text-lg font-bold font-montserrat
                transition-all duration-300
                    ${
                      typeof currentPortfolio?.money === "undefined" &&
                      `blur-md`
                    }
                `}
                >
                  ${currentPortfolio?.money.toFixed(3) ?? `Loading...`}
                </span>
              </div>
            </div>
            <div
              className={`p-4 pr-8 flex flex-row gap-4 bg-gray-900 rounded-4xl border border-gray-100/5 items-center`}
            >
              <div
                className={`w-10 h-10 bg-gray-850 flex flex-col items-center justify-center text-xl rounded-3xl`}
              >
                💰
              </div>
              <div className={`flex flex-col gap-2 justify-center`}>
                <span className={`text-gray-400 text-sm font-bold`}>
                  Current Portfolio Value
                </span>
                <span
                  className={`text-lg font-bold font-montserrat
                transition-all duration-300
                    ${
                      typeof currentPortfolio?.money === "undefined" &&
                      `blur-md`
                    }
                `}
                >
                  ${portfolioValue.toFixed(3) ?? `Loading...`}
                </span>
              </div>
            </div>
            <div
              className={`p-4 pr-8 flex flex-row gap-4 bg-gray-900 rounded-4xl border border-gray-100/5 items-center`}
            >
              <div
                className={`w-10 h-10 bg-gray-850 flex flex-col items-center justify-center text-xl rounded-3xl`}
              >
                🗓️
              </div>
              <div className={`flex flex-col gap-2 justify-center`}>
                <span className={`text-gray-400 text-sm font-bold`}>
                  Current Date
                </span>
                <span
                  className={`text-xl font-bold font-montserrat ${
                    !gameData?.currentDay && `blur-md`
                  } transition-all duration-300`}
                >
                  {gameData?.currentDay
                    ? dayjs(new Date(gameData?.currentDay!)).format(
                        "MMMM D, YYYY"
                      )
                    : `Loading...`}
                </span>
              </div>
            </div>
          </div>
          <div className={`flex flex-col gap-4 w-full col-span-9 grow pb-8`}>
            <span
              className={`text-base font-bold font-montserrat text-gray-100/40`}
            >
              Stocks Owned ({currentPortfolio?.stocks.length})
            </span>
            <div className={`grid grid-cols-2 gap-6 w-full flex-wrap grow`}>
              {stockList.map((stock) => (
                <OwnStockRender
                  stockID={stock.stockID}
                  key={JSON.stringify(stock)}
                  amount={stock.amount}
                  stockData={
                    currentMarketData?.[
                      stock.stockID as keyof typeof stockNameMap
                    ]
                  }
                  marketData={stockData!}
                  currentDay={gameData?.currentDay!}
                  portfolio={currentPortfolio!}
                  portfolioValue={portfolioValue}
                  onSell={async (amount) => {
                    console.log(`Selling ${amount} shares of ${stock.stockID}`);
                    const buy = await fetcher(
                      `${apiDomain}/stockGame/user/@me/portfolio/sell`,
                      {
                        method: "POST",
                        body: JSON.stringify({
                          stockID: stock.stockID,
                          amount,
                        }),
                      }
                    );
                    const json = await buy.json();
                    if (!buy.ok) {
                      return { success: false, message: json.error };
                    }
                    await setPortfolios();
                    return { success: true };
                  }}
                />
              ))}

              <div
                className={`flex flex-row gap-4 w-full bg-gray-900 h-a items-center p-6 rounded-2.5xl hover:brightness-125 transition-all cursor-pointer`}
                onClick={() => setBuyStock(true)}
              >
                <div
                  className={`flex flex-col gap-2 items-center justify-center w-16 h-16 bg-gray-850 text-3xl rounded-2xl shrink-0`}
                >
                  <PlusIcon className={`h-6 w-6 text-gray-100`} />
                </div>
                <div className={`flex flex-col gap-2`}>
                  <span className={`text-xl font-bold font-montserrat`}>
                    Buy More Stocks
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        visible={buyStock}
        onClose={() => {
          setBuyStock(false);
        }}
        className={`w-full max-w-prose`}
      >
        <div className={`flex flex-col gap-4 p-8 grow`}>
          <div className={`flex flex-col gap-4`}>
            <span className={`text-2xl font-bold font-montserrat`}>
              Buy Stocks
            </span>
            <span className={`text-gray-400`}>
              Purchase a stock to add it to your portfolio.
            </span>
          </div>
          <div className={`flex flex-col gap-4`}>
            {/* <span className={`text-xl font-bold font-montserrat`}>
            </span> */}
            <TextBox
              placeholder={`Search for a stock by its name or ticker symbol`}
              className={`w-full rounded-2xl`}
              icon={MagnifyingGlassIcon}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div
              className={`flex flex-col gap-4 max-h-112 overflow-auto scrollbar-none relative`}
            >
              {searchResults.map((stock) => (
                <StockSearchResult
                  stock={stock}
                  key={JSON.stringify(stock)}
                  balance={currentPortfolio?.money ?? 0}
                  onPurchase={async (amount) => {
                    console.log(
                      `Purchasing ${amount} shares of ${stock.stockID}`
                    );
                    const buy = await fetcher(
                      `${apiDomain}/stockGame/user/@me/portfolio/buy`,
                      {
                        method: "POST",
                        body: JSON.stringify({
                          stockID: stock.stockID,
                          amount,
                        }),
                      }
                    );
                    const json = await buy.json();
                    if (!buy.ok) {
                      return { success: false, message: json.error };
                    }
                    await setPortfolios();
                    return { success: true };
                  }}
                />
              ))}
              <div
                className={`fixed bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-gray-800 via-gray-800/80 to-gray-800/0 pointer-events-none rounded-2xl`}
              />
            </div>
          </div>
        </div>
      </Modal>
    </SidebarLayout>
  );
};
export default StockGame;
