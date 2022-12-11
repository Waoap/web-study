/**
 * *轮播图
 * ![line:1...line:113]
 */
const IMAGES_BOX = document.getElementById('images_box')
const IMAGES_SIZE = IMAGES_BOX.childElementCount
const IMAGE_WIDTH = 1366
const MIN_INDEX = 0
const MAX_INDEX = IMAGES_SIZE - 1
let index = MIN_INDEX

/**
 * *在移动之前，预先图片
 * @param {图片移动方向} orientation
 */
function prepareImages(orientation = 'r2l') {
    switch (orientation) {
        case 'r2l':
            // 到达最后一个图片时
            if (index === MAX_INDEX) {
                IMAGES_BOX.append(IMAGES_BOX.children[0])
                index--
                IMAGES_BOX.style.left = -index * IMAGE_WIDTH + 'px'
            }
            break
        case 'l2r':
            // 到达第一个图片时
            if (index === MIN_INDEX) {
                IMAGES_BOX.prepend(
                    IMAGES_BOX.children[IMAGES_BOX.childElementCount - 1]
                )
                index++
                IMAGES_BOX.style.left = -index * IMAGE_WIDTH + 'px'
            }
    }
}

/**
 * *移动图片
 * @param {图片移动方向} orientation
 */
function move(orientation = 'r2l') {
    switch (orientation) {
        // 图片从右向左移
        case 'r2l':
            if (IMAGES_BOX.onMoving === undefined) {
                // 准备图片
                prepareImages(orientation)

                // 开始移动
                IMAGES_BOX.onMoving = window.setInterval(function () {
                    // 已经到达指定位置
                    if (IMAGES_BOX.offsetLeft <= -(index + 1) * IMAGE_WIDTH) {
                        window.clearInterval(IMAGES_BOX.onMoving)
                        index++
                        IMAGES_BOX.onMoving = undefined
                    }

                    // 还未到达指定位置
                    else {
                        IMAGES_BOX.style.left = IMAGES_BOX.offsetLeft - 5 + 'px'
                    }
                }, 1)
            }
            break

        // 图片从左向右移
        case 'l2r':
            if (IMAGES_BOX.onMoving === undefined) {
                // 准备图片
                prepareImages(orientation)

                //开始移动
                IMAGES_BOX.onMoving = window.setInterval(function () {
                    // 已经到达指定位置
                    if (IMAGES_BOX.offsetLeft >= -(index - 1) * IMAGE_WIDTH) {
                        window.clearInterval(IMAGES_BOX.onMoving)
                        index--
                        IMAGES_BOX.onMoving = undefined
                    }

                    // 还未到达指定位置
                    else {
                        IMAGES_BOX.style.left = IMAGES_BOX.offsetLeft + 5 + 'px'
                    }
                }, 1)
            }
    }
}

/**
 * *上一张图片按键
 */
document.getElementById('previous').addEventListener('click', function () {
    move('l2r')
})

/**
 * *下一张图片按键
 */
document.getElementById('next').addEventListener('click', function () {
    move('r2l')
})

/**
 * *播放轮播图
 */
const play = function () {
    if (IMAGES_BOX.onPlaying === undefined) {
        IMAGES_BOX.onPlaying = window.setInterval(move, 4000)
    }
}
play()
