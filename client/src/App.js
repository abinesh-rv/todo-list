import {BiTask,BiTaskX,BiLogOutCircle} from "react-icons/bi"
import {AiFillCloseCircle,AiOutlinePlusCircle,AiOutlineCloseCircle} from "react-icons/ai"
import { useState,useEffect } from "react";
import {RiTodoLine} from "react-icons/ri";

const API_BASE = "http://localhost:4040";

function App() {
  const [todos,settodos] = useState([]);
  const [popupactive,setpopupactive] = useState(false);
  const [newtodo,setnewtodo] = useState("")

  useEffect(() => {
    GetTodo();
  })

  const GetTodo = () => {
    fetch(API_BASE + "/todos")
      .then(res => res.json())
      .then(data => settodos(data))
      .catch(err => console.log("Error : ",err));
  }

  const completeclick = async (id) => {
      const data = await fetch(API_BASE + "/todo/complete/" + id)
         .then(res => res.json());

      settodos(todos => todos.map(todo => {
        if(todo._id === data._id){
          todo.complete=data.complete
        }
        return todo;
      }))
  }

  const deletetodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/delete/" + id,{method : "DELETE"})
        .then(res => res.json())

    settodos(todos => todos.filter(todo => todo._id !== data._id))
  }

  const addtodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/new",{
    method:"POST",
    headers:{
      "Content-Type" : "application/json"
    },
    body:JSON.stringify({
      text:newtodo
    })
    }).then(res => res.json())
    
    settodos([...todos,data])

    setpopupactive(false)

    setnewtodo("")

  }

  return (
    <div className="App">
      <div className="flex gap-2 items-center p-4">
      <RiTodoLine size={30}/>
      <div className="uppercase text-cyan-800 text-2xl font-bold">Rv Todo</div>  
      </div>
      <div className="bg-[#070b21] h-[100vh] max-h-full w-full text-cyan-400 p-5">
         <div className="text-[3rem] font-bold pb-5">Hello...</div>
         <div className="tracking-wider text-[2rem] pb-5 text-center font-medium text-cyan-400 text-opacity-50 uppercase">Todo task</div>

          <div>
          {todos.map(todo => (
                 <div className="flex items-center max-w-[600px] justify-between bg-white p-3 mx-auto rounded-md text-cyan-800 font-semibold cursor-pointer" key={todo._id}  >
                   <div onClick={() => completeclick(todo._id)}>{todo.complete ? <BiTaskX size="25"/> : <BiTask size="25"/>}</div>
                   <div onClick={() => completeclick(todo._id)} className={"text-[1.3rem]" + (todo.complete ? " line-through" : "")}>{todo.text}</div>
                   <div onClick={() => deletetodo(todo._id)}>
                      <AiFillCloseCircle size="25"/>
                   </div>
                 </div>
          ))}
          </div>
           <div className="p-5 cursor-pointer w-fit mx-auto" onClick={() => setpopupactive(true)}><AiOutlinePlusCircle size="50"/></div>
          
          {popupactive ? (
          <div className="text-[1.2rem] text-center mx-auto border-2 ring-4 ring-cyan-900  w-[400px]  bg-white rounded-md flex flex-col gap-4  text-cyan-900">
            <div onClick={() => setpopupactive(false)} className="cursor-pointer self-end"><AiOutlineCloseCircle size="30" /></div>
            <div className="mx-3 ">Add Task</div>
            <input 
              onChange={(e) => setnewtodo(e.target.value)}
              value={newtodo}
              className="mx-3 border-2 rounded-md border-cyan-900 p-1 text-sm"
            />
            <button onClick={addtodo} className="uppercase bg-cyan-400 w-fit self-center px-5 rounded-t-md inline hover:bg-[#070b21] hover:text-white">Add</button>
          </div>
          ) : ""}
      </div>
    </div>
  );
}

export default App;
