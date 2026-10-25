"use client";

import { useEffect } from "react";
import { liveToken } from "@/app/actions/auth";
import { useLive } from "@/app/stores/live";
import { toast } from "@/app/stores/toast";

const RETRY_MS = 4000;

export default function LiveConnection() {
  useEffect(() => {
    let socket = null;
    let retry = null;
    let closed = false;
    const { setStatus, receive } = useLive.getState();

    const connect = async () => {
      const token = await liveToken();
      if (closed || !token) return;
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      socket = new WebSocket(`${protocol}://${window.location.host}/ws/live?token=${encodeURIComponent(token)}`);
      socket.onopen = () => setStatus("online");
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        receive(message);
        if (message.type === "bot" && message.data.status === "halted") toast.error(`${message.data.name} stopped: ${message.data.haltReason}`);
        if (message.type === "kill") toast.success("Kill switch done: every bot stopped and open trades closed");
      };
      socket.onclose = () => {
        setStatus("offline");
        if (!closed) retry = setTimeout(connect, RETRY_MS);
      };
    };

    connect();
    return () => {
      closed = true;
      clearTimeout(retry);
      socket?.close();
    };
  }, []);

  return null;
}
