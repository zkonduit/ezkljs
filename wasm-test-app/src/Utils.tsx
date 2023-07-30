export function readUploadedFileAsText(file: File) {
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
// Custom hook for file download
export const fileDownload = (fileName: string, buffer: ArrayBufferLike) => {
    if (buffer) {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
        }, 0);
    }
}

