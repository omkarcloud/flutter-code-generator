import * as vscode from 'vscode'
import { command } from './startExecution'

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "flutter-code-generator" is now active!')

	let disposable = vscode.commands.registerCommand('flutter-code-generator.generateCode', () => {
		command()
	})

	context.subscriptions.push(disposable)
}

export function deactivate() { }