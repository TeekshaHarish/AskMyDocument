import React, { useContext, useState } from 'react';
import { SessionContext } from '../context/context';
import { TbSend2 } from "react-icons/tb";
import { toast } from 'react-toastify'; // For toast notifications
import FileUploadForm from './FileUploadForm'; // Import the file upload form component

const InputBox = () => {
  // Local state for the question input
  const [question, setQuestion] = useState("");

  // Destructure context values from SessionContext
  const { document, session } = useContext(SessionContext);
  const { docId, setDocId, selectedFile, setSelectedFile } = document;
  const { sessionId, setSessionId, previousResponses, setPreviousResponses } = session;

  // Handles sending the question and receiving the answer
  const handleQuestionSend = async () => {
    // Ensure a document is uploaded before sending a question
    if (docId) {
      const requestBody = { doc_id: docId, question: question };

      // Add session_id to the request if available
      if (sessionId) requestBody.session_id = sessionId;

      try {
        // Send question to the backend
        const res = await fetch('http://127.0.0.1:8000/ask-question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log("Response:", res);

        // Check if the response is successful
        if (!res.ok) {
          throw new Error('Failed to fetch answer');
        }

        // Parse the response data
        const data = await res.json();
        console.log("Answer received:", data.answer);

        // Store the new session ID if provided
        if (data.session_id) setSessionId(data.session_id);

        // Add the question and answer to the previous responses
        setPreviousResponses((prev) => [...prev, { Q: question, A: data.answer }]);

        // Clear the input field after sending the question
        setQuestion("");
      } catch (error) {
        // Show error toast and log the error
        toast.error("Some error occurred");
        console.log(error);
      }
    } else {
      // Toast to inform the user to upload a PDF first
      toast.info("Please upload a PDF first");
      console.log("Please upload a PDF first");
    }
  };

  // Handle 'Enter' key press to send the question
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleQuestionSend();
    }
  };

  return (
    <div className="fixed bottom-0 w-full">
      {/* Input container */}
      <div className="flex p-3 lg:w-2/3 mx-auto mb-4">
        {/* Input field for the question */}
        <input
          type="text"
          className="px-4 py-2 rounded-lg shadow-md w-full bg-slate-200"
          placeholder="Send a Message..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown} // Handle 'Enter' key press
        />
        
        {/* Send button */}
        <button onClick={handleQuestionSend} className="mx-2">
          <TbSend2 size={24} />
        </button>
      </div>
    </div>
  );
};

export default InputBox;
