import React, { useState } from "react";
import axios from "axios";

const DownloadFile: React.FC = () => {
  const [fileName, setFileName] = useState("");

  const handleDownload = async () => {
    if (!fileName) {
      alert("Please enter a file name.");
      return;
    }

    try {
      // Make a GET request to the backend to download the file
      const response = await axios.get(
        `http://localhost:3000/download/${fileName}`,
        {
          responseType: "blob",
        }
      );

      // Create a URL for the downloaded file
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Could not download the file. Make sure the file name is correct.");
    }
  };

  return (
    <div>
      <h2>Download a File</h2>
      <input
        type="text"
        placeholder="Enter file name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default DownloadFile;
