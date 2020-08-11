import { Parameter, Method, Code, Class, Constructor, ClassOptions } from './Base'
import { Emmiter } from './emmiter'
import { between } from '../../helper/utils/utils'
import { removeItemOnce } from '../../helper/utils/tsUtils'

const overrides = "@override"
function generateToString(
    classname: string, ps: Parameter[],
) {
    const s = between(ps.map(p => `${p.pi.name}: $${p.pi.name}`))

    return new Method({ name: "toString", returnType: "String", code: new Code([`return '${classname} {${s}}'`]) }
        , { namedParams: [], unnamedParams: [] }, overrides)

}


// @override
//   Widget build(BuildContext context) {
//     return Container(child: Text("Hello here"),);
//   }



function generateBuildMethod(
    classname: string,
) {
    return new Method({ name: "build", returnType: "Widget", code: new Code([`return Container(child: Text("Hello from ${classname}"),)`]) }
        , { unnamedParams: [new Parameter({ name: "context", type: "BuildContext" },)], namedParams: [] }, overrides)
}

// @override
// _AppleState createState() {
//   return _AppleState();
// }

function generateCreateState(
    classname: string, ps: Parameter[],
) {
    const returnType = createReturnTypeStf(classname)
    return new Method({ name: "createState", returnType, code: new Code([`return ${returnType}()`]) }
        , { namedParams: [], unnamedParams: [] }, overrides)
}

const materialImport = new Code(["import 'package:flutter/material.dart'"])
const keyParam = new Parameter({ name: "key", type: "Key" })
function createReturnTypeStf(classname: string) {
    return `_${classname}State`
}

// const keyParamForWidget = new Parameter("key", "Key", true, false, false)
// const keyParamForWidget = new Parameter({name:"key",  type:"Key"} ,)


function addParamsToParent(cl: Class, params: Parameter) {
    cl.ci.cons?.pr?.params.push(params)
}

var buildmeth: Method
export function generateStatelessWidget(
    cl: Class
) {
    buildmeth = generateBuildMethod(cl.ci.className)
    cl.methods.unshift(buildmeth)
    changeParent(cl, "StatelessWidget")
    addParamsToParent(cl, keyParam)
    // Add imports 
    cl.ci.imports = materialImport
    return cl
}

export function generateStatefullWidget(
    cl: Class
) {
    generateStatelessWidget(cl)
    const a = cl.methods.find(f => {
        return buildmeth === f
    })

    removeItemOnce(cl.methods, a)
    changeParent(cl, "StatefulWidget")
    cl.classdependentmethods.unshift(generateCreateState)
    // Create State
    const className = cl.ci.className
    const state = new Class({
        className:
            createReturnTypeStf(className), namedParams: [], unnamedParams: [],
        pr: `State<${className}>`
    }, [], [generateBuildMethod(className)])

    return { state: state, widget: cl }
}

// function clearClassDependentMethods(cl: Class) {
//     cl.classdependentmethods = []
// }
function changeParent(cl: Class, s: string) {
    cl.ci.pr = s
    cl.ci.cons!.pr = { name: s, params: cl.ci.cons!.pr ? cl.ci.cons!.pr.params : [] }
}

export function optionsToMeth(os: ClassOptions,) {
    const meths = []
    if (os.generateEquals) {
        meths.push(generateEquals)
    }

    if (os.generatetoString) {
        meths.push(generateToString)
    }
    return meths
}

function generateEquals(
    classname: string, ps: Parameter[],) {
    const ls = ps.map(p => `o.${p.pi.name} == ${p.pi.name}`)
    ls.unshift(`o is ${classname}`)
    const s = between(ls, " && ")
    // new Parameter("o", "Object", false, false, false)


    return new Method({ name: "operator ==", returnType: "bool", code: new Code([`if (identical(this,o)) return true`, `\nreturn  ${s}`]) }
        , {
            namedParams: [], unnamedParams: [new Parameter({ name: "o", type: "Object" },)
            ]
        }, overrides)

    // const m = new Method("", "bool",, [], [], overrides)
    // return m
}

export { materialImport, keyParam, generateEquals, generateToString, generateBuildMethod, }