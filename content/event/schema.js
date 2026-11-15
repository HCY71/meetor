const eventSchema = {
    hello: "string",
    createdAt: "string",
    ago: "string",
    go: "string",
    yourName: "string",
    input: {
        name: "string",
        checkTime: "string",
        placeholder: "string",
    },
    export: "string",
    exportOptions: {
        csv: "string",
        csvDescription: "string",
        json: "string",
        jsonDescription: "string",
        csvHeaders: "string[]",
    },
}

export default eventSchema
