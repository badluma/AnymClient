interface ChatMessage {
  name: string;
  message: string;
  timestamp: string;
}

const el = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;

const messagesEl = el<HTMLDivElement>("messages");
const messageTemplate = el<HTMLTemplateElement>("message-template");
const systemTemplate = el<HTMLTemplateElement>("system-template");
const messageInput = el<HTMLInputElement>("message-input");
const nameInput = el<HTMLInputElement>("name");
const tokenInput = el<HTMLInputElement>("token");
const sendButton = el<HTMLButtonElement>("send");

const render = (template: HTMLTemplateElement, message: string, name = "") => {
  const node = template.content.cloneNode(true) as DocumentFragment;
  const nameEl = node.querySelector(".msg-name");
  if (nameEl) nameEl.textContent = name;
  node.querySelector(".msg-text")!.textContent = message;
  messagesEl.append(node);
  messagesEl.scrollTop = messagesEl.scrollHeight;
};

const ws = new WebSocket(
  "ws://localhost:8000/ws/" + Math.floor(Math.random() * 1000),
);
ws.onopen = () => render(systemTemplate, "open");
ws.onclose = () => render(systemTemplate, "closed");
ws.onerror = () => render(systemTemplate, "error");
ws.onmessage = (e: MessageEvent<string>) => {
  const m: ChatMessage = JSON.parse(e.data);
  // ponytail: assumes server sends name "system" or "server"; adjust to the real marker
  if (["system", "server"].includes(m.name.toLowerCase())) render(systemTemplate, m.message);
  else render(messageTemplate, m.message, m.name);
};

const send = () => {
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

messageInput.onkeydown = (e) => {
  if (e.key === "Enter") send();
};
sendButton.onclick = send;
