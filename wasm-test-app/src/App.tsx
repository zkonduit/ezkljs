import React, { useEffect, useState } from "react";
// Don't forget to change the path to your wasm module
import init, {
  gen_pk_wasm,
  gen_vk_wasm,
  prove_wasm,
  verify_wasm,
  poseidon_hash_wasm,
} from './pkg/ezkl';

function readUploadedFileAsText(file: File) {
  return new Promise<Uint8ClampedArray>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      if (event.target && event.target.result) {
        const arrayBuffer = event.target.result as ArrayBuffer;
        resolve(new Uint8ClampedArray(arrayBuffer));
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = error => {
      reject(new Error('File could not be read: ' + error));
    };

    reader.readAsArrayBuffer(file);
  });
}

const App = () => {
  const [pkResult, setPkResult] = useState<string | null>(null);
  const [vkResult, setVkResult] = useState<string | null>(null);
  const [proveResult, setProveResult] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);
  const [hashResult, setHashResult] = useState<string | null>(null);
  const [modelFileGen, setModelFileGen] = useState<File | null>(null);
  const [runArgsFile, setRunArgsFile] = useState<File | null>(null);
  const [srsFile, setSrsFile] = useState<File | null>(null);
  const [circuitSettingsFile, setCircuitSettingsFile] = useState<File | null>(null);
  const [modelFilePk, setModelFilePk] = useState<File | null>(null);
  const [pkFileVk, setPkFileVk] = useState<File | null>(null);
  const [circuitSettingsFileVk, setCircuitSettingsFileVk] = useState<File | null>(null);
  const [dataFileProve, setDataFileProve] = useState<File | null>(null);
  const [pkFileProve, setPkFileProve] = useState<File | null>(null);
  const [modelFileProve, setModelFileProve] = useState<File | null>(null);
  const [circuitSettingsFileProve, setCircuitSettingsFileProve] = useState<File | null>(null);
  const [srsFileProve, setSrsFileProve] = useState<File | null>(null);
  const [proofFileVerify, setProofFileVerify] = useState<File | null>(null);
  const [vkFileVerify, setVkFileVerify] = useState<File | null>(null);
  const [circuitSettingsFileVerify, setCircuitSettingsFileVerify] = useState<File | null>(null);
  const [srsFileVerify, setSrsFileVerify] = useState<File | null>(null);


  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    async function run() {
      // Initialize the WASM module
      await init();
    }
    run();
  });

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.id === 'srs_ser_pk') {
    setSrsFile(event.target.files?.item(0) || null);
  } else if (event.target.id === 'circuit_settings_ser_pk') {
    setCircuitSettingsFile(event.target.files?.item(0) || null);
  } else if (event.target.id === 'model_ser_pk') {
    setModelFilePk(event.target.files?.item(0) || null);
  } else if (event.target.id === 'data_prove') {
    setDataFileProve(event.target.files?.item(0) || null);
  } else if (event.target.id === 'pk_prove') {
    setPkFileProve(event.target.files?.item(0) || null);
  } else if (event.target.id === 'model_ser_prove') {
    setModelFileProve(event.target.files?.item(0) || null);
  } else if (event.target.id === 'circuit_settings_ser_prove') {
    setCircuitSettingsFileProve(event.target.files?.item(0) || null);
  } else if (event.target.id === 'srs_ser_prove') {
    setSrsFileProve(event.target.files?.item(0) || null);
  } else if (event.target.id == 'pk_ser_vk') {
    setPkFileVk(event.target.files?.item(0) || null);
  } else if (event.target.id == 'circuit_settings_ser_vk') {
    setCircuitSettingsFileVk(event.target.files?.item(0) || null);
  } else if (event.target.id == 'proof_js') {
    setProofFileVerify(event.target.files?.item(0) || null);
  } else if (event.target.id == 'vk') {
    setVkFileVerify(event.target.files?.item(0) || null);
  } else if (event.target.id == 'circuit_settings_ser_verify') {
    setCircuitSettingsFileVerify(event.target.files?.item(0) || null);
  } else if (event.target.id == 'srs_ser_verify') {
    setSrsFileVerify(event.target.files?.item(0) || null);
  }
};

const handleGenPkButton = async () => {
  try {
    if (modelFilePk && srsFile && circuitSettingsFile) {
      const model_ser = await readUploadedFileAsText(modelFilePk);
      const srs_ser = await readUploadedFileAsText(srsFile);
      const circuit_settings_ser = await readUploadedFileAsText(circuitSettingsFile);
      const result_pk = gen_pk_wasm(model_ser, srs_ser, circuit_settings_ser);
      // Creating a blob and a URL for it from the result
      const blob = new Blob([result_pk.buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      // Creating a hidden anchor element, adding it to the document,
      // clicking it to download the file and then removing the element
      const pk = document.createElement("a");
      pk.href = url;
      pk.download = 'pk.key';
      pk.style.display = 'none';
      document.body.appendChild(pk);
      pk.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(pk);
      }, 0);
    } else {
      console.error('Required HTMLInputElement(s) are null');
    }
  } catch (error) {
    console.error("An error occurred generating proving key:", error);
  }
};

