window.RichFaces=window.RichFaces||{};
RichFaces.jQuery=RichFaces.jQuery||window.jQuery;
(function($,rf){rf.RICH_CONTAINER="rf";
rf.EDITABLE_INPUT_SELECTOR=":not(:submit):not(:button):not(:image):input:visible:enabled";
rf.KEYS={BACKSPACE:8,TAB:9,RETURN:13,ESC:27,PAGEUP:33,PAGEDOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DEL:46};
if(window.jsf){var jsfAjaxRequest=jsf.ajax.request;
var jsfAjaxResponse=jsf.ajax.response
}rf.getDomElement=function(source){var type=typeof source;
var element;
if(source==null){element=null
}else{if(type=="string"){element=document.getElementById(source)
}else{if(type=="object"){if(source.nodeType){element=source
}else{if(source instanceof $){element=source.get(0)
}}}}}return element
};
rf.component=function(source){var element=rf.getDomElement(source);
if(element){return $(element).data("rf.widget")||(element[rf.RICH_CONTAINER]||{})["component"]
}};
rf.$=function(source){rf.log.warn("The function `RichFaces.$` has been deprecated and renamed to `RichFaces.component`.  Please adjust your usage accordingly.");
return rf.component.call(this,source)
};
$.extend($.expr[":"],{editable:function(element){return $(element).is(rf.EDITABLE_INPUT_SELECTOR)
}});
rf.$$=function(componentName,element){while(element.parentNode){var e=element[rf.RICH_CONTAINER];
if(e&&e.component&&e.component.name==componentName){return e.component
}else{element=element.parentNode
}}};
rf.findNonVisualComponents=function(source){var element=rf.getDomElement(source);
if(element){return(element[rf.RICH_CONTAINER]||{})["attachedComponents"]
}};
rf.invokeMethod=function(source,method){var c=rf.component(source);
var f;
if(c&&typeof(f=c[method])=="function"){return f.apply(c,Array.prototype.slice.call(arguments,2))
}};
rf.cleanComponent=function(source){var component=rf.component(source);
if(component&&!$(source).data("rf.bridge")){component.destroy();
component.detach(source)
}var attachedComponents=rf.findNonVisualComponents(source);
if(attachedComponents){for(var i in attachedComponents){if(attachedComponents[i]){attachedComponents[i].destroy()
}}}};
rf.cleanDom=function(source){var e=(typeof source=="string")?document.getElementById(source):$("body").get(0);
if(source=="javax.faces.ViewRoot"){e=$("body").get(0)
}if(e){$(e).trigger("beforeDomClean.RICH");
var elements=e.getElementsByTagName("*");
if(elements.length){$.each(elements,function(index){rf.cleanComponent(this)
});
$.cleanData(elements)
}rf.cleanComponent(e);
$.cleanData([e]);
$(e).trigger("afterDomClean.RICH")
}};
rf.submitForm=function(form,parameters,target){if(typeof form==="string"){form=$(form)
}var initialTarget=form.attr("target");
var parameterInputs=new Array();
try{form.attr("target",target);
if(parameters){for(var parameterName in parameters){var parameterValue=parameters[parameterName];
var input=$("input[name='"+parameterName+"']",form);
if(input.length==0){var newInput=$("<input />").attr({type:"hidden",name:parameterName,value:parameterValue});
if(parameterName==="javax.faces.portletbridge.STATE_ID"){input=newInput.prependTo(form)
}else{input=newInput.appendTo(form)
}}else{input.val(parameterValue)
}input.each(function(){parameterInputs.push(this)
})
}}form.trigger("submit")
}finally{if(initialTarget===undefined){form.removeAttr("target")
}else{form.attr("target",initialTarget)
}$(parameterInputs).remove()
}};
$.fn.toXML=function(){var out="";
if(this.length>0){if(typeof XMLSerializer=="function"||typeof XMLSerializer=="object"){var xs=new XMLSerializer();
this.each(function(){out+=xs.serializeToString(this)
})
}else{if(this[0].xml!==undefined){this.each(function(){out+=this.xml
})
}else{this.each(function(){out+=this
})
}}}return out
};
var CSS_METACHARS_PATTERN=/([#;&,.+*~':"!^$\[\]()=>|\/])/g;
rf.escapeCSSMetachars=function(s){return s.replace(CSS_METACHARS_PATTERN,"\\$1")
};
var logImpl;
rf.setLog=function(newLogImpl){logImpl=newLogImpl
};
rf.log={debug:function(text){if(logImpl){logImpl.debug(text)
}},info:function(text){if(logImpl){logImpl.info(text)
}},warn:function(text){if(logImpl){logImpl.warn(text)
}},error:function(text){if(logImpl){logImpl.error(text)
}},setLevel:function(level){if(logImpl){logImpl.setLevel(level)
}},getLevel:function(){if(logImpl){return logImpl.getLevel()
}return"info"
},clear:function(){if(logImpl){logImpl.clear()
}}};
rf.getValue=function(propertyNamesArray,base){var result=base;
var c=0;
do{result=result[propertyNamesArray[c++]]
}while(result&&c!=propertyNamesArray.length);
return result
};
var VARIABLE_NAME_PATTERN_STRING="[_A-Z,a-z]\\w*";
var VARIABLES_CHAIN=new RegExp("^\\s*"+VARIABLE_NAME_PATTERN_STRING+"(?:\\s*\\.\\s*"+VARIABLE_NAME_PATTERN_STRING+")*\\s*$");
var DOT_SEPARATOR=/\s*\.\s*/;
rf.evalMacro=function(macro,base){var value="";
if(VARIABLES_CHAIN.test(macro)){var propertyNamesArray=$.trim(macro).split(DOT_SEPARATOR);
value=rf.getValue(propertyNamesArray,base);
if(!value){value=rf.getValue(propertyNamesArray,window)
}}else{try{if(base.eval){value=base.eval(macro)
}else{with(base){value=eval(macro)
}}}catch(e){rf.log.warn("Exception: "+e.message+"\n["+macro+"]")
}}if(typeof value=="function"){value=value(base)
}return value||""
};
var ALPHA_NUMERIC_MULTI_CHAR_REGEXP=/^\w+$/;
rf.interpolate=function(placeholders,context){var contextVarsArray=new Array();
for(var contextVar in context){if(ALPHA_NUMERIC_MULTI_CHAR_REGEXP.test(contextVar)){contextVarsArray.push(contextVar)
}}var regexp=new RegExp("\\{("+contextVarsArray.join("|")+")\\}","g");
return placeholders.replace(regexp,function(str,contextVar){return context[contextVar]
})
};
rf.clonePosition=function(element,baseElement,positioning,offset){};
var jsfEventsAdapterEventNames={event:{begin:["begin"],complete:["beforedomupdate"],success:["success","complete"]},error:["error","complete"]};
var getExtensionResponseElement=function(responseXML){return $("partial-response extension#org\\.richfaces\\.extension",responseXML)
};
var JSON_STRING_START=/^\s*(\[|\{)/;
rf.parseJSON=function(dataString){try{if(dataString){if(JSON_STRING_START.test(dataString)){return $.parseJSON(dataString)
}else{var parsedData=$.parseJSON('{"root": '+dataString+"}");
return parsedData.root
}}}catch(e){rf.log.warn("Error evaluating JSON data from element <"+elementName+">: "+e.message)
}return null
};
var getJSONData=function(extensionElement,elementName){var dataString=$.trim(extensionElement.children(elementName).text());
return rf.parseJSON(dataString)
};
rf.createJSFEventsAdapter=function(handlers){var handlers=handlers||{};
var ignoreSuccess;
return function(eventData){var source=eventData.source;
var status=eventData.status;
var type=eventData.type;
if(type=="event"&&status=="begin"){ignoreSuccess=false
}else{if(type=="error"){ignoreSuccess=true
}else{if(ignoreSuccess){return
}else{if(status=="complete"&&rf.ajaxContainer&&rf.ajaxContainer.isIgnoreResponse&&rf.ajaxContainer.isIgnoreResponse()){return
}}}}var typeHandlers=jsfEventsAdapterEventNames[type];
var handlerNames=(typeHandlers||{})[status]||typeHandlers;
if(handlerNames){for(var i=0;
i<handlerNames.length;
i++){var eventType=handlerNames[i];
var handler=handlers[eventType];
if(handler){var event={};
$.extend(event,eventData);
event.type=eventType;
if(type!="error"){delete event.status;
if(event.responseXML){var xml=getExtensionResponseElement(event.responseXML);
var data=getJSONData(xml,"data");
var componentData=getJSONData(xml,"componentData");
event.data=data;
event.componentData=componentData||{}
}}handler.call(source,event)
}}}}
};
rf.setGlobalStatusNameVariable=function(statusName){if(statusName){rf.statusName=statusName
}else{delete rf.statusName
}};
rf.setZeroRequestDelay=function(options){if(typeof options.requestDelay=="undefined"){options.requestDelay=0
}};
var chain=function(){var functions=arguments;
if(functions.length==1){return functions[0]
}else{return function(){var callResult;
for(var i=0;
i<functions.length;
i++){var f=functions[i];
if(f){callResult=f.apply(this,arguments)
}}return callResult
}
}};
var createEventHandler=function(handlerCode){if(handlerCode){var safeHandlerCode="try {"+handlerCode+"} catch (e) {window.RichFaces.log.error('Error in method execution: ' + e.message)}";
return new Function("event",safeHandlerCode)
}return null
};
var AJAX_EVENTS=(function(){var serverEventHandler=function(clientHandler,event){var xml=getExtensionResponseElement(event.responseXML);
var serverHandler=createEventHandler(xml.children(event.type).text());
if(clientHandler){clientHandler.call(this,event)
}if(serverHandler){serverHandler.call(this,event)
}};
return{error:null,begin:null,complete:serverEventHandler,beforedomupdate:serverEventHandler}
}());
rf.requestParams=null;
rf.ajax=function(source,event,options){var options=options||{};
var sourceId=getSourceId(source,options);
var sourceElement=getSourceElement(source);
if(sourceElement){source=searchForComponentRootOrReturn(sourceElement)
}parameters=options.parameters||{};
parameters.execute="@component";
parameters.render="@component";
if(options.clientParameters){$.extend(parameters,options.clientParameters)
}if(!parameters["org.richfaces.ajax.component"]){parameters["org.richfaces.ajax.component"]=sourceId
}if(options.incId){parameters[sourceId]=sourceId
}if(rf.queue){parameters.queueId=options.queueId
}var form=getFormElement(sourceElement);
if(window.mojarra&&form&&form.enctype=="multipart/form-data"&&jsf.specversion>20000){var input,name,value;
rf.requestParams=[];
for(var i in parameters){if(parameters.hasOwnProperty(i)){value=parameters[i];
if(i!=="javax.faces.source"&&i!=="javax.faces.partial.event"&&i!=="javax.faces.partial.execute"&&i!=="javax.faces.partial.render"&&i!=="javax.faces.partial.ajax"&&i!=="javax.faces.behavior.event"&&i!=="queueId"){input=document.createElement("input");
input.setAttribute("type","hidden");
input.setAttribute("id",i);
input.setAttribute("name",i);
input.setAttribute("value",value);
form.appendChild(input);
rf.requestParams.push(i)
}}}}parameters.rfExt={};
parameters.rfExt.status=options.status;
for(var eventName in AJAX_EVENTS){parameters.rfExt[eventName]=options[eventName]
}jsf.ajax.request(source,event,parameters)
};
if(window.jsf){jsf.ajax.request=function request(source,event,options){var parameters=$.extend({},options);
parameters.rfExt=null;
var eventHandlers;
var sourceElement=getSourceElement(source);
var form=getFormElement(sourceElement);
for(var eventName in AJAX_EVENTS){var handlerCode,handler;
if(options.rfExt){handlerCode=options.rfExt[eventName];
handler=typeof handlerCode=="function"?handlerCode:createEventHandler(handlerCode)
}var serverHandler=AJAX_EVENTS[eventName];
if(serverHandler){handler=$.proxy(function(clientHandler,event){return serverHandler.call(this,clientHandler,event)
},sourceElement,handler)
}if(handler){eventHandlers=eventHandlers||{};
eventHandlers[eventName]=handler
}}if(options.rfExt&&options.rfExt.status){var namedStatusEventHandler=function(){rf.setGlobalStatusNameVariable(options.rfExt.status)
};
eventHandlers=eventHandlers||{};
if(eventHandlers.begin){eventHandlers.begin=chain(namedStatusEventHandler,eventHandlers.begin)
}else{eventHandlers.begin=namedStatusEventHandler
}}if(form){eventHandlers.begin=chain(eventHandlers.begin,function(){$(form).trigger("ajaxbegin")
});
eventHandlers.beforedomupdate=chain(eventHandlers.beforedomupdate,function(){$(form).trigger("ajaxbeforedomupdate")
});
eventHandlers.complete=chain(eventHandlers.complete,function(){$(form).trigger("ajaxcomplete")
})
}if(eventHandlers){var eventsAdapter=rf.createJSFEventsAdapter(eventHandlers);
parameters.onevent=chain(options.onevent,eventsAdapter);
parameters.onerror=chain(options.onerror,eventsAdapter)
}if(form){$(form).trigger("ajaxsubmit")
}return jsfAjaxRequest(source,event,parameters)
};
jsf.ajax.response=function(request,context){if(context.render=="@component"){context.render=$("extension[id='org.richfaces.extension'] render",request.responseXML).text()
}if(window.mojarra&&rf.requestParams&&rf.requestParams.length){for(var i=0;
i<rf.requestParams.length;
i++){var elements=context.form.childNodes;
for(var j=0;
j<elements.length;
j++){if(!elements[j].type==="hidden"){continue
}if(elements[j].name===rf.requestParams[i]){var node=context.form.removeChild(elements[j]);
node=null;
break
}}}}return jsfAjaxResponse(request,context)
}
}var searchForComponentRootOrReturn=function(sourceElement){if(sourceElement.id&&!isRichFacesComponent(sourceElement)){var parentElement=false;
$(sourceElement).parents().each(function(){if(this.id&&sourceElement.id.indexOf(this.id)==0){var suffix=sourceElement.id.substring(this.id.length);
if(suffix.match(/^[a-zA-Z]*$/)&&isRichFacesComponent(this)){parentElement=this;
return false
}}});
if(parentElement!==false){return parentElement
}}return sourceElement
};
var isRichFacesComponent=function(element){return $(element).data("rf.bridge")||rf.component(element)
};
var getSourceElement=function(source){if(typeof source==="string"){return document.getElementById(source)
}else{if(typeof source==="object"){return source
}else{throw new Error("jsf.request: source must be object or string")
}}};
var getFormElement=function(sourceElement){if($(sourceElement).is("form")){return sourceElement
}else{return $("form").has(sourceElement).get(0)
}};
var getSourceId=function(source,options){if(options.sourceId){return options.sourceId
}else{return(typeof source=="object"&&(source.id||source.name))?(source.id?source.id:source.name):source
}};
var ajaxOnComplete=function(data){var type=data.type;
var responseXML=data.responseXML;
if(data.type=="event"&&data.status=="complete"&&responseXML){var partialResponse=$(responseXML).children("partial-response");
if(partialResponse&&partialResponse.length){var elements=partialResponse.children("changes").children("update, delete");
$.each(elements,function(){rf.cleanDom($(this).attr("id"))
})
}}};
rf.javascriptServiceComplete=function(event){$(function(){$(document).trigger("javascriptServiceComplete")
})
};
var attachAjaxDOMCleaner=function(){if(typeof jsf!="undefined"&&jsf.ajax){jsf.ajax.addOnEvent(ajaxOnComplete);
return true
}return false
};
if(!attachAjaxDOMCleaner()){$(document).ready(attachAjaxDOMCleaner)
}if(window.addEventListener){window.addEventListener("unload",rf.cleanDom,false)
}else{window.attachEvent("onunload",rf.cleanDom)
}rf.browser={};
var ua=navigator.userAgent.toLowerCase(),match=/(chrome)[ \/]([\w.]+)/.exec(ua)||/(webkit)[ \/]([\w.]+)/.exec(ua)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua)||/(msie) ([\w.]+)/.exec(ua)||/(trident)(?:.*? rv:([\w.]+)|)/.exec(ua)||ua.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)||[];
rf.browser[match[1]||""]=true;
rf.browser.version=match[2]||"0";
if(rf.browser.chrome){rf.browser.webkit=true
}else{if(rf.browser.webkit){rf.browser.safari=true
}}if(rf.browser.trident){rf.browser.msie=true
}if(window.myfaces&&myfaces._impl&&myfaces._impl._util&&myfaces._impl._util._Dom.isMultipartCandidate){var oldIsMultipartCandidate=myfaces._impl._util._Dom.isMultipartCandidate,that=myfaces._impl._util._Dom;
myfaces._impl._util._Dom.isMultipartCandidate=function(executes){if(that._Lang.isString(executes)){executes=that._Lang.strToArray(executes,/\s+/)
}for(var cnt=0,len=executes.length;
cnt<len;
cnt++){var element=that.byId(executes[cnt]);
var inputs=that.findByTagName(element,"input",true);
for(var cnt2=0,len2=inputs.length;
cnt2<len2;
cnt2++){if(that.getAttribute(inputs[cnt2],"type")=="file"&&(!that.getAttribute(inputs[cnt2],"class")||that.getAttribute(inputs[cnt2],"class").search("rf-fu-inp")==-1)){return true
}}}return false
}
}}(RichFaces.jQuery,RichFaces));
(function(c,e,a){e.ajaxContainer=e.ajaxContainer||{};
if(e.ajaxContainer.jsfRequest){return
}e.ajaxContainer.jsfRequest=a.ajax.request;
a.ajax.request=function(i,j,l){e.queue.push(i,j,l)
};
e.ajaxContainer.jsfResponse=a.ajax.response;
e.ajaxContainer.isIgnoreResponse=function(){return e.queue.isIgnoreResponse()
};
a.ajax.response=function(i,j){e.queue.response(i,j)
};
var d="pull";
var f="push";
var g=d;
var h="org.richfaces.queue.global";
e.queue=(function(){var l={};
var s={};
var B=function(J,I,K,G){this.queue=J;
this.source=I;
this.options=c.extend({},G||{});
this.queueOptions={};
var H;
if(this.options.queueId){if(l[this.options.queueId]){H=this.options.queueId
}delete this.options.queueId
}else{var F=e.getDomElement(I);
var L;
if(F){F=c(F).closest("form");
if(F.length>0){L=F.get(0)
}}if(L&&L.id&&l[L.id]){H=L.id
}else{H=h
}}if(H){this.queueOptions=l[H]||{};
if(this.queueOptions.queueId){this.queueOptions=c.extend({},(l[this.queueOptions.queueId]||{}),this.queueOptions)
}else{var F=e.getDomElement(I);
var L;
if(F){F=c(F).closest("form");
if(F.length>0){L=F.get(0)
}}if(L&&L.id&&l[L.id]){H=L.id
}else{H=h
}if(H){this.queueOptions=c.extend({},(l[H]||{}),this.queueOptions)
}}}if(typeof this.queueOptions.requestGroupingId=="undefined"){this.queueOptions.requestGroupingId=typeof this.source=="string"?this.source:this.source.id
}if(K&&K instanceof Object){if("layerX" in K){delete K.layerX
}if("layerY" in K){delete K.layerY
}}this.event=c.extend({},K);
this.requestGroupingId=this.queueOptions.requestGroupingId;
this.eventsCount=1
};
c.extend(B.prototype,{isIgnoreDupResponses:function(){return this.queueOptions.ignoreDupResponses
},getRequestGroupId:function(){return this.requestGroupingId
},setRequestGroupId:function(F){this.requestGroupingId=F
},resetRequestGroupId:function(){this.requestGroupingId=undefined
},setReadyToSubmit:function(F){this.readyToSubmit=F
},getReadyToSubmit:function(){return this.readyToSubmit
},ondrop:function(){var F=this.queueOptions.onqueuerequestdrop;
if(F){F.call(this.queue,this.source,this.options,this.event)
}},onRequestDelayPassed:function(){this.readyToSubmit=true;
p.call(this.queue)
},startTimer:function(){var G=this.queueOptions.requestDelay;
if(typeof G!="number"){G=this.queueOptions.requestDelay||0
}e.log.debug("Queue will wait "+(G||0)+"ms before submit");
if(G){var F=this;
this.timer=window.setTimeout(function(){try{F.onRequestDelayPassed()
}finally{F.timer=undefined;
F=undefined
}},G)
}else{this.onRequestDelayPassed()
}},stopTimer:function(){if(this.timer){window.clearTimeout(this.timer);
this.timer=undefined
}},clearEntry:function(){this.stopTimer();
if(this.request){this.request.shouldNotifyQueue=false;
this.request=undefined
}},getEventsCount:function(){return this.eventsCount
},setEventsCount:function(F){this.eventsCount=F
}});
var m="event";
var x="success";
var y="complete";
var q=[];
var o;
var w=function(F){var G="richfaces.queue: ajax submit error";
if(F){var H=F.message||F.description;
if(H){G+=": "+H
}}e.log.warn(G);
o=null;
p()
};
var u=function(){var F;
var I=false;
while(q.length>0&&!I){F=q[0];
var H=e.getDomElement(F.source);
if(H==null||c(H).closest("form").length==0){var G=q.shift();
G.stopTimer();
e.log.debug("richfaces.queue: removing stale entry from the queue (source element: "+H+")")
}else{I=true
}}};
var i=function(F){if(F.type==m&&F.status==x){e.log.debug("richfaces.queue: ajax submit successfull");
o=null;
u();
p()
}};
a.ajax.addOnEvent(i);
a.ajax.addOnError(w);
var p=function(){if(g==d&&o){e.log.debug("richfaces.queue: Waiting for previous submit results");
return
}if(t()){e.log.debug("richfaces.queue: Nothing to submit");
return
}var G;
if(q[0].getReadyToSubmit()){try{G=o=q.shift();
e.log.debug("richfaces.queue: will submit request NOW");
var F=o.options;
F["AJAX:EVENTS_COUNT"]=o.eventsCount;
e.ajaxContainer.jsfRequest(o.source,o.event,F);
if(F.queueonsubmit){F.queueonsubmit.call(G)
}z("onrequestdequeue",G)
}catch(H){w(H)
}}};
var t=function(){return(A()==0)
};
var A=function(){return q.length
};
var j=function(){var F=q.length-1;
return q[F]
};
var n=function(G){var F=q.length-1;
q[F]=G
};
var z=function(G,I){var F=I.queueOptions[G];
if(F){if(typeof(F)=="string"){new Function(F).call(null,I)
}else{F.call(null,I)
}}var J,H;
if(I.queueOptions.queueId&&(J=l[I.queueOptions.queueId])&&(H=J[G])&&H!=F){H.call(null,I)
}};
var v=function(F){q.push(F);
e.log.debug("New request added to queue. Queue requestGroupingId changed to "+F.getRequestGroupId());
z("onrequestqueue",F)
};
return{DEFAULT_QUEUE_ID:h,getSize:A,isEmpty:t,submitFirst:function(){if(!t()){var F=q[0];
F.stopTimer();
F.setReadyToSubmit(true);
p()
}},push:function(J,K,G){var F=new B(this,J,K,G);
var I=F.getRequestGroupId();
var H=j();
if(H){if(H.getRequestGroupId()==I){e.log.debug("Similar request currently in queue");
e.log.debug("Combine similar requests and reset timer");
H.stopTimer();
F.setEventsCount(H.getEventsCount()+1);
n(F);
z("onrequestqueue",F)
}else{e.log.debug("Last queue entry is not the last anymore. Stopping requestDelay timer and marking entry as ready for submission");
H.stopTimer();
H.resetRequestGroupId();
H.setReadyToSubmit(true);
v(F);
p()
}}else{v(F)
}F.startTimer()
},response:function(F,G){if(this.isIgnoreResponse()){o=null;
p()
}else{e.ajaxContainer.jsfResponse(F,G)
}},isIgnoreResponse:function(){var F=q[0];
return F&&o.isIgnoreDupResponses()&&o.queueOptions.requestGroupingId==F.queueOptions.requestGroupingId
},clear:function(){var F=j();
if(F){F.stopTimer()
}q=[]
},setQueueOptions:function(F,H){var G=typeof F;
if(G=="string"){if(l[F]){throw"Queue already registered"
}else{l[F]=H
}}else{if(G=="object"){c.extend(l,F)
}}return e.queue
},getQueueOptions:function(F){return l[F]||{}
}}
}())
}(RichFaces.jQuery,RichFaces,jsf));
window.RichFaces=window.RichFaces||{};
RichFaces.jQuery=RichFaces.jQuery||window.jQuery;
(function(q,h){h.csv=h.csv||{};
var o={};
var i=/\'?\{(\d+)\}\'?/g;
var d=function(v,y,x){if(v){var t=v.replace(i,"\n$1\n").split("\n");
var u;
x[9]=y;
for(var w=1;
w<t.length;
w+=2){u=x[t[w]];
t[w]=typeof u=="undefined"?"":u
}return t.join("")
}else{return""
}};
var p=function(t){if(null!==t.value&&undefined!=t.value){return t.value
}else{return""
}};
var j=function(t){if(t.checked){return true
}else{return false
}};
var f=function(t,u){if(u.selected){return t[t.length]=u.value
}};
var l={hidden:function(t){return p(t)
},text:function(t){return p(t)
},textarea:function(t){return p(t)
},"select-one":function(t){if(t.selectedIndex!=-1){return p(t)
}},password:function(t){return p(t)
},file:function(t){return p(t)
},radio:function(t){return j(t)
},checkbox:function(t){return j(t)
},"select-multiple":function(t){var x=t.name;
var u=t.childNodes;
var v=[];
for(var w=0;
w<u.length;
w++){var A=u[w];
if(A.tagName==="OPTGROUP"){var y=A.childNodes;
for(var z=0;
z<y.length;
z++){v=f(v,y[z])
}}else{v=f(v,A)
}}return v
},input:function(t){return p(t)
}};
var s=function(w){var u="";
if(l[w.type]){u=l[w.type](w)
}else{if(undefined!==w.value){u=w.value
}else{var x=q(w);
if(x){if(typeof h.component(x)["getValue"]==="function"){u=h.component(x).getValue()
}else{var v=q("*",x).filter(":editable");
if(v){var t=v[0];
u=l[t.type](t)
}}}}}return u
};
var a=function(u,t){if(u.p){return u.p.label||t
}return t
};
q.extend(h.csv,{RE_DIGITS:/^-?\d+$/,RE_FLOAT:/^(-?\d+)?(\.(\d+)?(e[+-]?\d+)?)?$/,addMessage:function(t){q.extend(o,t)
},getMessage:function(u,x,w,v){var t=u?u:o[v]||{detail:"",summary:"",severity:0};
return{detail:d(t.detail,x,w),summary:d(t.summary,x,w),severity:t.severity}
},sendMessage:function(u,t){h.Event.fire(window.document,h.Event.MESSAGE_EVENT_TYPE,{sourceId:u,message:t})
},clearMessage:function(t){h.Event.fire(window.document,h.Event.MESSAGE_EVENT_TYPE,{sourceId:t})
},validate:function(B,z,K,v){var K=h.getDomElement(K||z);
var H=s(K);
var A;
var x=v.c;
h.csv.clearMessage(z);
if(x){var I=a(x,z);
try{if(x.f){A=x.f(H,z,a(x,z),x.m)
}}catch(J){J.severity=2;
h.csv.sendMessage(z,J);
return false
}}else{A=H
}var G=true;
var w=v.v;
var t;
if(w){var y,F;
for(var u=0;
u<w.length;
u++){try{F=w[u];
y=F.f;
if(y){y(A,a(F,z),F.p,F.m)
}}catch(J){t=J;
J.severity=2;
h.csv.sendMessage(z,J);
G=false
}}}if(!G&&v.oninvalid instanceof Function){v.oninvalid([t])
}if(G){if(!v.da&&v.a){v.a.call(K,B,z)
}else{if(v.onvalid instanceof Function){v.onvalid()
}}}return G
}});
var m=function(t,w,A,v,y,u){var z=null,x=t;
if(t){t=q.trim(t);
if(!h.csv.RE_DIGITS.test(t)||(z=parseInt(t,10))<v||z>y){throw h.csv.getMessage(A,x,u?[t,u,w]:[t,w])
}}return z
};
var e=function(u,w,t,v){var y=null,x=u;
if(u){u=q.trim(u);
if(!h.csv.RE_FLOAT.test(u)||isNaN(y=parseFloat(u))){throw h.csv.getMessage(t,x,v?[u,v,w]:[u,w])
}}return y
};
q.extend(h.csv,{convertBoolean:function(v,x,t,u){if(typeof v==="string"){var w=q.trim(v).toLowerCase();
if(w==="on"||w==="true"||w==="yes"){return true
}}else{if(true===v){return true
}}return false
},convertDate:function(v,w,t,u){var x;
v=q.trim(v);
x=Date.parse(v);
return x
},convertByte:function(v,w,t,u){return m(v,w,u,-128,127,254)
},convertNumber:function(v,w,t,u){var y,x=v;
v=q.trim(v);
y=parseFloat(v);
if(isNaN(y)){throw h.csv.getMessage(u,x,[v,99,w])
}return y
},convertFloat:function(v,w,t,u){return e(v,w,u,2000000000)
},convertDouble:function(v,w,t,u){return e(v,w,u,1999999)
},convertShort:function(v,w,t,u){return m(v,w,u,-32768,32767,32456)
},convertInteger:function(v,w,t,u){return m(v,w,u,-2147483648,2147483648,9346)
},convertCharacter:function(v,w,t,u){return m(v,w,u,0,65535)
},convertLong:function(v,w,t,u){return m(v,w,u,-9223372036854776000,9223372036854776000,98765432)
}});
var g=function(z,x,y,t,u){var v=typeof t.min==="number";
var w=typeof t.max==="number";
if(w&&x>t.max){throw h.csv.getMessage(u,z,v?[t.min,t.max,y]:[t.max,y])
}if(v&&x<t.min){throw h.csv.getMessage(u,z,w?[t.min,t.max,y]:[t.min,y])
}};
var c=function(v,z,w,t){if(typeof w!="string"||w.length==0){throw h.csv.getMessage(t,v,[],"REGEX_VALIDATOR_PATTERN_NOT_SET")
}var x=n(w);
var y;
try{y=new RegExp(x)
}catch(u){throw h.csv.getMessage(t,v,[],"REGEX_VALIDATOR_MATCH_EXCEPTION")
}if(!y.test(v)){throw h.csv.getMessage(t,v,[w,z])
}};
var n=function(t){if(!(t.slice(0,1)==="^")){t="^"+t
}if(!(t.slice(-1)==="$")){t=t+"$"
}return t
};
q.extend(h.csv,{validateLongRange:function(v,x,t,u){var w=typeof v,y=v;
if(w!=="number"){if(w!="string"){throw h.csv.getMessage(u,v,[componentId,""],"LONG_RANGE_VALIDATOR_TYPE")
}else{v=q.trim(v);
if(!h.csv.RE_DIGITS.test(v)||(v=parseInt(v,10))==NaN){throw h.csv.getMessage(u,v,[componentId,""],"LONG_RANGE_VALIDATOR_TYPE")
}}}g(y,v,x,t,u)
},validateDoubleRange:function(v,x,t,u){var w=typeof v,y=v;
if(w!=="number"){if(w!=="string"){throw h.csv.getMessage(u,v,[componentId,""],"DOUBLE_RANGE_VALIDATOR_TYPE")
}else{v=q.trim(v);
if(!h.csv.RE_FLOAT.test(v)||(v=parseFloat(v))==NaN){throw h.csv.getMessage(u,v,[componentId,""],"DOUBLE_RANGE_VALIDATOR_TYPE")
}}}g(y,v,x,t,u)
},validateLength:function(v,x,t,u){var w=v?v.length:0;
g(v,w,x,t,u)
},validateSize:function(v,x,t,u){var w=v?v.length:0;
g(v,w,x,t,u)
},validateRegex:function(v,w,t,u){c(v,w,t.pattern,u)
},validatePattern:function(v,w,t,u){c(v,w,t.regexp,u)
},validateRequired:function(v,w,t,u){if(undefined===v||null===v||""===v){throw h.csv.getMessage(u,v,[w])
}},validateTrue:function(v,w,t,u){if(v!==true){throw u
}},validateFalse:function(v,w,t,u){if(v!==false){throw u
}},validateMax:function(v,w,t,u){if(v>t.value){throw u
}},validateMin:function(v,w,t,u){if(v<t.value){throw u
}}})
})(RichFaces.jQuery,RichFaces);
window.RichFaces=window.RichFaces||{};
RichFaces.jQuery=RichFaces.jQuery||window.jQuery;
(function(e,f,d){f.blankFunction=function(){};
f.BaseComponent=function(g){this.id=g;
this.options=this.options||{}
};
var a={};
var c=function(l,g,m){m=m||{};
var i=f.blankFunction;
i.prototype=l.prototype;
g.prototype=new i();
g.prototype.constructor=g;
g.$super=l.prototype;
if(g.$super==f.BaseComponent.prototype){var j=jQuery.extend({},a,m||{})
}var h=g;
g.extend=function(n,p){p=p||{};
var o=jQuery.extend({},j||m||{},p||{});
return c(h,n,o)
};
return j||m
};
f.BaseComponent.extend=function(g,h){return c(f.BaseComponent,g,h)
};
f.BaseComponent.extendClass=function(h){var i=h.init||f.blankFunction;
var g=this;
g.extend(i);
i.extendClass=g.extendClass;
e.extend(i.prototype,h);
return i
};
e.extend(f.BaseComponent.prototype,(function(g){return{name:"BaseComponent",toString:function(){var h=[];
if(this.constructor.$super){h[h.length]=this.constructor.$super.toString()
}h[h.length]=this.name;
return h.join(", ")
},getValue:function(){return
},getEventElement:function(){return this.id
},attachToDom:function(h){h=h||this.id;
var i=f.getDomElement(h);
if(i){var j=i[f.RICH_CONTAINER]=i[f.RICH_CONTAINER]||{};
j.component=this
}return i
},detach:function(h){h=h||this.id;
var i=f.getDomElement(h);
i&&i[f.RICH_CONTAINER]&&(i[f.RICH_CONTAINER].component=null)
},invokeEvent:function(j,l,h,o){var i,n;
var p=e.extend({},h,{type:j});
if(!p){if(document.createEventObject){p=document.createEventObject();
p.type=j
}else{if(document.createEvent){p=document.createEvent("Events");
p.initEvent(j,true,false)
}}}p[f.RICH_CONTAINER]={component:this,data:o};
var m=this.options["on"+j];
if(typeof m=="function"){i=m.call(l,p)
}if(f.Event){n=f.Event.callHandler(this,j,o)
}if(n!=false&&i!=false){n=true
}return n
},destroy:function(){}}
})(d));
f.BaseNonVisualComponent=function(g){this.id=g;
this.options=this.options||{}
};
f.BaseNonVisualComponent.extend=function(g,h){return c(f.BaseNonVisualComponent,g,h)
};
f.BaseNonVisualComponent.extendClass=function(h){var i=h.init||f.blankFunction;
var g=this;
g.extend(i);
i.extendClass=g.extendClass;
e.extend(i.prototype,h);
return i
};
e.extend(f.BaseNonVisualComponent.prototype,(function(g){return{name:"BaseNonVisualComponent",toString:function(){var h=[];
if(this.constructor.$super){h[h.length]=this.constructor.$super.toString()
}h[h.length]=this.name;
return h.join(", ")
},getValue:function(){return
},attachToDom:function(h){h=h||this.id;
var i=f.getDomElement(h);
if(i){var j=i[f.RICH_CONTAINER]=i[f.RICH_CONTAINER]||{};
if(j.attachedComponents){j.attachedComponents[this.name]=this
}else{j.attachedComponents={};
j.attachedComponents[this.name]=this
}}return i
},detach:function(h){h=h||this.id;
var i=f.getDomElement(h);
i&&i[f.RICH_CONTAINER]&&(i[f.RICH_CONTAINER].attachedComponents[this.name]=null)
},destroy:function(){}}
})(d))
})(jQuery,window.RichFaces||(window.RichFaces={}));
(function(d,a){a.ui=a.ui||{};
a.ui.Base=function(e,f,g){this.namespace="."+a.Event.createNamespace(this.name,e);
c.constructor.call(this,e);
this.options=d.extend(this.options,g,f);
this.attachToDom();
this.__bindEventHandlers()
};
a.BaseComponent.extend(a.ui.Base);
var c=a.ui.Base.$super;
d.extend(a.ui.Base.prototype,{__bindEventHandlers:function(){},destroy:function(){a.Event.unbindById(this.id,this.namespace);
c.destroy.call(this)
}})
})(RichFaces.jQuery,RichFaces);
(function(n){n.fn.setPosition=function(p,o){var u=typeof p;
if(u=="object"||u=="string"){var s={};
if(u=="string"||p.nodeType||p instanceof jQuery||typeof p.length!="undefined"){s=j(p)
}else{if(p.type){s=c(p)
}else{if(p.id){s=j(document.getElementById(p.id))
}else{s=p
}}}var o=o||{};
var q=o.type||o.from||o.to?n.PositionTypes[o.type||l]:{noPositionType:true};
var t=n.extend({},a,q,o);
if(!t.noPositionType){if(t.from.length>2){t.from=d[t.from.toLowerCase()]
}if(t.to.length>2){t.to=d[t.to.toLowerCase()]
}}return this.each(function(){element=n(this);
m(s,element,t)
})
}return this
};
var l="TOOLTIP";
var a={collision:"",offset:[0,0]};
var g=/^(left|right)-(top|buttom|auto)$/i;
var d={"top-left":"LT","top-right":"RT","bottom-left":"LB","bottom-right":"RB","top-auto":"AT","bottom-auto":"AB","auto-left":"LA","auto-right":"RA","auto-auto":"AA"};
n.PositionTypes={TOOLTIP:{from:"AA",to:"AA",auto:["RTRT","RBRT","LTRT","RTLT","LTLT","LBLT","RTRB","RBRB","LBRB","RBLB"]},DROPDOWN:{from:"AA",to:"AA",auto:["LBRB","LTRT","RBLB","RTLT"]},DDMENUGROUP:{from:"AA",to:"AA",auto:["RTRB","RBRT","LTLB","LBLT"]}};
n.addPositionType=function(o,p){n.PositionTypes[o]=p
};
function c(p){var o=n.event.fix(p);
return{width:0,height:0,left:o.pageX,top:o.pageY}
}function j(u){var w=n(u);
var v=w.offset();
var p={width:w.outerWidth(),height:w.outerHeight(),left:Math.floor(v.left),top:Math.floor(v.top)};
if(w.length>1){var x,o,v;
var s;
for(var t=1;
t<w.length;
t++){s=w.eq(t);
if(s.css("display")=="none"){continue
}x=s.outerWidth();
o=s.outerHeight();
v=s.offset();
var q=p.left-v.left;
if(q<0){if(x-q>p.width){p.width=x-q
}}else{p.width+=q
}var q=p.top-v.top;
if(q<0){if(o-q>p.height){p.height=o-q
}}else{p.height+=q
}if(v.left<p.left){p.left=v.left
}if(v.top<p.top){p.top=v.top
}}}return p
}function h(q,p){if(q.left>=p.left&&q.top>=p.top&&q.right<=p.right&&q.bottom<=p.bottom){return 0
}var o={left:(q.left>p.left?q.left:p.left),top:(q.top>p.top?q.top:p.top)};
o.right=q.right<p.right?(q.right==q.left?o.left:q.right):p.right;
o.bottom=q.bottom<p.bottom?(q.bottom==q.top?o.top:q.bottom):p.bottom;
return(o.right-o.left)*(o.bottom-o.top)
}function e(p,s,u,o){var q={};
var t=o.charAt(0);
if(t=="L"){q.left=p.left
}else{if(t=="R"){q.left=p.left+p.width
}}t=o.charAt(1);
if(t=="T"){q.top=p.top
}else{if(t=="B"){q.top=p.top+p.height
}}t=o.charAt(2);
if(t=="L"){q.left-=s[0];
q.right=q.left;
q.left-=u.width
}else{if(t=="R"){q.left+=s[0];
q.right=q.left+u.width
}}t=o.charAt(3);
if(t=="T"){q.top-=s[1];
q.bottom=q.top;
q.top-=u.height
}else{if(t=="B"){q.top+=s[1];
q.bottom=q.top+u.height
}}return q
}function i(p,q){var s="";
var o;
while(s.length<p.length){o=p.charAt(s.length);
s+=o=="A"?q.charAt(s.length):o
}return s
}function f(v,A,x,q,o){var s={square:0};
var t;
var p;
var z,B;
var F=o.from+o.to;
if(F.indexOf("A")<0){return e(v,A,q,F)
}else{var w=F=="AAAA";
var u;
for(var y=0;
y<o.auto.length;
y++){u=w?o.auto[y]:i(F,o.auto[y]);
t=e(v,A,q,u);
z=t.left;
B=t.top;
p=h(t,x);
if(p!=0){if(z>=0&&B>=0&&s.square<p){s={x:z,y:B,square:p}
}}else{break
}}if(p!=0&&(z<0||B<0||s.square>p)){z=s.x;
B=s.y
}}return{left:z,top:B}
}function m(q,x,o){var A=x.width();
var p=x.height();
q.width=q.width||0;
q.height=q.height||0;
var y=parseInt(x.css("left"),10);
if(isNaN(y)||y==0){y=0;
x.css("left","0px")
}if(isNaN(q.left)){q.left=y
}var s=parseInt(x.css("top"),10);
if(isNaN(s)||s==0){s=0;
x.css("top","0px")
}if(isNaN(q.top)){q.top=s
}var t={};
if(o.noPositionType){t.left=q.left+q.width+o.offset[0];
t.top=q.top+o.offset[1]
}else{var w=n(window);
var z={left:w.scrollLeft(),top:w.scrollTop()};
z.right=z.left+w.width();
z.bottom=z.top+w.height();
t=f(q,o.offset,z,{width:A,height:p},o)
}var B=false;
var u;
var v;
if(x.css("display")=="none"){B=true;
v=x.get(0);
u=v.style.visibility;
v.style.visibility="hidden";
v.style.display="block"
}var F=x.offset();
if(B){v.style.visibility=u;
v.style.display="none"
}t.left+=y-Math.floor(F.left);
t.top+=s-Math.floor(F.top);
if(y!=t.left){x.css("left",(t.left+"px"))
}if(s!=t.top){x.css("top",(t.top+"px"))
}}})(jQuery);
(function(e,g){var h=["debug","info","warn","error"];
var f={debug:"debug",info:"info ",warn:"warn ",error:"error"};
var i={debug:1,info:2,warn:3,error:4};
var c={__import:function(p,j){if(p===document){return j
}var n=e();
for(var l=0;
l<j.length;
l++){if(p.importNode){n=n.add(p.importNode(j[l],true))
}else{var m=p.createElement("div");
m.innerHTML=j[l].outerHTML;
for(var o=m.firstChild;
o;
o=o.nextSibling){n=n.add(o)
}}}return n
},__getStyles:function(){var m=e("head");
if(m.length==0){return""
}try{var l=m.clone();
if(l.children().length==m.children().length){return l.children(":not(style):not(link[rel='stylesheet'])").remove().end().html()
}else{var n=new Array();
m.children("style, link[rel='stylesheet']").each(function(){n.push(this.outerHTML)
});
return n.join("")
}}catch(j){return""
}},__openPopup:function(){if(!this.__popupWindow||this.__popupWindow.closed){this.__popupWindow=open("","_richfaces_logWindow","height=400, width=600, resizable = yes, status=no, scrollbars = yes, statusbar=no, toolbar=no, menubar=no, location=no");
var j=this.__popupWindow.document;
j.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head>'+this.__getStyles()+"</head><body onunload='window.close()'><div id='richfaces.log' clas='rf-log rf-log-popup'></div></body></html>");
j.close();
this.__initializeControls(j)
}else{this.__popupWindow.focus()
}},__hotkeyHandler:function(j){if(j.ctrlKey&&j.shiftKey){if((this.hotkey||"l").toLowerCase()==String.fromCharCode(j.keyCode).toLowerCase()){this.__openPopup()
}}},__getTimeAsString:function(){var l=new Date();
var j=this.__lzpad(l.getHours(),2)+":"+this.__lzpad(l.getMinutes(),2)+":"+this.__lzpad(l.getSeconds(),2)+"."+this.__lzpad(l.getMilliseconds(),3);
return j
},__lzpad:function(l,j){l=l.toString();
var n=new Array();
for(var m=0;
m<j-l.length;
m++){n.push("0")
}n.push(l);
return n.join("")
},__getMessagePrefix:function(j){return f[j]+"["+this.__getTimeAsString()+"]: "
},__setLevelFromSelect:function(j){this.setLevel(j.target.value)
},__initializeControls:function(p){var l=e("#richfaces\\.log",p);
var m=l.children("button.rf-log-element");
if(m.length==0){m=e("<button type='button' name='clear' class='rf-log-element'>Clear</button>",p).appendTo(l)
}m.click(e.proxy(this.clear,this));
var o=l.children("select.rf-log-element");
if(o.length==0){o=e("<select class='rf-log-element' name='richfaces.log' />",p).appendTo(l)
}if(o.children().length==0){for(var n=0;
n<h.length;
n++){e("<option value='"+h[n]+"'>"+h[n]+"</option>",p).appendTo(o)
}}o.val(this.getLevel());
o.change(e.proxy(this.__setLevelFromSelect,this));
var j=l.children(".rf-log-contents");
if(j.length==0){j=e("<div class='rf-log-contents'></div>",p).appendTo(l)
}this.__contentsElement=j
},__append:function(m){var j=this.__contentsElement;
if(this.mode=="popup"){var l=this.__popupWindow.document;
e(l.createElement("div")).appendTo(j).append(this.__import(l,m))
}else{e(document.createElement("div")).appendTo(j).append(m)
}},__log:function(o,l){var n=this.getLevel();
if(!i[n]){if(console.log){console.log('Warning: unknown log level "'+this.getLevel()+'" - using log level "debug"')
}n="debug"
}if(i[o]<i[n]){return
}if(this.mode=="console"){var m="RichFaces: "+l;
if(console[o]){console[o](m)
}else{if(console.log){console.log(m)
}}return
}if(!this.__contentsElement){return
}var j=e();
j=j.add(e("<span class='rf-log-entry-lbl rf-log-entry-lbl-"+o+"'></span>").text(this.__getMessagePrefix(o)));
var p=e("<span class='rf-log-entry-msg rf-log-entry-msg-"+o+"'></span>");
if(typeof l!="object"||!l.appendTo){p.text(l)
}else{l.appendTo(p)
}j=j.add(p);
this.__append(j)
},init:function(j){d.constructor.call(this,"richfaces.log");
this.attachToDom();
g.setLog(this);
j=j||{};
this.level=(j.level||"info").toLowerCase();
this.hotkey=j.hotkey;
this.mode=(j.mode||"inline");
if(this.mode=="console"){}else{if(this.mode=="popup"){this.__boundHotkeyHandler=e.proxy(this.__hotkeyHandler,this);
e(document).bind("keydown",this.__boundHotkeyHandler)
}else{this.__initializeControls(document)
}}},destroy:function(){g.setLog(null);
if(this.__popupWindow){this.__popupWindow.close()
}this.__popupWindow=null;
if(this.__boundHotkeyHandler){e(document).unbind("keydown",this.__boundHotkeyHandler);
this.__boundHotkeyHandler=null
}this.__contentsElement=null;
d.destroy.call(this)
},setLevel:function(j){this.level=j;
this.clear()
},getLevel:function(){return this.level||"info"
},clear:function(){if(this.__contentsElement){this.__contentsElement.children().remove()
}}};
for(var a=0;
a<h.length;
a++){c[h[a]]=(function(){var j=h[a];
return function(l){this.__log(j,l)
}
}())
}g.HtmlLog=g.BaseComponent.extendClass(c);
var d=g.HtmlLog.$super;
e(document).ready(function(){if(typeof jsf!="undefined"){(function(q,j,n){var o=function(u){var v="<"+u.tagName.toLowerCase();
var t=q(u);
if(t.attr("id")){v+=(" id="+t.attr("id"))
}if(t.attr("class")){v+=(" class="+t.attr("class"))
}v+=" ...>";
return v
};
var s=function(v,t){var u=q(t);
v.append("Element <b>"+t.nodeName+"</b>");
if(u.attr("id")){v.append(document.createTextNode(" for id="+u.attr("id")))
}q(document.createElement("br")).appendTo(v);
q("<span class='rf-log-entry-msg-xml'></span>").appendTo(v).text(u.toXML());
q(document.createElement("br")).appendTo(v)
};
var p=function(u){var t=q(document.createElement("span"));
u.children().each(function(){var v=q(this);
if(v.is("changes")){t.append("Listing content of response <b>changes</b> element:<br />");
v.children().each(function(){s(t,this)
})
}else{s(t,this)
}});
return t
};
var l=function(y){try{var A=j.log;
var F=y.source;
var v=y.type;
var t=y.responseCode;
var u=y.responseXML;
var w=y.responseText;
if(v!="error"){A.info("Received '"+v+"' event from "+o(F));
if(v=="beforedomupdate"){var z;
if(u){z=q(u).children("partial-response")
}var H=q("<span>Server returned responseText: </span><span class='rf-log-entry-msg-xml'></span>").eq(1).text(w).end();
if(z&&z.length){A.debug(H);
A.info(p(z))
}else{A.info(H)
}}}else{var B=y.status;
A.error("Received '"+v+"@"+B+"' event from "+o(F));
var G="[status="+y.responseCode+"] ";
if(y.errorName&&y.errorMessage){G+=" "+y.errorName+": "+y.errorMessage
}else{if(y.description){G+=" "+y.description
}else{G+=" no error details"
}}A.error(G)
}}catch(x){}};
var m=j.createJSFEventsAdapter({begin:l,beforedomupdate:l,success:l,complete:l,error:l});
n.ajax.addOnEvent(m);
n.ajax.addOnError(m)
}(e,g,jsf))
}})
}(RichFaces.jQuery,RichFaces));
(function($){var undefined,dataFlag="watermark",dataClass="watermarkClass",dataFocus="watermarkFocus",dataFormSubmit="watermarkSubmit",dataMaxLen="watermarkMaxLength",dataPassword="watermarkPassword",dataText="watermarkText",selWatermarkDefined=":data("+dataFlag+")",selWatermarkAble=":text,:password,:search,textarea",triggerFns=["Page_ClientValidate"],pageDirty=false;
$.extend($.expr[":"],{search:function(elem){return"search"===(elem.type||"")
},data:function(element,index,matches,set){var data,parts=/^((?:[^=!^$*]|[!^$*](?!=))+)(?:([!^$*]?=)(.*))?$/.exec(matches[3]);
if(parts){data=$(element).data(parts[1]);
if(data!==undefined){if(parts[2]){data=""+data;
switch(parts[2]){case"=":return(data==parts[3]);
case"!=":return(data!=parts[3]);
case"^=":return(data.slice(0,parts[3].length)==parts[3]);
case"$=":return(data.slice(-parts[3].length)==parts[3]);
case"*=":return(data.indexOf(parts[3])!==-1)
}}return true
}}return false
}});
$.watermark={version:"3.0.6",options:{className:"watermark",useNative:true},hide:function(selector){$(selector).filter(selWatermarkDefined).each(function(){$.watermark._hide($(this))
})
},_hide:function($input,focus){var inputVal=$input.val()||"",inputWm=$input.data(dataText)||"",maxLen=$input.data(dataMaxLen)||0,className=$input.data(dataClass);
if((inputWm.length)&&(inputVal==inputWm)){$input.val("");
if($input.data(dataPassword)){if(($input.attr("type")||"")==="text"){var $pwd=$input.data(dataPassword)||[],$wrap=$input.parent()||[];
if(($pwd.length)&&($wrap.length)){$wrap[0].removeChild($input[0]);
$wrap[0].appendChild($pwd[0]);
$input=$pwd
}}}if(maxLen){$input.attr("maxLength",maxLen);
$input.removeData(dataMaxLen)
}if(focus){$input.attr("autocomplete","off");
window.setTimeout(function(){$input.select()
},1)
}}className&&$input.removeClass(className)
},show:function(selector){$(selector).filter(selWatermarkDefined).each(function(){$.watermark._show($(this))
})
},_show:function($input){var val=$input.val()||"",text=$input.data(dataText)||"",type=$input.attr("type")||"",className=$input.data(dataClass);
if(((val.length==0)||(val==text))&&(!$input.data(dataFocus))){pageDirty=true;
if($input.data(dataPassword)){if(type==="password"){var $pwd=$input.data(dataPassword)||[],$wrap=$input.parent()||[];
if(($pwd.length)&&($wrap.length)){$wrap[0].removeChild($input[0]);
$wrap[0].appendChild($pwd[0]);
$input=$pwd;
$input.attr("maxLength",text.length)
}}}if((type==="text")||(type==="search")){var maxLen=$input.attr("maxLength")||0;
if((maxLen>0)&&(text.length>maxLen)){$input.data(dataMaxLen,maxLen);
$input.attr("maxLength",text.length)
}}className&&$input.addClass(className);
$input.val(text)
}else{$.watermark._hide($input)
}},hideAll:function(){if(pageDirty){$.watermark.hide(selWatermarkAble);
pageDirty=false
}},showAll:function(){$.watermark.show(selWatermarkAble)
}};
$.fn.watermark=function(text,options){if(!this.length){return this
}var hasClass=false,hasText=(typeof(text)==="string");
if(typeof(options)==="object"){hasClass=(typeof(options.className)==="string");
options=$.extend({},$.watermark.options,options)
}else{if(typeof(options)==="string"){hasClass=true;
options=$.extend({},$.watermark.options,{className:options})
}else{options=$.watermark.options
}}if(typeof(options.useNative)!=="function"){options.useNative=options.useNative?function(){return true
}:function(){return false
}
}return this.each(function(){var $input=$(this);
if(!$input.is(selWatermarkAble)){return
}if($input.data(dataFlag)){if(hasText||hasClass){$.watermark._hide($input);
if(hasText){$input.data(dataText,text)
}if(hasClass){$input.data(dataClass,options.className)
}}}else{if(options.useNative.call(this,$input)){if(((""+$input.css("-webkit-appearance")).replace("undefined","")!=="")&&((($input.attr("tagName")||"")!=="TEXTAREA"))&&$input.size()>0&&$input[0].tagName!=="TEXTAREA"){if(hasText){$input.attr("placeholder",text)
}return
}}$input.data(dataText,hasText?text:"");
$input.data(dataClass,options.className);
$input.data(dataFlag,1);
if(($input.attr("type")||"")==="password"){var $wrap=$input.wrap("<span>").parent(),$wm=$($wrap.html().replace(/type=["']?password["']?/i,'type="text"'));
$wm.data(dataText,$input.data(dataText));
$wm.data(dataClass,$input.data(dataClass));
$wm.data(dataFlag,1);
$wm.attr("maxLength",text.length);
$wm.focus(function(){$.watermark._hide($wm,true)
}).bind("dragenter",function(){$.watermark._hide($wm)
}).bind("dragend",function(){window.setTimeout(function(){$wm.blur()
},1)
});
$input.blur(function(){$.watermark._show($input)
}).bind("dragleave",function(){$.watermark._show($input)
});
$wm.data(dataPassword,$input);
$input.data(dataPassword,$wm)
}else{$input.focus(function(){$input.data(dataFocus,1);
$.watermark._hide($input,true)
}).blur(function(){$input.data(dataFocus,0);
$.watermark._show($input)
}).bind("dragenter",function(){$.watermark._hide($input)
}).bind("dragleave",function(){$.watermark._show($input)
}).bind("dragend",function(){window.setTimeout(function(){$.watermark._show($input)
},1)
}).bind("drop",function(evt){var dropText=evt.originalEvent.dataTransfer.getData("Text");
if($input.val().replace(dropText,"")===$input.data(dataText)){$input.val(dropText)
}$input.focus()
})
}if(this.form){var form=this.form,$form=$(form);
if(!$form.data(dataFormSubmit)){$form.submit($.watermark.hideAll);
if(form.submit){$form.data(dataFormSubmit,form.onsubmit||1);
form.onsubmit=(function(f,$f){return function(){var nativeSubmit=$f.data(dataFormSubmit);
$.watermark.hideAll();
if(nativeSubmit instanceof Function){nativeSubmit()
}else{eval(nativeSubmit)
}}
})(form,$form)
}else{$form.data(dataFormSubmit,1);
form.submit=(function(f){return function(){$.watermark.hideAll();
delete f.submit;
f.submit()
}
})(form)
}}}}$.watermark._show($input)
})
};
if(triggerFns.length){$(function(){var i,name,fn;
for(i=triggerFns.length-1;
i>=0;
i--){name=triggerFns[i];
fn=window[name];
if(typeof(fn)==="function"){window[name]=(function(origFn){return function(){$.watermark.hideAll();
return origFn.apply(null,Array.prototype.slice.call(arguments))
}
})(fn)
}}})
}})(jQuery);
(function(d,e){var f=function(){return e.statusName
};
var a="richfaces:ajaxStatus";
var c=function(i){return i?(a+"@"+i):a
};
var g=function(o,j){if(j){var p=f();
var w=o.source;
var l=false;
var u=c(p);
var v;
if(p){v=[d(document)]
}else{v=[d(w).parents("form"),d(document)]
}for(var n=0;
n<v.length&&!l;
n++){var s=v[n];
var t=s.data(u);
if(t){for(var m in t){var q=t[m];
var i=q[j].apply(q,arguments);
if(i){l=true
}else{delete t[m]
}}if(!l){s.removeData(u)
}}}}};
var h=function(){var j=arguments.callee;
if(!j.initialized){j.initialized=true;
var i=e.createJSFEventsAdapter({begin:function(l){g(l,"start")
},error:function(l){g(l,"error")
},success:function(l){g(l,"success")
},complete:function(){e.setGlobalStatusNameVariable(null)
}});
jsf.ajax.addOnEvent(i);
jsf.ajax.addOnError(i)
}};
e.ui=e.ui||{};
e.ui.Status=e.BaseComponent.extendClass({name:"Status",init:function(i,j){this.id=i;
this.attachToDom();
this.options=j||{};
this.register()
},register:function(){h();
var j=this.options.statusName;
var m=c(j);
var l;
if(j){l=d(document)
}else{l=d(e.getDomElement(this.id)).parents("form");
if(l.length==0){l=d(document)
}}var i=l.data(m);
if(!i){i={};
l.data(m,i)
}i[this.id]=this
},start:function(){if(this.options.onstart){this.options.onstart.apply(this,arguments)
}return this.__showHide(".rf-st-start")
},stop:function(){this.__stop();
return this.__showHide(".rf-st-stop")
},success:function(){if(this.options.onsuccess){this.options.onsuccess.apply(this,arguments)
}return this.stop()
},error:function(){if(this.options.onerror){this.options.onerror.apply(this,arguments)
}this.__stop();
return this.__showHide(":not(.rf-st-error) + .rf-st-stop, .rf-st-error")
},__showHide:function(l){var j=d(e.getDomElement(this.id));
if(j){var i=j.children();
i.each(function(){var m=d(this);
m.css("display",m.is(l)?"":"none")
});
return true
}return false
},__stop:function(){if(this.options.onstop){this.options.onstop.apply(this,arguments)
}}})
}(RichFaces.jQuery,window.RichFaces));
if(!window.RichFaces){window.RichFaces={}
}(function($,rf){rf.ui=rf.ui||{};
var evaluate=function(selector){var result=selector;
try{result=eval(selector)
}catch(e){}return result
};
var evaluateJQuery=function(element,selector){var result=element||evaluate(selector);
if(!(result instanceof $)){result=$(result||"")
}return result
};
var createEventHandlerFunction=function(opts){var newFunction=new Function("event",opts.query);
return function(){var selector=evaluateJQuery(null,opts.selector);
if(opts.attachType!="live"){selector[opts.attachType||"bind"](opts.event,null,newFunction)
}else{$(document).on(opts.event,selector.selector,null,newFunction)
}}
};
var createDirectQueryFunction=function(opts){var queryFunction=new Function("options","arguments[1]."+opts.query);
return function(){var element;
var options;
if(arguments.length==1){if(!opts.selector){element=arguments[0]
}else{options=arguments[0]
}}else{element=arguments[0];
options=arguments[1]
}var selector=evaluateJQuery(element,opts.selector);
queryFunction.call(this,options,selector)
}
};
var createQueryFunction=function(options){if(options.event){return createEventHandlerFunction(options)
}else{return createDirectQueryFunction(options)
}};
var query=function(options){if(options.timing=="immediate"){createQueryFunction(options).call(this)
}else{$(document).ready(createQueryFunction(options))
}};
rf.ui.jQueryComponent={createFunction:createQueryFunction,query:query}
}(RichFaces.jQuery,RichFaces));
(function(d,e){e.ui=e.ui||{};
var a={};
e.ui.Poll=function(f,g){c.constructor.call(this,f,g);
this.id=f;
this.attachToDom();
this.interval=g.interval||1000;
this.ontimer=g.ontimer;
this.pollElement=e.getDomElement(this.id);
e.ui.pollTracker=e.ui.pollTracker||{};
if(g.enabled){this.startPoll()
}};
e.BaseComponent.extend(e.ui.Poll);
var c=e.ui.Poll.$super;
d.extend(e.ui.Poll.prototype,(function(){return{name:"Poll",startPoll:function(){this.stopPoll();
var f=this;
e.ui.pollTracker[f.id]=window.setTimeout(function(){try{f.ontimer.call(f.pollElement||window);
f.startPoll()
}catch(g){}},f.interval)
},stopPoll:function(){if(e.ui.pollTracker&&e.ui.pollTracker[this.id]){window.clearTimeout(e.ui.pollTracker[this.id]);
delete e.ui.pollTracker[this.id]
}},setZeroRequestDelay:function(f){if(typeof f.requestDelay=="undefined"){f.requestDelay=0
}},destroy:function(){this.stopPoll();
this.detach(this.id);
c.destroy.call(this)
}}
})())
})(RichFaces.jQuery,RichFaces);
(function(d,a){a.ui=a.ui||{};
a.ui.CollapsibleSubTable=function(e,f,g){this.id=e;
this.options=d.extend(this.options,g||{});
this.stateInput=g.stateInput;
this.optionsInput=g.optionsInput;
this.expandMode=g.expandMode||a.ui.CollapsibleSubTable.MODE_CLNT;
this.eventOptions=g.eventOptions;
this.formId=f;
this.isNested=g.isNested;
if(!this.isNested){var i=this;
var h=d(document.getElementById(this.id)).parent();
h.find(".rf-dt-c-srt").each(function(){d(this).bind("click",{sortHandle:this},d.proxy(i.sortHandler,i))
});
h.find(".rf-dt-flt-i").each(function(){d(this).bind("blur",{filterHandle:this},d.proxy(i.filterHandler,i))
})
}this.attachToDom()
};
d.extend(a.ui.CollapsibleSubTable,{MODE_AJAX:"ajax",MODE_SRV:"server",MODE_CLNT:"client",collapse:0,expand:1,SORTING:"rich:sorting",FILTERING:"rich:filtering"});
a.BaseComponent.extend(a.ui.CollapsibleSubTable);
var c=a.ui.CollapsibleSubTable.$super;
d.extend(a.ui.CollapsibleSubTable.prototype,(function(){var l=function(o,n){a.ajax(this.id,o,{parameters:n})
};
var g=function(q,o,t,u){var p={};
var s=this.id+q;
p[s]=(o+":"+(t||"")+":"+u);
var n=this.options.ajaxEventOption;
for(s in n){if(!p[s]){p[s]=n[s]
}}return p
};
var j=function(){if(!this.isNested){return d(document.getElementById(this.id)).parent()
}else{var n=new RegExp("^"+this.id+"\\:\\d+\\:b$");
return d(document.getElementById(this.id)).parent().find("tr").filter(function(){return this.id.match(n)
})
}};
var i=function(){return d(document.getElementById(this.stateInput))
};
var e=function(){return d(document.getElementById(this.optionsInput))
};
var h=function(o,n){this.__switchState();
a.ajax(this.id,o,n)
};
var f=function(n){this.__switchState();
d(document.getElementById(this.formId)).submit()
};
var m=function(n){if(this.isExpanded()){this.collapse(n)
}else{this.expand(n)
}};
return{name:"CollapsibleSubTable",sort:function(p,o,n){l.call(this,null,g.call(this,a.ui.CollapsibleSubTable.SORTING,p,o,n))
},clearSorting:function(){this.sort("","",true)
},sortHandler:function(p){var n=d(p.data.sortHandle);
var s=n.find(".rf-dt-srt-btn");
var o=s.data("columnid");
var q=s.hasClass("rf-dt-srt-asc")?"descending":"ascending";
this.sort(o,q,false)
},filter:function(p,o,n){l.call(this,null,g.call(this,a.ui.CollapsibleSubTable.FILTERING,p,o,n))
},clearFiltering:function(){this.filter("","",true)
},filterHandler:function(q){var n=d(q.data.filterHandle);
var p=n.data("columnid");
var o=n.val();
this.filter(p,o,false)
},switchState:function(o,n){if(this.expandMode==a.ui.CollapsibleSubTable.MODE_AJAX){h.call(this,o,this.eventOptions,n)
}else{if(this.expandMode==a.ui.CollapsibleSubTable.MODE_SRV){f.call(this,n)
}else{if(this.expandMode==a.ui.CollapsibleSubTable.MODE_CLNT){m.call(this,n)
}}}},collapse:function(n){if(this.isNested){var q=new RegExp("^"+this.id+"\\:\\d+\\:\\w+\\:expanded$");
var o=new RegExp("^"+this.id+"\\:\\d+\\:\\w+\\:collapsed$");
var p=new RegExp("^"+this.id+"\\:\\d+\\:\\w+$");
d(document.getElementById(this.id)).parent().find("tr[style='display: none;']").filter(function(){return this.id.match(p)
}).each(function(){if(this.rf){if(this.rf.component.isExpanded){d(document.getElementById(this.id)).parent().find(".rf-csttg-exp").filter(function(){return this.id.match(q)
}).each(function(){d(this).hide()
});
d(document.getElementById(this.id)).parent().find(".rf-csttg-colps").filter(function(){return this.id.match(o)
}).each(function(){d(this).show()
});
this.rf.component.collapse()
}}})
}this.setState(a.ui.CollapsibleSubTable.collapse);
j.call(this).hide()
},expand:function(n){this.setState(a.ui.CollapsibleSubTable.expand);
j.call(this).show()
},isExpanded:function(){return(parseInt(this.getState())==a.ui.CollapsibleSubTable.expand)
},__switchState:function(n){var o=this.isExpanded()?a.ui.CollapsibleSubTable.collapse:a.ui.CollapsibleSubTable.expand;
this.setState(o)
},getState:function(){return i.call(this).val()
},setState:function(n){i.call(this).val(n)
},setOption:function(n){e.call(this).val(n)
},getMode:function(){return this.expandMode
},destroy:function(){c.destroy.call(this)
}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(d,a){a.ui=a.ui||{};
a.ui.DataTable=function(e,g){c.constructor.call(this,e);
this.options=d.extend(this.options,g||{});
this.element=this.attachToDom();
var h=this;
var f=d(this.element).find(".rf-dt-thd");
f.find(".rf-dt-c-srt").each(function(){d(this).bind("click",{sortHandle:this},d.proxy(h.sortHandler,h))
});
f.find(".rf-dt-flt-i").each(function(){d(this).bind("blur",{filterHandle:this},d.proxy(h.filterHandler,h))
});
d(this.element).trigger("rich:ready",this)
};
a.BaseComponent.extend(a.ui.DataTable);
var c=a.ui.DataTable.$super;
d.extend(a.ui.DataTable,{SORTING:"rich:sorting",FILTERING:"rich:filtering",SUBTABLE_SELECTOR:".rf-cst"});
d.extend(a.ui.DataTable.prototype,(function(){var f=function(g,h){a.ajax(this.id,g,{parameters:h})
};
var e=function(i,g,l,m){var h={};
var j=this.id+i;
h[j]=(g+":"+(l||"")+":"+m);
var n=this.options.ajaxEventOption;
for(j in n){if(!h[j]){h[j]=n[j]
}}return h
};
return{name:"RichFaces.ui.DataTable",sort:function(h,g,i){f.call(this,null,e.call(this,a.ui.DataTable.SORTING,h,g,i))
},clearSorting:function(){this.sort("","",true)
},sortHandler:function(h){var l=d(h.data.sortHandle);
var j=l.find(".rf-dt-srt-btn");
var g=j.data("columnid");
var i=j.hasClass("rf-dt-srt-asc")?"descending":"ascending";
this.sort(g,i,false)
},filter:function(h,g,i){f.call(this,null,e.call(this,a.ui.DataTable.FILTERING,h,g,i))
},clearFiltering:function(){this.filter("","",true)
},filterHandler:function(i){var j=d(i.data.filterHandle);
var h=j.data("columnid");
var g=j.val();
this.filter(h,g,false)
},expandAllSubTables:function(){this.invokeOnSubTables("expand")
},collapseAllSubTables:function(){this.invokeOnSubTables("collapse")
},switchSubTable:function(g){this.getSubTable(g).switchState()
},getSubTable:function(g){return a.component(g)
},invokeOnSubTables:function(h){var i=d(document.getElementById(this.id)).children(a.ui.DataTable.SUBTABLE_SELECTOR);
var g=this.invokeOnComponent;
i.each(function(){if(this.firstChild&&this.firstChild[a.RICH_CONTAINER]&&this.firstChild[a.RICH_CONTAINER].component){var j=this.firstChild[a.RICH_CONTAINER].component;
if(j instanceof RichFaces.ui.CollapsibleSubTable){g(j,h)
}}})
},invokeOnSubTable:function(g,h){var i=this.getSubTable(g);
this.invokeOnComponent(i,h)
},invokeOnComponent:function(i,g){if(i){var h=i[g];
if(typeof h=="function"){h.call(i)
}}},contextMenuAttach:function(g){var h="[id='"+this.element.id+"'] ";
h+=(typeof g.options.targetSelector==="undefined")?".rf-dt-b td":g.options.targetSelector;
h=d.trim(h);
a.Event.bind(h,g.options.showEvent,d.proxy(g.__showHandler,g),g)
},destroy:function(){c.destroy.call(this)
}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(d,e){e.ui=e.ui||{};
e.ui.DragIndicator=function(f,g){c.constructor.call(this,f);
this.attachToDom(f);
this.indicator=d(document.getElementById(f));
this.options=g
};
var a={};
e.BaseComponent.extend(e.ui.DragIndicator);
var c=e.ui.DragIndicator.$super;
d.extend(e.ui.DragIndicator.prototype,(function(){return{show:function(){this.indicator.show()
},hide:function(){this.indicator.hide()
},getAcceptClass:function(){return this.options.acceptClass
},getRejectClass:function(){return this.options.rejectClass
},getDraggingClass:function(){return this.options.draggingClass
},getElement:function(){return this.indicator
}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(c,a){a.ui=a.ui||{};
a.ui.toolbarHandlers=function(h){if(h.id&&h.events){c(".rf-tb-itm",document.getElementById(h.id)).bind(h.events)
}var j=h.groups;
if(j&&j.length>0){var e;
var g;
for(g in j){e=j[g];
if(e){var i=e.ids;
var d;
var f=[];
for(d in i){f.push(document.getElementById(i[d]))
}c(f).bind(e.events)
}}}}
})(RichFaces.jQuery,RichFaces);
window.RichFaces=window.RichFaces||{};
RichFaces.jQuery=RichFaces.jQuery||window.jQuery;
(function(c,e){e.Event=e.Event||{};
var f=function(h){if(!h){throw"RichFaces.Event: empty selector"
}var g;
if(e.BaseComponent&&h instanceof e.BaseComponent){g=c(e.getDomElement(h.getEventElement()))
}else{g=c(h)
}return g
};
var d=function(h,g){return function(j,i){if(!j[e.RICH_CONTAINER]){j[e.RICH_CONTAINER]={data:i}
}return g.call(h||this,j,this,i)
}
};
var a=function(h,i){var j={};
for(var g in h){j[g]=d(i,h[g])
}return j
};
c.extend(e.Event,{RICH_NAMESPACE:"RICH",EVENT_NAMESPACE_SEPARATOR:".",MESSAGE_EVENT_TYPE:"onmessage",ready:function(g){return c(document).ready(g)
},bind:function(m,j,i,l,g){if(typeof j=="object"){f(m).bind(a(j,i),g)
}else{var h=d(l,i);
f(m).bind(j,g,h);
return h
}},bindById:function(g,l,j,m,h){if(typeof l=="object"){c(document.getElementById(g)).bind(a(l,j),h)
}else{var i=d(m,j);
c(document.getElementById(g)).bind(l,h,i)
}return i
},bindOne:function(m,j,i,l,g){var h=d(l,i);
f(m).one(j,g,h);
return h
},bindOneById:function(g,l,j,m,h){var i=d(m,j);
c(document.getElementById(g)).one(l,h,i);
return i
},unbind:function(i,h,g){return f(i).unbind(h,g)
},unbindById:function(g,i,h){return c(document.getElementById(g)).unbind(i,h)
},bindScrollEventHandlers:function(i,h,j){var g=[];
i=e.getDomElement(i).parentNode;
while(i&&i!=window.document.body){if(i.offsetWidth!=i.scrollWidth||i.offsetHeight!=i.scrollHeight){g.push(i);
e.Event.bind(i,"scroll"+j.getNamespace(),h,j)
}i=i.parentNode
}return g
},unbindScrollEventHandlers:function(g,h){e.Event.unbind(g,"scroll"+h.getNamespace())
},fire:function(j,i,g){var h=c.Event(i);
f(j).trigger(h,[g]);
return !h.isDefaultPrevented()
},fireById:function(g,j,h){var i=c.Event(j);
c(document.getElementById(g)).trigger(i,[h]);
return !i.isDefaultPrevented()
},callHandler:function(i,h,g){return f(i).triggerHandler(h,[g])
},callHandlerById:function(g,i,h){return c(document.getElementById(g)).triggerHandler(i,[h])
},createNamespace:function(i,g,h){var j=[];
j.push(h||e.Event.RICH_NAMESPACE);
if(i){j.push(i)
}if(g){j.push(g)
}return j.join(e.Event.EVENT_NAMESPACE_SEPARATOR)
}})
})(RichFaces.jQuery,RichFaces);
(function(d,e){e.ui=e.ui||{};
var a={useNative:false};
e.ui.Placeholder=e.BaseComponent.extendClass({name:"Placeholder",init:function(f,g){c.constructor.call(this,f);
g=d.extend({},a,g);
this.attachToDom(this.id);
d(function(){g.className="rf-plhdr "+((g.styleClass)?g.styleClass:"");
var h=(g.selector)?d(g.selector):d(document.getElementById(g.targetId));
var i=h.find("*").andSelf().filter(":editable");
i.watermark(g.text,g)
})
},destroy:function(){c.destroy.call(this)
}});
d(function(){d(document).on("ajaxsubmit","form",d.watermark.hideAll);
d(document).on("ajaxbegin","form",d.watermark.showAll);
d(document).on("reset","form",function(){setTimeout(d.watermark.showAll,0)
})
});
var c=e.ui.Placeholder.$super
})(RichFaces.jQuery,RichFaces);
(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a)
}else{if(typeof exports==="object"){module.exports=a
}else{a(jQuery)
}}}(function(c){var a=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],g=("onwheel" in document||document.documentMode>=9)?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice,h,d;
if(c.event.fixHooks){for(var m=a.length;
m;
){c.event.fixHooks[a[--m]]=c.event.mouseHooks
}}var l=c.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener){for(var n=g.length;
n;
){this.addEventListener(g[--n],f,false)
}}else{this.onmousewheel=f
}c.data(this,"mousewheel-line-height",l.getLineHeight(this));
c.data(this,"mousewheel-page-height",l.getPageHeight(this))
},teardown:function(){if(this.removeEventListener){for(var n=g.length;
n;
){this.removeEventListener(g[--n],f,false)
}}else{this.onmousewheel=null
}c.removeData(this,"mousewheel-line-height");
c.removeData(this,"mousewheel-page-height")
},getLineHeight:function(p){var n=c(p),o=n["offsetParent" in c.fn?"offsetParent":"parent"]();
if(!o.length){o=c("body")
}return parseInt(o.css("fontSize"),10)||parseInt(n.css("fontSize"),10)||16
},getPageHeight:function(n){return c(n).height()
},settings:{adjustOldDeltas:true,normalizeOffset:true}};
c.fn.extend({mousewheel:function(n){return n?this.bind("mousewheel",n):this.trigger("mousewheel")
},unmousewheel:function(n){return this.unbind("mousewheel",n)
}});
function f(z){var w=z||window.event,p=i.call(arguments,1),n=0,u=0,v=0,q=0,s=0,t=0;
z=c.event.fix(w);
z.type="mousewheel";
if("detail" in w){v=w.detail*-1
}if("wheelDelta" in w){v=w.wheelDelta
}if("wheelDeltaY" in w){v=w.wheelDeltaY
}if("wheelDeltaX" in w){u=w.wheelDeltaX*-1
}if("axis" in w&&w.axis===w.HORIZONTAL_AXIS){u=v*-1;
v=0
}n=v===0?u:v;
if("deltaY" in w){v=w.deltaY*-1;
n=v
}if("deltaX" in w){u=w.deltaX;
if(v===0){n=u*-1
}}if(v===0&&u===0){return
}if(w.deltaMode===1){var o=c.data(this,"mousewheel-line-height");
n*=o;
v*=o;
u*=o
}else{if(w.deltaMode===2){var x=c.data(this,"mousewheel-page-height");
n*=x;
v*=x;
u*=x
}}q=Math.max(Math.abs(v),Math.abs(u));
if(!d||q<d){d=q;
if(e(w,q)){d/=40
}}if(e(w,q)){n/=40;
u/=40;
v/=40
}n=Math[n>=1?"floor":"ceil"](n/d);
u=Math[u>=1?"floor":"ceil"](u/d);
v=Math[v>=1?"floor":"ceil"](v/d);
if(l.settings.normalizeOffset&&this.getBoundingClientRect){var y=this.getBoundingClientRect();
s=z.clientX-y.left;
t=z.clientY-y.top
}z.deltaX=u;
z.deltaY=v;
z.deltaFactor=d;
z.offsetX=s;
z.offsetY=t;
z.deltaMode=0;
p.unshift(z,n,u,v);
if(h){clearTimeout(h)
}h=setTimeout(j,200);
return(c.event.dispatch||c.event.handle).apply(this,p)
}function j(){d=null
}function e(o,n){return l.settings.adjustOldDeltas&&o.type==="mousewheel"&&n%120===0
}}));
(function(d,g){g.utils=g.utils||{};
g.utils.Cache=function(i,j,l,m){this.key=i.toLowerCase();
this.cache={};
this.cache[this.key]=j||[];
this.originalValues=typeof l=="function"?l(j):l||this.cache[this.key];
this.values=f(this.originalValues);
this.useCache=m||h.call(this)
};
var f=function(l){var i=[];
for(var j=0;
j<l.length;
j++){i.push(l[j].toLowerCase())
}return i
};
var h=function(){var j=true;
for(var i=0;
i<this.values.length;
i++){if(this.values[i].indexOf(this.key)!=0){j=false;
break
}}return j
};
var c=function(l,o){l=l.toLowerCase();
var n=[];
if(l.length<this.key.length){return n
}if(this.cache[l]){n=this.cache[l]
}else{var j=typeof o=="function";
var q=this.cache[this.key];
for(var m=0;
m<this.values.length;
m++){var i=this.values[m];
if(j&&o(l,i)){n.push(q[m])
}else{var p=i.indexOf(l);
if(p==0){n.push(q[m])
}}}if((!this.lastKey||l.indexOf(this.lastKey)!=0)&&n.length>0){this.cache[l]=n;
if(n.length==1){this.lastKey=l
}}}return n
};
var e=function(i){return this.originalValues[this.cache[this.key].index(i)]
};
var a=function(i){i=i.toLowerCase();
return this.cache[i]||this.useCache&&i.indexOf(this.key)==0
};
d.extend(g.utils.Cache.prototype,(function(){return{getItems:c,getItemValue:e,isCached:a}
})())
})(RichFaces.jQuery,RichFaces);
(function(d,e){e.ui=e.ui||{};
function a(f){this.comp=f
}a.prototype={exec:function(f,g){if(g.switchMode=="server"){return this.execServer(f,g)
}else{if(g.switchMode=="ajax"){return this.execAjax(f,g)
}else{if(g.switchMode=="client"){return this.execClient(f,g)
}else{e.log.error("SwitchItems.exec : unknown switchMode ("+this.comp.switchMode+")")
}}}},execServer:function(f,h){if(f){var g=f.__leave();
if(!g){return false
}}this.__setActiveItem(h.getName());
e.submitForm(this.__getParentForm());
return false
},execAjax:function(f,h){var g=d.extend({},this.comp.options.ajax,{});
this.__setActiveItem(h.getName());
e.ajax(this.comp.id,null,g);
if(f){this.__setActiveItem(f.getName())
}return false
},execClient:function(f,h){if(f){var g=f.__leave();
if(!g){return false
}}this.__setActiveItem(h.getName());
h.__enter();
this.comp.__fireItemChange(f,h);
return true
},__getParentForm:function(){return d(e.getDomElement(this.comp.id)).parents("form:first")
},__setActiveItem:function(f){e.getDomElement(this.__getValueInputId()).value=f;
this.comp.activeItem=f
},__getValueInputId:function(){return this.comp.id+"-value"
}};
e.ui.TogglePanel=e.BaseComponent.extendClass({name:"TogglePanel",init:function(f,g){c.constructor.call(this,f);
this.attachToDom();
this.items=[];
this.options=d.extend(this.options,g||{});
this.activeItem=this.options.activeItem;
this.__addUserEventHandler("itemchange");
this.__addUserEventHandler("beforeitemchange")
},getSelectItem:function(){return this.activeItem
},switchToItem:function(h){var i=this.getNextItem(h);
if(i==null){e.log.warn("TogglePanel.switchToItems("+h+"): item with name '"+h+"' not found");
return false
}var f=this.__getItemByName(this.getSelectItem());
var g=this.__fireBeforeItemChange(f,i);
if(!g){e.log.warn("TogglePanel.switchToItems("+h+"): switch has been canceled by beforeItemChange event");
return false
}return this.__itemsSwitcher().exec(f,i)
},getNextItem:function(f){if(f){var g=this.__ITEMS_META_NAMES[f];
if(g){return this.__getItem(g(this))
}else{return this.__getItemByName(f)
}}else{return this.__getItemByName(this.nextItem())
}},onCompleteHandler:function(h){var f=this.__getItemByName(this.activeItem);
var g=this.__getItemByName(h);
this.__itemsSwitcher().execClient(f,g);
d(document.getElementById(g.getTogglePanel().id)).trigger("resize")
},getItems:function(){return this.items
},getItemsNames:function(){var f=[];
for(var g=0;
g<this.items.length;
g++){f.push(this.items[g].getName())
}return f
},nextItem:function(f){var g=this.__getItemIndex(f||this.activeItem);
if(g==-1){return null
}return this.__getItemName(g+1)
},firstItem:function(){return this.__getItemName(0)
},lastItem:function(){return this.__getItemName(this.items.length-1)
},prevItem:function(f){var g=this.__getItemIndex(f||this.activeItem);
if(!this.options.cycledSwitching&&g<1){return null
}return this.__getItemName(g-1)
},__itemsSwitcher:function(){return new a(this)
},__ITEMS_META_NAMES:(function(){function f(j,g,h){var i=g;
while((!j.items[i]||j.items[i].disabled)&&i<j.items.length&&i>0){i+=h
}return i
}return{"@first":function(g){return f(g,0,1)
},"@prev":function(g){return f(g,parseInt(g.__getItemIndex(g.activeItem))-1,-1)
},"@next":function(g){return f(g,parseInt(g.__getItemIndex(g.activeItem))+1,1)
},"@last":function(g){return f(g,g.items.length-1,-1)
}}
})(),__getItemIndex:function(f){var g;
for(var h=0;
h<this.items.length;
h++){g=this.items[h];
if(!g.disabled&&g.getName()===f){return h
}}e.log.info("TogglePanel.getItemIndex: item with name '"+f+"' not found");
return -1
},__addUserEventHandler:function(g){var f=this.options["on"+g];
if(f){e.Event.bindById(this.id,g,f)
}},__getItem:function(g){if(this.options.cycledSwitching){var f=this.items.length;
return this.items[(f+g)%f]
}else{if(g>=0&&g<this.items.length){return this.items[g]
}else{return null
}}},__getItemByName:function(f){return this.__getItem(this.__getItemIndex(f))
},__getItemName:function(g){var f=this.__getItem(g);
if(f==null){return null
}return f.getName()
},__fireItemChange:function(f,g){return new e.Event.fireById(this.id,"itemchange",{id:this.id,oldItem:f,newItem:g})
},__fireBeforeItemChange:function(f,g){return e.Event.fireById(this.id,"beforeitemchange",{id:this.id,oldItem:f,newItem:g})
}});
var c=e.ui.TogglePanel.$super
})(RichFaces.jQuery,RichFaces);
(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a)
}else{a(jQuery)
}}(function(a){a.ui=a.ui||{};
a.extend(a.ui,{version:"1.11.2",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}});
a.fn.extend({scrollParent:function(g){var h=this.css("position"),i=h==="absolute",f=g?/(auto|scroll|hidden)/:/(auto|scroll)/,e=this.parents().filter(function(){var j=a(this);
if(i&&j.css("position")==="static"){return false
}return f.test(j.css("overflow")+j.css("overflow-y")+j.css("overflow-x"))
}).eq(0);
return h==="fixed"||!e.length?a(this[0].ownerDocument||document):e
},uniqueId:(function(){var e=0;
return function(){return this.each(function(){if(!this.id){this.id="ui-id-"+(++e)
}})
}
})(),removeUniqueId:function(){return this.each(function(){if(/^ui-id-\d+$/.test(this.id)){a(this).removeAttr("id")
}})
}});
function c(h,j){var f,g,i,e=h.nodeName.toLowerCase();
if("area"===e){f=h.parentNode;
g=f.name;
if(!h.href||!g||f.nodeName.toLowerCase()!=="map"){return false
}i=a("img[usemap='#"+g+"']")[0];
return !!i&&d(i)
}return(/input|select|textarea|button|object/.test(e)?!h.disabled:"a"===e?h.href||j:j)&&d(h)
}function d(e){return a.expr.filters.visible(e)&&!a(e).parents().addBack().filter(function(){return a.css(this,"visibility")==="hidden"
}).length
}a.extend(a.expr[":"],{data:a.expr.createPseudo?a.expr.createPseudo(function(e){return function(f){return !!a.data(f,e)
}
}):function(e,f,g){return !!a.data(e,g[3])
},focusable:function(e){return c(e,!isNaN(a.attr(e,"tabindex")))
},tabbable:function(e){var g=a.attr(e,"tabindex"),f=isNaN(g);
return(f||g>=0)&&c(e,!f)
}});
if(!a("<a>").outerWidth(1).jquery){a.each(["Width","Height"],function(h,j){var i=j==="Width"?["Left","Right"]:["Top","Bottom"],g=j.toLowerCase(),e={innerWidth:a.fn.innerWidth,innerHeight:a.fn.innerHeight,outerWidth:a.fn.outerWidth,outerHeight:a.fn.outerHeight};
function f(l,m,n,o){a.each(i,function(){m-=parseFloat(a.css(l,"padding"+this))||0;
if(n){m-=parseFloat(a.css(l,"border"+this+"Width"))||0
}if(o){m-=parseFloat(a.css(l,"margin"+this))||0
}});
return m
}a.fn["inner"+j]=function(l){if(l===undefined){return e["inner"+j].call(this)
}return this.each(function(){a(this).css(g,f(this,l)+"px")
})
};
a.fn["outer"+j]=function(m,l){if(typeof m!=="number"){return e["outer"+j].call(this,m)
}return this.each(function(){a(this).css(g,f(this,m,true,l)+"px")
})
}
})
}if(!a.fn.addBack){a.fn.addBack=function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))
}
}if(a("<a>").data("a-b","a").removeData("a-b").data("a-b")){a.fn.removeData=(function(e){return function(f){if(arguments.length){return e.call(this,a.camelCase(f))
}else{return e.call(this)
}}
})(a.fn.removeData)
}a.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
a.fn.extend({focus:(function(e){return function(g,f){return typeof g==="number"?this.each(function(){var h=this;
setTimeout(function(){a(h).focus();
if(f){f.call(h)
}},g)
}):e.apply(this,arguments)
}
})(a.fn.focus),disableSelection:(function(){var e="onselectstart" in document.createElement("div")?"selectstart":"mousedown";
return function(){return this.bind(e+".ui-disableSelection",function(f){f.preventDefault()
})
}
})(),enableSelection:function(){return this.unbind(".ui-disableSelection")
},zIndex:function(e){if(e!==undefined){return this.css("zIndex",e)
}if(this.length){var g=a(this[0]),h,f;
while(g.length&&g[0]!==document){h=g.css("position");
if(h==="absolute"||h==="relative"||h==="fixed"){f=parseInt(g.css("zIndex"),10);
if(!isNaN(f)&&f!==0){return f
}}g=g.parent()
}}return 0
}});
a.ui.plugin={add:function(h,g,e){var i,f=a.ui[h].prototype;
for(i in e){f.plugins[i]=f.plugins[i]||[];
f.plugins[i].push([g,e[i]])
}},call:function(j,g,h,i){var f,e=j.plugins[g];
if(!e){return
}if(!i&&(!j.element[0].parentNode||j.element[0].parentNode.nodeType===11)){return
}for(f=0;
f<e.length;
f++){if(j.options[e[f][0]]){e[f][1].apply(j.element,h)
}}}}
}));
(function(c,a){a.ui=a.ui||{};
a.ui.CollapsibleSubTableToggler=function(d,e){this.id=d;
this.eventName=e.eventName;
this.expandedControl=e.expandedControl;
this.collapsedControl=e.collapsedControl;
this.forId=e.forId;
this.element=c(document.getElementById(this.id));
if(this.element&&this.eventName){this.element.bind(this.eventName,c.proxy(this.switchState,this))
}};
c.extend(a.ui.CollapsibleSubTableToggler.prototype,(function(){var d=function(e){return c(document.getElementById(e))
};
return{switchState:function(f){var g=a.component(this.forId);
if(g){var e=g.getMode();
if(a.ui.CollapsibleSubTable.MODE_CLNT==e){this.toggleControl(g.isExpanded())
}g.setOption(this.id);
g.switchState(f)
}},toggleControl:function(e){var g=d(this.expandedControl);
var f=d(this.collapsedControl);
if(e){g.hide();
f.show()
}else{f.hide();
g.show()
}}}
})())
})(RichFaces.jQuery,window.RichFaces);
JSNode=function(){};
JSNode.prototype={tag:null,attrs:{},childs:[],value:"",_symbols:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;","\u00A0":"&nbsp;"},getInnerHTML:function(c){var d=[];
for(var a=0;
a<this.childs.length;
a++){d.push(this.childs[a].getContent(c))
}return d.join("")
},xmlEscape:function(a){return RichFaces.jQuery("<div></div>").text(a).html()
}};
E=function(c,a,d){this.tag=c;
if(a){this.attrs=a
}if(d){this.childs=d
}};
E.prototype=new JSNode();
E.prototype.getContent=function(d){var e="<"+this.tag;
var a=this.getInnerHTML(d);
if(a==""){this.isEmpty=true
}else{this.isEmpty=false
}for(var f in this.attrs){if(!this.attrs.hasOwnProperty(f)){continue
}var c=this.attrs[f];
if(typeof c=="function"){c=c.call(this,d)
}if(c){e+=" "+(f=="className"?"class":f)+'="'+this.xmlEscape(c)+'"'
}}e+=">"+a+"</"+this.tag+">";
return e
};
ET=function(a){this.value=a
};
ET.prototype.getContent=function(a){var c=this.value;
if(typeof c=="function"){c=c(a)
}if(c&&c.getContent){c=c.getContent(a)
}if(c){return c
}return""
};
T=function(a){this.value=a
};
T.prototype=new JSNode();
T.prototype.getContent=function(a){var c=this.value;
if(typeof c=="function"){c=c(a)
}if(c){return this.xmlEscape(c)
}return""
};
C=function(a){this.value=a
};
C.prototype.getContent=function(a){return"<!--"+this.value+"-->"
};
D=function(a){this.value=a
};
D.prototype.getContent=function(a){return"<![CDATA["+this.value+"]]>"
};
(function(o,g){var a="__NEW_NODE_TOGGLE_STATE";
var c="__TRIGGER_NODE_AJAX_UPDATE";
var h="__SELECTION_STATE";
var j=["rf-tr-nd-colps","rf-tr-nd-exp"];
var e=["rf-trn-hnd-colps","rf-trn-hnd-exp"];
var d=["rf-trn-ico-colps","rf-trn-ico-exp"];
g.ui=g.ui||{};
g.ui.TreeNode=g.BaseComponent.extendClass({name:"TreeNode",init:function(p,q){m.constructor.call(this,p);
this.__rootElt=o(this.attachToDom());
this.__children=new Array();
this.__initializeChildren(q);
var s=(q.clientEventHandlers||{})[this.getId().substring(q.treeId.length)]||{};
if(s.bth){g.Event.bind(this.__rootElt,"beforetoggle",new Function("event",s.bth))
}if(s.th){g.Event.bind(this.__rootElt,"toggle",new Function("event",s.th))
}this.__addLastNodeClass()
},destroy:function(){if(this.parent){this.parent.removeChild(this);
this.parent=null
}this.__clientToggleStateInput=null;
this.__clearChildren();
this.__rootElt=null;
m.destroy.call(this)
},__initializeChildren:function(q){var p=this;
this.__rootElt.children(".rf-tr-nd").each(function(){p.addChild(new g.ui.TreeNode(this,q))
})
},__addLastNodeClass:function(){if(this.__rootElt.next("div").length==0){this.__rootElt.addClass("rf-tr-nd-last")
}},__getNodeContainer:function(){return this.__rootElt.find(" > .rf-trn:first")
},__getHandle:function(){return this.__getNodeContainer().find(" > .rf-trn-hnd:first")
},__getContent:function(){return this.__getNodeContainer().find(" > .rf-trn-cnt:first")
},__getIcons:function(){return this.__getContent().find(" > .rf-trn-ico")
},getParent:function(){return this.__parent
},setParent:function(p){this.__parent=p
},addChild:function(p,s){var q;
if(typeof s!="undefined"){q=s
}else{q=this.__children.length
}this.__children.splice(q,0,p);
p.setParent(this)
},removeChild:function(p){if(this.__children.length){var t=this.__children.indexOf(p);
if(t!=-1){var s=this.__children.splice(t,1);
if(s){for(var q=0;
q<s.length;
q++){s[q].setParent(undefined)
}}}}},__clearChildren:function(){for(var p=0;
p<this.__children.length;
p++){this.__children[p].setParent(undefined)
}this.__children=new Array()
},isExpanded:function(){return !this.isLeaf()&&this.__rootElt.hasClass("rf-tr-nd-exp")
},isCollapsed:function(){return !this.isLeaf()&&this.__rootElt.hasClass("rf-tr-nd-colps")
},isLeaf:function(){return this.__rootElt.hasClass("rf-tr-nd-lf")
},__canBeToggled:function(){return !this.isLeaf()&&!this.__rootElt.hasClass("rf-tr-nd-exp-nc")&&!this.__loading
},toggle:function(){if(!this.__canBeToggled()){return
}if(this.isCollapsed()){this.expand()
}else{this.collapse()
}},__updateClientToggleStateInput:function(p){if(!this.__clientToggleStateInput){this.__clientToggleStateInput=o("<input type='hidden' />").appendTo(this.__rootElt).attr({name:this.getId()+a})
}this.__clientToggleStateInput.val(p.toString())
},__fireBeforeToggleEvent:function(){return g.Event.callHandler(this.__rootElt,"beforetoggle")
},__fireToggleEvent:function(){g.Event.callHandler(this.__rootElt,"toggle")
},__makeLoading:function(){this.__loading=true;
this.__getNodeContainer().addClass("rf-trn-ldn")
},__resetLoading:function(){this.__loading=false;
this.__getNodeContainer().removeClass("rf-trn-ldn")
},__changeToggleState:function(p){if(!this.isLeaf()){if(p^this.isExpanded()){if(this.__fireBeforeToggleEvent()===false){return
}var s=this.getTree();
switch(s.getToggleType()){case"client":this.__rootElt.addClass(j[p?1:0]).removeClass(j[!p?1:0]);
this.__getHandle().addClass(e[p?1:0]).removeClass(e[!p?1:0]);
var q=this.__getIcons();
if(q.length==1){q.addClass(d[p?1:0]).removeClass(d[!p?1:0])
}this.__updateClientToggleStateInput(p);
this.__fireToggleEvent();
break;
case"ajax":case"server":s.__sendToggleRequest(null,this,p);
break
}}}},collapse:function(){this.__changeToggleState(false)
},expand:function(){this.__changeToggleState(true)
},__setSelected:function(p){var q=this.__getContent();
if(p){q.addClass("rf-trn-sel")
}else{q.removeClass("rf-trn-sel")
}this.__selected=p
},isSelected:function(){return this.__selected
},getTree:function(){return this.getParent().getTree()
},getId:function(){return this.__rootElt.attr("id")
}});
var m=g.ui.TreeNode.$super;
g.ui.TreeNode.initNodeByAjax=function(x,v){var w=o(document.getElementById(x));
var y=v||{};
var s=w.parent(".rf-tr-nd, .rf-tr");
var q=w.prevAll(".rf-tr-nd").length;
var u=g.component(s[0]);
y.treeId=u.getTree().getId();
var t=new g.ui.TreeNode(w[0],y);
u.addChild(t,q);
var p=u.getTree();
if(p.getSelection().contains(t.getId())){t.__setSelected(true)
}};
g.ui.TreeNode.emitToggleEvent=function(p){var q=document.getElementById(p);
if(!q){return
}g.component(q).__fireToggleEvent()
};
var f=function(p){return g.component(o(p).closest(".rf-tr"))
};
var i=function(p){return g.component(o(p).closest(".rf-tr-nd"))
};
var n=function(q,p){return q!=f(p)
};
g.ui.Tree=g.ui.TreeNode.extendClass({name:"Tree",init:function(p,s){this.__treeRootElt=o(g.getDomElement(p));
var q={};
q.clientEventHandlers=s.clientEventHandlers||{};
q.treeId=p;
l.constructor.call(this,this.__treeRootElt,q);
this.__toggleType=s.toggleType||"ajax";
this.__selectionType=s.selectionType||"client";
if(s.ajaxSubmitFunction){this.__ajaxSubmitFunction=new Function("event","source","params","complete",s.ajaxSubmitFunction)
}if(s.onbeforeselectionchange){g.Event.bind(this.__treeRootElt,"beforeselectionchange",new Function("event",s.onbeforeselectionchange))
}if(s.onselectionchange){g.Event.bind(this.__treeRootElt,"selectionchange",new Function("event",s.onselectionchange))
}this.__toggleNodeEvent=s.toggleNodeEvent;
if(this.__toggleNodeEvent){this.__treeRootElt.delegate(".rf-trn",this.__toggleNodeEvent,this,this.__nodeToggleActivated)
}if(!this.__toggleNodeEvent||this.__toggleNodeEvent!="click"){this.__treeRootElt.delegate(".rf-trn-hnd","click",this,this.__nodeToggleActivated)
}this.__treeRootElt.delegate(".rf-trn-cnt","mousedown",this,this.__nodeSelectionActivated);
this.__findSelectionInput();
this.__selection=new g.ui.TreeNodeSet(this.__selectionInput.val());
o(document).ready(o.proxy(this.__updateSelectionFromInput,this))
},__findSelectionInput:function(){this.__selectionInput=o(" > .rf-tr-sel-inp",this.__treeRootElt)
},__addLastNodeClass:function(){},destroy:function(){if(this.__toggleNodeEvent){this.__treeRootElt.undelegate(".rf-trn",this.__toggleNodeEvent,this,this.__nodeToggleActivated)
}if(!this.__toggleNodeEvent||this.__toggleNodeEvent!="click"){this.__treeRootElt.undelegate(".rf-trn-hnd","click",this,this.__nodeToggleActivated)
}this.__treeRootElt.undelegate(".rf-trn-cnt","mousedown",this.__nodeSelectionActivated);
this.__treeRootElt=null;
this.__selectionInput=null;
this.__ajaxSubmitFunction=null;
l.destroy.call(this)
},__nodeToggleActivated:function(q){var s=q.data;
if(n(s,this)){return
}var p=i(this);
p.toggle()
},__nodeSelectionActivated:function(q){var s=q.data;
if(n(s,this)){return
}var p=i(this);
if(q.ctrlKey){s.__toggleSelection(p)
}else{s.__addToSelection(p)
}},__sendToggleRequest:function(q,u,p){var t=u.getId();
var v={};
v[t+a]=p;
if(this.getToggleType()=="server"){var s=this.__treeRootElt.closest("form");
g.submitForm(s,v)
}else{u.__makeLoading();
v[t+c]=p;
this.__ajaxSubmitFunction(q,t,v,function(){var w=g.component(t);
if(w){w.__resetLoading()
}})
}},getToggleType:function(){return this.__toggleType
},getSelectionType:function(){return this.__selectionType
},getTree:function(){return this
},__handleSelectionChange:function(q){var p={oldSelection:this.getSelection().getNodes(),newSelection:q.getNodes()};
if(g.Event.callHandler(this.__treeRootElt,"beforeselectionchange",p)===false){return
}this.__selectionInput.val(q.getNodeString());
if(this.getSelectionType()=="client"){this.__updateSelection(q)
}else{this.__ajaxSubmitFunction(null,this.getId())
}},__toggleSelection:function(p){var q=this.getSelection().cloneAndToggle(p);
this.__handleSelectionChange(q)
},__addToSelection:function(p){var q=this.getSelection().cloneAndAdd(p);
this.__handleSelectionChange(q)
},__updateSelectionFromInput:function(){this.__findSelectionInput();
this.__updateSelection(new g.ui.TreeNodeSet(this.__selectionInput.val()))
},__updateSelection:function(q){var p=this.getSelection();
p.each(function(){this.__setSelected(false)
});
q.each(function(){this.__setSelected(true)
});
if(p.getNodeString()!=q.getNodeString()){g.Event.callHandler(this.__treeRootElt,"selectionchange",{oldSelection:p.getNodes(),newSelection:q.getNodes()})
}this.__selection=q
},getSelection:function(){return this.__selection
},contextMenuAttach:function(p){var q="[id='"+this.id[0].id+"'] ";
q+=(typeof p.options.targetSelector==="undefined")?".rf-trn-cnt":p.options.targetSelector;
q=o.trim(q);
g.Event.bind(q,p.options.showEvent,o.proxy(p.__showHandler,p),p)
}});
var l=g.ui.Tree.$super;
g.ui.TreeNodeSet=function(){this.init.apply(this,arguments)
};
o.extend(g.ui.TreeNodeSet.prototype,{init:function(p){this.__nodeId=p
},contains:function(p){if(p.getId){return this.__nodeId==p.getId()
}else{return this.__nodeId==p
}},getNodeString:function(){return this.__nodeId
},toString:function(){return this.getNodeString()
},getNodes:function(){if(this.__nodeId){var p=g.component(this.__nodeId);
if(p){return[p]
}else{return null
}}return[]
},cloneAndAdd:function(p){return new g.ui.TreeNodeSet(p.getId())
},cloneAndToggle:function(q){var p;
if(this.contains(q)){p=""
}else{p=q.getId()
}return new g.ui.TreeNodeSet(p)
},each:function(p){o.each(this.getNodes()||[],p)
}})
}(RichFaces.jQuery,RichFaces));
(function(d,e){e.ui=e.ui||{};
var a={expandSingle:true,bubbleSelection:true};
e.ui.PanelMenu=e.BaseComponent.extendClass({name:"PanelMenu",init:function(f,g){c.constructor.call(this,f);
this.items={};
this.attachToDom();
this.options=d.extend(this.options,a,g||{});
this.activeItem=this.__getValueInput().value;
this.nestingLevel=0;
this.__addUserEventHandler("collapse");
this.__addUserEventHandler("expand")
},addItem:function(f){this.items[f.itemName]=f
},deleteItem:function(f){delete this.items[f.itemName]
},getSelectedItem:function(){return this.getItem(this.selectedItem())
},getItem:function(f){return this.items[f]
},selectItem:function(f){},selectedItem:function(f){if(typeof f!="undefined"){var g=this.__getValueInput();
var j=g.value;
this.activeItem=f;
g.value=f;
for(var h in this.items){var i=this.items[h];
if(i.__isSelected()){i.__unselect()
}}return j
}else{return this.activeItem
}},__getValueInput:function(){return document.getElementById(this.id+"-value")
},expandAll:function(){},collapseAll:function(){},expandGroup:function(f){},collapseGroup:function(f){},__panelMenu:function(){return d(e.getDomElement(this.id))
},__childGroups:function(){return this.__panelMenu().children(".rf-pm-top-gr")
},__addUserEventHandler:function(g){var f=this.options["on"+g];
if(f){e.Event.bindById(this.id,g,f)
}},__isActiveItem:function(f){return f.itemName==this.activeItem
},__collapseGroups:function(g){var f=g.__rfTopGroup();
this.__childGroups().each(function(i,h){if(h.id!=g.getEventElement()&&(!f||h.id!=f.id)){e.component(h).__collapse()
}})
},destroy:function(){e.Event.unbindById(this.id,"."+this.namespace);
c.destroy.call(this)
}});
var c=e.ui.PanelMenu.$super
})(RichFaces.jQuery,RichFaces);
(function(d,e){var g={charttype:"",xtype:"",ytype:"",zoom:false,grid:{clickable:true,hoverable:true},tooltip:true,tooltipOpts:{content:"%s  [%x,%y]",shifts:{x:20,y:0},defaultTheme:false},legend:{postion:"ne",sorted:"ascending"},xaxis:{min:null,max:null,autoscaleMargin:null,axisLabel:""},yaxis:{min:null,max:null,autoscaleMargin:0.2,axisLabel:""},data:[]};
var a={series:{pie:{show:true}},tooltipOpts:{content:" %p.0%, %s"}};
var f=function(i,j){var h={};
h[j+"name"]="plotclick";
h[j+"seriesIndex"]=i.data.seriesIndex;
h[j+"dataIndex"]=i.data.dataIndex;
h[j+"x"]=i.data.x;
h[j+"y"]=i.data.y;
e.ajax(j,i,{parameters:h,incId:1})
};
e.ui=e.ui||{};
e.ui.Chart=e.BaseComponent.extendClass({name:"Chart",init:function(i,j){c.constructor.call(this,i,j);
this.namespace=this.namespace||"."+RichFaces.Event.createNamespace(this.name,this.id);
this.attachToDom();
this.options=d.extend(true,{},g,j);
this.element=d(document.getElementById(i));
this.chartElement=this.element.find(".chart");
if(this.options.charttype==="pie"){this.options=d.extend(true,{},this.options,a);
this.options.data=this.options.data[0]
}else{if(this.options.charttype==="bar"){if(this.options.xtype==="string"){this.options.xaxis.tickLength=0;
var m=this.options.data[0].data.length,p=this.options.data.length,o=[],n=false;
this.options.bars=this.options.bars||{};
this.options.bars.barWidth=1/(p+1);
for(var h=0;
h<m;
h++){o.push([h,this.options.data[0].data[h][0]]);
for(var l=0;
l<p;
l++){this.options.data[l].data[h][0]=h;
if(!n){this.options.data[l].bars.order=l
}}n=true
}this.options.xaxis.ticks=o
}}else{if(j.charttype==="line"){if(this.options.xtype==="string"){this.options.xaxis.tickLength=0;
var m=this.options.data[0].data.length,p=this.options.data.length,o=[];
for(var h=0;
h<m;
h++){o.push([h,this.options.data[0].data[h][0]]);
for(var l=0;
l<p;
l++){this.options.data[l].data[h][0]=h
}}this.options.xaxis.ticks=o
}if(j.zoom){this.options.selection={mode:"xy"}
}if(this.options.xtype==="date"){this.options=d.extend({},this.options,dateDefaults);
if(this.options.xaxis.format){this.options.xaxis.timeformat=this.options.xaxis.format
}}}}}this.plot=d.plot(this.chartElement,this.options.data,this.options);
this.__bindEventHandlers(this.chartElement,this.options)
},getPlotObject:function(){return this.plot
},highlight:function(i,h){this.plot.highlight(i,h)
},unhighlight:function(i,h){this.plot.unhighlight(i,h)
},__bindEventHandlers:function(h,i){this.chartElement.on("plotclick",this._getPlotClickHandler(this.options,this.chartElement,f));
this.chartElement.on("plothover",this._getPlotHoverHandler(this.options,this.chartElement));
if(this.options.handlers&&this.options.handlers.onmouseout){this.chartElement.on("mouseout",this.options.handlers.onmouseout)
}if(this.options.zoom){this.chartElement.on("plotselected",d.proxy(this._zoomFunction,this))
}},_getPlotClickHandler:function(l,j,i){var h=l.handlers.onplotclick;
var m=l.particularSeriesHandlers.onplotclick;
var n=this.element.attr("id");
return function(o,q,p){if(p!==null){o.data={seriesIndex:p.seriesIndex,dataIndex:p.dataIndex,x:p.datapoint[0],y:p.datapoint[1],item:p};
if(l.charttype=="pie"){o.data.x=l.data[p.seriesIndex].label;
o.data.y=p.datapoint[1][0][1]
}else{if(l.charttype=="bar"&&l.xtype=="string"){o.data.x=l.xaxis.ticks[p.dataIndex][1]
}}if(l.serverSideListener){if(i){i(o,n)
}}if(h){h.call(j,o)
}if(m[o.data.seriesIndex]){m[o.data.seriesIndex].call(j,o)
}}}
},_getPlotHoverHandler:function(l,i){var j=l.handlers.onplothover;
var h=l.particularSeriesHandlers.onplothover;
return function(o,n,m){if(m!==null){o.data={seriesIndex:m.seriesIndex,dataIndex:m.dataIndex,x:m.datapoint[0],y:m.datapoint[1],item:m};
if(j){j.call(i,o)
}if(h[o.data.seriesIndex]){h[o.data.seriesIndex].call(i,o)
}}}
},_zoomFunction:function(i,j){var h=this.getPlotObject();
d.each(h.getXAxes(),function(n,m){var l=m.options;
l.min=j.xaxis.from;
l.max=j.xaxis.to
});
h.setupGrid();
h.draw();
h.clearSelection()
},resetZoom:function(){this.plot=d.plot(this.chartElement,this.options.data,this.options)
},destroy:function(){e.Event.unbindById(this.id,"."+this.namespace);
c.destroy.call(this)
}});
var c=e.ui.Chart.$super
})(RichFaces.jQuery,RichFaces);
(function(d,a){a.ui=a.ui||{};
a.ui.InputNumberSpinner=a.BaseComponent.extendClass({name:"InputNumberSpinner",cycled:true,delay:200,maxValue:100,minValue:0,step:1,init:function(e,i){c.constructor.call(this,e);
d.extend(this,i);
this.element=d(this.attachToDom());
this.input=this.element.children(".rf-insp-inp");
var g=Number(this.input.val());
if(isNaN(g)){g=this.minValue
}this.__setValue(g,null,true);
if(!this.input.attr("disabled")){var f=this.element.children(".rf-insp-btns");
this.decreaseButton=f.children(".rf-insp-dec");
this.increaseButton=f.children(".rf-insp-inc");
var h=d.proxy(this.__inputHandler,this);
this.input.change(h);
this.input.submit(h);
this.input.submit(h);
this.input.mousewheel(d.proxy(this.__mousewheelHandler,this));
this.input.keydown(d.proxy(this.__keydownHandler,this));
this.decreaseButton.mousedown(d.proxy(this.__decreaseHandler,this));
this.increaseButton.mousedown(d.proxy(this.__increaseHandler,this))
}},decrease:function(f){var e=this.value-this.step;
e=this.roundFloat(e);
if(e<this.minValue&&this.cycled){e=this.maxValue
}this.__setValue(e,f)
},increase:function(f){var e=this.value+this.step;
e=this.roundFloat(e);
if(e>this.maxValue&&this.cycled){e=this.minValue
}this.__setValue(e,f)
},getValue:function(){return this.value
},setValue:function(e,f){if(!this.input.attr("disabled")){this.__setValue(e)
}},roundFloat:function(h){var e=this.step.toString();
var f=0;
if(!/\./.test(e)){if(this.step>=1){return h
}if(/e/.test(e)){f=e.split("-")[1]
}}else{f=e.length-e.indexOf(".")-1
}var g=h.toFixed(f);
return parseFloat(g)
},destroy:function(e){if(this.intervalId){window.clearInterval(this.intervalId);
this.decreaseButton.css("backgroundPosition"," 50% 40%").unbind("mouseout",this.destroy).unbind("mouseup",this.destroy);
this.increaseButton.css("backgroundPosition"," 50% 40%").unbind("mouseout",this.destroy).unbind("mouseup",this.destroy);
this.intervalId=null
}c.destroy.call(this)
},__setValue:function(f,g,e){if(!isNaN(f)){if(f>this.maxValue){f=this.maxValue;
this.input.val(f)
}else{if(f<this.minValue){f=this.minValue;
this.input.val(f)
}}if(f!=this.value){this.input.val(f);
this.value=f;
if(this.onchange&&!e){this.onchange.call(this.element[0],g)
}}}},__inputHandler:function(f){var e=Number(this.input.val());
if(isNaN(e)){this.input.val(this.value)
}else{this.__setValue(e,f)
}},__mousewheelHandler:function(f,e,g,h){e=g||h;
if(e>0){this.increase(f)
}else{if(e<0){this.decrease(f)
}}return false
},__keydownHandler:function(e){if(e.keyCode==40){this.decrease(e);
e.preventDefault()
}else{if(e.keyCode==38){this.increase(e);
e.preventDefault()
}}},__decreaseHandler:function(e){var g=this;
g.decrease(e);
this.intervalId=window.setInterval(function(){g.decrease(e)
},this.delay);
var f=d.proxy(this.destroy,this);
this.decreaseButton.bind("mouseup",f).bind("mouseout",f).css("backgroundPosition","60% 60%");
e.preventDefault()
},__increaseHandler:function(e){var g=this;
g.increase(e);
this.intervalId=window.setInterval(function(){g.increase(e)
},this.delay);
var f=d.proxy(this.destroy,this);
this.increaseButton.bind("mouseup",f).bind("mouseout",f).css("backgroundPosition","60% 60%");
e.preventDefault()
}});
var c=a.ui.InputNumberSpinner.$super
}(RichFaces.jQuery,window.RichFaces));
(function(e,g){g.ui=g.ui||{};
g.ui.NotifyMessage=function(j,l,m){c.constructor.call(this,j,l,a);
this.notifyOptions=m
};
g.ui.Base.extend(g.ui.NotifyMessage);
var c=g.ui.NotifyMessage.$super;
var a={showSummary:true,level:0,isMessages:false,globalOnly:false};
var d=function(l,n,o){var j=o.sourceId;
var m=o.message;
if(!this.options.forComponentId){if(!this.options.globalOnly&&m){f.call(this,j,m)
}}else{if(this.options.forComponentId===j){f.call(this,j,m)
}}};
var f=function(l,j){if(j&&j.severity>=this.options.level){h.call(this,j)
}};
var h=function(j){g.ui.Notify(e.extend({},this.notifyOptions,{summary:this.options.showSummary?j.summary:undefined,detail:this.options.showDetail?j.detail:undefined,severity:j.severity}))
};
var i=function(){g.Event.bind(window.document,g.Event.MESSAGE_EVENT_TYPE+this.namespace,d,this)
};
e.extend(g.ui.NotifyMessage.prototype,{name:"NotifyMessage",__bindEventHandlers:i,destroy:function(){g.Event.unbind(window.document,g.Event.MESSAGE_EVENT_TYPE+this.namespace);
c.destroy.call(this)
}})
})(RichFaces.jQuery,window.RichFaces||(window.RichFaces={}));
(function(a,h){h.ui=h.ui||{};
h.ui.FileUpload=function(o,q){this.id=o;
this.items=[];
this.submitedItems=[];
a.extend(this,q);
if(this.acceptedTypes){this.acceptedTypes=a.trim(this.acceptedTypes).toUpperCase().split(/\s*,\s*/)
}if(this.maxFilesQuantity){this.maxFilesQuantity=parseInt(a.trim(this.maxFilesQuantity))
}this.element=a(this.attachToDom());
this.form=this.element.parents("form:first");
var p=this.element.children(".rf-fu-hdr:first");
var n=p.children(".rf-fu-btns-lft:first");
this.addButton=n.children(".rf-fu-btn-add:first");
this.uploadButton=this.addButton.next();
this.clearButton=n.next().children(".rf-fu-btn-clr:first");
this.inputContainer=this.addButton.find(".rf-fu-inp-cntr:first");
this.input=this.inputContainer.children("input");
this.list=p.next();
this.element.bind("dragenter",function(s){s.stopPropagation();
s.preventDefault()
});
this.element.bind("dragover",function(s){s.stopPropagation();
s.preventDefault()
});
this.element.bind("drop",a.proxy(this.__addItemsFromDrop,this));
this.hiddenContainer=this.list.next();
this.cleanInput=this.input.clone();
this.addProxy=a.proxy(this.__addItems,this);
this.input.change(this.addProxy);
this.addButton.mousedown(m).mouseup(i).mouseout(i);
this.uploadButton.click(a.proxy(this.__startUpload,this)).mousedown(m).mouseup(i).mouseout(i);
this.clearButton.click(a.proxy(this.__removeAllItems,this)).mousedown(m).mouseup(i).mouseout(i);
if(this.onfilesubmit){h.Event.bind(this.element,"onfilesubmit",new Function("event",this.onfilesubmit))
}if(this.ontyperejected){h.Event.bind(this.element,"ontyperejected",new Function("event",this.ontyperejected))
}if(this.onuploadcomplete){h.Event.bind(this.element,"onuploadcomplete",new Function("event",this.onuploadcomplete))
}if(this.onclear){h.Event.bind(this.element,"onclear",new Function("event",this.onclear))
}if(this.onfileselect){h.Event.bind(this.element,"onfileselect",new Function("event",this.onfileselect))
}};
var e="rf_fu_uid";
var g="rf_fu_uid_alt";
var f="C:\\fakepath\\";
var j='<div class="rf-fu-itm"><span class="rf-fu-itm-lft"><span class="rf-fu-itm-lbl"/><span class="rf-fu-itm-st" /><div class="progress progress-striped active"><div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"><span></span></div></div></span><span class="rf-fu-itm-rgh"><a href="javascript:void(0)" class="rf-fu-itm-lnk"/></span></div>';
var l={NEW:"new",UPLOADING:"uploading",DONE:"done",SIZE_EXCEEDED:"sizeExceeded",STOPPED:"stopped",SERVER_ERROR_PROCESS:"serverErrorProc",SERVER_ERROR_UPLOAD:"serverErrorUp"};
var m=function(n){a(this).children(":first").css("background-position","3px 3px").css("padding","4px 4px 2px 22px")
};
var i=function(n){a(this).children(":first").css("background-position","2px 2px").css("padding","3px 5px 3px 21px")
};
h.BaseComponent.extend(h.ui.FileUpload);
function d(n){this.name="TypeRejectedException";
this.message="The type of file "+n+" is not accepted";
this.fileName=n
}a.extend(h.ui.FileUpload.prototype,(function(){return{name:"FileUpload",doneLabel:"Done",sizeExceededLabel:"File size is exceeded",stoppedLabel:"",serverErrorProcLabel:"Server error: error in processing",serverErrorUpLabel:"Server error: upload failed",clearLabel:"Clear",deleteLabel:"Delete",__addFiles:function(p){var q={acceptedFileNames:[],rejectedFileNames:[]};
if(p){for(var n=0;
n<p.length;
n++){this.__tryAddItem(q,p[n]);
if(this.maxFilesQuantity&&this.__getTotalItemCount()>=this.maxFilesQuantity){this.addButton.hide();
break
}}}else{var o=this.input.val();
this.__tryAddItem(q,o)
}if(q.rejectedFileNames.length>0){h.Event.fire(this.element,"ontyperejected",q.rejectedFileNames.join(","))
}if(this.immediateUpload){this.__startUpload()
}},__addItems:function(){this.__addFiles(this.input.prop("files"))
},__addItemsFromDrop:function(n){n.stopPropagation();
n.preventDefault();
if(this.maxFilesQuantity&&this.__getTotalItemCount()>=this.maxFilesQuantity){return
}this.__addFiles(n.originalEvent.dataTransfer.files)
},__tryAddItem:function(p,n){try{if(this.__addItem(n)){p.acceptedFileNames.push(n.name)
}}catch(o){if(o instanceof d){p.rejectedFileNames.push(n.name)
}else{throw o
}}},__addItem:function(n){var o=n.name;
if(!navigator.platform.indexOf("Win")){o=o.match(/[^\\]*$/)[0]
}else{if(!o.indexOf(f)){o=o.substr(f.length)
}else{o=o.match(/[^\/]*$/)[0]
}}if(this.__accept(o)&&(!this.noDuplicate||!this.__isFileAlreadyAdded(o))){this.input.remove();
this.input.unbind("change",this.addProxy);
var p=new c(this,n);
this.list.append(p.getJQuery());
this.items.push(p);
this.input=this.cleanInput.clone();
this.inputContainer.append(this.input);
this.input.change(this.addProxy);
this.__updateButtons();
h.Event.fire(this.element,"onfileselect",o);
return true
}return false
},__removeItem:function(n){this.items.splice(a.inArray(n,this.items),1);
this.submitedItems.splice(a.inArray(n,this.submitedItems),1);
this.__updateButtons();
h.Event.fire(this.element,"onclear",[n.model])
},__removeAllItems:function(p){var o=[];
for(var n in this.submitedItems){o.push(this.submitedItems[n].model)
}for(var n in this.items){o.push(this.items[n].model)
}this.list.empty();
this.items.splice(0,this.items.length);
this.submitedItems.splice(0,this.submitedItems.length);
this.__updateButtons();
h.Event.fire(this.element,"onclear",o)
},__updateButtons:function(){if(!this.loadableItem&&this.list.children(".rf-fu-itm").size()){if(this.items.length){this.uploadButton.css("display","inline-block")
}else{this.uploadButton.hide()
}this.clearButton.css("display","inline-block")
}else{this.uploadButton.hide();
this.clearButton.hide()
}if(this.maxFilesQuantity&&this.__getTotalItemCount()>=this.maxFilesQuantity){this.addButton.hide()
}else{this.addButton.css("display","inline-block")
}},__startUpload:function(){if(!this.items.length){this.__finishUpload();
return
}this.loadableItem=this.items.shift();
this.__updateButtons();
this.loadableItem.startUploading()
},__accept:function(o){o=o.toUpperCase();
var n=!this.acceptedTypes;
for(var q=0;
!n&&q<this.acceptedTypes.length;
q++){var p="."+this.acceptedTypes[q];
if(p==="."&&o.indexOf(".")<0){n=true
}else{n=o.indexOf(p,o.length-p.length)!==-1
}}if(!n){throw new d(o)
}return n
},__isFileAlreadyAdded:function(o){var n=false;
for(var p=0;
!n&&p<this.items.length;
p++){n=this.items[p].model.name==o
}n=n||(this.loadableItem&&this.loadableItem.model.name==o);
for(var p=0;
!n&&p<this.submitedItems.length;
p++){n=this.submitedItems[p].model.name==o
}return n
},__getTotalItemCount:function(){return this.__getItemCountByState(this.items,l.NEW)+this.__getItemCountByState(this.submitedItems,l.DONE)
},__getItemCountByState:function(n){var o={};
var p=0;
for(var q=1;
q<arguments.length;
q++){o[arguments[q]]=true
}for(var q=0;
q<n.length;
q++){if(o[n[q].model.state]){p++
}}return p
},__finishUpload:function(){this.loadableItem=null;
this.__updateButtons();
var n=[];
for(var o in this.submitedItems){n.push(this.submitedItems[o].model)
}for(var o in this.items){n.push(this.items[o].model)
}h.Event.fire(this.element,"onuploadcomplete",n)
}}
})());
var c=function(o,n){this.fileUpload=o;
this.model={name:n.name,state:l.NEW,file:n}
};
a.extend(c.prototype,{getJQuery:function(){this.element=a(j);
var n=this.element.children(".rf-fu-itm-lft:first");
this.label=n.children(".rf-fu-itm-lbl:first");
this.state=this.label.nextAll(".rf-fu-itm-st:first");
this.progressBar=n.find(".progress-bar");
this.progressBar.parent().hide();
this.progressLabel=this.progressBar.find("span");
this.link=n.next().children("a");
this.label.html(this.model.name);
this.link.html(this.fileUpload.deleteLabel);
this.link.click(a.proxy(this.removeOrStop,this));
return this.element
},removeOrStop:function(){this.element.remove();
this.fileUpload.__removeItem(this)
},startUploading:function(){this.state.css("display","block");
this.progressBar.parent().show();
this.progressLabel.html("0 %");
this.link.html("");
this.model.state=l.UPLOADING;
this.uid=Math.random();
var o=new FormData(this.fileUpload.form[0]);
fileName=this.model.file.name;
o.append(this.fileUpload.id,this.model.file);
var q=this.fileUpload.form.attr("action"),n=q.indexOf("?")==-1?"?":"&",p=q+n+e+"="+this.uid+"&javax.faces.partial.ajax=true&javax.faces.source="+this.fileUpload.id+"&javax.faces.partial.execute="+this.fileUpload.id+"&org.richfaces.ajax.component="+this.fileUpload.id+"&"+jsf.getViewState(this.fileUpload.form[0]);
if(jsf.getClientWindow&&jsf.getClientWindow()){p+="&javax.faces.ClientWindow="+jsf.getClientWindow()
}this.xhr=new XMLHttpRequest();
this.xhr.open("POST",p,true);
this.xhr.setRequestHeader("Faces-Request","partial/ajax");
this.xhr.upload.onprogress=a.proxy(function(s){if(s.lengthComputable){var t=Math.floor((s.loaded/s.total)*100);
this.progressLabel.html(t+" %");
this.progressBar.attr("aria-valuenow",t);
this.progressBar.css("width",t+"%")
}},this);
this.xhr.upload.onerror=a.proxy(function(s){this.fileUpload.loadableItem=null;
this.finishUploading(l.SERVER_ERROR_UPLOAD)
},this);
this.xhr.onload=a.proxy(function(t){switch(t.target.status){case 413:responseStatus=l.SIZE_EXCEEDED;
break;
case 200:responseStatus=l.DONE;
break;
default:responseStatus=l.SERVER_ERROR_PROCESS
}var s={source:this.fileUpload.element[0],element:this.fileUpload.element[0],_mfInternal:{_mfSourceControlId:this.fileUpload.element.attr("id")}};
jsf.ajax.response(this.xhr,s);
this.finishUploading(responseStatus);
this.fileUpload.__startUpload()
},this);
this.xhr.send(o);
h.Event.fire(this.fileUpload.element,"onfilesubmit",this.model)
},finishUploading:function(n){this.state.html(this.fileUpload[n+"Label"]);
this.progressBar.parent().hide();
this.link.html(this.fileUpload.clearLabel);
this.model.state=n
}})
}(RichFaces.jQuery,window.RichFaces));
(function(d,a){a.utils=a.utils||{};
a.utils.addCSSText=function(h,j){var i=d("<style></style>").attr({type:"text/css",id:j}).appendTo("head");
try{i.html(h)
}catch(g){i[0].styleSheet.cssText=h
}};
a.utils.Ranges=function(){this.ranges=[]
};
a.utils.Ranges.prototype={add:function(h){var g=0;
while(g<this.ranges.length&&h>=this.ranges[g++][1]){}g--;
if(this.ranges[g-1]&&h==(this.ranges[g-1][1]+1)){if(h==(this.ranges[g][0]-1)){this.ranges[g-1][1]=this.ranges[g][1];
this.ranges.splice(g,1)
}else{this.ranges[g-1][1]++
}}else{if(this.ranges[g]){if(this.ranges[g]&&h==(this.ranges[g][0]-1)){this.ranges[g][0]--
}else{if(h==(this.ranges[g][1]+1)){this.ranges[g][1]++
}else{if(h<this.ranges[g][1]){this.ranges.splice(g,0,[h,h])
}else{this.ranges.splice(g+1,0,[h,h])
}}}}else{this.ranges.splice(g,0,[h,h])
}}},remove:function(h){var g=0;
while(g<this.ranges.length&&h>this.ranges[g++][1]){}g--;
if(this.ranges[g]){if(h==(this.ranges[g][1])){if(h==(this.ranges[g][0])){this.ranges.splice(g,1)
}else{this.ranges[g][1]--
}}else{if(h==(this.ranges[g][0])){this.ranges[g][0]++
}else{this.ranges.splice(g+1,0,[h+1,this.ranges[g][1]]);
this.ranges[g][1]=h-1
}}}},clear:function(){this.ranges=[]
},contains:function(h){var g=0;
while(g<this.ranges.length&&h>=this.ranges[g][0]){if(h>=this.ranges[g][0]&&h<=this.ranges[g][1]){return true
}else{g++
}}return false
},toString:function(){var h=new Array(this.ranges.length);
for(var g=0;
g<this.ranges.length;
g++){h[g]=this.ranges[g].join()
}return h.join(";")
}};
var f="rf-edt-c-";
var e=20;
a.ui=a.ui||{};
a.ui.ExtendedDataTable=a.BaseComponent.extendClass({name:"ExtendedDataTable",init:function(g,j,l,i){c.constructor.call(this,g);
this.ranges=new a.utils.Ranges();
this.rowCount=j;
this.ajaxFunction=l;
this.options=i||{};
this.element=this.attachToDom();
this.newWidths={};
this.storeDomReferences();
if(this.options.onready&&typeof this.options.onready=="function"){a.Event.bind(this.element,"rich:ready",this.options.onready)
}this.resizeEventName="resize.rf.edt."+this.id;
d(document).ready(d.proxy(this.initialize,this));
this.activateResizeListener();
var m=d(this.element).find(".rf-edt-b .rf-edt-cnt");
var h=function(o,n){return function(){setTimeout(function(){o.scrollElement.scrollLeft=n.scrollLeft();
o.updateScrollPosition()
},0)
}
};
m.bind("scroll",h(this,m));
d(this.scrollElement).bind("scroll",d.proxy(this.updateScrollPosition,this));
this.bindHeaderHandlers();
d(this.element).bind("rich:onajaxcomplete",d.proxy(this.ajaxComplete,this));
this.resizeData={};
this.idOfReorderingColumn="";
this.timeoutId=null
},storeDomReferences:function(){this.dragElement=document.getElementById(this.id+":d");
this.reorderElement=document.getElementById(this.id+":r");
this.reorderMarkerElement=document.getElementById(this.id+":rm");
this.widthInput=document.getElementById(this.id+":wi");
this.selectionInput=document.getElementById(this.id+":si");
this.header=d(this.element).children(".rf-edt-hdr");
this.headerCells=this.header.find(".rf-edt-hdr-c");
this.footerCells=d(this.element).children(".rf-edt-ftr").find(".rf-edt-ftr-c");
this.resizerHolders=this.header.find(".rf-edt-rsz-cntr");
this.frozenHeaderPartElement=document.getElementById(this.id+":frozenHeader");
this.frozenColumnCount=this.frozenHeaderPartElement?this.frozenHeaderPartElement.children[0].rows[0].cells.length:0;
this.headerElement=document.getElementById(this.id+":header");
this.footerElement=document.getElementById(this.id+":footer");
this.scrollElement=document.getElementById(this.id+":scrl");
this.scrollContentElement=document.getElementById(this.id+":scrl-cnt")
},getColumnPosition:function(g){var i;
for(var h=0;
h<this.headerCells.length;
h++){if(g==this.headerCells[h].className.match(new RegExp(f+"([^\\W]*)"))[1]){i=h
}}return i
},setColumnPosition:function(g,m){var h="";
var j;
for(var l=0;
l<this.headerCells.length;
l++){var i=this.headerCells[l].className.match(new RegExp(f+"([^\\W]*)"))[1];
if(l==m){if(j){h+=i+","+g+","
}else{h+=g+","+i+","
}}else{if(g!=i){h+=i+","
}else{j=true
}}}this.ajaxFunction(null,{"rich:columnsOrder":h})
},setColumnWidth:function(h,j){j=j+"px";
var l=d(document.getElementById(this.element.id));
l.find("."+f+h).parent().css("width",j);
l.find("."+f+h).css("width",j);
this.newWidths[h]=j;
var i=new Array();
for(var g in this.newWidths){i.push(g+":"+this.newWidths[g])
}this.widthInput.value=i.toString();
this.updateLayout();
this.adjustResizers();
this.ajaxFunction()
},filter:function(h,g,j){if(typeof(g)=="undefined"||g==null){g=""
}var i={};
i[this.id+"rich:filtering"]=h+":"+g+":"+j;
this.ajaxFunction(null,i)
},clearFiltering:function(){this.filter("","",true)
},sortHandler:function(h){var l=d(h.data.sortHandle);
var j=l.find(".rf-edt-srt-btn");
var g=j.data("columnid");
var i=j.hasClass("rf-edt-srt-asc")?"descending":"ascending";
this.sort(g,i,false)
},filterHandler:function(i){var j=d(i.data.filterHandle);
var h=j.data("columnid");
var g=j.val();
this.filter(h,g,false)
},sort:function(g,i,j){if(typeof(i)=="string"){i=i.toLowerCase()
}var h={};
h[this.id+"rich:sorting"]=g+":"+i+":"+j;
this.ajaxFunction(null,h)
},clearSorting:function(){this.sort("","",true)
},destroy:function(){d(window).unbind("resize",this.updateLayout);
d(a.getDomElement(this.id+":st")).remove();
c.destroy.call(this)
},bindHeaderHandlers:function(){this.header.find(".rf-edt-rsz").bind("mousedown",d.proxy(this.beginResize,this));
this.headerCells.bind("mousedown",d.proxy(this.beginReorder,this));
var g=this;
this.header.find(".rf-edt-c-srt").each(function(){d(this).bind("click",{sortHandle:this},d.proxy(g.sortHandler,g))
});
this.header.find(".rf-edt-flt-i").each(function(){d(this).bind("blur",{filterHandle:this},d.proxy(g.filterHandler,g))
})
},updateLayout:function(){this.deActivateResizeListener();
this.headerCells.height("auto");
var g=0;
this.headerCells.each(function(){if(this.clientHeight>g){g=this.clientHeight
}});
this.headerCells.height(g+"px");
this.footerCells.height("auto");
var l=0;
this.footerCells.each(function(){if(this.clientHeight>l){l=this.clientHeight
}});
this.footerCells.height(l+"px");
this.contentDivElement.css("width","auto");
var h=this.frozenHeaderPartElement?this.frozenHeaderPartElement.offsetWidth:0;
var i=Math.max(0,this.element.clientWidth-h);
if(i){this.parts.each(function(){this.style.width="auto"
});
var m=this.parts.width();
if(m>i){this.contentDivElement.css("width",i+"px")
}this.contentDivElement.css("display","block");
if(m>i){this.parts.each(function(){this.style.width=i+"px"
});
this.scrollElement.style.display="block";
this.scrollElement.style.overflowX="scroll";
this.scrollElement.style.width=i+"px";
this.scrollContentElement.style.width=m+"px";
this.updateScrollPosition()
}else{this.parts.each(function(){this.style.width=""
});
this.scrollElement.style.display="none"
}}else{this.contentDivElement.css("display","none")
}var n=this.element.clientHeight;
var j=this.element.firstChild;
while(j&&(!j.nodeName||j.nodeName.toUpperCase()!="TABLE")){if(j.nodeName&&j.nodeName.toUpperCase()=="DIV"&&j!=this.bodyElement){n-=j.offsetHeight
}j=j.nextSibling
}if(this.bodyElement.offsetHeight>n||!this.contentElement){this.bodyElement.style.height=n+"px"
}this.activateResizeListener()
},adjustResizers:function(){var g=this.scrollElement?this.scrollElement.scrollLeft:0;
var h=this.element.clientWidth-3;
var i=0;
for(;
i<this.frozenColumnCount;
i++){if(h>0){this.resizerHolders[i].style.display="none";
this.resizerHolders[i].style.display="";
h-=this.resizerHolders[i].offsetWidth
}if(h<=0){this.resizerHolders[i].style.display="none"
}}g-=3;
for(;
i<this.resizerHolders.length;
i++){if(h>0){this.resizerHolders[i].style.display="none";
if(g>0){this.resizerHolders[i].style.display="";
g-=this.resizerHolders[i].offsetWidth;
if(g>0){this.resizerHolders[i].style.display="none"
}else{h+=g
}}else{this.resizerHolders[i].style.display="";
h-=this.resizerHolders[i].offsetWidth
}}if(h<=0){this.resizerHolders[i].style.display="none"
}}},updateScrollPosition:function(){if(this.scrollElement){var g=this.scrollElement.scrollLeft;
this.parts.each(function(){this.scrollLeft=g
})
}this.adjustResizers()
},initialize:function(){this.deActivateResizeListener();
if(!d(this.element).is(":visible")){this.showOffscreen(this.element)
}this.bodyElement=document.getElementById(this.id+":b");
this.bodyElement.tabIndex=-1;
this.contentDivElement=d(this.bodyElement).find(".rf-edt-cnt");
var h=d(this.bodyElement);
this.contentElement=h.children("div:not(.rf-edt-ndt):first")[0];
if(this.contentElement){this.spacerElement=this.contentElement.children[0];
this.dataTableElement=this.contentElement.lastChild;
this.tbodies=d(document.getElementById(this.id+":tbf")).add(document.getElementById(this.id+":tbn"));
this.rows=this.tbodies[0].rows.length;
this.rowHeight=this.dataTableElement.offsetHeight/this.rows;
if(this.rowCount!=this.rows){this.contentElement.style.height=(this.rowCount*this.rowHeight)+"px"
}h.bind("scroll",d.proxy(this.bodyScrollListener,this));
if(this.options.selectionMode!="none"){this.tbodies.bind("click",d.proxy(this.selectionClickListener,this));
h.bind(window.opera?"keypress":"keydown",d.proxy(this.selectionKeyDownListener,this));
this.initializeSelection()
}}else{this.spacerElement=null;
this.dataTableElement=null
}var g=this.element;
this.parts=d(this.element).find(".rf-edt-cnt, .rf-edt-ftr-cnt").filter(function(){return d(this).parents(".rf-edt").get(0)===g
});
this.updateLayout();
this.updateScrollPosition();
if(d(this.element).data("offscreenElements")){this.hideOffscreen(this.element)
}this.activateResizeListener();
d(this.element).trigger("rich:ready",this)
},showOffscreen:function(i){var j=d(i);
var g=j.parents(":not(:visible)").addBack().toArray().reverse();
var h=this;
d.each(g,function(){$this=d(this);
if($this.css("display")==="none"){h.showOffscreenElement(d(this))
}});
j.data("offscreenElements",g)
},hideOffscreen:function(i){var j=d(i);
var g=j.data("offscreenElements");
var h=this;
d.each(g,function(){$this=d(this);
if($this.data("offscreenOldValues")){h.hideOffscreenElement(d(this))
}});
j.removeData("offscreenElements")
},showOffscreenElement:function(h){var g={};
g.oldPosition=h.css("position");
g.oldLeft=h.css("left");
g.oldDisplay=h.css("display");
h.css("position","absolute");
h.css("left","-10000");
h.css("display","block");
h.data("offscreenOldValues",g)
},hideOffscreenElement:function(h){var g=h.data("offscreenOldValues");
h.css("display",g.oldDisplay);
h.css("left",g.oldLeft);
h.css("position",g.oldPosition);
h.removeData("offscreenOldValues")
},drag:function(g){d(this.dragElement).setPosition({left:Math.max(this.resizeData.left+e,g.pageX)});
return false
},beginResize:function(h){var g=h.currentTarget.parentNode.className.match(new RegExp(f+"([^\\W]*)"))[1];
this.resizeData={id:g,left:d(h.currentTarget).parent().offset().left};
this.dragElement.style.height=this.element.offsetHeight+"px";
d(this.dragElement).setPosition({top:d(this.element).offset().top,left:h.pageX});
this.dragElement.style.display="block";
d(document).bind("mousemove",d.proxy(this.drag,this));
d(document).one("mouseup",d.proxy(this.endResize,this));
return false
},endResize:function(g){d(document).unbind("mousemove",this.drag);
this.dragElement.style.display="none";
var h=Math.max(e,g.pageX-this.resizeData.left);
this.setColumnWidth(this.resizeData.id,h)
},reorder:function(g){d(this.reorderElement).setPosition(g,{offset:[5,5]});
this.reorderElement.style.display="block";
return false
},beginReorder:function(g){if(!d(g.target).is("a, img, :input")){this.idOfReorderingColumn=g.currentTarget.className.match(new RegExp(f+"([^\\W]*)"))[1];
d(document).bind("mousemove",d.proxy(this.reorder,this));
this.headerCells.bind("mouseover",d.proxy(this.overReorder,this));
d(document).one("mouseup",d.proxy(this.cancelReorder,this));
return false
}},overReorder:function(h){if(this.idOfReorderingColumn!=h.currentTarget.className.match(new RegExp(f+"([^\\W]*)"))[1]){var i=d(h.currentTarget);
var g=i.offset();
d(this.reorderMarkerElement).setPosition({top:g.top+i.height(),left:g.left-5});
this.reorderMarkerElement.style.display="block";
i.one("mouseout",d.proxy(this.outReorder,this));
i.one("mouseup",d.proxy(this.endReorder,this))
}},outReorder:function(g){this.reorderMarkerElement.style.display="";
d(g.currentTarget).unbind("mouseup",this.endReorder)
},endReorder:function(j){this.reorderMarkerElement.style.display="";
d(j.currentTarget).unbind("mouseout",this.outReorder);
var g=j.currentTarget.className.match(new RegExp(f+"([^\\W]*)"))[1];
var h="";
var i=this;
this.headerCells.each(function(){var l=this.className.match(new RegExp(f+"([^\\W]*)"))[1];
if(l==g){h+=i.idOfReorderingColumn+","+g+","
}else{if(l!=i.idOfReorderingColumn){h+=l+","
}}});
this.ajaxFunction(j,{"rich:columnsOrder":h})
},cancelReorder:function(g){d(document).unbind("mousemove",this.reorder);
this.headerCells.unbind("mouseover",this.overReorder);
this.reorderElement.style.display="none"
},loadData:function(g){var h=Math.round((this.bodyElement.scrollTop+this.bodyElement.clientHeight/2)/this.rowHeight-this.rows/2);
if(h<=0){h=0
}else{h=Math.min(this.rowCount-this.rows,h)
}this.ajaxFunction(g,{"rich:clientFirst":h})
},bodyScrollListener:function(h){if(this.timeoutId){window.clearTimeout(this.timeoutId);
this.timeoutId=null
}if(Math.max(h.currentTarget.scrollTop-this.rowHeight,0)<this.spacerElement.offsetHeight||Math.min(h.currentTarget.scrollTop+this.rowHeight+h.currentTarget.clientHeight,h.currentTarget.scrollHeight)>this.spacerElement.offsetHeight+this.dataTableElement.offsetHeight){var g=this;
this.timeoutId=window.setTimeout(function(i){g.loadData(i)
},1000)
}},showActiveRow:function(){if(this.bodyElement.scrollTop>this.activeIndex*this.rowHeight+this.spacerElement.offsetHeight){this.bodyElement.scrollTop=Math.max(this.bodyElement.scrollTop-this.rowHeight,0)
}else{if(this.bodyElement.scrollTop+this.bodyElement.clientHeight<(this.activeIndex+1)*this.rowHeight+this.spacerElement.offsetHeight){this.bodyElement.scrollTop=Math.min(this.bodyElement.scrollTop+this.rowHeight,this.bodyElement.scrollHeight-this.bodyElement.clientHeight)
}}},selectRow:function(h){this.ranges.add(h);
for(var g=0;
g<this.tbodies.length;
g++){d(this.tbodies[g].rows[h]).addClass("rf-edt-r-sel")
}},deselectRow:function(h){this.ranges.remove(h);
for(var g=0;
g<this.tbodies.length;
g++){d(this.tbodies[g].rows[h]).removeClass("rf-edt-r-sel")
}},setActiveRow:function(h){if(typeof this.activeIndex=="number"){for(var g=0;
g<this.tbodies.length;
g++){d(this.tbodies[g].rows[this.activeIndex]).removeClass("rf-edt-r-act")
}}this.activeIndex=h;
for(var g=0;
g<this.tbodies.length;
g++){d(this.tbodies[g].rows[this.activeIndex]).addClass("rf-edt-r-act")
}},resetShiftRow:function(){if(typeof this.shiftIndex=="number"){for(var g=0;
g<this.tbodies.length;
g++){d(this.tbodies[g].rows[this.shiftIndex]).removeClass("rf-edt-r-sht")
}}this.shiftIndex=null
},setShiftRow:function(h){this.resetShiftRow();
this.shiftIndex=h;
if(typeof h=="number"){for(var g=0;
g<this.tbodies.length;
g++){d(this.tbodies[g].rows[this.shiftIndex]).addClass("rf-edt-r-sht")
}}},initializeSelection:function(){this.ranges.clear();
var j=this.selectionInput.value.split("|");
this.activeIndex=j[1]||null;
this.shiftIndex=j[2]||null;
this.selectionFlag=null;
var h=this.tbodies[0].rows;
for(var i=0;
i<h.length;
i++){var g=d(h[i]);
if(g.hasClass("rf-edt-r-sel")){this.ranges.add(g[0].rowIndex)
}if(g.hasClass("rf-edt-r-act")){this.activeIndex=g[0].rowIndex
}if(g.hasClass("rf-edt-r-sht")){this.shiftIndex=g[0].rowIndex
}}this.writeSelection()
},writeSelection:function(){this.selectionInput.value=[this.ranges,this.activeIndex,this.shiftIndex,this.selectionFlag].join("|")
},selectRows:function(i){if(typeof i=="number"){i=[i,i]
}var g;
var h=0;
for(;
h<i[0];
h++){if(this.ranges.contains(h)){this.deselectRow(h);
g=true
}}for(;
h<=i[1];
h++){if(!this.ranges.contains(h)){this.selectRow(h);
g=true
}}for(;
h<this.rows;
h++){if(this.ranges.contains(h)){this.deselectRow(h);
g=true
}}this.selectionFlag=typeof this.shiftIndex=="string"?this.shiftIndex:"x";
return g
},processSlectionWithShiftKey:function(g){if(this.shiftIndex==null){this.setShiftRow(this.activeIndex!=null?this.activeIndex:g)
}var h;
if("u"==this.shiftIndex){h=[0,g]
}else{if("d"==this.shiftIndex){h=[g,this.rows-1]
}else{if(g>=this.shiftIndex){h=[this.shiftIndex,g]
}else{h=[g,this.shiftIndex]
}}}return this.selectRows(h)
},onbeforeselectionchange:function(g){return !this.options.onbeforeselectionchange||this.options.onbeforeselectionchange.call(this.element,g)!=false
},onselectionchange:function(h,i,g){if(!h.shiftKey){this.resetShiftRow()
}if(this.activeIndex!=i){this.setActiveRow(i);
this.showActiveRow()
}if(g){this.writeSelection();
if(this.options.onselectionchange){this.options.onselectionchange.call(this.element,h)
}}},selectionClickListener:function(i){if(!this.onbeforeselectionchange(i)){return
}var g;
if(i.shiftKey||i.ctrlKey){if(window.getSelection){window.getSelection().removeAllRanges()
}else{if(document.selection){document.selection.empty()
}}}var h=i.target;
while(this.tbodies.index(h.parentNode)==-1){h=h.parentNode
}var j=h.rowIndex;
if(typeof(j)==="undefined"){return
}if(this.options.selectionMode=="single"||(this.options.selectionMode!="multipleKeyboardFree"&&!i.shiftKey&&!i.ctrlKey)){g=this.selectRows(j)
}else{if(this.options.selectionMode=="multipleKeyboardFree"||(!i.shiftKey&&i.ctrlKey)){if(this.ranges.contains(j)){this.deselectRow(j)
}else{this.selectRow(j)
}g=true
}else{g=this.processSlectionWithShiftKey(j)
}}this.onselectionchange(i,j,g)
},selectionKeyDownListener:function(h){if(h.ctrlKey&&this.options.selectionMode!="single"&&(h.keyCode==65||h.keyCode==97)&&this.onbeforeselectionchange(h)){this.selectRows([0,this.rows]);
this.selectionFlag="a";
this.onselectionchange(h,this.activeIndex,true);
h.preventDefault()
}else{var i;
if(h.keyCode==38){i=-1
}else{if(h.keyCode==40){i=1
}}if(i!=null&&this.onbeforeselectionchange(h)){if(typeof this.activeIndex=="number"){i+=this.activeIndex;
if(i>=0&&i<this.rows){var g;
if(this.options.selectionMode=="single"||(!h.shiftKey&&!h.ctrlKey)){g=this.selectRows(i)
}else{if(h.shiftKey){g=this.processSlectionWithShiftKey(i)
}}this.onselectionchange(h,i,g)
}}h.preventDefault()
}}},ajaxComplete:function(i,h){this.storeDomReferences();
if(h.reinitializeHeader){this.bindHeaderHandlers();
this.updateLayout()
}else{this.selectionInput=document.getElementById(this.id+":si");
if(h.reinitializeBody){this.rowCount=h.rowCount;
this.initialize()
}else{if(this.options.selectionMode!="none"){this.initializeSelection()
}}if(this.spacerElement){this.spacerElement.style.height=(h.first*this.rowHeight)+"px"
}}var l=d(document.getElementById(this.element.id)),j=new Array();
for(var g in this.newWidths){l.find("."+f+g).css("width",this.newWidths[g]).parent().css("width",this.newWidths[g]);
j.push(g+":"+this.newWidths[g])
}this.widthInput.value=j.toString();
this.updateLayout();
this.adjustResizers()
},activateResizeListener:function(){if(typeof this.resizeEventName!=="undefined"){d(window).on(this.resizeEventName,d.proxy(this.updateLayout,this))
}},deActivateResizeListener:function(){if(typeof this.resizeEventName!=="undefined"){d(window).off(this.resizeEventName)
}},contextMenuAttach:function(g){var h="[id='"+this.element.id+"'] ";
h+=(typeof g.options.targetSelector==="undefined")?".rf-edt-b td":g.options.targetSelector;
h=d.trim(h);
a.Event.bind(h,g.options.showEvent,d.proxy(g.__showHandler,g),g)
},contextMenuShow:function(g,i){var h=i.target;
while(this.tbodies.index(h.parentNode)==-1){h=h.parentNode
}var j=h.rowIndex;
if(!this.ranges.contains(j)){this.selectionClickListener(i)
}}});
var c=a.ui.ExtendedDataTable.$super
}(RichFaces.jQuery,window.RichFaces));
(function(c){c.hotkeys={version:"0.8",specialKeys:{8:"backspace",9:"tab",13:"return",16:"shift",17:"ctrl",18:"alt",19:"pause",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"del",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",107:"+",109:"-",110:".",111:"/",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"numlock",145:"scroll",191:"/",224:"meta"},shiftNums:{"`":"~","1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","-":"_","=":"+",";":": ","'":'"',",":"<",".":">","/":"?","\\":"|"}};
var a={key:"",enabledInInput:false};
function d(f){var g=(typeof f.data=="string")?{key:f.data}:f.data;
g=c.extend({},a,g);
var h=f.handler,e=g.key.toLowerCase().split(" ");
if(e.length===1&&e[0]===""){return
}f.handler=function(s){var l=String.fromCharCode(s.which).toLowerCase(),p=(/textarea|select/i.test(s.target.nodeName)||s.target.type==="text");
if(this!==s.target&&p&&!g.enabledInInput){return
}var j=s.type!=="keypress"&&c.hotkeys.specialKeys[s.which],i,o="",n={};
if(s.altKey&&j!=="alt"){o+="alt+"
}if(s.ctrlKey&&j!=="ctrl"){o+="ctrl+"
}if(s.metaKey&&!s.ctrlKey&&j!=="meta"){o+="meta+"
}if(s.shiftKey&&j!=="shift"){o+="shift+"
}if(j){n[o+j]=true
}else{n[o+l]=true;
n[o+c.hotkeys.shiftNums[l]]=true;
if(o==="shift+"){n[c.hotkeys.shiftNums[l]]=true
}}for(var m=0,q=e.length;
m<q;
m++){if(n[e[m]]){return h.apply(this,arguments)
}}}
}c.each(["keydown","keyup","keypress"],function(){c.event.special[this]={add:d}
})
})(jQuery);
(function(d,e){e.ui=e.ui||{};
var a={interval:1000,minValue:0,maxValue:100};
var f={initial:"> .rf-pb-init",progress:"> .rf-pb-rmng",finish:"> .rf-pb-fin"};
e.ui.ProgressBar=function(g,h){c.constructor.call(this,g);
this.__elt=this.attachToDom();
this.options=d.extend(this.options,a,h||{});
this.enabled=this.options.enabled;
this.minValue=this.options.minValue;
this.maxValue=this.options.maxValue;
this.__setValue(this.options.value||this.options.minValue);
if(this.options.resource){this.__poll()
}else{if(this.options.submitFunction){this.submitFunction=new Function("beforeUpdateHandler","afterUpdateHandler","params","event",this.options.submitFunction);
this.__poll()
}}if(this.options.onfinish){e.Event.bind(this.__elt,"finish",new Function("event",this.options.onfinish))
}};
e.BaseComponent.extend(e.ui.ProgressBar);
var c=e.ui.ProgressBar.$super;
d.extend(e.ui.ProgressBar.prototype,(function(){return{name:"ProgressBar",__isInitialState:function(){return parseFloat(this.value)<parseFloat(this.getMinValue())
},__isProgressState:function(){return !this.__isInitialState()&&!this.__isFinishState()
},__isFinishState:function(){return parseFloat(this.value)>=parseFloat(this.getMaxValue())
},__beforeUpdate:function(g){if(g.componentData&&typeof g.componentData[this.id]!="undefined"){this.setValue(g.componentData[this.id])
}},__afterUpdate:function(g){this.__poll()
},__onResourceDataAvailable:function(h){var g=e.parseJSON(h);
if(g instanceof Number||typeof g=="number"){this.setValue(g)
}this.__poll()
},__submit:function(){if(this.submitFunction){this.submitFunction.call(this,d.proxy(this.__beforeUpdate,this),d.proxy(this.__afterUpdate,this),this.__params||{})
}else{d.get(this.options.resource,this.__params||{},d.proxy(this.__onResourceDataAvailable,this),"text")
}},__poll:function(g){if(this.enabled){if(g){this.__submit()
}else{this.__pollTimer=setTimeout(d.proxy(this.__submit,this),this.options.interval)
}}},__calculatePercent:function(i){var h=parseFloat(this.getMinValue());
var j=parseFloat(this.getMaxValue());
var g=parseFloat(i);
if(h<g&&g<j){return(100*(g-h))/(j-h)
}else{if(g<=h){return 0
}else{if(g>=j){return 100
}}}},__getPropertyOrObject:function(g,h){if(d.isPlainObject(g)&&g.propName){return g.propName
}return g
},getValue:function(){return this.value
},__showState:function(h){var g=d(f[h],this.__elt);
if(g.length==0&&(h=="initial"||h=="finish")){g=d(f.progress,this.__elt)
}g.show().siblings().hide()
},__setValue:function(g,h){this.value=parseFloat(this.__getPropertyOrObject(g,"value"));
if(this.__isFinishState()||this.__isInitialState()){this.disable()
}},__updateVisualState:function(){if(this.__isInitialState()){this.__showState("initial")
}else{if(this.__isFinishState()){this.__showState("finish")
}else{this.__showState("progress")
}}var g=this.__calculatePercent(this.value);
d(".rf-pb-prgs",this.__elt).css("width",g+"%")
},setValue:function(g){var h=this.__isFinishState();
this.__setValue(g);
this.__updateVisualState();
if(!h&&this.__isFinishState()){e.Event.callHandler(this.__elt,"finish")
}},getMaxValue:function(){return this.maxValue
},getMinValue:function(){return this.minValue
},isAjaxMode:function(){return !!this.submitFunction||!!this.options.resource
},disable:function(){this.__params=null;
if(this.__pollTimer){clearTimeout(this.__pollTimer);
this.__pollTimer=null
}this.enabled=false
},enable:function(g){if(this.isEnabled()){return
}this.__params=g;
this.enabled=true;
if(this.isAjaxMode()){this.__poll(true)
}},isEnabled:function(){return this.enabled
},destroy:function(){this.disable();
this.__elt=null;
c.destroy.call(this)
}}
}()))
})(RichFaces.jQuery,RichFaces);
(function(c,a){a.ui=a.ui||{};
a.ui.ComponentControl=a.ui.ComponentControl||{};
c.extend(a.ui.ComponentControl,{execute:function(f,g){var e=g.target;
var j=g.selector;
var d=g.callback;
if(g.onbeforeoperation&&typeof g.onbeforeoperation=="function"){var l=g.onbeforeoperation(f);
if(l=="false"||l==0){return
}}if(e){for(var h=0;
h<e.length;
h++){var i=document.getElementById(e[h]);
if(i){a.ui.ComponentControl.invokeOnComponent(f,i,d)
}}}if(j){a.ui.ComponentControl.invokeOnComponent(f,j,d)
}},invokeOnComponent:function(f,e,d){if(d&&typeof d=="function"){c(e).each(function(){var g=a.component(this);
if(g){d(f,g)
}})
}}})
})(RichFaces.jQuery,window.RichFaces);
(function(e,a){a.ui=a.ui||{};
var f=function(i,l,n){var o;
var j=function(p){p.data.fn.call(p.data.component,p)
};
var h={};
h.component=n;
for(o in i){var m=e(document.getElementById(o));
h.id=o;
h.page=i[o];
h.element=m;
h.fn=n.processClick;
m.bind("click",c(h),j)
}};
var c=function(h){var j;
var i={};
for(j in h){i[j]=h[j]
}return i
};
var g=function(i,h){if(h.type=="mousedown"){i.addClass("rf-ds-press")
}else{if(h.type=="mouseup"||h.type=="mouseout"){i.removeClass("rf-ds-press")
}}};
a.ui.DataScroller=function(h,i,m){d.constructor.call(this,h);
var j=this.attachToDom();
this.options=m;
this.currentPage=m.currentPage;
if(i&&typeof i=="function"){RichFaces.Event.bindById(h,this.getScrollEventName(),i)
}var l={};
if(m.buttons){e(j).delegate(".rf-ds-btn","mouseup mousedown mouseout",function(n){if(e(this).hasClass("rf-ds-dis")){e(this).removeClass("rf-ds-press")
}else{g(e(this),n)
}});
f(m.buttons.left,l,this);
f(m.buttons.right,l,this)
}if(m.digitals){e(j).delegate(".rf-ds-nmb-btn","mouseup mousedown mouseout",function(n){g(e(this),n)
});
f(m.digitals,l,this)
}};
a.BaseComponent.extend(a.ui.DataScroller);
var d=a.ui.DataScroller.$super;
e.extend(a.ui.DataScroller.prototype,(function(){var h="rich:datascroller:onscroll";
return{name:"RichFaces.ui.DataScroller",processClick:function(l){var i=l.data;
if(i){var j=i.page;
if(j){this.switchToPage(j)
}}},switchToPage:function(i){if(typeof i!="undefined"&&i!=null){RichFaces.Event.fireById(this.id,this.getScrollEventName(),{page:i})
}},fastForward:function(){this.switchToPage("fastforward")
},fastRewind:function(){this.switchToPage("fastrewind")
},next:function(){this.switchToPage("next")
},previous:function(){this.switchToPage("previous")
},first:function(){this.switchToPage("first")
},last:function(){this.switchToPage("last")
},getScrollEventName:function(){return h
},destroy:function(){d.destroy.call(this)
}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(e,g){g.ui=g.ui||{};
g.ui.Message=function(i,j){c.constructor.call(this,i,j,a);
if(this.options.isMessages){this.severityClasses=["rf-msgs-inf","rf-msgs-wrn","rf-msgs-err","rf-msgs-ftl"];
this.summaryClass="rf-msgs-sum";
this.detailClass="rf-msgs-det"
}else{this.severityClasses=["rf-msg-inf","rf-msg-wrn","rf-msg-err","rf-msg-ftl"];
this.summaryClass="rf-msg-sum";
this.detailClass="rf-msg-det"
}};
g.ui.Base.extend(g.ui.Message);
var c=g.ui.Message.$super;
var a={showSummary:true,level:0,isMessages:false,globalOnly:false};
var d=function(j,n,o){var l=e(g.getDomElement(this.id));
var i=o.sourceId;
var m=o.message;
if(!this.options.forComponentId){if(!m||this.options.globalOnly){var n;
while(n=g.getDomElement(this.id+":"+i)){e(n).remove()
}}else{f.call(this,i,m)
}}else{if(this.options.forComponentId===i){l.empty();
f.call(this,i,m)
}}};
var f=function(m,j){if(j&&j.severity>=this.options.level){var l=e(g.getDomElement(this.id));
var i=e("<span/>",{"class":(this.severityClasses)[j.severity],id:this.id+":"+m});
if(j.summary){if(this.options.tooltip){i.attr("title",j.summary)
}else{if(this.options.showSummary){i.append(e("<span/>",{"class":(this.summaryClass)}).text(j.summary))
}}}if(this.options.showDetail&&j.detail){i.append(e("<span/>",{"class":(this.detailClass)}).text(j.detail))
}l.append(i)
}};
var h=function(){g.Event.bind(window.document,g.Event.MESSAGE_EVENT_TYPE+this.namespace,d,this)
};
e.extend(g.ui.Message.prototype,{name:"Message",__bindEventHandlers:h,destroy:function(){g.Event.unbind(window.document,g.Event.MESSAGE_EVENT_TYPE+this.namespace);
c.destroy.call(this)
}})
})(RichFaces.jQuery,window.RichFaces||(window.RichFaces={}));
(function(e,f){f.ui=f.ui||{};
var a={mode:"server",cssRoot:"ddm",cssClasses:{}};
f.ui.MenuItem=function(g,h){this.options={};
e.extend(this.options,a,h||{});
d.constructor.call(this,g);
e.extend(this.options.cssClasses,c.call(this,this.options.cssRoot));
this.attachToDom(g);
this.element=e(f.getDomElement(g));
f.Event.bindById(this.id,"click",this.__clickHandler,this);
f.Event.bindById(this.id,"mouseenter",this.select,this);
f.Event.bindById(this.id,"mouseleave",this.unselect,this);
this.selected=false
};
var c=function(g){var h={itemCss:"rf-"+g+"-itm",selectItemCss:"rf-"+g+"-itm-sel",unselectItemCss:"rf-"+g+"-itm-unsel",labelCss:"rf-"+g+"-lbl"};
return h
};
f.BaseComponent.extend(f.ui.MenuItem);
var d=f.ui.MenuItem.$super;
e.extend(f.ui.MenuItem.prototype,(function(){return{name:"MenuItem",select:function(){this.element.removeClass(this.options.cssClasses.unselectItemCss);
this.element.addClass(this.options.cssClasses.selectItemCss);
this.selected=true
},unselect:function(){this.element.removeClass(this.options.cssClasses.selectItemCss);
this.element.addClass(this.options.cssClasses.unselectItemCss);
this.selected=false
},activate:function(){this.invokeEvent("click",f.getDomElement(this.id))
},isSelected:function(){return this.selected
},__clickHandler:function(i){if(e(i.target).is(":input:not(:button):not(:reset):not(:submit)")){return
}var m=this.__getParentMenu();
if(m){m.processItem(this.element)
}var j=f.getDomElement(this.id);
var g=this.options.params;
var l=this.__getParentForm(j);
var h={};
h[j.id]=j.id;
e.extend(h,g||{});
i.form=l;
i.itemId=h;
this.options.onClickHandler.call(this,i)
},__getParentForm:function(g){return e(e(g).parents("form").get(0))
},__getParentMenu:function(){var g=this.element.parents("div."+this.options.cssClasses.labelCss);
if(g&&g.length>0){return f.component(g)
}else{return null
}}}
})())
})(RichFaces.jQuery,RichFaces);
(function(a,c){if(typeof define==="function"&&define.amd){define(c)
}else{a.atmosphere=c()
}}(this,function(){var g="2.2.5-javascript",a={},f,c=[],d=[],e=0,h=Object.prototype.hasOwnProperty;
a={onError:function(i){},onClose:function(i){},onOpen:function(i){},onReopen:function(i){},onMessage:function(i){},onReconnect:function(i,j){},onMessagePublished:function(i){},onTransportFailure:function(i,j){},onLocalMessage:function(i){},onFailureToReconnect:function(i,j){},onClientTimeout:function(i){},onOpenAfterResume:function(i){},WebsocketApiAdapter:function(j){var l,i;
j.onMessage=function(m){i.onmessage({data:m.responseBody})
};
j.onMessagePublished=function(m){i.onmessage({data:m.responseBody})
};
j.onOpen=function(m){i.onopen(m)
};
i={close:function(){l.close()
},send:function(m){l.push(m)
},onmessage:function(m){},onopen:function(m){},onclose:function(m){},onerror:function(m){}};
l=new a.subscribe(j);
return i
},AtmosphereRequest:function(ar){var a2={timeout:300000,method:"GET",headers:{},contentType:"",callback:null,url:"",data:"",suspend:true,maxRequest:-1,reconnect:true,maxStreamingLength:10000000,lastIndex:0,logLevel:"info",requestCount:0,fallbackMethod:"GET",fallbackTransport:"streaming",transport:"long-polling",webSocketImpl:null,webSocketBinaryType:null,dispatchUrl:null,webSocketPathDelimiter:"@@",enableXDR:false,rewriteURL:false,attachHeadersAsQueryString:true,executeCallbackBeforeReconnect:false,readyState:0,withCredentials:false,trackMessageLength:false,messageDelimiter:"|",connectTimeout:-1,reconnectInterval:0,dropHeaders:true,uuid:0,async:true,shared:false,readResponsesHeaders:false,maxReconnectOnClose:5,enableProtocol:true,pollingInterval:0,heartbeat:{client:null,server:null},ackInterval:0,closeAsync:false,reconnectOnServerError:true,onError:function(i){},onClose:function(i){},onOpen:function(i){},onMessage:function(i){},onReopen:function(i,j){},onReconnect:function(i,j){},onMessagePublished:function(i){},onTransportFailure:function(i,j){},onLocalMessage:function(i){},onFailureToReconnect:function(i,j){},onClientTimeout:function(i){},onOpenAfterResume:function(i){}};
var ac={status:200,reasonPhrase:"OK",responseBody:"",messages:[],headers:[],state:"messageReceived",transport:"polling",error:null,request:null,partialMessage:"",errorHandled:false,closedByClientTimeout:false,ffTryingReconnect:false};
var F=null;
var ao=null;
var aT=null;
var a4=null;
var ax=null;
var aX=true;
var A=0;
var ak=" ";
var af=false;
var aE=null;
var ba;
var B=null;
var aD=a.util.now();
var aU;
var bb;
ag(ar);
function al(){aX=true;
af=false;
A=0;
F=null;
ao=null;
aT=null;
a4=null
}function aA(){a7();
al()
}function aL(i,j){if(ac.partialMessage===""&&(j.transport==="streaming")&&(i.responseText.length>j.maxStreamingLength)){return true
}return false
}function aQ(){if(a2.enableProtocol&&!a2.firstMessage){var j="X-Atmosphere-Transport=close&X-Atmosphere-tracking-id="+a2.uuid;
a.util.each(a2.headers,function(p,n){var o=a.util.isFunction(n)?n.call(this,a2,a2,ac):n;
if(o!=null){j+="&"+encodeURIComponent(p)+"="+encodeURIComponent(o)
}});
var m=a2.url.replace(/([?&])_=[^&]*/,j);
m=m+(m===a2.url?(/\?/.test(a2.url)?"&":"?")+j:"");
var l={connected:false};
var i=new a.AtmosphereRequest(l);
i.attachHeadersAsQueryString=false;
i.dropHeaders=true;
i.url=m;
i.contentType="text/plain";
i.transport="polling";
i.method="GET";
i.data="";
if(a2.enableXDR){i.enableXDR=a2.enableXDR
}i.async=l.closeAsync;
ai("",i)
}}function aM(){if(a2.logLevel==="debug"){a.util.debug("Closing")
}af=true;
if(a2.reconnectId){clearTimeout(a2.reconnectId);
delete a2.reconnectId
}if(a2.heartbeatTimer){clearTimeout(a2.heartbeatTimer)
}a2.reconnect=false;
ac.request=a2;
ac.state="unsubscribe";
ac.responseBody="";
ac.status=408;
ac.partialMessage="";
am();
aQ();
a7()
}function a7(){ac.partialMessage="";
if(a2.id){clearTimeout(a2.id)
}if(a2.heartbeatTimer){clearTimeout(a2.heartbeatTimer)
}if(a4!=null){a4.close();
a4=null
}if(ax!=null){ax.abort();
ax=null
}if(aT!=null){aT.abort();
aT=null
}if(F!=null){if(F.canSendMessage){F.close()
}F=null
}if(ao!=null){ao.close();
ao=null
}an()
}function an(){if(ba!=null){clearInterval(aU);
document.cookie=bb+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
ba.signal("close",{reason:"",heir:!af?aD:(ba.get("children")||[])[0]});
ba.close()
}if(B!=null){B.close()
}}function ag(i){aA();
a2=a.util.extend(a2,i);
a2.mrequest=a2.reconnect;
if(!a2.reconnect){a2.reconnect=true
}}function aa(){return a2.webSocketImpl!=null||window.WebSocket||window.MozWebSocket
}function ab(){return window.EventSource
}function av(){if(a2.shared){B=bd(a2);
if(B!=null){if(a2.logLevel==="debug"){a.util.debug("Storage service available. All communication will be local")
}if(B.open(a2)){return
}}if(a2.logLevel==="debug"){a.util.debug("No Storage service available.")
}B=null
}a2.firstMessage=e==0?true:false;
a2.isOpen=false;
a2.ctime=a.util.now();
if(a2.uuid===0){a2.uuid=e
}ac.closedByClientTimeout=false;
if(a2.transport!=="websocket"&&a2.transport!=="sse"){aJ(a2)
}else{if(a2.transport==="websocket"){if(!aa()){bh("Websocket is not supported, using request.fallbackTransport ("+a2.fallbackTransport+")")
}else{ap(false)
}}else{if(a2.transport==="sse"){if(!ab()){bh("Server Side Events(SSE) is not supported, using request.fallbackTransport ("+a2.fallbackTransport+")")
}else{aR(false)
}}}}}function bd(p){var o,q,l,j="atmosphere-"+p.url,i={storage:function(){function w(x){if(x.key===j&&x.newValue){s(x.newValue)
}}if(!a.util.storage){return
}var t=window.localStorage,v=function(x){return a.util.parseJSON(t.getItem(j+"-"+x))
},u=function(y,x){t.setItem(j+"-"+y,a.util.stringifyJSON(x))
};
return{init:function(){u("children",v("children").concat([aD]));
a.util.on(window,"storage",w);
return v("opened")
},signal:function(y,x){t.setItem(j,a.util.stringifyJSON({target:"p",type:y,data:x}))
},close:function(){var x=v("children");
a.util.off(window,"storage",w);
if(x){if(n(x,p.id)){u("children",x)
}}}}
},windowref:function(){var t=window.open("",j.replace(/\W/g,""));
if(!t||t.closed||!t.callbacks){return
}return{init:function(){t.callbacks.push(s);
t.children.push(aD);
return t.opened
},signal:function(v,u){if(!t.closed&&t.fire){t.fire(a.util.stringifyJSON({target:"p",type:v,data:u}))
}},close:function(){if(!l){n(t.callbacks,s);
n(t.children,aD)
}}}
}};
function n(t,u){var w,v=t.length;
for(w=0;
w<v;
w++){if(t[w]===u){t.splice(w,1)
}}return v!==t.length
}function s(v){var t=a.util.parseJSON(v),u=t.data;
if(t.target==="c"){switch(t.type){case"open":az("opening","local",a2);
break;
case"close":if(!l){l=true;
if(u.reason==="aborted"){aM()
}else{if(u.heir===aD){av()
}else{setTimeout(function(){av()
},100)
}}}break;
case"message":a6(u,"messageReceived",200,p.transport);
break;
case"localMessage":aO(u);
break
}}}function m(){var t=new RegExp("(?:^|; )("+encodeURIComponent(j)+")=([^;]*)").exec(document.cookie);
if(t){return a.util.parseJSON(decodeURIComponent(t[2]))
}}o=m();
if(!o||a.util.now()-o.ts>1000){return
}q=i.storage()||i.windowref();
if(!q){return
}return{open:function(){var t;
aU=setInterval(function(){var u=o;
o=m();
if(!o||u.ts===o.ts){s(a.util.stringifyJSON({target:"c",type:"close",data:{reason:"error",heir:u.heir}}))
}},1000);
t=q.init();
if(t){setTimeout(function(){az("opening","local",p)
},50)
}return t
},send:function(t){q.signal("send",t)
},localSend:function(t){q.signal("localSend",a.util.stringifyJSON({id:aD,event:t}))
},close:function(){if(!af){clearInterval(aU);
q.signal("close");
q.close()
}}}
}function bc(){var n,o="atmosphere-"+a2.url,i={storage:function(){function q(s){if(s.key===o&&s.newValue){m(s.newValue)
}}if(!a.util.storage){return
}var p=window.localStorage;
return{init:function(){a.util.on(window,"storage",q)
},signal:function(s,t){p.setItem(o,a.util.stringifyJSON({target:"c",type:s,data:t}))
},get:function(s){return a.util.parseJSON(p.getItem(o+"-"+s))
},set:function(s,t){p.setItem(o+"-"+s,a.util.stringifyJSON(t))
},close:function(){a.util.off(window,"storage",q);
p.removeItem(o);
p.removeItem(o+"-opened");
p.removeItem(o+"-children")
}}
},windowref:function(){var q=o.replace(/\W/g,""),s=document.getElementById(q),p;
if(!s){s=document.createElement("div");
s.id=q;
s.style.display="none";
s.innerHTML='<iframe name="'+q+'" />';
document.body.appendChild(s)
}p=s.firstChild.contentWindow;
return{init:function(){p.callbacks=[m];
p.fire=function(u){var t;
for(t=0;
t<p.callbacks.length;
t++){p.callbacks[t](u)
}}
},signal:function(u,t){if(!p.closed&&p.fire){p.fire(a.util.stringifyJSON({target:"c",type:u,data:t}))
}},get:function(t){return !p.closed?p[t]:null
},set:function(u,t){if(!p.closed){p[u]=t
}},close:function(){}}
}};
function m(s){var p=a.util.parseJSON(s),q=p.data;
if(p.target==="p"){switch(p.type){case"send":aY(q);
break;
case"localSend":aO(q);
break;
case"close":aM();
break
}}}aE=function j(p){n.signal("message",p)
};
function l(){document.cookie=bb+"="+encodeURIComponent(a.util.stringifyJSON({ts:a.util.now()+1,heir:(n.get("children")||[])[0]}))+"; path=/"
}n=i.storage()||i.windowref();
n.init();
if(a2.logLevel==="debug"){a.util.debug("Installed StorageService "+n)
}n.set("children",[]);
if(n.get("opened")!=null&&!n.get("opened")){n.set("opened",false)
}bb=encodeURIComponent(o);
l();
aU=setInterval(l,1000);
ba=n
}function az(m,i,n){if(a2.shared&&i!=="local"){bc()
}if(ba!=null){ba.set("opened",true)
}n.close=function(){aM()
};
if(A>0&&m==="re-connecting"){n.isReopen=true;
a1(ac)
}else{if(ac.error==null){ac.request=n;
var l=ac.state;
ac.state=m;
var o=ac.transport;
ac.transport=i;
var j=ac.responseBody;
am();
ac.responseBody=j;
ac.state=l;
ac.transport=o
}}}function bf(i){i.transport="jsonp";
var j=a2,l;
if((i!=null)&&(typeof(i)!=="undefined")){j=i
}ax={open:function(){var m="atmosphere"+(++aD);
function n(){var q=j.url;
if(j.dispatchUrl!=null){q+=j.dispatchUrl
}var o=j.data;
if(j.attachHeadersAsQueryString){q=a3(j);
if(o!==""){q+="&X-Atmosphere-Post-Body="+encodeURIComponent(o)
}o=""
}var p=document.head||document.getElementsByTagName("head")[0]||document.documentElement;
l=document.createElement("script");
l.src=q+"&jsonpTransport="+m;
l.clean=function(){l.clean=l.onerror=l.onload=l.onreadystatechange=null;
if(l.parentNode){l.parentNode.removeChild(l)
}};
l.onload=l.onreadystatechange=function(){if(!l.readyState||/loaded|complete/.test(l.readyState)){l.clean()
}};
l.onerror=function(){l.clean();
j.lastIndex=0;
if(j.openId){clearTimeout(j.openId)
}if(j.heartbeatTimer){clearTimeout(j.heartbeatTimer)
}if(j.reconnect&&A++<j.maxReconnectOnClose){az("re-connecting",j.transport,j);
ah(ax,j,i.reconnectInterval);
j.openId=setTimeout(function(){aw(j)
},j.reconnectInterval+1000)
}else{aB(0,"maxReconnectOnClose reached")
}};
p.insertBefore(l,p.firstChild)
}window[m]=function(o){if(j.reconnect){if(j.maxRequest===-1||j.requestCount++<j.maxRequest){a8(j);
if(!j.executeCallbackBeforeReconnect){ah(ax,j,j.pollingInterval)
}if(o!=null&&typeof o!=="string"){try{o=o.message
}catch(p){}}var q=a0(o,j,ac);
if(!q){a6(ac.responseBody,"messageReceived",200,j.transport)
}if(j.executeCallbackBeforeReconnect){ah(ax,j,j.pollingInterval)
}}else{a.util.log(a2.logLevel,["JSONP reconnect maximum try reached "+a2.requestCount]);
aB(0,"maxRequest reached")
}}};
setTimeout(function(){n()
},50)
},abort:function(){if(l&&l.clean){l.clean()
}}};
ax.open()
}function G(i){if(a2.webSocketImpl!=null){return a2.webSocketImpl
}else{if(window.WebSocket){return new WebSocket(i)
}else{return new MozWebSocket(i)
}}}function aW(){return a3(a2,a.util.getAbsoluteURL(a2.webSocketUrl||a2.url)).replace(/^http/,"ws")
}function aC(){var i=a3(a2);
return i
}function aR(j){ac.transport="sse";
var l=aC();
if(a2.logLevel==="debug"){a.util.debug("Invoking executeSSE");
a.util.debug("Using URL: "+l)
}if(j&&!a2.reconnect){if(ao!=null){a7()
}return
}try{ao=new EventSource(l,{withCredentials:a2.withCredentials})
}catch(i){aB(0,i);
bh("SSE failed. Downgrading to fallback transport and resending");
return
}if(a2.connectTimeout>0){a2.id=setTimeout(function(){if(!j){a7()
}},a2.connectTimeout)
}ao.onopen=function(m){a8(a2);
if(a2.logLevel==="debug"){a.util.debug("SSE successfully opened")
}if(!a2.enableProtocol){if(!j){az("opening","sse",a2)
}else{az("re-opening","sse",a2)
}}else{if(a2.isReopen){a2.isReopen=false;
az("re-opening",a2.transport,a2)
}}j=true;
if(a2.method==="POST"){ac.state="messageReceived";
ao.send(a2.data)
}};
ao.onmessage=function(m){a8(a2);
if(!a2.enableXDR&&m.origin&&m.origin!==window.location.protocol+"//"+window.location.host){a.util.log(a2.logLevel,["Origin was not "+window.location.protocol+"//"+window.location.host]);
return
}ac.state="messageReceived";
ac.status=200;
m=m.data;
var n=a0(m,a2,ac);
if(!n){am();
ac.responseBody="";
ac.messages=[]
}};
ao.onerror=function(m){clearTimeout(a2.id);
if(a2.heartbeatTimer){clearTimeout(a2.heartbeatTimer)
}if(ac.closedByClientTimeout){return
}aq(j);
a7();
if(af){a.util.log(a2.logLevel,["SSE closed normally"])
}else{if(!j){bh("SSE failed. Downgrading to fallback transport and resending")
}else{if(a2.reconnect&&(ac.transport==="sse")){if(A++<a2.maxReconnectOnClose){az("re-connecting",a2.transport,a2);
if(a2.reconnectInterval>0){a2.reconnectId=setTimeout(function(){aR(true)
},a2.reconnectInterval)
}else{aR(true)
}ac.responseBody="";
ac.messages=[]
}else{a.util.log(a2.logLevel,["SSE reconnect maximum try reached "+A]);
aB(0,"maxReconnectOnClose reached")
}}}}}
}function ap(l){ac.transport="websocket";
var m=aW(a2.url);
if(a2.logLevel==="debug"){a.util.debug("Invoking executeWebSocket");
a.util.debug("Using URL: "+m)
}if(l&&!a2.reconnect){if(F!=null){a7()
}return
}F=G(m);
if(a2.webSocketBinaryType!=null){F.binaryType=a2.webSocketBinaryType
}if(a2.connectTimeout>0){a2.id=setTimeout(function(){if(!l){var o={code:1002,reason:"",wasClean:false};
F.onclose(o);
try{a7()
}catch(n){}return
}},a2.connectTimeout)
}F.onopen=function(n){a8(a2);
if(a2.logLevel==="debug"){a.util.debug("Websocket successfully opened")
}var o=l;
if(F!=null){F.canSendMessage=true
}if(!a2.enableProtocol){l=true;
if(o){az("re-opening","websocket",a2)
}else{az("opening","websocket",a2)
}}if(F!=null){if(a2.method==="POST"){ac.state="messageReceived";
F.send(a2.data)
}}};
F.onmessage=function(n){a8(a2);
if(a2.enableProtocol){l=true
}ac.state="messageReceived";
ac.status=200;
n=n.data;
var p=typeof(n)==="string";
if(p){var o=a0(n,a2,ac);
if(!o){am();
ac.responseBody="";
ac.messages=[]
}}else{n=aZ(a2,n);
if(n===""){return
}ac.responseBody=n;
am();
ac.responseBody=null
}};
F.onerror=function(n){clearTimeout(a2.id);
if(a2.heartbeatTimer){clearTimeout(a2.heartbeatTimer)
}};
F.onclose=function(o){clearTimeout(a2.id);
if(ac.state==="closed"){return
}var n=o.reason;
if(n===""){switch(o.code){case 1000:n="Normal closure; the connection successfully completed whatever purpose for which it was created.";
break;
case 1001:n="The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.";
break;
case 1002:n="The endpoint is terminating the connection due to a protocol error.";
break;
case 1003:n="The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).";
break;
case 1004:n="The endpoint is terminating the connection because a data frame was received that is too large.";
break;
case 1005:n="Unknown: no status code was provided even though one was expected.";
break;
case 1006:n="Connection was closed abnormally (that is, with no close frame being sent).";
break
}}if(a2.logLevel==="warn"){a.util.warn("Websocket closed, reason: "+n);
a.util.warn("Websocket closed, wasClean: "+o.wasClean)
}if(ac.closedByClientTimeout){return
}aq(l);
ac.state="closed";
if(af){a.util.log(a2.logLevel,["Websocket closed normally"])
}else{if(!l){bh("Websocket failed. Downgrading to Comet and resending")
}else{if(a2.reconnect&&ac.transport==="websocket"&&o.code!==1001){a7();
if(A++<a2.maxReconnectOnClose){az("re-connecting",a2.transport,a2);
if(a2.reconnectInterval>0){a2.reconnectId=setTimeout(function(){ac.responseBody="";
ac.messages=[];
ap(true)
},a2.reconnectInterval)
}else{ac.responseBody="";
ac.messages=[];
ap(true)
}}else{a.util.log(a2.logLevel,["Websocket reconnect maximum try reached "+a2.requestCount]);
if(a2.logLevel==="warn"){a.util.warn("Websocket error, reason: "+o.reason)
}aB(0,"maxReconnectOnClose reached")
}}}}};
var j=navigator.userAgent.toLowerCase();
var i=j.indexOf("android")>-1;
if(i&&F.url===undefined){F.onclose({reason:"Android 4.1 does not support websockets.",wasClean:false})
}}function aZ(j,l){var m=l;
if(j.transport==="polling"){return m
}if(a.util.trim(l).length!==0&&j.enableProtocol&&j.firstMessage){var i=j.trackMessageLength?1:0;
var n=l.split(j.messageDelimiter);
if(n.length<=i+1){return m
}j.firstMessage=false;
j.uuid=a.util.trim(n[i]);
if(n.length<=i+2){a.util.log("error",["Protocol data not sent by the server. If you enable protocol on client side, be sure to install JavascriptProtocol interceptor on server side.Also note that atmosphere-runtime 2.2+ should be used."])
}var q=parseInt(a.util.trim(n[i+1]),10);
ak=n[i+2];
if(!isNaN(q)&&q>0){var o=function(){aY(ak);
j.heartbeatTimer=setTimeout(o,q)
};
j.heartbeatTimer=setTimeout(o,q)
}if(j.transport!=="long-polling"){aw(j)
}e=j.uuid;
m="";
i=j.trackMessageLength?4:3;
if(n.length>i+1){for(var p=i;
p<n.length;
p++){m+=n[p];
if(p+1!==n.length){m+=j.messageDelimiter
}}}if(j.ackInterval!==0){setTimeout(function(){aY("...ACK...")
},j.ackInterval)
}}else{if(j.enableProtocol&&j.firstMessage&&a.util.browser.msie&&+a.util.browser.version.split(".")[0]<10){a.util.log(a2.logLevel,["Receiving unexpected data from IE"])
}else{aw(j)
}}return m
}function a8(i){i.timedOut=false;
clearTimeout(i.id);
if(i.timeout>0&&i.transport!=="polling"){i.id=setTimeout(function(){i.timedOut=true;
be(i);
aQ();
a7()
},i.timeout)
}}function be(i){ac.closedByClientTimeout=true;
ac.state="closedByClient";
ac.responseBody="";
ac.status=408;
ac.messages=[];
am()
}function aB(j,i){a7();
clearTimeout(a2.id);
ac.state="error";
ac.reasonPhrase=i;
ac.responseBody="";
ac.status=j;
ac.messages=[];
am()
}function a0(l,m,p){l=aZ(m,l);
if(l.length===0){return true
}p.responseBody=l;
if(m.trackMessageLength){l=p.partialMessage+l;
var n=[];
var o=l.indexOf(m.messageDelimiter);
while(o!==-1){var i=l.substring(0,o);
var j=+i;
if(isNaN(j)){throw new Error('message length "'+i+'" is not a number')
}o+=m.messageDelimiter.length;
if(o+j>l.length){o=-1
}else{n.push(l.substring(o,o+j));
l=l.substring(o+j,l.length);
o=l.indexOf(m.messageDelimiter)
}}p.partialMessage=l;
if(n.length!==0){p.responseBody=n.join(m.messageDelimiter);
p.messages=n;
return false
}else{p.responseBody="";
p.messages=[];
return true
}}else{p.responseBody=l
}return false
}function bh(j){a.util.log(a2.logLevel,[j]);
if(typeof(a2.onTransportFailure)!=="undefined"){a2.onTransportFailure(j,a2)
}else{if(typeof(a.util.onTransportFailure)!=="undefined"){a.util.onTransportFailure(j,a2)
}}a2.transport=a2.fallbackTransport;
var i=a2.connectTimeout===-1?0:a2.connectTimeout;
if(a2.reconnect&&a2.transport!=="none"||a2.transport==null){a2.method=a2.fallbackMethod;
ac.transport=a2.fallbackTransport;
a2.fallbackTransport="none";
if(i>0){a2.reconnectId=setTimeout(function(){av()
},i)
}else{av()
}}else{aB(500,"Unable to reconnect with fallback transport")
}}function a3(i,l){var j=a2;
if((i!=null)&&(typeof(i)!=="undefined")){j=i
}if(l==null){l=j.url
}if(!j.attachHeadersAsQueryString){return l
}if(l.indexOf("X-Atmosphere-Framework")!==-1){return l
}l+=(l.indexOf("?")!==-1)?"&":"?";
l+="X-Atmosphere-tracking-id="+j.uuid;
l+="&X-Atmosphere-Framework="+g;
l+="&X-Atmosphere-Transport="+j.transport;
if(j.trackMessageLength){l+="&X-Atmosphere-TrackMessageSize=true"
}if(j.heartbeat!==null&&j.heartbeat.server!==null){l+="&X-Heartbeat-Server="+j.heartbeat.server
}if(j.contentType!==""){l+="&Content-Type="+(j.transport==="websocket"?j.contentType:encodeURIComponent(j.contentType))
}if(j.enableProtocol){l+="&X-atmo-protocol=true"
}a.util.each(j.headers,function(o,m){var n=a.util.isFunction(m)?m.call(this,j,i,ac):m;
if(n!=null){l+="&"+encodeURIComponent(o)+"="+encodeURIComponent(n)
}});
return l
}function aw(i){if(!i.isOpen){i.isOpen=true;
az("opening",i.transport,i)
}else{if(i.isReopen){i.isReopen=false;
az("re-opening",i.transport,i)
}else{if(ac.state==="messageReceived"&&(i.transport==="jsonp"||i.transport==="long-polling")){ae(ac)
}}}}function aJ(l){var n=a2;
if((l!=null)||(typeof(l)!=="undefined")){n=l
}n.lastIndex=0;
n.readyState=0;
if((n.transport==="jsonp")||((n.enableXDR)&&(a.util.checkCORSSupport()))){bf(n);
return
}if(a.util.browser.msie&&+a.util.browser.version.split(".")[0]<10){if((n.transport==="streaming")){if(n.enableXDR&&window.XDomainRequest){aF(n)
}else{bg(n)
}return
}if((n.enableXDR)&&(window.XDomainRequest)){aF(n);
return
}}var j=function(){n.lastIndex=0;
if(n.reconnect&&A++<n.maxReconnectOnClose){ac.ffTryingReconnect=true;
az("re-connecting",l.transport,l);
ah(m,n,l.reconnectInterval)
}else{aB(0,"maxReconnectOnClose reached")
}};
var o=function(){ac.errorHandled=true;
a7();
j()
};
if(n.force||(n.reconnect&&(n.maxRequest===-1||n.requestCount++<n.maxRequest))){n.force=false;
var m=a.util.xhr();
m.hasData=false;
aI(m,n,true);
if(n.suspend){aT=m
}if(n.transport!=="polling"){ac.transport=n.transport;
m.onabort=function(){aq(true)
};
m.onerror=function(){ac.error=true;
ac.ffTryingReconnect=true;
try{ac.status=XMLHttpRequest.status
}catch(p){ac.status=500
}if(!ac.status){ac.status=500
}if(!ac.errorHandled){a7();
j()
}}
}m.onreadystatechange=function(){if(af){return
}ac.error=null;
var q=false;
var t=false;
if(n.transport==="streaming"&&n.readyState>2&&m.readyState===4){a7();
j();
return
}n.readyState=m.readyState;
if(n.transport==="streaming"&&m.readyState>=3){t=true
}else{if(n.transport==="long-polling"&&m.readyState===4){t=true
}}a8(a2);
if(n.transport!=="polling"){var s=200;
if(m.readyState===4){s=m.status>1000?0:m.status
}if(!n.reconnectOnServerError&&(s>=300&&s<600)){aB(s,m.statusText);
return
}if(s>=300||s===0){o();
return
}if((!n.enableProtocol||!l.firstMessage)&&m.readyState===2){if(a.util.browser.mozilla&&ac.ffTryingReconnect){ac.ffTryingReconnect=false;
setTimeout(function(){if(!ac.ffTryingReconnect){aw(n)
}},500)
}else{aw(n)
}}}else{if(m.readyState===4){t=true
}}if(t){var w=m.responseText;
ac.errorHandled=false;
if(a.util.trim(w).length===0&&n.transport==="long-polling"){if(!m.hasData){ah(m,n,n.pollingInterval)
}else{m.hasData=false
}return
}m.hasData=true;
aN(m,a2);
if(n.transport==="streaming"){if(!a.util.browser.opera){var x=w.substring(n.lastIndex,w.length);
q=a0(x,n,ac);
n.lastIndex=w.length;
if(q){return
}}else{a.util.iterate(function(){if(ac.status!==500&&m.responseText.length>n.lastIndex){try{ac.status=m.status;
ac.headers=a.util.parseHeaders(m.getAllResponseHeaders());
aN(m,a2)
}catch(y){ac.status=404
}a8(a2);
ac.state="messageReceived";
var z=m.responseText.substring(n.lastIndex);
n.lastIndex=m.responseText.length;
q=a0(z,n,ac);
if(!q){am()
}if(aL(m,n)){aK(m,n);
return
}}else{if(ac.status>400){n.lastIndex=m.responseText.length;
return false
}}},0)
}}else{q=a0(w,n,ac)
}var u=aL(m,n);
try{ac.status=m.status;
ac.headers=a.util.parseHeaders(m.getAllResponseHeaders());
aN(m,n)
}catch(v){ac.status=404
}if(n.suspend){ac.state=ac.status===0?"closed":"messageReceived"
}else{ac.state="messagePublished"
}var p=!u&&l.transport!=="streaming"&&l.transport!=="polling";
if(p&&!n.executeCallbackBeforeReconnect){ah(m,n,n.pollingInterval)
}if(ac.responseBody.length!==0&&!q){am()
}if(p&&n.executeCallbackBeforeReconnect){ah(m,n,n.pollingInterval)
}if(u){aK(m,n)
}}};
try{m.send(n.data);
aX=true
}catch(i){a.util.log(n.logLevel,["Unable to connect to "+n.url]);
aB(0,i)
}}else{if(n.logLevel==="debug"){a.util.log(n.logLevel,["Max re-connection reached."])
}aB(0,"maxRequest reached")
}}function aK(i,j){aM();
af=false;
ah(i,j,500)
}function aI(j,i,l){var m=i.url;
if(i.dispatchUrl!=null&&i.method==="POST"){m+=i.dispatchUrl
}m=a3(i,m);
m=a.util.prepareURL(m);
if(l){j.open(i.method,m,i.async);
if(i.connectTimeout>0){i.id=setTimeout(function(){if(i.requestCount===0){a7();
a6("Connect timeout","closed",200,i.transport)
}},i.connectTimeout)
}}if(a2.withCredentials&&a2.transport!=="websocket"){if("withCredentials" in j){j.withCredentials=true
}}if(!a2.dropHeaders){j.setRequestHeader("X-Atmosphere-Framework",a.util.version);
j.setRequestHeader("X-Atmosphere-Transport",i.transport);
if(j.heartbeat!==null&&j.heartbeat.server!==null){j.setRequestHeader("X-Heartbeat-Server",j.heartbeat.server)
}if(i.trackMessageLength){j.setRequestHeader("X-Atmosphere-TrackMessageSize","true")
}j.setRequestHeader("X-Atmosphere-tracking-id",i.uuid);
a.util.each(i.headers,function(p,n){var o=a.util.isFunction(n)?n.call(this,j,i,l,ac):n;
if(o!=null){j.setRequestHeader(p,o)
}})
}if(i.contentType!==""){j.setRequestHeader("Content-Type",i.contentType)
}}function ah(l,j,i){if(j.reconnect||(j.suspend&&aX)){var m=0;
if(l&&l.readyState>1){m=l.status>1000?0:l.status
}ac.status=m===0?204:m;
ac.reason=m===0?"Server resumed the connection or down.":"OK";
clearTimeout(j.id);
if(j.reconnectId){clearTimeout(j.reconnectId);
delete j.reconnectId
}if(i>0){a2.reconnectId=setTimeout(function(){aJ(j)
},i)
}else{aJ(j)
}}}function a1(i){i.state="re-connecting";
aj(i)
}function ae(i){i.state="openAfterResume";
aj(i);
i.state="messageReceived"
}function aF(i){if(i.transport!=="polling"){a4=at(i);
a4.open()
}else{at(i).open()
}}function at(o){var p=a2;
if((o!=null)&&(typeof(o)!=="undefined")){p=o
}var i=p.transport;
var j=0;
var q=new window.XDomainRequest();
var m=function(){if(p.transport==="long-polling"&&(p.reconnect&&(p.maxRequest===-1||p.requestCount++<p.maxRequest))){q.status=200;
aF(p)
}};
var l=p.rewriteURL||function(t){var s=/(?:^|;\s*)(JSESSIONID|PHPSESSID)=([^;]*)/.exec(document.cookie);
switch(s&&s[1]){case"JSESSIONID":return t.replace(/;jsessionid=[^\?]*|(\?)|$/,";jsessionid="+s[2]+"$1");
case"PHPSESSID":return t.replace(/\?PHPSESSID=[^&]*&?|\?|$/,"?PHPSESSID="+s[2]+"&").replace(/&$/,"")
}return t
};
q.onprogress=function(){n(q)
};
q.onerror=function(){if(p.transport!=="polling"){a7();
if(A++<p.maxReconnectOnClose){if(p.reconnectInterval>0){p.reconnectId=setTimeout(function(){az("re-connecting",o.transport,o);
aF(p)
},p.reconnectInterval)
}else{az("re-connecting",o.transport,o);
aF(p)
}}else{aB(0,"maxReconnectOnClose reached")
}}};
q.onload=function(){if(a2.timedOut){a2.timedOut=false;
a7();
p.lastIndex=0;
if(p.reconnect&&A++<p.maxReconnectOnClose){az("re-connecting",o.transport,o);
m()
}else{aB(0,"maxReconnectOnClose reached")
}}};
var n=function(s){clearTimeout(p.id);
var t=s.responseText;
t=t.substring(j);
j+=t.length;
if(i!=="polling"){a8(p);
var u=a0(t,p,ac);
if(i==="long-polling"&&a.util.trim(t).length===0){return
}if(p.executeCallbackBeforeReconnect){m()
}if(!u){a6(ac.responseBody,"messageReceived",200,i)
}if(!p.executeCallbackBeforeReconnect){m()
}}};
return{open:function(){var s=p.url;
if(p.dispatchUrl!=null){s+=p.dispatchUrl
}s=a3(p,s);
q.open(p.method,l(s));
if(p.method==="GET"){q.send()
}else{q.send(p.data)
}if(p.connectTimeout>0){p.id=setTimeout(function(){if(p.requestCount===0){a7();
a6("Connect timeout","closed",200,p.transport)
}},p.connectTimeout)
}},close:function(){q.abort()
}}
}function bg(i){a4=au(i);
a4.open()
}function au(j){var l=a2;
if((j!=null)&&(typeof(j)!=="undefined")){l=j
}var m;
var i=new window.ActiveXObject("htmlfile");
i.open();
i.close();
var n=l.url;
if(l.dispatchUrl!=null){n+=l.dispatchUrl
}if(l.transport!=="polling"){ac.transport=l.transport
}return{open:function(){var p=i.createElement("iframe");
n=a3(l);
if(l.data!==""){n+="&X-Atmosphere-Post-Body="+encodeURIComponent(l.data)
}n=a.util.prepareURL(n);
p.src=n;
i.body.appendChild(p);
var o=p.contentDocument||p.contentWindow.document;
m=a.util.iterate(function(){try{if(!o.firstChild){return
}var v=o.body?o.body.lastChild:o;
var t=function(){var w=v.cloneNode(true);
w.appendChild(o.createTextNode("."));
var x=w.innerText;
x=x.substring(0,x.length-1);
return x
};
if(!o.body||!o.body.firstChild||o.body.firstChild.nodeName.toLowerCase()!=="pre"){var q=o.head||o.getElementsByTagName("head")[0]||o.documentElement||o;
var s=o.createElement("script");
s.text="document.write('<plaintext>')";
q.insertBefore(s,q.firstChild);
q.removeChild(s);
v=o.body.lastChild
}if(l.closed){l.isReopen=true
}m=a.util.iterate(function(){var w=t();
if(w.length>l.lastIndex){a8(a2);
ac.status=200;
ac.error=null;
v.innerText="";
var x=a0(w,l,ac);
if(x){return""
}a6(ac.responseBody,"messageReceived",200,l.transport)
}l.lastIndex=0;
if(o.readyState==="complete"){aq(true);
az("re-connecting",l.transport,l);
if(l.reconnectInterval>0){l.reconnectId=setTimeout(function(){bg(l)
},l.reconnectInterval)
}else{bg(l)
}return false
}},null);
return false
}catch(u){ac.error=true;
az("re-connecting",l.transport,l);
if(A++<l.maxReconnectOnClose){if(l.reconnectInterval>0){l.reconnectId=setTimeout(function(){bg(l)
},l.reconnectInterval)
}else{bg(l)
}}else{aB(0,"maxReconnectOnClose reached")
}i.execCommand("Stop");
i.close();
return false
}})
},close:function(){if(m){m()
}i.execCommand("Stop");
aq(true)
}}
}function aY(i){if(B!=null){aP(i)
}else{if(aT!=null||ao!=null){aG(i)
}else{if(a4!=null){a9(i)
}else{if(ax!=null){aS(i)
}else{if(F!=null){ay(i)
}else{aB(0,"No suspended connection available");
a.util.error("No suspended connection available. Make sure atmosphere.subscribe has been called and request.onOpen invoked before invoking this method")
}}}}}}function ai(i,j){if(!j){j=aV(i)
}j.transport="polling";
j.method="GET";
j.withCredentials=false;
j.reconnect=false;
j.force=true;
j.suspend=false;
j.timeout=1000;
aJ(j)
}function aP(i){B.send(i)
}function ad(i){if(i.length===0){return
}try{if(B){B.localSend(i)
}else{if(ba){ba.signal("localMessage",a.util.stringifyJSON({id:aD,event:i}))
}}}catch(j){a.util.error(j)
}}function aG(i){var j=aV(i);
aJ(j)
}function a9(i){if(a2.enableXDR&&a.util.checkCORSSupport()){var j=aV(i);
j.reconnect=false;
bf(j)
}else{aG(i)
}}function aS(i){aG(i)
}function aH(j){var i=j;
if(typeof(i)==="object"){i=j.data
}return i
}function aV(j){var i=aH(j);
var l={connected:false,timeout:60000,method:"POST",url:a2.url,contentType:a2.contentType,headers:a2.headers,reconnect:true,callback:null,data:i,suspend:false,maxRequest:-1,logLevel:"info",requestCount:0,withCredentials:a2.withCredentials,async:a2.async,transport:"polling",isOpen:true,attachHeadersAsQueryString:true,enableXDR:a2.enableXDR,uuid:a2.uuid,dispatchUrl:a2.dispatchUrl,enableProtocol:false,messageDelimiter:"|",trackMessageLength:a2.trackMessageLength,maxReconnectOnClose:a2.maxReconnectOnClose,heartbeatTimer:a2.heartbeatTimer,heartbeat:a2.heartbeat};
if(typeof(j)==="object"){l=a.util.extend(l,j)
}return l
}function ay(m){var i=a.util.isBinary(m)?m:aH(m);
var l;
try{if(a2.dispatchUrl!=null){l=a2.webSocketPathDelimiter+a2.dispatchUrl+a2.webSocketPathDelimiter+i
}else{l=i
}if(!F.canSendMessage){a.util.error("WebSocket not connected.");
return
}F.send(l)
}catch(j){F.onclose=function(n){};
a7();
bh("Websocket failed. Downgrading to Comet and resending "+m);
aG(m)
}}function aO(i){var j=a.util.parseJSON(i);
if(j.id!==aD){if(typeof(a2.onLocalMessage)!=="undefined"){a2.onLocalMessage(j.event)
}else{if(typeof(a.util.onLocalMessage)!=="undefined"){a.util.onLocalMessage(j.event)
}}}}function a6(i,m,l,j){ac.responseBody=i;
ac.transport=j;
ac.status=l;
ac.state=m;
am()
}function aN(m,j){if(!j.readResponsesHeaders){if(!j.enableProtocol){j.uuid=aD
}}else{try{var l=m.getResponseHeader("X-Atmosphere-tracking-id");
if(l&&l!=null){j.uuid=l.split(" ").pop()
}}catch(i){}}}function aj(i){a5(i,a2);
a5(i,a.util)
}function a5(j,i){switch(j.state){case"messageReceived":A=0;
if(typeof(i.onMessage)!=="undefined"){i.onMessage(j)
}if(typeof(i.onmessage)!=="undefined"){i.onmessage(j)
}break;
case"error":if(typeof(i.onError)!=="undefined"){i.onError(j)
}if(typeof(i.onerror)!=="undefined"){i.onerror(j)
}break;
case"opening":delete a2.closed;
if(typeof(i.onOpen)!=="undefined"){i.onOpen(j)
}if(typeof(i.onopen)!=="undefined"){i.onopen(j)
}break;
case"messagePublished":if(typeof(i.onMessagePublished)!=="undefined"){i.onMessagePublished(j)
}break;
case"re-connecting":if(typeof(i.onReconnect)!=="undefined"){i.onReconnect(a2,j)
}break;
case"closedByClient":if(typeof(i.onClientTimeout)!=="undefined"){i.onClientTimeout(a2)
}break;
case"re-opening":delete a2.closed;
if(typeof(i.onReopen)!=="undefined"){i.onReopen(a2,j)
}break;
case"fail-to-reconnect":if(typeof(i.onFailureToReconnect)!=="undefined"){i.onFailureToReconnect(a2,j)
}break;
case"unsubscribe":case"closed":var l=typeof(a2.closed)!=="undefined"?a2.closed:false;
if(!l){if(typeof(i.onClose)!=="undefined"){i.onClose(j)
}if(typeof(i.onclose)!=="undefined"){i.onclose(j)
}}a2.closed=true;
break;
case"openAfterResume":if(typeof(i.onOpenAfterResume)!=="undefined"){i.onOpenAfterResume(a2)
}break
}}function aq(i){if(ac.state!=="closed"){ac.state="closed";
ac.responseBody="";
ac.messages=[];
ac.status=!i?501:200;
am()
}}function am(){var l=function(p,o){o(ac)
};
if(B==null&&aE!=null){aE(ac.responseBody)
}a2.reconnect=a2.mrequest;
var n=typeof(ac.responseBody)==="string";
var j=(n&&a2.trackMessageLength)?(ac.messages.length>0?ac.messages:[""]):new Array(ac.responseBody);
for(var m=0;
m<j.length;
m++){if(j.length>1&&j[m].length===0){continue
}ac.responseBody=(n)?a.util.trim(j[m]):j[m];
if(B==null&&aE!=null){aE(ac.responseBody)
}if((ac.responseBody.length===0||(n&&ak===ac.responseBody))&&ac.state==="messageReceived"){continue
}aj(ac);
if(d.length>0){if(a2.logLevel==="debug"){a.util.debug("Invoking "+d.length+" global callbacks: "+ac.state)
}try{a.util.each(d,l)
}catch(i){a.util.log(a2.logLevel,["Callback exception"+i])
}}if(typeof(a2.callback)==="function"){if(a2.logLevel==="debug"){a.util.debug("Invoking request callbacks")
}try{a2.callback(ac)
}catch(i){a.util.log(a2.logLevel,["Callback exception"+i])
}}}}this.subscribe=function(i){ag(i);
av()
};
this.execute=function(){av()
};
this.close=function(){aM()
};
this.disconnect=function(){aQ()
};
this.getUrl=function(){return a2.url
};
this.push=function(i,j){if(j!=null){var l=a2.dispatchUrl;
a2.dispatchUrl=j;
aY(i);
a2.dispatchUrl=l
}else{aY(i)
}};
this.getUUID=function(){return a2.uuid
};
this.pushLocal=function(i){ad(i)
};
this.enableProtocol=function(i){return a2.enableProtocol
};
this.request=a2;
this.response=ac
}};
a.subscribe=function(m,i,j){if(typeof(i)==="function"){a.addCallback(i)
}if(typeof(m)!=="string"){j=m
}else{j.url=m
}e=((typeof(j)!=="undefined")&&typeof(j.uuid)!=="undefined")?j.uuid:0;
var l=new a.AtmosphereRequest(j);
l.execute();
c[c.length]=l;
return l
};
a.unsubscribe=function(){if(c.length>0){var l=[].concat(c);
for(var i=0;
i<l.length;
i++){var j=l[i];
j.close();
clearTimeout(j.response.request.id);
if(j.heartbeatTimer){clearTimeout(j.heartbeatTimer)
}}}c=[];
d=[]
};
a.unsubscribeUrl=function(l){var m=-1;
if(c.length>0){for(var i=0;
i<c.length;
i++){var j=c[i];
if(j.getUrl()===l){j.close();
clearTimeout(j.response.request.id);
if(j.heartbeatTimer){clearTimeout(j.heartbeatTimer)
}m=i;
break
}}}if(m>=0){c.splice(m,1)
}};
a.addCallback=function(i){if(a.util.inArray(i,d)===-1){d.push(i)
}};
a.removeCallback=function(i){var j=a.util.inArray(i,d);
if(j!==-1){d.splice(j,1)
}};
a.util={browser:{},parseHeaders:function(l){var m,i=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,j={};
while(m=i.exec(l)){j[m[1]]=m[2]
}return j
},now:function(){return new Date().getTime()
},isArray:function(i){return Object.prototype.toString.call(i)==="[object Array]"
},inArray:function(j,i){if(!Array.prototype.indexOf){var m=i.length;
for(var l=0;
l<m;
++l){if(i[l]===j){return l
}}return -1
}return i.indexOf(j)
},isBinary:function(i){return/^\[object\s(?:Blob|ArrayBuffer|.+Array)\]$/.test(Object.prototype.toString.call(i))
},isFunction:function(i){return Object.prototype.toString.call(i)==="[object Function]"
},getAbsoluteURL:function(j){var i=document.createElement("div");
i.innerHTML='<a href="'+j+'"/>';
return encodeURI(decodeURI(i.firstChild.href))
},prepareURL:function(j){var i=a.util.now();
var l=j.replace(/([?&])_=[^&]*/,"$1_="+i);
return l+(l===j?(/\?/.test(j)?"&":"?")+"_="+i:"")
},trim:function(i){if(!String.prototype.trim){return i.toString().replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,"").replace(/\s+/g," ")
}else{return i.toString().trim()
}},param:function(i){var l,n=[];
function j(p,o){o=a.util.isFunction(o)?o():(o==null?"":o);
n.push(encodeURIComponent(p)+"="+encodeURIComponent(o))
}function m(p,o){var q;
if(a.util.isArray(o)){a.util.each(o,function(s,t){if(/\[\]$/.test(p)){j(p,t)
}else{m(p+"["+(typeof t==="object"?s:"")+"]",t)
}})
}else{if(Object.prototype.toString.call(o)==="[object Object]"){for(q in o){m(p+"["+q+"]",o[q])
}}else{j(p,o)
}}}for(l in i){m(l,i[l])
}return n.join("&").replace(/%20/g,"+")
},storage:function(){try{return !!(window.localStorage&&window.StorageEvent)
}catch(i){return false
}},iterate:function(j,l){var i;
l=l||0;
(function m(){i=setTimeout(function(){if(j()===false){return
}m()
},l)
})();
return function(){clearTimeout(i)
}
},each:function(p,o,m){if(!p){return
}var i,l=0,j=p.length,n=a.util.isArray(p);
if(m){if(n){for(;
l<j;
l++){i=o.apply(p[l],m);
if(i===false){break
}}}else{for(l in p){i=o.apply(p[l],m);
if(i===false){break
}}}}else{if(n){for(;
l<j;
l++){i=o.call(p[l],l,p[l]);
if(i===false){break
}}}else{for(l in p){i=o.call(p[l],l,p[l]);
if(i===false){break
}}}}return p
},extend:function(i){var j,l,m;
for(j=1;
j<arguments.length;
j++){if((l=arguments[j])!=null){for(m in l){i[m]=l[m]
}}}return i
},on:function(i,j,l){if(i.addEventListener){i.addEventListener(j,l,false)
}else{if(i.attachEvent){i.attachEvent("on"+j,l)
}}},off:function(i,j,l){if(i.removeEventListener){i.removeEventListener(j,l,false)
}else{if(i.detachEvent){i.detachEvent("on"+j,l)
}}},log:function(i,j){if(window.console){var l=window.console[i];
if(typeof l==="function"){l.apply(window.console,j)
}}},warn:function(){a.util.log("warn",arguments)
},info:function(){a.util.log("info",arguments)
},debug:function(){a.util.log("debug",arguments)
},error:function(){a.util.log("error",arguments)
},xhr:function(){try{return new window.XMLHttpRequest()
}catch(i){try{return new window.ActiveXObject("Microsoft.XMLHTTP")
}catch(j){}}},parseJSON:function(i){return !i?null:window.JSON&&window.JSON.parse?window.JSON.parse(i):new Function("return "+i)()
},stringifyJSON:function(l){var o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,j={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};
function n(p){return'"'+p.replace(o,function(s){var q=j[s];
return typeof q==="string"?q:"\\u"+("0000"+s.charCodeAt(0).toString(16)).slice(-4)
})+'"'
}function m(p){return p<10?"0"+p:p
}return window.JSON&&window.JSON.stringify?window.JSON.stringify(l):(function i(s,t){var u,v,x,w,p=t[s],q=typeof p;
if(p&&typeof p==="object"&&typeof p.toJSON==="function"){p=p.toJSON(s);
q=typeof p
}switch(q){case"string":return n(p);
case"number":return isFinite(p)?String(p):"null";
case"boolean":return String(p);
case"object":if(!p){return"null"
}switch(Object.prototype.toString.call(p)){case"[object Date]":return isFinite(p.valueOf())?'"'+p.getUTCFullYear()+"-"+m(p.getUTCMonth()+1)+"-"+m(p.getUTCDate())+"T"+m(p.getUTCHours())+":"+m(p.getUTCMinutes())+":"+m(p.getUTCSeconds())+'Z"':"null";
case"[object Array]":x=p.length;
w=[];
for(u=0;
u<x;
u++){w.push(i(u,p)||"null")
}return"["+w.join(",")+"]";
default:w=[];
for(u in p){if(h.call(p,u)){v=i(u,p);
if(v){w.push(n(u)+":"+v)
}}}return"{"+w.join(",")+"}"
}}})("",{"":l})
},checkCORSSupport:function(){if(a.util.browser.msie&&!window.XDomainRequest&&+a.util.browser.version.split(".")[0]<11){return true
}else{if(a.util.browser.opera&&+a.util.browser.version.split(".")<12){return true
}else{if(a.util.trim(navigator.userAgent).slice(0,16)==="KreaTVWebKit/531"){return true
}else{if(a.util.trim(navigator.userAgent).slice(-7).toLowerCase()==="kreatel"){return true
}}}}var j=navigator.userAgent.toLowerCase();
var i=j.indexOf("android")>-1;
if(i){return true
}return false
}};
f=a.util.now();
(function(){var i=navigator.userAgent.toLowerCase(),j=/(chrome)[ \/]([\w.]+)/.exec(i)||/(webkit)[ \/]([\w.]+)/.exec(i)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(i)||/(msie) ([\w.]+)/.exec(i)||/(trident)(?:.*? rv:([\w.]+)|)/.exec(i)||i.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(i)||[];
a.util.browser[j[1]||""]=true;
a.util.browser.version=j[2]||"0";
if(a.util.browser.trident){a.util.browser.msie=true
}if(a.util.browser.msie||(a.util.browser.mozilla&&+a.util.browser.version.split(".")[0]===1)){a.util.storage=false
}})();
a.util.on(window,"unload",function(i){a.unsubscribe()
});
a.util.on(window,"keypress",function(i){if(i.charCode===27||i.keyCode===27){if(i.preventDefault){i.preventDefault()
}}});
a.util.on(window,"offline",function(){if(c.length>0){var l=[].concat(c);
for(var i=0;
i<l.length;
i++){var j=l[i];
j.close();
clearTimeout(j.response.request.id);
if(j.heartbeatTimer){clearTimeout(j.heartbeatTimer)
}}}});
a.util.on(window,"online",function(){if(c.length>0){for(var i=0;
i<c.length;
i++){c[i].execute()
}}});
return a
}));
(function(e,f){f.ui=f.ui||{};
var g=function(i){i.stopPropagation();
i.preventDefault()
};
var a=function(i){if(typeof i.onselectstart!="undefined"){e(f.getDomElement(i)).bind("selectstart",g)
}else{e(f.getDomElement(i)).bind("mousedown",g)
}};
var c=function(i){if(typeof i.onselectstart!="undefined"){e(f.getDomElement(i)).unbind("selectstart",g)
}else{e(f.getDomElement(i)).unbind("mousedown",g)
}};
var h={width:-1,height:-1,minWidth:-1,minHeight:-1,modal:true,moveable:true,resizeable:false,autosized:false,left:"auto",top:"auto",zindex:100,shadowDepth:5,shadowOpacity:0.1,attachToBody:true};
f.ui.PopupPanel=function(i,j){d.constructor.call(this,i);
this.markerId=i;
this.attachToDom(this.markerId);
this.options=e.extend(this.options,h,j||{});
this.minWidth=this.getMinimumSize(this.options.minWidth);
this.minHeight=this.getMinimumSize(this.options.minHeight);
this.maxWidth=this.options.maxWidth;
this.maxHeight=this.options.maxHeight;
this.baseZIndex=this.options.zindex;
this.div=e(f.getDomElement(i));
this.cdiv=e(f.getDomElement(i+"_container"));
this.contentDiv=e(f.getDomElement(i+"_content"));
this.shadowDiv=e(f.getDomElement(i+"_shadow"));
this.shadeDiv=e(f.getDomElement(i+"_shade"));
this.scrollerDiv=e(f.getDomElement(i+"_content_scroller"));
e(this.shadowDiv).css("opacity",this.options.shadowOpacity);
this.shadowDepth=parseInt(this.options.shadowDepth);
this.borders=new Array();
this.firstHref=e(f.getDomElement(i+"FirstHref"));
if(this.options.resizeable){this.borders.push(new f.ui.PopupPanel.Border(i+"ResizerN",this,"N-resize",f.ui.PopupPanel.Sizer.N));
this.borders.push(new f.ui.PopupPanel.Border(i+"ResizerE",this,"E-resize",f.ui.PopupPanel.Sizer.E));
this.borders.push(new f.ui.PopupPanel.Border(i+"ResizerS",this,"S-resize",f.ui.PopupPanel.Sizer.S));
this.borders.push(new f.ui.PopupPanel.Border(i+"ResizerW",this,"W-resize",f.ui.PopupPanel.Sizer.W));
this.borders.push(new f.ui.PopupPanel.Border(i+"ResizerNW",this,"NW-resize",f.ui.PopupPanel.Sizer.NW));
this.borders.push(new f.ui.PopupPanel.Border(i+"ResizerNE",this,"NE-resize",f.ui.PopupPanel.Sizer.NE));
this.borders.push(new f.ui.PopupPanel.Border(i+"ResizerSE",this,"SE-resize",f.ui.PopupPanel.Sizer.SE));
this.borders.push(new f.ui.PopupPanel.Border(i+"ResizerSW",this,"SW-resize",f.ui.PopupPanel.Sizer.SW))
}if(this.options.moveable&&f.getDomElement(i+"_header")){this.header=new f.ui.PopupPanel.Border(i+"_header",this,"move",f.ui.PopupPanel.Sizer.Header)
}else{e(f.getDomElement(i+"_header")).css("cursor","default")
}this.resizeProxy=e.proxy(this.resizeListener,this);
this.cdiv.resize(this.resizeProxy);
this.findForm(this.cdiv).on("ajaxcomplete",this.resizeProxy)
};
f.BaseComponent.extend(f.ui.PopupPanel);
var d=f.ui.PopupPanel.$super;
e.extend(f.ui.PopupPanel.prototype,(function(i){return{name:"PopupPanel",saveInputValues:function(j){if(f.browser.msie){e("input[type=checkbox], input[type=radio]",j).each(function(l){e(this).defaultChecked=e(this).checked
})
}},width:function(){return this.getContentElement()[0].clientWidth
},height:function(){return this.getContentElement()[0].clientHeight
},getLeft:function(){return this.cdiv.css("left")
},getTop:function(){return this.cdiv.css("top")
},getInitialSize:function(){if(this.options.autosized){return 15
}else{return e(f.getDomElement(this.markerId+"_header_content")).height()
}},getContentElement:function(){if(!this._contentElement){this._contentElement=this.cdiv
}return this._contentElement
},getSizeElement:function(){return document.body
},getMinimumSize:function(j){return Math.max(j,2*this.getInitialSize()+2)
},__getParsedOption:function(l,m){var j=parseInt(l[m],10);
if(j<0||isNaN(j)){j=this[m]
}return j
},destroy:function(){this.findForm(this.cdiv).off("ajaxcomplete",this.resizeProxy);
this._contentElement=null;
this.firstOutside=null;
this.lastOutside=null;
this.firstHref=null;
this.parent=null;
if(this.header){this.header.destroy();
this.header=null
}for(var j=0;
j<this.borders.length;
j++){this.borders[j].destroy()
}this.borders=null;
if(this.domReattached){this.div.remove()
}this.markerId=null;
this.options=null;
this.div=null;
this.cdiv=null;
this.contentDiv=null;
this.shadowDiv=null;
this.scrollerDiv=null;
this.userOptions=null;
this.eIframe=null;
d.destroy.call(this)
},initIframe:function(){if(this.contentWindow){e(this.contentWindow.document.body).css("margin","0px 0px 0px 0px")
}else{}if("transparent"==e(document.body).css("background-color")){e(this).css("filter","alpha(opacity=0)");
e(this).css("opacity","0")
}},setLeft:function(j){if(!isNaN(j)){this.cdiv.css("left",j+"px")
}},setTop:function(j){if(!isNaN(j)){this.cdiv.css("top",j+"px")
}},show:function(j,q){var B=this.cdiv;
if(!this.shown&&this.invokeEvent("beforeshow",j,null,B)){this.preventFocus();
if(!this.domReattached){this.parent=this.div.parent();
var o;
if(q){o=q.domElementAttachment
}if(!o){o=this.options.domElementAttachment
}var s;
if("parent"==o){s=this.parent
}else{if("form"==o){s=this.findForm(B)[0]||document.body
}else{s=document.body
}}if(s!=this.parent){this.saveInputValues(B);
this.shadeDiv.length&&s.appendChild(this.shadeDiv.get(0));
s.appendChild(this.cdiv.get(0));
this.domReattached=true
}else{this.parent.show()
}}var w=e("form",B);
if(this.options.keepVisualState&&w){for(var aa=0;
aa<w.length;
aa++){var F=this;
e(w[aa]).bind("submit",{popup:F},this.setStateInput)
}}var x={};
this.userOptions={};
e.extend(x,this.options);
if(q){e.extend(x,q);
e.extend(this.userOptions,q)
}if(this.options.autosized){if(x.left){var H;
if(x.left!="auto"){H=parseInt(x.left,10)
}else{var z=this.__calculateWindowWidth();
var v=this.width();
if(z>=v){H=(z-v)/2
}else{H=0
}}this.setLeft(Math.round(H));
e(this.shadowDiv).css("left",this.shadowDepth)
}if(x.top){var m;
if(x.top!="auto"){m=parseInt(x.top,10)
}else{var t=this.__calculateWindowHeight();
var G=this.height();
if(t>=G){m=(t-G)/2
}else{m=0
}}this.setTop(Math.round(m));
e(this.shadowDiv).css("top",this.shadowDepth);
e(this.shadowDiv).css("bottom",-this.shadowDepth)
}this.doResizeOrMove(f.ui.PopupPanel.Sizer.Diff.EMPTY)
}this.currentMinHeight=this.getMinimumSize(this.__getParsedOption(x,"minHeight"));
this.currentMinWidth=this.getMinimumSize(this.__getParsedOption(x,"minWidth"));
var A=this.getContentElement();
if(!this.options.autosized){if(x.width&&x.width==-1){x.width=300
}if(x.height&&x.height==-1){x.height=200
}}this.div.css("visibility","");
if(f.browser.msie){e(this.cdiv).find("input").each(function(){var I=e(this);
if(I.parents(".rf-pp-cntr").first().attr("id")===B.attr("id")){I.css("visibility",I.css("visibility"))
}})
}this.div.css("display","block");
if(this.options.autosized){this.shadowDiv.css("width",this.cdiv[0].clientWidth)
}if(x.width&&x.width!=-1||x.autosized){var n;
if(x.autosized){n=this.getStyle(this.getContentElement(),"width");
if(this.currentMinWidth>n){n=this.currentMinWidth
}if(n>this.maxWidth){n=this.maxWidth
}}else{if(this.currentMinWidth>x.width){x.width=this.currentMinWidth
}if(x.width>this.maxWidth){x.width=this.maxWidth
}n=x.width
}e(f.getDomElement(A)).css("width",n+(/px/.test(n)?"":"px"));
this.shadowDiv.css("width",n+(/px/.test(n)?"":"px"));
this.scrollerDiv.css("width",n+(/px/.test(n)?"":"px"))
}if(x.height&&x.height!=-1||x.autosized){var p;
if(x.autosized){p=this.getStyle(this.getContentElement(),"height");
if(this.currentMinHeight>p){p=this.currentMinHeight
}if(p>this.maxHeight){p=this.maxHeight
}}else{if(this.currentMinHeight>x.height){x.height=this.currentMinHeight
}if(x.height>this.maxHeight){x.height=this.maxHeight
}p=x.height
}e(f.getDomElement(A)).css("height",p+(/px/.test(p)?"":"px"));
var l=e(f.getDomElement(this.markerId+"_header"))?e(f.getDomElement(this.markerId+"_header")).innerHeight():0;
this.shadowDiv.css("height",p+(/px/.test(p)?"":"px"));
this.scrollerDiv.css("height",p-l+(/px/.test(p)?"":"px"))
}var u;
if(this.options.overlapEmbedObjects&&!this.iframe){this.iframe=this.markerId+"IFrame";
e('<iframe src="javascript:\'\'" frameborder="0" scrolling="no" id="'+this.iframe+'" class="rf-pp-ifr" style="width:'+this.options.width+"px; height:"+this.options.height+'px;"></iframe>').insertBefore(e(":first-child",this.cdiv)[0]);
u=e(f.getDomElement(this.iframe));
u.bind("load",this.initIframe);
this.eIframe=u
}if(x.left){var H;
if(x.left!="auto"){H=parseInt(x.left,10)
}else{var z=this.__calculateWindowWidth();
var v=this.width();
if(z>=v){H=(z-v)/2
}else{H=0
}}this.setLeft(Math.round(H));
e(this.shadowDiv).css("left",this.shadowDepth)
}if(x.top){var m;
if(x.top!="auto"){m=parseInt(x.top,10)
}else{var t=this.__calculateWindowHeight();
var G=this.height();
if(t>=G){m=(t-G)/2
}else{m=0
}}this.setTop(Math.round(m));
e(this.shadowDiv).css("top",this.shadowDepth);
e(this.shadowDiv).css("bottom",-this.shadowDepth)
}var y={};
y.parameters=q||{};
this.shown=true;
this.scrollerSizeDelta=parseInt(this.shadowDiv.css("height"))-parseInt(this.scrollerDiv.css("height"));
this.invokeEvent("show",y,null,B)
}},__calculateWindowHeight:function(){var j=document.documentElement;
return self.innerHeight||(j&&j.clientHeight)||document.body.clientHeight
},__calculateWindowWidth:function(){var j=document.documentElement;
return self.innerWidth||(j&&j.clientWidth)||document.body.clientWidth
},startDrag:function(j){a(document.body)
},firstOnfocus:function(l){var j=e(l.data.popup.firstHref);
if(j){j.focus()
}},processAllFocusElements:function(m,o){var n=-1;
var j;
var l="|a|input|select|button|textarea|";
if(m.focus&&m.nodeType==1&&(j=m.tagName)&&(n=l.indexOf(j.toLowerCase()))!=-1&&l.charAt(n-1)==="|"&&l.charAt(n+j.length)==="|"&&!m.disabled&&m.type!="hidden"){o.call(this,m)
}else{if(m!=this.cdiv.get(0)){var p=m.firstChild;
while(p){if(!p.style||p.style.display!="none"){this.processAllFocusElements(p,o)
}p=p.nextSibling
}}}},processTabindexes:function(j){if(!this.firstOutside){this.firstOutside=j
}if(!j.prevTabIndex){j.prevTabIndex=j.tabIndex;
j.tabIndex=-1
}if(!j.prevAccessKey){j.prevAccessKey=j.accessKey;
j.accessKey=""
}},restoreTabindexes:function(j){if(j.prevTabIndex!=undefined){if(j.prevTabIndex==0){e(j).removeAttr("tabindex")
}else{j.tabIndex=j.prevTabIndex
}j.prevTabIndex=undefined
}if(j.prevAccessKey!=undefined){if(j.prevAccessKey==""){e(j).removeAttr("accesskey")
}else{j.accessKey=j.prevAccessKey
}j.prevAccessKey=undefined
}},preventFocus:function(){if(this.options.modal){this.processAllFocusElements(document,this.processTabindexes);
var j=this;
if(this.firstOutside){e(f.getDomElement(this.firstOutside)).bind("focus",{popup:j},this.firstOnfocus)
}}},restoreFocus:function(){if(this.options.modal){this.processAllFocusElements(document,this.restoreTabindexes);
if(this.firstOutside){e(f.getDomElement(this.firstOutside)).unbind("focus",this.firstOnfocus);
this.firstOutside=null
}}},endDrag:function(j){for(var l=0;
l<this.borders.length;
l++){this.borders[l].show();
this.borders[l].doPosition()
}c(document.body)
},hide:function(q,j){var l=this.cdiv;
this.restoreFocus();
if(this.shown&&this.invokeEvent("beforehide",q,null,l)){this.currentMinHeight=undefined;
this.currentMinWidth=undefined;
this.div.hide();
if(this.parent){if(this.domReattached){this.saveInputValues(l);
var o=this.div.get(0);
this.shadeDiv.length&&o.appendChild(this.shadeDiv.get(0));
o.appendChild(l.get(0));
this.domReattached=false
}}var p={};
p.parameters=j||{};
var n=e("form",l);
if(this.options.keepVisualState&&n){for(var m=0;
m<n.length;
m++){e(n[m]).unbind("submit",this.setStateInput)
}}this.shown=false;
this.invokeEvent("hide",p,null,l);
this.setLeft(10);
this.setTop(10)
}},getStyle:function(j,l){return parseInt(e(f.getDomElement(j)).css(l).replace("px",""),10)
},resizeListener:function(l,j){this.doResizeOrMove(f.ui.PopupPanel.Sizer.Diff.EMPTY)
},doResizeOrMove:function(s){var x={};
var j={};
var t={};
var y={};
var u={};
var v={};
var q={};
var F;
var l=this.scrollerSizeDelta;
var G=0;
var z=this.getContentElement();
var B=s===f.ui.PopupPanel.Sizer.Diff.EMPTY||s.deltaWidth||s.deltaHeight;
if(B){if(this.options.autosized){this.resetHeight();
this.resetWidth()
}F=this.getStyle(z,"width");
var o=F;
F+=s.deltaWidth||0;
if(F>=this.currentMinWidth){y.width=F+"px";
u.width=F+"px";
v.width=F-G+"px";
q.width=F-G+"px"
}else{y.width=this.currentMinWidth+"px";
u.width=this.currentMinWidth+"px";
v.width=this.currentMinWidth-G+"px";
q.width=this.currentMinWidth-G+"px";
if(s.deltaWidth){x.vx=o-this.currentMinWidth;
x.x=true
}}if(F>this.options.maxWidth){y.width=this.options.maxWidth+"px";
u.width=this.options.maxWidth+"px";
v.width=this.options.maxWidth-G+"px";
q.width=this.options.maxWidth-G+"px";
if(s.deltaWidth){x.vx=o-this.options.maxWidth;
x.x=true
}}}if(x.vx&&s.deltaX){s.deltaX=-x.vx
}var m=e(this.cdiv);
if(s.deltaX&&(x.vx||!x.x)){if(x.vx){s.deltaX=x.vx
}var p=this.getStyle(m,"left");
p+=s.deltaX;
t.left=p+"px"
}if(B){F=this.getStyle(z,"height");
var H=F;
F+=s.deltaHeight||0;
if(F>=this.currentMinHeight){y.height=F+"px";
u.height=F+"px";
q.height=F-l+"px"
}else{y.height=this.currentMinHeight+"px";
u.height=this.currentMinHeight+"px";
q.height=this.currentMinHeight-l+"px";
if(s.deltaHeight){x.vy=H-this.currentMinHeight;
x.y=true
}}if(F>this.options.maxHeight){y.height=this.options.maxHeight+"px";
u.height=this.options.maxHeight+"px";
q.height=this.options.maxHeight-l+"px";
if(s.deltaHeight){x.vy=H-this.options.maxHeight;
x.y=true
}}}if(x.vy&&s.deltaY){s.deltaY=-x.vy
}if(s.deltaY&&(x.vy||!x.y)){if(x.vy){s.deltaY=x.vy
}var A=this.getStyle(m,"top");
A+=s.deltaY;
t.top=A+"px"
}z.css(y);
this.scrollerDiv.css(q);
if(this.eIframe){this.eIframe.css(q)
}this.shadowDiv.css(u);
m.css(t);
this.shadowDiv.css(j);
e.extend(this.userOptions,t);
e.extend(this.userOptions,y);
var w=this.width();
var n=this.height();
this.reductionData=null;
if(w<=2*this.getInitialSize()){this.reductionData={};
this.reductionData.w=w
}if(n<=2*this.getInitialSize()){if(!this.reductionData){this.reductionData={}
}this.reductionData.h=n
}if(this.header){this.header.doPosition()
}return x
},resetWidth:function(){this.getContentElement().css("width","");
this.scrollerDiv.css("width","");
if(this.eIframe){this.eIframe.css("width","")
}this.shadowDiv.css("width","");
e(this.cdiv).css("width","")
},resetHeight:function(){this.getContentElement().css("height","");
this.scrollerDiv.css("height","");
if(this.eIframe){this.eIframe.css("height","")
}this.shadowDiv.css("height","");
e(this.cdiv).css("height","")
},setSize:function(j,n){var m=j-this.width();
var l=n-this.height();
var o=new f.ui.PopupPanel.Sizer.Diff(0,0,m,l);
this.doResizeOrMove(o)
},moveTo:function(j,l){this.cdiv.css("top",j);
this.cdiv.css("left",l)
},move:function(l,m){var j=new f.ui.PopupPanel.Sizer.Diff(l,m,0,0);
this.doResizeOrMove(j)
},resize:function(l,m){var j=new f.ui.PopupPanel.Sizer.Diff(0,0,l,m);
this.doResizeOrMove(j)
},findForm:function(l){var j=l;
while(j){if(j[0]&&(!j[0].tagName||j[0].tagName.toLowerCase()!="form")){j=e(j).parent()
}else{break
}}return j
},setStateInput:function(j){var m=j.data.popup;
target=e(m.findForm(j.currentTarget));
var l=document.createElement("input");
l.type="hidden";
l.id=m.markerId+"OpenedState";
l.name=m.markerId+"OpenedState";
l.value=m.shown?"true":"false";
target.append(l);
e.each(m.userOptions,function(n,o){l=document.createElement("input");
l.type="hidden";
l.id=m.markerId+"StateOption_"+n;
l.name=m.markerId+"StateOption_"+n;
l.value=o;
target.append(l)
});
return true
}}
})());
e.extend(f.ui.PopupPanel,{showPopupPanel:function(i,j,l){f.Event.ready(function(){f.component(i).show()
})
},hidePopupPanel:function(i,j,l){f.Event.ready(function(){f.component(i).hide()
})
}})
})(RichFaces.jQuery,window.RichFaces);
(function(c,a){a.ui=a.ui||{};
a.ui.InputNumberSlider=a.BaseComponent.extendClass({name:"InputNumberSlider",delay:200,maxValue:100,minValue:0,step:1,tabIndex:0,decreaseSelectedClass:"rf-insl-dec-sel",handleSelectedClass:"rf-insl-hnd-sel",increaseSelectedClass:"rf-insl-inc-sel",init:function(d,h,i){$superInputNumberSlider.constructor.call(this,d);
c.extend(this,h);
this.range=this.maxValue-this.minValue;
this.id=d;
this.element=c(this.attachToDom());
this.input=this.element.children(".rf-insl-inp-cntr").children(".rf-insl-inp");
this.track=this.element.children(".rf-insl-trc-cntr").children(".rf-insl-trc");
this.handleContainer=this.track.children("span");
this.handle=this.handleContainer.children(".rf-insl-hnd, .rf-insl-hnd-dis");
this.tooltip=this.element.children(".rf-insl-tt");
var e=Number(this.input.val());
if(isNaN(e)){e=this.minValue
}this.handleContainer.css("display","block");
this.track.css("padding-right",this.handle.width()+"px");
this.__setValue(e,null,true);
if(!this.disabled){this.decreaseButton=this.element.children(".rf-insl-dec");
this.increaseButton=this.element.children(".rf-insl-inc");
this.track[0].tabIndex=this.tabIndex;
for(var f in i){this[f]+=" "+i[f]
}var g=c.proxy(this.__inputHandler,this);
this.input.change(g);
this.input.submit(g);
this.element.mousewheel(c.proxy(this.__mousewheelHandler,this));
this.track.keydown(c.proxy(this.__keydownHandler,this));
this.decreaseButton.mousedown(c.proxy(this.__decreaseHandler,this));
this.increaseButton.mousedown(c.proxy(this.__increaseHandler,this));
this.track.mousedown(c.proxy(this.__mousedownHandler,this))
}},decrease:function(e){var d=this.value-this.step;
d=this.roundFloat(d);
this.setValue(d,e)
},increase:function(e){var d=this.value+this.step;
d=this.roundFloat(d);
this.setValue(d,e)
},getValue:function(){return this.value
},setValue:function(d,e){if(!this.disabled){this.__setValue(d,e)
}},roundFloat:function(g){var d=this.step.toString();
var e=0;
if(!/\./.test(d)){if(this.step>=1){return g
}if(/e/.test(d)){e=d.split("-")[1]
}}else{e=d.length-d.indexOf(".")-1
}var f=g.toFixed(e);
return parseFloat(f)
},__setValue:function(g,h,e){if(!isNaN(g)){var d=false;
if(this.input.val()==""){d=true
}if(g>this.maxValue){g=this.maxValue;
this.input.val(g);
d=true
}else{if(g<this.minValue){g=this.minValue;
this.input.val(g);
d=true
}}if(g!=this.value||d){this.input.val(g);
var f=100*(g-this.minValue)/this.range;
if(this.handleType=="bar"){this.handleContainer.css("width",f+"%")
}else{this.handleContainer.css("padding-left",f+"%")
}this.tooltip.text(g);
this.tooltip.setPosition(this.handle,{from:"LT",offset:[0,5]});
this.value=g;
if(this.onchange&&!e){this.onchange.call(this.element[0],h)
}}}},__inputHandler:function(e){var d=Number(this.input.val());
if(isNaN(d)){this.input.val(this.value)
}else{this.__setValue(d,e)
}},__mousewheelHandler:function(e,d,f,g){d=f||g;
if(d>0){this.increase(e)
}else{if(d<0){this.decrease(e)
}}return false
},__keydownHandler:function(e){if(e.keyCode==37){var d=Number(this.input.val())-this.step;
d=this.roundFloat(d);
this.__setValue(d,e);
e.preventDefault()
}else{if(e.keyCode==39){var d=Number(this.input.val())+this.step;
d=this.roundFloat(d);
this.__setValue(d,e);
e.preventDefault()
}}},__decreaseHandler:function(d){var e=this;
e.decrease(d);
this.intervalId=window.setInterval(function(){e.decrease(d)
},this.delay);
c(document).one("mouseup",true,c.proxy(this.__clearInterval,this));
this.decreaseButton.addClass(this.decreaseSelectedClass);
d.preventDefault()
},__increaseHandler:function(d){var e=this;
e.increase(d);
this.intervalId=window.setInterval(function(){e.increase(d)
},this.delay);
c(document).one("mouseup",c.proxy(this.__clearInterval,this));
this.increaseButton.addClass(this.increaseSelectedClass);
d.preventDefault()
},__clearInterval:function(d){window.clearInterval(this.intervalId);
if(d.data){this.decreaseButton.removeClass(this.decreaseSelectedClass)
}else{this.increaseButton.removeClass(this.increaseSelectedClass)
}},__mousedownHandler:function(d){this.__mousemoveHandler(d);
this.track.focus();
var e=c(document);
e.mousemove(c.proxy(this.__mousemoveHandler,this));
e.one("mouseup",c.proxy(this.__mouseupHandler,this));
this.handle.addClass(this.handleSelectedClass);
this.tooltip.show()
},__mousemoveHandler:function(e){var d=this.range*(e.pageX-this.track.offset().left-this.handle.width()/2)/(this.track.width()-this.handle.width())+this.minValue;
d=Math.round(d/this.step)*this.step;
d=this.roundFloat(d);
this.__setValue(d,e);
e.preventDefault()
},__mouseupHandler:function(){this.handle.removeClass(this.handleSelectedClass);
this.tooltip.hide();
c(document).unbind("mousemove",this.__mousemoveHandler)
},destroy:function(d){c(document).unbind("mousemove",this.__mousemoveHandler);
$superInputNumberSlider.destroy.call(this)
}});
$superInputNumberSlider=a.ui.InputNumberSlider.$super
}(RichFaces.jQuery,window.RichFaces));
window.RichFaces=window.RichFaces||{};
RichFaces.jQuery=RichFaces.jQuery||window.jQuery;
(function(a){a.Selection=a.Selection||{};
a.Selection.set=function(d,c,f){if(d.setSelectionRange){d.focus();
d.setSelectionRange(c,f)
}else{if(d.createTextRange){var e=d.createTextRange();
e.collapse(true);
e.moveEnd("character",f);
e.moveStart("character",c);
e.select()
}}};
a.Selection.getStart=function(c){if(c.setSelectionRange){return c.selectionStart
}else{if(document.selection&&document.selection.createRange){var d=document.selection.createRange().duplicate();
d.moveEnd("character",c.value.length);
if(d.text==""){return c.value.length
}return c.value.lastIndexOf(d.text)
}}};
a.Selection.getEnd=function(c){if(c.setSelectionRange){return c.selectionEnd
}else{if(document.selection&&document.selection.createRange){var d=document.selection.createRange().duplicate();
d.moveStart("character",-c.value.length);
return d.text.length
}}};
a.Selection.setCaretTo=function(d,c){if(!c){c=d.value.length
}a.Selection.set(d,c,c)
}
})(RichFaces);
(function(d,a){a.ui=a.ui||{};
a.ui.Accordion=a.ui.TogglePanel.extendClass({name:"Accordion",init:function(e,f){c.constructor.call(this,e,f);
this.items=[];
this.isKeepHeight=f.isKeepHeight||false
},getHeight:function(e){if(e||!this.__height){this.__height=d(a.getDomElement(this.id)).outerHeight(true)
}return this.__height
},getInnerHeight:function(e){if(e||!this.__innerHeight){this.__innerHeight=d(a.getDomElement(this.id)).innerHeight()
}return this.__innerHeight
},destroy:function(){a.Event.unbindById(this.id,"."+this.namespace);
c.destroy.call(this)
}});
var c=a.ui.Accordion.$super
})(RichFaces.jQuery,RichFaces);
(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a)
}else{a(jQuery)
}}(function(d){var c=0,a=Array.prototype.slice;
d.cleanData=(function(e){return function(j){var h,g,i;
for(i=0;
(g=j[i])!=null;
i++){try{h=d._data(g,"events");
if(h&&h.remove){d(g).triggerHandler("remove")
}}catch(f){}}e(j)
}
})(d.cleanData);
d.widget=function(e,n,f){var i,h,l,g,m={},j=e.split(".")[0];
e=e.split(".")[1];
i=j+"-"+e;
if(!f){f=n;
n=d.Widget
}d.expr[":"][i.toLowerCase()]=function(o){return !!d.data(o,i)
};
d[j]=d[j]||{};
h=d[j][e];
l=d[j][e]=function(p,o){if(!this._createWidget){return new l(p,o)
}if(arguments.length){this._createWidget(p,o)
}};
d.extend(l,h,{version:f.version,_proto:d.extend({},f),_childConstructors:[]});
g=new n();
g.options=d.widget.extend({},g.options);
d.each(f,function(o,p){if(!d.isFunction(p)){m[o]=p;
return
}m[o]=(function(){var s=function(){return n.prototype[o].apply(this,arguments)
},q=function(t){return n.prototype[o].apply(this,t)
};
return function(){var t=this._super,v=this._superApply,u;
this._super=s;
this._superApply=q;
u=p.apply(this,arguments);
this._super=t;
this._superApply=v;
return u
}
})()
});
l.prototype=d.widget.extend(g,{widgetEventPrefix:h?(g.widgetEventPrefix||e):e},m,{constructor:l,namespace:j,widgetName:e,widgetFullName:i});
if(h){d.each(h._childConstructors,function(p,o){var q=o.prototype;
d.widget(q.namespace+"."+q.widgetName,l,o._proto)
});
delete h._childConstructors
}else{n._childConstructors.push(l)
}d.widget.bridge(e,l);
return l
};
d.widget.extend=function(e){var i=a.call(arguments,1),f=0,j=i.length,h,g;
for(;
f<j;
f++){for(h in i[f]){g=i[f][h];
if(i[f].hasOwnProperty(h)&&g!==undefined){if(d.isPlainObject(g)){e[h]=d.isPlainObject(e[h])?d.widget.extend({},e[h],g):d.widget.extend({},g)
}else{e[h]=g
}}}}return e
};
d.widget.bridge=function(f,g){var e=g.prototype.widgetFullName||f;
d.fn[f]=function(i){var l=typeof i==="string",j=a.call(arguments,1),h=this;
i=!l&&j.length?d.widget.extend.apply(null,[i].concat(j)):i;
if(l){this.each(function(){var m,n=d.data(this,e);
if(i==="instance"){h=n;
return false
}if(!n){return d.error("cannot call methods on "+f+" prior to initialization; attempted to call method '"+i+"'")
}if(!d.isFunction(n[i])||i.charAt(0)==="_"){return d.error("no such method '"+i+"' for "+f+" widget instance")
}m=n[i].apply(n,j);
if(m!==n&&m!==undefined){h=m&&m.jquery?h.pushStack(m.get()):m;
return false
}})
}else{this.each(function(){var m=d.data(this,e);
if(m){m.option(i||{});
if(m._init){m._init()
}}else{d.data(this,e,new g(i,this))
}})
}return h
}
};
d.Widget=function(){};
d.Widget._childConstructors=[];
d.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:false,create:null},_createWidget:function(f,e){e=d(e||this.defaultElement||this)[0];
this.element=d(e);
this.uuid=c++;
this.eventNamespace="."+this.widgetName+this.uuid;
this.bindings=d();
this.hoverable=d();
this.focusable=d();
if(e!==this){d.data(e,this.widgetFullName,this);
this._on(true,this.element,{remove:function(g){if(g.target===e){this.destroy()
}}});
this.document=d(e.style?e.ownerDocument:e.document||e);
this.window=d(this.document[0].defaultView||this.document[0].parentWindow)
}this.options=d.widget.extend({},this.options,this._getCreateOptions(),f);
this._create();
this._trigger("create",null,this._getCreateEventData());
this._init()
},_getCreateOptions:d.noop,_getCreateEventData:d.noop,_create:d.noop,_init:d.noop,destroy:function(){this._destroy();
this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(d.camelCase(this.widgetFullName));
this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled ui-state-disabled");
this.bindings.unbind(this.eventNamespace);
this.hoverable.removeClass("ui-state-hover");
this.focusable.removeClass("ui-state-focus")
},_destroy:d.noop,widget:function(){return this.element
},option:function(g,f){var j=g,e,h,i;
if(arguments.length===0){return d.widget.extend({},this.options)
}if(typeof g==="string"){j={};
e=g.split(".");
g=e.shift();
if(e.length){h=j[g]=d.widget.extend({},this.options[g]);
for(i=0;
i<e.length-1;
i++){h[e[i]]=h[e[i]]||{};
h=h[e[i]]
}g=e.pop();
if(arguments.length===1){return h[g]===undefined?null:h[g]
}h[g]=f
}else{if(arguments.length===1){return this.options[g]===undefined?null:this.options[g]
}j[g]=f
}}this._setOptions(j);
return this
},_setOptions:function(f){var e;
for(e in f){this._setOption(e,f[e])
}return this
},_setOption:function(f,e){this.options[f]=e;
if(f==="disabled"){this.widget().toggleClass(this.widgetFullName+"-disabled",!!e);
if(e){this.hoverable.removeClass("ui-state-hover");
this.focusable.removeClass("ui-state-focus")
}}return this
},enable:function(){return this._setOptions({disabled:false})
},disable:function(){return this._setOptions({disabled:true})
},_on:function(f,g,h){var e,i=this;
if(typeof f!=="boolean"){h=g;
g=f;
f=false
}if(!h){h=g;
g=this.element;
e=this.widget()
}else{g=e=d(g);
this.bindings=this.bindings.add(g)
}d.each(h,function(o,p){function l(){if(!f&&(i.options.disabled===true||d(this).hasClass("ui-state-disabled"))){return
}return(typeof p==="string"?i[p]:p).apply(i,arguments)
}if(typeof p!=="string"){l.guid=p.guid=p.guid||l.guid||d.guid++
}var j=o.match(/^([\w:-]*)\s*(.*)$/),m=j[1]+i.eventNamespace,n=j[2];
if(n){e.delegate(n,m,l)
}else{g.bind(m,l)
}})
},_off:function(e,f){f=(f||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace;
e.unbind(f).undelegate(f);
this.bindings=d(this.bindings.not(e).get());
this.focusable=d(this.focusable.not(e).get());
this.hoverable=d(this.hoverable.not(e).get())
},_delay:function(e,f){function g(){return(typeof e==="string"?h[e]:e).apply(h,arguments)
}var h=this;
return setTimeout(g,f||0)
},_hoverable:function(e){this.hoverable=this.hoverable.add(e);
this._on(e,{mouseenter:function(f){d(f.currentTarget).addClass("ui-state-hover")
},mouseleave:function(f){d(f.currentTarget).removeClass("ui-state-hover")
}})
},_focusable:function(e){this.focusable=this.focusable.add(e);
this._on(e,{focusin:function(f){d(f.currentTarget).addClass("ui-state-focus")
},focusout:function(f){d(f.currentTarget).removeClass("ui-state-focus")
}})
},_trigger:function(j,i,h){var e,f,g=this.options[j];
h=h||{};
i=d.Event(i);
i.type=(j===this.widgetEventPrefix?j:this.widgetEventPrefix+j).toLowerCase();
i.target=this.element[0];
f=i.originalEvent;
if(f){for(e in f){if(!(e in i)){i[e]=f[e]
}}}this.element.trigger(i,h);
return !(d.isFunction(g)&&g.apply(this.element[0],[i].concat(h))===false||i.isDefaultPrevented())
}};
d.each({show:"fadeIn",hide:"fadeOut"},function(e,f){d.Widget.prototype["_"+e]=function(i,j,g){if(typeof j==="string"){j={effect:j}
}var h,l=!j?e:j===true||typeof j==="number"?f:j.effect||f;
j=j||{};
if(typeof j==="number"){j={duration:j}
}h=!d.isEmptyObject(j);
j.complete=g;
if(j.delay){i.delay(j.delay)
}if(h&&d.effects&&d.effects.effect[l]){i[e](j)
}else{if(l!==e&&i[l]){i[l](j.duration,j.easing,g)
}else{i.queue(function(m){d(this)[e]();
if(g){g.call(i[0])
}m()
})
}}}
});
return d.widget
}));
(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a)
}else{a(jQuery)
}}(function(a){var d="ui-effects-",c=a;
a.effects={effect:{}};
(function(u,h){var p="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",m=/^([\-+])=\s*(\d+\.?\d*)/,l=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(v){return[v[1],v[2],v[3],v[4]]
}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(v){return[v[1]*2.55,v[2]*2.55,v[3]*2.55,v[4]]
}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(v){return[parseInt(v[1],16),parseInt(v[2],16),parseInt(v[3],16)]
}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(v){return[parseInt(v[1]+v[1],16),parseInt(v[2]+v[2],16),parseInt(v[3]+v[3],16)]
}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(v){return[v[1],v[2]/100,v[3]/100,v[4]]
}}],i=u.Color=function(w,x,v,y){return new u.Color.fn.parse(w,x,v,y)
},o={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},t={"byte":{floor:true,max:255},percent:{max:1},degrees:{mod:360,floor:true}},s=i.support={},f=u("<p>")[0],e,q=u.each;
f.style.cssText="background-color:rgba(1,1,1,.5)";
s.rgba=f.style.backgroundColor.indexOf("rgba")>-1;
q(o,function(v,w){w.cache="_"+v;
w.props.alpha={idx:3,type:"percent",def:1}
});
function n(w,y,x){var v=t[y.type]||{};
if(w==null){return(x||!y.def)?null:y.def
}w=v.floor?~~w:parseFloat(w);
if(isNaN(w)){return y.def
}if(v.mod){return(w+v.mod)%v.mod
}return 0>w?0:v.max<w?v.max:w
}function j(v){var x=i(),w=x._rgba=[];
v=v.toLowerCase();
q(l,function(F,G){var A,B=G.re.exec(v),z=B&&G.parse(B),y=G.space||"rgba";
if(z){A=x[y](z);
x[o[y].cache]=A[o[y].cache];
w=x._rgba=A._rgba;
return false
}});
if(w.length){if(w.join()==="0,0,0,0"){u.extend(w,e.transparent)
}return x
}return e[v]
}i.fn=u.extend(i.prototype,{parse:function(B,z,v,A){if(B===h){this._rgba=[null,null,null,null];
return this
}if(B.jquery||B.nodeType){B=u(B).css(z);
z=h
}var y=this,x=u.type(B),w=this._rgba=[];
if(z!==h){B=[B,z,v,A];
x="array"
}if(x==="string"){return this.parse(j(B)||e._default)
}if(x==="array"){q(o.rgba.props,function(F,G){w[G.idx]=n(B[G.idx],G)
});
return this
}if(x==="object"){if(B instanceof i){q(o,function(F,G){if(B[G.cache]){y[G.cache]=B[G.cache].slice()
}})
}else{q(o,function(G,H){var F=H.cache;
q(H.props,function(I,J){if(!y[F]&&H.to){if(I==="alpha"||B[I]==null){return
}y[F]=H.to(y._rgba)
}y[F][J.idx]=n(B[I],J,true)
});
if(y[F]&&u.inArray(null,y[F].slice(0,3))<0){y[F][3]=1;
if(H.from){y._rgba=H.from(y[F])
}}})
}return this
}},is:function(x){var v=i(x),y=true,w=this;
q(o,function(z,B){var F,A=v[B.cache];
if(A){F=w[B.cache]||B.to&&B.to(w._rgba)||[];
q(B.props,function(G,H){if(A[H.idx]!=null){y=(A[H.idx]===F[H.idx]);
return y
}})
}return y
});
return y
},_space:function(){var v=[],w=this;
q(o,function(x,y){if(w[y.cache]){v.push(x)
}});
return v.pop()
},transition:function(w,F){var x=i(w),y=x._space(),z=o[y],A=this.alpha()===0?i("transparent"):this,B=A[z.cache]||z.to(A._rgba),v=B.slice();
x=x[z.cache];
q(z.props,function(J,L){var I=L.idx,H=B[I],G=x[I],K=t[L.type]||{};
if(G===null){return
}if(H===null){v[I]=G
}else{if(K.mod){if(G-H>K.mod/2){H+=K.mod
}else{if(H-G>K.mod/2){H-=K.mod
}}}v[I]=n((G-H)*F+H,L)
}});
return this[y](v)
},blend:function(y){if(this._rgba[3]===1){return this
}var x=this._rgba.slice(),w=x.pop(),v=i(y)._rgba;
return i(u.map(x,function(z,A){return(1-w)*v[A]+w*z
}))
},toRgbaString:function(){var w="rgba(",v=u.map(this._rgba,function(x,y){return x==null?(y>2?1:0):x
});
if(v[3]===1){v.pop();
w="rgb("
}return w+v.join()+")"
},toHslaString:function(){var w="hsla(",v=u.map(this.hsla(),function(x,y){if(x==null){x=y>2?1:0
}if(y&&y<3){x=Math.round(x*100)+"%"
}return x
});
if(v[3]===1){v.pop();
w="hsl("
}return w+v.join()+")"
},toHexString:function(v){var w=this._rgba.slice(),x=w.pop();
if(v){w.push(~~(x*255))
}return"#"+u.map(w,function(y){y=(y||0).toString(16);
return y.length===1?"0"+y:y
}).join("")
},toString:function(){return this._rgba[3]===0?"transparent":this.toRgbaString()
}});
i.fn.parse.prototype=i.fn;
function g(x,w,v){v=(v+1)%1;
if(v*6<1){return x+(w-x)*v*6
}if(v*2<1){return w
}if(v*3<2){return x+(w-x)*((2/3)-v)*6
}return x
}o.hsla.to=function(x){if(x[0]==null||x[1]==null||x[2]==null){return[null,null,null,x[3]]
}var v=x[0]/255,A=x[1]/255,B=x[2]/255,G=x[3],F=Math.max(v,A,B),y=Math.min(v,A,B),H=F-y,I=F+y,w=I*0.5,z,J;
if(y===F){z=0
}else{if(v===F){z=(60*(A-B)/H)+360
}else{if(A===F){z=(60*(B-v)/H)+120
}else{z=(60*(v-A)/H)+240
}}}if(H===0){J=0
}else{if(w<=0.5){J=H/I
}else{J=H/(2-I)
}}return[Math.round(z)%360,J,w,G==null?1:G]
};
o.hsla.from=function(z){if(z[0]==null||z[1]==null||z[2]==null){return[null,null,null,z[3]]
}var y=z[0]/360,x=z[1],w=z[2],v=z[3],A=w<=0.5?w*(1+x):w+x-w*x,B=2*w-A;
return[Math.round(g(B,A,y+(1/3))*255),Math.round(g(B,A,y)*255),Math.round(g(B,A,y-(1/3))*255),v]
};
q(o,function(w,y){var x=y.props,v=y.cache,A=y.to,z=y.from;
i.fn[w]=function(I){if(A&&!this[v]){this[v]=A(this._rgba)
}if(I===h){return this[v].slice()
}var F,H=u.type(I),B=(H==="array"||H==="object")?I:arguments,G=this[v].slice();
q(x,function(J,L){var K=B[H==="object"?J:L.idx];
if(K==null){K=G[L.idx]
}G[L.idx]=n(K,L)
});
if(z){F=i(z(G));
F[v]=G;
return F
}else{return i(G)
}};
q(x,function(B,F){if(i.fn[B]){return
}i.fn[B]=function(J){var L=u.type(J),I=(B==="alpha"?(this._hsla?"hsla":"rgba"):w),H=this[I](),K=H[F.idx],G;
if(L==="undefined"){return K
}if(L==="function"){J=J.call(this,K);
L=u.type(J)
}if(J==null&&F.empty){return this
}if(L==="string"){G=m.exec(J);
if(G){J=K+parseFloat(G[2])*(G[1]==="+"?1:-1)
}}H[F.idx]=J;
return this[I](H)
}
})
});
i.hook=function(w){var v=w.split(" ");
q(v,function(x,y){u.cssHooks[y]={set:function(F,G){var A,B,z="";
if(G!=="transparent"&&(u.type(G)!=="string"||(A=j(G)))){G=i(A||G);
if(!s.rgba&&G._rgba[3]!==1){B=y==="backgroundColor"?F.parentNode:F;
while((z===""||z==="transparent")&&B&&B.style){try{z=u.css(B,"backgroundColor");
B=B.parentNode
}catch(H){}}G=G.blend(z&&z!=="transparent"?z:"_default")
}G=G.toRgbaString()
}try{F.style[y]=G
}catch(H){}}};
u.fx.step[y]=function(z){if(!z.colorInit){z.start=i(z.elem,y);
z.end=i(z.end);
z.colorInit=true
}u.cssHooks[y].set(z.elem,z.start.transition(z.end,z.pos))
}
})
};
i.hook(p);
u.cssHooks.borderColor={expand:function(w){var v={};
q(["Top","Right","Bottom","Left"],function(y,x){v["border"+x+"Color"]=w
});
return v
}};
e=u.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}
})(c);
(function(){var f=["add","remove","toggle"],g={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};
a.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(i,j){a.fx.step[j]=function(l){if(l.end!=="none"&&!l.setAttr||l.pos===1&&!l.setAttr){c.style(l.elem,j,l.end);
l.setAttr=true
}}
});
function h(n){var j,i,l=n.ownerDocument.defaultView?n.ownerDocument.defaultView.getComputedStyle(n,null):n.currentStyle,m={};
if(l&&l.length&&l[0]&&l[l[0]]){i=l.length;
while(i--){j=l[i];
if(typeof l[j]==="string"){m[a.camelCase(j)]=l[j]
}}}else{for(j in l){if(typeof l[j]==="string"){m[j]=l[j]
}}}return m
}function e(i,l){var n={},j,m;
for(j in l){m=l[j];
if(i[j]!==m){if(!g[j]){if(a.fx.step[j]||!isNaN(parseFloat(m))){n[j]=m
}}}}return n
}if(!a.fn.addBack){a.fn.addBack=function(i){return this.add(i==null?this.prevObject:this.prevObject.filter(i))
}
}a.effects.animateClass=function(i,j,n,m){var l=a.speed(j,n,m);
return this.queue(function(){var q=a(this),o=q.attr("class")||"",p,s=l.children?q.find("*").addBack():q;
s=s.map(function(){var t=a(this);
return{el:t,start:h(this)}
});
p=function(){a.each(f,function(t,u){if(i[u]){q[u+"Class"](i[u])
}})
};
p();
s=s.map(function(){this.end=h(this.el[0]);
this.diff=e(this.start,this.end);
return this
});
q.attr("class",o);
s=s.map(function(){var v=this,t=a.Deferred(),u=a.extend({},l,{queue:false,complete:function(){t.resolve(v)
}});
this.el.animate(this.diff,u);
return t.promise()
});
a.when.apply(a,s.get()).done(function(){p();
a.each(arguments,function(){var t=this.el;
a.each(this.diff,function(u){t.css(u,"")
})
});
l.complete.call(q[0])
})
})
};
a.fn.extend({addClass:(function(i){return function(l,j,n,m){return j?a.effects.animateClass.call(this,{add:l},j,n,m):i.apply(this,arguments)
}
})(a.fn.addClass),removeClass:(function(i){return function(l,j,n,m){return arguments.length>1?a.effects.animateClass.call(this,{remove:l},j,n,m):i.apply(this,arguments)
}
})(a.fn.removeClass),toggleClass:(function(i){return function(m,l,j,o,n){if(typeof l==="boolean"||l===undefined){if(!j){return i.apply(this,arguments)
}else{return a.effects.animateClass.call(this,(l?{add:m}:{remove:m}),j,o,n)
}}else{return a.effects.animateClass.call(this,{toggle:m},l,j,o)
}}
})(a.fn.toggleClass),switchClass:function(i,l,j,n,m){return a.effects.animateClass.call(this,{add:l,remove:i},j,n,m)
}})
})();
(function(){a.extend(a.effects,{version:"1.11.2",save:function(h,j){for(var g=0;
g<j.length;
g++){if(j[g]!==null){h.data(d+j[g],h[0].style[j[g]])
}}},restore:function(h,l){var j,g;
for(g=0;
g<l.length;
g++){if(l[g]!==null){j=h.data(d+l[g]);
if(j===undefined){j=""
}h.css(l[g],j)
}}},setMode:function(g,h){if(h==="toggle"){h=g.is(":hidden")?"show":"hide"
}return h
},getBaseline:function(h,i){var j,g;
switch(h[0]){case"top":j=0;
break;
case"middle":j=0.5;
break;
case"bottom":j=1;
break;
default:j=h[0]/i.height
}switch(h[1]){case"left":g=0;
break;
case"center":g=0.5;
break;
case"right":g=1;
break;
default:g=h[1]/i.width
}return{x:g,y:j}
},createWrapper:function(h){if(h.parent().is(".ui-effects-wrapper")){return h.parent()
}var i={width:h.outerWidth(true),height:h.outerHeight(true),"float":h.css("float")},m=a("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),g={width:h.width(),height:h.height()},l=document.activeElement;
try{l.id
}catch(j){l=document.body
}h.wrap(m);
if(h[0]===l||a.contains(h[0],l)){a(l).focus()
}m=h.parent();
if(h.css("position")==="static"){m.css({position:"relative"});
h.css({position:"relative"})
}else{a.extend(i,{position:h.css("position"),zIndex:h.css("z-index")});
a.each(["top","left","bottom","right"],function(n,o){i[o]=h.css(o);
if(isNaN(parseInt(i[o],10))){i[o]="auto"
}});
h.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})
}h.css(g);
return m.css(i).show()
},removeWrapper:function(g){var h=document.activeElement;
if(g.parent().is(".ui-effects-wrapper")){g.parent().replaceWith(g);
if(g[0]===h||a.contains(g[0],h)){a(h).focus()
}}return g
},setTransition:function(h,j,g,i){i=i||{};
a.each(j,function(m,l){var n=h.cssUnit(l);
if(n[0]>0){i[l]=n[0]*g+n[1]
}});
return i
}});
function e(h,g,i,j){if(a.isPlainObject(h)){g=h;
h=h.effect
}h={effect:h};
if(g==null){g={}
}if(a.isFunction(g)){j=g;
i=null;
g={}
}if(typeof g==="number"||a.fx.speeds[g]){j=i;
i=g;
g={}
}if(a.isFunction(i)){j=i;
i=null
}if(g){a.extend(h,g)
}i=i||g.duration;
h.duration=a.fx.off?0:typeof i==="number"?i:i in a.fx.speeds?a.fx.speeds[i]:a.fx.speeds._default;
h.complete=j||g.complete;
return h
}function f(g){if(!g||typeof g==="number"||a.fx.speeds[g]){return true
}if(typeof g==="string"&&!a.effects.effect[g]){return true
}if(a.isFunction(g)){return true
}if(typeof g==="object"&&!g.effect){return true
}return false
}a.fn.extend({effect:function(){var i=e.apply(this,arguments),l=i.mode,g=i.queue,h=a.effects.effect[i.effect];
if(a.fx.off||!h){if(l){return this[l](i.duration,i.complete)
}else{return this.each(function(){if(i.complete){i.complete.call(this)
}})
}}function j(o){var p=a(this),n=i.complete,q=i.mode;
function m(){if(a.isFunction(n)){n.call(p[0])
}if(a.isFunction(o)){o()
}}if(p.is(":hidden")?q==="hide":q==="show"){p[q]();
m()
}else{h.call(p[0],i,m)
}}return g===false?this.each(j):this.queue(g||"fx",j)
},show:(function(g){return function(i){if(f(i)){return g.apply(this,arguments)
}else{var h=e.apply(this,arguments);
h.mode="show";
return this.effect.call(this,h)
}}
})(a.fn.show),hide:(function(g){return function(i){if(f(i)){return g.apply(this,arguments)
}else{var h=e.apply(this,arguments);
h.mode="hide";
return this.effect.call(this,h)
}}
})(a.fn.hide),toggle:(function(g){return function(i){if(f(i)||typeof i==="boolean"){return g.apply(this,arguments)
}else{var h=e.apply(this,arguments);
h.mode="toggle";
return this.effect.call(this,h)
}}
})(a.fn.toggle),cssUnit:function(g){var h=this.css(g),i=[];
a.each(["em","px","%","pt"],function(j,l){if(h.indexOf(l)>0){i=[parseFloat(h),l]
}});
return i
}})
})();
(function(){var e={};
a.each(["Quad","Cubic","Quart","Quint","Expo"],function(g,f){e[f]=function(h){return Math.pow(h,g+2)
}
});
a.extend(e,{Sine:function(f){return 1-Math.cos(f*Math.PI/2)
},Circ:function(f){return 1-Math.sqrt(1-f*f)
},Elastic:function(f){return f===0||f===1?f:-Math.pow(2,8*(f-1))*Math.sin(((f-1)*80-7.5)*Math.PI/15)
},Back:function(f){return f*f*(3*f-2)
},Bounce:function(h){var f,g=4;
while(h<((f=Math.pow(2,--g))-1)/11){}return 1/Math.pow(4,3-g)-7.5625*Math.pow((f*3-2)/22-h,2)
}});
a.each(e,function(g,f){a.easing["easeIn"+g]=f;
a.easing["easeOut"+g]=function(h){return 1-f(1-h)
};
a.easing["easeInOut"+g]=function(h){return h<0.5?f(h*2)/2:1-f(h*-2+2)/2
}
})
})();
return a.effects
}));
(function(e,f){f.ui=f.ui||{};
var a={disabled:false,selectable:true,unselectable:false,mode:"client",stylePrefix:"rf-pm-itm",itemStep:20};
var c={exec:function(h){if(h.expanded){var i=h.options.expandEvent==h.options.collapseEvent&&h.options.collapseEvent=="click";
if(i&&h.__fireEvent("beforeswitch")==false){return false
}if(!h.expanded()){if(h.options.expandEvent=="click"&&h.__fireEvent("beforeexpand")==false){return false
}}else{if(h.options.collapseEvent=="click"&&h.__fireEvent("beforecollapse")==false){return false
}}}var g=h.mode;
if(g=="server"){return this.execServer(h)
}else{if(g=="ajax"){return this.execAjax(h)
}else{if(g=="client"||g=="none"){return this.execClient(h)
}else{f.log.error("SELECT_ITEM.exec : unknown mode ("+g+")")
}}}},execServer:function(h){h.__changeState();
var g={};
g[h.__panelMenu().id]=h.itemName;
g[h.id]=h.id;
e.extend(g,h.options.ajax.parameters||{});
f.submitForm(this.__getParentForm(h),g);
return false
},execAjax:function(h){var g=h.__changeState();
f.ajax(h.id,null,e.extend({},h.options.ajax,{}));
h.__restoreState(g);
return true
},execClient:function(h){var i=h.__rfPanelMenu();
var j=i.getSelectedItem();
if(j){j.unselect()
}i.selectedItem(h.itemName);
h.__select();
var l=h.__fireSelect();
if(h.__switch){var g=h.mode;
if(g=="client"||g=="none"){h.__switch(!h.expanded())
}}return l
},__getParentForm:function(g){return e(e(f.getDomElement(g.id)).parents("form")[0])
}};
f.ui.PanelMenuItem=f.BaseComponent.extendClass({name:"PanelMenuItem",init:function(i,j){d.constructor.call(this,i);
var l=e(this.attachToDom());
this.options=e.extend(this.options,a,j||{});
this.mode=this.options.mode;
this.itemName=this.options.name;
var h=this.__rfPanelMenu();
h.addItem(this);
this.selectionClass=this.options.stylePrefix+"-sel";
if(!this.options.disabled){var g=this;
if(this.options.selectable){this.__header().bind("click",function(){if(g.__rfPanelMenu().selectedItem()==g.id){if(g.options.unselectable){return g.unselect()
}}else{return g.select()
}})
}}g=this;
e(this.__panelMenu()).ready(function(){g.__renderNestingLevel()
});
this.__addUserEventHandler("select");
this.__addUserEventHandler("beforeselect")
},selected:function(){return this.__header().hasClass(this.selectionClass)
},select:function(){var g=this.__fireBeforeSelect();
if(!g){return false
}return c.exec(this)
},onCompleteHandler:function(){c.execClient(this)
},unselect:function(){var g=this.__rfPanelMenu();
if(g.selectedItem()==this.itemName){g.selectedItem(null)
}else{f.log.warn("You tried to unselect item (name="+this.itemName+") that isn't seleted")
}this.__unselect();
return this.__fireUnselect()
},__rfParentItem:function(){var g=this.__item().parents(".rf-pm-gr")[0];
if(!g){g=this.__item().parents(".rf-pm-top-gr")[0]
}if(!g){g=this.__panelMenu()
}return g?f.component(g):null
},__getNestingLevel:function(){if(!this.nestingLevel){var g=this.__rfParentItem();
if(g&&g.__getNestingLevel){this.nestingLevel=g.__getNestingLevel()+1
}else{this.nestingLevel=0
}}return this.nestingLevel
},__renderNestingLevel:function(){this.__item().find("td").first().css("padding-left",this.options.itemStep*this.__getNestingLevel())
},__panelMenu:function(){return this.__item().parents(".rf-pm")[0]
},__rfPanelMenu:function(){return f.component(this.__panelMenu())
},__changeState:function(){return this.__rfPanelMenu().selectedItem(this.itemName)
},__restoreState:function(g){if(g){this.__rfPanelMenu().selectedItem(g)
}},__item:function(){return e(f.getDomElement(this.id))
},__header:function(){return this.__item()
},__isSelected:function(){return this.__header().hasClass(this.selectionClass)
},__select:function(){this.__header().addClass(this.selectionClass)
},__unselect:function(){this.__header().removeClass(this.selectionClass)
},__fireBeforeSelect:function(){return f.Event.fireById(this.id,"beforeselect",{item:this})
},__fireSelect:function(){return f.Event.fireById(this.id,"select",{item:this})
},__fireUnselect:function(){return f.Event.fireById(this.id,"unselect",{item:this})
},__fireEvent:function(h,g){return this.invokeEvent(h,f.getDomElement(this.id),g,{id:this.id,item:this})
},__addUserEventHandler:function(h){var g=this.options["on"+h];
if(g){f.Event.bindById(this.id,h,g)
}},__rfTopGroup:function(){var g=this.__item().parents(".rf-pm-top-gr")[0];
return g?g:null
},destroy:function(){var g=this.__rfPanelMenu();
if(g){g.deleteItem(this)
}d.destroy.call(this)
}});
var d=f.ui.PanelMenuItem.$super
})(RichFaces.jQuery,RichFaces);
(function(a,h){var g,e;
var m;
var d;
a.extend({pnotify_remove_all:function(){var n=m.data("pnotify");
if(n&&n.length){a.each(n,function(){if(this.pnotify_remove){this.pnotify_remove()
}})
}},pnotify_position_all:function(){if(e){clearTimeout(e)
}e=null;
var n=m.data("pnotify");
if(!n||!n.length){return
}a.each(n,function(){var q=this.opts.pnotify_stack;
if(!q){return
}if(!q.nextpos1){q.nextpos1=q.firstpos1
}if(!q.nextpos2){q.nextpos2=q.firstpos2
}if(!q.addpos2){q.addpos2=0
}if(this.css("display")!="none"){var o,p;
var u={};
var s;
switch(q.dir1){case"down":s="top";
break;
case"up":s="bottom";
break;
case"left":s="right";
break;
case"right":s="left";
break
}o=parseInt(this.css(s));
if(isNaN(o)){o=0
}if(typeof q.firstpos1=="undefined"){q.firstpos1=o;
q.nextpos1=q.firstpos1
}var t;
switch(q.dir2){case"down":t="top";
break;
case"up":t="bottom";
break;
case"left":t="right";
break;
case"right":t="left";
break
}p=parseInt(this.css(t));
if(isNaN(p)){p=0
}if(typeof q.firstpos2=="undefined"){q.firstpos2=p;
q.nextpos2=q.firstpos2
}if((q.dir1=="down"&&q.nextpos1+this.height()>d.height())||(q.dir1=="up"&&q.nextpos1+this.height()>d.height())||(q.dir1=="left"&&q.nextpos1+this.width()>d.width())||(q.dir1=="right"&&q.nextpos1+this.width()>d.width())){q.nextpos1=q.firstpos1;
q.nextpos2+=q.addpos2+10;
q.addpos2=0
}if(q.animation&&q.nextpos2<p){switch(q.dir2){case"down":u.top=q.nextpos2+"px";
break;
case"up":u.bottom=q.nextpos2+"px";
break;
case"left":u.right=q.nextpos2+"px";
break;
case"right":u.left=q.nextpos2+"px";
break
}}else{this.css(t,q.nextpos2+"px")
}switch(q.dir2){case"down":case"up":if(this.outerHeight(true)>q.addpos2){q.addpos2=this.height()
}break;
case"left":case"right":if(this.outerWidth(true)>q.addpos2){q.addpos2=this.width()
}break
}if(q.nextpos1){if(q.animation&&(o>q.nextpos1||u.top||u.bottom||u.right||u.left)){switch(q.dir1){case"down":u.top=q.nextpos1+"px";
break;
case"up":u.bottom=q.nextpos1+"px";
break;
case"left":u.right=q.nextpos1+"px";
break;
case"right":u.left=q.nextpos1+"px";
break
}}else{this.css(s,q.nextpos1+"px")
}}if(u.top||u.bottom||u.right||u.left){this.animate(u,{duration:500,queue:false})
}switch(q.dir1){case"down":case"up":q.nextpos1+=this.height()+10;
break;
case"left":case"right":q.nextpos1+=this.width()+10;
break
}}});
a.each(n,function(){var o=this.opts.pnotify_stack;
if(!o){return
}o.nextpos1=o.firstpos1;
o.nextpos2=o.firstpos2;
o.addpos2=0;
o.animation=true
})
},pnotify:function(o){if(!m){m=a("body")
}if(!d){d=a(window)
}var n;
var w;
if(typeof o!="object"){w=a.extend({},a.pnotify.defaults);
w.pnotify_text=o
}else{w=a.extend({},a.pnotify.defaults,o);
if(w.pnotify_animation instanceof Object){w.pnotify_animation=a.extend({effect_in:a.pnotify.defaults.pnotify_animation,effect_out:a.pnotify.defaults.pnotify_animation},w.pnotify_animation)
}}if(w.pnotify_before_init){if(w.pnotify_before_init(w)===false){return null
}}var v;
var u=function(A,y){s.css("display","none");
var z=document.elementFromPoint(A.clientX,A.clientY);
s.css("display","block");
var B=a(z);
var x=B.css("cursor");
s.css("cursor",x!="auto"?x:"default");
if(!v||v.get(0)!=z){if(v){l.call(v.get(0),"mouseleave",A.originalEvent);
l.call(v.get(0),"mouseout",A.originalEvent)
}l.call(z,"mouseenter",A.originalEvent);
l.call(z,"mouseover",A.originalEvent)
}l.call(z,y,A.originalEvent);
v=B
};
var s=a("<div />",{"class":"rf-ntf "+w.pnotify_addclass,css:{display:"none"},mouseenter:function(x){if(w.pnotify_nonblock){x.stopPropagation()
}if(w.pnotify_mouse_reset&&n=="out"){s.stop(true);
n="in";
s.css("height","auto").animate({width:w.pnotify_width,opacity:w.pnotify_nonblock?w.pnotify_nonblock_opacity:w.pnotify_opacity},"fast")
}if(w.pnotify_nonblock){s.animate({opacity:w.pnotify_nonblock_opacity},"fast")
}if(w.pnotify_hide&&w.pnotify_mouse_reset){s.pnotify_cancel_remove()
}if(w.pnotify_closer&&!w.pnotify_nonblock){s.closer.css("visibility","visible")
}},mouseleave:function(x){if(w.pnotify_nonblock){x.stopPropagation()
}v=null;
s.css("cursor","auto");
if(w.pnotify_nonblock&&n!="out"){s.animate({opacity:w.pnotify_opacity},"fast")
}if(w.pnotify_hide&&w.pnotify_mouse_reset){s.pnotify_queue_remove()
}s.closer.css("visibility","hidden");
a.pnotify_position_all()
},mouseover:function(x){if(w.pnotify_nonblock){x.stopPropagation()
}},mouseout:function(x){if(w.pnotify_nonblock){x.stopPropagation()
}},mousemove:function(x){if(w.pnotify_nonblock){x.stopPropagation();
u(x,"onmousemove")
}},mousedown:function(x){if(w.pnotify_nonblock){x.stopPropagation();
x.preventDefault();
u(x,"onmousedown")
}},mouseup:function(x){if(w.pnotify_nonblock){x.stopPropagation();
x.preventDefault();
u(x,"onmouseup")
}},click:function(x){if(w.pnotify_nonblock){x.stopPropagation();
u(x,"onclick")
}},dblclick:function(x){if(w.pnotify_nonblock){x.stopPropagation();
u(x,"ondblclick")
}}});
s.opts=w;
if(w.pnotify_shadow&&!h.browser.msie){s.shadow_container=a("<div />",{"class":"rf-ntf-shdw"}).prependTo(s)
}s.container=a("<div />",{"class":"rf-ntf-cnt"}).appendTo(s);
s.pnotify_version="1.0.2";
s.pnotify=function(y){var x=w;
if(typeof y=="string"){w.pnotify_text=y
}else{w=a.extend({},w,y)
}s.opts=w;
if(w.pnotify_shadow!=x.pnotify_shadow){if(w.pnotify_shadow&&!h.browser.msie){s.shadow_container=a("<div />",{"class":"rf-ntf-shdw"}).prependTo(s)
}else{s.children(".rf-ntf-shdw").remove()
}}if(w.pnotify_addclass===false){s.removeClass(x.pnotify_addclass)
}else{if(w.pnotify_addclass!==x.pnotify_addclass){s.removeClass(x.pnotify_addclass).addClass(w.pnotify_addclass)
}}if(w.pnotify_title===false){s.title_container.hide("fast")
}else{if(w.pnotify_title!==x.pnotify_title){s.title_container.html(w.pnotify_title).show(200)
}}if(w.pnotify_text===false){s.text_container.hide("fast")
}else{if(w.pnotify_text!==x.pnotify_text){if(w.pnotify_insert_brs){w.pnotify_text=w.pnotify_text.replace(/\n/g,"<br />")
}s.text_container.html(w.pnotify_text).show(200)
}}s.pnotify_history=w.pnotify_history;
if(w.pnotify_type!=x.pnotify_type){s.container.toggleClass("rf-ntf-cnt rf-ntf-cnt-hov")
}if((w.pnotify_notice_icon!=x.pnotify_notice_icon&&w.pnotify_type=="notice")||(w.pnotify_error_icon!=x.pnotify_error_icon&&w.pnotify_type=="error")||(w.pnotify_type!=x.pnotify_type)){s.container.find("div.rf-ntf-ico").remove();
a("<div />",{"class":"rf-ntf-ico"}).append(a("<span />",{"class":w.pnotify_type=="error"?w.pnotify_error_icon:w.pnotify_notice_icon})).prependTo(s.container)
}if(w.pnotify_width!==x.pnotify_width){s.animate({width:w.pnotify_width})
}if(w.pnotify_min_height!==x.pnotify_min_height){s.container.animate({minHeight:w.pnotify_min_height})
}if(w.pnotify_opacity!==x.pnotify_opacity){s.fadeTo(w.pnotify_animate_speed,w.pnotify_opacity)
}if(!w.pnotify_hide){s.pnotify_cancel_remove()
}else{if(!x.pnotify_hide){s.pnotify_queue_remove()
}}s.pnotify_queue_position();
return s
};
s.pnotify_queue_position=function(){if(e){clearTimeout(e)
}e=setTimeout(a.pnotify_position_all,10)
};
s.pnotify_display=function(){if(!s.parent().length){s.appendTo(m)
}if(w.pnotify_before_open){if(w.pnotify_before_open(s)===false){return
}}s.pnotify_queue_position();
if(w.pnotify_animation=="fade"||w.pnotify_animation.effect_in=="fade"){s.show().fadeTo(0,0).hide()
}else{if(w.pnotify_opacity!=1){s.show().fadeTo(0,w.pnotify_opacity).hide()
}}s.animate_in(function(){if(w.pnotify_after_open){w.pnotify_after_open(s)
}s.pnotify_queue_position();
if(w.pnotify_hide){s.pnotify_queue_remove()
}})
};
s.pnotify_remove=function(){if(s.timer){window.clearTimeout(s.timer);
s.timer=null
}if(w.pnotify_before_close){if(w.pnotify_before_close(s)===false){return
}}s.animate_out(function(){if(w.pnotify_after_close){if(w.pnotify_after_close(s)===false){return
}}s.pnotify_queue_position();
if(w.pnotify_remove){s.detach()
}})
};
s.animate_in=function(x){n="in";
var y;
if(typeof w.pnotify_animation.effect_in!="undefined"){y=w.pnotify_animation.effect_in
}else{y=w.pnotify_animation
}if(y=="none"){s.show();
x()
}else{if(y=="show"){s.show(w.pnotify_animate_speed,x)
}else{if(y=="fade"){s.show().fadeTo(w.pnotify_animate_speed,w.pnotify_opacity,x)
}else{if(y=="slide"){s.slideDown(w.pnotify_animate_speed,x)
}else{if(typeof y=="function"){y("in",x,s)
}else{if(s.effect){s.effect(y,{},w.pnotify_animate_speed,x)
}}}}}}};
s.animate_out=function(x){n="out";
var y;
if(typeof w.pnotify_animation.effect_out!="undefined"){y=w.pnotify_animation.effect_out
}else{y=w.pnotify_animation
}if(y=="none"){s.hide();
x()
}else{if(y=="show"){s.hide(w.pnotify_animate_speed,x)
}else{if(y=="fade"){s.fadeOut(w.pnotify_animate_speed,x)
}else{if(y=="slide"){s.slideUp(w.pnotify_animate_speed,x)
}else{if(typeof y=="function"){y("out",x,s)
}else{if(s.effect){s.effect(y,{},w.pnotify_animate_speed,x)
}}}}}}};
s.pnotify_cancel_remove=function(){if(s.timer){window.clearTimeout(s.timer)
}};
s.pnotify_queue_remove=function(){s.pnotify_cancel_remove();
s.timer=window.setTimeout(function(){s.pnotify_remove()
},(isNaN(w.pnotify_delay)?0:w.pnotify_delay))
};
s.closer=a("<div />",{"class":"rf-ntf-cls",css:{cursor:"pointer",visibility:"hidden"},click:function(){s.pnotify_remove();
s.closer.css("visibility","hidden")
}}).append(a("<span />",{"class":"rf-ntf-cls-ico"})).appendTo(s.container);
a("<div />",{"class":"rf-ntf-ico"}).append(a("<span />",{"class":w.pnotify_type=="error"?w.pnotify_error_icon:w.pnotify_notice_icon})).appendTo(s.container);
s.title_container=a("<div />",{"class":"rf-ntf-sum",html:w.pnotify_title}).appendTo(s.container);
if(w.pnotify_title===false){s.title_container.hide()
}if(w.pnotify_insert_brs&&typeof w.pnotify_text=="string"){w.pnotify_text=w.pnotify_text.replace(/\n/g,"<br />")
}s.text_container=a("<div />",{"class":"rf-ntf-det",html:w.pnotify_text}).appendTo(s.container);
if(w.pnotify_text===false){s.text_container.hide()
}a("<div />",{"class":"rf-ntf-clr"}).appendTo(s.container);
if(typeof w.pnotify_width=="string"){s.css("width",w.pnotify_width)
}if(typeof w.pnotify_min_height=="string"){s.container.css("min-height",w.pnotify_min_height)
}s.pnotify_history=w.pnotify_history;
var p=m.data("pnotify");
if(p==null||typeof p!="object"){p=[]
}if(w.pnotify_stack.push=="top"){p=a.merge([s],p)
}else{p=a.merge(p,[s])
}m.data("pnotify",p);
if(w.pnotify_after_init){w.pnotify_after_init(s)
}if(w.pnotify_history){var q=m.data("pnotify_history");
if(typeof q=="undefined"){q=a("<div />",{"class":"rf-ntf-hstr",mouseleave:function(){q.animate({top:"-"+g+"px"},{duration:100,queue:false})
}}).append(a("<div />",{"class":"rf-ntf-hstr-hdr",text:"Redisplay"})).append(a("<button />",{"class":"rf-ntf-hstr-all",text:"All",click:function(){a.each(m.data("pnotify"),function(){if(this.pnotify_history&&this.pnotify_display){this.pnotify_display()
}});
return false
}})).append(a("<button />",{"class":"rf-ntf-hstr-last",text:"Last",click:function(){var z=1;
var y=m.data("pnotify");
while(!y[y.length-z]||!y[y.length-z].pnotify_history||y[y.length-z].is(":visible")){if(y.length-z===0){return false
}z++
}var x=y[y.length-z];
if(x.pnotify_display){x.pnotify_display()
}return false
}})).appendTo(m);
var t=a("<span />",{"class":"rf-ntf-hstr-hndl",mouseenter:function(){q.animate({top:"0"},{duration:100,queue:false})
}}).appendTo(q);
g=t.offset().top+2;
q.css({top:"-"+g+"px"});
m.data("pnotify_history",q)
}}w.pnotify_stack.animation=false;
s.pnotify_display();
return s
}});
var f=/^on/;
var c=/^(dbl)?click$|^mouse(move|down|up|over|out|enter|leave)$|^contextmenu$/;
var i=/^(focus|blur|select|change|reset)$|^key(press|down|up)$/;
var j=/^(scroll|resize|(un)?load|abort|error)$/;
var l=function(p,n){var o;
p=p.toLowerCase();
if(document.createEvent&&this.dispatchEvent){p=p.replace(f,"");
if(p.match(c)){a(this).offset();
o=document.createEvent("MouseEvents");
o.initMouseEvent(p,n.bubbles,n.cancelable,n.view,n.detail,n.screenX,n.screenY,n.clientX,n.clientY,n.ctrlKey,n.altKey,n.shiftKey,n.metaKey,n.button,n.relatedTarget)
}else{if(p.match(i)){o=document.createEvent("UIEvents");
o.initUIEvent(p,n.bubbles,n.cancelable,n.view,n.detail)
}else{if(p.match(j)){o=document.createEvent("HTMLEvents");
o.initEvent(p,n.bubbles,n.cancelable)
}}}if(!o){return
}this.dispatchEvent(o)
}else{if(!p.match(f)){p="on"+p
}o=document.createEventObject(n);
this.fireEvent(p,o)
}};
a.pnotify.defaults={pnotify_title:false,pnotify_text:false,pnotify_addclass:"",pnotify_nonblock:false,pnotify_nonblock_opacity:0.2,pnotify_history:true,pnotify_width:"300px",pnotify_min_height:"16px",pnotify_type:"notice",pnotify_notice_icon:"",pnotify_error_icon:"",pnotify_animation:"fade",pnotify_animate_speed:"slow",pnotify_opacity:1,pnotify_shadow:false,pnotify_closer:true,pnotify_hide:true,pnotify_delay:8000,pnotify_mouse_reset:true,pnotify_remove:true,pnotify_insert_brs:true,pnotify_stack:{dir1:"down",dir2:"left",push:"bottom"}}
})(jQuery,RichFaces);
(function(d,e){e.ui=e.ui||{};
var a={enabledInInput:false,preventDefault:true};
var f=["keydown","keyup"];
e.ui.HotKey=function(g,h){c.constructor.call(this,g);
this.namespace=this.namespace||"."+e.Event.createNamespace(this.name,this.id);
this.attachToDom(this.componentId);
this.options=d.extend({},a,h);
this.__handlers={};
this.options.selector=(this.options.selector)?this.options.selector:document;
d(document).ready(d.proxy(function(){this.__bindDefinedHandlers()
},this))
};
e.BaseComponent.extend(e.ui.HotKey);
var c=e.ui.HotKey.$super;
d.extend(e.ui.HotKey.prototype,{name:"HotKey",__bindDefinedHandlers:function(){for(var g=0;
g<f.length;
g++){if(this.options["on"+f[g]]){this.__bindHandler(f[g])
}}},__bindHandler:function(g){this.__handlers[g]=d.proxy(function(h){var i=this.invokeEvent.call(this,g,document.getElementById(this.id),h);
if(this.options.preventDefault){h.stopPropagation();
h.preventDefault();
return false
}return i
},this);
d(this.options.selector).bind(g+this.namespace,this.options,this.__handlers[g])
},destroy:function(){e.Event.unbindById(this.id,this.namespace);
for(var g in this.__handlers){if(this.__handlers.hasOwnProperty(g)){d(this.options.selector).unbind(g+this.namespace,this.__handlers[g])
}}c.destroy.call(this)
}})
})(RichFaces.jQuery,RichFaces);
(function(d,a){a.ui=a.ui||{};
a.ui.TogglePanelItem=a.BaseComponent.extendClass({name:"TogglePanelItem",init:function(e,f){c.constructor.call(this,e);
this.attachToDom(this.id);
this.options=d.extend(this.options,f||{});
this.name=this.options.name;
this.togglePanelId=this.options.togglePanelId;
this.switchMode=this.options.switchMode;
this.disabled=this.options.disabled||false;
this.index=f.index;
this.getTogglePanel().getItems()[this.index]=this;
this.__addUserEventHandler("enter");
this.__addUserEventHandler("leave")
},getName:function(){return this.options.name
},getTogglePanel:function(){return a.component(this.togglePanelId)
},isSelected:function(){return this.getName()==this.getTogglePanel().getSelectItem()
},__addUserEventHandler:function(f){var e=this.options["on"+f];
if(e){a.Event.bindById(this.id,f,e)
}},__enter:function(){a.getDomElement(this.id).style.display="block";
return this.__fireEnter()
},__leave:function(){var e=this.__fireLeave();
if(!e){return false
}a.getDomElement(this.id).style.display="none";
return true
},__fireLeave:function(){return a.Event.fireById(this.id,"leave")
},__fireEnter:function(){return a.Event.fireById(this.id,"enter")
},destroy:function(){var e=this.getTogglePanel();
if(e){delete e.getItems()[this.index]
}c.destroy.call(this)
}});
var c=a.ui.TogglePanelItem.$super
})(RichFaces.jQuery,RichFaces);
(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a)
}else{a(jQuery)
}}(function(c){c(window).bind("unload.atmosphere",function(){c.atmosphere.unsubscribe()
});
c(window).bind("offline",function(){var f=[].concat(c.atmosphere.requests);
for(var d=0;
d<f.length;
d++){var e=f[d];
e.close();
clearTimeout(e.response.request.id);
if(e.heartbeatTimer){clearTimeout(e.heartbeatTimer)
}}});
c(window).bind("online",function(){if(c.atmosphere.requests.length>0){for(var d=0;
d<c.atmosphere.requests.length;
d++){c.atmosphere.requests[d].execute()
}}});
c(window).keypress(function(d){if(d.keyCode===27){d.preventDefault()
}});
var a=function(f){var g,d=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,e={};
while(g=d.exec(f)){e[g[1]]=g[2]
}return e
};
c.atmosphere={version:"2.2.5-jquery",uuid:0,requests:[],callbacks:[],onError:function(d){},onClose:function(d){},onOpen:function(d){},onMessage:function(d){},onReconnect:function(d,e){},onMessagePublished:function(d){},onTransportFailure:function(d,e){},onLocalMessage:function(d){},onClientTimeout:function(d){},onFailureToReconnect:function(d,e){},WebsocketApiAdapter:function(e){var f,d;
e.onMessage=function(g){d.onmessage({data:g.responseBody})
};
e.onMessagePublished=function(g){d.onmessage({data:g.responseBody})
};
e.onOpen=function(g){d.onopen(g)
};
d={close:function(){f.close()
},send:function(g){f.push(g)
},onmessage:function(g){},onopen:function(g){},onclose:function(g){},onerror:function(g){}};
f=new $.atmosphere.subscribe(e);
return d
},AtmosphereRequest:function(ay){var a8={timeout:300000,method:"GET",headers:{},contentType:"",callback:null,url:"",data:"",suspend:true,maxRequest:-1,reconnect:true,maxStreamingLength:10000000,lastIndex:0,logLevel:"info",requestCount:0,fallbackMethod:"GET",fallbackTransport:"streaming",transport:"long-polling",webSocketImpl:null,webSocketBinaryType:null,dispatchUrl:null,webSocketPathDelimiter:"@@",enableXDR:false,rewriteURL:false,attachHeadersAsQueryString:true,executeCallbackBeforeReconnect:false,readyState:0,withCredentials:false,trackMessageLength:false,messageDelimiter:"|",connectTimeout:-1,reconnectInterval:0,dropHeaders:true,uuid:0,shared:false,readResponsesHeaders:false,maxReconnectOnClose:5,enableProtocol:true,pollingInterval:0,heartbeat:{client:null,server:null},ackInterval:0,closeAsync:false,reconnectOnServerError:true,onError:function(d){},onClose:function(d){},onOpen:function(d){},onMessage:function(d){},onReopen:function(d,e){},onReconnect:function(d,e){},onMessagePublished:function(d){},onTransportFailure:function(d,e){},onLocalMessage:function(d){},onFailureToReconnect:function(d,e){},onClientTimeout:function(d){}};
var ak={status:200,reasonPhrase:"OK",responseBody:"",messages:[],headers:[],state:"messageReceived",transport:"polling",error:null,request:null,partialMessage:"",errorHandled:false,closedByClientTimeout:false,ffTryingReconnect:false};
var ag=null;
var av=null;
var aZ=null;
var ba=null;
var aD=null;
var a3=true;
var ae=0;
var aq=" ";
var am=false;
var aK=null;
var bg;
var af=null;
var aJ=c.now();
var a0;
var bh;
an(ay);
function ar(){a3=true;
am=false;
ae=0;
ag=null;
av=null;
aZ=null;
ba=null
}function aG(){bd();
ar()
}function an(d){aG();
a8=c.extend(a8,d);
a8.mrequest=a8.reconnect;
if(!a8.reconnect){a8.reconnect=true
}}function ai(){return a8.webSocketImpl!=null||window.WebSocket||window.MozWebSocket
}function aj(){return window.EventSource
}function aB(){if(a8.shared){af=A(a8);
if(af!=null){if(a8.logLevel==="debug"){c.atmosphere.debug("Storage service available. All communication will be local")
}if(af.open(a8)){return
}}if(a8.logLevel==="debug"){c.atmosphere.debug("No Storage service available.")
}af=null
}a8.firstMessage=c.atmosphere.uuid==0?true:false;
a8.isOpen=false;
a8.ctime=c.now();
if(a8.uuid===0){a8.uuid=c.atmosphere.uuid
}a8.closedByClientTimeout=false;
if(a8.transport!=="websocket"&&a8.transport!=="sse"){aP(a8)
}else{if(a8.transport==="websocket"){if(!ai()){ad("Websocket is not supported, using request.fallbackTransport ("+a8.fallbackTransport+")")
}else{aw(false)
}}else{if(a8.transport==="sse"){if(!aj()){ad("Server Side Events(SSE) is not supported, using request.fallbackTransport ("+a8.fallbackTransport+")")
}else{aX(false)
}}}}}function A(j){var e,g,l,d="atmosphere-"+j.url,i={storage:function(){if(!c.atmosphere.supportStorage()){return
}var m=window.localStorage,o=function(p){return c.parseJSON(m.getItem(d+"-"+p))
},n=function(q,p){m.setItem(d+"-"+q,c.stringifyJSON(p))
};
return{init:function(){n("children",o("children").concat([aJ]));
c(window).on("storage.socket",function(p){p=p.originalEvent;
if(p.key===d&&p.newValue){f(p.newValue)
}});
return o("opened")
},signal:function(q,p){m.setItem(d,c.stringifyJSON({target:"p",type:q,data:p}))
},close:function(){var q,p=o("children");
c(window).off("storage.socket");
if(p){q=c.inArray(j.id,p);
if(q>-1){p.splice(q,1);
n("children",p)
}}}}
},windowref:function(){var m=window.open("",d.replace(/\W/g,""));
if(!m||m.closed||!m.callbacks){return
}return{init:function(){m.callbacks.push(f);
m.children.push(aJ);
return m.opened
},signal:function(o,n){if(!m.closed&&m.fire){m.fire(c.stringifyJSON({target:"p",type:o,data:n}))
}},close:function(){function n(o,p){var q=c.inArray(p,o);
if(q>-1){o.splice(q,1)
}}if(!l){n(m.callbacks,f);
n(m.children,aJ)
}}}
}};
function f(o){var m=c.parseJSON(o),n=m.data;
if(m.target==="c"){switch(m.type){case"open":aF("opening","local",a8);
break;
case"close":if(!l){l=true;
if(n.reason==="aborted"){aS()
}else{if(n.heir===aJ){aB()
}else{setTimeout(function(){aB()
},100)
}}}break;
case"message":bc(n,"messageReceived",200,j.transport);
break;
case"localMessage":aU(n);
break
}}}function h(){var m=new RegExp("(?:^|; )("+encodeURIComponent(d)+")=([^;]*)").exec(document.cookie);
if(m){return c.parseJSON(decodeURIComponent(m[2]))
}}e=h();
if(!e||c.now()-e.ts>1000){return
}g=i.storage()||i.windowref();
if(!g){return
}return{open:function(){var m;
a0=setInterval(function(){var n=e;
e=h();
if(!e||n.ts===e.ts){f(c.stringifyJSON({target:"c",type:"close",data:{reason:"error",heir:n.heir}}))
}},1000);
m=g.init();
if(m){setTimeout(function(){aF("opening","local",j)
},50)
}return m
},send:function(m){g.signal("send",m)
},localSend:function(m){g.signal("localSend",c.stringifyJSON({id:aJ,event:m}))
},close:function(){if(!am){clearInterval(a0);
g.signal("close");
g.close()
}}}
}function bi(){var e,g="atmosphere-"+a8.url,f={storage:function(){if(!c.atmosphere.supportStorage()){return
}var j=window.localStorage;
return{init:function(){c(window).on("storage.socket",function(l){l=l.originalEvent;
if(l.key===g&&l.newValue){d(l.newValue)
}})
},signal:function(m,l){j.setItem(g,c.stringifyJSON({target:"c",type:m,data:l}))
},get:function(l){return c.parseJSON(j.getItem(g+"-"+l))
},set:function(m,l){j.setItem(g+"-"+m,c.stringifyJSON(l))
},close:function(){c(window).off("storage.socket");
j.removeItem(g);
j.removeItem(g+"-opened");
j.removeItem(g+"-children")
}}
},windowref:function(){var l=g.replace(/\W/g,""),j=(c('iframe[name="'+l+'"]')[0]||c('<iframe name="'+l+'" />').hide().appendTo("body")[0]).contentWindow;
return{init:function(){j.callbacks=[d];
j.fire=function(n){var m;
for(m=0;
m<j.callbacks.length;
m++){j.callbacks[m](n)
}}
},signal:function(n,m){if(!j.closed&&j.fire){j.fire(c.stringifyJSON({target:"c",type:n,data:m}))
}},get:function(m){return !j.closed?j[m]:null
},set:function(n,m){if(!j.closed){j[n]=m
}},close:function(){}}
}};
function d(m){var j=c.parseJSON(m),l=j.data;
if(j.target==="p"){switch(j.type){case"send":a4(l);
break;
case"localSend":aU(l);
break;
case"close":aS();
break
}}}aK=function h(j){e.signal("message",j)
};
function i(){document.cookie=bh+"="+encodeURIComponent(c.stringifyJSON({ts:c.now()+1,heir:(e.get("children")||[])[0]}))+"; path=/"
}e=f.storage()||f.windowref();
e.init();
if(a8.logLevel==="debug"){c.atmosphere.debug("Installed StorageService "+e)
}e.set("children",[]);
if(e.get("opened")!=null&&!e.get("opened")){e.set("opened",false)
}bh=encodeURIComponent(g);
i();
a0=setInterval(i,1000);
bg=e
}function aF(d,g,e){if(a8.shared&&g!=="local"){bi()
}if(bg!=null){bg.set("opened",true)
}e.close=function(){aS()
};
if(ae>0&&d==="re-connecting"){e.isReopen=true;
a7(ak)
}else{if(ak.error==null){ak.request=e;
var i=ak.state;
ak.state=d;
var f=ak.transport;
ak.transport=g;
var h=ak.responseBody;
at();
ak.responseBody=h;
ak.state=i;
ak.transport=f
}}}function ab(d){d.transport="jsonp";
var e=a8;
if((d!=null)&&(typeof(d)!=="undefined")){e=d
}var f=e.url;
if(e.dispatchUrl!=null){f+=e.dispatchUrl
}var g=e.data;
if(e.attachHeadersAsQueryString){f=a9(e);
if(g!==""){f+="&X-Atmosphere-Post-Body="+encodeURIComponent(g)
}g=""
}aD=c.ajax({url:f,type:e.method,dataType:"jsonp",error:function(j,h,i){ak.error=true;
if(e.openId){clearTimeout(e.openId)
}if(e.heartbeatTimer){clearTimeout(e.heartbeatTimer)
}if(e.reconnect&&ae++<e.maxReconnectOnClose){aF("re-connecting",e.transport,e);
ao(aD,e,e.reconnectInterval);
e.openId=setTimeout(function(){aC(e)
},e.reconnectInterval+1000)
}else{aH(j.status,i)
}},jsonp:"jsonpTransport",success:function(j){if(e.reconnect){if(e.maxRequest===-1||e.requestCount++<e.maxRequest){aT(aD,e);
be(e);
if(!e.executeCallbackBeforeReconnect){ao(aD,e,e.pollingInterval)
}var h=j.message;
if(h!=null&&typeof h!=="string"){try{h=c.stringifyJSON(h)
}catch(i){}}var l=a6(h,e,ak);
if(!l){bc(ak.responseBody,"messageReceived",200,e.transport)
}if(e.executeCallbackBeforeReconnect){ao(aD,e,e.pollingInterval)
}}else{c.atmosphere.log(a8.logLevel,["JSONP reconnect maximum try reached "+a8.requestCount]);
aH(0,"maxRequest reached")
}}},data:e.data,beforeSend:function(h){aO(h,e,false)
}})
}function B(h){var e=a8;
if((h!=null)&&(typeof(h)!=="undefined")){e=h
}var f=e.url;
if(e.dispatchUrl!=null){f+=e.dispatchUrl
}var g=e.data;
if(e.attachHeadersAsQueryString){f=a9(e);
if(g!==""){f+="&X-Atmosphere-Post-Body="+encodeURIComponent(g)
}g=""
}var d=typeof(e.async)!=="undefined"?e.async:true;
aD=c.ajax({url:f,type:e.method,error:function(l,i,j){ak.error=true;
if(l.status<300){ao(aD,e)
}else{aH(l.status,j)
}},success:function(j,i,l){if(e.reconnect){if(e.maxRequest===-1||e.requestCount++<e.maxRequest){if(!e.executeCallbackBeforeReconnect){ao(aD,e,e.pollingInterval)
}var m=a6(j,e,ak);
if(!m){bc(ak.responseBody,"messageReceived",200,e.transport)
}if(e.executeCallbackBeforeReconnect){ao(aD,e,e.pollingInterval)
}}else{c.atmosphere.log(a8.logLevel,["AJAX reconnect maximum try reached "+a8.requestCount]);
aH(0,"maxRequest reached")
}}},beforeSend:function(i){aO(i,e,false)
},crossDomain:e.enableXDR,async:d})
}function ah(d){if(a8.webSocketImpl!=null){return a8.webSocketImpl
}else{if(window.WebSocket){return new WebSocket(d)
}else{return new MozWebSocket(d)
}}}function a2(){var d=a9(a8);
return decodeURI(c('<a href="'+d+'"/>')[0].href.replace(/^http/,"ws"))
}function aI(){var d=a9(a8);
return d
}function aX(e){ak.transport="sse";
var f=aI(a8.url);
if(a8.logLevel==="debug"){c.atmosphere.debug("Invoking executeSSE");
c.atmosphere.debug("Using URL: "+f)
}if(e&&!a8.reconnect){if(av!=null){bd()
}return
}try{av=new EventSource(f,{withCredentials:a8.withCredentials})
}catch(d){aH(0,d);
ad("SSE failed. Downgrading to fallback transport and resending");
return
}if(a8.connectTimeout>0){a8.id=setTimeout(function(){if(!e){bd()
}},a8.connectTimeout)
}av.onopen=function(g){be(a8);
if(a8.logLevel==="debug"){c.atmosphere.debug("SSE successfully opened")
}if(!a8.enableProtocol){if(!e){aF("opening","sse",a8)
}else{aF("re-opening","sse",a8)
}}else{if(a8.isReopen){a8.isReopen=false;
aF("re-opening",a8.transport,a8)
}}e=true;
if(a8.method==="POST"){ak.state="messageReceived";
av.send(a8.data)
}};
av.onmessage=function(g){be(a8);
if(!a8.enableXDR&&g.origin!==window.location.protocol+"//"+window.location.host){c.atmosphere.log(a8.logLevel,["Origin was not "+window.location.protocol+"//"+window.location.host]);
return
}ak.state="messageReceived";
ak.status=200;
g=g.data;
var h=a6(g,a8,ak);
if(!h){at();
ak.responseBody="";
ak.messages=[]
}};
av.onerror=function(g){clearTimeout(a8.id);
if(a8.heartbeatTimer){clearTimeout(a8.heartbeatTimer)
}if(ak.closedByClientTimeout){return
}ax(e);
bd();
if(am){c.atmosphere.log(a8.logLevel,["SSE closed normally"])
}else{if(!e){ad("SSE failed. Downgrading to fallback transport and resending")
}else{if(a8.reconnect&&(ak.transport==="sse")){if(ae++<a8.maxReconnectOnClose){aF("re-connecting",a8.transport,a8);
if(a8.reconnectInterval>0){a8.reconnectId=setTimeout(function(){aX(true)
},a8.reconnectInterval)
}else{aX(true)
}ak.responseBody="";
ak.messages=[]
}else{c.atmosphere.log(a8.logLevel,["SSE reconnect maximum try reached "+ae]);
aH(0,"maxReconnectOnClose reached")
}}}}}
}function aw(e){ak.transport="websocket";
var f=a2(a8.url);
if(a8.logLevel==="debug"){c.atmosphere.debug("Invoking executeWebSocket");
c.atmosphere.debug("Using URL: "+f)
}if(e&&!a8.reconnect){if(ag!=null){bd()
}return
}ag=ah(f);
if(a8.webSocketBinaryType!=null){ag.binaryType=a8.webSocketBinaryType
}if(a8.connectTimeout>0){a8.id=setTimeout(function(){if(!e){var i={code:1002,reason:"",wasClean:false};
ag.onclose(i);
try{bd()
}catch(h){}return
}},a8.connectTimeout)
}ag.onopen=function(h){be(a8);
if(a8.logLevel==="debug"){c.atmosphere.debug("Websocket successfully opened")
}var i=e;
if(ag!=null){ag.canSendMessage=true
}if(!a8.enableProtocol){e=true;
if(i){aF("re-opening","websocket",a8)
}else{aF("opening","websocket",a8)
}}if(ag!=null){if(a8.method==="POST"){ak.state="messageReceived";
ag.send(a8.data)
}}};
ag.onmessage=function(h){be(a8);
if(a8.enableProtocol){e=true
}ak.state="messageReceived";
ak.status=200;
h=h.data;
var j=typeof(h)==="string";
if(j){var i=a6(h,a8,ak);
if(!i){at();
ak.responseBody="";
ak.messages=[]
}}else{h=a5(a8,h);
if(h===""){return
}ak.responseBody=h;
at();
ak.responseBody=null
}};
ag.onerror=function(h){clearTimeout(a8.id);
if(a8.heartbeatTimer){clearTimeout(a8.heartbeatTimer)
}};
ag.onclose=function(i){if(ak.state==="closed"){return
}clearTimeout(a8.id);
var h=i.reason;
if(h===""){switch(i.code){case 1000:h="Normal closure; the connection successfully completed whatever purpose for which it was created.";
break;
case 1001:h="The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.";
break;
case 1002:h="The endpoint is terminating the connection due to a protocol error.";
break;
case 1003:h="The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).";
break;
case 1004:h="The endpoint is terminating the connection because a data frame was received that is too large.";
break;
case 1005:h="Unknown: no status code was provided even though one was expected.";
break;
case 1006:h="Connection was closed abnormally (that is, with no close frame being sent).";
break
}}if(a8.logLevel==="warn"){c.atmosphere.warn("Websocket closed, reason: "+h);
c.atmosphere.warn("Websocket closed, wasClean: "+i.wasClean)
}if(ak.closedByClientTimeout){return
}ax(e);
ak.state="closed";
if(am){c.atmosphere.log(a8.logLevel,["Websocket closed normally"])
}else{if(!e){ad("Websocket failed. Downgrading to Comet and resending")
}else{if(a8.reconnect&&ak.transport==="websocket"&&i.code!==1001){bd();
if(ae++<a8.maxReconnectOnClose){aF("re-connecting",a8.transport,a8);
if(a8.reconnectInterval>0){a8.reconnectId=setTimeout(function(){ak.responseBody="";
ak.messages=[];
aw(true)
},a8.reconnectInterval)
}else{ak.responseBody="";
ak.messages=[];
aw(true)
}}else{c.atmosphere.log(a8.logLevel,["Websocket reconnect maximum try reached "+a8.requestCount]);
if(a8.logLevel==="warn"){c.atmosphere.warn("Websocket error, reason: "+i.reason)
}aH(0,"maxReconnectOnClose reached")
}}}}};
var d=navigator.userAgent.toLowerCase();
var g=d.indexOf("android")>-1;
if(g&&ag.url===undefined){ag.onclose({reason:"Android 4.1 does not support websockets.",wasClean:false})
}}function a5(g,i){var j=i;
if(g.transport==="polling"){return j
}if(c.trim(i).length!==0&&g.enableProtocol&&g.firstMessage){var e=g.trackMessageLength?1:0;
var l=i.split(g.messageDelimiter);
if(l.length<=e+1){return j
}g.firstMessage=false;
g.uuid=c.trim(l[e]);
if(l.length<=e+2){c.atmosphere.log("error",["Protocol data not sent by the server. If you enable protocol on client side, be sure to install JavascriptProtocol interceptor on server side.Also note that atmosphere-runtime 2.2+ should be used."])
}var h=parseInt(c.trim(l[e+1]),10);
aq=l[e+2];
if(!isNaN(h)&&h>0){var d=function(){a4(aq);
g.heartbeatTimer=setTimeout(d,h)
};
g.heartbeatTimer=setTimeout(d,h)
}b=false;
if(g.transport!=="long-polling"){aC(g)
}c.atmosphere.uuid=g.uuid;
j="";
e=g.trackMessageLength?4:3;
if(l.length>e+1){for(var f=e;
f<l.length;
f++){j+=l[f];
if(f+1!==l.length){j+=g.messageDelimiter
}}}if(g.ackInterval!==0){setTimeout(function(){a4("...ACK...")
},g.ackInterval)
}}else{if(g.enableProtocol&&g.firstMessage&&c.browser.msie&&+c.browser.version.split(".")[0]<10){c.atmosphere.log(a8.logLevel,["Receiving unexpected data from IE"])
}else{aC(g)
}}return j
}function be(d){d.timedOut=false;
clearTimeout(d.id);
if(d.timeout>0&&d.transport!=="polling"){d.id=setTimeout(function(){d.timedOut=true;
aa(d);
aW();
bd()
},d.timeout)
}}function aa(d){ak.closedByClientTimeout=true;
ak.state="closedByClient";
ak.responseBody="";
ak.status=408;
ak.messages=[];
at()
}function aH(e,d){bd();
clearTimeout(a8.id);
ak.state="error";
ak.reasonPhrase=d;
ak.responseBody="";
ak.status=e;
ak.messages=[];
at()
}function a6(i,j,h){i=a5(j,i);
if(i.length===0){return true
}h.responseBody=i;
if(j.trackMessageLength){i=h.partialMessage+i;
var d=[];
var f=i.indexOf(j.messageDelimiter);
while(f!==-1){var e=i.substring(0,f);
var g=parseInt(e,10);
if(isNaN(g)){throw'message length "'+e+'" is not a number'
}f+=j.messageDelimiter.length;
if(f+g>i.length){f=-1
}else{d.push(i.substring(f,f+g));
i=i.substring(f+g,i.length);
f=i.indexOf(j.messageDelimiter)
}}h.partialMessage=i;
if(d.length!==0){h.responseBody=d.join(j.messageDelimiter);
h.messages=d;
return false
}else{h.responseBody="";
h.messages=[];
return true
}}else{h.responseBody=i
}return false
}function ad(e){c.atmosphere.log(a8.logLevel,[e]);
if(typeof(a8.onTransportFailure)!=="undefined"){a8.onTransportFailure(e,a8)
}else{if(typeof(c.atmosphere.onTransportFailure)!=="undefined"){c.atmosphere.onTransportFailure(e,a8)
}}a8.transport=a8.fallbackTransport;
var d=a8.connectTimeout===-1?0:a8.connectTimeout;
if(a8.reconnect&&a8.transport!=="none"||a8.transport==null){a8.method=a8.fallbackMethod;
ak.transport=a8.fallbackTransport;
a8.fallbackTransport="none";
if(d>0){a8.reconnectId=setTimeout(function(){aB()
},d)
}else{aB()
}}else{aH(500,"Unable to reconnect with fallback transport")
}}function a9(d,f){var e=a8;
if((d!=null)&&(typeof(d)!=="undefined")){e=d
}if(f==null){f=e.url
}if(!e.attachHeadersAsQueryString){return f
}if(f.indexOf("X-Atmosphere-Framework")!==-1){return f
}f+=(f.indexOf("?")!==-1)?"&":"?";
f+="X-Atmosphere-tracking-id="+e.uuid;
f+="&X-Atmosphere-Framework="+c.atmosphere.version;
f+="&X-Atmosphere-Transport="+e.transport;
if(e.trackMessageLength){f+="&X-Atmosphere-TrackMessageSize=true"
}if(e.heartbeat!==null&&e.heartbeat.server!==null){f+="&X-Heartbeat-Server="+e.heartbeat.server
}if(e.contentType!==""){f+="&Content-Type="+(e.transport==="websocket"?e.contentType:encodeURIComponent(e.contentType))
}if(e.enableProtocol){f+="&X-atmo-protocol=true"
}c.each(e.headers,function(i,g){var h=c.isFunction(g)?g.call(this,e,d,ak):g;
if(h!=null){f+="&"+encodeURIComponent(i)+"="+encodeURIComponent(h)
}});
return f
}function aC(d){if(!d.isOpen){d.isOpen=true;
aF("opening",d.transport,d)
}else{if(d.isReopen){d.isReopen=false;
aF("re-opening",d.transport,d)
}}}function aP(h){var e=a8;
if((h!=null)||(typeof(h)!=="undefined")){e=h
}e.lastIndex=0;
e.readyState=0;
if((e.transport==="jsonp")||((e.enableXDR)&&(c.atmosphere.checkCORSSupport()))){ab(e);
return
}if(e.transport==="ajax"){B(h);
return
}if(c.browser.msie&&+c.browser.version.split(".")[0]<10){if((e.transport==="streaming")){if(e.enableXDR&&window.XDomainRequest){aL(e)
}else{ac(e)
}return
}if((e.enableXDR)&&(window.XDomainRequest)){aL(e);
return
}}var g=function(){e.lastIndex=0;
if(e.reconnect&&ae++<e.maxReconnectOnClose){ak.ffTryingReconnect=true;
aF("re-connecting",h.transport,h);
ao(d,e,h.reconnectInterval)
}else{aH(0,"maxReconnectOnClose reached")
}};
var f=function(){ak.errorHandled=true;
bd();
g()
};
if(e.reconnect&&(e.maxRequest===-1||e.requestCount++<e.maxRequest)){var d=c.ajaxSettings.xhr();
d.hasData=false;
aO(d,e,true);
if(e.suspend){aZ=d
}if(e.transport!=="polling"){ak.transport=e.transport;
d.onabort=function(){ax(true)
};
d.onerror=function(){ak.error=true;
ak.ffTryingReconnect=true;
try{ak.status=XMLHttpRequest.status
}catch(i){ak.status=500
}if(!ak.status){ak.status=500
}if(!ak.errorHandled){bd();
g()
}}
}d.onreadystatechange=function(){if(am){return
}ak.error=null;
var p=false;
var i=false;
if(e.transport==="streaming"&&e.readyState>2&&d.readyState===4){bd();
g();
return
}e.readyState=d.readyState;
if(e.transport==="streaming"&&d.readyState>=3){i=true
}else{if(e.transport==="long-polling"&&d.readyState===4){i=true
}}be(a8);
if(e.transport!=="polling"){var q=200;
if(d.readyState===4){q=d.status>1000?0:d.status
}if(!e.reconnectOnServerError&&(q>=300&&q<600)){aH(q,d.statusText);
return
}if(q>=300||q===0){f();
return
}if((!e.enableProtocol||!h.firstMessage)&&d.readyState===2){if(c.browser.mozilla&&ak.ffTryingReconnect){ak.ffTryingReconnect=false;
setTimeout(function(){if(!ak.ffTryingReconnect){aC(e)
}},500)
}else{aC(e)
}}}else{if(d.readyState===4){i=true
}}if(i){var m=d.responseText;
if(c.trim(m).length===0&&e.transport==="long-polling"){if(!d.hasData){ao(d,e,e.pollingInterval)
}else{d.hasData=false
}return
}d.hasData=true;
aT(d,a8);
if(e.transport==="streaming"){if(!c.browser.opera){var n=m.substring(e.lastIndex,m.length);
p=a6(n,e,ak);
e.lastIndex=m.length;
if(p){return
}}else{c.atmosphere.iterate(function(){if(ak.status!==500&&d.responseText.length>e.lastIndex){try{ak.status=d.status;
ak.headers=a(d.getAllResponseHeaders());
aT(d,a8)
}catch(t){ak.status=404
}be(a8);
ak.state="messageReceived";
var s=d.responseText.substring(e.lastIndex);
e.lastIndex=d.responseText.length;
p=a6(s,e,ak);
if(!p){at()
}if(aR(d,e)){aQ(d,e);
return
}}else{if(ak.status>400){e.lastIndex=d.responseText.length;
return false
}}},0)
}}else{p=a6(m,e,ak)
}var j=aR(d,e);
try{ak.status=d.status;
ak.headers=a(d.getAllResponseHeaders());
aT(d,e)
}catch(l){ak.status=404
}if(e.suspend){ak.state=ak.status===0?"closed":"messageReceived"
}else{ak.state="messagePublished"
}var o=!j&&h.transport!=="streaming"&&h.transport!=="polling";
if(o&&!e.executeCallbackBeforeReconnect){ao(d,e,e.pollingInterval)
}if(ak.responseBody.length!==0&&!p){at()
}if(o&&e.executeCallbackBeforeReconnect){ao(d,e,e.pollingInterval)
}if(j){aQ(d,e)
}}};
d.send(e.data);
a3=true
}else{if(e.logLevel==="debug"){c.atmosphere.log(e.logLevel,["Max re-connection reached."])
}aH(0,"maxRequest reached")
}}function aQ(d,e){aS();
am=false;
ao(d,e,500)
}function aO(d,g,e){var f=g.url;
if(g.dispatchUrl!=null&&g.method==="POST"){f+=g.dispatchUrl
}f=a9(g,f);
f=c.atmosphere.prepareURL(f);
if(e){d.open(g.method,f,true);
if(g.connectTimeout>0){g.id=setTimeout(function(){if(g.requestCount===0){bd();
bc("Connect timeout","closed",200,g.transport)
}},g.connectTimeout)
}}if(a8.withCredentials&&a8.transport!=="websocket"){if("withCredentials" in d){d.withCredentials=true
}}if(!a8.dropHeaders){d.setRequestHeader("X-Atmosphere-Framework",c.atmosphere.version);
d.setRequestHeader("X-Atmosphere-Transport",g.transport);
if(d.heartbeat!==null&&d.heartbeat.server!==null){d.setRequestHeader("X-Heartbeat-Server",d.heartbeat.server)
}if(g.trackMessageLength){d.setRequestHeader("X-Atmosphere-TrackMessageSize","true")
}d.setRequestHeader("X-Atmosphere-tracking-id",g.uuid);
c.each(g.headers,function(j,h){var i=c.isFunction(h)?h.call(this,d,g,e,ak):h;
if(i!=null){d.setRequestHeader(j,i)
}})
}if(g.contentType!==""){d.setRequestHeader("Content-Type",g.contentType)
}}function ao(e,d,g){if(d.reconnect||(d.suspend&&a3)){var f=0;
if(e.readyState>1){f=e.status>1000?0:e.status
}ak.status=f===0?204:f;
ak.reason=f===0?"Server resumed the connection or down.":"OK";
clearTimeout(d.id);
if(d.reconnectId){clearTimeout(d.reconnectId);
delete d.reconnectId
}if(g>0){setTimeout(function(){a8.reconnectId=aP(d)
},g)
}else{aP(d)
}}}function a7(d){d.state="re-connecting";
ap(d)
}function aL(d){if(d.transport!=="polling"){ba=az(d);
ba.open()
}else{az(d).open()
}}function az(e){var g=a8;
if((e!=null)&&(typeof(e)!=="undefined")){g=e
}var d=g.transport;
var f=0;
var i=new window.XDomainRequest();
var j=function(){if(g.transport==="long-polling"&&(g.reconnect&&(g.maxRequest===-1||g.requestCount++<g.maxRequest))){i.status=200;
aF("re-connecting",e.transport,e);
aL(g)
}};
var h=g.rewriteURL||function(m){var n=/(?:^|;\s*)(JSESSIONID|PHPSESSID)=([^;]*)/.exec(document.cookie);
switch(n&&n[1]){case"JSESSIONID":return m.replace(/;jsessionid=[^\?]*|(\?)|$/,";jsessionid="+n[2]+"$1");
case"PHPSESSID":return m.replace(/\?PHPSESSID=[^&]*&?|\?|$/,"?PHPSESSID="+n[2]+"&").replace(/&$/,"")
}return m
};
i.onprogress=function(){l(i)
};
i.onerror=function(){if(g.transport!=="polling"){bd();
if(ae++<g.maxReconnectOnClose){if(g.reconnectInterval>0){g.reconnectId=setTimeout(function(){aF("re-connecting",e.transport,e);
aL(g)
},g.reconnectInterval)
}else{aF("re-connecting",e.transport,e);
aL(g)
}}else{aH(0,"maxReconnectOnClose reached")
}}};
i.onload=function(){if(a8.timedOut){a8.timedOut=false;
bd();
g.lastIndex=0;
if(g.reconnect&&ae++<g.maxReconnectOnClose){aF("re-connecting",e.transport,e);
j()
}else{aH(0,"maxReconnectOnClose reached")
}}};
var l=function(o){clearTimeout(g.id);
var m=o.responseText;
m=m.substring(f);
f+=m.length;
if(d!=="polling"){be(g);
var n=a6(m,g,ak);
if(d==="long-polling"&&c.trim(m).length===0){return
}if(g.executeCallbackBeforeReconnect){j()
}if(!n){bc(ak.responseBody,"messageReceived",200,d)
}if(!g.executeCallbackBeforeReconnect){j()
}}};
return{open:function(){var m=g.url;
if(g.dispatchUrl!=null){m+=g.dispatchUrl
}m=a9(g,m);
i.open(g.method,h(m));
if(g.method==="GET"){i.send()
}else{i.send(g.data)
}if(g.connectTimeout>0){g.id=setTimeout(function(){if(g.requestCount===0){bd();
bc("Connect timeout","closed",200,g.transport)
}},g.connectTimeout)
}},close:function(){i.abort()
}}
}function ac(d){ba=aA(d);
ba.open()
}function aA(h){var d=a8;
if((h!=null)&&(typeof(h)!=="undefined")){d=h
}var e;
var g=new window.ActiveXObject("htmlfile");
g.open();
g.close();
var f=d.url;
if(d.dispatchUrl!=null){f+=d.dispatchUrl
}if(d.transport!=="polling"){ak.transport=d.transport
}return{open:function(){var j=g.createElement("iframe");
f=a9(d);
if(d.data!==""){f+="&X-Atmosphere-Post-Body="+encodeURIComponent(d.data)
}f=c.atmosphere.prepareURL(f);
j.src=f;
g.body.appendChild(j);
var i=j.contentDocument||j.contentWindow.document;
e=c.atmosphere.iterate(function(){try{if(!i.firstChild){return
}if(i.readyState==="complete"){try{c.noop(i.fileSize)
}catch(l){bc("Connection Failure","error",500,d.transport);
return false
}}var o=i.body?i.body.lastChild:i;
var m=function(){var t=o.cloneNode(true);
t.appendChild(i.createTextNode("."));
var s=t.innerText;
s=s.substring(0,s.length-1);
return s
};
if(!c.nodeName(o,"pre")){var p=i.head||i.getElementsByTagName("head")[0]||i.documentElement||i;
var q=i.createElement("script");
q.text="document.write('<plaintext>')";
p.insertBefore(q,p.firstChild);
p.removeChild(q);
o=i.body.lastChild
}if(d.closed){d.isReopen=true
}e=c.atmosphere.iterate(function(){var t=m();
if(t.length>d.lastIndex){be(a8);
ak.status=200;
ak.error=null;
o.innerText="";
var s=a6(t,d,ak);
if(s){return""
}bc(ak.responseBody,"messageReceived",200,d.transport)
}d.lastIndex=0;
if(i.readyState==="complete"){ax(true);
aF("re-connecting",d.transport,d);
if(d.reconnectInterval>0){d.reconnectId=setTimeout(function(){ac(d)
},d.reconnectInterval)
}else{ac(d)
}return false
}},null);
return false
}catch(n){ak.error=true;
aF("re-connecting",d.transport,d);
if(ae++<d.maxReconnectOnClose){if(d.reconnectInterval>0){d.reconnectId=setTimeout(function(){ac(d)
},d.reconnectInterval)
}else{ac(d)
}}else{aH(0,"maxReconnectOnClose reached")
}g.execCommand("Stop");
g.close();
return false
}})
},close:function(){if(e){e()
}g.execCommand("Stop");
ax(true)
}}
}function a4(d){if(af!=null){aV(d)
}else{if(aZ!=null||av!=null){aM(d)
}else{if(ba!=null){bf(d)
}else{if(aD!=null){aY(d)
}else{if(ag!=null){aE(d)
}else{aH(0,"No suspended connection available");
c.atmosphere.error("No suspended connection available. Make sure atmosphere.subscribe has been called and request.onOpen invoked before invoking this method")
}}}}}}function aV(d){af.send(d)
}function al(d){if(d.length===0){return
}try{if(af){af.localSend(d)
}else{if(bg){bg.signal("localMessage",c.stringifyJSON({id:aJ,event:d}))
}}}catch(e){c.atmosphere.error(e)
}}function aM(d){var e=a1(d);
aP(e)
}function bf(d){if(a8.enableXDR&&c.atmosphere.checkCORSSupport()){var e=a1(d);
e.reconnect=false;
ab(e)
}else{aM(d)
}}function aY(d){aM(d)
}function aN(e){var d=e;
if(typeof(d)==="object"){d=e.data
}return d
}function a1(e){var d=aN(e);
var f={connected:false,timeout:60000,method:"POST",url:a8.url,contentType:a8.contentType,headers:a8.headers,reconnect:true,callback:null,data:d,suspend:false,maxRequest:-1,logLevel:"info",requestCount:0,withCredentials:a8.withCredentials,transport:"polling",isOpen:true,attachHeadersAsQueryString:true,enableXDR:a8.enableXDR,uuid:a8.uuid,dispatchUrl:a8.dispatchUrl,enableProtocol:false,messageDelimiter:"|",trackMessageLength:a8.trackMessageLength,maxReconnectOnClose:a8.maxReconnectOnClose,heartbeatTimer:a8.heartbeatTimer,heartbeat:a8.heartbeat};
if(typeof(e)==="object"){f=c.extend(f,e)
}return f
}function aE(f){var g=c.atmosphere.isBinary(f)?f:aN(f);
var e;
try{if(a8.dispatchUrl!=null){e=a8.webSocketPathDelimiter+a8.dispatchUrl+a8.webSocketPathDelimiter+g
}else{e=g
}if(!ag.canSendMessage){c.atmosphere.error("WebSocket not connected.");
return
}ag.send(e)
}catch(d){ag.onclose=function(h){};
bd();
ad("Websocket failed. Downgrading to Comet and resending "+f);
aM(f)
}}function aU(d){var e=c.parseJSON(d);
if(e.id!==aJ){if(typeof(a8.onLocalMessage)!=="undefined"){a8.onLocalMessage(e.event)
}else{if(typeof(c.atmosphere.onLocalMessage)!=="undefined"){c.atmosphere.onLocalMessage(e.event)
}}}}function bc(g,f,e,d){ak.responseBody=g;
ak.transport=d;
ak.status=e;
ak.state=f;
at()
}function aT(f,d){if(!d.readResponsesHeaders){if(!d.enableProtocol){d.uuid=c.atmosphere.guid()
}}else{try{var e=f.getResponseHeader("X-Atmosphere-tracking-id");
if(e&&e!=null){d.uuid=e.split(" ").pop()
}}catch(g){}}}function ap(d){bb(d,a8);
bb(d,c.atmosphere)
}function bb(e,d){switch(e.state){case"messageReceived":ae=0;
if(typeof(d.onMessage)!=="undefined"){d.onMessage(e)
}break;
case"error":if(typeof(d.onError)!=="undefined"){d.onError(e)
}break;
case"opening":delete a8.closed;
if(typeof(d.onOpen)!=="undefined"){d.onOpen(e)
}break;
case"messagePublished":if(typeof(d.onMessagePublished)!=="undefined"){d.onMessagePublished(e)
}break;
case"re-connecting":if(typeof(d.onReconnect)!=="undefined"){d.onReconnect(a8,e)
}break;
case"closedByClient":if(typeof(d.onClientTimeout)!=="undefined"){d.onClientTimeout(a8)
}break;
case"re-opening":delete a8.closed;
if(typeof(d.onReopen)!=="undefined"){d.onReopen(a8,e)
}break;
case"fail-to-reconnect":if(typeof(d.onFailureToReconnect)!=="undefined"){d.onFailureToReconnect(a8,e)
}break;
case"unsubscribe":case"closed":var f=typeof(a8.closed)!=="undefined"?a8.closed:false;
if(!f){if(typeof(d.onClose)!=="undefined"){d.onClose(e)
}}a8.closed=true;
break
}}function ax(d){if(ak.state!=="closed"){ak.state="closed";
ak.responseBody="";
ak.messages=[];
ak.status=!d?501:200;
at()
}}function at(){var d=function(j,i){i(ak)
};
if(af==null&&aK!=null){aK(ak.responseBody)
}a8.reconnect=a8.mrequest;
var f=typeof(ak.responseBody)==="string";
var h=(f&&a8.trackMessageLength)?(ak.messages.length>0?ak.messages:[""]):new Array(ak.responseBody);
for(var e=0;
e<h.length;
e++){if(h.length>1&&h[e].length===0){continue
}ak.responseBody=(f)?c.trim(h[e]):h[e];
if(af==null&&aK!=null){aK(ak.responseBody)
}if((ak.responseBody.length===0||(f&&aq===ak.responseBody))&&ak.state==="messageReceived"){continue
}ap(ak);
if(c.atmosphere.callbacks.length>0){if(a8.logLevel==="debug"){c.atmosphere.debug("Invoking "+c.atmosphere.callbacks.length+" global callbacks: "+ak.state)
}try{c.each(c.atmosphere.callbacks,d)
}catch(g){c.atmosphere.log(a8.logLevel,["Callback exception"+g])
}}if(typeof(a8.callback)==="function"){if(a8.logLevel==="debug"){c.atmosphere.debug("Invoking request callbacks")
}try{a8.callback(ak)
}catch(g){c.atmosphere.log(a8.logLevel,["Callback exception"+g])
}}}}function aR(d,e){if(ak.partialMessage===""&&(e.transport==="streaming")&&(d.responseText.length>e.maxStreamingLength)){return true
}return false
}function aW(){if(a8.enableProtocol&&!a8.firstMessage){var d="X-Atmosphere-Transport=close&X-Atmosphere-tracking-id="+a8.uuid;
c.each(a8.headers,function(f,g){var h=c.isFunction(g)?g.call(this,a8,a8,ak):g;
if(h!=null){d+="&"+encodeURIComponent(f)+"="+encodeURIComponent(h)
}});
var e=a8.url.replace(/([?&])_=[^&]*/,d);
e=e+(e===a8.url?(/\?/.test(a8.url)?"&":"?")+d:"");
if(a8.connectTimeout>0){c.ajax({url:e,async:a8.closeAsync,timeout:a8.connectTimeout,cache:false,crossDomain:a8.enableXDR})
}else{c.ajax({url:e,async:a8.closeAsync,cache:false,crossDomain:a8.enableXDR})
}}}function aS(){if(a8.reconnectId){clearTimeout(a8.reconnectId);
delete a8.reconnectId
}if(a8.heartbeatTimer){clearTimeout(a8.heartbeatTimer)
}a8.reconnect=false;
am=true;
ak.request=a8;
ak.state="unsubscribe";
ak.responseBody="";
ak.status=408;
at();
aW();
bd()
}function bd(){ak.partialMessage="";
if(a8.id){clearTimeout(a8.id)
}if(a8.heartbeatTimer){clearTimeout(a8.heartbeatTimer)
}if(ba!=null){ba.close();
ba=null
}if(aD!=null){aD.abort();
aD=null
}if(aZ!=null){aZ.abort();
aZ=null
}if(ag!=null){if(ag.canSendMessage){ag.close()
}ag=null
}if(av!=null){av.close();
av=null
}au()
}function au(){if(bg!=null){clearInterval(a0);
document.cookie=bh+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
bg.signal("close",{reason:"",heir:!am?aJ:(bg.get("children")||[])[0]});
bg.close()
}if(af!=null){af.close()
}}this.subscribe=function(d){an(d);
aB()
};
this.execute=function(){aB()
};
this.invokeCallback=function(){at()
};
this.close=function(){aS()
};
this.disconnect=function(){aW()
};
this.getUrl=function(){return a8.url
};
this.push=function(d,e){if(e!=null){var f=a8.dispatchUrl;
a8.dispatchUrl=e;
a4(d);
a8.dispatchUrl=f
}else{a4(d)
}};
this.getUUID=function(){return a8.uuid
};
this.pushLocal=function(d){al(d)
};
this.enableProtocol=function(d){return a8.enableProtocol
};
this.request=a8;
this.response=ak
},subscribe:function(g,d,e){if(typeof(d)==="function"){c.atmosphere.addCallback(d)
}if(typeof(g)!=="string"){e=g
}else{e.url=g
}c.atmosphere.uuid=((typeof(e)!=="undefined")&&typeof(e.uuid)!=="undefined")?e.uuid:0;
var f=new c.atmosphere.AtmosphereRequest(e);
f.execute();
c.atmosphere.requests[c.atmosphere.requests.length]=f;
return f
},addCallback:function(d){if(c.inArray(d,c.atmosphere.callbacks)===-1){c.atmosphere.callbacks.push(d)
}},removeCallback:function(d){var e=c.inArray(d,c.atmosphere.callbacks);
if(e!==-1){c.atmosphere.callbacks.splice(e,1)
}},unsubscribe:function(){if(c.atmosphere.requests.length>0){var f=[].concat(c.atmosphere.requests);
for(var d=0;
d<f.length;
d++){var e=f[d];
e.close();
clearTimeout(e.response.request.id);
if(e.heartbeatTimer){clearTimeout(e.heartbeatTimer)
}}}c.atmosphere.requests=[];
c.atmosphere.callbacks=[]
},unsubscribeUrl:function(f){var g=-1;
if(c.atmosphere.requests.length>0){for(var d=0;
d<c.atmosphere.requests.length;
d++){var e=c.atmosphere.requests[d];
if(e.getUrl()===f){e.close();
clearTimeout(e.response.request.id);
if(e.heartbeatTimer){clearTimeout(e.heartbeatTimer)
}g=d;
break
}}}if(g>=0){c.atmosphere.requests.splice(g,1)
}},publish:function(d){if(typeof(d.callback)==="function"){c.atmosphere.addCallback(d.callback)
}d.transport="polling";
var e=new c.atmosphere.AtmosphereRequest(d);
c.atmosphere.requests[c.atmosphere.requests.length]=e;
return e
},checkCORSSupport:function(){if(c.browser.msie&&!window.XDomainRequest&&+c.browser.version.split(".")[0]<11){return true
}else{if(c.browser.opera&&+c.browser.version.split(".")[0]<12){return true
}else{if(c.trim(navigator.userAgent).slice(0,16)==="KreaTVWebKit/531"){return true
}else{if(c.trim(navigator.userAgent).slice(-7).toLowerCase()==="kreatel"){return true
}}}}var e=navigator.userAgent.toLowerCase();
var d=e.indexOf("android")>-1;
if(d){return true
}return false
},S4:function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)
},guid:function(){return(c.atmosphere.S4()+c.atmosphere.S4()+"-"+c.atmosphere.S4()+"-"+c.atmosphere.S4()+"-"+c.atmosphere.S4()+"-"+c.atmosphere.S4()+c.atmosphere.S4()+c.atmosphere.S4())
},prepareURL:function(e){var d=c.now();
var f=e.replace(/([?&])_=[^&]*/,"$1_="+d);
return f+(f===e?(/\?/.test(e)?"&":"?")+"_="+d:"")
},param:function(d){return c.param(d,c.ajaxSettings.traditional)
},supportStorage:function(){var d=window.localStorage;
if(d){try{d.setItem("t","t");
d.removeItem("t");
return window.StorageEvent&&!c.browser.msie&&!(c.browser.mozilla&&c.browser.version.split(".")[0]==="1")
}catch(e){}}return false
},iterate:function(e,f){var d;
f=f||0;
(function g(){d=setTimeout(function(){if(e()===false){return
}g()
},f)
})();
return function(){clearTimeout(d)
}
},log:function(d,e){if(window.console){var f=window.console[d];
if(typeof f==="function"){f.apply(window.console,e)
}}},warn:function(){c.atmosphere.log("warn",arguments)
},info:function(){c.atmosphere.log("info",arguments)
},debug:function(){c.atmosphere.log("debug",arguments)
},error:function(){c.atmosphere.log("error",arguments)
},isBinary:function(d){return/^\[object\s(?:Blob|ArrayBuffer|.+Array)\]$/.test(Object.prototype.toString.call(d))
}};
(function(){var e,d;
c.uaMatch=function(f){f=f.toLowerCase();
var g=/(chrome)[ \/]([\w.]+)/.exec(f)||/(webkit)[ \/]([\w.]+)/.exec(f)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(f)||/(msie) ([\w.]+)/.exec(f)||/(trident)(?:.*? rv:([\w.]+)|)/.exec(f)||f.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(f)||[];
return{browser:g[1]||"",version:g[2]||"0"}
};
e=c.uaMatch(navigator.userAgent);
d={};
if(e.browser){d[e.browser]=true;
d.version=e.version
}if(d.chrome){d.webkit=true
}else{if(d.webkit){d.safari=true
}}if(d.trident){d.msie=true
}c.browser=d;
c.sub=function(){function h(j,i){return new h.fn.init(j,i)
}c.extend(true,h,this);
h.superclass=this;
h.fn=h.prototype=this();
h.fn.constructor=h;
h.sub=this.sub;
h.fn.init=function f(j,i){if(i&&i instanceof c&&!(i instanceof h)){i=h(i)
}return c.fn.init.call(this,j,i,g)
};
h.fn.init.prototype=h.fn;
var g=h(document);
return h
}
})();
(function(f){var d=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,g={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};
function i(j){return'"'+j.replace(d,function(m){var l=g[m];
return typeof l==="string"?l:"\\u"+("0000"+m.charCodeAt(0).toString(16)).slice(-4)
})+'"'
}function h(j){return j<10?"0"+j:j
}function e(q,s){var j,l,n,m,o=s[q],p=typeof o;
if(o&&typeof o==="object"&&typeof o.toJSON==="function"){o=o.toJSON(q);
p=typeof o
}switch(p){case"string":return i(o);
case"number":return isFinite(o)?String(o):"null";
case"boolean":return String(o);
case"object":if(!o){return"null"
}switch(Object.prototype.toString.call(o)){case"[object Date]":return isFinite(o.valueOf())?'"'+o.getUTCFullYear()+"-"+h(o.getUTCMonth()+1)+"-"+h(o.getUTCDate())+"T"+h(o.getUTCHours())+":"+h(o.getUTCMinutes())+":"+h(o.getUTCSeconds())+'Z"':"null";
case"[object Array]":n=o.length;
m=[];
for(j=0;
j<n;
j++){m.push(e(j,o)||"null")
}return"["+m.join(",")+"]";
default:m=[];
for(j in o){if(Object.prototype.hasOwnProperty.call(o,j)){l=e(j,o);
if(l){m.push(i(j)+":"+l)
}}}return"{"+m.join(",")+"}"
}}}f.stringifyJSON=function(j){if(window.JSON&&window.JSON.stringify){return window.JSON.stringify(j)
}return e("",{"":j})
}
}(c))
}));
(function(d,a){a.ui=a.ui||{};
var c={exec:function(e,f){if(f.switchMode=="server"){return this.execServer(e,f)
}else{if(f.switchMode=="ajax"){return this.execAjax(e,f)
}else{if(f.switchMode=="client"){return this.execClient(e,f)
}else{a.log.error("SwitchItems.exec : unknown switchMode ("+f.switchMode+")")
}}}},execServer:function(f,h){if(f){var g=f.__leave();
if(!g){return false
}}this.__setActiveItem(h);
var e={};
e[h.getTogglePanel().id]=h.name;
e[h.id]=h.id;
d.extend(e,h.getTogglePanel().options.ajax||{});
a.submitForm(this.__getParentForm(h),e);
return false
},execAjax:function(e,g){var f=d.extend({},g.getTogglePanel().options.ajax,{});
this.__setActiveItem(g);
a.ajax(g.id,null,f);
if(e){this.__setActiveItem(e)
}return false
},execClient:function(e,g){if(e){var f=e.__leave();
if(!f){return false
}}this.__setActiveItem(g);
g.__enter();
g.getTogglePanel().__fireItemChange(e,g);
return true
},__getParentForm:function(e){return d(a.getDomElement(e.id)).parents("form:first")
},__setActiveItem:function(e){a.getDomElement(e.togglePanelId+"-value").value=e.getName();
e.getTogglePanel().activeItem=e.getName()
}};
a.ui.TabPanel=a.ui.TogglePanel.extendClass({name:"TabPanel",init:function(e,f){a.ui.TogglePanel.call(this,e,f);
this.items=[];
this.isKeepHeight=f.isKeepHeight||false;
this.element=document.getElementById(e);
var g=d(this.element);
g.on("click",".rf-tab-hdr-act",d.proxy(this.__clickListener,this));
g.on("click",".rf-tab-hdr-inact",d.proxy(this.__clickListener,this))
},__clickListener:function(g){var e=d(g.target);
if(!e.hasClass("rf-tab-hdr")){e=e.parents(".rf-tab-hdr").first()
}var f=e.data("tabname");
this.switchToItem(f)
},__itemsSwitcher:function(){return c
}})
})(RichFaces.jQuery,RichFaces);
(function(f,h){h.ui=h.ui||{};
var i={useNative:false};
h.ui.Focus=h.BaseComponent.extendClass({name:"Focus",init:function(m,n){e.constructor.call(this,m);
n=this.options=f.extend({},i,n);
this.attachToDom(this.id);
var j=f(document.getElementById(m+"InputFocus"));
var l=this.options.focusCandidates;
f(document).on("focus",":tabbable",function(o){var p=f(o.target);
if(!p.is(":editable")){return
}var q=o.target.id||"";
p.parents().each(function(){var s=f(this).attr("id");
if(s){q+=" "+s
}});
j.val(q);
h.log.debug("Focus - clientId candidates for components: "+q)
});
if(this.options.mode==="VIEW"){f(document).on("ajaxsubmit submit","form",function(o){var p=f(o.target);
var q=f("input[name='org.richfaces.focus']",p);
if(!q.length){q=f('<input name="org.richfaces.focus" type="hidden" />').appendTo(p)
}q.val(j.val())
})
}this.options.applyFocus=f.proxy(function(){var p=f();
if(l){var o=l;
h.log.debug("Focus - focus candidates: "+o);
o=o.split(" ");
f.each(o,function(s,t){var q=f(document.getElementById(t));
p=p.add(f(":tabbable",q));
if(q.is(":tabbable")){p=p.add(q)
}});
if(p.length==0){p=f("form").has(j).find(":tabbable")
}}else{if(this.options.mode=="VIEW"){p=f("body form:first :tabbable")
}}if(p.length>0){p=p.sort(g);
p.get(0).focus()
}},this)
},applyFocus:function(){f(this.options.applyFocus)
},destroy:function(){e.destroy.call(this)
}});
var g=function(j,l){var m=c(f(j).attr("tabindex"),f(l).attr("tabindex"));
return(m!=0)?m:d(j,l)
};
var c=function(j,l){if(j){if(l){return j-l
}else{return -1
}}else{if(l){return +1
}else{return 0
}}};
var d=function(l,m){var j=a(l,m);
if(l==m){return 0
}else{if(j.parent==l){return -1
}else{if(j.parent==m){return +1
}else{return f(j.aPrevious).index()-f(j.bPrevious).index()
}}}};
var a=function(m,n){var o=f(m).add(f(m).parents()).get().reverse();
var j=f(n).add(f(n).parents()).get().reverse();
var l={aPrevious:m,bPrevious:n};
f.each(o,function(p,q){f.each(j,function(t,s){if(q==s){l.parent=q;
return false
}l.bPrevious=s
});
if(l.parent){return false
}l.aPrevious=q
});
if(!l.parent){return null
}return l
};
h.ui.Focus.__fn={sortTabindex:g,sortTabindexNums:c,searchCommonParent:a,sortByDOMOrder:d};
var e=h.ui.Focus.$super
})(RichFaces.jQuery,RichFaces);
(function(d,a){a.ui=a.ui||{};
a.ui.PopupPanel.Border=function(e,g,f,h){c.constructor.call(this,e);
this.element=d(a.getDomElement(e));
this.element.css("cursor",f);
var i=this;
this.element.bind("mousedown",{border:i},this.startDrag);
this.modalPanel=g;
this.sizer=h
};
var c=a.BaseComponent.extend(a.ui.PopupPanel.Border);
var c=a.ui.PopupPanel.Border.$super;
d.extend(a.ui.PopupPanel.Border.prototype,(function(e){return{name:"RichFaces.ui.PopupPanel.Border",destroy:function(){if(this.doingDrag){d(document).unbind("mousemove",this.doDrag);
d(document).unbind("mouseup",this.endDrag)
}this.element.unbind("mousedown",this.startDrag);
this.element=null;
this.modalPanel=null
},show:function(){this.element.show()
},hide:function(){this.element.hide()
},startDrag:function(f){var g=f.data.border;
g.doingDrag=true;
g.dragX=f.clientX;
g.dragY=f.clientY;
d(document).bind("mousemove",{border:g},g.doDrag);
d(document).bind("mouseup",{border:g},g.endDrag);
g.modalPanel.startDrag(g);
g.onselectStartHandler=document.onselectstart;
document.onselectstart=function(){return false
}
},getWindowSize:function(){var f=0,g=0;
if(typeof(window.innerWidth)=="number"){f=window.innerWidth;
g=window.innerHeight
}else{if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){f=document.documentElement.clientWidth;
g=document.documentElement.clientHeight
}else{if(document.body&&(document.body.clientWidth||document.body.clientHeight)){f=document.body.clientWidth;
g=document.body.clientHeight
}}}return{width:f,height:g}
},doDrag:function(s){var m=s.data.border;
if(!m.doingDrag){return
}var n=s.clientX;
var q=s.clientY;
var j=m.getWindowSize();
if(n<0){n=0
}else{if(n>=j.width){n=j.width-1
}}if(q<0){q=0
}else{if(q>=j.height){q=j.height-1
}}var f=n-m.dragX;
var g=q-m.dragY;
if(f!=0||g!=0){var o=m.id;
var h=m.sizer.prototype.doDiff(f,g);
var i;
var l=m.modalPanel.cdiv;
if(h.deltaWidth||h.deltaHeight){i=m.modalPanel.invokeEvent("resize",s,null,l)
}else{if(h.deltaX||h.deltaY){i=m.modalPanel.invokeEvent("move",s,null,l)
}}var p;
if(i){p=m.modalPanel.doResizeOrMove(h)
}if(p){if(!p.x){m.dragX=n
}else{if(!h.deltaX){m.dragX-=p.vx||0
}else{m.dragX+=p.vx||0
}}if(!p.y){m.dragY=q
}else{if(!h.deltaY){m.dragY-=p.vy||0
}else{m.dragY+=p.vy||0
}}}}},endDrag:function(f){var g=f.data.border;
g.doingDrag=undefined;
d(document).unbind("mousemove",g.doDrag);
d(document).unbind("mouseup",g.endDrag);
g.modalPanel.endDrag(g);
document.onselectstart=g.onselectStartHandler;
g.onselectStartHandler=null
},doPosition:function(){this.sizer.prototype.doPosition(this.modalPanel,this.element)
}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(d,a){a.ui=a.ui||{};
a.ui.InputBase=function(e,g){c.constructor.call(this,e);
this.namespace=this.getNamespace()||"."+a.Event.createNamespace(this.getName(),this.getId());
this.namespace=this.namespace||"."+a.Event.createNamespace(this.name,this.id);
this.input=d(document.getElementById(e+"Input"));
this.attachToDom();
var f={};
f["keydown"+this.namespace]=d.proxy(this.__keydownHandler,this);
f["blur"+this.namespace]=d.proxy(this.__blurHandler,this);
f["change"+this.namespace]=d.proxy(this.__changeHandler,this);
f["focus"+this.namespace]=d.proxy(this.__focusHandler,this);
a.Event.bind(this.input,f,this)
};
a.BaseComponent.extend(a.ui.InputBase);
var c=a.ui.InputBase.$super;
d.extend(a.ui.InputBase.prototype,(function(){return{name:"inputBase",getName:function(){return this.name
},getNamespace:function(){return this.namespace
},__focusHandler:function(e){},__keydownHandler:function(e){},__blurHandler:function(e){},__changeHandler:function(e){},__setInputFocus:function(){this.input.focus()
},__getValue:function(){return this.input.val()
},__setValue:function(e){this.input.val(e);
if(this.defaultLabelClass){if(this.defaultLabel&&e==this.defaultLabel){this.input.addClass(this.defaultLabelClass)
}else{this.input.removeClass(this.defaultLabelClass)
}}},getValue:function(){return this.__getValue()
},setValue:function(e){this.__setValue(e)
},getInput:function(){return this.input
},getId:function(){return this.id
},destroy:function(){a.Event.unbindById(this.input,this.namespace);
this.input=null;
c.destroy.call(this)
}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(a){if(typeof define==="function"&&define.amd){define(["jquery","./widget"],a)
}else{a(jQuery)
}}(function(c){var a=false;
c(document).mouseup(function(){a=false
});
return c.widget("ui.mouse",{version:"1.11.2",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var d=this;
this.element.bind("mousedown."+this.widgetName,function(e){return d._mouseDown(e)
}).bind("click."+this.widgetName,function(e){if(true===c.data(e.target,d.widgetName+".preventClickEvent")){c.removeData(e.target,d.widgetName+".preventClickEvent");
e.stopImmediatePropagation();
return false
}});
this.started=false
},_mouseDestroy:function(){this.element.unbind("."+this.widgetName);
if(this._mouseMoveDelegate){this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)
}},_mouseDown:function(e){if(a){return
}this._mouseMoved=false;
(this._mouseStarted&&this._mouseUp(e));
this._mouseDownEvent=e;
var f=this,d=(e.which===1),g=(typeof this.options.cancel==="string"&&e.target.nodeName?c(e.target).closest(this.options.cancel).length:false);
if(!d||g||!this._mouseCapture(e)){return true
}this.mouseDelayMet=!this.options.delay;
if(!this.mouseDelayMet){this._mouseDelayTimer=setTimeout(function(){f.mouseDelayMet=true
},this.options.delay)
}if(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)){this._mouseStarted=(this._mouseStart(e)!==false);
if(!this._mouseStarted){e.preventDefault();
return true
}}if(true===c.data(e.target,this.widgetName+".preventClickEvent")){c.removeData(e.target,this.widgetName+".preventClickEvent")
}this._mouseMoveDelegate=function(h){return f._mouseMove(h)
};
this._mouseUpDelegate=function(h){return f._mouseUp(h)
};
this.document.bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);
e.preventDefault();
a=true;
return true
},_mouseMove:function(d){if(this._mouseMoved){if(c.ui.ie&&(!document.documentMode||document.documentMode<9)&&!d.button){return this._mouseUp(d)
}else{if(!d.which){return this._mouseUp(d)
}}}if(d.which||d.button){this._mouseMoved=true
}if(this._mouseStarted){this._mouseDrag(d);
return d.preventDefault()
}if(this._mouseDistanceMet(d)&&this._mouseDelayMet(d)){this._mouseStarted=(this._mouseStart(this._mouseDownEvent,d)!==false);
(this._mouseStarted?this._mouseDrag(d):this._mouseUp(d))
}return !this._mouseStarted
},_mouseUp:function(d){this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);
if(this._mouseStarted){this._mouseStarted=false;
if(d.target===this._mouseDownEvent.target){c.data(d.target,this.widgetName+".preventClickEvent",true)
}this._mouseStop(d)
}a=false;
return false
},_mouseDistanceMet:function(d){return(Math.max(Math.abs(this._mouseDownEvent.pageX-d.pageX),Math.abs(this._mouseDownEvent.pageY-d.pageY))>=this.options.distance)
},_mouseDelayMet:function(){return this.mouseDelayMet
},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return true
}})
}));
(function(a){if(typeof define==="function"&&define.amd){define(["jquery","./effect"],a)
}else{a(jQuery)
}}(function(a){return a.effects.effect.highlight=function(c,h){var f=a(this),g=["backgroundImage","backgroundColor","opacity"],d=a.effects.setMode(f,c.mode||"show"),e={backgroundColor:f.css("backgroundColor")};
if(d==="hide"){e.opacity=0
}a.effects.save(f,g);
f.show().css({backgroundImage:"none",backgroundColor:c.color||"#ffff99"}).animate(e,{queue:false,duration:c.duration,easing:c.easing,complete:function(){if(d==="hide"){f.hide()
}a.effects.restore(f,g);
h()
}})
}
}));
(function(e,f){f.ui=f.ui||{};
var a={expanded:false,stylePrefix:"rf-pm-gr",expandEvent:"click",collapseEvent:"click",selectable:false,unselectable:false};
var c={exec:function(h,i){var g=h.mode;
if(g=="server"){return this.execServer(h)
}else{if(g=="ajax"){return this.execAjax(h)
}else{if(g=="client"||g=="none"){return this.execClient(h,i)
}else{f.log.error("EXPAND_ITEM.exec : unknown mode ("+g+")")
}}}},execServer:function(g){g.__changeState();
f.submitForm(this.__getParentForm(g),g.options.ajax.parameters||{});
return false
},execAjax:function(g){var h=g.__changeState();
f.ajax(g.id,null,e.extend({},g.options.ajax,{}));
g.__restoreState(h);
return true
},execClient:function(g,h){if(h){g.__expand()
}else{g.__collapse()
}return g.__fireEvent("switch")
},__getParentForm:function(g){return e(e(f.getDomElement(g.id)).parents("form")[0])
}};
f.ui.PanelMenuGroup=f.ui.PanelMenuItem.extendClass({name:"PanelMenuGroup",init:function(h,i){d.constructor.call(this,h,e.extend({},a,i||{}));
this.options.bubbleSelection=this.__rfPanelMenu().options.bubbleSelection;
this.options.expandSingle=this.__rfPanelMenu().options.expandSingle;
if(!this.options.disabled){var g=this;
if(!this.options.selectable){if(this.options.expandEvent==this.options.collapseEvent){this.__header().bind(this.options.expandEvent,function(){g.switchExpantion()
})
}else{this.__header().bind(this.options.expandEvent,function(){if(g.collapsed()){return g.expand()
}});
this.__header().bind(this.options.collapseEvent,function(){if(g.expanded()){return g.collapse()
}})
}}else{if(this.options.expandEvent==this.options.collapseEvent){if(this.options.expandEvent!="click"){this.__header().bind(this.options.expandEvent,function(){g.switchExpantion()
})
}}else{if(this.options.expandEvent!="click"){this.__header().bind(this.options.expandEvent,function(){if(g.collapsed()){return g.expand()
}})
}if(this.options.collapseEvent!="click"){this.__header().bind(this.options.collapseEvent,function(){if(g.expanded()){return g.collapse()
}})
}}}if(this.options.selectable||this.options.bubbleSelection){this.__content().bind("select",function(j){if(g.options.selectable&&g.__isMyEvent(j)){g.expand()
}if(g.options.bubbleSelection&&!g.__isMyEvent(j)){g.__select();
if(!g.expanded()){g.expand()
}}});
this.__content().bind("unselect",function(j){if(g.options.selectable&&g.__isMyEvent(j)){g.collapse()
}if(g.options.bubbleSelection&&!g.__isMyEvent(j)){g.__unselect()
}})
}}},expanded:function(){return this.__getExpandValue()
},expand:function(){if(this.expanded()){return
}if(!this.__fireEvent("beforeexpand")){return false
}c.exec(this,true)
},__expand:function(){this.__updateStyles(true);
this.__collapseForExpandSingle();
return this.__fireEvent("expand")
},collapsed:function(){return !this.__getExpandValue()
},collapse:function(){if(!this.expanded()){return
}if(!this.__fireEvent("beforecollapse")){return false
}c.exec(this,false)
},__collapse:function(){this.__updateStyles(false);
this.__childGroups().each(function(h,g){f.component(g.id).__collapse()
});
return this.__fireEvent("collapse")
},__updateStyles:function(g){if(g){this.__content().removeClass("rf-pm-colps").addClass("rf-pm-exp");
this.__header().removeClass("rf-pm-hdr-colps").addClass("rf-pm-hdr-exp");
this.__setExpandValue(true)
}else{this.__content().addClass("rf-pm-colps").removeClass("rf-pm-exp");
this.__header().addClass("rf-pm-hdr-colps").removeClass("rf-pm-hdr-exp");
this.__setExpandValue(false)
}},switchExpantion:function(){var g=this.__fireEvent("beforeswitch");
if(!g){return false
}if(this.expanded()){this.collapse()
}else{this.expand()
}},onCompleteHandler:function(){if(this.options.selectable){d.onCompleteHandler.call(this)
}c.execClient(this,this.expanded())
},__switch:function(g){if(g){this.__expand()
}else{this.__collapse()
}return this.__fireEvent("switch")
},__childGroups:function(){return this.__content().children(".rf-pm-gr")
},__group:function(){return e(f.getDomElement(this.id))
},__header:function(){return e(f.getDomElement(this.id+":hdr"))
},__content:function(){return e(f.getDomElement(this.id+":cnt"))
},__expandValueInput:function(){return document.getElementById(this.id+":expanded")
},__getExpandValue:function(){return this.__expandValueInput().value=="true"
},__collapseForExpandSingle:function(){if(this.options.expandSingle){this.__rfPanelMenu().__collapseGroups(this)
}},__setExpandValue:function(g){var i=this.__expandValueInput();
var h=i.value;
i.value=g;
return h
},__changeState:function(){if(!this.__getExpandValue()){this.__collapseForExpandSingle()
}var g={};
g.expanded=this.__setExpandValue(!this.__getExpandValue());
if(this.options.selectable){g.itemName=this.__rfPanelMenu().selectedItem(this.itemName)
}return g
},__restoreState:function(g){if(!g){return
}if(g.expanded){this.__setExpandValue(g.expanded)
}if(g.itemName){this.__rfPanelMenu().selectedItem(g.itemName)
}},__isMyEvent:function(g){return this.id==g.target.id
},destroy:function(){f.Event.unbindById(this.id,"."+this.namespace);
d.destroy.call(this)
}});
var d=f.ui.PanelMenuGroup.$super
})(RichFaces.jQuery,RichFaces);
(function(l,h){h.ui=h.ui||{};
var m={styleClass:"",nonblocking:false,nonblockingOpacity:0.2,showHistory:false,animationSpeed:"slow",opacity:"1",showShadow:false,showCloseButton:true,appearAnimation:"fade",hideAnimation:"fade",sticky:false,stayTime:8000,delay:0};
var i="org.richfaces.notifyStack.default";
var g="click dblclick  keydown keypress keyup mousedown mousemove mouseout mouseover mouseup";
var f={summary:"pnotify_title",detail:"pnotify_text",styleClass:"pnotify_addclass",nonblocking:"pnotify_nonblock",nonblockingOpacity:"pnotify_nonblock_opacity",showHistory:"pnotify_history",animation:"pnotify_animation",appearAnimation:"effect_in",hideAnimation:"effect_out",animationSpeed:"pnotify_animate_speed",opacity:"pnotify_opacity",showShadow:"pnotify_shadow",showCloseButton:"pnotify_closer",sticky:"pnotify_hide",stayTime:"pnotify_delay"};
var d=["rf-ntf-inf","rf-ntf-wrn","rf-ntf-err","rf-ntf-ftl"];
var j=function(p,q,o){for(var n in q){var s=o[n]!=null?o[n]:n;
p[s]=q[n];
if(p[s] instanceof Object){p[s]=l.extend({},p[s],o)
}}return p
};
var a=function(){if(!document.getElementById(i)){var n=l('<span id="'+i+'" class="rf-ntf-stck" />');
l("body").append(n);
new h.ui.NotifyStack(i)
}return c(i)
};
var c=function(n){if(!n){return a()
}return h.component(n).getStack()
};
var e=function(o,p,q){var n=o.slice((q||p)+1||o.length);
o.length=p<0?o.length+p:p;
return o.push.apply(o,n)
};
h.ui.Notify=function(q){var q=l.extend({},m,q);
if(typeof q.severity=="number"){var n=d[q.severity];
q.styleClass=q.styleClass?n+" "+q.styleClass:n
}var p=j({},q,f);
var o=function(){var t=c(q.stackId);
p.pnotify_stack=t;
p.pnotify_addclass+=" rf-ntf-pos-"+t.position;
p.pnotify_after_close=function(v){var u=l.inArray(v,t.notifications);
if(u>=0){e(t.notifications,u)
}};
var s=l.pnotify(p);
s.on(g,function(u){if(q["on"+u.type]){q["on"+u.type].call(this,u)
}});
t.addNotification(s)
};
if(q.sticky!==null){p.pnotify_hide=!q.sticky
}l(document).ready(function(){if(q.delay){setTimeout(function(){o()
},q.delay)
}else{o()
}})
}
})(RichFaces.jQuery,RichFaces);
(function(s,i){i.ui=i.ui||{};
i.ui.AutocompleteBase=function(w,v,y,x){d.constructor.call(this,w);
this.selectId=v;
this.fieldId=y;
this.options=s.extend({},e,x);
this.namespace=this.namespace||"."+i.Event.createNamespace(this.name,this.selectId);
this.currentValue=s(i.getDomElement(y)).val();
this.tempValue=this.getValue();
this.isChanged=this.tempValue.length!=0;
j.call(this)
};
i.BaseComponent.extend(i.ui.AutocompleteBase);
var d=i.ui.AutocompleteBase.$super;
var e={changeDelay:8};
var j=function(){var v={};
if(this.options.buttonId){v["mousedown"+this.namespace]=l;
v["mouseup"+this.namespace]=p;
i.Event.bindById(this.options.buttonId,v,this)
}v={};
v["focus"+this.namespace]=t;
v["blur"+this.namespace]=m;
v["click"+this.namespace]=q;
v["keydown"+this.namespace]=u;
v["change"+this.namespace]=function(w){if(this.focused){w.stopPropagation()
}};
i.Event.bindById(this.fieldId,v,this);
v={};
v["mousedown"+this.namespace]=f;
v["mouseup"+this.namespace]=p;
i.Event.bindById(this.selectId,v,this)
};
var f=function(){this.isMouseDown=true
};
var p=function(){i.getDomElement(this.fieldId).focus()
};
var l=function(v){this.isMouseDown=true;
if(this.timeoutId){window.clearTimeout(this.timeoutId);
this.timeoutId=null
}i.getDomElement(this.fieldId).focus();
if(this.isVisible){this.__hide(v)
}else{h.call(this,v)
}};
var t=function(v){if(!this.focused){this.__focusValue=this.getValue();
this.focused=true;
this.invokeEvent("focus",i.getDomElement(this.fieldId),v)
}};
var m=function(w){if(this.isMouseDown){i.getDomElement(this.fieldId).focus();
this.isMouseDown=false
}else{if(!this.isMouseDown){if(this.isVisible){var v=this;
this.timeoutId=window.setTimeout(function(){if(v.isVisible){v.__hide(w)
}},200)
}if(this.focused){this.focused=false;
this.invokeEvent("blur",i.getDomElement(this.fieldId),w);
if(this.__focusValue!=this.getValue()){this.invokeEvent("change",i.getDomElement(this.fieldId),w)
}}}}};
var q=function(v){};
var g=function(w){if(this.isChanged){if(this.getValue()==this.tempValue){return
}}this.isChanged=false;
var v=this.getValue();
var x=v!=this.currentValue;
if(w.keyCode==i.KEYS.LEFT||w.keyCode==i.KEYS.RIGHT||x){if(x){this.currentValue=this.getValue();
this.__onChangeValue(w,undefined,(!this.isVisible?this.__show:undefined))
}else{if(this.isVisible){this.__onChangeValue(w)
}}}};
var h=function(v){if(this.isChanged){this.isChanged=false;
g.call(this,{})
}else{!this.__updateState(v)&&this.__show(v)
}};
var u=function(w){switch(w.keyCode){case i.KEYS.UP:w.preventDefault();
if(this.isVisible){this.__onKeyUp(w)
}break;
case i.KEYS.DOWN:w.preventDefault();
if(this.isVisible){this.__onKeyDown(w)
}else{h.call(this,w)
}break;
case i.KEYS.PAGEUP:if(this.isVisible){w.preventDefault();
this.__onPageUp(w)
}break;
case i.KEYS.PAGEDOWN:if(this.isVisible){w.preventDefault();
this.__onPageDown(w)
}break;
case i.KEYS.HOME:if(this.isVisible){w.preventDefault();
this.__onKeyHome(w)
}break;
case i.KEYS.END:if(this.isVisible){w.preventDefault();
this.__onKeyEnd(w)
}break;
case i.KEYS.RETURN:if(this.isVisible){w.preventDefault();
this.__onEnter(w);
this.__hide(w);
return false
}break;
case i.KEYS.ESC:this.__hide(w);
break;
default:if(!this.options.selectOnly){var v=this;
window.clearTimeout(this.changeTimerId);
this.changeTimerId=window.setTimeout(function(){g.call(v,w)
},this.options.changeDelay)
}break
}};
var c=function(v){if(!this.isVisible){if(this.__onBeforeShow(v)!=false){this.scrollElements=i.Event.bindScrollEventHandlers(this.selectId,this.__hide,this,this.namespace);
var w=i.getDomElement(this.selectId);
if(this.options.attachToBody){this.parentElement=w.parentNode;
document.body.appendChild(w)
}s(w).setPosition({id:this.fieldId},{type:"DROPDOWN"}).show();
this.isVisible=true;
this.__onShow(v)
}}};
var n=function(v){if(this.isVisible){this.__conceal();
this.isVisible=false;
this.__onHide(v)
}};
var a=function(){if(this.isVisible){if(this.scrollElements){i.Event.unbindScrollEventHandlers(this.scrollElements,this);
this.scrollElements=null
}s(i.getDomElement(this.selectId)).hide();
if(this.options.attachToBody&&this.parentElement){this.parentElement.appendChild(i.getDomElement(this.selectId));
this.parentElement=null
}}};
var o=function(v){if(this.fieldId){i.getDomElement(this.fieldId).value=v;
return v
}else{return""
}};
s.extend(i.ui.AutocompleteBase.prototype,(function(){return{name:"AutocompleteBase",showPopup:function(v){if(!this.focused){i.getDomElement(this.fieldId).focus()
}h.call(this,v)
},hidePopup:function(v){this.__hide(v)
},getNamespace:function(){return this.namespace
},getValue:function(){return this.fieldId?i.getDomElement(this.fieldId).value:""
},setValue:function(v){if(v==this.currentValue){return
}o.call(this,v);
this.isChanged=true
},__updateInputValue:o,__show:c,__hide:n,__conceal:a,__onChangeValue:function(v){},__onKeyUp:function(v){},__onKeyDown:function(v){},__onPageUp:function(v){},__onPageDown:function(v){},__onKeyHome:function(v){},__onKeyEnd:function(v){},__onBeforeShow:function(v){},__onShow:function(v){},__onHide:function(v){},destroy:function(){this.parentNode=null;
if(this.scrollElements){i.Event.unbindScrollEventHandlers(this.scrollElements,this);
this.scrollElements=null
}this.options.buttonId&&i.Event.unbindById(this.options.buttonId,this.namespace);
i.Event.unbindById(this.fieldId,this.namespace);
i.Event.unbindById(this.selectId,this.namespace);
d.destroy.call(this)
}}
})())
})(RichFaces.jQuery,RichFaces);
(function(d,f,a){f.push={options:{transport:"websocket",fallbackTransport:"long-polling",logLevel:"info"},_subscribedTopics:{},_addedTopics:{},_removedTopics:{},_handlersCounter:{},_pushSessionId:null,_lastMessageNumber:-1,_pushResourceUrl:null,_pushHandlerUrl:null,updateConnection:function(){if(d.isEmptyObject(this._handlersCounter)){this._disconnect()
}else{if(!d.isEmptyObject(this._addedTopics)||!d.isEmptyObject(this._removedTopics)){this._disconnect();
this._connect()
}}this._addedTopics={};
this._removedTopics={}
},increaseSubscriptionCounters:function(g){if(isNaN(this._handlersCounter[g]++)){this._handlersCounter[g]=1;
this._addedTopics[g]=true
}},decreaseSubscriptionCounters:function(g){if(--this._handlersCounter[g]==0){delete this._handlersCounter[g];
this._removedTopics[g]=true;
this._subscribedTopics[g]=false
}},setPushResourceUrl:function(g){this._pushResourceUrl=e(g)
},setPushHandlerUrl:function(g){this._pushHandlerUrl=e(g)
},_messageCallback:function(n){if(n.state&&n.state==="opening"){this._lastMessageNumber=-1;
return
}var m=/^(<!--[^>]+-->\s*)+/;
var h=/<msg topic="([^"]+)" number="([^"]+)">([^<]*)<\/msg>/g;
var l=n.responseBody.replace(m,"");
if(l){var g;
while(g=h.exec(l)){if(!g[1]){continue
}var i={topic:g[1],number:parseInt(g[2]),data:d.parseJSON(g[3])};
if(i.number<=this._lastMessageNumber){continue
}var j=new jQuery.Event("push.push.RICH."+i.topic,{rf:{data:i.data}});
(function(o){d(function(){d(document).trigger(o)
})
})(j);
this._lastMessageNumber=i.number
}}},_errorCallback:function(g){for(var h in this.newlySubcribed){this._subscribedTopics[h]=true;
d(document).trigger("error.push.RICH."+h,g)
}},_connect:function(){this.newlySubcribed={};
var g=[];
for(var i in this._handlersCounter){g.push(i);
if(!this._subscribedTopics[i]){this.newlySubcribed[i]=true
}}var h={pushTopic:g};
if(this._pushSessionId){h.forgetPushSessionId=this._pushSessionId
}d.ajax({data:h,dataType:"text",traditional:true,type:"POST",url:this._pushResourceUrl,success:d.proxy(function(l){var o=d.parseJSON(l);
for(var n in o.failures){d(document).trigger("error.push.RICH."+n)
}if(o.sessionId){this._pushSessionId=o.sessionId;
var p=this._pushHandlerUrl||this._pushResourceUrl;
p+="?__richfacesPushAsync=1&pushSessionId=";
p+=this._pushSessionId;
var j=d.proxy(this._messageCallback,this);
var m=d.proxy(this._errorCallback,this);
d.atmosphere.subscribe(p,j,{transport:this.options.transport,fallbackTransport:this.options.fallbackTransport,logLevel:this.options.logLevel,onError:m});
for(var n in this.newlySubcribed){this._subscribedTopics[n]=true;
d(document).trigger("subscribed.push.RICH."+n)
}}},this)})
},_disconnect:function(){d.atmosphere.unsubscribe()
}};
d.fn.richpush=function(h){var g=d.extend({},d.fn.richpush);
return this.each(function(){g.element=this;
g.options=d.extend({},g.options,h);
g.eventNamespace=".push.RICH."+g.element.id;
g._create();
d(document).on("beforeDomClean"+g.eventNamespace,function(i){if(i.target&&(i.target===g.element||d.contains(i.target,g.element))){g._destroy()
}})
})
};
d.extend(d.fn.richpush,{options:{address:null,subscribed:null,push:null,error:null},_create:function(){var g=this;
this.address=this.options.address;
this.handlers={subscribed:null,push:null,error:null};
d.each(this.handlers,function(i){if(g.options[i]){var h=function(l,j){if(j){d.extend(l,{rf:{data:j}})
}g.options[i].call(g.element,l)
};
g.handlers[i]=h;
d(document).on(i+g.eventNamespace+"."+g.address,h)
}});
f.push.increaseSubscriptionCounters(this.address)
},_destroy:function(){f.push.decreaseSubscriptionCounters(this.address);
d(document).off(this.eventNamespace)
}});
d(document).ready(function(){f.push.updateConnection()
});
a.ajax.addOnEvent(c);
a.ajax.addOnError(c);
function c(g){if(g.type=="event"){if(g.status!="success"){return
}}else{if(g.type!="error"){return
}}f.push.updateConnection()
}function e(g){var h=g;
if(g.charAt(0)=="/"){h=location.protocol+"//"+location.host+g
}return h
}}(RichFaces.jQuery,RichFaces,jsf));
(function(d,e){e.ui=e.ui||{};
e.ui.Tab=e.ui.TogglePanelItem.extendClass({name:"Tab",init:function(f,g){c.constructor.call(this,f,g);
this.attachToDom();
this.index=g.index;
this.getTogglePanel().getItems()[this.index]=this
},__header:function(g){var f=d(e.getDomElement(this.id+":header"));
for(var h in a){if(h!==g){f.removeClass(a[h])
}if(!f.hasClass(a[g])){f.addClass(a[g])
}}return f
},__content:function(){if(!this.__content_){this.__content_=d(e.getDomElement(this.id))
}return this.__content_
},__enter:function(){this.__content().show();
this.__header("active");
return this.__fireEnter()
},__fireLeave:function(){return e.Event.fireById(this.id+":content","leave")
},__fireEnter:function(){return e.Event.fireById(this.id+":content","enter")
},__addUserEventHandler:function(g){var f=this.options["on"+g];
if(f){var h=e.Event.bindById(this.id+":content",g,f)
}},getHeight:function(f){if(f||!this.__height){this.__height=d(e.getDomElement(this.id)).outerHeight(true)
}return this.__height
},__leave:function(){var f=this.__fireLeave();
if(!f){return false
}this.__content().hide();
this.__header("inactive");
return true
},destroy:function(){var f=this.getTogglePanel();
if(f&&f.getItems&&f.getItems()[this.index]){delete f.getItems()[this.index]
}e.Event.unbindById(this.id);
c.destroy.call(this)
}});
var c=e.ui.Tab.$super;
var a={active:"rf-tab-hdr-act",inactive:"rf-tab-hdr-inact",disabled:"rf-tab-hdr-dis"}
})(RichFaces.jQuery,RichFaces);
(function(d,a){a.ui=a.ui||{};
a.ui.PopupPanel.Sizer=function(e,g,f,h){c.constructor.call(this,e)
};
var c=a.BaseComponent.extend(a.ui.PopupPanel.Sizer);
var c=a.ui.PopupPanel.Sizer.$super;
d.extend(a.ui.PopupPanel.Sizer.prototype,(function(e){return{name:"richfaces.ui.PopupPanel.Sizer",doSetupSize:function(f,j){var h=0;
var l=0;
var i=d(a.getDomElement(j));
var g=f.reductionData;
if(g){if(g.w){h=g.w/2
}if(g.h){l=g.h/2
}}if(h>0){if(j.clientWidth>h){if(!j.reducedWidth){j.reducedWidth=i.css("width")
}i.css("width",h+"px")
}else{if(h<4&&j.reducedWidth==4+"px"){i.css("width",h+"px")
}}}else{if(j.reducedWidth){i.css("width",j.reducedWidth);
j.reducedWidth=undefined
}}if(l>0){if(j.clientHeight>l){if(!j.reducedHeight){j.reducedHeight=i.css("height")
}j.style.height=l+"px"
}else{if(l<4&&j.reducedHeight==4+"px"){i.css("height",l+"px")
}}}else{if(j.reducedHeight){i.css("height",j.reducedHeight);
j.reducedHeight=undefined
}}},doSetupPosition:function(f,j,g,h){var i=d(a.getDomElement(j));
if(!isNaN(g)&&!isNaN(h)){i.css("left",g+"px");
i.css("top",h+"px")
}},doPosition:function(f,g){},doDiff:function(f,g){}}
})());
a.ui.PopupPanel.Sizer.Diff=function(f,h,g,e){this.deltaX=f;
this.deltaY=h;
this.deltaWidth=g;
this.deltaHeight=e
};
a.ui.PopupPanel.Sizer.Diff.EMPTY=new a.ui.PopupPanel.Sizer.Diff(0,0,0,0),a.ui.PopupPanel.Sizer.N=function(){};
d.extend(a.ui.PopupPanel.Sizer.N.prototype,a.ui.PopupPanel.Sizer.prototype);
d.extend(a.ui.PopupPanel.Sizer.N.prototype,{name:"richfaces.ui.PopupPanel.Sizer.N",doPosition:function(e,g){var f=d(a.getDomElement(g));
f.css("width",e.width()+"px");
this.doSetupPosition(e,g,0,0)
},doDiff:function(e,f){return new a.ui.PopupPanel.Sizer.Diff(0,f,0,-f)
}});
a.ui.PopupPanel.Sizer.NW=function(){};
d.extend(a.ui.PopupPanel.Sizer.NW.prototype,a.ui.PopupPanel.Sizer.prototype);
d.extend(a.ui.PopupPanel.Sizer.NW.prototype,{name:"richfaces.ui.PopupPanel.Sizer.NW",doPosition:function(e,f){this.doSetupSize(e,f);
this.doSetupPosition(e,f,0,0)
},doDiff:function(e,f){return new a.ui.PopupPanel.Sizer.Diff(e,f,-e,-f)
}});
a.ui.PopupPanel.Sizer.NE=function(){};
d.extend(a.ui.PopupPanel.Sizer.NE.prototype,a.ui.PopupPanel.Sizer.prototype);
d.extend(a.ui.PopupPanel.Sizer.NE.prototype,{name:"richfaces.ui.PopupPanel.Sizer.NE",doPosition:function(e,f){this.doSetupSize(e,f);
this.doSetupPosition(e,f,e.width()-f.clientWidth,0)
},doDiff:function(e,f){return new a.ui.PopupPanel.Sizer.Diff(0,f,e,-f)
}});
a.ui.PopupPanel.Sizer.E=function(){};
d.extend(a.ui.PopupPanel.Sizer.E.prototype,a.ui.PopupPanel.Sizer.prototype);
d.extend(a.ui.PopupPanel.Sizer.E.prototype,{name:"richfaces.ui.PopupPanel.Sizer.E",doPosition:function(e,g){var f=d(a.getDomElement(g));
f.css("height",e.height()+"px");
this.doSetupPosition(e,g,e.width()-g.clientWidth,0)
},doDiff:function(e,f){return new a.ui.PopupPanel.Sizer.Diff(0,0,e,0)
}});
a.ui.PopupPanel.Sizer.SE=function(){};
d.extend(a.ui.PopupPanel.Sizer.SE.prototype,a.ui.PopupPanel.Sizer.prototype);
d.extend(a.ui.PopupPanel.Sizer.SE.prototype,{name:"richfaces.ui.PopupPanel.Sizer.SE",doPosition:function(e,f){this.doSetupSize(e,f);
this.doSetupPosition(e,f,e.width()-f.clientWidth,e.height()-f.clientHeight)
},doDiff:function(e,f){return new a.ui.PopupPanel.Sizer.Diff(0,0,e,f)
}});
a.ui.PopupPanel.Sizer.S=function(){};
d.extend(a.ui.PopupPanel.Sizer.S.prototype,a.ui.PopupPanel.Sizer.prototype);
d.extend(a.ui.PopupPanel.Sizer.S.prototype,{name:"richfaces.ui.PopupPanel.Sizer.S",doPosition:function(e,g){var f=d(a.getDomElement(g));
f.css("width",e.width()+"px");
this.doSetupPosition(e,g,0,e.height()-g.clientHeight)
},doDiff:function(e,f){return new a.ui.PopupPanel.Sizer.Diff(0,0,0,f)
}});
a.ui.PopupPanel.Sizer.SW=function(){};
d.extend(a.ui.PopupPanel.Sizer.SW.prototype,a.ui.PopupPanel.Sizer.prototype);
d.extend(a.ui.PopupPanel.Sizer.SW.prototype,{name:"richfaces.ui.PopupPanel.Sizer.SW",doPosition:function(e,f){this.doSetupSize(e,f);
this.doSetupPosition(e,f,0,e.height()-f.clientHeight)
},doDiff:function(e,f){return new a.ui.PopupPanel.Sizer.Diff(e,0,-e,f)
}});
a.ui.PopupPanel.Sizer.W=function(){};
d.extend(a.ui.PopupPanel.Sizer.W.prototype,a.ui.PopupPanel.Sizer.prototype);
d.extend(a.ui.PopupPanel.Sizer.W.prototype,{name:"richfaces.ui.PopupPanel.Sizer.W",doPosition:function(e,g){var f=d(a.getDomElement(g));
f.css("height",e.height()+"px");
this.doSetupPosition(e,g,0,0)
},doDiff:function(e,f){return new a.ui.PopupPanel.Sizer.Diff(e,0,-e,0)
}});
a.ui.PopupPanel.Sizer.Header=function(){};
d.extend(a.ui.PopupPanel.Sizer.Header.prototype,a.ui.PopupPanel.Sizer.prototype);
d.extend(a.ui.PopupPanel.Sizer.Header.prototype,{name:"richfaces.ui.PopupPanel.Sizer.Header",doPosition:function(e,f){},doDiff:function(e,f){return new a.ui.PopupPanel.Sizer.Diff(e,f,0,0)
}})
})(RichFaces.jQuery,window.RichFaces);
(function(d,a){a.ui=a.ui||{};
a.ui.AccordionItem=a.ui.TogglePanelItem.extendClass({name:"AccordionItem",init:function(f,g){c.constructor.call(this,f,g);
if(!this.disabled){a.Event.bindById(this.id+":header","click",this.__onHeaderClick,this)
}if(this.isSelected()){var e=this;
d(document).one("javascriptServiceComplete",function(){e.__fitToHeight(e.getTogglePanel())
})
}},__onHeaderClick:function(e){this.getTogglePanel().switchToItem(this.getName())
},__header:function(){return d(a.getDomElement(this.id+":header"))
},__content:function(){if(!this.__content_){this.__content_=d(a.getDomElement(this.id+":content"))
}return this.__content_
},__enter:function(){var e=this.getTogglePanel();
if(e.isKeepHeight){this.__content().hide();
this.__fitToHeight(e)
}this.__content().show();
this.__header().addClass("rf-ac-itm-hdr-act").removeClass("rf-ac-itm-hdr-inact");
return this.__fireEnter()
},__fitToHeight:function(h){var e=h.getInnerHeight();
var g=h.getItems();
for(var f in g){e-=g[f].__header().outerHeight()
}this.__content().height(e-20)
},getHeight:function(e){if(e||!this.__height){this.__height=d(a.getDomElement(this.id)).outerHeight(true)
}return this.__height
},__leave:function(){var e=this.__fireLeave();
if(!e){return false
}this.__content().hide();
this.__header().removeClass("rf-ac-itm-hdr-act").addClass("rf-ac-itm-hdr-inact");
return true
}});
var c=a.ui.AccordionItem.$super
})(RichFaces.jQuery,RichFaces);
(function(c,a){a.ui=a.ui||{};
a.ui.CollapsiblePanel=a.ui.TogglePanel.extendClass({name:"CollapsiblePanel",init:function(d,e){a.ui.TogglePanel.call(this,d,e);
this.switchMode=e.switchMode;
this.__addUserEventHandler("beforeswitch");
this.__addUserEventHandler("switch");
this.options.cycledSwitching=true;
var f=this;
c(document.getElementById(this.id)).ready(function(){a.Event.bindById(f.id+":header","click",f.__onHeaderClick,f);
new RichFaces.ui.CollapsiblePanelItem(f.id+":content",{index:0,togglePanelId:f.id,switchMode:f.switchMode,name:"true"}),new RichFaces.ui.CollapsiblePanelItem(f.id+":empty",{index:1,togglePanelId:f.id,switchMode:f.switchMode,name:"false"})
})
},switchPanel:function(d){this.switchToItem(d||"@next")
},__onHeaderClick:function(){this.switchToItem("@next")
},__fireItemChange:function(d,e){return new a.Event.fireById(this.id,"switch",{id:this.id,isExpanded:e.getName()})
},__fireBeforeItemChange:function(d,e){return a.Event.fireById(this.id,"beforeswitch",{id:this.id,isExpanded:e.getName()})
}})
})(RichFaces.jQuery,RichFaces);
(function(d,e){e.ui=e.ui||{};
var a={toolbar:"Basic",skin:"moono",readonly:false,style:"",styleClass:"",editorStyle:"",editorClass:"",width:"100%",height:"200px"};
var f=["key","paste","undo","redo"];
e.ui.Editor=function(g,h,i){c.constructor.call(this,g);
this.options=d.extend({},a,h);
this.componentId=g;
this.textareaId=g+":inp";
this.editorElementId="cke_"+this.textareaId;
this.valueChanged=false;
this.dirtyState=false;
this.config=d.extend({},i);
this.attachToDom(this.componentId);
d(document).ready(d.proxy(this.__initializationHandler,this));
e.Event.bindById(this.__getTextarea(),"init",this.options.oninit,this);
e.Event.bindById(this.__getTextarea(),"dirty",this.options.ondirty,this)
};
e.BaseComponent.extend(e.ui.Editor);
var c=e.ui.Editor.$super;
d.extend(e.ui.Editor.prototype,{name:"Editor",__initializationHandler:function(){this.ckeditor=CKEDITOR.replace(this.textareaId,this.__getConfiguration());
if(this.__getForm()){this.__updateTextareaHandlerWrapper=e.Event.bind(this.__getForm(),"ajaxsubmit",d.proxy(this.__updateTextareaHandler,this))
}this.ckeditor.on("instanceReady",d.proxy(this.__instanceReadyHandler,this));
this.ckeditor.on("blur",d.proxy(this.__blurHandler,this));
this.ckeditor.on("focus",d.proxy(this.__focusHandler,this));
for(var g in f){this.ckeditor.on(f[g],d.proxy(this.__checkDirtyHandlerWithDelay,this))
}this.dirtyCheckingInterval=window.setInterval(d.proxy(this.__checkDirtyHandler,this),100)
},__checkDirtyHandlerWithDelay:function(){window.setTimeout(d.proxy(this.__checkDirtyHandler,this),0)
},__checkDirtyHandler:function(){if(this.ckeditor.checkDirty()){this.dirtyState=true;
this.valueChanged=true;
this.ckeditor.resetDirty();
this.__dirtyHandler()
}},__dirtyHandler:function(){this.invokeEvent.call(this,"dirty",document.getElementById(this.textareaId))
},__updateTextareaHandler:function(){this.ckeditor.updateElement()
},__instanceReadyHandler:function(g){this.__setupStyling();
this.__setupPassThroughAttributes();
this.invokeEvent.call(this,"init",document.getElementById(this.textareaId),g)
},__blurHandler:function(g){this.invokeEvent.call(this,"blur",document.getElementById(this.textareaId),g);
if(this.isDirty()){this.valueChanged=true;
this.__changeHandler()
}this.dirtyState=false
},__focusHandler:function(g){this.invokeEvent.call(this,"focus",document.getElementById(this.textareaId),g)
},__changeHandler:function(g){this.invokeEvent.call(this,"change",document.getElementById(this.textareaId),g)
},__getTextarea:function(){return d(document.getElementById(this.textareaId))
},__getForm:function(){return d("form").has(this.__getTextarea()).get(0)
},__getConfiguration:function(){var g=this.__getTextarea();
return d.extend({skin:this.options.skin,toolbar:this.__getToolbar(),readOnly:g.attr("readonly")||this.options.readonly,width:this.__resolveUnits(this.options.width),height:this.__resolveUnits(this.options.height),bodyClass:"rf-ed-b",defaultLanguage:this.options.lang,contentsLanguage:this.options.lang},this.config)
},__setupStyling:function(){var g=d(document.getElementById(this.editorElementId));
if(!g.hasClass("rf-ed")){g.addClass("rf-ed")
}var i=d.trim(this.options.styleClass+" "+this.options.editorClass);
if(this.initialStyle==undefined){this.initialStyle=g.attr("style")
}var h=this.__concatStyles(this.initialStyle,this.options.style,this.options.editorStyle);
if(this.oldStyleClass!==i){if(this.oldStyleClass){g.removeClass(this.oldStyleClass)
}g.addClass(i);
this.oldStyleClass=i
}if(this.oldStyle!==h){g.attr("style",h);
this.oldStyle=h
}},__setupPassThroughAttributes:function(){var h=this.__getTextarea();
var g=d(document.getElementById(this.editorElementId));
g.attr("title",h.attr("title"))
},__concatStyles:function(){var i="";
for(var h=0;
h<arguments.length;
h++){var g=d.trim(arguments[h]);
if(g){i=i+g+"; "
}}return i
},__getToolbar:function(){var g=this.options.toolbar;
var h=g.toLowerCase();
if(h==="basic"){return"Basic"
}if(h==="full"){return"Full"
}return g
},__setOptions:function(g){this.options=d.extend({},a,g)
},__resolveUnits:function(g){var g=d.trim(g);
if(g.match(/^[0-9]+$/)){return g+"px"
}else{return g
}},getEditor:function(){return this.ckeditor
},setValue:function(g){this.ckeditor.setData(g,d.proxy(function(){this.valueChanged=false;
this.dirtyState=false;
this.ckeditor.resetDirty()
},this))
},getValue:function(){return this.ckeditor.getData()
},getInput:function(){return document.getElementById(this.textareaId)
},focus:function(){this.ckeditor.focus()
},blur:function(){this.ckeditor.focusManager.blur(true)
},isFocused:function(){return this.ckeditor.focusManager.hasFocus
},isDirty:function(){return this.dirtyState||this.ckeditor.checkDirty()
},isValueChanged:function(){return this.valueChanged||this.isDirty()
},setReadOnly:function(g){this.ckeditor.setReadOnly(g!==false)
},isReadOnly:function(){return this.ckeditor.readOnly
},destroy:function(){window.clearInterval(this.dirtyCheckingInterval);
if(this.__getForm()){e.Event.unbind(this.__getForm(),"ajaxsubmit",this.__updateTextareaHandlerWrapper)
}if(this.ckeditor){this.ckeditor.destroy();
this.ckeditor=null
}this.__getTextarea().show();
c.destroy.call(this)
}})
})(RichFaces.jQuery,RichFaces);
(function(a){if(typeof define==="function"&&define.amd){define(["jquery","./core","./mouse","./widget"],a)
}else{a(jQuery)
}}(function(a){a.widget("ui.draggable",a.ui.mouse,{version:"1.11.2",widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false,drag:null,start:null,stop:null},_create:function(){if(this.options.helper==="original"){this._setPositionRelative()
}if(this.options.addClasses){this.element.addClass("ui-draggable")
}if(this.options.disabled){this.element.addClass("ui-draggable-disabled")
}this._setHandleClassName();
this._mouseInit()
},_setOption:function(d,c){this._super(d,c);
if(d==="handle"){this._removeHandleClassName();
this._setHandleClassName()
}},_destroy:function(){if((this.helper||this.element).is(".ui-draggable-dragging")){this.destroyOnClear=true;
return
}this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
this._removeHandleClassName();
this._mouseDestroy()
},_mouseCapture:function(d){var c=this.options;
this._blurActiveElement(d);
if(this.helper||c.disabled||a(d.target).closest(".ui-resizable-handle").length>0){return false
}this.handle=this._getHandle(d);
if(!this.handle){return false
}this._blockFrames(c.iframeFix===true?"iframe":c.iframeFix);
return true
},_blockFrames:function(c){this.iframeBlocks=this.document.find(c).map(function(){var d=a(this);
return a("<div>").css("position","absolute").appendTo(d.parent()).outerWidth(d.outerWidth()).outerHeight(d.outerHeight()).offset(d.offset())[0]
})
},_unblockFrames:function(){if(this.iframeBlocks){this.iframeBlocks.remove();
delete this.iframeBlocks
}},_blurActiveElement:function(c){var e=this.document[0];
if(!this.handleElement.is(c.target)){return
}try{if(e.activeElement&&e.activeElement.nodeName.toLowerCase()!=="body"){a(e.activeElement).blur()
}}catch(d){}},_mouseStart:function(d){var c=this.options;
this.helper=this._createHelper(d);
this.helper.addClass("ui-draggable-dragging");
this._cacheHelperProportions();
if(a.ui.ddmanager){a.ui.ddmanager.current=this
}this._cacheMargins();
this.cssPosition=this.helper.css("position");
this.scrollParent=this.helper.scrollParent(true);
this.offsetParent=this.helper.offsetParent();
this.hasFixedAncestor=this.helper.parents().filter(function(){return a(this).css("position")==="fixed"
}).length>0;
this.positionAbs=this.element.offset();
this._refreshOffsets(d);
this.originalPosition=this.position=this._generatePosition(d,false);
this.originalPageX=d.pageX;
this.originalPageY=d.pageY;
(c.cursorAt&&this._adjustOffsetFromHelper(c.cursorAt));
this._setContainment();
if(this._trigger("start",d)===false){this._clear();
return false
}this._cacheHelperProportions();
if(a.ui.ddmanager&&!c.dropBehaviour){a.ui.ddmanager.prepareOffsets(this,d)
}this._normalizeRightBottom();
this._mouseDrag(d,true);
if(a.ui.ddmanager){a.ui.ddmanager.dragStart(this,d)
}return true
},_refreshOffsets:function(c){this.offset={top:this.positionAbs.top-this.margins.top,left:this.positionAbs.left-this.margins.left,scroll:false,parent:this._getParentOffset(),relative:this._getRelativeOffset()};
this.offset.click={left:c.pageX-this.offset.left,top:c.pageY-this.offset.top}
},_mouseDrag:function(e,c){if(this.hasFixedAncestor){this.offset.parent=this._getParentOffset()
}this.position=this._generatePosition(e,true);
this.positionAbs=this._convertPositionTo("absolute");
if(!c){var d=this._uiHash();
if(this._trigger("drag",e,d)===false){this._mouseUp({});
return false
}this.position=d.position
}this.helper[0].style.left=this.position.left+"px";
this.helper[0].style.top=this.position.top+"px";
if(a.ui.ddmanager){a.ui.ddmanager.drag(this,e)
}return false
},_mouseStop:function(d){var e=this,c=false;
if(a.ui.ddmanager&&!this.options.dropBehaviour){c=a.ui.ddmanager.drop(this,d)
}if(this.dropped){c=this.dropped;
this.dropped=false
}if((this.options.revert==="invalid"&&!c)||(this.options.revert==="valid"&&c)||this.options.revert===true||(a.isFunction(this.options.revert)&&this.options.revert.call(this.element,c))){a(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){if(e._trigger("stop",d)!==false){e._clear()
}})
}else{if(this._trigger("stop",d)!==false){this._clear()
}}return false
},_mouseUp:function(c){this._unblockFrames();
if(a.ui.ddmanager){a.ui.ddmanager.dragStop(this,c)
}if(this.handleElement.is(c.target)){this.element.focus()
}return a.ui.mouse.prototype._mouseUp.call(this,c)
},cancel:function(){if(this.helper.is(".ui-draggable-dragging")){this._mouseUp({})
}else{this._clear()
}return this
},_getHandle:function(c){return this.options.handle?!!a(c.target).closest(this.element.find(this.options.handle)).length:true
},_setHandleClassName:function(){this.handleElement=this.options.handle?this.element.find(this.options.handle):this.element;
this.handleElement.addClass("ui-draggable-handle")
},_removeHandleClassName:function(){this.handleElement.removeClass("ui-draggable-handle")
},_createHelper:function(e){var c=this.options,d=a.isFunction(c.helper),f=d?a(c.helper.apply(this.element[0],[e])):(c.helper==="clone"?this.element.clone().removeAttr("id"):this.element);
if(!f.parents("body").length){f.appendTo((c.appendTo==="parent"?this.element[0].parentNode:c.appendTo))
}if(d&&f[0]===this.element[0]){this._setPositionRelative()
}if(f[0]!==this.element[0]&&!(/(fixed|absolute)/).test(f.css("position"))){f.css("position","absolute")
}return f
},_setPositionRelative:function(){if(!(/^(?:r|a|f)/).test(this.element.css("position"))){this.element[0].style.position="relative"
}},_adjustOffsetFromHelper:function(c){if(typeof c==="string"){c=c.split(" ")
}if(a.isArray(c)){c={left:+c[0],top:+c[1]||0}
}if("left" in c){this.offset.click.left=c.left+this.margins.left
}if("right" in c){this.offset.click.left=this.helperProportions.width-c.right+this.margins.left
}if("top" in c){this.offset.click.top=c.top+this.margins.top
}if("bottom" in c){this.offset.click.top=this.helperProportions.height-c.bottom+this.margins.top
}},_isRootNode:function(c){return(/(html|body)/i).test(c.tagName)||c===this.document[0]
},_getParentOffset:function(){var c=this.offsetParent.offset(),d=this.document[0];
if(this.cssPosition==="absolute"&&this.scrollParent[0]!==d&&a.contains(this.scrollParent[0],this.offsetParent[0])){c.left+=this.scrollParent.scrollLeft();
c.top+=this.scrollParent.scrollTop()
}if(this._isRootNode(this.offsetParent[0])){c={top:0,left:0}
}return{top:c.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:c.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}
},_getRelativeOffset:function(){if(this.cssPosition!=="relative"){return{top:0,left:0}
}var d=this.element.position(),c=this._isRootNode(this.scrollParent[0]);
return{top:d.top-(parseInt(this.helper.css("top"),10)||0)+(!c?this.scrollParent.scrollTop():0),left:d.left-(parseInt(this.helper.css("left"),10)||0)+(!c?this.scrollParent.scrollLeft():0)}
},_cacheMargins:function(){this.margins={left:(parseInt(this.element.css("marginLeft"),10)||0),top:(parseInt(this.element.css("marginTop"),10)||0),right:(parseInt(this.element.css("marginRight"),10)||0),bottom:(parseInt(this.element.css("marginBottom"),10)||0)}
},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}
},_setContainment:function(){var f,c,e,d=this.options,g=this.document[0];
this.relativeContainer=null;
if(!d.containment){this.containment=null;
return
}if(d.containment==="window"){this.containment=[a(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,a(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,a(window).scrollLeft()+a(window).width()-this.helperProportions.width-this.margins.left,a(window).scrollTop()+(a(window).height()||g.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];
return
}if(d.containment==="document"){this.containment=[0,0,a(g).width()-this.helperProportions.width-this.margins.left,(a(g).height()||g.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];
return
}if(d.containment.constructor===Array){this.containment=d.containment;
return
}if(d.containment==="parent"){d.containment=this.helper[0].parentNode
}c=a(d.containment);
e=c[0];
if(!e){return
}f=/(scroll|auto)/.test(c.css("overflow"));
this.containment=[(parseInt(c.css("borderLeftWidth"),10)||0)+(parseInt(c.css("paddingLeft"),10)||0),(parseInt(c.css("borderTopWidth"),10)||0)+(parseInt(c.css("paddingTop"),10)||0),(f?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(c.css("borderRightWidth"),10)||0)-(parseInt(c.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(f?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(c.css("borderBottomWidth"),10)||0)-(parseInt(c.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom];
this.relativeContainer=c
},_convertPositionTo:function(e,c){if(!c){c=this.position
}var f=e==="absolute"?1:-1,d=this._isRootNode(this.scrollParent[0]);
return{top:(c.top+this.offset.relative.top*f+this.offset.parent.top*f-((this.cssPosition==="fixed"?-this.offset.scroll.top:(d?0:this.offset.scroll.top))*f)),left:(c.left+this.offset.relative.left*f+this.offset.parent.left*f-((this.cssPosition==="fixed"?-this.offset.scroll.left:(d?0:this.offset.scroll.left))*f))}
},_generatePosition:function(d,h){var e,g,f,m,c=this.options,i=this._isRootNode(this.scrollParent[0]),j=d.pageX,l=d.pageY;
if(!i||!this.offset.scroll){this.offset.scroll={top:this.scrollParent.scrollTop(),left:this.scrollParent.scrollLeft()}
}if(h){if(this.containment){if(this.relativeContainer){g=this.relativeContainer.offset();
e=[this.containment[0]+g.left,this.containment[1]+g.top,this.containment[2]+g.left,this.containment[3]+g.top]
}else{e=this.containment
}if(d.pageX-this.offset.click.left<e[0]){j=e[0]+this.offset.click.left
}if(d.pageY-this.offset.click.top<e[1]){l=e[1]+this.offset.click.top
}if(d.pageX-this.offset.click.left>e[2]){j=e[2]+this.offset.click.left
}if(d.pageY-this.offset.click.top>e[3]){l=e[3]+this.offset.click.top
}}if(c.grid){f=c.grid[1]?this.originalPageY+Math.round((l-this.originalPageY)/c.grid[1])*c.grid[1]:this.originalPageY;
l=e?((f-this.offset.click.top>=e[1]||f-this.offset.click.top>e[3])?f:((f-this.offset.click.top>=e[1])?f-c.grid[1]:f+c.grid[1])):f;
m=c.grid[0]?this.originalPageX+Math.round((j-this.originalPageX)/c.grid[0])*c.grid[0]:this.originalPageX;
j=e?((m-this.offset.click.left>=e[0]||m-this.offset.click.left>e[2])?m:((m-this.offset.click.left>=e[0])?m-c.grid[0]:m+c.grid[0])):m
}if(c.axis==="y"){j=this.originalPageX
}if(c.axis==="x"){l=this.originalPageY
}}return{top:(l-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(this.cssPosition==="fixed"?-this.offset.scroll.top:(i?0:this.offset.scroll.top))),left:(j-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(this.cssPosition==="fixed"?-this.offset.scroll.left:(i?0:this.offset.scroll.left)))}
},_clear:function(){this.helper.removeClass("ui-draggable-dragging");
if(this.helper[0]!==this.element[0]&&!this.cancelHelperRemoval){this.helper.remove()
}this.helper=null;
this.cancelHelperRemoval=false;
if(this.destroyOnClear){this.destroy()
}},_normalizeRightBottom:function(){if(this.options.axis!=="y"&&this.helper.css("right")!=="auto"){this.helper.width(this.helper.width());
this.helper.css("right","auto")
}if(this.options.axis!=="x"&&this.helper.css("bottom")!=="auto"){this.helper.height(this.helper.height());
this.helper.css("bottom","auto")
}},_trigger:function(e,d,c){c=c||this._uiHash();
a.ui.plugin.call(this,e,[d,c,this],true);
if(/^(drag|start|stop)/.test(e)){this.positionAbs=this._convertPositionTo("absolute");
c.offset=this.positionAbs
}return a.Widget.prototype._trigger.call(this,e,d,c)
},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}
}});
a.ui.plugin.add("draggable","connectToSortable",{start:function(d,c,f){var e=a.extend({},c,{item:f.element});
f.sortables=[];
a(f.options.connectToSortable).each(function(){var g=a(this).sortable("instance");
if(g&&!g.options.disabled){f.sortables.push(g);
g.refreshPositions();
g._trigger("activate",d,e)
}})
},stop:function(d,c,f){var e=a.extend({},c,{item:f.element});
f.cancelHelperRemoval=false;
a.each(f.sortables,function(){var g=this;
if(g.isOver){g.isOver=0;
f.cancelHelperRemoval=true;
g.cancelHelperRemoval=false;
g._storedCSS={position:g.placeholder.css("position"),top:g.placeholder.css("top"),left:g.placeholder.css("left")};
g._mouseStop(d);
g.options.helper=g.options._helper
}else{g.cancelHelperRemoval=true;
g._trigger("deactivate",d,e)
}})
},drag:function(d,c,e){a.each(e.sortables,function(){var g=false,f=this;
f.positionAbs=e.positionAbs;
f.helperProportions=e.helperProportions;
f.offset.click=e.offset.click;
if(f._intersectsWith(f.containerCache)){g=true;
a.each(e.sortables,function(){this.positionAbs=e.positionAbs;
this.helperProportions=e.helperProportions;
this.offset.click=e.offset.click;
if(this!==f&&this._intersectsWith(this.containerCache)&&a.contains(f.element[0],this.element[0])){g=false
}return g
})
}if(g){if(!f.isOver){f.isOver=1;
f.currentItem=c.helper.appendTo(f.element).data("ui-sortable-item",true);
f.options._helper=f.options.helper;
f.options.helper=function(){return c.helper[0]
};
d.target=f.currentItem[0];
f._mouseCapture(d,true);
f._mouseStart(d,true,true);
f.offset.click.top=e.offset.click.top;
f.offset.click.left=e.offset.click.left;
f.offset.parent.left-=e.offset.parent.left-f.offset.parent.left;
f.offset.parent.top-=e.offset.parent.top-f.offset.parent.top;
e._trigger("toSortable",d);
e.dropped=f.element;
a.each(e.sortables,function(){this.refreshPositions()
});
e.currentItem=e.element;
f.fromOutside=e
}if(f.currentItem){f._mouseDrag(d);
c.position=f.position
}}else{if(f.isOver){f.isOver=0;
f.cancelHelperRemoval=true;
f.options._revert=f.options.revert;
f.options.revert=false;
f._trigger("out",d,f._uiHash(f));
f._mouseStop(d,true);
f.options.revert=f.options._revert;
f.options.helper=f.options._helper;
if(f.placeholder){f.placeholder.remove()
}e._refreshOffsets(d);
c.position=e._generatePosition(d,true);
e._trigger("fromSortable",d);
e.dropped=false;
a.each(e.sortables,function(){this.refreshPositions()
})
}}})
}});
a.ui.plugin.add("draggable","cursor",{start:function(e,d,g){var f=a("body"),c=g.options;
if(f.css("cursor")){c._cursor=f.css("cursor")
}f.css("cursor",c.cursor)
},stop:function(e,d,f){var c=f.options;
if(c._cursor){a("body").css("cursor",c._cursor)
}}});
a.ui.plugin.add("draggable","opacity",{start:function(e,d,g){var f=a(d.helper),c=g.options;
if(f.css("opacity")){c._opacity=f.css("opacity")
}f.css("opacity",c.opacity)
},stop:function(e,d,f){var c=f.options;
if(c._opacity){a(d.helper).css("opacity",c._opacity)
}}});
a.ui.plugin.add("draggable","scroll",{start:function(d,c,e){if(!e.scrollParentNotHidden){e.scrollParentNotHidden=e.helper.scrollParent(false)
}if(e.scrollParentNotHidden[0]!==e.document[0]&&e.scrollParentNotHidden[0].tagName!=="HTML"){e.overflowOffset=e.scrollParentNotHidden.offset()
}},drag:function(f,e,g){var d=g.options,h=false,c=g.scrollParentNotHidden[0],i=g.document[0];
if(c!==i&&c.tagName!=="HTML"){if(!d.axis||d.axis!=="x"){if((g.overflowOffset.top+c.offsetHeight)-f.pageY<d.scrollSensitivity){c.scrollTop=h=c.scrollTop+d.scrollSpeed
}else{if(f.pageY-g.overflowOffset.top<d.scrollSensitivity){c.scrollTop=h=c.scrollTop-d.scrollSpeed
}}}if(!d.axis||d.axis!=="y"){if((g.overflowOffset.left+c.offsetWidth)-f.pageX<d.scrollSensitivity){c.scrollLeft=h=c.scrollLeft+d.scrollSpeed
}else{if(f.pageX-g.overflowOffset.left<d.scrollSensitivity){c.scrollLeft=h=c.scrollLeft-d.scrollSpeed
}}}}else{if(!d.axis||d.axis!=="x"){if(f.pageY-a(i).scrollTop()<d.scrollSensitivity){h=a(i).scrollTop(a(i).scrollTop()-d.scrollSpeed)
}else{if(a(window).height()-(f.pageY-a(i).scrollTop())<d.scrollSensitivity){h=a(i).scrollTop(a(i).scrollTop()+d.scrollSpeed)
}}}if(!d.axis||d.axis!=="y"){if(f.pageX-a(i).scrollLeft()<d.scrollSensitivity){h=a(i).scrollLeft(a(i).scrollLeft()-d.scrollSpeed)
}else{if(a(window).width()-(f.pageX-a(i).scrollLeft())<d.scrollSensitivity){h=a(i).scrollLeft(a(i).scrollLeft()+d.scrollSpeed)
}}}}if(h!==false&&a.ui.ddmanager&&!d.dropBehaviour){a.ui.ddmanager.prepareOffsets(g,f)
}}});
a.ui.plugin.add("draggable","snap",{start:function(e,d,f){var c=f.options;
f.snapElements=[];
a(c.snap.constructor!==String?(c.snap.items||":data(ui-draggable)"):c.snap).each(function(){var g=a(this),h=g.offset();
if(this!==f.element[0]){f.snapElements.push({item:this,width:g.outerWidth(),height:g.outerHeight(),top:h.top,left:h.left})
}})
},drag:function(i,m,t){var w,d,q,p,j,n,o,c,h,s,l=t.options,e=l.snapTolerance,f=m.offset.left,g=f+t.helperProportions.width,u=m.offset.top,v=u+t.helperProportions.height;
for(h=t.snapElements.length-1;
h>=0;
h--){j=t.snapElements[h].left-t.margins.left;
n=j+t.snapElements[h].width;
o=t.snapElements[h].top-t.margins.top;
c=o+t.snapElements[h].height;
if(g<j-e||f>n+e||v<o-e||u>c+e||!a.contains(t.snapElements[h].item.ownerDocument,t.snapElements[h].item)){if(t.snapElements[h].snapping){(t.options.snap.release&&t.options.snap.release.call(t.element,i,a.extend(t._uiHash(),{snapItem:t.snapElements[h].item})))
}t.snapElements[h].snapping=false;
continue
}if(l.snapMode!=="inner"){w=Math.abs(o-v)<=e;
d=Math.abs(c-u)<=e;
q=Math.abs(j-g)<=e;
p=Math.abs(n-f)<=e;
if(w){m.position.top=t._convertPositionTo("relative",{top:o-t.helperProportions.height,left:0}).top
}if(d){m.position.top=t._convertPositionTo("relative",{top:c,left:0}).top
}if(q){m.position.left=t._convertPositionTo("relative",{top:0,left:j-t.helperProportions.width}).left
}if(p){m.position.left=t._convertPositionTo("relative",{top:0,left:n}).left
}}s=(w||d||q||p);
if(l.snapMode!=="outer"){w=Math.abs(o-u)<=e;
d=Math.abs(c-v)<=e;
q=Math.abs(j-f)<=e;
p=Math.abs(n-g)<=e;
if(w){m.position.top=t._convertPositionTo("relative",{top:o,left:0}).top
}if(d){m.position.top=t._convertPositionTo("relative",{top:c-t.helperProportions.height,left:0}).top
}if(q){m.position.left=t._convertPositionTo("relative",{top:0,left:j}).left
}if(p){m.position.left=t._convertPositionTo("relative",{top:0,left:n-t.helperProportions.width}).left
}}if(!t.snapElements[h].snapping&&(w||d||q||p||s)){(t.options.snap.snap&&t.options.snap.snap.call(t.element,i,a.extend(t._uiHash(),{snapItem:t.snapElements[h].item})))
}t.snapElements[h].snapping=(w||d||q||p||s)
}}});
a.ui.plugin.add("draggable","stack",{start:function(f,e,h){var g,c=h.options,d=a.makeArray(a(c.stack)).sort(function(i,j){return(parseInt(a(i).css("zIndex"),10)||0)-(parseInt(a(j).css("zIndex"),10)||0)
});
if(!d.length){return
}g=parseInt(a(d[0]).css("zIndex"),10)||0;
a(d).each(function(i){a(this).css("zIndex",g+i)
});
this.css("zIndex",(g+d.length))
}});
a.ui.plugin.add("draggable","zIndex",{start:function(e,d,g){var f=a(d.helper),c=g.options;
if(f.css("zIndex")){c._zIndex=f.css("zIndex")
}f.css("zIndex",c.zIndex)
},stop:function(e,d,f){var c=f.options;
if(c._zIndex){a(d.helper).css("zIndex",c._zIndex)
}}});
return a.ui.draggable
}));
var sbjQuery=jQuery;
sbjQuery.fn.SpinButton=function(a){return this.each(function(){this.spinCfg={min:a&&!isNaN(parseFloat(a.min))?Number(a.min):null,max:a&&!isNaN(parseFloat(a.max))?Number(a.max):null,step:a&&a.step?Number(a.step):1,page:a&&a.page?Number(a.page):10,upClass:a&&a.upClass?a.upClass:"up",downClass:a&&a.downClass?a.downClass:"down",reset:a&&a.reset?a.reset:this.value,delay:a&&a.delay?Number(a.delay):500,interval:a&&a.interval?Number(a.interval):100,_btn_width:20,_btn_height:12,_direction:null,_delay:null,_repeat:null,digits:a&&a.digits?Number(a.digits):1};
this.adjustValue=function(h){var i=this.value.toLowerCase();
if(i=="am"){this.value="PM";
return
}else{if(i=="pm"){this.value="AM";
return
}}i=(isNaN(this.value)?this.spinCfg.reset:Number(this.value))+Number(h);
if(this.spinCfg.min!==null){i=(i<this.spinCfg.min?(this.spinCfg.max!=null?this.spinCfg.max:this.spinCfg.min):i)
}if(this.spinCfg.max!==null){i=(i>this.spinCfg.max?(this.spinCfg.min!=null?this.spinCfg.min:this.spinCfg.max):i)
}var g=String(i);
while(g.length<this.spinCfg.digits){g="0"+g
}this.value=g
};
sbjQuery(this).keydown(function(g){switch(g.keyCode){case 38:this.adjustValue(this.spinCfg.step);
break;
case 40:this.adjustValue(-this.spinCfg.step);
break;
case 33:this.adjustValue(this.spinCfg.page);
break;
case 34:this.adjustValue(-this.spinCfg.page);
break
}}).bind("mousewheel",function(g){if(g.wheelDelta>=120){this.adjustValue(this.spinCfg.step)
}else{if(g.wheelDelta<=-120){this.adjustValue(-this.spinCfg.step)
}}g.preventDefault()
}).change(function(g){this.adjustValue(0)
});
var e=this;
var f=document.getElementById(this.id+"BtnUp");
sbjQuery(f).mousedown(function(g){var h=function(){e.adjustValue(e.spinCfg.step)
};
h();
e.spinCfg._delay=window.setTimeout(function(){h();
e.spinCfg._repeat=window.setInterval(h,e.spinCfg.interval)
},e.spinCfg.delay);
e.spinCfg._repeater=true;
return false
}).mouseup(function(g){e.spinCfg._repeater=false;
window.clearInterval(e.spinCfg._repeat);
window.clearTimeout(e.spinCfg._delay)
}).dblclick(function(g){if(RichFaces.browser.msie){e.adjustValue(e.spinCfg.step)
}}).mouseout(function(g){if(e.spinCfg._repeater){e.spinCfg._repeater=false;
window.clearInterval(e.spinCfg._repeat);
window.clearTimeout(e.spinCfg._delay)
}});
var d=document.getElementById(this.id+"BtnDown");
sbjQuery(d).mousedown(function(g){var h=function(){e.adjustValue(-e.spinCfg.step)
};
h();
e.spinCfg._delay=window.setTimeout(function(){h();
e.spinCfg._repeat=window.setInterval(h,e.spinCfg.interval)
},e.spinCfg.delay);
e.spinCfg._repeater=true;
return false
}).mouseup(function(g){e.spinCfg._repeater=false;
window.clearInterval(e.spinCfg._repeat);
window.clearTimeout(e.spinCfg._delay)
}).dblclick(function(g){if(RichFaces.browser.msie){e.adjustValue(-e.spinCfg.step)
}}).mouseout(function(g){if(e.spinCfg._repeater){e.spinCfg._repeater=false;
window.clearInterval(e.spinCfg._repeat);
window.clearTimeout(e.spinCfg._delay)
}});
if(this.addEventListener){this.addEventListener("DOMMouseScroll",function(g){if(g.detail>0){this.adjustValue(-this.spinCfg.step)
}else{if(g.detail<0){this.adjustValue(this.spinCfg.step)
}}g.preventDefault()
},false)
}});
function c(f,d){var e=f[d],g=document.body;
while((f=f.offsetParent)&&(f!=g)){if(!RichFaces.browser.msie||(f.currentStyle.position!="relative")){e+=f[d]
}}return e
}};
(function(d,e){e.ui=e.ui||{};
e.ui.InplaceBase=function(f,h){c.constructor.call(this,f);
var g=d.extend({},a,h);
this.editEvent=g.editEvent;
this.noneCss=g.noneCss;
this.changedCss=g.changedCss;
this.editCss=g.editCss;
this.defaultLabel=g.defaultLabel;
this.state=g.state;
this.options=g;
this.element=d(document.getElementById(f));
this.editContainer=d(document.getElementById(f+"Edit"));
this.element.bind(this.editEvent,d.proxy(this.__editHandler,this));
this.isSaved=false;
this.useDefaultLabel=false;
this.editState=false
};
e.ui.InputBase.extend(e.ui.InplaceBase);
var c=e.ui.InplaceBase.$super;
var a={editEvent:"click",state:"ready"};
d.extend(e.ui.InplaceBase.prototype,(function(){var f={READY:"ready",CHANGED:"changed",DISABLE:"disable",EDIT:"edit"};
return{getLabel:function(){},setLabel:function(g){},onshow:function(){},onhide:function(){},onsave:function(){},oncancel:function(){},save:function(){var g=this.__getValue();
if(g.length>0){this.setLabel(g);
this.useDefaultLabel=false
}else{this.setLabel(this.defaultLabel);
this.useDefaultLabel=true
}this.isSaved=true;
this.__applyChangedStyles();
this.onsave()
},cancel:function(){var g="";
if(!this.useDefaultLabel){g=this.getLabel()
}this.__setValue(g);
this.isSaved=true;
this.oncancel()
},isValueSaved:function(){return this.isSaved
},isEditState:function(){return this.editState
},__applyChangedStyles:function(){if(this.isValueChanged()){this.element.addClass(this.changedCss)
}else{this.element.removeClass(this.changedCss)
}},__show:function(){this.scrollElements=e.Event.bindScrollEventHandlers(this.id,this.__scrollHandler,this);
this.editState=true;
this.onshow()
},__hide:function(){if(this.scrollElements){e.Event.unbindScrollEventHandlers(this.scrollElements,this);
this.scrollElements=null
}this.editState=false;
this.editContainer.addClass(this.noneCss);
this.element.removeClass(this.editCss);
this.onhide()
},__editHandler:function(g){this.isSaved=false;
this.element.addClass(this.editCss);
this.editContainer.removeClass(this.noneCss);
this.__show()
},__scrollHandler:function(g){this.cancel()
},destroy:function(){c.destroy.call(this)
}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(d,e){e.ui=e.ui||{};
var a={position:"tr",direction:"vertical",method:"last",notifications:[],addNotification:function(f){this.notifications.push(f)
}};
e.ui.NotifyStack=e.BaseComponent.extendClass({name:"NotifyStack",init:function(f,g){c.constructor.call(this,f);
this.attachToDom(this.id);
this.__initializeStack(g)
},__initializeStack:function(g){var h=d.extend({},d.pnotify.defaults.pnotify_stack,a,g);
var f=(h.direction=="vertical");
var i=(h.method=="first");
h.push=i?"top":"bottom";
switch(h.position){case"tl":h.dir1=f?"down":"right";
h.dir2=f?"right":"down";
break;
case"tr":h.dir1=f?"down":"left";
h.dir2=f?"left":"down";
break;
case"bl":h.dir1=f?"up":"right";
h.dir2=f?"right":"up";
break;
case"br":h.dir1=f?"up":"left";
h.dir2=f?"left":"up";
break;
default:throw"wrong stack position: "+h.position
}this.stack=h
},getStack:function(){return this.stack
},removeNotifications:function(){var f;
while(f=this.stack.notifications.pop()){f.pnotify_remove()
}},destroy:function(){this.removeNotifications();
this.stack=null;
c.destroy.call(this)
}});
var c=e.ui.NotifyStack.$super
})(RichFaces.jQuery,RichFaces);
(function(z,h){h.ui=h.ui||{};
h.ui.Autocomplete=function(F,B,A){this.namespace="."+h.Event.createNamespace(this.name,F);
this.options={};
c.constructor.call(this,F,F+s.SELECT,B,A);
this.attachToDom();
this.options=z.extend(this.options,d,A);
this.value="";
this.index=null;
this.isFirstAjax=true;
l.call(this);
m.call(this);
p.call(this,"")
};
h.ui.AutocompleteBase.extend(h.ui.Autocomplete);
var c=h.ui.Autocomplete.$super;
var d={itemClass:"rf-au-itm",selectedItemClass:"rf-au-itm-sel",subItemClass:"rf-au-opt",selectedSubItemClass:"rf-au-opt-sel",autofill:true,minChars:1,selectFirst:true,ajaxMode:true,lazyClientMode:false,isCachedAjax:true,tokens:"",attachToBody:true,filterFunction:undefined};
var s={SELECT:"List",ITEMS:"Items",VALUE:"Value"};
var ac=/^[\n\s]*(.*)[\n\s]*$/;
var n=function(B){var A=[];
B.each(function(){A.push(z(this).text().replace(ac,"$1"))
});
return A
};
var l=function(){this.useTokens=(typeof this.options.tokens=="string"&&this.options.tokens.length>0);
if(this.useTokens){var A=this.options.tokens.split("").join("\\");
this.REGEXP_TOKEN_RIGHT=new RegExp("["+A+"]","i");
this.getLastTokenIndex=function(B){return RichFaces.ui.Autocomplete.__getLastTokenIndex(A,B)
}
}};
var m=function(){var A=z(h.getDomElement(this.id+s.ITEMS).parentNode);
A.on("click"+this.namespace,"."+this.options.itemClass,z.proxy(w,this));
A.on("mouseenter"+this.namespace,"."+this.options.itemClass,z.proxy(o,this))
};
var o=function(F){var A=z(F.target);
if(A&&!A.hasClass(this.options.itemClass)){A=A.parents("."+this.options.itemClass).get(0)
}if(A){var B=this.items.index(A);
x.call(this,F,B)
}};
var w=function(A){var B=z(A.target);
if(B&&!B.hasClass(this.options.itemClass)){B=B.parents("."+this.options.itemClass).get(0)
}if(B){this.__onEnter(A);
h.Selection.setCaretTo(h.getDomElement(this.fieldId));
this.__hide(A)
}};
var p=function(G,A){var F=z(h.getDomElement(this.id+s.ITEMS));
this.items=F.find("."+this.options.itemClass);
var B=F.data("componentData");
F.removeData("componentData");
if(this.items.length>0){this.cache=new h.utils.Cache((this.options.ajaxMode?G:""),this.items,A||B||n,!this.options.ajaxMode)
}};
var y=function(){var A=0;
this.items.slice(0,this.index).each(function(){A+=this.offsetHeight
});
var B=z(h.getDomElement(this.id+s.ITEMS)).parent();
if(A<B.scrollTop()){B.scrollTop(A)
}else{A+=this.items.eq(this.index).outerHeight();
if(A-B.scrollTop()>B.innerHeight()){B.scrollTop(A-B.innerHeight())
}}};
var j=function(B,H){if(this.options.autofill&&H.toLowerCase().indexOf(B)==0){var G=h.getDomElement(this.fieldId);
var F=h.Selection.getStart(G);
this.__setInputValue(B+H.substring(B.length));
var A=F+H.length-B.length;
h.Selection.set(G,F,A)
}};
var t=function(I,F){h.getDomElement(this.id+s.VALUE).value=this.value;
var G=this;
var B=I;
var J=function(K){p.call(G,G.value,K.componentData&&K.componentData[G.id]);
if(G.options.lazyClientMode&&G.value.length!=0){u.call(G,G.value)
}if(G.items.length!=0){if(F){(G.focused||G.isMouseDown)&&F.call(G,B)
}else{G.isVisible&&G.options.selectFirst&&x.call(G,B,0)
}}else{G.__hide(B)
}};
var A=function(K){G.__hide(B);
a.call(G)
};
this.isFirstAjax=false;
var H={};
H[this.id+".ajax"]="1";
h.ajax(this.id,I,{parameters:H,error:A,complete:J})
};
var f=function(){if(this.index!=null){var A=this.items.eq(this.index);
if(A.removeClass(this.options.selectedItemClass).hasClass(this.options.subItemClass)){A.removeClass(this.options.selectedSubItemClass)
}this.index=null
}};
var x=function(F,B,G){if(this.items.length==0||(!G&&B==this.index)){return
}if(B==null||B==undefined){f.call(this);
return
}if(G){if(this.index==null){B=0
}else{B=this.index+B
}}if(B<0){B=0
}else{if(B>=this.items.length){B=this.items.length-1
}}if(B==this.index){return
}f.call(this);
this.index=B;
var A=this.items.eq(this.index);
if(A.addClass(this.options.selectedItemClass).hasClass(this.options.subItemClass)){A.addClass(this.options.selectedSubItemClass)
}y.call(this);
if(F&&F.keyCode!=h.KEYS.BACKSPACE&&F.keyCode!=h.KEYS.DEL&&F.keyCode!=h.KEYS.LEFT&&F.keyCode!=h.KEYS.RIGHT){j.call(this,this.value,i.call(this))
}};
var u=function(A){var B=this.cache.getItems(A,this.options.filterFunction);
this.items=z(B);
z(h.getDomElement(this.id+s.ITEMS)).empty().append(this.items)
};
var a=function(){z(h.getDomElement(this.id+s.ITEMS)).removeData().empty();
this.items=[]
};
var aa=function(A,G,F){x.call(this,A);
var H=(typeof G=="undefined")?this.__getSubValue():G;
var B=this.value;
this.value=H;
if((this.options.isCachedAjax||!this.options.ajaxMode)&&this.cache&&this.cache.isCached(H)){if(B!=H){u.call(this,H)
}if(this.items.length!=0){F&&F.call(this,A)
}else{this.__hide(A)
}if(A.keyCode==h.KEYS.RETURN||A.type=="click"){this.__setInputValue(H)
}else{if(this.options.selectFirst){x.call(this,A,0)
}}}else{if(A.keyCode==h.KEYS.RETURN||A.type=="click"){this.__setInputValue(H)
}if(H.length>=this.options.minChars){if((this.options.ajaxMode||this.options.lazyClientMode)&&(B!=H||(B===""&&H===""))){t.call(this,A,F)
}}else{if(this.options.ajaxMode){a.call(this);
this.__hide(A)
}}}};
var i=function(){if(this.index!=null){var A=this.items.eq(this.index);
return this.cache.getItemValue(A)
}return undefined
};
var e=function(){if(this.useTokens){var F=h.getDomElement(this.fieldId);
var G=F.value;
var A=h.Selection.getStart(F);
var I=G.substring(0,A);
var H=G.substring(A);
var B=I.substring(this.getLastTokenIndex(I));
r=H.search(this.REGEXP_TOKEN_RIGHT);
if(r==-1){r=H.length
}B+=H.substring(0,r);
return B
}else{return this.getValue()
}};
var v=function(B){var A=h.Selection.getStart(B);
if(A<=0){A=this.getLastTokenIndex(B.value)
}return A
};
var q=function(A){var B=h.getDomElement(this.fieldId);
var K=B.value;
var M=this.__getCursorPosition(B);
var I=K.substring(0,M);
var G=K.substring(M);
var F=this.getLastTokenIndex(I);
var H=F!=-1?F:I.length;
F=G.search(this.REGEXP_TOKEN_RIGHT);
var L=F!=-1?F:G.length;
var J=K.substring(0,H)+A;
M=J.length;
B.value=J+G.substring(L);
B.focus();
h.Selection.setCaretTo(B,M);
return B.value
};
var ab=function(){if(this.items.length==0){return -1
}var F=z(h.getDomElement(this.id+s.ITEMS)).parent();
var A=F.scrollTop()+F.innerHeight()+this.items[0].offsetTop;
var G;
var B=(this.index!=null&&this.items[this.index].offsetTop<=A)?this.index:0;
for(B;
B<this.items.length;
B++){G=this.items[B];
if(G.offsetTop+G.offsetHeight>A){B--;
break
}}if(B!=this.items.length-1&&B==this.index){A+=this.items[B].offsetTop-F.scrollTop();
for(++B;
B<this.items.length;
B++){G=this.items[B];
if(G.offsetTop+G.offsetHeight>A){break
}}}return B
};
var g=function(){if(this.items.length==0){return -1
}var F=z(h.getDomElement(this.id+s.ITEMS)).parent();
var A=F.scrollTop()+this.items[0].offsetTop;
var G;
var B=(this.index!=null&&this.items[this.index].offsetTop>=A)?this.index-1:this.items.length-1;
for(B;
B>=0;
B--){G=this.items[B];
if(G.offsetTop<A){B++;
break
}}if(B!=0&&B==this.index){A=this.items[B].offsetTop-F.innerHeight();
if(A<this.items[0].offsetTop){A=this.items[0].offsetTop
}for(--B;
B>=0;
B--){G=this.items[B];
if(G.offsetTop<A){B++;
break
}}}return B
};
z.extend(h.ui.Autocomplete.prototype,(function(){return{name:"Autocomplete",__updateState:function(B){var A=this.__getSubValue();
if(this.items.length==0&&this.isFirstAjax){if((this.options.ajaxMode&&A.length>=this.options.minChars)||this.options.lazyClientMode){this.value=A;
t.call(this,B,this.__show);
return true
}}return false
},__getSubValue:e,__getCursorPosition:v,__updateInputValue:function(A){if(this.useTokens){return q.call(this,A)
}else{return c.__updateInputValue.call(this,A)
}},__setInputValue:function(A){this.currentValue=this.__updateInputValue(A)
},__onChangeValue:aa,__onKeyUp:function(A){x.call(this,A,-1,true)
},__onKeyDown:function(A){x.call(this,A,1,true)
},__onPageUp:function(A){x.call(this,A,g.call(this))
},__onPageDown:function(A){x.call(this,A,ab.call(this))
},__onKeyHome:function(A){x.call(this,A,0)
},__onKeyEnd:function(A){x.call(this,A,this.items.length-1)
},__onBeforeShow:function(A){},__onEnter:function(B){var A=i.call(this);
this.__onChangeValue(B,A);
this.invokeEvent("selectitem",h.getDomElement(this.fieldId),B,A)
},__onShow:function(A){if(this.options.selectFirst){x.call(this,A,0)
}},__onHide:function(A){x.call(this,A)
},destroy:function(){this.items=null;
this.cache=null;
var A=h.getDomElement(this.id+s.ITEMS);
z(A).removeData();
h.Event.unbind(A.parentNode,this.namespace);
this.__conceal();
c.destroy.call(this)
}}
})());
z.extend(h.ui.Autocomplete,{setData:function(A,B){z(h.getDomElement(A)).data("componentData",B)
},__getLastTokenIndex:function(F,G){var A=new RegExp("["+F+"][^"+F+"]*$","i");
var J=new RegExp("[^"+F+" ]","i");
var G=G||"";
var H=G.search(A);
if(H<0){return 0
}var B=G.substring(H);
var I=B.search(J);
if(I<=0){I=B.length
}return H+I
}})
})(RichFaces.jQuery,RichFaces);
(function(c,a){a.ui=a.ui||{};
var d={switchMode:"ajax"};
a.ui.CollapsiblePanelItem=a.ui.TogglePanelItem.extendClass({init:function(e,f){a.ui.TogglePanelItem.call(this,e,c.extend({},d,f));
this.headerClass="rf-cp-hdr-"+this.__state()
},__enter:function(){this.__content().show();
this.__header().addClass(this.headerClass);
return true
},__leave:function(){this.__content().hide();
if(this.options.switchMode=="client"){this.__header().removeClass(this.headerClass)
}return true
},__state:function(){return this.getName()==="true"?"exp":"colps"
},__content:function(){return c(a.getDomElement(this.id))
},__header:function(){return c(a.getDomElement(this.togglePanelId+":header"))
}})
})(RichFaces.jQuery,RichFaces);
(function(d,e){e.ui=e.ui||{};
e.ui.Popup=function(f,g){c.constructor.call(this,f);
this.options=d.extend({},a,g);
this.positionOptions={type:this.options.positionType,from:this.options.jointPoint,to:this.options.direction,offset:this.options.positionOffset};
this.popup=d(document.getElementById(f));
this.visible=this.options.visible;
this.attachTo=this.options.attachTo;
this.attachToBody=this.options.attachToBody;
this.positionType=this.options.positionType;
this.positionOffset=this.options.positionOffset
};
e.BaseComponent.extend(e.ui.Popup);
var c=e.ui.Popup.$super;
var a={visible:false};
d.extend(e.ui.Popup.prototype,{name:"popup",show:function(f){if(!this.visible){if(this.attachToBody){this.parentElement=this.popup.parent().get(0);
document.body.appendChild(this.popup.get(0))
}this.visible=true
}this.popup.setPosition(f||{id:this.attachTo},this.positionOptions).show()
},hide:function(){if(this.visible){this.popup.hide();
this.visible=false;
if(this.attachToBody&&this.parentElement){this.parentElement.appendChild(this.popup.get(0));
this.parentElement=null
}}},isVisible:function(){return this.visible
},getId:function(){return this.id
},destroy:function(){if(this.attachToBody&&this.parentElement){this.parentElement.appendChild(this.popup.get(0));
this.parentElement=null
}}})
})(RichFaces.jQuery,window.RichFaces);
(function(a){if(typeof define==="function"&&define.amd){define(["jquery","./core","./widget","./mouse","./draggable"],a)
}else{a(jQuery)
}}(function(a){a.widget("ui.droppable",{version:"1.11.2",widgetEventPrefix:"drop",options:{accept:"*",activeClass:false,addClasses:true,greedy:false,hoverClass:false,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var d,c=this.options,e=c.accept;
this.isover=false;
this.isout=true;
this.accept=a.isFunction(e)?e:function(f){return f.is(e)
};
this.proportions=function(){if(arguments.length){d=arguments[0]
}else{return d?d:d={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight}
}};
this._addToManager(c.scope);
c.addClasses&&this.element.addClass("ui-droppable")
},_addToManager:function(c){a.ui.ddmanager.droppables[c]=a.ui.ddmanager.droppables[c]||[];
a.ui.ddmanager.droppables[c].push(this)
},_splice:function(d){var c=0;
for(;
c<d.length;
c++){if(d[c]===this){d.splice(c,1)
}}},_destroy:function(){var c=a.ui.ddmanager.droppables[this.options.scope];
this._splice(c);
this.element.removeClass("ui-droppable ui-droppable-disabled")
},_setOption:function(d,c){if(d==="accept"){this.accept=a.isFunction(c)?c:function(f){return f.is(c)
}
}else{if(d==="scope"){var e=a.ui.ddmanager.droppables[this.options.scope];
this._splice(e);
this._addToManager(c)
}}this._super(d,c)
},_activate:function(c){var d=a.ui.ddmanager.current;
if(this.options.activeClass){this.element.addClass(this.options.activeClass)
}if(d){this._trigger("activate",c,this.ui(d))
}},_deactivate:function(c){var d=a.ui.ddmanager.current;
if(this.options.activeClass){this.element.removeClass(this.options.activeClass)
}if(d){this._trigger("deactivate",c,this.ui(d))
}},_over:function(c){var d=a.ui.ddmanager.current;
if(!d||(d.currentItem||d.element)[0]===this.element[0]){return
}if(this.accept.call(this.element[0],(d.currentItem||d.element))){if(this.options.hoverClass){this.element.addClass(this.options.hoverClass)
}this._trigger("over",c,this.ui(d))
}},_out:function(c){var d=a.ui.ddmanager.current;
if(!d||(d.currentItem||d.element)[0]===this.element[0]){return
}if(this.accept.call(this.element[0],(d.currentItem||d.element))){if(this.options.hoverClass){this.element.removeClass(this.options.hoverClass)
}this._trigger("out",c,this.ui(d))
}},_drop:function(e,d){var f=d||a.ui.ddmanager.current,c=false;
if(!f||(f.currentItem||f.element)[0]===this.element[0]){return false
}this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var g=a(this).droppable("instance");
if(g.options.greedy&&!g.options.disabled&&g.options.scope===f.options.scope&&g.accept.call(g.element[0],(f.currentItem||f.element))&&a.ui.intersect(f,a.extend(g,{offset:g.element.offset()}),g.options.tolerance,e)){c=true;
return false
}});
if(c){return false
}if(this.accept.call(this.element[0],(f.currentItem||f.element))){if(this.options.activeClass){this.element.removeClass(this.options.activeClass)
}if(this.options.hoverClass){this.element.removeClass(this.options.hoverClass)
}this._trigger("drop",e,this.ui(f));
return this.element
}return false
},ui:function(c){return{draggable:(c.currentItem||c.element),helper:c.helper,position:c.position,offset:c.positionAbs}
}});
a.ui.intersect=(function(){function c(e,f,d){return(e>=f)&&(e<(f+d))
}return function(f,m,h,d){if(!m.offset){return false
}var o=(f.positionAbs||f.position.absolute).left+f.margins.left,i=(f.positionAbs||f.position.absolute).top+f.margins.top,p=o+f.helperProportions.width,j=i+f.helperProportions.height,n=m.offset.left,g=m.offset.top,e=n+m.proportions().width,l=g+m.proportions().height;
switch(h){case"fit":return(n<=o&&p<=e&&g<=i&&j<=l);
case"intersect":return(n<o+(f.helperProportions.width/2)&&p-(f.helperProportions.width/2)<e&&g<i+(f.helperProportions.height/2)&&j-(f.helperProportions.height/2)<l);
case"pointer":return c(d.pageY,g,m.proportions().height)&&c(d.pageX,n,m.proportions().width);
case"touch":return((i>=g&&i<=l)||(j>=g&&j<=l)||(i<g&&j>l))&&((o>=n&&o<=e)||(p>=n&&p<=e)||(o<n&&p>e));
default:return false
}}
})();
a.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(f,d){var g,h,i=a.ui.ddmanager.droppables[f.options.scope]||[],e=d?d.type:null,c=(f.currentItem||f.element).find(":data(ui-droppable)").addBack();
droppablesLoop:for(g=0;
g<i.length;
g++){if(i[g].options.disabled||(f&&!i[g].accept.call(i[g].element[0],(f.currentItem||f.element)))){continue
}for(h=0;
h<c.length;
h++){if(c[h]===i[g].element[0]){i[g].proportions().height=0;
continue droppablesLoop
}}i[g].visible=i[g].element.css("display")!=="none";
if(!i[g].visible){continue
}if(e==="mousedown"){i[g]._activate.call(i[g],d)
}i[g].offset=i[g].element.offset();
i[g].proportions({width:i[g].element[0].offsetWidth,height:i[g].element[0].offsetHeight})
}},drop:function(e,d){var c=false;
a.each((a.ui.ddmanager.droppables[e.options.scope]||[]).slice(),function(){if(!this.options){return
}if(!this.options.disabled&&this.visible&&a.ui.intersect(e,this,this.options.tolerance,d)){c=this._drop.call(this,d)||c
}if(!this.options.disabled&&this.visible&&this.accept.call(this.element[0],(e.currentItem||e.element))){this.isout=true;
this.isover=false;
this._deactivate.call(this,d)
}});
return c
},dragStart:function(d,c){d.element.parentsUntil("body").bind("scroll.droppable",function(){if(!d.options.refreshPositions){a.ui.ddmanager.prepareOffsets(d,c)
}})
},drag:function(d,c){if(d.options.refreshPositions){a.ui.ddmanager.prepareOffsets(d,c)
}a.each(a.ui.ddmanager.droppables[d.options.scope]||[],function(){if(this.options.disabled||this.greedyChild||!this.visible){return
}var f,h,i,g=a.ui.intersect(d,this,this.options.tolerance,c),e=!g&&this.isover?"isout":(g&&!this.isover?"isover":null);
if(!e){return
}if(this.options.greedy){h=this.options.scope;
i=this.element.parents(":data(ui-droppable)").filter(function(){return a(this).droppable("instance").options.scope===h
});
if(i.length){f=a(i[0]).droppable("instance");
f.greedyChild=(e==="isover")
}}if(f&&e==="isover"){f.isover=false;
f.isout=true;
f._out.call(f,c)
}this[e]=true;
this[e==="isout"?"isover":"isout"]=false;
this[e==="isover"?"_over":"_out"].call(this,c);
if(f&&e==="isout"){f.isout=false;
f.isover=true;
f._over.call(f,c)
}})
},dragStop:function(d,c){d.element.parentsUntil("body").unbind("scroll.droppable");
if(!d.options.refreshPositions){a.ui.ddmanager.prepareOffsets(d,c)
}}};
return a.ui.droppable
}));
(function($,rf){rf.calendarUtils=rf.calendarUtils||{};
var getDefaultMonthNames=function(shortNames){return(shortNames?["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]:["January","February","March","April","May","June","July","August","September","October","November","December"])
};
$.extend(rf.calendarUtils,{joinArray:function(array,begin,end,separator){var value="";
if(array.length!=0){value=begin+array.pop()+end
}while(array.length){value=begin+array.pop()+end+separator+value
}return value
},getMonthByLabel:function(monthLabel,monthNames){var toLowerMonthLabel=monthLabel.toLowerCase();
var i=0;
while(i<monthNames.length){if(monthNames[i].toLowerCase()==toLowerMonthLabel){return i
}i++
}},createDate:function(yy,mm,dd,h,m,s){h=h||0;
m=m||0;
s=s||0;
var date=new Date(yy,mm,dd,h,m,s);
if(date.getDate()!=dd){date=new Date(yy,mm);
date.setHours(h);
date.setMinutes(m);
date.setSeconds(s);
date.setUTCDate(dd)
}return date
},parseDate:function(dateString,pattern,monthNames,monthNamesShort){var re=/([.*+?^<>=!:${}()\[\]\/\\])/g;
var monthNamesStr;
var monthNamesShortStr;
if(!monthNames){monthNames=getDefaultMonthNames();
monthNamesStr=monthNames.join("|")
}else{monthNamesStr=monthNames.join("|").replace(re,"\\$1")
}if(!monthNamesShort){monthNamesShort=getDefaultMonthNames(true);
monthNamesShortStr=monthNamesShort.join("|")
}else{monthNamesShortStr=monthNamesShort.join("|").replace(re,"\\$1")
}var counter=1;
var y,m,d;
var a,h,min,s;
var shortLabel=false;
pattern=pattern.replace(/([.*+?^<>=!:${}()|\[\]\/\\])/g,"\\$1");
pattern=pattern.replace(/(y+|M+|d+|a|H{1,2}|h{1,2}|m{2}|s{2})/g,function($1){switch($1){case"y":case"yy":y=counter;
counter++;
return"(\\d{2})";
case"MM":m=counter;
counter++;
return"(\\d{2})";
case"M":m=counter;
counter++;
return"(\\d{1,2})";
case"d":d=counter;
counter++;
return"(\\d{1,2})";
case"MMM":m=counter;
counter++;
shortLabel=true;
return"("+monthNamesShortStr+")";
case"a":a=counter;
counter++;
return"(AM|am|PM|pm)?";
case"HH":case"hh":h=counter;
counter++;
return"(\\d{2})?";
case"H":case"h":h=counter;
counter++;
return"(\\d{1,2})?";
case"mm":min=counter;
counter++;
return"(\\d{2})?";
case"ss":s=counter;
counter++;
return"(\\d{2})?"
}var ch=$1.charAt(0);
if(ch=="y"){y=counter;
counter++;
return"(\\d{3,4})"
}if(ch=="M"){m=counter;
counter++;
return"("+monthNamesStr+")"
}if(ch=="d"){d=counter;
counter++;
return"(\\d{2})"
}});
var re=new RegExp(pattern,"i");
var match=dateString.match(re);
if(match!=null&&y!=undefined&&m!=undefined){var correctYear=false;
var defaultCenturyStart=new Date();
defaultCenturyStart.setFullYear(defaultCenturyStart.getFullYear()-80);
var yy=parseInt(match[y],10);
if(isNaN(yy)){return null
}else{if(yy<100){var defaultCenturyStartYear=defaultCenturyStart.getFullYear();
var ambiguousTwoDigitYear=defaultCenturyStartYear%100;
correctYear=yy==ambiguousTwoDigitYear;
yy+=Math.floor(defaultCenturyStartYear/100)*100+(yy<ambiguousTwoDigitYear?100:0)
}}var mm=parseInt(match[m],10);
if(isNaN(mm)){mm=this.getMonthByLabel(match[m],shortLabel?monthNamesShort:monthNames)
}else{if(--mm<0||mm>11){return null
}}var addDay=correctYear?1:0;
var dd;
if(d!=undefined){dd=parseInt(match[d],10)
}else{dd=1
}if(isNaN(dd)||dd<1||dd>this.daysInMonth(yy,mm)+addDay){return null
}var date;
if(min!=undefined&&h!=undefined){var hh,mmin,aa;
mmin=parseInt(match[min],10);
if(isNaN(mmin)||mmin<0||mmin>59){return null
}hh=parseInt(match[h],10);
if(isNaN(hh)){return null
}if(a!=undefined){aa=match[a];
if(!aa){return null
}aa=aa.toLowerCase();
if((aa!="am"&&aa!="pm")||hh<1||hh>12){return null
}if(aa=="pm"){if(hh!=12){hh+=12
}}else{if(hh==12){hh=0
}}}else{if(hh<0||hh>23){return null
}}date=this.createDate(yy,mm,dd,hh,mmin);
if(s!=undefined){sec=parseInt(match[s],10);
if(isNaN(sec)||sec<0||sec>59){return null
}date.setSeconds(sec)
}}else{date=this.createDate(yy,mm,dd)
}if(correctYear){if(date.getTime()<defaultCenturyStart.getTime()){date.setFullYear(yy+100)
}if(date.getMonth()!=mm){return null
}}return date
}return null
},formatDate:function(date,pattern,monthNames,monthNamesShort){if(!monthNames){monthNames=getDefaultMonthNames()
}if(!monthNamesShort){monthNamesShort=getDefaultMonthNames(true)
}var mm,dd,hh,min,sec;
var result=pattern.replace(/(\\\\|\\[yMdaHhms])|(y+|M+|d+|a|H{1,2}|h{1,2}|m{2}|s{2})/g,function($1,$2,$3){if($2){return $2.charAt(1)
}switch($3){case"y":case"yy":return date.getYear().toString().slice(-2);
case"M":return(date.getMonth()+1);
case"MM":return((mm=date.getMonth()+1)<10?"0"+mm:mm);
case"MMM":return monthNamesShort[date.getMonth()];
case"d":return date.getDate();
case"a":return(date.getHours()<12?"AM":"PM");
case"HH":return((hh=date.getHours())<10?"0"+hh:hh);
case"H":return date.getHours();
case"hh":return((hh=date.getHours())==0?"12":(hh<10?"0"+hh:(hh>21?hh-12:(hh>12)?"0"+(hh-12):hh)));
case"h":return((hh=date.getHours())==0?"12":(hh>12?hh-12:hh));
case"mm":return((min=date.getMinutes())<10?"0"+min:min);
case"ss":return((sec=date.getSeconds())<10?"0"+sec:sec)
}var ch=$3.charAt(0);
if(ch=="y"){return date.getFullYear()
}if(ch=="M"){return monthNames[date.getMonth()]
}if(ch=="d"){return((dd=date.getDate())<10?"0"+dd:dd)
}});
return result
},isLeapYear:function(year){return new Date(year,1,29).getDate()==29
},daysInMonth:function(year,month){return 32-new Date(year,month,32).getDate()
},daysInMonthByDate:function(date){return 32-new Date(date.getFullYear(),date.getMonth(),32).getDate()
},getDay:function(date,firstWeekDay){var value=date.getDay()-firstWeekDay;
if(value<0){value=7+value
}return value
},getFirstWeek:function(year,mdifw,fdow){var date=new Date(year,0,1);
var firstday=this.getDay(date,fdow);
var weeknumber=(7-firstday<mdifw)?0:1;
return{date:date,firstDay:firstday,weekNumber:weeknumber,mdifw:mdifw,fdow:fdow}
},getLastWeekOfPrevYear:function(o){var year=o.date.getFullYear()-1;
var days=(this.isLeapYear(year)?366:365);
var obj=this.getFirstWeek(year,o.mdifw,o.fdow);
days=(days-7+o.firstDay);
var weeks=Math.ceil(days/7);
return weeks+obj.weekNumber
},weekNumber:function(year,month,mdifw,fdow){var o=this.getFirstWeek(year,mdifw,fdow);
if(month==0){if(o.weekNumber==1){return 1
}return this.getLastWeekOfPrevYear(o)
}var oneweek=604800000;
var d=new Date(year,month,1);
d.setDate(1+o.firstDay+(this.getDay(d,fdow)==0?1:0));
weeknumber=o.weekNumber+Math.floor((d.getTime()-o.date.getTime())/oneweek);
return weeknumber
}});
rf.calendarTemplates=rf.calendarTemplates||{};
$.extend(rf.calendarTemplates,(function(){var VARIABLE_NAME_PATTERN=/^\s*[_,A-Z,a-z][\w,_\.]*\s*$/;
var getObjectValue=function(str,object){var a=str.split(".");
var value=object[a[0]];
var c=1;
while(value&&c<a.length){value=value[a[c++]]
}return(value?value:"")
};
return{evalMacro:function(template,object){var _value_="";
if(VARIABLE_NAME_PATTERN.test(template)){if(template.indexOf(".")==-1){_value_=object[template];
if(!_value_){_value_=window[template]
}}else{_value_=getObjectValue(template,object);
if(!_value_){_value_=getObjectValue(template,window)
}}if(_value_&&typeof _value_=="function"){_value_=_value_(object)
}if(!_value_){_value_=""
}}else{try{if(object.eval){_value_=object.eval(template)
}else{with(object){_value_=eval(template)
}}if(typeof _value_=="function"){_value_=_value_(object)
}}catch(e){LOG.warn("Exception: "+e.Message+"\n["+template+"]")
}}return _value_
}}
})())
})(RichFaces.jQuery,RichFaces);
(function(d,f){f.ui=f.ui||{};
f.ui.List=function(i,l){c.constructor.call(this,i);
this.namespace=this.namespace||"."+f.Event.createNamespace(this.name,this.id);
this.attachToDom();
var j=d.extend({},a,l);
this.list=d(document.getElementById(i));
this.selectListener=j.selectListener;
this.selectItemCss=j.selectItemCss;
this.selectItemCssMarker=j.selectItemCss.split(" ",1)[0];
this.scrollContainer=d(j.scrollContainer);
this.itemCss=j.itemCss.split(" ",1)[0];
this.listCss=j.listCss;
this.clickRequiredToSelect=j.clickRequiredToSelect;
this.index=-1;
this.disabled=j.disabled;
this.focusKeeper=d(document.getElementById(i+"FocusKeeper"));
this.focusKeeper.focused=false;
this.isMouseDown=false;
this.list.bind("mousedown",d.proxy(this.__onMouseDown,this)).bind("mouseup",d.proxy(this.__onMouseUp,this));
h.call(this);
if(j.focusKeeperEnabled){g.call(this)
}this.__updateItemsList();
if(j.clientSelectItems!==null){this.__storeClientSelectItems(j.clientSelectItems)
}};
f.BaseComponent.extend(f.ui.List);
var c=f.ui.List.$super;
var a={clickRequiredToSelect:false,disabled:false,selectListener:false,clientSelectItems:null,focusKeeperEnabled:true};
var h=function(){var i={};
i["click"+this.namespace]=d.proxy(this.onClick,this);
i["dblclick"+this.namespace]=d.proxy(this.onDblclick,this);
this.list.on("mouseover"+this.namespace,"."+this.itemCss,d.proxy(e,this));
f.Event.bind(this.list,i,this)
};
var g=function(){var i={};
i["keydown"+this.namespace]=d.proxy(this.__keydownHandler,this);
i["blur"+this.namespace]=d.proxy(this.__blurHandler,this);
i["focus"+this.namespace]=d.proxy(this.__focusHandler,this);
f.Event.bind(this.focusKeeper,i,this)
};
var e=function(i){var j=d(i.target);
if(j&&!this.clickRequiredToSelect&&!this.disabled){this.__select(j)
}};
d.extend(f.ui.List.prototype,(function(){return{name:"list",processItem:function(i){if(this.selectListener.processItem&&typeof this.selectListener.processItem=="function"){this.selectListener.processItem(i)
}},isSelected:function(i){return i.hasClass(this.selectItemCssMarker)
},selectItem:function(i){if(this.selectListener.selectItem&&typeof this.selectListener.selectItem=="function"){this.selectListener.selectItem(i)
}else{i.addClass(this.selectItemCss);
f.Event.fire(this,"selectItem",i)
}this.__scrollToSelectedItem(this)
},unselectItem:function(i){if(this.selectListener.unselectItem&&typeof this.selectListener.unselectItem=="function"){this.selectListener.unselectItem(i)
}else{i.removeClass(this.selectItemCss);
f.Event.fire(this,"unselectItem",i)
}},__focusHandler:function(i){if(!this.focusKeeper.focused){this.focusKeeper.focused=true;
f.Event.fire(this,"listfocus"+this.namespace,i)
}},__blurHandler:function(i){if(!this.isMouseDown){var j=this;
this.timeoutId=window.setTimeout(function(){j.focusKeeper.focused=false;
j.invokeEvent.call(j,"blur",document.getElementById(j.id),i);
f.Event.fire(j,"listblur"+j.namespace,i)
},200)
}else{this.isMouseDown=false
}},__onMouseDown:function(i){this.isMouseDown=true
},__onMouseUp:function(i){this.isMouseDown=false
},__keydownHandler:function(i){if(i.isDefaultPrevented()){return
}if(i.metaKey||i.ctrlKey){return
}var j;
if(i.keyCode){j=i.keyCode
}else{if(i.which){j=i.which
}}switch(j){case f.KEYS.DOWN:i.preventDefault();
this.__selectNext();
break;
case f.KEYS.UP:i.preventDefault();
this.__selectPrev();
break;
case f.KEYS.HOME:i.preventDefault();
this.__selectByIndex(0);
break;
case f.KEYS.END:i.preventDefault();
this.__selectByIndex(this.items.length-1);
break;
default:break
}},onClick:function(j){this.setFocus();
var l=this.__getItem(j);
if(!l){return
}this.processItem(l);
var i=j.metaKey||j.ctrlKey;
if(!this.disabled){this.__select(l,i&&this.clickRequiredToSelect)
}},onDblclick:function(i){this.setFocus();
var j=this.__getItem(i);
if(!j){return
}this.processItem(j);
if(!this.disabled){this.__select(j,false)
}},currentSelectItem:function(){if(this.items&&this.index!=-1){return d(this.items[this.index])
}},getSelectedItemIndex:function(){return this.index
},removeItems:function(i){d(i).detach();
this.__updateItemsList();
f.Event.fire(this,"removeitems",i)
},removeAllItems:function(){var i=this.__getItems();
this.removeItems(i);
return i
},addItems:function(j){var i=this.scrollContainer;
i.append(j);
this.__updateItemsList();
f.Event.fire(this,"additems",j)
},move:function(l,i){if(i===0){return
}var j=this;
if(i>0){l=d(l.get().reverse())
}l.each(function(p){var m=j.items.index(this);
var n=m+i;
var o=j.items[n];
if(i<0){d(this).insertBefore(o)
}else{d(this).insertAfter(o)
}j.index=j.index+i;
j.__updateItemsList()
});
f.Event.fire(this,"moveitems",l)
},getItemByIndex:function(i){if(i>=0&&i<this.items.length){return this.items[i]
}},getClientSelectItemByIndex:function(i){if(i>=0&&i<this.items.length){return d(this.items[i]).data("clientSelectItem")
}},resetSelection:function(){var i=this.currentSelectItem();
if(i){this.unselectItem(d(i))
}this.index=-1
},isList:function(j){var i=j.parents("."+this.listCss).attr("id");
return(i&&(i==this.getId()))
},length:function(){return this.items.length
},__updateIndex:function(i){if(i===null){this.index=-1
}else{var j=this.items.index(i);
if(j<0){j=0
}else{if(j>=this.items.length){j=this.items.length-1
}}this.index=j
}},__updateItemsList:function(){return(this.items=this.list.find("."+this.itemCss))
},__storeClientSelectItems:function(j){var i=[];
d.each(j,function(l){i[this.id]=this
});
this.items.each(function(n){var m=d(this);
var o=m.attr("id");
var l=i[o];
m.data("clientSelectItem",l)
})
},__select:function(j,i){var l=this.items.index(j);
this.__selectByIndex(l,i)
},__selectByIndex:function(m,j){if(!this.__isSelectByIndexValid(m)){return
}if(!this.clickRequiredToSelect&&this.index==m){return
}var i=this.__unselectPrevious();
if(this.clickRequiredToSelect&&i==m){return
}this.index=this.__sanitizeSelectedIndex(m);
var l=this.items.eq(this.index);
if(this.isSelected(l)){this.unselectItem(l)
}else{this.selectItem(l)
}},__isSelectByIndexValid:function(i){if(this.items.length==0){return false
}if(i==undefined){this.index=-1;
return false
}return true
},__sanitizeSelectedIndex:function(i){var j;
if(i<0){j=0
}else{if(i>=this.items.length){j=this.items.length-1
}else{j=i
}}return j
},__unselectPrevious:function(){var i=this.index;
if(i!=-1){var j=this.items.eq(i);
this.unselectItem(j);
this.index=-1
}return i
},__selectItemByValue:function(i){var j=null;
this.resetSelection();
var l=this;
this.__getItems().each(function(m){if(d(this).data("clientSelectItem").value==i){l.__selectByIndex(m);
j=d(this);
return false
}});
return j
},csvEncodeValues:function(){var i=new Array();
this.__getItems().each(function(j){i.push(d(this).data("clientSelectItem").value)
});
return i.join(",")
},__selectCurrent:function(){var i;
if(this.items&&this.index>=0){i=this.items.eq(this.index);
this.processItem(i)
}},__getAdjacentIndex:function(i){var j=this.index+i;
if(j<0){j=this.items.length-1
}else{if(j>=this.items.length){j=0
}}return j
},__selectPrev:function(){this.__selectByIndex(this.__getAdjacentIndex(-1))
},__selectNext:function(){this.__selectByIndex(this.__getAdjacentIndex(1))
},__getItem:function(i){return d(i.target).closest("."+this.itemCss,i.currentTarget).get(0)
},__getItems:function(){return this.items
},__setItems:function(i){this.items=i
},__scrollToSelectedItem:function(){if(this.scrollContainer){var n=this.scrollContainer[0].getBoundingClientRect(),l=this.items.get(this.index).getBoundingClientRect();
if(n.top<l.top&&l.bottom<n.bottom){return
}var i=l.top,m=n.top,j=this.scrollContainer.scrollTop()+i-m;
this.scrollContainer.scrollTop(j)
}},setFocus:function(){this.focusKeeper.focus()
}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(e,f){f.ui=f.ui||{};
var c={rejectClass:"rf-ind-rejt",acceptClass:"rf-ind-acpt",draggingClass:"rf-ind-drag"};
f.ui.Draggable=function(g,j){this.options={};
e.extend(this.options,a,j||{});
d.constructor.call(this,g);
this.id=g;
this.namespace=this.namespace||"."+f.Event.createNamespace(this.name,this.id);
this.parentId=this.options.parentId;
this.attachToDom(this.parentId);
this.dragElement=e(document.getElementById(this.options.parentId));
this.dragElement.draggable();
if(j.indicator){var i=e(document.getElementById(j.indicator));
var h=i.clone();
e("*[id]",h).andSelf().each(function(){e(this).removeAttr("id")
});
if(i.attr("id")){h.attr("id",i.attr("id")+"Clone")
}this.dragElement.data("indicator",true);
this.dragElement.draggable("option","helper",function(){return h
})
}else{this.dragElement.data("indicator",false);
this.dragElement.draggable("option","helper","clone")
}this.dragElement.draggable("option","addClasses",false);
this.dragElement.draggable("option","appendTo","body");
this.dragElement.data("type",this.options.type);
this.dragElement.data("init",true);
this.dragElement.data("id",this.id);
f.Event.bind(this.dragElement,"dragstart"+this.namespace,this.dragStart,this);
f.Event.bind(this.dragElement,"drag"+this.namespace,this.drag,this)
};
f.BaseNonVisualComponent.extend(f.ui.Draggable);
var d=f.ui.Draggable.$super;
var a={};
e.extend(f.ui.Draggable.prototype,(function(){return{name:"Draggable",dragStart:function(g){var j=g.rf.data;
var l=j.helper[0];
this.parentElement=l.parentNode;
if(this.__isCustomDragIndicator()){j.helper.detach().appendTo("body").show();
var h=(j.helper.width()/2);
var i=(j.helper.height()/2);
this.dragElement.data("ui-draggable").offset.click.left=h;
this.dragElement.data("ui-draggable").offset.click.top=i
}},drag:function(g){var h=g.rf.data;
if(this.__isCustomDragIndicator()){var i=f.component(this.options.indicator);
if(i){h.helper.addClass(i.getDraggingClass())
}else{h.helper.addClass(c.draggingClass)
}}this.__clearDraggableCss(h.helper)
},__isCustomDragIndicator:function(){return this.dragElement.data("indicator")
},__clearDraggableCss:function(g){if(g&&g.removeClass){g.removeClass("ui-draggable-dragging")
}},destroy:function(){this.detach(this.parentId);
f.Event.unbind(this.dragElement,this.namespace);
d.destroy.call(this)
}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(m,f){f.ui=f.ui||{};
var d={getControl:function(n,q,p,o){var s=m.extend({onclick:(p?"RichFaces.$$('Calendar',this)."+p+"("+(o?o:"")+");":"")+"return true;"},q);
return new E("div",s,[new T(n)])
},getSelectedDateControl:function(o){if(!o.selectedDate||o.options.showApplyButton){return""
}var n=f.calendarUtils.formatDate(o.selectedDate,(o.timeType?o.datePattern:o.options.datePattern),o.options.monthLabels,o.options.monthLabelsShort);
var p="RichFaces.$$('Calendar',this).showSelectedDate(); return true;";
var q=(o.options.disabled?new E("div",{"class":"rf-cal-tl-btn-dis"},[new ET(n)]):new E("div",{"class":"rf-cal-tl-btn",onclick:p},[new ET(n)]));
return q
},getTimeControl:function(p){if(!p.selectedDate||!p.timeType){return""
}var n=f.calendarUtils.formatDate(p.selectedDate,p.timePattern,p.options.monthLabels,p.options.monthLabelsShort);
var o="RichFaces.jQuery(this).removeClass('rf-cal-btn-press');";
var q="RichFaces.jQuery(this).addClass('rf-cal-btn-press');";
var s="RichFaces.$$('Calendar',this).showTimeEditor();return true;";
var t=p.options.disabled||p.options.readonly?new E("div",{"class":"rf-cal-tl-btn-btn-dis"},[new ET(n)]):new E("div",{"class":"rf-cal-tl-btn rf-cal-tl-btn-hov rf-cal-btn-press",onclick:s,onmouseover:+o,onmouseout:+q},[new ET(n)]);
return t
},toolButtonAttributes:{className:"rf-cal-tl-btn",onmouseover:"this.className='rf-cal-tl-btn rf-cal-tl-btn-hov'",onmouseout:"this.className='rf-cal-tl-btn'",onmousedown:"this.className='rf-cal-tl-btn rf-cal-tl-btn-hov rf-cal-tl-btn-btn-press'",onmouseup:"this.className='rf-cal-tl-btn rf-cal-tl-btn-hov'"},nextYearControl:function(n){return(!n.calendar.options.disabled?d.getControl(">>",d.toolButtonAttributes,"nextYear"):"")
},previousYearControl:function(n){return(!n.calendar.options.disabled?d.getControl("<<",d.toolButtonAttributes,"prevYear"):"")
},nextMonthControl:function(n){return(!n.calendar.options.disabled?d.getControl(">",d.toolButtonAttributes,"nextMonth"):"")
},previousMonthControl:function(n){return(!n.calendar.options.disabled?d.getControl("<",d.toolButtonAttributes,"prevMonth"):"")
},currentMonthControl:function(o){var n=f.calendarUtils.formatDate(o.calendar.getCurrentDate(),"MMMM, yyyy",o.monthLabels,o.monthLabelsShort);
var p=o.calendar.options.disabled?new E("div",{className:"rf-cal-tl-btn-dis"},[new T(n)]):d.getControl(n,d.toolButtonAttributes,"showDateEditor");
return p
},todayControl:function(n){return(!n.calendar.options.disabled&&n.calendar.options.todayControlMode!="hidden"?d.getControl(n.controlLabels.today,d.toolButtonAttributes,"today"):"")
},closeControl:function(n){return(n.calendar.options.popup?d.getControl(n.controlLabels.close,d.toolButtonAttributes,"close","false"):"")
},applyControl:function(n){return(!n.calendar.options.disabled&&!n.calendar.options.readonly&&n.calendar.options.showApplyButton?d.getControl(n.controlLabels.apply,d.toolButtonAttributes,"close","true"):"")
},cleanControl:function(n){return(!n.calendar.options.disabled&&!n.calendar.options.readonly&&n.calendar.selectedDate?d.getControl(n.controlLabels.clean,d.toolButtonAttributes,"__resetSelectedDate"):"")
},selectedDateControl:function(n){return d.getSelectedDateControl(n.calendar)
},timeControl:function(n){return d.getTimeControl(n.calendar)
},timeEditorFields:function(n){return n.calendar.timePatternHtml
},header:[new E("table",{border:"0",cellpadding:"0",cellspacing:"0",width:"100%"},[new E("tbody",{},[new E("tr",{},[new E("td",{"class":"rf-cal-tl"},[new ET(function(n){return f.calendarTemplates.evalMacro("previousYearControl",n)
})]),new E("td",{"class":"rf-cal-tl"},[new ET(function(n){return f.calendarTemplates.evalMacro("previousMonthControl",n)
})]),new E("td",{"class":"rf-cal-hdr-month"},[new ET(function(n){return f.calendarTemplates.evalMacro("currentMonthControl",n)
})]),new E("td",{"class":"rf-cal-tl"},[new ET(function(n){return f.calendarTemplates.evalMacro("nextMonthControl",n)
})]),new E("td",{"class":"rf-cal-tl"},[new ET(function(n){return f.calendarTemplates.evalMacro("nextYearControl",n)
})]),new E("td",{"class":"rf-cal-tl rf-cal-btn-close",style:function(n){return(this.isEmpty?"display:none;":"")
}},[new ET(function(n){return f.calendarTemplates.evalMacro("closeControl",n)
})])])])])],footer:[new E("table",{border:"0",cellpadding:"0",cellspacing:"0",width:"100%"},[new E("tbody",{},[new E("tr",{},[new E("td",{"class":"rf-cal-tl-ftr",style:function(n){return(this.isEmpty?"display:none;":"")
}},[new ET(function(n){return f.calendarTemplates.evalMacro("selectedDateControl",n)
})]),new E("td",{"class":"rf-cal-tl-ftr",style:function(n){return(this.isEmpty?"display:none;":"")
}},[new ET(function(n){return f.calendarTemplates.evalMacro("cleanControl",n)
})]),new E("td",{"class":"rf-cal-tl-ftr",style:function(n){return(this.isEmpty?"display:none;":"")
}},[new ET(function(n){return f.calendarTemplates.evalMacro("timeControl",n)
})]),new E("td",{"class":"rf-cal-tl-ftr",style:"background-image:none;",width:"100%"},[]),new E("td",{"class":"rf-cal-tl-ftr",style:function(n){return(this.isEmpty?"display:none;":"")+(n.calendar.options.disabled||n.calendar.options.readonly||!n.calendar.options.showApplyButton?"background-image:none;":"")
}},[new ET(function(n){return f.calendarTemplates.evalMacro("todayControl",n)
})]),new E("td",{"class":"rf-cal-tl-ftr",style:function(n){return(this.isEmpty?"display:none;":"")+"background-image:none;"
}},[new ET(function(n){return f.calendarTemplates.evalMacro("applyControl",n)
})])])])])],timeEditorLayout:[new E("table",{id:function(n){return n.calendar.TIME_EDITOR_LAYOUT_ID
},border:"0",cellpadding:"0",cellspacing:"0","class":"rf-cal-timepicker-cnt"},[new E("tbody",{},[new E("tr",{},[new E("td",{"class":"rf-cal-timepicker-inp",colspan:"2",align:"center"},[new ET(function(n){return f.calendarTemplates.evalMacro("timeEditorFields",n)
})])]),new E("tr",{},[new E("td",{"class":"rf-cal-timepicker-ok"},[new E("div",{id:function(n){return n.calendar.TIME_EDITOR_BUTTON_OK
},"class":"rf-cal-time-btn",style:"float:right;",onmousedown:"RichFaces.jQuery(this).addClass('rf-cal-time-btn-press');",onmouseout:"RichFaces.jQuery(this).removeClass('rf-cal-time-btn-press');",onmouseup:"RichFaces.jQuery(this).removeClass('rf-cal-time-btn-press');",onclick:function(n){return"RichFaces.component('"+n.calendar.id+"').hideTimeEditor(true)"
}},[new E("span",{},[new ET(function(n){return n.controlLabels.ok
})])])]),new E("td",{"class":"rf-cal-timepicker-cancel"},[new E("div",{id:function(n){return n.calendar.TIME_EDITOR_BUTTON_CANCEL
},"class":"rf-cal-time-btn",style:"float:left;",onmousedown:"RichFaces.jQuery(this).addClass('rf-cal-time-btn-press');",onmouseout:"RichFaces.jQuery(this).removeClass('rf-cal-time-btn-press');",onmouseup:"RichFaces.jQuery(this).removeClass('rf-cal-time-btn-press');",onclick:function(n){return"RichFaces.component('"+n.calendar.id+"').hideTimeEditor(false)"
}},[new E("span",{},[new ET(function(n){return n.controlLabels.cancel
})])])])])])])],dayList:[new ET(function(n){return n.day
})],weekNumber:[new ET(function(n){return n.weekNumber
})],weekDay:[new ET(function(n){return n.weekDayLabelShort
})]};
var j=function(n){this.calendar=n;
this.monthLabels=n.options.monthLabels;
this.monthLabelsShort=n.options.monthLabelsShort;
this.weekDayLabels=n.options.weekDayLabels;
this.weekDayLabelsShort=n.options.weekDayLabelsShort;
this.controlLabels=n.options.labels
};
m.extend(j.prototype,{nextYearControl:d.nextYearControl,previousYearControl:d.previousYearControl,nextMonthControl:d.nextMonthControl,previousMonthControl:d.previousMonthControl,currentMonthControl:d.currentMonthControl,selectedDateControl:d.selectedDateControl,cleanControl:d.cleanControl,timeControl:d.timeControl,todayControl:d.todayControl,closeControl:d.closeControl,applyControl:d.applyControl,timeEditorFields:d.timeEditorFields});
var c={showWeekDaysBar:true,showWeeksBar:true,datePattern:"MMM d, yyyy",horizontalOffset:0,verticalOffset:0,dayListMarkup:d.dayList,weekNumberMarkup:d.weekNumber,weekDayMarkup:d.weekDay,headerMarkup:d.header,footerMarkup:d.footer,isDayEnabled:function(n){return true
},dayStyleClass:function(n){return""
},showHeader:true,showFooter:true,direction:"AA",jointPoint:"AA",popup:true,boundaryDatesMode:"inactive",todayControlMode:"select",style:"",className:"",disabled:false,readonly:false,enableManualInput:false,showInput:true,resetTimeOnDateSelect:false,style:"z-index: 3;",showApplyButton:false,selectedDate:null,currentDate:null,defaultTime:{hours:12,minutes:0,seconds:0},mode:"client",hidePopupOnScroll:true,defaultLabel:""};
var g={apply:"Apply",today:"Today",clean:"Clean",ok:"OK",cancel:"Cancel",close:"x"};
var i=["change","dateselect","beforedateselect","currentdateselect","beforecurrentdateselect","currentdateselect","clean","complete","collapse","datemouseout","datemouseover","show","hide","timeselect","beforetimeselect"];
var a=function(o){var n=f.getDomElement(this.INPUT_DATE_ID);
if((n.value==this.options.defaultLabel&&!o)||(o==this.options.defaultLabel&&!n.value)){n.value=o;
if(o){m(n).addClass("rf-cal-dflt-lbl")
}else{m(n).removeClass("rf-cal-dflt-lbl")
}}};
var l=function(n){this.isFocused=n.type=="focus";
if(!this.isFocused&&this.isVisible){return
}a.call(this,(n.type=="focus"?"":this.options.defaultLabel))
};
f.ui.Calendar=function(ab,af,x,I){h.constructor.call(this,ab);
this.namespace="."+f.Event.createNamespace(this.name,ab);
this.options=m.extend(this.options,c,e[af],x,I);
var ah=x.labels||{};
for(var H in g){if(!ah[H]){ah[H]=g[H]
}}this.options.labels=ah;
this.popupOffset=[this.options.horizontalOffset,this.options.verticalOffset];
if(!this.options.popup){this.options.showApplyButton=false
}this.options.boundaryDatesMode=this.options.boundaryDatesMode.toLowerCase();
this.hideBoundaryDatesContent=this.options.boundaryDatesMode=="hidden";
this.options.todayControlMode=this.options.todayControlMode.toLowerCase();
this.setTimeProperties();
this.customDayListMarkup=(this.options.dayListMarkup!=d.dayList);
this.currentDate=this.options.currentDate?this.options.currentDate:(this.options.selectedDate?this.options.selectedDate:new Date());
this.currentDate.setDate(1);
this.selectedDate=this.options.selectedDate;
this.todayDate=new Date();
this.firstWeekendDayNumber=6-this.options.firstWeekDay;
this.secondWeekendDayNumber=(this.options.firstWeekDay>0?7-this.options.firstWeekDay:0);
this.calendarContext=new j(this);
this.DATE_ELEMENT_ID=this.id+"DayCell";
this.WEEKNUMBER_BAR_ID=this.id+"WeekNum";
this.WEEKNUMBER_ELEMENT_ID=this.WEEKNUMBER_BAR_ID+"Cell";
this.WEEKDAY_BAR_ID=this.id+"WeekDay";
this.WEEKDAY_ELEMENT_ID=this.WEEKDAY_BAR_ID+"Cell";
this.POPUP_ID=this.id+"Popup";
this.POPUP_BUTTON_ID=this.id+"PopupButton";
this.INPUT_DATE_ID=this.id+"InputDate";
this.EDITOR_ID=this.id+"Editor";
this.EDITOR_SHADOW_ID=this.id+"EditorShadow";
this.TIME_EDITOR_LAYOUT_ID=this.id+"TimeEditorLayout";
this.DATE_EDITOR_LAYOUT_ID=this.id+"DateEditorLayout";
this.EDITOR_LAYOUT_SHADOW_ID=this.id+"EditorLayoutShadow";
this.TIME_EDITOR_BUTTON_OK=this.id+"TimeEditorButtonOk";
this.TIME_EDITOR_BUTTON_CANCEL=this.id+"TimeEditorButtonCancel";
this.DATE_EDITOR_BUTTON_OK=this.id+"DateEditorButtonOk";
this.DATE_EDITOR_BUTTON_CANCEL=this.id+"DateEditorButtonCancel";
this.CALENDAR_CONTENT=this.id+"Content";
this.firstDateIndex=0;
this.daysData={startDate:null,days:[]};
this.days=[];
this.todayCellId=null;
this.todayCellColor="";
this.selectedDateCellId=null;
this.selectedDateCellColor="";
var u="";
this.isVisible=true;
if(this.options.popup==true){u="display:none; position:absolute;";
this.isVisible=false
}var ad="RichFaces.component('"+this.id+"').";
var t='<table id="'+this.CALENDAR_CONTENT+'" border="0" cellpadding="0" cellspacing="0" class="rf-cal-extr rf-cal-popup '+this.options.styleClass+'" style="'+u+this.options.style+'" onclick="'+ad+'skipEventOnCollapse=true;"><tbody>';
var z=(this.options.showWeeksBar?"8":"7");
var v=(this.options.optionalHeaderMarkup)?'<tr><td class="rf-cal-hdr-optnl" colspan="'+z+'" id="'+this.id+'HeaderOptional"></td></tr>':"";
var ac=(this.options.optionalFooterMarkup)?'<tr><td class="rf-cal-ftr-optl" colspan="'+z+'" id="'+this.id+'FooterOptional"></td></tr>':"";
var L=(this.options.showHeader?'<tr><td class="rf-cal-hdr" colspan="'+z+'" id="'+this.id+'Header"></td></tr>':"");
var ag=(this.options.showFooter?'<tr><td class="rf-cal-ftr" colspan="'+z+'" id="'+this.id+'Footer"></td></tr>':"");
var y="</tbody></table>";
var p;
var G;
var s=[];
var A;
var B=this.options.disabled||this.options.readonly?"":'onclick="'+ad+'eventCellOnClick(event, this);" onmouseover="'+ad+'eventCellOnMouseOver(event, this);" onmouseout="'+ad+'eventCellOnMouseOut(event, this);"';
if(this.options.showWeekDaysBar){s.push('<tr id="'+this.WEEKDAY_BAR_ID+'">');
if(this.options.showWeeksBar){s.push('<td class="rf-cal-day-lbl"><br/></td>')
}var J=this.options.firstWeekDay;
for(var ae=0;
ae<7;
ae++){A={weekDayLabel:this.options.weekDayLabels[J],weekDayLabelShort:this.options.weekDayLabelsShort[J],weekDayNumber:J,isWeekend:this.isWeekend(ae),elementId:this.WEEKDAY_ELEMENT_ID+ae,component:this};
var K=this.evaluateMarkup(this.options.weekDayMarkup,A);
if(J==6){J=0
}else{J++
}p="rf-cal-day-lbl";
if(A.isWeekend){p+=" rf-cal-holliday-lbl"
}if(ae==6){p+=" rf-cal-right-c"
}s.push('<td class="'+p+'" id="'+A.elementId+'">'+K+"</td>")
}s.push("</tr>\n")
}var aa=[];
var ai=0;
this.dayCellClassName=[];
for(k=1;
k<7;
k++){G=(k==6?"rf-btm-c ":"");
aa.push('<tr id="'+this.WEEKNUMBER_BAR_ID+k+'">');
if(this.options.showWeeksBar){A={weekNumber:k,elementId:this.WEEKNUMBER_ELEMENT_ID+k,component:this};
var w=this.evaluateMarkup(this.options.weekNumberMarkup,A);
aa.push('<td class="rf-cal-week '+G+'" id="'+A.elementId+'">'+w+"</td>")
}for(var ae=0;
ae<7;
ae++){p=G+(!this.options.dayCellClass?"rf-cal-c-cnt-overflow":(!this.customDayListMarkup?this.options.dayCellClass:""))+" rf-cal-c";
if(ae==this.firstWeekendDayNumber||ae==this.secondWeekendDayNumber){p+=" rf-cal-holiday"
}if(ae==6){p+=" rf-cal-right-c"
}this.dayCellClassName.push(p);
aa.push('<td class="'+p+'" id="'+this.DATE_ELEMENT_ID+ai+'" '+B+">"+(this.customDayListMarkup?'<div class="rf-cal-c-cnt'+(this.options.dayCellClass?" "+this.options.dayCellClass:"")+'"></div>':"")+"</td>");
ai++
}aa.push("</tr>")
}var aj=f.getDomElement(this.CALENDAR_CONTENT);
aj=m(aj).replaceWith(t+v+L+s.join("")+aa.join("")+ag+ac+y);
this.attachToDom();
aj=null;
if(this.options.popup&&!this.options.disabled){var F=new Function("event","RichFaces.component('"+this.id+"').switchPopup();");
f.Event.bindById(this.POPUP_BUTTON_ID,"click"+this.namespace,F,this);
if(!this.options.enableManualInput){f.Event.bindById(this.INPUT_DATE_ID,"click"+this.namespace,F,this)
}if(this.options.defaultLabel){a.call(this,this.options.defaultLabel);
f.Event.bindById(this.INPUT_DATE_ID,"focus"+this.namespace+" blur"+this.namespace,l,this)
}}this.scrollElements=null;
this.isAjaxMode=this.options.mode=="ajax"
};
f.BaseComponent.extend(f.ui.Calendar);
var h=f.ui.Calendar.$super;
var e={};
f.ui.Calendar.addLocale=function(o,n){if(!e[o]){e[o]=n
}};
m.extend(f.ui.Calendar.prototype,{name:"Calendar",destroy:function(){if(this.options.popup&&this.isVisible){this.scrollElements&&f.Event.unbindScrollEventHandlers(this.scrollElements,this);
this.scrollElements=null;
f.Event.unbind(window.document,"click"+this.namespace)
}h.destroy.call(this)
},dateEditorSelectYear:function(n){if(this.dateEditorYearID){m(f.getDomElement(this.dateEditorYearID)).removeClass("rf-cal-edtr-btn-sel")
}this.dateEditorYear=this.dateEditorStartYear+n;
this.dateEditorYearID=this.DATE_EDITOR_LAYOUT_ID+"Y"+n;
m(f.getDomElement(this.dateEditorYearID)).addClass("rf-cal-edtr-btn-sel")
},dateEditorSelectMonth:function(n){this.dateEditorMonth=n;
m(f.getDomElement(this.dateEditorMonthID)).removeClass("rf-cal-edtr-btn-sel");
this.dateEditorMonthID=this.DATE_EDITOR_LAYOUT_ID+"M"+n;
m(f.getDomElement(this.dateEditorMonthID)).addClass("rf-cal-edtr-btn-sel")
},scrollEditorYear:function(o){var q=f.getDomElement(this.DATE_EDITOR_LAYOUT_ID+"TR");
if(this.dateEditorYearID){m(f.getDomElement(this.dateEditorYearID)).removeClass("rf-cal-edtr-btn-sel");
this.dateEditorYearID=""
}if(!o){if(this.dateEditorMonth!=this.getCurrentMonth()){this.dateEditorMonth=this.getCurrentMonth();
m(f.getDomElement(this.dateEditorMonthID)).removeClass("rf-cal-edtr-btn-sel");
this.dateEditorMonthID=this.DATE_EDITOR_LAYOUT_ID+"M"+this.dateEditorMonth;
m(f.getDomElement(this.dateEditorMonthID)).addClass("rf-cal-edtr-btn-sel")
}}if(q){var n;
var p=this.dateEditorStartYear=this.dateEditorStartYear+o*10;
for(var s=0;
s<5;
s++){q=q.nextSibling;
n=q.firstChild.nextSibling.nextSibling;
n.firstChild.innerHTML=p;
if(p==this.dateEditorYear){m(n.firstChild).addClass("rf-cal-edtr-btn-sel");
this.dateEditorYearID=n.firstChild.id
}n=n.nextSibling;
n.firstChild.innerHTML=p+5;
if(p+5==this.dateEditorYear){m(n.firstChild).addClass("rf-cal-edtr-btn-sel");
this.dateEditorYearID=n.firstChild.id
}p++
}}},updateDateEditor:function(){this.dateEditorYear=this.getCurrentYear();
this.dateEditorStartYear=this.getCurrentYear()-4;
this.scrollEditorYear(0)
},updateTimeEditor:function(){var o=f.getDomElement(this.id+"TimeHours");
var p=f.getDomElement(this.id+"TimeSign");
var t=f.getDomElement(this.id+"TimeMinutes");
var q=this.selectedDate.getHours();
var v=this.selectedDate.getMinutes();
if(this.timeType==2){var u=(q<12?"AM":"PM");
p.value=u;
q=(q==0?"12":(q>12?q-12:q))
}o.value=(this.timeHoursDigits==2&&q<10?"0"+q:q);
t.value=(v<10?"0"+v:v);
if(this.showSeconds){var n=f.getDomElement(this.id+"TimeSeconds");
var s=this.selectedDate.getSeconds();
n.value=(s<10?"0"+s:s)
}},createEditor:function(){var o=m(f.getDomElement(this.CALENDAR_CONTENT));
var p=parseInt(o.css("z-index"),10);
var s='<div id="'+this.EDITOR_SHADOW_ID+'" class="rf-cal-edtr-shdw" style="position:absolute; display:none;z-index:'+p+'"></div><table border="0" cellpadding="0" cellspacing="0" id="'+this.EDITOR_ID+'" style="position:absolute; display:none;z-index:'+(p+1)+'" onclick="RichFaces.component(\''+this.id+'\').skipEventOnCollapse=true;"><tbody><tr><td class="rf-cal-edtr-cntr" align="center"><div style="position:relative; display:inline-block;">';
var n='<div id="'+this.EDITOR_LAYOUT_SHADOW_ID+'" class="rf-cal-edtr-layout-shdw"></div>';
var q="</div></td></tr></tbody></table>";
o.after(s+n+q);
this.isEditorCreated=true;
return f.getDomElement(this.EDITOR_ID)
},createTimeEditorLayout:function(q){m(f.getDomElement(this.EDITOR_LAYOUT_SHADOW_ID)).after(this.evaluateMarkup(d.timeEditorLayout,this.calendarContext));
var o=f.getDomElement(this.id+"TimeHours");
var p;
var s=f.getDomElement(this.id+"TimeMinutes");
if(this.timeType==1){sbjQuery(o).SpinButton({digits:this.timeHoursDigits,min:0,max:23})
}else{sbjQuery(o).SpinButton({digits:this.timeHoursDigits,min:1,max:12});
p=f.getDomElement(this.id+"TimeSign");
sbjQuery(p).SpinButton({})
}sbjQuery(s).SpinButton({digits:2,min:0,max:59});
if(this.showSeconds){var n=f.getDomElement(this.id+"TimeSeconds");
sbjQuery(n).SpinButton({digits:2,min:0,max:59})
}this.correctEditorButtons(q,this.TIME_EDITOR_BUTTON_OK,this.TIME_EDITOR_BUTTON_CANCEL);
this.isTimeEditorLayoutCreated=true
},correctEditorButtons:function(p,t,u){var n=f.getDomElement(t);
var q=f.getDomElement(u);
p.style.visibility="hidden";
p.style.display="";
var o=m(n.firstChild).width();
var s=m(q.firstChild).width();
p.style.display="none";
p.style.visibility="";
if(o!=s){n.style.width=q.style.width=(o>s?o:s)+"px"
}},createDECell:function(n,p,t,o,q){if(t==0){return'<div id="'+n+'" class="rf-cal-edtr-btn'+(q?" "+q:"")+'" onmouseover="this.className=\'rf-cal-edtr-btn rf-cal-edtr-tl-over\';" onmouseout="this.className=\'rf-cal-edtr-btn\';" onmousedown="this.className=\'rf-cal-edtr-btn rf-cal-edtr-tl-press\';" onmouseup="this.className=\'rf-cal-edtr-btn rf-cal-edtr-tl-over\';" onclick="RichFaces.component(\''+this.id+"').scrollEditorYear("+o+');">'+p+"</div>"
}else{var s=(t==1?"RichFaces.component('"+this.id+"').dateEditorSelectMonth("+o+");":"RichFaces.component('"+this.id+"').dateEditorSelectYear("+o+");");
return'<div id="'+n+'" class="rf-cal-edtr-btn'+(q?" "+q:"")+'" onmouseover="RichFaces.jQuery(this).addClass(\'rf-cal-edtr-btn-over\');" onmouseout="$(this).removeClass(\'rf-cal-edtr-btn-over\');" onclick="'+s+'">'+p+"</div>"
}},createDateEditorLayout:function(p){var u='<table id="'+this.DATE_EDITOR_LAYOUT_ID+'" class="rf-cal-monthpicker-cnt" border="0" cellpadding="0" cellspacing="0"><tbody><tr id="'+this.DATE_EDITOR_LAYOUT_ID+'TR">';
var t="</tr></tbody></table>";
var o=0;
this.dateEditorYear=this.getCurrentYear();
var q=this.dateEditorStartYear=this.dateEditorYear-4;
var n='<td align="center">'+this.createDECell(this.DATE_EDITOR_LAYOUT_ID+"M"+o,this.options.monthLabelsShort[o],1,o)+'</td><td align="center" class="rf-cal-monthpicker-split">'+this.createDECell(this.DATE_EDITOR_LAYOUT_ID+"M"+(o+6),this.options.monthLabelsShort[o+6],1,o+6)+'</td><td align="center">'+this.createDECell("","&lt;",0,-1)+'</td><td align="center">'+this.createDECell("","&gt;",0,1)+"</td>";
o++;
for(var s=0;
s<5;
s++){n+='</tr><tr><td align="center">'+this.createDECell(this.DATE_EDITOR_LAYOUT_ID+"M"+o,this.options.monthLabelsShort[o],1,o)+'</td><td align="center" class="rf-cal-monthpicker-split">'+this.createDECell(this.DATE_EDITOR_LAYOUT_ID+"M"+(o+6),this.options.monthLabelsShort[o+6],1,o+6)+'</td><td align="center">'+this.createDECell(this.DATE_EDITOR_LAYOUT_ID+"Y"+s,q,2,s,(s==4?"rf-cal-edtr-btn-sel":""))+'</td><td align="center">'+this.createDECell(this.DATE_EDITOR_LAYOUT_ID+"Y"+(s+5),q+5,2,s+5)+"</td>";
o++;
q++
}this.dateEditorYearID=this.DATE_EDITOR_LAYOUT_ID+"Y4";
this.dateEditorMonth=this.getCurrentMonth();
this.dateEditorMonthID=this.DATE_EDITOR_LAYOUT_ID+"M"+this.dateEditorMonth;
n+='</tr><tr><td colspan="2" class="rf-cal-monthpicker-ok"><div id="'+this.DATE_EDITOR_BUTTON_OK+'" class="rf-cal-time-btn" style="float:right;" onmousedown="RichFaces.jQuery(this).addClass(\'rf-cal-time-btn-press\');" onmouseout="RichFaces.jQuery(this).removeClass(\'rf-cal-time-btn-press\');" onmouseup="RichFaces.jQuery(this).removeClass(\'rf-cal-time-btn-press\');" onclick="RichFaces.component(\''+this.id+"').hideDateEditor(true);\"><span>"+this.options.labels.ok+'</span></div></td><td colspan="2" class="rf-cal-monthpicker-cancel"><div id="'+this.DATE_EDITOR_BUTTON_CANCEL+'" class="rf-cal-time-btn" style="float:left;" onmousedown="RichFaces.jQuery(this).addClass(\'rf-cal-time-btn-press\');" onmouseout="RichFaces.jQuery(this).removeClass(\'rf-cal-time-btn-press\');" onmouseup="RichFaces.jQuery(this).removeClass(\'rf-cal-time-btn-press\');" onclick="RichFaces.component(\''+this.id+"').hideDateEditor(false);\"><span>"+this.options.labels.cancel+"</span></div></td>";
m(f.getDomElement(this.EDITOR_LAYOUT_SHADOW_ID)).after(u+n+t);
m(f.getDomElement(this.dateEditorMonthID)).addClass("rf-cal-edtr-btn-sel");
this.correctEditorButtons(p,this.DATE_EDITOR_BUTTON_OK,this.DATE_EDITOR_BUTTON_CANCEL);
this.isDateEditorLayoutCreated=true
},createSpinnerTable:function(n){return'<table cellspacing="0" cellpadding="0" border="0"><tbody><tr><td class="rf-cal-sp-inp-ctnr"><input id="'+n+'" name="'+n+'" class="rf-cal-sp-inp" type="text" /></td><td class="rf-cal-sp-btn"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div id="'+n+'BtnUp" class="rf-cal-sp-up" onmousedown="this.className=\'rf-cal-sp-up rf-cal-sp-press\'" onmouseup="this.className=\'rf-cal-sp-up\'" onmouseout="this.className=\'rf-cal-sp-up\'"><span></span></div></td></tr><tr><td><div id="'+n+'BtnDown" class="rf-cal-sp-down" onmousedown="this.className=\'rf-cal-sp-down rf-cal-sp-press\'" onmouseup="this.className=\'rf-cal-sp-down\'" onmouseout="this.className=\'rf-cal-sp-down\'"><span></span></div></td></tr></tbody></table></td></tr></tbody></table>'
},setTimeProperties:function(){this.timeType=0;
var w=this.options.datePattern;
var H=[];
var p=/(\\\\|\\[yMdaHhms])|(y+|M+|d+|a|H{1,2}|h{1,2}|m{2}|s{2})/g;
var s;
while(s=p.exec(w)){if(!s[1]){H.push({str:s[0],marker:s[2],idx:s.index})
}}var A="";
var G="";
var y,I,z,o,t,F;
var q=this.id;
var B=function(J){return(J.length==0?v.marker:w.substring(H[n-1].str.length+H[n-1].idx,v.idx+v.str.length))
};
for(var n=0;
n<H.length;
n++){var v=H[n];
var x=v.marker.charAt(0);
if(x=="y"||x=="M"||x=="d"){A+=B(A)
}else{if(x=="a"){F=true;
G+=B(G)
}else{if(x=="H"){I=true;
y=v.marker.length;
G+=B(G)
}else{if(x=="h"){z=true;
y=v.marker.length;
G+=B(G)
}else{if(x=="m"){o=true;
G+=B(G)
}else{if(x=="s"){this.showSeconds=true;
G+=B(G)
}}}}}}}this.datePattern=A;
this.timePattern=G;
var u=this;
this.timePatternHtml=G.replace(/(\\\\|\\[yMdaHhms])|(H{1,2}|h{1,2}|m{2}|s{2}|a)/g,function(J,K,L){if(K){return K.charAt(1)
}switch(L){case"a":return"</td><td>"+u.createSpinnerTable(q+"TimeSign")+"</td><td>";
case"H":case"HH":case"h":case"hh":return"</td><td>"+u.createSpinnerTable(q+"TimeHours")+"</td><td>";
case"mm":return"</td><td>"+u.createSpinnerTable(q+"TimeMinutes")+"</td><td>";
case"ss":return"</td><td>"+u.createSpinnerTable(q+"TimeSeconds")+"</td><td>"
}});
this.timePatternHtml='<table border="0" cellpadding="0"><tbody><tr><td>'+this.timePatternHtml+"</td></tr></tbody></table>";
if(o&&I){this.timeType=1
}else{if(o&&z&&F){this.timeType=2
}}this.timeHoursDigits=y
},eventOnScroll:function(n){this.hidePopup()
},hidePopup:function(){if(!this.options.popup||!this.isVisible){return
}if(this.invokeEvent("hide",f.getDomElement(this.id))){if(this.isEditorVisible){this.hideEditor()
}this.scrollElements&&f.Event.unbindScrollEventHandlers(this.scrollElements,this);
this.scrollElements=null;
f.Event.unbind(window.document,"click"+this.namespace);
m(f.getDomElement(this.CALENDAR_CONTENT)).hide();
this.isVisible=false;
if(this.options.defaultLabel&&!this.isFocused){a.call(this,this.options.defaultLabel)
}}},showPopup:function(o){if(!this.isRendered){this.isRendered=true;
this.render()
}this.skipEventOnCollapse=false;
if(o&&o.type=="click"){this.skipEventOnCollapse=true
}if(!this.options.popup||this.isVisible){return
}var s=f.getDomElement(this.id);
if(this.invokeEvent("show",s,o)){var p=f.getDomElement(this.POPUP_ID);
var n=p.firstChild;
var q=n.nextSibling;
if(this.options.defaultLabel){if(!this.isFocused){a.call(this,"")
}}if(n.value){this.__selectDate(n.value,false,{event:o,element:s})
}if(this.options.showInput){p=p.children
}else{p=q
}m(f.getDomElement(this.CALENDAR_CONTENT)).setPosition(p,{type:"DROPDOWN",from:this.options.jointPoint,to:this.options.direction,offset:this.popupOffset}).show();
this.isVisible=true;
f.Event.bind(window.document,"click"+this.namespace,this.eventOnCollapse,this);
this.scrollElements&&f.Event.unbindScrollEventHandlers(this.scrollElements,this);
this.scrollElements=null;
if(this.options.hidePopupOnScroll){this.scrollElements=f.Event.bindScrollEventHandlers(s,this.eventOnScroll,this)
}}},switchPopup:function(n){this.isVisible?this.hidePopup():this.showPopup(n)
},eventOnCollapse:function(n){if(this.skipEventOnCollapse){this.skipEventOnCollapse=false;
return true
}if(n.target.id==this.POPUP_BUTTON_ID||(!this.options.enableManualInput&&n.target.id==this.INPUT_DATE_ID)){return true
}this.hidePopup();
return true
},setInputField:function(p,o){var n=f.getDomElement(this.INPUT_DATE_ID);
if(n.value!=p){n.value=p;
this.invokeEvent("change",f.getDomElement(this.id),o,this.selectedDate);
m(f.getDomElement(this.INPUT_DATE_ID)).blur()
}},getCurrentDate:function(){return this.currentDate
},__getSelectedDate:function(){if(!this.selectedDate){return null
}else{return this.selectedDate
}},__getSelectedDateString:function(n){if(!this.selectedDate){return""
}if(!n){n=this.options.datePattern
}return f.calendarUtils.formatDate(this.selectedDate,n,this.options.monthLabels,this.options.monthLabelsShort)
},getPrevYear:function(){var n=this.currentDate.getFullYear()-1;
if(n<0){n=0
}return n
},getPrevMonth:function(o){var n=this.currentDate.getMonth()-1;
if(n<0){n=11
}if(o){return this.options.monthLabels[n]
}else{return n
}},getCurrentYear:function(){return this.currentDate.getFullYear()
},getCurrentMonth:function(o){var n=this.currentDate.getMonth();
if(o){return this.options.monthLabels[n]
}else{return n
}},getNextYear:function(){return this.currentDate.getFullYear()+1
},getNextMonth:function(o){var n=this.currentDate.getMonth()+1;
if(n>11){n=0
}if(o){return this.options.monthLabels[n]
}else{return n
}},isWeekend:function(n){return(n==this.firstWeekendDayNumber||n==this.secondWeekendDayNumber)
},setupTimeForDate:function(n){var o=new Date(n);
if(this.selectedDate&&(!this.options.resetTimeOnDateSelect||(this.selectedDate.getFullYear()==n.getFullYear()&&this.selectedDate.getMonth()==n.getMonth()&&this.selectedDate.getDate()==n.getDate()))){o=f.calendarUtils.createDate(n.getFullYear(),n.getMonth(),n.getDate(),this.selectedDate.getHours(),this.selectedDate.getMinutes(),this.selectedDate.getSeconds())
}else{o=f.calendarUtils.createDate(n.getFullYear(),n.getMonth(),n.getDate(),this.options.defaultTime.hours,this.options.defaultTime.minutes,this.options.defaultTime.seconds)
}return o
},eventCellOnClick:function(n,o){var p=this.days[parseInt(o.id.substr(this.DATE_ELEMENT_ID.length),10)];
if(p.enabled&&p._month==0){var q=f.calendarUtils.createDate(this.currentDate.getFullYear(),this.currentDate.getMonth(),p.day);
if(this.timeType){q=this.setupTimeForDate(q)
}if(this.__selectDate(q,true,{event:n,element:o})&&!this.options.showApplyButton){this.hidePopup()
}}else{if(p._month!=0){if(this.options.boundaryDatesMode=="scroll"){if(p._month==-1){this.prevMonth()
}else{this.nextMonth()
}}else{if(this.options.boundaryDatesMode=="select"){var q=new Date(p.date);
if(this.timeType){q=this.setupTimeForDate(q)
}if(this.__selectDate(q,false,{event:n,element:o})&&!this.options.showApplyButton){this.hidePopup()
}}}}}},eventCellOnMouseOver:function(n,o){var p=this.days[parseInt(o.id.substr(this.DATE_ELEMENT_ID.length),10)];
if(this.invokeEvent("datemouseover",o,n,p.date)&&p.enabled){if(p._month==0&&o.id!=this.selectedDateCellId&&o.id!=this.todayCellId){m(o).addClass("rf-cal-hov")
}}},eventCellOnMouseOut:function(n,o){var p=this.days[parseInt(o.id.substr(this.DATE_ELEMENT_ID.length),10)];
if(this.invokeEvent("datemouseout",o,n,p.date)&&p.enabled){if(p._month==0&&o.id!=this.selectedDateCellId&&o.id!=this.todayCellId){m(o).removeClass("rf-cal-hov")
}}},load:function(n,o){if(n){this.daysData=this.indexData(n,o)
}else{this.daysData=null
}this.isRendered=false;
if(this.isVisible){this.render()
}if(typeof this.afterLoad=="function"){this.afterLoad();
this.afterLoad=null
}},indexData:function(n,q){var p=n.startDate.year;
var o=n.startDate.month;
n.startDate=new Date(p,o);
n.index=[];
n.index[p+"-"+o]=0;
if(q){this.currentDate=n.startDate;
this.currentDate.setDate(1);
return n
}var s=f.calendarUtils.daysInMonthByDate(n.startDate)-n.startDate.getDate()+1;
while(n.days[s]){if(o==11){p++;
o=0
}else{o++
}n.index[p+"-"+o]=s;
s+=(32-new Date(p,o,32).getDate())
}return n
},getCellBackgroundColor:function(n){return m(n).css("background-color")
},clearEffect:function(q,p,n){if(q){var o=m(f.getDomElement(q)).stop(true,true);
if(p){o.removeClass(p)
}if(n){o.addClass(n)
}}return null
},render:function(){this.isRendered=true;
this.todayDate=new Date();
var J=this.getCurrentYear();
var ai=this.getCurrentMonth();
var u=(J==this.todayDate.getFullYear()&&ai==this.todayDate.getMonth());
var aj=this.todayDate.getDate();
var ah=this.selectedDate&&(J==this.selectedDate.getFullYear()&&ai==this.selectedDate.getMonth());
var ad=this.selectedDate&&this.selectedDate.getDate();
var y=f.calendarUtils.getDay(this.currentDate,this.options.firstWeekDay);
var z=f.calendarUtils.daysInMonthByDate(this.currentDate);
var H=f.calendarUtils.daysInMonth(J,ai-1);
var ak=0;
var K=-1;
this.days=[];
var v=H-y+1;
if(y>0){while(v<=H){this.days.push({day:v,isWeekend:this.isWeekend(ak),_month:K});
v++;
ak++
}}v=1;
K=0;
this.firstDateIndex=ak;
if(this.daysData&&this.daysData.index[J+"-"+ai]!=undefined){var al=this.daysData.index[J+"-"+ai];
if(this.daysData.startDate.getFullYear()==J&&this.daysData.startDate.getMonth()==ai){var w=w=(this.daysData.days[al].day?this.daysData.days[al].day:this.daysData.startDate.getDate());
while(v<w){this.days.push({day:v,isWeekend:this.isWeekend(ak%7),_month:K});
v++;
ak++
}}var ae=this.daysData.days.length;
var t;
var af;
while(al<ae&&v<=z){af=this.isWeekend(ak%7);
t=this.daysData.days[al];
t.day=v;
t.isWeekend=af;
t._month=K;
this.days.push(t);
al++;
v++;
ak++
}}while(ak<42){if(v>z){v=1;
K=1
}this.days.push({day:v,isWeekend:this.isWeekend(ak%7),_month:K});
v++;
ak++
}this.renderHF();
ak=0;
var G;
var x;
var B;
if(this.options.showWeeksBar){B=f.calendarUtils.weekNumber(J,ai,this.options.minDaysInFirstWeek,this.options.firstWeekDay)
}this.selectedDayElement=null;
var p=true;
var ac;
var aa=(this.options.boundaryDatesMode=="scroll"||this.options.boundaryDatesMode=="select");
this.todayCellId=this.clearEffect(this.todayCellId);
this.selectedDateCellId=this.clearEffect(this.selectedDateCellId);
var t=f.getDomElement(this.WEEKNUMBER_BAR_ID+"1");
for(var ag=1;
ag<7;
ag++){x=this.days[ak];
G=t.firstChild;
var ab;
if(this.options.showWeeksBar){if(p&&ai==11&&(ag==5||ag==6)&&(x._month==1||(7-(z-x.day+1))>=this.options.minDaysInFirstWeek)){B=1;
p=false
}ab=B;
G.innerHTML=this.evaluateMarkup(this.options.weekNumberMarkup,{weekNumber:B++,elementId:G.id,component:this});
if(ag==1&&B>52){B=1
}G=G.nextSibling
}var I=this.options.firstWeekDay;
var A=null;
while(G){x.elementId=G.id;
x.date=new Date(J,ai+x._month,x.day);
x.weekNumber=ab;
x.component=this;
x.isCurrentMonth=(x._month==0);
x.weekDayNumber=I;
if(x.enabled!=false){x.enabled=this.options.isDayEnabled(x)
}if(!x.styleClass){x.customStyleClass=this.options.dayStyleClass(x)
}else{var F=this.options.dayStyleClass(x);
x.customStyleClass=x.styleClass;
if(F){x.customStyleClass+=" "+F
}}A=(this.customDayListMarkup?G.firstChild:G);
A.innerHTML=this.hideBoundaryDatesContent&&x._month!=0?"":this.evaluateMarkup(this.options.dayListMarkup,x);
if(I==6){I=0
}else{I++
}var L=this.dayCellClassName[ak];
if(x._month!=0){L+=" rf-cal-boundary-day";
if(!this.options.disabled&&!this.options.readonly&&aa){L+=" rf-cal-btn"
}}else{if(u&&x.day==aj){this.todayCellId=G.id;
this.todayCellColor=this.getCellBackgroundColor(G);
L+=" rf-cal-today"
}if(ah&&x.day==ad){this.selectedDateCellId=G.id;
this.selectedDateCellColor=this.getCellBackgroundColor(G);
L+=" rf-cal-sel"
}else{if(!this.options.disabled&&!this.options.readonly&&x.enabled){L+=" rf-cal-btn"
}}if(x.customStyleClass){L+=" "+x.customStyleClass
}}G.className=L;
ak++;
x=this.days[ak];
G=G.nextSibling
}t=t.nextSibling
}},renderHF:function(){if(this.options.showHeader){this.renderMarkup(this.options.headerMarkup,this.id+"Header",this.calendarContext)
}if(this.options.showFooter){this.renderMarkup(this.options.footerMarkup,this.id+"Footer",this.calendarContext)
}this.renderHeaderOptional();
this.renderFooterOptional()
},renderHeaderOptional:function(){this.renderMarkup(this.options.optionalHeaderMarkup,this.id+"HeaderOptional",this.calendarContext)
},renderFooterOptional:function(){this.renderMarkup(this.options.optionalFooterMarkup,this.id+"FooterOptional",this.calendarContext)
},renderMarkup:function(p,q,o){if(!p){return
}var n=f.getDomElement(q);
if(!n){return
}n.innerHTML=this.evaluateMarkup(p,o)
},evaluateMarkup:function(p,n){if(!p){return""
}var q=[];
var s;
for(var o=0;
o<p.length;
o++){s=p[o];
if(s.getContent){q.push(s.getContent(n))
}}return q.join("")
},onUpdate:function(){var n=f.calendarUtils.formatDate(this.getCurrentDate(),"MM/yyyy");
f.getDomElement(this.id+"InputCurrentDate").value=n;
if(this.isAjaxMode&&this.callAjax){this.callAjax.call(this,n)
}else{this.render()
}},callAjax:function(p,t){var n=this;
var q=function(v){var u=v&&v.componentData&&v.componentData[n.id];
n.load(u,true)
};
var s=function(u){};
var o={};
o[this.id+".ajax"]="1";
f.ajax(this.id,null,{parameters:o,error:s,complete:q})
},nextMonth:function(){this.changeCurrentDateOffset(0,1)
},prevMonth:function(){this.changeCurrentDateOffset(0,-1)
},nextYear:function(){this.changeCurrentDateOffset(1,0)
},prevYear:function(){this.changeCurrentDateOffset(-1,0)
},changeCurrentDate:function(p,n,o){if(this.getCurrentMonth()!=n||this.getCurrentYear()!=p){var q=new Date(p,n,1);
if(this.invokeEvent("beforecurrentdateselect",f.getDomElement(this.id),null,q)){this.currentDate=q;
if(o){this.render()
}else{this.onUpdate()
}this.invokeEvent("currentdateselect",f.getDomElement(this.id),null,q);
return true
}}return false
},changeCurrentDateOffset:function(o,n){var p=new Date(this.currentDate.getFullYear()+o,this.currentDate.getMonth()+n,1);
if(this.invokeEvent("beforecurrentdateselect",f.getDomElement(this.id),null,p)){this.currentDate=p;
this.onUpdate();
this.invokeEvent("currentdateselect",f.getDomElement(this.id),null,p)
}},today:function(q,o){var t=new Date();
var p=t.getFullYear();
var n=t.getMonth();
var s=t.getDate();
var u=false;
if(s!=this.todayDate.getDate()){u=true;
this.todayDate=t
}if(p!=this.currentDate.getFullYear()||n!=this.currentDate.getMonth()){u=true;
this.currentDate=new Date(p,n,1)
}if(this.options.todayControlMode=="select"){o=true
}if(u){if(q){this.render()
}else{this.onUpdate()
}}else{if(this.isVisible&&this.todayCellId&&!o){this.clearEffect(this.todayCellId);
if(this.todayCellColor!="transparent"){m(f.getDomElement(this.todayCellId)).effect("highlight",{easing:"easeInOutSine",color:this.todayCellColor},300)
}}}if(this.options.todayControlMode=="select"&&!this.options.disabled&&!this.options.readonly){if(u&&!q&&this.submitFunction){this.afterLoad=this.selectToday
}else{this.selectToday()
}}},selectToday:function(){if(this.todayCellId){var n=this.days[parseInt(this.todayCellId.substr(this.DATE_ELEMENT_ID.length),10)];
var p=new Date();
var o=new Date(p);
if(this.timeType){o=this.setupTimeForDate(o)
}if(n.enabled&&this.__selectDate(o,true)&&!this.options.showApplyButton){this.hidePopup()
}}},__selectDate:function(u,w,o,v){if(!o){o={event:null,element:null}
}if(typeof v==="undefined"){v=!this.options.showApplyButton
}var x=this.selectedDate;
var n;
if(u){if(typeof u=="string"){u=f.calendarUtils.parseDate(u,this.options.datePattern,this.options.monthLabels,this.options.monthLabelsShort)
}n=u
}else{n=null
}var s=true;
var q=false;
if((x-n)&&(x!=null||n!=null)){q=true;
s=this.invokeEvent("beforedateselect",o.element,o.event,u)
}if(s){if(n!=null){if(n.getMonth()==this.currentDate.getMonth()&&n.getFullYear()==this.currentDate.getFullYear()){this.selectedDate=n;
if(!x||(x-this.selectedDate)){var t=m(f.getDomElement(this.DATE_ELEMENT_ID+(this.firstDateIndex+this.selectedDate.getDate()-1)));
this.clearEffect(this.selectedDateCellId,"rf-cal-sel",(this.options.disabled||this.options.readonly?null:"rf-cal-btn"));
this.selectedDateCellId=t.attr("id");
this.selectedDateCellColor=this.getCellBackgroundColor(t);
t.removeClass("rf-cal-btn");
t.removeClass("rf-cal-hov");
t.addClass("rf-cal-sel");
this.renderHF()
}else{if(this.timeType!=0){this.renderHF()
}}}else{this.selectedDate=n;
if(this.changeCurrentDate(n.getFullYear(),n.getMonth(),w)){}else{this.selectedDate=x;
q=false
}}}else{this.selectedDate=null;
this.clearEffect(this.selectedDateCellId,"rf-cal-sel",(this.options.disabled||this.options.readonly?null:"rf-cal-btn"));
if(this.selectedDateCellId){this.selectedDateCellId=null;
this.renderHF()
}var u=new Date();
if(this.currentDate.getMonth()==u.getMonth()&&this.currentDate.getFullYear()==u.getFullYear()){this.renderHF()
}var p=this.options.todayControlMode;
this.options.todayControlMode="";
this.today(w,true);
this.options.todayControlMode=p
}if(q){this.invokeEvent("dateselect",o.element,o.event,this.selectedDate);
if(v===true){this.setInputField(this.selectedDate!=null?this.__getSelectedDateString(this.options.datePattern):"",o.event)
}}}return q
},__resetSelectedDate:function(){if(!this.selectedDate){return
}if(this.invokeEvent("beforedateselect",null,null,null)){this.selectedDate=null;
this.invokeEvent("dateselect",null,null,null);
this.selectedDateCellId=this.clearEffect(this.selectedDateCellId,"rf-cal-sel",(this.options.disabled||this.options.readonly?null:"rf-cal-btn"));
this.invokeEvent("clean",null,null,null);
this.renderHF();
if(!this.options.showApplyButton){this.setInputField("",null);
this.hidePopup()
}}},showSelectedDate:function(){if(!this.selectedDate){return
}if(this.currentDate.getMonth()!=this.selectedDate.getMonth()||this.currentDate.getFullYear()!=this.selectedDate.getFullYear()){this.currentDate=new Date(this.selectedDate);
this.currentDate.setDate(1);
this.onUpdate()
}else{if(this.isVisible&&this.selectedDateCellId){this.clearEffect(this.selectedDateCellId);
if(this.selectedDateCellColor!="transparent"){m(f.getDomElement(this.selectedDateCellId)).effect("highlight",{easing:"easeInOutSine",color:this.selectedDateCellColor},300)
}}}},close:function(n){if(n){this.setInputField(this.__getSelectedDateString(this.options.datePattern),null)
}this.hidePopup()
},clonePosition:function(y,x,t){var u=m(y);
if(!x.length){x=[x]
}t=t||{left:0,top:0};
var w=u.outerWidth()+"px",n=u.outerHeight()+"px";
var o=u.position();
var v=Math.floor(o.left)+t.left+"px",p=Math.floor(o.top)+t.top+"px";
var q;
for(var s=0;
s<x.length;
s++){q=x[s];
q.style.width=w;
q.style.height=n;
q.style.left=v;
q.style.top=p
}},showTimeEditor:function(){var n;
if(this.timeType==0){return
}if(!this.isEditorCreated){n=this.createEditor()
}else{n=f.getDomElement(this.EDITOR_ID)
}if(!this.isTimeEditorLayoutCreated){this.createTimeEditorLayout(n)
}m(f.getDomElement(this.TIME_EDITOR_LAYOUT_ID)).show();
var o=f.getDomElement(this.EDITOR_SHADOW_ID);
this.clonePosition(f.getDomElement(this.CALENDAR_CONTENT),[n,o]);
this.updateTimeEditor();
m(o).show();
m(n).show();
this.clonePosition(f.getDomElement(this.TIME_EDITOR_LAYOUT_ID),f.getDomElement(this.EDITOR_LAYOUT_SHADOW_ID),{left:3,top:3});
this.isEditorVisible=true
},hideEditor:function(){if(this.isTimeEditorLayoutCreated){m(f.getDomElement(this.TIME_EDITOR_LAYOUT_ID)).hide()
}if(this.isDateEditorLayoutCreated){m(f.getDomElement(this.DATE_EDITOR_LAYOUT_ID)).hide()
}m(f.getDomElement(this.EDITOR_ID)).hide();
m(f.getDomElement(this.EDITOR_SHADOW_ID)).hide();
this.isEditorVisible=false
},hideTimeEditor:function(p){this.hideEditor();
if(p&&this.selectedDate){var n=this.showSeconds?parseInt(f.getDomElement(this.id+"TimeSeconds").value,10):this.options.defaultTime.seconds;
var s=parseInt(f.getDomElement(this.id+"TimeMinutes").value,10);
var o=parseInt(f.getDomElement(this.id+"TimeHours").value,10);
if(this.timeType==2){if(f.getDomElement(this.id+"TimeSign").value.toLowerCase()=="am"){if(o==12){o=0
}}else{if(o!=12){o+=12
}}}var q=f.calendarUtils.createDate(this.selectedDate.getFullYear(),this.selectedDate.getMonth(),this.selectedDate.getDate(),o,s,n);
if(q-this.selectedDate&&this.invokeEvent("beforetimeselect",null,null,q)){this.selectedDate=q;
this.renderHF();
if(!this.options.popup||!this.options.showApplyButton){this.setInputField(this.__getSelectedDateString(this.options.datePattern),null)
}this.invokeEvent("timeselect",null,null,this.selectedDate)
}}if(this.options.popup&&!this.options.showApplyButton){this.close(false)
}},showDateEditor:function(){var n;
if(!this.isEditorCreated){n=this.createEditor()
}else{n=f.getDomElement(this.EDITOR_ID)
}if(!this.isDateEditorLayoutCreated){this.createDateEditorLayout(n)
}else{this.updateDateEditor()
}m(f.getDomElement(this.DATE_EDITOR_LAYOUT_ID)).show();
var o=f.getDomElement(this.EDITOR_SHADOW_ID);
this.clonePosition(f.getDomElement(this.CALENDAR_CONTENT),[n,o]);
m(o).show();
m(n).show();
this.clonePosition(f.getDomElement(this.DATE_EDITOR_LAYOUT_ID),f.getDomElement(this.EDITOR_LAYOUT_SHADOW_ID),{left:3,top:3});
this.isEditorVisible=true
},hideDateEditor:function(n){this.hideEditor();
if(n){this.changeCurrentDate(this.dateEditorYear,this.dateEditorMonth)
}},getValue:function(){return this.__getSelectedDate()
},getValueAsString:function(n){return this.__getSelectedDateString(n)
},setValue:function(n){this.__selectDate(n,undefined,undefined,true)
},resetValue:function(){this.__resetSelectedDate();
if(this.options.defaultLabel&&!this.isFocused){a.call(this,this.options.defaultLabel)
}},getNamespace:function(){return this.namespace
}})
})(RichFaces.jQuery,RichFaces);
(function(c,a){a.ui=a.ui||{};
a.ui.MenuKeyNavigation={__updateItemsList:function(){var d=c("."+this.options.cssClasses.listContainerCss+":first",this.popup.popup).find(">."+this.options.cssClasses.itemCss).not("."+this.options.cssClasses.disabledItemCss);
return(this.items=d)
},__selectPrev:function(){if(-1==this.currentSelectedItemIndex){this.currentSelectedItemIndex=this.items.length-1
}else{this.__deselectCurrentItem()
}if(this.currentSelectedItemIndex>0){this.currentSelectedItemIndex--
}else{this.currentSelectedItemIndex=this.items.length-1
}this.__selectCurrentItem()
},__selectNext:function(){if(-1!=this.currentSelectedItemIndex){this.__deselectCurrentItem()
}if(this.currentSelectedItemIndex<this.items.length-1){this.currentSelectedItemIndex++
}else{this.currentSelectedItemIndex=0
}this.__selectCurrentItem()
},__deselectCurrentItem:function(){this.__deselectByIndex(this.currentSelectedItemIndex)
},__selectCurrentItem:function(){this.__selectByIndex(this.currentSelectedItemIndex)
},__selectFirstItem:function(){this.currentSelectedItemIndex=0;
this.__selectCurrentItem()
},__selectByIndex:function(d){if(-1!=d){a.component(this.items.eq(d)).select()
}},__deselectByIndex:function(d){if(d>-1){a.component(this.items.eq(d)).unselect()
}},__openGroup:function(){var d=this.__getItemByIndex(this.currentSelectedItemIndex);
if(this.__isGroup(d)){a.component(d).show();
a.component(d).__selectFirstItem();
this.active=false
}},__closeGroup:function(){var d=this.__getItemByIndex(this.currentSelectedItemIndex);
if(this.__isGroup(d)){a.component(d).__deselectCurrentItem();
a.component(d).hide();
this.active=true
}},__returnToParentMenu:function(){var e=this.__getItemByIndex(this.currentSelectedItemIndex);
var d;
d=this.__getParentMenu()||this.__getParentMenuFromItem(e);
if(d!=null&&this.id!=a.component(d).id){this.hide();
a.component(d).popupElement.focus()
}else{this.hide()
}},__activateMenuItem:function(){var d=this.__getCurrentItem();
if(d){menuItemId=d.attr("id");
this.activateItem(menuItemId)
}},__getItemByIndex:function(d){if(d>-1){return this.items.eq(d)
}else{return null
}},__getCurrentItem:function(){return this.__getItemByIndex(this.currentSelectedItemIndex)
},__keydownHandler:function(d){var e;
if(d.keyCode){e=d.keyCode
}else{if(d.which){e=d.which
}}activeMenu=a.ui.MenuManager.getActiveSubMenu();
if(this.popup.isVisible()){switch(e){case a.KEYS.DOWN:d.preventDefault();
activeMenu.__selectNext();
break;
case a.KEYS.UP:d.preventDefault();
activeMenu.__selectPrev();
break;
case a.KEYS.LEFT:d.preventDefault();
activeMenu.__returnToParentMenu();
break;
case a.KEYS.RIGHT:d.preventDefault();
activeMenu.__openGroup();
break;
case a.KEYS.ESC:d.preventDefault();
activeMenu.__returnToParentMenu();
break;
case a.KEYS.RETURN:d.preventDefault();
activeMenu.__activateMenuItem();
break
}d.stopPropagation()
}}}
})(RichFaces.jQuery,RichFaces);
(function(e,f){f.ui=f.ui||{};
var c={rejectClass:"rf-ind-rejt",acceptClass:"rf-ind-acpt",draggingClass:"rf-ind-drag"};
var a={};
f.ui.Droppable=function(g,h){this.options={};
e.extend(this.options,a,h||{});
d.constructor.call(this,g);
this.namespace=this.namespace||"."+f.Event.createNamespace(this.name,this.id);
this.id=g;
this.parentId=this.options.parentId;
this.attachToDom(this.parentId);
this.dropElement=e(document.getElementById(this.parentId));
this.dropElement.droppable({addClasses:false});
this.dropElement.data("init",true);
f.Event.bind(this.dropElement,"drop"+this.namespace,this.drop,this);
f.Event.bind(this.dropElement,"dropover"+this.namespace,this.dropover,this);
f.Event.bind(this.dropElement,"dropout"+this.namespace,this.dropout,this)
};
f.BaseNonVisualComponent.extend(f.ui.Droppable);
var d=f.ui.Droppable.$super;
e.extend(f.ui.Droppable.prototype,(function(){return{drop:function(g){var i=g.rf.data;
if(this.accept(i.draggable)){this.__callAjax(g,i)
}var h=this.__getIndicatorObject(i.helper);
if(h){i.helper.removeClass(h.getAcceptClass());
i.helper.removeClass(h.getRejectClass())
}else{i.helper.removeClass(c.acceptClass);
i.helper.removeClass(c.rejectClass)
}},dropover:function(g){var i=g.rf.data;
var j=i.draggable;
var h=this.__getIndicatorObject(i.helper);
this.dropElement.addClass("rf-drp-hvr");
if(h){if(this.accept(j)){i.helper.removeClass(h.getRejectClass());
i.helper.addClass(h.getAcceptClass());
this.dropElement.addClass("rf-drp-hlight")
}else{i.helper.removeClass(h.getAcceptClass());
i.helper.addClass(h.getRejectClass());
this.dropElement.removeClass("rf-drp-hlight")
}}else{if(this.accept(j)){i.helper.removeClass(c.rejectClass);
i.helper.addClass(c.acceptClass);
this.dropElement.addClass("rf-drp-hlight")
}else{i.helper.removeClass(c.acceptClass);
i.helper.addClass(c.rejectClass);
this.dropElement.removeClass("rf-drp-hlight")
}}},dropout:function(g){var i=g.rf.data;
var j=i.draggable;
var h=this.__getIndicatorObject(i.helper);
this.dropElement.removeClass("rf-drp-hvr rf-drp-hlight");
if(h){i.helper.removeClass(h.getAcceptClass());
i.helper.removeClass(h.getRejectClass())
}else{i.helper.removeClass(c.acceptClass);
i.helper.removeClass(c.rejectClass)
}},accept:function(i){var g=false;
var h=i.data("type");
if(h&&this.options.acceptedTypes){e.each(this.options.acceptedTypes,function(){if(this=="@none"){return false
}if(this==h||this=="@all"){g=true;
return false
}})
}return g
},__getIndicatorObject:function(g){var h=g.attr("id");
if(h){var i=h.match(/(.*)Clone$/)[1];
return f.component(i)
}},__callAjax:function(h,i){if(i.draggable){var j=i.draggable.data("id");
var g=this.options.ajaxFunction;
if(g&&typeof g=="function"){g.call(this,h,j)
}}},destroy:function(){this.detach(this.parentId);
f.Event.unbind(this.dropElement,this.namespace);
d.destroy.call(this)
}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(d,g){g.ui=g.ui||{};
g.ui.TooltipMode={client:"client",ajax:"ajax",DEFAULT:"client"};
var a=g.ui.TooltipMode;
var e={jointPoint:"AA",direction:"AA",offset:[10,10],attached:true,mode:a.DEFAULT,hideDelay:0,hideEvent:"mouseleave",showDelay:0,showEvent:"mouseenter",followMouse:true};
var f={exec:function(i,j){var h=i.mode;
if(h==a.ajax){return this.execAjax(i,j)
}else{if(h==a.client){return this.execClient(i,j)
}else{g.log.error("SHOW_ACTION.exec : unknown mode ("+h+")")
}}},execAjax:function(h,i){h.__loading().show();
h.__content().hide();
h.__show(i);
g.ajax(h.id,null,d.extend({},h.options.ajax,{}));
return true
},execClient:function(h,i){h.__show(i)
}};
g.ui.Tooltip=g.BaseComponent.extendClass({name:"Tooltip",init:function(h,i){c.constructor.call(this,h);
this.namespace="."+g.Event.createNamespace(this.name,this.id);
this.options=d.extend(this.options,e,i||{});
this.attachToDom();
this.mode=this.options.mode;
this.target=this.options.target;
this.shown=false;
this.__addUserEventHandler("hide");
this.__addUserEventHandler("show");
this.__addUserEventHandler("beforehide");
this.__addUserEventHandler("beforeshow");
this.popupId=this.id+":wrp";
this.popup=new g.ui.Popup(this.popupId,{attachTo:this.target,attachToBody:true,positionType:"TOOLTIP",positionOffset:this.options.offset,jointPoint:this.options.jointPoint,direction:this.options.direction});
if(this.options.attached){var j={};
j[this.options.showEvent+this.namespace]=this.__showHandler;
j[this.options.hideEvent+this.namespace]=this.__hideHandler;
g.Event.bindById(this.target,j,this);
if(this.options.hideEvent=="mouseleave"){g.Event.bindById(this.popupId,this.options.hideEvent+this.namespace,this.__hideHandler,this)
}}},hide:function(){var h=this;
if(h.hidingTimerHandle){window.clearTimeout(h.hidingTimerHandle);
h.hidingTimerHandle=undefined
}if(this.shown){this.__hide()
}},__hideHandler:function(h){if(h.type=="mouseleave"&&this.__isInside(h.relatedTarget)){return
}this.hide();
if(this.options.followMouse){g.Event.unbindById(this.target,"mousemove"+this.namespace)
}},__hide:function(){var h=this;
this.__delay(this.options.hideDelay,function(){h.__fireBeforeHide();
h.popup.hide();
h.shown=false;
h.__fireHide()
})
},__mouseMoveHandler:function(h){this.saveShowEvent=h;
if(this.shown){this.popup.show(this.saveShowEvent)
}},__showHandler:function(i){this.show(i);
var h=this;
if(h.options.followMouse){g.Event.bindById(h.target,"mousemove"+h.namespace,h.__mouseMoveHandler,h)
}},show:function(i){var h=this;
if(h.hidingTimerHandle){window.clearTimeout(h.hidingTimerHandle);
h.hidingTimerHandle=undefined
}if(!this.shown){f.exec(this,i)
}},onCompleteHandler:function(){this.__content().show();
this.__loading().hide()
},__show:function(i){var h=this;
this.__delay(this.options.showDelay,function(){if(!h.options.followMouse){h.saveShowEvent=i
}if(!h.shown){h.__fireBeforeShow();
h.popup.show(h.saveShowEvent)
}h.shown=true;
h.__fireShow()
})
},__delay:function(j,h){var i=this;
if(j>0){i.hidingTimerHandle=window.setTimeout(function(){h();
if(i.hidingTimerHandle){window.clearTimeout(i.hidingTimerHandle);
i.hidingTimerHandle=undefined
}},j)
}else{h()
}},__detectAncestorNode:function(j,i){var h=j;
while(h!=null&&h!=i){h=h.parentNode
}return(h!=null)
},__loading:function(){return d(document.getElementById(this.id+":loading"))
},__content:function(){return d(document.getElementById(this.id+":content"))
},__fireHide:function(){return g.Event.fireById(this.id,"hide",{id:this.id})
},__fireShow:function(){return g.Event.fireById(this.id,"show",{id:this.id})
},__fireBeforeHide:function(){return g.Event.fireById(this.id,"beforehide",{id:this.id})
},__fireBeforeShow:function(){return g.Event.fireById(this.id,"beforeshow",{id:this.id})
},__addUserEventHandler:function(i){var h=this.options["on"+i];
if(h){g.Event.bindById(this.id,i+this.namespace,h)
}},__contains:function(h,i){while(i){if(h==i.id){return true
}i=i.parentNode
}return false
},__isInside:function(h){return this.__contains(this.target,h)||this.__contains(this.popupId,h)
},destroy:function(){g.Event.unbindById(this.popupId,this.namespace);
g.Event.unbindById(this.target,this.namespace);
this.popup.destroy();
this.popup=null;
c.destroy.call(this)
}});
var c=g.ui.Tooltip.$super
})(RichFaces.jQuery,RichFaces);
(function(d,e){e.ui=e.ui||{};
e.ui.ListMulti=function(f,h){this.namespace=this.namespace||"."+e.Event.createNamespace(this.name,f);
var g=d.extend({},a,h);
c.constructor.call(this,f,g);
this.disabled=g.disabled
};
e.ui.List.extend(e.ui.ListMulti);
var c=e.ui.ListMulti.$super;
var a={clickRequiredToSelect:true};
d.extend(e.ui.ListMulti.prototype,(function(){return{name:"listMulti",getSelectedItems:function(){return this.list.find("."+this.selectItemCssMarker)
},removeSelectedItems:function(){var f=this.getSelectedItems();
this.removeItems(f);
return f
},__selectByIndex:function(i,f){if(!this.__isSelectByIndexValid(i)){return
}this.index=this.__sanitizeSelectedIndex(i);
var g=this.items.eq(this.index);
if(!f){var h=this;
this.getSelectedItems().each(function(){h.unselectItem(d(this))
});
this.selectItem(g)
}else{if(this.isSelected(g)){this.unselectItem(g)
}else{this.selectItem(g)
}}}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(e,f){f.ui=f.ui||{};
var a={mode:"server",attachToBody:false,showDelay:50,hideDelay:300,verticalOffset:0,horizontalOffset:0,showEvent:"mouseover",positionOffset:[0,0],cssRoot:"ddm",cssClasses:{}};
f.ui.MenuBase=function(h,i){d.constructor.call(this,h,i);
this.id=h;
this.namespace=this.namespace||"."+f.Event.createNamespace(this.name,this.id);
this.options={};
e.extend(this.options,a,i||{});
e.extend(this.options.cssClasses,c.call(this,this.options.cssRoot));
this.attachToDom(h);
this.element=f.getDomElement(this.id);
this.displayed=false;
this.options.positionOffset=[this.options.horizontalOffset,this.options.verticalOffset];
this.popup=new RichFaces.ui.Popup(this.id+"_list",{attachTo:this.id,direction:this.options.direction,jointPoint:this.options.jointPoint,positionType:this.options.positionType,positionOffset:this.options.positionOffset,attachToBody:this.options.attachToBody});
this.selectedGroup=null;
f.Event.bindById(this.id,"mouseenter",e.proxy(this.__overHandler,this),this);
f.Event.bindById(this.id,"mouseleave",e.proxy(this.__leaveHandler,this),this);
this.popupElement=f.getDomElement(this.popup.id);
this.popupElement.tabIndex=-1;
this.__updateItemsList();
f.Event.bind(this.items,"mouseenter",e.proxy(this.__itemMouseEnterHandler,this),this);
this.currentSelectedItemIndex=-1;
var g;
g={};
g["keydown"+this.namespace]=this.__keydownHandler;
f.Event.bind(this.popupElement,g,this)
};
var c=function(g){var h={itemCss:"rf-"+g+"-itm",selectItemCss:"rf-"+g+"-itm-sel",unselectItemCss:"rf-"+g+"-itm-unsel",disabledItemCss:"rf-"+g+"-itm-dis",labelCss:"rf-"+g+"-lbl",listCss:"rf-"+g+"-lst",listContainerCss:"rf-"+g+"-lst-bg"};
return h
};
f.BaseComponent.extend(f.ui.MenuBase);
var d=f.ui.MenuBase.$super;
e.extend(f.ui.MenuBase.prototype,(function(){return{name:"MenuBase",show:function(){this.__showPopup()
},hide:function(){this.__hidePopup()
},processItem:function(g){if(g&&g.attr("id")&&!this.__isDisabled(g)&&!this.__isGroup(g)){this.invokeEvent("itemclick",f.getDomElement(this.id),null);
this.hide()
}},activateItem:function(g){var h=e(RichFaces.getDomElement(g));
f.Event.fireById(h.attr("id"),"click")
},__showPopup:function(g){if(!this.__isShown()){this.invokeEvent("show",f.getDomElement(this.id),null);
this.popup.show(g);
this.displayed=true;
f.ui.MenuManager.setActiveSubMenu(f.component(this.element))
}this.popupElement.focus()
},__hidePopup:function(){window.clearTimeout(this.showTimeoutId);
this.showTimeoutId=null;
if(this.__isShown()){this.invokeEvent("hide",f.getDomElement(this.id),null);
this.__closeChildGroups();
this.popup.hide();
this.displayed=false;
this.__deselectCurrentItem();
this.currentSelectedItemIndex=-1;
var g=f.component(this.__getParentMenu());
if(this.id!=g.id){g.popupElement.focus();
f.ui.MenuManager.setActiveSubMenu(g)
}}},__closeChildGroups:function(){var h=0;
var g;
for(h in this.items){g=this.items.eq(h);
if(this.__isGroup(g)){f.component(g).hide()
}}},__getParentMenuFromItem:function(h){var g;
if(h){g=h.parents("div."+this.options.cssClasses.itemCss).has("div."+this.options.cssClasses.listContainerCss).eq(1)
}if(g&&g.length>0){return g
}else{g=h.parents("div."+this.options.cssClasses.labelCss);
if(g&&g.length>0){return g
}else{return null
}}},__getParentMenu:function(){var g=e(this.element).parents("div."+this.options.cssClasses.itemCss).has("div."+this.options.cssClasses.listContainerCss).eq(0);
if(g&&g.length>0){return g
}else{var h=this.items.eq(0);
return this.__getParentMenuFromItem(h)
}},__isGroup:function(g){return g.find("div."+this.options.cssClasses.listCss).length>0
},__isDisabled:function(g){return g.hasClass(this.options.cssClasses.disabledItemCss)
},__isShown:function(){return this.displayed
},__itemMouseEnterHandler:function(g){var h=this.__getItemFromEvent(g);
if(h){if(this.currentSelectedItemIndex!=this.items.index(h)){this.__deselectCurrentItem();
this.currentSelectedItemIndex=this.items.index(h)
}}},__selectItem:function(g){if(!f.component(g).isSelected){f.component(g).select()
}},__getItemFromEvent:function(g){return e(g.target).closest("."+this.options.cssClasses.itemCss,g.currentTarget).eq(0)
},__showHandler:function(g){if(!this.__isShown()){this.showTimeoutId=window.setTimeout(e.proxy(function(){this.show(g)
},this),this.options.showDelay);
return false
}},__leaveHandler:function(){this.hideTimeoutId=window.setTimeout(e.proxy(function(){this.hide()
},this),this.options.hideDelay)
},__overHandler:function(){window.clearTimeout(this.hideTimeoutId);
this.hideTimeoutId=null
},destroy:function(){this.detach(this.id);
f.Event.unbind(this.popupElement,"keydown"+this.namespace);
this.popup.destroy();
this.popup=null;
d.destroy.call(this)
}}
})())
})(RichFaces.jQuery,RichFaces);
(function(d,e){e.ui=e.ui||{};
e.ui.PopupList=function(f,h,i){this.namespace=this.namespace||"."+e.Event.createNamespace(this.name,f);
var g=d.extend({},a,i);
c.constructor.call(this,f,g);
g.selectListener=h;
this.list=new e.ui.List(f,g)
};
e.ui.Popup.extend(e.ui.PopupList);
var c=e.ui.PopupList.$super;
var a={attachToBody:true,positionType:"DROPDOWN",positionOffset:[0,0]};
d.extend(e.ui.PopupList.prototype,(function(){return{name:"popupList",__getList:function(){return this.list
},destroy:function(){this.list.destroy();
this.list=null;
c.destroy.call(this)
}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(e,f){f.ui=f.ui||{};
var a={positionType:"DROPDOWN",direction:"AA",jointPoint:"AA",cssRoot:"ddm",cssClasses:{}};
f.ui.Menu=function(h,i){this.options={};
e.extend(this.options,a,i||{});
e.extend(this.options.cssClasses,c.call(this,this.options.cssRoot));
d.constructor.call(this,h,this.options);
this.id=h;
this.namespace=this.namespace||"."+f.Event.createNamespace(this.name,this.id);
this.groupList=new Array();
this.target=this.getTarget();
this.targetComponent=f.component(this.target);
if(this.target){var g=this;
e(document).ready(function(){if(g.targetComponent&&g.targetComponent.contextMenuAttach){g.targetComponent.contextMenuAttach(g);
e("body").on("rich:ready"+g.namespace,'[id="'+g.target+'"]',function(){g.targetComponent.contextMenuAttach(g)
})
}else{f.Event.bindById(g.target,g.options.showEvent,e.proxy(g.__showHandler,g),g)
}})
}this.element=e(f.getDomElement(this.id));
if(!f.ui.MenuManager){f.ui.MenuManager={}
}this.menuManager=f.ui.MenuManager
};
var c=function(g){var h={selectMenuCss:"rf-"+g+"-sel",unselectMenuCss:"rf-"+g+"-unsel"};
return h
};
f.ui.MenuBase.extend(f.ui.Menu);
var d=f.ui.Menu.$super;
e.extend(f.ui.Menu.prototype,f.ui.MenuKeyNavigation);
e.extend(f.ui.Menu.prototype,(function(){return{name:"Menu",initiateGroups:function(i){for(var g in i){var h=i[g].id;
if(null!=h){this.groupList[h]=new f.ui.MenuGroup(h,{rootMenuId:this.id,onshow:i[g].onshow,onhide:i[g].onhide,horizontalOffset:i[g].horizontalOffset,verticalOffset:i[g].verticalOffset,jointPoint:i[g].jointPoint,direction:i[g].direction,cssRoot:i[g].cssRoot})
}}},getTarget:function(){return this.id+"_label"
},show:function(g){if(this.menuManager.openedMenu!=this.id){this.menuManager.shutdownMenu();
this.menuManager.addMenuId(this.id);
this.__showPopup()
}},hide:function(){this.__hidePopup();
this.menuManager.deletedMenuId()
},select:function(){this.element.removeClass(this.options.cssClasses.unselectMenuCss);
this.element.addClass(this.options.cssClasses.selectMenuCss)
},unselect:function(){this.element.removeClass(this.options.cssClasses.selectMenuCss);
this.element.addClass(this.options.cssClasses.unselectMenuCss)
},__overHandler:function(){d.__overHandler.call(this);
this.select()
},__leaveHandler:function(){d.__leaveHandler.call(this);
this.unselect()
},destroy:function(){this.detach(this.id);
if(this.target){f.Event.unbindById(this.target,this.options.showEvent);
if(this.targetComponent&&this.targetComponent.contextMenuAttach){e("body").off("rich:ready"+this.namespace,'[id="'+this.target+'"]')
}}d.destroy.call(this)
}}
})());
f.ui.MenuManager={openedMenu:null,activeSubMenu:null,addMenuId:function(g){this.openedMenu=g
},deletedMenuId:function(){this.openedMenu=null
},shutdownMenu:function(){if(this.openedMenu!=null){f.component(f.getDomElement(this.openedMenu)).hide()
}this.deletedMenuId()
},setActiveSubMenu:function(g){this.activeSubMenu=g
},getActiveSubMenu:function(){return this.activeSubMenu
}}
})(RichFaces.jQuery,RichFaces);
(function(d,e){e.ui=e.ui||{};
var a={showEvent:"mouseenter",direction:"AA",jointPoint:"AA",positionType:"DDMENUGROUP",showDelay:300};
e.ui.MenuGroup=function(f,g){this.id=f;
this.options={};
d.extend(this.options,a,g||{});
c.constructor.call(this,f,this.options);
this.namespace=this.namespace||"."+e.Event.createNamespace(this.name,this.id);
this.attachToDom(f);
e.Event.bindById(this.id,this.options.showEvent,d.proxy(this.__showHandler,this),this);
this.rootMenu=e.component(this.options.rootMenuId);
this.shown=false;
this.jqueryElement=d(this.element)
};
e.ui.MenuBase.extend(e.ui.MenuGroup);
var c=e.ui.MenuGroup.$super;
d.extend(e.ui.MenuGroup.prototype,e.ui.MenuKeyNavigation);
d.extend(e.ui.MenuGroup.prototype,(function(){return{name:"MenuGroup",show:function(){var f=this.id;
if(this.rootMenu.groupList[f]&&!this.shown){this.rootMenu.invokeEvent("groupshow",e.getDomElement(this.rootMenu.id),null);
this.__showPopup();
this.shown=true
}},hide:function(){var f=this.rootMenu;
if(f.groupList[this.id]&&this.shown){f.invokeEvent("grouphide",e.getDomElement(f.id),null);
this.__hidePopup();
this.shown=false
}},select:function(){this.jqueryElement.removeClass(this.options.cssClasses.unselectItemCss);
this.jqueryElement.addClass(this.options.cssClasses.selectItemCss)
},unselect:function(){this.jqueryElement.removeClass(this.options.cssClasses.selectItemCss);
this.jqueryElement.addClass(this.options.cssClasses.unselectItemCss)
},__showHandler:function(){this.select();
c.__showHandler.call(this)
},__leaveHandler:function(){window.clearTimeout(this.showTimeoutId);
this.showTimeoutId=null;
this.hideTimeoutId=window.setTimeout(d.proxy(function(){this.hide()
},this),this.options.hideDelay);
this.unselect()
},destroy:function(){this.detach(this.id);
c.destroy.call(this)
}}
})())
})(RichFaces.jQuery,RichFaces);
(function(d,e){e.ui=e.ui||{};
e.ui.PickList=function(g,j){var h=d.extend({},a,j);
c.constructor.call(this,g,h);
this.namespace=this.namespace||"."+e.Event.createNamespace(this.name,this.id);
this.attachToDom();
h.scrollContainer=d(document.getElementById(g+"SourceItems"));
this.sourceList=new e.ui.ListMulti(g+"SourceList",h);
h.scrollContainer=d(document.getElementById(g+"TargetItems"));
this.selectItemCss=h.selectItemCss;
var i=g+"SelValue";
this.hiddenValues=d(document.getElementById(i));
h.hiddenId=i;
this.orderable=h.orderable;
if(this.orderable){this.orderingList=new e.ui.OrderingList(g+"Target",h);
this.targetList=this.orderingList.list
}else{this.targetList=new e.ui.ListMulti(g+"TargetList",h)
}this.pickList=d(document.getElementById(g));
this.addButton=d(".rf-pick-add",this.pickList);
this.addButton.bind("click",d.proxy(this.add,this));
this.addAllButton=d(".rf-pick-add-all",this.pickList);
this.addAllButton.bind("click",d.proxy(this.addAll,this));
this.removeButton=d(".rf-pick-rem",this.pickList);
this.removeButton.bind("click",d.proxy(this.remove,this));
this.removeAllButton=d(".rf-pick-rem-all",this.pickList);
this.removeAllButton.bind("click",d.proxy(this.removeAll,this));
this.disabled=h.disabled;
if(h.onadditems&&typeof h.onadditems=="function"){e.Event.bind(this.targetList,"additems",h.onadditems)
}e.Event.bind(this.targetList,"additems",d.proxy(this.toggleButtons,this));
this.focused=false;
this.keepingFocus=false;
f.call(this,h);
if(h.onremoveitems&&typeof h.onremoveitems=="function"){e.Event.bind(this.sourceList,"additems",h.onremoveitems)
}e.Event.bind(this.sourceList,"additems",d.proxy(this.toggleButtons,this));
e.Event.bind(this.sourceList,"selectItem",d.proxy(this.toggleButtons,this));
e.Event.bind(this.sourceList,"unselectItem",d.proxy(this.toggleButtons,this));
e.Event.bind(this.targetList,"selectItem",d.proxy(this.toggleButtons,this));
e.Event.bind(this.targetList,"unselectItem",d.proxy(this.toggleButtons,this));
if(h.switchByClick){e.Event.bind(this.sourceList,"click",d.proxy(this.add,this));
e.Event.bind(this.targetList,"click",d.proxy(this.remove,this))
}if(h.switchByDblClick){e.Event.bind(this.sourceList,"dblclick",d.proxy(this.add,this));
e.Event.bind(this.targetList,"dblclick",d.proxy(this.remove,this))
}if(j.onchange&&typeof j.onchange=="function"){e.Event.bind(this,"change"+this.namespace,j.onchange)
}d(document).ready(d.proxy(this.toggleButtons,this))
};
e.BaseComponent.extend(e.ui.PickList);
var c=e.ui.PickList.$super;
var a={defaultLabel:"",itemCss:"rf-pick-opt",selectItemCss:"rf-pick-sel",listCss:"rf-pick-lst-cord",clickRequiredToSelect:true,switchByClick:false,switchByDblClick:true,disabled:false};
var f=function(g){if(g.onsourcefocus&&typeof g.onsourcefocus=="function"){e.Event.bind(this.sourceList,"listfocus"+this.sourceList.namespace,g.onsourcefocus)
}if(g.onsourceblur&&typeof g.onsourceblur=="function"){e.Event.bind(this.sourceList,"listblur"+this.sourceList.namespace,g.onsourceblur)
}if(g.ontargetfocus&&typeof g.ontargetfocus=="function"){e.Event.bind(this.targetList,"listfocus"+this.targetList.namespace,g.ontargetfocus)
}if(g.ontargetblur&&typeof g.ontargetblur=="function"){e.Event.bind(this.targetList,"listblur"+this.targetList.namespace,g.ontargetblur)
}if(g.onfocus&&typeof g.onfocus=="function"){e.Event.bind(this,"listfocus"+this.namespace,g.onfocus)
}if(g.onblur&&typeof g.onblur=="function"){e.Event.bind(this,"listblur"+this.namespace,g.onblur)
}this.pickList.focusin(d.proxy(this.__focusHandler,this));
this.pickList.focusout(d.proxy(this.__blurHandler,this))
};
d.extend(e.ui.PickList.prototype,(function(){return{name:"pickList",defaultLabelClass:"rf-pick-dflt-lbl",getName:function(){return this.name
},getNamespace:function(){return this.namespace
},__focusHandler:function(g){if(!this.focused){this.focused=true;
e.Event.fire(this,"listfocus"+this.namespace,g);
this.originalValue=this.targetList.csvEncodeValues()
}},__blurHandler:function(g){if(this.focused){this.focused=false;
e.Event.fire(this,"listblur"+this.namespace,g)
}},getSourceList:function(){return this.sourceList
},getTargetList:function(){return this.targetList
},add:function(){this.targetList.setFocus();
var g=this.sourceList.removeSelectedItems();
this.targetList.addItems(g);
this.encodeHiddenValues()
},remove:function(){this.sourceList.setFocus();
var g=this.targetList.removeSelectedItems();
this.sourceList.addItems(g);
this.encodeHiddenValues()
},addAll:function(){this.targetList.setFocus();
var g=this.sourceList.removeAllItems();
this.targetList.addItems(g);
this.encodeHiddenValues()
},removeAll:function(){this.sourceList.setFocus();
var g=this.targetList.removeAllItems();
this.sourceList.addItems(g);
this.encodeHiddenValues()
},encodeHiddenValues:function(){var h=this.hiddenValues.val();
var g=this.targetList.csvEncodeValues();
if(h!==g){this.hiddenValues.val(g)
}e.Event.fire(this,"change"+this.namespace,{oldValues:h,newValues:g})
},toggleButtons:function(){this.__toggleButton(this.addButton,this.sourceList.__getItems().filter("."+this.selectItemCss).length>0);
this.__toggleButton(this.removeButton,this.targetList.__getItems().filter("."+this.selectItemCss).length>0);
this.__toggleButton(this.addAllButton,this.sourceList.__getItems().length>0);
this.__toggleButton(this.removeAllButton,this.targetList.__getItems().length>0);
if(this.orderable){this.orderingList.toggleButtons()
}},__toggleButton:function(g,h){if(this.disabled||!h){if(!g.hasClass("rf-pick-btn-dis")){g.addClass("rf-pick-btn-dis")
}if(!g.attr("disabled")){g.attr("disabled",true)
}}else{if(g.hasClass("rf-pick-btn-dis")){g.removeClass("rf-pick-btn-dis")
}if(g.attr("disabled")){g.attr("disabled",false)
}}}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(d,e){e.ui=e.ui||{};
e.ui.InplaceInput=function(f,j){var g=d.extend({},a,j);
c.constructor.call(this,f,g);
this.label=d(document.getElementById(f+"Label"));
var i=this.label.text();
var h=this.__getValue();
this.initialLabel=(i==h)?i:"";
this.useDefaultLabel=i!=h;
this.saveOnBlur=g.saveOnBlur;
this.showControls=g.showControls;
this.getInput().bind("focus",d.proxy(this.__editHandler,this));
if(this.showControls){var l=document.getElementById(f+"Btn");
if(l){l.tabIndex=-1
}this.okbtn=d(document.getElementById(f+"Okbtn"));
this.cancelbtn=d(document.getElementById(f+"Cancelbtn"));
this.okbtn.bind("mousedown",d.proxy(this.__saveBtnHandler,this));
this.cancelbtn.bind("mousedown",d.proxy(this.__cancelBtnHandler,this))
}};
e.ui.InplaceBase.extend(e.ui.InplaceInput);
var c=e.ui.InplaceInput.$super;
var a={defaultLabel:"",saveOnBlur:true,showControl:true,noneCss:"rf-ii-none",readyCss:"rf-ii",editCss:"rf-ii-act",changedCss:"rf-ii-chng"};
d.extend(e.ui.InplaceInput.prototype,(function(){return{name:"inplaceInput",defaultLabelClass:"rf-ii-dflt-lbl",getName:function(){return this.name
},getNamespace:function(){return this.namespace
},__keydownHandler:function(f){this.tabBlur=false;
switch(f.keyCode||f.which){case e.KEYS.ESC:f.preventDefault();
this.cancel();
this.onblur(f);
break;
case e.KEYS.RETURN:f.preventDefault();
this.save();
this.onblur(f);
break;
case e.KEYS.TAB:this.tabBlur=true;
break
}},__blurHandler:function(f){this.onblur(f)
},__isSaveOnBlur:function(){return this.saveOnBlur
},__setInputFocus:function(){this.getInput().unbind("focus",this.__editHandler);
this.getInput().focus()
},__saveBtnHandler:function(f){this.cancelButton=false;
this.save();
this.onblur(f)
},__cancelBtnHandler:function(f){this.cancelButton=true;
this.cancel();
this.onblur(f)
},__editHandler:function(f){c.__editHandler.call(this,f);
this.onfocus(f)
},getLabel:function(){return this.label.text()
},setLabel:function(f){this.label.text(f);
if(f==this.defaultLabel){this.label.addClass(this.defaultLabelClass)
}else{this.label.removeClass(this.defaultLabelClass)
}},isValueChanged:function(){return(this.__getValue()!=this.initialLabel)
},onshow:function(){this.__setInputFocus()
},onhide:function(){if(this.tabBlur){this.tabBlur=false
}else{this.getInput().focus()
}},onfocus:function(f){if(!this.__isFocused()){this.__setFocused(true);
this.focusValue=this.__getValue();
this.invokeEvent.call(this,"focus",document.getElementById(this.id),f)
}},onblur:function(g){if(this.__isFocused()){this.__setFocused(false);
this.invokeEvent.call(this,"blur",document.getElementById(this.id),g);
if(this.isValueSaved()||this.__isSaveOnBlur()){this.save()
}else{this.cancel()
}this.__hide();
if(!this.cancelButton){if(this.__isValueChanged()){this.invokeEvent.call(this,"change",document.getElementById(this.id),g)
}}var f=this;
window.setTimeout(function(){f.getInput().bind("focus",d.proxy(f.__editHandler,f))
},1)
}},__isValueChanged:function(){return(this.focusValue!=this.__getValue())
},__setFocused:function(f){this.focused=f
},__isFocused:function(){return this.focused
},setValue:function(f){this.__setValue(f);
this.save()
}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(d,e){e.ui=e.ui||{};
var a={showEvent:"contextmenu",cssRoot:"ctx",cssClasses:{},attached:true};
e.ui.ContextMenu=function(f,g){this.options={};
d.extend(this.options,a,g||{});
c.constructor.call(this,f,this.options);
this.id=f;
this.namespace=this.namespace||"."+e.Event.createNamespace(this.name,this.id);
e.Event.bind("body","click"+this.namespace,d.proxy(this.__leaveHandler,this));
e.Event.bindById(this.id,"click"+this.namespace,d.proxy(this.__clilckHandler,this))
};
e.ui.Menu.extend(e.ui.ContextMenu);
var c=e.ui.ContextMenu.$super;
d.extend(e.ui.ContextMenu.prototype,(function(){return{name:"ContextMenu",getTarget:function(){if(!this.options.attached){return null
}var f=typeof this.options.target==="undefined"?this.element.parentNode.id:this.options.target;
return f
},__showHandler:function(f){if(this.__isShown()){this.hide()
}return c.__showHandler.call(this,f)
},show:function(f){if(this.menuManager.openedMenu!=this.id){this.menuManager.shutdownMenu();
this.menuManager.addMenuId(this.id);
this.__showPopup(f);
var g=e.component(this.target);
if(g&&g.contextMenuShow){g.contextMenuShow(this,f)
}}},__clilckHandler:function(f){f.preventDefault();
f.stopPropagation()
},destroy:function(){e.Event.unbind("body","click"+this.namespace);
e.Event.unbindById(this.id,"click"+this.namespace);
c.destroy.call(this)
}}
})())
})(RichFaces.jQuery,RichFaces);
(function(f,g){g.ui=g.ui||{};
g.ui.Select=function(i,n){this.id=i;
this.element=this.attachToDom();
var j=f.extend({},h,n);
j.attachTo=i;
j.scrollContainer=f(document.getElementById(i+"Items")).parent()[0];
j.focusKeeperEnabled=false;
e.constructor.call(this,i,j);
this.options=j;
this.defaultLabel=j.defaultLabel;
var l=this.__getValue();
this.initialValue=(l!=this.defaultLabel)?l:"";
this.selValueInput=f(document.getElementById(i+"selValue"));
this.container=this.selValueInput.parent();
this.clientSelectItems=j.clientSelectItems;
this.filterFunction=j.filterFunction;
if(j.showControl&&!j.disabled){this.container.bind("mousedown",f.proxy(this.__onBtnMouseDown,this)).bind("mouseup",f.proxy(this.__onMouseUp,this))
}this.isFirstAjax=true;
this.previousValue=this.__getValue();
this.selectFirst=j.selectFirst;
this.popupList=new g.ui.PopupList((i+"List"),this,j);
this.list=this.popupList.__getList();
this.listElem=f(document.getElementById(i+"List"));
this.listElem.bind("mousedown",f.proxy(this.__onListMouseDown,this));
this.listElem.bind("mouseup",f.proxy(this.__onMouseUp,this));
var m={};
m["listshow"+this.namespace]=f.proxy(this.__listshowHandler,this);
m["listhide"+this.namespace]=f.proxy(this.__listhideHandler,this);
m["change"+this.namespace]=f.proxy(this.__onInputChangeHandler,this);
g.Event.bind(this.element,m,this);
this.originalItems=this.list.__getItems();
this.enableManualInput=j.enableManualInput||j.isAutocomplete;
if(this.enableManualInput){d.call(this,"",this.clientSelectItems)
}this.changeDelay=j.changeDelay
};
g.ui.InputBase.extend(g.ui.Select);
var e=g.ui.Select.$super;
var h={defaultLabel:"",selectFirst:true,showControl:true,enableManualInput:false,itemCss:"rf-sel-opt",selectItemCss:"rf-sel-sel",listCss:"rf-sel-lst-cord",changeDelay:8,disabled:false,filterFunction:undefined,isAutocomplete:false,ajaxMode:true,lazyClientMode:false,isCachedAjax:true};
var c=/^[\n\s]*(.*)[\n\s]*$/;
var d=function(i,j){if(!j){j=[]
}if(j.length||(!this.options.isAutocomplete&&!this.options.isCachedAjax)){this.clientSelectItems=j
}this.originalItems=this.list.__updateItemsList();
this.list.__storeClientSelectItems(j);
if(this.originalItems.length>0){this.cache=new g.utils.Cache((this.options.ajaxMode?i:""),this.originalItems,a,!this.options.ajaxMode)
}};
var a=function(j){var i=[];
j.each(function(){i.push(f(this).text().replace(c,"$1"))
});
return i
};
f.extend(g.ui.Select.prototype,(function(){return{name:"select",defaultLabelClass:"rf-sel-dflt-lbl",__listshowHandler:function(i){if(this.originalItems.length==0&&this.isFirstAjax){this.callAjax(i)
}},__listhideHandler:function(i){},__onInputChangeHandler:function(i){this.__setValue(this.input.val())
},__onBtnMouseDown:function(i){if(!this.popupList.isVisible()&&!this.options.isAutocomplete){this.__updateItems();
this.__showPopup()
}else{this.__hidePopup()
}this.isMouseDown=true
},__focusHandler:function(i){if(!this.focused){if(this.__getValue()==this.defaultLabel){this.__setValue("")
}this.focusValue=this.selValueInput.val();
this.focused=true;
this.invokeEvent.call(this,"focus",document.getElementById(this.id),i)
}},__keydownHandler:function(l){var m;
if(l.keyCode){m=l.keyCode
}else{if(l.which){m=l.which
}}var j=this.popupList.isVisible();
switch(m){case g.KEYS.DOWN:l.preventDefault();
l.stopPropagation();
if(!j){this.__updateItems();
this.__showPopup()
}else{this.list.__selectNext()
}break;
case g.KEYS.UP:l.preventDefault();
l.stopPropagation();
if(j){this.list.__selectPrev()
}break;
case g.KEYS.TAB:case g.KEYS.RETURN:if(m==g.KEYS.TAB&&!j){break
}l.preventDefault();
if(j){this.list.__selectCurrent()
}return false;
break;
case g.KEYS.ESC:l.preventDefault();
if(j){this.__hidePopup()
}break;
default:if(this.__selectItemByLabel(m)){break
}var i=this;
window.clearTimeout(this.changeTimerId);
this.changeTimerId=window.setTimeout(function(){i.__onChangeValue(l)
},this.changeDelay);
break
}},__onChangeValue:function(i){var j=this.__getValue();
if(j===this.previousValue){return
}this.previousValue=j;
if(!this.options.isAutocomplete||(this.options.isCachedAjax||!this.options.ajaxMode)&&this.cache&&this.cache.isCached(j)){this.__updateItems();
if(this.isAutocomplete){this.originalItems=this.list.__getItems()
}if(this.list.__getItems().length!=0){this.container.removeClass("rf-sel-fld-err")
}else{this.container.addClass("rf-sel-fld-err")
}if(!this.popupList.isVisible()){this.__showPopup()
}}else{if(j.length>=this.options.minChars){if((this.options.ajaxMode||this.options.lazyClientMode)){this.callAjax(i)
}}else{if(this.options.ajaxMode){this.clearItems();
this.__hidePopup()
}}}},clearItems:function(){this.list.removeAllItems()
},callAjax:function(j){var o=this;
var n=j;
var l=function(p){d.call(o,o.__getValue(),p.componentData&&p.componentData[o.id]);
if(o.clientSelectItems&&o.clientSelectItems.length){o.__updateItems();
o.__showPopup()
}else{o.__hidePopup()
}};
var m=function(p){o.__hidePopup();
o.clearItems()
};
this.isFirstAjax=false;
var i={};
i[this.id+".ajax"]="1";
g.ajax(this.id,j,{parameters:i,error:m,complete:l})
},__blurHandler:function(i){if(!this.isMouseDown){var j=this;
this.timeoutId=window.setTimeout(function(){if(j.input!==null){j.onblur(i)
}},200)
}else{this.__setInputFocus();
this.isMouseDown=false
}},__onListMouseDown:function(i){this.isMouseDown=true
},__onMouseUp:function(i){this.isMouseDown=false;
this.__setInputFocus()
},__updateItems:function(){var i=this.__getValue();
i=(i!=this.defaultLabel)?i:"";
this.__updateItemsFromCache(i);
if(this.selectFirst&&this.enableManualInput&&!this.__isValueSelected(i)){this.list.__selectByIndex(0)
}},__updateItemsFromCache:function(i){if(this.originalItems.length>0&&(this.enableManualInput||this.isAutocomplete)&&!this.__isValueSelected(i)){var j=this.cache.getItems(i,this.filterFunction);
var l=f(j);
this.list.__unselectPrevious();
this.list.__setItems(l);
f(document.getElementById(this.id+"Items")).children().detach();
f(document.getElementById(this.id+"Items")).append(l)
}},__getClientItemFromCache:function(j){var l;
var m;
if(this.enableManualInput){var n=this.cache.getItems(j,this.filterFunction);
if(n&&n.length>0){var i=f(n[0]);
f.each(this.clientSelectItems,function(){if(this.id==i.attr("id")){m=this.label;
l=this.value;
return false
}})
}else{m=j;
l=""
}}if(m){return{label:m,value:l}
}},__getClientItem:function(i){var j;
var l=i;
f.each(this.clientSelectItems,function(){if(l==this.label){j=this.value
}});
if(l&&j){return{label:l,value:j}
}},__isValueSelected:function(j){var i=this.__getClientItemFromCache(j);
return i.label===j&&i.value==this.getValue()
},__selectItemByLabel:function(i){if(this.enableManualInput||i<48||(i>57&&i<65)||i>90){return false
}if(!this.popupList.isVisible()){this.__updateItems();
this.__showPopup()
}var l=new Array();
f.each(this.clientSelectItems,function(m){if(this.label[0].toUpperCase().charCodeAt(0)==i){l.push(m)
}});
if(l.length){var j=0;
if(this.lastKeyCode&&this.lastKeyCode==i){j=this.lastKeyCodeCount+1;
if(j>=l.length){j=0
}}this.lastKeyCode=i;
this.lastKeyCodeCount=j;
this.list.__selectByIndex(l[j])
}return false
},__showPopup:function(){if(this.originalItems.length>0){this.popupList.show();
if(!this.options.enableManualInput||this.__isValueSelected(this.getLabel())){if(this.originalItems.length>this.popupList.list.items.length){this.popupList.list.__unselectPrevious();
this.popupList.list.__setItems(this.originalItems);
f(document.getElementById(this.id+"Items")).children().detach();
f(document.getElementById(this.id+"Items")).append(this.originalItems)
}this.list.__selectItemByValue(this.getValue())
}}this.invokeEvent.call(this,"listshow",document.getElementById(this.id))
},__hidePopup:function(){this.popupList.hide();
this.invokeEvent.call(this,"listhide",document.getElementById(this.id))
},showPopup:function(){if(!this.popupList.isVisible()){this.__updateItems();
this.__showPopup()
}this.__setInputFocus();
if(!this.focused){if(this.__getValue()==this.defaultLabel){this.__setValue("")
}this.focusValue=this.selValueInput.val();
this.focused=true;
this.invokeEvent.call(this,"focus",document.getElementById(this.id))
}},hidePopup:function(){if(this.popupList.isVisible()){this.__hidePopup();
var i=this.__getValue();
if(!i||i==""){this.__setValue(this.defaultLabel);
this.selValueInput.val("")
}this.focused=false;
this.invokeEvent.call(this,"blur",document.getElementById(this.id));
if(this.focusValue!=this.selValueInput.val()){this.invokeEvent.call(this,"change",document.getElementById(this.id))
}}},processItem:function(j){var l=f(j).attr("id");
var m,i;
f.each(this.clientSelectItems,function(){if(this.id==l){m=this.label;
i=this.value;
return false
}});
this.__setValue(m);
this.selValueInput.val(i);
this.__hidePopup();
this.__setInputFocus();
this.invokeEvent.call(this,"selectitem",document.getElementById(this.id))
},__save:function(){var j="";
var m="";
var l=this.__getValue();
var i;
if(l&&l!=""){if(this.enableManualInput){i=this.__getClientItemFromCache(l)
}else{i=this.__getClientItem(l)
}if(i){m=i.label;
j=i.value
}}this.__setValue(m);
this.selValueInput.val(j)
},onblur:function(i){this.__hidePopup();
var j=this.__getValue();
if(!j||j==""){this.__setValue(this.defaultLabel);
this.selValueInput.val("")
}this.focused=false;
this.invokeEvent.call(this,"blur",document.getElementById(this.id),i);
if(this.focusValue!=this.selValueInput.val()){this.invokeEvent.call(this,"change",document.getElementById(this.id),i)
}},getValue:function(){return this.selValueInput.val()
},setValue:function(i){if(i==null||i==""){this.__setValue("");
this.__save();
this.__updateItems();
return
}var j;
for(var l=0;
l<this.clientSelectItems.length;
l++){j=this.clientSelectItems[l];
if(j.value==i){this.__setValue(j.label);
this.__save();
this.list.__selectByIndex(l);
return
}}},getLabel:function(){return this.__getValue()
},destroy:function(){this.popupList.destroy();
this.popupList=null;
e.destroy.call(this)
}}
})());
g.csv=g.csv||{};
g.csv.validateSelectLabelValue=function(n,o,p,i){var l=f(document.getElementById(o+"selValue")).val();
var m=f(document.getElementById(o+"Input")).val();
var j=RichFaces.component(o).defaultLabel;
if(!l&&m&&(m!=j)){throw g.csv.getMessage(null,"UISELECTONE_INVALID",[o,""])
}}
})(RichFaces.jQuery,window.RichFaces);
(function(d,e){e.ui=e.ui||{};
e.ui.OrderingList=function(g,j){var h=d.extend({},a,j);
c.constructor.call(this,g,h);
this.namespace=this.namespace||"."+e.Event.createNamespace(this.name,this.id);
this.attachToDom();
h.scrollContainer=d(document.getElementById(g+"Items"));
this.orderingList=d(document.getElementById(g));
this.list=new e.ui.ListMulti(g+"List",h);
var i=h.hiddenId===null?g+"SelValue":h.hiddenId;
this.hiddenValues=d(document.getElementById(i));
this.selectItemCss=h.selectItemCss;
this.disabled=h.disabled;
this.upButton=d(".rf-ord-up",this.orderingList);
this.upButton.bind("click",d.proxy(this.up,this));
this.upTopButton=d(".rf-ord-up-tp",this.orderingList);
this.upTopButton.bind("click",d.proxy(this.upTop,this));
this.downButton=d(".rf-ord-dn",this.orderingList);
this.downButton.bind("click",d.proxy(this.down,this));
this.downBottomButton=d(".rf-ord-dn-bt",this.orderingList);
this.downBottomButton.bind("click",d.proxy(this.downBottom,this));
this.focused=false;
this.keepingFocus=false;
f.call(this,h);
if(h.onmoveitems&&typeof h.onmoveitems=="function"){e.Event.bind(this.list,"moveitems",h.onmoveitems)
}e.Event.bind(this.list,"moveitems",d.proxy(this.toggleButtons,this));
e.Event.bind(this.list,"selectItem",d.proxy(this.toggleButtons,this));
e.Event.bind(this.list,"unselectItem",d.proxy(this.toggleButtons,this));
e.Event.bind(this.list,"keydown"+this.list.namespace,d.proxy(this.__keydownHandler,this));
if(j.onchange&&typeof j.onchange=="function"){e.Event.bind(this,"change"+this.namespace,j.onchange)
}d(document).ready(d.proxy(this.toggleButtons,this))
};
e.BaseComponent.extend(e.ui.OrderingList);
var c=e.ui.OrderingList.$super;
var a={defaultLabel:"",itemCss:"rf-ord-opt",selectItemCss:"rf-ord-sel",listCss:"rf-ord-lst-cord",clickRequiredToSelect:true,disabled:false,hiddenId:null};
var f=function(g){if(g.onfocus&&typeof g.onfocus=="function"){e.Event.bind(this,"listfocus"+this.namespace,g.onfocus)
}if(g.onblur&&typeof g.onblur=="function"){e.Event.bind(this,"listblur"+this.namespace,g.onblur)
}var h={};
h["listfocus"+this.list.namespace]=d.proxy(this.__focusHandler,this);
h["listblur"+this.list.namespace]=d.proxy(this.__blurHandler,this);
e.Event.bind(this.list,h,this);
h={};
h["focus"+this.namespace]=d.proxy(this.__focusHandler,this);
h["blur"+this.namespace]=d.proxy(this.__blurHandler,this);
e.Event.bind(this.upButton,h,this);
e.Event.bind(this.upTopButton,h,this);
e.Event.bind(this.downButton,h,this);
e.Event.bind(this.downBottomButton,h,this)
};
d.extend(e.ui.OrderingList.prototype,(function(){return{name:"ordList",defaultLabelClass:"rf-ord-dflt-lbl",getName:function(){return this.name
},getNamespace:function(){return this.namespace
},__focusHandler:function(g){this.keepingFocus=this.focused;
if(!this.focused){this.focused=true;
e.Event.fire(this,"listfocus"+this.namespace,g)
}},__blurHandler:function(g){var h=this;
this.timeoutId=window.setTimeout(function(){if(!h.keepingFocus){h.focused=false;
e.Event.fire(h,"listblur"+h.namespace,g)
}h.keepingFocus=false
},200)
},__keydownHandler:function(g){if(g.isDefaultPrevented()){return
}if(!g.metaKey){return
}var h;
if(g.keyCode){h=g.keyCode
}else{if(g.which){h=g.which
}}switch(h){case e.KEYS.DOWN:g.preventDefault();
this.down();
break;
case e.KEYS.UP:g.preventDefault();
this.up();
break;
case e.KEYS.HOME:g.preventDefault();
this.upTop();
break;
case e.KEYS.END:g.preventDefault();
this.downBottom();
break;
default:break
}return
},getList:function(){return this.list
},up:function(){this.keepingFocus=true;
this.list.setFocus();
var g=this.list.getSelectedItems();
this.list.move(g,-1);
this.encodeHiddenValues()
},down:function(){this.keepingFocus=true;
this.list.setFocus();
var g=this.list.getSelectedItems();
this.list.move(g,1);
this.encodeHiddenValues()
},upTop:function(){this.keepingFocus=true;
this.list.setFocus();
var g=this.list.getSelectedItems();
var h=this.list.items.index(g.first());
this.list.move(g,-h);
this.encodeHiddenValues()
},downBottom:function(){this.keepingFocus=true;
this.list.setFocus();
var g=this.list.getSelectedItems();
var h=this.list.items.index(g.last());
this.list.move(g,(this.list.items.length-1)-h);
this.encodeHiddenValues()
},encodeHiddenValues:function(){var h=this.hiddenValues.val();
var g=this.list.csvEncodeValues();
if(h!==g){this.hiddenValues.val(g);
e.Event.fire(this,"change"+this.namespace,{oldValues:h,newValues:g})
}},toggleButtons:function(){var g=this.list.__getItems();
if(this.disabled||this.list.getSelectedItems().length===0){this.__disableButton(this.upButton);
this.__disableButton(this.upTopButton);
this.__disableButton(this.downButton);
this.__disableButton(this.downBottomButton)
}else{if(this.list.items.index(this.list.getSelectedItems().first())===0){this.__disableButton(this.upButton);
this.__disableButton(this.upTopButton)
}else{this.__enableButton(this.upButton);
this.__enableButton(this.upTopButton)
}if(this.list.items.index(this.list.getSelectedItems().last())===(this.list.items.length-1)){this.__disableButton(this.downButton);
this.__disableButton(this.downBottomButton)
}else{this.__enableButton(this.downButton);
this.__enableButton(this.downBottomButton)
}}},__disableButton:function(g){if(!g.hasClass("rf-ord-btn-dis")){g.addClass("rf-ord-btn-dis")
}if(!g.attr("disabled")){g.attr("disabled",true)
}},__enableButton:function(g){if(g.hasClass("rf-ord-btn-dis")){g.removeClass("rf-ord-btn-dis")
}if(g.attr("disabled")){g.attr("disabled",false)
}}}
})())
})(RichFaces.jQuery,window.RichFaces);
(function(d,e){e.ui=e.ui||{};
e.ui.InplaceSelect=function(f,h){var g=d.extend({},a,h);
c.constructor.call(this,f,g);
this.getInput().bind("click",d.proxy(this.__clickHandler,this));
g.attachTo=f;
g.scrollContainer=d(document.getElementById(f+"Items")).parent()[0];
g.focusKeeperEnabled=false;
this.popupList=new e.ui.PopupList(f+"List",this,g);
this.list=this.popupList.__getList();
this.clientSelectItems=g.clientSelectItems;
this.selValueInput=d(document.getElementById(f+"selValue"));
this.initialValue=this.selValueInput.val();
this.listHandler=d(document.getElementById(f+"List"));
this.listHandler.bind("mousedown",d.proxy(this.__onListMouseDown,this));
this.listHandler.bind("mouseup",d.proxy(this.__onListMouseUp,this));
this.openOnEdit=g.openOnEdit;
this.saveOnSelect=g.saveOnSelect;
this.savedIndex=-1;
this.inputItem=d(document.getElementById(f+"Input"));
this.inputItemWidth=this.inputItem.width();
this.inputWidthDefined=h.inputWidth!==undefined
};
e.ui.InplaceInput.extend(e.ui.InplaceSelect);
var c=e.ui.InplaceSelect.$super;
var a={defaultLabel:"",saveOnSelect:true,openOnEdit:true,showControl:false,itemCss:"rf-is-opt",selectItemCss:"rf-is-sel",listCss:"rf-is-lst-cord",noneCss:"rf-is-none",editCss:"rf-is-fld-cntr",changedCss:"rf-is-chng"};
d.extend(e.ui.InplaceSelect.prototype,(function(){return{name:"inplaceSelect",defaultLabelClass:"rf-is-dflt-lbl",getName:function(){return this.name
},getNamespace:function(){return this.namespace
},onshow:function(){c.onshow.call(this);
if(this.openOnEdit){this.__showPopup();
this.list.__scrollToSelectedItem()
}},onhide:function(){this.__hidePopup()
},showPopup:function(){c.__show.call(this)
},__showPopup:function(){this.popupList.show();
this.__hideLabel()
},hidePopup:function(){c.__hide.call(this)
},__hidePopup:function(){this.popupList.hide();
this.__showLabel()
},onsave:function(){var g=this.list.currentSelectItem();
if(g){var h=this.list.getSelectedItemIndex();
var f=this.list.getClientSelectItemByIndex(h);
var i=f.label;
if(i==this.__getValue()){this.savedIndex=h;
this.saveItemValue(f.value);
this.list.__selectByIndex(this.savedIndex)
}else{this.list.__selectItemByValue(this.getValue())
}}},oncancel:function(){var g=this.list.getClientSelectItemByIndex(this.savedIndex);
var f=g&&g.value?g.value:this.initialValue;
this.saveItemValue(f);
this.list.__selectItemByValue(f)
},onblur:function(f){this.__hidePopup();
c.onblur.call(this)
},onfocus:function(f){if(!this.__isFocused()){this.__setFocused(true);
this.focusValue=this.selValueInput.val();
this.invokeEvent.call(this,"focus",document.getElementById(this.id),f)
}},processItem:function(f){var g=d(f).data("clientSelectItem").label;
this.__setValue(g);
this.__setInputFocus();
this.__hidePopup();
if(this.saveOnSelect){this.save()
}this.invokeEvent.call(this,"selectitem",document.getElementById(this.id))
},saveItemValue:function(f){this.selValueInput.val(f)
},__isValueChanged:function(){return(this.focusValue!=this.selValueInput.val())
},__keydownHandler:function(f){var g;
if(f.keyCode){g=f.keyCode
}else{if(f.which){g=f.which
}}if(this.popupList.isVisible()){switch(g){case e.KEYS.DOWN:f.preventDefault();
this.list.__selectNext();
this.__setInputFocus();
break;
case e.KEYS.UP:f.preventDefault();
this.list.__selectPrev();
this.__setInputFocus();
break;
case e.KEYS.RETURN:f.preventDefault();
this.list.__selectCurrent();
this.__setInputFocus();
return false;
break
}}c.__keydownHandler.call(this,f)
},__blurHandler:function(f){if(this.saveOnSelect||!this.isMouseDown){if(this.isEditState()){this.timeoutId=window.setTimeout(d.proxy(function(){this.onblur(f)
},this),200)
}}else{this.__setInputFocus();
this.isMouseDown=false
}},__clickHandler:function(f){this.__showPopup()
},__onListMouseDown:function(f){this.isMouseDown=true
},__onListMouseUp:function(f){this.isMouseDown=false;
this.__setInputFocus()
},__showLabel:function(f){this.label.show();
this.editContainer.css("position","absolute");
this.inputItem.width(this.inputItemWidth)
},__hideLabel:function(f){this.label.hide();
this.editContainer.css("position","static");
if(!this.inputWidthDefined){this.inputItem.width(this.label.width())
}},getValue:function(){return this.selValueInput.val()
},setValue:function(g){var h=this.list.__selectItemByValue(g);
var f=h.data("clientSelectItem");
this.__setValue(f.label);
if(this.__isValueChanged()){this.save();
this.invokeEvent.call(this,"change",document.getElementById(this.id))
}},destroy:function(){this.popupList.destroy();
this.popupList=null;
c.destroy.call(this)
}}
})())
})(RichFaces.jQuery,window.RichFaces);