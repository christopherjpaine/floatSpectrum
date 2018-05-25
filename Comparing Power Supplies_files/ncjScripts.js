//Java Script functions used for NCJ application//

/* eslint-disable */

function isGovtOrganisation(siret){
	return ((siret.substring(0, 1) == "1" ) || (siret.substring(0, 1) == "2"));    
}

function updateOrderNumberLabel(siret, defaultLabelId, frGovtLabelId){
	if (null != siret){
		defaultLabel = document.getElementById(defaultLabelId);
		defaultLabel.style.display='none';
		frGovtLabel = document.getElementById(frGovtLabelId);
		frGovtLabel.style.display='none';
		
		if (isGovtOrganisation(siret)) {  
			frGovtLabel.style.display='block';
		} else {
			defaultLabel.style.display='block';
		}
	}
}


function displayServiceExecutant(siret, serviceExecutantTextId, serviceExecutantDecorateId){
	if (null != siret){
    if (isGovtOrganisation(siret)) {  
  	  serviceExecutantDecorate = document.getElementById(serviceExecutantDecorateId);
  	  serviceExecutantDecorate.style.display='block';
	  } else {
		  serviceExecutantDecorate = document.getElementById(serviceExecutantDecorateId);
		  serviceExecutantDecorate.style.display='none';
		  serviceExecutant = document.getElementById(serviceExecutantTextId);		  
		  serviceExecutant.value = "";
    }
	}
}

function showOrHideFieldsbasedOnSiret(siret, defaultLabelId, frGovtLabelId, serviceExecutantTextId, serviceExecutantDecorateId){
	displayServiceExecutant(siret, serviceExecutantTextId, serviceExecutantDecorateId);
	updateOrderNumberLabel(siret, defaultLabelId, frGovtLabelId);
}

//Flag to control GA events throughout web site.
var isAnalyticsEnabledGA=false;
function showStuff(id) {// function to show element.
    document.getElementById(id).style.display = 'block';
}
function hideStuff(id) { // function to hide the element.
    document.getElementById(id).style.display = 'none';
}
function equalHeight(group) {// function to make height of multiple elements Equal.
    tallest = 0;
    group.each(function() {thisHeight = jQuery(this).height();if(thisHeight > tallest) {tallest = thisHeight;}});
    group.height(tallest);
}
function equalHeightRow(group) {// function to make height of multiple elements Equal.
   	var currentTallest = 0,
    currentRowStart = 0,
	topPosition = 9999,
    rowDivs = new Array();
    
 group.each(function() {
   jQuery.el = jQuery(this);
   topPostion = jQuery.el.position().top;
   if (currentRowStart != topPostion) {
     // we just came to a new row.  Set all the heights on the completed row
     for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
       rowDivs[currentDiv].height(currentTallest);
     }
     // set the variables for the new row
     rowDivs.length = 0; // empty the array
     currentRowStart = topPostion;
     currentTallest = jQuery.el.height();
     rowDivs.push(jQuery.el);
   } else {
     // another div on the current row.  Add it to the list and check if it's taller
     rowDivs.push(jQuery.el);
     currentTallest = (currentTallest < jQuery.el.height()) ? (jQuery.el.height()) : (currentTallest);
   }
	// do the last row
   for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
     rowDivs[currentDiv].height(currentTallest);
   }
 });
 }

function equalWidth(group) {// function to make width of multiple elements Equal.
    widest = 0;
    group.each(function() {thisWidth = jQuery(this).width();if(thisWidth > widest) {widest = thisWidth;}});
    group.width(widest);
}
function equalWidthParam(columnCount){// function to match column width on parametric view for columns < 5.
     if(columnCount<=5){
    for (var i=2; i<=columnCount; i++){
        var newWidth = (85 / columnCount) - 0.2 + "%";
        document.getElementById("paramQuantity"+i).style.width = newWidth;
    }}
}
function equalWidthMpn(columnCount){// function to match column width on parametric view for columns < 5.
     if(columnCount<5){
    for (var i=2; i<=columnCount+1; i++){
        document.getElementById("paramMnpDiv"+i).style.width = "98%";
    }}
}
function booksOver(bookelement){// function to show book list on mouseOver.
    jQuery.elementId=bookelement.id;    
    if(jQuery(bookelement).hasClass('booksHeader')) {jQuery.bookId = "bookList" + jQuery.elementId;}
    else{jQuery.bookId = jQuery.elementId;jQuery.elementId = jQuery.elementId.replace(/bookList/ig, "");}
    jQuery.booksDiv = "div#" + jQuery.bookId;
    jQuery.headerDiv = "th#" +jQuery.elementId;
    jQuery(jQuery.booksDiv).removeClass("bookList").addClass("bookList block");
    jQuery(jQuery.headerDiv).removeClass("booksHeader").addClass("booksHeaderHover");
}
function booksOut(bookelement){// function to hide book list on mouseOut.
    jQuery.elementId=bookelement.id;
    if(jQuery(bookelement).hasClass('booksHeaderHover')) {jQuery.bookId = "bookList" + jQuery.elementId;}
    else{jQuery.bookId = jQuery.elementId;jQuery.elementId = jQuery.bookId.replace(/bookList/ig, "");}        
    jQuery.booksDiv = "div#" + jQuery.bookId;
    jQuery.headerDiv = "th#" +jQuery.elementId;
    jQuery(jQuery.booksDiv).removeClass("bookList block").addClass("bookList");
    jQuery(jQuery.headerDiv).removeClass("booksHeaderHover").addClass("booksHeader");
}
function changeRowColor(someNumber,idValue){// function to check the element id odd/even & change the bg color.
    var isEven = function(someNumber){
    return (someNumber%2 == 0) ? true : false;};
    if (isEven(someNumber) == false){document.getElementById(idValue+someNumber).style.background = "#F6F5F5";}
}
function printDiv(windowId,width,height){// function to print the DIV element.
    var DocumentContainer = document.getElementById(windowId);
    var WindowObject = window.open("","PrintWindow","width="+width,"height="+height,"top=50","left=50", 
    "toolbars=no","scrollbars=yes","status=no","resizable=yes");
    WindowObject.document.writeln(DocumentContainer.innerHTML);
    WindowObject.document.close();
    WindowObject.focus();
    WindowObject.print();
    WindowObject.close();
}
function showLine(stockNo){// function used in Overview to go to product Line level.
    stockNo = stockNo.replace("-","");
    window.location="/web/"+stockNo+".html";
}
function rs_genExpAtt()
{    var separator = "-_-";
    var retVal ="";
    for( var i = 0; i < arguments.length; i++ ) {
            retVal = retVal + arguments[i] + separator;
    }
    
    retVal = retVal.replace ( /-_-$/g, "");// remove trailing separator.        
    
    return retVal;
}
function rs_gaAddRealEstate(divElement){
// Google Analytics function, used in conjunction with the values in the page template.
var rs_ga_page = jQuery(divElement).attr("rs_ga_page"); // expected value NAV_SR, NAV_PRODUCT, NAV_TN,NAV_L<N>.
var rs_ga_region = jQuery(divElement).attr("rs_ga_region");
var rs_ga_zone = jQuery(divElement).attr("rs_ga_zone");
//alert("rs_gaAddRealEstate = "+rs_ga_page+"|"+rs_ga_region+ ",'CLICK', '"+rs_ga_zone+"', '0'");
//Please uncomment following line when _gaq.push method is available & delete this line.
_gaq.push(['_trackEvent',rs_ga_page+ '|' + rs_ga_region,'CLICK',rs_ga_zone, 0]);
}
function rs_gaAddTrackEvent(divElement){// Google Analytics function, used in conjunction with the values in the page template.
var rs_ga_page = jQuery(divElement).attr("rs_ga_page"); // expected values FILTER_SR, FILTER_TN|<Family ID>
if(rs_ga_page == 'FILTER_TN') {
    var rs_ga_hierarchy_id = jQuery(divElement).attr("rs_ga_hierarchy_id");
    rs_ga_page = rs_ga_page + '|' + rs_ga_hierarchy_id;
}var rs_ga_action = jQuery(divElement).attr("rs_ga_action"); // CHECK, UNCHECK, UNCHECK ALL.
var rs_ga_label = jQuery(divElement).attr("rs_ga_label");
//alert("rs_gaAddTrackEvent ="+rs_ga_page+","+rs_ga_action+","+rs_ga_label+",0");// delete this line once functionality is done.
//Please uncomment following line when _gaq.push method is available & delete this line.
_gaq.push(['_trackEvent',rs_ga_page,rs_ga_action,rs_ga_label, 0]);
}
function rs_gaTrackEvent(varargs){// 14.1 Google Analytics function.
    if(isAnalyticsEnabledGA === 'true'){
        if(arguments.length > 1){
            var rs_ga_page = arguments[0];
            var rs_ga_action = arguments[1];
            var rs_ga_filter_category = arguments[2];
            _gaq.push(['_trackEvent',arguments[0],arguments[1],arguments[2],0]);
        } else {
            var rs_ga_page = jQuery(arguments[0]).attr("rs_ga_page"); // expected values NAV_TN, NAV_TNS, NAV_TNF|<FILTER STATE>
            var rs_ga_action = jQuery(arguments[0]).attr("rs_ga_action"); //
            var rs_ga_filter_category = jQuery(arguments[0]).attr("rs_ga_filter_category");
            _gaq.push(['_trackEvent',rs_ga_page,rs_ga_action,rs_ga_filter_category,0]);
        }
    }
}
//Functions for addToCart widget.
function checkAddToCartQtyCount(e, ecProductId, lineLevel, isRtqAvail){
    var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
    if (e.shiftKey != 1 && e.altKey == false && e.ctrlKey == false && (key > 47 && key < 58 || key==8 || key ==46 || key==37 || key ==39 || key > 95 && key < 106)){
        //48='0' , 57='9', 8=backspace, 46=delete, 37=left arrow, 39=right arrow, 96=numpad 0, 106=numpad 9
    }else{
        if (navigator.appVersion.indexOf("MSIE")!=-1){//For IE Browser
            window.event.returnValue = null;
        } else{
            e.preventDefault();
            e.returnValue = null;
        }
        if(key==13){//Simulate Check Button click event
			if (isRtqAvail) {
				if (lineLevel == 'true') {
					runRTQWithAvailabilityCheck();
				} else {
					getEventSourceElementForm(e).find("a[id$=rtqLinkBot]").click();
				}
			} else {
				getEventSourceElementForm(e).find("input.cartButton").click();
			}
        }
    }
}

function getEventSourceElementForm(event){
	return jQuery(getEventSourceElement(event)).closest("form");
}

function getEventSourceElement(event){
	var sourceElement = event.target || event.srcElement;
	return sourceElement;
}

function disableAddToCartBtn(btn){
	jQuery(btn).prop("disabled",true);
	jQuery(btn).removeClass("cartButton").addClass("loadingBg");
}

function disableRtqBtn(btn){
	jQuery(btn).prop("disabled",true);
	jQuery(btn).removeClass("redButton").addClass("loadingBg");
}
function processOnclickForAddToCartBtn(ecProductId){
    showStuff('addToCartDisabled_' + ecProductId);
    hideStuff('addToCartEnabled_' + ecProductId);
}
function processOncompleteForAddToCartWebBtn(ecProductId){
	if (isBasketStable = 'true') {
		showStuff('addToCartEnabled_' + ecProductId);
		hideStuff('addToCartDisabled_' + ecProductId);
		return false;
	}
} 
function processOncompleteForAddToCartWebBtn(ecProductId,isBasketStable){
	if (isBasketStable = 'true') {
		showStuff('addToCartEnabled_' + ecProductId);
		hideStuff('addToCartDisabled_' + ecProductId);
		return false;
	}
}
function processOncompleteForSSMWhoopsAddToCartWebBtn(isBasketStable){
	if (isBasketStable) {
			showStuff('ssmEnabled');
			hideStuff('ssmDisabled');
			return false;
		} else {
			showStuff('ssmDisabled');
			hideStuff('ssmEnabled');
			return false;
		}
}
function closeQuickViewPanel(){
	var quickViewModelPanel = jQuery(window.self.top.document).find('#quickViewFrameClose');
	quickViewModelPanel.click();
}
function closeRTQPanel(){
	var rtqModalPanel = jQuery(window.self.top.document).find('#rtqhidelink');
	rtqModalPanel.click();
}
function goToCart(cartUrl){
	window.parent.location.href=cartUrl;
}
function threedWinHide(){// function to handle three D pop up on compare page.
    jQuery('div[aria-labelledby|="ui-dialog-title-image3dView"]').hide();
    //jQuery('#image3dView').hide();
    return false;
}
function threedWinDisplay(){// function to handle three D pop up on compare page.
    jQuery('div[aria-labelledby|="ui-dialog-title-image3dView"]').show();
    jQuery('#image3dView').show();
    return false;
}
/*Searchbox widget scripts*/
function handleKeyEvent(e){
    var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;    
    if(key==13){//Simulate Check Button click event
    	document.getElementById("searchForm:findBtnweb").click();
        return false;
    }
}
function checkTerm(defaultTerm,alertMandatoryMsg,objSearchTerm){
    var term=trim(objSearchTerm.value);
    if (term !="" && term!="*" && term!=defaultTerm && term.toUpperCase()!=='NULL'){    
        term = trim(term);
        var termLength = term.length;
        for(var i = 0;i<termLength;i++) {
            var first = term.indexOf("*");
            if (first == 0) {
                term = term.substring(1,termLength);
                term = trim(term);
            } else {
                break;
            }
        }
        termLength = term.length;
        for(var i = 0;i<termLength;i++) {
            var last = term.lastIndexOf("*");
            var charlength = term.length;
            if (last == charlength-1) {
                term = term.substring(0,charlength-1);
                term = trim(term);
            } else {
                break;
            }
        }
        if (term.length < searchTermMinLength) {
            window.alert(alertMandatoryMsg);
            return false;
        }
        return true;
    } else {
    window.alert(alertMandatoryMsg);
    //objSearchTerm.value=defaultTerm;
    objSearchTerm.focus();
    return false;
    }
}
/*SSM Whoops methods**/
function isSsmQuantityValid(qtyElement){
		var qty = document.getElementById(qtyElement.id).value;
		if(qty==null || qty==""){
			return false;
		}
		return true;
	}
