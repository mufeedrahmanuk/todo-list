'use client';
import { useState, useRef, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { FaCheck, FaTrashAlt } from "react-icons/fa";

export interface ITodo {
  id: number;
  title: string;
  completed: boolean;
}

const Todo = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [todoName, setTodoName] = useState<string>("");
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [editTodoValue, setEditTodoValue] = useState<string>("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [todos]);

  useEffect(() => {
    if (selectedTodoId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedTodoId]);

  const addTodo = () => {
    if (!todoName.trim()) return;
    const newTodo = {
      id: Math.random(),
      title: todoName,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setTodoName("");
    localStorage.setItem("todos", JSON.stringify([...todos, newTodo]));
  };

  const deleteTodo = (id: number) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const toggleTodo = (id: number) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }
      return todo;
    });
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const handleCheckboxClick = (id: number) => {
    setSelectedTodoId(id);
    setEditTodoValue(todos.find((todo) => todo.id === id)?.title || "");
  };

  const handleEditClick = () => {
    if (!editTodoValue.trim()) return;
    const updatedTodos = todos.map((todo) => {
      if (todo.id === selectedTodoId) {
        return {
          ...todo,
          title: editTodoValue,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setEditTodoValue("");
    setSelectedTodoId(null);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleDeleteClick = (id: number) => {
    deleteTodo(id);
    setSelectedTodoId(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTodo();
    }
  };

  return (
    <div className="h-screen flex justify-center items-center flex-col space-y-10 relative">
      <img src={"/bg.jpg"} alt="bgimage" className="h-screen w-full object-cover absolute inset-0" />
      <div className="border rounded-lg backdrop-blur w-[350px] sm:w-[400px] px-4 py-4 max-h-full overflow-auto mt-20">
        <div className="p-4 flex flex-col space-y-2 text-black">
          <textarea
            ref={inputRef}
            className="border border-gray-300 p-2 rounded"
            placeholder="Enter your todo"
            value={todoName}
            onChange={(e) => setTodoName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
            onClick={addTodo}
          >
            Add Todo
          </button>
        </div>
        <div ref={scrollRef} className="flex flex-col w-full max-h-full overflow-auto">
          {todos.length === 0 && (
            <div className="text-center text-gray-500 py-4">No todos yet. Add a task to get started!</div>
          )}
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex justify-between items-center p-4 my-2 rounded-lg ${todo.completed ? "bg-green-100" : "bg-gray-200"}`}
            >
              <input
                type="checkbox"
                className="mr-4"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                onClick={() => handleCheckboxClick(todo.id)}
              />
              {selectedTodoId === todo.id ? (
                <input
                  type="text"
                  className="border border-gray-300 p-2 flex-1 rounded"
                  value={editTodoValue}
                  onChange={(e) => setEditTodoValue(e.target.value)}
                  autoFocus
                />
              ) : (
                <div
                  className={`flex-1 text-lg font-semibold ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.title}
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
                  onClick={handleEditClick}
                  style={{
                    display: selectedTodoId === todo.id ? "block" : "none",
                  }}
                >
                  <FaCheck size={20} />
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full"
                  onClick={() => handleDeleteClick(todo.id)}
                >
                  <FaTrashAlt size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Todo;
