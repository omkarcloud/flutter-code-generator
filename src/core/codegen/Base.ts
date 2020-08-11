import { between, braces } from '../../helper/utils/utils'
import { isNotEmptyString } from '../../helper/utils/tsUtils'
import { EOL } from '../splitEOL'
// import { Parameter } from './Base'

export interface Spec {


    // Emitter is kept optional as in some instances we may have some content in emitter
    accept<T>(visitor: SpecVisitor<T>, emitter: T): T
}

export interface ClassOptions {
    generatetoString?: boolean
    generateEquals?: boolean
}


// E will be emitter could change definetly
export interface SpecVisitor<E> {

    visitField(spec: Parameter, e: E): E

    visitMethod(spec: Method, e: E): E

    visitClass(spec: Class, e: E): E

    visitConstructor(spec: Constructor, e: E): E

}

export function printCode(params: String) {
    return new Code([`print('${params}')`])
}

export class Code {

    constructor(public codes: string[] = []) { }

    public get code(): string {
        return between(this.codes.map(c => {
            c = c.trim()
            var lastChar = c.substr(c.length - 1) === ';'
            return c + (lastChar ? '' : ";") + EOL
        }), "")
    }
}


export type f = (classname: string, ps: Parameter[]) => Method

interface ClassInfo extends ParamInfo {
    cons?: Constructor, pr?: string, imports?: Code, className: string
}

export class Class implements Spec {

    constructor(
        public ci: ClassInfo,
        public classdependentmethods: f[] = [],
        public methods: Method[] = [],

    ) {
    }

    accept<T>(visitor: SpecVisitor<T>, emitter: T): T {
        return visitor.visitClass(this, emitter)
    }
}

export interface Parent {
    name: string,
    params: Parameter[]
}

export class Method implements Spec {

    constructor(
        public mu: MethodInfo,
        public pi: ParamInfo = { namedParams: [], unnamedParams: [] }, public anaotations: string = "") { }

    accept<T>(visitor: SpecVisitor<T>, emitter: T): T {
        return visitor.visitMethod(this, emitter)
    }
}

interface MethodInfo {
    name: string, returnType: string, code: Code
}
interface ParamInfo {
    unnamedParams: Parameter[], namedParams: Parameter[]
}
interface ClassNameAndParams extends ParamInfo {
    className: string,
}

export class Constructor implements Spec {
    constructor(
        public ci: ClassNameAndParams,
        public pr?: Parent) { }
    accept<T>(visitor: SpecVisitor<T>, emitter: T): T {
        return visitor.visitConstructor(this, emitter)
    }
}


// export interface Parameter {
//     isNamed: boolean
//     name: string
//     type: string

//     /**
//      * 
//     @param isThis -  This is only valid on constructors;
//     @param modifier -  This is only valid on constructors;
//     **/
//     modifier?: 'final' | 'var' | 'const'
//     isThis: boolean
//     required: boolean
// }

export interface ParameterOptions {
    isThis?: boolean,
    required?: boolean,
}

export interface ParameterInfo {
    name: string, type: string,
}


export class Parameter implements Spec {

    /** 
    @param isThis -  This is only valid on constructors;
    @param modifier -  This is only valid on constructors;
    **/

    copyWith(name: string): Parameter {
        return new Parameter({ ...this.pi, name }, { ...this.po }, this.modifier)
    }

    constructor(
        public pi: ParameterInfo, public po: ParameterOptions = {}, public modifier: 'final' | '' = 'final'
    ) { }

    accept<T>(visitor: SpecVisitor<T>, emitter: T): T {
        return visitor.visitField(this, emitter)
    }

}


// export class Field implements Spec {

//     constructor(public name: string, public type: string, public modifier: 'final' | 'var' | 'const'
//     ) { }

//     accept<T>(visitor: SpecVisitor<T>, emitter: T): T {
//         return visitor.visitField(this, emitter)
//     }
// }
// export class Parameter implements Spec {

//     constructor(public name: string, public type: string,  { ...Parameter} ) { }

// }

// Not needed modifier 
