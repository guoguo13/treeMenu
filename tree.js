function createEl(el, classList) {
    const node = document.createElement(el);
    if (classList) {
        classList.forEach(item => {
            node.classList.add(item);
        });
    }
    return node;
}
function parents(el, className) {
    if (el.classList.contains(className)) {
        return el;
    } else {
        return parents(el.parentElement, className);
    }
}

function children(el, className) {
    const arr = [];
    if (el.children) {
        const elC = el.children;
        for (let i = 0; i < elC.length; i++) {
            if (elC[i].classList.contains(className)) {
                arr.push(elC[i]);
            } else {
                if (elC[i].children && elC[i].children.length > 0) {
                    const newArr = children(elC[i], className)
                    if (newArr && newArr.length > 0) {
                        arr.push(...newArr);
                    }
                    children(elC[i], className);
                }
            }
        }
        return arr;
    } else {
        return false;
    }
}

class Tree {
    constructor(option) {
        if (typeof option.node === "undefined") {
            throw new Error("node is not Element");
        }
        this.option = {
            show_expand_level: 0,
            show_level_all: false,
            show_checkbox: false
        };
        this.option = { ...this.option, ...option };
        this.value = [];
        this.Init();
    }

    Init() {
        const { menu, node } = this.option;
        menu.forEach(item => {
            node.appendChild(this.loop(item, 0));
        });
    }

    loop(tree, level) {
        const { show_expand_level, show_level_all } = this.option;
        const div = createEl("div", ["tree-item"]);
        const label = tree.label,
            value = tree.value;
        const hasChildren = tree.children && tree.children.length > 0;
        const showLevel = show_level_all || show_expand_level > level;
        const div_content = this.createContentDom({
            label,
            value,
            hasChildren,
            showLevel
        });
        div_content.style.paddingLeft = level * 18 + "px";
        div.appendChild(div_content);
        if (hasChildren) {
            level++;
            const div_children = createEl("div", ["tree-children"]);
            div_children.style.display = showLevel ? "block" : "none";
            tree.children.forEach(item => {
                div_children.appendChild(this.loop(item, level));
            });
            div.appendChild(div_children);
        }
        return div;
    }

    createContentDom(obj) {
        const { show_checkbox } = this.option;
        const div_content = createEl("div", ["tree-content"]);
        const span_expand = createEl("span", ["tree-expand"]);
        const span_content = createEl("span");
        span_expand.dataset.show = obj.showLevel ? "true" : "false";
        obj.showLevel ? span_expand.classList.add("expanded") : "";
        span_content.textContent = obj.label;
        div_content.dataset.value = obj.value;
        if (obj.hasChildren) {
            div_content.appendChild(span_expand);
            div_content.addEventListener("click", this.handleShow);
        }
        if (show_checkbox) {
            const span_check_inner = createEl("div", ["tree-check-inner"]);
            span_check_inner.dataset.checked = "false";
            div_content.appendChild(span_check_inner);
            span_check_inner.addEventListener("click", this.handleChecked);
        }
        div_content.appendChild(span_content);

        return div_content;
    }

    handleShow(e) {
        const el = e.target;
        if (el.classList.contains("tree-check-inner")) {
            return;
        }
        const treeContentList = document.querySelectorAll( "#tree .tree-content" );
        const treeContent = el.classList.contains("tree-content")
            ? el
            : el.parentElement;
        const treeChildren =
            treeContent.parentElement.children[
                treeContent.parentElement.children.length - 1
            ];
        const treeExpand = el.classList.contains("tree-expand")
            ? el
            : treeContent.children[0];
        const isShow = treeExpand.dataset.show;
        treeContentList.forEach(el => {
            el.classList.remove("active");
        });
        treeContent.classList.add("active");
        isShow === "false"
            ? treeExpand.classList.add("expanded")
            : treeExpand.classList.remove("expanded");
        treeChildren.style.display = isShow == "false" ? "block" : "none";
        treeExpand.dataset.show = isShow == "false" ? "true" : "false";
    }

    handleChecked(e) {
        const el = e.target;
        const curChecked = el.dataset.checked;
        el.dataset.checked = curChecked === "false" ? "true" : "false";
        curChecked === "false"
            ? el.classList.add("tree-check-checked")
            : el.classList.remove("tree-check-checked");
        const elP = parents(el, "tree-item");
        const elC = children(elP, "tree-children")[0];
        const loop = elC => {
            let node = elC.children;
            let cLen = node.length;
            for (let i = 0; i < cLen; i++) {
                const span_check_inner = children(node[i], "tree-check-inner");
                if (span_check_inner) {
                    span_check_inner.forEach(node => {
                        node.dataset.checked = curChecked === "false" ? "true" : "false";
                        curChecked === "false" ? node.classList.add("tree-check-checked") : node.classList.remove("tree-check-checked");
                    })
                }
            }
        };
        if (elC) {
            loop(elC);
        }
        // callback(this.value);
    }

    isGetValue(isChecked, name) {
        const value = JSON.parse(JSON.stringify(this.value));
        if (isChecked && value.indexOf(name) < 0) {
            value.push(name);
        } else {
            value.splice(value.indexOf(name), 1);
        }
        return value;
    }
}
