import { useState, ChangeEvent, FC } from 'react';
import { verify } from '../pkg/ezkl';
import { readUploadedFileAsText } from './Utils';

interface Verify {
    proofFile: File | null;
    vkFile: File | null;
    circuitSettingsFile: File | null;
    srsFile: File | null;
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Verify: FC<Verify> = ({ proofFile, vkFile, circuitSettingsFile, srsFile, handleFileChange }) => {
    const [verifyResult, setVerifyResult] = useState('');

    const handleVerifyButton = async () => {
        try {
            if (proofFile && vkFile && circuitSettingsFile && srsFile) {
                const proof_js_file = await readUploadedFileAsText(proofFile);
                const vk_file = await readUploadedFileAsText(vkFile);
                const circuit_settings_ser_verify_file = await readUploadedFileAsText(circuitSettingsFile);
                const srs_ser_verify_file = await readUploadedFileAsText(srsFile);
                const result = verify(proof_js_file, vk_file, circuit_settings_ser_verify_file, srs_ser_verify_file);
                setVerifyResult(result ? 'True' : 'False');
            } else {
                console.error('Required HTMLInputElement(s) are null');
            }
        } catch (error) {
            console.error("An error occurred verifying proof:", error);
        }
    };
    return (
        <div>
            <h1>Verify</h1>
            <label htmlFor="proof_js">Proof:</label>
            <input id="proof_js" type="file" onChange={handleFileChange} placeholder="proof_js" />
            <label htmlFor="vk">Verification key:</label>
            <input id="vk" type="file" onChange={handleFileChange} placeholder="vk" />
            <label htmlFor="circuit_settings_ser_verify">Circuit settings:</label>
            <input id="circuit_settings_ser_verify" type="file" onChange={handleFileChange} placeholder="circuit_settings_ser_verify" />
            <label htmlFor="srs_ser_verify">SRS:</label>
            <input id="srs_ser_verify" type="file" onChange={handleFileChange} placeholder="srs_ser_verify" />
            <button id="verifyButton" onClick={handleVerifyButton} disabled={!proofFile || !vkFile || !circuitSettingsFile || !srsFile}>Verify</button>
            <h2>Result:</h2>
            <div>{verifyResult}</div>
        </div>
    )
}
export default Verify;
