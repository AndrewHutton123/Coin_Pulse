import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import DataTable from "@/components/DataTable";
import Link from "next/link";

const CoinsMarket = async ({ searchParams }: NextPageProps) => {
  const coinMarketData = await fetcher<CoinMarketData[]>("coins/markets", {
    vs_currency: "usd",
  });

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: "Rank",
      cellClassName: "rank-cell",
      cell: (coinData) => (
        <>
          #{coinData.market_cap_rank}{" "}
          <Link href={`coins/${coinData.id}`} aria-label="View coin" />
        </>
      ),
    },
    {
      header: "Token",
      cellClassName: "token-cell",
      cell: (coinData) => {
        return (
          <div className="token-info">
            <Image
              src={coinData.image}
              alt={coinData.name}
              key={coinData.id}
              width={28}
              height={28}
            />
            <p>{coinData.name}</p>
          </div>
        );
      },
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (coinData) => formatCurrency(coinData.current_price),
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: (coinData) => {
        const isTrendingUp = coinData.market_cap_change_percentage_24h > 0;
        return (
          <span
            className={cn(
              "change-value",
              isTrendingUp ? "text-green-600" : "text-red-500",
            )}
          >
            {formatPercentage(coinData.price_change_percentage_24h)}
          </span>
        );
      },
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: (coinData) => formatCurrency(coinData.market_cap),
    },
  ];
  return (
    <main id="coins-page">
      <div className="content">
        <h4>All Coins</h4>
        <DataTable
          columns={columns}
          data={coinMarketData?.slice(0, 10)}
          rowKey={(coinData) => coinData.id}
          tableClassName="coins-table"
        />
      </div>
    </main>
  );
};

export default CoinsMarket;
