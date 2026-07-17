/**
 * task-05.js
 * Extend your Task 04 server by adding EventEmitter functionality,
 * logging, analytics, and new endpoints.
 *
 * Implement all TODOs below.
 */

const http = require("http");
const url = require("url");
const { EventEmitter } = require("events");

// ---------- Utilities ----------

function sendJson(res, status, body) {
	const data = JSON.stringify(body);
	res.writeHead(status, {
		"Content-Type": "application/json; charset=utf-8",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	});
	res.end(data);
}

function parseIdFromPath(pathname) {
	const m = pathname.match(/^\/todos\/(\d+)$/);
	return m ? Number(m[1]) : null;
}

async function parseBody(req) {
	return new Promise((resolve, reject) => {
		let data = "";
		req.on("data", (chunk) => (data += chunk));
		req.on("end", () => {
			if (!data) return resolve({});
			try {
				const json = JSON.parse(data);
				resolve(json);
			} catch (e) {
				reject(new Error("Invalid JSON"));
			}
		});
		req.on("error", reject);
	});
}

function nowISO() {
	return new Date().toISOString();
}

function getRequestInfo(req) {
	return {
		method: req.method,
		url: req.url,
		userAgent: req.headers["user-agent"] || "unknown",
		ip: req.socket.remoteAddress || "unknown",
	};
}

// ---------- Analytics ----------

class AnalyticsTracker {
	constructor() {
		this.stats = {
			totalCreated: 0,
			totalUpdated: 0,
			totalDeleted: 0,
			totalViews: 0,
			errors: 0,
			dailyStats: {},
		};
	}
	_bumpDaily(field) {
		// TODO: implement daily stats tracking
		// - use YYYY-MM-DD date keys
		// - track created, updated, deleted, views per day
		const today = new Date().toISOString().split("T")[0];
		if (!this.stats.dailyStats[today]) {
			this.stats.dailyStats[today] = {
				created: 0,
				updated: 0,
				deleted: 0,
				views: 0,
			};
		}
		if (this.stats.dailyStats[today][field] !== undefined) {
			this.stats.dailyStats[today][field]++;
		}
	}
	trackCreated() {
		this.stats.totalCreated++;
		this._bumpDaily("created");
	}
	trackUpdated() {
		this.stats.totalUpdated++;
		this._bumpDaily("updated");
	}
	trackDeleted() {
		this.stats.totalDeleted++;
		this._bumpDaily("deleted");
	}
	trackViewed() {
		this.stats.totalViews++;
		this._bumpDaily("views");
	}
	trackError() {
		this.stats.errors++;
	}
	getStats() {
		return this.stats;
	}
}

// ---------- Console Logger ----------
class ConsoleLogger {
	todoCreated(data) {
		console.log(
			`📝 [${data.timestamp}] Created "${data.todo.title}" (ID: ${data.todo.id})`,
		);
	}
	todoUpdated(data) {
		console.log(
			`✏️  [${data.timestamp}] Updated ID ${
				data.newTodo.id
			}; changed: ${data.changes.join(", ")}`,
		);
	}
	todoDeleted(data) {
		console.log(
			`🗑️  [${data.timestamp}] Deleted "${data.todo.title}" (ID: ${data.todo.id})`,
		);
	}
	todoViewed(data) {
		console.log(`👁️  [${data.timestamp}] Viewed ID ${data.todo.id}`);
	}
	todosListed(data) {
		console.log(`📃 [${data.timestamp}] Listed todos count=${data.count}`);
	}
	todoNotFound(data) {
		console.warn(
			`⚠️  [${data.timestamp}] Not found: id=${data.todoId} op=${data.operation}`,
		);
	}
	validationError(data) {
		console.error(
			`❌ [${data.timestamp}] Validation error: ${data.errors.join(", ")}`,
		);
	}
	serverError(data) {
		console.error(
			`💥 [${data.timestamp}] Server error in ${data.operation}: ${
				data.error && data.error.message
			}`,
		);
	}
}

