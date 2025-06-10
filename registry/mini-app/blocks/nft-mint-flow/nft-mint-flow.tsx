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
  useReadContract,
} from "wagmi";
import { formatEther, type Address } from "viem";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { Coins, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type NFTMintFlowProps = {
  amount: number;
  chainId: number;
  contractAddress: Address;
  className?: string;
  variant?: "default" | "destructive" | "secondary" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  buttonText?: string;
  disabled?: boolean;
  onMintSuccess?: (txHash: string) => void;
  onMintError?: (error: string) => void;
};

type MintStep =
  | "initial"
  | "sheet"
  | "connecting"
  | "minting"
  | "waiting"
  | "success"
  | "error";

// Common NFT contract ABI for price reading
const priceAbi = [
  {
    inputs: [],
    name: "mintPrice",
    outputs: [{ type: "uint256", name: "price" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "price",
    outputs: [{ type: "uint256", name: "price" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINT_PRICE",
    outputs: [{ type: "uint256", name: "price" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMintPrice",
    outputs: [{ type: "uint256", name: "price" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function NFTMintFlow({
  amount,
  chainId,
  contractAddress,
  className,
  variant = "default",
  size = "default",
  buttonText = "Mint NFT",
  disabled = false,
  onMintSuccess,
  onMintError,
}: NFTMintFlowProps) {
  const [step, setStep] = React.useState<MintStep>("initial");
  const [error, setError] = React.useState<string>("");
  const [txHash, setTxHash] = React.useState<string>("");
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const { isSDKLoaded } = useMiniAppSdk();
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const {
    writeContract,
    isPending: isWritePending,
    data: writeData,
    error: writeError,
  } = useWriteContract();

  // Read mint price from contract with proper configuration
  const {
    data: mintPrice,
    isError: isPriceError,
    isLoading: isMintPriceLoading,
  } = useReadContract({
    address: contractAddress,
    abi: priceAbi,
    functionName: "mintPrice",
    chainId,
    query: {
      enabled: !!contractAddress && !!chainId,
      retry: 3,
      retryDelay: 1000,
    },
  });

  // Fallback to other price function names if mintPrice fails
  const {
    data: price,
    isLoading: isPriceLoading,
    isError: isPriceError2,
  } = useReadContract({
    address: contractAddress,
    abi: priceAbi,
    functionName: "price",
    chainId,
    query: {
      enabled:
        !!contractAddress &&
        !!chainId &&
        isPriceError &&
        (isPriceError || mintPrice === undefined),
      retry: 3,
      retryDelay: 1000,
    },
  });

  const {
    data: MINT_PRICE,
    isLoading: isMintPriceConstLoading,
    isError: isMintPriceConstError,
  } = useReadContract({
    address: contractAddress,
    abi: priceAbi,
    functionName: "MINT_PRICE",
    chainId,
    query: {
      enabled:
        !!contractAddress &&
        !!chainId &&
        isPriceError2 &&
        (isPriceError2 || price === undefined),
      retry: 3,
      retryDelay: 1000,
    },
  });

  const { data: getMintPrice, isLoading: isGetMintPriceLoading } =
    useReadContract({
      address: contractAddress,
      abi: priceAbi,
      functionName: "getMintPrice",
      chainId,
      query: {
        enabled:
          !!contractAddress &&
          !!chainId &&
          isMintPriceConstError &&
          (isMintPriceConstError || MINT_PRICE === undefined),
        retry: 3,
        retryDelay: 1000,
      },
    });

  const contractPrice =
    mintPrice === BigInt(0)
      ? BigInt(0)
      : mintPrice
        ? mintPrice
        : price === BigInt(0)
          ? BigInt(0)
          : price
            ? price
            : MINT_PRICE === BigInt(0)
              ? BigInt(0)
              : MINT_PRICE
                ? MINT_PRICE
                : getMintPrice === BigInt(0)
                  ? BigInt(0)
                  : getMintPrice
                    ? getMintPrice
                    : undefined;
  const isLoadingPrice =
    isMintPriceLoading ||
    isPriceLoading ||
    isMintPriceConstLoading ||
    isGetMintPriceLoading;

  const {
    isSuccess: isTxSuccess,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Calculate total cost
  const totalCost = contractPrice
    ? (Number(formatEther(contractPrice)) * amount).toString()
    : "0";

  // Reset error when step changes
  React.useEffect(() => {
    if (step !== "error") {
      setError("");
    }
  }, [step]);

  // Handle transaction success
  React.useEffect(() => {
    if (writeError) {
      if (
        writeError.message.toLowerCase().includes("user rejected the request")
      ) {
        handleClose();
        return;
      }
      setStep("error");
      setError(writeError.message);
      onMintError?.(writeError.message);
    }
    if (isTxError && txError) {
      setStep("error");
      setError(txError.message);
      onMintError?.(txError.message);
    }
    if (isTxSuccess && writeData) {
      setStep("success");
      setTxHash(writeData);
      onMintSuccess?.(writeData);
    }
  }, [
    isTxSuccess,
    writeData,
    onMintSuccess,
    isTxError,
    txError,
    onMintError,
    writeError,
  ]);

  // Handle writeContract data update
  React.useEffect(() => {
    if (writeData && step === "waiting") {
      setTxHash(writeData);
    }
  }, [writeData, step]);

  const handleInitialMint = () => {
    if (!isSDKLoaded) {
      setError("Farcaster SDK not loaded");
      setStep("error");
      setIsSheetOpen(true);
      return;
    }
    setStep("sheet");
    setIsSheetOpen(true);
  };

  const handleConnectWallet = async () => {
    try {
      setStep("connecting");
      const connector = farcasterFrame();
      connect({ connector });
      // Connection handled by wagmi hooks
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect wallet";

      // For other errors, show error state
      setError(errorMessage);
      setStep("error");
    }
  };

  const handleMint = async () => {
    if (!isConnected) {
      await handleConnectWallet();
      return;
    }

    if (contractPrice === undefined) {
      setError("Could not fetch mint price from contract");
      setStep("error");
      return;
    }

    try {
      setStep("minting");

      // Simple mint function call - adjust ABI based on your NFT contract
      writeContract({
        address: contractAddress,
        abi: [
          {
            name: "mint",
            type: "function",
            inputs: [{ name: "amount", type: "uint256" }],
            outputs: [],
            stateMutability: "payable",
          },
        ] as const,
        functionName: "mint",
        args: [BigInt(amount)],
        value: contractPrice * BigInt(amount),
        chainId,
      });

      // Transaction initiated, will be handled by wagmi hooks
      setStep("waiting");
    } catch (err) {
      console.error("Mint failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Mint transaction failed";

      // Check if user rejected
      if (err instanceof Error && err.name === "UserRejectedRequestError") {
        handleClose(); // Close the sheet on user rejection
        return;
      }

      // For other errors, show error state
      setError(errorMessage);
      setStep("error");
      onMintError?.(errorMessage);
    }
  };

  const handleClose = () => {
    setIsSheetOpen(false);
    setStep("initial");
    setError("");
    setTxHash("");
  };

  const handleRetry = () => {
    setError("");
    setStep("sheet");
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
        disabled={disabled || !isSDKLoaded}
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
            {step === "sheet" && "Mint NFT"}
            {step === "connecting" && "Connecting Wallet"}
            {step === "minting" && "Preparing Mint"}
            {step === "waiting" && "Minting..."}
            {step === "success" && "Mint Successful!"}
            {step === "error" && "Mint Failed"}
          </SheetTitle>
        </SheetHeader>

        {/* Step 2: Sheet Content */}
        {step === "sheet" && (
          <div className="space-y-6">
            <div className="space-y-4">
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
                <span className="font-semibold">
                  {isLoadingPrice
                    ? "Loading..."
                    : contractPrice === BigInt(0)
                      ? "0 ETH"
                      : contractPrice
                        ? `${Number(formatEther(contractPrice)).toFixed(4)} ETH`
                        : "Error loading price"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 text-lg font-semibold">
                <span>Total Cost</span>
                <span>{totalCost} ETH</span>
              </div>
            </div>

            <Button
              onClick={isConnected ? handleMint : handleConnectWallet}
              size="lg"
              className="w-full"
              disabled={isWritePending}
            >
              {isConnected ? (
                <>
                  <Coins className="h-5 w-5 mr-2" />
                  Mint {amount} NFT{amount > 1 ? "s" : ""}
                </>
              ) : (
                "Connect Wallet to Mint"
              )}
            </Button>
          </div>
        )}

        {/* Step 3: Connecting */}
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

        {/* Step 3/4: Minting */}
        {step === "minting" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <div>
              <p className="font-semibold">Preparing mint transaction</p>
              <p className="text-sm text-muted-foreground">
                Please approve the transaction in your wallet
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Waiting for Transaction */}
        {step === "waiting" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <div>
              <p className="font-semibold">Transaction submitted</p>
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

        {/* Step 5: Success */}
        {step === "success" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div>
              <p className="font-semibold text-green-600">Mint successful!</p>
              <p className="text-sm text-muted-foreground">
                Your {amount} NFT{amount > 1 ? "s have" : " has"} been minted
                successfully
              </p>
              {txHash && (
                <p className="text-xs font-mono mt-2 px-3 py-1 bg-muted rounded">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              )}
            </div>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}

        {/* Error State */}
        {step === "error" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <div>
              <p className="font-semibold text-red-600">Mint failed</p>
              <p className="text-sm text-muted-foreground">
                {error || "An unexpected error occurred"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Close
              </Button>
              <Button onClick={handleRetry} className="flex-1">
                Try Again
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
