import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importing toastify styles
import '../../public/globals.css'; // Import custom global styles
import FileUploadForm from './FileUploadForm'; // Import the file upload form component

const Navbar = () => {
  return (
    <>
      {/* Navbar Container */}
      <nav className='w-100 border-2 shadow-lg bg-slate-400 flex justify-between px-5 py-4'>
        {/* Navbar Logo / Title */}
        <div className='font-bold flex items-center'>
          AI Summarizer
        </div>

        {/* File Upload Form Component */}
        <FileUploadForm />
      </nav>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right" // Position of the toast
        autoClose={3000} // Auto-close after 3 seconds
        hideProgressBar={false} // Show progress bar
        newestOnTop={false} // New toasts appear at the bottom
        closeOnClick // Close on clicking the toast
        rtl={false} // No right-to-left layout
        pauseOnFocusLoss // Pause toast when focus is lost
        draggable // Allow dragging the toast
        pauseOnHover // Pause toast on hover
        limit={3} // Limit to 3 concurrent toasts
        className="custom-toast-container" // Custom class for styling
      />
    </>
  );
};

export default Navbar;
