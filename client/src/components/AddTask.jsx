import { useState } from "react";

const AddTask = ({socket})=>{
  const [task, setTask] = useState("");

  const handleAddTodo = (e)=>{
    e.preventDefault();
    //logs the tasks to the console
    // console.log({task});

    // send task to socket.io server
    socket.emit("createTask",{task});
    setTask("");
  }
  return(
    <form className="form__input" onSubmit={handleAddTodo}>
      <label htmlFor="task">Add Todo</label>
      <input type="text" className="input" name="task" id="task" required value={task} onChange={(e)=>setTask(e.target.value)}/>
      <button className="addTodoBtn" type="submit">ADD TODO</button>
    </form>
  )
}

export default AddTask