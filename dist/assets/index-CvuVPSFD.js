(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function e(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(o){if(o.ep)return;o.ep=!0;const i=e(o);fetch(o.href,i)}})();class r extends HTMLElement{static get observedAttributes(){return["placeholder"]}#t="";get value(){return this.#t}set value(t){this.#t=t,this.input&&(this.input.value=t)}constructor(){super(),this.#e()}connectedCallback(){this.#s()}#e(){this.attachShadow({mode:"open"})}#s(){const t=this.getAttribute("placeholder")||"What needs to be done?";this.shadowRoot.innerHTML=`
      <style>
        .todo-input {
          display: flex;
          gap: 8px;
        }
        .todo-input input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .todo-input input:focus {
          border-color: #4a90d9;
        }
        .todo-input button {
          padding: 10px 18px;
          background: #4a90d9;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .todo-input button:hover {
          background: #357abd;
        }
      </style>
      <div class="todo-input">
        <input type="text" placeholder="${t}" />
        <button>Add</button>
      </div>
    `,this.input=this.shadowRoot.querySelector("input"),this.button=this.shadowRoot.querySelector("button"),this.input.addEventListener("keydown",e=>{e.key==="Enter"&&this.input.value.trim()&&this.#i()}),this.button.addEventListener("click",()=>{this.input.value.trim()&&this.#i()})}#i(){const t=this.input.value.trim();t&&(this.#t=t,this.dispatchEvent(new CustomEvent("add",{detail:{text:t},bubbles:!0,composed:!0})),this.input.value="",this.input.focus())}}customElements.define("todo-input",r);class l extends HTMLElement{constructor(){super(),this.#t()}connectedCallback(){this.#e()}static get observedAttributes(){return["text","completed","id"]}attributeChangedCallback(){this.shadowRoot&&this.#e()}#t(){this.attachShadow({mode:"open"})}#e(){const t=this.getAttribute("text")||"",e=this.getAttribute("completed")==="true",s=this.getAttribute("id")||"";this.shadowRoot.innerHTML=`
      <style>
        .todo-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 8px;
          border-bottom: 1px solid #f0f0f0;
        }
        .todo-item:last-child {
          border-bottom: none;
        }
        .todo-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #4a90d9;
        }
        .todo-item .todo-text {
          flex: 1;
          font-size: 14px;
          color: #333;
        }
        .todo-item .todo-text.completed {
          text-decoration: line-through;
          color: #aaa;
        }
        .todo-item .delete-btn {
          background: none;
          border: none;
          color: #e74c3c;
          font-size: 18px;
          cursor: pointer;
          padding: 0 4px;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .todo-item .delete-btn:hover {
          opacity: 1;
        }
      </style>
      <label class="todo-item">
        <input type="checkbox" ${e?"checked":""} />
        <span class="todo-text ${e?"completed":""}">${t}</span>
        <button class="delete-btn" title="Delete">&times;</button>
      </label>
    `,this.checkbox=this.shadowRoot.querySelector('input[type="checkbox"]'),this.textSpan=this.shadowRoot.querySelector(".todo-text"),this.deleteBtn=this.shadowRoot.querySelector(".delete-btn"),this.checkbox.addEventListener("change",()=>{this.dispatchEvent(new CustomEvent("toggle",{detail:{id:Number(s)},bubbles:!0,composed:!0}))}),this.deleteBtn.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("delete",{detail:{id:Number(s)},bubbles:!0,composed:!0}))})}}customElements.define("todo-item",l);function a(n,t){switch(n){case"active":return t.filter(e=>!e.completed);case"completed":return t.filter(e=>e.completed);default:return t}}class c extends HTMLElement{constructor(){super(),this.#t()}connectedCallback(){this.#e()}static get observedAttributes(){return["filter"]}attributeChangedCallback(){this.shadowRoot&&this.#e()}#t(){this.attachShadow({mode:"open"})}#e(){const t=this.getAttribute("filter")||"all",e=JSON.parse(this.getAttribute("todos")||"[]"),s=a(t,e);this.shadowRoot.innerHTML=`
      <style>
        .todo-list {
          list-style: none;
        }
      </style>
      <ul class="todo-list"></ul>
    `,this.list=this.shadowRoot.querySelector(".todo-list");for(const o of s){const i=document.createElement("todo-item");i.setAttribute("id",String(o.id)),i.setAttribute("text",o.text),i.setAttribute("completed",String(o.completed)),i.addEventListener("toggle",d=>{this.dispatchEvent(new CustomEvent("toggle",{detail:{id:d.detail.id},bubbles:!0,composed:!0}))}),i.addEventListener("delete",d=>{this.dispatchEvent(new CustomEvent("delete",{detail:{id:d.detail.id},bubbles:!0,composed:!0}))}),this.list.appendChild(i)}}update(t){this.setAttribute("todos",JSON.stringify(t)),this.#e()}}customElements.define("todo-list",c);class p extends HTMLElement{#t=[];#e="all";#s=1;constructor(){super(),this.#i(),this.#d(),this.#o()}#i(){this.attachShadow({mode:"open"})}#d(){this.addEventListener("add",t=>{t.stopPropagation();const e={id:this.#s++,text:t.detail.text,completed:!1};this.#t.push(e),this.#o()}),this.addEventListener("toggle",t=>{t.stopPropagation(),this.#t=this.#t.map(e=>e.id===t.detail.id?{...e,completed:!e.completed}:e),this.#o()}),this.addEventListener("delete",t=>{t.stopPropagation(),this.#t=this.#t.filter(e=>e.id!==t.detail.id),this.#o()}),this.shadowRoot.addEventListener("click",t=>{const s=t.target.closest("button");s&&(s.dataset.filter&&(this.#e=s.dataset.filter,this.#o()),s.classList.contains("clear-completed")&&(this.#t=this.#t.filter(o=>!o.completed),this.#o()))})}#o(){this.shadowRoot.innerHTML=`
      <style>
        .todo-app {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }
        .todo-app h1 {
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }
        .todo-filters {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
          justify-content: center;
        }
        .todo-filters button {
          padding: 6px 14px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .todo-filters button.active {
          background: #4a90d9;
          color: #fff;
          border-color: #4a90d9;
        }
        .todo-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 8px 0;
          font-size: 13px;
          color: #888;
          border-top: 1px solid #f0f0f0;
          margin-top: 4px;
        }
      </style>
      <h1>Todo App</h1>
      <todo-input></todo-input>
      <div class="todo-filters">
        <button data-filter="all" class="${this.#e==="all"?"active":""}">All</button>
        <button data-filter="active" class="${this.#e==="active"?"active":""}">Active</button>
        <button data-filter="completed" class="${this.#e==="completed"?"active":""}">Completed</button>
      </div>
      <todo-list filter="${this.#e}" todos='${JSON.stringify(this.#t)}'></todo-list>
      <div class="todo-footer">
        <span class="item-count"></span>
        <button class="clear-completed" style="background:none;border:none;color:#e74c3c;font-size:13px;cursor:pointer;display:none;">Clear Completed</button>
      </div>
    `,this.#n()}#n(){const t=this.shadowRoot.querySelector(".item-count"),e=this.shadowRoot.querySelector(".clear-completed"),s=this.#t.filter(i=>!i.completed).length;t.textContent=`${s} item${s!==1?"s":""} left`;const o=this.#t.filter(i=>i.completed).length;e.style.display=o>0?"inline":"none"}}customElements.define("todo-app",p);
