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