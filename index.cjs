const fs = require('fs');

const binaryData = fs.readFileSync('env.bin');
function parseBinaryData(data) {
	const result = { ...data };
	console.log('result', result);
	// Your custom parsing logic here
	// Example: Read integers, strings, etc. based on the binary format
	// and populate th

	return result;
}
const jsonData = parseBinaryData(binaryData);

// Convert to JSON
const jsonString = JSON.stringify(jsonData, null, 2);
console.log('jsonString', jsonString);
// Save to a JSON file
// fs.writeFileSync('path/to/output.json', jsonString);
