import LiquidOps from "liquidops";
import createDataItemSignerBun from "./utils/bunSigner";
import { type JWKInterface } from "./utils/bunSigner/jwk-interface";
import { cleanQuantity } from "./utils/cleanQauntity";

export async function liquidate(
  WALLET_ADDRESS_TO_LIQUIDATE: string,
  TOKEN_TO_LIQUIDATE: string,
  TOKEN_YOU_GET_BACK: string,
  QUANTITY: number,
  SLIPPAGE: number,
) {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSignerBun(JWK);
  const client = new LiquidOps(signer);

  const quantity = cleanQuantity(TOKEN_TO_LIQUIDATE, QUANTITY);

  const PRECISION = 10000; // 4 decimal places
  const slippageMultiplier = BigInt(
    Math.floor((1 - SLIPPAGE / 100) * PRECISION),
  );
  const minExpectedQuantity =
    (quantity.raw * slippageMultiplier) / BigInt(PRECISION);

  const liquidate = await client.liquidate({
    token: TOKEN_TO_LIQUIDATE,
    rewardToken: TOKEN_YOU_GET_BACK,
    targetUserAddress: WALLET_ADDRESS_TO_LIQUIDATE,
    quantity: quantity.raw,
    minExpectedQuantity,
  });

  return liquidate;
}
