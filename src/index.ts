import LiquidOps from "liquidops";
import createDataItemSignerBun from "./utils/bunSigner";
import { type JWKInterface } from "./utils/bunSigner/jwk-interface";
import { cleanQuantity } from "./utils/cleanQauntity";

// CONFIGS
const WALLET_ADDRESS_TO_LIQUIDATE =
  "h037Kd9sfjYn7KyDvzkdqG5LVhry1dkKMj8aOJDq1F8";
const TOKEN_TO_LIQUIDATE = "WUSDT";
const TOKEN_YOU_GET_BACK = "WAR";
const QUANTITY = 5.808318595551656; // example 1.1 Arweave = 1.1

if (!process.env.JWK) {
  throw new Error("Please specify a JWK in the .env file");
}

const JWK: JWKInterface = JSON.parse(process.env.JWK);
const signer = createDataItemSignerBun(JWK);
const client = new LiquidOps(signer);

const quantity = cleanQuantity(TOKEN_TO_LIQUIDATE, QUANTITY);


const liquidate = await client.liquidate({
  token: TOKEN_TO_LIQUIDATE,
  rewardToken: TOKEN_YOU_GET_BACK,
  targetUserAddress: WALLET_ADDRESS_TO_LIQUIDATE,
  quantity,
  minExpectedQuantity: 4808318595551656000n,
});

console.log(liquidate);
