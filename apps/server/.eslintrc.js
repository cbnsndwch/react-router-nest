module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    ignorePatterns: [
        'node_modules/**',
        'build/**',
        'dist/**',
        'test/**',
        'e2e/**',
        'public/**',
        '.eslintrc.*',
        'vite.config.*',
        '**/*.hbs'
    ],

    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['tsconfig.json'],
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'import', 'prettier'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript'
    ],
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts']
        }
    },

    rules: {
        curly: ['error', 'all'],
        semi: ['error', 'always'],
        strict: 'error',
        'no-console': 'warn',
        'comma-dangle': 'off',
        'no-unused-vars': 'off',
        'no-use-before-define': 'off',
        'array-callback-return': 'off',
        'no-restricted-syntax': [
            'warn',
            {
                selector: "CallExpression[callee.name='debug']",
                message: 'console.debug not allowed, use a Nest logger instead.'
            }
        ],
        'spaced-comment': [
            'error',
            'always',
            {
                markers: [
                    '!',
                    '?',
                    '*',
                    '//',
                    'todo',
                    'TODO',
                    'bug',
                    'BUG',
                    'hack',
                    'HACK',
                    'fixme',
                    'FIXME',
                    'xxx',
                    'XXX',
                    'fix',
                    'FIX',
                    'fixit',
                    'FIXIT',
                    '#region',
                    '#endregion'
                ],
                exceptions: ['-', '+']
            }
        ],
        'import/no-named-as-default': 'off',
        'import/no-unresolved': 'error',
        'import/order': [
            'error',
            {
                'newlines-between': 'always-and-inside-groups',
                groups: [
                    // built-in types are first
                    'builtin',
                    // then external modules
                    'external',
                    // then parent types
                    'parent',
                    // then siblings
                    'sibling',
                    // Then the index file
                    'index',
                    // Then the rest: internal and external type
                    'object'
                ],
                pathGroups: [
                    // make imports from `src` their own group
                    {
                        pattern: 'src/**',
                        group: 'external',
                        position: 'after'
                    }
                ]
            }
        ],
        'import/no-cycle': 'off',
        'import/export': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'prettier/prettier': ['error', {}, { usePrettierrc: true }]
    },

    overrides: [
        // React
        {
            files: ['app/**/*.{js,jsx,ts,tsx}'],
            plugins: ['react', 'jsx-a11y'],
            extends: [
                'plugin:react/recommended',
                'plugin:react/jsx-runtime',
                'plugin:react-hooks/recommended',
                'plugin:jsx-a11y/recommended',
                'prettier'
            ],
            settings: {
                react: {
                    version: 'detect'
                },
                formComponents: ['Form'],
                linkComponents: [
                    { name: 'Link', linkAttribute: 'to' },
                    { name: 'NavLink', linkAttribute: 'to' }
                ]
            },
            rules: {
                'react/jsx-no-leaked-render': [
                    'warn',
                    { validStrategies: ['ternary'] }
                ]
            }
        },



        // Node
        {
            files: ['.eslintrc.js', '.eslintrc/vscode.js', 'remix.config.js'],
            env: {
                node: true
            }
        }
    ]
};
