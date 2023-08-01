import { useState, ChangeEvent, FC } from 'react';
import { poseidonHash } from '../pkg/ezkl';
import { readUploadedFileAsText, fileDownload } from './Utils';

interface HashProps {
    message: File | null;
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Hash: FC<HashProps> = ({ message, handleFileChange }) => {
    const [hashResult, setHashResult] = useState<string | null>(null);

    const handleHashButton = async () => {
        try {
            if (message) {
                const messageText = await readUploadedFileAsText(message);
                const result = poseidonHash(messageText);
                setHashResult(result? `Hash: ${result}` : 'Hash Generation failed');
                fileDownload('hash.txt', result);
            } else {
                console.error('Required HTMLInputElement is null');
            }
        } catch (error) {
            console.error("An error occurred generating hash:", error);
        }
    };

    return (
        <div>
            <h1>Generate Hash</h1>
            <label htmlFor="message_hash">Message:</label>
            <input id="message_hash" type="file" onChange={handleFileChange} placeholder="Message" />
            <button id="genHashButton" onClick={handleHashButton} disabled={!message}>Generate</button>
            <h2>Result:</h2>
            <div>{hashResult}</div>
        </div>
    );
};

export default Hash;
