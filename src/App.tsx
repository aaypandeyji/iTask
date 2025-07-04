import React, { useState, useEffect } from 'react'
import Navbar from './Components/Navbar';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

type Todo = {
  id: string;
  todo: string;
  todos?: string;
  isCompleted: boolean;
};


function App() {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showFinished, setShowFinished] = useState(true)

  useEffect(() => {
    if(localStorage.getItem("todos") !== null) {
      const todoData = localStorage.getItem("todos") || "[]";

      let todoString = JSON.parse(todoData);
      if (todoString) {
        let todos = JSON.parse(todoData)
        setTodos(todos)
      }
    }
  }, [])


  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  const toggleFinished = () => {
    setShowFinished(!showFinished)
  }




  const handleEdit = (id:string) => {
    let t = todos.filter(i => i.id === id)
    setTodo(t[0].todo)
    let newTodos = todos.filter(item => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS();
  }

  const handleDelete = (id:string) => {
    let newTodos = todos.filter(item => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS();
  }

  const handleAdd = () => {
    //1st method
    // const todosArray = [...todos]
    // todosArray.push({ id: uuidv4(), todo, isCompleted: false })
    // setTodos(todosArray);

    //2nd method
    // setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
    setTodos(prev => [...prev, { id: String(uuidv4()), todo, isCompleted: false }])

    setTodo("");
    saveToLS();
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement >) => {
    setTodo(e.target.value);
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement >) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id;
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS();
  }


  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-1/2">
        <h1 className="font-bold text-center text-3xl">iTask - Manage your todos at one place</h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <div className="flex">
            <input onChange={handleChange} value={todo} type="text" className='w-full rounded-full px-5 py-2' />
            <button onClick={handleAdd} disabled={todo.length < 3} className='bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white'>Save</button>
          </div>
        </div>
        <input className="my-4" id='show' onChange={toggleFinished} type='checkbox' checked={showFinished} />
        <label htmlFor="show" className="mx-2">Show Finished</label>
        <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>
        <h2 className="text-2xl font-bold">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}
          {todos.map(item => {

            return (showFinished || !item.isCompleted) && <div key={item.id} className={"todo flex my-3 justify-between"}>
              <div className="flex gap-5">
                <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} id='' />
                <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
              </div>
              <div className="button flex h-full">
                <button onClick={() => handleEdit(item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
                <button onClick={() => { handleDelete(item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><MdDelete /></button>
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default App
