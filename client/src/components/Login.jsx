import React,{ useState } from "react"
import { useNavigate } from "react-router-dom";


const Login = ()=>{
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e)=>{
    e.preventDefault();
    //save username to localStorage
    localStorage.setItem("userId",username);
    setUsername("");
    //redirect to task page
    navigate('/task');
  }

  return (
    <div className="login__container">
      <form className="login__form" onSubmit={handleLogin}>
        <label htmlFor="username">Provide user name</label>
        <input
          type="text" 
          name = 'username'
          id = 'username'
          required
          onChange={(e)=> setUsername(e.target.value)}
          value = {username}
        />
        <button type="submit">SIGN IN</button>  
      </form>
    </div>
  );
}

export default Login