function createEl(el, classList) {
    const node = document.createElement(el);
    if (classList) {
        classList.forEach(item => {
            node.classList.add(item);
        });
    }
    return node;
}
function parents(el, className = '') {
    if (!className) {
        return el.parentElement;
    }
    const elP = el.parentElement;
    if (!elP) {
        return false;
    }
    if (elP.classList.contains(className)) {
        return elP;
    } else {
        return parents(elP, className);
    }
}
function siblings(el, className = "") {
    const elP = el.parentElement;
    const siblingsNode = children(elP, className);
    return siblingsNode.filter(node => node != el);
}
function children(el, className = "") {
    const arr = [];
    if (el.children) {
        const elC = el.children;
        for (let i = 0; i < elC.length; i++) {
            if (!className || elC[i].classList.contains(className)) {
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
/**
 * @param show_expand_level {number} 当前展开层级
 * @param show_level_all {boolean} 是否展开所有层级
 * @param show_checkbox {boolean} 是否显示多选框
 * @method getCheckedKeys 返回被选中的数据，show_checkbox为true时有效
 */
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
        this._keys = [];
        this._value = '';
        this.Init();
    }
    get selectedkeys() {
        return this._keys;
    }
    get selectedValue() {
        return this._value;
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
        div_content.dataset.label = obj.label;
        div_content.dataset.value = obj.value;
        if (obj.hasChildren) {
            div_content.appendChild(span_expand);
        }
        if (show_checkbox) {
            const span_check_inner = createEl("div", ["tree-check-inner"]);
            span_check_inner.dataset.checked = "false";
            span_check_inner.dataset.label = obj.label;
            span_check_inner.dataset.value = obj.value;
            div_content.appendChild(span_check_inner);
            span_check_inner.addEventListener("click", this.handleChecked.bind(this));
        }
        div_content.appendChild(span_content);
        div_content.addEventListener("click", this.handleShow.bind(this));
        return div_content;
    }

    handleShow(e) {
        const el = e.target;
        const treeContent = el.classList.contains("tree-content") ? el : parents(el, "tree-content");
        if (el.classList.contains("tree-check-inner")) {
            return;
        }
        this._value = treeContent.dataset.label;
        const treeContentList = document.querySelectorAll("#tree .tree-content");
        treeContentList.forEach(el => {
            el.classList.remove("active");
        });
        treeContent.classList.add("active");
        const treeChildren = siblings(treeContent, "tree-children")[0];
        if (treeChildren) {
            const treeExpand = el.classList.contains("tree-expand")
                ? el
                : children(treeContent, "tree-expand")[0];
            const isShow = treeExpand.dataset.show;
            isShow === "false"
                ? treeExpand.classList.add("expanded")
                : treeExpand.classList.remove("expanded");
            treeChildren.style.display = isShow == "false" ? "block" : "none";
            treeExpand.dataset.show = isShow == "false" ? "true" : "false";
        }
    }

    handleChecked(e) {
        const el = e.target;
        const isChecked = el.dataset.checked === "false";
        el.dataset.checked = isChecked ? "true" : "false";
        this.handleDomChecked(el, isChecked);
        const elP = parents(el, "tree-item");
        const elC = children(elP, "tree-children")[0];
        const loopChildren = elC => {
            let node = elC.children;
            let cLen = node.length;
            for (let i = 0; i < cLen; i++) {
                const span_check_inner = children(node[i], "tree-check-inner");
                if (span_check_inner) {
                    span_check_inner.forEach(node => {
                        this.handleDomChecked(node, isChecked);
                        node.dataset.checked = isChecked ? "true" : "false";
                    })
                }
            }
        };
        const loopSbilings = elP => {
            const sbiling = siblings(elP);
            const elPCheck = children(elP, "tree-check-inner")[0]
            this.handleDomChecked(elPCheck, isChecked);
            let tem = false;
            if (sbiling.length > 0) {
                for (let i = 0; i < sbiling.length; i++) {
                    const element = sbiling[i];
                    const isDomChecked = this.isDomChecked(element);
                    if (i === sbiling.length - 1 && isDomChecked) {
                        tem = true;
                    }
                }
            }
            if (sbiling.length === 0 || tem) {
                const elPP = parents(elP, "tree-item");
                const elPC = children(elPP, "tree-check-inner")[0];
                this.handleDomChecked(elPC, isChecked);
                if (parents(elPP, "tree-item")) {
                    loopSbilings(parents(elPP, "tree-item"))
                }
            }

        }
        if (elC) {
            loopChildren(elC);
        }
        if (elP) {
            loopSbilings(elP)
        }
    };
    handleDomChecked(el, status) {
        if (status) {
            const key = el.dataset.label;
            if (this._keys.indexOf(key) < 0) {
                this._keys.push(key)
            }
            el.classList.add("tree-check-checked")
        } else {
            el.classList.remove("tree-check-checked")
        };
    }
    isDomChecked(el) {
        let node = el;
        if (!node.classList.contains("tree-check-inner")) {
            node = children(el, "tree-check-inner");
        }
        const isChecked = node.some(el => el.dataset.checked === 'false');
        return !isChecked
    };

}
