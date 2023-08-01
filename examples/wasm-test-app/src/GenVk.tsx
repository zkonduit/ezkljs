import { useState, ChangeEvent, FC } from 'react';
import { genVk } from './pkg/ezkl';
import { readUploadedFileAsText, fileDownload } from './Utils';

interface GenVKProps {
    pkFile: File | null;
    circuitSettingsFile: File | null;
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const GenVk: FC<GenVKProps> = ({ pkFile, circuitSettingsFile, handleFileChange }) => {
    const [vkResult, setVkResult] = useState('');

    const handleGenVkButton = async () => {
        try {
            if (pkFile && circuitSettingsFile) {
                const pk_ser_vk_file = await readUploadedFileAsText(pkFile);
                const circuit_settings_ser_vk_file = await readUploadedFileAsText(circuitSettingsFile);
                const result_vk = genVk(pk_ser_vk_file, circuit_settings_ser_vk_file);
                setVkResult(result_vk ? 'Vk Generation successful' : 'Vk Generation failed');
                fileDownload('vk.key', result_vk)
            } else {
                console.error('Required HTMLInputElement(s) are null');
            }
        } catch (error) {
            console.error("An error occurred generating verification key:", error);
        }
    };
    return (
        <div>
            <h1>Generate Verification Key</h1>
            <label htmlFor="pk_ser_vk">Proving key:</label>
            <input id="pk_ser_vk" type="file" onChange={handleFileChange} placeholder="pk_ser_vk" />
            <label htmlFor="circuit_settings_ser_vk">Circuit settings:</label>
            <input id="circuit_settings_ser_vk" type="file" onChange={handleFileChange} placeholder="circuit_settings_ser_vk" />
            <button id="genVkButton" onClick={handleGenVkButton} disabled={!pkFile || !circuitSettingsFile}>Generate</button>
            <h2>Result:</h2>
            <div>{vkResult}</div>
        </div>
    )
}

export default GenVk;