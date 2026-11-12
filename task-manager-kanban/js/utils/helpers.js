export const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const formatDate = (dateString) =>
  new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short" })
    .format(new Date(dateString));

export const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
