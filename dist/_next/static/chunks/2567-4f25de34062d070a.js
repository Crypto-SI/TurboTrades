"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2567],{26981:function(t,e,r){r.d(e,{Ht:function(){return O},Ge:function(){return R}});var n,o,i,u=r(64090);function a(t,e){if(!t)throw Error("Invariant failed")}var c=r(61064),s=r(46347),f=r(69774);function h(){return(h=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t}).apply(this,arguments)}function l(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,p(t,e)}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function p(t,e){return(p=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function v(t,e,r){return(v=!function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}()?function(t,e,r){var n=[null];n.push.apply(n,e);var o=new(Function.bind.apply(t,n));return r&&p(o,r.prototype),o}:Reflect.construct).apply(null,arguments)}function g(t){var e="function"==typeof Map?new Map:void 0;return(g=function(t){if(null===t||-1===Function.toString.call(t).indexOf("[native code]"))return t;if("function"!=typeof t)throw TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return v(t,arguments,d(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),p(r,t)})(t)}function m(t,e){try{var r=t()}catch(t){return e(t)}return r&&r.then?r.then(void 0,e):r}function y(t){if("string"!=typeof t)return Number.isInteger(t)||a(!1),t;var e=Number.parseInt(t=t.replace(/^Ox/,"0x"),"0x"===t.trim().substring(0,2)?16:10);return Number.isNaN(e)&&a(!1),e}function C(t){"string"==typeof t&&t.match(/^(0x)?[0-9a-fA-F]{40}$/)||a(!1);for(var e="0x"===t.substring(0,2)?t:"0x"+t,r=e.toLowerCase().substring(2).split(""),n=new Uint8Array(40),o=0;o<40;o++)n[o]=r[o].charCodeAt(0);for(var i=(0,s.arrayify)((0,f.keccak256)(n)),u=0;u<40;u+=2)i[u>>1]>>4>=8&&(r[u]=r[u].toUpperCase()),(15&i[u>>1])>=8&&(r[u+1]=r[u+1].toUpperCase());var c="0x"+r.join("");return e.match(/([A-F].*[a-f])|([a-f].*[A-F])/)&&e!==c&&a(!1),c}"undefined"!=typeof Symbol&&(Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"))),"undefined"!=typeof Symbol&&(Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")));var E=function(t,e){try{var r=function(r){return Promise.resolve(Promise.all([void 0===e.chainId?t.getChainId():e.chainId,void 0===e.account?t.getAccount():e.account])).then(function(e){var n=e[0],o=e[1],i=y(n);if(t.supportedChainIds&&!t.supportedChainIds.includes(i))throw new T(i,t.supportedChainIds);var u=null===o?o:C(o);return{provider:r,chainId:i,account:u}})},n=void 0===e.provider;return Promise.resolve(n?Promise.resolve(t.getProvider()).then(r):r(e.provider))}catch(t){return Promise.reject(t)}},w=function(t){function e(){var e;return(e=t.call(this)||this).name=e.constructor.name,e}return l(e,t),e}(g(Error)),T=function(t){function e(e,r){var n;return(n=t.call(this)||this).name=n.constructor.name,n.message="Unsupported chain id: "+e+". Supported chain ids are: "+r+".",n}return l(e,t),e}(g(Error));function b(t,e){var r=e.type,n=e.payload;switch(r){case i.ACTIVATE_CONNECTOR:return{connector:n.connector,provider:n.provider,chainId:n.chainId,account:n.account,onError:n.onError};case i.UPDATE:var o=n.provider,u=n.chainId,a=n.account;return h({},t,void 0===o?{}:{provider:o},void 0===u?{}:{chainId:u},void 0===a?{}:{account:a});case i.UPDATE_FROM_ERROR:var c=n.provider,s=n.chainId,f=n.account;return h({},t,void 0===c?{}:{provider:c},void 0===s?{}:{chainId:s},void 0===f?{}:{account:f},{error:void 0});case i.ERROR:var l=n.error;return{connector:t.connector,error:l,onError:t.onError};case i.ERROR_FROM_ACTIVATION:return{connector:n.connector,error:n.error};case i.DEACTIVATE_CONNECTOR:return{}}}(n=i||(i={}))[n.ACTIVATE_CONNECTOR=0]="ACTIVATE_CONNECTOR",n[n.UPDATE=1]="UPDATE",n[n.UPDATE_FROM_ERROR=2]="UPDATE_FROM_ERROR",n[n.ERROR=3]="ERROR",n[n.ERROR_FROM_ACTIVATION=4]="ERROR_FROM_ACTIVATION",n[n.DEACTIVATE_CONNECTOR=5]="DEACTIVATE_CONNECTOR";var _="primary",P={},O=(P[_]&&a(!1),P[_]=(0,u.createContext)({activate:function(){try{return a(!1),Promise.resolve()}catch(t){return Promise.reject(t)}},setError:function(){a(!1)},deactivate:function(){a(!1)},active:!1}),P[_].displayName="Web3ReactContext - "+_,o=P[_].Provider,function(t){var e,r,n,a,s,f,l,d,p,v,g,_,P,O,R,A,D=t.getLibrary,I=t.children,N=(r=(e=(0,u.useReducer)(b,{}))[0],n=e[1],a=r.connector,s=r.provider,f=r.chainId,l=r.account,d=r.onError,p=r.error,v=(0,u.useRef)(-1),v.current+=1,g=(0,u.useCallback)(function(t,e,r){void 0===r&&(r=!1);try{var o=v.current,u=!1;return Promise.resolve(m(function(){return Promise.resolve(t.activate().then(function(t){return u=!0,t})).then(function(r){return Promise.resolve(E(t,r)).then(function(r){if(v.current>o)throw new w;n({type:i.ACTIVATE_CONNECTOR,payload:h({connector:t},r,{onError:e})})})})},function(o){if(o instanceof w)u&&t.deactivate();else if(r)throw u&&t.deactivate(),o;else e?(u&&t.deactivate(),e(o)):n({type:i.ERROR_FROM_ACTIVATION,payload:{connector:t,error:o}})}))}catch(t){return Promise.reject(t)}},[]),_=(0,u.useCallback)(function(t){n({type:i.ERROR,payload:{error:t}})},[]),P=(0,u.useCallback)(function(){n({type:i.DEACTIVATE_CONNECTOR})},[]),O=(0,u.useCallback)(function(t){try{if(!a)throw Error("This should never happen, it's just so Typescript stops complaining");var e=v.current;return Promise.resolve(function(){if(p)return m(function(){return Promise.resolve(E(a,t)).then(function(t){if(v.current>e)throw new w;n({type:i.UPDATE_FROM_ERROR,payload:t})})},function(t){t instanceof w||(d?d(t):n({type:i.ERROR,payload:{error:t}}))});var r=void 0===t.chainId?void 0:y(t.chainId);if(void 0!==r&&a.supportedChainIds&&!a.supportedChainIds.includes(r)){var o=new T(r,a.supportedChainIds);d?d(o):n({type:i.ERROR,payload:{error:o}})}else{var u="string"==typeof t.account?C(t.account):t.account;n({type:i.UPDATE,payload:{provider:t.provider,chainId:r,account:u}})}}())}catch(t){return Promise.reject(t)}},[a,p,d]),R=(0,u.useCallback)(function(t){d?d(t):n({type:i.ERROR,payload:{error:t}})},[d]),A=(0,u.useCallback)(function(){n({type:i.DEACTIVATE_CONNECTOR})},[]),(0,u.useEffect)(function(){return function(){a&&a.deactivate()}},[a]),(0,u.useEffect)(function(){return a&&a.on(c._.Update,O).on(c._.Error,R).on(c._.Deactivate,A),function(){a&&a.off(c._.Update,O).off(c._.Error,R).off(c._.Deactivate,A)}},[a,O,R,A]),{connector:a,provider:s,chainId:f,account:l,activate:g,setError:_,deactivate:P,error:p}),L=N.connector,B=N.provider,k=N.chainId,M=N.account,j=N.activate,S=N.setError,x=N.deactivate,U=N.error,F=void 0!==L&&void 0!==k&&void 0!==M&&!U,H=(0,u.useMemo)(function(){return F&&void 0!==k&&Number.isInteger(k)&&L?D(B,L):void 0},[F,D,B,L,k]);return u.createElement(o,{value:{connector:L,library:H,chainId:k,account:M,activate:j,setError:S,deactivate:x,active:F,error:U}},I)});function R(t){var e;return(0,u.useContext)((void 0===(e=t)&&(e=_),Object.keys(P).includes(e)||a(!1),P[e]))}},26559:function(t,e,r){r.d(e,{_k:function(){return m}});var n=r(70094),o=r(61064),i=function(t){function e(e){var r,n=(void 0===e?{}:e).supportedChainIds;return(r=t.call(this)||this).supportedChainIds=n,r}e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t;var r=e.prototype;return r.emitUpdate=function(t){this.emit(o._.Update,t)},r.emitError=function(t){this.emit(o._.Error,t)},r.emitDeactivate=function(){this.emit(o._.Deactivate)},e}(n.EventEmitter);function u(){return(u=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t}).apply(this,arguments)}function a(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e}function c(t){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function f(t,e,r){return(f=!function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}()?function(t,e,r){var n=[null];n.push.apply(n,e);var o=new(Function.bind.apply(t,n));return r&&s(o,r.prototype),o}:Reflect.construct).apply(null,arguments)}function h(t){var e="function"==typeof Map?new Map:void 0;return(h=function(t){if(null===t||-1===Function.toString.call(t).indexOf("[native code]"))return t;if("function"!=typeof t)throw TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return f(t,arguments,c(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),s(r,t)})(t)}function l(t){if(void 0===t)throw ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function d(t,e){try{var r=t()}catch(t){return e(t)}return r&&r.then?r.then(void 0,e):r}function p(t){return t.hasOwnProperty("result")?t.result:t}"undefined"!=typeof Symbol&&(Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"))),"undefined"!=typeof Symbol&&(Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")));var v=function(t){function e(){var e;return(e=t.call(this)||this).name=e.constructor.name,e.message="No Ethereum provider was found on window.ethereum.",e}return a(e,t),e}(h(Error)),g=function(t){function e(){var e;return(e=t.call(this)||this).name=e.constructor.name,e.message="The user rejected the request.",e}return a(e,t),e}(h(Error)),m=function(t){function e(e){var r;return(r=t.call(this,e)||this).handleNetworkChanged=r.handleNetworkChanged.bind(l(r)),r.handleChainChanged=r.handleChainChanged.bind(l(r)),r.handleAccountsChanged=r.handleAccountsChanged.bind(l(r)),r.handleClose=r.handleClose.bind(l(r)),r}a(e,t);var r=e.prototype;return r.handleChainChanged=function(t){this.emitUpdate({chainId:t,provider:window.ethereum})},r.handleAccountsChanged=function(t){0===t.length?this.emitDeactivate():this.emitUpdate({account:t[0]})},r.handleClose=function(t,e){this.emitDeactivate()},r.handleNetworkChanged=function(t){this.emitUpdate({chainId:t,provider:window.ethereum})},r.activate=function(){try{var t,e=function(e){if(r)return e;function n(){return u({provider:window.ethereum},t?{account:t}:{})}var o=function(){if(!t)return Promise.resolve(window.ethereum.enable().then(function(t){return t&&p(t)[0]})).then(function(e){t=e})}();return o&&o.then?o.then(n):n(o)},r=!1;if(!window.ethereum)throw new v;window.ethereum.on&&(window.ethereum.on("chainChanged",this.handleChainChanged),window.ethereum.on("accountsChanged",this.handleAccountsChanged),window.ethereum.on("close",this.handleClose),window.ethereum.on("networkChanged",this.handleNetworkChanged)),window.ethereum.isMetaMask&&(window.ethereum.autoRefreshOnNetworkChange=!1);var n=d(function(){return Promise.resolve(window.ethereum.send("eth_requestAccounts").then(function(t){return p(t)[0]})).then(function(e){t=e})},function(t){if(4001===t.code)throw new g});return Promise.resolve(n&&n.then?n.then(e):e(n))}catch(t){return Promise.reject(t)}},r.getProvider=function(){try{return Promise.resolve(window.ethereum)}catch(t){return Promise.reject(t)}},r.getChainId=function(){try{var t,e=function(){function e(){if(!t)try{t=p(window.ethereum.send({method:"net_version"}))}catch(t){}return t||(t=window.ethereum.isDapper?p(window.ethereum.cachedResults.net_version):window.ethereum.chainId||window.ethereum.netVersion||window.ethereum.networkVersion||window.ethereum._chainId),t}var r=function(){if(!t){var e=d(function(){return Promise.resolve(window.ethereum.send("net_version").then(p)).then(function(e){t=e})},function(){});if(e&&e.then)return e.then(function(){})}}();return r&&r.then?r.then(e):e(r)};if(!window.ethereum)throw new v;var r=d(function(){return Promise.resolve(window.ethereum.send("eth_chainId").then(p)).then(function(e){t=e})},function(){});return Promise.resolve(r&&r.then?r.then(e):e(r))}catch(t){return Promise.reject(t)}},r.getAccount=function(){try{var t,e=function(){function e(){return t||(t=p(window.ethereum.send({method:"eth_accounts"}))[0]),t}var r=function(){if(!t){var e=d(function(){return Promise.resolve(window.ethereum.enable().then(function(t){return p(t)[0]})).then(function(e){t=e})},function(){});if(e&&e.then)return e.then(function(){})}}();return r&&r.then?r.then(e):e(r)};if(!window.ethereum)throw new v;var r=d(function(){return Promise.resolve(window.ethereum.send("eth_accounts").then(function(t){return p(t)[0]})).then(function(e){t=e})},function(){});return Promise.resolve(r&&r.then?r.then(e):e(r))}catch(t){return Promise.reject(t)}},r.deactivate=function(){window.ethereum&&window.ethereum.removeListener&&(window.ethereum.removeListener("chainChanged",this.handleChainChanged),window.ethereum.removeListener("accountsChanged",this.handleAccountsChanged),window.ethereum.removeListener("close",this.handleClose),window.ethereum.removeListener("networkChanged",this.handleNetworkChanged))},r.isAuthorized=function(){try{if(!window.ethereum)return Promise.resolve(!1);return Promise.resolve(d(function(){return Promise.resolve(window.ethereum.send("eth_accounts").then(function(t){return p(t).length>0}))},function(){return!1}))}catch(t){return Promise.reject(t)}},e}(i)},61064:function(t,e,r){var n,o;r.d(e,{_:function(){return n}}),(o=n||(n={})).Update="Web3ReactUpdate",o.Error="Web3ReactError",o.Deactivate="Web3ReactDeactivate"},18314:function(t,e,r){var n=r(41811);function o(){}function i(){}i.resetWarningCache=o,t.exports=function(){function t(t,e,r,o,i,u){if(u!==n){var a=Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw a.name="Invariant Violation",a}}function e(){return t}t.isRequired=t;var r={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:i,resetWarningCache:o};return r.PropTypes=r,r}},74404:function(t,e,r){t.exports=r(18314)()},41811:function(t){t.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},51562:function(t,e,r){var n=r(36269);function o(t){this.mode=n.MODE_8BIT_BYTE,this.data=t}o.prototype={getLength:function(t){return this.data.length},write:function(t){for(var e=0;e<this.data.length;e++)t.put(this.data.charCodeAt(e),8)}},t.exports=o},42717:function(t){function e(){this.buffer=[],this.length=0}e.prototype={get:function(t){return(this.buffer[Math.floor(t/8)]>>>7-t%8&1)==1},put:function(t,e){for(var r=0;r<e;r++)this.putBit((t>>>e-r-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(t){var e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}},t.exports=e},1438:function(t){t.exports={L:1,M:0,Q:3,H:2}},71955:function(t,e,r){var n=r(51602);function o(t,e){if(void 0==t.length)throw Error(t.length+"/"+e);for(var r=0;r<t.length&&0==t[r];)r++;this.num=Array(t.length-r+e);for(var n=0;n<t.length-r;n++)this.num[n]=t[n+r]}o.prototype={get:function(t){return this.num[t]},getLength:function(){return this.num.length},multiply:function(t){for(var e=Array(this.getLength()+t.getLength()-1),r=0;r<this.getLength();r++)for(var i=0;i<t.getLength();i++)e[r+i]^=n.gexp(n.glog(this.get(r))+n.glog(t.get(i)));return new o(e,0)},mod:function(t){if(this.getLength()-t.getLength()<0)return this;for(var e=n.glog(this.get(0))-n.glog(t.get(0)),r=Array(this.getLength()),i=0;i<this.getLength();i++)r[i]=this.get(i);for(var i=0;i<t.getLength();i++)r[i]^=n.gexp(n.glog(t.get(i))+e);return new o(r,0).mod(t)}},t.exports=o},3991:function(t,e,r){var n=r(51562),o=r(29908),i=r(42717),u=r(68512),a=r(71955);function c(t,e){this.typeNumber=t,this.errorCorrectLevel=e,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}var s=c.prototype;s.addData=function(t){var e=new n(t);this.dataList.push(e),this.dataCache=null},s.isDark=function(t,e){if(t<0||this.moduleCount<=t||e<0||this.moduleCount<=e)throw Error(t+","+e);return this.modules[t][e]},s.getModuleCount=function(){return this.moduleCount},s.make=function(){if(this.typeNumber<1){var t=1;for(t=1;t<40;t++){for(var e=o.getRSBlocks(t,this.errorCorrectLevel),r=new i,n=0,a=0;a<e.length;a++)n+=e[a].dataCount;for(var a=0;a<this.dataList.length;a++){var c=this.dataList[a];r.put(c.mode,4),r.put(c.getLength(),u.getLengthInBits(c.mode,t)),c.write(r)}if(r.getLengthInBits()<=8*n)break}this.typeNumber=t}this.makeImpl(!1,this.getBestMaskPattern())},s.makeImpl=function(t,e){this.moduleCount=4*this.typeNumber+17,this.modules=Array(this.moduleCount);for(var r=0;r<this.moduleCount;r++){this.modules[r]=Array(this.moduleCount);for(var n=0;n<this.moduleCount;n++)this.modules[r][n]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(t,e),this.typeNumber>=7&&this.setupTypeNumber(t),null==this.dataCache&&(this.dataCache=c.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,e)},s.setupPositionProbePattern=function(t,e){for(var r=-1;r<=7;r++)if(!(t+r<=-1)&&!(this.moduleCount<=t+r))for(var n=-1;n<=7;n++)e+n<=-1||this.moduleCount<=e+n||(0<=r&&r<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==r||6==r)||2<=r&&r<=4&&2<=n&&n<=4?this.modules[t+r][e+n]=!0:this.modules[t+r][e+n]=!1)},s.getBestMaskPattern=function(){for(var t=0,e=0,r=0;r<8;r++){this.makeImpl(!0,r);var n=u.getLostPoint(this);(0==r||t>n)&&(t=n,e=r)}return e},s.createMovieClip=function(t,e,r){var n=t.createEmptyMovieClip(e,r);this.make();for(var o=0;o<this.modules.length;o++)for(var i=1*o,u=0;u<this.modules[o].length;u++){var a=1*u;this.modules[o][u]&&(n.beginFill(0,100),n.moveTo(a,i),n.lineTo(a+1,i),n.lineTo(a+1,i+1),n.lineTo(a,i+1),n.endFill())}return n},s.setupTimingPattern=function(){for(var t=8;t<this.moduleCount-8;t++)null==this.modules[t][6]&&(this.modules[t][6]=t%2==0);for(var e=8;e<this.moduleCount-8;e++)null==this.modules[6][e]&&(this.modules[6][e]=e%2==0)},s.setupPositionAdjustPattern=function(){for(var t=u.getPatternPosition(this.typeNumber),e=0;e<t.length;e++)for(var r=0;r<t.length;r++){var n=t[e],o=t[r];if(null==this.modules[n][o])for(var i=-2;i<=2;i++)for(var a=-2;a<=2;a++)-2==i||2==i||-2==a||2==a||0==i&&0==a?this.modules[n+i][o+a]=!0:this.modules[n+i][o+a]=!1}},s.setupTypeNumber=function(t){for(var e=u.getBCHTypeNumber(this.typeNumber),r=0;r<18;r++){var n=!t&&(e>>r&1)==1;this.modules[Math.floor(r/3)][r%3+this.moduleCount-8-3]=n}for(var r=0;r<18;r++){var n=!t&&(e>>r&1)==1;this.modules[r%3+this.moduleCount-8-3][Math.floor(r/3)]=n}},s.setupTypeInfo=function(t,e){for(var r=this.errorCorrectLevel<<3|e,n=u.getBCHTypeInfo(r),o=0;o<15;o++){var i=!t&&(n>>o&1)==1;o<6?this.modules[o][8]=i:o<8?this.modules[o+1][8]=i:this.modules[this.moduleCount-15+o][8]=i}for(var o=0;o<15;o++){var i=!t&&(n>>o&1)==1;o<8?this.modules[8][this.moduleCount-o-1]=i:o<9?this.modules[8][15-o-1+1]=i:this.modules[8][15-o-1]=i}this.modules[this.moduleCount-8][8]=!t},s.mapData=function(t,e){for(var r=-1,n=this.moduleCount-1,o=7,i=0,a=this.moduleCount-1;a>0;a-=2)for(6==a&&a--;;){for(var c=0;c<2;c++)if(null==this.modules[n][a-c]){var s=!1;i<t.length&&(s=(t[i]>>>o&1)==1),u.getMask(e,n,a-c)&&(s=!s),this.modules[n][a-c]=s,-1==--o&&(i++,o=7)}if((n+=r)<0||this.moduleCount<=n){n-=r,r=-r;break}}},c.PAD0=236,c.PAD1=17,c.createData=function(t,e,r){for(var n=o.getRSBlocks(t,e),a=new i,s=0;s<r.length;s++){var f=r[s];a.put(f.mode,4),a.put(f.getLength(),u.getLengthInBits(f.mode,t)),f.write(a)}for(var h=0,s=0;s<n.length;s++)h+=n[s].dataCount;if(a.getLengthInBits()>8*h)throw Error("code length overflow. ("+a.getLengthInBits()+">"+8*h+")");for(a.getLengthInBits()+4<=8*h&&a.put(0,4);a.getLengthInBits()%8!=0;)a.putBit(!1);for(;!(a.getLengthInBits()>=8*h)&&(a.put(c.PAD0,8),!(a.getLengthInBits()>=8*h));)a.put(c.PAD1,8);return c.createBytes(a,n)},c.createBytes=function(t,e){for(var r=0,n=0,o=0,i=Array(e.length),c=Array(e.length),s=0;s<e.length;s++){var f=e[s].dataCount,h=e[s].totalCount-f;n=Math.max(n,f),o=Math.max(o,h),i[s]=Array(f);for(var l=0;l<i[s].length;l++)i[s][l]=255&t.buffer[l+r];r+=f;var d=u.getErrorCorrectPolynomial(h),p=new a(i[s],d.getLength()-1).mod(d);c[s]=Array(d.getLength()-1);for(var l=0;l<c[s].length;l++){var v=l+p.getLength()-c[s].length;c[s][l]=v>=0?p.get(v):0}}for(var g=0,l=0;l<e.length;l++)g+=e[l].totalCount;for(var m=Array(g),y=0,l=0;l<n;l++)for(var s=0;s<e.length;s++)l<i[s].length&&(m[y++]=i[s][l]);for(var l=0;l<o;l++)for(var s=0;s<e.length;s++)l<c[s].length&&(m[y++]=c[s][l]);return m},t.exports=c},29908:function(t,e,r){var n=r(1438);function o(t,e){this.totalCount=t,this.dataCount=e}o.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],o.getRSBlocks=function(t,e){var r=o.getRsBlockTable(t,e);if(void 0==r)throw Error("bad rs block @ typeNumber:"+t+"/errorCorrectLevel:"+e);for(var n=r.length/3,i=[],u=0;u<n;u++)for(var a=r[3*u+0],c=r[3*u+1],s=r[3*u+2],f=0;f<a;f++)i.push(new o(c,s));return i},o.getRsBlockTable=function(t,e){switch(e){case n.L:return o.RS_BLOCK_TABLE[(t-1)*4+0];case n.M:return o.RS_BLOCK_TABLE[(t-1)*4+1];case n.Q:return o.RS_BLOCK_TABLE[(t-1)*4+2];case n.H:return o.RS_BLOCK_TABLE[(t-1)*4+3];default:return}},t.exports=o},51602:function(t){for(var e={glog:function(t){if(t<1)throw Error("glog("+t+")");return e.LOG_TABLE[t]},gexp:function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return e.EXP_TABLE[t]},EXP_TABLE:Array(256),LOG_TABLE:Array(256)},r=0;r<8;r++)e.EXP_TABLE[r]=1<<r;for(var r=8;r<256;r++)e.EXP_TABLE[r]=e.EXP_TABLE[r-4]^e.EXP_TABLE[r-5]^e.EXP_TABLE[r-6]^e.EXP_TABLE[r-8];for(var r=0;r<255;r++)e.LOG_TABLE[e.EXP_TABLE[r]]=r;t.exports=e},36269:function(t){t.exports={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8}},68512:function(t,e,r){var n=r(36269),o=r(71955),i=r(51602),u={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},a={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(t){for(var e=t<<10;a.getBCHDigit(e)-a.getBCHDigit(a.G15)>=0;)e^=a.G15<<a.getBCHDigit(e)-a.getBCHDigit(a.G15);return(t<<10|e)^a.G15_MASK},getBCHTypeNumber:function(t){for(var e=t<<12;a.getBCHDigit(e)-a.getBCHDigit(a.G18)>=0;)e^=a.G18<<a.getBCHDigit(e)-a.getBCHDigit(a.G18);return t<<12|e},getBCHDigit:function(t){for(var e=0;0!=t;)e++,t>>>=1;return e},getPatternPosition:function(t){return a.PATTERN_POSITION_TABLE[t-1]},getMask:function(t,e,r){switch(t){case u.PATTERN000:return(e+r)%2==0;case u.PATTERN001:return e%2==0;case u.PATTERN010:return r%3==0;case u.PATTERN011:return(e+r)%3==0;case u.PATTERN100:return(Math.floor(e/2)+Math.floor(r/3))%2==0;case u.PATTERN101:return e*r%2+e*r%3==0;case u.PATTERN110:return(e*r%2+e*r%3)%2==0;case u.PATTERN111:return(e*r%3+(e+r)%2)%2==0;default:throw Error("bad maskPattern:"+t)}},getErrorCorrectPolynomial:function(t){for(var e=new o([1],0),r=0;r<t;r++)e=e.multiply(new o([1,i.gexp(r)],0));return e},getLengthInBits:function(t,e){if(1<=e&&e<10)switch(t){case n.MODE_NUMBER:return 10;case n.MODE_ALPHA_NUM:return 9;case n.MODE_8BIT_BYTE:case n.MODE_KANJI:return 8;default:throw Error("mode:"+t)}else if(e<27)switch(t){case n.MODE_NUMBER:return 12;case n.MODE_ALPHA_NUM:return 11;case n.MODE_8BIT_BYTE:return 16;case n.MODE_KANJI:return 10;default:throw Error("mode:"+t)}else if(e<41)switch(t){case n.MODE_NUMBER:return 14;case n.MODE_ALPHA_NUM:return 13;case n.MODE_8BIT_BYTE:return 16;case n.MODE_KANJI:return 12;default:throw Error("mode:"+t)}else throw Error("type:"+e)},getLostPoint:function(t){for(var e=t.getModuleCount(),r=0,n=0;n<e;n++)for(var o=0;o<e;o++){for(var i=0,u=t.isDark(n,o),a=-1;a<=1;a++)if(!(n+a<0)&&!(e<=n+a))for(var c=-1;c<=1;c++)!(o+c<0)&&!(e<=o+c)&&(0!=a||0!=c)&&u==t.isDark(n+a,o+c)&&i++;i>5&&(r+=3+i-5)}for(var n=0;n<e-1;n++)for(var o=0;o<e-1;o++){var s=0;t.isDark(n,o)&&s++,t.isDark(n+1,o)&&s++,t.isDark(n,o+1)&&s++,t.isDark(n+1,o+1)&&s++,(0==s||4==s)&&(r+=3)}for(var n=0;n<e;n++)for(var o=0;o<e-6;o++)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(r+=40);for(var o=0;o<e;o++)for(var n=0;n<e-6;n++)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(r+=40);for(var f=0,o=0;o<e;o++)for(var n=0;n<e;n++)t.isDark(n,o)&&f++;return r+Math.abs(100*f/e/e-50)/5*10}};t.exports=a},59257:function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0});var n=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},o=a(r(74404)),i=r(64090),u=a(i);function a(t){return t&&t.__esModule?t:{default:t}}var c={bgColor:o.default.oneOfType([o.default.object,o.default.string]).isRequired,bgD:o.default.string.isRequired,fgColor:o.default.oneOfType([o.default.object,o.default.string]).isRequired,fgD:o.default.string.isRequired,size:o.default.number.isRequired,title:o.default.string,viewBoxSize:o.default.number.isRequired,xmlns:o.default.string},s=(0,i.forwardRef)(function(t,e){var r=t.bgColor,o=t.bgD,i=t.fgD,a=t.fgColor,c=t.size,s=t.title,f=t.viewBoxSize,h=function(t,e){var r={};for(var n in t)!(e.indexOf(n)>=0)&&Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n]);return r}(t,["bgColor","bgD","fgD","fgColor","size","title","viewBoxSize"]);return u.default.createElement("svg",n({},h,{height:c,ref:e,viewBox:"0 0 "+f+" "+f,width:c}),s?u.default.createElement("title",null,s):null,u.default.createElement("path",{d:o,fill:r}),u.default.createElement("path",{d:i,fill:a}))});s.displayName="QRCodeSvg",s.propTypes=c,s.defaultProps={title:void 0,xmlns:"http://www.w3.org/2000/svg"},e.default=s},22602:function(t,e,r){var n=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},o=f(r(3991)),i=f(r(1438)),u=f(r(74404)),a=r(64090),c=f(a),s=f(r(59257));function f(t){return t&&t.__esModule?t:{default:t}}var h={bgColor:u.default.oneOfType([u.default.object,u.default.string]),fgColor:u.default.oneOfType([u.default.object,u.default.string]),level:u.default.string,size:u.default.number,value:u.default.string.isRequired},l=(0,a.forwardRef)(function(t,e){var r=t.bgColor,u=t.fgColor,a=t.level,f=t.size,h=t.value,l=function(t,e){var r={};for(var n in t)!(e.indexOf(n)>=0)&&Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n]);return r}(t,["bgColor","fgColor","level","size","value"]),d=new o.default(-1,i.default[a]);d.addData(h),d.make();var p=d.modules;return c.default.createElement(s.default,n({},l,{bgColor:r,bgD:p.map(function(t,e){return t.map(function(t,r){return t?"":"M "+r+" "+e+" l 1 0 0 1 -1 0 Z"}).join(" ")}).join(" "),fgColor:u,fgD:p.map(function(t,e){return t.map(function(t,r){return t?"M "+r+" "+e+" l 1 0 0 1 -1 0 Z":""}).join(" ")}).join(" "),ref:e,size:f,viewBoxSize:p.length}))});l.displayName="QRCode",l.propTypes=h,l.defaultProps={bgColor:"#FFFFFF",fgColor:"#000000",level:"L",size:256},e.ZP=l}}]);