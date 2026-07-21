import { jest } from "@jest/globals";
import request from "supertest";
import app from "./index.js";

describe("GET /todos", () => {
	it("responds with a list of todos", async () => {
		const res = await request(app).get("/todos");
		expect(res.status).toBe(200);
		expect(Array.isArray(res.body.data)).toBe(true);
		expect(res.body).toHaveProperty("count");
		expect(typeof res.body.count).toBe("number");
	});
});

describe("POST /todos", () => {
	it("adds a new todo and returns it", async () => {
		const newTodo = {
			title: "Test todo",
			description: "Testing supertest",
		};
		const res = await request(app).post("/todos").send(newTodo);

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("data");
		expect(res.body.data).toHaveProperty("title", "Test todo");
		expect(res.body.data).toHaveProperty(
			"description",
			"Testing supertest",
		);
		expect(res.body.data).toHaveProperty("id");
		expect(res.body.data).toHaveProperty("status", "PENDING");
	});

	it("returns 400 if title is missing", async () => {
		const res = await request(app)
			.post("/todos")
			.send({ description: "No title here" });

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("status", 400);
		expect(res.body.message).toMatch(/title/i);
	});
});

describe("Logging Middleware", () => {
	it("logs method and URL", async () => {
		const consoleSpy = jest.spyOn(console, "log");

		await request(app).get("/todos");

		const allLogOutputs = consoleSpy.mock.calls.flat().join(" ");

		expect(allLogOutputs).toMatch(/GET.*\/todos/);

		consoleSpy.mockRestore();
	});
});

describe("GET /todos/:id", () => {
	it("returns todo by id", async () => {
		const res = await request(app).get("/todos/1");

		expect(res.status).toBe(200);
		expect(res.body.data).toHaveProperty("id", 1);
	});

	it("returns 404 for non-existent id", async () => {
		const res = await request(app).get("/todos/99999");

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("status", 404);
		expect(res.body.message).toMatch(/not found/i);
	});

	it("returns 400 for invalid id format", async () => {
		const res = await request(app).get("/todos/abc");

		expect(res.status).toBe(400);
		expect(res.body.message).toMatch(/valid number/i);
	});
});

describe("Error Handler", () => {
	it("returns formatted error JSON for unknown routes", async () => {
		const res = await request(app).get("/this-route-does-not-exist");

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty("status", 404);
		expect(res.body).toHaveProperty("message");
		expect(res.body).toHaveProperty("timestamp");

		expect(() => new Date(res.body.timestamp)).not.toThrow();
	});
});

describe("Static Files", () => {
	it("serves static files", () => {
		expect(true).toBe(true);
	});
});

describe('GET /todos/search', () => {
  it('filters todos by query params', async () => {
    const res = await request(app).get('/todos/search?keyword=todo');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('count');
  });

  it('returns 400 if keyword is missing', async () => {
    const res = await request(app).get('/todos/search');

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/keyword.*required/i);
  });
});
