import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import './App.css'
import Login from './components/Login'
import Comments from './components/Comments'
import Task from './components/Task'



function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path = '/comments/:category/:id' element={<Comments/>}/>
        <Route path = '/task' element={<Task/>}/>
        <Route path = '/' element={<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App
