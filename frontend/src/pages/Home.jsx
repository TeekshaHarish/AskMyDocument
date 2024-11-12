import React, { useContext } from 'react';
import { SessionContext } from '../context/context';
import { ToastContainer } from 'react-toastify';

const Home = () => {
  // Destructure context values for document and session from SessionContext
  const { document, session } = useContext(SessionContext);
  const { docId, setDocId, selectedFile, setSelectedFile } = document;
  const { sessionId, setSessionId, previousResponses, setPreviousResponses } = session;

  return (
    <>
      <div className='lg:w-2/3 mx-auto mt-9'>
        {/* Page heading */}
        <h3 className='text-center font-bold'>
          Ask any questions you might have about the PDF uploaded
        </h3>

        {/* Display previous Q&A responses */}
        {previousResponses.map((pair, idx) => (
          <div key={idx} className='flex flex-col'>
            {/* User's question display */}
            <div className='bg-gray-100 flex gap-2 justify-self-start rounded-md border-2 px-3 m-3 shadow-lg'>
              <div className='mx-3 my-2'>
                <div className='rounded-full bg-purple-500 text-white px-3 py-3 align-top shadow-md'>
                  You
                </div>
              </div>
              <div className='my-3 mx-2'>
                {pair.Q}
              </div>
            </div>

            {/* AI's answer display */}
            <div className='bg-gray-100 flex gap-2 justify-self-end rounded-md border-2 px-3 m-3 shadow-lg'>
              <div className='mx-3 my-2'>
                <div className='rounded-full bg-green-500 text-white px-4 py-3 items-start shadow-md'>
                  AI
                </div>
              </div>
              <div className='my-3 mx-2'>
                {pair.A}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Include ToastContainer for notifications */}
      <ToastContainer />
    </>
  );
};

export default Home;
