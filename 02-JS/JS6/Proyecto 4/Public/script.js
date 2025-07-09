// Usamos fetch para obtener la lista de estudiantes y su promedio de edad
fetch("/api/estudiantes")
  .then(res => res.json())
  .then(info => {
    const caja = document.getElementById("contenedor");

    // Si hay estudiantes los mostramos
    info.estudiantes.forEach(est => {
      const p = document.createElement("p");
      p.textContent = `${est.nombre} — Edad: ${est.edad}`;
      caja.appendChild(p);
    });

    // Mostramos el promedio de edad
    const resumen = document.createElement("p");
    resumen.style.fontWeight = "bold";
    resumen.textContent = `Promedio de edad: ${info.promedio}`;
    caja.appendChild(resumen);
  })
  .catch(() => {
    document.getElementById("contenedor").textContent =
      "No se pudo obtener la información.";
  });
