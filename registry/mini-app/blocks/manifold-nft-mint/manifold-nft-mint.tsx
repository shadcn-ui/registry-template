"use client";

import * as React from "react";
import { Button } from "@/registry/mini-app/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/registry/mini-app/ui/sheet";
import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";
import { useAccount, useConnect, useWriteContract} from "wagmi";
import { formatEther, type Address } from "viem";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { Coins, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Claim, getNftDetails } from "./config";
import { getPublicClient } from "@/registry/mini-app/lib/chains";
import { ERC20_ABI, MANIFOLD_EXTENSION_ABI } from "@/registry/mini-app/lib/nft-standards";

type ManifoldNFTMintFlowProps = {
  chainId: number;
  contractAddress: Address;
  instanceId?: string;
  tokenId?: string;
  className?: string;
  variant?: "default" | "destructive" | "secondary" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  buttonText?: string;
  disabled?: boolean;
  onMintSuccess?: (txHash: string) => void;
  onMintError?: (error: string) => void;
};

type MintStep = "initial" | "approve" | "sheet" | "connecting" | "minting" | "waiting" | "success" | "error" | "warning";

export type Config = {
  contractAddress: Address;
  instanceId: string;
  chainId: number;
  tokenId: bigint;
  claim: Claim;
  extenstionContractAddress: Address;
  erc20ContractAddress?: Address;
  erc20Decimals?: number;
  erc20Symbol?: string;
  mintFee?: string;
}

