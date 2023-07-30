import { useState, useEffect } from "react";
import GenPK from "./GenPk";
import GenVk from "./GenVk";
import GenProof from "./GenProof";
import Verify from './Verify';
import Hash from './Hash';
import init, { 
    gen_pk_wasm, 
    gen_vk_wasm, 
    prove_wasm,
    verify_wasm,
    poseidon_hash_wasm
 } from './pkg/ezkl';
import { readUploadedFileAsText } from './Utils';

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

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        async function run() {
        // Initialize the WASM module
        await init();
        }
        run();
    });
      

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

        fetch('/data/test.provekey')
            .then(res => res.blob())
            .then(blob => setPkFile(new File([blob], 'test.provekey')));

        fetch('/data/test.witness.json') // replace 'data' with your actual file name
            .then(res => res.blob())
            .then(blob => setDataFile(new File([blob], 'test.witness.json')));

        fetch('/data/test.proof')
            .then(res => res.blob())
            .then(blob => setProofFile(new File([blob], 'test.proof')));

        fetch('/data/test.key')
            .then(res => res.blob())
            .then(blob => setVkFile(new File([blob], 'test.key')));

        fetch('/data/message')
            .then(res => res.blob())
            .then(blob => setMessageFile(new File([blob], 'message')));
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { };
    const handleGenPkButton = async (modelFile: File, srsFile: File, circuitSettingsFile: File) => {
        try {
            const model_ser = await readUploadedFileAsText(modelFile);
            const srs_ser = await readUploadedFileAsText(srsFile);
            const circuit_settings_ser = await readUploadedFileAsText(circuitSettingsFile);
            const result_pk = gen_pk_wasm(model_ser, srs_ser, circuit_settings_ser);
            console.log(result_pk)
            setPkResult(`Test passed, ${result_pk}`);
        } catch (error) {
            setPkResult('GenPk test failed');
            console.error(error);
            throw new Error('GenPk test failed');
        }
    };
    const handleGenVkButton = async (pkFile: File, circuitSettingsFile: File) => {
        try {
            const pk_ser = await readUploadedFileAsText(pkFile);
            const circuit_settings_ser = await readUploadedFileAsText(circuitSettingsFile);
            const result_vk = gen_vk_wasm(pk_ser, circuit_settings_ser);
            console.log(result_vk)
            setVkResult(`Test passed, ${result_vk}`);
        } catch (error) {
            setVkResult('GenVk test failed');
            console.error(error);
            throw new Error('GenVk test failed');
        }
    };

    const handleGenProofButton = async (dataFile: File, pkFile: File, modelFile: File, circuitSettingsFile: File, srsFile: File) => {
        try {
            const data_prove_file = await readUploadedFileAsText(dataFile);
            const pk_prove_file = await readUploadedFileAsText(pkFile);
            const model_ser_prove_file = await readUploadedFileAsText(modelFile);
            const circuit_settings_ser_prove_file = await readUploadedFileAsText(circuitSettingsFile);
            const srs_ser_prove_file = await readUploadedFileAsText(srsFile);
            const result_proof = prove_wasm(data_prove_file, pk_prove_file, model_ser_prove_file, circuit_settings_ser_prove_file, srs_ser_prove_file);
            console.log(result_proof)
            setProofResult(`Test passed, ${result_proof}`);
        } catch (error) {
            setProofResult('GenProof test failed');
            console.error(error);
            throw new Error('GenProof test failed');
        }
    };

    const handleVerifyButton = async (proofFile: File, vkFile: File, circuitSettingsFile: File, srsFile: File) => {
        try {
            const proof_ser = await readUploadedFileAsText(proofFile);
            const vk_ser = await readUploadedFileAsText(vkFile);
            const circuit_settings_ser = await readUploadedFileAsText(circuitSettingsFile);
            const srs_ser = await readUploadedFileAsText(srsFile);
            const result_verify = verify_wasm(proof_ser, vk_ser, circuit_settings_ser, srs_ser);
            console.log(result_verify)
            setVerifyResult(`Test passed, ${result_verify}`);
        } catch (error) {
            setVerifyResult('Verify test failed');
            console.error(error);
            throw new Error('Verify test failed');
        }
    };

    const handleGenHashButton = async (messageFile: File) => {
        try {
            const message_ser = await readUploadedFileAsText(messageFile);
            const result_hash = poseidon_hash_wasm(message_ser);
            console.log(result_hash)
            setHashResult(`Test passed, ${result_hash}`);
        } catch (error) {
            setHashResult('GenHash test failed');
            console.error(error);
            throw new Error('GenHash test failed');
        }
    };


    useEffect(() => {
        if (modelFile && srsFile && circuitSettingsFile) {
            setTimeout(() => {
                handleGenPkButton(modelFile, srsFile, circuitSettingsFile);
            }, 1000); // adjust timeout as necessary
        }
    }, [modelFile, srsFile, circuitSettingsFile]);

    useEffect(() => {
        if (pkFile && circuitSettingsFile) {
            setTimeout(() => {
                handleGenVkButton(pkFile, circuitSettingsFile);
            }, 1000); // adjust timeout as necessary
        }
    }, [pkFile, circuitSettingsFile]);

    useEffect(() => {
        if (dataFile && pkFile && modelFile && circuitSettingsFile && srsFile) {
            setTimeout(() => {
                handleGenProofButton(dataFile, pkFile, modelFile, circuitSettingsFile, srsFile);
            }, 1000); // adjust timeout as necessary
        }
    }, [dataFile, pkFile, modelFile, circuitSettingsFile, srsFile]);

    useEffect(() => {
        if (proofFile && vkFile && circuitSettingsFile && srsFile) {
            setTimeout(() => {
                handleVerifyButton(proofFile, vkFile, circuitSettingsFile, srsFile);
            }, 1000); // adjust timeout as necessary
        }
    }, [proofFile, vkFile, circuitSettingsFile, srsFile]);

    useEffect(() => {
        if (messageFile) {
            setTimeout(() => {
                handleGenHashButton(messageFile);
            }, 1000); // adjust timeout as necessary
        }
    }, [messageFile]);




    return (
        <div>
            <h1>Test script</h1>
            <h2>GenPK Test result:</h2>
            <div>{pkResult}</div>
            <h2>GenVK Test result:</h2>
            <div>{vkResult}</div>
            <h2>GenProof Test result:</h2>
            <div>{proofResult}</div>
            <h2>Verify Test result:</h2>
            <div id="verifyResult">{verifyResult}</div>
            <h2>Hash Test result:</h2>
            <div id="hashResult">{hashResult}</div>
        </div>
    );
};

export default TestScript;
