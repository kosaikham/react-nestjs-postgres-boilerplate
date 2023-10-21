import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [greeting, setGreeting] = useState(null);

  useEffect(() => {
    try {
      fetch("/api")
        .then((response) => response.json())
        .then((result) => setGreeting(result.data));
    } catch (e) {
      console.error("e is ", e);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* Read from backend */}
        {greeting ? JSON.stringify(greeting) : "Loading..."}
      </header>
    </div>
  );
}

export default App;
