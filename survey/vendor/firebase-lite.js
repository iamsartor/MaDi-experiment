/* Firebase JS SDK 11.10.0 (app + firestore/lite), Apache-2.0. Built by tools/build_firebase_bundle.sh */
var hn=()=>{};var pn=function(t){let e=[],n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},Cr=function(t){let e=[],n=0,r=0;for(;n<t.length;){let i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){let s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){let s=t[n++],c=t[n++],p=t[n++],m=((i&7)<<18|(s&63)<<12|(c&63)<<6|p&63)-65536;e[r++]=String.fromCharCode(55296+(m>>10)),e[r++]=String.fromCharCode(56320+(m&1023))}else{let s=t[n++],c=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|c&63)}}return e.join("")},mn={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();let n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){let s=t[i],c=i+1<t.length,p=c?t[i+1]:0,m=i+2<t.length,g=m?t[i+2]:0,T=s>>2,b=(s&3)<<4|p>>4,_=(p&15)<<2|g>>6,C=g&63;m||(C=64,c||(_=64)),r.push(n[T],n[b],n[_],n[C])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(pn(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Cr(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();let n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){let s=n[t.charAt(i++)],p=i<t.length?n[t.charAt(i)]:0;++i;let g=i<t.length?n[t.charAt(i)]:64;++i;let b=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||p==null||g==null||b==null)throw new Ye;let _=s<<2|p>>4;if(r.push(_),g!==64){let C=p<<4&240|g>>2;if(r.push(C),b!==64){let V=g<<6&192|b;r.push(V)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}},Ye=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},kr=function(t){let e=pn(t);return mn.encodeByteArray(e,!0)},_e=function(t){return kr(t).replace(/\./g,"")},gn=function(t){try{return mn.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function Or(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var xr=()=>Or().__FIREBASE_DEFAULTS__,Nr=()=>{if(typeof process>"u"||typeof process.env>"u")return;let t=process.env.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Fr=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=t&&gn(t[1]);return e&&JSON.parse(e)},_n=()=>{try{return hn()||xr()||Nr()||Fr()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Mr=t=>{var e,n;return(n=(e=_n())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},yn=t=>{let e=Mr(t);if(!e)return;let n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);let r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},Xe=()=>{var t;return(t=_n())===null||t===void 0?void 0:t.config};var Pe=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}};function Re(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function wn(t){return(await fetch(t,{credentials:"include"})).ok}function vn(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");let c=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[_e(JSON.stringify(n)),_e(JSON.stringify(c)),""].join(".")}var ge={};function Br(){let t={prod:[],emulator:[]};for(let e of Object.keys(ge))ge[e]?t.emulator.push(e):t.prod.push(e);return t}function Lr(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}var dn=!1;function bn(t,e){if(typeof window>"u"||typeof document>"u"||!Re(window.location.host)||ge[t]===e||ge[t]||dn)return;ge[t]=e;function n(_){return`__firebase__banner__${_}`}let r="__firebase__banner",s=Br().prod.length>0;function c(){let _=document.getElementById(r);_&&_.remove()}function p(_){_.style.display="flex",_.style.background="#7faaf0",_.style.position="fixed",_.style.bottom="5px",_.style.left="5px",_.style.padding=".5em",_.style.borderRadius="5px",_.style.alignItems="center"}function m(_,C){_.setAttribute("width","24"),_.setAttribute("id",C),_.setAttribute("height","24"),_.setAttribute("viewBox","0 0 24 24"),_.setAttribute("fill","none"),_.style.marginLeft="-6px"}function g(){let _=document.createElement("span");return _.style.cursor="pointer",_.style.marginLeft="16px",_.style.fontSize="24px",_.innerHTML=" &times;",_.onclick=()=>{dn=!0,c()},_}function T(_,C){_.setAttribute("id",C),_.innerText="Learn more",_.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",_.setAttribute("target","__blank"),_.style.paddingLeft="5px",_.style.textDecoration="underline"}function b(){let _=Lr(r),C=n("text"),V=document.getElementById(C)||document.createElement("span"),R=n("learnmore"),A=document.getElementById(R)||document.createElement("a"),ee=n("preprendIcon"),q=document.getElementById(ee)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(_.created){let j=_.element;p(j),T(A,R);let ie=g();m(q,ee),j.append(q,V,A,ie),document.body.appendChild(j)}s?(V.innerText="Preview backend disconnected.",q.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(q.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,V.innerText="Preview backend running in this workspace."),V.setAttribute("id",C)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",b):b()}function En(){try{return typeof indexedDB=="object"}catch{return!1}}function Tn(){return new Promise((t,e)=>{try{let n=!0,r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}var $r="FirebaseError",U=class t extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=$r,Object.setPrototypeOf(this,t.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ye.prototype.create)}},ye=class{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){let r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],c=s?qr(s,r):"Error",p=`${this.serviceName}: ${c} (${i}).`;return new U(i,p,r)}};function qr(t,e){return t.replace(jr,(n,r)=>{let i=e[r];return i!=null?String(i):`<${r}?>`})}var jr=/\{\$([^}]+)}/g;function oe(t,e){if(t===e)return!0;let n=Object.keys(t),r=Object.keys(e);for(let i of n){if(!r.includes(i))return!1;let s=t[i],c=e[i];if(fn(s)&&fn(c)){if(!oe(s,c))return!1}else if(s!==c)return!1}for(let i of r)if(!n.includes(i))return!1;return!0}function fn(t){return t!==null&&typeof t=="object"}var Ns=4*60*60*1e3;function ae(t){return t&&t._delegate?t._delegate:t}var z=class{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};var ne="[DEFAULT]";var Ze=class{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){let r=new Pe;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;let r=this.normalizeInstanceIdentifier(e?.identifier),i=(n=e?.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(zr(e))try{this.getOrInitializeService({instanceIdentifier:ne})}catch{}for(let[n,r]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(n);try{let s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=ne){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ne){return this.instances.has(e)}getOptions(e=ne){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(let[s,c]of this.instancesDeferred.entries()){let p=this.normalizeInstanceIdentifier(s);r===p&&c.resolve(i)}return i}onInit(e,n){var r;let i=this.normalizeInstanceIdentifier(n),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);let c=this.instances.get(i);return c&&e(c,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){let r=this.onInitCallbacks.get(n);if(r)for(let i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Ur(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=ne){return this.component?this.component.multipleInstances?e:ne:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function Ur(t){return t===ne?void 0:t}function zr(t){return t.instantiationMode==="EAGER"}var De=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let n=new Ze(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}};var Hr=[],E;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(E||(E={}));var Wr={debug:E.DEBUG,verbose:E.VERBOSE,info:E.INFO,warn:E.WARN,error:E.ERROR,silent:E.SILENT},Gr=E.INFO,Kr={[E.DEBUG]:"log",[E.VERBOSE]:"log",[E.INFO]:"info",[E.WARN]:"warn",[E.ERROR]:"error"},Jr=(t,e,...n)=>{if(e<t.logLevel)return;let r=new Date().toISOString(),i=Kr[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},ue=class{constructor(e){this.name=e,this._logLevel=Gr,this._logHandler=Jr,this._userLogHandler=null,Hr.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in E))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Wr[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,E.DEBUG,...e),this._logHandler(this,E.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,E.VERBOSE,...e),this._logHandler(this,E.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,E.INFO,...e),this._logHandler(this,E.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,E.WARN,...e),this._logHandler(this,E.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,E.ERROR,...e),this._logHandler(this,E.ERROR,...e)}};var Qr=(t,e)=>e.some(n=>t instanceof n),An,In;function Yr(){return An||(An=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Xr(){return In||(In=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Sn=new WeakMap,tt=new WeakMap,Vn=new WeakMap,et=new WeakMap,rt=new WeakMap;function Zr(t){let e=new Promise((n,r)=>{let i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",c)},s=()=>{n(B(t.result)),i()},c=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",c)});return e.then(n=>{n instanceof IDBCursor&&Sn.set(n,t)}).catch(()=>{}),rt.set(e,t),e}function ei(t){if(tt.has(t))return;let e=new Promise((n,r)=>{let i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",c),t.removeEventListener("abort",c)},s=()=>{n(),i()},c=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",c),t.addEventListener("abort",c)});tt.set(t,e)}var nt={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return tt.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Vn.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return B(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Pn(t){nt=t(nt)}function ti(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){let r=t.call(Ce(this),e,...n);return Vn.set(r,e.sort?e.sort():[e]),B(r)}:Xr().includes(t)?function(...e){return t.apply(Ce(this),e),B(Sn.get(this))}:function(...e){return B(t.apply(Ce(this),e))}}function ni(t){return typeof t=="function"?ti(t):(t instanceof IDBTransaction&&ei(t),Qr(t,Yr())?new Proxy(t,nt):t)}function B(t){if(t instanceof IDBRequest)return Zr(t);if(et.has(t))return et.get(t);let e=ni(t);return e!==t&&(et.set(t,e),rt.set(e,t)),e}var Ce=t=>rt.get(t);function Dn(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){let c=indexedDB.open(t,e),p=B(c);return r&&c.addEventListener("upgradeneeded",m=>{r(B(c.result),m.oldVersion,m.newVersion,B(c.transaction),m)}),n&&c.addEventListener("blocked",m=>n(m.oldVersion,m.newVersion,m)),p.then(m=>{s&&m.addEventListener("close",()=>s()),i&&m.addEventListener("versionchange",g=>i(g.oldVersion,g.newVersion,g))}).catch(()=>{}),p}var ri=["get","getKey","getAll","getAllKeys","count"],ii=["put","add","delete","clear"],it=new Map;function Rn(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(it.get(e))return it.get(e);let n=e.replace(/FromIndex$/,""),r=e!==n,i=ii.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||ri.includes(n)))return;let s=async function(c,...p){let m=this.transaction(c,i?"readwrite":"readonly"),g=m.store;return r&&(g=g.index(p.shift())),(await Promise.all([g[n](...p),i&&m.done]))[0]};return it.set(e,s),s}Pn(t=>({...t,get:(e,n,r)=>Rn(e,n)||t.get(e,n,r),has:(e,n)=>!!Rn(e,n)||t.has(e,n)}));var ot=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(si(n)){let r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}};function si(t){let e=t.getComponent();return e?.type==="VERSION"}var at="@firebase/app",Cn="0.13.2";var H=new ue("@firebase/app"),oi="@firebase/app-compat",ai="@firebase/analytics-compat",ui="@firebase/analytics",ci="@firebase/app-check-compat",li="@firebase/app-check",hi="@firebase/auth",di="@firebase/auth-compat",fi="@firebase/database",pi="@firebase/data-connect",mi="@firebase/database-compat",gi="@firebase/functions",_i="@firebase/functions-compat",yi="@firebase/installations",wi="@firebase/installations-compat",vi="@firebase/messaging",bi="@firebase/messaging-compat",Ei="@firebase/performance",Ti="@firebase/performance-compat",Ai="@firebase/remote-config",Ii="@firebase/remote-config-compat",Si="@firebase/storage",Vi="@firebase/storage-compat",Pi="@firebase/firestore",Ri="@firebase/ai",Di="@firebase/firestore-compat",Ci="firebase",ki="11.10.0";var ut="[DEFAULT]",Oi={[at]:"fire-core",[oi]:"fire-core-compat",[ui]:"fire-analytics",[ai]:"fire-analytics-compat",[li]:"fire-app-check",[ci]:"fire-app-check-compat",[hi]:"fire-auth",[di]:"fire-auth-compat",[fi]:"fire-rtdb",[pi]:"fire-data-connect",[mi]:"fire-rtdb-compat",[gi]:"fire-fn",[_i]:"fire-fn-compat",[yi]:"fire-iid",[wi]:"fire-iid-compat",[vi]:"fire-fcm",[bi]:"fire-fcm-compat",[Ei]:"fire-perf",[Ti]:"fire-perf-compat",[Ai]:"fire-rc",[Ii]:"fire-rc-compat",[Si]:"fire-gcs",[Vi]:"fire-gcs-compat",[Pi]:"fire-fst",[Di]:"fire-fst-compat",[Ri]:"fire-vertex","fire-js":"fire-js",[Ci]:"fire-js-all"};var ke=new Map,xi=new Map,ct=new Map;function kn(t,e){try{t.container.addComponent(e)}catch(n){H.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function we(t){let e=t.name;if(ct.has(e))return H.debug(`There were multiple attempts to register component ${e}.`),!1;ct.set(e,t);for(let n of ke.values())kn(n,t);for(let n of xi.values())kn(n,t);return!0}function Fn(t,e){let n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Mn(t){return t==null?!1:t.settings!==void 0}var Ni={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},K=new ye("app","Firebase",Ni);var lt=class{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new z("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw K.create("app-deleted",{appName:this._name})}};var Bn=ki;function Ln(t,e={}){let n=t;typeof e!="object"&&(e={name:e});let r=Object.assign({name:ut,automaticDataCollectionEnabled:!0},e),i=r.name;if(typeof i!="string"||!i)throw K.create("bad-app-name",{appName:String(i)});if(n||(n=Xe()),!n)throw K.create("no-options");let s=ke.get(i);if(s){if(oe(n,s.options)&&oe(r,s.config))return s;throw K.create("duplicate-app",{appName:i})}let c=new De(i);for(let m of ct.values())c.addComponent(m);let p=new lt(n,r,c);return ke.set(i,p),p}function $n(t=ut){let e=ke.get(t);if(!e&&t===ut&&Xe())return Ln();if(!e)throw K.create("no-app",{appName:t});return e}function J(t,e,n){var r;let i=(r=Oi[t])!==null&&r!==void 0?r:t;n&&(i+=`-${n}`);let s=i.match(/\s|\//),c=e.match(/\s|\//);if(s||c){let p=[`Unable to register library "${i}" with version "${e}":`];s&&p.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&c&&p.push("and"),c&&p.push(`version name "${e}" contains illegal characters (whitespace or "/")`),H.warn(p.join(" "));return}we(new z(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}var Fi="firebase-heartbeat-database",Mi=1,ve="firebase-heartbeat-store",st=null;function qn(){return st||(st=Dn(Fi,Mi,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(ve)}catch(n){console.warn(n)}}}}).catch(t=>{throw K.create("idb-open",{originalErrorMessage:t.message})})),st}async function Bi(t){try{let n=(await qn()).transaction(ve),r=await n.objectStore(ve).get(jn(t));return await n.done,r}catch(e){if(e instanceof U)H.warn(e.message);else{let n=K.create("idb-get",{originalErrorMessage:e?.message});H.warn(n.message)}}}async function On(t,e){try{let r=(await qn()).transaction(ve,"readwrite");await r.objectStore(ve).put(e,jn(t)),await r.done}catch(n){if(n instanceof U)H.warn(n.message);else{let r=K.create("idb-set",{originalErrorMessage:n?.message});H.warn(r.message)}}}function jn(t){return`${t.name}!${t.options.appId}`}var Li=1024,$i=30,ht=class{constructor(e){this.container=e,this._heartbeatsCache=null;let n=this.container.getProvider("app").getImmediate();this._storage=new dt(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{let i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=xn();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(c=>c.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>$i){let c=ji(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(c,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){H.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";let n=xn(),{heartbeatsToSend:r,unsentEntries:i}=qi(this._heartbeatsCache.heartbeats),s=_e(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return H.warn(n),""}}};function xn(){return new Date().toISOString().substring(0,10)}function qi(t,e=Li){let n=[],r=t.slice();for(let i of t){let s=n.find(c=>c.agent===i.agent);if(s){if(s.dates.push(i.date),Nn(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Nn(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}var dt=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return En()?Tn().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let n=await Bi(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){let i=await this.read();return On(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){let i=await this.read();return On(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}};function Nn(t){return _e(JSON.stringify({version:2,heartbeats:t})).length}function ji(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}function Ui(t){we(new z("platform-logger",e=>new ot(e),"PRIVATE")),we(new z("heartbeat",e=>new ht(e),"PRIVATE")),J(at,Cn,t),J(at,Cn,"esm2017"),J("fire-js","")}Ui("");var zi="firebase",Hi="11.10.0";J(zi,Hi,"app");var Un=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},zn={};var ft,Wi;(function(){var t;function e(d,o){function u(){}u.prototype=o.prototype,d.D=o.prototype,d.prototype=new u,d.prototype.constructor=d,d.C=function(l,h,f){for(var a=Array(arguments.length-2),te=2;te<arguments.length;te++)a[te-2]=arguments[te];return o.prototype[h].apply(l,a)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(d,o,u){u||(u=0);var l=Array(16);if(typeof o=="string")for(var h=0;16>h;++h)l[h]=o.charCodeAt(u++)|o.charCodeAt(u++)<<8|o.charCodeAt(u++)<<16|o.charCodeAt(u++)<<24;else for(h=0;16>h;++h)l[h]=o[u++]|o[u++]<<8|o[u++]<<16|o[u++]<<24;o=d.g[0],u=d.g[1],h=d.g[2];var f=d.g[3],a=o+(f^u&(h^f))+l[0]+3614090360&4294967295;o=u+(a<<7&4294967295|a>>>25),a=f+(h^o&(u^h))+l[1]+3905402710&4294967295,f=o+(a<<12&4294967295|a>>>20),a=h+(u^f&(o^u))+l[2]+606105819&4294967295,h=f+(a<<17&4294967295|a>>>15),a=u+(o^h&(f^o))+l[3]+3250441966&4294967295,u=h+(a<<22&4294967295|a>>>10),a=o+(f^u&(h^f))+l[4]+4118548399&4294967295,o=u+(a<<7&4294967295|a>>>25),a=f+(h^o&(u^h))+l[5]+1200080426&4294967295,f=o+(a<<12&4294967295|a>>>20),a=h+(u^f&(o^u))+l[6]+2821735955&4294967295,h=f+(a<<17&4294967295|a>>>15),a=u+(o^h&(f^o))+l[7]+4249261313&4294967295,u=h+(a<<22&4294967295|a>>>10),a=o+(f^u&(h^f))+l[8]+1770035416&4294967295,o=u+(a<<7&4294967295|a>>>25),a=f+(h^o&(u^h))+l[9]+2336552879&4294967295,f=o+(a<<12&4294967295|a>>>20),a=h+(u^f&(o^u))+l[10]+4294925233&4294967295,h=f+(a<<17&4294967295|a>>>15),a=u+(o^h&(f^o))+l[11]+2304563134&4294967295,u=h+(a<<22&4294967295|a>>>10),a=o+(f^u&(h^f))+l[12]+1804603682&4294967295,o=u+(a<<7&4294967295|a>>>25),a=f+(h^o&(u^h))+l[13]+4254626195&4294967295,f=o+(a<<12&4294967295|a>>>20),a=h+(u^f&(o^u))+l[14]+2792965006&4294967295,h=f+(a<<17&4294967295|a>>>15),a=u+(o^h&(f^o))+l[15]+1236535329&4294967295,u=h+(a<<22&4294967295|a>>>10),a=o+(h^f&(u^h))+l[1]+4129170786&4294967295,o=u+(a<<5&4294967295|a>>>27),a=f+(u^h&(o^u))+l[6]+3225465664&4294967295,f=o+(a<<9&4294967295|a>>>23),a=h+(o^u&(f^o))+l[11]+643717713&4294967295,h=f+(a<<14&4294967295|a>>>18),a=u+(f^o&(h^f))+l[0]+3921069994&4294967295,u=h+(a<<20&4294967295|a>>>12),a=o+(h^f&(u^h))+l[5]+3593408605&4294967295,o=u+(a<<5&4294967295|a>>>27),a=f+(u^h&(o^u))+l[10]+38016083&4294967295,f=o+(a<<9&4294967295|a>>>23),a=h+(o^u&(f^o))+l[15]+3634488961&4294967295,h=f+(a<<14&4294967295|a>>>18),a=u+(f^o&(h^f))+l[4]+3889429448&4294967295,u=h+(a<<20&4294967295|a>>>12),a=o+(h^f&(u^h))+l[9]+568446438&4294967295,o=u+(a<<5&4294967295|a>>>27),a=f+(u^h&(o^u))+l[14]+3275163606&4294967295,f=o+(a<<9&4294967295|a>>>23),a=h+(o^u&(f^o))+l[3]+4107603335&4294967295,h=f+(a<<14&4294967295|a>>>18),a=u+(f^o&(h^f))+l[8]+1163531501&4294967295,u=h+(a<<20&4294967295|a>>>12),a=o+(h^f&(u^h))+l[13]+2850285829&4294967295,o=u+(a<<5&4294967295|a>>>27),a=f+(u^h&(o^u))+l[2]+4243563512&4294967295,f=o+(a<<9&4294967295|a>>>23),a=h+(o^u&(f^o))+l[7]+1735328473&4294967295,h=f+(a<<14&4294967295|a>>>18),a=u+(f^o&(h^f))+l[12]+2368359562&4294967295,u=h+(a<<20&4294967295|a>>>12),a=o+(u^h^f)+l[5]+4294588738&4294967295,o=u+(a<<4&4294967295|a>>>28),a=f+(o^u^h)+l[8]+2272392833&4294967295,f=o+(a<<11&4294967295|a>>>21),a=h+(f^o^u)+l[11]+1839030562&4294967295,h=f+(a<<16&4294967295|a>>>16),a=u+(h^f^o)+l[14]+4259657740&4294967295,u=h+(a<<23&4294967295|a>>>9),a=o+(u^h^f)+l[1]+2763975236&4294967295,o=u+(a<<4&4294967295|a>>>28),a=f+(o^u^h)+l[4]+1272893353&4294967295,f=o+(a<<11&4294967295|a>>>21),a=h+(f^o^u)+l[7]+4139469664&4294967295,h=f+(a<<16&4294967295|a>>>16),a=u+(h^f^o)+l[10]+3200236656&4294967295,u=h+(a<<23&4294967295|a>>>9),a=o+(u^h^f)+l[13]+681279174&4294967295,o=u+(a<<4&4294967295|a>>>28),a=f+(o^u^h)+l[0]+3936430074&4294967295,f=o+(a<<11&4294967295|a>>>21),a=h+(f^o^u)+l[3]+3572445317&4294967295,h=f+(a<<16&4294967295|a>>>16),a=u+(h^f^o)+l[6]+76029189&4294967295,u=h+(a<<23&4294967295|a>>>9),a=o+(u^h^f)+l[9]+3654602809&4294967295,o=u+(a<<4&4294967295|a>>>28),a=f+(o^u^h)+l[12]+3873151461&4294967295,f=o+(a<<11&4294967295|a>>>21),a=h+(f^o^u)+l[15]+530742520&4294967295,h=f+(a<<16&4294967295|a>>>16),a=u+(h^f^o)+l[2]+3299628645&4294967295,u=h+(a<<23&4294967295|a>>>9),a=o+(h^(u|~f))+l[0]+4096336452&4294967295,o=u+(a<<6&4294967295|a>>>26),a=f+(u^(o|~h))+l[7]+1126891415&4294967295,f=o+(a<<10&4294967295|a>>>22),a=h+(o^(f|~u))+l[14]+2878612391&4294967295,h=f+(a<<15&4294967295|a>>>17),a=u+(f^(h|~o))+l[5]+4237533241&4294967295,u=h+(a<<21&4294967295|a>>>11),a=o+(h^(u|~f))+l[12]+1700485571&4294967295,o=u+(a<<6&4294967295|a>>>26),a=f+(u^(o|~h))+l[3]+2399980690&4294967295,f=o+(a<<10&4294967295|a>>>22),a=h+(o^(f|~u))+l[10]+4293915773&4294967295,h=f+(a<<15&4294967295|a>>>17),a=u+(f^(h|~o))+l[1]+2240044497&4294967295,u=h+(a<<21&4294967295|a>>>11),a=o+(h^(u|~f))+l[8]+1873313359&4294967295,o=u+(a<<6&4294967295|a>>>26),a=f+(u^(o|~h))+l[15]+4264355552&4294967295,f=o+(a<<10&4294967295|a>>>22),a=h+(o^(f|~u))+l[6]+2734768916&4294967295,h=f+(a<<15&4294967295|a>>>17),a=u+(f^(h|~o))+l[13]+1309151649&4294967295,u=h+(a<<21&4294967295|a>>>11),a=o+(h^(u|~f))+l[4]+4149444226&4294967295,o=u+(a<<6&4294967295|a>>>26),a=f+(u^(o|~h))+l[11]+3174756917&4294967295,f=o+(a<<10&4294967295|a>>>22),a=h+(o^(f|~u))+l[2]+718787259&4294967295,h=f+(a<<15&4294967295|a>>>17),a=u+(f^(h|~o))+l[9]+3951481745&4294967295,d.g[0]=d.g[0]+o&4294967295,d.g[1]=d.g[1]+(h+(a<<21&4294967295|a>>>11))&4294967295,d.g[2]=d.g[2]+h&4294967295,d.g[3]=d.g[3]+f&4294967295}r.prototype.u=function(d,o){o===void 0&&(o=d.length);for(var u=o-this.blockSize,l=this.B,h=this.h,f=0;f<o;){if(h==0)for(;f<=u;)i(this,d,f),f+=this.blockSize;if(typeof d=="string"){for(;f<o;)if(l[h++]=d.charCodeAt(f++),h==this.blockSize){i(this,l),h=0;break}}else for(;f<o;)if(l[h++]=d[f++],h==this.blockSize){i(this,l),h=0;break}}this.h=h,this.o+=o},r.prototype.v=function(){var d=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);d[0]=128;for(var o=1;o<d.length-8;++o)d[o]=0;var u=8*this.o;for(o=d.length-8;o<d.length;++o)d[o]=u&255,u/=256;for(this.u(d),d=Array(16),o=u=0;4>o;++o)for(var l=0;32>l;l+=8)d[u++]=this.g[o]>>>l&255;return d};function s(d,o){var u=p;return Object.prototype.hasOwnProperty.call(u,d)?u[d]:u[d]=o(d)}function c(d,o){this.h=o;for(var u=[],l=!0,h=d.length-1;0<=h;h--){var f=d[h]|0;l&&f==o||(u[h]=f,l=!1)}this.g=u}var p={};function m(d){return-128<=d&&128>d?s(d,function(o){return new c([o|0],0>o?-1:0)}):new c([d|0],0>d?-1:0)}function g(d){if(isNaN(d)||!isFinite(d))return b;if(0>d)return A(g(-d));for(var o=[],u=1,l=0;d>=u;l++)o[l]=d/u|0,u*=4294967296;return new c(o,0)}function T(d,o){if(d.length==0)throw Error("number format error: empty string");if(o=o||10,2>o||36<o)throw Error("radix out of range: "+o);if(d.charAt(0)=="-")return A(T(d.substring(1),o));if(0<=d.indexOf("-"))throw Error('number format error: interior "-" character');for(var u=g(Math.pow(o,8)),l=b,h=0;h<d.length;h+=8){var f=Math.min(8,d.length-h),a=parseInt(d.substring(h,h+f),o);8>f?(f=g(Math.pow(o,f)),l=l.j(f).add(g(a))):(l=l.j(u),l=l.add(g(a)))}return l}var b=m(0),_=m(1),C=m(16777216);t=c.prototype,t.m=function(){if(R(this))return-A(this).m();for(var d=0,o=1,u=0;u<this.g.length;u++){var l=this.i(u);d+=(0<=l?l:4294967296+l)*o,o*=4294967296}return d},t.toString=function(d){if(d=d||10,2>d||36<d)throw Error("radix out of range: "+d);if(V(this))return"0";if(R(this))return"-"+A(this).toString(d);for(var o=g(Math.pow(d,6)),u=this,l="";;){var h=ie(u,o).g;u=ee(u,h.j(o));var f=((0<u.g.length?u.g[0]:u.h)>>>0).toString(d);if(u=h,V(u))return f+l;for(;6>f.length;)f="0"+f;l=f+l}},t.i=function(d){return 0>d?0:d<this.g.length?this.g[d]:this.h};function V(d){if(d.h!=0)return!1;for(var o=0;o<d.g.length;o++)if(d.g[o]!=0)return!1;return!0}function R(d){return d.h==-1}t.l=function(d){return d=ee(this,d),R(d)?-1:V(d)?0:1};function A(d){for(var o=d.g.length,u=[],l=0;l<o;l++)u[l]=~d.g[l];return new c(u,~d.h).add(_)}t.abs=function(){return R(this)?A(this):this},t.add=function(d){for(var o=Math.max(this.g.length,d.g.length),u=[],l=0,h=0;h<=o;h++){var f=l+(this.i(h)&65535)+(d.i(h)&65535),a=(f>>>16)+(this.i(h)>>>16)+(d.i(h)>>>16);l=a>>>16,f&=65535,a&=65535,u[h]=a<<16|f}return new c(u,u[u.length-1]&-2147483648?-1:0)};function ee(d,o){return d.add(A(o))}t.j=function(d){if(V(this)||V(d))return b;if(R(this))return R(d)?A(this).j(A(d)):A(A(this).j(d));if(R(d))return A(this.j(A(d)));if(0>this.l(C)&&0>d.l(C))return g(this.m()*d.m());for(var o=this.g.length+d.g.length,u=[],l=0;l<2*o;l++)u[l]=0;for(l=0;l<this.g.length;l++)for(var h=0;h<d.g.length;h++){var f=this.i(l)>>>16,a=this.i(l)&65535,te=d.i(h)>>>16,ln=d.i(h)&65535;u[2*l+2*h]+=a*ln,q(u,2*l+2*h),u[2*l+2*h+1]+=f*ln,q(u,2*l+2*h+1),u[2*l+2*h+1]+=a*te,q(u,2*l+2*h+1),u[2*l+2*h+2]+=f*te,q(u,2*l+2*h+2)}for(l=0;l<o;l++)u[l]=u[2*l+1]<<16|u[2*l];for(l=o;l<2*o;l++)u[l]=0;return new c(u,0)};function q(d,o){for(;(d[o]&65535)!=d[o];)d[o+1]+=d[o]>>>16,d[o]&=65535,o++}function j(d,o){this.g=d,this.h=o}function ie(d,o){if(V(o))throw Error("division by zero");if(V(d))return new j(b,b);if(R(d))return o=ie(A(d),o),new j(A(o.g),A(o.h));if(R(o))return o=ie(d,A(o)),new j(A(o.g),o.h);if(30<d.g.length){if(R(d)||R(o))throw Error("slowDivide_ only works with positive integers.");for(var u=_,l=o;0>=l.l(d);)u=cn(u),l=cn(l);var h=se(u,1),f=se(l,1);for(l=se(l,2),u=se(u,2);!V(l);){var a=f.add(l);0>=a.l(d)&&(h=h.add(u),f=a),l=se(l,1),u=se(u,1)}return o=ee(d,h.j(o)),new j(h,o)}for(h=b;0<=d.l(o);){for(u=Math.max(1,Math.floor(d.m()/o.m())),l=Math.ceil(Math.log(u)/Math.LN2),l=48>=l?1:Math.pow(2,l-48),f=g(u),a=f.j(o);R(a)||0<a.l(d);)u-=l,f=g(u),a=f.j(o);V(f)&&(f=_),h=h.add(f),d=ee(d,a)}return new j(h,d)}t.A=function(d){return ie(this,d).h},t.and=function(d){for(var o=Math.max(this.g.length,d.g.length),u=[],l=0;l<o;l++)u[l]=this.i(l)&d.i(l);return new c(u,this.h&d.h)},t.or=function(d){for(var o=Math.max(this.g.length,d.g.length),u=[],l=0;l<o;l++)u[l]=this.i(l)|d.i(l);return new c(u,this.h|d.h)},t.xor=function(d){for(var o=Math.max(this.g.length,d.g.length),u=[],l=0;l<o;l++)u[l]=this.i(l)^d.i(l);return new c(u,this.h^d.h)};function cn(d){for(var o=d.g.length+1,u=[],l=0;l<o;l++)u[l]=d.i(l)<<1|d.i(l-1)>>>31;return new c(u,d.h)}function se(d,o){var u=o>>5;o%=32;for(var l=d.g.length-u,h=[],f=0;f<l;f++)h[f]=0<o?d.i(f+u)>>>o|d.i(f+u+1)<<32-o:d.i(f+u);return new c(h,d.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Wi=zn.Md5=r,c.prototype.add=c.prototype.add,c.prototype.multiply=c.prototype.j,c.prototype.modulo=c.prototype.A,c.prototype.compare=c.prototype.l,c.prototype.toNumber=c.prototype.m,c.prototype.toString=c.prototype.toString,c.prototype.getBits=c.prototype.i,c.fromNumber=g,c.fromString=T,ft=zn.Integer=c}).apply(typeof Un<"u"?Un:typeof self<"u"?self:typeof window<"u"?window:{});var Hn="4.8.0";var P=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};P.UNAUTHENTICATED=new P(null),P.GOOGLE_CREDENTIALS=new P("google-credentials-uid"),P.FIRST_PARTY=new P("first-party-uid"),P.MOCK_USER=new P("mock-user");var me="11.10.0";var le=new ue("@firebase/firestore");function xe(t,...e){if(le.logLevel<=E.DEBUG){let n=e.map(sn);le.debug(`Firestore (${me}): ${t}`,...n)}}function rn(t,...e){if(le.logLevel<=E.ERROR){let n=e.map(sn);le.error(`Firestore (${me}): ${t}`,...n)}}function sr(t,...e){if(le.logLevel<=E.WARN){let n=e.map(sn);le.warn(`Firestore (${me}): ${t}`,...n)}}function sn(t){if(typeof t=="string")return t;try{return function(n){return JSON.stringify(n)}(t)}catch{return t}}function I(t,e,n){let r="Unexpected state";typeof e=="string"?r=e:n=e,or(t,r,n)}function or(t,e,n){let r=`FIRESTORE (${me}) INTERNAL ASSERTION FAILED: ${e} (ID: ${t.toString(16)})`;if(n!==void 0)try{r+=" CONTEXT: "+JSON.stringify(n)}catch{r+=" CONTEXT: "+n}throw rn(r),new Error(r)}function N(t,e,n,r){let i="Unexpected state";typeof n=="string"?i=n:r=n,t||or(e,i,r)}function ar(t,e){return t}var Wn="ok",Gi="cancelled",be="unknown",w="invalid-argument",Ki="deadline-exceeded",Ji="not-found";var Qi="permission-denied",_t="unauthenticated",Yi="resource-exhausted",he="failed-precondition",Xi="aborted",Zi="out-of-range",es="unimplemented",ts="internal",ns="unavailable";var y=class extends U{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};var Ne=class{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}},yt=class{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(P.UNAUTHENTICATED))}shutdown(){}},wt=class{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}},vt=class{constructor(e){this.auth=null,e.onInit(n=>{this.auth=n})}getToken(){return this.auth?this.auth.getToken().then(e=>e?(N(typeof e.accessToken=="string",42297,{t:e}),new Ne(e.accessToken,new P(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}},bt=class{constructor(e,n,r){this.i=e,this.o=n,this.u=r,this.type="FirstParty",this.user=P.FIRST_PARTY,this.l=new Map}h(){return this.u?this.u():null}get headers(){this.l.set("X-Goog-AuthUser",this.i);let e=this.h();return e&&this.l.set("Authorization",e),this.o&&this.l.set("X-Goog-Iam-Authorization-Token",this.o),this.l}},Et=class{constructor(e,n,r){this.i=e,this.o=n,this.u=r}getToken(){return Promise.resolve(new bt(this.i,this.o,this.u))}start(e,n){e.enqueueRetryable(()=>n(P.FIRST_PARTY))}shutdown(){}invalidateToken(){}},Fe=class{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}},Tt=class{constructor(e,n){this.m=n,this.appCheck=null,this.T=null,Mn(e)&&e.settings.appCheckToken&&(this.T=e.settings.appCheckToken),n.onInit(r=>{this.appCheck=r})}getToken(){return this.T?Promise.resolve(new Fe(this.T)):this.appCheck?this.appCheck.getToken().then(e=>e?(N(typeof e.token=="string",3470,{tokenResult:e}),new Fe(e.token)):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}};var At=class{constructor(e,n,r,i,s,c,p,m,g,T){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=c,this.autoDetectLongPolling=p,this.longPollingOptions=m,this.useFetchStreams=g,this.isUsingEmulator=T}},It="(default)",Me=class t{constructor(e,n){this.projectId=e,this.database=n||It}static empty(){return new t("","")}get isDefaultDatabase(){return this.database===It}isEqual(e){return e instanceof t&&e.projectId===this.projectId&&e.database===this.database}};function rs(t){let e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}var St=class{static newId(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516),r="";for(;r.length<20;){let i=rs(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=e.charAt(i[s]%62))}return r}};function M(t,e){return t<e?-1:t>e?1:0}function is(t,e){let n=0;for(;n<t.length&&n<e.length;){let r=t.codePointAt(n),i=e.codePointAt(n);if(r!==i){if(r<128&&i<128)return M(r,i);{let s=new TextEncoder,c=ss(s.encode(Gn(t,n)),s.encode(Gn(e,n)));return c!==0?c:M(r,i)}}n+=r>65535?2:1}return M(t.length,e.length)}function Gn(t,e){return t.codePointAt(e)>65535?t.substring(e,e+2):t.substring(e,e+1)}function ss(t,e){for(let n=0;n<t.length&&n<e.length;++n)if(t[n]!==e[n])return M(t[n],e[n]);return M(t.length,e.length)}function ur(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}var Kn="__name__",Be=class t{constructor(e,n,r){n===void 0?n=0:n>e.length&&I(637,{offset:n,range:e.length}),r===void 0?r=e.length-n:r>e.length-n&&I(1746,{length:r,range:e.length-n}),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return t.comparator(this,e)===0}child(e){let n=this.segments.slice(this.offset,this.limit());return e instanceof t?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){let r=Math.min(e.length,n.length);for(let i=0;i<r;i++){let s=t.compareSegments(e.get(i),n.get(i));if(s!==0)return s}return M(e.length,n.length)}static compareSegments(e,n){let r=t.isNumericId(e),i=t.isNumericId(n);return r&&!i?-1:!r&&i?1:r&&i?t.extractNumericId(e).compare(t.extractNumericId(n)):is(e,n)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return ft.fromString(e.substring(4,e.length-2))}},S=class t extends Be{construct(e,n,r){return new t(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let n=[];for(let r of e){if(r.indexOf("//")>=0)throw new y(w,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new t(n)}static emptyPath(){return new t([])}},os=/^[_a-zA-Z][_a-zA-Z0-9]*$/,re=class t extends Be{construct(e,n,r){return new t(e,n,r)}static isValidIdentifier(e){return os.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),t.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Kn}static keyField(){return new t([Kn])}static fromServerFormat(e){let n=[],r="",i=0,s=()=>{if(r.length===0)throw new y(w,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""},c=!1;for(;i<e.length;){let p=e[i];if(p==="\\"){if(i+1===e.length)throw new y(w,"Path has trailing escape character: "+e);let m=e[i+1];if(m!=="\\"&&m!=="."&&m!=="`")throw new y(w,"Path has invalid escape sequence: "+e);r+=m,i+=2}else p==="`"?(c=!c,i++):p!=="."||c?(r+=p,i++):(s(),i++)}if(s(),c)throw new y(w,"Unterminated ` in path: "+e);return new t(n)}static emptyPath(){return new t([])}};var $=class t{constructor(e){this.path=e}static fromPath(e){return new t(S.fromString(e))}static fromName(e){return new t(S.fromString(e).popFirst(5))}static empty(){return new t(S.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&S.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return S.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new t(new S(e.slice()))}};function cr(t,e,n){if(!n)throw new y(w,`Function ${t}() cannot be called with an empty ${e}.`)}function Jn(t){if(!$.isDocumentKey(t))throw new y(w,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Qn(t){if($.isDocumentKey(t))throw new y(w,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function lr(t){return typeof t=="object"&&t!==null&&(Object.getPrototypeOf(t)===Object.prototype||Object.getPrototypeOf(t)===null)}function on(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{let e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":I(12329,{type:typeof t})}function an(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new y(w,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let n=on(t);throw new y(w,`Expected type '${e.name}', but it was: ${n}`)}}return t}function hr(t){let e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}var Oe=null;function as(){return Oe===null?Oe=function(){return 268435456+Math.round(2147483648*Math.random())}():Oe++,"0x"+Oe.toString(16)}function Le(t){return t===0&&1/t==-1/0}var pt="RestConnection",us={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"},Vt=class{get P(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let n=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.A=n+"://"+e.host,this.R=`projects/${r}/databases/${i}`,this.V=this.databaseId.database===It?`project_id=${r}`:`project_id=${r}&database_id=${i}`}I(e,n,r,i,s){let c=as(),p=this.p(e,n.toUriEncodedString());xe(pt,`Sending RPC '${e}' ${c}:`,p,r);let m={"google-cloud-resource-prefix":this.R,"x-goog-request-params":this.V};this.v(m,i,s);let{host:g}=new URL(p),T=Re(g);return this.F(e,p,m,r,T).then(b=>(xe(pt,`Received RPC '${e}' ${c}: `,b),b),b=>{throw sr(pt,`RPC '${e}' ${c} failed with error: `,b,"url: ",p,"request:",r),b})}D(e,n,r,i,s,c){return this.I(e,n,r,i,s)}v(e,n,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+me}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((i,s)=>e[s]=i),r&&r.headers.forEach((i,s)=>e[s]=i)}p(e,n){let r=us[e];return`${this.A}/v1/${n}:${r}`}terminate(){}};var Yn,v;function Xn(t){if(t===void 0)return rn("RPC_ERROR","HTTP error has no status"),be;switch(t){case 200:return Wn;case 400:return he;case 401:return _t;case 403:return Qi;case 404:return Ji;case 409:return Xi;case 416:return Zi;case 429:return Yi;case 499:return Gi;case 500:return be;case 501:return es;case 503:return ns;case 504:return Ki;default:return t>=200&&t<300?Wn:t>=400&&t<500?he:t>=500&&t<600?ts:be}}(v=Yn||(Yn={}))[v.OK=0]="OK",v[v.CANCELLED=1]="CANCELLED",v[v.UNKNOWN=2]="UNKNOWN",v[v.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",v[v.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",v[v.NOT_FOUND=5]="NOT_FOUND",v[v.ALREADY_EXISTS=6]="ALREADY_EXISTS",v[v.PERMISSION_DENIED=7]="PERMISSION_DENIED",v[v.UNAUTHENTICATED=16]="UNAUTHENTICATED",v[v.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",v[v.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",v[v.ABORTED=10]="ABORTED",v[v.OUT_OF_RANGE=11]="OUT_OF_RANGE",v[v.UNIMPLEMENTED=12]="UNIMPLEMENTED",v[v.INTERNAL=13]="INTERNAL",v[v.UNAVAILABLE=14]="UNAVAILABLE",v[v.DATA_LOSS=15]="DATA_LOSS";var Pt=class extends Vt{S(e,n){throw new Error("Not supported by FetchConnection")}async F(e,n,r,i,s){var c;let p=JSON.stringify(i),m;try{let g={method:"POST",headers:r,body:p};s&&(g.credentials="include"),m=await fetch(n,g)}catch(g){let T=g;throw new y(Xn(T.status),"Request failed with error: "+T.statusText)}if(!m.ok){let g=await m.json();Array.isArray(g)&&(g=g[0]);let T=(c=g?.error)===null||c===void 0?void 0:c.message;throw new y(Xn(m.status),`Request failed with error: ${T??m.statusText}`)}return m.json()}};function Zn(t){let e=0;for(let n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Qe(t,e){for(let n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}var Rt=class extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};var Z=class t{constructor(e){this.binaryString=e}static fromBase64String(e){let n=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new Rt("Invalid base64 string: "+s):s}}(e);return new t(n)}static fromUint8Array(e){let n=function(i){let s="";for(let c=0;c<i.length;++c)s+=String.fromCharCode(i[c]);return s}(e);return new t(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){let r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return M(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};Z.EMPTY_BYTE_STRING=new Z("");var cs=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ae(t){if(N(!!t,39018),typeof t=="string"){let e=0,n=cs.exec(t);if(N(!!n,46558,{timestamp:t}),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}let r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:O(t.seconds),nanos:O(t.nanos)}}function O(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Dt(t){return typeof t=="string"?Z.fromBase64String(t):Z.fromUint8Array(t)}function F(t,e){let n={typeString:t};return e&&(n.value=e),n}function Ve(t,e){if(!lr(t))throw new y(w,"JSON must be an object");let n;for(let r in e)if(e[r]){let i=e[r].typeString,s="value"in e[r]?{value:e[r].value}:void 0;if(!(r in t)){n=`JSON missing required field: '${r}'`;break}let c=t[r];if(i&&typeof c!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(s!==void 0&&c!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new y(w,n);return!0}var er=-62135596800,tr=1e6,x=class t{static now(){return t.fromMillis(Date.now())}static fromDate(e){return t.fromMillis(e.getTime())}static fromMillis(e){let n=Math.floor(e/1e3),r=Math.floor((e-1e3*n)*tr);return new t(n,r)}constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new y(w,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new y(w,"Timestamp nanoseconds out of range: "+n);if(e<er)throw new y(w,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new y(w,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/tr}_compareTo(e){return this.seconds===e.seconds?M(this.nanoseconds,e.nanoseconds):M(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:t._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Ve(e,t._jsonSchema))return new t(e.seconds,e.nanoseconds)}valueOf(){let e=this.seconds-er;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}};x._jsonSchemaVersion="firestore/timestamp/1.0",x._jsonSchema={type:F("string",x._jsonSchemaVersion),seconds:F("number"),nanoseconds:F("number")};function dr(t){var e,n;return((n=(((e=t?.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function fr(t){let e=t.mapValue.fields.__previous_value__;return dr(e)?fr(e):e}function Ct(t){let e=Ae(t.mapValue.fields.__local_write_time__.timestampValue);return new x(e.seconds,e.nanos)}var pr="__type__",ls="__max__";var mr="__vector__",gr="value";function kt(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?dr(t)?4:function(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===ls}(t)?9007199254740991:function(n){var r,i;return((i=(((r=n?.mapValue)===null||r===void 0?void 0:r.fields)||{})[pr])===null||i===void 0?void 0:i.stringValue)===mr}(t)?10:11:I(28295,{value:t})}function Ot(t,e){if(t===e)return!0;let n=kt(t);if(n!==kt(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Ct(t).isEqual(Ct(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;let c=Ae(i.timestampValue),p=Ae(s.timestampValue);return c.seconds===p.seconds&&c.nanos===p.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return Dt(i.bytesValue).isEqual(Dt(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return O(i.geoPointValue.latitude)===O(s.geoPointValue.latitude)&&O(i.geoPointValue.longitude)===O(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return O(i.integerValue)===O(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){let c=O(i.doubleValue),p=O(s.doubleValue);return c===p?Le(c)===Le(p):isNaN(c)&&isNaN(p)}return!1}(t,e);case 9:return ur(t.arrayValue.values||[],e.arrayValue.values||[],Ot);case 10:case 11:return function(i,s){let c=i.mapValue.fields||{},p=s.mapValue.fields||{};if(Zn(c)!==Zn(p))return!1;for(let m in c)if(c.hasOwnProperty(m)&&(p[m]===void 0||!Ot(c[m],p[m])))return!1;return!0}(t,e);default:return I(52216,{left:t})}}function mt(t){return!!t&&"mapValue"in t}function Ee(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){let e={mapValue:{fields:{}}};return Qe(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=Ee(r)),e}if(t.arrayValue){let e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Ee(t.arrayValue.values[n]);return e}return Object.assign({},t)}var k=class t{static fromTimestamp(e){return new t(e)}static min(){return new t(new x(0,0))}static max(){return new t(new x(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}};var xt=class t{constructor(e,n){this.comparator=e,this.root=n||L.EMPTY}insert(e,n){return new t(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,L.BLACK,null,null))}remove(e){return new t(this.comparator,this.root.remove(e,this.comparator).copy(null,null,L.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){let r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){let i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){let e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ce(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ce(this.root,e,this.comparator,!1)}getReverseIterator(){return new ce(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ce(this.root,e,this.comparator,!0)}},ce=class{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},L=class t{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??t.RED,this.left=i??t.EMPTY,this.right=s??t.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new t(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this,s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return t.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return t.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){let e=this.copy(null,null,t.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,t.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw I(43730,{key:this.key,value:this.value});if(this.right.isRed())throw I(14113,{key:this.key,value:this.value});let e=this.left.check();if(e!==this.right.check())throw I(27949);return e+(this.isRed()?0:1)}};L.EMPTY=null,L.RED=!0,L.BLACK=!1;L.EMPTY=new class{constructor(){this.size=0}get key(){throw I(57766)}get value(){throw I(16141)}get color(){throw I(16727)}get left(){throw I(29726)}get right(){throw I(36894)}copy(e,n,r,i,s){return this}insert(e,n,r){return new L(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};var Nt=class t{constructor(e){this.comparator=e,this.data=new xt(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new $e(this.data.getIterator())}getIteratorFrom(e){return new $e(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof t)||this.size!==e.size)return!1;let n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){let i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){let e=[];return this.forEach(n=>{e.push(n)}),e}toString(){let e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){let n=new t(this.comparator);return n.data=e,n}},$e=class{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};var qe=class t{constructor(e){this.fields=e,e.sort(re.comparator)}static empty(){return new t([])}unionWith(e){let n=new Nt(re.comparator);for(let r of this.fields)n=n.add(r);for(let r of e)n=n.add(r);return new t(n.toArray())}covers(e){for(let n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return ur(this.fields,e.fields,(n,r)=>n.isEqual(r))}};var W=class t{constructor(e){this.value=e}static empty(){return new t({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!mt(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ee(n)}setAll(e){let n=re.emptyPath(),r={},i=[];e.forEach((c,p)=>{if(!n.isImmediateParentOf(p)){let m=this.getFieldsMap(n);this.applyChanges(m,r,i),r={},i=[],n=p.popLast()}c?r[p.lastSegment()]=Ee(c):i.push(p.lastSegment())});let s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){let n=this.field(e.popLast());mt(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Ot(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];mt(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){Qe(n,(i,s)=>e[i]=s);for(let i of r)delete e[i]}clone(){return new t(Ee(this.value))}};var je=class t{constructor(e,n,r,i,s,c,p){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=c,this.documentState=p}static newInvalidDocument(e){return new t(e,0,k.min(),k.min(),k.min(),W.empty(),0)}static newFoundDocument(e,n,r,i){return new t(e,1,n,k.min(),r,i,0)}static newNoDocument(e,n){return new t(e,2,n,k.min(),k.min(),W.empty(),0)}static newUnknownDocument(e,n){return new t(e,3,n,k.min(),k.min(),W.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(k.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=W.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=W.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=k.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof t&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new t(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}};var Ft=class{constructor(e,n=null,r=[],i=[],s=null,c="F",p=null,m=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=c,this.startAt=p,this.endAt=m,this.q=null,this.B=null,this.$=null,this.startAt,this.endAt}};function _r(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Le(e)?"-0":e}}function hs(t,e){return function(r){return typeof r=="number"&&Number.isInteger(r)&&!Le(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}(e)?function(r){return{integerValue:""+r}}(e):_r(t,e)}var de=class{constructor(){this._=void 0}},Ue=class extends de{},Mt=class extends de{constructor(e){super(),this.elements=e}},Bt=class extends de{constructor(e){super(),this.elements=e}},Lt=class extends de{constructor(e,n){super(),this.serializer=e,this.k=n}};var $t=class{constructor(e,n){this.field=e,this.transform=n}},qt=class t{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new t}static exists(e){return new t(void 0,e)}static updateTime(e){return new t(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}},fe=class{},ze=class extends fe{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}},He=class extends fe{constructor(e,n,r,i,s=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}},jt=class extends fe{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}},Ut=class extends fe{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}};var zt=class{constructor(e,n){this.databaseId=e,this.useProto3Json=n}};function Ht(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function ds(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function fs(t,e){return Ht(t,e.toTimestamp())}function gt(t){return N(!!t,49232),k.fromTimestamp(function(n){let r=Ae(n);return new x(r.seconds,r.nanos)}(t))}function yr(t,e){return Wt(t,e).canonicalString()}function Wt(t,e){let n=function(i){return new S(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function We(t,e){return yr(t.databaseId,e.path)}function nr(t,e){let n=function(i){let s=S.fromString(i);return N(wr(s),10190,{key:s.toString()}),s}(e);if(n.get(1)!==t.databaseId.projectId)throw new y(w,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new y(w,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new $(function(i){return N(i.length>4&&i.get(4)==="documents",29091,{key:i.toString()}),i.popFirst(5)}(n))}function rr(t,e,n){return{name:We(t,e),fields:n.value.mapValue.fields}}function ps(t,e){return"found"in e?function(r,i){N(!!i.found,43571),i.found.name,i.found.updateTime;let s=nr(r,i.found.name),c=gt(i.found.updateTime),p=i.found.createTime?gt(i.found.createTime):k.min(),m=new W({mapValue:{fields:i.found.fields}});return je.newFoundDocument(s,c,p,m)}(t,e):"missing"in e?function(r,i){N(!!i.missing,3894),N(!!i.readTime,22933);let s=nr(r,i.missing),c=gt(i.readTime);return je.newNoDocument(s,c)}(t,e):I(7234,{result:e})}function ms(t,e){let n;if(e instanceof ze)n={update:rr(t,e.key,e.value)};else if(e instanceof jt)n={delete:We(t,e.key)};else if(e instanceof He)n={update:rr(t,e.key,e.data),updateMask:gs(e.fieldMask)};else{if(!(e instanceof Ut))return I(16599,{L:e.type});n={verify:We(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(s,c){let p=c.transform;if(p instanceof Ue)return{fieldPath:c.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(p instanceof Mt)return{fieldPath:c.field.canonicalString(),appendMissingElements:{values:p.elements}};if(p instanceof Bt)return{fieldPath:c.field.canonicalString(),removeAllFromArray:{values:p.elements}};if(p instanceof Lt)return{fieldPath:c.field.canonicalString(),increment:p.k};throw I(20930,{transform:c.transform})}(0,r))),e.precondition.isNone||(n.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:fs(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:I(27497)}(t,e.precondition)),n}function gs(t){let e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function wr(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}function un(t){return new zt(t,!0)}var Gt=class{},Kt=class extends Gt{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.et=!1}rt(){if(this.et)throw new y(he,"The client has already been terminated.")}I(e,n,r,i){return this.rt(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,c])=>this.connection.I(e,Wt(n,r),i,s,c)).catch(s=>{throw s.name==="FirebaseError"?(s.code===_t&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new y(be,s.toString())})}D(e,n,r,i,s){return this.rt(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([c,p])=>this.connection.D(e,Wt(n,r),i,c,p,s)).catch(c=>{throw c.name==="FirebaseError"?(c.code===_t&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),c):new y(be,c.toString())})}terminate(){this.et=!0,this.connection.terminate()}};async function _s(t,e){let n=ar(t),r={writes:e.map(i=>ms(n.serializer,i))};await n.I("Commit",n.serializer.databaseId,S.emptyPath(),r)}async function ys(t,e){let n=ar(t),r={documents:e.map(p=>We(n.serializer,p))},i=await n.D("BatchGetDocuments",n.serializer.databaseId,S.emptyPath(),r,e.length),s=new Map;i.forEach(p=>{let m=ps(n.serializer,p);s.set(m.key.toString(),m)});let c=[];return e.forEach(p=>{let m=s.get(p.toString());N(!!m,55234,{key:p}),c.push(m)}),c}var vr="ComponentProvider",Te=new Map;function br(t){if(t._terminated)throw new y(he,"The client has already been terminated.");if(!Te.has(t)){xe(vr,"Initializing Datastore");let e=function(s){return new Pt(s)}(function(s,c,p,m){return new At(s,c,p,m.host,m.ssl,m.experimentalForceLongPolling,m.experimentalAutoDetectLongPolling,hr(m.experimentalLongPollingOptions),m.useFetchStreams,m.isUsingEmulator)}(t._databaseId,t.app.options.appId||"",t._persistenceKey,t._freezeSettings())),n=un(t._databaseId),r=function(s,c,p,m){return new Kt(s,c,p,m)}(t._authCredentials,t._appCheckCredentials,e,n);Te.set(t,r)}return Te.get(t)}var ws=1048576,Er="firestore.googleapis.com",ir=!0;var Ge=class{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new y(w,"Can't provide ssl option if host option is not set");this.host=Er,this.ssl=ir}else this.host=e.host,this.ssl=(n=e.ssl)!==null&&n!==void 0?n:ir;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<ws)throw new y(w,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(s,c,p,m){if(c===!0&&m===!0)throw new y(w,`${s} and ${p} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=hr((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new y(w,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new y(w,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new y(w,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}},pe=class{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ge({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new y(he,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new y(he,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ge(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new yt;switch(r.type){case"firstParty":return new Et(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new y(w,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){let r=Te.get(n);r&&(xe(vr,"Removing Datastore"),Te.delete(n),r.terminate())}(this),Promise.resolve()}};function vs(t,e){let n=typeof t=="object"?t:$n(),r=typeof t=="string"?t:e||"(default)",i=Fn(n,"firestore/lite").getImmediate({identifier:r});if(!i._initialized){let s=yn("firestore");s&&Tr(i,...s)}return i}function Tr(t,e,n,r={}){var i;t=an(t,pe);let s=Re(e),c=t._getSettings(),p=Object.assign(Object.assign({},c),{emulatorOptions:t._getEmulatorOptions()}),m=`${e}:${n}`;s&&(wn(`https://${m}`),bn("Firestore",!0)),c.host!==Er&&c.host!==m&&sr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");let g=Object.assign(Object.assign({},c),{host:m,ssl:s,emulatorOptions:r});if(!oe(g,p)&&(t._setSettings(g),r.mockUserToken)){let T,b;if(typeof r.mockUserToken=="string")T=r.mockUserToken,b=P.MOCK_USER;else{T=vn(r.mockUserToken,(i=t._app)===null||i===void 0?void 0:i.options.projectId);let _=r.mockUserToken.sub||r.mockUserToken.user_id;if(!_)throw new y(w,"mockUserToken must contain 'sub' or 'user_id' field!");b=new P(_)}t._authCredentials=new wt(new Ne(T,b))}}var Jt=class t{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new t(this.firestore,e,this._query)}},D=class t{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new G(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new t(this.firestore,e,this._key)}toJSON(){return{type:t._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,n,r){if(Ve(n,t._jsonSchema))return new t(e,r||null,new $(S.fromString(n.referencePath)))}};D._jsonSchemaVersion="firestore/documentReference/1.0",D._jsonSchema={type:F("string",D._jsonSchemaVersion),referencePath:F("string")};var G=class t extends Jt{constructor(e,n,r){super(e,n,function(s){return new Ft(s)}(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new D(this.firestore,null,new $(e))}withConverter(e){return new t(this.firestore,e,this._path)}};function bs(t,e,...n){if(t=ae(t),cr("collection","path",e),t instanceof pe){let r=S.fromString(e,...n);return Qn(r),new G(t,null,r)}{if(!(t instanceof D||t instanceof G))throw new y(w,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=t._path.child(S.fromString(e,...n));return Qn(r),new G(t.firestore,null,r)}}function Ar(t,e,...n){if(t=ae(t),arguments.length===1&&(e=St.newId()),cr("doc","path",e),t instanceof pe){let r=S.fromString(e,...n);return Jn(r),new D(t,null,new $(r))}{if(!(t instanceof D||t instanceof G))throw new y(w,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=t._path.child(S.fromString(e,...n));return Jn(r),new D(t.firestore,t instanceof G?t.converter:null,new $(r))}}var Q=class t{constructor(e){this._byteString=e}static fromBase64String(e){try{return new t(Z.fromBase64String(e))}catch(n){throw new y(w,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new t(Z.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:t._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Ve(e,t._jsonSchema))return t.fromBase64String(e.bytes)}};Q._jsonSchemaVersion="firestore/bytes/1.0",Q._jsonSchema={type:F("string",Q._jsonSchemaVersion),bytes:F("string")};var Ie=class{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new y(w,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new re(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}};var Se=class{constructor(e){this._methodName=e}};var Y=class t{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new y(w,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new y(w,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return M(this._lat,e._lat)||M(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:t._jsonSchemaVersion}}static fromJSON(e){if(Ve(e,t._jsonSchema))return new t(e.latitude,e.longitude)}};Y._jsonSchemaVersion="firestore/geoPoint/1.0",Y._jsonSchema={type:F("string",Y._jsonSchemaVersion),latitude:F("number"),longitude:F("number")};var X=class t{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}toJSON(){return{type:t._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Ve(e,t._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(n=>typeof n=="number"))return new t(e.vectorValues);throw new y(w,"Expected 'vectorValues' field to be a number array")}}};X._jsonSchemaVersion="firestore/vectorValue/1.0",X._jsonSchema={type:F("string",X._jsonSchemaVersion),vectorValues:F("object")};var Es=/^__.*__$/,Qt=class{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new He(e,this.data,this.fieldMask,n,this.fieldTransforms):new ze(e,this.data,n,this.fieldTransforms)}};function Ir(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw I(40011,{it:t})}}var Yt=class t{constructor(e,n,r,i,s,c){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.st(),this.fieldTransforms=s||[],this.fieldMask=c||[]}get path(){return this.settings.path}get it(){return this.settings.it}ot(e){return new t(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}ut(e){var n;let r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.ot({path:r,_t:!1});return i.ct(e),i}lt(e){var n;let r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.ot({path:r,_t:!1});return i.st(),i}ht(e){return this.ot({path:void 0,_t:!0})}ft(e){return Ke(e,this.settings.methodName,this.settings.dt||!1,this.path,this.settings.Et)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}st(){if(this.path)for(let e=0;e<this.path.length;e++)this.ct(this.path.get(e))}ct(e){if(e.length===0)throw this.ft("Document fields must not be empty");if(Ir(this.it)&&Es.test(e))throw this.ft('Document fields cannot begin and end with "__"')}},Xt=class{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||un(e)}Tt(e,n,r,i=!1){return new Yt({it:e,methodName:n,Et:r,path:re.emptyPath(),_t:!1,dt:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}};function Ts(t){let e=t._freezeSettings(),n=un(t._databaseId);return new Xt(t._databaseId,!!e.ignoreUndefinedProperties,n)}function As(t,e,n,r,i,s={}){let c=t.Tt(s.merge||s.mergeFields?2:0,e,n,i);Rr("Data must be an object, but it was:",c,r);let p=Vr(r,c),m,g;if(s.merge)m=new qe(c.fieldMask),g=c.fieldTransforms;else if(s.mergeFields){let T=[];for(let b of s.mergeFields){let _=Is(e,b,n);if(!c.contains(_))throw new y(w,`Field '${_}' is specified in your field mask but missing from your input data.`);Vs(T,_)||T.push(_)}m=new qe(T),g=c.fieldTransforms.filter(b=>m.covers(b.field))}else m=null,g=c.fieldTransforms;return new Qt(new W(p),m,g)}var Zt=class t extends Se{_toFieldTransform(e){return new $t(e.path,new Ue)}isEqual(e){return e instanceof t}};function Sr(t,e){if(Pr(t=ae(t)))return Rr("Unsupported field value:",e,t),Vr(t,e);if(t instanceof Se)return function(r,i){if(!Ir(i.it))throw i.ft(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.ft(`${r._methodName}() is not currently supported inside arrays`);let s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings._t&&e.it!==4)throw e.ft("Nested arrays are not supported");return function(r,i){let s=[],c=0;for(let p of r){let m=Sr(p,i.ht(c));m==null&&(m={nullValue:"NULL_VALUE"}),s.push(m),c++}return{arrayValue:{values:s}}}(t,e)}return function(r,i){if((r=ae(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return hs(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){let s=x.fromDate(r);return{timestampValue:Ht(i.serializer,s)}}if(r instanceof x){let s=new x(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Ht(i.serializer,s)}}if(r instanceof Y)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Q)return{bytesValue:ds(i.serializer,r._byteString)};if(r instanceof D){let s=i.databaseId,c=r.firestore._databaseId;if(!c.isEqual(s))throw i.ft(`Document reference is for database ${c.projectId}/${c.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:yr(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof X)return function(c,p){return{mapValue:{fields:{[pr]:{stringValue:mr},[gr]:{arrayValue:{values:c.toArray().map(g=>{if(typeof g!="number")throw p.ft("VectorValues must only contain numeric values.");return _r(p.serializer,g)})}}}}}}(r,i);throw i.ft(`Unsupported field value: ${on(r)}`)}(t,e)}function Vr(t,e){let n={};return function(i){for(let s in i)if(Object.prototype.hasOwnProperty.call(i,s))return!1;return!0}(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Qe(t,(r,i)=>{let s=Sr(i,e.ut(r));s!=null&&(n[r]=s)}),{mapValue:{fields:n}}}function Pr(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof x||t instanceof Y||t instanceof Q||t instanceof D||t instanceof Se||t instanceof X)}function Rr(t,e,n){if(!Pr(n)||!lr(n)){let r=on(n);throw r==="an object"?e.ft(t+" a custom object"):e.ft(t+" "+r)}}function Is(t,e,n){if((e=ae(e))instanceof Ie)return e._internalPath;if(typeof e=="string")return Dr(t,e);throw Ke("Field path arguments must be of type string or ",t,!1,void 0,n)}var Ss=new RegExp("[~\\*/\\[\\]]");function Dr(t,e,n){if(e.search(Ss)>=0)throw Ke(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Ie(...e.split("."))._internalPath}catch{throw Ke(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Ke(t,e,n,r,i){let s=r&&!r.isEmpty(),c=i!==void 0,p=`Function ${e}() called with invalid data`;n&&(p+=" (via `toFirestore()`)"),p+=". ";let m="";return(s||c)&&(m+=" (found",s&&(m+=` in field ${r}`),c&&(m+=` in document ${i}`),m+=")"),new y(w,p+t+m)}function Vs(t,e){return t.some(n=>n.isEqual(e))}var Je=class{constructor(e,n,r,i,s){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new D(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){let e=new en(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){let n=this._document.data.field(Ps("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}},en=class extends Je{data(){return super.data()}};function Ps(t,e){return typeof e=="string"?Dr(t,e):e instanceof Ie?e._internalPath:e._delegate._internalPath}var tn=class{convertValue(e,n="none"){switch(kt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return O(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Dt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw I(62114,{value:e})}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){let r={};return Qe(e,(i,s)=>{r[i]=this.convertValue(s,n)}),r}convertVectorValue(e){var n,r,i;let s=(i=(r=(n=e.fields)===null||n===void 0?void 0:n[gr].arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(c=>O(c.doubleValue));return new X(s)}convertGeoPoint(e){return new Y(O(e.latitude),O(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":let r=fr(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(Ct(e));default:return null}}convertTimestamp(e){let n=Ae(e);return new x(n.seconds,n.nanos)}convertDocumentKey(e,n){let r=S.fromString(e);N(wr(r),9688,{name:e});let i=new Me(r.get(1),r.get(3)),s=new $(r.popFirst(5));return i.isEqual(n)||rn(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),s}};function Rs(t,e,n){let r;return r=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,r}var nn=class extends tn{constructor(e){super(),this.firestore=e}convertBytes(e){return new Q(e)}convertReference(e){let n=this.convertDocumentKey(e,this.firestore._databaseId);return new D(this.firestore,null,n)}};function Ds(t){let e=br((t=an(t,D)).firestore),n=new nn(t.firestore);return ys(e,[t._key]).then(r=>{N(r.length===1,15618);let i=r[0];return new Je(t.firestore,n,t._key,i.isFoundDocument()?i:null,t.converter)})}function Cs(t,e){let n=Ar(t=an(t,G)),r=Rs(t.converter,e),i=As(Ts(t.firestore),"addDoc",n._key,r,n.converter!==null,{});return _s(br(t.firestore),[i.toMutation(n._key,qt.exists(!1))]).then(()=>n)}function ks(){return new Zt("serverTimestamp")}(function(){(function(n){me=n})(`${Bn}_lite`),we(new z("firestore/lite",(e,{instanceIdentifier:n,options:r})=>{let i=e.getProvider("app").getImmediate(),s=new pe(new vt(e.getProvider("auth-internal")),new Tt(i,e.getProvider("app-check-internal")),function(p,m){if(!Object.prototype.hasOwnProperty.apply(p.options,["projectId"]))throw new y(w,'"projectId" not provided in firebase.initializeApp.');return new Me(p.options.projectId,m)}(i,n),i);return r&&s._setSettings(r),s},"PUBLIC").setMultipleInstances(!0)),J("firestore-lite",Hn,""),J("firestore-lite",Hn,"esm2017")})();export{Cs as addDoc,bs as collection,Tr as connectFirestoreEmulator,Ar as doc,Ds as getDoc,vs as getFirestore,Ln as initializeApp,ks as serverTimestamp};
/*! Bundled license information:

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
  * @license
  * Copyright 2020 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
  * @license
  * Copyright 2017 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