function noMouseRightClickEvent(textBoxElement,textBoxclassName){
		document.getElementById(textBoxElement.id).oncontextmenu =
			function(e) {
				// If IE
				if(!e) {
				  e = event;
				  e.target = e.srcElement;
				}	
				if (document.getElementById(textBoxElement.id).className == textBoxclassName) {	
				  // If IE
				  if (!e.prevenDefault)
					e.returnValue = false;
				  else
					e.preventDefault();
				  return false;
				}
			};
	}
function checkSsmQtyCount(e){
		var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if (e.shiftKey != 1 && e.altKey == false && e.ctrlKey == false && (key > 47 && key < 58 || key==8 || key ==46 || key==37 || key ==39 || key > 95 && key < 106)){
			//48='0' , 57='9', 8=backspace, 46=delete, 37=left arrow, 39=right arrow, 96=numpad 0, 106=numpad 9
		}else{
			if (navigator.appVersion.indexOf("MSIE")!=-1){//For IE Browser
				window.event.returnValue = null;
			} else{
				e.preventDefault();
				e.returnValue = null;
			}
			if(key==13){//Simulate Check Button click event
				document.getElementById("ssmForm:updateFromWhoops").click();
			}
		}
}
/*RTQ scripts*/
function isRtqQuantityValid(){
	var qty = document.getElementById("rtqCheckerForm:rtqCheckQty").value;
	if(qty==null){
		return false;
	}
	return true;
}
function resetRtqCheckerDialog(){
	hideStuff("rtqAddToCartDiv");
	hideStuff("rtqErrorDiv");
	showStuff("rtqCheckDiv");
	hideStuff("rtqAnotherQtyDiv");
}
function noRightClickEvent(){
	document.getElementById("rtqCheckerForm:rtqCheckQty").oncontextmenu =
		function(e) {
			// If IE
			if(!e) {
			  e = event;
			  e.target = e.srcElement;
			}	
			if (document.getElementById("rtqCheckerForm:rtqCheckQty").className == 'rtqInput') {	
			  // If IE
			  if (!e.prevenDefault)
				e.returnValue = false;
			  else
				e.preventDefault();
			  return false;
			}
	};
}
function checkRtqQtyCount(e){
		var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if (e.shiftKey != 1 && e.altKey == false && e.ctrlKey == false && (key > 47 && key < 58 || key==8 || key ==46 || key==37 || key ==39 || key > 95 && key < 106)){
			//48='0' , 57='9', 8=backspace, 46=delete, 37=left arrow, 39=right arrow, 96=numpad 0, 106=numpad 9
		}else{
			if (navigator.appVersion.indexOf("MSIE")!=-1){//For IE Browser
				window.event.returnValue = null;
			} else{
				e.preventDefault();
				e.returnValue = null;
			}
			if(key==13){//Simulate Check Button click event
				document.getElementById("rtqCheckerForm:rtqCheckButton").focus();
				document.getElementById("rtqCheckerForm:rtqCheckButton").click();
			}
		}
}
/*Merchandising - Featured Product script*/
var navCount=0;
var prodVisibleCount=4; 
var fireManualCmSp = false;
function left()
{ if(navCount!=0)
	{ 
	  navCount=navCount-prodVisibleCount;
	  fireManualCmSp = true;
	  callPopulate();
	}
}
function right()
{ if((count-navCount-prodVisibleCount)>0)
	{	navCount=navCount+prodVisibleCount;
	    fireManualCmSp = true;
		callPopulate();
	}
}
function callPopulate()
{
	if(count>navCount){
	populate(1,navCount);}
	else{nullify(1)}
	
	if(count>navCount+1){
	populate(2,navCount+1);}
	else{nullify(2)}
	
	if(count>navCount+2){
	populate(3,navCount+2);}
	else{nullify(3)}
	
	if(count>navCount+3){
	populate(4,navCount+3);}
	else{nullify(4)}
}
function nullify(tableCount)
{
	document.getElementById('prodImage'+tableCount).style.display="none";
	document.getElementById('prodName'+tableCount).innerHTML="";
	document.getElementById('prodName'+tableCount).href="";
	document.getElementById('prodName'+tableCount).title="";
	document.getElementById('prodPrice'+tableCount).innerHTML="";
}
function populate(tableCount,place)
{	
	document.getElementById('prodImage'+tableCount).style.display="block";
	document.getElementById('prodImage'+tableCount).src=myarray[place][3];
	document.getElementById('prodImage'+tableCount).alt=myarray[place][0]; 
	document.getElementById('prodName'+tableCount).innerHTML=myarray[place][0];				
	var itemUrlPath = myarray[place][4] + "&cm_sp=" + myarray[place][7];
	var containerUrlPath = myarray[place][4] + "&cm_sp=" + cmValue;
	document.getElementById('prodName'+tableCount).href= itemUrlPath;
	document.getElementById('prodName'+tableCount).setAttribute('onclick', "cmCreateManualLinkClickTag('" + itemUrlPath + "', '', ''); cmCreateManualLinkClickTag('" + containerUrlPath + "', '', '');");
	document.getElementById('prodImageLink'+tableCount).setAttribute('onclick', "cmCreateManualLinkClickTag('" + itemUrlPath +"', '', ''); cmCreateManualLinkClickTag('" + containerUrlPath + "', '', '');");
	document.getElementById('prodImageLink'+tableCount).href=itemUrlPath;
	document.getElementById('prodImageLink'+tableCount).title=myarray[place][0];
	document.getElementById('prodName'+tableCount).title=myarray[place][5] + " " + myarray[place][0] + " " + myarray[place][6];
	document.getElementById('prodPrice'+tableCount).innerHTML=myarray[place][2];
	if(navCount==0)
	{
		jQuery("#backBtn").removeClass('backBtn').addClass('backBtnDisabled');
	}
	else
	{
		jQuery("#backBtn").removeClass('backBtnDisabled').addClass('backBtn');
	}
	if((count-navCount-prodVisibleCount)>0)
	{
		jQuery("#forwardBtn").removeClass('forwardBtnDisabled').addClass('forwardBtn');	
	}
	else
	{
		jQuery("#forwardBtn").removeClass('forwardBtn').addClass('forwardBtnDisabled');
	}
	if(fireManualCmSp) {
		cmCreateManualImpressionTag(pageId, myarray[place][7], '', '', '');
	}
}
	
//Dimension navigation widget javascript
function startAgain(url,contextPath){
	var selectAttributeSearchUrl = url;
	window.location.href = selectAttributeSearchUrl;
}
function filterUrl(dimensionName,url,contextPath,dimesionIdList, analyticsEnabled){
	var dimensionList = dimesionIdList;
	var urlCount = dimensionList.indexOf("]");
	var attributeParamString = dimensionList.substring(1,urlCount );
	var selectAttributeSearchUrl = url;
	if (typeof document.getElementsByName('avlAtt').length != 'undefined') {
		for(var i=0; i<=(document.getElementsByName('avlAtt').length-1); i++) {
			if(document.getElementById("avlAtt"+dimensionName+i) != null && document.getElementById("avlAtt"+dimensionName+i).checked){		
				var valueExpected = document.getElementById("avlAtt"+dimensionName+i).value;
				if(attributeParamString == "" || attributeParamString == null ){
					attributeParamString = valueExpected;
				}else{
					attributeParamString = attributeParamString + "," + valueExpected;
				}
				if(analyticsEnabled == 'true') {				   
				   rs_gaAddTrackEvent(document.getElementById("avlAtt"+dimensionName+i));//Track Event function call for selected filters.
				}   
			}
		}
	}
	if(selectAttributeSearchUrl.charAt(selectAttributeSearchUrl.length-1)=="&"){
		selectAttributeSearchUrl = selectAttributeSearchUrl + "applied-dimensions=" + attributeParamString + "&lastAttributeSelectedBlock=" + dimensionName;
	}
	else{
		selectAttributeSearchUrl = selectAttributeSearchUrl + "&applied-dimensions=" + attributeParamString + "&lastAttributeSelectedBlock=" + dimensionName;
	}
	window.location.href = trim(selectAttributeSearchUrl);
}
function formatUrl(dimensionName,url,contextPath,dimesionIdList,appliedId){
	var dimensionList = dimesionIdList;
	var urlCount = dimensionList.indexOf("]");
	var attributeParamString = dimensionList.substring(1,urlCount );
	var selectAttributeSearchUrl = url;
	if (typeof document.getElementsByName('appAtt').length != 'undefined') {
		if(document.getElementById(appliedId) != null){	
			var toRemove = document.getElementById(appliedId).value;
			var currentTokens = attributeParamString.split( "," );
			for ( var i = 0; i <=(currentTokens.length-1); i++ ){
				var formattedValue = trim(currentTokens[i]);
				if(formattedValue == toRemove){
					currentTokens.splice(i, 1);
					currentTokens.join(",");
				}
			}
			attributeParamString = currentTokens;
		}
	}
	if(attributeParamString != null && attributeParamString!=''){
		if(selectAttributeSearchUrl.charAt(selectAttributeSearchUrl.length-1)=="&"){
			selectAttributeSearchUrl = selectAttributeSearchUrl + "applied-dimensions=" + attributeParamString + "&lastAttributeSelectedBlock=" + dimensionName;
		}
		else{
			selectAttributeSearchUrl = selectAttributeSearchUrl + "&applied-dimensions=" + attributeParamString + "&lastAttributeSelectedBlock=" + dimensionName;
		}
	}else{
		selectAttributeSearchUrl = selectAttributeSearchUrl;
	}
	window.location.href = trim(selectAttributeSearchUrl);
}

function pivotSearch(cataloguePath){
	var selectAttributeSearchUrl = cataloguePath;
	var attributeParamString = "" ;
	   if (typeof document.getElementsByName('selectedAttribute').length != 'undefined') {
			for(var i=0; i<document.getElementsByName('selectedAttribute').length; i++) {
			if(document.getElementById('selectedAttribute'+i).checked){
				 attributeParamString = attributeParamString + "," + document.getElementById('selectedAttribute'+i).value;
				}
			}
		 }
	   
	if(attributeParamString.charAt(0) == ','){
		attributeParamString = attributeParamString.substring(1);
	} 
	
	selectAttributeSearchUrl = selectAttributeSearchUrl + attributeParamString;
	window.location.href = selectAttributeSearchUrl;
}


function processDimensionNavigation() {

	jQuery.previousSelectedAttribute="";
	jQuery.toShowSelectedAttribute=jQuery("#inputtext").val();
	if(jQuery.toShowSelectedAttribute!=''){
		document.getElementById("head"+jQuery.toShowSelectedAttribute).className = "compHeaderexpanded";
		document.getElementById("attributeBox"+jQuery.toShowSelectedAttribute).style.display = 'block';
		document.getElementById("cl_"+jQuery.toShowSelectedAttribute).style.backgroundColor = '#f6f5f5';
		jQuery.previousSelectedAttribute=jQuery.toShowSelectedAttribute;			
	}else if(document.getElementById("attributeBoxTech")!=null){
		document.getElementById("attributeBoxTech").style.display = 'block';
		document.getElementById("headTech").className = "compHeaderexpanded";
		document.getElementById("cl_Tech").style.backgroundColor = '#f6f5f5';
		jQuery.previousSelectedAttribute="Tech";
	}else if(document.getElementById("attributeBoxCateg")!=null){
		document.getElementById("attributeBoxCateg").style.display = 'block';
		document.getElementById("headCateg").className = "compHeaderexpanded";
		document.getElementById("cl_Categ").style.backgroundColor = '#f6f5f5';
		jQuery.previousSelectedAttribute="Categ";
	}else {
		if(document.getElementById("attributeBoxBrand")!=null){
			document.getElementById("attributeBoxBrand").style.display = 'block';
			document.getElementById("cl_Brand").style.backgroundColor = '#f6f5f5';
			document.getElementById("headBrand").className = "compHeaderexpanded";
			jQuery.previousSelectedAttribute="Brand";
		}
	}
	//Written inside ready to access previous selected attribute
	jQuery(".compHeader,.compHeaderexpanded").click(
		function(){//To toggle between div click
			jQuery.attributeValue=this.id.substring(4,this.id.length);

			if(jQuery.previousSelectedAttribute!="") {
				document.getElementById("attributeBox"+jQuery.previousSelectedAttribute).style.display = 'none';
				document.getElementById("cl_"+jQuery.previousSelectedAttribute).style.backgroundColor = '#fff';	
				document.getElementById("head"+jQuery.previousSelectedAttribute).className = "compHeader";
			}
			if(jQuery.attributeValue==jQuery.previousSelectedAttribute) {//To close attribute box if its already open
				jQuery(this).removeClass('compHeaderexpanded').addClass('compHeader');
				document.getElementById("attributeBox"+jQuery.attributeValue).style.display = 'none';
				document.getElementById("cl_"+jQuery.attributeValue).style.backgroundColor = '#fff';
				jQuery.previousSelectedAttribute="";
			} else {
				jQuery(this).removeClass('compHeader').addClass('compHeaderexpanded');
				document.getElementById("attributeBox"+jQuery.attributeValue).style.display = 'block';
				document.getElementById("cl_"+jQuery.attributeValue).style.backgroundColor = '#f6f5f5';
				jQuery.previousSelectedAttribute=jQuery.attributeValue;
			}
			equalHeight(jQuery(".tnLeftDiv, .tnRightDiv, .tnLeftTd, .tnRightTd"));
		}
	)
}
function fadeInHelp(helpIcon){jQuery(helpIcon).parent().find('.helpBalloon').fadeIn(400);}
function fadeOutHelp(helpIcon){jQuery(helpIcon).parent().find('.helpBalloon').fadeOut(100);}
function showHelp(helpIcon){jQuery(helpIcon).parent().find('.helpBalloon').show();}
function hideHelp(helpIcon){jQuery(helpIcon).parent().find('.helpBalloon').hide();}

function isNumeric(a){
return!isNaN(parseFloat(a))&&isFinite(a)
}
var forwardOrderValidator = true;
function validateQty(qtyElement,productNumber,uom,orderqty,statusIndex){ // Validation for Multiple order forward drop quantity
var rowId =  "row_"+productNumber;
var qtyDivId = "qtyDiv_"+ productNumber;
var qtyInputId = "qtyInput_"+productNumber;
var inputTotalNew = 0;
var qtyValue = qtyElement.value;
var multipleQuantity = qtyValue / uom;
var isMultipleValue = jQuery('.isMultiple_' + productNumber).html().replace('##MULTIPLE##', uom);//replace the UOM qty inthe errormessage.
jQuery('.isMultiple_' + productNumber).html(isMultipleValue);

// Calculate the total entered
jQuery("#"+rowId).find(".dropQty").each(function(idx, ele){
	if(ele.value != 0){
	var inputSingle = parseInt(ele.value);
	inputTotalNew = inputTotalNew + inputSingle;
	}
});

var newRemainderValue = parseInt(orderqty-inputTotalNew);
	if(qtyValue !=""){
		if(isNumeric(qtyValue))//Check isNumeric.
			{
			if (qtyValue.match(/^-\d+$/)){
				jQuery(qtyElement).parent().find('.isNumeric').show();forwardOrderValidator = false;
				}//Check is +ve.
				else{
				jQuery(qtyElement).parent().find('.isNumeric').hide();
				var isMultiple = /^-?\d+$/.test(multipleQuantity);//check multiple of uom
					if (!isMultiple) //Check is multiple of UOM.
					{//alert('Not multiple of UOM =' + uom)
					jQuery(qtyElement).parent().find('.isMultiple').show();forwardOrderValidator = false;
					}
					else{//alert('Is multiple of UOM =' + uom)
					jQuery(qtyElement).parent().find('.isMultiple').hide();forwardOrderValidator = true;
					}
				}
			}
			else{
				jQuery(qtyElement).parent().find('.isMultiple').hide();
				jQuery(qtyElement).parent().find('.isExceeding').hide();
				jQuery(qtyElement).parent().find('.isNumeric').show();forwardOrderValidator = false;
			}
		}
	if(newRemainderValue>=0){
		jQuery("#remainderQty_"+productNumber).html(newRemainderValue);
		jQuery(".remainderHiddenQty_"+productNumber).val(newRemainderValue);
		jQuery(qtyElement).parent().find('.isExceeding').hide();//forwardOrderValidator = true;	
	}
	else{
	if(qtyValue!=0){
		if(isNumeric(qtyValue)){
			var isMultiple = /^-?\d+$/.test(multipleQuantity);
				if (isMultiple) //Check is multiple of UOM.
					{
					jQuery(qtyElement).parent().find('.isExceeding').show();
					jQuery(qtyElement).parent().find('.isMultiple').hide();forwardOrderValidator = false;}
			}
			else{jQuery(qtyElement).parent().find('.isNumeric').show(); forwardOrderValidator = false;}
		}
	}
	if(qtyValue=="")
		{jQuery(qtyElement).parent().find('.isNumeric, .isMultiple, .isExceeding').hide();}
}

function focusQty(calendarInputElement,statusIndex){ // make the column active C-70.
jQuery(".qtyCell_"+statusIndex).addClass("active");
}
function blurQty(qtyElement,statusIndex){//C-70
	jQuery(".qtyCell_"+statusIndex).removeClass("active"); // make the column deactive C-70.
		var NewqtyValueTotal = 0;
		if(jQuery(".qtyCell_"+statusIndex+" .rich-calendar-input").attr("value")!=""){
			jQuery(".qtyComplete_"+statusIndex).each(function(){
			var qtyValueTotal = parseInt(jQuery(this).find(".dropQty").attr("value"));
				NewqtyValueTotal = NewqtyValueTotal + qtyValueTotal;
			});
			if(NewqtyValueTotal>0)
			{
				jQuery(".qtyCell_"+statusIndex).addClass("complete"); // make the column complete C-70.
			}else{
				jQuery(".qtyCell_"+statusIndex).removeClass("complete");// make the column incomplete C-70.
			}			
		}
}
	
jQuery(document).ready(function() {
	
	//Flag to control GA events throughout web site.
	isAnalyticsEnabledGA=jQuery('#isAnalyticsEnabledID').attr('isAnalyticsEnabledFlag');
	
    jQuery(".dropQty, .numbersOnly").keydown(function(event) {//don't allow any character other than numeric.
        // Allow: backspace, delete, tab and escape
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || 
             // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) || 
             // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault(); 
            }   
        }
    });	

	jQuery('.dropDown3').each(function(){ // Check dropdown value & apply styleClass of all dropdowns with class dropdown3
			if((this.selectedIndex)==0){
				jQuery(this).addClass("nonSelected");
			}else if((this.selectedIndex)!=0){
				jQuery(this).removeClass("nonSelected");						
			}
	});
	jQuery('.dropDown3').change(function(){// Change styleClass on changing the value of all dropdowns with class dropdown3
		if((this.selectedIndex)==0){
			jQuery(this).addClass("nonSelected");
		}else if((this.selectedIndex)!=0){
			jQuery(this).removeClass("nonSelected");
		}		
	});

	jQuery('.ghostText').each(function(){// Ghost text script
		var d = jQuery(this).val();
		jQuery(this).focus(function(){
			if (jQuery(this).val() == d){
				jQuery(this).val('').removeClass('ghostText');
				jQuery(this).val('').addClass('blackText');
			}
		});
		jQuery(this).blur(function(){
			if (jQuery(this).val() == ''){
				jQuery(this).val(d).addClass('ghostText');
				jQuery(this).val(d).removeClass('blackText');
			}
		});
	});

	jQuery(".toggleLink").click(function(){ // toggle panel functionality
		var options = {};
		var selectedEffect = "blind";
		jQuery(this).parents(".togglePanel").find(".toggleDiv").toggle( selectedEffect, options , 500 );
		jQuery(this).parents(".togglePanel").find(".toggleDiv").toggleClass("active");
			if(jQuery(this).parents(".togglePanel").find(".toggleDiv").hasClass("active")){
				jQuery(this).parents(".togglePanel").find(".toggleCloseButton").show();
				jQuery(this).parents(".togglePanel").find(".toggleOpenButton").hide();
				jQuery('.expanded').val('true');
			}else{
				jQuery(this).parents(".togglePanel").find(".toggleCloseButton").hide();
				jQuery(this).parents(".togglePanel").find(".toggleOpenButton").show();
				jQuery('.expanded').val('false');
			}
	});
	
	/*jQuery(".alternativeLink").click(function(){// Cart line - collapse panels for alternative/accessories. 
		var panelId = jQuery(this).parent().attr("id");
		var options = {};
		var selectedEffect = "blind";
		jQuery("#"+panelId+"_Div").toggle(selectedEffect, options , 500);
		jQuery("#"+panelId+"_OpenLink").toggle();
		jQuery("#"+panelId+"_CloseLink").toggle();
	});*/
	
	jQuery(".enabledBtn").click(function(){//disable all navigation buttons on click
		jQuery.toggleBtnStateElement = jQuery(this).parents(".toggleBtnState");
		jQuery.toggleBtnStateElementClass = jQuery.toggleBtnStateElement.attr('class');
		jQuery("."+jQuery.toggleBtnStateElementClass).each(function(){
			jQuery(this).find(".enabledBtn").hide();
			jQuery(this).find(".disabledBtn").show();
			}
		)
	});

	/* To make footer bolcks of equal height equalHeight() function is called when DOM is ready.*/
	equalHeight(jQuery(".rsconacdetailsVertical, .liveChatPlaceHolderDiv, .faqDiv"));		
	
	/* Show/hide quick add on basket page */
	var $quickAddToggleBtn = $('.js-toggleBasketQuickAdd');
	var $quickAddInfo = $('#js-basketQuickAddInfo');
	var $quickAddPanel = $('#js-basketQuickAdd');

	function showQuickAdd() {
		$quickAddToggleBtn.addClass('active');

		var expiration_date = new Date();
		expiration_date.setFullYear(expiration_date.getFullYear() + 10);
		document.cookie = "quickAdd=1; expires=" + expiration_date.toUTCString() + " +; path=/";

		rs.web.addEvent('quickOrderMaximised');

		$quickAddInfo.slideUp('400', function() {
			$quickAddPanel.slideDown('400');
		});
	}

	function hideQuickAdd() {
		$quickAddToggleBtn.removeClass('active');
		document.cookie = "quickAdd=; path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT";

		rs.web.addEvent('quickOrderMinimised');

		$quickAddPanel.slideUp('400', function() {
			$quickAddInfo.slideDown('400');
		});
	}

	if (document.cookie.indexOf('quickAdd=') !== -1) {
		$quickAddToggleBtn.addClass('active');
		$quickAddPanel.show();
		$quickAddInfo.hide();
	}

	$quickAddToggleBtn.on('click', function() {
		if ($quickAddToggleBtn.hasClass('active')) {
			hideQuickAdd();
		}else {
			showQuickAdd();
		}
	});

});
function toggleBtnState(){
	jQuery(".enabledBtn").click(function(){//disable all navigation buttons on click
		jQuery.toggleBtnStateElement = jQuery(this).parents(".toggleBtnState");
		jQuery.toggleBtnStateElementClass = jQuery.toggleBtnStateElement.attr('class');
		jQuery("."+jQuery.toggleBtnStateElementClass).each(function(){
			jQuery(this).find(".enabledBtn").hide();
			jQuery(this).find(".disabledBtn").show();
			}
		)
});
}
function toggleThisBtnState(){
	jQuery(".enabledBtn").click(function(){//disables the button on click
		jQuery.toggleBtnStateElement = jQuery(this).parents(".toggleThisBtnState");
		jQuery.toggleBtnStateElement.find(".enabledBtn").hide();
		jQuery.toggleBtnStateElement.find(".disabledBtn").show();
	});
}

function addContent(content, frameId)
{
    var iframe = document.getElementById(frameId);
    var doc = null;
    if(iframe.contentDocument) { // Firefox, Opera
        doc = iframe.contentDocument;
    } else if(iframe.contentWindow) { // Internet Explorer
        doc = iframe.contentWindow.document;
        var ie = true;
    } else if(iframe.document) { // Others?
    doc = iframe.document;
    }

    doc.open();
    doc.write(content);
    doc.close();
}

/**
 * Clear the quick-view frame details
 */
function clearQuickViewFrameContents(panleId){

	jQuery('.quickViewFrame').attr('src','about:blank');

	var fullId = $('div[id$="' + panleId + '"]').attr('id');
	var ele = document.getElementById(fullId);
	ele.RSQuickViewArgs = undefined;
}

/**
 * Show a popup panel passing the required URL details
 */
function showQuickView(panleId, args){
	// Save the arguments as an attribute on the panel
	var fullId = $('div[id$="' + panleId + '"]').attr('id');
	var ele = document.getElementById(fullId);
	
	ele.RSQuickViewArgs = args;
	RichFaces.ui.PopupPanel.showPopupPanel(fullId);
}

/**
 * Load required URL into the iFrame in the popup
 *
 * The URL details are extracted from the global variable RSQuickViewArgs
 */
function loadquickViewFrameUrl(panleId){

	var fullId = $('div[id$="' + panleId + '"]').attr('id');
	var RSQuickViewArgs = document.getElementById(fullId).RSQuickViewArgs;
	
	var finalUrl = RSQuickViewArgs.url +"?viewMode=" + RSQuickViewArgs.viewMode;
	if (RSQuickViewArgs.qvPageState != undefined) {
		finalUrl += "&qvPageState=" + RSQuickViewArgs.qvPageState;
	}
	if (RSQuickViewArgs.pageSource != undefined) {
		finalUrl += "&pageSource=" + RSQuickViewArgs.pageSource;
	}
	jQuery('.quickViewFrame').attr('src',finalUrl);
	jQuery('.viewFullDetailsLink').attr('href',RSQuickViewArgs.url);
}

