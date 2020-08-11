import { splitEOL } from "./splitEOL"
import { multiplespacesToSingle as multiplespacesToSingleTrim } from '../helper/utils/utils'
import { isEmpty } from '../helper/utils/tsUtils'
import { Line } from "./Line"
export function cleanInput(text: string): Line[] {
    var t = splitEOL(text).map((s, i) => {
        return ({ num: i + 1, text: multiplespacesToSingleTrim(s) })
    })
    // console.log(t)
    t = t.filter(a => {
        return !isEmpty(a.text)
    })
    // console.log(a)
    return t
}
