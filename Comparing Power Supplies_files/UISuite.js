window.lpTag=window.lpTag||{},lpTag.taglets=lpTag.taglets||{},lpTag.taglets.lpAnimate={_V:"1.2",name:"lpAnimate",elements:{},queue:{},conf:{interval:13,duration:500,easing:"swing"},init:function(a){if(a)for(var b=0;b<a.length;b++)this.conf[a[b].id]=a[b].value},_supported:{opacity:function(){var a=document.createElement("div");a.style.cssText="opacity:.1";var b=/^0.1/.test(a.style.opacity);return b}()},_regExp:{alphaFilter:new RegExp("alpha\\([^)]*\\)","i"),opacityInAlphaFilter:new RegExp("opacity=([^)]*)")},_cssPropHooks:{opacity:{get:function(a){if(this._supported.opacity)return parseFloat(a.style.opacity);var b=this._regExp.opacityInAlphaFilter.test(a.style.filter),c=b?.01*parseFloat(RegExp.$1):null;return c},set:function(a,b){if(this._supported.opacity)a.style.opacity=b;else{var c=a.style.filter||"",d="alpha(opacity="+100*b+")",e=this._regExp.alphaFilter.test(c),f=e?c.replace(this._regExp.alphaFilter,d):c+" "+d;a.style.filter=f}}}},_cssNumber:{zIndex:!0,fontWeight:!0,opacity:!0,zoom:!0,lineHeight:!0,color:!0},_easing:{linear:function(a,b,c,d,e){return c+d*a},swing:function(a,b,c,d,e){return(-Math.cos(a*Math.PI)/2+.5)*d+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeOutBack:function(a,b,c,d,e,f){return"undefined"==typeof f&&(f=1.70158),d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInBack:function(a,b,c,d,e,f){return"undefined"==typeof f&&(f=1.70158),d*(b/=e)*b*((f+1)*b-f)+c}},animate:function(a,b,c){if("undefined"!=typeof a&&"undefined"!=typeof b&&a&&""!==a.id)if("undefined"==typeof this.elements[a.id]){"undefined"==typeof b.length&&(b=[b]),"number"==typeof c&&(c={duration:c});var d=a.id,e=this;this.elements[d]={id:d,domElement:a,props:b,options:{duration:c&&c.duration?c.duration:e.conf.duration,easing:c&&c.easing?c.easing:e.conf.easing,callback:c&&"function"==typeof c.callback?c.callback:null,context:c.context||window}},this._doAnimate(d)}else{var f={domElement:a,props:b,options:c};this._addToQueue(a.id,f)}},stop:function(a){var b=this.elements[a];"undefined"!=typeof b&&(null!=b.timeout&&clearTimeout(b.timeout),b.timeout=null,delete this.elements[a]),this._removeFromQueue(a)},isNumeric:function(a){return"undefined"!=typeof lpTag.taglets.utils?lpTag.taglets.utils.isNumeric(a):!1},_doAnimate:function(a){var b=this.elements[a];b.startTime=(new Date).getTime(),b.relTime=b.relPos=0,b.timeout=null;for(var c=0;c<b.props.length;c++){var d=b.props[c];d.start=this._getCurrentVal(b.domElement,d.name)||0,d.now=d.start}this._step(b.id)},_step:function(a){var b,c,d=this.elements[a],e=(new Date).getTime();if(e>=d.startTime+d.options.duration){for(d.relPos=d.relTime=1,c=0;c<d.props.length;c++)b=d.props[c],b.now=b.targetVal,this._update(d.domElement,b.name,b.now);this._complete(d)}else{var f=e-d.startTime;for(d.relTime=f/d.options.duration,d.relPos=this._easing[d.options.easing](d.relTime,f,0,1,d.options.duration),c=0;c<d.props.length;c++)b=d.props[c],b.now=b.start+(b.targetVal-b.start)*d.relPos,this._update(d.domElement,b.name,b.now);var g=this;d.timeout=setTimeout(function(){g._step(a)},g.conf.interval)}},_update:function(a,b,c){"undefined"!=typeof this._cssPropHooks[b]?this._cssPropHooks[b].set.call(this,a,c):a.style&&null!=a.style[b]&&(this.isNumeric(c)&&!this._cssNumber[b]&&(c+="px"),a.style[b]=c)},_getCurrentVal:function(a,b){return"undefined"!=typeof this._cssPropHooks[b]?this._cssPropHooks[b].get.call(this,a):a.style&&null!=a.style[b]?parseFloat(a.style[b]):void 0},_complete:function(a){var b=a.id,c=null;if(null!=a.options.callback&&"function"==typeof a.options.callback&&(c=a.options.callback),null!=a.timeout&&clearTimeout(a.timeout),a.timeout=null,delete this.elements[b],null!=c)try{c.call(a.options.context,b)}catch(d){}if("undefined"!=typeof this.queue[b]&&null!=this.queue[b])if(this.queue[b].length>0){var e=this.queue[b].splice(0,1);this.animate(e[0].domElement,e[0].props,e[0].options)}else this._removeFromQueue(b)},_addToQueue:function(a,b){"undefined"==typeof this.queue[a]&&(this.queue[a]=[]),this.queue[a].push(b)},_removeFromQueue:function(a){"undefined"!=typeof this.queue[a]&&null!=this.queue[a]&&delete this.queue[a]}},window.lpTag=window.lpTag||{},lpTag.taglets=lpTag.taglets||{},lpTag.taglets.lpJsonToDom=function(){function a(a,c,d,e,f){var g=document.createElement(a);e.isSubContainer="undefined"==typeof e.isSubContainer?!1:e.isSubContainer,f||(f=r(c)),d=d||e.attrs,b(g,e,d,c,f,a);var h=s(c,e);return""!==h&&(g.className=h),u(g,e.css,c),g}function b(a,b,c,d,e,f){c=c||{},c.id=e,"img"===f&&(b.alt?c.alt=b.alt:c.alt="");for(var g in c)c.hasOwnProperty(g)&&a.setAttribute(g,c[g])}function c(a){a=i(a),a=h(a);var b=q(a);return w(b)}function d(a,b,c,d){y=c;var h=[];if("undefined"==typeof a||null==a)throw lpTag.log("lpJsonToDom, invalid jsons","ERROR","JSON2DOM"),new Error("invalid data exception");for(var i in a){var j=a[i];if("undefined"==typeof j||null==j)throw lpTag.log("lpJsonToDom, bad value","ERROR","JSON2DOM"),new Error("invalid data exception");"undefined"==typeof j.length&&(j=[j]);for(var k=0;k<j.length;k++){var l=F[i];if("function"!=typeof l)throw lpTag.log("lpJsonToDom, no converter for type "+i,"ERROR","JSON2DOM"),new Error("invalid data exception");var m=j[k],n=l(m,b);n[C.ORDER]=e(j[k],i),g(n,m,d),h.push(n)}}return h=h.sort(f)}function e(a,b){return"closeButtons"===b?D+2:void 0===a.order?D+1:a.order}function f(a,b){var c=a[C.ORDER],d=b[C.ORDER];return c>d?1:d>c?-1:0}function g(a,b,c){if(c){var d,e=b.events;if("undefined"!=typeof e&&null!=e&&"object"==typeof e&&lpTag.taglets.utils)for(var f in e)d=c[e[f]],d&&lpTag.taglets.utils.attachEvent(a,f,d.callback,d.context)}}function h(a){return a.replace(/\r\n|\r|\n/g,"<br \n/>")}function i(a){var b,c,d=[];if("undefined"==typeof y)return a;if("undefined"==typeof y.length)return a;for(var e=0;e<A.length;e++)b=new RegExp("{{"+A[e]+"\\-\\d+}}","g"),c=a.match(b),null!==c&&(d=d.concat(c));if(null===d)return a;for(var f=0;f<d.length;f++)for(var g=0;g<y.length;g++)d[f].replace("{{","").replace("}}","")===y[g].id&&(a=a.replace(d[f],y[g].value));return a}function j(a,b){if("undefined"!=typeof a&&null!=a&&"object"==typeof b)for(var c in b)try{var d=b[c];"undefined"!=typeof d&&k(d)&&(p(d)&&!B[c]&&(d+="px"),m(c)&&null!==d&&""!==d&&(d=o(d)),l(a,c,d),a.style[c]=d)}catch(e){lpTag.log("lpJsonToDom, invalid css ["+c+"; e:"+e+"]","ERROR","JSON2DOM")}}function k(a){return p(a)||"string"==typeof a&&-1===a.toLowerCase().indexOf("javascript")&&-1===a.toLowerCase().indexOf("expression")}function l(a,b,c){switch(b){case"borderRadius":a.style.borderRadius=c,a.style.MozBorderRadius=c,a.style.WebkitBorderRadius=c;break;case"borderTopLeftRadius":a.style.MozBorderRadiusTopleft=c,a.style.WebkitBorderTopLeftRadius=c;break;case"borderTopRightRadius":a.style.MozBorderRadiusTopright=c,a.style.WebkitBorderTopRightRadius=c;break;case"borderBottomLeftRadius":a.style.MozBorderRadiusBottomleft=c,a.style.WebkitBorderBottomLeftRadius=c;break;case"borderBottomRightRadius":a.style.MozBorderRadiusBottomright=c,a.style.WebkitBorderBottomRightRadius=c;break;case"transform":a.style.MozTransform=c,a.style.WebkitTransform=c,a.style.msTransform=c;break;default:a.style[b]=c}}function m(a){return"backgroundImage"==a}function n(a){return"undefined"!=typeof lpTag.taglets.utils?lpTag.taglets.utils.extractBgImgUrl(a):a}function o(a){var b=n(a);return b='url("'+v(b)+'")'}function p(a){return"undefined"!=typeof lpTag.taglets.utils?lpTag.taglets.utils.isNumeric(a):!1}function q(a){var b,c="";if("undefined"!=typeof a&&null!=a)for(var d=0;d<a.length;d++)b=a.charCodeAt(d),c+=256>b?"&#x"+b.toString(16)+";":a[d];return c}function r(a){var b="LPM"+a+"-"+t()+"-"+E;return E++,b}function s(a,b){var c="undefined"==typeof b.isSubContainer?!1:b.isSubContainer,d="undefined"==typeof b.engagementType?"":b.engagementType,e="";return c||(e="LPM"+a,""!==d&&(e=e+" "+d)),e}function t(){return(new Date).getTime()}function u(a,b,c){j(a,z.base),j(a,z[c]),j(a,b)}function v(a){return"undefined"!=typeof lpTag.taglets.utils?lpTag.taglets.utils.checkHttps(a):void 0}function w(a){return a.replace(/&#x3c;&#x62;&#x72;&#x20;&#xa;&#x2f;&#x3e;/g,"<br/>")}function x(a){var b,c,d=a.attributes;if(d)for(b=d.length-1;b>=0;b-=1)c=d[b].name,"function"==typeof a[c]&&(a[c]=null);var e=a.childNodes;if(e)for(b=0;b<e.length;b+=1)x(a.childNodes[b])}var y,z={base:{margin:0,padding:0,borderTopStyle:"none",borderRightStyle:"none",borderBottomStyle:"none",borderLeftStyle:"none",borderTopWidth:0,borderRightWidth:0,borderBottomWidth:0,borderLeftWidth:0,fontStyle:"normal",fontWeight:"normal",fontVariant:"normal",listStylePosition:"outside",listStyleImage:"none",listStyleType:"none",letterSpacing:"normal",lineHeight:"normal",textDecoration:"none",verticalAlign:"baseline",whiteSpace:"normal",wordSpacing:"normal"},container:{backgroundRepeat:"repeat-x",backgroundPosition:"bottom left",borderStyle:"solid"},label:{position:"absolute"},heading:{position:"absolute"},image:{position:"absolute"},button:{position:"absolute",backgroundRepeat:"repeat-x",backgroundPosition:"bottom left",borderStyle:"solid",paddingTop:5,paddingBottom:5,paddingLeft:10,paddingRight:10,cursor:"pointer"},closeButton:{position:"absolute",cursor:"pointer"},peel:{},iframe:{},slideOutPin:{position:"absolute",cursor:"pointer"}},A=["LPMacro","searchkeywords","country","state","city"],B={zIndex:!0,fontWeight:!0,opacity:!0,zoom:!0,lineHeight:!0,color:!0},C={ORDER:"lpOrder"},D=1e4,E=0,F={text:function(b,d){var e=a("div",d,null,b,null);return e.innerHTML=c(b.text),e},heading:function(b){var d=a("h"+b.heading,"heading",null,b,null);return d.innerHTML=c(b.text),d},containers:function(b){return a("div","container",null,b,null)},labels:function(a){return"number"==typeof a.heading&&a.heading>=1&&a.heading<=6?F.heading(a):F.text(a,"label")},images:function(b,c){if("undefined"==typeof b.imageUrl||null===b.imageUrl||""===b.imageUrl)throw lpTag.log("lpJsonToDom, bad imageUrl :"+b.imageUrl,"ERROR","JSON2DOM"),new Error("invalid data exception");"peel"!==c&&"closeButton"!==c&&"slideOutPin"!==c&&(c="image");var d=v(b.imageUrl),e={src:d};return a("img",c,e,b,null)},buttons:function(a){return a.isClickable=!0,F.text(a,"button")},closeButtons:function(a,b){a.isClickable=!0;var c=F.images(a,"closeButton");return c.setAttribute("data-LP-event","close"),c},peels:function(a){var b=F.containers(a),c=F.images(a,"peel");return b.appendChild(c),b},iframes:function(b){var c=r();return a("iframe","iframe",{name:c,frameBorder:0,height:b.css.height,width:b.css.width,scrolling:"no",marginheight:0,marginwidth:0,allowTransparency:!0},b,c)},slideOutPins:function(a){return delete a.alt,F.images(a,"slideOutPin")}};return{version:"1.4",name:"lpJsonToDom",init:function(){},convert:d,purge:x}}(),function(a){a.lpTag=a.lpTag||{},lpTag.taglets=lpTag.taglets||{};var b={SPACE:32,ENTER:13};lpTag.taglets.utils={_V:"1.3",name:"utils",init:function(){},checkHttps:function(a){return"https"==lpTag.protocol&&0!==a.indexOf("https")&&(a="https"+a.substr(4)),a},makeScriptCall:function(a,b){a=this.checkHttps(a);var c=document.createElement("script");c.setAttribute("type","text/javascript"),c.setAttribute("charset",b?b:"UTF-8"),c.setAttribute("src",a);var d=document.getElementsByTagName("head");d&&d.item(0).appendChild(c)},makeImgCall:function(a){a=this.checkHttps(a);var b=new Image;return b.src=a,b},decodeUri:function(a){try{return decodeURIComponent(a)}catch(b){return lpTag.log("err decoding string: "+a+"["+b+"]","ERROR","utils"),a}},isEmptyObj:function(a){for(var b in a)return!1;return!0},arrToObject:function(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=a[c];return b},preloadImages:function(a,b){function c(a){return function(){if(lpTag.log("error preloading image: "+a,"ERROR","utils"),!j){j=!0;try{b(!1)}catch(c){lpTag.log("error in preload callback ["+c+"]","ERROR","utils")}}}}function d(a){return function(){if(delete g[a],this.onload=null,i[a]={width:this.width,height:this.height},k.isEmptyObj(g)&&!j){j=!0,lpTag.log("preloading images complete","INFO","utils");try{b(!0,i)}catch(c){lpTag.log("error in preload callback ["+c+"]","ERROR","utils")}}}}var e,f,g=this.arrToObject(a),h=[],i={},j=!1,k=this;if(lpTag.log("preloading "+a.length+" images","INFO","utils"),this.isEmptyObj(g)){lpTag.log("no images to load. calling callback","INFO","utils");try{b(!0,i)}catch(l){lpTag.log("error in preload callback ["+l+"]","ERROR","utils")}}else for(e in g)-1!==e.toLowerCase().indexOf("javascript")||-1!==e.toLowerCase().indexOf("expression")?b(!1):(h.push(new Image),f=h.length-1,h[f].onload=d(e),h[f].onerror=c(e),h[f].src=this.checkHttps(e))},stopEventBubble:function(b){var c=b||a.event;c&&(c.cancelBubble=!0,c.stopPropagation&&c.stopPropagation())},geObjById:function(a){return document.getElementById?document.getElementById(a):document.all?document.all(a):!1},isIE:function(){var a=navigator.userAgent;a=a.toLowerCase();var b=/(msie) ([\w.]+)/,c=b.exec(a);return null!=c},isIE6:function(){var a=navigator.userAgent;a=a.toLowerCase();var b=/(msie) ([\w.]+)/,c=b.exec(a);if(null!=c){var d=parseInt(c[2],10);if(6==d)return!0}return!1},waitForDocumentBody:function(b,c,d){if(d=d||0,lpTag.log("in waitForDocumentBody......","INFO",this.name),document.body)b.call(c||a);else{var e=this;400>d?setTimeout(function(){d++,lpTag.log("Waiting for document.body. try: ("+d+"), time: ("+(new Date).getTime()+")","DEBUG",this.name),e.waitForDocumentBody(b,c,d)},50):lpTag.log("call callback on waitForDocumentBody failed. document.body not exist ","ERROR",this.name)}},isQuirksMode:function(){return document.documentMode&&5==document.documentMode||"BackCompat"==document.compatMode?(lpTag.log("Quirks Mode == true","DEBUG","utils"),!0):(lpTag.log("Quirks Mode == false","DEBUG","utils"),!1)},getPageDimensions:function(){for(var b={totalHeight:null,totalWidth:null,windowHeight:null,windowWidth:null,verticalScroll:null,horizontalScroll:null},c=["Height","Width"],d=0;d<c.length;d++){var e=c[d];b["total"+e]=Math.max(document.documentElement["client"+e],document.body["scroll"+e],document.documentElement["scroll"+e],document.body["offset"+e],document.documentElement["offset"+e]),b["window"+e]="CSS1Compat"===a.document.compatMode&&a.document.documentElement["client"+e]||a.document.body["client"+e]||a.document.documentElement["client"+e]}return b.verticalScroll=document.documentElement&&document.documentElement.scrollTop||document.body&&document.body.scrollTop,b.horizontalScroll=document.documentElement&&document.documentElement.scrollLeft||document.body&&document.body.scrollLeft,b},appendToPage:function(b,c){return c=c||{},lpTag.log("in appendToPage......","DEBUG","utils"),"object"!=typeof b||"undefined"==typeof b.id?(lpTag.log("appendToPage:element not exist","ERROR","utils"),!1):null!=this.geObjById(b.id)?!1:(c.offerParent=c.offerParent||document.body,c.offerParent?(c.offerParent.appendChild(b),void(c.callback&&c.callback.call(c.context||a,b.id))):(lpTag.log("no parent exists - parent = "+c.offerParent,"DEBUG","utils"),!1))},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},replaceAll:function(a,b,c){return a.replace(new RegExp(b,"g"),c)},extractBgImgUrl:function(a){var b=/^url\(['"]?([^'"]*)['"]?\)$/i,c=b.test(a),d=c?RegExp.$1:a;return d},is_array:function(a){return a&&"object"==typeof a&&a.constructor===Array},cloneObject:function(a){var b={};if(a.constructor===Object)for(var c in a)a.hasOwnProperty(c)&&null!==a[c]&&void 0!==a[c]&&("object"==typeof a[c]&&a[c].constructor!==Array?b[c]=lpTag.taglets.utils.cloneObject(a[c]):a[c].constructor===Array?b[c]=a[c].slice(0)||[]:"function"!=typeof a[c]&&(b[c]=null!==a[c]&&void 0!==a[c]?a[c]:""));else a.constructor===Array?b=a.slice(0)||[]:"function"!=typeof a&&(b=a);return b},extendObj:function(a,b){a=a||{};for(var c in b)a[c]=b[c];return a},setTimeout:function(a,b,c){var d;return c>0&&"function"==typeof a&&(d=setTimeout(function(){a.call(b)},1e3*c)),d},clearTimeout:function(a){a&&clearTimeout(a)},getCdnGallery:function(a){return a=a.replace(/\{galleryBasePath\}/g,lpTag.protocol+"//"+lpTag.csds.getDomain("leCdnDomain")+"/gallery")},createDom:function(a,b){if(b&&"string"==typeof a){for(var c in b)a=a.replace("{{"+c+"}}",b[c]);var d=document.createElement("div");return d.innerHTML=a,d.firstChild}},isActivationKeyCode:function(a){return a===b.ENTER||a===b.SPACE},attachEvent:function(a,b,c,d){function e(a){try{c.call(f,a)}catch(b){lpTag.log("Error occur on attachEvent run callback","ERROR","utils")}}var f=d;a&&b&&"function"==typeof c&&(a.addEventListener?a.addEventListener(b,e,!1):a.attachEvent("on"+b,e))}}}(window),window.lpTag=window.lpTag||{},lpTag.taglets=lpTag.taglets||{},lpTag.taglets.baseOffer=function(){},function(a){function b(){return this.conf.channel===this.CHANNELS.CHAT}function c(a,b){var c=p(t.CLICK,a,b);n.call(this,c)}function d(){var a=C.LEGACY,c="external app";return b.call(this)&&(this.conf.windowConf=this.conf.windowConf||{},this.conf.windowConf.json=this.conf.windowConf.json||{},this.conf.windowConf.type===c&&this.conf.windowConf.json.externalConfiguration?a=C.CUSTOM:A&&"function"==typeof A.clicked&&(a=C.UNIFIED_WINDOW)),a}function e(){var a={};return b.call(this)?(a.env="",a.domain=lpTag.csds.getDomain(w.CHAT),a.params=y,a.target=(z+lpTag.site).replace(/[^a-z0-9]/gi,"_"),("hc1"===a.domain||"hc1.dev.lprnd.net"===a.domain)&&(a.domain="hc1.dev.lprnd.net",a.env="qa")):(a.params=x,a.target=k.call(this).target),a}function f(a,b,c,e,f){var i=d.call(this,b);C.CUSTOM===i?g.call(this,a,b,c,e):C.UNIFIED_WINDOW===i?h.call(this,a,b,c,e,f):l.call(this,a,b,c,e)}function g(a,b,d,e){var f=this,g={configuration:this.conf.windowConf.json.externalConfiguration,args:B.getClickObject(a,b,d),errorCallback:function(){f.errorLog("Error while opening an external channel")}};try{lpTag.taglets.lpUtil.runCallbackByObject(g.configuration,g.args,g.errorCallback),c.call(this,a,e)}catch(h){this.errorLog("Exception while opening an external channel: "+h.message)}}function h(a,b,d,e,f){f?A.startFlow(B.getClickObject(a,b,d)):(A.clicked(B.getClickObject(a,b,d)),c.call(this,a,e))}function i(a,b){lpTag.log(a+". offer: "+this.engData.tglName+". offerId="+this.offerId,b,s)}function j(a){var b=this.conf.displayInstances||[];return b[a]||{_isInvalid:!0}}function k(){var a={target:"",url:""},b=j.call(this,this.engData.state);return b._isInvalid?a:(b.events&&b.events.click&&b.events.click.enabled&&(a.target=b.events.click.target,a.url=b.events.click.url),a)}function l(a,d,e,f){var g=b.call(this)?m.call(this,a,d,e):k.call(this).url;switch(e.target){case"_self":c.call(this,a,f),g&&setTimeout(function(){window.location.href=g},50);break;case"_parent":case"_top":c.call(this,a,f),g&&window.open(g,e.target,e.params);break;default:g&&window.open(g,e.target?e.target:"_blank",e.params),c.call(this,this.engData,f)}}function m(a,b,c){var d="https://"+c.domain+"/hcp/lewindow/index.html?lpNumber="+lpTag.site+"&site="+lpTag.site+"&domain="+c.domain;return c.env&&(d+="&env="+c.env),d=lpTag.taglets.lp_monitoringSDK.appendCtx(d),d+="&scid="+encodeURIComponent(a.contextId),d+="&cid="+encodeURIComponent(a.campaignId),d+="&eid="+encodeURIComponent(a.engagementId),b.skillName&&(d+="&skill="+encodeURIComponent(b.skillName)),b.windowId&&(d+="&lewid="+encodeURIComponent(b.windowId)),b.language&&(d+="&lang="+encodeURIComponent(b.language)),d}function n(a,b){lpTag.sdes&&"function"==typeof lpTag.sdes.send&&a&&(b?lpTag.sdes.push(a):lpTag.sdes.send(a),this.infoLog("Sent SMT event: "+a.type+", campaignID: "+a.campaign+", engagementId: "+a.engId))}function o(a,b,c){var d,e=[],f=q(a,b);if(c){if(f.expanded=c.expanded,f.userInit=c.userInit===!1?!1:!0,Array.isArray(c.actionableItems))for(var g=0;g<c.actionableItems.length;g++)d=c.actionableItems[g],(d.id||d.type||d.description)&&e.push({id:d.id||"",itemType:D[d.type]?d.type:"",name:d.description});f.actionableItems=e}return f}function p(a,b,c){var d=q(a,b);return c&&(d.actionableItem={id:c.id||"",itemType:D[c.type]?c.type:"",name:c.description||"",searchWord:c.searchKeywords||""}),d}function q(a,b){return b&&a?{type:a,campaign:b.campaignId,engId:b.engagementId,revision:b.engagementRevision,eContext:[{type:"engagementContext",id:b.contextId}]}:null}var r="prototype",s="baseOffer",t={IMPRESSION:"impDisplay",EXPANDED:"impExpanded",CLOSED:"impClose",TIMEOUT:"impTimeout",CLICK:"impAccept"},u="LP_OFFERS",v={IMPRESSION:"OFFER_IMPRESSION",EXPANDED:"OFFER_EXPANDED",CLOSED:"OFFER_CLOSED",TIMEOUT:"OFFER_TIMEOUT",CLICK:"OFFER_CLICK",ERROR:"OFFER_ERROR"},w={CHAT:"adminArea",ACCDN:"acCdnDomain",LPCDN:"leCdnDomain"},x="menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes",y="height=650,width=330,menubar=no,resizable=no",z="LiveEngageChat_",A=lpTag.taglets.lpUnifiedWindow,B=lpTag.taglets.rendererStub,C={UNIFIED_WINDOW:0,CUSTOM:1,LEGACY:2},D={LINK:1,BUTTON:2,SEARCH_KEYWORD:3};a[r].CHANNELS={CHAT:1,CONTENT:100},a[r].init=function(a,b){this.offerId=a&&a.engagementId,this.engData=a,this.conf=b},a[r].onImpression=function(){n.call(this,q(t.IMPRESSION,this.engData)),this.trigger(v.IMPRESSION)},a[r].onTimeout=function(){n.call(this,q(t.TIMEOUT,this.engData)),this.trigger(v.TIMEOUT)},a[r].onClose=function(){n.call(this,q(t.CLOSED,this.engData)),this.trigger(v.CLOSED)},a[r].onError=function(){this.trigger(v.ERROR)},a[r].onClick=function(a){c.call(this,this.engData,a),this.trigger(v.CLICK,!0)},a[r].click=function(a){this.trigger(v.CLICK,!0),f.call(this,this.engData,this.conf,e.call(this),a)},a[r].startChat=function(){f.call(this,this.engData,this.conf,e.call(this),null,!0)},a[r].onExpanded=function(a){n.call(this,o(t.EXPANDED,this.engData,a)),this.trigger(v.EXPANDED)},a[r].trigger=function(a,b){lpTag.events.trigger({appName:u,eventName:a,data:this.engData,aSync:b||!1}),this.infoLog("Trigger event: app="+u+", name="+s)},a[r].bind=function(a,b){return lpTag.events.bind({appName:u,eventName:a,func:b,context:this})},a[r].infoLog=function(a){i.call(this,a,"INFO")},a[r].errorLog=function(a){i.call(this,a,"ERROR")},a[r].debugLog=function(a){i.call(this,a,"DEBUG")}}(lpTag.taglets.baseOffer),window.lpTag=window.lpTag||{},lpTag.taglets=lpTag.taglets||{},function(){function a(a,b){a&&b&&this.init(a,b)}function b(){function b(a){return t.isActivationKeyCode(a.keyCode)}function c(a){return a.setAttribute("role","button"),a.setAttribute("tabindex","0"),a}function d(a,b,c,d){return function(e,f){try{e?(a.imgData=f,b.call(d)):(c.call(d),d.errorLog("failed loading images for offer"))}catch(g){d.errorLog("Failed to run callbacks on images load")}}}function e(a){return a.charAt(0).toUpperCase()+a.slice(1)}function f(a){if(a)for(var b=0;b<a.length;b++)null!=a[b]&&lpTag.events.unbind(a[b])}function g(a){var b=[];h(a,b);for(var c in a.elements)for(var d=a.elements[c]||[],e=0;e<d.length;e++)i(d[e],b);return b}function h(a,b){a.background&&a.background.image&&(a.background.image=j(a.background.image,!0),b.push(a.background.image))}function i(a,b){a.css&&a.css.backgroundImage&&(a.css.backgroundImage=j(a.css.backgroundImage,!0),b.push(a.css.backgroundImage)),a.imageUrl&&(a.imageUrl=j(a.imageUrl),b.push(a.imageUrl))}function j(a,b){return a?(a=t.getCdnGallery(a),b?t.extractBgImgUrl(a):a):void 0}function k(a){return a=a||{},a.images=a.images||[],a.labels=a.labels||[],a.buttons=a.buttons||[],a.closeButtons=a.closeButtons||[],a}function l(a,b,c){c.errorLog("Invalid data ["+a+"] for state  ["+b.type+"]"),b._isInvalid=!0}function m(a){return a.conf.renderingType===p}var n=a,o="prototype",p=1,q={0:"peeling",1:"overlay",2:"toaster",3:"slider",5:"overlay",6:"overlay"},r={0:!0,1:!0,2:!0,3:!1,5:!1,6:!1},s={HIDE:"HIDE",START:"START",ON_HIDE:"OFFER_HIDE",ON_DISPLAY:"OFFER_DISPLAY",ON_CLOSE:"OFFER_CLOSED",ON_REMOVE:"OFFER_REMOVE",DECLINED:"OFFER_DECLINED"},t=lpTag.taglets.utils,u=107158,v={0:{horizontal:"custom",vertical:"custom"},1:{horizontal:"left",vertical:"top"},2:{horizontal:"center",vertical:"top"},3:{horizontal:"right",vertical:"top"},4:{horizontal:"left",vertical:"middle"},5:{horizontal:"center",vertical:"middle"},6:{horizontal:"right",vertical:"middle"},7:{horizontal:"left",vertical:"bottom"},8:{horizontal:"center",vertical:"bottom"},9:{horizontal:"right",vertical:"bottom"},10:{horizontal:"left",vertical:"top"},11:{horizontal:"left",vertical:"bottom"}};"function"==typeof lpTag.taglets.baseOffer&&n[o].extended!==!0&&(n[o]=new lpTag.taglets.baseOffer,n[o].extended=!0,n[o].constructor=n,n[o].init=function(a,b){this.eventIds=[],this.engData=a,this.engData.engagementName=b.name,this.conf=b,this.states=this.getStates(b.displayInstances),this.activeState=this.getState(this.engData.state,this.states)},n[o].run=function(){this.debugLog("in run......"),this._isInvalid||this.activeState._isInvalid?this.errorLog("Invalid data, exiting _startRunning"):(this.trigger(s.START),t.waitForDocumentBody(this.onBodyLoad,this))},n[o].onBodyLoad=function(){if(n=n||window,1!==this.conf.renderingType){var a=g(this.activeState);this.preloadImages(a,this.startRendering,this.onError)}else this.startRendering()},n[o].preloadImages=function(a,b,c){t.preloadImages(a,d(this.activeState,b,c,this))},n[o].startRendering=function(){this.bindCommonEvents(),this.createOffer()},n[o].createOffer=function(){},n[o].getEngagementTypeName=function(a){return q[a]||""},n[o].convertJsonToDom=function(a,b){return lpTag.taglets.lpJsonToDom.convert(a,this.offerId,this.engData.macros,b)},n[o].appendToPage=function(a,b,d){return this.conf&&!this.conf.accessible&&c(b),t.appendToPage(b,{callback:a,context:this,offerParent:d||document.body})},n[o].show=function(){var a=this.getObj(this.containerId);a&&a.style&&(a.style.display="block",this.trigger(s.ON_DISPLAY),this.infoLog("Offer displayed"))},n[o].hide=function(){var a=this.getObj(this.containerId);a&&a.style&&(a.style.display="none",this.trigger(s.ON_HIDE),this.infoLog("Offer hidden"))},n[o].remove=function(a){var b=this.getObj(this.containerId);if(b){try{lpTag.taglets.lpJsonToDom.purge(b),b.parentNode.removeChild(b)}catch(c){this.hide()}a=a||{},a.silent||this.trigger(s.ON_REMOVE)}f(this.activeState.events)},n[o].getObj=function(a){return document.getElementById(a)},n[o].setEngagementConf=function(a){this.debugLog("in setEngagementConf.."),this.conf.zIndex=u,this.offerId=a.id,this.location={},a.position&&(this.location=v[a.position.type]||{}),a.effects&&(this.conf.secondsToCollapseAfter=a.effects.secondsToCollapseAfter)},n[o].getState=function(a,b){for(var c=0;c<b.length;c++)if(b[c].type===a)return b[c];return{_isInvalid:!0}},n[o].getStates=function(a){a=a||[];for(var b=[],c=0;c<a.length;c++)b.push(this.getStateObj(a[c]));return b},n[o].getStateObj=function(a){var b={type:a.displayInstanceType},c=["background","size","border","elements"];if(a.presentation)if(1===this.conf.renderingType)a.presentation.html?b.html=a.presentation.html:l("html",b,this);else{for(var d=0;d<c.length;d++)a.presentation[c[d]]?b[c[d]]=a.presentation[c[d]]:l([c[d]],b,this);b.elements=k(b.elements)}else l("presentation",b,this);return b.click=a.events&&a.events.click||{enabled:!1},b},n[o].validateConf=function(a,b){for(var c=0;c<b.length;c++)a[b[c]]||this.setInvalid(a[b])},n[o].extractCssProps=function(a,b,c){c=c||{};for(var d,f=0;f<b.length;f++){d=a[b[f]]||{};for(var g in d)d[g]&&(c[b[f]+e(g)]=d[g])}return a.size&&(c.width=a.size.width,c.height=a.size.height),c.cursor=a.click&&(m(this)?"auto":"pointer"),c},n[o].setInvalid=function(a){this.errorLog("Invalid data ["+a+"]"),this._isInvalid=!0},n[o].bindCommonEvents=function(){if("function"==typeof this.cleanupOffer&&this.conf.channel===this.CHANNELS.CHAT&&!this.parentContainer){var a=this.bind(s.HIDE,this.cleanupOffer);this.eventIds.push(a)}},n[o].cleanupOffer=function(){this.errorLog("cleanupOffer must be implemented")},n[o].extendObj=t.extendObj,n[o].addElements=function(a,b){this.appendJson(a,b);var c=a.querySelector('[data-LP-event="close"]');return c&&this.setCloseEvents(c),a},n[o].appendJson=function(a,b){var c;if(a&&a.appendChild){c=this.convertJsonToDom(b)||[];for(var d=0;d<c.length;d++)a.appendChild(c[d])}return a},n[o].setEngagementClickEvent=function(a,b,c){var d=!!this.engData&&(this.channel===this.CHANNELS.CHAT?!!this.engData.contextId:!0);a&&d&&this.setClickEvent(a,b,c)},n[o].setClickEvent=function(a,b,c){t.attachEvent(a,"click",b,c),t.attachEvent(a,"keyup",function(a){"undefined"!=typeof a&&a.stopPropagation(),t.isActivationKeyCode(a.keyCode)&&b.call(c,a)},c)},n[o].setCloseEvents=function(a){a&&(t.attachEvent(a,"click",this.onOfferClosed,this),t.attachEvent(a,"keyup",function(a){b(a)&&this.onOfferClosed(a)},this))},n[o].onOfferClosed=function(a){this.closeOffer(a),this.trigger(s.DECLINED,!0),t.stopEventBubble(a)},n[o].closeOffer=function(a){},n[o].setTimeout=function(a){"undefined"!=typeof this.conf.type&&r[this.conf.type]&&(this.offerTimeoutId=t.setTimeout(a,this,this.conf.secondsToCollapseAfter))},n[o].setContextId=function(a){"undefined"!=typeof a&&(this.engData.contextId=a)},n[o].extended=!0,n[o].createAccessibleContainer=function(a){var b,d=lpTag.taglets.lpJsonToDom.convert({containers:[{css:{},isClickable:!0,isSubContainer:!0}]});t.is_array(d)&&d.length>0&&(b=d[0],b.style.width="100%",b.style.height="100%",b=c(b),a.appendChild(b))},n[o].repositionCloseBtn=function(a){var b=a.firstChild.getElementsByClassName("LPMcloseButton")[0];b&&(b=c(b),a.appendChild(a.firstChild.removeChild(b)))})}lpTag.taglets.baseUIOffer=function(){function c(){}function d(c,d){return b(),new a(c,d)}var e="0.1",f="baseUIOffer";return{v:e,name:f,init:c,createInstance:d}}()}();