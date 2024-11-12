import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SessionContext } from './context/context'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home'
import Navbar from './components/Navbar'
import InputBox from './components/InputBox'

function App() {
  const [sessionId,setSessionId]=useState();
  const [docId,setDocId]=useState();
  const [previousResponses,setPreviousResponses]=useState([]);
  const [selectedFile,setSelectedFile]=useState("");

  const obj={document:
    { docId,
      setDocId,
      selectedFile,
      setSelectedFile
       },
    session:{
      sessionId,
      setSessionId,
      previousResponses,
      setPreviousResponses
    }}
  return (
    <>
      <SessionContext.Provider value={obj}>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
      <InputBox/>
      </BrowserRouter>
      </SessionContext.Provider>
    </>
  )
}

export default App
