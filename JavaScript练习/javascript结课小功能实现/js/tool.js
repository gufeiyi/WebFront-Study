// 一个简单执行动画的函数

/* 参数：
    obj：移动的对象
    attr：要执行动画的样式，比如：left，top，width，height
    target:目标位置
    speed： 移动速度(正值就可以)
    callback：回调函数，函数在动画执行完毕之后执行 */
function move(obj , attr , target , speed , callback) {
    // 关闭定时器，防止一直点开启好多个定时器加速
    // 给每个对象绑定一个定时器，这样子停止定时器的时候，只会停止自己元素，不会对别的元素造成影响
    clearInterval(obj.timer);

    // 元素当前的位置
    var current = parseInt(getStyle(obj, attr));

    // 判断speed值正负
    // 右移 speed+
    //      不用管，直接用用户传进来的speed
    // 左移 speed-
    //      判断一下是否是左移（target <-  current）
    //      也就是target < current  这时候让速度取反
    if (target < current) {
        speed = -speed;
    }

    // 开启定时器，执行动画效果
    obj.timer = setInterval(function () {
        var oldValue = parseInt(getStyle(obj, attr));
        // speed会根据current和target的大小，自动改变正负
        var newValue = oldValue + speed;

        // 确保最后一定到终点线，而不是越线一段距离
        // 分两种情况：
        // 1、小方块左移（speed<0），移动的距离超了终点(newValue <target)，让小方块最后的终点 = 设置终点
        // 2、右移刚好相反

        if (speed < 0 && newValue < target || speed > 0 && newValue > target) {
            newValue = target;
        }
        // 将新值设置给box1
        obj.style[attr]= newValue + 'px';

        // 等到了终点，关闭定时器，让小方块停下来
        if (newValue == target) {
            clearInterval(obj.timer);
            // 动画执行完毕，调用回调函数
            // 注意兼容性的问题
            callback && callback();
        }
    }, 30);
}

// 获取元素当前样式的函数
/* 
    参数：
        obj： 元素
        name： 要获取的样式名 */
function getStyle(obj, name) {
    // 正常浏览器获得样式的方法
    if (window.getComputedStyle) {
        return getComputedStyle(obj, null)[name];
    } else {
        // IE8的方式
        return obj.currentStyle[name];
    }
}

// 定义一个函数，用来向一个元素中添加一个指定的class属性值

/* 
    参数：
    obj： 要添加class属性的元素
    cn： 要添加的class的值
*/

function addClass(obj , cn){
    // 检查obj中是否含有cn
    // 没有属性的时候再加，有就不加了
    if(!hasClass(obj,cn)){
        obj.className += "" + cn;
    }
}

/*  
    判断一个元素中是否含有指定的class属性值
    如果有返回true，没有，返回false

    参数：
        obj：要添加class的元素
        cn：属性名

*/
function hasClass(obj, cn){

    // 用正则表达式去判断
    // var reg = / \bb2\b/
    var reg = new RegExp("\\b" + cn + "\\b");

    return reg.test(obj.className);
}

/* 
    删除一个元素中的指定class属性
*/
function removeClass(obj , cn) {
    var reg = new RegExp('\\b' + cn + '\\b');
    // 删除一个class属性就是把class属性的值用空串替换
    obj.className = obj.className.replace(reg,"");
}

/* 
    切换一个类
        元素中有这个类，删除
        元素中没有这个类，添加
*/

function toggleClass(obj,cn){

    if(hasClass(obj,cn)){
        removeClass(obj,cn);
    }else {
        addClass(obj,cn);
    }
}