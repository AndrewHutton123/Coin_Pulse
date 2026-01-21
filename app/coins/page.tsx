import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import DataTable from "@/components/DataTable";
import Link from "next/link";
import CoinsPagination from "@/components/CoinsPagination";

const CoinsMarket = async ({ searchParams }: NextPageProps) => {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const perPage = 10;

  const coinMarketData = await fetcher<CoinMarketData[]>("coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: perPage,
    page: currentPage,
    sparkline: "false",
    price_change_percentage: "24h",
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

  const hasMorePages = coinMarketData.length == perPage;

  const estimatedTotalPages =
    currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;

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

        <CoinsPagination
          currentPage={currentPage}
          totalPages={estimatedTotalPages}
          hasMorePages={hasMorePages}
        />
      </div>
    </main>
  );
};

export default CoinsMarket;
