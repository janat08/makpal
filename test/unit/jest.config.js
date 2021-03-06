module.exports = {
	rootDir: "../../",
	// preset: 'ts-jest',
	setupTestFrameworkScriptFile: "./test/unit/jest.unit-test.init.js",
	testPathIgnorePatterns: [
		"/config/", //skip the test.js config file
		"/node_modules/"
	],
	reporters: ["default", "jest-junit"],
	transform: {
		"^.+\\.jsx?$": "babel-jest",
		"^.+\\.tsx?$": "ts-jest"
	},
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)x?$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	moduleNameMapper: {
		"^~/(.*)$": "<rootDir>/src/$1"
	},
	globals: {
		"ts-jest": {
			tsConfig: "tsconfig.test.json"
		}
	}
};
