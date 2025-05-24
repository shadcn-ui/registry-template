import { DaimoPayTransferButton } from "@/registry/mini-app/blocks/daimo-pay-transfer/components/daimo-pay-transfer-button";
import { ShareCastButton } from "@/registry/mini-app/blocks/share-cast-button/share-cast-button";
import { AddMiniappButton } from "@/registry/mini-app/blocks/add-miniapp-button/add-miniapp-button";

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
];
