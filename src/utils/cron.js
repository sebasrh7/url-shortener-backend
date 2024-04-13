// import cron from "node-cron";
// import guestUrl from "../models/guestUrl.js";

// // Crea una tarea cron para eliminar las URL expiradas de la base de datos de MongoDB
// // la tarea se ejecuta cada 24 horas
// const task = cron.schedule("0 0 * * *", async () => {
//   try {
//     // Elimina las URL expiradas de la base de datos de MongoDB con el método deleteMany de Mongoose
//     // y el operador $lt de MongoDB para comparar fechas y horas
//     await guestUrl.deleteMany({ expireAt: { $lt: new Date() } });
//     console.log("Expired URLs deleted");
//   } catch (error) {
//     console.error(error);
//   }
// });

// export default task;
