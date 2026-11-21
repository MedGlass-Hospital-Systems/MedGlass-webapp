/** Identifiant court et unique pour les entités créées pendant la démo. */
export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const initialsOf = (firstName: string, lastName: string) =>
  `${firstName.trim()[0] ?? ""}${lastName.trim()[0] ?? ""}`
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
