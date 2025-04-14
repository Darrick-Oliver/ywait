export const supportedContainerFormats = [
  "avi",
  "flv",
  "mkv",
  "mov",
  "mp4",
  "webm",
] as const;
export type SupportedContainerFormat =
  (typeof supportedContainerFormats)[number];
