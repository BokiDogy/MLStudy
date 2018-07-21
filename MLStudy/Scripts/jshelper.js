var $$ = (x) => [].slice.call(x); //将对象转化为数组
//数组元素移动

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};
Array.prototype.move2 = function (pos1, pos2) {
    // local variables
    var i, tmp;
    // cast input parameters to integers
    pos1 = parseInt(pos1, 10);
    pos2 = parseInt(pos2, 10);
    // if positions are different and inside array
    if (pos1 !== pos2 && 0 <= pos1 && pos1 <= this.length && 0 <= pos2 && pos2 <= this.length) {
        // save element from position 1
        tmp = this[pos1];
        // move element down and shift other elements up
        if (pos1 < pos2) {
            for (i = pos1; i < pos2; i++) {
                this[i] = this[i + 1];
            }
        }
        // move element up and shift other elements down
        else {
            for (i = pos1; i > pos2; i--) {
                this[i] = this[i - 1];
            }
        }
        // put element from position 1 to destination
        this[pos2] = tmp;
    }
}


function move(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
        var k = newIndex - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
};

//上移一层
function up(arr, indexes) {
    //indexes必须由大到小，所以得排序
    indexes.sort();
    indexes.reverse();

    //调换位置
    for (var i = 0; i < indexes.length; i++) {
        var index = indexes[i];
        move(arr, index, index + 1);
    }

    //去掉undefined
    var result = new Array();
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (item != undefined) {
            result.push(item);
        }
    }

    return result;
}

//置顶
function ceil(arr, indexes) {
    //indexes必须由小到大，所以得排序
    indexes.sort();

    for (var i = 0; i < indexes.length; i++) {
        var index = indexes[i];
        move(arr, index - i, arr.length - 1);
    }

    return arr;
}
//