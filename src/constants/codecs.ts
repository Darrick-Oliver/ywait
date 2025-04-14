import { SupportedContainerFormat } from "./containers";

const supportedVideoCodecs = ["av01", "vp09", "avc1"] as const; // hvc1?
export type SupportedVideoCodec = (typeof supportedVideoCodecs)[number];
export const isSupportedVideoCodec = (
  vcodec: string
): vcodec is SupportedVideoCodec =>
  supportedVideoCodecs.includes(vcodec as any);

const supportedAudioCodecs = ["mp4a", "opus"] as const;
export type SupportedAudioCodec = (typeof supportedAudioCodecs)[number];
export const isSupportedAudioCodec = (
  acodec: string
): acodec is SupportedAudioCodec =>
  supportedAudioCodecs.includes(acodec as any);

export const compatibleVideoCodecs: Record<
  SupportedContainerFormat,
  SupportedVideoCodec[]
> = {
  avi: ["av01", "avc1", "vp09"],
  flv: ["av01", "avc1", "vp09"],
  mkv: ["av01", "avc1", "vp09"],
  mov: ["avc1"],
  mp4: ["av01", "avc1", "vp09"],
  webm: ["av01", "vp09"],
};

export const compatibleAudioCodecs: Record<
  SupportedContainerFormat,
  SupportedAudioCodec[]
> = {
  avi: ["mp4a"],
  flv: ["mp4a"],
  mkv: ["mp4a", "opus"],
  mov: ["mp4a"],
  mp4: ["mp4a", "opus"],
  webm: ["opus"],
};
