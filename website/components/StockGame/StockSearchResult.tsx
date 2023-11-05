import { PlusIcon } from "@heroicons/react/24/outline";
import { Modal } from "../Modal";
import { useState } from "react";
import TextBox from "../Inputs/TextBox";

export const StockSearchResult = (props: {
  stock: { stockID: string; name: string; price?: number | undefined };
  onPurchase?: (amount: number) => Promise<{
    success: boolean;
    message?: string | undefined;
  }>;
  balance?: number;
}) => {
  const { stock, onPurchase, balance } = props;
  const [purchasing, setPurchasing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [amount, setAmount] = useState(0);
  return (
    <>
      <Modal
        visible={purchasing}
        onClose={() => {
          setPurchasing(false);
          setAmount(0);
        }}
        className={`p-10 max-w-prose w-min flex flex-col gap-8`}
      >
        <div className={`flex flex-col gap-2 w-fit`}>
          <span className={`text-2xl font-bold font-montserrat`}>
            Purchasing {stock.name}{" "}
            <span className={`text-gray-400`}>(${stock.stockID})</span>
          </span>
          <span className={`text-gray-400`}>
            Purchase a stock to add it to your portfolio.
          </span>
        </div>
        <div className={`flex flex-col gap-3 font-wsans`}>
          <span className={`font-normal text-sm text-gray-100/50`}>
            You are purchasing{" "}
          </span>

          <span className={`font-extrabold text-3xl text-gray-100 w-72`}>
            {amount} shares{" "}
          </span>
          <span className={`font-normal text-sm text-gray-100/50`}>
            x{" "}
            <span className={`font-bold text-gray-100`}>
              ${stock.price?.toFixed(2)}/share
            </span>
          </span>
          <span className={`font-normal text-lg text-gray-100/50`}>
            Total cost:{" "}
            <span
              className={`font-bold ${
                balance && amount * stock.price! > balance
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              ${(amount * stock.price!).toFixed(2)}
            </span>
          </span>
          <span className={`text-gray-400 text-sm`}>
            You have ${balance?.toFixed(2)} in your account.
          </span>
        </div>
        <div
          className={`flex flex-col items-start gap-4 ${
            processing ? "animate-pulse pointer-events-none" : ""
          }`}
        >
          <TextBox
            label={`Shares`}
            className={`w-64 rounded-2xl`}
            value={amount ? `${amount}` : ""}
            onChange={(e) =>
              setAmount(
                e.target.value ? Math.min(~~e.target.value, 10000000) : 0
              )
            }
          />
          <button
            className={`flex flex-row gap-2 bg-indigo-500 hover:bg-indigo-400 px-5 py-2.5 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={async () => {
              if (onPurchase) {
                setProcessing(true);
                const result = await onPurchase(amount);
                setProcessing(false);
                if (result.success) {
                  setPurchasing(false);
                  //   setAmount(0);
                }
              }
              setPurchaseSuccess(true);
              setPurchasing(false);
            }}
            disabled={!amount || amount * stock.price! > balance! || processing}
          >
            Place Order
          </button>
        </div>
      </Modal>
      <Modal
        visible={purchaseSuccess}
        onClose={() => {
          setPurchaseSuccess(false);
          setAmount(0);
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
              Purchase Successful
            </span>
            <span className={`text-gray-400`}>
              You have successfully purchased {amount} shares of {stock.name} ($
              {stock.stockID}).
            </span>
            <button
              className={`flex flex-row gap-2 items-center px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 ease-in-out w-fit`}
              onClick={() => {
                setPurchaseSuccess(false);
                setAmount(0);
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
        className={`flex flex-row gap-4 items-center w-full`}
        key={stock.stockID}
      >
        <div
          className={`flex flex-col gap-2 items-center justify-center w-16 h-16 bg-gray-850 text-3xl rounded-2xl shrink-0`}
        >
          <span className={`text-base font-bold font-montserrat text-gray-100`}>
            {stock.stockID}
          </span>
        </div>
        <div className={`flex flex-col gap-2`}>
          <span className={`text-xl font-bold font-montserrat`}>
            {stock.name}
          </span>
          <span className={`text-gray-400`}>
            ${stock.price?.toFixed(3)}/share
          </span>
        </div>
        <div className={`flex-grow`} />
        <button
          className={`flex flex-row gap-2 bg-indigo-500 hover:bg-indigo-400 p-2 rounded-xl transition-all duration-200`}
          onClick={() => setPurchasing(true)}
        >
          <PlusIcon className={`h-6 w-6 text-gray-100`} />
        </button>
      </div>
    </>
  );
};
