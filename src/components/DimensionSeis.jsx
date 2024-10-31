import { useState } from "react";

const DimensionSeis = ({pregunta}) => {
    const [respuesta, setRespuesta] = useState('');

    const handleChange = (value) => {
        setRespuesta(value);
        onRespuestaChange(index, value);
    };

    return (
        <div className="p-4">
            <table className="min-w-full border-collapse border border-gray-200 mt-2">
                <tbody>
                    <tr>
                        <td className="border border-gray-300 p-2">
                            {pregunta}
                        </td>
                    </tr>
                    <tr>
                        <td className="">
                            <textarea
                                type="text"
                                value={respuesta}
                                onChange={(e) => setRespuesta(e.target.value)}
                                className="border border-transparent w-full min-h-full h-24 flex items-center"
                                placeholder="Escribe tu respuesta..."
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DimensionSeis;
