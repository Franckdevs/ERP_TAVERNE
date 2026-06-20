import "./CollabDock.css";
import { useState } from "react";
import { Bell, MessageCircle } from "lucide-react";
import Messenger from "./Messenger";
import Notifications from "./Notifications";
import { ALERTS, CONTACTS } from "./collabData";

type Panel = "none" | "messages" | "alerts";

/* Dock collaboration flottant — commun à tous les espaces (messagerie + alertes). */
export default function CollabDock() {
  const [panel, setPanel] = useState<Panel>("none");
  const [seenMsgs, setSeenMsgs] = useState(false);
  const [alerts, setAlerts] = useState(ALERTS);

  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const unreadMsgs = seenMsgs ? 0 : CONTACTS.reduce((n, c) => n + c.unread, 0);

  const toggle = (p: Panel) => {
    setPanel((cur) => (cur === p ? "none" : p));
    if (p === "messages") setSeenMsgs(true);
  };

  return (
    <div className="dock">
      {panel === "messages" && (
        <div className="dock__panel">
          <Messenger onClose={() => setPanel("none")} />
        </div>
      )}

      {panel === "alerts" && (
        <div className="dock__panel">
          <Notifications
            alerts={alerts}
            onClose={() => setPanel("none")}
            onToggleRead={(id) =>
              setAlerts((list) =>
                list.map((a) => (a.id === id ? { ...a, read: !a.read } : a))
              )
            }
            onMarkAllRead={() =>
              setAlerts((list) => list.map((a) => ({ ...a, read: true })))
            }
          />
        </div>
      )}

      <div className="dock__fabs">
        <button
          type="button"
          className={`fab ${panel === "alerts" ? "is-active" : ""}`}
          onClick={() => toggle("alerts")}
          aria-label="Alertes"
        >
          <Bell />
          {unreadAlerts > 0 && <span className="fab__badge">{unreadAlerts}</span>}
        </button>

        <button
          type="button"
          className={`fab fab--primary ${panel === "messages" ? "is-active" : ""}`}
          onClick={() => toggle("messages")}
          aria-label="Messagerie"
        >
          <MessageCircle />
          {unreadMsgs > 0 && <span className="fab__badge fab__badge--light">{unreadMsgs}</span>}
        </button>
      </div>
    </div>
  );
}