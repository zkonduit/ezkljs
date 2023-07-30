import { useState, ChangeEvent, FC } from 'react';
import { gen_pk_wasm } from './pkg/ezkl';
import { readUploadedFileAsText, fileDownload } from './Utils';

interface GenPKProps {
    modelFile: File | null;
    srsFile: File | null;
    circuitSettingsFile: File | null;
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const GenPK: FC<GenPKProps> = ({ modelFile, srsFile, circuitSettingsFile, handleFileChange }) => {
    const [pkResult, setPkResult] = useState('');

    const handleGenPkButton = async () => {
        try {
            if (modelFile && srsFile && circuitSettingsFile) {
                const model_ser = await readUploadedFileAsText(modelFile);
                const srs_ser = await readUploadedFileAsText(srsFile);
                const circuit_settings_ser = await readUploadedFileAsText(circuitSettingsFile);
                const result_pk = gen_pk_wasm(model_ser, srs_ser, circuit_settings_ser);
                setPkResult(result_pk ? 'Pk Generation Successful' : 'Pk Generation failed');
                fileDownload('pk.key', result_pk);
            } else {
                console.error('Required HTMLInputElement(s) are null');
            }
        } catch (error) {
            console.error("An error occurred generating proving key:", error);
        }
    };
    return (
        <div>
            <h1>Generate Proving Key</h1>
            <label htmlFor="model_ser_pk">Model (.onnx):</label>
            <input id="model_ser_pk" type="file" onChange={handleFileChange} placeholder="model_ser_pk" />
            <label htmlFor="srs_ser_pk">SRS:</label>
            <input id="srs_ser_pk" type="file" onChange={handleFileChange} placeholder="srs_ser_pk" />
            <label htmlFor="circuit_settings_ser_pk">Circuit settings:</label>
            <input id="circuit_settings_ser_pk" type="file" onChange={handleFileChange} placeholder="circuit_settings_ser_pk" />
            <button id="genPkButton" onClick={handleGenPkButton} disabled={!modelFile || !srsFile || !circuitSettingsFile}>Generate</button>
            <h2>Result:</h2>
            <div>{pkResult}</div>
        </div>
    );
};

export default GenPK;