export function ManifoldNFTMint({
  chainId,
  contractAddress,
  instanceId,
  tokenId,
  className,
  variant = "default",
  size = "default",
  buttonText = "Mint NFT",
  disabled = false,
  onMintSuccess,
  onMintError,
}: ManifoldNFTMintFlowProps) {
  const [step, setStep] = React.useState<MintStep>("initial");
  const [error, setError] = React.useState<string>("");
  const [txHash, setTxHash] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const { isSDKLoaded } = useMiniAppSdk();
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { writeContractAsync , isError, error: writeContractError} = useWriteContract();

  const [config, setConfig] = React.useState<Config | undefined>(undefined);
  const [mintfee, setMintFee] = React.useState<string>("");
 

  // Reset error when step changes
  React.useEffect(() => {
    if (step !== "error" && step !== "warning") {
      setError("");
    }
    if(isError){
      if(writeContractError.message.includes("User rejected the request")){
        setIsLoading(false);
        setIsSheetOpen(false);
        onMintError?.("User rejected the request");
        return;
      }
      setError(writeContractError.message || "Could not mint");
      setStep("error");
      onMintError?.(writeContractError.message || "Could not mint");
    }
  }, [step, isError, error, onMintError, writeContractError]);

  const handleInitialMint = async () => {
    setIsLoading(true);
    if (!isSDKLoaded) {
      setError("Farcaster SDK not loaded");
      setStep("error");
      setIsSheetOpen(true);
      return;
    }
    try{
      const config = await getNftDetails(contractAddress, instanceId as string, tokenId as string, chainId);
      setConfig(config);
      if(config.claim?.erc20 !== "0x0000000000000000000000000000000000000000"){
        await checkAllowance();
        
        setMintFee(formatEther(BigInt(config.mintFee || "0")));
      }else{
        const mintFee = formatEther(BigInt(config.mintFee || "0"))+formatEther(BigInt(config.claim?.cost || "0"));
        setMintFee(mintFee);
        setStep("sheet");
      }

      if(config.claim?.merkleRoot !== "0x0000000000000000000000000000000000000000000000000000000000000000"){
        setError("This NFT requires a merkle proof to mint. We are not supporting this yet.");
        setStep("warning");
        setIsLoading(false);
        setIsSheetOpen(true);
        return;
      }
    } catch (err) {
      console.error("Failed to get NFT details:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to get NFT details";
      setError(errorMessage);
      setStep("error");
      setIsLoading(false);
    } finally {
    setIsSheetOpen(true);
    }
  };

  const handleConnectWallet = React.useCallback(async () => {
    try {
      setStep("connecting");
      const connector = farcasterFrame();
      connect({ connector });
 
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet";
      
      // For other errors, show error state
      setError(errorMessage);
      setStep("error");
    }
  }, [connect]);

  const checkAllowance = React.useCallback(async () => {
    if(!isConnected){
      await handleConnectWallet();
      return;
    }
    if (!config?.claim?.erc20) {
      setError("ERC20 contract not found");
      setStep("error");
      setIsLoading(false);
      return;
    }
    if(!config.claim?.cost){
      setError("Cost not found");
      setStep("error");
      setIsLoading(false);
      return;
    }
    try {
      const publicClient = getPublicClient(chainId);
      const allowance = await publicClient.readContract({
        address: config.claim?.erc20,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [address as Address, config.contractAddress],
      });
      if(allowance < BigInt(config.claim?.cost)){
        setStep("approve");
      }else{
        setStep("sheet");
      }
    } catch (err) {
      console.error("Error checking allowance:", err);
      setError("Could not check allowance");
      setStep("error");
      setIsLoading(false);
    }
  }, [isConnected, config, chainId, address, handleConnectWallet]);


  React.useEffect(() => {
    if(isConnected){
      if(config){
        checkAllowance();
    }else{
      setIsSheetOpen(false);
    }
    }
  }, [isConnected, config, checkAllowance]);


  const handleApprove = async () => {
    if (!isConnected) {
      await handleConnectWallet();
      return;
    }
    setIsLoading(true);
    if(!config || !config.claim?.cost){
      setError("Could not approve");
      setStep("error");
      setIsLoading(false);
      return;
    }
    
    try {
      const approveTx = await writeContractAsync({
        address: config.erc20ContractAddress as Address,
        abi: ERC20_ABI,
        functionName: "approve",
        // Use the exact amount needed for this mint
        args: [config.contractAddress, BigInt(config.claim?.cost)], // spender, exact amount
        chainId: config.chainId,
      });
      setTxHash(approveTx);
      setStep("sheet");
    } catch (err) {
      console.error("Error approving:", err);
      setError("Could not approve");
      setStep("error");
    } finally {
      setIsLoading(false);
    }   
  }

  
  const handleMint = async () => {
    if (!isConnected) {
      await handleConnectWallet();
      return;
    }
    setIsLoading(true);
    if(!config){
      setError("Could not fetch NFT details");
      setStep("error");
      setIsLoading(false);
      return;
    }

    if(!config.mintFee){
      setError("Could not fetch mint fee");
      setStep("error");
      setIsLoading(false);
      return;
    }
    try{
      
      await checkAllowance();
      let mintTx: string | undefined;
      if(config.claim?.erc20 === "0x0000000000000000000000000000000000000000"){
      setStep("minting");
      const mintFees = BigInt(config.mintFee)+BigInt(config.claim?.cost);
      mintTx = await writeContractAsync({
        address: config.extenstionContractAddress,
        abi: MANIFOLD_EXTENSION_ABI,
        functionName: "mint",
        args: [config.contractAddress, BigInt(config.instanceId), Number(config.tokenId), [], address as Address],
        chainId: config.chainId,
        value: mintFees,
      });
      setTxHash(mintTx);
    }else{
      setStep("minting");
      const mintFees = BigInt(config.mintFee);
      mintTx = await writeContractAsync({
        address: config.extenstionContractAddress,
        abi: MANIFOLD_EXTENSION_ABI,
        functionName: "mint",
        args: [config.contractAddress, BigInt(config.instanceId), Number(config.tokenId), [], address as Address],
        chainId: config.chainId,
        value: mintFees,
      });
    }
    setTxHash(mintTx);
    if(mintTx){
      setStep("success");
      onMintSuccess?.(mintTx);
    }else{
      setError("Could not mint");
      setStep("error");
      onMintError?.("Could not mint");
    }
  } catch (err) {
    console.error("Error minting:", err);
    if(err instanceof Error){
      setError(err.message);
    }else{
      setError("Could not mint");
    }
    setStep("error");
    onMintError?.("Could not mint");
  } finally {
    setIsLoading(false);
    setIsSheetOpen(false);
  }
  };

  const handleClose = () => {
    setIsSheetOpen(false);
    setStep("initial");
    setError("");
    setTxHash("");
    setIsLoading(false);
  };

  const handleRetry = () => {
    setError("");
    setStep("sheet");
    setIsLoading(false);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={(open) => {
      setIsSheetOpen(open);
      if (!open) {
        handleClose();
      }
    }}>
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

      <SheetContent side="bottom">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {step === "sheet" && "Mint NFT"}
            {step === "connecting" && "Connecting Wallet"}
            {step === "minting" && "Preparing Mint"}
            {step === "waiting" && "Minting..."}
            {step === "success" && "Mint Successful!"}
            {step === "error" && "Mint Failed"}
            {step === "warning" && "Warning"}
          </SheetTitle>
        </SheetHeader>

        {step === "approve" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Contract</span>
                <span className="font-mono text-sm">
                  {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Price per NFT</span>
                <span className="font-semibold">
                  {config?.claim ? Number(Number(config?.claim?.cost)) / 10 ** (config?.erc20Decimals || 18) : "0"} {config?.erc20Symbol}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 text-lg font-semibold">
                <span>Total Cost</span>
                <span>{config?.claim ? Number(Number(config?.claim?.cost)) / 10 ** (config?.erc20Decimals || 18) : "0"} {config?.erc20Symbol}</span>
              </div>
            </div>
            
            <Button
              onClick={handleApprove}
              size="lg"
              className="w-full"
              
            >
              
                  <Coins className="h-5 w-5 mr-2" />
                  Approve {config?.erc20Symbol}
                
              
            </Button>
          </div>
        )}

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
                <span className="text-muted-foreground">Mint Price</span>
                <span className="font-semibold">
                  { config?.claim ? Number(Number(config?.claim?.cost)) / 10 ** (config?.erc20Decimals || 18) : "0"} {config?.erc20Symbol}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 text-lg font-semibold">
                <span>Mint Fee</span>
                <span>{mintfee} ETH</span>
              </div>
            </div>
            
            <Button
              onClick={isConnected ? handleMint : handleConnectWallet}
              size="lg"
              className="w-full"
              disabled={isConnected ? false : true || isLoading}
            >
              {isConnected ? (
                <>
                  <Coins className="h-5 w-5 mr-2" />
                  Mint 
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
                Your NFT has been minted successfully
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
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Close
              </Button>
              <Button onClick={handleRetry} className="flex-1">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Warning State */}
        {step === "warning" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="h-12 w-12 text-yellow-500" />
            </div>
            <div>
              <p className="font-semibold text-yellow-600">Warning</p>
              <p className="text-sm text-muted-foreground">
                {error || "An unexpected error occurred"}
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
} 