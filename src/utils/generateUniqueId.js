import guestUrl from "../models/guestUrl.js";
import Url from "../models/url.js";

export const generateUniqueId = async (user) => {
  let shortUrlId = Math.random().toString(36).substring(2, 7); // Genera un ID único de 5 caracteres

  // Verifica si el ID ya existe en la base de datos
  while (true) {
    const url = await Url.findOne({ shortUrlId: shortUrlId, user: user }); // Busca el ID en la colección de URLs
    if (!url) break; // Si no existe, rompe el bucle y devuelve el ID generado anteriormente

    shortUrlId = Math.random().toString(36).substring(2, 7); // Si existe, genera un nuevo ID único de 5 caracteres
  }

  return shortUrlId;
};

export const generateGuestId = async () => {
  let guestId = Math.random().toString(36).substring(2, 7); // Genera un ID único de 5 caracteres

  // Verifica si el ID ya existe en la base de datos
  while (true) {
    const guest = await guestUrl.findOne({ shortUrlId: guestId }); // Busca el ID en la colección de URLs
    if (!guest) break; // Si no existe, rompe el bucle y devuelve el ID generado anteriormente

    guestId = Math.random().toString(36).substring(2, 7); // Si existe, genera un nuevo ID único de 5 caracteres
  }

  return guestId;
};
