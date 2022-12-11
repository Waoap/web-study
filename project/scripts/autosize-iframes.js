/**
 * *iframe 自适应高度
 */
function changeFrameHeight(iframe) {
    if (iframe == undefined) return
    iframe.height = iframe.contentDocument.body.scrollHeight + 1
}
let iframes = document.getElementsByClassName('container')
for (const iframe of iframes) {
    iframe.onload = function () {
        changeFrameHeight(this)
    }
}
window.onresize = function () {
    changeFrameHeight()
}
