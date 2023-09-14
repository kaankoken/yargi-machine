const PATTERN = new RegExp(
	'^(build|chore|ci|docs|feat|(?:hot)?fix|perf|' +
	'refactor|revert|style|test){1}' +
	'(\\([\\w\\-\\.]+\\))?(!)?: ([\\w ])+([\\s\\S]*)'
)

export const validateTitle = (prTitle: string) => {
	const match = prTitle.match(PATTERN)

	const lowerCaseTitle = prTitle.toLowerCase()
	const isLower = prTitle === lowerCaseTitle

	console.info(`Pull-request title: ${prTitle}`)

	if (match === null || !isLower) {
		console.error('❌ PR title is not valid')
		process.exit(1)
	} else {
		console.log('✅ PR title is valid')
	}
}
