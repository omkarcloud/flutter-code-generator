export function matchDeclaration(p: string,) {
    var a
    if ((a = matchClassDeclarations(p)) || (a = matchFuncDeclarations(p))) {
        return a
    }
    return null
}

// https://regex101.com/r/6cv0mM/1
export const matchClassDeclarations = regex(/^make\s+(\bcl\b)\s+(\w+)(.*)?/)

// https://regex101.com/r/BHtrkh/1
export const matchFuncDeclarations = regex(/^make\s+(\bfunc\b)(.*)/)

// make   func  r !r  n !n => func  , r !r  n !n 
// export const matchDeclaration = regex(/^make\s+(\bcl\b|\bfunc\b)(.*)/);

// param => param
export const matchParam = regex(exactMatchRegex('params'))
// func => meth
export const matchMeth = regex(exactMatchRegex('meths'))

// TODO IT IS QUITE REDUANDANT BUT IT WORKS  IT CAPTURES NON REQUIRED GROUPS ALL MAYBE WE WILL FIX IT   

// Tests are at https://regex101.com/r/2VNBIG/1
// GROUP 1 = i 
// GROUP 2 = s 
// GROUP 5 ?= ff,f  
// i s [ff,f ] => i,s ,ff
export const argsCapture = regex(/^(\w+)\s+(\w+)(\s+)?(\[(.*)\])?/)

// same as arsCapture but dont require [ ]
// https://regex101.com/r/AMdHOL/1
export const mathMethParamField = regex(/^(\w+)\s+(\w+)(\s+)?((.*))?/)

export function regex(r: RegExp) {
    return (s: string) => (r.exec(s))
}
//  Gives exact matching regex

export function exactMatchRegex(s: string) {
    return new RegExp(`^\\b${s}\\b$`)
}