function clientSideValidation(){// JSON client Side validation Method
	jQuery(":input").blur(function() {
		
		var getClassAttribute = function(JQueryObject){
			var classAttribute = JQueryObject.attr("class");
			if (classAttribute){
				return classAttribute;
			}else{
				return "";
			}
		};
		
		var isClassAttributePresent = function(JQueryObject){
			var classAttribute = JQueryObject.attr("class");
			if (classAttribute){
				return true;
			}else{
				return false;
			}			
		};
		
		
		if (jQuery(this).parents('.clientValidation') != null && isClassAttributePresent(jQuery(this).parents('.clientValidation')) != null) {
			var outerClasses = getClassAttribute(jQuery(this).parents('.clientValidation')).split(" ");
			var outerClassStr = outerClasses[0];
			if(jSONObject != null && jSONObject != "") {
				var innerJSONObj = jSONObject[outerClassStr];
				if (innerJSONObj != null) {
					var innerClasses = getClassAttribute(jQuery(this)).split(" ");
					var innerClassStr = innerClasses[0];				
					var lbl = innerJSONObj[innerClassStr];				
					if (lbl != null) {
						if (lbl.validation) {						
							var obj = null;
							var spanElement = jQuery(this).parent();
							var spanClassAttribute = getClassAttribute(spanElement);
							if(spanClassAttribute && spanClassAttribute.split(" ") == 'serverValidationError') {
								spanElement.removeClass('serverValidationError');
								obj = jQuery(this).parents(".formField").find('.validationErrorText');
							} else {
								obj = jQuery(this).parents(".formField").find('.clientSideError');
								var tempObj = jQuery(this).parents(".formField").find('.validationErrorText');
								if(tempObj != null) {
									tempObj.hide();
									jQuery(this).parents(".serverValidationError").removeClass();
								}
							}
							if (this.type == 'text' || this.type == 'password' || this.type == 'textarea') {
								if (lbl.mandatory && jQuery(this).val().length == 0 ) { // Mandatory Validation
									spanElement.addClass('clientValidationError');
									obj.addClass('clientValidationErrorText');
									obj.text(lbl.mandatoryError + "");
									obj.show();
								} else if ((lbl.minLength != null) && jQuery(this).val().length != 0 && jQuery(this).val().length < lbl.minLength) {//MinLength Validation
									spanElement.addClass('clientValidationError');
									obj.addClass('clientValidationErrorText');
									obj.text(lbl.minLengthError + "");
									obj.show();
								} else if ((lbl.maxLength != null) && jQuery(this).val().length != 0 && jQuery(this).val().length > lbl.maxLength) {//Maxlength Validation
									spanElement.addClass('clientValidationError');
									obj.addClass('clientValidationErrorText');
									obj.text(lbl.maxLengthError + "");
									obj.show();
								} else if(lbl.pattern != null && !jQuery(this).val().match(lbl.pattern)){
									spanElement.addClass('clientValidationError');
									obj.addClass('clientValidationErrorText');
									obj.text(lbl.patternError + "");
									obj.show();								
								} else {
									spanElement.removeClass('clientValidationError');
									obj.removeClass('clientValidationErrorText');
									obj.hide();
								}
							} else {
								if (lbl.mandatory && this.selectedIndex == 0) { // Mandatory Validation
									spanElement.addClass('clientValidationError');
									obj.addClass('clientValidationErrorText');
									obj.text(lbl.mandatoryError + "");
									obj.show();
								} else {
									spanElement.removeClass('clientValidationError');
									obj.removeClass('clientValidationErrorText');
									obj.hide();
								}
							}
						}
					}
				}
			}
		}
	});
}

