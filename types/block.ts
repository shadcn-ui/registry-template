import { SVGProps } from "react";
import React from "react";

export type IconProps = SVGProps<SVGSVGElement>

export type Block = {
  id: string;
  title: string;
  description: string;
  provider: {
    name: string;
    url: string;
    icon: string;
  };
  files?: { path: string; content?: string; type?: string }[];
};

