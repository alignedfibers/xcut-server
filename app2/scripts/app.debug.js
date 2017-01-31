/*##########################################
Helper functions and Functions for when
it works differently in different browsers
##########################*/
  function getPosition(el) {
  //Retreives top,left,right,bottom positions relative to viewport
  //Works in recent Versions of firefox,IE,Chrome
    var _top = 0;
    var _left = 0;
    var _bottom = 0;
    var _right = 0;
    var rect = null;
    if(rect=el.getBoundingClientRect()){
      return rect;
    }else{
      while (el) {
        if (el.tagName == "BODY") {
          // deal with browser quirks with body/window/document and page scroll
          var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
          var yScroll = el.scrollTop || document.documentElement.scrollTop;
     
          _left += (el.offsetLeft - xScroll + el.clientLeft);
          _top += (el.offsetTop - yScroll + el.clientTop);
        } else {
          // for all other non-BODY elements
          _left += (el.offsetLeft - el.scrollLeft + el.clientLeft);
          _top += (el.offsetTop - el.scrollTop + el.clientTop);
          _bottom = el.offsetHeight+_top;
          _right = el.offsetWidth+_left;
        }
        el = el.offsetParent;
      }
      return {
        top: _top,
        left: _left,
        bottom: _bottom,
        right: _right
      };
    }
    return null;
  }

   /*##############*/
  function getViewport() {
  //Find out more about this function here
  // http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/ 
console.log("in get viewPort");
     var viewPortWidth;
     var viewPortHeight;
     if (typeof window.innerWidth != 'undefined') {
       viewPortWidth = window.innerWidth,
       viewPortHeight = window.innerHeight
     }
     else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0) {
        viewPortWidth = document.documentElement.clientWidth,
        viewPortHeight = document.documentElement.clientHeight
     }
     else {
       viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
       viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
     }
     return {width:viewPortWidth, height:viewPortHeight};
  }

/*##########################################
Functions tied specifically to this page 
dependent on element name, id, class and/or 
location of elements on the page.
##########################*/
  function updatePosition() {
        /*##################
        Index the elements we need
        ########################*/
        Navigator = document.querySelector("#navigator");
        TitleBar = document.querySelector("#title-bar");
        PageContainer = document.querySelector("#page-container");
        CompanyName = document.querySelector("#companyname");
        Outro = document.querySelector('#outro');
        OutroSpan = document.querySelector('#thankyou');
        /*##################
        Take a snap shot of indexed elements 
        cur location relative to viewport
        ########################*/
        CompanyNameRect = getPosition(CompanyName);
        NavigatorRect = getPosition(Navigator);
        TitleBarRect = getPosition(TitleBar);
        OutroRect = getPosition(Outro);
        OutroSpanRect = getPosition(OutroSpan);

        NavigatorCurPositionProp = getComputedStyle(Navigator).getPropertyValue("position");
        if(NavigatorRect.top <= CompanyNameRect.bottom && NavigatorCurPositionProp == "relative"){
console.log("Nav less than CompanyNameRect.bottom && Nav Position == Relative");
          Navigator.style.position = "fixed";
          adjustedPosition = CompanyNameRect.bottom;
          Navigator.style.top = adjustedPosition+"px";
          Navigator.style.left = "0px";
            OutroHeight = OutroRect.bottom - OutroRect.top;
console.log("Outro Height: "+OutroHeight);
            OutroSpanHeight = OutroSpanRect.bottom - OutroSpanRect.top;
console.log("OutroSpan height"+OutroSpanHeight);
            OutroSpan.classList.remove('verticalTranslateDown');
            OutroSpan.classList.add('verticalTranslateUp');

        }
        if(TitleBarRect.bottom >= NavigatorRect.top && NavigatorCurPositionProp == "fixed"){
            /*################################################
            #If the element affected here is not soley wrapped in an element that has a fixed size and 
            #maintains flow this request for layout and paint caused by the style changes could cause
            #a domino effect -- Note worthy if you need to do anything more drastic than this be careful
            ############################################*/
console.log("TitleBarRect.bottom >= NavigatorRect.top && Nav Position == fixed");
            Navigator.style.position = "relative";
            Navigator.style.top = "0px";
            Navigator.style.left = "0px";
            OutroSpan.classList.remove('verticalTranslateUp'); 
            OutroSpan.classList.add('verticalTranslateDown');   
    
        }
  }
  function setBodyPaddingRelViewPort(){
  /*******************************
  Not dum just lazy, I know I should
  Index these one time in js instead of
  query them every time I need them.
  *******************************/
  console.log("in paddingRelViewPort");
          Body = document.querySelector("body");
          ViewPort = getViewport();
          Padding=(ViewPort.height*.5);
          Body.style.paddingBottom = Padding+"px";
  }

function updateSize(){
console.log("in resize");
  dealWithCSSQuirks();
  setBodyPaddingRelViewPort();
  updatePosition();
}
  function dealWithCSSQuirks(){
    //This function sets a css custom property to change its default
    //bottom position, should run only on screen resize and load
console.log("in deal with css quirks");
    Root = document.body; 
    ThankYou = document.querySelector('#thankyou');
    ThankYouRect = getPosition(ThankYou);
    ThankYouHeight = ThankYouRect.bottom - ThankYouRect.top+20;
    ThankYouNewBottom = 0 - ThankYouHeight;
    ThankYouNewBottom += "px";
    ThankYou.style.setProperty('height',ThankYouHeight);
    ThankYou.style.setProperty('bottom',ThankYouNewBottom);
//successfulBottom = getComputedStyle(ThankYou).getPropertyValue('bottom');
//successfulHeight = getComputedStyle(ThankYou).getPropertyValue('height');
//console.log("successful bottom: "+successfulBottom);
//console.log("successful height: "+successfulHeight);
  }

(function(document) {
      'use strict';
      /*#######################################################
      Grab a reference to our auto-binding template
      and give it some initial binding values
      Learn more about auto-binding templates at http://goo.gl/Dx1u2g
      #############################################*/
      var app = document.querySelector('#app');
        window.addEventListener("scroll", updatePosition, false);
        window.addEventListener("resize", updateSize, false);
      // Sets app default base URL
      app.baseUrl = '/';
      if (window.location.port === '') {  // if production
        // Uncomment app.baseURL below and
        // set app.baseURL to '/your-pathname/' if running from folder in production
        // app.baseUrl = '/polymer-starter-kit/';
      }

      app.displayInstalledToast = function() {
        // Check to make sure caching is actually enabled—it won't be in the dev environment.
        if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
          Polymer.dom(document).querySelector('#caching-complete').show();
        }
      };

      // Listen for template bound event to know when bindings
      // have resolved and content has been stamped to the page
      app.addEventListener('dom-change', function() {
        console.log('Our app is ready to rock!');
      });


      // See https://github.com/Polymer/polymer/issues/1381
      window.addEventListener('WebComponentsReady', function() {
        // imports are loaded and elements have been registered
        setBodyPaddingRelViewPort();
        dealWithCSSQuirks();
        //updatePosition();
      });
      /*******************
        PSK had additional script here.
        Reference the original project.
      ***************/
})(document);
