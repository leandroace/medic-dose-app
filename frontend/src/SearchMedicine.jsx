import { useState } from "react";
import axios from "axios";

const SearchMedicine = () => {
    const [nombre, setNombre] = useState("");
    const [edad, setEdad] = useState("");
    const [peso, setPeso] = useState("");
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResultado(null);

        if (!nombre || !edad || !peso) {
            setError("Por favor, completa todos los campos obligatorios.");
            return;
        }

        try {
            // Construcción de la URL con los datos del formulario
            const response = await axios.get(`https://medic-dose-app.onrender.com/api/medicamento`, {
                params: { nombre, edad, peso }
            });

            setResultado(response.data);
        } catch (err) {
            setError("No se encontró información sobre este medicamento.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
            <h2>Calculadora de Dosis</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre del medicamento"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Edad (años)"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Peso (kg)"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    required
                />
                <button type="submit">Calcular Dosis</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {resultado && (
                <div style={{ marginTop: "20px", textAlign: "left" }}>
                    <h3>Resultado</h3>
                    <p><strong>Medicamento:</strong> {resultado.medicamento}</p>
                    <p><strong>Dosis General:</strong> {resultado.dosisGeneral}</p>
                    <p><strong>Dosis Calculada:</strong> {resultado.dosisCalculada}</p>
                    <p>{resultado.mensaje}</p>
                </div>
            )}
        </div>
    );
};

export default SearchMedicine;
