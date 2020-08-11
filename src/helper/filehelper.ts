import fs = require('fs')

import * as mkdirp from 'mkdirp'
import * as vscode from 'vscode'
// import * as fs from 'fs';
import * as path from 'path'
import { QuickPickItem, ViewColumn } from 'vscode'


export interface WorkspaceRoot {
    rootPath: string
    baseName: string
    multi: boolean
}

export interface FSLocation {
    relative: string
    absolute: string
}

export function join(root: WorkspaceRoot, filename: string) {
    return path.join(root.rootPath, filename)
}

export function createFileOrFolder(absolutePath: string): void {
    let directoryToFile = path.dirname(absolutePath)
    if (!fs.existsSync(absolutePath)) {
        if (isFolderDescriptor(absolutePath)) {
            mkdirp.sync(absolutePath)
        } else {
            mkdirp.sync(directoryToFile)
            fs.appendFileSync(absolutePath, '')
        }
    }
}

export async function openFile(absolutePath: string, whichColumn: ViewColumn = ViewColumn.Active, preserveFocus = false) {
    const textDocument = await vscode.workspace.openTextDocument(absolutePath)!
    return vscode.window.showTextDocument(textDocument, whichColumn, preserveFocus)
}

function isFolderDescriptor(filepath: string): boolean {
    return filepath.charAt(filepath.length - 1) === path.sep
}

export function workspaceRoots(): WorkspaceRoot[] {
    if (vscode.workspace.workspaceFolders) {
        const multi = vscode.workspace.workspaceFolders.length > 1
        return vscode.workspace.workspaceFolders.map((folder) => {
            return {
                rootPath: folder.uri.fsPath,
                baseName: path.basename(folder.uri.fsPath),
                multi
            }
        })
    } else if (vscode.workspace.rootPath) {
        return [{
            rootPath: vscode.workspace.rootPath,
            baseName: path.basename(vscode.workspace.rootPath),
            multi: false
        }]
    } else {
        return []
    }
}