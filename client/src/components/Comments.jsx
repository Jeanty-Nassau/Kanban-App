import socketIO from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';

const socket = socketIO.connect('http://localhost:4000');

const Comments = ()=>{
  const {category, id} = useParams();
  const [comment, setComment] = useState("");
  const [commentList,setCommentList] = useState([]);

  // listens to the comments event
  useEffect(()=>{
    socket.on('comments',(data)=>setCommentList(data));
  },[]);

  useEffect(()=>{
    socket.emit('fetchComments',{category, id});
  },[category, id]);

  const addComment = (e)=>{
    e.preventDefault();
    // console.log({
    //   comment,
    //   userId: localStorage.getItem('userId'),
    // });

    socket.emit("addComment",{
      comment,
      category,
      id,
      userId:localStorage.getItem('userId'),
    })
    setComment("");
  }
  return(
    <div className="comments__container">
      <form className='Comment__form' onSubmit={addComment}>
        <label htmlFor="comment">Add a comment</label>
        <textarea 
          placeholder='Type your comment...' 
          name="comment" 
          id="comment" 
          rows={5} 
          value = {comment}
          onChange = {(e)=>setComment(e.target.value)} 
          required
        ></textarea>
        <button type="submit" className='commentBtn'>ADD COMMENT</button>
      </form>

      <div className="comments__section">
        <h2>Existing comments</h2>
        {commentList.map((comment)=>(
          <div key ={comment.id}>
            <p>
              <span style = {{fontWeight:'bold'}}>
                {comment.text}{" "}
              </span>
              by{" "}{comment.name} 
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments