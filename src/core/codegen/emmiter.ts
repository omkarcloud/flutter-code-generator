import { between, line, NL } from '../../helper/utils/utils'
import indentString from 'indent-string'

export class Emmiter {

    // content: string = ""
    private defaultindent: string = '\t'
    private ls: string[] = []
    indent: number = 3



    public get content(): string {
        // console.log(between(this.ls, ""))
        return between(this.ls, "")
    }

    public get last(): string {
        return this.ls[this.ls.length - 1]
    }

    private add(param: string) {
        this.ls.push(param)
        // this.content = this.content + params
    }

    reset() {
        this.ls = []
    }


    static concat(s: string, s1: string) {
        return s + NL + s1
    }


    emitLine() {
        this.add(line())
    }

    // emit with a new line  
    emit(s: string, shouldAddNewLine = true) {
        this.add(this.makeStr(s, shouldAddNewLine))
    }

    private makeStr(s: string, shouldAddNewLine: boolean): string {
        return s + (shouldAddNewLine ? NL : "")
    }

    emitNoLine(s: string) {
        this.emit(s, false)
    }

    surround(start = "{", end = "}") {
        this.emitAtTop(start)
        this.emit(end)
    }

    indentStr(s: string) {
        return indentString(s, this.indent)
    }

    indentAll() {
        this.ls = this.ls.map(l => this.indentStr(l))
    }

    emitAtTop(s: string, shouldAddNewLine = true) {
        this.ls = [this.makeStr(s, shouldAddNewLine), ...this.ls]
    }

    private createNewEmmiter() {
        return new Emmiter()
    }

    emitWithIndent(f: (e: Emmiter) => void) {
        const e = this.createNewEmmiter()
        f(e)
        e.indentAll()
        this.add((e.content))
    }

}

function char_count(str: string, letter: string) {
    var letter_Count = 0
    for (var position = 0; position < str.length; position++) {
        if (str.charAt(position) == letter) {
            letter_Count += 1
        }
    }
    return letter_Count
}
