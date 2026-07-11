const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");

/**
 * Event Loop Analysis and Async Debugging
 * Learn Node.js event loop phases and fix broken async code
 */

/**
 * Analyze execution order of event loop phases
 * @returns {object} Analysis of execution order
 */
function analyzeEventLoop() {
	// TODO: Implement event loop analysis
	// 1. Create examples showing each event loop phase
	// 2. Demonstrate microtask vs macrotask priority
	// 3. Show execution order with detailed logging
	// 4. Return analysis object with explanations

	const analysis = {
		phases: [
			"timers",
			"pending callbacks",
			"idle",
			"poll",
			"check",
			"close callbacks",
		],
		executionOrder: ["synchronous", "nextTick", "promise", "macrotasks"],
		explanations: [
			"Microtasks (nextTick and Promises) are executed immediately after the current phase completes, before moving to the next macrotask phase.",
		],
	};

	console.log("Event loop analysis not implemented yet");
	return analysis;
}

/**
 * Predict execution order for code snippets
 * @param {string} snippet - Code snippet identifier
 * @returns {array} Predicted execution order
 */
function predictExecutionOrder(snippet) {
	// TODO: Implement execution order prediction
	// 1. Analyze the provided code snippets
	// 2. Apply event loop phase rules
	// 3. Consider microtask priority
	// 4. Return predicted order with explanations

	const predictions = {
		snippet1: [
			"Start",
			"End",
			"Next Tick 1",
			"Next Tick 2",
			"Promise 1",
			"Promise 2",
			"Timer 1",
			"Timer 2",
			"Immediate 1",
			"Immediate 2",
		],
		snippet2: [
			"=== Start ===",
			"=== End ===",
			"NextTick",
			"Nested NextTick",
			"Timer",
			"NextTick in Timer",
			"Immediate",
			"NextTick in Immediate",
			"fs.readFile",
			"NextTick in readFile",
			"Immediate in readFile",
			"Timer in readFile",
		],
	};

	return predictions[snippet] || [];
}

/**
 * Fix race condition in file processing
 * @returns {Promise} Promise that resolves when files are processed
 */
async function fixRaceCondition() {
	// TODO: Fix the race condition in file processing
	// Issues to fix:
	// 1. Race condition in file processing
	// 2. Incorrect error handling
	// 3. Missing await keywords
	// 4. Array index might be wrong due to closure

	const files = ["file1.txt", "file2.txt", "file3.txt"];

	try {
		const results = [];
		for (const file of files) {
			try {
				const content = await fs.readFile(file, "utf8");
				results.push(content.toUpperCase());
			} catch (err) {
				console.error(`Error reading ${file}:`, err.message);
				await fs.writeFile(file, `Content of ${file}`);
				console.log(`Created ${file}`);
			}
		}

		console.log("All files processed:", results);
		return results;
	} catch (error) {
		throw new Error(`Failed to process files: ${error.message}`);
	}
}

/**
 * Convert callback hell to async/await
 * @param {number} userId - User ID to process
 * @returns {Promise} Promise that resolves with processed user data
 */
async function fixCallbackHell(userId) {
	// TODO: Convert callback hell to async/await
	// Issues to fix:
	// 1. Callback hell structure
	// 2. No error handling for JSON.parse
	// 3. Repetitive error handling code
	// 4. No file existence checking
	// 5. Blocking operations
	const userPath = path.join(__dirname, `user-${userId}.json`);
	const prefPath = path.join(__dirname, `preferences-${userId}.json`);
	const activityPath = path.join(__dirname, `activity-${userId}.json`);
	try {
		try {
			await Promise.all([
				fs.access(userPath),
				fs.access(prefPath),
				fs.access(activityPath),
			]);
		} catch {
			throw new Error(
				"One or more required user data files do not exist",
			);
		}
		const userData = await fs.readFile(userPath, "utf8");
		const user = JSON.parse(userData);

		const [prefData, activityData] = await Promise.all([
			fs.readFile(prefPath, "utf8"),
			fs.readFile(activityPath, "utf8"),
		]);

		const preferences = JSON.parse(prefData);
		const activity = JSON.parse(activityData);

		const combinedData = {
			user,
			preferences,
			activity,
			processedAt: new Date(),
		};

		await fs.writeFile(
			`processed-${userId}.json`,
			JSON.stringify(combinedData, null, 2),
			"utf8",
		);

		return combinedData;
	} catch (error) {
		throw new Error(`Failed to process user data: ${error.message}`);
	}
}

