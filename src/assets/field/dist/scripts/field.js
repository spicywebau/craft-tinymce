(()=>{"use strict";var t={575:function(t,e,i){var n=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(r,o){function a(t){try{l(n.next(t))}catch(t){o(t)}}function s(t){try{l(n.throw(t))}catch(t){o(t)}}function l(t){var e;t.done?r(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,s)}l((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.TinyMCEField=void 0;const r=i(311),o=(t,e={})=>{let i;return()=>{void 0===i?i=Craft.createElementSelectorModal(t,Object.assign({resizable:!0,multiSelect:!1,disableOnSelect:!0},e)):i.show()}},a=(t,e,i,n,r)=>({title:t,body:{type:"panel",items:e},buttons:[{type:"cancel",name:"cancel",text:Craft.t("tinymce","Cancel")},{type:"submit",name:"submit",text:Craft.t("tinymce","Save"),buttonType:"primary"}],initialData:i,onChange:n,onSubmit:r});new window.MutationObserver((()=>{r(".tox-dialog-wrap__backdrop").off("click.field").on("click.field",(()=>{var t;return null===(t=tinymce.activeEditor)||void 0===t?void 0:t.windowManager.close()}))})).observe(document.body,{childList:!0,subtree:!0});e.TinyMCEField=class{constructor(t){var e,i;this._settings=t,this._cardHtml={},this._elementType="craft\\elements\\Entry";const n=this._settings,r=Object.assign({skin:"craft",plugins:"autoresize lists link image code",content_css:!1,menubar:!1,statusbar:!1,toolbar:"undo redo | styles | bold italic strikethrough | bullist numlist | insertLink insertImage | hr | code",contextmenu:"craftLink linkchecker craftImage table spellchecker configurepermanentpen",allow_conditional_comments:!1,element_format:"xhtml",entity_encoding:"raw",fix_list_elements:!0,style_formats:[{title:"Headings",items:[{title:"Heading 1",format:"h1"},{title:"Heading 2",format:"h2"},{title:"Heading 3",format:"h3"},{title:"Heading 4",format:"h4"},{title:"Heading 5",format:"h5"},{title:"Heading 6",format:"h6"}]},{title:"Inline",items:[{title:"Bold",format:"bold"},{title:"Italic",format:"italic"},{title:"Underline",format:"underline"},{title:"Strikethrough",format:"strikethrough"},{title:"Superscript",format:"superscript"},{title:"Subscript",format:"subscript"},{title:"Code",format:"code"},{title:"Mark",inline:"mark"}]},{title:"Blocks",items:[{title:"Paragraph",format:"p"},{title:"Blockquote",format:"blockquote"},{title:"Div",format:"div"},{title:"Pre",format:"pre"}]},{title:"Align",items:[{title:"Left",format:"alignleft"},{title:"Center",format:"aligncenter"},{title:"Right",format:"alignright"},{title:"Justify",format:"alignjustify"}]}],relative_urls:!1,remove_script_host:!1,anchor_top:!1,anchor_bottom:!1,autoresize_bottom_margin:0},this._settings.editorConfig,{selector:`#${this._settings.id}`,language:this._settings.language,directionality:this._settings.direction,add_unload_trigger:!1,extended_valid_elements:["craft-entry","#span[class]",null!==(e=this._settings.editorConfig.extended_valid_elements)&&void 0!==e?e:null].filter((t=>null!==t)).join(","),custom_elements:["craft-entry",null!==(i=this._settings.editorConfig.custom_elements)&&void 0!==i?i:null].filter((t=>null!==t)).join(","),setup:t=>{this.editor=t,this._setup()},init_instance_callback:t=>{this.editor=t,this._init(r);const e=n.editorConfig.init_instance_callback;"function"==typeof e&&e.apply(this,arguments)}});tinymce.init(r).then((()=>{}),(()=>{}))}_commandHandleFromElementType(t){var e;return null===(e=t.split("\\").pop())||void 0===e?void 0:e.toLowerCase()}_setup(){const t=[],e=[],i=[{value:"",text:Craft.t("tinymce","No transform")}];i.push(...this._settings.transforms),this.editor.on("GetContent",(t=>{const e=(new DOMParser).parseFromString(t.content,"text/html").body;e.querySelectorAll(".craft-entry-card").forEach((t=>{var e;const i=document.createElement("craft-entry");i.setAttribute("data-entry-id",null!==(e=null==t?void 0:t.dataset.entryId)&&void 0!==e?e:""),i.textContent=" ",t.replaceWith(i)})),t.content=e.innerHTML})),this.editor.on("BeforeSetContent",(t=>{const e=(new DOMParser).parseFromString(t.content,"text/html").body,i=(new DOMParser).parseFromString(t.content,"text/html").body,n=this.editor.getElement();e.querySelectorAll("craft-entry").forEach((t=>{var e;const n=t.dataset.entryId,r=document.createElement("div");r.classList.add("craft-entry-card"),r.setAttribute("data-entry-id",n),r.setAttribute("contenteditable","false"),t.hasAttribute("data-card-html")&&(this._cardHtml[n]=(new DOMParser).parseFromString(t.dataset.cardHtml,"text/html").body.textContent,null===(e=i.querySelector(`craft-entry[data-entry-id="${n}"]`))||void 0===e||e.removeAttribute("data-card-html")),r.innerHTML=this._cardHtml[n],t.replaceWith(r)})),t.content=e.innerHTML,n.value=i.innerHTML}));for(const[t,e]of Object.entries(this._settings.icons))this.editor.ui.registry.addIcon(t,e);for(const{elementType:i,optionTitle:n,sources:r}of this._settings.linkOptions){const a=this._commandHandleFromElementType(i),s=`${a}Link`,l=o(i,{sources:r,criteria:{locale:this._settings.locale},onSelect:([t])=>{const e=this.editor.selection.getContent();this.editor.windowManager.open(this._linkDialogConfig(n,!1,{url:`${t.url}#${a}:${t.id}@${this._settings.elementSiteId}:url`,text:e.length>0?e:String(t.label),site:this._settings.elementSiteId}))}});t.push({type:"menuitem",text:n,onAction:()=>l()}),this.editor.ui.registry.addMenuItem(s,{icon:"link",text:n,onAction:()=>l()}),e.push(s)}t.push({type:"menuitem",text:Craft.t("tinymce","Insert/edit link"),onAction:()=>this.editor.execCommand("mceLink")}),this.editor.ui.registry.addMenuButton("insertLink",{icon:"link",tooltip:Craft.t("tinymce","Link"),fetch:e=>e(t)});const r=Craft.t("tinymce","Edit link");this.editor.ui.registry.addMenuItem("editLink",{icon:"link",text:r,onAction:t=>{var e,i,n;const o=this.editor.dom.getParent(this.editor.selection.getStart(),"a[href]"),a=null!==(e=null==o?void 0:o.getAttribute("href"))&&void 0!==e?e:"",s=a.match(/@([0-9]+)(:url)$/);this.editor.selection.select(o),this.editor.windowManager.open(this._linkDialogConfig(r,!0,{url:a,text:null!==(i=null==o?void 0:o.textContent)&&void 0!==i?i:"",newTab:"_blank"===(null!==(n=null==o?void 0:o.getAttribute("target"))&&void 0!==n?n:""),site:null!==s?s[1]:this._settings.elementSiteId}))}}),this.editor.ui.registry.addContextMenu("craftLink",{update:t=>{const i=this.editor.dom.getParents(t,"a");if(0===i.length)return`${e.join(" ")} link`;return(i.some((t=>t.href.endsWith(":url")))?"editLink":"link openlink")+" unlink"}});const a=Craft.t("tinymce","Insert an image");this.editor.ui.registry.addButton("insertImage",{icon:"image",tooltip:a,onAction:()=>o("craft\\elements\\Asset",{sources:this._settings.volumes,transforms:this._settings.transforms.map((t=>({handle:t.value,name:t.text}))),storageKey:"RichTextFieldType.ChooseImage",criteria:{locale:this._settings.locale,kind:"image"},onSelect:([t],e=null)=>{this.editor.windowManager.open(this._imageDialogConfig(a,!0,i,t,{transform:null!=e?e:this._settings.defaultTransform}))}})()});const s=Craft.t("tinymce","Edit image");this.editor.ui.registry.addMenuItem("editImage",{icon:"image",text:s,onAction:t=>{var e,n,r,o,a,l,d,c;const m=this.editor.selection.getStart(),u=this.editor.dom.getParent(m,"img"),h=this.editor.dom.getParent(u,"a"),g=this.editor.dom.getParent(null!=h?h:u,"figure"),f=(null!=h?h:u).nextSibling,y=null==u?void 0:u.getAttribute("src"),p=null!==(e=null==y?void 0:y.match(/:transform:(.+)$/))&&void 0!==e?e:[],v=p.length>0?p.pop():"",_=(null==y?void 0:y.match(/#asset:([0-9]+)/)).pop(),C=null===(o=null===(r=null===(n=""!==v?null==y?void 0:y.replace(`/_${v}/`,"/"):y)||void 0===n?void 0:n.replace(`:transform:${v}`,""))||void 0===r?void 0:r.replace(/:url$/,""))||void 0===o?void 0:o.replace(`#asset:${_}`,"");this.editor.selection.select(g),this.editor.windowManager.open(this._imageDialogConfig(s,!0,i,{id:_,url:C,label:""},{title:null!==(a=null==u?void 0:u.getAttribute("alt"))&&void 0!==a?a:"",caption:null!==(l=null==f?void 0:f.textContent)&&void 0!==l?l:"",link:null!==(d=null==h?void 0:h.href)&&void 0!==d?d:"",newTab:null!==(c="_blank"===(null==h?void 0:h.target))&&void 0!==c&&c,transform:v}))}}),this.editor.ui.registry.addContextMenu("craftImage",{update:t=>{const e=this.editor.dom.getParents(t,"figure, img");if(0===e.length)return"";return e.some((t=>"FIGURE"===t.tagName))?"editImage":"image"}}),this.editor.ui.registry.addMenuButton("craftentry",{icon:"craftentry",tooltip:Craft.t("tinymce","Create an entry"),fetch:t=>t(Object.keys(this._settings.entryTypes).map((t=>({type:"menuitem",text:this._settings.entryTypes[t],onAction:()=>n(this,void 0,void 0,(function*(){try{yield this._createEntry(t)}catch(t){Craft.cp.displayError(t.message)}}))}))))}),tinymce.addI18n(this._settings.language,this._settings.translations)}_init(t){this._initFocus(),this._initEntryCards();new window.MutationObserver((()=>this._initEntryCards())).observe(this.editor.getBody(),{characterData:!0,childList:!0,subtree:!0});const e=r(this.editor.formElement);this.editor.on("Dirty",(()=>{this.editor.save(),e.trigger("change")})),this.editor.addShortcut("meta+s","",(()=>Garnish.uiLayerManager.triggerShortcut(new KeyboardEvent("keydown",{shiftKey:!1,metaKey:!0,ctrlKey:!0,altKey:!1,keyCode:Garnish.S_KEY})))),this.editor.addShortcut("shift+meta+s","",(()=>Garnish.uiLayerManager.triggerShortcut(new KeyboardEvent("keydown",{shiftKey:!0,metaKey:!0,ctrlKey:!0,altKey:!1,keyCode:Garnish.S_KEY}))));const i=()=>tinymce.execCommand("mceRemoveEditor",!1,this._settings.id),n=()=>{tinymce.execCommand("mceAddEditor",!1,{id:this._settings.id,options:t}),this._initFocus(),this._initEntryCards()};if(void 0!==Craft.Preview&&(Garnish.on(Craft.Preview,"beforeOpen beforeClose",i),Garnish.on(Craft.Preview,"open close",n)),void 0!==Craft.LivePreview&&(Garnish.on(Craft.LivePreview,"beforeEnter beforeExit",i),Garnish.on(Craft.LivePreview,"enter exit",n)),void 0!==Garnish.Drag){let t=null;Garnish.on(Garnish.Drag,"dragStart",(e=>{var n,r;if(t=null===(n=e.target)||void 0===n?void 0:n.$draggee[0],t.contains(this.editor.editorContainer)){t.style.height=`${t.offsetHeight}px`;const e=this.editor.editorContainer.querySelector("iframe"),n=(null===(r=e.contentDocument)||void 0===r?void 0:r.querySelector("html")).innerHTML;setTimeout((()=>{var t;(null===(t=document.querySelector(".draghelper").querySelector(`#${e.id}`).contentDocument)||void 0===t?void 0:t.querySelector("html")).innerHTML=n}),60),i()}else t=null})),Garnish.on(Garnish.Drag,"dragStop",(e=>{null!==t&&(setTimeout((()=>{t.style.height="auto",t=null}),100),n())}))}void 0!==Craft.ElementEditorSlideout&&Garnish.on(Craft.ElementEditorSlideout,"beforeClose",(t=>{var e;const i=t.target.$container,n=this.editor.getContainer();i[0].contains(n)&&(null===(e=n.querySelector(".tox-tbtn--enabled"))||void 0===e||e.click())}))}_initFocus(){this.editor.on("focus",(t=>this.editor.container.classList.add("mce-focused"))),this.editor.on("blur",(t=>this.editor.container.classList.remove("mce-focused")))}_initEntryCards(t){this.editor.getBody().querySelectorAll(".craft-entry-card:not(.initialised)").forEach((t=>this._initEntryCard(t)))}_initEntryCard(t){t.addEventListener("dblclick",(()=>n(this,void 0,void 0,(function*(){try{yield this._editEntry(t.dataset.entryId)}catch(t){Craft.cp.displayError(t.message)}})))),t.classList.add("initialised")}_linkDialogConfig(t,e,i){const n=this.editor.selection.getContent();return a(t,[{type:"input",name:"url",label:Craft.t("tinymce","URL"),enabled:!1},{type:"input",name:"text",label:Craft.t("tinymce","Text")},{type:"checkbox",name:"newTab",label:Craft.t("tinymce","Open in new tab?")},{type:"selectbox",name:"site",label:Craft.t("tinymce","Site"),items:this._settings.allSites}],i,(t=>{const e=t.getData();t.setData({url:e.url.replace(/@([0-9]+)(:url)$/,`@${e.site}:url`)})}),(t=>{const i=t.getData(),r=e||n.length>0?"mceReplaceContent":"mceInsertContent",o=`<a href="${i.url}" title="${i.text}"${i.newTab?' target="_blank"':""}>${i.text}</a>`;this.editor.execCommand(r,!1,o),t.close()}))}_imageDialogConfig(t,e,i,n,r){const o=this.editor.selection.getContent();return a(t,[{type:"input",name:"title",label:Craft.t("tinymce","Title")},{type:"input",name:"caption",label:Craft.t("tinymce","Caption")},{type:"input",name:"link",label:Craft.t("tinymce","Link")},{type:"checkbox",name:"newTab",label:Craft.t("tinymce","Open in new tab?")},{type:"selectbox",name:"transform",label:Craft.t("tinymce","Transform"),items:i}],r,(()=>{}),(t=>{const i=t.getData(),r=e||o.length>0?"mceReplaceContent":"mceInsertContent",a=i.title.length>0,s=i.caption.length>0,l=i.link.length>0,d=""!==i.transform,c=e=>{const n=["<figure>",l?`<a href="${i.link}"${i.newTab?' target="_blank"':""}>`:"",`<img src="${e}"${a?`alt="${i.title}"`:""}>`,l?"</a>":"",s?`<figcaption>${i.caption}</figcaption>`:""].join("");this.editor.execCommand(r,!1,n),t.close()};if(d){const t={assetId:n.id,handle:i.transform};Craft.sendActionRequest("POST","assets/generate-transform",{data:t}).then((t=>{const e=t.data.url+`#asset:${n.id}:transform:${i.transform}`;c(e)})).catch((t=>{Craft.cp.displayError(Craft.t("tinymce","There was an error generating the transform URL."))}))}else c(`${n.url}#asset:${n.id}:url`)}))}_createEntry(t){return n(this,void 0,void 0,(function*(){const e={elementType:this._elementType,fieldId:this._settings.fieldId,ownerId:this._settings.elementId,siteId:this._settings.elementSiteId,typeId:t},i=yield Craft.sendActionRequest("POST","elements/create",{data:e}),n=i.data.element.id;return yield this._editEntry(n,i.data.element.siteId,{draftId:i.data.element.draftId,siteId:i.data.element.siteId,params:{fresh:1}})}))}_editEntry(t,e,i){var r,o;return n(this,void 0,void 0,(function*(){i=Object.assign(Object.assign({},i),{elementId:null!==(r=null!=t?t:null==i?void 0:i.elementId)&&void 0!==r?r:null,siteId:null!==(o=null!=e?e:null==i?void 0:i.siteId)&&void 0!==o?o:null}),Craft.createElementEditor(this._elementType,i).on("submit",(()=>n(this,void 0,void 0,(function*(){const i=this.editor.getBody().querySelector(`.craft-entry-card[data-entry-id="${t}"]`),n=null!==i;yield this._loadCardHtml(t,e,n);const r=this.editor.selection.getContent(),o=null!==i||r.length>0?"mceReplaceContent":"mceInsertContent";n&&this.editor.selection.select(i),this.editor.execCommand(o,!1,`<craft-entry data-entry-id="${t}"></craft-entry>`)}))))}))}_loadCardHtml(t,e,i=!1){return n(this,void 0,void 0,(function*(){if(i||void 0===this._cardHtml[t]){const i={entryId:t,siteId:e},n=yield Craft.sendActionRequest("POST","tinymce/input/entry-card-html",{data:i});this._cardHtml[t]=n.data.cardHtml}return this._cardHtml[t]}))}}},311:t=>{t.exports=jQuery}},e={};function i(n){var r=e[n];if(void 0!==r)return r.exports;var o=e[n]={exports:{}};return t[n].call(o.exports,o,o.exports,i),o.exports}(()=>{const t=i(575),e=[];window.TinyMCE={init:i=>{e.push(new t.TinyMCEField(i))},fields:()=>Array.from(e)}})()})();
//# sourceMappingURL=field.js.map