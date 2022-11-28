
const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http,{
  cors:{
    origin: 'http://localhost:5173'
  }
});

app.use(cors());

socketIO.on('connection', (socket)=>{
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('createTask', (data)=>{
    // construct an object according to the data structure
    const newTask = {id: fetchID(), title: data.task, comments: []};

    // add task to pending category
    tasks["pending"].items.push(newTask);

    // fire the tasks event for update
    socket.emit('tasks', tasks);
  });

  socket.on('taskDragged',(data) =>{
    const {source, destination} = data;

    // Get item that was dragged
    const itemMoved = {...tasks[source.droppableId].items[source.index],};
    console.log("DraggedItem>>> ",itemMoved);

    // Remove item from its source
    tasks[source.droppableId].items.splice(source.index, 1);

    // Add item to its destination using destination index
    tasks[destination.droppableId].items.splice(destination.index, 0, itemMoved);

    // Send updated tasks object to the React App
    socket.emit("tasks", tasks);

    /**
     * console.log("Source >>>", tasks[source.droppableId].items);
     * console.log("Destination >>>", tasks[destination.droppableId].items);
     */
  });

  socket.on("addComment",(data)=>{
    const {category, userId, comment, id} = data;

    // get the items in the tasks category
    const taskItems = tasks[category].items;

    // loop throgh list to find matching Id
    for (let i = 0; i < taskItems.length; i++) {
      if(taskItems[i].id === id){
        // add comment to list of comments under the item (task)
        taskItems[i].comments.push({
          name:userId,
          text:comment,
          id: fetchID(),
        });
        
        // send new event to the React app
        socket.emit("comments", taskItems[i].comments);
      } 
    }
  });

  socket.on('fetchComments', (data)=>{
    const {category, id} = data;
    const taskItems = tasks[category].items;
    for (let i = 0; i < taskItems.length; i++) {
      if(taskItems[i].id === id){
        socket.emit('comments', taskItems[i].comments);
      } 
    }
  });

  socket.on('disconnect', ()=>{
    socket.disconnect()
    console.log('🔥: A user disconnected');
  });
});

// Generate random string
const fetchID = () => Math.random().toString(36).substring(2,10);

let tasks = {
  pending:{
    title: "pending",
    items:[
      {
        id: fetchID(),
        title: "Send the Figma file to Dima",
        comments:[],
      },
    ],
  },
  ongoing:{
    title:"ongoing",
    items:[
      {
        id: fetchID(),
        title: "Review Github issues",
        comments: [
          {
            name: "David",
            text: "Ensure you review before merging",
            id: fetchID(),
          },
        ],
      },
    ],
  },
  completed: {
    title: "completed",
    items:[
      {
        id: fetchID(),
        title: "Create technical contents",
        comments: [
          {
            name: "Dima",
            text: "Make sure you check the requirements",
            id: fetchID(),
          },
        ],
      },
    ],
  },
};

app.get('/api',(req,res)=>{
  res.json(tasks);
});

http.listen(PORT,()=>{
  console.log(`Server is listening on ${PORT}`);
});
