/* eslint-disable eqeqeq */
/* eslint-disable no-throw-literal */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Line } from "../Line"
import { matchParam, matchMeth, argsCapture, matchClassDeclarations, matchFuncDeclarations, matchDeclaration, mathMethParamField } from './regex'
import { Class, ParameterInfo, Constructor, Method, Code, printCode } from '../codegen/Base'
import { impossible } from '../../helper/utils/dateUtils/impossible'
import { determineDefaultOptions, defaultClassOptions, DefaultOptionFromMeths, mapParams, mapParamsForMeth, seperateParams, generateClassOptions, copyFeildsToConstructore, generateStateOptions, defaultMethOptions, isAnyRequiredClass, isAnyRequiredMeths } from './mappers'
import { split } from '../../helper/utils/utils'
import { optionsToMeth, generateStatelessWidget, generateStatefullWidget } from '../codegen/extensions'

import { dartTypeOf } from './objectsmappers'
import { Emmiter } from '../codegen/emmiter'
import { specsToStr } from '../dartCode'
interface ReturnType {
    stateFull?: {
        state: Class
        widget: Class
    },
    class?: Class
}


const importMeta = "import 'package:meta/meta.dart';"
function toClass(p: RegExpExecArray, meths: RegExpExecArray[], params: RegExpExecArray[]) {

    const className = p[2]
    // console.log(p)
    type args = undefined | string

    const optionalargs = p[3] ? p[3] : ''
    // console.log({className, optionalargs})
    var arr: string[] = []

    arr = arr.concat(defaultClassOptions).concat(split(optionalargs))

    const parameterOptions = determineDefaultOptions(arr,)
    const methParmOptions: DefaultOptionFromMeths = parameterOptions


    const aggs = params.map(p => {
        return parmHelper(p, (pi, options) => mapParams(pi, options, parameterOptions))
    })

    const ps = seperateParams(aggs)
    const cs = seperateParams(copyFeildsToConstructore(aggs))

    var cl = new Class({
        className, namedParams: ps.namedParams, unnamedParams: ps.unnamedParams
        , cons: new Constructor({ className, namedParams: cs.namedParams, unnamedParams: cs.unnamedParams, })
    },
        optionsToMeth(generateClassOptions(arr)), makeFunctionsFromArray(meths))
    // console.log({ arr })
    const stateOptions = generateStateOptions(arr)

    meths.forEach(m => toFuncs(m))

    if (stateOptions.stf) {
        const st = generateStatefullWidget(cl)
        return [st.widget, st.state]
    }

    else if (stateOptions.stl) {
        return [generateStatelessWidget(cl)]
    }

    if (isAnyRequiredClass(cl)) {
        addImport(cl, importMeta)
    }

    return [cl]
}


function addImport(cl: Class, im: string) {
    if (cl.ci.imports) {
        cl.ci.imports.codes.unshift(im)
    }
    else {
        cl.ci.imports = new Code([im])
    }
}

function parmHelper<A>(p: RegExpExecArray, ff: (type: ParameterInfo, options: string[]) => A,) {

    const type = dartTypeOf(p[1])
    const name = p[2]
    const options = split(p[5] ? p[5] : '')

    return ff({ type, name }, options)
}

function makeFunctionsFromArray(ls: RegExpExecArray[]) {
    return ls.map(toFuncs)
}


function toFuncs(p: RegExpExecArray) {
    const methOptions = (determineDefaultOptions(defaultMethOptions))

    const returnType = dartTypeOf(p[1])
    const name = p[2]

    const allparams = split(p[5] ? p[5] : '', ',')
        // filter out invalid ones
        .filter(s => {
            const res = mathMethParamField(s)
            return (res ? true : false)
        })
        .map(s => {
            const res = mathMethParamField(s) as RegExpExecArray
            const type = dartTypeOf(res[1])
            const name = res[2]
            const options = split(res[5] ? res[5] : '')
            return {
                type,
                name
                , options
            }
        }).map(pi => mapParamsForMeth(pi, pi.options, methOptions))


    const { namedParams, unnamedParams } = seperateParams(allparams)
    const m = new Method({ code: printCode(`Hello from ${name}`), name, returnType, }, { namedParams, unnamedParams, })
    return m
}

enum ParseState {
    Func,
    Class,
    Capturing,
    // It will skip a line 
    Skip
}
enum ClassState {
    meth,
    params
}

