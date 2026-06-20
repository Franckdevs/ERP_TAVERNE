/* ===========================================================================
   Données de démo — Messagerie & Alertes (espace collaboration)
   --------------------------------------------------------------------------- */

export type Contact = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  online: boolean;
  unread: number;
};

export const CONTACTS: Contact[] = [
  { id: "direction", name: "Direction", role: "Administrateur central", initials: "AD", color: "#8b4513", online: true, unread: 0 },
  { id: "compta", name: "Comptabilité", role: "Awa Traoré", initials: "AT", color: "#a85c1f", online: true, unread: 1 },
  { id: "assistanat", name: "Assistanat", role: "Aïda Mbengue", initials: "AM", color: "#5a9e5a", online: false, unread: 0 },
  { id: "conseil", name: "Conseil client", role: "Omar Seck", initials: "OS", color: "#d6a02f", online: true, unread: 2 },
  { id: "stock", name: "Gestion de stock", role: "Yao Kouadio", initials: "YK", color: "#6b3fa0", online: false, unread: 1 },
  { id: "personnel", name: "Personnel (RH)", role: "Fatou Koné", initials: "FK", color: "#c0392b", online: true, unread: 0 },
];

/* --- Messages ----------------------------------------------------------- */
export type MsgKind = "text" | "image" | "video" | "voice" | "document";

export type Message = {
  id: number;
  from: "me" | "them";
  kind: MsgKind;
  text?: string; // texte, légende, nom de fichier ou durée (vocal)
  time: string;
};

export const SEED: Record<string, Message[]> = {
  direction: [
    { id: 1, from: "them", kind: "text", text: "Réunion de coordination à 16h, merci d'être à l'heure.", time: "10:02" },
    { id: 2, from: "me", kind: "text", text: "Bien noté, je préviens les équipes.", time: "10:05" },
  ],
  compta: [
    { id: 1, from: "them", kind: "text", text: "Bonjour, les factures du chantier Cocody sont prêtes ?", time: "09:12" },
    { id: 2, from: "me", kind: "text", text: "Oui, je t'envoie le récapitulatif tout de suite.", time: "09:14" },
    { id: 3, from: "me", kind: "document", text: "Factures_Cocody_juin.pdf", time: "09:14" },
    { id: 4, from: "them", kind: "text", text: "Parfait, merci 🙏", time: "09:15" },
  ],
  assistanat: [
    { id: 1, from: "me", kind: "text", text: "Peux-tu préparer la salle pour la réunion de 16h ?", time: "11:20" },
    { id: 2, from: "them", kind: "text", text: "C'est fait ✅", time: "11:28" },
  ],
  conseil: [
    { id: 1, from: "them", kind: "text", text: "Le client Riviera valide le devis 👍", time: "08:40" },
    { id: 2, from: "them", kind: "voice", text: "0:14", time: "08:41" },
    { id: 3, from: "me", kind: "text", text: "Excellente nouvelle ! On lance la production.", time: "08:45" },
  ],
  stock: [
    { id: 1, from: "them", kind: "text", text: "Le stock de vernis mat est presque épuisé.", time: "Hier" },
    { id: 2, from: "them", kind: "image", text: "Étagère B-12", time: "Hier" },
  ],
  personnel: [
    { id: 1, from: "them", kind: "video", text: "Présentation_équipe.mp4", time: "Lun" },
    { id: 2, from: "me", kind: "text", text: "Super, je regarde ça.", time: "Lun" },
  ],
};

/* --- Alertes / notifications -------------------------------------------- */
export type AlertType = "stock" | "facture" | "message" | "rdv" | "objectif" | "client";

export type Alert = {
  id: number;
  type: AlertType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
};

export const ALERTS: Alert[] = [
  { id: 1, type: "stock", title: "Stock bas", desc: "Vernis mat — 6 unités restantes (seuil : 10).", time: "Il y a 5 min", read: false },
  { id: 2, type: "message", title: "Nouveau message", desc: "Conseil client : « Le client Riviera valide le devis. »", time: "Il y a 22 min", read: false },
  { id: 3, type: "facture", title: "Facture à valider", desc: "Facture #2026-087 (SIFCA) en attente.", time: "Il y a 1 h", read: false },
  { id: 4, type: "rdv", title: "Rendez-vous", desc: "Visite chantier Plateau à 15h00.", time: "Aujourd'hui", read: true },
  { id: 5, type: "objectif", title: "Objectif atteint", desc: "Commercial : 92 % de l'objectif mensuel.", time: "Hier", read: true },
  { id: 6, type: "client", title: "Nouveau client", desc: "Famille Kouassi ajoutée au portefeuille.", time: "Hier", read: true },
];