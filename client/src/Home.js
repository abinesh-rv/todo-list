import {BiTask,BiTaskX} from "react-icons/bi"
import {AiFillCloseCircle,AiOutlinePlusCircle,AiOutlineCloseCircle} from "react-icons/ai"
import { useState,useEffect} from "react";
import {RiTodoLine} from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'


function App() {
  const [todos,settodos] = useState([]);
  const [popupactive,setpopupactive] = useState(false);
  const [newtodo,setnewtodo] = useState("")
  const [users,setUsers] = useState("empty")
  
  const Navigate = useNavigate()
     
  useEffect(() => {
    if(!Cookies.get("user")){
       Navigate("/login")
    }else{
    setUsers(JSON.parse(Cookies.get("user")))
    }
  },[])

  useEffect(() => {
    if(users !== "empty"){
      GetTodo() 
    }
  },[users])

  
  const GetTodo = () => {
    fetch(process.env.REACT_APP_API_BASE + `/todos/${users._id}`)
      .then(res => res.json())
      .then(data => settodos(data))
      .catch(err => console.log("Error : ",err));
  }
          
  const completeclick = async (id) => {
      const data = await fetch(process.env.REACT_APP_API_BASE + `/todo/complete/` + id)
         .then(res => res.json());

      settodos(todos => todos.map(todo => {
        if(todo._id === data._id){
          todo.complete=data.complete
        }
        return todo;
      }))
  }
  
  const deletetodo = async (id) => {
    const data = await fetch(process.env.REACT_APP_API_BASE + `/todo/delete/` + id ,{method : "DELETE"})
        .then(res => res.json())

    settodos(todos => todos.filter(todo => todo._id !== data._id))
  }
  
  const addtodo = async (id) => {
    const data = await fetch(process.env.REACT_APP_API_BASE + `/todo/new/${users._id}`,{
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
   
  const handleLogOut = () => {
    Cookies.remove("user")
    Navigate("/login")
  }
  
  return (
    <div className="App"> 
      <div className="flex justify-between items-center bg-white">
        <div className="flex gap-2 items-center p-4">
        <RiTodoLine size={30}/>
        <div className="uppercase text-cyan-800 text-2xl font-bold">Rv Todo</div> 
        </div> 
        <div onClick={handleLogOut} className='h-fit p-2 rounded-md uppercase cursor-pointer mr-4 font-semibold bg-cyan-400 hover:bg-[#263238] hover:text-white'>Logout</div>
      </div>
      <div className={`bg-[#070b21] h-fit  w-full text-cyan-400 p-5`}>
         <div className="text-[3rem] font-bold pb-5 text-center">Hello <span className="capitalize">{users.username}</span></div>
         <div className="tracking-wider text-[2rem] pb-5 text-center font-medium text-cyan-400 text-opacity-50 uppercase">Todo task</div>
                                                                            
          <div className="space-y-5">
          {todos.map(todo => (
                 <div className="flex items-center max-w-[600px]  justify-between bg-white p-3 mx-auto rounded-md text-cyan-800 font-semibold cursor-pointer" key={todo._id}  >
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
          <div className="text-[1.2rem] text-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 ring-4 ring-cyan-900 w-[200px]  md:w-[400px]  bg-white rounded-md flex flex-col gap-4  text-cyan-900">
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
