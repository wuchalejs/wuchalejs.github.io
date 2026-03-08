// $$ node %f

import { resolve } from 'node:path'
import ts from 'typescript'

const dir = resolve(import.meta.dirname, '../../../wuchale/packages/wuchale')
const src = 'src'
const tsconfig = dir + '/tsconfig.json'

let compilerOptions: ts.CompilerOptions

function getCompilerOpts() {
    if (!compilerOptions) {
        compilerOptions = ts.parseJsonConfigFileContent(
            ts.readConfigFile(tsconfig, ts.sys.readFile).config,
            ts.sys,
            dir
        ).options
    }
    return compilerOptions
}

export type Opts = {
    nodeps?: boolean
    ignore?: string[]
}

function getSourceText(node: ts.Node): string {
    const sf = node.getSourceFile()
    let start = node.getFullStart()
    // Skip trailing content from the previous line (e.g. inline comments for the prior type)
    if (start > 0 && sf.text[start - 1] !== '\n') {
        const nl = sf.text.indexOf('\n', start)
        if (nl !== -1) start = nl + 1
    }
    return sf.text.slice(start, node.getEnd()).trim()
}

function isFromNodeModules(node: ts.Node): boolean {
    return node.getSourceFile().fileName.includes('node_modules')
}

function collectReferences(node: ts.Node, name: string, collected: Map<string, string>, visited: Set<string>, checker: ts.TypeChecker, opts: Opts) {
    if (ts.isTypeReferenceNode(node)) {
        const typeName = node.typeName.getText(node.getSourceFile())
        if (opts.ignore?.includes(typeName)) {
            return
        }
        if (!visited.has(typeName)) {
            visited.add(typeName)
            const symbol = checker.getSymbolAtLocation(node.typeName)
            if (symbol?.flags && symbol.flags & ts.SymbolFlags.TypeParameter) {
                return
            }
            const resolved = symbol && (symbol.flags & ts.SymbolFlags.Alias
                ? checker.getAliasedSymbol(symbol)
                : symbol)
            const decl = resolved?.getDeclarations()?.[0]
            if (decl && !isFromNodeModules(decl)) {
                // Recurse into this declaration's references first (depth-first)
                collectReferences(decl, name, collected, visited, checker, opts)
                if (typeName !== name) {
                    collected.set(typeName, getSourceText(decl))
                }
            }
        }
    }
    if (!opts.nodeps) {
        ts.forEachChild(node, child => collectReferences(child, name, collected, visited, checker, opts))
    }
}

export function getType(file: string, name: string, opts: Opts) {
    const resolvedPath = resolve(dir, src, file)
    const program = ts.createProgram([resolvedPath], getCompilerOpts())
    const source = program.getSourceFile(resolvedPath)
    if (!source) {
        throw new Error(`ShowType: Could not load source file "${file}"`)
    }
    const declaration = source.statements.find(
        (s): s is ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.EnumDeclaration =>
            (ts.isInterfaceDeclaration(s) || ts.isTypeAliasDeclaration(s) || ts.isEnumDeclaration(s))
            && s.name.text === name
    )
    if (!declaration) {
        throw new Error(`ShowType: Could not find type "${name}" in ${file}`)
    }
    const collected = new Map<string, string>()
    collectReferences(declaration, name, collected, new Set(), program.getTypeChecker(), opts)
    return [...collected.values(), getSourceText(declaration)]
        .join('\n\n')
        .replace(/^export /gm, '')
}
