import vscode = require('vscode')
import fs = require('fs')
import path = require('path')

/**
 * @param {string} msg
 */
function showError(msg: string) {
    vscode.window.showErrorMessage(msg)
}

/**
 * @param {string} msg
 */
function showInfo(msg: string) {
    vscode.window.showInformationMessage(msg)
}
function getWindow() {
    return vscode.window
}

function getEditor() {
    const window = getWindow().activeTextEditor

    if (!window) {
        showInfo('Calling edit when not in edit error')
    }

    return vscode.window.activeTextEditor!
}

function getDoc() {
    return getEditor().document
}

function getDocText() {
    return getDoc().getText()
}

function getLangId() {
    return getDoc().languageId
}


function getEdit() {
    return new vscode.WorkspaceEdit()
}



/**
 * @param {vscode.TextEditorEdit} editor
 * @param {number} start
 * @param {number} end
 * @param {string} value
 */


function editorReplace(editor: vscode.TextEditorEdit, value: string, start?: number, end?: number,) {
    editor.replace(new vscode.Range(
        new vscode.Position(start || 0, 0),
        new vscode.Position(end || getDocText().split('\n').length, 1)
    ), value
    )
}

/**
 * @param {vscode.TextEditorEdit} editor
 * @param {number} at
 * @param {string} value
 */

function editorInsert(editor: vscode.TextEditorEdit, value: string, at: number = 0,) {
    editor.insert(new vscode.Position(at, 0), value)
}
function getCurrentPath() {
    let path = getDoc().fileName
    console.log(path)
    let dirs = path.split("\\")
    path = ''
    for (let i = 0; i < dirs.length; i++) {
        let dir = dirs[i]
        if (i < dirs.length - 1) {
            path += dir + "\\"
        }
    }

    return path
}


export { getDoc, getDocText, getCurrentPath, getLangId, getEditor, showError, showInfo, editorInsert, getWindow, editorReplace, getEdit }