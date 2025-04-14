import { useGlobalStore } from "@/stores/global";
import { useListen } from "./use-listen";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export const useFetchData = (url?: string) => {
  const {
    downloadData: { url: dataUrl, isFetching },
    updateDownloadData,
  } = useGlobalStore();
  const [urlFetching, setUrlFetching] = useState(url);

  useEffect(() => {
    if (url && !isFetching && url !== dataUrl) {
      invoke("retrieve_video_data", {
        url,
      });

      updateDownloadData({ data: undefined, url: undefined, isFetching: true });
      setUrlFetching(url);
    }

    if (url === "") {
      updateDownloadData({
        data: undefined,
        url: undefined,
        isFetching: false,
      });
    }
  }, [url]);

  useListen<string>("yt-dlp-video-data", ({ payload }) => {
    updateDownloadData({
      url: urlFetching,
      data: JSON.parse(payload),
      isFetching: false,
    });
    setUrlFetching(undefined);
  });
};
