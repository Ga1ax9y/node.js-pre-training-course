import {
	validateCreateTodo,
	validateId,
	validateSearch,
} from "./middleware/validateTodo.js";
import * as todoService from "./services/todoService.js";
import express from "express";
import { getMetricsReport, requestLogger } from "./middleware/metrics.js";

const app = express();

app.use(express.json());

// TODO: Add routes and middleware here
const logger = (req, res, next) => {
	console.log(`\n[LOGGER] Incoming request: ${req.method} ${req.url}`);
	console.log(`[LOGGER] Timestamp: ${new Date().toISOString()}`);
	next();
};

const timer = (req, res, next) => {
	const startTime = process.hrtime.bigint();
	console.log(`[TIMER] Start timing: ${req.method} ${req.url}`);

	res.on("finish", () => {
		const endTime = process.hrtime.bigint();
		const durationMs = Number(endTime - startTime) / 1_000_000;
		console.log(`[TIMER] Request completed in ${durationMs.toFixed(3)}ms`);
	});

	next();
};

const customHeaderInjector = (req, res, next) => {
	console.log(`[HEADER] Injecting custom headers`);

	res.setHeader("X-Powered-By", "Middleware Playground");
	res.setHeader("X-Request-ID", Math.random().toString(36).substring(7));
	res.setHeader("X-Server-Time", new Date().toISOString());

	next();
};
// app.use(logger);
// app.use(timer);
app.use(requestLogger);

app.get("/", (req, res) => {
	res.send("Express ToDo App Template");
});

app.get("/todos/search", validateSearch, (req, res) => {
	const results = todoService.search(req.cleanedKeyword);
	res.json({ data: results, count: results.length });
});

app.get("/todos", (req, res) => {
	const todos = todoService.getAll();
	res.json({ data: todos, count: todos.length });
});


app.post("/todos", validateCreateTodo, (req, res) => {
	const newTodo = todoService.add(req.cleanedData);
	res.status(201).json({ data: newTodo });
});

app.patch("/todos/:id/toggle", validateId, (req, res, next) => {
	const toggled = todoService.toggleStatus(req.parsedId);
	if (!toggled)
		return next(
			new NotFoundError(`Todo with id ${req.parsedId} not found`),
		);
	res.json({ data: toggled });
});

app.put("/todos/:id", validateId, (req, res, next) => {
	const updated = todoService.update(req.parsedId, req.body);
	if (!updated)
		return next(
			new NotFoundError(`Todo with id ${req.parsedId} not found`),
		);
	res.json({ data: updated });
});

app.delete("/todos/:id", validateId, (req, res, next) => {
	const deleted = todoService.remove(req.parsedId);
	if (!deleted)
		return next(
			new NotFoundError(`Todo with id ${req.parsedId} not found`),
		);
	res.status(204).send();
});

app.get("/todos/:id", validateId, (req, res, next) => {
	const todo = todoService.getById(req.parsedId);
	if (!todo)
		return next(
			new NotFoundError(`Todo with id ${req.parsedId} not found`),
		);
	res.json({ data: todo });
});

app.get("/metrics", (req, res) => {
	res.json(getMetricsReport());
});

app.get("/users/:id", (req, res, next) => {
	const { id } = req.params;
	const { active } = req.query;

	if (!/^\d+$/.test(id)) {
		return next(new AppError("Invalid user ID format", 400));
	}

	if (active !== "true" && active !== "false") {
		return next(
			new AppError("active query parameter must be true or false", 400),
		);
	}

	const userId = Number(id);
	const isActive = active === "true";

	const statusText = isActive ? "active" : "inactive";

	res.send(`User ${userId} is ${statusText}.`);
});

app.use("*", (req, res, next) => {
	next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use((err, req, res, next) => {
	let statusCode = err.statusCode || 500;
	let message = err.message || "Internal Server Error";

	console.error("\nERROR OCCURRED:");
	console.error(`  Status: ${statusCode}`);
	console.error(`  Message: ${message}`);
	console.error(`  Path: ${req.method} ${req.originalUrl}`);
	if (err.stack) {
		console.error(`  Stack: ${err.stack}`);
	}

	const errorResponse = {
		status: statusCode,
		message: message,
		timestamp: new Date().toISOString(),
	};

	res.status(statusCode).json(errorResponse);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Express app listening on port ${PORT}`);
});

class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}

class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.statusCode = 404;
	}
}

export default app;