interface Error {
    shouldThrow: boolean
    error: () => void
}

export function findNextClassFeild(p: string,) {
    var a
    // console.log({ a: matchParam("params") })
    if ((a = matchParam(p)) || (a = matchMeth(p))) {
        return a[0] as 'meths' | 'params'
    }
}



export function parse(ls: Line[], shoullog = false): { err: number[], result: string, NotFoundStatus: boolean, } {
    // Code executed on skipping
    // console.log(ls)
    var onSkip: () => void = () => { throw "error" }
    const e: Error = { error: () => { throw "error" }, shouldThrow: false }
    var classState = ClassState.params
    const err: number[] = []

    var state = ParseState.Capturing, toCreatState: ParseState.Class | ParseState.Func | undefined

    const meths: RegExpExecArray[] = []
    const params: RegExpExecArray[] = []
    const funcs: RegExpExecArray[] = []

    // var nextLine: Line | undefined

    var declaration: RegExpExecArray
    // declaration = ls[0]
    function capture(text: string, l: Line, ls: RegExpExecArray[]) {
        const result = argsCapture(text)
        if (result) {
            ls.push(result)
        }
        else {
            err.push(l.num)
        }
    }

    ls.forEach((l, i) => {
        const nextLine = ls[i + 1] as Line | undefined

        // const nextnum = nextLine.num
        // const nexttext = nextLine.text

        // const { nextnum, text as a } = nextLine
        const { num, text } = l

        switch (state) {
            case ParseState.Capturing:
                const r = matchDeclaration(text)
                // console.log(r)
                if (r) {
                    declaration = r
                    if (r[1] == 'func') {
                        toCreatState = ParseState.Func
                        state = ParseState.Func
                    } else if (r[1] == 'cl') {
                        if (nextLine) {
                            const f = findNextClassFeild(nextLine.text)
                            if (f) {
                                state = ParseState.Skip
                                onSkip = () => {
                                    classState = determineClassState(f, classState)
                                    state = ParseState.Class
                                    toCreatState = ParseState.Class
                                }
                            } else {
                                e.shouldThrow = true
                                e.error = () => { throw `Expected meths or params recieved ${nextLine.text}` }
                            }
                        }
                    }
                    // Regex could be only func or class 
                    else impossible()
                } else {
                    err.push(num)
                }
                break
            case ParseState.Class:
                switch (classState) {
                    case ClassState.meth:
                        capture(text, l, meths)
                        break
                    case ClassState.params:
                        capture(text, l, params)
                        break
                }
                if (nextLine) {
                    const f = findNextClassFeild(nextLine.text)
                    if (f) {
                        state = ParseState.Skip
                        onSkip = () => {
                            classState = determineClassState(f, classState)
                            state = ParseState.Class
                        }
                    }
                }
                break
            case ParseState.Func:
                capture(text, l, funcs)
                break
            case ParseState.Skip:
                onSkip()
                break

        }

        if (e.shouldThrow) {
            e.error()
        }
    })


    if (shoullog) {

        if (!(declaration!)) {
            console.log('object')
        }
        // console.log(declaration!)
    }

    if (state === ParseState.Capturing && !(declaration!)) {
        // console.log("Do make sure that your declatation matches make func or make cl className")
        return { err, NotFoundStatus: true, result: "" }
    }

    // console.log({ declaration: declaration!, meths, params, funcs, state, toCreatState, err })
    var result = ''
    switch (toCreatState) {
        // we will have declarations use it 

        case ParseState.Func:
            const fs = makeFunctionsFromArray(funcs)
            // console.log(isAnyRequiredMeths(fs))
            result = specsToStr(fs, isAnyRequiredMeths(fs) ? importMeta : '')
            break
        case ParseState.Class:
            //  get hold of declartions parse it log it
            const classes = toClass(declaration!, meths, params)
            result = specsToStr(classes)
            break
        case undefined:
            if ((declaration!)) {
                //  get hold of declartions parse it log it
                const classes = toClass(declaration!, meths, params)
                result = specsToStr(classes)
                break
            }

            impossible()
            break

    }

    return { result, err, NotFoundStatus: false }
}

function determineClassState(f: string, classState: ClassState) {
    if (f == 'meths') {
        return ClassState.meth
    }
    else if (f == 'params') {
        return ClassState.params
    }
    else
        impossible()
    return classState
}

