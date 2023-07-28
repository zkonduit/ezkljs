import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import fs from 'fs';
import path from 'path';

const readFile = (filePath: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, filePath), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};


describe('App component', () => {
  it('simulates GenPK component user interaction', async () => {
    const { getByLabelText, getByText, getByRole } = render(<App />);

    // Prepare Blob data to simulate files
    const modelFilePath = path.join(__dirname, './data/modelFile');
    const srsFilePath = path.join(__dirname, './data/srsFile');
    const circuitSettingsFilePath = path.join(__dirname, './data/circuitSettingsFile');

    const modelData = await readFile(modelFilePath);
    const srsData = await readFile(srsFilePath);
    const circuitSettingsData = await readFile(circuitSettingsFilePath);

    const modelFile = new File([modelData], 'modelFile');
    const srsFile = new File([srsData], 'srsFile');
    const circuitSettingsFile = new File([circuitSettingsData], 'circuitSettingsFile');

    // const modelFile = Blob.arrayBuffer(fs.readFileSync(modelFilePath));
    // const srsFile = Blob.arrayBuffer(fs.readFileSync(srsFilePath));
    // const circuitSettingsFile = Blob.arrayBuffer(fs.readFileSync(circuitSettingsFilePath));

    // Simulate file upload
    fireEvent.change(getByLabelText('Model (.onnx):'), { target: { files: [modelFile] } });
    fireEvent.change(getByLabelText('SRS:'), { target: { files: [srsFile] } });
    fireEvent.change(getByLabelText('Circuit settings:'), { target: { files: [circuitSettingsFile] } });

    // Simulate click on Generate button
    fireEvent.click(getByRole('button', { name: /Generate/i }));

    // Wait for the result to show up and check the result
    await waitFor(() => {
      expect(getByText('Pk Generation successful')).toBeInTheDocument();
    });

    // ... further tests on the created pk.key file
  });
});