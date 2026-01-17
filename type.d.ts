type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => React.Key;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyRowClassName?: string;
  bodyCellClassName?: string;
};

type DataTableColumn<T> = {
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  headClassName?: string;
  cellClassName?: string;
};

type TrendingCoin = {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
    data: {
      price: number;
      price_change_percentage_24h: {
        usd: number;
      };
    };
  };
};
