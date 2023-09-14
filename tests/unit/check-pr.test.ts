import { expect } from 'chai'
import { SinonStub, stub } from 'sinon'
import fs from 'fs'

import { checkFileExtension, checkFilePathExists, validatePrChecklist, validatePrDescription, escapeRegExp } from '../../src/check-pr'

let fsAccessSyncStub: SinonStub
let consoleLogStub: SinonStub
let consoleErrorStub: SinonStub
let processExitStub: SinonStub
let fsReadFileSyncStub: sinon.SinonStub

describe('checkFilePathExists function', () => {
	beforeEach(() => {
		fsAccessSyncStub = stub(fs, 'accessSync')
		consoleLogStub = stub(console, 'log')
		consoleErrorStub = stub(console, 'error')
		processExitStub = stub(process, 'exit')
	})

	afterEach(() => {
		fsAccessSyncStub.restore()
		consoleLogStub.restore()
		consoleErrorStub.restore()
		processExitStub.restore()
	})

	it('should log success message for existing file', () => {
		fsAccessSyncStub.returns('') // Simulate file exists

		checkFilePathExists('/path/to/existing/file')

		expect(consoleLogStub.calledWith('✅ File Exist')).to.be.true
		expect(consoleErrorStub.called).to.be.false
		expect(processExitStub.called).to.be.false
	})

	it('should log error message and exit for non-existing file', () => {
		fsAccessSyncStub.throws(new Error()) // Simulate file doesn't exist

		checkFilePathExists('/path/to/non/existing/file')

		expect(consoleErrorStub.calledWithMatch(/❌ File does not exist/)).to.be.true
		expect(processExitStub.calledWith(1)).to.be.true
		expect(consoleLogStub.called).to.be.false
	})
})

describe('checkFileExtension function', () => {
	beforeEach(() => {
		consoleLogStub = stub(console, 'log')
		consoleErrorStub = stub(console, 'error')
		processExitStub = stub(process, 'exit')
	})

	afterEach(() => {
		consoleLogStub.restore()
		consoleErrorStub.restore()
		processExitStub.restore()
	})

	it('should log error message and exit for non-md file extension', () => {
		checkFileExtension('/path/to/non-md-file.txt')

		expect(consoleErrorStub.calledWithMatch(/❌ File extension is not valid/)).to.be.true
		expect(processExitStub.calledWith(1)).to.be.true
		expect(consoleLogStub.called).to.be.false
	})

	it('should not log error message for md file extension', () => {
		checkFileExtension('/path/to/md-file.md')

		expect(consoleErrorStub.called).to.be.false
		expect(processExitStub.called).to.be.false
		expect(consoleLogStub.called).to.be.false
	})
})

describe('validatePrChecklist function', () => {
	beforeEach(() => {
		fsReadFileSyncStub = stub(fs, 'readFileSync')
		consoleErrorStub = stub(console, 'error')
	})

	afterEach(() => {
		fsReadFileSyncStub.restore()
		consoleErrorStub.restore()
	})

	it('should return true for valid checklist', () => {
		const validContent = `
      - [x] I have tested these changes locally. <!--id:1-->
      - [ ] I have added necessary test cases. <!--id:2-->
      - [ ] I have added or updated the documentation to reflect these changes. <!--id:3-->
      - [x] I have checked that these changes do not introduce any new warnings or errors. <!--id:4-->
      - [x] I have reviewed the code and ensured that it meets our team's coding standards. <!--id:5-->
    `

		fsReadFileSyncStub.returns(validContent)

		const result = validatePrChecklist('/path/to/valid/checklist.md')

		expect(result).to.be.true
		expect(consoleErrorStub.called).to.be.false
	})

	it('should return false for invalid checklist', () => {
		const invalidContent = `
      - [ ] I have tested these changes locally. <!--id:1-->
      - [ ] I have added necessary test cases. <!--id:2-->
      - [x] I have added or updated the documentation to reflect these changes. <!--id:3-->
      - [ ] I have checked that these changes do not introduce any new warnings or errors. <!--id:4-->
      - [ ] I have reviewed the code and ensured that it meets our team's coding standards. <!--id:5-->
    `

		fsReadFileSyncStub.returns(invalidContent)

		const result = validatePrChecklist('/path/to/invalid/checklist.md')

		expect(result).to.be.false
		expect(consoleErrorStub.called).to.be.true
	})
})

describe('validatePrDescription function', () => {

	beforeEach(() => {
		fsReadFileSyncStub = stub(fs, 'readFileSync')
	})

	afterEach(() => {
		fsReadFileSyncStub.restore()
	})

	it('should return true for valid description', () => {
		const validContent = `
      ## Description
      This is a valid description.
      <!--id:1-->
      Some other details.

      ## Related Issues
      - Issue #123
    `

		fsReadFileSyncStub.returns(validContent)

		const result = validatePrDescription('/path/to/valid/description.md')

		expect(result).to.be.true
	})

	it('should return false for missing description', () => {
		const missingDescriptionContent = `
      ## Related Issues
      - Issue #123
    `

		fsReadFileSyncStub.returns(missingDescriptionContent)

		const result = validatePrDescription('/path/to/missing/description.md')

		expect(result).to.be.false
	})

	it('should return false for empty description', () => {
		const emptyDescriptionContent = `
      ## Description

      ## Related Issues
      - Issue #123
    `

		fsReadFileSyncStub.returns(emptyDescriptionContent)

		const result = validatePrDescription('/path/to/empty/description.md')

		expect(result).to.be.false
	})

	it('should return false for description with only comments', () => {
		const commentsOnlyContent = `
      ## Description
      <!-- This is a comment -->
      <!-- Another comment -->

      ## Related Issues
      - Issue #123
    `

		fsReadFileSyncStub.returns(commentsOnlyContent)

		const result = validatePrDescription('/path/to/comments-only/description.md')

		expect(result).to.be.false
	})
})

describe('escapeRegExp function', () => {
	it('should escape special characters', () => {
		const input = '[some] {special} (characters)'
		const expectedOutput = '\\[some\\] \\{special\\} \\(characters\\)'

		const result = escapeRegExp(input)

		expect(result).to.equal(expectedOutput)
	})

	it('should not escape regular characters', () => {
		const input = 'Regular text without special characters.'
		const expectedOutput = 'Regular text without special characters.'

		const result = escapeRegExp(input)
		expect(result).to.equal(expectedOutput)
	})
})
