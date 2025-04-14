import { invoke } from "@tauri-apps/api/core";

export const showInFolder = (path: string) =>
  invoke("show_in_folder", { path });
