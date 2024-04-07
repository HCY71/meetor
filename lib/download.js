export const downloadObjectAsJson = (data) => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data))
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", 'meetor_group_time' + ".json")
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
}

