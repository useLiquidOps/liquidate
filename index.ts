import { liquidate } from "./src/liquidate";

//-----------------------------------------------------------------
// CONFIGS
//-----------------------------------------------------------------
const WALLET_ADDRESS_TO_LIQUIDATE = `X3xmAVHFmOr67ZRP7f12Smkp7c4Xsm5SZZQw0OcTFKo`;
const TOKEN_TO_LIQUIDATE = "WUSDC";
const TOKEN_YOU_GET_BACK = "WUSDC";
const QUANTITY = 2.584405; // example 1.1 Arweave = 1.1
const SLIPPAGE = 5; // example 5 = 5% slippage
//-----------------------------------------------------------------

console.log(
  `\x1b[93mLiquidating ${QUANTITY} ${TOKEN_TO_LIQUIDATE} to get back ${TOKEN_YOU_GET_BACK},` +
    ` on wallet address ${WALLET_ADDRESS_TO_LIQUIDATE}, with a slippage of ${SLIPPAGE}%.\x1b[0m`,
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
