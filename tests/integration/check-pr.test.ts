import { expect } from 'chai'
import * as CheckPrModule from '../../src/check-pr'
import { createSandbox, SinonSandbox } from 'sinon'

describe('checkPr function', () => {
	let path: string
	let sandbox: SinonSandbox

	beforeEach(() => {
		path = 'path/to/your/file.md'
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
	})

	it('should call all utility functions correctly', () => {
		const checkFilePathExistsStub = sandbox.stub().returns(true)
		const checkFileExtensionStub = sandbox.stub()
		const validatePrDescriptionStub = sandbox.stub().returns(true)
		const validatePrChecklistStub = sandbox.stub().returns(true)

		sandbox.replace(CheckPrModule, 'checkFilePathExists', checkFilePathExistsStub)
		sandbox.replace(CheckPrModule, 'checkFileExtension', checkFileExtensionStub)
		sandbox.replace(CheckPrModule, 'validatePrDescription', validatePrDescriptionStub)
		sandbox.replace(CheckPrModule, 'validatePrChecklist', validatePrChecklistStub)

		CheckPrModule.checkPr(path)

		expect(checkFilePathExistsStub.calledOnceWithExactly(path)).to.be.true
		expect(checkFileExtensionStub.calledOnceWithExactly(path)).to.be.true
		expect(validatePrDescriptionStub.calledOnceWithExactly(path)).to.be.true
		expect(validatePrChecklistStub.calledOnceWithExactly(path)).to.be.true
	})

	it('should log success messages when everything is valid', () => {
		sandbox.stub(CheckPrModule, 'checkFilePathExists')
		sandbox.stub(CheckPrModule, 'checkFileExtension')
		sandbox.stub(CheckPrModule, 'validatePrDescription').returns(true)
		sandbox.stub(CheckPrModule, 'validatePrChecklist').returns(true)

		const consoleLogStub = sandbox.stub(console, 'log')

		CheckPrModule.checkPr(path)

		expect(consoleLogStub.calledWith('✅ PR description is valid')).to.be.true
		expect(consoleLogStub.calledWith('✅ PR checklist is valid')).to.be.true
	})

	it('should log error messages and exit when description is invalid', () => {
		sandbox.stub(CheckPrModule, 'checkFilePathExists')
		sandbox.stub(CheckPrModule, 'checkFileExtension')
		sandbox.stub(CheckPrModule, 'validatePrDescription').returns(false)
		sandbox.stub(CheckPrModule, 'validatePrChecklist')

		const consoleErrorStub = sandbox.stub(console, 'error')
		const processExitStub = sandbox.stub(process, 'exit')

		CheckPrModule.checkPr(path)

		expect(consoleErrorStub.calledWith('❌ PR description is not valid')).to.be.true
		expect(processExitStub.calledWith(1)).to.be.true
	})

	it('should log error messages and exit when checklist is invalid', () => {
		sandbox.stub(CheckPrModule, 'checkFilePathExists')
		sandbox.stub(CheckPrModule, 'checkFileExtension')
		sandbox.stub(CheckPrModule, 'validatePrDescription').returns(true)
		sandbox.stub(CheckPrModule, 'validatePrChecklist').returns(false)

		const consoleErrorStub = sandbox.stub(console, 'error')
		const processExitStub = sandbox.stub(process, 'exit')

		CheckPrModule.checkPr(path)

		expect(consoleErrorStub.calledWith('❌ PR checklist is not valid')).to.be.true
		expect(processExitStub.calledWith(1)).to.be.true
	})
})

