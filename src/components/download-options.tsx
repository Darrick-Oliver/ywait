import { PropsWithChildren, useEffect } from "react";
import { Button } from "./ui/button";
import { FolderOpen } from "lucide-react";
import { open } from "@tauri-apps/plugin-dialog";
import { Text } from "./ui/text";
import { VideoFormatSelector } from "./video-format-selector";
import { useGlobalStore } from "@/stores/global";
import { AudioFormatSelector } from "./audio-format-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  SupportedContainerFormat,
  supportedContainerFormats,
} from "@/constants/containers";
import { showInFolder } from "@/utils/folder";
import { Input } from "./ui/input";

export const DownloadOptions = () => {
  const {
    downloadData: { data, isFetching },
    downloadOptions: { destination, outputFormat, fileName },
    updateDownloadOptions,
  } = useGlobalStore();

  const selectDestinationHandler = async () => {
    const path =
      (await open({
        directory: true,
        multiple: false,
      })) || undefined;
    updateDownloadOptions({ destination: path });
  };

  const updateOutputFormat = (outputFormat: SupportedContainerFormat) =>
    updateDownloadOptions({ outputFormat });

  useEffect(() => {
    if (isFetching || !data) {
      updateDownloadOptions({
        videoFormat: undefined,
        audioFormat: undefined,
      });
    }
  }, [isFetching, data]);

  return (
    <div className="p-4 border-t space-y-2">
      <SettingRow label="Output destination">
        <div className="flex flex-row items-center">
          {destination && (
            <Button variant="link" onClick={() => showInFolder(destination)}>
              {destination}
            </Button>
          )}
          <Button variant="secondary" onClick={selectDestinationHandler}>
            <FolderOpen />
          </Button>
        </div>
      </SettingRow>
      <SettingRow label="File name">
        <Input
          value={fileName}
          onChange={(event) =>
            updateDownloadOptions({
              fileName: event.currentTarget.value || undefined,
            })
          }
          placeholder="%(title)s.%(ext)s"
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          className="w-[40%]"
        />
      </SettingRow>
      <SettingRow label="Output format">
        <Select value={outputFormat} onValueChange={updateOutputFormat}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {supportedContainerFormats?.map((format) => (
              <SelectItem key={format} value={format}>
                {format}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow label="Video format">
        <VideoFormatSelector />
      </SettingRow>
      <SettingRow label="Audio format">
        <AudioFormatSelector />
      </SettingRow>
    </div>
  );
};

interface SettingsRowProps extends PropsWithChildren {
  label: string;
}

const SettingRow = ({ label, children }: SettingsRowProps) => (
  <div className="flex flex-row w-full items-center justify-between">
    <Text>{label}</Text>
    {children}
  </div>
);
