import React, { useEffect, useState} from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
  );
}, []);

  return (
  <Router>
    <div>
      <Routes>
        <Route exact path='/'>
          {(typeof backendData.users === 'undefined') ? (
          <p>Loading... </p>
          ) : (
          backendData.users.map((user,i) => (
            <p key={i}>{user}</p>)
            ))
          }
        </Route>
      </Routes>
    </div>
  </Router>
  );
}

export default App;
