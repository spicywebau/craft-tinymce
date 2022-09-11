(()=>{"use strict";var t={144:(t,e,n)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.TinyMCEField=void 0;const i=n(311),a=(t,e={})=>{let n;return()=>{void 0===n?n=Craft.createElementSelectorModal(t,Object.assign({resizable:!0,multiSelect:!1,disableOnSelect:!0},e)):n.show()}},s=(t,e,n,i,a)=>({title:t,body:{type:"panel",items:e},buttons:[{type:"cancel",name:"cancel",text:Craft.t("tinymce","Cancel")},{type:"submit",name:"submit",text:Craft.t("tinymce","Save"),buttonType:"primary"}],initialData:n,onChange:i,onSubmit:a});e.TinyMCEField=class{constructor(t){this._settings=t;const e=this._init.bind(this),n=this._setup.bind(this),i=this._settings,a=Object.assign({skin:"craft",plugins:"autoresize lists link image code",content_css:!1,menubar:!1,statusbar:!1,toolbar:"undo redo | blocks | bold italic strikethrough | bullist numlist | insertLink insertImage | hr | code",allow_conditional_comments:!1,element_format:"html",fix_list_elements:!0,relative_urls:!1,remove_script_host:!1,anchor_top:!1,anchor_bottom:!1,autoresize_bottom_margin:0},this._settings.editorConfig,{selector:`#${this._settings.id}`,language:this._settings.language,directionality:this._settings.direction,setup:n,init_instance_callback(t){e(t);const n=i.editorConfig.init_instance_callback;"function"==typeof n&&n.apply(this,arguments)}});tinymce.init(a).then((()=>{}),(()=>{}))}_commandHandleFromElementType(t){var e;return null===(e=t.split("\\").pop())||void 0===e?void 0:e.toLowerCase()}_setup(t){const e=[{type:"menuitem",text:Craft.t("tinymce","Insert/edit link"),onAction:()=>t.execCommand("mceLink")}];for(const{elementType:n,optionTitle:i,sources:o}of this._settings.linkOptions){const r=this._commandHandleFromElementType(n),l=a(n,{sources:o,criteria:{locale:this._settings.locale},onSelect:([e])=>{const n=t.selection.getContent();t.windowManager.open(s(i,[{type:"input",name:"url",label:Craft.t("tinymce","URL"),enabled:!1},{type:"input",name:"text",label:Craft.t("tinymce","Text")},{type:"checkbox",name:"newTab",label:Craft.t("tinymce","Open in new tab?")},{type:"selectbox",name:"site",label:Craft.t("tinymce","Site"),items:this._settings.allSites}],{url:`${e.url}#${r}:${e.id}@${this._settings.elementSiteId}`,text:n.length>0?n:String(e.label),site:this._settings.elementSiteId},(t=>{const e=t.getData();t.setData({url:e.url.replace(/@[0-9]+$/,`@${e.site}`)})}),(e=>{const i=e.getData(),a=n.length>0?"mceReplaceContent":"mceInsertContent",s=`<a href="${i.url}" title="${i.text}"${i.newTab?' target="_blank"':""}>${i.text}</a>`;t.execCommand(a,!1,s),e.close()})))}});e.push({type:"menuitem",text:i,onAction:()=>l()})}t.ui.registry.addMenuButton("insertLink",{icon:"link",tooltip:Craft.t("tinymce","Link"),fetch:t=>t(e)});const n=Craft.t("tinymce","Insert an image");t.ui.registry.addButton("insertImage",{icon:"image",tooltip:n,onAction:()=>a("craft\\elements\\Asset",{sources:this._settings.volumes,transforms:this._settings.transforms.map((t=>({handle:t.value,name:t.text}))),storageKey:"RichTextFieldType.ChooseImage",criteria:{locale:this._settings.locale,kind:"image"},onSelect:([e],i=null)=>{const a=t.selection.getContent(),o=[{value:"",text:Craft.t("tinymce","No transform")}];o.push(...this._settings.transforms),t.windowManager.open(s(n,[{type:"input",name:"title",label:Craft.t("tinymce","Title")},{type:"input",name:"caption",label:Craft.t("tinymce","Caption")},{type:"input",name:"link",label:Craft.t("tinymce","Link")},{type:"checkbox",name:"newTab",label:Craft.t("tinymce","Open in new tab?")},{type:"selectbox",name:"transform",label:Craft.t("tinymce","Transform"),items:o}],{transform:null!=i?i:this._settings.defaultTransform},(()=>{}),(n=>{const i=n.getData(),s=a.length>0?"mceReplaceContent":"mceInsertContent",o=i.title.length>0,r=i.caption.length>0,l=i.link.length>0,c=""!==i.transform,m=[c?e.url.replace(/\/([^/]+)$/,`/_${i.transform}/$1`):e.url,`#asset:${e.id}`,c?`:transform:${i.transform}`:""].join(""),u=["<figure>",l?`<a href="${i.link}"${i.newTab?' target="_blank"':""}>`:"",`<img src="${m}"${o?`alt="${i.title}"`:""}>`,l?"</a>":"",r?`<figcaption>${i.caption}</figcaption>`:""].join("");t.execCommand(s,!1,u),n.close()})))}})()})}_init(t){const e=i(t.container),n=i(t.formElement);t.on("focus",(t=>e.addClass("mce-focused"))),t.on("blur",(t=>e.removeClass("mce-focused")));const a=n.data("elementEditor");new window.MutationObserver((()=>{i(t.targetElm).val(t.getContent());(a.isFullPage?Garnish.$bod:n).trigger("change")})).observe(t.getBody(),{characterData:!0,childList:!0,subtree:!0}),t.addShortcut("meta+s","",(()=>Garnish.uiLayerManager.triggerShortcut(new KeyboardEvent("keydown",{shiftKey:!1,metaKey:!0,ctrlKey:!0,altKey:!1,keyCode:Garnish.S_KEY})))),t.addShortcut("shift+meta+s","",(()=>Garnish.uiLayerManager.triggerShortcut(new KeyboardEvent("keydown",{shiftKey:!0,metaKey:!0,ctrlKey:!0,altKey:!1,keyCode:Garnish.S_KEY}))))}}},311:t=>{t.exports=jQuery}},e={};function n(i){var a=e[i];if(void 0!==a)return a.exports;var s=e[i]={exports:{}};return t[i](s,s.exports,n),s.exports}(()=>{const t=n(144);window.initTinyMCE=e=>new t.TinyMCEField(e)})()})();
//# sourceMappingURL=input.js.map