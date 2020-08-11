import { TextEditor, WorkspaceEdit, window, workspace, Range, Position, ViewColumn } from "vscode"
import * as vscode from 'vscode'

import { getDoc, getDocText, getLangId, getEditor, showError, showInfo, editorInsert, editorReplace, getEdit, getCurrentPath } from './helper/helper'
import { workspaceRoots, join, createFileOrFolder, openFile } from './helper/filehelper'
// import { parse } from './core/parser/parser'
import { cleanInput } from './core/cleanInput'
import { of, timer } from 'rxjs'
import * as _ from 'lodash'
import { isListNotEmpty, isEmptyString } from './helper/utils/tsUtils'
import { between } from './helper/utils/utils'
import { parse } from './core/parser/parser'
// const notFound = _.debounce(() => {
//    console.log('Not found')
//    showError('Brother make sure you have make funcs/make cl className at the begging')
// }, 1000)

var errors: any[]
const showErrorLine = _.throttle(() => {
   showInfo(`Some inconsistencies following you on lines:${between(errors.map(e => e.toString()))} we dont mind but just in case`)
}, 500)

export const command = async () => {
   const rs = workspaceRoots()

   const path = join(rs[0], 'recieved')
   const pathoutput = join(rs[0], 'given.dart')

   createFileOrFolder(path)
   createFileOrFolder(pathoutput)

   const i = await openFile(path)
   const output = await openFile(pathoutput, ViewColumn.Beside,
      true
   )

   vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.fileName === path) {

         const text = e.document.getText()
         // if
         output.edit(editor => {
            const { err, result, NotFoundStatus } = parse(cleanInput(text))

            // console.dir({ NotFoundStatus }, { depth: null })
            if (NotFoundStatus) {

               console.log('Not found recieved')
               // notFound()
               return
            }

            if (isListNotEmpty(err)) {
               errors = err
               showErrorLine()
            }


            var firstLine = output.document.lineAt(0)
            var lastLine = output.document.lineAt(output.document.lineCount - 1)
            var textRange = new vscode.Range(firstLine.range.start, lastLine.range.end)
            editor.replace(textRange, result)
         })
      }
   })



   if (isEmptyString(i.document.getText())) {
      i.edit(e => {

         var firstLine = output.document.lineAt(0)
         var lastLine = output.document.lineAt(output.document.lineCount - 1)
         var textRange = new vscode.Range(firstLine.range.start, lastLine.range.end)
         const input = `make cl Fruit   
params     
s name [f !n]
meths 
b sweet [s name !n , i index, d rating]
dy origin`

         e.replace(textRange, input)
      })
   }
}
