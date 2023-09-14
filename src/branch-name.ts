const PATTERN = new RegExp(
	'^(main|dev(?:elopment)?|master|' +
	'(feat(?:ure)?|test|improvement|chore|issue|docs|((?:bug)?|(?:hot)?)fix)' +
	'(/[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*){1,2}|' +
	'release/(?:v)?[0-9]+(.[0-9]+)*(-(alpha|beta|rc)[0-9]*(.[0-9]+)?)?)$'
)

export const validateConvention = (branchName: string) => {
	const match = branchName.match(PATTERN)

	const lowerCaseBranchName = branchName.toLowerCase()
	const isLower = branchName === lowerCaseBranchName

	console.info(`Branch name: ${branchName}`)

	if (match === null || !isLower) {
		console.error('❌ Branch name is not valid')
		process.exit(1)
	} else {
		console.log('✅ Branch name is valid')
	}
}
