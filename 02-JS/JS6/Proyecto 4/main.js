import express from "express";
const app = express();


app.use(express.static("public"));
// Api para obtener la lista de estudiantes
app.get("/api/estudiantes", (req, res) => {
  const personas = [
    { id: 101, nombre: "Luna", edad: 22 },
    { id: 102, nombre: "Bruno", edad: 29 },
    { id: 103, nombre: "Selene", edad: 31 },
  ];

  // Se calcula el promedio de edad
  const promedioEdad = (
    personas.reduce((acum, p) => acum + p.edad, 0) / personas.length
  ).toFixed(1);
  res.json({ estudiantes: personas, promedio: Number(promedioEdad) });
});
const PUERTO = 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});
