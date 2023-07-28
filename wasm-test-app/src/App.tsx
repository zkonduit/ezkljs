import React, { useEffect, useState } from "react";
// Don't forget to change the path to your wasm module
import init from './pkg/ezkl';

import GenPK from './GenPk';
import GenVk from './GenVk';
import GenProof from './GenProof';
import Verify from './Verify';
import Hash from './Hash';

// TODO - import WASMTest.tsx here and use it to render the test script

const App = () => {
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

const fileSetters: any = {
  'srs_ser_pk': setSrsFile,
  'circuit_settings_ser_pk': setCircuitSettingsFile,
  'model_ser_pk': setModelFilePk,
  'data_prove': setDataFileProve,
  'pk_prove': setPkFileProve,
  'model_ser_prove': setModelFileProve,
  'circuit_settings_ser_prove': setCircuitSettingsFileProve,
  'srs_ser_prove': setSrsFileProve,
  'pk_ser_vk': setPkFileVk,
  'circuit_settings_ser_vk': setCircuitSettingsFileVk,
  'proof_js': setProofFileVerify,
  'vk': setVkFileVerify,
  'circuit_settings_ser_verify': setCircuitSettingsFileVerify,
  'srs_ser_verify': setSrsFileVerify,
};

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const id = event.target.id;
  const file = event.target.files?.item(0) || null;
  const setFileFn = fileSetters[id];
  if (setFileFn) {
    setFileFn(file);
  } else {
    console.warn(`Unexpected file input id: ${id}`);
  }
};

return (
  <div className="App">
    <GenPK 
      modelFile={modelFilePk} 
      srsFile={srsFile} 
      circuitSettingsFile={circuitSettingsFile} 
      handleFileChange={handleFileChange} 
    />

    <GenVk
      pkFile={pkFileVk}
      circuitSettingsFile={circuitSettingsFileVk}
      handleFileChange={handleFileChange}
    />

    <GenProof
      dataFile={dataFileProve}
      pkFile={pkFileProve}
      modelFile={modelFileProve}
      circuitSettingsFile={circuitSettingsFileProve}
      srsFile={srsFileProve} 
      handleFileChange={handleFileChange}   
    />
    
    <Verify
      proofFile={proofFileVerify}
      vkFile={vkFileVerify}
      circuitSettingsFile={circuitSettingsFileVerify}
      srsFile={srsFileVerify}
      handleFileChange={handleFileChange}
    />
    <Hash
      message={dataFileProve}
      handleFileChange={handleFileChange}
    />
  </div>
);
};

export default App;
