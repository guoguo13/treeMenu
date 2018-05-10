# treeMenu
一个文件树菜单，支持勾选
## 使用方法
### 1.定义数据
    var data = [
        { name: '主菜单一', children: [
            { name: "一级子菜单一" },
            { name: "一级子菜单二" , children: [
                { name: "二级子菜单一" },
                { name: "二级子菜单三" },
                { name: "二级子菜单二" }
            ]}
        ]},
        { name: '主菜单二', children: [
            { name: "一级子菜单一" },
            { name: "一级子菜单二" , children: [
                { name: "二级子菜单一" },
                { name: "二级子菜单二" }
            ]}
        ]}
    ]

### 2.创建实例

    var tree = new Tree({
        node: document.querySelector("#tree"),
        menu: data,
        callback: function(value) {
            /* 被选中的元素 */
            console.log(value);
        }
    })
