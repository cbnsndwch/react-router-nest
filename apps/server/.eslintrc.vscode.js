module.exports = {
    extends: ['./.eslintrc.js'],
    settings: {
        'import/resolver': {
            typescript: {
                // always try to resolve types under `<root>@types` directory
                // even it doesn't contain any source code, like `@types/unist`
                alwaysTryTypes: true,

				// weird hack required to get vscode-eslint and eslint cli 
				// to work at the same time:
				// - vscode-eslint uses the project root as the workspace root
				// - eslint cli uses the current working directory
                project: 'apps/api/tsconfig.json'
            }
        }
    }
};
