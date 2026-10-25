const ENDPOINT = "wss://api.derivws.com/trading/v1/options/ws/public";
const RECONNECT_MS = 3000;
const PING_MS = 30000;

let socket = null;
let opening = null;
let nextId = 1;
const pending = new Map();
const streams = new Map();

const open = () => {
  if (opening) return opening;

  opening = new Promise((resolve) => {
    socket = new WebSocket(ENDPOINT);
    socket.onopen = () => {
      const ping = setInterval(() => socket?.readyState === 1 && socket.send(JSON.stringify({ ping: 1 })), PING_MS);
      socket.onclose = () => {
        clearInterval(ping);
        opening = null;
        if (streams.size) setTimeout(restore, RECONNECT_MS);
      };
      resolve(socket);
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const stream = streams.get(message.req_id);
      if (stream) {
        if (message.subscription?.id) stream.subscriptionId = message.subscription.id;
        stream.onMessage(message);
      }
      const waiting = pending.get(message.req_id);
      if (waiting) {
        pending.delete(message.req_id);
        if (message.error) waiting.reject(new Error(message.error.message));
        else waiting.resolve(message);
      }
    };
  });
  return opening;
};

const restore = async () => {
  const entries = [...streams.values()];
  streams.clear();
  for (const stream of entries) {
    stream.reqId = nextId++;
    stream.subscriptionId = null;
    streams.set(stream.reqId, stream);
    (await open()).send(JSON.stringify({ ...stream.request, req_id: stream.reqId }));
  }
};

export const send = async (request) => {
  const ws = await open();
  const reqId = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(reqId, { resolve, reject });
    ws.send(JSON.stringify({ ...request, req_id: reqId }));
  });
};

export const subscribe = (request, onMessage) => {
  const stream = { request: { ...request, subscribe: 1 }, onMessage, subscriptionId: null, reqId: nextId++ };
  streams.set(stream.reqId, stream);
  open().then((ws) => ws.send(JSON.stringify({ ...stream.request, req_id: stream.reqId })));

  return () => {
    streams.delete(stream.reqId);
    if (stream.subscriptionId && socket?.readyState === 1) socket.send(JSON.stringify({ forget: stream.subscriptionId }));
  };
};
