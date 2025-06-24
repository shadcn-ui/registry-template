import { parseAbi, type Address } from "viem";

/**
 * Common NFT contract ABIs and standards
 */

// Standard ERC721 functions
export const ERC721_ABI = {
  full: parseAbi([
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function balanceOf(address owner) view returns (uint256)",
    "function totalSupply() view returns (uint256)",
  ]),
  
  // Individual functions for specific use cases
  tokenURI: parseAbi(["function tokenURI(uint256 tokenId) view returns (string)"]),
  name: parseAbi(["function name() view returns (string)"]),
  symbol: parseAbi(["function symbol() view returns (string)"]),
  ownerOf: parseAbi(["function ownerOf(uint256 tokenId) view returns (address)"]),
};

// Common price discovery functions across NFT contracts
export const PRICE_DISCOVERY_ABI = parseAbi([
  "function mintPrice() view returns (uint256)",
  "function price() view returns (uint256)",
  "function MINT_PRICE() view returns (uint256)",
  "function getMintPrice() view returns (uint256)",
  "function publicMintPrice() view returns (uint256)",
]);

// Common mint functions
export const MINT_ABI = parseAbi([
  "function mint(uint256 amount) payable",
  "function mint(address to, uint256 amount) payable",
  "function publicMint(uint256 amount) payable",
  "function mintTo(address to, uint256 amount) payable",
]);

// Manifold specific ABIs
export const MANIFOLD_ABI = {
  // Contract detection
  detection: parseAbi([
    "function getExtensions() view returns (address[])",
  ]),
  
  // Extension functions
  extension: {
    tokenURI: parseAbi([
      "function tokenURI(address creatorContractAddress, uint256 tokenId) view returns (string uri)",
    ]),
    
    getClaim: [
      {
        inputs: [
          { name: "creatorContractAddress", type: "address" },
          { name: "instanceId", type: "uint256" }
        ],
        name: "getClaim",
        outputs: [
          {
            components: [
              { name: "total", type: "uint32" },
              { name: "totalMax", type: "uint32" },
              { name: "walletMax", type: "uint32" },
              { name: "startDate", type: "uint48" },
              { name: "endDate", type: "uint48" },
              { name: "storageProtocol", type: "uint8" },
              { name: "merkleRoot", type: "bytes32" },
              { name: "location", type: "string" },
              { name: "tokenId", type: "uint256" },
              { name: "cost", type: "uint256" },
              { name: "paymentReceiver", type: "address" },
              { name: "erc20", type: "address" },
              { name: "signingAddress", type: "address" }
            ],
            name: "claim",
            type: "tuple"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ] as const,
    
    getClaimForToken: [
      {
        inputs: [
          { name: "creatorContractAddress", type: "address" },
          { name: "tokenId", type: "uint256" }
        ],
        name: "getClaimForToken",
        outputs: [
          { name: "instanceId", type: "uint256" },
          {
            components: [
              { name: "total", type: "uint32" },
              { name: "totalMax", type: "uint32" },
              { name: "walletMax", type: "uint32" },
              { name: "startDate", type: "uint48" },
              { name: "endDate", type: "uint48" },
              { name: "storageProtocol", type: "uint8" },
              { name: "merkleRoot", type: "bytes32" },
              { name: "location", type: "string" },
              { name: "tokenId", type: "uint256" },
              { name: "cost", type: "uint256" },
              { name: "paymentReceiver", type: "address" },
              { name: "erc20", type: "address" },
              { name: "signingAddress", type: "address" }
            ],
            name: "claim",
            type: "tuple"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ] as const,
    
    mint: parseAbi([
      "function mint(address creatorContractAddress, uint256 instanceId, uint32 mintIndex, bytes32[] merkleProof, address mintFor) payable",
    ]),
    
    fees: parseAbi([
      "function MINT_FEE() view returns (uint256)",
      "function MINT_FEE_MERKLE() view returns (uint256)",
    ]),
  },
};

// ERC165 interface detection
export const ERC165_ABI = parseAbi([
  "function supportsInterface(bytes4 interfaceId) view returns (bool)",
]);

// Known contract addresses
export const KNOWN_CONTRACTS = {
  // Manifold extension contracts
  manifoldExtension: "0x26BBEA7803DcAc346D5F5f135b57Cf2c752A02bE" as Address,
  
  // Add other known contracts here as needed
} as const;

// Interface IDs for contract detection
export const INTERFACE_IDS = {
  ERC165: "0x01ffc9a7",
  ERC721: "0x80ac58cd",
  ERC1155: "0xd9b67a26",
  ERC721Metadata: "0x5b5e139f",
} as const;

// IPFS Gateway configuration
export const IPFS_GATEWAYS = {
  default: "https://ipfs.io/ipfs/",
  cloudflare: "https://cloudflare-ipfs.com/ipfs/",
  pinata: "https://gateway.pinata.cloud/ipfs/",
} as const;

/**
 * Convert IPFS URL to HTTP gateway URL
 */
export function ipfsToHttp(url: string, gateway: keyof typeof IPFS_GATEWAYS = 'default'): string {
  if (!url || !url.startsWith('ipfs://')) {
    return url;
  }
  
  return url.replace('ipfs://', IPFS_GATEWAYS[gateway]);
}

/**
 * Check if a contract is likely an NFT contract by checking interface support
 */
export async function isNFTContract(
  client: any,
  contractAddress: Address
): Promise<{ isNFT: boolean; type?: 'ERC721' | 'ERC1155' }> {
  try {
    // Try ERC165 supportsInterface
    const [supportsERC721, supportsERC1155] = await Promise.all([
      client.readContract({
        address: contractAddress,
        abi: ERC165_ABI,
        functionName: 'supportsInterface',
        args: [INTERFACE_IDS.ERC721],
      }).catch(() => false),
      client.readContract({
        address: contractAddress,
        abi: ERC165_ABI,
        functionName: 'supportsInterface',
        args: [INTERFACE_IDS.ERC1155],
      }).catch(() => false),
    ]);
    
    if (supportsERC721) return { isNFT: true, type: 'ERC721' };
    if (supportsERC1155) return { isNFT: true, type: 'ERC1155' };
    
    // Fallback: try to call name() function
    const name = await client.readContract({
      address: contractAddress,
      abi: ERC721_ABI.name,
      functionName: 'name',
    }).catch(() => null);
    
    return { isNFT: !!name };
  } catch {
    return { isNFT: false };
  }
}