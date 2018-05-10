function createEl(el) {
    return document.createElement(el);
};
class Tree {
    constructor(option) {
        if(typeof option.node === 'undefined') {
            throw new Error('node is not Element');
        };
        this.option = option;
        this.value = [];
        this.Init();
    }; 

    Init() {
        const { menu, node } = this.option;
        const el = this.loop(menu);
        node.appendChild(el);
    };

    loop(data) {
        if( data.length > 0) {
            const ul  = createEl('ul');
            ul.classList.add("sub-tree");
            data.forEach((item) => {
                const name = item.name;
                const isChildren = item.children && item.children.length > 0;
                const el = this.createDom('li', name, isChildren);
                if( isChildren ) {
                    el.appendChild( this.loop(item.children) );
                };
                ul.appendChild(el);
            });
            return ul;
        };
    };

    createDom(node, name, isChildren) {
        const el = createEl(node);
        const div = createEl("div");
        const input = createEl("input");
        const plus = createEl("img");
        const file = createEl("img");
        const label = createEl("label");
        div.dataset.show = 'F';
        input.type = "checkbox";
        input.name = name;
        plus.src = "images/plus.svg";
        file.src = isChildren ?  "images/folder.svg" : "images/file.svg";
        label.textContent = name;
        label.for = name;
        isChildren ? div.appendChild(plus): "";
        div.appendChild(file);
        div.appendChild(input);
        div.appendChild(label);
        el.appendChild(div);
        plus.addEventListener('click', this.handleShow);
        input.addEventListener('change', this.handleChecked.bind(this));
        return el;  
    };

    handleShow(e) {
        const el = e.target;
        const elP = el.parentElement;
        const elC = elP.nextElementSibling;
        const isShow = elP.dataset.show;
        el.src = isShow == 'F' ? "images/minus.svg" : "images/plus.svg";
        elC.style.display = isShow == 'F' ? "block" : "none";
        elP.dataset.show = isShow == 'F' ? "T" : "F";
    };

    handleChecked(e) {
        const { callback } = this.option;
        const el = e.target;
        const elP = el.parentElement;
        const isChecked = el.checked;
        const elC = elP.nextElementSibling;
        const loop = (elC) => {
            let node = elC.children;
            let cLen = node.length;
            for(let i = 0; i < cLen; i++) {
                let index = node[i].children.length > 1 ? 2: 1;
                const that = node[i].firstElementChild.children[index]; 
                const name = that.name;
                that.checked = isChecked; 
                this.value = this.isGetValue(isChecked, name);
                if(node[i].children.length > 1) {
                    loop(node[i].lastElementChild);
                }             
            };  
        }
        if(elC) {
            loop(elC);
        } else {
            const name = el.name;
            this.value = this.isGetValue(isChecked, name);
        };
        callback(this.value);              
    };

    isGetValue(isChecked, name) {
        const value = JSON.parse(JSON.stringify(this.value));
        if(isChecked && value.indexOf(name) < 0) {
            value.push(name);
        } else {
            value.splice(value.indexOf(name), 1);
        };
        return value;
    }

};