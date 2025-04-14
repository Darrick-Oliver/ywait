import { YoutubeVideoData } from "@/types/youtube-video-data";
import { createWithEqualityFn as create } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { SupportedContainerFormat } from "@/constants/containers";

type DownloadOptions = {
  destination?: string;
  fileName?: string;
  videoFormat?: string;
  audioFormat?: string;
  outputFormat?: SupportedContainerFormat;
};

type DownloadData = {
  url?: string;
  data?: YoutubeVideoData;
  isFetching?: boolean;
  isDownloading?: boolean;
};

type GlobalState = {
  downloadData: DownloadData;
  downloadOptions: DownloadOptions;
  updateDownloadData: (update: Partial<DownloadData>) => void;
  updateDownloadOptions: (update: Partial<DownloadOptions>) => void;
};

export const useGlobalStore = create<GlobalState>(
  (set) => ({
    downloadData: {},
    downloadOptions: {},
    updateDownloadData: (update) =>
      set(({ downloadData }) => ({
        downloadData: { ...downloadData, ...update },
      })),
    updateDownloadOptions: (update) =>
      set(({ downloadOptions }) => ({
        downloadOptions: { ...downloadOptions, ...update },
      })),
  }),
  shallow
);
