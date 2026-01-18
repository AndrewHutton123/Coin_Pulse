/* eslint-disable react-hooks/error-boundaries */
import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { CoinOverviewFallback } from "./Fallback";
import CandleStickChart from "../CandleStickChart";

const CoinOverview = async () => {
  try {
    const [coinData, coinOHLCData] = await Promise.all([
      await fetcher<CoinDetailsData>("/coins/bitcoin", {
        dex_pair_format: "symbol",
      }),

      await fetcher<OHLCData[]>("/coins/bitcoin/ohlc", {
        vs_currency: "usd",
        days: "1",
      }),
    ]);

    return (
      <div id="coin-overview">
        <CandleStickChart
          data={coinOHLCData}
          coinId="bitcoin"
          liveInterval="1m"
        >
          <div className="header pt-2">
            <Image
              src={coinData.image.large}
              alt={coinData.name}
              width={56}
              height={56}
            />
            <div className="info">
              <p>
                {coinData.name} / {coinData.symbol.toUpperCase()}
              </p>
              <h1>{formatCurrency(coinData.market_data.current_price.usd)}</h1>
            </div>
          </div>
        </CandleStickChart>
      </div>
    );
  } catch (error) {
    console.error("Error fetching coin:", error);
    return <CoinOverviewFallback />;
  }
};

export default CoinOverview;
