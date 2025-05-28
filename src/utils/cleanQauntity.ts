import { tokenData } from "liquidops";
import { Quantity } from "ao-tokens";

export function cleanQuantity(ticker: string, quantity: number): BigInt {
  const decimals = tokenData[ticker];

  if (!decimals || !decimals.denomination) {
    throw new Error(`Token ${ticker} not found in tokenData.`);
  }

  const formattedQuantity = new Quantity(0n, decimals.denomination).fromNumber(
    quantity,
  );

  return formattedQuantity.raw;
}
