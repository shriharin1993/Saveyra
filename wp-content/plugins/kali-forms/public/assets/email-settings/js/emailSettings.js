!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=2)}([function(e,t,r){var n=r(3),o=r(4),a=r(5),i=r(6);e.exports=function(e){return n(e)||o(e)||a(e)||i()}},function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}},function(e,t,r){"use strict";r.r(t);var n=r(0),o=r.n(n),a=(r(7),wp.i18n.__),i={mailgun:{host:"smtp.mailgun.org",port:587,ssl:"STARTTLS",authentication:!0},mandrill:{host:"smtp.mandrillapp.com",port:587,ssl:"TLS",authentication:!0},sendgrid:{host:"smtp.sendgrid.net",port:587,ssl:"TLS",authentication:!0},gmail:{host:"smtp.gmail.com",port:587,ssl:"TLS",authentication:!0}},l=["#kaliforms_smtp_host","#kaliforms_smtp_auth","#kaliforms_smtp_port","#kaliforms_smtp_secure"];document.getElementById("kaliforms_smtp_advanced").addEventListener("click",(function(e){c(e.target.checked)})),document.getElementById("kaliforms_email_fail_log").addEventListener("click",(function(e){var t=document.getElementById("kaliforms_fail_log");if(e.target.checked||null===t||(t.style.display="none"),e.target.checked&&null!==t&&(t.style.display=""),null===t&&null===document.getElementById("kaliforms-log-notice")){var r=document.createElement("span");r.setAttribute("id","kaliforms-log-notice"),r.setAttribute("style","color: red");var n=document.createTextNode(a("Log will appear after page refresh if this is checked","kaliforms"));r.appendChild(n),e.target.parentElement.appendChild(r)}}));var c=function(e){o()(document.querySelectorAll("#kaliforms-email-settings-page .advanced")).map((function(t){e?t.classList.remove("hidden"):t.classList.add("hidden")}))},s=document.querySelectorAll(".email-settings-import");o()(s).map((function(e){return e.addEventListener("click",(function(t){t.preventDefault(),o()(s).map((function(e){return e.classList.remove("active")})),e.classList.add("active");var r=t.target.getAttribute("data-predefined-option");if("phpmailer"===r)return document.getElementById("kaliforms_smtp_advanced").checked=!0,document.getElementById("kaliforms_smtp_provider").value=r,void c(!0);i.hasOwnProperty(r)&&(document.getElementById("kaliforms_smtp_advanced").checked=!1,c(!1),l.map((function(e){switch(e){case"#kaliforms_smtp_host":document.querySelector(e).value=i[r].host;break;case"#kaliforms_smtp_auth":document.querySelector(e).checked=i[r].authentication;break;case"#kaliforms_smtp_port":document.querySelector(e).value=i[r].port;break;case"#kaliforms_smtp_secure":document.querySelector(e).value=i[r].ssl}}))),document.getElementById("kaliforms_smtp_provider").value=r}))}));var u=document.getElementById("kf-mail-log-clear");null!==u&&u.addEventListener("click",(function(e){e.preventDefault();var t={nonce:KaliFormsGeneralObject.ajax_nonce};jQuery.ajax({type:"POST",data:{action:"kaliforms_clear_log",args:t},dataType:"json",url:ajaxurl,success:function(e){e.success&&location.reload()}})}))},function(e,t,r){var n=r(1);e.exports=function(e){if(Array.isArray(e))return n(e)}},function(e,t){e.exports=function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},function(e,t,r){var n=r(1);e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(e,t){}]);