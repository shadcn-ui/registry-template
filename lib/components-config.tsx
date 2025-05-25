import { DaimoPayTransferButton } from "@/registry/mini-app/blocks/daimo-pay-transfer/components/daimo-pay-transfer-button";
import { ShareCastButton } from "@/registry/mini-app/blocks/share-cast-button/share-cast-button";
import { AddMiniappButton } from "@/registry/mini-app/blocks/add-miniapp-button/add-miniapp-button";
import { ShowCoinBalance } from "@/registry/mini-app/blocks/show-coin-balance/show-coin-balance";
import { UserAvatar } from "@/registry/mini-app/blocks/avatar/avatar";
import { UserContext } from "@/registry/mini-app/blocks/user-context/user-context";

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
        <UserAvatar useProfileData={true} size="md" shape="square" clickable={true} />
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
];
