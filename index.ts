#!/usr/bin/env node

import { validateTitle } from './src/pr-title'
import { validateConvention } from './src/branch-name'
import { checkPr } from './src/check-pr'
import { Command, Option, OptionValues } from 'commander'
import packageJson from './package.json'

const main = () => {
	const cli = new Command()

	cli
		.name('yargi-machine')
		.description('A CLI tool to bring justice to your codebase and judge you.')
		.version(packageJson.version)

	cli
		.addCommand(
			new Command('pull-request')
				.addOption(
					new Option(
						'-p, --checklist <file-path>',
						'Do checks on checklist placed in pull-request-template.md'
					)
						.conflicts('-b, --branch-name')
						.conflicts('-t, --title')
				)
				.addOption(
					new Option(
						'-b, --branch-name <branch-name>',
						'Do checks branch name suits the convention'
					)
						.conflicts('-p, --checklist')
						.conflicts('-t, --title')
				)
				.addOption(
					new Option(
						'-t, --title <file-path>',
						'Do checks on pull-request title'
					)
						.conflicts('-b, --branch-name').conflicts('-p, --checklist')
				)

				.action((opt: OptionValues) => {
					if (opt.checklist !== undefined) {
						checkPr(`${opt.checklist}`)
					}

					if (opt.branchName !== undefined) {
						validateConvention(`${opt.branchName}`)
					}

					if (opt.title !== undefined) {
						validateTitle(`${opt.title}`)
					}

					return
				})
		)

	cli
		.addCommand(
			new Command('report')
				.addOption(
					new Option(
						'-g, --github-pr',
						'Generate report for in-progress pull request'
					).default(false)
				)
				.addOption(
					new Option(
						'-j, --jira',
						'Generate report from Jira board'
					).default(false)
				)
		)

	if (process.argv.length < 3) {
		cli.help()

		return
	}

	cli.parse(process.argv)

	if (process.argv.includes('pull-request')) {
		const command = cli.commands.find(cmd => cmd.name() === 'pull-request')

		if (command !== undefined) {
			const options = command.opts()

			if (options.checklist === undefined && options.branchName === undefined && options.title === undefined) {
				command.help()
			}
		}
	}

	if (process.argv.includes('report')) {
		const command = cli.commands.find(cmd => cmd.name() === 'report')

		if (command !== undefined) {
			const options = command.opts()

			if (!options.githubPr && !options.jira) {
				command.help()
			}
		}
	}

	cli.showHelpAfterError()
}

main()
