import { expect } from 'chai'
import { validateTitle } from '../../src/pr-title'
import { SinonStub, stub } from 'sinon'

describe('validateConvention function', () => {
	let consoleLogStub: SinonStub
	let consoleErrorStub: SinonStub
	let processExitStub: SinonStub

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


	it('should validate pull-request title', () => {
		const validPrTitles = [
			'feat: add new feature',
			'fix: fix bug',
			'chore: update dependencies',
			'chore(deps): update dependencies',
			'chore(deps-dev): update dev dependencies',
			'chore(deps-peer): update peer dependencies',
			'chore(deps-optional): update optional dependencies',
			'chore(deps): update dependencies',
		]

		validPrTitles.forEach(title => {
			validateTitle(title)

			expect(consoleLogStub.calledWith('✅ PR title is valid')).to.be.true
			expect(consoleErrorStub.called).to.be.false
			expect(processExitStub.called).to.be.false
		})
	})

	it('should not validate pull-request title', () => {
		const validPrTitles = [
			'feat: Add new feature',
			'fix fix bug',
			'chore:',
			'Improvement',
			'issue/123',
			'improvement',
			'issue',
		]

		validPrTitles.forEach(title => {
			validateTitle(title)

			expect(consoleErrorStub.calledWith('❌ PR title is not valid')).to.be.true
			expect(consoleLogStub.called).to.be.false
			expect(processExitStub.called).to.be.true
		})
	})

})
