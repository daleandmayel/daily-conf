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

![pretty print 版本](https://upload-images.jianshu.io/upload_images/2064445-d1b84d3b773f49a6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

跟源代码仍旧相去甚远。<br>
而当我们打开 source map 处理之后的文件（一般存放在同目录下，chrome 中在其文件名后面添加了一个 [sm]，应该是 source map  的缩写）:

![source map 版本](https://upload-images.jianshu.io/upload_images/2064445-6a0b72018af953ab.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在这个虚拟出来的文件上，你可以正常地进行断点调试等任何工作，相比于压缩后的代码，这跟源文件基本无异的代码无疑方便很多。

## 四、怎么使用 source map ？
代码层面，要做的其实很少，只需要在编译之后的代码的最后，加上一行
```
//@ sourceMappingURL=/path/to/file.js.map
```
就可以了，但实际上，通常情况下，连这一步都是由编译打包工具完成的，常见的 gulp、webpack 等工具，里面都有支持 source map 的插件、中间件等。以 gulp 为例，我们就可以在其配置文件 gulpfile.js 中，增加 [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) 插件相关配置，配合 [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)，我们可以轻松实现代码的压缩、以及 source map 支持。具体配置可以参考：[点击这里](https://github.com/daleandmayel/daily-conf/blob/master/2018-09-28/source-map/gulpfile.js)，具体效果参考：[点击这里](https://daleandmayel.github.io/daily-conf/2018-09-28/source-map/demo/index.html)。需要特别注意的一点是，[gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) 需要一定的 [插件支持](https://github.com/gulp-sourcemaps/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support)。

## 五、source map 具体原理
source map，source 指源头、来源，而 map 意为映射、投影，其命名方式就已经基本说明了其具体原理——通过某种方式，将压缩、编译处理过的线上文件映射成文源文件。
![source map](https://upload-images.jianshu.io/upload_images/2064445-3a2fab9c38e7914b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
而 source map 主要分两个步骤：
1. 在生成线上文件的同时，生成一个映射规则；
2. 根据映射规则，将线上文件映射成源文件。
第一步一般由开发者通过自己的某些工具（如 gulp/webpack）等生成一个 .map 文件：
```
{
    // source map的版本，目前为 3
    "version": 3,
    // 处理前的文件名数组（可能由多个文件进行合并）
    "sources": ["index.js"],
    // (可选)处理前的所有变量名和属性名
    "names": ["console", "log", "data"],
    // VLQ 编码的文件内容位置映射规则
    "mappings": "AAWIA,QAAQC,IAVG,GAWXD,QAAQC,KARJD,QAAQC,IADG,GAEXD,QAAQC,IAAI,GACLC",
    // 处理后的文件名
    "file": "index.js",
    // (可选)所有源文件的内容
    "sourcesContent": ["(function () {\n    var data = 1;\n    function foo() {\n        var data = 2;\n        console.log(data);\n        console.log(2 + foo2(data));\n        return data + data;\n    }\n    function foo2(data) {\n        return data + 2;\n    }\n    console.log(data);\n    console.log(foo());\n})()"]
}
```
不难看出，这其实就是一个 json 格式的文本文件。在线上文件的末尾添加上
```
//@ sourceMappingURL=/path/to/file.js.map
```
就指明了线上的这个文件，可以通过  `/path/to/file.js.map` 进行 source map 处理。
<br>
第二步，解析映射规则，并将线上文件通过它映射成源文件，这个操作一般由支持 source map 的浏览器来完成。<br>
整个映射规则中，最重要的就是 `mappings` 属性。它是一个比较长的字符串，总的分为三层：
* 第一层是**行对应**，以分号（;）分隔，分号间的内容对应一行线上代码。例如我们上面的例子里，没有分号（可以认为是省略了末尾的分号），则是因为线上代码被压缩成了一行。
* 第二层是**位置对应**，以逗号（,）分隔，逗号间的内容对应该行线上代码的某个位置。
* 第三层是**位置映射**，以[VLQ编码](http://en.wikipedia.org/wiki/Variable-length_quantity)表示，代表该位置对应的源代码位置。

此外，每个位置使用五个字符，分别表示五个字段：
* 第一位，表示这个位置在线上代码中位于第几列。
* 第二位，表示这个位置属于sources属性中的哪一个源文件。
* 第三位，表示这个位置属于源代码的第几行。
* 第四位，表示这个位置属于源代码的第几列。
* 第五位，（可选）表示这个位置属于names属性中的哪一个变量。

上面的每一位，同时都使用的 VLQ 编码，它使用的是与 base64 相同的码表。
![base64 VLQ](https://upload-images.jianshu.io/upload_images/2064445-b98fc4363708618c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
它以 [A-Z]、[a-z]、[0-9] 以及 “+”、“/”来表示一个 64 进制数。

例如上面的“AAWIA”，如果以 10 进制数则可以表示成 “0, 0, 22, 8, 0”(逗号只是为了方便查看添加的，实际上不存在)。但事实上，我们知道，数据在计算机中，都是以二进制数存储和计算的，而一位 64 进制数，可以表示为 6 位 2 进制数，所以这里又可以按二级制数表示成“000000, 000000, 010110, 001000, 000000”。事实上，VLQ 也是按照二进制生效的。这 6 位 2 进制数中，
```
　　Continuation
　　|　　　　　Sign
　　|　　　　　|
　　V　　　　　V
　　１０１０１ １
```
* 首位代表是否连续，如果是 1，代表这６个位后面的6个位也属于同一个数；如果是0，表示该数值到这6个位结束；
* 末位为符号位，如果是 0，代表该数值是一个整数；如果是 1 代表该数值是一个负数；
* 中间 4 位才是真正的数值位。
首位的存在，意味着 VLQ 可以采用多个连续的编码来代表一个很大的数字，而末尾符号位的存在，意味着 VLQ 可以同时表示正数和负数。4 位 2 进制数，可以表示 10 进制的 [0-15]，再算上符号位，实际上，每个编码实际上能表示 -15 到 15 共 31 位数（+0，-0 如果算作同一个）。而之前提到的“AAWIA”，真正代表的其实是“0, 0, 11, 4, 0”，对应的即：
* 线上代码中的第 1 列。
* 源文件是 .map 文件中 sources 文件中的第 1 个，即 index.js。
* 源代码的第 12 行。
* 源代码的第 5 列。
* . map 文件中 names 属性中的第 1 个变量，即 console。
综上，也就是下面图中红色框标注的位置：

![demo](https://upload-images.jianshu.io/upload_images/2064445-60986f4f2e146b8e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

更多关于VLQ 编码的内容，请参考 [wiki](http://en.wikipedia.org/wiki/Variable-length_quantity)。
