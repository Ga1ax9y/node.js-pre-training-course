const fs = require("fs");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");
const path = require("path");

class CSVParser extends Transform {
	constructor(options = {}) {
		super({ objectMode: true });
		// TODO: Initialize properties
		this.headers = null;
		this.lineNumber = 0;
		this.buffer = "";
	}

	_transform(chunk, encoding, callback) {
		// TODO: Implement CSV parsing
		// 1. Convert chunk to string and add to buffer
		// 2. Split buffer by newlines
		// 3. Keep last incomplete line in buffer
		// 4. Process complete lines:
		//    - First line: extract headers
		//    - Other lines: create objects with headers as keys
		// 5. Push objects to next stream
		this.buffer += chunk.toString();

		const lines = this.buffer.split(/\r?\n/);

		this.buffer = lines.pop();

		for (const line of lines) {
			const trimmedLine = line.trim();
			if (!trimmedLine) continue;

			const values = trimmedLine.split(",");

			if (this.lineNumber === 0) {
				this.headers = values.map((h) => h.trim());
			} else {
				const record = {};
				this.headers.forEach((header, index) => {
					record[header] = values[index] ? values[index].trim() : "";
				});
				this.push(record);
			}
			this.lineNumber++;
		}

		callback();
	}

	_flush(callback) {
		// TODO: Process any remaining data in buffer
		if (this.buffer.trim()) {
			const values = this.buffer.trim().split(",");
			if (this.headers) {
				const record = {};
				this.headers.forEach((header, index) => {
					record[header] = values[index] ? values[index].trim() : "";
				});
				this.push(record);
			}
		}
		callback();
	}
}

/**
 * Data Transformer Stream
 * Applies transformations to each record
 */
class DataTransformer extends Transform {
	constructor(options = {}) {
		super({ objectMode: true });
	}

	_transform(record, encoding, callback) {
		// TODO: Apply transformations to record
		// 1. Capitalize name using capitalizeName()
		// 2. Normalize email using normalizeEmail()
		// 3. Format phone using formatPhone()
		// 4. Standardize date using standardizeDate()
		// 5. Capitalize city name
		// 6. Push transformed record
		try {
			const transformed = { ...record };

			if (transformed.name)
				transformed.name = capitalizeName(transformed.name);
			if (transformed.email)
				transformed.email = normalizeEmail(transformed.email);
			if (transformed.phone)
				transformed.phone = formatPhone(transformed.phone);
			if (transformed.birthdate)
				transformed.birthdate = standardizeDate(transformed.birthdate);
			if (transformed.city)
				transformed.city = capitalizeName(transformed.city);

			this.push(transformed);
		} catch (err) {
			return callback(err);
		}
		callback();
	}
}

/**
 * CSV Writer Transform Stream
 * Converts objects back to CSV format
 */
class CSVWriter extends Transform {
	constructor(options = {}) {
		super({ objectMode: true });
		// TODO: Initialize properties
		this.headerWritten = false;
	}

	_transform(record, encoding, callback) {
		// TODO: Convert object to CSV format
		// 1. Write headers on first record
		// 2. Convert record values to CSV line
		// 3. Handle special characters and quotes
		// 4. Push CSV line as string
		const keys = Object.keys(record);

		if (!this.headerWritten) {
			this.push(keys.join(",") + "\n");
			this.headerWritten = true;
		}

		const values = keys.map((key) => {
			const val = record[key];
			if (typeof val === "string" && val.includes(",")) {
				return `"${val}"`;
			}
			return val;
		});

		this.push(values.join(",") + "\n");
		callback();
	}
}

/**
 * Helper Functions
 */

/**
 * Capitalize names properly
 * @param {string} name - Name to capitalize
 * @returns {string} Capitalized name
 */
function capitalizeName(name) {
	// TODO: Implement name capitalization
	// 1. Handle empty/null names
	// 2. Split by spaces and hyphens
	// 3. Capitalize each part
	// 4. Join back together
	// Examples:
	// "john doe" → "John Doe"
	// "mary-jane smith" → "Mary-Jane Smith"
	if (!name) return "";

	return name
		.toLowerCase()
		.split(/([ \-])/)
		.map((part) => {
			if (part === " " || part === "-") return part;
			return part.charAt(0).toUpperCase() + part.slice(1);
		})
		.join("");
}

/**
 * Normalize email addresses
 * @param {string} email - Email to normalize
 * @returns {string} Normalized email or original if invalid
 */
function normalizeEmail(email) {
	// TODO: Implement email normalization
	// 1. Convert to lowercase
	// 2. Validate basic email format (contains @ and .)
	// 3. Return normalized email or original if invalid

	if (!email) return "";

	const lowerEmail = email.toLowerCase().trim();

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	return emailRegex.test(lowerEmail) ? lowerEmail : email;
}