/**
 * Fix mixed promises and callbacks
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function fixMixedAsync() {
	// TODO: Fix mixed promises and callbacks
	// Issues to fix:
	// 1. Mixing promises and callbacks inconsistently
	// 2. Nested async operations without proper chaining
	// 3. Error handling inconsistencies
	// 4. No proper async/await usage
	const inputPath = path.join(__dirname, "input.txt");
	const outputPath = path.join(__dirname, "output.txt");

	console.log("Starting data processing...");
	try {
		let data;

		try {
			data = await fs.readFile(inputPath, "utf8");
		} catch (readError) {
			if (readError.code === "ENOENT") {
				console.log("Input file missing. Creating input.txt...");
				await fs.writeFile(inputPath, "Hello World!", "utf8");
				data = "Hello World!";
			} else {
				throw readError;
			}
		}

		console.log("File read successfully");

		const processedData = data.toUpperCase();

		await fs.writeFile(outputPath, processedData, "utf8");
		console.log("File written successfully");

		const verifyData = await fs.readFile(outputPath, "utf8");
		console.log("Verification successful");
		console.log("Data length:", verifyData.length);

		return verifyData;
	} catch (error) {
		throw new Error(`Failed to process data: ${error.message}`);
	}
}

/**
 * Demonstrate all event loop phases
 * @returns {Promise} Promise that resolves when demonstration is complete
 */
async function demonstrateEventLoop() {
	logWithPhase("start", "synchronous");

	setTimeout(() => {
		logWithPhase("timer callback", "timers");
	}, 0);

	process.nextTick(() => {
		logWithPhase("nextTick callback", "nextTick");
	});

	Promise.resolve().then(() => {
		logWithPhase("promise callback", "promises");
	});

	setImmediate(() => {
		logWithPhase("immediate callback", "immediate");
	});

	logWithPhase("end", "synchronous");
}

/**
 * Create test files for debugging exercises
 */
async function createTestFiles() {
	// TODO: Create test files for the exercises
	// 1. Create sample user data files
	// 2. Create input files for processing
	// 3. Handle file creation errors gracefully

	const testData = {
		"user-123.json": {
			id: 123,
			name: "John Doe",
			email: "john@example.com",
		},
		"preferences-123.json": {
			theme: "dark",
			language: "en",
			notifications: true,
		},
		"activity-123.json": {
			lastLogin: "2025-01-01",
			sessionsCount: 42,
			totalTime: 3600,
		},
		"input.txt": "Hello World! This is test data for processing.",
		"file1.txt": "Content of file 1",
		"file2.txt": "Content of file 2",
		"file3.txt": "Content of file 3",
	};

	try {
		for (const [filename, content] of Object.entries(testData)) {
			const filePath = path.join(process.cwd(), filename);
			const dataString =
				typeof content === "string"
					? content
					: JSON.stringify(content, null, 2);

			fsSync.writeFileSync(filePath, dataString, "utf8");
		}
	} catch (error) {
		console.error("Failed to create test files:", error.message);
	}
}

/**
 * Helper function to log with timestamps
 * @param {string} message - Message to log
 * @param {string} phase - Event loop phase
 */
function logWithPhase(message, phase = "unknown") {
	// TODO: Implement detailed logging
	// 1. Add timestamp
	// 2. Add event loop phase information
	// 3. Add color coding for different phases
	// 4. Format output for better readability
	const now = new Date();
    const timestamp = now.toTimeString().split(" ")[0];

    const colors = {
        synchronous: "\x1b[37m",
        microtask: "\x1b[35m",
        timers: "\x1b[32m",
        poll: "\x1b[36m",
        check: "\x1b[33m",
        close: "\x1b[31m",
        unknown: "\x1b[0m",
    };
    const color = colors[phase] || colors.unknown;
    const reset = "\x1b[0m";

    const formattedLog = `${color}[${timestamp}] 🕐 Phase: [${phase}] | ${message}${reset}`;

    console.log(formattedLog);
}
// Export functions and data
module.exports = {
	analyzeEventLoop,
	predictExecutionOrder,
	fixRaceCondition,
	fixCallbackHell,
	fixMixedAsync,
	demonstrateEventLoop,
	createTestFiles,
	logWithPhase,
};

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
	async function runExamples() {
		console.log("🔄 Starting Event Loop Analysis Examples...\n");

		// Create test files
		await createTestFiles();

		// Demonstrate event loop
		console.log("=== Event Loop Demonstration ===");
		await demonstrateEventLoop();

		// Analyze execution order
		console.log("\n=== Execution Order Analysis ===");
		const analysis = analyzeEventLoop();
		console.log("Analysis:", analysis);

		// Fix broken code
		console.log("\n=== Fixing Broken Code ===");
		try {
			await fixRaceCondition();
			console.log("✅ Race condition fixed");

			await fixCallbackHell(123);
			console.log("✅ Callback hell converted");

			await fixMixedAsync();
			console.log("✅ Mixed async resolved");
		} catch (error) {
			console.error("❌ Error fixing code:", error.message);
		}
	}

	runExamples();
}
