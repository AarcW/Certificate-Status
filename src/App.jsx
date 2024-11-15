import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';  
import History from './Pages/History'; 
import Navbar from './Navbar';
import Transcript from './Pages/Transcript';
import Gradesheet from './Pages/Gradesheet';
// const google = window.google;



function App() {
  

  return (
    <>
      
        <Navbar />
        <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />  {/* Home page */}
          <Route path="/history" element={<History />} />  {/* History page */}
          <Route path="/transcript" element={<Transcript />} />  {/* Transcript page */}
          <Route path="/gradesheet" element={<Gradesheet />} />  {/* Gradesheet page */}
        </Routes>
        </div>
      <br />
      
      

    </>

  )
}

export default App
