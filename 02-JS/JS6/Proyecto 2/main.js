import express from "express";
import axios from "axios";
const servidor = express();

servidor.use(express.static("public"));
servidor.use(express.json());

// Lista donde se guardan los usuarios registrados
let registros = [];
let idActual = 1;

// Ruta para registrar datos usando fetch desde el servidor
servidor.post("/api/registroFetch", async (req, res) => {
  const { nombreUsuario, correo } = req.body;
  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreUsuario, correo }),
    });

    await respuesta.json();

    // Creamos el nuevo usuario con un ID único y lo guardamos
    const nuevo = { id: idActual++, nombreUsuario, correo };
    registros.push(nuevo);

    res.json({ ...nuevo, metodo: "fetch" });
  } catch (error) {
    // Si ocurre un error, lo informamos
    res.json({ error: "Error usando fetch" });
  }
});

// Ruta para registrar datos usando axios desde el servidor
servidor.post("/api/registroAxios", async (req, res) => {
  const { nombreUsuario, correo } = req.body;

  try {
    await axios.post("https://jsonplaceholder.typicode.com/users", {
      nombreUsuario,
      correo,
    });

    // Guardamos el nuevo registro en la lista
    const nuevo = { id: idActual++, nombreUsuario, correo };
    registros.push(nuevo);

    res.json({ ...nuevo, metodo: "axios" });
  } catch (error) {
    res.json({ error: "Error usando axios" });
  }
});
const PUERTO = 3000;
servidor.listen(PUERTO, () => {
  console.log(`Servidor disponible en http://localhost:${PUERTO}`);
});
