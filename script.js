/**
 * script.js
 * 
 * 该脚本用于控制一个二进制进度条的显示和更新。进度条由8个点（dots）和8个方块（squares）组成，
 * 分别表示一个8位二进制数的每一位。用户可以通过滑动条（slider）手动调整进度条的值，或者通过
 * 开关（switch）启动自动更新模式，使进度条自动从0递增到255并循环。
 * 
 * 主要功能：
 * 1. 根据滑动条的值更新二进制进度条的显示。
 * 2. 在自动更新模式下，进度条的值会每隔500毫秒自动递增，并在达到255后重置为0。
 * 3. 用户可以通过开关切换手动和自动更新模式。
 * 
 * 依赖：
 * - HTML 文件中需要包含 id 为 'slider' 的滑动条、id 为 'switch' 的开关、
 *   以及 id 为 'bit0' 到 'bit7' 的点和方块元素。
 * 
 * 函数说明：
 * - updateProgressBar_8bit(newValue, ele): 根据给定的值更新进度条显示状态，传入的ele是进度条的元素实例（当前是dots或squares）。
 * 
 * - handleSliderInput(): 处理滑动条输入事件，更新进度条和当前值显示。
 * - startProgress(): 根据开关状态启动或停止自动更新模式。
 * 
 * 注意事项：
 * - 当前两个进度条都是8bit（8位二进制数），每个点和方块代表一个二进制位。当值为0时，所有点和方块都是非激活状态；当值为255时，所有点和方块都是激活状态。
 * - 该脚本还支持通过鼠标滚轮手动调整滑动条的值，但可以通过调用 toggleWheelEvent 函数来启用或禁用这一功能。
 * 
 * 编辑时间: 2025年1月22日04点03分
 * 作者: deepseek V3 chat, qwen2.5-coder
 */


/** 核心代码：开始 */

/* 全局状态变量 */

let currentValue = 10; // 初始值为10，进度条的值需要靠他来同步被设置
let intervalId; // 用于存储定时器ID，以便在需要时清除定时器
let isWheelEventEnabled = true; // 标志变量，控制滚轮事件是否启用

/* 视觉效果静态变量获取 */

// 句柄：点状二进制进度条
const dots = [
    document.getElementById('bit0'),
    document.getElementById('bit1'),
    document.getElementById('bit2'),
    document.getElementById('bit3'),
    document.getElementById('bit4'),
    document.getElementById('bit5'),
    document.getElementById('bit6'),
    document.getElementById('bit7')
];

// 句柄：分型方块二进制进度条
const squares = [
    document.getElementById('bit0-square'),
    document.getElementById('bit1-square'),
    document.getElementById('bit2-square'),
    document.getElementById('bit3-square'),
    document.getElementById('bit4-square'),
    document.getElementById('bit5-square'),
    document.getElementById('bit6-square'),
    document.getElementById('bit7-square')
];

/** 核心函数和事件处理程序 */

// 函数：二进制进度条更新
function updateProgressBar_8bit(newValue, ele) {
    if (newValue < 0 || newValue > 255) {
        console.error("Invalid value. Please provide a number between 0 and 255.");
        return;
    }

    // 原理：通过位运算符 & 和 1 << i 来判断第i位是否为1，如果是，则将点状二进制进度条的第i位设置为激活状态；否则，将其设置为非激活状态。
    for (let i = 0; i < 8; i++) {
        if (newValue & (1 << i)) {
            ele[i].classList.add('active');
        } else {
            ele[i].classList.remove('active');
        }
    }
}

/** 好了，核心部分结束了，下面都是 dirty code 了...  */


// 滚轮事件处理：当用户滚动鼠标滚轮时，根据滚轮方向调整滑动条的值。
document.getElementById('slider').addEventListener('wheel', (event) => {
    if (!isWheelEventEnabled) return; // 如果事件被关闭，直接返回

    event.preventDefault(); // 阻止默认的滚动行为

    const delta = Math.sign(event.deltaY); // 获取滚轮方向
    let value = parseInt(slider.value, 10);

    // 根据滚轮方向调整值
    if (delta > 0) {
        value = Math.min(value + 1, 255); // 向下滚动，增加值
    } else {
        value = Math.max(value - 1, 0); // 向上滚动，减少值
    }

    slider.value = value;

    updateProgressBar_8bit(parseInt(value), dots);
    updateProgressBar_8bit(parseInt(value), squares);

    document.getElementById('current-value').textContent = parseInt(value);
    currentValue = parseInt(value); // 更新当前值的变量
});

// 提供一个方法来切换滚轮事件的启用状态
function toggleWheelEvent(enabled) {
    isWheelEventEnabled = enabled;
}


// 将 handleSliderInput 定义在外部，确保每次调用时使用同一个函数引用
// 函数功能：处理滑动条输入事件，更新进度条和当前值显示。
function handleSliderInput() {
    const sliderElement = document.getElementById('slider'); // 获取滑动条元素的引用

    // 更新点状和方块二进制进度条的显示状态，根据滑动条的值进行更新。
    updateProgressBar_8bit(parseInt(sliderElement.value), dots);
    updateProgressBar_8bit(parseInt(sliderElement.value), squares);

    document.getElementById('current-value').textContent = parseInt(sliderElement.value); // 更新当前值的显示
    currentValue = parseInt(sliderElement.value); // 更新当前值的变量
}

// 函数功能：根据开关状态启动或停止自动更新模式。
// 如果开关关闭，则启动自动更新模式；如果开关开启，则停止自动更新模式，转而替代为人工滑动条指定值的控制。
function startProgress() {
    const switchElement = document.getElementById('switch'); // 获取开关元素的引用
    const sliderElement = document.getElementById('slider'); // 获取滑动条元素的引用

    // 根据当前开关状态决定是否启动自动更新模式。
    if (!switchElement.checked) {
        // 如果开关关闭，启动自动更新

        toggleWheelEvent(false); // 禁用滚轮事件，防止与自动更新冲突

        // 移除滑动条的监听器
        sliderElement.removeEventListener('input', handleSliderInput);

        intervalId = setInterval(() => {
            updateProgressBar_8bit(parseInt(currentValue), dots);
            updateProgressBar_8bit(parseInt(currentValue), squares);

            if (currentValue < 255) {
                currentValue++;
            } else {
                currentValue = 0; // 当达到255时，重置为0并继续循环。
            }
            document.getElementById('current-value').textContent = currentValue;
            sliderElement.value = currentValue; // 将当前的currentValue设置为滑动条的位置
        }, 500);
    } else {
        // 如果开关开启，停止自动更新
        clearInterval(intervalId);
        toggleWheelEvent(true); // 启用滚轮事件

        sliderElement.value = currentValue; // 将当前的currentValue设置为滑动条的位置

        // 将滑动条的值更新到二进制进度条上
        updateProgressBar_8bit(parseInt(sliderElement.value), dots)
        updateProgressBar_8bit(parseInt(sliderElement.value), squares)
        document.getElementById('current-value').textContent = parseInt(sliderElement.value);

        // 监听滑动条的变化，实时更新二进制进度条
        sliderElement.addEventListener('input', handleSliderInput);
    }
}

// 监听开关的状态变化
document.getElementById('switch').addEventListener('change', startProgress);

// 启动进度条更新
startProgress();
