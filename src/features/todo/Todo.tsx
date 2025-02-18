import React, { useEffect, useState } from 'react';
import "./todo.css";
import { motion } from "framer-motion";

type TodoT = {
    text: string;
    id: string;
}

export default function Todo() {
    const [text, setText] = useState("");
    const [todos, setTodos] = useState([] as TodoT[]);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const [removedTodos, setRemovedTodos] = useState([] as TodoT[]);

    function createTodo() {
        const findIndex = todos.find(i => i.text === text);
        if (findIndex) {
            setError("Cannot add duplicate todo.");
            setShowError(true);
            return;
        }
        if (text === "") {
            setError("Cannot add empty todo.");
            setShowError(true);
            return;
        }
        const id = Array(10).fill(0)
            .map(_ => 97 + Math.floor(Math.random() * 26))
            .map(i => String.fromCharCode(i))
            .join('');
        const todo = { text, id };

        setTodos([...todos, todo]);
        setText("");
    }

    function removeTodo(id: string) {
        const index = todos.findIndex(i => i.id === id);
        setRemovedTodos([...removedTodos, todos[index]]);
        const newTodos = [...todos.slice(0, index), ...todos.slice(index + 1)];
        setTodos(newTodos);
    }

    function reAddTodo(id: string) {
        const index = removedTodos.findIndex(i => i.id === id);
        setTodos([...todos, removedTodos[index]]);
        const newRemovedTodos = [...removedTodos.slice(0, index), ...removedTodos.slice(index + 1)];
        setRemovedTodos(newRemovedTodos);
    }

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
        setTodos(storedTodos);

        const storedRemovedTodos = JSON.parse(localStorage.getItem("removedTodos") || "[]");
        setRemovedTodos(storedRemovedTodos);
    }, []);

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
        localStorage.setItem("removedTodos", JSON.stringify(removedTodos));
    }, [todos, removedTodos]);

    return (
        <div className={"todo-container"}>
            <motion.h1
            // initial={{scale: 0.5, y: -200}}
            // animate={{scale: 2, y: 0}}
            // transition={{duration: 1, ease: "linear", type: "tween"}}
            >
                Todos
            </motion.h1>
            <div className={"error-container"}>
                {
                    showError &&
                    <div className={"error-message"}>
                        {error}
                        <button onClick={() => setShowError(false)}>X</button>
                    </div>
                }
            </div>
            <div className={"input-container"}>
                <label htmlFor={text}>
                    <input name="text"
                        id="text"
                        type={"text"}
                        value={text}
                        onChange={e => {
                            setText(e.target.value);
                            setShowError(false);
                        }} />
                </label>
                <div>
                    <button type="button" onClick={() => createTodo()}>Add</button>
                </div>
            </div>
            {todos.length > 0 &&
                <TodoList
                    todos={todos}
                    onTodoClick={removeTodo}
                    key={"todos"}
                    name={"todos"} />
            }
            {removedTodos.length > 0 &&
                <TodoList
                    todos={removedTodos}
                    onTodoClick={reAddTodo}
                    key={"removedTodos"}
                    name={"removed-todos"} />
            }
        </div>
    );
}

type TodoListPropsT = {
    todos: TodoT[];
    onTodoClick: Function;
    name: string;
}

function TodoList(props: TodoListPropsT) {
    const { todos, onTodoClick, name } = props;
    return (
        <div key={`todos-${name}`}>
            <h2>{name}</h2>
            <div className={"todo-list"}>
                {todos.map((todo: TodoT, todoIndex: number) =>
                    <TodoItem key={`todo-item-${name}-${todoIndex}`}
                        todo={todo}
                        onTodoClick={onTodoClick}
                        todoIndex={todoIndex}
                    />
                )}
            </div>
        </div>
    );
}

type TodoItemPropsT = {
    todo: TodoT;
    onTodoClick: Function;
    todoIndex: number;
}

function TodoItem(props: TodoItemPropsT) {
    const { todo, onTodoClick, todoIndex } = props;
    return (
        <motion.div className={"todo"}
            key={todo.id}
            data-key={todo.id}
            onClick={_ => onTodoClick(todo.id)}
            initial={
                {
                    opacity: 0,
                    y: -100
                }}
            animate={
                {
                    opacity: 1,
                    y: 0
                }}
            transition={
                {
                    duration: (todoIndex + 1) * 0.2,
                }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.2 }}
        >
            {todo.text}
        </motion.div>
    );
}
