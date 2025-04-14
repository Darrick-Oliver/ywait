import { useGlobalStore } from "@/stores/global";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo } from "react";
import { readableFileSize } from "@/utils/file-size";
import {
  compatibleVideoCodecs,
  isSupportedVideoCodec,
} from "@/constants/codecs";

export const VideoFormatSelector = () => {
  const {
    downloadData: { data, isDownloading },
    downloadOptions: { videoFormat, outputFormat },
    updateDownloadOptions,
  } = useGlobalStore();

  const videoFormats = useMemo(
    () =>
      data?.formats
        .filter(({ video_ext, filesize }) => video_ext !== "none" && !!filesize)
        .filter(({ vcodec }) => {
          const codec = vcodec.match(/^[^\.]*/)?.[0] ?? vcodec;

          return (
            isSupportedVideoCodec(codec) &&
            outputFormat &&
            compatibleVideoCodecs[outputFormat].includes(codec)
          );
        })
        .reverse(),
    [data, outputFormat]
  );

  const updateVideoFormat = (videoFormat?: string) =>
    updateDownloadOptions({ videoFormat });

  useEffect(() => {
    if (
      videoFormats &&
      !videoFormats.find(({ format_id }) => format_id === videoFormat)
    ) {
      updateVideoFormat(videoFormats.at(0)?.format_id);
    }
  }, [videoFormats]);

  return (
    <Select
      value={videoFormat}
      onValueChange={updateVideoFormat}
      disabled={!data || isDownloading}
    >
      <SelectTrigger>
        <SelectValue placeholder="—" />
      </SelectTrigger>
      <SelectContent>
        {videoFormats?.map(({ format_id, vcodec, filesize, format_note }) => (
          <SelectItem value={format_id}>
            {format_note} — {readableFileSize(filesize ?? 0)} (
            {vcodec.match(/^[^\.]*/)?.[0]})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
