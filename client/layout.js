class Layout extends HTMLElement {
    constructor () {
        super();
        
        var shadowRoot = this.attachShadow({mode:'open'});
        shadowRoot.innerHTML = this.template();
        
        // element shortcut
        this.headerElement = shadowRoot.querySelector('#header');
    }
    
    get header () {
        return this.hasAttribute('header');
    }
    
    set header (bool) {
        if (bool) {
            var attr = document.createAttribute('header');
            this.setAttributeNode(attr);            
        } else {
            this.removeAttribute('header');
        }
    }
    
    get content () {
        return this.hasAttribute('content');
    }
    
    set content (bool) {
        if (bool) {
            var attr = document.createAttribute('content');
            this.setAttributeNode(attr);            
        } else {
            this.removeAttribute('content');
        }
    }   
    
    
    get footer () {
        return this.hasAttribute('footer');
    }
    
    set footer (bool) {
        if (bool) {
            var attr = document.createAttribute('footer');
            this.setAttributeNode(attr);            
        } else {
            this.removeAttribute('footer');
        }
    }    
    get menu () {
        return this.hasAttribute('menu');
    }
    
    set menu (bool) {
        if (bool) {
            var attr = document.createAttribute('menu');
            this.setAttributeNode(attr);            
        } else {
            this.removeAttribute('menu');
        }
    }     
    
    get info () {
        return this.hasAttribute('info');
    }
    
    set info (bool) {
        if (bool) {
            var attr = document.createAttribute('info');
            this.setAttributeNode(attr);            
        } else {
            this.removeAttribute('info');
        }
    }    
    template () {
        return `
            <div id="header"></div>
            <div id="content"></div>
            <div id="footer"></div>
            <div id="menu"></div>
            <div id="info"></div>
        `;
    }
}