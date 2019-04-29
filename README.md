# treeMenu
一个文件树菜单，支持勾选

Demo  
https://guoguo13.github.io/treeMenu/ 

### 示例 
 
 ```
    var data = [
        {
            label: "1", value: "1", children: [
                {
                    label: "12", value: "1", children: [
                        { label: "13", value: "1" }
                    ]
                }
            ]
        }
    ];
    var tree = new Tree({
        node: document.querySelector("#tree"),
        menu: data,
        show_expand_level: 1,
        show_level_all: false,
        show_checkbox: true
    });
```
### 属性说明
| 属性              |  类型/是否必填   | 说明                                                         |
| ----------------- | :--------------: | ------------------------------------------------------------ |
| node              |       必填       | 即将存放文件树的Dom节点                                      |
| menu              |  Object / 必填   | 文件树数据                                                   |
| show_expand_level | Number / 非必填  | 当前文件树须展开的层级，默认为0                              |
| show_level_all    | Boolean / 非必填 | 是否展开所有层级，默认为false                                |
| show_checkbox     | Boolean /非必填  | 是否显示多选框，默认为false                                  |
| selectedKeys      |      Object      | 返回值，储存用户选中的树节点label，show_checkbox为true时有效 |
| selectedValue     |      String      | 返回值，储存用户当前点击的树节点label                        |