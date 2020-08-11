import { Emmiter } from './emmiter'
import { NL, between } from '../../helper/utils/utils'
import { isListNotEmpty, isEmptyString, isNotEmptyString } from '../../helper/utils/tsUtils'
import indentString from 'indent-string'
import { SpecVisitor, Constructor, Class, Method, Parameter, Code } from './Base'

export class CodeGenerator implements SpecVisitor<Emmiter> {

    private makeParams(unnamedParams: Parameter[], namedParams: Parameter[], f: (ps: Parameter) => string = this.mapParam) {

        var params = ""
        const unp = this.visitParameter(unnamedParams, f)
        const np = this.visitParameter(namedParams, f)


        // check if we have both named and unnamed  if yes do it 
        // handle case for one and one 
        if (isListNotEmpty(unnamedParams) && isListNotEmpty(namedParams)) {
            params = `${unp},{${np}}`
        }
        else if (isListNotEmpty(unnamedParams)) {
            params = `${unp}`
        }
        else if (isListNotEmpty(namedParams)) {
            params = `{${np}}`
        }
        else {
            params = ''
        }

        return params
    }

    visitConstructor(spec: Constructor, e: Emmiter): Emmiter {
        const { ci: { className, namedParams, unnamedParams, }, pr } = spec

        unnamedParams.forEach(p => p.po.isThis = true)
        namedParams.forEach(p => p.po.isThis = true)

        const unp = this.visitParameter(unnamedParams, this.mapConstructorParam)
        var np = this.visitParameter(namedParams, this.mapConstructorParam)


        if (spec.pr) {
            const prr = between(spec.pr.params.map(this.mapParam))
            // console.log(prr)
            if (isNotEmptyString(prr)) {
                np = (isNotEmptyString(np) ? (np + ", ") : "") + prr
            }
            // spec.pr.params.forEach(p => p.po.isThis = false)
            // namedParams.push(...spec.pr.params)
        }
        var params = ""
        // console.log({ unp, np })
        if (isNotEmptyString(unp) && isNotEmptyString(np)) {
            params = `${unp},{${np}}`
        }
        else if (isNotEmptyString(unp)) {
            params = `${unp}`
        }
        else if (isNotEmptyString(np)) {
            params = `{${np}}`
        }
        else {
            params = ''
        }

        const s = `${className}(${params})${spec.pr ? ` : super(${this.mapSuperParam(spec.pr.params)})` : ""};`
        e.emit(s)
        return e
    }

    mapSuperParam(ps: Parameter[]) {
        return (between(ps.map(p => `${p.pi.name} : ${p.pi.name}`)))
    }

    // mapSuperParams<E>(p: E, f: (e: E) => string) { }


    visitClass(spec: Class, e: Emmiter): Emmiter {
        const { ci: { namedParams, unnamedParams, cons, imports, pr, className }, classdependentmethods, methods, } = spec
        var s = imports ? `${imports.code}\n` : ""

        e.emitNoLine(s)
        s = `class ${className} ${pr ? `extends ${pr} ` : ''}{`
        e.emit(s)

        e.emitWithIndent((e) => {

            var feilds = unnamedParams.concat(namedParams)

            feilds.forEach(f => this.visitField(f, e))
            e.emitLine()

            if (cons) {
                this.visitConstructor(cons, e)
                e.emitLine()
            }

            spec.methods.forEach(m => this.visitMethod(m, e))

            spec.classdependentmethods.forEach(m => {
                this.visitMethod(m(className, feilds), e)
            })

        })

        e.emit("}")
        return e
    }

    visitMethod(spec: Method, e: Emmiter): Emmiter {
        const { anaotations, mu: { name, returnType, code }, pi: { namedParams, unnamedParams } } = spec
        const params = this.makeParams(unnamedParams, namedParams)

        const indentedCode = indentString(code.code, e.indent)
        var s = ""
        if (isNotEmptyString(spec.anaotations)) {
            s = spec.anaotations + "\n"
        }
        s = s + `${returnType} ${name}(${params}){${NL}${indentedCode}}`
        e.emit(s)
        e.emitLine()
        return e
    }




    visitParameter(ps: Parameter[], f: (ps: Parameter) => string) {
        const ns = ps.map(f)
        return between(ns)
    }


    private mapConstructorParam(p: Parameter) {
        const { modifier, pi: { name, type }, po: { isThis, required } } = p
        var s = required ? "@required " : ""

        if (isThis) {
            s += (`this.${name}`)
        } else {
            s += (`${type} : ${name}`)
        }

        return s

    }


    private mapParam(p: Parameter) {
        const { modifier, pi: { name, type }, po: { isThis, required } } = p

        return (`${required ? "@required " : ""}${type} ${name}`)
    }

    visitField(spec: Parameter, e: Emmiter): Emmiter {

        const { modifier, pi: { name, type }, po: { isThis, required } } = spec
        const s = `${isEmptyString(spec.modifier) ? "" : `${spec.modifier} `}${isEmptyString(type) ? "" : `${type} `}${name};`
        e.emit(s)
        return e
    }
}
