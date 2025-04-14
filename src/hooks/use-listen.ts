import {
  EventCallback,
  EventName,
  listen,
  Options,
} from "@tauri-apps/api/event";
import { useEffect } from "react";

export const useListen = <T = any>(
  event: EventName,
  handler: EventCallback<T>,
  options?: Options
) => {
  useEffect(() => {
    const unlisten = listen<T>(event, handler, options);

    return () => {
      unlisten.then((f) => f());
    };
  }, []);
};
