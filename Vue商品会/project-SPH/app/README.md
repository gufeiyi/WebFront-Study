# app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

笔记：
关于防抖和节流
共同点：都是想达到减少访问服务器次数的目的
不同点：
    防抖：用户操作完毕（最后一次），发一次请求
    节流：在规定时间发一次请求（定时）

浏览器的本地存储(浏览器关闭都有,最多5M)和会话存储(浏览器关闭没有)
本地存储 | 会话存储 存的是字符串

assets文件夹 ----  放置全部组件共用的静态资源

在css里面引图片
方式一'@/assets/home/icons.png'
方式二~@/assets/home/icons.png