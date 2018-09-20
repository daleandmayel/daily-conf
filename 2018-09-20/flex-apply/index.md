# CSS —— flex 的应用场景
## 一、宽/高自适应
### （1）左（右）侧固定宽度，剩余内容自适应
这里主要利用 `flex` 本身提供的 `flex-grow/flex-shrink/flex-basis` 属性，通过设置 
 `flex: 0 0 <width>` 来使得部分元素宽度固定，而另一部分元素通过设置 `flex: <integer> <integer> <width>` 来使得它在容器大小变化的时候，被拉伸或者压缩。

![水平自适应](https://upload-images.jianshu.io/upload_images/2064445-885889cffb1a6711.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
例如你需要制作一个输入框，左侧需要一个固定宽度的图标，右侧需要一个固定宽度的搜索按钮，中间需要一个宽度自适应固定的输入框，`flex` 就能助你轻松完成。

### （2）上（下）固定高度，剩余内容自适应
这里主要利用 `flex-direction` 属性，将主轴改为沿竖直方向，容器内成员都将跟随主轴方向而沿着竖直方向排列，再结合上面的方式，使得成员达到部分成员高度固定，另一部分高度自适应。
![竖直自适应](https://upload-images.jianshu.io/upload_images/2064445-234a2f96dbe02d39.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### （3）圣杯布局
上面我们其实已经看到了“双飞翼”在内的几种经典布局，如果再结合前面两类布局方式，也可以构建出非常典型的“圣杯布局”。
![圣杯布局](https://upload-images.jianshu.io/upload_images/2064445-0b0f4ec3439fdb3a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
粗看上去有点复杂，但实际上，非常简单。因为其实它只是上面的 “上下固定高度、中间自适应” + “左右固定宽度，中间自适应的”的组合方式。这里需要注意的一点是，作为 `flex` 容器内成员的 `DOM` 元素，仍旧可以通过设置 `display: flex;` 而变成 `flex` 容器，这是一个异常强大的模式，利用好这点，能完成很多复杂的布局方式。

## 二、水平垂直居中
居中是前端布局中的一个常见问题，也是面试过程中的一个经常被提及的问题，常见的 `text-align: center;`、`vertical-align: center`、`line-height: xxxx`、`margin: xx auto`、负 `margin`、负 `translate`、`display: table-cell;` 等，各种方案各有利弊，一个熟练的前端，会根据其实际情况去确定具体的居中方案，但具体用法不是我们这里关注的点，此处不再赘述。`flex` 为我们提供了一种新的解决办法：
```
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
```
看上去是不是很简单粗暴？
![水平垂直居中](https://upload-images.jianshu.io/upload_images/2064445-5bea2109e7184fc4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 三、流式布局
在商品列表页之类的页面，以瀑布流为代表的流式布局被得到了广泛应用。一般而言，使用较多的是 `display: inline-block;` 和 `float: left;` 两种方案。但不管是哪种方案，都有一定的瑕疵。
###（1）display: inline-block 与 float: left;
利用这种方式，

```
<style>
.inline-block li {
    display: inline-block;
}

.left {
    overflow: hidden;
}
.left li {
    float: left;
}
</style>
......
<div class="container">
    <h1>display: inline-block</h1>
    <ul class="inline-block">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
</div>
<div class="container">
    <h1>float: left;</h1>
    <ul class="left">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
</div>
```
不难发现，使用 `display: inline-block` 方式生成的流式布局，元素之间形成了一小块白色空隙，这是由于我们的  `li` 标签之间的空格、换行之类的空白符，在 `li` 被设置成块级行内元素的时候，以一个空格的形式展示到了页面上，略微尝试一下，你甚至可以选中、复制它。尽管你可以在父级元素上设置 `font-size: 0;` 清除掉它，但内部元素又会受到影响，你又不得不在内层元素上，将 `font-size` 属性给重置回去，这显然不是我们乐意见到的。<br>
相比而言，`float: left;` 方案就没有上述问题，而且你还可以通过诸如 `overflow: hidden;` 以形成 `bfc` 之类的方式，消除浮动对于正常文档流带来的影响。看起来一切都很美好，但当你尝试为浮动元素之间添加一点间距的时候，你就会发现，问题来了。<br>
首先是繁琐的计算，为了得到合适的宽度，你需要仔细计算元素的宽度以及元素之间的间距，切记不要太过相信设计师给你的设计稿，人艰不拆。。。其次是当你计算好合适的尺寸之后，信心满满地将 `CSS` 写上去的时候，你可能面对两种情况（假设这里的间距是使用的 margin-right 添加上去的）：
#### a. 理应出现在每行最后的一个元素，换到下一行去了。
出现这种情况意味着你在计算容器宽度的时候，可能忘记了考虑每行最后一个元素的右侧边距，结果导致一行元素需要需要占据的宽度的总和，超过了容器的宽度，最后一个元素就自然被“挤”到下一行去了。
#### b.每一行都正确排列，但仔细看你会发现，貌似整个布局稍微往左偏了一点。
出现这种情况意味着你在计算容器宽度的时候，考虑了每一个元素自身的宽度和右侧边距，但这样其实相当于为容器添加了一定的右侧内边距，容器内的元素自然就会产生一点向左移动了的效果。<br>
**上面两种问题，都有一定的方式去解决，但是一旦你这样做了，你的方案就变复杂了，就像上面使用 `font-size` 去解决空格带来的空隙一样，这都不是我们愿意看到的。**不过如果你有兴趣，可以去尝试一下不同的解决方案，毕竟它们的兼容性还是不错的，在 pc 站点上都还有着广泛的应用。
### （2）`flex` 的方式
相比于上面提到的方式，`flex` 的实现方案则显得更加简单、优雅。
![fluid-flex](https://upload-images.jianshu.io/upload_images/2064445-843a3b9275d3ffb3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
相比而言，`flex` 方式，只需要在 `flex` 容器上设置 `justify-content` 设置成对应的 `normal`/`space-between`/`space-around`/`space-evenly`，即可实现上图中的效果（后面三个布局需要容器内放满该行元素之后，需要一定剩余位置，且这个剩余位置一定比下一行第一个元素窄，否则下一行第一个元素可能会补上来）。最令人惊喜的是，如果你设置了 `flex-direction: column;`，你还能得到如下图所示效果：
![flex-direction: column;](https://upload-images.jianshu.io/upload_images/2064445-a61b12b9b09432d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
此外，结合 `align-content`，`flex` 还赋予了你操作行与行之间排列关系的能力：
![align-content](https://upload-images.jianshu.io/upload_images/2064445-a97bd79b7e926314.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 四、栅格(grid)布局
曾经尝试过使用 float 完成过一个简易版的栅格布局，比这在这里也使用 `flex` 完成了一个，相比于使用 `float` 确实简单得多，有兴趣可以尝试一下。
```
.grid {
    display: flex;
}

li {
    flex: 1;
}

.item-full {
    flex: 0 0 100%;
}

.item-1of2 {
    flex: 0 0 50%;
}

.item-1of3 {
    flex: 0 0 33.3333%;
}

.item-1of4 {
    flex: 0 0 25%;
}

.item-1of5 {
    flex: 0 0 20%;
}
.item-1of6 {
    flex: 0 0 16.6666%;
}
......
<ul class="grid">
    <li class="item-full">100%</li>
    <li class="item-1of2">1/2</li>
    <li class="item-1of2">1/2</li>
    <li class="item-1of3">1/3</li>
    <li class="item-1of3">1/3</li>
    <li class="item-1of3">1/3</li>
    <li class="item-1of2">1/2</li>
    <li class="item-1of3">1/3</li>
    <li class="item-1of6">1/6</li>
    <li class="item-1of4">1/4</li>
    <li class="item-1of2">1/2</li>
    <li class="item-1of4">1/4</li>
</ul>
```
![grid-flex](https://upload-images.jianshu.io/upload_images/2064445-889526e85fd34e5b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


