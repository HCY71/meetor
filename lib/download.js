const downloadFile = (content, type, extension) => {
    const url = URL.createObjectURL(new Blob([content], { type }))
    const anchor = document.createElement('a')
    anchor.setAttribute('href', url)
    anchor.setAttribute('download', `meetor_group_time.${extension}`)
    document.body.appendChild(anchor)
    try {
        anchor.click()
    } finally {
        anchor.remove()
        // Let the browser begin the download before releasing the file URL.
        setTimeout(() => URL.revokeObjectURL(url), 0)
    }
}

export const downloadObjectAsJson = (data) => {
    downloadFile(JSON.stringify(data, null, 2), 'application/json;charset=utf-8', 'json')
}

export const downloadRowsAsCsv = (rows) => {
    const csv = rows.map(row => row.map(value => {
        let text = String(value ?? '')
        // Keep names and event titles from being interpreted as spreadsheet formulas.
        if (/^\s*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text
        return '"' + text.replaceAll('"', '""') + '"'
    }).join(',')).join('\r\n')
    // Excel needs the UTF-8 BOM to recognize Chinese text when opening a CSV.
    downloadFile('\uFEFF' + csv, 'text/csv;charset=utf-8', 'csv')
}

