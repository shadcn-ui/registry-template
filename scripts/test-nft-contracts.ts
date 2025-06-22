import './load-env';
import { runContractTests } from "../registry/mini-app/blocks/nft-mint-flow/lib/test-contracts";

async function main() {
  try {
    await runContractTests();
  } catch (error) {
    console.error("Test runner failed:", error);
    process.exit(1);
  }
}

main();