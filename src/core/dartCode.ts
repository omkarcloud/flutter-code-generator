import { Spec } from '../core/codegen/Base'
import { CodeGenerator } from "../core/codegen/CodeGenerator"
import { Emmiter } from '../core/codegen/emmiter'
import { between } from '../helper/utils/utils'
import { EOL } from '../core/splitEOL'


export function dartCode(p: Spec) {
    const e = new Emmiter()
    return [((p.accept(new CodeGenerator(), e)).content), e]
}

export function codeGenCheck(p: (c: CodeGenerator) => void) {
    p(new CodeGenerator())
}


export function logCode(p: Spec, shouldLogUniCode = true) {
    if (shouldLogUniCode) {
        logString(specToStr(p))
    }
    else {
        log(specToStr(p))
    }
}
function specToStr(p: Spec): string {
    return dartCode(p)[0] as string
}

export function specsToStr(ls: Spec[], atTop: string = ''): string {
    const lss = ls.map(specToStr)
    if (atTop) {
        lss.unshift('')
        lss.unshift(atTop)

    }
    return between(lss, EOL)
}

export function log(params: any) {
    console.log("---------------------\n" + params + "\n---------------------")
    // console.log(params)
    // console.log("---------------------")
}
// Logs string displaying all \n 

export function logString(p = "") {
    console.log([p])
}
export const strings = ['a', 'b', 'c']
