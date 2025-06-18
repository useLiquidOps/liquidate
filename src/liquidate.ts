import LiquidOps, { tokenInput } from "liquidops";
import createDataItemSignerBun from "./utils/bunSigner";
import { type JWKInterface } from "./utils/bunSigner/jwk-interface";
import { cleanQuantity } from "./utils/cleanQauntity";
import { ownerToAddress } from "./utils/arweaveUtils";

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
  const walletAddress = await ownerToAddress(JWK.n);

  const quantity = cleanQuantity(TOKEN_TO_LIQUIDATE, QUANTITY);

  const PRECISION = 10000; // 4 decimal places
  const slippageMultiplier = BigInt(
    Math.floor((1 - SLIPPAGE / 100) * PRECISION),
  );
  const minExpectedQuantity =
    (quantity.raw * slippageMultiplier) / BigInt(PRECISION);

  const transferId = await client.liquidate({
    token: TOKEN_TO_LIQUIDATE,
    rewardToken: TOKEN_YOU_GET_BACK,
    targetUserAddress: WALLET_ADDRESS_TO_LIQUIDATE,
    quantity: quantity.raw,
    minExpectedQuantity,
    noResult: true,
  });

  const { tokenAddress, oTokenAddress } = tokenInput(TOKEN_TO_LIQUIDATE);
  const res = await client.trackResult({
    process: tokenAddress,
    // @ts-ignore, it will return a string due to noResult: true
    message: transferId,
    targetProcess: oTokenAddress,
    match: {
      success: {
        Target: walletAddress,
        Tags: [{ name: "Action", values: "Liquidate-Confirmation" }],
      },
      fail: {
        Target: walletAddress,
        Tags: [{ name: "Action", values: ["Liquidate-Error", "Transfer-Error"] }],
      },
    },
  });

  if (!res) {
    throw new Error(
      `Failed to find liquidation result onchain. The action might have failed, please check the transaction manually via opening up https://www.ao.link/#/message/${transferId} in your browser.`,
    );
  } else if (res.match === "fail") {
    const errorMessage =
      res.message.Tags.find((tag) => tag.name === "Error")?.value ||
      "Unknown error";

    throw new Error(errorMessage);
  }

  return transferId;
}
