"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircleIcon, SendIcon, XIcon } from "lucide-react";

type ChatMessage = { role: "user" | "model"; text: string };

const DEFAULT_GREETING = "¡Hola! ¿En qué te puedo ayudar? Preguntame por una propiedad, un barrio o un precio.";

// Widget del agente de ventas IA del sitio público de un tenant — a
// diferencia de SalesChatProvider (bot de la landing de UrbIA, sin datos
// reales), acá cada mensaje puede terminar en una tool-call sobre la base
// del propio tenant, así que no hay formulario de contacto aparte: el
// agente pide los datos en la charla y los manda con crear_consulta /
// agendar_visita (ver /api/estate-ai).
export function AiAgentWidget({ greeting }: { greeting?: string | null }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "model", text: greeting || DEFAULT_GREETING }]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function handleSend() {
    const text = input.trim();
    if (!text || pending) return;

    const next = [...messages, { role: "user", text } as ChatMessage];
    setMessages(next);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/estate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error");
      setConversationId(data.conversationId);
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: err instanceof Error ? err.message : "No pudimos responder ahora mismo. Volvé a intentarlo en unos minutos." },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        className="fixed right-5 bottom-5 z-[100] flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition duration-300 hover:-translate-y-1 sm:right-7 sm:bottom-7"
      >
        {open ? <XIcon className="size-6" /> : <MessageCircleIcon className="size-6" />}
      </button>

      {open && (
        <div className="fixed right-5 bottom-[92px] z-[100] flex h-[70vh] max-h-[520px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl sm:right-7 sm:bottom-[108px]">
          <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Consultanos</span>
              <span className="text-xs text-muted-foreground">Responde en segundos</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="text-muted-foreground hover:text-foreground">
              <XIcon className="size-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground"
                    : "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm"
                }
              >
                {m.text}
              </div>
            ))}
            {pending && (
              <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm text-muted-foreground">
                Escribiendo…
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribí tu consulta…"
              disabled={pending}
              className="h-10 flex-1 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={pending || !input.trim()}
              aria-label="Enviar"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
            >
              <SendIcon className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
