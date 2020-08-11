import { splitEOL } from '../../core/splitEOL'
import { EOL } from "os"
export function between(ls: string[], between = ", ") {
    // same as ls.length == 0
    if (ls.length === 0) {
        return ""
    }
    if (ls.length === 1) {
        return ls[0]
    }

    return ls.reduce((r, rs) => r + between + rs)
}
export function apply<A, R>(a: A | undefined | null, f: (a: A) => R, u?: () => R) {
    if (a) {
        return f(a)
    } else {
        if (u) {
            return u()
        }
    }
}

// Ignores empty
export function split(text: string, byWhat = ' ') {
    // replace more than  2  spaces with 1 
    text = multiplespacesToSingle(text)
    return removeEmpty(text.split(byWhat).map(p => p.trim()))
}

export function multiplespacesToSingle(text: string): string {
    return text.trim().replace(/\s{2,}/g, ' ')
}

export function removeEmpty(text: string[]) {
    return text.filter(t => t.length > 0)
}


export function char_count(str: string, letter: string) {
    var letter_Count = 0
    for (var position = 0; position < str.length; position++) {
        if (str.charAt(position) == letter) {
            letter_Count += 1
        }
    }
    return letter_Count
}

export function line(content = "") {
    return content + NL
}

export function braces(content = "", start = "{", end = "}") {
    return start + content + end
}

export const NL = EOL