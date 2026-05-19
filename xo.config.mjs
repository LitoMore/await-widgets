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
		rules: {
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
					warnOnUnassignedImports: true,
					'newlines-between': 'never',
				},
			],
		},
	},
];

export default xoConfig;
