"use client";

import * as React from "react";
import { Button } from "@/registry/mini-app/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/registry/mini-app/ui/sheet";
import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";
import {
  useAccount,
  useConnect,
  useWaitForTransactionReceipt,
  useWriteContract,
  useSwitchChain,
} from "wagmi";
import { formatEther, type Address } from "viem";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import {
  Coins,
  CheckCircle,
  AlertCircle,
  Loader2,
  Info,
  ExternalLink,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  detectNFTProvider,
  validateParameters,
  getClientForChain,
} from "@/registry/mini-app/blocks/nft-mint-flow/lib/provider-detector";
import { getProviderConfig } from "@/registry/mini-app/blocks/nft-mint-flow/lib/provider-configs";
import { fetchPriceData } from "@/registry/mini-app/blocks/nft-mint-flow/lib/price-optimizer";
import { mintReducer, initialState, type MintStep } from "@/registry/mini-app/blocks/nft-mint-flow/lib/mint-reducer";
import type { MintParams } from "@/registry/mini-app/blocks/nft-mint-flow/lib/types";
import { parseError, type ParsedError } from "@/registry/mini-app/blocks/nft-mint-flow/lib/error-parser";

/**
 * NFTMintButton - Universal NFT minting button with automatic provider detection and ERC20 approval handling
 *
 * @example
 * ```tsx
 * // Basic ETH mint (auto-detects provider)
 * <NFTMintButton
 *   contractAddress="0x5b97886E4e1fC0F7d19146DEC03C917994b3c3a4"
 *   chainId={1}
 * />
 *
 * // Manifold NFT with ERC20 payment (HIGHER token)
 * <NFTMintButton
 *   contractAddress="0x32dd0a7190b5bba94549a0d04659a9258f5b1387"
 *   chainId={8453}
 *   provider="manifold"
 *   manifoldParams={{ instanceId: "4293509360", tokenId: "2" }}
 * />
 *
 * // Multiple NFTs with custom button
 * <NFTMintButton
 *   contractAddress="0x..."
 *   chainId={8453}
 *   amount={5}
 *   buttonText="Mint 5 NFTs"
 *   onMintSuccess={(txHash) => console.log('Minted!', txHash)}
 * />
 * ```
 */
type NFTMintFlowProps = {
  /**
   * NFT contract address (0x...). This should be the main NFT contract, not the minting contract.
   * For Manifold, this is the creator contract, not the extension.
   */
  contractAddress: Address;

  /**
   * Blockchain network ID
   * - 1 = Ethereum mainnet
   * - 8453 = Base mainnet
   */
  chainId: 1 | 8453;

  /**
   * Optional provider hint. Use when:
   * - Auto-detection is failing
   * - You know the provider and want faster loading
   * - Testing specific provider flows
   *
   * Leave undefined for automatic detection.
   */
  provider?: "manifold" | "opensea" | "zora" | "generic";

  /**
   * Number of NFTs to mint. Defaults to 1.
   * Note: For ERC20 payments, the total cost is multiplied by this amount.
   */
  amount?: number;

  /**
   * Manifold-specific parameters. Required when provider="manifold".
   * - instanceId: The claim instance ID from Manifold (required for most Manifold NFTs)
   * - tokenId: The specific token ID (required for some editions)
   *
   * Find these in the Manifold claim page URL or contract details.
   */
  manifoldParams?: {
    instanceId?: string;
    tokenId?: string;
  };

  // UI customization
  /** Additional CSS classes */
  className?: string;
  /** Button style variant */
  variant?: "default" | "destructive" | "secondary" | "ghost" | "outline";
  /** Button size */
  size?: "default" | "sm" | "lg" | "icon";
  /** Custom button text. Defaults to "Mint NFT" */
  buttonText?: string;
  /** Disable the mint button */
  disabled?: boolean;

  /**
   * Called when NFT minting succeeds (not on approval success)
   * @param txHash - The mint transaction hash (not approval tx)
   */
  onMintSuccess?: (txHash: string) => void;

  /**
   * Called when NFT minting fails (not on approval failure)
   * @param error - Human-readable error message
   */
  onMintError?: (error: string) => void;
};

