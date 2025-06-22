import { DaimoPayTransferButton } from "@/registry/mini-app/blocks/daimo-pay-transfer/components/daimo-pay-transfer-button";
import { ShareCastButton } from "@/registry/mini-app/blocks/share-cast-button/share-cast-button";
import { AddMiniappButton } from "@/registry/mini-app/blocks/add-miniapp-button/add-miniapp-button";
import { ShowCoinBalance } from "@/registry/mini-app/blocks/show-coin-balance/show-coin-balance";
import { UserAvatar } from "@/registry/mini-app/blocks/avatar/avatar";
import { UserContext } from "@/registry/mini-app/blocks/user-context/user-context";
import { NFTCard } from "@/registry/mini-app/blocks/nft-card/nft-card";
import * as React from "react";
import { ProfileSearchSimulationDemo } from "@/registry/mini-app/blocks/profile-search/simulationHelper";
import { NFTMintExamples } from "@/components/nft-mint-examples";

export interface ComponentItem {
  title: string;
  component: React.ReactNode;
  installName: string;
}

export const componentItems: ComponentItem[] = [
  {
    title: "A simple token transfer button",
    component: (
      <DaimoPayTransferButton
        text="Donate $20 to Protocol Guild"
        toAddress="0x32e3C7fD24e175701A35c224f2238d18439C7dBC"
        amount="20"
      />
    ),
    installName: "daimo-pay-transfer-button",
  },
  {
    title: "Show Coin Balance",
    component: (
      <ShowCoinBalance
        defaultAddress="vitalik.eth"
        defaultTokenAddress="0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
      />
    ),
    installName: "show-coin-balance",
  },
  {
    title: "Share text and link in a cast",
    component: (
      <ShareCastButton
        text="Share hellno/mini-app-ui"
        url="https://hellno-mini-app-ui.vercel.app"
      />
    ),
    installName: "share-cast-button",
  },
  {
    title: "Add or pin a mini app",
    component: <AddMiniappButton />,
    installName: "add-miniapp-button",
  },
  {
    title: "User Avatar Component",
    component: (
      <div className="flex flex-wrap gap-4 justify-center">
        <UserAvatar useProfileData={true} size="sm" shape="circle" />
        <UserAvatar
          useProfileData={true}
          size="md"
          shape="square"
          clickable={true}
        />
        <UserAvatar useProfileData={true} size="lg" shape="rounded" />
        <UserAvatar useProfileData={true} size="xl" clickable={true} />
      </div>
    ),
    installName: "avatar",
  },
  {
    title: "User Context Display",
    component: (
      <div className="flex flex-col gap-4">
        <UserContext
          showAvatar={true}
          showUsername={true}
          showDisplayName={true}
          showFid={true}
          clickable={true}
        />
        <UserContext
          layout="vertical"
          avatarSize="lg"
          avatarShape="rounded"
          avatarClickable={true}
        />
      </div>
    ),
    installName: "user-context",
  },
  {
    title: "NFT Card Display",
    component: (
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-wrap gap-6 justify-center">
          <NFTCard
            contractAddress="0xe03ef4b9db1a47464de84fb476f9baf493b3e886"
            tokenId="1"
            width={200}
            height={200}
            rounded="lg"
            network="zora"
            titlePosition="outside"
            networkPosition="outside"
          />
          <NFTCard
            contractAddress="0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
            tokenId="1"
            width={200}
            height={200}
            rounded="xl"
            shadow={true}
            network="ethereum"
            titlePosition="outside"
            networkPosition="top-right"
          />
          <NFTCard
            contractAddress="0x60e4d786628fea6478f785a6d7e704777c86a7c6"
            tokenId="7789"
            width={200}
            height={200}
            rounded="lg"
            shadow={true}
            network="mainnet"
            customTitle="Mutant Ape #7789"
            titlePosition="outside"
            networkPosition="outside"
            className="mb-2"
          />
        </div>
        <div className="flex flex-wrap gap-8 justify-center mt-4">
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col items-center">
            <NFTCard
              contractAddress="0xed5af388653567af2f388e6224dc7c4b3241c544"
              tokenId="1"
              width={180}
              height={180}
              rounded="lg"
              shadow={true}
              network="ethereum"
              titlePosition="bottom"
              networkPosition="top-right"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Title inside card (bottom)
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col items-center">
            <NFTCard
              contractAddress="0x8a90cab2b38dba80c64b7734e58ee1db38b8992e"
              tokenId="1"
              width={180}
              height={180}
              rounded="lg"
              shadow={true}
              network="ethereum"
              titlePosition="top"
              networkPosition="bottom-right"
              layout="compact"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Title inside card (top)
            </p>
          </div>
        </div>
      </div>
    ),
    installName: "nft-card",
  },
  {
    title: "Profile Search Component",
    component: (
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <div>
          <ProfileSearchSimulationDemo />
        </div>
      </div>
    ),
    installName: "profile-search",
  },
  {
    title: "Universal NFT Mint Flow",
    component: <NFTMintExamples />,
    installName: "nft-mint-flow",
  },
];
