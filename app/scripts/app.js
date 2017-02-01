/*#############
For convenience
###########*/
function addKeyVal(key, val, obj){
      //requires that an object is passed in.
      obj[key] = val;
    }
function emptyObj(){}
/*##########################################
Helper functions and Functions for when
it works differently in different browsers
##########################*/
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

  function getPosition(el) {
  //Find our more about this function here
  //https://www.kirupa.com/html5/get_element_position_using_javascript.htm
    var _top = 0;var _left = 0;var _bottom = 0;var _right = 0;var rect = null;
    if(rect=el.getBoundingClientRect()){return rect;}else{
      while(el){
        if (el.tagName == "BODY") {
          var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
          var yScroll = el.scrollTop || document.documentElement.scrollTop;
          _left += (el.offsetLeft - xScroll + el.clientLeft);
          _top += (el.offsetTop - yScroll + el.clientTop);
        }else{
          _left += (el.offsetLeft - el.scrollLeft + el.clientLeft);
          _top += (el.offsetTop - el.scrollTop + el.clientTop);
          _bottom = el.offsetHeight+_top;
          _right = el.offsetWidth+_left;
        }
        //el = el.offsetParent;
      }
      return {top: _top,left: _left,bottom: _bottom,right: _right, width:_left - _right,height:_top - _bottom};
    }
    return null;
  }
   /*##############*/
  function getViewport() {
  //Find out more about this function here
  // http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
     var viewPortWidth;
     var viewPortHeight;
     if (typeof window.innerWidth != 'undefined') {
       viewPortWidth = window.innerWidth;
       viewPortHeight = window.innerHeight;
     }
     else if (typeof document.documentElement !== 'undefined' &&
     typeof document.documentElement.clientWidth !== 'undefined' &&
     document.documentElement.clientWidth !== 0) {
        viewPortWidth = document.documentElement.clientWidth;
        viewPortHeight = document.documentElement.clientHeight;
     }
     else {
       viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;
       viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
     }
     return {width:viewPortWidth, height:viewPortHeight};
  }

var thankyoustate = false;
  function updatePosition() {


        TitleBar = document.querySelector("#titlebar");
        CompanyName = document.querySelector("#companyname");
        Outro = document.querySelector('#outro');
        OutroSpan = document.querySelector('#thankyou');

        CompanyNameRect = getPosition(CompanyName);
        TitleBarRect = getPosition(TitleBar);
        OutroRect = getPosition(Outro);
        OutroSpanRect = getPosition(OutroSpan);

        if(TitleBarRect.bottom <= CompanyNameRect.bottom && thankyoustate === false){
          thankyoustate = true;
          OutroHeight = OutroRect.bottom - OutroRect.top;
          OutroSpanHeight = OutroSpanRect.bottom - OutroSpanRect.top;
          OutroSpan.classList.remove('verticalTranslateDown');
          OutroSpan.classList.add('verticalTranslateUp');

        }
        if(TitleBarRect.bottom >= CompanyNameRect.bottom && thankyoustate === true){
          thankyoustate = false;
          OutroSpan.classList.remove('verticalTranslateUp');
          OutroSpan.classList.add('verticalTranslateDown');
        }
  }
  var updatePositionDebounced = debounce(updatePosition,14);

  function setBodyPaddingRelViewPort(){}

  function updateSize(){
      dealWithCSSQuirks();
      updatePosition();
  }
  function dealWithCSSQuirks(){
    //This function sets a css custom property to change its default
    //bottom position, should run only on screen resize and load
    Root = document.body;
    ThankYou = document.querySelector('#thankyou');
    ThankYouRect = getPosition(ThankYou);
    ThankYouHeight = ThankYouRect.bottom - ThankYouRect.top+20;
    ThankYouNewBottom = 0 - ThankYouHeight;
    ThankYouNewBottom += "px";
    ThankYou.style.setProperty('height',ThankYouHeight);
    ThankYou.style.setProperty('bottom',ThankYouNewBottom);
  }

(function(document) {
      'use strict';
      /*#######################################################
      Grab a reference to our auto-binding template
      and give it some initial binding values
      Learn more about auto-binding templates at http://goo.gl/Dx1u2g
      #############################################*/
      var app = document.querySelector('#app');
        window.addEventListener("scroll", updatePositionDebounced, false);
        window.addEventListener("resize", updateSize, false);
      // Sets app default base URL
      app.baseUrl = '/';

      if (window.location.port === '') {  // if production
        // Uncomment app.baseURL below and
        // set app.baseURL to '/your-pathname/' if running from folder in production
        app.baseUrl = '/';
      }else{app.baseUrl = '/polymer_crosscut_clientsite/app/index.html';}

      app.displayInstalledToast = function() {
        // Check to make sure caching is actually enabled—it won't be in the dev environment.
        if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
          Polymer.dom(document).querySelector('#caching-complete').show();
        }
      };

      // Listen for template bound event to know when bindings
      // have resolved and content has been stamped to the page
      window.addEventListener('dom-change', function() {
        console.log('Our app is ready to rock!');
      });


      // See https://github.com/Polymer/polymer/issues/1381
      window.addEventListener('WebComponentsReady', function() {
        // imports are loaded and elements have been registered
        //setRoutes(app);
        //$('.sticky').Stickyfill();
        setBodyPaddingRelViewPort();
        dealWithCSSQuirks();
      });
      /*******************
        PSK had additional script here.
        Reference the original project.
      ***************/
})(document);
