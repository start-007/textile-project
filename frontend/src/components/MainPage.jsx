import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import "../styles/Mainpage.css";
function App() {
  const [message, setMessage] = useState("");
  const [hasError,setError]= useState(false)
  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((res) => res.json())
      .then(data => setMessage(data.message))
      .catch((err)=>{
        console.error(err)
        setError(true)
      });
  }, []);
  if(hasError){
    return <Navigate to="/500"/>
  }
  return (
    <>
      <h1 >Hello</h1>
      <p>{message}</p>
    </>
  );
}

export default App;
