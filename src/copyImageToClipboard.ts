const copyImageWithClipboard = async (url: string) => {
    const blob = await fetch(url).then((res) => res.blob())
    const clipboardItemImageBlob = new Blob([blob], {
        type: "image/png",
    })
    const clipboardItems = [
        new ClipboardItem({
            "image/png": clipboardItemImageBlob,
        }),
    ]
    navigator.clipboard.write(clipboardItems).then(
        () => {},
        () => {
            console.error("Unable to copy to clipboard.")
        }
    )
}

const copyImageWithSelection = async (url: string) => {
    const selection = window.getSelection()!
    if (selection.rangeCount > 0) {
        selection.removeAllRanges()
    }
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = url
    document.body.appendChild(img)
    img.onload = function () {
        const userSelect = document.body.style.userSelect
        document.body.style.userSelect = "auto"
        const range = document.createRange()
        range.selectNode(img)
        selection.addRange(range)
        document.execCommand("copy")
        selection.removeAllRanges()
        img.remove()
        document.body.style.userSelect = userSelect
    }
}

const copyImageToClipboard = async (url: string) => {
    try {
        if (window.ClipboardItem) {
            await copyImageWithClipboard(url)
            return true
        } else if (document.queryCommandEnabled("copy")) {
            copyImageWithSelection(url)
            return true
        } else {
            console.error("Unable to copy to clipboard.")
            return false
        }
    } catch (e) {
        console.error("Unable to copy to clipboard.")
        return false
    }
}

export default copyImageToClipboard
