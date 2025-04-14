import { Text } from "@/components/ui/text";
import { open } from "@tauri-apps/plugin-dialog";
import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { showInFolder } from "@/utils/folder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SupportedContainerFormat,
  supportedContainerFormats,
} from "@/constants/containers";
import { useAppSettings } from "@/stores/app-settings";

export const Settings = () => {
  const { appSettings, updateAppSettings } = useAppSettings();
  const { videoFolder, defaultVideoOutputFormat } = appSettings;

  const selectDestinationHandler = async () => {
    const path =
      (await open({
        directory: true,
        multiple: false,
      })) || undefined;
    updateAppSettings({ videoFolder: path });
  };

  const updateVideoOutputFormat = (
    defaultVideoOutputFormat: SupportedContainerFormat
  ) => updateAppSettings({ defaultVideoOutputFormat });

  return (
    <div className="flex size-full justify-center">
      <div className="flex flex-col max-w-xl w-full space-y-10">
        <div className="flex flex-col w-full items-start space-y-2">
          <SettingRow label="Video folder">
            <div className="flex flex-row items-center">
              {videoFolder && (
                <Button
                  variant="link"
                  onClick={() => showInFolder(videoFolder)}
                >
                  {videoFolder}
                </Button>
              )}
              <Button variant="outline" onClick={selectDestinationHandler}>
                <FolderOpen />
                {!videoFolder && "Select folder"}
              </Button>
            </div>
          </SettingRow>
          <SettingRow label="Default video output format">
            <Select
              value={defaultVideoOutputFormat}
              onValueChange={updateVideoOutputFormat}
            >
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
        </div>
      </div>
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
