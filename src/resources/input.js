(()=>{"use strict";var t={144:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.TinyMCEField=void 0;const n=i(311),o=(t,e={})=>{let i;return()=>{void 0===i?i=Craft.createElementSelectorModal(t,Object.assign({resizable:!0,multiSelect:!1,disableOnSelect:!0},e)):i.show()}},r=(t,e,i,n,o)=>({title:t,body:{type:"panel",items:e},buttons:[{type:"cancel",name:"cancel",text:Craft.t("tinymce","Cancel")},{type:"submit",name:"submit",text:Craft.t("tinymce","Save"),buttonType:"primary"}],initialData:i,onChange:n,onSubmit:o});e.TinyMCEField=class{constructor(t){this._settings=t;const e=this._settings,i=Object.assign({skin:"craft",plugins:"autoresize lists link image code",content_css:!1,menubar:!1,statusbar:!1,toolbar:"undo redo | blocks | bold italic strikethrough | bullist numlist | insertLink insertImage | hr | code",contextmenu:"craftLink linkchecker craftImage table spellchecker configurepermanentpen",allow_conditional_comments:!1,element_format:"xhtml",entity_encoding:"raw",fix_list_elements:!0,relative_urls:!1,remove_script_host:!1,anchor_top:!1,anchor_bottom:!1,autoresize_bottom_margin:0},this._settings.editorConfig,{selector:`#${this._settings.id}`,language:this._settings.language,directionality:this._settings.direction,setup:t=>{this.editor=t,this._setup()},init_instance_callback:t=>{this.editor=t,this._init();const i=e.editorConfig.init_instance_callback;"function"==typeof i&&i.apply(this,arguments)}});tinymce.init(i).then((()=>{}),(()=>{}))}_commandHandleFromElementType(t){var e;return null===(e=t.split("\\").pop())||void 0===e?void 0:e.toLowerCase()}_setup(){const t=[],e=[],i=[{value:"",text:Craft.t("tinymce","No transform")}];i.push(...this._settings.transforms);for(const{elementType:i,optionTitle:n,sources:r}of this._settings.linkOptions){const s=this._commandHandleFromElementType(i),a=`${s}Link`,l=o(i,{sources:r,criteria:{locale:this._settings.locale},onSelect:([t])=>{const e=this.editor.selection.getContent();this.editor.windowManager.open(this._linkDialogConfig(n,!1,{url:`${t.url}#${s}:${t.id}@${this._settings.elementSiteId}:url`,text:e.length>0?e:String(t.label),site:this._settings.elementSiteId}))}});t.push({type:"menuitem",text:n,onAction:()=>l()}),this.editor.ui.registry.addMenuItem(a,{icon:"link",text:n,onAction:()=>l()}),e.push(a)}t.push({type:"menuitem",text:Craft.t("tinymce","Insert/edit link"),onAction:()=>this.editor.execCommand("mceLink")}),this.editor.ui.registry.addMenuButton("insertLink",{icon:"link",tooltip:Craft.t("tinymce","Link"),fetch:e=>e(t)});const n=Craft.t("tinymce","Edit link");this.editor.ui.registry.addMenuItem("editLink",{icon:"link",text:n,onAction:t=>{var e,i,o;const r=this.editor.dom.getParent(this.editor.selection.getStart(),"a[href]"),s=null!==(e=null==r?void 0:r.getAttribute("href"))&&void 0!==e?e:"",a=s.match(/@([0-9]+)(:url)$/);this.editor.selection.select(r),this.editor.windowManager.open(this._linkDialogConfig(n,!0,{url:s,text:null!==(i=null==r?void 0:r.textContent)&&void 0!==i?i:"",newTab:"_blank"===(null!==(o=null==r?void 0:r.getAttribute("target"))&&void 0!==o?o:""),site:null!==a?a[1]:this._settings.elementSiteId}))}}),this.editor.ui.registry.addContextMenu("craftLink",{update:t=>{const i=this.editor.dom.getParents(t,"a");if(0===i.length)return`${e.join(" ")} link`;return(i.some((t=>t.href.endsWith(":url")))?"editLink":"link openlink")+" unlink"}});const r=Craft.t("tinymce","Insert an image");this.editor.ui.registry.addButton("insertImage",{icon:"image",tooltip:r,onAction:()=>o("craft\\elements\\Asset",{sources:this._settings.volumes,transforms:this._settings.transforms.map((t=>({handle:t.value,name:t.text}))),storageKey:"RichTextFieldType.ChooseImage",criteria:{locale:this._settings.locale,kind:"image"},onSelect:([t],e=null)=>{this.editor.windowManager.open(this._imageDialogConfig(r,!0,i,t,{transform:null!=e?e:this._settings.defaultTransform}))}})()});const s=Craft.t("tinymce","Edit image");this.editor.ui.registry.addMenuItem("editImage",{icon:"image",text:s,onAction:t=>{var e,n,o,r,a,l,c,d;const m=this.editor.selection.getStart(),u=this.editor.dom.getParent(m,"img"),g=this.editor.dom.getParent(u,"a"),h=this.editor.dom.getParent(null!=g?g:u,"figure"),p=(null!=g?g:u).nextSibling,f=null==u?void 0:u.getAttribute("src"),y=null!==(e=null==f?void 0:f.match(/:transform:(.+)$/))&&void 0!==e?e:[],b=y.length>0?y.pop():"",_=(null==f?void 0:f.match(/#asset:([0-9]+)/)).pop(),C=null===(r=null===(o=null===(n=""!==b?null==f?void 0:f.replace(`/_${b}/`,"/"):f)||void 0===n?void 0:n.replace(`:transform:${b}`,""))||void 0===o?void 0:o.replace(/:url$/,""))||void 0===r?void 0:r.replace(`#asset:${_}`,"");this.editor.selection.select(h),this.editor.windowManager.open(this._imageDialogConfig(s,!0,i,{id:_,url:C,label:""},{title:null!==(a=null==u?void 0:u.getAttribute("alt"))&&void 0!==a?a:"",caption:null!==(l=null==p?void 0:p.textContent)&&void 0!==l?l:"",link:null!==(c=null==g?void 0:g.href)&&void 0!==c?c:"",newTab:null!==(d="_blank"===(null==g?void 0:g.target))&&void 0!==d&&d,transform:b}))}}),this.editor.ui.registry.addContextMenu("craftImage",{update:t=>{const e=this.editor.dom.getParents(t,"figure, img");if(0===e.length)return"";return e.some((t=>"FIGURE"===t.tagName))?"editImage":"image"}}),this.editor.on("ScriptsLoaded",(()=>{tinymce.addI18n(this._settings.language,this._settings.translations)}))}_init(){const t=n(this.editor.container),e=n(this.editor.formElement);this.editor.on("focus",(e=>t.addClass("mce-focused"))),this.editor.on("blur",(e=>t.removeClass("mce-focused")));const i=e.data("elementEditor");new window.MutationObserver((()=>{n(this.editor.targetElm).val(this.editor.getContent());(i.isFullPage?Garnish.$bod:e).trigger("change")})).observe(this.editor.getBody(),{characterData:!0,childList:!0,subtree:!0}),this.editor.addShortcut("meta+s","",(()=>Garnish.uiLayerManager.triggerShortcut(new KeyboardEvent("keydown",{shiftKey:!1,metaKey:!0,ctrlKey:!0,altKey:!1,keyCode:Garnish.S_KEY})))),this.editor.addShortcut("shift+meta+s","",(()=>Garnish.uiLayerManager.triggerShortcut(new KeyboardEvent("keydown",{shiftKey:!0,metaKey:!0,ctrlKey:!0,altKey:!1,keyCode:Garnish.S_KEY}))))}_linkDialogConfig(t,e,i){const n=this.editor.selection.getContent();return r(t,[{type:"input",name:"url",label:Craft.t("tinymce","URL"),enabled:!1},{type:"input",name:"text",label:Craft.t("tinymce","Text")},{type:"checkbox",name:"newTab",label:Craft.t("tinymce","Open in new tab?")},{type:"selectbox",name:"site",label:Craft.t("tinymce","Site"),items:this._settings.allSites}],i,(t=>{const e=t.getData();t.setData({url:e.url.replace(/@([0-9]+)(:url)$/,`@${e.site}:url`)})}),(t=>{const i=t.getData(),o=e||n.length>0?"mceReplaceContent":"mceInsertContent",r=`<a href="${i.url}" title="${i.text}"${i.newTab?' target="_blank"':""}>${i.text}</a>`;this.editor.execCommand(o,!1,r),t.close()}))}_imageDialogConfig(t,e,i,n,o){const s=this.editor.selection.getContent();return r(t,[{type:"input",name:"title",label:Craft.t("tinymce","Title")},{type:"input",name:"caption",label:Craft.t("tinymce","Caption")},{type:"input",name:"link",label:Craft.t("tinymce","Link")},{type:"checkbox",name:"newTab",label:Craft.t("tinymce","Open in new tab?")},{type:"selectbox",name:"transform",label:Craft.t("tinymce","Transform"),items:i}],o,(()=>{}),(t=>{const i=t.getData(),o=e||s.length>0?"mceReplaceContent":"mceInsertContent",r=i.title.length>0,a=i.caption.length>0,l=i.link.length>0,c=""!==i.transform,d=e=>{const n=["<figure>",l?`<a href="${i.link}"${i.newTab?' target="_blank"':""}>`:"",`<img src="${e}"${r?`alt="${i.title}"`:""}>`,l?"</a>":"",a?`<figcaption>${i.caption}</figcaption>`:""].join("");this.editor.execCommand(o,!1,n),t.close()};if(c){const t={assetId:n.id,handle:i.transform};Craft.sendActionRequest("POST","assets/generate-transform",{data:t}).then((t=>{const e=t.data.url+`#asset:${n.id}:transform:${i.transform}`;d(e)})).catch((t=>{Craft.cp.displayError(Craft.t("tinymce","There was an error generating the transform URL."))}))}else d(`${n.url}#asset:${n.id}:url`)}))}}},311:t=>{t.exports=jQuery}},e={};function i(n){var o=e[n];if(void 0!==o)return o.exports;var r=e[n]={exports:{}};return t[n](r,r.exports,i),r.exports}(()=>{const t=i(144);window.initTinyMCE=e=>new t.TinyMCEField(e)})()})();
//# sourceMappingURL=input.js.map