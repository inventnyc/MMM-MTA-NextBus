const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "script",
			globals: {
				...globals.browser,
				...globals.node,
				Module: "readonly",
				config: "readonly",
				moment: "readonly"
			}
		},
		rules: {
			indent: ["error", "tab"],
			quotes: ["error", "double"],
			"max-len": ["error", 250],
			curly: "error",
			camelcase: ["error", { properties: "never" }],
			"no-trailing-spaces": ["error"],
			"no-irregular-whitespace": ["error"]
		}
	}
];

