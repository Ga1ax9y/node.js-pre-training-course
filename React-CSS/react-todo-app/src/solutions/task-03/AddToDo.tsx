import React, { useState } from "react";
import { Todo } from "../../types";
import { ToDoList } from "../task-01/ToDoList";

/**
 * Task 3: AddToDo Component
 *
 * Theory: React Hooks - useState
 *
 * React Hooks are functions that allow you to "hook into" React state and lifecycle features
 * from function components. useState is the most fundamental hook for managing component state.
 *
 * useState Hook:
 * - Returns an array with two elements: [state, setState]
 * - First element is the current state value
 * - Second element is a function to update the state
 * - State updates trigger component re-renders
 *
 * State Management Best Practices:
 * 1. Never modify state directly (mutate the state object)
 * 2. Always use the setter function provided by useState
 * 3. State updates are asynchronous
 * 4. React batches state updates for performance
 * 5. Use functional updates when new state depends on previous state
 *
 * Event Handling in React:
 * - Use camelCase for event handlers (onClick, onChange, onSubmit)
 * - Event handlers receive a synthetic event object
 * - Prevent default behavior with event.preventDefault()
 * - Access input values through event.target.value
 *
 * Key Concepts:
 * - State is component-specific and isolated
 * - State changes cause re-renders
 * - Use controlled components for form inputs
 * - Handle form submission properly
 */
export const AddToDo: React.FC = () => {
	// TODO: Implement the AddToDo component
	//
	// Requirements:
	// 1. Create a controlled input field for todo title
	// 2. Add a button to submit the new todo
	// 3. Handle form submission (prevent default behavior)
	// 4. Clear the input after adding a todo
	// 5. Don't add empty todos
	//
	// Example implementation:
	const [inputValue, setInputValue] = useState("");
	const [todos, setTodos] = useState<Todo[]>([]);
  const [id, setId] = useState<number>(1)

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputValue.trim() === '' || !inputValue){
      return;
    }
    setTodos((prevTodos) => [...prevTodos, { id, title: inputValue.trim(), completed: false }]);
    setId((prevId) => prevId + 1);
    setInputValue('')
  }
	return (
		<div>
			<form onSubmit={submitForm}>
        <input type="text" value={inputValue} placeholder="add todo" onChange={(e)=> {setInputValue(e.target.value)}}/>
        <button type="submit">Add</button>
			</form>
      <ToDoList todos={todos} />
		</div>
	);
};