// ---------- Validation ----------
function validateTodoPayload(payload, isCreate = false) {
	const errors = [];
	const out = {};

	// TODO: implement full validation logic
	// - title: required, non-empty string
	// - description: optional, string
	// - completed: optional, boolean (default false)

	if (isCreate || payload.hasOwnProperty("title")) {
		if (
			!payload.hasOwnProperty("title") ||
			typeof payload.title !== "string" ||
			payload.title.trim().length === 0
		) {
			errors.push("Title is required and must be a non-empty string");
		} else if (payload.title.length > 100) {
			errors.push("Title cannot exceed 100 characters");
		} else {
			out.title = payload.title.trim();
		}
	}

	if (payload.hasOwnProperty("description") && payload.description !== null) {
		if (typeof payload.description !== "string") {
			errors.push("Description must be a string");
		} else if (payload.description.length > 500) {
			errors.push("Description cannot exceed 500 characters");
		} else {
			out.description = payload.description.trim();
		}
	} else if (isCreate) {
		out.description = null;
	}

	if (payload.hasOwnProperty("completed")) {
		if (typeof payload.completed !== "boolean") {
			errors.push("Completed must be a boolean");
		} else {
			out.completed = payload.completed;
		}
	} else if (isCreate) {
		out.completed = false;
	}

	return { errors, values: out };
}

class TodoServer extends EventEmitter {
	constructor(port = 3000) {
		super();
		this.port = port;
		this.todos = [];
		this.nextId = 1;

		// TODO: initialize analytics tracker
		// TODO: initialize logger
		// TODO: initialize recent events list keeping last 100 events
		this.analytics = new AnalyticsTracker();
		this.logger = new ConsoleLogger();
		this.recentEvents = [];
		this.server = null;

		this._wireDefaultListeners();
	}

	_wireDefaultListeners() {
		const remember = (eventType) => (data) => {
			this.recentEvents.push({ eventType, timestamp: nowISO(), data });
			if (this.recentEvents.length > 100) this.recentEvents.shift();
		};
		// Remember all key events for /events
		[
			"todoCreated",
			"todoUpdated",
			"todoDeleted",
			"todoViewed",
			"todosListed",
			"todoNotFound",
			"validationError",
			"serverError",
		].forEach((evt) => this.on(evt, remember(evt)));

		// Logging
		this.on("todoCreated", (d) => this.logger.todoCreated(d));
		this.on("todoUpdated", (d) => this.logger.todoUpdated(d));
		this.on("todoDeleted", (d) => this.logger.todoDeleted(d));
		this.on("todoViewed", (d) => this.logger.todoViewed(d));
		this.on("todosListed", (d) => this.logger.todosListed(d));
		this.on("todoNotFound", (d) => this.logger.todoNotFound(d));
		this.on("validationError", (d) => this.logger.validationError(d));
		this.on("serverError", (d) => this.logger.serverError(d));

		// Analytics
		this.on("todoCreated", () => this.analytics.trackCreated());
		this.on("todoUpdated", () => this.analytics.trackUpdated());
		this.on("todoDeleted", () => this.analytics.trackDeleted());
		this.on("todoViewed", () => this.analytics.trackViewed());
		this.on("validationError", () => this.analytics.trackError());
		this.on("serverError", () => this.analytics.trackError());
	}

	/**
	 * Start the server
	 */
	async start() {
		return new Promise((resolve, reject) => {
			this.server = http.createServer((req, res) =>
				this._handleRequest(req, res),
			);

			this.server.listen(this.port, () => {
				console.log(
					`=== Todo Server with Events Started on port ${this.port} ===`,
				);
				resolve();
			});

			this.server.on("error", (err) => {
				reject(err);
			});
		});
	}

	/**
	 * Stop the server
	 */
	async stop() {
		return new Promise((resolve) => {
			if (this.server) {
				this.server.close(() => {
					resolve();
				});
			} else {
				resolve();
			}
		});
	}

