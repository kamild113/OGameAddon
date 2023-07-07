/*! For license information please see bundle.js.LICENSE.txt */
(()=>{var t={622:(t,e,n)=>{var r=n(363);t.exports=r},113:(t,e,n)=>{var r=/(<\/?[a-z][a-z0-9]*(?::[a-z][a-z0-9]*)?\s*(?:\s+[a-z0-9-_]+=(?:(?:'[\s\S]*?')|(?:"[\s\S]*?")))*\s*\/?>)|([^<]|<(?![a-z\/]))*/gi,o=/\s[a-z0-9-_]+\b(\s*=\s*('|")[\s\S]*?\2)?/gi,a=/(\s[a-z0-9-_]+\b\s*)(?:=(\s*('|")[\s\S]*?\3))?/gi,i=/^<[a-z]/,s=/\/>$/,c=/^<\//,u=/<\/?([a-z][a-z0-9]*)(?::([a-z][a-z0-9]*))?/i,l=/^('|")|('|")$/g,h=/^(?:area|base|br|col|command|embed|hr|img|input|link|meta|param|source)/i,f=n(598);function p(t,e,n){for(var p,d,y,g,m,v,x,w,b=[],E=0,N=t.match(r),T=!1,L=null,C=0,_=N.length;C<_;C++)if(d=(w=N[C]).match(u),(p=e.test(w))&&!T&&(T=!0),T){if(i.test(w)){y=s.test(w)||h.test(d[1]),g=[];for(var S=0,O=(v=w.match(o)||[]).length;S<O;S++)a.lastIndex=0,m=a.exec(v[S]),g.push({name:m[1].trim(),value:(m[2]||"").trim().replace(l,"")});(L&&L.childNodes||b).push(x=new f({nodeType:1,nodeName:d[1],namespace:d[2],attributes:g,childNodes:[],parentNode:L,startTag:w,selfCloseTag:y})),E++,!n&&p&&L&&b.push(x),y?E--:L=x}else c.test(w)?L.nodeName==d[1]&&(L=L.parentNode,E--):L.childNodes.push(new f({nodeType:3,text:w,parentNode:L}));if(0==E&&(T=!1,L=null,n))break}return n?b[0]||null:b}function d(t){this.rawHTML=t}d.prototype.getElementsByClassName=function(t){var e=new RegExp("class=('|\")(.*?\\s)?"+t+"(\\s.*?)?\\1");return p(this.rawHTML,e)},d.prototype.getElementsByTagName=function(t){var e=new RegExp("^<"+t,"i");return p(this.rawHTML,e)},d.prototype.getElementById=function(t){var e=new RegExp("id=('|\")"+t+"\\1");return p(this.rawHTML,e,!0)},d.prototype.getElementsByName=function(t){return this.getElementsByAttribute("name",t)},d.prototype.getElementsByAttribute=function(t,e){var n=new RegExp("\\s"+t+"=('|\")"+e+"\\1");return p(this.rawHTML,n)},t.exports=d},363:(t,e,n)=>{var r=n(113);function o(){}o.prototype.parseFromString=function(t){return new r(t)},t.exports=o},598:t=>{function e(t){this.namespace=t.namespace||null,this.text=t.text,this._selfCloseTag=t.selfCloseTag,Object.defineProperties(this,{nodeType:{value:t.nodeType},nodeName:{value:1==t.nodeType?t.nodeName:"#text"},childNodes:{value:t.childNodes},firstChild:{get:function(){return this.childNodes[0]||null}},lastChild:{get:function(){return this.childNodes[this.childNodes.length-1]||null}},parentNode:{value:t.parentNode||null},attributes:{value:t.attributes||[]},innerHTML:{get:function(){for(var t,e="",n=0,r=this.childNodes.length;n<r;n++)e+=3===(t=this.childNodes[n]).nodeType?t.text:t.outerHTML;return e}},outerHTML:{get:function(){if(3!=this.nodeType){var t,e=(this.attributes.map((function(t){return t.name+(t.value?'="'+t.value+'"':"")}))||[]).join(" ");t="<"+this.nodeName+(e?" "+e:"")+(this._selfCloseTag?"/":"")+">",this._selfCloseTag||(t+=(this._selfCloseTag?"":this.childNodes.map((function(t){return t.outerHTML}))||[]).join(""),t+="</"+this.nodeName+">")}else t=this.textContent;return t}},textContent:{get:function(){return this.nodeType==e.TEXT_NODE?this.text:this.childNodes.map((function(t){return t.textContent})).join("").replace(/\x20+/g," ")}}})}function n(t,e,r){var o=[];if(r=!!r,3!==t.nodeType)for(var a=0,i=t.childNodes.length;a<i&&(3===t.childNodes[a].nodeType||!e(t.childNodes[a])||(o.push(t.childNodes[a]),!r));a++)o=o.concat(n(t.childNodes[a],e));return r?o[0]:o}e.prototype.getAttribute=function(t){for(var e=0,n=this.attributes.length;e<n;e++)if(this.attributes[e].name==t)return this.attributes[e].value;return null},e.prototype.getElementsByTagName=function(t){return n(this,(function(e){return e.nodeName==t}))},e.prototype.getElementsByClassName=function(t){var e=new RegExp("^(.*?\\s)?"+t+"(\\s.*?)?$");return n(this,(function(t){return t.attributes.length&&e.test(t.getAttribute("class"))}))},e.prototype.getElementById=function(t){return n(this,(function(e){return e.attributes.length&&e.getAttribute("id")==t}),!0)},e.prototype.getElementsByName=function(t){return n(this,(function(e){return e.attributes.length&&e.getAttribute("name")==t}))},e.ELEMENT_NODE=1,e.TEXT_NODE=3,t.exports=e}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var a=e[r]={exports:{}};return t[r](a,a.exports,n),a.exports}(()=>{"use strict";var t=n(622),e=function(e,n,o){var a=[],i=(new t).parseFromString(e,"text/html").getElementsByClassName("galaxy-info")[0];return i&&(a=r(i,n,o)),a},r=function(t,e,n){for(var r=[],i=0;i<t.childNodes.length;i++){var s=t.childNodes[i],c=s.getElementsByClassName("col-planet-name")[0];if(c){var u=c.getElementsByClassName("text-area")[0];if(u){var l={};l.planetName=u.innerHTML.replaceAll("\n","");var h=s.getElementsByClassName("col-moon")[0];l.hasMoon=3===h.childNodes.length;var f=s.getElementsByClassName("col-player")[0];if(f){var p=f.getElementsByClassName("text-area")[0];l.playerName=p.innerHTML,l.status=o(f),l.ranking=a(p);var d=s.getElementsByClassName("col-alliance")[0].getElementsByClassName("text-area")[0];d&&(l.alliance=d.innerHTML),l.galaxy=e,l.system=n,r.push(l)}}}}return r},o=function(t){var e=t.getElementsByClassName("tooltip")[0];if(e){var n=e.getAttribute("data-tooltip-content");return n.substring(n.indexOf(">")+1,n.lastIndexOf("<"))}return""},a=function(t){var e=t.getAttribute("data-tooltip-content");if(e){var n=e.match(/(?<=<a class='galaxy-shortcut-action' href='\/statistics\?rel=[a-f0-9-]+'>)\d+\.*\d+(?=<\/a>)/);if(n){var r=n[0].replace(".","");return parseInt(r)}return""}return""};function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function s(){s=function(){return t};var t={},e=Object.prototype,n=e.hasOwnProperty,r=Object.defineProperty||function(t,e,n){t[e]=n.value},o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",u=o.toStringTag||"@@toStringTag";function l(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,n){return t[e]=n}}function h(t,e,n,o){var a=e&&e.prototype instanceof d?e:d,i=Object.create(a.prototype),s=new _(o||[]);return r(i,"_invoke",{value:N(t,n,s)}),i}function f(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=h;var p={};function d(){}function y(){}function g(){}var m={};l(m,a,(function(){return this}));var v=Object.getPrototypeOf,x=v&&v(v(S([])));x&&x!==e&&n.call(x,a)&&(m=x);var w=g.prototype=d.prototype=Object.create(m);function b(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function o(r,a,s,c){var u=f(t[r],t,a);if("throw"!==u.type){var l=u.arg,h=l.value;return h&&"object"==i(h)&&n.call(h,"__await")?e.resolve(h.__await).then((function(t){o("next",t,s,c)}),(function(t){o("throw",t,s,c)})):e.resolve(h).then((function(t){l.value=t,s(l)}),(function(t){return o("throw",t,s,c)}))}c(u.arg)}var a;r(this,"_invoke",{value:function(t,n){function r(){return new e((function(e,r){o(t,n,e,r)}))}return a=a?a.then(r,r):r()}})}function N(t,e,n){var r="suspendedStart";return function(o,a){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw a;return{value:void 0,done:!0}}for(n.method=o,n.arg=a;;){var i=n.delegate;if(i){var s=T(i,n);if(s){if(s===p)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var c=f(t,e,n);if("normal"===c.type){if(r=n.done?"completed":"suspendedYield",c.arg===p)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r="completed",n.method="throw",n.arg=c.arg)}}}function T(t,e){var n=e.method,r=t.iterator[n];if(void 0===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=void 0,T(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),p;var o=f(r,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,p;var a=o.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,p):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,p)}function L(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function C(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function _(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(L,this),this.reset(!0)}function S(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,o=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:O}}function O(){return{value:void 0,done:!0}}return y.prototype=g,r(w,"constructor",{value:g,configurable:!0}),r(g,"constructor",{value:y,configurable:!0}),y.displayName=l(g,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===y||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,g):(t.__proto__=g,l(t,u,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},b(E.prototype),l(E.prototype,c,(function(){return this})),t.AsyncIterator=E,t.async=function(e,n,r,o,a){void 0===a&&(a=Promise);var i=new E(h(e,n,r,o),a);return t.isGeneratorFunction(n)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},b(w),l(w,u,"Generator"),l(w,a,(function(){return this})),l(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},t.values=S,_.prototype={constructor:_,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(C),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return i.type="throw",i.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],i=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var s=n.call(a,"catchLoc"),c=n.call(a,"finallyLoc");if(s&&c){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,p):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),p},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),C(n),p}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;C(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:S(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),p}},t}function c(t,e,n,r,o,a,i){try{var s=t[a](i),c=s.value}catch(t){return void n(t)}s.done?e(c):Promise.resolve(c).then(r,o)}var u=null,l=1,h=6,f=1,p=0,d=500,y=!1,g=null,m=[],v=!1,x=!1,w=[],b=new Map;chrome.storage.sync.set({isReading:y}),chrome.runtime.onMessage.addListener((function(t,e,n){if("startReading"===t.action)d=t.interval,l=parseInt(t.galaxyFrom),h=parseInt(t.galaxyTo),E();else if("stopReading"===t.action)N(t.save);else if("getPlanetsCount"===t.action)n(m.length);else if("getSynchDate"===t.action)n(g);else if("getPlanets"===t.action){var r=[];b.forEach((function(t,e){t&&(r=r.concat(t.planets))})),n(r)}else"loadData"===t.action?C():"getCurrentSettings"===t.action&&n({interval:d,minGalaxy:l,maxGalaxy:h});return n({}),!1}));var E=function(){y=!0,chrome.storage.sync.set({isReading:y}),y&&(w=[]),f=l,p=1,T()},N=function(t){y=!1,chrome.storage.sync.set({isReading:!1}),t&&O(f,w)},T=function t(){y&&(p>499&&(O(f,w),p=1,w=[],(f+=1)>h||f>6)?y=!1:(L(),fetch("https://orion.ogamex.net/galaxy/galaxydata?x="+f+"&y="+p,{method:"GET"}).then((function(t){return t.text()})).then(function(){var n,r=(n=s().mark((function n(r){var o;return s().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return o=e(r,f,p),w=w.concat(o),p++,n.next=5,B(d);case 5:t();case 6:case"end":return n.stop()}}),n)})),function(){var t=this,e=arguments;return new Promise((function(r,o){var a=n.apply(t,e);function i(t){c(a,r,o,i,s,"next",t)}function s(t){c(a,r,o,i,s,"throw",t)}i(void 0)}))});return function(t){return r.apply(this,arguments)}}()).catch((function(t){console.error(t)}))))},L=function(){chrome.runtime.sendMessage({action:"updateCounters",planetsFound:w.length,galaxy:f},(function(){return j(chrome.runtime.lastError)}))},C=function(){if(chrome.tabs.query({active:!0,currentWindow:!0},(function(t){t[0]&&(u=t[0].id)})),x){var t=0;b.forEach((function(e,n){e&&(t+=e.planets.length)})),chrome.tabs.sendMessage(u,{action:"dataLoaded",planetsFound:t,synchDate:g},(function(){return j(chrome.runtime.lastError)}))}else v||x||(v=!0,_(1))},_=function(t){if(t>6){var e=0;return b.forEach((function(t,n){t&&(e+=t.planets.length)})),chrome.tabs.sendMessage(u,{action:"dataLoaded",planetsFound:e,synchDate:g},(function(){return j(chrome.runtime.lastError)})),v=!1,void(x=!0)}S(t)},S=function(t){fetch("http://ogameaddon.ct8.pl/galaxy?galaxyIndex="+t,{method:"GET"}).then((function(t){return t.json()})).then((function(e){b.set(t,e),_(t+1)})).catch((function(){_(t+1)}))},O=function(t,e){var n={synchDate:(new Date).toLocaleString(),planetsFound:e.length,planets:e};b.set(t,n);var r=JSON.stringify(n);fetch("http://ogameaddon.ct8.pl/addGalaxy?galaxyIndex="+t,{method:"PUT",headers:{Accept:"application.json","Content-Type":"application/json"},body:r})},j=function(t){return!0},B=function(t){return new Promise((function(e){return setTimeout(e,t)}))}})()})();