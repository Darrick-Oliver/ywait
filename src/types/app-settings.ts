import { SupportedContainerFormat } from "@/constants/containers";

export type AppSettings = {
  videoFolder?: string;
  defaultVideoOutputFormat?: SupportedContainerFormat;
  defaultFileName?: string;
};
