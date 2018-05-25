var t;
var locale;
var topProductsViewEnabled=false;
var advancedSearch;
var queue=[];
var MAX_QUEUE_LIMIT=4;
var running=0;
var topProductsTitle;
var topProductsSubTitle;
var topProductsTimeoutVar;
var topProductsFirstCategoryURL;
var topProductsFirstCategoryName;
var isCategoryAvailable=false;
function populateTopProductsLabels(b,a,c){topProductsTitle=b;
topProductsSubTitle=a;
topProductsViewEnabled=c
}function retrieveTfgsCheck(c,b,a){locale=b;
advancedSearch=a;
if(topProductsViewEnabled){jQuery(".predictiveSearchDiv").css("height","");
jQuery(".topProductsDiv").css("height","");
jQuery(".autoCompleteDiv").css("height","");
hideStuff("topProductsContainer")
}if(c.length>=maxLength){t=setTimeout("retrieveCatlogue()",maxDelay)
}else{document.getElementById("txtHint").innerHTML="";
document.getElementById("txtHintBox").style.display="none";
return
}}function stopCount(){clearTimeout(t)
}function trim(a){if(a!=null){a=a.replace(/^\s+/g,"");
a=a.replace(/\s+$/g,"");
a=a.replace(/\s+/g," ");
return a
}}var req;
function retrieveCatlogue(){var a=document.getElementById("lastSearch").value;
var b=document.getElementById("searchForm:searchTerm").value;
if(b.length==0){document.getElementById("txtHint").innerHTML="";
document.getElementById("txtHintBox").style.display="none";
return
}if(b!=null){b=trim(b)
}if(b!=a){var c="/predictivesearch/catSearch?searchTerm="+encodeURIComponent(b)+"&locale="+encodeURIComponent(locale)+"&advancedPredictiveSearchEnabled="+advancedSearch;
if(window.XMLHttpRequest){req=new XMLHttpRequest();
req.onreadystatechange=populateCatalogue;
try{req.open("GET",c,true)
}catch(d){alert("Cannot connect to server")
}req.send(null)
}else{if(window.ActiveXObject){req=new ActiveXObject("Microsoft.XMLHTTP");
if(req){req.onreadystatechange=populateCatalogue;
req.open("GET",c,true);
req.send()
}}}}else{if(b==a){populateLastresults()
}}}function populateCatalogue(){var jsonData=null;
var tfgList="";
var searchTerm=document.getElementById("searchForm:searchTerm").value;
if(searchTerm!=null){searchTerm=trim(searchTerm)
}if(req.readyState==4){var textToSplit=removeLastDelimitor(req.responseText);
if(textToSplit.length!=0){var checkSession=textToSplit.split("><");
if(checkSession[0]=="<html"){return
}jsonData=eval("("+req.responseText+")");
if(advancedSearch==="false"){tfgList=populateSimpleCatalogue(jsonData)
}else{tfgList=populateAdvancedCatalogue(jsonData,searchTerm)
}document.getElementById("lastSearch").value=searchTerm;
document.getElementById("storedresponse").value=tfgList;
new AutoComplete(tfgList,document.getElementById("searchForm:searchTerm"),document.getElementById("txtHint"))
}else{document.getElementById("txtHint").innerHTML="";
document.getElementById("txtHintBox").style.display="none";
return
}}}function populateSimpleCatalogue(e){document.getElementById("txtHintBox").style.fontSize="11px";
document.getElementById("txtHintBox").style.marginTop="-3px";
var c="";
var d=0;
for(var g in e){if(e.hasOwnProperty(g)){var b=e[g];
for(var f in b){var a="";
if(b[f].indexOf("/web")>-1){a=b[f]
}else{a="/web"+b[f]+"?sra=p"
}c=c+"<li class=dropDown><a id="+d+" onmouseover='rollover(this);' href='"+a+"'>"+f+"</a></li>";
++d
}}}return c
}function populateAdvancedCatalogue(n,f){var m=document.getElementById("txtHintBox").style;
m.fontSize="12px";
m.backgroundColor="#FFFFFF";
m.marginTop="-3px";
var d="";
var b="";
var h=0;
var k=true;
isCategoryAvailable=false;
var c=document.getElementById("secureurl").value;
for(var o in n){if(n.hasOwnProperty(o)){d=d+"<li class=advSecContainer><span class=sectionTitle>"+o+"</span><div class=clearBoth></div></li>";
var l=n[o];
for(var p in l){var a=p.replace(new RegExp("("+f+")","gi"),"<b>$1</b>");
b=l[p];
if(b.indexOf("/web")>-1){if(topProductsViewEnabled&&(b.indexOf("/c/")==4)&&(b.indexOf("searchTerm")==-1)){var e=p.replace(/\'/g,"");
var j=b.replace(/\/web|\?sra=p/g,"");
d=d+"<li class=advItemContainer onmouseover=showStuff('topProductsContainer'); onmouseenter='getTopProducts(\""+j+'","'+e+"\");' onmouseout=hideStuff('topProductsContainer');><a id="+h+" href='"+c+b+"'>"+a+"</a></li>";
if(k){k=false;
isCategoryAvailable=true;
topProductsFirstCategoryURL=j;
topProductsFirstCategoryName=e;
showTopProductsOnLoad(topProductsFirstCategoryURL,topProductsFirstCategoryName)
}}else{d=d+"<li class=advItemContainer><a id="+h+" href='"+c+b+"'>"+a+"</a></li>"
}}else{var g=l[p];
if(g.indexOf("?")>-1){b="/web"+l[p]+"&sra=p&r=t"
}else{b="/web"+l[p]+"?sra=p&r=t"
}if(topProductsViewEnabled&&(g.indexOf("/c/")==0)&&(g.indexOf("searchTerm")==-1)){var e=p.replace(/\'/g,"");
d=d+"<li class=advItemContainer onmouseover=showStuff('topProductsContainer'); onmouseenter='getTopProducts(\""+g+'","'+e+"\");' onmouseout=hideStuff('topProductsContainer');><a id="+h+" href='"+c+b+"'>"+a+"</a></li>";
if(k){k=false;
isCategoryAvailable=true;
topProductsFirstCategoryURL=g;
topProductsFirstCategoryName=e;
showTopProductsOnLoad(topProductsFirstCategoryURL,topProductsFirstCategoryName)
}}else{d=d+"<li class=advItemContainer><a id="+h+" href='"+c+b+"'>"+a+"</a></li>"
}}++h
}d=d+"<li class='separator'></li>"
}}return trimRight(d,"<li class='separator'></li>")
}function showTopProductsOnLoad(a,b){topProductsTimeoutVar=setTimeout(function(){showStuff("topProductsContainer");
getTopProducts(a,b)
},topProductsMaxDelay)
}function stopTopProductsOnLoad(){clearTimeout(topProductsTimeoutVar)
}function trimRight(b,a){return b.replace(new RegExp(a+"+$"),"")
}function convert(a){return a.replace(/&/g,"&#38;").replace(/>/g,"&#62;").replace(/</g,"&#60;").replace(/"/g,"&#34;").replace(/'/g,"&#39;").replace(/,/g,"&#44;").replace(/-/g,"&#45;")
}function populateLastresults(){var a=document.getElementById("storedresponse").value;
new AutoComplete(a,document.getElementById("searchForm:searchTerm"),document.getElementById("txtHint"));
if(topProductsViewEnabled&&isCategoryAvailable){showStuff("topProductsContainer");
getTopProducts(topProductsFirstCategoryURL,topProductsFirstCategoryName)
}}function stopCount(){clearTimeout(t)
}var autoCompleteItemSelected=false;
var navigatingList=false;
var childLink;
function AutoComplete(a,b,c){if(a.length!=0){this.oText=b;
this.oDiv=c;
document.getElementById("txtHintBox").style.display="block";
document.getElementById("txtHint").innerHTML=a;
b.AutoComplete=this;
c.AutoComplete=this;
b.onkeyup=AutoComplete.prototype.onTextChange;
if(advancedSearch==="false"){c.onmouseover=AutoComplete.prototype.onDivMouseOver
}}}AutoComplete.prototype.onTextChange=function(){var h=arguments[0]||window.event;
var c=h.which||h.keyCode;
var f=this.AutoComplete;
if(typeof f.whichSelected==undefined){f.whichSelected=-1
}var a=f.whichSelected;
var d=jQuery(f.oDiv).find("li a").parent();
var g=false;
childLink="";
switch(c){case 38:f.whichSelected=a>0?a-1:d.length;
g=true;
break;
case 40:f.whichSelected=a>-1&&a<d.length?a+1:0;
g=true;
break;
case 27:document.getElementById("txtHintBox").style.display="none";
g=true;
break;
case 13:if(document.getElementById("txtHintBox").style.display=="block"){document.getElementById("txtHintBox").style.display="none";
g=true
}else{g=false
}break;
default:f.whichSelected=-1;
this.AutoComplete.onchange();
autoCompleteItemSelected=false;
break
}if(g){navigatingList=true;
for(var b=0;
b<d.length;
b++){if(d[b].className!="separator"){if(b==f.whichSelected){if(advancedSearch==="false"){d[b].className="AutoCompleteHighlight"
}else{d[b].className="advancedAutoCompHighlight"
}childLink=document.getElementById(b);
document.onkeyup=keyHandler;
var j=document.getElementById("autoc");
j.value="true"
}else{d[b].className="AutoCompleteBackground"
}if(d[b].className==="advancedAutoCompHighlight"){jQuery(d[b]).find("a").addClass("advancedHighlight")
}else{jQuery(d[b]).find("a").removeClass("advancedHighlight")
}}}g=false
}else{navigatingList=false
}};
function keyHandler(b){if(navigator.appName=="Microsoft Internet Explorer"){var a=event
}else{var a=b
}if(a.keyCode==13){if(childLink!=""){document.location.href=childLink;
return false
}else{return
}}else{return
}}AutoComplete.prototype.onDivMouseDown=function(){this.AutoComplete.oText.value=this.innerHTML;
autoCompleteItemSelected=true
};
var liValueglobal="";
function rollover(a){liValueglobal=a.innerHTML
}AutoComplete.prototype.onDivMouseOver=function(){var g=/^.*\"\>/;
var a=/\<.*$/;
var f=this.AutoComplete;
var b=document.getElementById("txtHint");
var e=b.childNodes;
for(var c=0;
c<e.length;
c++){var d=e[c].innerHTML.replace(g,"");
d=d.replace(a,"");
if(d==liValueglobal){f.whichSelected=c;
e[c].className="AutoCompleteHighlight"
}else{e[c].className="AutoCompleteBackground"
}}};
AutoComplete.prototype.onDivMouseOut=function(){this.className="AutoCompleteBackground"
};
AutoComplete.prototype.onchange=function(){var a=this.oText.value;
retrieveTfgsCheck(a,locale,advancedSearch)
};
function removeDefaultText(b,a){if(b!=null){var c=b.value;
if(c==a){b.value="";
b.style.color="#000000";
b.focus()
}}}function addDefaultText(c,b){var a=document.getElementById("searchForm:searchTerm").value;
if(c!=null){var d=c.value;
if(trim(d)==""){c.value=b;
c.style.color="#c8c8c8"
}if((a)&&(a!=b)&&(objSearchTerm.value==a)){c.value=a;
c.style.color="#000"
}}}function removeLastDelimitor(a){if(a!=null){a=a.replace(/\|\|$/g,"");
return a
}}function getTopProducts(a,b){queue.push(a);
loadTopProducts(b)
}function loadTopProducts(c){while(running<MAX_QUEUE_LIMIT&&queue.length){running+=1;
var a=queue.shift();
var b="/predictivesearch/top-products/locales/"+locale+"/categories"+a;
if(window.XMLHttpRequest){req=new XMLHttpRequest();
req.onreadystatechange=function(){populateTopProducts(c)
};
try{req.open("GET",b,true)
}catch(d){alert("Cannot connect to top prods server")
}req.send(null)
}else{if(window.ActiveXObject){req=new ActiveXObject("Microsoft.XMLHTTP");
if(req){req.onreadystatechange=function(){populateTopProducts(c)
};
req.open("GET",b,true);
req.send()
}}}}}function equalHeightSearchDivs(){var c=jQuery(".predictiveSearchDiv").height();
var a=jQuery(".autoCompleteDiv").height();
var b=jQuery(".topProductsDiv").height();
if(a>b){jQuery(".topProductsDiv").css("height",a)
}else{jQuery(".autoCompleteDiv").css("height",b)
}b=jQuery(".topProductsDiv").height();
jQuery(".predictiveSearchDiv").css("height",(b+22))
}function populateTopProducts(catKey){running-=1;
var jsonData=null;
if(req.readyState==4&&req.status==200){jsonData=eval("("+req.responseText+")")
}if(jsonData!=null&&catKey!=""&&jsonData!=""&&jsonData.products.length>0){populateTopProductsData(jsonData,catKey);
equalHeightSearchDivs()
}}function populateTopProductsData(e,f){var h;
var c="";
var a="";
var j=-1;
j=f.lastIndexOf(">");
if(j>=0){c=f.substring(j+1)
}var b=document.getElementById("secureurl").value;
var g="<li><div><span class=topProductsTitle>"+topProductsTitle+" </span><span class=topProductsSubTitle>"+topProductsSubTitle+c+" </span></div></li>";
for(var d=0;
d<e.products.length;
d++){h=e.products[d].imagePath;
a=b+"/web/p/products/"+e.products[d].productNumber+"/?tpr="+(d+1);
g+="<li class=prodItem><div class=floatLeft><a href='"+a+"'><table class=productThumbnailTbl><tr><td><img src='"+h+"'/></td></tr></table></a></div><div class='floatRight prodInfoDiv'><div class='linkText'><a href='"+a+"'>"+e.products[d].longDescription+"</a></div><span class='brandText'>"+e.products[d].brandName+"</span></div></li>"
}document.getElementById("topProdsList").innerHTML=g
};