import { useState, ChangeEvent, FC } from 'react';
import { prove_wasm } from './pkg/ezkl';
import { readUploadedFileAsText, fileDownload } from './Utils';

interface GenProofProps {
    dataFile: File | null;
    pkFile: File | null;
    modelFile: File | null;
    circuitSettingsFile: File | null;
    srsFile: File | null;
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const GenProof: FC<GenProofProps> = ({ dataFile, pkFile, modelFile, circuitSettingsFile, srsFile, handleFileChange }) => {
    const [proofResult, setProofResult] = useState('');
    const handleGenProofButton = async () => {
        try {
            if (dataFile && pkFile && modelFile && circuitSettingsFile && srsFile) {
                const data_prove_file = await readUploadedFileAsText(dataFile);
                const pk_prove_file = await readUploadedFileAsText(pkFile);
                const model_ser_prove_file = await readUploadedFileAsText(modelFile);

                const circuit_settings_ser_prove_file = await readUploadedFileAsText(circuitSettingsFile);
                const srs_ser_prove_file = await readUploadedFileAsText(srsFile);
                const result_proof = prove_wasm(data_prove_file, pk_prove_file, model_ser_prove_file, circuit_settings_ser_prove_file, srs_ser_prove_file);
                setProofResult(result_proof ? 'Proof generation successful' : 'Proof generation failed');
                fileDownload('network.proof', result_proof);
            } else {
                console.error('Required HTMLInputElement(s) are null');
            }
        } catch (error) {
            console.error("An error occurred generating proof:", error);
        }
    };
    return (
        <div>
            <h1>Prove</h1>
            <label htmlFor="data_prove">Input Data:</label>
            <input id="data_prove" type="file" onChange={handleFileChange} placeholder="data_prove" />
            <label htmlFor="pk_prove">Proving key:</label>
            <input id="pk_prove" type="file" onChange={handleFileChange} placeholder="pk_prove" />
            <label htmlFor="model_ser_prove">Model (.onnx):</label>
            <input id="model_ser_prove" type="file" onChange={handleFileChange} placeholder="model_ser" />
            <label htmlFor="circuit_settings_ser_prove">Circuit settings:</label>
            <input id="circuit_settings_ser_prove" type="file" onChange={handleFileChange} placeholder="circuit_settings_ser_prove" />
            <label htmlFor="srs_ser_prove">SRS:</label>
            <input id="srs_ser_prove" type="file" onChange={handleFileChange} placeholder="srs_ser_prove" />
            <button id="proveButton" onClick={handleGenProofButton} disabled={!dataFile || !pkFile || !circuitSettingsFile || !srsFile}>Prove</button>
            <h2>Result:</h2>
            <div>{proofResult}</div>
        </div>
    );
}
export default GenProof;
