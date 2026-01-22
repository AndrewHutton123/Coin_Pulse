import { useEffect, useRef, useState } from "react";

const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_pro_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;

export const useCoinGeckoWebSocket = ({
  coinId,
  poolId,
  liveInterval,
}: useCoinGeckoWebSocketProps) => {
  const webSocketRef = useRef<WebSocket | null>(null);
  const subscribed = useRef(<Set<string>>new Set());
  console.log("🚀 ~ useCoinGeckoWebSocket ~ subscribed:", subscribed);

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);

  const [ohlc, setOhlc] = useState<OHLCData | null>(null);

  const [isWebSocketReady, setIsWebSocketReady] = useState(false);

  useEffect(() => {
    const webSocket = new WebSocket(WS_BASE);

    webSocketRef.current = webSocket;

    const send = (payload: Record<string, unknown>) =>
      webSocket.send(JSON.stringify(payload));

    const handleMessage = (event: MessageEvent) => {
      const msg: WebSocketMessage = JSON.parse(event.data);
      if (msg.type === "ping") {
        send({ type: "ping" });
        return;
      }

      if (msg.type === "confirm_subscription") {
        const { channel } = JSON.parse(msg?.identifier ?? "");

        subscribed.current.add(channel);
      }

      if (msg.c === "C1") {
        setPrice({
          usd: msg.p ?? 0,
          coin: msg.i,
        });
      }
    };
  }, []);
};
