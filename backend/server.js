require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * Ruta para obtener información del medicamento y calcular la dosis pediátrica.
 */
app.get("/api/medicamento", async (req, res) => {
    const { nombre, edad, peso } = req.query;

    if (!nombre || !edad || !peso) {
        return res.status(400).json({ error: "Debe proporcionar nombre, edad y peso." });
    }

    try {
        // 1️⃣ Buscar el medicamento en OpenFDA
        const response = await axios.get(
            `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${nombre}&limit=1`
        );

        const data = response.data.results[0];
        const medicamento = data.openfda.brand_name[0] || "No disponible";
        const dosisGeneral = data.dosage_and_administration?.[0] || "Información no disponible";

        // 2️⃣ Definir la dosis estándar según el medicamento (puede ser más avanzado)
        const dosisPorKg = 10; // Ejemplo: 10 mg/kg, esto puede cambiar según el medicamento

        // 3️⃣ Calcular la dosis pediátrica
        const dosisCalculada = parseFloat(peso) * dosisPorKg;

        // 4️⃣ Enviar la respuesta al frontend
        res.json({
            medicamento,
            dosisGeneral,
            dosisCalculada: `${dosisCalculada} mg`,
            mensaje: `Se recomienda administrar ${dosisCalculada} mg basado en un peso de ${peso} kg.`,
        });

    } catch (error) {
        res.status(500).json({ error: "No se pudo obtener información del medicamento." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