	/**
	 * Handle incoming requests
	 */
	async _handleRequest(req, res) {
		// TODO: implement CORS preflight handling
		// TODO: implement routes:
		// - /todos (GET, POST)
		// - /todos/:id (GET, PUT, DELETE)
		// - /analytics (GET)
		// - /events (GET)
		// TODO: emit events for CRUD, errors, validation, etc.
		// TODO: send JSON responses with proper status codes
		const parsedUrl = url.parse(req.url, true);
		const pathname = parsedUrl.pathname;
		const method = req.method;
		const requestInfo = getRequestInfo(req);

		if (method === "OPTIONS") {
			res.writeHead(204, {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			});
			return res.end();
		}

		try {
			if (method === "GET" && pathname === "/analytics") {
				return sendJson(res, 200, {
					success: true,
					data: this.analytics.getStats(),
				});
			}

			if (method === "GET" && pathname === "/events") {
				const limit = parsedUrl.query.last
					? parseInt(parsedUrl.query.last, 10)
					: 10;
				const eventsToSend = this.recentEvents.slice(-limit).reverse();
				return sendJson(res, 200, {
					success: true,
					data: eventsToSend,
				});
			}

			if (method === "GET" && pathname === "/todos") {
				let result = [...this.todos];
				const filters = {};

				if (parsedUrl.query.completed !== undefined) {
					const comp = parsedUrl.query.completed === "true";
					result = result.filter((t) => t.completed === comp);
					filters.completed = comp;
				}

				this.emit("todosListed", {
					todos: result,
					count: result.length,
					filters,
					timestamp: nowISO(),
					requestInfo,
				});
				return sendJson(res, 200, {
					success: true,
					count: result.length,
					data: result,
				});
			}

			if (method === "POST" && pathname === "/todos") {
				let body;
				try {
					body = await parseBody(req);
				} catch (e) {
					this.emit("validationError", {
						errors: ["Invalid JSON format"],
						data: null,
						timestamp: nowISO(),
						requestInfo,
					});
					return sendJson(res, 400, {
						success: false,
						error: "Invalid JSON",
					});
				}

				const { errors, values } = validateTodoPayload(body, true);
				if (errors.length > 0) {
					this.emit("validationError", {
						errors,
						data: body,
						timestamp: nowISO(),
						requestInfo,
					});
					return sendJson(res, 400, { success: false, errors });
				}

				const todo = {
					id: this.nextId++,
					...values,
					createdAt: nowISO(),
				};
				this.todos.push(todo);

				this.emit("todoCreated", {
					todo,
					timestamp: nowISO(),
					requestInfo,
				});
				return sendJson(res, 201, { success: true, data: todo });
			}

			const id = parseIdFromPath(pathname);
			if (id !== null) {
				const todoIndex = this.todos.findIndex((t) => t.id === id);

				if (todoIndex === -1) {
					this.emit("todoNotFound", {
						todoId: id,
						operation: method,
						timestamp: nowISO(),
						requestInfo,
					});
					return sendJson(res, 404, {
						success: false,
						error: "Todo not found",
					});
				}

				const currentTodo = this.todos[todoIndex];

				if (method === "GET") {
					this.emit("todoViewed", {
						todo: currentTodo,
						timestamp: nowISO(),
						requestInfo,
					});
					return sendJson(res, 200, {
						success: true,
						data: currentTodo,
					});
				}

				if (method === "PUT") {
					let body;
					try {
						body = await parseBody(req);
					} catch (e) {
						this.emit("validationError", {
							errors: ["Invalid JSON format"],
							data: null,
							timestamp: nowISO(),
							requestInfo,
						});
						return sendJson(res, 400, {
							success: false,
							error: "Invalid JSON",
						});
					}

					const { errors, values } = validateTodoPayload(body, false);
					if (errors.length > 0) {
						this.emit("validationError", {
							errors,
							data: body,
							timestamp: nowISO(),
							requestInfo,
						});
						return sendJson(res, 400, { success: false, errors });
					}

					const oldTodo = { ...currentTodo };
					const changes = [];

					Object.keys(values).forEach((key) => {
						if (currentTodo[key] !== values[key]) {
							currentTodo[key] = values[key];
							changes.push(key);
						}
					});

					if (changes.length > 0) {
						currentTodo.updatedAt = nowISO();
					}

					this.emit("todoUpdated", {
						oldTodo,
						newTodo: currentTodo,
						changes,
						timestamp: nowISO(),
						requestInfo,
					});
					return sendJson(res, 200, {
						success: true,
						data: currentTodo,
					});
				}

				if (method === "DELETE") {
					const [deletedTodo] = this.todos.splice(todoIndex, 1);
					this.emit("todoDeleted", {
						todo: deletedTodo,
						timestamp: nowISO(),
						requestInfo,
					});
					return sendJson(res, 200, {
						success: true,
						message: "Todo deleted successfully",
					});
				}
			}

			return sendJson(res, 404, { success: false, error: "Not Found" });
		} catch (err) {
			this.emit("serverError", {
				error: err,
				operation: `${method} ${pathname}`,
				timestamp: nowISO(),
				requestInfo,
			});
			return sendJson(res, 500, {
				success: false,
				error: "Internal Server Error",
			});
		}
	}
}

module.exports = { TodoServer };
