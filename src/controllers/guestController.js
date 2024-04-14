import guestUrl from "../models/guestUrl.js";

// Crear una URL corta
export const guestCreateShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const baseUrl = process.env.BASE_URL; // Obtiene la URL base del cliente

    // Verifica si la URL ya existe en la base de datos
    const url = await guestUrl.findOne({ originalUrl }); // Busca la URL en la base de datos con el ID del usuario invitado
    if (url) {
      const shortUrl = `${baseUrl}/${url.shortUrlId}`;
      return res.json({
        _id: url._id,
        originalUrl,
        shortUrlId: url.shortUrlId,
        shortUrl,
        expireAt: url.expireAt,
        message: "URL already exists",
      });
    }

    // Crea una URL corta si no existe en la base de datos
    const shortUrlId = Math.random().toString(36).substring(2, 7);

    const newUrl = new guestUrl({
      originalUrl,
      shortUrlId,
    });
    await newUrl.save();

    const shortUrl = `${baseUrl}/${shortUrlId}`;

    res.json({
      _id: newUrl._id,
      originalUrl,
      shortUrlId,
      shortUrl,
      expireAt: newUrl.expireAt,
      message: "URL created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};
