 一直都或多或少听说过 source-map，但却从未仔细学习过其具体内容。
谨以此篇文章，鞭策自己，砥砺前行。
------

## 一、why source map ?
随着前端的不断发展，前端技术栈中，JavaScript 所占比重越来越大，与之对应的在网络中传递的 JS 文件也随之变得越来越大，尤其是单页 web 应用（SPA）中打包出来的 JS 文件，往往更是会达到以 M 为单位的大小。为了提高用户体验，加快网络请求速度，作为开发者，我们不得不针对这一问题进行优化，常见的方式有 Gzip 压缩、合理利用缓存、Tree-shaking、文件（请求）合并、代码压缩等方式。其中，文件压缩、文件合并等操作则会导致线上代码与我们开发的代码呈现出一定的差异性，此外，文件/语言的编译（如 Less -> 
 CSS, TypeScript -> JavaScript）也会导致类似的结果，使得我们线上代码的难于维护和调试，于是 source map 便应运而生了。

## 二、source map 的适用场景
* 代码压缩（compress/uglify 等）
* 多文件合并（用于减少 http 请求数）
* 语言预处理、编译等（es6、jsx 编译成 es5 版本，TypeScript 编译成 JavaScript 等）
* ......
理论上来说，开发版本的代码跟线上运行的代码不完全一致的时候，都可以使用 source map 技术，当然，前提是有相应的工具支持，或者你自己开发一个。

## 三、source map 的实际效果
首先，source map 功能需要浏览器的支持，较新的 firefox/chrome 的现代浏览器大都自动开启了 source map 功能，比如在 chrome 中，点击勾选上 Settings 里的 Enable JavaScript source maps 选项即可，较新版本的 chrome 是默认开启的。

![step-1](https://upload-images.jianshu.io/upload_images/2064445-eb463b73e7b202bd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![step-2](https://upload-images.jianshu.io/upload_images/2064445-1bfad700a48afbaf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后，对于如下的一小段 js 源代码（请智能忽略掉一些细节）：
```
(function () {
    var data = 1;
    function foo() {
        var data = 2;
        console.log(data);
        console.log(2 + foo2(data));
        return data + data;
    }
    function foo2(data) {
        return data + 2;
    }
    console.log(data);
    console.log(foo());
})()
```
总的来说，功能上还是比较简单的，但当它被 uglify 压缩之后，大致会变成如下的样子：
```
console.log(1),console.log((console.log(2),console.log(6),4));
```
你还能看出它的原本的样子和作用么？
就算使用了类似 chrome 中的 pretty print 之类的工具，也大致只能变成下面的样子：
![pretty print 版本](https://upload-images.jianshu.io/upload_images/2064445-a8bbe69b5326ce9f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
跟源代码仍旧相去甚远。<br>
而当我们打开 source map 处理之后的文件（一般存放在同目录下，chrome 中在其文件名后面添加了一个 [sm]，应该是 source map  的缩写）:
![source map 版本](https://upload-images.jianshu.io/upload_images/2064445-646056f4a32bab90.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
在这个虚拟出来的文件上，你可以正常地进行断点调试等任何工作，相比于压缩后的代码，这跟源文件基本无异的代码无疑方便很多。

四、怎么使用 source map ？
代码层面，要做的其实很少，只需要在编译之后的代码的最后，加上一行
```
//@ sourceMappingURL=/path/to/file.js.map
```
就可以了，但实际上，通常情况下，连这一步都是由编译打包工具完成的，常见的 gulp、webpack 等工具，里面都有支持 source map 的插件、中间件等。以 gulp 为例，我们就可以在其配置文件 gulpfile.js 中，增加 [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) 插件相关配置，配合 [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)，我们可以轻松实现代码的压缩、以及 source map 支持。