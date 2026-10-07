interface ChatMessage {
  name: string;
  message: string;
  timestamp: string;
}

const el = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;

const logEl = el<HTMLPreElement>("log");
const messageInput = el<HTMLInputElement>("message");
const nameInput = el<HTMLInputElement>("name");
const tokenInput = el<HTMLInputElement>("token");

const log = (t: string) => (logEl.textContent += t + "\n");

const ws = new WebSocket(
  "ws://localhost:8000/ws/" + Math.floor(Math.random() * 1000),
);
ws.onopen = () => log("[open]");
ws.onclose = () => log("[closed]");
ws.onerror = () => log("[error]");
ws.onmessage = (e: MessageEvent<string>) => {
  const m: ChatMessage = JSON.parse(e.data);
  log(`${m.name}: ${m.message}`);
};

messageInput.onkeydown = (e) => {
  if (e.key !== "Enter") return;

  ws.send(
    JSON.stringify({
      name: nameInput.value,
      token: tokenInput.value,
      message: messageInput.value,
      timestamp: new Date().toISOString(),
    }),
  );

  messageInput.value = "";
};
