import React, { useEffect, useState } from "react";
// Don't forget to change the path to your wasm module
import init, {
  gen_circuit_settings_wasm,
  gen_pk_wasm,
  gen_vk_wasm,
  prove_wasm,
  verify_wasm,
  poseidon_hash_wasm,
} from './pkg/ezkl';

function readUploadedFileAsText(inputFileElement: HTMLInputElement) {
  return new Promise<Uint8ClampedArray>((resolve, reject) => {
    const files = inputFileElement.files;
    if (!files) {
      reject(new Error('No files found in inputFileElement'));
      return;
    }

    const file = files[0];
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
  const [circuitSettingsResult, setCircuitSettingsResult] = useState<string | null>(null);
  const [pkResult, setPkResult] = useState<string | null>(null);
  const [vkResult, setVkResult] = useState<string | null>(null);
  const [proveResult, setProveResult] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);
  const [hashResult, setHashResult] = useState<string | null>(null);
  const [circuitFile, setCircuitFile] = useState<File | null>(null);
  const [runArgsFile, setRunArgsFile] = useState<File | null>(null);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    // TODO: Initialize WASM and event handlers
    async function run() {
      // Initialize the WASM module
      await init();
    }
    run();
  });

  useEffect(() => {
    const circuitInput = document.getElementById("circuit_ser_gen") as HTMLInputElement;
    const runArgsInput = document.getElementById("run_args_ser_gen") as HTMLInputElement;

    setCircuitFile(circuitInput?.files?.item(0) || null);
    setRunArgsFile(runArgsInput?.files?.item(0) || null);
  }, []);

const handleCircuitSettingsButton = async () => {
  // TODO: Add your event handler logic here
  try {
    const circuit_ser_gen = document.getElementById("circuit_ser_gen") as HTMLInputElement;
    const run_args_ser_gen = document.getElementById("run_args_ser_gen") as HTMLInputElement;

    if (circuit_ser_gen && run_args_ser_gen) {
      const circuit_ser = await readUploadedFileAsText(circuit_ser_gen);
      const run_args_ser = await readUploadedFileAsText(run_args_ser_gen);
      const result_cp = gen_circuit_settings_wasm(circuit_ser, run_args_ser);
      // Creating a blob and a URL for it from the result
      const blob = new Blob([result_cp.buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      // Creating a hidden anchor element, adding it to the document,
      // clicking it to download the file and then removing the element
      const g = document.createElement("a");
      g.href = url;
      g.download = 'circuit';
      g.style.display = 'none';
      document.body.appendChild(g);
      g.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(g);
      }, 0);
      // Rest of your code here...
    } else {
      console.error('Required HTMLInputElement(s) are null');
    }
  } catch (error) {
    console.error("An error occurred generating circuit parameters:", error);
  }
};

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.id === 'circuit_ser_gen') {
    setCircuitFile(event.target.files?.item(0) || null);
  } else if (event.target.id === 'run_args_ser_gen') {
    setRunArgsFile(event.target.files?.item(0) || null);
  }
};

const handleGenPkButton = async () => {
  try {
    const circuit_ser_pk = document.getElementById("circuit_ser_pk") as HTMLInputElement;
    const params_ser_pk = document.getElementById("params_ser_pk") as HTMLInputElement;
    const circuit_params_ser_pk = document.getElementById("circuit_params_ser_pk") as HTMLInputElement;

    if (circuit_ser_pk && params_ser_pk && circuit_params_ser_pk) {
      const circuit_ser = await readUploadedFileAsText(circuit_ser_pk);
      const params_ser = await readUploadedFileAsText(params_ser_pk);
      const circuit_params_ser = await readUploadedFileAsText(circuit_params_ser_pk);
      const result_pk = gen_pk_wasm(circuit_ser, params_ser, circuit_params_ser);
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
    const pk_ser = document.getElementById("pk_ser") as HTMLInputElement;
    const circuit_params_ser_vk = document.getElementById("circuit_params_ser_vk") as HTMLInputElement;

    if (pk_ser && circuit_params_ser_vk) {
      const pk_ser_file = await readUploadedFileAsText(pk_ser);
      const circuit_params_ser_vk_file = await readUploadedFileAsText(circuit_params_ser_vk);
      const result_vk = gen_vk_wasm(pk_ser_file, circuit_params_ser_vk_file);
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
    const data_prove = document.getElementById("data_prove") as HTMLInputElement;
    const pk_prove = document.getElementById("pk_prove") as HTMLInputElement;
    const circuit_ser_prove = document.getElementById("circuit_ser_prove") as HTMLInputElement;
    const circuit_params_ser_prove = document.getElementById("circuit_params_ser_prove") as HTMLInputElement;
    const params_ser_prove = document.getElementById("params_ser_prove") as HTMLInputElement;

    if (data_prove && pk_prove && circuit_ser_prove && circuit_params_ser_prove && params_ser_prove) {
      const data_prove_file = await readUploadedFileAsText(data_prove);
      const pk_prove_file = await readUploadedFileAsText(pk_prove);
      const circuit_ser_prove_file = await readUploadedFileAsText(circuit_ser_prove);
      
      const circuit_params_ser_prove_file = await readUploadedFileAsText(circuit_params_ser_prove);
      const params_ser_prove_file = await readUploadedFileAsText(params_ser_prove);
      const result_proof = prove_wasm(data_prove_file, pk_prove_file, circuit_ser_prove_file, circuit_params_ser_prove_file, params_ser_prove_file);

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
    const proof_js = document.getElementById("proof_js") as HTMLInputElement;
    const vk = document.getElementById("vk") as HTMLInputElement;
    const circuit_params_ser_verify = document.getElementById("circuit_params_ser_verify") as HTMLInputElement;
    const params_ser_verify = document.getElementById("params_ser_verify") as HTMLInputElement;
    
    if (proof_js && vk && circuit_params_ser_verify && params_ser_verify) {
      const proof_js_file = await readUploadedFileAsText(proof_js);
      const vk_file = await readUploadedFileAsText(vk);
      const circuit_params_ser_verify_file = await readUploadedFileAsText(circuit_params_ser_verify);
      const params_ser_verify_file = await readUploadedFileAsText(params_ser_verify);
      const result = verify_wasm(proof_js_file, vk_file, circuit_params_ser_verify_file, params_ser_verify_file);
      const doc = document.getElementById("verifyResult") as HTMLInputElement;
      doc.innerText = result ? 'True' : 'False';
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
    <h1>Generate Circuit Settings</h1>
    <label htmlFor="circuit_ser_gen">Circuit (.onnx):</label>
    <input id="circuit_ser_gen" type="file" onChange={handleFileChange} placeholder="circuit_ser_gen" />
    <label htmlFor="run_args_ser_gen">Run Args:</label>
    <input id="run_args_ser_gen" type="file" onChange={handleFileChange} placeholder="run_args_ser_gen" />
    <button id="genCircuitSettingsButton" onClick={handleCircuitSettingsButton} disabled={!circuitFile || !runArgsFile}>Generate Circuit Settings</button>
    <h2>Result:</h2>
    <div>{circuitSettingsResult}</div>
    {/* Similarly, add the other sections here... */}
  </div>
);
};

export default App;