/**
 * Format phone numbers
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone or "INVALID"
 */
function formatPhone(phone) {
	// TODO: Implement phone formatting
	// 1. Extract only digits
	if (!phone) return "INVALID";
	// 2. Check if exactly 10 digits
	const digits = phone.replace(/\D/g, "");

	// 3. Format as (XXX) XXX-XXXX
	if (digits.length === 10) {
		return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
	}
	// 4. Return "INVALID" if not valid

	return "INVALID";
}

/**
 * Standardize date formats
 * @param {string} date - Date to standardize
 * @returns {string} Date in YYYY-MM-DD format
 */
function standardizeDate(date) {
	// TODO: Implement date standardization
	if (!date) return date;

	const cleanStr = date.replace(/\//g, "-").trim();

	let year, month, day;
	// 1. Handle different input formats:
	//    - MM/DD/YYYY

	//    - YYYY-MM-DD
	//    - YYYY/MM/DD
	// 2. Convert to YYYY-MM-DD format
	if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(cleanStr)) {
		const parts = cleanStr.split("-");
		month = parts[0].padStart(2, "0");
		day = parts[1].padStart(2, "0");
		year = parts[2];
	} else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(cleanStr)) {
		const parts = cleanStr.split("-");
		year = parts[0];
		month = parts[1].padStart(2, "0");
		day = parts[2].padStart(2, "0");
	} else {
		const parsedDate = new Date(date);
		if (isNaN(parsedDate.getTime())) return date;

		year = parsedDate.getFullYear();
		month = String(parsedDate.getMonth() + 1).padStart(2, "0");
		day = String(parsedDate.getDate()).padStart(2, "0");
	}
	// 3. Validate date is real
	// 4. Return original if invalid
	const finalIso = `${year}-${month}-${day}`;
	const checkDate = new Date(finalIso);
	if (isNaN(checkDate.getTime())) return date;

	return finalIso;
}

/**
 * Main function to process CSV file
 * @param {string} inputPath - Path to input CSV file
 * @param {string} outputPath - Path to output CSV file
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function processCSVFile(inputPath, outputPath) {
	// TODO: Implement the main processing pipeline
	// 1. Create read stream from input file
	// 2. Create transform streams (CSVParser, DataTransformer, CSVWriter)
	// 3. Create write stream to output file
	// 4. Use pipeline() to connect all streams
	// 5. Handle errors appropriately
	// 6. Return promise that resolves when complete

	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const readStream = fs.createReadStream(inputPath);
	const writeStream = fs.createWriteStream(outputPath);

	const parser = new CSVParser();
	const transformer = new DataTransformer();
	const writer = new CSVWriter();
	try {
		// Implementation goes here
		await pipeline(readStream, parser, transformer, writer, writeStream);
	} catch (error) {
		throw new Error(`Failed to process CSV file: ${error.message}`);
	}
}

/**
 * Create sample input data for testing
 */
function createSampleData() {
	// TODO: Create data directory and sample CSV file
	// 1. Create 'data' directory if it doesn't exist
	// 2. Write sample CSV data as specified in task description
	const dataDir = path.join(__dirname, "data");
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}

	const csvContent = `name,email,phone,birthdate,city
                      john doe,JOHN.DOE@EXAMPLE.COM,1234567890,12/25/1990,new york
                      jane smith,Jane.Smith@Gmail.Com,555-123-4567,1985-03-15,los angeles
                      bob johnson,BOB@TEST.COM,invalid-phone,03/22/1992,chicago
                      alice brown,alice.brown@company.org,9876543210,1988/07/04,houston`;

	fs.writeFileSync(
		path.join(dataDir, "users.csv"),
		csvContent.trim() + "\n",
		"utf-8",
	);
}

// Export classes and functions
module.exports = {
	CSVParser,
	DataTransformer,
	CSVWriter,
	processCSVFile,
	capitalizeName,
	normalizeEmail,
	formatPhone,
	standardizeDate,
	createSampleData,
};

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
	// Create sample data
	createSampleData();

	// Process the file
	processCSVFile("data/users.csv", "data/users_transformed.csv")
		.then(() => {
			console.log("✅ File transformation completed successfully!");

			// Read and display results
			const output = fs.readFileSync(
				"data/users_transformed.csv",
				"utf-8",
			);
			console.log("\n📄 Transformed CSV output:");
			console.log(output);
		})
		.catch((error) => {
			console.error("❌ Error processing file:", error.message);
		});
}
