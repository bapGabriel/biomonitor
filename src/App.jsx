import { Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import Callback from "./components/Callback"
import Launch from "./components/Launch"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/launch" element={<Launch />} />
    </Routes>
  )
}

export default App
