import React, { useState } from "react";
import { Todo } from "../../types";

/**
 * Task 5: FilteredToDoList Component
 *
 * Theory: Derived State and Computed Values
 *
 * In React, you often need to compute values based on your state. These are called "derived state"
 * or "computed values" and should be calculated during render rather than stored in state.
 *
 * Why Use Derived State:
 * 1. Avoids state synchronization issues
 * 2. Reduces complexity by having a single source of truth
 * 3. Automatically updates when source data changes
 * 4. Prevents stale state bugs
 *
 * Common Derived State Patterns:
 *
 * Filtering:
 * const activeTodos = todos.filter(todo => !todo.completed)
 * - const completedTodos = todos.filter(todo => todo.completed)
 *
 * Searching:
 * - const filteredTodos = todos.filter(todo =>
 *     todo.title.toLowerCase().includes(searchTerm.toLowerCase())
 *   )
 *
 * Sorting:
 * - const sortedTodos = [...todos].sort((a, b) => a.title.localeCompare(b.title))
 *
 * Aggregations:
 * - const completedCount = todos.filter(todo => todo.completed).length
 * - const totalCount = todos.length
 *
 * Multiple Filters:
 * - Use multiple filter conditions or combine them
 * - Consider using useMemo for expensive computations
 *
 * Key Concepts:
 * - Calculate derived values during render
 * - Don't store computed values in state
 * - Use useMemo for expensive calculations
 * - Keep state minimal and derive the rest
 */
export const FilteredToDoList: React.FC = () => {
	// TODO: Implement the FilteredToDoList component
	//
	// Requirements:
	// 1. Display a list of todos with add functionality
	// 2. Add filter buttons: "All", "Active", "Completed"
	// 3. Filter todos based on selected filter
	// 4. Use derived state for filtered results
	// 5. Add complete functionality for todos
	//
	// Example implementation:
	const [inputValue, setInputValue] = useState("");
	const [todos, setTodos] = useState<Todo[]>([]);
	const [id, setId] = useState<number>(1);
	const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

	const filteredTodos = todos.filter((todo) => {
		if (filter === "active") return !todo.completed;
		if (filter === "completed") return todo.completed;
		return true; // 'all' case
	});
	const markCompleted = (id: number) => {
		setTodos(
			todos.map((todo) =>
				todo.id === id ? { ...todo, completed: true } : todo,
			),
		);
	};

	const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (inputValue.trim() === "" || !inputValue) {
			return;
		}
		setTodos((prevTodos) => [
			...prevTodos,
			{ id, title: inputValue.trim(), completed: false },
		]);
		setId((prevId) => prevId + 1);
		setInputValue("");
	};

	return (
		<div>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
			<form onSubmit={submitForm}>
				<input
					type="text"
					value={inputValue}
					placeholder="add todo"
					onChange={(e) => {
						setInputValue(e.target.value);
					}}
				/>
				<button type="submit">Add</button>
			</form>
			<ul>
				{filteredTodos.map((todo) => {
					return (
						<li key={todo.id}>
							<span>{todo.title}</span> (
							{todo.completed ? (
								<span className="todo-completed">
									completed
								</span>
							) : (
								<span className="todo-not-completed">
									not completed
								</span>
							)}
							)
							<button onClick={() => markCompleted(todo.id)}>
								Complete
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};
