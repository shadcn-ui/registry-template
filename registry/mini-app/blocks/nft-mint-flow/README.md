# Universal NFT Mint Flow

A smart NFT minting component that automatically detects the provider (Manifold, OpenSea, Zora, or generic) and handles all the complexity of minting, including ERC20 payments and approvals.

## Features

- 🔍 **Auto-detection**: Automatically detects NFT contract type and provider
- 💰 **Multi-payment**: Supports both ETH and ERC20 token payments
- ✅ **Smart validation**: Shows clear errors for missing parameters
- 🔄 **Approval handling**: Manages ERC20 approval flows seamlessly
- 📱 **Farcaster native**: Built for Farcaster mini apps with frame SDK integration

## Usage

### Basic Usage (Auto-detect everything)

```tsx
import { NFTMintFlow } from "@/registry/mini-app/blocks/nft-mint-flow/nft-mint-flow";

export function MyComponent() {
  return (
    <NFTMintFlow
      contractAddress="0x1234..."
      chainId={8453} // Base
      onMintSuccess={(txHash) => console.log("Minted!", txHash)}
    />
  );
}
```

**Important**: The mint flow opens in a Sheet component that appears as:
- Full-screen modal on mobile devices
- Side sheet on desktop
- Always rendered at the app root level (not inside your component)

This ensures consistent UX regardless of where you place the button.

### Manifold NFT with Instance ID

```tsx
<NFTMintFlow
  contractAddress="0x1234..."
  chainId={8453}
  provider="manifold" // Optional hint for faster detection
  manifoldParams={{
    instanceId: "1", // Required for Manifold
    tokenId: "5"     // Optional, used if instanceId not provided
  }}
  buttonText="Mint Manifold NFT"
/>
```

### Generic NFT with Multiple Quantity

```tsx
<NFTMintFlow
  contractAddress="0x5678..."
  chainId={1} // Mainnet
  amount={3}  // Mint 3 NFTs
  buttonText="Mint 3 NFTs"
/>
```

### With Custom Styling

```tsx
<NFTMintFlow
  contractAddress="0x9abc..."
  chainId={8453}
  variant="outline"
  size="lg"
  className="w-full max-w-md"
  buttonText="Start Minting"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `contractAddress` | `Address` | required | NFT contract address |
| `chainId` | `number` | required | Chain ID (1 for mainnet, 8453 for Base) |
| `provider` | `"manifold" \| "opensea" \| "zora" \| "generic"` | auto-detect | Provider hint for faster detection |
| `amount` | `number` | 1 | Number of NFTs to mint |
| `manifoldParams` | `{ instanceId?: string, tokenId?: string }` | - | Manifold-specific parameters |
| `buttonText` | `string` | "Mint NFT" | Button label |
| `variant` | `ButtonVariant` | "default" | Button style variant |
| `size` | `ButtonSize` | "default" | Button size |
| `className` | `string` | - | Additional CSS classes |
| `disabled` | `boolean` | false | Disable the button |
| `onMintSuccess` | `(txHash: string) => void` | - | Success callback |
| `onMintError` | `(error: string) => void` | - | Error callback |

## How It Works

1. **Detection Phase**: When clicked, the component detects:
   - Contract type (ERC721/ERC1155)
   - Provider (Manifold extensions, OpenSea, etc.)
   - Payment method (ETH or ERC20)
   - Required parameters

2. **Validation**: Shows clear errors if:
   - Missing required parameters (e.g., instanceId for Manifold)
   - Merkle proof required (not yet supported)
   - Invalid contract or network

3. **Price Discovery**: Optimized RPC calls to fetch:
   - Mint price (tries multiple function names)
   - ERC20 token details if applicable
   - Total costs including fees

4. **Approval Flow**: For ERC20 payments:
   - Checks current allowance
   - Shows approval step if needed
   - Approves exact amount required

5. **Minting**: Executes the mint transaction with proper parameters

## Error Handling

The component provides clear, actionable error messages:

- "Manifold NFTs require either instanceId or tokenId"
- "This NFT requires a merkle proof - not supported yet"
- "Failed to detect NFT contract type"
- "ERC20 approval required for [TOKEN] payment"

## Provider Support

### Currently Supported
- ✅ **Manifold**: Full support including ERC20 payments
- ✅ **Generic**: Standard mint() functions with price discovery

### Coming Soon
- 🚧 **OpenSea**: Seadrop contracts
- 🚧 **Zora**: Zora protocol contracts
- 🚧 **Merkle proofs**: For allowlist minting

## For LLMs / Code Generation

When using this component:

1. **Minimum required**: Just `contractAddress` and `chainId`
2. **For Manifold**: Add `manifoldParams.instanceId`
3. **For multiple mints**: Set `amount` prop
4. **Let auto-detection work**: Don't specify provider unless certain
5. **Handle callbacks**: Use `onMintSuccess` for post-mint actions