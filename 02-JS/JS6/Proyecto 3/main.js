import express from "express";
import axios from "axios";

const app = express();

app.use(express.static("public"));

app.get("/api/todos-los-usuarios", async (req, res) => {
  try {
    const respuesta = await axios.get("https://jsonplaceholder.typicode.com/users");
    // Enviamos la lista de usuarios
    res.json(respuesta.data);
  } catch (error) {
    // Si ocurre un error, lo mostramos como mensaje
    res.status(500).json({ error: "No se pudieron obtener los usuarios." });
  }
});
const PUERTO = 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor activo en http://localhost:${PUERTO}`);
});
