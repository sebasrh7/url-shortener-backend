import Url from "../models/Url.js";
import guestUrl from "../models/guestUrl.js";

// Crear una URL corta
export const createShortUrl = async (req, res) => {
  try {
    const user = req.user._id; // Obtiene el ID del usuario autenticado

    const { originalUrl } = req.body;
    const baseUrl = process.env.BASE_URL; // Obtiene la URL base del cliente

    // Verifica si la URL ya existe en la base de datos
    const url = await Url.findOne({ originalUrl, user }); // Busca la URL en la base de datos con el ID del usuario autenticado
    if (url) {
      const shortUrl = `${baseUrl}/${url.shortUrlId}`;
      return res.json({
        _id: url._id,
        originalUrl,
        shortUrl,
        clicks: url.clicks,
        date: url.date,
        user: url.user,
        message: "URL already exists",
      });
    }

    // Crea una URL corta si no existe en la base de datos
    const shortUrlId = await generateUniqueId(user);

    const newUrl = new Url({
      originalUrl,
      shortUrlId,
      user: user,
      date: new Date(),
    });
    await newUrl.save();

    const shortUrl = `${baseUrl}/${shortUrlId}`;

    res.json({
      _id: newUrl._id,
      originalUrl,
      shortUrl,
      clicks: newUrl.clicks,
      user: newUrl.user,
      date: newUrl.date,
      message: "URL created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Obtener todas las URLs
export const getUrls = async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL; // Obtiene la URL base del cliente
    const urls = await Url.find({ user: req.user._id });
    res.json(
      urls.map((url) => ({
        _id: url._id,
        originalUrl: url.originalUrl,
        shortUrlId: `${baseUrl}/${url.shortUrlId}`,
        clicks: url.clicks,
        user: url.user,
        date: url.date,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// eliminar urls seleccionadas

export const deleteSelected = async (req, res) => {
  try {
    const { urls } = req.body;
    await Url.deleteMany({ _id: { $in: urls } }); // Elimina las URLs seleccionadas de la base de datos con el ID del usuario autenticado
    res.json({ message: "Selected URLs deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Obtener una URL
export const getUrl = async (req, res) => {
  try {
    const UrlId = req.params.id;
    const url = await Url.findById(UrlId);
    if (url) {
      return res.json(url);
    } else {
      return res.status(404).json({ message: "URL not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Actualizar una URL
export const updateUrl = async (req, res) => {
  try {
    const UrlId = req.params.id;

    const { originalUrl } = req.body;

    const url = await Url.findByIdAndUpdate(
      UrlId,
      { originalUrl },
      { new: true }
    );
    if (url) {
      return res.json(url);
    } else {
      return res.status(404).json({ message: "URL not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Eliminar una URL
export const deleteUrl = async (req, res) => {
  try {
    const UrlId = req.params.id;
    const url = await Url.findByIdAndDelete(UrlId);
    if (url) {
      return res.json({ message: `${url.originalUrl} deleted` });
    } else {
      return res.status(404).json({ message: "URL not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Redirigir a la URL original
export const redirectOriginalUrl = async (req, res) => {
  try {
    const shortUrlId = req.params.shortUrlId; // Obtiene el parámetro de la URL
    // si el usuario no está autenticado
    if (!req.user) {
      const url = await guestUrl.findOne({ shortUrlId }); // Busca la URL en la base de datos
      if (url) {
        // Redirige a la URL original
        return res.redirect(url.originalUrl);
      }
    }
    // si el usuario está autenticado
    const url = await Url.findOne({ shortUrlId }); // Busca la URL en la base de datos

    if (url) {
      // Incrementa el contador de clicks
      await Url.findByIdAndUpdate(url._id, { clicks: url.clicks + 1 });
      // Redirige a la URL original
      return res.redirect(url.originalUrl);
    }
    return res.status(404).json({ message: "URL not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
