const m: any = {
    s: 'String',
    i: 'int',
    b: 'bool',
    d: 'double',
    dy: 'dynamic',
    ls: 'List<dynamic>'
}

export function dartTypeOf(params: string) {
    return (m[params] ? m[params] : params) as string
}