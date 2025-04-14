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
  compatibleAudioCodecs,
  isSupportedAudioCodec,
} from "@/constants/codecs";

export const AudioFormatSelector = () => {
  const {
    downloadData: { data, isDownloading },
    downloadOptions: { audioFormat, outputFormat },
    updateDownloadOptions,
  } = useGlobalStore();

  const audioFormats = useMemo(
    () =>
      data?.formats
        .filter(({ audio_ext, filesize }) => audio_ext !== "none" && !!filesize)
        .filter(({ acodec }) => {
          const codec = acodec.match(/^[^\.]*/)?.[0] ?? acodec;

          return (
            isSupportedAudioCodec(codec) &&
            outputFormat &&
            compatibleAudioCodecs[outputFormat].includes(codec)
          );
        })
        .reverse(),
    [data, outputFormat]
  );

  const updateAudioFormat = (audioFormat?: string) =>
    updateDownloadOptions({ audioFormat });

  useEffect(() => {
    if (
      audioFormats &&
      !audioFormats.find(({ format_id }) => format_id === audioFormat)
    ) {
      updateAudioFormat(audioFormats.at(0)?.format_id);
    }
  }, [audioFormat, audioFormats]);

  return (
    <Select
      value={audioFormat}
      onValueChange={updateAudioFormat}
      disabled={!data || isDownloading}
    >
      <SelectTrigger>
        <SelectValue placeholder="—" />
      </SelectTrigger>
      <SelectContent>
        {audioFormats?.map(({ format_id, acodec, filesize, format_note }) => (
          <SelectItem value={format_id}>
            {format_note} — {readableFileSize(filesize ?? 0)} (
            {acodec.match(/^[^\.]*/)?.[0]})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
