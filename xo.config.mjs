const xoConfig = [
	{
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	},
	{
		prettier: true,
		react: true,
		rules: {
			'react/react-in-jsx-scope': 'off',
			'sort-imports': [
				'error',
				{
					ignoreCase: false,
					ignoreDeclarationSort: true,
					ignoreMemberSort: false,
					memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
					allowSeparatedGroups: false,
				},
			],
			'import-x/order': [
				'error',
				{
					groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
					pathGroups: [
						{
							pattern: 'react',
							group: 'builtin',
							position: 'before',
						},
						{
							pattern: '#{*,*/**/*.js}',
							group: 'parent',
							position: 'before',
						},
						{
							pattern: '*.css',
							patternOptions: {matchBase: true},
							group: 'index',
							position: 'after',
						},
					],
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
					pathGroupsExcludedImportTypes: ['react'],
					warnOnUnassignedImports: true,
					'newlines-between': 'never',
				},
			],
			'react/jsx-sort-props': [
				'error',
				{
					callbacksLast: true,
					shorthandFirst: true,
					reservedFirst: true,
				},
			],
		},
	},
];

export default xoConfig;
