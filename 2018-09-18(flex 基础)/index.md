## 一、兼容性
正如标题所示，`flex` 也是 CSS3 中的一员，正如大多数 CSS3 属性一样，`flex` 的兼容性算不上特别好（[详情请点击](https://caniuse.com/#search=flex)）。
比较有意思的是，`flex` 本身经历了好几次更迭才最终定稿。如果见到以下写法请不要觉得惊讶：

* `display:box/inline-box;`   2009年版本，仅 safari 支持；
* `display:flexbox/inline-flexbox;`  2011年版本，仅IE10支持；
* `display:flex/inline-flex;`  最新版本，主流浏览器大都支持，但 webkit 系列的需要添加 `-webkit-` 前缀。

注意 caniuse 网站上标注的 `flex` 是从 IE11 才开始部分支持，但其实我们可以通过上面的第二种写法让 IE10 也部分支持，鉴于 `flex` 的写法的特殊性，不建议自己手写各种版本，最好用 autoprefixer 之类的工具自动生成。


## 二、基本概念
* 通过设置 `display: flex/line-flex;`，我们即将目标元素设置成了 **Flex 容器（flex container）**，`flex` 与 `inline-flex` 的差别是，前者对外展示的效果更接近一个块级元素，而后者更接近于一个行内元素；

* flex 容器的子元素自动成为容器成员，称为 **Flex项目（flex item）**；
* Flex 容器内存在**主轴**和**交叉轴**两个概念，它们并不是实际存在的轴线，它只是标识了容器的方向，用于决定容器内成员的排列方式（容器内成员默认按主轴方向排列），主轴默认沿水平方向，交叉轴默认沿水平方向，它们都可以通过设置容器属性而改变方向；
* 主轴的开始位置（与边框的交叉点）叫做**main start**，结束位置叫做**main end**；交叉轴的开始位置叫做**cross start**，结束位置叫做**cross end**。
* 单个项目占据的主轴空间叫做**main size**，占据的交叉轴空间叫做**cross size**。

## 三、容器的属性
### （1）flex-direction

```
flex-direction: row | row-reverse | column | column-reverse;
```
flex-direction 决定了主轴的方向，进而决定了容器内成员的排列方向。各种取值与主轴方向对应关系如下：
* row: 主轴延水平方向向右
* row-reverse: 主轴延水平方向向左
* column: 主轴延垂直方向向下
* column-reverse: 主轴延垂直方向向上

<a href="./flex-direction.html">
    ![flex-direction](http://bgl.zbjimg.com/bgl%2Fbjclound%2Fflex-direction.png%2Forigine%2F7c3f86ac-eed7-4444-8464-20482d347d9c?imageMogr2/auto-orient/strip/quality/90)
</a>

### （2）flex-wrap
```
flex-wrap: nowrap | wrap | wrap-reverse;
```
类似于 css 中的 `white-space` 属性，用于决定容器一行元素溢出时的选择。
* nowrap: 不换行(默认)，通过压缩容器内成员的宽度/高度（改变前面的 `flex-wrap` 交叉轴为竖直方向，则可能压缩高度）实现，即使设置了成员的  `width/height` 属性也会被忽略，而设置了 `min/max-width/height` 的成员则不会；
* wrap: 正常换行，行与行之间，延交叉轴方向排列；
* wrap-reverse: 换行，但行与行之间，延交叉轴反方向排列。 

<a href="./flex-wrap.html">
    ![flex-wrap](http://bgl.zbjimg.com/bgl%2Fbjclound%2Fflex-wrap.png%2Forigine%2F9af22ac1-e420-4282-9d8b-b2c51e6b80ff?imageMogr2/auto-orient/strip/quality/90)
</a>
### （3）flex-flow
`flex-flow` 属性是 `flex-direction` 属性和 `flex-wrap` 属性的简写形式，默认值为row nowrap
### （4）justify-content
```
justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
```
`justify-content` 决定了容器内成员在主轴方向上的对齐方式。
* flex-start: 以主轴起点为起点对齐（默认左对齐）；
* flex-end: 以主轴终点为终点对齐（默认右对齐）；
* center:  以主轴居中对齐（水平/竖直居中，依 flex-direction 而定）；
* space-between: 以主轴两端对齐，项目之间的间隔都相等；
* space-around: 以主轴两端对齐，但跟 `space-between` 不同的是，它在两侧各有 1/2 的间距；
* space-evenly: 以主轴两端对齐，两侧各有 1 倍的间距（新增属性，兼容性不太好，[详见](https://caniuse.com/#search=space-evenly)）。
<a href="./justify-content.html">
    ![justify-content](http://bgl.zbjimg.com/bgl%2Fbjclound%2Fjustify-content.png%2Forigine%2F2dbeca01-4be6-4ae1-8c02-37d8e59b0a7c?imageMogr2/auto-orient/strip/quality/90)
</a>
### （5）align-items
```
align-items: flex-start | flex-end | center | baseline | stretch;
```
`align-items` 决定了容器内成员在交叉轴方向上的对齐方式。
* flex-start: 以交叉轴起点为起点对齐（默认顶部对齐）；
* flex-end: 以交叉轴终点为终点对齐（默认底部对齐）；
* center: 以交叉轴居中对齐（水平/竖直居中，依 flex-direction 而定）；
* baseline: 项目的第一行文字的基线对齐；
* stretch（默认值）: 如果项目未设置宽度/高度或设为auto，将占满整个容器的宽度/高度（默认拉伸高度，具体视 `flex-direction` 取值而定）。
<a href="./align-items.html">
    ![align-items](http://bgl.zbjimg.com/bgl%2Fbjclound%2Falign-items.png%2Forigine%2Fac81650f-2288-489a-b008-d1cc3e2ec4be?imageMogr2/auto-orient/strip/quality/90)
</a>


### （6）align-content
```
align-content: flex-start | flex-end | center | space-between | space-around | stretch;
```
`align-content` 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用，也就是说，只有在容器内成员在一行内放不下，产生换行的时候（`flex-wrap` 不能为 `nowrap`）决定行与行之间的排列方式。
* flex-start: 与交叉轴的起点对齐；
* flex-end: 与交叉轴的终点对齐；
* center: 与交叉轴的中点对齐；
* space-between: 与交叉轴两端对齐，轴线之间的间隔平均分布；
* space-around: 与交叉轴两端对齐，但两端各有 1/2 间距；
* space-evenly: 与交叉轴两端对齐，但两端各有 1 倍间距（兼容性不太好）；
* stretch（默认值）: 轴线占满整个交叉轴。

<a href="./align-content.html">
    ![align-content](http://bgl.zbjimg.com/bgl%2Fbjclound%2Falign-content.png%2Forigine%2Ffce2ba50-ec08-4e20-991d-32a8205f6fe4?imageMogr2/auto-orient/strip/quality/90)
</a>

## 四、成员的属性
### （1）order
```
order: <integer>;
```
`order` 属性定义成员在主轴上的排列顺序，它将忽略普通的文档流，数值越小的成员，排列越靠前，默认为 0。
<a href="./order.html">
    ![order](http://bgl.zbjimg.com/bgl%2Fbjclound%2Forder.png%2Forigine%2Fb3fe60cb-6dfb-4def-87d9-e36d66df59c7?imageMogr2/auto-orient/strip/quality/90)
</a>

### （2）flex-grow
```
flex-grow: <number>;
```
`flex-grow` 属性定义当成员不能占满主轴时，容器内空白位置在成员间的划分方式，它将会使得成员延主轴被拉伸，默认为 0。它的数值不代表具体的大小，而是代表了所占比例。如三个成员 `order` 分别为 1、2、1，那么第一、第三个成员将各被拉伸容器空白位置 1/4 的大小，而第二个成员则会被拉伸容器空白位置 1/2 的大小。当成员能够占满主轴时，`flex-grow` 属性无效。
<a href="./flex-grow.html">
    ![flex-grow](http://bgl.zbjimg.com/bgl%2Fbjclound%2Fflex-grow.png%2Forigine%2F5b50fa73-c0b2-439b-97d2-20c51bfc5375?imageMogr2/auto-orient/strip/quality/90)
</a>

### （3）flex-shrink
```
flex-shrink: <number>;
```
与 `flex-grow` 恰好相反的是， `flex-shrink` 属性定义当成员占满主轴并且溢出时（`flex-wrap` 必须为 `nowrap`），它将会使得成员延主轴方向被压缩，默认为 1。与 `flex-grow` 一样，它的值不代表具体大小，而是代表压缩比例。
<a href="./flex-grow.html">
    ![flex-shrink](http://bgl.zbjimg.com/bgl%2Fbjclound%2Fflex-shrink.png%2Forigine%2Fa20f962c-755f-4a17-ae04-50db6cddfcf6?imageMogr2/auto-orient/strip/quality/90)
</a>

### （4）flex-basis
flex-basis: <length> | auto;
`flex-basis` 属性定义了在分配多余空间之前，项目占据的主轴空间，`auto` 为元素原本应该占据的大小。
### （5）flex
```
flex: flex-grow flex-shrink flex-basis | auto | initial | none;
```
可以认为是 `flex-grow`、`flex-shrink`、 `flex-basis` 的合成属性，也可以取值：
* auto: 即 1 1 auto;
* initial: 即 0 1 auto；
* none: 即 0 0 auto。
### （6）align-self
```
align-self: auto | flex-start | flex-end | center | baseline | stretch | space-evenly;
```
`align-self` 顾名思义，就是决定自身沿交叉轴方向的排列方式，它可以用来覆盖容器上设置的 `align-items` 效果。可选择的属性、效果都与 `align-items` 类似，但它多了一个 `auto` 属性（默认），相当于继承父元素的 `align-items` 属性。
<a href="./align-self.html">
    ![flex-self](http://bgl.zbjimg.com/bgl%2Fbjclound%2Fflex-self.png%2Forigine%2F750b46bc-2f78-4e74-97fe-bcec4951fd68?imageMogr2/auto-orient/strip/quality/90)
</a>


--------
本文较多地参考了 [阮一峰的博客](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)，向大佬致敬！