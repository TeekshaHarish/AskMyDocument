import React, { useContext, useRef } from 'react';
import { SessionContext } from './../context/context';
import { IoMdAddCircleOutline } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify'; // For toast notifications

function FileUploadForm() {
    // Reference to the hidden file input element
    const fileInputRef = useRef(null);

    // Destructure context values from SessionContext
    const { document } = useContext(SessionContext);
    const { docId, setDocId, selectedFile, setSelectedFile } = document;

    // Handle clicking the custom div to open the file input
    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    // Handle the file selection from the file input
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        // Automatically submit the file once selected
        if (file) {
            handleSubmit(file);
        }
    };

    // Handle form submission to upload the file
    const handleSubmit = async (file) => {
        const formData = new FormData();
        formData.append('file', file); // Append the selected file to the FormData

        try {
            // Send the file to the server for upload
            const response = await fetch('http://127.0.0.1:8000/upload-pdf', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log("Upload response:", data);

            // If the upload is successful, save the document ID
            if (data.id) {
                setDocId(data.id);
                toast.success(`Document uploaded successfully with ID: ${data.id}`);
            } else {
                toast.error("Failed to upload document.");
            }
        } catch (error) {
            // Show error toast if upload fails
            toast.error("Failed to upload document.");
            console.log("Error uploading file:", error);
        }
    };

    return (
        <div>
            {/* Custom styled div that triggers file input when clicked */}
            <div
                onClick={handleDivClick}
                className="py-2 px-4 rounded-lg border-2 border-dashed border-gray-500 cursor-pointer"
            >
                {selectedFile ? (
                    // Show the selected file name if available
                    <span>{selectedFile.name}</span>
                ) : (
                    // If no file is selected, display the upload prompt
                    <div className="flex">
                        <IoMdAddCircleOutline size={24} />
                        <div className="ml-1 flex items-center">Click to Upload PDF</div>
                    </div>
                )}
            </div>

            {/* Hidden file input that is triggered by clicking the custom div */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".pdf" // Only accept PDF files
            />
        </div>
    );
}

export default FileUploadForm;
