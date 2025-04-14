import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useListen } from "@/hooks/use-listen";
import { useFetchData } from "@/hooks/use-fetch-data";
import { LoaderCircle, Settings2 } from "lucide-react";
import { useGlobalStore } from "@/stores/global";
import { DownloadOptions } from "@/components/download-options";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppSettings } from "@/stores/app-settings";

type DownloadStats = {
  percentage: string;
  speed: string;
  eta: string;
};

type Action = "DOWNLOADING_AUDIO" | "DOWNLOADING_VIDEO" | "MERGING";

const matchDownload = (payload: string) =>
  payload.match(
    /^\[download\]\s+(\d+\.\d+%)\s+of\s+[\d.]+MiB\s+at\s+([\d.]+MiB\/s)\s+ETA\s+([\d:]+)/
  );

const matchDestination = (payload: string) =>
  payload.match(/^\[Merger\]\s+Merging\s+formats\s+into\s+\"(.*)\"/);

const matchActionStart = (payload: string) =>
  payload.match(/^\[download\]\s+Destination:\s+(.*)/);

export const Home = () => {
  const [url, setUrl] = useState("");
  const [finalUrl, setFinalUrl] = useState("");
  const [stats, setStats] = useState<DownloadStats>();
  const [downloadedFilePath, setDownloadedFilePath] = useState<string>();
  const [currentAction, setCurrentAction] = useState<Action>();
  const {
    downloadData: { data, isFetching, isDownloading },
    downloadOptions: {
      destination,
      videoFormat,
      audioFormat,
      outputFormat,
      fileName,
    },
    updateDownloadData,
    updateDownloadOptions,
  } = useGlobalStore();
  const { appSettings } = useAppSettings();

  useFetchData(finalUrl);

  const reset = () => {
    updateDownloadData({ isDownloading: false });
    setStats(undefined);
    setCurrentAction(undefined);
  };

  const startDownload = () => {
    updateDownloadData({ isDownloading: true });
    setDownloadedFilePath(undefined);
    setCurrentAction(undefined);
    invoke("start_download", {
      url,
      settings: {
        destination,
        video_format: videoFormat,
        audio_format: audioFormat,
        output_format: outputFormat,
        file_name: fileName,
      },
    });
  };

  useListen<string>("yt-dlp-output", ({ payload }) => {
    let match;
    if ((match = matchDownload(payload))) {
      const [_, percentage, speed, eta] = match;
      setStats({ percentage, speed, eta });
    } else if ((match = matchDestination(payload))) {
      const [_, path] = match;
      setDownloadedFilePath(path);
      setCurrentAction("MERGING");
    } else if ((match = matchActionStart(payload))) {
      setCurrentAction((ca) =>
        ca === undefined
          ? "DOWNLOADING_VIDEO"
          : ca === "DOWNLOADING_VIDEO"
          ? "DOWNLOADING_AUDIO"
          : undefined
      );
    } else if (payload === "end") {
      reset();
    }
  });

  useListen<string>("yt-dlp-error", ({ payload }) => {
    console.error(payload);
    if (!payload.match(/^ERROR/)) return;

    reset();
    toast("Error", {
      description: payload,
    });
  });

  useEffect(() => {
    if (downloadedFilePath) {
      toast("Video has been downloaded", {
        action: {
          label: "Go to file",
          onClick: () => invoke("show_in_folder", { path: downloadedFilePath }),
        },
      });
    }
  }, [downloadedFilePath]);

  useEffect(() => {
    updateDownloadOptions({
      destination: appSettings.videoFolder,
      outputFormat: appSettings.defaultVideoOutputFormat,
    });
  }, [appSettings]);

  return (
    <div className="flex size-full flex-col items-center space-y-4">
      <div className="space-y-2 text-center">
        <Text type="h1">ywait</Text>
        <Text type="h4">a yt-dlp GUI</Text>
      </div>
      <div className="flex flex-col w-full items-start max-w-xl space-y-2">
        <div className="flex flex-row w-full items-end space-x-2">
          <div className="w-full items-center space-y-2">
            <Label htmlFor="url">Video URL</Label>
            <Input
              type="url"
              placeholder="e.g. https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.currentTarget.value)}
              onBlur={() => setFinalUrl(url)}
            />
          </div>
          <Dialog>
            <DialogTrigger>
              <Button variant="outline">
                <Settings2 />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Options</DialogTitle>
              </DialogHeader>
              <DownloadOptions />
            </DialogContent>
          </Dialog>
          <Button onClick={startDownload} disabled={!data || isDownloading}>
            Download{" "}
            {(isFetching || isDownloading) && (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
        </div>
        {data && (
          <Text className="text-gray-400 text-xs">
            {data.title} - {data.uploader}
          </Text>
        )}
        <div className="flex flex-col w-full">
          {currentAction && (
            <Text>
              {currentAction === "DOWNLOADING_AUDIO"
                ? "Downloading audio..."
                : currentAction === "DOWNLOADING_VIDEO"
                ? "Downloading video..."
                : "Merging..."}
            </Text>
          )}
          {stats && <Progress value={Number(stats.percentage.slice(0, -1))} />}
        </div>
      </div>

      <Toaster />
    </div>
  );
};
