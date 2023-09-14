import * as fs from 'fs'

const _must_verify = ['id:1', 'id:4', 'id:5']
const END_TITLE = '## Related Issues'
const START_TITLE = '## Description'

type UncheckedMap = Record<string, string>;

export const checkPr = (path: string) => {
	checkFilePathExists(path)
	checkFileExtension(path)

	if (!validatePrDescription(path)) {
		console.error('❌ PR description is not valid')
		process.exit(1)
	}

	console.log('✅ PR description is valid')

	if (!validatePrChecklist(path)) {
		console.error('❌ PR checklist is not valid')
		process.exit(1)
	}

	console.log('✅ PR checklist is valid')
}

export const checkFilePathExists = (filePath: string) => {
	try {
		fs.accessSync(filePath, fs.constants.F_OK)

		console.log('✅ File Exist')
	} catch (error) {
		console.error(`❌ File does not exist: ${filePath}`)
		process.exit(1)
	}
}

export const checkFileExtension = (filePath: string) => {
	const extension = filePath.split('.').pop()

	if (extension !== 'md') {
		console.error(`❌ File extension is not valid: ${filePath}`)
		process.exit(1)
	}
}

export const validatePrChecklist = (path: string): boolean => {
	const content = fs.readFileSync(path, 'utf-8')

	const uncheckedItemsRegex = /- \[ \] (.*)/g
	const uncheckedItems = content.match(uncheckedItemsRegex)


	const uncheckedMap: UncheckedMap = {}
	const regex = /<!--\s*.*?\s*-->/g

	uncheckedItems?.forEach(item => {
		const key = item.split('<!--')[1].split('-->')[0].trim()
		// TODO: value part did not formatted (regex not worked)
		uncheckedMap[key] = item.replace(regex, '').trim()
	})

	const mustVerified = Object.keys(uncheckedMap).filter(key => _must_verify.includes(key))

	mustVerified.forEach(item => {
		console.error(`❌ ${uncheckedMap[item]}`)
	})

	return mustVerified.length === 0
}

export const validatePrDescription = (path: string): boolean => {
	const content = fs.readFileSync(path, 'utf-8')

	const pattern = new RegExp(`${escapeRegExp(START_TITLE)}(.+?)${escapeRegExp(END_TITLE)}`, 's')
	const match = content.match(pattern)

	if (match) {
		const res = match[1]
			.split('\n')
			.map(line => line.replace(/<!--\s*.*?\s*-->/g, '').trim())
			.filter(line => line !== '')

		return res.length > 0
	}

	return false
}

export const escapeRegExp = (string: string): string => {
	return string.replace(/[*+?^${}()|[\]\\]/g, '\\$&')
}
