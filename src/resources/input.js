!function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=void 0;return function(){n?n.show():n=u.default.createElementSelectorModal(t,Object.assign({resizable:!0,multiSelect:!1,disableOnSelect:!0},e))}}var i=function(){function t(t,e){var n=[],r=!0,o=!1,i=void 0;try{for(var a,l=t[Symbol.iterator]();!(r=(a=l.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{!r&&l.return&&l.return()}finally{if(o)throw i}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),a=n(1),l=r(a),c=n(2),u=r(c),s=n(3),f=r(s);window.initTinyMCE=function(t){function e(e){var n=!0,r=!1,a=void 0;try{for(var l,c=t.linkOptions[Symbol.iterator]();!(n=(l=c.next()).done);n=!0){var u=l.value,s=u.elementType,f=u.optionTitle,d=u.sources;!function(n,r,a){var l=n.replace(/^\w|_\w/g,function(t){return t.toLowerCase()}),c=l+"Link",u=o(n,{sources:a,criteria:{locale:t.locale},onSelect:function(t){var n=i(t,1),r=n[0],o=e.selection.getContent(),a=r.url+"#"+l+":"+r.id,c=r.label,u=o||r.label,s=o?"mceReplaceContent":"mceInsertContent";e.execCommand(s,!1,'<a href="'+a+'" title="'+c+'">'+u+"</a>")}});e.addButton(c,{icon:"link",storageKey:"tinymce."+c,tooltip:r,onclick:function(){return u()}})}(s,f,d)}}catch(t){r=!0,a=t}finally{try{!n&&c.return&&c.return()}finally{if(r)throw a}}var m=!0,y=!1,p=void 0;try{for(var v,g=t.mediaOptions[Symbol.iterator]();!(m=(v=g.next()).done);m=!0){var h=v.value,s=h.elementType,f=h.optionTitle,d=h.sources;!function(n,r,a){var l=n.replace(/^\w|_\w/g,function(t){return t.toLowerCase()}),c=l+"Media",u=o(n,{sources:a,transforms:t.transforms,storageKey:"RichTextFieldType.ChooseImage",criteria:{locale:t.locale,kind:"image"},onSelect:function(t){var n=i(t,1),r=n[0],o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,a=e.selection.getContent(),c=r.url+"#"+l+":"+r.id+(o?":"+o:""),u=r.label,s=a?"mceReplaceContent":"mceInsertContent";e.execCommand(s,!1,'<img src="'+c+'" alt="'+u+'" width="" height="">')}});e.addButton(c,{icon:"image",storageKey:"tinymce."+c,tooltip:r,onclick:function(){return u()}})}(s,f,d)}}catch(t){y=!0,p=t}finally{try{!m&&g.return&&g.return()}finally{if(y)throw p}}}function n(t){var e=(0,l.default)(t.container);t.on("focus",function(t){return e.addClass("mce-focused")}),t.on("blur",function(t){return e.removeClass("mce-focused")})}var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};console.log(t),f.default.init(Object.assign({skin:"craft",plugins:"autoresize hr lists link image code",menubar:!1,statusbar:!1,toolbar:"formatselect | bold italic strikethrough | bullist numlist | link entryLink assetLink | image assetMedia | hr | code",allow_conditional_comments:!1,element_format:"html",fix_list_elements:!0,relative_urls:!1,remove_script_host:!1,anchor_top:!1,anchor_bottom:!1,autoresize_bottom_margin:0},r,{selector:"#"+t.id,language:t.language,directionality:t.direction,setup:e,init_instance_callback:function(t){n(t);var e=r.init_instance_callback;"function"==typeof e&&e.apply(this,arguments)}}))}},function(t,e){t.exports=jQuery},function(t,e){t.exports=Craft},function(t,e){t.exports=tinymce}]);
//# sourceMappingURL=input.js.map