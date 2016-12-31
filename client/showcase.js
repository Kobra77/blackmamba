class Title extends HTMLElement {
    constructor () {
        super();
        
        this._sizeStyle = 'title';
        
        var shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.template();
        
        this.headingElement = shadowRoot.querySelector('#heading');
        this.subHeadingElement = shadowRoot.querySelector('#sub-heading');
        
    }
    
    get heading () {
        return this.getAttribute('heading') || 'heading';
    }
    
    set heading (v) {
        this.setAttribute('heading', v);
        this.headingElement.textContent = v;
    }
    
    get subHeading () {
        return this.getAttribute('sub-heading') || 'sub-heading';
    }
    
    set subHeading (v) {
        this.setAttribute('sub-heading', v);
        this.subHeadingElement.textContent = v;
        
        if (this.subHeadingElement.hidden) 
            this.subHeadingElement.hidden = false;
    }
    
    get dark () {
        return this.hasAttribute('dark')
    }
    
    set dark (bool) {
        if (bool) {
            if (!this.hasAttribute('dark')) {
                let attr = document.createAttribute('dark');
                this.setAttributeNode(attr);
            }
        } else {
            this.removeAttribute('dark');
        }
    }
    
    get size () {
        return this.getAttribute('size');
    }
    
    set size (v) {
        this.setAttribute('size', v);
        
        this.classList.remove(this._sizeStyle);
        this.classList.add(v);
        this._sizeStyle = v;
    }
    
    connectedCallback () {
        if (this.hasAttribute('sub-heading')) {
            this.subHeadingElement.hidden = false;
        }
        
        if (this.hasAttribute('size')) {
            let size = this.getAttribute('size');
            this.classList.add(size);
            this._sizeStyle = size;
        }
    }
    
    template () {
        var theme = this.dark ? 'dark' : 'light'; 
        return `
            <style>
                .display-4 {
                    font-size: var(--display-4);
                    font-weight: var(--font-light);
                }
                .display-3 {
                    font-size: var(--display-3);
                    font-weight: var(--font-regular);
                }
                .display-2 {
                    font-size: var(--display-2);
                    font-weight: var(--font-regular);
                }
                .display-1 {
                    font-size: var(--display-1);
                    font-weight: var(--font-regular);
                }  
                .title {
                    font-size: var(--title);
                    font-weight: var(--font-medium);
                }
                .sub-heading {
                    font-size: var(--title);
                    font-weight: var(--font-regular);                    
                }
                #heading {
                    color: var(--${theme}-primary-text-color, #000);
                };
                
                #sub-heading {
                    color: var(--${theme}-secondary-text-color, rgba(0,0,0,0.7));
                }                
            </style>
            <div id="heading">${this.heading}</div>
            <div id="sub-heading" hidden>${this.subHeading}</div>
        `;
    }
}

customElements.define('bm-title', Title);


class ShowCase extends HTMLElement {
    constructor () {
        super();
        
        this.heading = 'heading';
        
        var shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.template();
    }
    
    get bgImage () {
        if (this.hasAttribute('color')) {
            return this.getAttribute('image');
        } else {
            return null;
        }
        
    }
    
    set bgImage (v) {
        this.setAttribute('image', v);
    }
    
    get bgPosition () {
        if (this.hasAttribute('image-position')) {
            return this.getAttribute('image-position');            
        } else {
            return null;
        }
    }
    
    set bgPosition (v) {
        this.setAttribute('image-position', v);
    }
    
    template () {
        var bgImage = this.bgImage ? `url('${this.bgImage}')` : 'none';
        var bgPosition = this.bgPosition ? this.bgPosition : 'center';
        
        return `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    background-image: ${bgImage};
                    background-position: ${bgPosition};
                    background-color: var(--primary-color, transparent);
                    color: var(--accent-text-color, rgb(39, 39, 39));
                }
            
                #container {
                    max-width: 960px;
                }
                
            </style>
            <div id="container">
                <slot name="title"></slot>
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('bm-showcase', ShowCase);