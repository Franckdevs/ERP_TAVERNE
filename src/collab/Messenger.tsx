import "./Messenger.css";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  Paperclip,
  Image as ImageIcon,
  Camera,
  FileText,
  Mic,
  Send,
  Play,
  X,
  CheckCheck,
  Search,
} from "lucide-react";
import { CONTACTS, SEED, type Contact, type Message, type MsgKind } from "./collabData";

type Props = { onClose: () => void };

const ATTACH: { kind: MsgKind; label: string; icon: typeof ImageIcon; payload: string }[] = [
  { kind: "image", label: "Photo", icon: ImageIcon, payload: "Photo" },
  { kind: "image", label: "Caméra", icon: Camera, payload: "Photo" },
  { kind: "video", label: "Vidéo", icon: Video, payload: "Vidéo.mp4" },
  { kind: "document", label: "Document", icon: FileText, payload: "Document.pdf" },
];

export default function Messenger({ onClose }: Props) {
  const [threads, setThreads] = useState<Record<string, Message[]>>(SEED);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const nextId = useRef(1000);
  const listEnd = useRef<HTMLDivElement | null>(null);

  const active = CONTACTS.find((c) => c.id === activeId) ?? null;

  const scrollDown = () => {
    requestAnimationFrame(() => listEnd.current?.scrollIntoView({ behavior: "smooth" }));
  };

  const push = (kind: MsgKind, text: string) => {
    if (!activeId) return;
    const msg: Message = { id: (nextId.current += 1), from: "me", kind, text, time: "à l'instant" };
    setThreads((t) => ({ ...t, [activeId]: [...(t[activeId] ?? []), msg] }));
    scrollDown();
  };

  const sendText = () => {
    const v = draft.trim();
    if (!v) return;
    push("text", v);
    setDraft("");
  };

  const openThread = (c: Contact) => {
    setActiveId(c.id);
    setAttachOpen(false);
    scrollDown();
  };

  return (
    <div className="msg" role="dialog" aria-label="Messagerie">
      {/* ----- Liste des discussions ----- */}
      {!active ? (
        <>
          <header className="msg__head">
            <h2 className="msg__head-title">Messagerie</h2>
            <button type="button" className="msg__icon" onClick={onClose} aria-label="Fermer">
              <X />
            </button>
          </header>

          <div className="msg__search">
            <Search />
            <input type="search" placeholder="Rechercher une discussion…" aria-label="Rechercher" />
          </div>

          <ul className="msg__threads">
            {CONTACTS.map((c) => {
              const msgs = threads[c.id] ?? [];
              const last = msgs[msgs.length - 1];
              return (
                <li key={c.id}>
                  <button type="button" className="thread" onClick={() => openThread(c)}>
                    <span className="avatar" style={{ backgroundColor: c.color }}>
                      {c.initials}
                      {c.online && <span className="avatar__dot" />}
                    </span>
                    <span className="thread__body">
                      <span className="thread__top">
                        <span className="thread__name">{c.name}</span>
                        <span className="thread__time">{last?.time ?? ""}</span>
                      </span>
                      <span className="thread__bottom">
                        <span className="thread__preview">{previewOf(last)}</span>
                        {c.unread > 0 && <span className="thread__badge">{c.unread}</span>}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        /* ----- Conversation ----- */
        <>
          <header className="msg__head msg__head--chat">
            <button type="button" className="msg__icon" onClick={() => setActiveId(null)} aria-label="Retour">
              <ArrowLeft />
            </button>
            <span className="avatar avatar--sm" style={{ backgroundColor: active.color }}>
              {active.initials}
            </span>
            <span className="msg__peer">
              <span className="msg__peer-name">{active.name}</span>
              <span className="msg__peer-status">
                {active.online ? "en ligne" : "vu récemment"}
              </span>
            </span>
            <span className="msg__head-actions">
              <button type="button" className="msg__icon" aria-label="Appel"><Phone /></button>
              <button type="button" className="msg__icon" aria-label="Appel vidéo"><Video /></button>
            </span>
          </header>

          <div className="msg__stream">
            {(threads[active.id] ?? []).map((m) => (
              <Bubble key={m.id} m={m} />
            ))}
            <div ref={listEnd} />
          </div>

          {/* ----- Zone de saisie ----- */}
          <div className="composer">
            {attachOpen && (
              <div className="composer__attach">
                {ATTACH.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    className="attach-opt"
                    onClick={() => {
                      push(a.kind, a.payload);
                      setAttachOpen(false);
                    }}
                  >
                    <span className="attach-opt__icon"><a.icon /></span>
                    {a.label}
                  </button>
                ))}
              </div>
            )}

            {recording ? (
              <div className="composer__rec">
                <span className="composer__rec-dot" />
                <span className="composer__rec-time">Enregistrement…</span>
                <button
                  type="button"
                  className="composer__btn composer__btn--cancel"
                  onClick={() => setRecording(false)}
                  aria-label="Annuler"
                >
                  <X />
                </button>
                <button
                  type="button"
                  className="composer__btn composer__btn--send"
                  onClick={() => {
                    push("voice", "0:08");
                    setRecording(false);
                  }}
                  aria-label="Envoyer le vocal"
                >
                  <Send />
                </button>
              </div>
            ) : (
              <div className="composer__row">
                <button
                  type="button"
                  className={`composer__btn ${attachOpen ? "is-active" : ""}`}
                  onClick={() => setAttachOpen((o) => !o)}
                  aria-label="Joindre un fichier"
                >
                  <Paperclip />
                </button>
                <input
                  className="composer__input"
                  placeholder="Écrivez un message…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendText();
                  }}
                />
                {draft.trim() ? (
                  <button
                    type="button"
                    className="composer__btn composer__btn--send"
                    onClick={sendText}
                    aria-label="Envoyer"
                  >
                    <Send />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="composer__btn composer__btn--mic"
                    onClick={() => setRecording(true)}
                    aria-label="Message vocal"
                  >
                    <Mic />
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
function previewOf(m?: Message): string {
  if (!m) return "Démarrer la discussion";
  switch (m.kind) {
    case "image": return "📷 Photo";
    case "video": return "🎬 Vidéo";
    case "voice": return "🎤 Message vocal";
    case "document": return "📄 Document";
    default: return m.text ?? "";
  }
}

function Bubble({ m }: { m: Message }) {
  const mine = m.from === "me";
  return (
    <div className={`bubble ${mine ? "bubble--me" : "bubble--them"}`}>
      <div className="bubble__body">
        {m.kind === "text" && <p className="bubble__text">{m.text}</p>}

        {m.kind === "image" && (
          <div className="att att--media">
            <ImageIcon />
            <span>{m.text ?? "Photo"}</span>
          </div>
        )}

        {m.kind === "video" && (
          <div className="att att--media att--video">
            <span className="att__play"><Play /></span>
            <span>{m.text ?? "Vidéo"}</span>
          </div>
        )}

        {m.kind === "voice" && (
          <div className="att att--voice">
            <button type="button" className="att__voice-btn" aria-label="Lire"><Play /></button>
            <span className="att__wave">
              {[6, 12, 8, 16, 10, 14, 7, 12, 9].map((h, i) => (
                <i key={i} style={{ height: `${h}px` }} />
              ))}
            </span>
            <span className="att__dur">{m.text}</span>
          </div>
        )}

        {m.kind === "document" && (
          <div className="att att--doc">
            <span className="att__doc-icon"><FileText /></span>
            <span className="att__doc-name">{m.text}</span>
          </div>
        )}

        <span className="bubble__meta">
          {m.time}
          {mine && <CheckCheck className="bubble__check" />}
        </span>
      </div>
    </div>
  );
}