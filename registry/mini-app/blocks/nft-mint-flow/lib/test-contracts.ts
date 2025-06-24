import { getClientForChain } from "@/registry/mini-app/blocks/nft-mint-flow/lib/provider-detector";
import { fetchPriceData } from "@/registry/mini-app/blocks/nft-mint-flow/lib/price-optimizer";
import type { MintParams, NFTContractInfo } from "@/registry/mini-app/blocks/nft-mint-flow/lib/types";
import { KNOWN_CONTRACTS } from "@/registry/mini-app/lib/nft-standards";

export interface TestContract {
  name: string;
  params: MintParams;
  expected: {
    provider: string;
    hasERC20: boolean;
    erc20Symbol?: string;
    mintFeeETH: string; // Expected ETH fee
    nftCost?: string; // Expected NFT cost (ETH or ERC20)
    totalETH?: string; // Total ETH needed (for ETH-only mints)
  };
}

export const testContracts: TestContract[] = [
  {
    name: "Higher + ETH Fee",
    params: {
      contractAddress: "0x32dd0a7190b5bba94549a0d04659a9258f5b1387",
      chainId: 8453,
      provider: "manifold",
      instanceId: "4293509360",
      tokenId: "2"
    },
    expected: {
      provider: "manifold",
      hasERC20: true, // HIGHER token payment
      erc20Symbol: "HIGHER",
      mintFeeETH: "0.0005", // Platform fee (0.0005 ETH)
      nftCost: "777000" // Cost in HIGHER tokens
    }
  },
  {
    name: "Free Mint + ETH Fee",
    params: {
      contractAddress: "0x22fbd94bfc652dcb8b7958dda318566138d4bedc",
      chainId: 8453,
      provider: "manifold",
      instanceId: "4280815856",
      tokenId: "3"
    },
    expected: {
      provider: "manifold",
      hasERC20: false,
      mintFeeETH: "0.0005", // Platform fee
      nftCost: "0", // Free NFT
      totalETH: "0.0005" // Only platform fee
    }
  },
  {
    name: "USDC Payment + ETH Fee",
    params: {
      contractAddress: "0x22fbd94bfc652dcb8b7958dda318566138d4bedc",
      chainId: 8453,
      provider: "manifold",
      instanceId: "4214018288",
      tokenId: "4"
    },
    expected: {
      provider: "manifold",
      hasERC20: true,
      erc20Symbol: "USDC",
      mintFeeETH: "0.0005", // ETH platform fee
      nftCost: "1" // 1 USDC
    }
  }
];

// Helper to add delay between tests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function runContractTests() {
  console.log("🧪 Running NFT Contract Tests...\n");
  
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
  if (!alchemyKey) {
    console.log("⚠️  Warning: No NEXT_PUBLIC_ALCHEMY_KEY found");
    console.log("   Using public RPC (rate limits may occur)");
    console.log("   Add NEXT_PUBLIC_ALCHEMY_KEY to .env.local for better performance\n");
  } else {
    console.log("✅ Using Alchemy RPC\n");
  }
  
  const results: Array<{
    name: string;
    passed: boolean;
    errors: string[];
    details?: any;
  }> = [];

  for (const test of testContracts) {
    console.log(`Testing: ${test.name}`);
    const errors: string[] = [];
    
    // Add delay to avoid rate limits
    await delay(1000);
    
    try {
      // Create contract info
      const contractInfo: NFTContractInfo = {
        provider: test.params.provider as any,
        isERC1155: true,
        isERC721: false,
        extensionAddress: KNOWN_CONTRACTS.manifoldExtension
      };
      
      // Fetch price data
      const client = getClientForChain(test.params.chainId);
      const priceData = await fetchPriceData(client, test.params, contractInfo);
      
      // Validate results
      if (test.expected.hasERC20) {
        if (!priceData.erc20Details) {
          errors.push("Expected ERC20 payment but none found");
        } else if (priceData.erc20Details.symbol !== test.expected.erc20Symbol) {
          errors.push(`Expected ${test.expected.erc20Symbol} but got ${priceData.erc20Details.symbol}`);
        }
      } else {
        if (priceData.erc20Details) {
          errors.push("Expected ETH payment but found ERC20");
        }
      }
      
      // Check mint fee (with some tolerance for different fee structures)
      const mintFeeETH = priceData.mintPrice ? 
        (Number(priceData.mintPrice) / 1e18).toFixed(5) : "0.00000";
      
      // Allow some tolerance for different mint fees
      const expectedFee = parseFloat(test.expected.mintFeeETH);
      const actualFee = parseFloat(mintFeeETH);
      
      if (Math.abs(expectedFee - actualFee) > 0.0001 && expectedFee !== 0) {
        errors.push(`Expected mint fee ~${test.expected.mintFeeETH} ETH but got ${mintFeeETH} ETH`);
      }
      
      // Log details for debugging
      const details = {
        provider: contractInfo.provider,
        mintFeeETH,
        hasERC20: !!priceData.erc20Details,
        erc20Symbol: priceData.erc20Details?.symbol,
        nftCost: priceData.erc20Details 
          ? `${Number(contractInfo.claim?.cost || 0) / (10 ** priceData.erc20Details.decimals)} ${priceData.erc20Details.symbol}`
          : `${Number(contractInfo.claim?.cost || 0) / 1e18} ETH`,
        totalETH: `${Number(priceData.totalCost) / 1e18} ETH`
      };
      
      console.log(`  ✓ Provider: ${details.provider}`);
      console.log(`  ✓ Mint Fee: ${details.mintFeeETH} ETH`);
      if (details.hasERC20) {
        console.log(`  ✓ ERC20: ${details.erc20Symbol}`);
        console.log(`  ✓ NFT Cost: ${details.nftCost}`);
      } else {
        console.log(`  ✓ NFT Cost: ${details.nftCost}`);
        console.log(`  ✓ Total ETH: ${details.totalETH}`);
      }
      
      results.push({
        name: test.name,
        passed: errors.length === 0,
        errors,
        details
      });
      
    } catch (error) {
      console.error("  ❌ Test error:", error instanceof Error ? error.message : error);
      
      // Check for rate limit
      if (error instanceof Error && error.message.includes("rate limit")) {
        errors.push("Rate limited - consider using NEXT_PUBLIC_ALCHEMY_KEY");
      } else {
        errors.push(`Test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
      
      results.push({
        name: test.name,
        passed: false,
        errors
      });
    }
    
    console.log(errors.length === 0 ? "  ✅ PASSED\n" : `  ❌ FAILED: ${errors.join(", ")}\n`);
  }
  
  // Summary
  const passed = results.filter(r => r.passed).length;
  console.log(`\n📊 Test Summary: ${passed}/${results.length} passed`);
  
  return results;
}