export function NFTMintButton({
  contractAddress,
  chainId,
  provider,
  amount = 1,
  manifoldParams,
  className,
  variant = "default",
  size = "default",
  buttonText = "Mint NFT",
  disabled = false,
  onMintSuccess,
  onMintError,
}: NFTMintFlowProps) {
  const [state, dispatch] = React.useReducer(mintReducer, initialState);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [parsedError, setParsedError] = React.useState<ParsedError | null>(null);

  // Prop validation with helpful errors
  React.useEffect(() => {
    if (
      provider === "manifold" &&
      !manifoldParams?.instanceId &&
      !manifoldParams?.tokenId
    ) {
      console.error(
        "NFTMintFlow: When provider='manifold', you must provide manifoldParams with either instanceId or tokenId. " +
          "Example: manifoldParams={{ instanceId: '4293509360' }}",
      );
    }

    if (manifoldParams && provider !== "manifold") {
      console.warn(
        "NFTMintFlow: manifoldParams provided but provider is not 'manifold'. " +
          "Did you forget to set provider='manifold'?",
      );
    }

    if (chainId !== 1 && chainId !== 8453) {
      console.warn(
        `NFTMintFlow: Chain ID ${chainId} may not be supported. ` +
          "Currently tested chains: 1 (Ethereum), 8453 (Base)",
      );
    }

    if (!contractAddress || !contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      console.error(
        "NFTMintFlow: Invalid contract address. Must be a valid Ethereum address (0x...)",
      );
    }
  }, [provider, manifoldParams, chainId, contractAddress]);

  // Destructure commonly used values
  const {
    step,
    contractInfo,
    priceData,
    error,
    txHash,
    txType,
    isLoading,
    validationErrors,
  } = state;
  const { erc20Details } = priceData;

  const { isSDKLoaded } = useMiniAppSdk();
  const { isConnected, address, chain } = useAccount();
  const { connect } = useConnect();
  const { switchChain } = useSwitchChain();
  const {
    writeContract,
    isPending: isWritePending,
    data: writeData,
    error: writeError,
  } = useWriteContract();

  // Build mint params
  const mintParams: MintParams = React.useMemo(
    () => ({
      contractAddress,
      chainId,
      provider,
      amount,
      instanceId: manifoldParams?.instanceId,
      tokenId: manifoldParams?.tokenId,
      recipient: address,
    }),
    [contractAddress, chainId, provider, amount, manifoldParams, address],
  );

  // Watch for transaction completion
  const {
    isSuccess: isTxSuccess,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Get provider config
  const providerConfig = contractInfo
    ? getProviderConfig(contractInfo.provider)
    : null;

  // Check if user is on the correct network
  const isCorrectNetwork = chain?.id === chainId;
  const networkName = chainId === 1 ? "Ethereum" : chainId === 8453 ? "Base" : "Unknown";

  // Handle transaction status updates
  React.useEffect(() => {
    if (writeError) {
      const parsed = parseError(writeError, txType || "mint");
      
      // Don't show error state for user rejections - just close
      if (parsed.type === "user-rejected") {
        dispatch({ type: "RESET" });
        setParsedError(null);
        return;
      }
      
      setParsedError(parsed);
      dispatch({ type: "TX_ERROR", payload: writeError.message });
      if (txType === "mint") {
        onMintError?.(writeError.message);
      }
    }
    if (isTxError && txError) {
      const parsed = parseError(txError, txType || "mint");
      setParsedError(parsed);
      dispatch({ type: "TX_ERROR", payload: txError.message });
      if (txType === "mint") {
        onMintError?.(txError.message);
      }
    }
    if (writeData && !isTxSuccess && !isTxError) {
      // Transaction submitted, waiting for confirmation
      if (txType === "approval") {
        dispatch({ type: "APPROVE_TX_SUBMITTED", payload: writeData });
      } else if (txType === "mint") {
        dispatch({ type: "MINT_TX_SUBMITTED", payload: writeData });
      }
    }
    if (isTxSuccess && writeData) {
      if (txType === "approval") {
        dispatch({ type: "APPROVE_SUCCESS" });
      } else if (txType === "mint") {
        dispatch({ type: "TX_SUCCESS", payload: writeData });
        onMintSuccess?.(writeData);
      }
    }
  }, [
    isTxSuccess,
    writeData,
    onMintSuccess,
    isTxError,
    txError,
    onMintError,
    writeError,
    txType,
  ]);

  // Auto-close on success after 10 seconds
  React.useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        handleClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleClose = React.useCallback(() => {
    setIsSheetOpen(false);
    dispatch({ type: "RESET" });
    setParsedError(null);
  }, []);

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId });
    } catch (err) {
      // Network switch failed - user likely rejected or wallet doesn't support it
    }
  };

  // Detect NFT provider and validate
  const detectAndValidate = async () => {
    dispatch({ type: "DETECT_START" });

    try {
      // Detect provider
      const info = await detectNFTProvider(mintParams);

      // Validate parameters
      const validation = validateParameters(mintParams, info);

      if (!validation.isValid) {
        dispatch({ type: "VALIDATION_ERROR", payload: validation.errors });
        return;
      }

      // Fetch optimized price data
      const client = getClientForChain(chainId);
      const fetchedPriceData = await fetchPriceData(client, mintParams, info);

      // Update contract info with ERC20 details and claim data
      if (fetchedPriceData.erc20Details) {
        info.erc20Token = fetchedPriceData.erc20Details
          .address as `0x${string}`;
        info.erc20Symbol = fetchedPriceData.erc20Details.symbol;
        info.erc20Decimals = fetchedPriceData.erc20Details.decimals;
      }

      // Add claim data if available
      if (fetchedPriceData.claim) {
        info.claim = fetchedPriceData.claim;
      }

      dispatch({
        type: "DETECT_SUCCESS",
        payload: {
          contractInfo: info,
          priceData: {
            mintPrice: fetchedPriceData.mintPrice,
            totalCost: fetchedPriceData.totalCost,
            erc20Details: fetchedPriceData.erc20Details,
          },
        },
      });
    } catch (err) {
      dispatch({
        type: "DETECT_ERROR",
        payload: "Failed to detect NFT contract type",
      });
    }
  };

  // Check allowance only (without re-detecting everything)
  const checkAllowanceOnly = React.useCallback(async () => {
    if (!contractInfo || !erc20Details || !address) return;

    try {
      const client = getClientForChain(chainId);
      const spenderAddress =
        contractInfo.provider === "manifold" && contractInfo.extensionAddress
          ? contractInfo.extensionAddress
          : contractAddress;

      const allowance = await client.readContract({
        address: erc20Details.address as `0x${string}`,
        abi: [
          {
            name: "allowance",
            type: "function",
            inputs: [
              { name: "owner", type: "address" },
              { name: "spender", type: "address" },
            ],
            outputs: [{ type: "uint256" }],
            stateMutability: "view",
          },
        ],
        functionName: "allowance",
        args: [address, spenderAddress],
      });

      dispatch({ type: "UPDATE_ALLOWANCE", payload: allowance as bigint });
    } catch (err) {
      // Allowance check failed - will proceed without pre-checked allowance
    }
  }, [contractInfo, erc20Details, address, chainId, contractAddress]);

  // Re-check allowance after wallet connection
  React.useEffect(() => {
    if (
      isConnected &&
      address &&
      erc20Details &&
      erc20Details.allowance === undefined
    ) {
      checkAllowanceOnly();
    }
  }, [isConnected, address, erc20Details, checkAllowanceOnly]);

  const handleInitialMint = async () => {
    if (!isSDKLoaded) {
      dispatch({ type: "TX_ERROR", payload: "Farcaster SDK not loaded" });
      setIsSheetOpen(true);
      return;
    }

    setIsSheetOpen(true);
    await detectAndValidate();
  };

  const handleConnectWallet = async () => {
    try {
      dispatch({ type: "CONNECT_START" });
      const connector = farcasterFrame();
      connect({ connector });
    } catch (err) {
      handleError(err, "Failed to connect wallet");
    }
  };

  const handleApprove = async () => {
    if (!isConnected || !erc20Details || !contractInfo?.claim) {
      dispatch({
        type: "TX_ERROR",
        payload: "Missing required information for approval",
      });
      return;
    }

    try {
      dispatch({ type: "APPROVE_START" });

      // For Manifold, approve the extension contract, not the NFT contract
      const spenderAddress =
        contractInfo.provider === "manifold" && contractInfo.extensionAddress
          ? contractInfo.extensionAddress
          : contractAddress;

      // Approve exact amount needed
      await writeContract({
        address: erc20Details.address as `0x${string}`,
        abi: [
          {
            name: "approve",
            type: "function",
            inputs: [
              { name: "spender", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ type: "bool" }],
            stateMutability: "nonpayable",
          },
        ],
        functionName: "approve",
        args: [spenderAddress, contractInfo.claim.cost],
        chainId,
      });
      
      // The transaction has been initiated - we'll track it via writeData in the effect
    } catch (err) {
      handleError(err, "Approval failed", "approval");
    }
  };

  const handleMint = async () => {
    if (!isConnected) {
      await handleConnectWallet();
      return;
    }

    if (!contractInfo || !providerConfig) {
      dispatch({
        type: "TX_ERROR",
        payload: "Contract information not available",
      });
      return;
    }

    try {
      dispatch({ type: "MINT_START" });

      const args = providerConfig.mintConfig.buildArgs(mintParams);
      const value = priceData.mintPrice
        ? providerConfig.mintConfig.calculateValue(
            priceData.mintPrice,
            mintParams,
          )
        : BigInt(0);

      // Handle Manifold's special case
      const mintAddress =
        contractInfo.provider === "manifold" && contractInfo.extensionAddress
          ? contractInfo.extensionAddress
          : contractAddress;

      await writeContract({
        address: mintAddress,
        abi: providerConfig.mintConfig.abi,
        functionName: providerConfig.mintConfig.functionName as any,
        args,
        value,
        chainId,
      });
      
      // The transaction has been initiated - we'll track it via writeData in the effect
    } catch (err) {
      handleError(err, "Mint transaction failed", "mint");
    }
  };

  // Centralized error handler
  const handleError = (
    error: unknown,
    context: string,
    transactionType?: "approval" | "mint",
  ) => {
    console.error(`${context}:`, error);
    const message = error instanceof Error ? error.message : `${context}`;
    
    // Parse the error for better UX
    const parsed = parseError(error, transactionType || "mint");
    setParsedError(parsed);
    
    dispatch({ type: "TX_ERROR", payload: message });
    // Use explicit transaction type if provided, otherwise fall back to state
    if ((transactionType || txType) === "mint") {
      onMintError?.(message);
    }
  };

  const handleRetry = () => {
    dispatch({ type: "RESET" });
    detectAndValidate();
  };

  // Display helpers (quick win: centralized formatting)
  const formatPrice = (amount: bigint, decimals: number, symbol: string) => {
    if (amount === BigInt(0)) return "Free";
    return `${Number(amount) / 10 ** decimals} ${symbol}`;
  };

  const displayPrice = () => {
    if (erc20Details && contractInfo?.claim) {
      return formatPrice(
        contractInfo.claim.cost || BigInt(0),
        erc20Details.decimals || 18,
        erc20Details.symbol,
      );
    }
    return priceData.mintPrice
      ? `${formatEther(priceData.mintPrice)} ETH`
      : "Free";
  };

  const displayTotalCost = () => {
    if (erc20Details && contractInfo?.claim) {
      // For Manifold, cost is per claim, not per NFT amount
      return formatPrice(
        contractInfo.claim.cost || BigInt(0),
        erc20Details.decimals || 18,
        erc20Details.symbol,
      );
    }
    return priceData.totalCost
      ? `${formatEther(priceData.totalCost)} ETH`
      : "Free";
  };

  const displayMintFee = () => {
    const fee = priceData.mintPrice || BigInt(0);
    return fee > BigInt(0) ? `${formatEther(fee)} ETH` : "0 ETH";
  };

  const providerName = contractInfo?.provider
    ? contractInfo.provider.charAt(0).toUpperCase() +
      contractInfo.provider.slice(1)
    : "Unknown";

  // Quick win: validation helper
  const isReadyToMint = () => {
    return (
      isConnected &&
      contractInfo &&
      !isLoading &&
      step === "sheet" &&
      (!erc20Details || !erc20Details.needsApproval)
    );
  };

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={(open) => {
        setIsSheetOpen(open);
        if (!open) {
          handleClose();
        }
      }}
    >
      <Button
        variant={variant}
        size={size}
        onClick={handleInitialMint}
        disabled={disabled || !isSDKLoaded || isLoading}
        className={cn("w-full", className)}
      >
        <Coins className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>

      <SheetContent
        side="bottom"
        onClose={handleClose}
        className="!bottom-0 !rounded-t-xl !rounded-b-none !max-h-[90vh] !h-auto"
      >
        <SheetHeader className="mb-6">
          <SheetTitle>
            {step === "detecting" && "Detecting NFT Type"}
            {step === "sheet" && "Mint NFT"}
            {step === "connecting" && "Connecting Wallet"}
            {step === "approve" && "Approve Token"}
            {step === "approving" && "Approving..."}
            {step === "minting" && "Preparing Mint"}
            {step === "waiting" &&
              (txType === "approval" ? "Approving..." : "Minting...")}
            {step === "success" && "Mint Successful!"}
            {step === "error" && "Transaction Failed"}
            {step === "validation-error" && "Missing Information"}
          </SheetTitle>
        </SheetHeader>

        {/* Detecting Provider */}
        {step === "detecting" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <p className="text-muted-foreground">
              Detecting NFT contract type...
            </p>
          </div>
        )}

        {/* Validation Error */}
        {step === "validation-error" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Info className="h-12 w-12 text-yellow-500" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-center">
                Missing Required Information
              </p>
              {validationErrors.map((err, idx) => (
                <p
                  key={idx}
                  className="text-sm text-muted-foreground text-center"
                >
                  {err}
                </p>
              ))}
            </div>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}

        {/* Approve Step */}
        {step === "approve" && erc20Details && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <p className="font-semibold">Approval Required</p>
              <p className="text-sm text-muted-foreground">
                This NFT requires payment in {erc20Details.symbol}. You need to
                approve the contract to spend your tokens.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Token</span>
                <span className="font-semibold">{erc20Details.symbol}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Amount to Approve</span>
                <span className="font-semibold">
                  {contractInfo?.claim
                    ? Number(contractInfo.claim.cost) /
                      10 ** erc20Details.decimals
                    : 0}{" "}
                  {erc20Details.symbol}
                </span>
              </div>
            </div>
            <Button
              onClick={handleApprove}
              size="lg"
              className="w-full"
              disabled={isWritePending}
            >
              <Coins className="h-5 w-5 mr-2" />
              Approve {erc20Details.symbol}
            </Button>
          </div>
        )}

        {/* Main Sheet Content */}
        {step === "sheet" && contractInfo && (
          <div className="space-y-6">
            {/* Network warning */}
            {!isCorrectNetwork && isConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm font-medium">Wrong network</p>
                  </div>
                  <Button
                    onClick={handleSwitchNetwork}
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                  >
                    Switch to {networkName}
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-semibold">{providerName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Contract</span>
                <span className="font-mono text-sm">
                  {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-semibold">{amount}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Price per NFT</span>
                <span className="font-semibold">{displayPrice()}</span>
              </div>
              {erc20Details && (
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-muted-foreground">Mint Fee</span>
                  <span className="font-semibold">{displayMintFee()}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-3 text-lg font-semibold">
                <span>Total Cost</span>
                <span>{displayTotalCost()}</span>
              </div>
            </div>

            <Button
              onClick={isConnected ? handleMint : handleConnectWallet}
              size="lg"
              className="w-full"
              disabled={isWritePending || !isReadyToMint() || (!isCorrectNetwork && isConnected)}
            >
              {isConnected ? (
                !isCorrectNetwork ? (
                  "Switch Network to Mint"
                ) : (
                  <>
                    <Coins className="h-5 w-5 mr-2" />
                    Mint {amount} NFT{amount > 1 ? "s" : ""}
                  </>
                )
              ) : (
                "Connect Wallet to Mint"
              )}
            </Button>
          </div>
        )}

        {/* Connecting */}
        {step === "connecting" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <p className="text-muted-foreground">
              Connecting to your Farcaster wallet...
            </p>
          </div>
        )}

        {/* Minting/Approving */}
        {(step === "minting" || step === "approving") && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <div>
              <p className="font-semibold">
                {step === "approving"
                  ? "Preparing approval"
                  : "Preparing mint transaction"}
              </p>
              <p className="text-sm text-muted-foreground">
                Please approve the transaction in your wallet
              </p>
            </div>
          </div>
        )}

        {/* Waiting for Transaction */}
        {step === "waiting" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <div>
              <p className="font-semibold">
                {txType === "approval"
                  ? "Approval submitted"
                  : "Transaction submitted"}
              </p>
              <p className="text-sm text-muted-foreground">
                Waiting for confirmation on the blockchain...
              </p>
              {txHash && (
                <p className="text-xs font-mono mt-2 px-3 py-1 bg-muted rounded">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <div className="space-y-3">
              <p className="text-2xl font-semibold">Minted! 🎉</p>
              <p className="text-muted-foreground">
                {amount} NFT{amount > 1 ? "s" : ""} successfully minted
              </p>
            </div>
            {txHash && (
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a
                    href={`https://txha.sh/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View transaction
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            )}
            <Button onClick={handleClose} className="w-full" size="lg">
              Done
            </Button>
          </div>
        )}

        {/* Error State */}
        {step === "error" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-red-50 rounded-full">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-lg">
                  {parsedError?.message || "Transaction Failed"}
                </p>
                {parsedError?.details && (
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {parsedError.details}
                  </p>
                )}
              </div>
            </div>

            {/* Special handling for wrong network */}
            {!isCorrectNetwork && isConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Wrong Network</p>
                    <p className="text-sm text-muted-foreground">
                      Please switch to {networkName} to continue
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSwitchNetwork}
                  size="sm"
                  className="w-full"
                  variant="outline"
                >
                  Switch to {networkName}
                </Button>
              </div>
            )}

            {/* Specific error actions */}
            {parsedError?.type === "insufficient-funds" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Wallet className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Insufficient Balance</p>
                    <p className="text-muted-foreground">
                      Make sure you have enough:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mt-1">
                      {erc20Details ? (
                        <>
                          <li>{erc20Details.symbol} for the NFT price</li>
                          <li>ETH for gas fees</li>
                        </>
                      ) : (
                        <li>ETH for both NFT price and gas fees</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={handleRetry} 
                className="flex-1"
                disabled={!isCorrectNetwork && isConnected}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {parsedError?.actionText || "Try Again"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/**
 * Preset builders for common NFT minting scenarios.
 * These provide type-safe, self-documenting ways to create NFTMintButton components.
 */
NFTMintButton.presets = {
  /**
   * Create a basic ETH-based NFT mint
   * @example
   * ```tsx
   * <NFTMintButton {...NFTMintButton.presets.generic({
   *   contractAddress: "0x5b97886E4e1fC0F7d19146DEC03C917994b3c3a4",
   *   chainId: 1,
   *   amount: 1
   * })} />
   * ```
   */
  generic: (props: {
    contractAddress: Address;
    chainId: 1 | 8453;
    amount?: number;
    buttonText?: string;
    onMintSuccess?: (txHash: string) => void;
    onMintError?: (error: string) => void;
  }): NFTMintFlowProps => ({
    ...props,
    provider: "generic",
    amount: props.amount || 1,
  }),

  /**
   * Create a Manifold NFT mint with proper configuration
   * @example
   * ```tsx
   * <NFTMintButton {...NFTMintButton.presets.manifold({
   *   contractAddress: "0x32dd0a7190b5bba94549a0d04659a9258f5b1387",
   *   chainId: 8453,
   *   instanceId: "4293509360"
   * })} />
   * ```
   */
  manifold: (props: {
    contractAddress: Address;
    chainId: 1 | 8453;
    instanceId: string;
    tokenId?: string;
    amount?: number;
    buttonText?: string;
    onMintSuccess?: (txHash: string) => void;
    onMintError?: (error: string) => void;
  }): NFTMintFlowProps => ({
    contractAddress: props.contractAddress,
    chainId: props.chainId,
    provider: "manifold",
    manifoldParams: {
      instanceId: props.instanceId,
      tokenId: props.tokenId,
    },
    amount: props.amount || 1,
    buttonText: props.buttonText,
    onMintSuccess: props.onMintSuccess,
    onMintError: props.onMintError,
  }),

  /**
   * Create an auto-detecting NFT mint (tries to figure out the provider)
   * @example
   * ```tsx
   * <NFTMintButton {...NFTMintButton.presets.auto({
   *   contractAddress: "0x...",
   *   chainId: 8453
   * })} />
   * ```
   */
  auto: (props: {
    contractAddress: Address;
    chainId: 1 | 8453;
    amount?: number;
    buttonText?: string;
    onMintSuccess?: (txHash: string) => void;
    onMintError?: (error: string) => void;
  }): NFTMintFlowProps => ({
    ...props,
    amount: props.amount || 1,
  }),
};
