// Tiny Schema Walker Shared By Every Content Section. Schema Leaves Are Type
// Tokens: "string", "string[]", A "?" Suffix Marks The Field Optional (Absent
// Or Empty), And A Token Like "a|b" Only Accepts One Of The Listed Values. An
// Array Schema Like [shape] Validates Every Item Against That Shape. Unknown
// Fields Throw So Typos Get Caught At Build Time Instead Of Rendering
// Silently Wrong.
export const validate = (value, schema, path) => {
    if (typeof schema === "string") {
        validateToken(value, schema, path)
        return
    }
    if (Array.isArray(schema)) {
        if (!Array.isArray(value)) {
            throw new Error(`Content error at ${path}: expected an array`)
        }
        value.forEach((item, index) => validate(item, schema[ 0 ], `${path}[${index}]`))
        return
    }
    if (typeof value !== "object" || value === null) {
        throw new Error(`Content error at ${path}: expected an object`)
    }
    Object.entries(schema).forEach(([ key, fieldSchema ]) =>
        validate(value[ key ], fieldSchema, `${path}.${key}`)
    )
    Object.keys(value).forEach((key) => {
        if (!(key in schema)) {
            throw new Error(`Content error at ${path}.${key}: unknown field, fix the typo or add it to schema.js`)
        }
    })
}

const validateToken = (value, token, path) => {
    const isOptional = token.endsWith("?")
    const baseToken = isOptional ? token.slice(0, -1) : token

    if (isOptional && (value === undefined || value === null || value === "")) return

    if (baseToken === "string[]") {
        const isStringArray = Array.isArray(value) && value.every((item) => typeof item === "string")
        if (!isStringArray) {
            throw new Error(`Content error at ${path}: expected an array of strings`)
        }
        return
    }
    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`Content error at ${path}: expected a non-empty string`)
    }
    if (baseToken.includes("|") && !baseToken.split("|").includes(value)) {
        throw new Error(`Content error at ${path}: expected one of "${baseToken}", got "${value}"`)
    }
}
