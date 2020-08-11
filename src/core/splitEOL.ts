import { EOL } from "os"
// import {} from 'yargs-parser'
export { EOL }

export function splitEOL(i: string) {
    return i
        // .trim()
        .split(EOL)
}
