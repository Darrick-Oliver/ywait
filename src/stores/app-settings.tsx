import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppSettings } from "@/types/app-settings";
import { load } from "@tauri-apps/plugin-store";

const appSettingsStore = await load("app-settings.json", { autoSave: false });

const defaultAppSettings: AppSettings = {};

interface AppSettingsContextType {
  appSettings: AppSettings;
  updateAppSettings: (updates: Partial<AppSettings>) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType>({
  appSettings: defaultAppSettings,
  updateAppSettings: () => null,
});

export const AppSettingsProvider = ({ children }: PropsWithChildren) => {
  const [appSettings, setAppSettings] =
    useState<AppSettings>(defaultAppSettings);

  const updateAppSettings = async (updates: Partial<AppSettings>) => {
    if (!appSettings) {
      throw new Error("Tried to set app settings before initialized");
    }

    for (const update of Object.keys(updates) as (keyof typeof updates)[]) {
      if (updates[update] !== appSettings?.[update]) {
        await appSettingsStore.set(update, updates[update]);
      }
    }
    setAppSettings((curr) => ({ ...curr, ...updates }));
    await appSettingsStore.save();
  };

  useEffect(() => {
    appSettingsStore.entries().then((entries) => {
      let storedSettings: Record<string, unknown> = {};
      entries.map(([key, value]) => (storedSettings[key] = value));
      setAppSettings(storedSettings as AppSettings);
    });
  }, []);

  return (
    <AppSettingsContext.Provider value={{ appSettings, updateAppSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error(
      "useAppSettings must be used within an AppSettingsProvider"
    );
  }
  return context;
};
