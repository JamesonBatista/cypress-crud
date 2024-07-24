const fs = require('fs');
const path = require('path');

const readFixturesRecursively = (dir) => {
	let results = [];
	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat && stat.isDirectory()) {
			results = results.concat(readFixturesRecursively(filePath));
		} else if (filePath.endsWith('.json')) {
			results.push(filePath);
		}
	});
	return results;
};
module.exports = readFixturesRecursively;

