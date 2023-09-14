import { expect } from 'chai'
import { validateConvention } from '../../src/branch-name'
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


	it('should validate valid branch names', () => {
		const validBranchNames = [
			'main',
			'development',
			'dev',
			'master',
			'feature/new-feature',
			'test/fix-bug',
			'issue/123',
			'bugfix/123-fix',
			'release/v1.0',
			'release/v1.0-alpha.1',
			'feat/branch-name',
			'feature/branch-name',
			'test/branch-name',
			'improvement/branch-name',
			'issue/branch-name',
			'bugfix/branch-name',
			'hotfix/branch-name',
			'fix/branch-name',
			'release/v1.0.0',
			'release/1.0.0',
			'release/v1.0.0-alpha',
			'release/1.0.0-alpha',
			'release/v1.0.0-alpha.1',
			'release/1.0.0-alpha.1',
			'release/v1.0.0-alpha1',
			'release/v1.0.0-beta',
			'release/1.0.0-beta',
			'release/v1.0.0-beta.1',
			'release/1.0.0-beta.1',
			'release/v1.0.0-beta1',
			'chore/branch-name',
			'docs/branch-name',
		]

		validBranchNames.forEach(branchName => {
			validateConvention(branchName)

			expect(consoleLogStub.calledWith('✅ Branch name is valid')).to.be.true
			expect(consoleErrorStub.called).to.be.false
			expect(processExitStub.called).to.be.false
		})
	})

	it('should not validate invalid branch names', () => {
		const invalidBranchNames = [
			'invalid-branch',
			'hotfix/',
			'release/v1.0-beta-',
			'test/',
			'master-',
			'main/',
			'dev/',
			'development1a',
			'feat/branch_name',
			'feature/branch-nam e/',
			'test/branch-name/',
			'improvement/branch-name1|',
			'issue/branch_name',
			'bugfix/branch-name/',
			'hotfix/branch_name/',
			'fix/branch-name-/x_',
			'release/v1.0.0/',
			'release/1.0.0/',
			'release/1.0.0_alpha',
			'release/v1.0.0_alpha.1',
			'release/1.0.0_alpha.1',
			'release/v1.0.0/alpha1',
			'release/v1.0.0|beta',
			'release/1.0.0abeta',
			'release/v1.0.0/beta.1',
			'release/1.0.0_beta.1',
			'release/v1.0.0.Beta1',
		]

		invalidBranchNames.forEach(branchName => {
			validateConvention(branchName)

			expect(consoleErrorStub.calledWith('❌ Branch name is not valid')).to.be.true
			expect(consoleLogStub.called).to.be.false
			expect(processExitStub.called).to.be.true
		})
	})
})
