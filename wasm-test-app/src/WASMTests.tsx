import { useState, useEffect } from "react";
import GenPK from "./GenPk";
import GenVk from "./GenVk";
import GenProof from "./GenProof";
import Verify from './Verify';
import Hash from './Hash';

const TestScript = () => {
    const [modelFile, setModelFile] = useState<File | null>(null);
    const [srsFile, setSrsFile] = useState<File | null>(null);
    const [circuitSettingsFile, setCircuitSettingsFile] = useState<File | null>(null);
    const [pkFile, setPkFile] = useState<File | null>(null);
    const [dataFile, setDataFile] = useState<File | null>(null);
    const [pkResult, setPkResult] = useState<string | null>(null);
    const [vkResult, setVkResult] = useState<string | null>(null);
    const [proofResult, setProofResult] = useState<string | null>(null);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [vkFile, setVkFile] = useState<File | null>(null);
    const [verifyResult, setVerifyResult] = useState<string | null>(null);
    const [messageFile, setMessageFile] = useState<File | null>(null);
    const [hashResult, setHashResult] = useState<string | null>(null);

    // Load files
    useEffect(() => {
        fetch('/data/test.onnx')
            .then(res => res.blob())
            .then(blob => setModelFile(new File([blob], 'test.onnx')));

        fetch('/data/kzg')
            .then(res => res.blob())
            .then(blob => setSrsFile(new File([blob], 'kzg')));

        fetch('/data/settings.json')
            .then(res => res.blob())
            .then(blob => setCircuitSettingsFile(new File([blob], 'settings.json')));

        fetch('/data/pk.key')
            .then(res => res.blob())
            .then(blob => setPkFile(new File([blob], 'pk.key')));

        fetch('/data/data') // replace 'data' with your actual file name
            .then(res => res.blob())
            .then(blob => setDataFile(new File([blob], 'data')));

        fetch('/data/proof.js')
            .then(res => res.blob())
            .then(blob => setProofFile(new File([blob], 'proof.js')));

        fetch('/data/vk.key')
            .then(res => res.blob())
            .then(blob => setVkFile(new File([blob], 'vk.key')));

        fetch('/data/message.txt')
            .then(res => res.blob())
            .then(blob => setMessageFile(new File([blob], 'message.txt')));
    }, []);

    // Handle file change (for this test script we don't need this)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { };

    // Run test when files are loaded
    useEffect(() => {
        if (modelFile && srsFile && circuitSettingsFile) {
            // Simulate GenPK button click
            const genPkButton = document.getElementById('genPkButton') as HTMLButtonElement;
            genPkButton.click();

            // Wait for GenPK result
            setTimeout(() => {
                const resultElement = document.getElementById('pkResult');
                if (resultElement?.textContent === 'Pk Generation successful') {
                    setPkResult('Test passed');
                } else {
                    setPkResult('Test failed');
                    throw new Error('Test failed');
                }
            }, 1000); // adjust timeout as necessary
        }

        if (pkFile && circuitSettingsFile) {
            // Simulate GenVK button click
            const genVkButton = document.getElementById('genVkButton') as HTMLButtonElement;
            genVkButton.click();

            // Wait for GenVK result
            setTimeout(() => {
                const resultElement = document.getElementById('vkResult');
                if (resultElement?.textContent === 'Vk Generation successful') {
                    setVkResult('Test passed');
                } else {
                    setVkResult('Test failed');
                    throw new Error('Test failed');
                }
            }, 1000); // adjust timeout as necessary
        }

        if (dataFile && pkFile && modelFile && circuitSettingsFile && srsFile) {
            // Simulate GenProof button click
            const proveButton = document.getElementById('proveButton') as HTMLButtonElement;
            proveButton.click();

            // Wait for GenProof result
            setTimeout(() => {
                const resultElement = document.getElementById('proofResult');
                if (resultElement?.textContent === 'Proof generation successful') {
                    setProofResult('Test passed');
                } else {
                    setProofResult('Test failed');
                    throw new Error('Test failed');
                }
            }, 1000); // adjust timeout as necessary
        }
        if (proofFile && vkFile && circuitSettingsFile && srsFile) {
            // Simulate Verify button click
            const verifyButton = document.getElementById('verifyButton') as HTMLButtonElement;
            verifyButton.click();

            // Wait for Verify result
            setTimeout(() => {
                const resultElement = document.getElementById('verifyResult');
                if (resultElement?.textContent === 'True') {
                    setVerifyResult('Test passed');
                } else {
                    setVerifyResult('Test failed');
                    throw new Error('Test failed');
                }
            }, 1000); // adjust timeout as necessary
        }
        if (messageFile) {
            // Simulate GenHash button click
            const genHashButton = document.getElementById('genHashButton') as HTMLButtonElement;
            genHashButton.click();

            // Wait for GenHash result
            setTimeout(() => {
                const resultElement = document.getElementById('hashResult');
                if (resultElement?.textContent?.startsWith('Hash:')) {
                    setHashResult('Test passed');
                } else {
                    setHashResult('Test failed');
                    throw new Error('Test failed');
                }
            }, 1000); // adjust timeout as necessary
        }
    }, [modelFile, srsFile, circuitSettingsFile, pkFile, dataFile, vkFile, proofFile, messageFile]);


    return (
        <div>
            <h1>Test script</h1>
            <GenPK
                modelFile={modelFile}
                srsFile={srsFile}
                circuitSettingsFile={circuitSettingsFile}
                handleFileChange={handleFileChange}
            />
            <h2>GenPK Test result:</h2>
            <div>{pkResult}</div>
            <GenVk
                pkFile={pkFile}
                circuitSettingsFile={circuitSettingsFile}
                handleFileChange={handleFileChange}
            />
            <h2>GenVK Test result:</h2>
            <div>{vkResult}</div>
            <GenProof
                dataFile={dataFile}
                pkFile={pkFile}
                modelFile={modelFile}
                circuitSettingsFile={circuitSettingsFile}
                srsFile={srsFile}
                handleFileChange={handleFileChange}
            />
            <h2>GenProof Test result:</h2>
            <div>{proofResult}</div>
            <Verify
                proofFile={proofFile}
                vkFile={vkFile}
                circuitSettingsFile={circuitSettingsFile}
                srsFile={srsFile}
                handleFileChange={handleFileChange}
            />
            <h2>Verify Test result:</h2>
            <div id="verifyResult">{verifyResult}</div>
            <Hash
                message={messageFile}
                handleFileChange={handleFileChange}
            />
            <h2>Hash Test result:</h2>
            <div id="hashResult">{hashResult}</div>
        </div>
    );
};

export default TestScript;
