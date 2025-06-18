import { liquidate } from "./src/liquidate";

async function main() {
  // CONFIGS
  const WALLET_ADDRESS_TO_LIQUIDATE =
    "tGphuPlhxV5ppY_z2pQ_2JaU3-UU_8nVlgMmz7v4zDs";
  const TOKEN_TO_LIQUIDATE = "WUSDC";
  const TOKEN_YOU_GET_BACK = "WAR";
  const QUANTITY = 85.101437; // example 1.1 Arweave = 1.1
  const SLIPPAGE = 5; // example 5 = 5% slippage

  console.log(
    `\x1b[93mLiquidating ${QUANTITY} ${TOKEN_TO_LIQUIDATE} to get back ${TOKEN_YOU_GET_BACK}, on wallet address ${WALLET_ADDRESS_TO_LIQUIDATE}, with a slippage of ${SLIPPAGE}%.\x1b[0m`,
  );
  console.log(
    await liquidate(
      WALLET_ADDRESS_TO_LIQUIDATE,
      TOKEN_TO_LIQUIDATE,
      TOKEN_YOU_GET_BACK,
      QUANTITY,
      SLIPPAGE,
    ),
  );
}

// Call the main function
main().catch(console.error);
