import { Class, ParameterOptions, ParameterInfo, Parameter, ClassOptions, Method } from '../codegen/Base'

export const defaultClassOptions = (['!r', 'n', '!f'].concat(['str', 'eq']))

export const defaultMethOptions = (['!r', 'n', '!f'])
// export function addDefaultOptions(params: string[]) {
//     return defaultClassOptions.concat(params)
// }

function getDefaultClassOptions(): DefaultOptionFromClass {
    return { required: false, final: false, named: true }
}
export interface DefaultOptionFromClass {
    required: boolean
    final: boolean
    named: boolean
}
export interface DefaultOptionFromMeths {
    required: boolean
    named: boolean
}

export interface AggregateParam {
    param: Parameter
    named: boolean
}


export function isAnyRequiredClass(cl: Class) {

    const { ci: { namedParams, unnamedParams, cons, imports, pr, className }, classdependentmethods, methods, } = cl
    if (doesanyhasRequired(namedParams) || doesanyhasRequired(unnamedParams) || isAnyRequiredMeths(methods)) {
        return true
    }

    return false
}


export function doesanyhasRequired(params: Parameter[]) {
    return params.some(p => p.po.required ? true : false)
}

export function isAnyRequiredMeths(methods: Method[]) {
    var any = false

    methods.forEach(m => {
        if (doesanyhasRequired(m.pi.namedParams) || doesanyhasRequired(m.pi.unnamedParams)) {
            any = true
        }
    })
    return any
}

// po = r !r f !f n !n 
function mapParams(pi: ParameterInfo, po: string[], classOptions: DefaultOptionFromClass): AggregateParam {
    var { required, final, named } = determineDefaultOptions(po, classOptions,)

    const param = new Parameter(pi, { isThis: false, required }, final ? "final" : "")
    return { param, named }
}

export function mapParamsForMeth(pi: ParameterInfo, po: string[], classOptions: DefaultOptionFromMeths): AggregateParam {
    var { required, named } = determineDefaultOptionsForMethsParams(po, classOptions,)

    const param = new Parameter(pi, { isThis: false, required }, "")
    return { param, named }
}


export function seperateParams(aggs: AggregateParam[]) {
    const namedParams = aggs.filter(a => a.named).map(p => p.param)
    const unnamedParams = aggs.filter(a => !a.named).map(p => p.param)
    return { namedParams, unnamedParams }
}

export function copyFeildsToConstructore(aggs: AggregateParam[]) {
    return aggs.map(a => {
        a.param.po.isThis = true
        return a
    })
}
function mapClass() {

    const op = determineDefaultOptions([])
    // fs = mapParams()
    // cons = copyFeildsToConstructore
    // seperateParams fs 
    // seperateParams cons
    //  

}

function determineDefaultOptionsForMethsParams(po: string[],
    options: DefaultOptionFromMeths): DefaultOptionFromMeths {

    var required = options.required
    var named = options.named

    po.forEach(o => {
        switch (o) {
            case 'r':
                required = true
                break
            case '!r':
                required = false
                break
            case 'n':
                named = true
                break
            case '!n':
                named = false
                break
            default:
                break
        }
    })

    return { required, named }
}

export function generateClassOptions(po: string[]): ClassOptions {
    const classOptions: ClassOptions = {}

    po.forEach(o => {
        switch (o) {
            case 'str':
                classOptions.generatetoString = true
                break
            case '!str':

                classOptions.generatetoString = false
                break
            case 'eq':
                classOptions.generateEquals = true
                break
            case '!eq':
                classOptions.generateEquals = false
                break
            default:
                break
        }
    })

    return classOptions
}
export function generateStateOptions(po: string[]) {
    const stateOptions = { stf: false, stl: false }
    po.forEach(o => {
        switch (o) {
            case 'stf':
                stateOptions.stl = false
                stateOptions.stf = true
                break
            case '!stf':
                stateOptions.stf = false
                break
            case 'stl':
                stateOptions.stf = false
                stateOptions.stl = true
                break
            case '!stl':
                stateOptions.stl = false
                break
            default:
                break
        }
    })

    return stateOptions
}


export function determineDefaultOptions(po: string[], classOptions: DefaultOptionFromClass = getDefaultClassOptions(),): DefaultOptionFromClass {

    var final = classOptions.final
    var required = classOptions.required
    var named = classOptions.named

    po.forEach(o => {
        switch (o) {
            case 'r':
                required = true
                break
            case '!r':
                required = false
                break
            case 'n':
                named = true
                break
            case '!n':
                named = false
                break
            case 'f':
                final = true
                break
            case '!f':
                final = false
                break
            default:
                break
        }
    })

    return { required, final, named }
}

export { mapParams }