function datePickerClientSideValidation(datePicker){
	
	datePickerDiv = jQuery(datePicker).parents('.datePickerDiv');
	datePickerInput = jQuery(datePickerDiv).find('.dateInput');
	
	if (jQuery(datePickerDiv).parents('.clientValidation') != null && jQuery(datePickerDiv).parents('.clientValidation').attr('class') != null) {
		var outerClasses = jQuery(datePickerDiv).parents('.clientValidation').attr('class').split(" ");
		var outerClassStr = outerClasses[0];
		
		if(jSONObject != null && jSONObject != "") {
			var innerJSONObj = jSONObject[outerClassStr];
			if (innerJSONObj != null) {
				var innerClasses = jQuery(datePickerInput).attr('class').split(" ");
				var innerClassStr = innerClasses[1];				
				var lbl = innerJSONObj[innerClassStr];
				if (lbl != null) {
					if (lbl.validation) {
						var obj = null;
						var spanElement = jQuery(datePickerDiv).parent();
						var spanClasses = spanElement.attr('class');
						if(spanClasses && spanClasses.split(" ") == 'serverValidationError') {
							spanElement.removeClass('serverValidationError');
							obj = jQuery(datePickerDiv).parents(".formField").find('.validationErrorText');
						} else {
							obj = jQuery(datePickerDiv).parents(".formField").find('.clientSideError');
							var tempObj = jQuery(datePickerDiv).parents(".formField").find('.validationErrorText');
							if(tempObj != null) {
								tempObj.hide();
								jQuery(datePickerDiv).parents(".serverValidationError").removeClass();
							}
						}
						
						var displayDateFormat = lbl.displayDateFormat;
						var validationDateFormat = lbl.validationDateFormat;
						
						if (jQuery(datePickerInput).attr('type') == 'text') {
							// Validate Date Format.
							if(validationDateFormat != null){
								var dateValue = jQuery(datePickerInput).val();
								var validatedDate =  RichFaces.calendarUtils.parseDate(dateValue, validationDateFormat);
								
								if (dateValue.length!=0 && dateValue != displayDateFormat && (validatedDate == null)) {
									spanElement.addClass('clientValidationError');
									obj.addClass('clientValidationErrorText');
									obj.text(lbl.validationDateFormatError + "");
									obj.show();	
								} else {
									spanElement.removeClass('clientValidationError');
									obj.removeClass('clientValidationErrorText');
									obj.hide();
								}
							}
							
							// Validate Date Range if both of the dates are valid.
							var invalidDateRangeLbl = innerJSONObj['invalidDateRange'];
							if(invalidDateRangeLbl.invalidDateRange != null){						

								var datePickerParentDiv = jQuery(datePicker).parents('.datepickerParentDiv');
								if(datePickerParentDiv != null){
									var datepickerInvalidRangeDiv =  jQuery(datePickerParentDiv).find('.datepickerInvalidRangeDiv');
									
									if(datePickerParentDiv != null){
										var fromDateValue = jQuery(datePickerParentDiv).find('.datepickerchild1').find('.dateInput').val();
										var toDateValue = jQuery(datePickerParentDiv).find('.datepickerchild2').find('.dateInput').val();
										
										if((fromDateValue != null && fromDateValue != displayDateFormat) && (toDateValue != null && toDateValue != displayDateFormat)){
											var fromDate =  RichFaces.calendarUtils.parseDate(fromDateValue, validationDateFormat);
											var toDate =  RichFaces.calendarUtils.parseDate(toDateValue, validationDateFormat);
											
											if(fromDate != null && toDate != null && (fromDate.getTime() > toDate.getTime())){
												jQuery('#invalidDateRangeText').show().addClass('top15').html(invalidDateRangeLbl.invalidDateRangeError);
											} else {
												jQuery('#invalidDateRangeText').show().removeClass('top15').html("");
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

function selectItem(){ // function to select the List Item.
	var donotSelect = false;
	var preId = 0;
		jQuery(".donotSelect").click(function(){// do not select row if clicked on links inside row.
			donotSelect = true;
		});
		jQuery(".manageListItem").click(function(){	// List address widget function to change the bg color of list Item
			if(!donotSelect){
				jQuery(this).parent().find(".manageListItem").removeClass("manageListItemSelected");
				jQuery(this).parent().find(".manageListItem").find(".cvvDiv").hide();//for payment cvv code
				jQuery(this).addClass("manageListItemSelected");
				jQuery(this).find(".cvvDiv").show();//for payment cvv code
				jQuery(this).find(".cvvCodeInput").focus(); //for payment cvv code
				if(jQuery(this).find("input.manageRadio").prop('disabled')){
				}else{
				
				if( preId != jQuery(this).find(".cvvCodeInput").attr('id') )
				{
					jQuery(this).parent().find(".manageListItem").find(".cvvCodeInput").val('');
					preId = jQuery(this).find(".cvvCodeInput").attr('id');					
				}
					jQuery(this).find("input.manageRadio").prop('checked',true);
				}
			}else{
			donotSelect = false;
			}	
		});	
		jQuery(".manageListItem").each(function(){// change bg color of default selected row.
			var manageListItem = jQuery(this);
			if (jQuery(this).find("input.manageRadio").prop('checked')){
				manageListItem.addClass("manageListItemSelected");
				manageListItem.find(".cvvDiv").show();//for payment cvv code;
				
				if(jQuery(this).find(".cvvCodeInput").attr('id')!=null)
				{
				    preId = jQuery(this).find(".cvvCodeInput").attr('id');				 
				}
			}else{
			manageListItem.removeClass("manageListItemSelected");
			manageListItem.find(".cvvDiv").hide();//for payment cvv code
			}
		});
		jQuery(".manageRadio").click(function(){
			jQuery(this).parent().parent().find(".manageListItem").removeClass("manageListItemSelected");
		});
	}
function selectdeliveryItem(){ // function to select the Delivery Option.
	jQuery(".deliveryOptionsDivItem").click(function(){	// List address widget function to change the bg color of list Item
			jQuery(this).parent().find(".deliveryOptionsDivItem").removeClass("Selected").addClass("nonSelected");
			jQuery(this).addClass("Selected");
			jQuery(this).find("input").prop('checked',true);
	});	
	jQuery(".deliveryOptionsDivItem").each(function(){// change bg color of default selected row.
		var deliveryOptionsListItem = jQuery(this);
		if (jQuery(this).find("input").prop('checked')){
				deliveryOptionsListItem.addClass("Selected").removeClass('nonSelected');
			}else{
				deliveryOptionsListItem.removeClass("Selected").addClass('nonSelected');
			}
	});
}

function displayLines(defaultDisplayListSize,lineItemListSize){//function to add quick product line.
	for (var i=0; i < defaultDisplayListSize;i=i+1) {
		jQuery("#productLine_"+i).show();
	}
	jQuery(".quickStockNo, .inputQty, .customerPartNO, .costCenter, .costCentreList, .glCodeList").blur(function(){
		var productLineNumber = jQuery(this).parents(".productLine").attr("id").replace('productLine_','') ;
		var newProductLineNumber = parseInt(productLineNumber) + 1 ;
		var stockNo = jQuery("#productLine_"+productLineNumber).find(".quickStockNo").val();
		var partNo = jQuery("#productLine_"+productLineNumber).find(".customerPartNO").val();

		if(jQuery(this).val() && (stockNo || partNo != (null || ''))){
			jQuery("#productLine_"+newProductLineNumber).show();
			//jQuery("#addProductBtnActive").removeClass("hide").addClass("show");
			jQuery("#quickAddEnabledBtnBtn").removeClass("hide inprogress").addClass("show");
			jQuery("#quickAddDisabledBtnBtn").addClass("hide");
			
		}
		if(jQuery("#quickAddEnabledBtnBtn").attr('class') == 'show' && (jQuery("#productLine_"+newProductLineNumber).attr('style') == null || jQuery("#productLine_"+newProductLineNumber).attr('style') == '')) {
			if(jQuery("#productLine_"+productLineNumber).find('input:last').attr('id') == jQuery(this).attr('id')) {
				jQuery("#quickAddEnabledBtnBtn").find('.enabledBtn').focus();
			}
		}
	});
}

function displayCodeLines(divId, defaultDisplayListSize,maxEmptyRows,lineItemListSize){
	for (var i=0; i < defaultDisplayListSize;i=i+1) {
		jQuery("#"+divId+i).show();
	}
	jQuery("."+divId+"codeNumber").blur(function(){
		var productLineNumber = jQuery(this).parents(".codeLine").attr("id").replace(divId,'') ;
		var newProductLineNumber = parseInt(productLineNumber) + maxEmptyRows;
		if(jQuery(this).val()){
			jQuery("#"+divId+newProductLineNumber).show();
		}else{
		}	
	});
}

function callGhostText() {
	jQuery('.ghostText').each(function(){// Ghost text script
		var d = jQuery(this).val();
		jQuery(this).focus(function(){
			if (jQuery(this).val() == d){
				jQuery(this).val('').removeClass('ghostText');
				jQuery(this).val('').addClass('blackText');
			}
		});
		jQuery(this).blur(function(){
			if (jQuery(this).val() == ''){
				jQuery(this).val(d).addClass('ghostText');
				jQuery(this).val(d).removeClass('blackText');
			}
		});
	});
}

function hideDeliveryDiv() { // To show/hide Delivery and Branch collecttion
	jQuery('.deliveryContainer').slideUp();
}
function showDeliveryDiv(){
	jQuery('.deliveryContainer').slideDown();
}
function hideCollectionDiv(){
	jQuery('.collectionContainer').slideUp();
}
function showCollectionDiv(){
	jQuery('.collectionContainer').slideDown();
}

function selectDropDown(){
	jQuery('.dropDown3').each(function(){ // Check dropdown value & apply styleClass of all dropdowns with class dropdown3
			if((this.selectedIndex)==0){
				jQuery(this).addClass("nonSelected");
			}else if((this.selectedIndex)!=0){
				jQuery(this).removeClass("nonSelected");						
			}
	});
	jQuery('.dropDown3').change(function(){// Change styleClass on changing the value of all dropdowns with class dropdown3
		if((this.selectedIndex)==0){
			jQuery(this).addClass("nonSelected");
		}else if((this.selectedIndex)!=0){
			jQuery(this).removeClass("nonSelected");
		}		
	});
}

//Check if analyticsEnabled & call _gaq.push.
function createTrackPageViewTag(isAnalyticsEnabled,p1,p2){
	if(isAnalyticsEnabled) {
		_gaq.push(['_trackPageview','/'+p1+'/'+p2+'/']);
	}
}

function togglebranchDetails(){// toggle trade counter details div.
	jQuery('.tradeCounterDropDown').change(function(){
		if(this.selectedIndex == 0){
		jQuery('.togglebranchDetails').hide();
		}else{
		jQuery('.togglebranchDetails').show();
		}
	});
}
/*functions for MOP filter widget*/
function displaymopFilterMenu(){
jQuery(".mopNavMenu").show();
equalWidth(jQuery(".mopFilterMenu, .mopNavMenu"));
	
}
function hidemopFilterMenu(){
jQuery(".mopNavMenu").hide();
}
function selectFilter(element){
	var filterValue = jQuery(element).find("span").html();
	jQuery(".mopFilterLabel").text(filterValue);
	jQuery(".mopNavMenu").hide();
}

function pageType(pageName){ // method to set the line level pageName. 
	if(pageName == 'LL'){
   		return 'LINE LEVEL';
   	}else{
   		return '';
   	}
}
// Cart line - collapse panels for alternative/accessories. 
function toggleAlternativeProduct(element,divId){
	var panelId = divId;
	if(jQuery("#"+panelId+"_Div").hasClass('altProductDisplayed')){
		jQuery("#"+panelId+"_Div").slideUp();
		jQuery("#"+panelId+"_Div").removeClass('altProductDisplayed');
	}
	else{
		jQuery("#"+panelId+"_Div").slideDown();
		jQuery("#"+panelId+"_Div").addClass('altProductDisplayed');
	}
	jQuery("#"+panelId+"_OpenLink").toggle();
	jQuery("#"+panelId+"_CloseLink").toggle();
}
function focusNextCardSection(element, maxLength) {
	if(jQuery(element).val().length == maxLength) {
		jQuery(element).next().focus();
	}		
}
var quickAddQtyValue = "";
function storeQtyValue(qtyValue){// stores the quick add qty value to persist after ajax rerender. C-33
	quickAddQtyValue = qtyValue.value;	
}

function enableQuickAddBtn(parent){	//method to display quick add button after ajax call. C-33
	jQuery("#"+parent).find('.inputQty').focus().val(quickAddQtyValue);
	quickAddQtyValue = "";	
	jQuery("#quickAddEnabledBtnBtn").removeClass("hide").addClass("show");		
	jQuery("#quickAddDisabledBtnBtn").addClass("hide");	
}
function clearQtyValue(){// clears the quick add qty value C-33
	quickAddQtyValue = "";
}

//Method added to be called to check for the default value in the parcel search text box.
function checkParcelSearchInput(){
	var inputTextVal = jQuery('.ptSearchCriteriaDiv').find('.searchValue').find(':input').val();
	var inputSoldToVal = jQuery('.ptSearchCriteriaDiv').find('.soldToValue').find(':input').val();
	var term=trim(inputTextVal);
	var soldToTerm=trim(inputSoldToVal);
	var regex=/^[0-9]+$/;
	document.getElementById('validationMsg').style.display="none";
	if (term.match(regex)){ 
		// Case where soldToTerm is not required such as eproc user otherwise it is digits only
		if(typeof soldToTerm =='undefined' || soldToTerm.match(regex)){
			callSearchParcel(term, soldToTerm);
		}else{
			document.getElementById('validationMsg').style.display="block";
			return false;
		}
	} else {
		document.getElementById('validationMsg').style.display="block";
		return false;
	}
}
// Check to see if the user browser is IE
function ismsie(){
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0) {
    	return true;
    }
    return false;
}

function showCartMask(){
	if (ismsie()) {
		jQuery('.tradeCounterDropDown').prop("disabled",true);
		}
	equalHeight(jQuery(".loadingContainer, .loadingOverlapDiv"));
	equalWidth(jQuery(".loadingContainer, .loadingOverlapDiv, .loadingContent"));
	jQuery('.loadingOverlapDiv').show();
	jQuery('.loadingContent').show();
	jQuery(window).scrollTop(0);
}
function hideCartMask(){
	jQuery('.loadingOverlapDiv').hide();
	jQuery('.loadingContent').hide();
	jQuery(".loadingContainer, .loadingOverlapDiv").removeAttr('style');
	if (ismsie()) {
		jQuery('.tradeCounterDropDown').prop("disabled",false);
	}
}
function setDateRange(prevNumber,dateFormat){//method to set the date range for Order Search - OH-43
	var prevNumber = prevNumber
	var dateFormat = dateFormat;// dateFormat, taken from StandardDatePickerWidgetAction.
	dateFormat = dateFormat.replace('yyyy','yy').replace('MM','mm').replace('M','m');
	var d = new Date();
	var currentDate = new Date(d.setMonth(d.getMonth()));
	var backDate = new Date(d.setMonth(d.getMonth() - prevNumber));
	var formattedBackDate = jQuery.datepicker.formatDate(dateFormat, backDate);
	var formattedCurrentDate = jQuery.datepicker.formatDate(dateFormat, currentDate);
	jQuery('.fromDate').val(formattedBackDate);//set From date
	jQuery('.toDate').val(formattedCurrentDate);//set to Date
}

function countdownCounter(labelExceeded, labelRemaining, maxLength) {
	var parentObj = jQuery('.specialDeliveryInstruction');
	var textAreaObj = parentObj.find('.specialDeliveryInstructions');
	var countMessageDiv = parentObj.find('.charCountMessage');
	var text = textAreaObj.val();
	var returnLength=text.split("\n").length - 1;
	var currentLength = text.length+returnLength;
	var maxCharsAllowed =maxLength;
	if (currentLength <= maxCharsAllowed) {	
		countMessageDiv.text(labelRemaining+ ' '+(maxCharsAllowed - currentLength));
		countMessageDiv.css("color", "#999999");
		textAreaObj.removeClass("charCountError");
	} else {
		countMessageDiv.text(labelExceeded	+ ' '+(currentLength - maxCharsAllowed));
		countMessageDiv.css("color", "#d00000");
		textAreaObj.addClass("charCountError");
	}	
}

function togglePanelTitleClass(parentPanelClass){//method to swap the class for opened collapse panel.			
	jQuery('.'+parentPanelClass+' .titleBar').addClass('openedPanel');
}
function insertGhostTextToAll(ghostText){
	jQuery(".dateInput").each(function(index) {
	    insertGhostText(this, ghostText);
	});
}

function insertGhostText(datePicker,ghostText){
	if(datePicker.value==""){
		jQuery(datePicker).val(ghostText).removeClass("blackText").addClass("ghostText");
		callGhostText();
	}
	if (datePicker.value==ghostText){
		jQuery(this).removeClass("blackText").addClass("ghostText");
	}
}

function dateSelectMultiple(datePicker,statusIndex){
	jQuery('.ghostTextClass'+statusIndex).removeClass('ghostText').addClass('blackText');
}

function imposeMaxLength(Object,MaxLen){
    if(Object.value.length > MaxLen){
        Object.value = Object.value.substring(0, MaxLen);
    }
}

function updateSearchKeyMaxLength(datePicker,statusIndex){
	jQuery('.searchValue').attr( 'maxLength', value );
}

function carousel_forward(lineNumber,accessoriesize,acc_current_group) {//carousel Next button functionality
	var panelDivClass =	'accessoryItems_'+lineNumber+'_Div';
		acc_current_group = acc_current_group - 1;
		if(Math.ceil(accessoriesize/3)>1 && acc_current_group < Math.ceil(accessoriesize/3) && jQuery('#forwardBtnId_'+lineNumber).hasClass('forwardBtn')){
			jQuery('.'+panelDivClass).animate({'left': '-=868px'}, 'slow');
			acc_current_group = acc_current_group + 1;
			jQuery('#backBtnId_'+lineNumber).addClass('backBtn').removeClass('backBtnDisabled'); 
		}
		if(acc_current_group == Math.ceil(accessoriesize/3)){
		jQuery('#forwardBtnId_'+lineNumber).addClass('forwardBtnDisabled').removeClass('forwardBtn'); }
}
function carousel_backward(lineNumber,accessoriesize,acc_current_group) {//carousel Back button functionality
	var panelDivClass =	'accessoryItems_'+lineNumber+'_Div';
		if(acc_current_group >= 1 && jQuery('#backBtnId_'+lineNumber).hasClass('backBtn')){
			jQuery('.'+panelDivClass).animate({'left': '+=868px'}, 'slow');
		}
		if(acc_current_group==1){
			jQuery('#backBtnId_'+lineNumber).addClass('backBtnDisabled').removeClass('backBtn');
			jQuery('#forwardBtnId_'+lineNumber).addClass('forwardBtn').removeClass('forwardBtnDisabled');		
		}
		if(acc_current_group < Math.ceil(accessoriesize/3)){
		jQuery('#forwardBtnId_'+lineNumber).addClass('forwardBtn').removeClass('forwardBtnDisabled'); }
}

function sendAccessoriesCarouselCmTag(line,group){//fires cmCreateManualImpressionTag core metric tag on accessories carousel and showAccessories link click on cart page.
	//group is accessories groups. If we have 8 accessories they are shown in 3 groups of 3, 3 and 2. 
	if(group==undefined){//if value is undefined start with group 1.
		group=1;
	}
	var startValueForGroup=(parseInt(group) - 1) * 3;				
	for (var i = 0; i < 3; i++){
	 var accCmspValue = jQuery('#accesstag'+line+'_'+startValueForGroup).attr('class');
		if(accCmspValue != undefined){//if accCmspValue is undefined dont send tag.
		cmCreateManualImpressionTag(pageId, accCmspValue, '', '', '');
		startValueForGroup++;
		}
	}
}
function checkEnterKeyAndAddToCart(event, index) {
	var obj = jQuery("#productLine_"+index);
	var divStkNumObj = obj.find(".quickStockNo");
	var divCPNObj = obj.find(".customerPartNO");
	var buttonObj = jQuery("#quickAddEnabledBtnBtn").attr("class").split(" ");
	
	if (event.which == 13 || event.keyCode == 13) {
		if(((divStkNumObj.val() != null && divStkNumObj.val() != '') || (divCPNObj.val() !=null && divCPNObj.val() != '')) && buttonObj[0] != 'inprogress') {
			jQuery("#quickAddEnabledBtnBtn").removeClass("show").addClass("inprogress hide");
			jQuery("#quickAddDisabledBtnBtn").addClass("show");
			quickAdd();
		} 	
	}
}
function toggleQuickOrderGhostText() {
	jQuery('.quickOrderGhostText').each(function(){// Quick Order Ghost text script
		var d = jQuery(this).val();
		jQuery(this).focus(function(){
			jQuery('#quickOrderEnabledBtnBtn').removeClass("hide").addClass("show");
			jQuery('#quickOrderDisabledBtnBtn').removeClass("show").addClass("hide");
			if (jQuery(this).val() == d){
				jQuery(this).val('').removeClass('quickOrderGhostText');
				jQuery(this).val('').addClass('blackText');
			}
		});
		jQuery(this).blur(function(){
			if (jQuery(this).val() == '') {
				jQuery(this).val(d).addClass('quickOrderGhostText');
				jQuery(this).val(d).removeClass('blackText');
				jQuery('#quickOrderEnabledBtnBtn').removeClass("show").addClass("hide");
				jQuery('#quickOrderDisabledBtnBtn').removeClass("hide").addClass("show");
			} else if (jQuery(this).val() != d) {								
				jQuery('#quickOrderEnabledBtnBtn').removeClass("hide").addClass("show");
				jQuery('#quickOrderDisabledBtnBtn').removeClass("show").addClass("hide");
			}
		});
	});
}
function toggleAddProductsSelectorComponents(seleType) {	
	if(seleType == 'QuickAdd') {
		jQuery('.quickOrderWidgetDiv').removeClass("hide").addClass("show");
		jQuery('.quickAddToOrderWidgetDiv').removeClass("show").addClass("hide");
	} else {
		jQuery('.quickOrderWidgetDiv').removeClass("show").addClass("hide");
		jQuery('.quickAddToOrderWidgetDiv').removeClass("hide").addClass("show");
	}
}

jQuery(document).ready(function() {
	blockExtensions();
});

function blockExtensions() {
	if(typeof MutationObserver === 'function'){
		if((typeof isLineLevelPage != 'undefined') && (isLineLevelPage === true)){
			var extensionSelectorArray = extensionSelectors.split("+");
			var target = document.querySelector('body');
			var config = {childList: true, subtree: true};
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutationRecord) {
					jQuery.each(mutationRecord.addedNodes, function(index, mutationObj) {
						jQuery.each(extensionSelectorArray, function(index, extensionSelector) {
							if(jQuery(mutationObj).find(extensionSelector).length>0){
								observer.disconnect();
								jQuery(mutationObj).remove();
								observer.observe(target, config);
								return false;
							}
						});
					});
				});  
			});
			observer.observe(target, config);
		}
	}
}



var flagForRSPMTTypeEmbeddedGuestPmt=false;
function toggleOrderReviewButton(paymentType){
	var guestEmbeddedPaymentFormDiv = jQuery('#paymentForm\\:AddGuestEmbeddedPaymentWidgetAction_paymentFormDiv_Fields').get(0);	
	if(typeof(guestEmbeddedPaymentFormDiv) != "undefined") {	
		var activeElement = jQuery('.checkoutNavigationContainer').find('.enabledBtn');
		var inactiveElement = jQuery('.checkoutNavigationContainer').find('.disabledBtn');
			if(paymentType==1 && flagForRSPMTTypeEmbeddedGuestPmt==false){
				flagForRSPMTTypeEmbeddedGuestPmt= true;
				activeElement.removeClass('enabledBtn').addClass('disabledBtn');
				inactiveElement.removeClass('disabledBtn').addClass('enabledBtn');
				
			}else if (paymentType !=1 && flagForRSPMTTypeEmbeddedGuestPmt!= false){
			  flagForRSPMTTypeEmbeddedGuestPmt= false;
				activeElement.removeClass('enabledBtn').addClass('disabledBtn');
				inactiveElement.removeClass('disabledBtn').addClass('enabledBtn');
			}
	}
}
function toggleOrderReviewButtonOnPageLoad() {
		var guestEmbeddedPaymentFormDiv = jQuery('#paymentForm\\:AddGuestEmbeddedPaymentWidgetAction_paymentFormDiv_Fields').get(0);	
	if(typeof(guestEmbeddedPaymentFormDiv) != "undefined") {	
		var valueOfCheckedPaymentType=	jQuery('#paymentForm\\:AddGuestEmbeddedPaymentWidgetAction_paymentFormDiv_Fields').find('.cardTypeTbl').find('input[name=paymentType]:checked').attr('value');	
		if(valueOfCheckedPaymentType==1){
			var disabledFlag= jQuery('#paymentForm\\:AddGuestEmbeddedPaymentWidgetAction_paymentFormDiv_Fields').find('.cardTypeTbl').find('input[name=paymentType]:checked').prop('disabled');
			if(disabledFlag==false){
				toggleOrderReviewButton(valueOfCheckedPaymentType);
			}
		}
	}
}

//Added as part of Agile Sprint 2 Development.
var checkboxCollection = new Array(); 
function collectPartsListIds(obj){				
	var newObj = jQuery(obj).attr('id');					
	if(jQuery(obj).is(':checked')){
		checkboxCollection.push(newObj);
	}else{
		checkboxCollection.remove(newObj);								
	}
}
function populatePartsListArray(){
	var IdList = checkboxCollection.join();
	populatePartsListNames(IdList);
	//checkboxCollection.length = 0;
}
function redirectToPartsListDetails(redirect,url){
	var redirectEnabled = redirect;
	if(redirectEnabled=='true'){
		window.location.href=url;
	}
}
function resizeBrandLogoImg(){// method to resize the brandlogo image on brands page header.   
	jQuery.logoHeight = jQuery('.brandLogoImg').height();
    jQuery.logoWidth = jQuery('.brandLogoImg').width();
		if(jQuery.logoWidth > 300){
            jQuery('.brandLogoImg').addClass('brandLogoImgwidth');
        }
        if(jQuery.logoHeight > 55){
            jQuery('.brandLogoImg').addClass('brandLogoImgheight');
        }
}

/**
* Functionality relating to backToTop
**/
jQuery(document).ready(function() {
	var offset = 220;
	var duration = 500;
	
	//Show or hide backToTop icon based on the position window scrollbar 
	hideOrShowBackToTopIcon(this,offset);
	
	//Show or hide backToTop icon, when the user scrolls the page up or down
	jQuery(window).scroll(function() {
		
		//ie6 fix, if we dont put this code, the backToTop icon will stay at the bottom
		if(typeof document.body.style.maxHeight === "undefined") {
			var leftPosition = jQuery("div.backToTop").css("left");
			jQuery('div.backToTop').css({
				'position': 'absolute',
				'top': jQuery(window).scrollTop() + jQuery(window).height() - 42
			});
		}
		
		hideOrShowBackToTopIcon(this,offset);
	});
	
	//Finally when the user clicks on the icon, taken the user back to the top of the page
	jQuery('div.backToTop').click(function(event) {
		event.preventDefault();
		jQuery('html, body').animate({scrollTop: 0}, duration);
		return false;
	})
});

/**
Hide or show backToTop image, based on the offset
**/
function hideOrShowBackToTopIcon(obj, offset){
	if (jQuery(obj).scrollTop() > offset) {
			jQuery('div.backToTop').show();
	} else {
			jQuery('div.backToTop').hide();
	}
}
function loadTermsconditionFrameUrl(panleId) {//set url for terms contions Modal iframe.
	var fullId = $('div[id$="' + panleId + '"]').attr('id');
	var RSQuickViewArgs = document.getElementById(fullId).RSQuickViewArgs;
	var finalUrl = RSQuickViewArgs.url +"&viewMode=popup";
	jQuery('.termsConditionsFrame').attr('src',finalUrl);	
}
/* Changes relating to hiding and showing of Save to parts list button*/
var buttonEnabled = true;
function changeSaveToPartsListButtonState(enable){
	if(enable){
		if(!buttonEnabled){
			buttonEnabled = true;
			jQuery.toggleBtnStateElement = jQuery(".toggleThisBtnState");
			jQuery.toggleBtnStateElement.find(".disabledBtn").hide();
			jQuery.toggleBtnStateElement.find(".enabledBtn").show();
		}
	}else{
		if(buttonEnabled){
			buttonEnabled = false;
			jQuery.toggleBtnStateElement = jQuery(".toggleThisBtnState");
			jQuery.toggleBtnStateElement.find(".enabledBtn").hide();
			jQuery.toggleBtnStateElement.find(".disabledBtn").show();
		}
	}
}

/* Function to set necessary parameters for save to parts list modal layer. */
function initialisePartsListPanel() {
	buttonEnabled = true;
	changeSaveToPartsListButtonState(false);
}
/**
 Hide "Save to parts list" button when new parts list text field does not have any value
 Show "Save to parts list" button when new parts list text field does have value
 This method will be invoked onkeyup or onmouseout of textfield  and also through JQuery see registerOnChange
*/
function hideOrShowSaveToPartListButton(varStr){
	var enableSaveToPartsListButton = false;
	if(isQuantityValid()){
		if(jQuery.trim(varStr.value).length > 0){
			enableSaveToPartsListButton = true;
		}
	}
	//Hide or show saveToPartsListButton
	changeSaveToPartsListButtonState(enableSaveToPartsListButton);
}
/**
This method does two things
1) Hide or show "Save to parts list" button 
2) register on change event for drop down
This method is invoked when the user clicks on radio buttons and when the seam operation is complete
*/
function registerOnChange(){
	hideOrShowSaveToPartListButtonOnChange();
	jQuery( ".selectPartListOption" ).change(function() {
		hideOrShowSaveToPartListButton(this);
	});
}
/**
 Hide or show "Save to parts list" button when the user clicks on radio buttons
*/
function hideOrShowSaveToPartListButtonOnChange(){
	var enableSaveToPartsListButton = false;
	//if quantity is less than 1, then hide "Save to parts list" button
	if(isQuantityValid()){
		var existingPartsList = jQuery( ".selectPartListOption" );
		var newPartsList = jQuery( ".inputPartListName" );
		var qty = jQuery( ".inputQty" );
		//Determine if saveToPartsListButton should be enabled
		if(existingPartsList.length){
			if(jQuery.trim(existingPartsList.val()).length > 0){
				enableSaveToPartsListButton = true;
			}
		}else if(newPartsList.length){
			if(jQuery.trim(newPartsList.val()).length > 0){
				enableSaveToPartsListButton = true;
			}
		}
		
	}	
	//Hide or show saveToPartsListButton
	changeSaveToPartsListButtonState(enableSaveToPartsListButton);
}

/**
Method for checking, if Quantity is valid
*/
function isQuantityValid(){
	var qty = jQuery(".inputQty");
	if(qty.val() >= 1){
		return true;
	}else{
		return false;
	}
}

// Function for save to parts list widget to enable only digits between 0-9.
function checkPartsListQty(e){
    var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
    if (e.shiftKey != 1 && e.altKey == false && e.ctrlKey == false && (key > 47 && key < 58 || key==8 || key ==9 || key ==46 || key==37 || key ==39 || key > 95 && key < 106)){
        //48='0' , 57='9', 8=backspace, 46=delete, 37=left arrow, 39=right arrow, 96=numpad 0, 106=numpad 9
    } else{
			if (navigator.appVersion.indexOf("MSIE")!=-1){//For IE Browser
				window.event.returnValue = null;
			} else{
				e.preventDefault();
				e.returnValue = null;
			}
		}
}




/**********************/
/* Primary Navigation */
/**********************/
var currentLi;
var currentPrimaryNavigationMenu = null;

/**
*Logic for adding/removing menu-active css class to  Primary Navigation menus
*/
function togglePrimaryNavigationMenuLinks(currentPrimaryMenu,primaryNavigation){
	 var currentPrimaryMenuClass = currentPrimaryMenu.attr('class');
	 var allPrimaryNavigationMenus = primaryNavigation.find("li a.menu");
	 allPrimaryNavigationMenus.each(function(index){
		if(jQuery(this).attr('class') === currentPrimaryMenuClass){
			jQuery(this).toggleClass("menu-active"); 
		}else{
			jQuery(this).removeClass("menu-active");
		}
	 });
}


/**
*Logic for adding/removing hideVerticalMenu and showVerticalMenu css class to Vertical menus.
*/		
function toggleVerticalMenu(currentVerticalMenu,primaryNavigation){
	 var currentVerticalMenuParentClass = currentVerticalMenu.parent().attr('class');
	 var allVerticalMenus = primaryNavigation.find("ul.verticalMenu");
	 allVerticalMenus.each(function(index){
		if(jQuery(this).parent().hasClass( currentVerticalMenuParentClass )){
			currentVerticalMenu.toggleClass("hideVerticalMenu").toggleClass("showVerticalMenu"); 
		}else{
			jQuery(this).addClass("hideVerticalMenu").removeClass("showVerticalMenu");
		}
	 });
}

jQuery( document ).ready(function() {
	jQuery('#overlay').click(function(){
		//When the user clicks on overlay hide all the vertical menu's 
		jQuery("#overlay").removeClass("menuOverlay");	
		
		//For Primary Navigation links
		var primaryNavigation = jQuery("ul.primaryNavigation");
		var allPrimaryNavigationMenus = primaryNavigation.find("li a.menu");
		allPrimaryNavigationMenus.each(function(index){
			jQuery(this).removeClass("menu-active");
		});
		
		//For vertical menus
		var allVerticalMenus = primaryNavigation.find("ul.verticalMenu");
		allVerticalMenus.each(function(index){
			jQuery(this).addClass("hideVerticalMenu").removeClass("showVerticalMenu");
		});
	});
	
	//Mouse Click and Keyboard enter
	jQuery('ul.primaryNavigation li a').click(function(){
		var currentVerticalMenu = jQuery(this).next();
		//Find the Primary navigation, so that we can get all the vertical menu's and hide all the verticalMenus
		 var primaryNavigation = currentVerticalMenu.parent().parent();
		 togglePrimaryNavigationMenuLinks(jQuery(this),primaryNavigation)
		 toggleVerticalMenu(currentVerticalMenu,primaryNavigation);
		 currentPrimaryNavigationMenu = jQuery(this);
		 
		 //When the user clicks on the primary navigation menu, show the overlay
		 if(jQuery(this).hasClass('menu-active')){
			jQuery("#overlay").addClass("menuOverlay");
		 }else{
			jQuery("#overlay").removeClass("menuOverlay");	
		 }
	});
	
	jQuery('ul.primaryNavigation li a').keydown(function(event ){
		if(event.which==40){
			if(currentLi === undefined || currentLi ===  null){
				currentLi = jQuery(this).next().find("li.verticalMenuOption").get(0);
				currentLi = jQuery(currentLi);
			}else{
				if(currentLi.next().attr('class') === undefined){
					event.preventDefault();
					return;
				}
				currentLi.removeClass("highlight");
				currentLi = currentLi.next();
				if(currentLi.hasClass("verticalMenuHeader")){
					currentLi = currentLi.next();
				}
			}
			currentLi.addClass("highlight");
			currentLi.find("a").focus();
			event.preventDefault();
		}else if(event.which==38){
			if(currentLi === undefined || currentLi ===  null){
				currentPrimaryNavigationMenu.focus();
			}else{
				currentLi.removeClass("highlight");
				currentLi = currentLi.prev();
				if(currentLi.hasClass("verticalMenuHeader")){
					currentLi = currentLi.prev();
				}
				if(currentLi.attr('class') === undefined){
					currentPrimaryNavigationMenu.focus();
					currentLi = null;
					return;
				}
				currentLi.addClass("highlight");
				currentLi.find("a").focus();
			}
			event.preventDefault();
		}
	});
});

//This method will be called when user click on Find alternative button on advanced Line Level Page.
function showProdAttrCheckboxes(){
	jQuery('.prodSpecButton').addClass('hide');
	jQuery('#selectAll').prop('checked', false);
	jQuery('.checkbox').prop('checked', false);
	jQuery('#selectAllDiv, .checkbox, .searchPivotFind').removeClass('hide').addClass('show');
}

//Added method to redirect on calibration alternative.
function shwoCalibrationAlternative(url){
	window.location.href = url;
}

//This method will be called when user click on packaging type radio button on advanced Line Level Page.
function showProductVarient(url ){
	window.location.href = url;
}	

//This function toggles state of product attribute checkboxes under Specification secion on Advanced Line Level Page.
function toggleProdAttributeState(){
	var checked;
	if(jQuery("#selectAll").prop('checked') ){
		jQuery('.checkbox').prop('checked', true);
		checked = 'true';
	}else{
		jQuery('.checkbox').prop('checked', false);
		checked = 'false';
	}
	toggleFindAlternateButtonState(checked);
}

//This function toggles the state of Find alternatives Button
function toggleFindAlternateButtonState(checked){		
	var activeElement = jQuery('.searchPivotFind').find('.green');
	var inactiveElement = jQuery('.searchPivotFind').find('.inactive');
	if(checked == 'true' ){		
		inactiveElement.addClass('disabledBtn');
		activeElement.removeClass('disabledBtn');		
	}else{		
		inactiveElement.removeClass('disabledBtn');
		activeElement.addClass('disabledBtn');
	}
}

//Function to apply styling for price area on new line level page.
function highlightBreakPrice(qty,lineLevel){
	if (lineLevel === 'true') {
		
		var evt = jQuery.Event('qty-changed');
		
		jQuery(document).trigger(evt, qty);

	}
}

//This function is called when individual product specification attribute is selected on Advanced Line Level Page. 
function selectProdAttribute(){
	var checked;
	if(jQuery('.checkbox:checked').length == jQuery('.checkbox').length){
		jQuery('#selectAll').prop('checked', true);
	}else{
		jQuery('#selectAll').prop('checked', false);
	}
	if(jQuery('.checkbox:checked').length > 0 ){
		checked = 'true';		
	}else{
		checked = 'false';		
	}	
	toggleFindAlternateButtonState(checked);
}

//This function format the date object as per the formatString passed.
//Parameters: 1.date - the date object, 2.formatString - the format string
//Returns: the formatted date string.
//Sample call: formatDate(new Date("April 22, 2015 19:15:00"), 'dd/MMM/yyyy'), should return 22/APR/2015. 
function formatDate(date, formatString){
	//Local variable declaration
	var currentChar = '';
	var nextChar = '';
	var pattern = '';
	
	//Looping over the format string to search for pattern and replace the pattern with appropriate value.
	for(var i=0; i<formatString.length;i++){
		currentChar = formatString.charAt(i);
		nextChar = formatString.charAt(i+1);
		pattern+=currentChar;
		if(currentChar==nextChar){
			continue;
		}else{
			//Call to replace the searched pattern with the appropriate date component.
			formatString = replacePattern(formatString, pattern, date);
			pattern = '';
		}
	}
	return formatString;
}

//This function replace the pattern found with the appropriate component in date.
//Parameters: 1.formatString - the format string, 2.pattern - pattern to be replaced, 3.date - the date object.
//Returns format string with pattern replaced.
//Sample call: replacePattern('dd/MMM/yyyy','MMM',new Date("April 22, 2015 19:15:00")) should return dd/APR/yyyy.
function replacePattern(formatString, pattern, date){
	//Array for short month names.
	var shortMonthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
	//Array for long month names.
	var longMonthNames = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

	switch(pattern){
		case 'd':
			formatString = formatString.replace(pattern, date.getDate());
			break;
		case 'dd':
			var dateStr = date.getDate();
			dateStr = ''+dateStr;
			dateStr = dateStr.length < 2 ? padToLeft('0',1,dateStr) : dateStr;
			formatString = formatString.replace(pattern, dateStr);
			break;
		case 'M':
			formatString = formatString.replace(pattern, (date.getMonth()+1));
			break;
		case 'MM':
			var monthStr = (date.getMonth()+1);
			monthStr = ''+monthStr;
			monthStr = monthStr.length < 2 ? padToLeft('0',1,monthStr) : monthStr;
			formatString = formatString.replace(pattern, monthStr);
			break;
		case 'MMM':
			formatString = formatString.replace(pattern, shortMonthNames[date.getMonth()]);
			break;
		case 'MMMM':
			formatString = formatString.replace(pattern, longMonthNames[date.getMonth()]);
			break;
		case 'yy':
			formatString = formatString.replace(pattern, (date.getYear()-100) );
			break;
		case 'yyyy':
			formatString = formatString.replace(pattern, date.getFullYear());
			break;
		default:
	}
	return formatString;
}

//This function left pads the padChar for padCount times in the target string. 
//Parameters: 1.padChar - character to be used for padding, 2.padCount - number of times the char to be padded, 3.targetString - the string which is to be padded. 
//Returns padded string.
//Sample call: padToLeft('0',1,'4') should return 04.
function padToLeft(padChar, padCount, targetString){
	var padStr = '';
	for(var i=0; i< padCount; i++){
		padStr+=padChar;
	}
	return (padStr+targetString);
}

//====================< Image Gallery - Product List  >=====================

var EqualBlocksFormatter = {} || window.EqualBlocksFormatter;

jQuery(window).load(function(){
	
	EqualBlocksFormatter.setup = function(elm, rowBlocks){
	// var equalBlocksFormatter = function(elm, rowBlocks){
    	
        var $elm = jQuery(elm)
        	items = $elm.find('li'),
            rowBl = parseInt(rowBlocks),           
            heightArr = [],
            rowBlockHeight= null,
            counter = 0,
            rowElms = [],
            firstRow = true;
        
        items.each(function(){       	
        	counter++;
        	
            var elmHeight = jQuery(this).height(); //get current elm height
            
            heightArr.push(elmHeight);	//store each elm height for further use
            if(firstRow){ jQuery(this).addClass("pc-brd-top"); }  //add top border to only first row li          	
            $elm.css("border-top", "none"); //now remove container ul top border
            
            // if number of elements are less than row blocks
            if(items.length < rowBlocks) {
            	if( counter == items.length ){
            		heightArr.sort(function(a, b){return b-a});
            		rowBlockHeight = heightArr[0];
            		items.each(function(){
            			jQuery(this).css("height", rowBlockHeight);
                    });
            	}
            	
            }else {
            	
            	rowElms.push( jQuery(this) ); // insert current elm in array
            	
            	// check if last block of row and iterate through each line
            	if(counter == rowBl){            		
            		//teke the highest height value 
                    heightArr.sort(function(a, b){return b-a});
                    rowBlockHeight = heightArr[0]; 
                    
                    for (var i=0; i < rowElms.length; i++ ){                    	
                    	jQuery(rowElms[i]).css("height", rowBlockHeight);
                    }
                    
                    firstRow = false;
                    rowElms = [];
                    heightArr = [];		// clear height array
                    counter = 0;		// reset counter
            	}
            }
            
        });
        
    }    
}); //end of Equal Height Formatter component


// Uses of component - first refer css style and then called equalBlocksFormatter as shown below
//the same way can use on any number of module by passing ID or Class Name
jQuery(window).load(function(){
	var popularCategoryEBF = EqualBlocksFormatter;
	popularCategoryEBF.setup("#galleryPopularCategory", 5 ); //called equalBlocksFormatter comp on galleryPopularCategory
});

//Let's test this function
function isEven(val) {
    return val % 2 === 0;
}

function removeLLPricingSchemaAttributes(id) {
 document.getElementById("priceBox"+id).removeAttribute("itemprop");
 document.getElementById("priceBox"+id).removeAttribute("itemscope");
 document.getElementById("priceBox"+id).removeAttribute("itemtype");
}

function liveChatDocking() {
	document.getElementById('buttonDIVcatalogue').style.display = "none";
	document.getElementById('buttonDIVcheckout').style.display = "none"; 
	
	jQuery(window).load(function() {
		jQuery(".buttonDIVcatalogue").css("top", ((jQuery(window).height() - jQuery(".buttonDIVcatalogue").height()) / 2 ));
	});
	jQuery().ready(function() {
		jQuery(window).resize(function() {			
			jQuery(".buttonDIVcatalogue").css("top", ((jQuery(window).height() - jQuery(".buttonDIVcatalogue").height()) / 2 ));			
		});
	});
}

//Equal height component for price boxes on LL
jQuery(document).ready(function(){
	
	EqualBlocksFormatter.equalQtyHeight = function(elm, rowBlocks){
    	
        var $elm = jQuery(elm)
        	items = $elm.find('li'),
            rowBl = parseInt(rowBlocks),           
            heightArr = [],
            rowBlockHeight= null,
            counter = 0,
            rowElms = [],
            firstRow = true;
        
        items.each(function(){       	
        	counter++;
        	
            var elmHeight = jQuery(this).height(); //get current elm height
            
            heightArr.push(elmHeight);	//store each elm height for further use
            if(firstRow){ jQuery(this).addClass("pc-brd-top"); }  //add top border to only first row li          	
            $elm.css("border-top", "none"); //now remove container ul top border
            
            // if number of elements are less than row blocks
            if(items.length < rowBlocks) {
            	if( counter == items.length ){
            		heightArr.sort(function(a, b){return b-a});
            		rowBlockHeight = heightArr[0];
            		items.each(function(){
            			jQuery(this).css("height", rowBlockHeight);
                    });
            	}
            	
            }else {
            	
            	rowElms.push( jQuery(this) ); // insert current elm in array
            	
            	// check if last block of row and iterate through each line
            	if(counter == rowBl){            		
            		//teke the highest height value 
                    heightArr.sort(function(a, b){return b-a});
                    rowBlockHeight = heightArr[0]; 
                    
                    for (var i=0; i < rowElms.length; i++ ){                    	
                    	jQuery(rowElms[i]).css("height", rowBlockHeight);
                    }
                    
                    firstRow = false;
                    rowElms = [];
                    heightArr = [];		// clear height array
                    counter = 0;		// reset counter
            	}
            }
            
        });
        
    }
});

var MAX_INPUT_QTY = 999999;
jQuery(document).ready(function(){
	/* For Increment. */
    jQuery("#up").click(function(){
		setQuantityValue(true);
    });
	/* For Decrement. */
    jQuery("#down").click(function(){
		setQuantityValue(false);
    });
});

function setQuantityValue(isIncrement){
		var cartInputValue=jQuery(".cartInput").val();
		var breakRangeDifference=parseInt(jQuery('#breakRangeDifference').val());
		if(isIncrement){
			cartInputValue = getIncrementValue(cartInputValue,breakRangeDifference);
		}else {
			cartInputValue = getDecrementValue(cartInputValue,breakRangeDifference);
		}
		 jQuery(".cartInput").val(cartInputValue);
		 highlightBreakPrice(jQuery(".cartInput").get(0),'true');
}

function getIncrementValue(cartInputValue,breakRangeDifference){
	var maxValue = MAX_INPUT_QTY-breakRangeDifference;
	if(cartInputValue=="" || (cartInputValue < breakRangeDifference)) {
		cartInputValue=breakRangeDifference;
	}
	else if(cartInputValue <=maxValue){
		cartInputValue=parseInt(cartInputValue);
		if(cartInputValue%breakRangeDifference==0){
			cartInputValue=cartInputValue+breakRangeDifference;
		}
		else{
			cartInputValue=cartInputValue+(breakRangeDifference-cartInputValue%breakRangeDifference);
		}
	}
	return cartInputValue;
}

function getDecrementValue(cartInputValue,breakRangeDifference){

	if (cartInputValue!="" && cartInputValue > breakRangeDifference) {
			cartInputValue=parseInt(cartInputValue);
			if( (cartInputValue%breakRangeDifference==0)) {
				cartInputValue=cartInputValue-breakRangeDifference;
			}else{
				cartInputValue=cartInputValue-(cartInputValue%breakRangeDifference);
			}
		 }
	return cartInputValue;
}

function zeroResultFooter() {
	//Formatting for userHistory common component
	var recentlySearched = document.getElementById("recentlySearchedDetails");
	recentlySearched.style.minHeight = 165+"px";
	recentlySearched.style.border = "1px solid #cccccc";
	recentlySearched.style.width = 287+"px";
	recentlySearched.style.wordWrap = "break-word";
	recentlySearched.style.paddingLeft = 10+"px";
	recentlySearched.style.background = "#ffffff url('/siteImages/general/rsContactDetails_bgImg.gif') no-repeat";
	jQuery('.rsconacdetailsVertical').css('height', '143px');
	
	//Spacer logic to allow enough whitespace to show recently viewed products
	var footerHeight = document.getElementById("recentlySearchedDetails").offsetHeight;
	var footerMinHeight = parseInt(document.getElementById("recentlySearchedDetails").style.minHeight);
	var spacerHeight = footerHeight - footerMinHeight;
	document.getElementById("zeroResultSpacer").style.height = spacerHeight+"px";
}

function insertNegotiateBasketGhostTexts() {
	jQuery('.negotiatebasketghosttext').each(function(){// Ghost text script	
	var d;		
	var applyGhostTextChanges = false;
	if(jQuery(this).hasClass('additionalNotesText')) {
		d = jQuery('#additionalNotesGhostText').val();	
		applyGhostTextChanges = true;		
	}
	if (jQuery(this).hasClass('enquiryReference')) {
		var enqRefGhostText = jQuery('#enquiryReferenceGhostText').val();
		var defaultEnquiryName = jQuery('#defaultEnqName').val();
		d = enqRefGhostText + ' ' + defaultEnquiryName;
		applyGhostTextChanges = true;
	}
	
	if (applyGhostTextChanges) {	
		jQuery(this).focus(function(){
			if (jQuery(this).val() == d){
				jQuery(this).val('').removeClass('negotiatebasketghosttext');
				jQuery(this).val('').addClass('blackText');
			}
		});
		jQuery(this).blur(function(){
			if (jQuery(this).val() == ''){
				jQuery(this).val(d).addClass('negotiatebasketghosttext');
				jQuery(this).val(d).removeClass('blackText');
			}
		});
		if (jQuery(this).val() == ''){
			addDefaultGhostText(this, d);
		} else if (jQuery(this).val() != d) {
			removeDefaultGhostText(this,d);
		}
	}
	});	
}

function removeDefaultGhostText(objField, defaultText){
	if (objField != null){	
		var text = objField.value;
		if (text != defaultText){
		objField.value = text;
		jQuery(objField).removeClass('negotiatebasketghosttext').addClass('blackText');
		}
	}
}

function addDefaultGhostText(objField, defaultText){
	if (objField != null){
		var text = objField.value;
		if (trim(text) == ""){
			objField.value = defaultText;
			jQuery(objField).removeClass('blackText').addClass('negotiatebasketghosttext');
		}
	}
}

/**
 * updates the quick add to order panel ourself
 * because a4j causes the page flickering
 * @param xhr
 * @param index
 */
function updateQuickOrderBasketLines(xhr, index) {
	var targetId = 'shoppingBasketForm:quickAddToOrderPanel';	
	if(!xhr.hacked) {
		var orinal_func = xhr.getResponseHeader;
		xhr.getResponseHeader = function(name) {			
			var result = orinal_func.call(xhr, name);			
			return result && name === 'Ajax-Update-Ids' ? result.replace(targetId + ',', '') : result;
		}
		xhr.hacked = true;
	}
	var response = xhr.getElementById(targetId);
	var newLines = jQuery(typeof response.xml === 'string' ? response.xml : response).find('div#productLine_' + index + ',div#productLine_' + (index+1) );
	replaceAddAppend(newLines, index);
}

function replaceAddAppend(newLines, index) {
	var oLast = jQuery('div#productLine_' + index);
	jQuery(newLines[1]).css('display', 'block');
	jQuery(newLines[1]).insertAfter(oLast[0]);
	jQuery('<div class="clearBoth"></div>').insertAfter(oLast[0]);
	jQuery(newLines[0]).css('display', 'block');
	oLast.replaceWith(newLines[0]);		
}

/**
 * jQuery extension to render break prices into a table 
 * @param $
 */
(function($) {

	/**
	 * jQuery extension to draw theprice table
	 */
    $.fn.renderPriceList = function(prices) {
    	
    	var table = $(this);

    	/**
    	 * Event handler for Quantity changes
    	 */
    	jQuery(document).bind('qty-changed', function(evt, qty) {
    		var units = jQuery('div.breakRangeWithoutUnit', table);
    		var rows = units.parent('.value-row');
    		rows.removeClass('highlighted');
    		var nQty = Number(qty.value);
    		var len = units.length;
    		for(var i = len - 1; i >= 0; i--) {
    			var unit = units[i];
    			var p = /\d+/;
    			var matches = jQuery(unit).text().match(p);
    			if(matches) {
    				var nu = Number(matches[0]);
    				if(nQty >= nu) {
    					rows.removeClass('highlighted');
    					jQuery(unit).parent('.value-row').addClass('highlighted');
    					try {
	    					var hlListPrice = jQuery('.value-row.highlighted .unitPrice').text();
	    					jQuery('div.priceAreaContainer div.price').text(hlListPrice);
	    					jQuery('div.priceAreaContainer').find('#unitPrice').text(hlListPrice);
    					}catch(e) {}
    					
    					try {
	    					var hlYouPayPrice = jQuery('.value-row.highlighted .youPayPrice').text();;
	    					jQuery('div.priceAreaContainer div.green').find('#youPayPrice').text(hlYouPayPrice);
    					}catch(e) {}

    					break;
    				}
    			}
    		}
    		
    		if(jQuery('.value-row.highlighted', table).length === 0 && rows.length > 0) {
    			jQuery(rows[0]).addClass('highlighted');
    		}
    	});
    	
    	/**
    	 * Renders the table
    	 */
    	var drawTable = function(prices, table) {
    		var columns = prices.columns, breakPrices = prices.breakPrices, colSize = prices.columnSize;
    		var columnsWidth = {
    			2: '170px',
    			3: '113px',
    			4: '85px'
    		};
    		var colWidth = columnsWidth[colSize];
    	    		
    		var columnRow = obtainColumnRow(table);
    			
    		for(var column in columns) {
				
				var attrs = {
					'class': column, 
					width: colWidth,
					text: columns[column]
				};
				
    			buildDiv(columnRow, attrs);
    			
    			for(var i = 0; i < breakPrices.length; ++i) {
    				var price = breakPrices[i];
    				var valueRow = obtainValueRow(table, i);
    				if(i === 0) {
    					valueRow.addClass('highlighted');
    				}
					var value = price[column];
					if(value) {
						attrs.text = price[column]
						buildDiv(valueRow, attrs);
					}
    			}
    		}
    	}
   	
    	var buildDiv = function(container, params) {

			params = params || {};
    		
			var row = findDiv(params, container) || jQuery('<div/>').appendTo(container);
    		
    		for(var key in params) {
				if(key === 'text' || key === 'width') continue;
				row.attr(key, params[key]);
    		}
			
    		row.html(params['text'] || '');
			
    		row.width(params.width);
			
    		return row;
    	}
		
		var findDiv = function(params, container) {
			var selectors = ['#' + (params['id'] || ''), '.' + (params['class'] || '').replace(/ /g, '.')];
			for(var i = 0; i < selectors.length; ++i) {
				try {
					var div = jQuery(selectors[i], container);
					if(div.length > 0) {
						return div;
					}
				}catch(e) {
					continue;
				}
			}
			return null;
		}

    	var obtainRow = function(container, rowId, attrs) {
    		
    		var row = jQuery('div#' + rowId, container);
    	
    		if(row.length === 0) {
    		
    			var params = jQuery.extend({
    				id: rowId
    			}, attrs);
    			
    			row = buildDiv(container, params);	
    		}
    		
    		return row;
    	}
    	
    	var obtainColumnRow = function(table) {
    		return obtainRow(table, 'column-row');
    	}
    	
    	var obtainValueRow = function(table, rowIndex) {
    	
    		var valueRowId = 'value-row-' + rowIndex;
    		
    		var attrs = {
    			'class': 'value-row'
    		};
    		
    		return obtainRow(table, valueRowId, attrs);
    	}
    	
    	drawTable(prices, jQuery(this));
    }

})(jQuery);

function getAvailibilityMessageCount(tolalCountAndMsg) {
	var counter = 0;
	jQuery("table.cartTable").find("tr").each(function(index) { 
		var greenMsg = jQuery(this).find('.green.header').length;
		if (greenMsg > 0) {
			counter++;
		}
	});
	if (counter == 0) {
		jQuery('.availableMsg').hide();
	} else {
	jQuery('.addCountIcon').css({"background":"url('/siteImages/general/deliveryInfoIcon.gif') no-repeat","width":"31px","float":"left","margin-top":"26px","height":"16px","margin-top":"0","background-position":"7px -5px"});
	jQuery('.availableMsg').css({"color":"#008000","background-color":"#dff0d8","border-color":"#d6e9c6","padding":"22px","margin-top":"16px","border-radius":"5px","font-weight":"600"});
	jQuery('.availableItems').text(counter + "/" +tolalCountAndMsg);
	}
}

function onBasketCheckout($) {
	var container = $('.shoppingCartLayoutContainer .checkoutSecurelyAndPunchoutNavigationDiv.C328.C29');
	var enabled = $('.cssButton.blue.enabledBtn', container);
	var disabled = $('.cssButton.inactive.disabledBtn', container);
	enabled.unbind('click');
	enabled.click(function() {
		enabled.css('display', 'none');
		disabled.css('display', 'block');
	});	
}

function validateQtyWithDoubleBytesSupport(obj) {
	var val = obj.value;

	if(!val || val.length === 0) {
		return;
	}

    // a char code between 48 and 57 is a single byte number
	var isNumber = function(char) {
		return char >= 48 && char <= 57;
	}

    // a char code between 65296 and 65305 is a multi-byte number
	var isWideNumber = function(char) {
		return char >= 65296 && char <= 65305;
	}

    var invalid_chars = '';
    for(var i = 0; i < val.length; ++i) {
		var char = val.charCodeAt(i);
		if(!isNumber(char) && !isWideNumber(char)) {
			invalid_chars += val[i];
		}
    }
    
	if(invalid_chars.length > 0) {
		var pt = new RegExp('[' + invalid_chars + ']', 'gi');
		obj.value = val.replace(pt, '');
	}
}

function checkAddToCartQtyCountForLLQty(e, lineLevel, isRtqAvail){
	var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
    if(key===13　|| e.ctrlKey === true ){
        if (navigator.appVersion.indexOf("MSIE")!=-1){//For IE Browser
            window.event.returnValue = null;
        } else{
            e.preventDefault();
            e.returnValue = null;
        }
    	if(key===13) {
			onEnterKeyPressedInLLQty(e, lineLevel, isRtqAvail);
    	}
    }
}

function onEnterKeyPressedInLLQty(e, lineLevel, isRtqAvail) {
	if (isRtqAvail === true) {
		if (lineLevel === true) {
			runRTQWithAvailabilityCheck();
		} else {
			getEventSourceElementForm(e).find("a[id$=rtqLinkBot]").click();
		}
	} else {
		getEventSourceElementForm(e).find("input.cartButton").click();
	}	
}

//Helper to extract View State from JSF successful response and add to forms that do not contain the javax.faces.ViewState hidden field.
//Usage: Attach to JSF ajax success event 
//		jQuery(document).ready(function() {
//     	JSFAjaxViewStateHelper.attachToJSFAjaxSuccessEvent();
//		});
//
var JSFAjaxViewStateHelper = (function() {

	var refreshViewStates = function(responseXML) {
		try{
			var viewState = getViewState(responseXML);
			if (viewState !=null){
				var form = null;
				for (var i = 0; i < document.forms.length; i++) {
					form = document.forms[i];
					if (form.method == "post"){
						if (!hasViewState(form)) {
							createViewState(form, viewState);
						}else{
							updateViewState(form, viewState);
						}
					}
				}					
			}			
		}catch(e){
			//do nothing 
		}
		return null;
	};
	
	var getViewState = function(responseXML) {
		var updates = responseXML.getElementsByTagName("update");
		for (var i = 0; i < updates.length; i++) {
        if (updates[i].getAttribute("id") === "javax.faces.ViewState") {
        	return jQuery(updates[i]).text();
			}
		}
		return null;
	};

	var hasViewState = function(form) {
		return jQuery(form).find("input[name='javax.faces.ViewState']").length > 0;
	};
	
	var updateViewState = function(form, viewState){
		jQuery(form).find("input[name='javax.faces.ViewState']").val(viewState);
	};
	
	var createViewState = function(form, viewState) {
		var hidden;
		try {
			hidden = document.createElement("<input name='javax.faces.ViewState'>"); // IE6-8.
		} catch (e) {
			hidden = document.createElement("input");
			hidden.setAttribute("name", "javax.faces.ViewState");
		}
		hidden.setAttribute("type", "hidden");
		hidden.setAttribute("value", viewState);
		hidden.setAttribute("autocomplete", "off");
		hidden.setAttribute("id", "javax.faces.ViewState");
		form.appendChild(hidden);
	};
	
	return {
		attachToJSFAjaxSuccessEvent : function(){
			jsf.ajax.addOnEvent(
				function(data){
					if (data.status == "success") {
						refreshViewStates(data.responseXML);
					}
					return null;
				});
		}	
	}
}());

/*
** Add a method to the RichFaces PopupPanel to resize to fit the contents
**
** Usage: #{rich:component('<panel name>')}.doResize()
** 
*/
$(function() {
	RichFaces.ui.PopupPanel.prototype.doResize = function() {
									                this.currentMinHeight = undefined;
									                this.currentMinWidth = undefined;
									                this.div.hide();
								                    this.shown = false;
								                    this.setLeft(10);
								                    this.setTop(10);
													this.show();
												};
});

/* Bloomreach*/
jQuery(document).ready(function() {
	$('.br-sf-widget-merchant-qv a').each(function() {
		$(this).click(function() {
			$("#overlay").addClass("menuOverlay");
		});
	});
	$('.br-sf-widget-merchant-popup-close a').each(function() {
		$(this).click(function() {
			$("#overlay").removeClass("menuOverlay");
		});
	});
	$('#overlay').click(function() {
		(typeof(hideBrRpQv) !== "undefined") ? hideBrRpQv() : null;
	});
});

/* Smooth scroll to page branch collection and open the branch collection selection */
$(document).on('click', 'a[href="#deliveryAndCollectionSelector"]', function (event) {
	event.preventDefault();

	$('html, body').animate({
			scrollTop: $($.attr(this, 'href')).offset().top
	}, 600, function() {
		$('#js-branchCollectionBtn').trigger('click');
	});
});