const handleGenVkButton = async () => {
  try {
    if (pkFileVk && circuitSettingsFileVk) {
      const pk_ser_vk_file = await readUploadedFileAsText(pkFileVk);
      const circuit_settings_ser_vk_file = await readUploadedFileAsText(circuitSettingsFileVk);
      const result_vk = gen_vk_wasm(pk_ser_vk_file, circuit_settings_ser_vk_file);
      // Creating a blob and a URL for it from the result
      const blob = new Blob([result_vk.buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      // Creating a hidden anchor element, adding it to the document,
      // clicking it to download the file and then removing the element
      const vk = document.createElement("a");
      vk.href = url;
      vk.download = 'vk.key';
      vk.style.display = 'none';
      document.body.appendChild(vk);
      vk.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(vk);
      }, 0);
    } else {
      console.error('Required HTMLInputElement(s) are null');
    }
  } catch (error) {
    console.error("An error occurred generating verification key:", error);
  }
};

const handleGenProofButton = async () => {
  try {

    if (dataFileProve && pkFileProve &&  modelFileProve && circuitSettingsFileProve && srsFileProve) {
      const data_prove_file = await readUploadedFileAsText(dataFileProve);
      const pk_prove_file = await readUploadedFileAsText(pkFileProve);
      const model_ser_prove_file = await readUploadedFileAsText(modelFileProve);
      
      const circuit_settings_ser_prove_file = await readUploadedFileAsText(circuitSettingsFileProve);
      const srs_ser_prove_file = await readUploadedFileAsText(srsFileProve);
      const result_proof = prove_wasm(data_prove_file, pk_prove_file, model_ser_prove_file, circuit_settings_ser_prove_file, srs_ser_prove_file);

      // Creating a blob and a URL for it from the result
      const blob = new Blob([result_proof.buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      // Creating a hidden anchor element, adding it to the document,
      // clicking it to download the file and then removing the element
      const a = document.createElement("a");
      a.href = url;
      a.download = 'network.proof';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    } else {
      console.error('Required HTMLInputElement(s) are null');
    }
  } catch (error) {
    console.error("An error occurred generating proof:", error);
  }
};

const handleVerifyButton = async () => {
  try {
    if (proofFileVerify && vkFileVerify && circuitSettingsFileVerify && srsFileVerify) {
      const proof_js_file = await readUploadedFileAsText(proofFileVerify);
      const vk_file = await readUploadedFileAsText(vkFileVerify);
      const circuit_settings_ser_verify_file = await readUploadedFileAsText(circuitSettingsFileVerify);
      const srs_ser_verify_file = await readUploadedFileAsText(srsFileVerify);
      const result = verify_wasm(proof_js_file, vk_file, circuit_settings_ser_verify_file, srs_ser_verify_file);
      setVerifyResult(result ? 'True' : 'False');
    } else {
      console.error('Required HTMLInputElement(s) are null');
    }
  } catch (error) {
    console.error("An error occurred verifying proof:", error);
  }
};

// Similarly, define the other event handlers

return (
  <div className="App">

    <h1>Generate Proving Key</h1>
    <label htmlFor="model_ser_pk">Model (.onnx):</label>
    <input id="model_ser_pk" type="file" onChange={handleFileChange} placeholder="model_ser_pk" />
    <label htmlFor="srs_ser_pk">SRS:</label>
    <input id="srs_ser_pk" type="file" onChange={handleFileChange} placeholder="srs_ser_pk" />
    <label htmlFor="circuit_settings_ser_pk">Circuit settings:</label>
    <input id="circuit_settings_ser_pk" type="file" onChange={handleFileChange} placeholder="circuit_settings_ser_pk" />
    <button id="genPkButton" onClick={handleGenPkButton} disabled={!modelFilePk || !srsFile || !circuitSettingsFile}>Generate</button>
    <h2>Result:</h2>
    <div>{pkResult}</div>

    <h1>Generate Verification Key</h1>
    <label htmlFor="pk_ser_vk">Proving key:</label>
    <input id="pk_ser_vk" type="file" onChange={handleFileChange} placeholder="pk_ser_vk" />
    <label htmlFor="circuit_settings_ser_vk">Circuit settings:</label>
    <input id="circuit_settings_ser_vk" type="file" onChange={handleFileChange} placeholder="circuit_settings_ser_vk" />
    <button id="genVkButton" onClick={handleGenVkButton} disabled={!pkFileVk || !circuitSettingsFileVk}>Generate</button>
    <h2>Result:</h2>
    <div>{vkResult}</div>

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
    <button id="proveButton" onClick={handleGenProofButton} disabled={!dataFileProve || !pkFileProve || !circuitSettingsFileProve || !srsFileProve}>Prove</button>
    <h2>Result:</h2>
    <div>{proveResult}</div>

    <h1>Verify</h1>
    <label htmlFor="proof_js">Proof:</label>
    <input id="proof_js" type="file" onChange={handleFileChange} placeholder="proof_js" />
    <label htmlFor="vk">Verification key:</label>
    <input id="vk" type="file" onChange={handleFileChange} placeholder="vk" />
    <label htmlFor="circuit_settings_ser_verify">Circuit settings:</label>
    <input id="circuit_settings_ser_verify" type="file" onChange={handleFileChange} placeholder="circuit_settings_ser_verify" />
    <label htmlFor="srs_ser_verify">SRS:</label>
    <input id="srs_ser_verify" type="file" onChange={handleFileChange} placeholder="srs_ser_verify" />
    <button id="verifyButton" onClick={handleVerifyButton} disabled={!proofFileVerify || !vkFileVerify || !circuitSettingsFileVerify || !srsFileVerify}>Verify</button>
    <h2>Result:</h2>
    <div>{verifyResult}</div>
  </div>
);
};

export default App;
