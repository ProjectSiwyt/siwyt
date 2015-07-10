var BaasBox=function(){function i(){var e=new Object("I am the BaasBox instance");return e}function s(e){if(e===null){return}this.user=e;if(window.Zepto&&window.localStorage){window.localStorage.setItem(r,JSON.stringify(this.user))}else{$.cookie(r,JSON.stringify(this.user))}}function o(){if(window.Zepto&&window.localStorage){if(localStorage.getItem(r)){this.user=JSON.parse(localStorage.getItem(r))}}else{if($.cookie(r)){this.user=JSON.parse($.cookie(r))}}return this.user}function u(){var e=new $.Deferred;var t={};t.success=function(e){t.then(function(t){e(t)});return t};t.error=function(e){t.then(null,function(t){e(t)});return t};e.promise(t);return e}var e;var t;var n;var r="baasbox-cookie";if(window.Zepto){$.ajaxSettings.global=true;$.ajaxSettings.beforeSend=function(e,t){if(BaasBox.getCurrentUser()){e.setRequestHeader("X-BB-SESSION",BaasBox.getCurrentUser().token)}e.setRequestHeader("X-BAASBOX-APPCODE",BaasBox.appcode)}}else{$.ajaxSetup({global:true,beforeSend:function(e,t){if(BaasBox.getCurrentUser()){e.setRequestHeader("X-BB-SESSION",BaasBox.getCurrentUser().token)}e.setRequestHeader("X-BAASBOX-APPCODE",BaasBox.appcode)}})}return{appcode:"",pagelength:50,timeout:2e4,version:"0.9.0",READ_PERMISSION:"read",DELETE_PERMISSION:"delete",UPDATE_PERMISSION:"update",ALL_PERMISSION:"all",ANONYMOUS_ROLE:"anonymous",REGISTERED_ROLE:"registered",ADMINISTRATOR_ROLE:"administrator",isEmpty:function(e){for(var t in e){return false}return true},getInstance:function(){if(!e){e=i()}return e},setEndPoint:function(e){var t=/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;if(t.test(e)){this.endPoint=e}else{alert(e+" is not a valid URL")}},endPoint:function(){return this.endPoint},login:function(e,t){var n=u();var r=BaasBox.endPoint+"/login";var i=$.post(r,{username:e,password:t,appcode:BaasBox.appcode}).done(function(e){var t=[];$(e.data.user.roles).each(function(e,n){t.push(n.name)});s({username:e.data.user.name,token:e.data["X-BB-SESSION"],roles:t,visibleByAnonymousUsers:e.data["visibleByAnonymousUsers"],visibleByTheUser:e.data["visibleByTheUser"],visibleByFriends:e.data["visibleByFriends"],visibleByRegisteredUsers:e.data["visibleByRegisteredUsers"]});n.resolve(o())}).fail(function(e){n.reject(e)});return n.promise()},logout:function(e){var t=u();var n=o();if(n===null){return t.reject({data:"ok",message:"User already logged out"})}var i=BaasBox.endPoint+"/logout";var a=$.post(i,{}).done(function(e){if(window.Zepto&&window.localStorage){window.localStorage.removeItem(r)}else{$.cookie(r,null)}s(null);t.resolve({data:"ok",message:"User logged out"}).fail(function(e){t.reject(e)})});return t.promise()},signup:function(e,t,n){var r=u();var i=BaasBox.endPoint+"/user";var a={username:e,password:t};if(n!==undefined||!this.isEmpty(n)){var f=Object.getOwnPropertyNames(n);for(prop in n){a[prop]=n[prop]}}var l=$.ajax({url:i,method:"POST",contentType:"application/json",data:JSON.stringify(a)}).done(function(e){var t=[];$(e.data.user.roles).each(function(e,n){t.push(n.name)});s({username:e.data.user.name,token:e.data["X-BB-SESSION"],roles:t,visibleByAnonymousUsers:e.data["visibleByAnonymousUsers"],visibleByTheUser:e.data["visibleByTheUser"],visibleByFriends:e.data["visibleByFriends"],visibleByRegisteredUsers:e.data["visibleByRegisteredUsers"]});r.resolve(o())}).fail(function(e){r.reject(e)});return r.promise()},getCurrentUser:function(){return o()},fetchCurrentUser:function(){return $.get(BaasBox.endPoint+"/me")},createCollection:function(e){return $.post(BaasBox.endPoint+"/admin/collection/"+e)},deleteCollection:function(e){return $.ajax({url:BaasBox.endPoint+"/admin/collection/"+e,method:"DELETE"})},loadCollectionWithParams:function(e,t){var n=u();var r=BaasBox.endPoint+"/document/"+e;var i=$.ajax({url:r,method:"GET",timeout:BaasBox.timeout,dataType:"json",data:t}).done(function(e){n.resolve(e["data"])}).fail(function(e){n.reject(e)});return n.promise()},loadCollection:function(e){return BaasBox.loadCollectionWithParams(e,{page:0,recordsPerPage:BaasBox.pagelength})},loadObject:function(e,t){return $.get(BaasBox.endPoint+"/document/"+e+"/"+t)},save:function(e,t){var n=u();var r="POST";var i=BaasBox.endPoint+"/document/"+t;if(e.id){r="PUT";i=BaasBox.endPoint+"/document/"+t+"/"+e.id}json=JSON.stringify(e);var s=$.ajax({url:i,type:r,contentType:"application/json",dataType:"json",data:json}).done(function(e){n.resolve(e["data"])}).fail(function(e){n.reject(e)});return n.promise()},updateField:function(e,t,n,r){var i=u();url=BaasBox.endPoint+"/document/"+t+"/"+e+"/."+n;var s=JSON.stringify({data:r});var o=$.ajax({url:url,type:"PUT",contentType:"application/json",dataType:"json",data:s}).done(function(e){i.resolve(e["data"])}).fail(function(e){i.reject(e)});return i.promise()},deleteObject:function(e,t){return $.ajax({url:BaasBox.endPoint+"/document/"+t+"/"+e,method:"DELETE"})},fetchObjectsCount:function(e){return $.get(BaasBox.endPoint+"/document/"+e+"/count")},grantUserAccessToObject:function(e,t,n,r){return $.ajax({url:BaasBox.endPoint+"/document/"+e+"/"+t+"/"+n+"/user/"+r,method:"PUT"})},revokeUserAccessToObject:function(e,t,n,r){return $.ajax({url:BaasBox.endPoint+"/document/"+e+"/"+t+"/"+n+"/user/"+r,method:"DELETE"})},grantRoleAccessToObject:function(e,t,n,r){return $.ajax({url:BaasBox.endPoint+"/document/"+e+"/"+t+"/"+n+"/role/"+r,method:"PUT"})},revokeRoleAccessToObject:function(e,t,n,r){return $.ajax({url:BaasBox.endPoint+"/document/"+e+"/"+t+"/"+n+"/role/"+r,method:"DELETE"})},loadAssetData:function(e){var t=u();var n=BaasBox.endPoint+"/asset/"+e+"/data";var r=$.ajax({url:n,method:"GET",contentType:"application/json",dataType:"json"}).done(function(e){t.resolve(e["data"])}).fail(function(e){t.reject(e)});return t.promise()},getImageURI:function(e,t){var n=u();var r=BaasBox.endPoint+"/asset/"+e;var i;if(t===null||this.isEmpty(t)){return n.resolve({data:r+"?X-BAASBOX-APPCODE="+BaasBox.appcode})}for(var s in t){var o=[];o.push(s);o.push(t[s]);i=o.join("/")}r=r.concat("/");r=r.concat(i);p={};p["X-BAASBOX-APPCODE"]=BaasBox.appcode;var a=$.get(r,p).done(function(e){n.resolve({data:this.url})}).fail(function(e){e});return n.promise()},fetchUserProfile:function(e){return $.get(BaasBox.endPoint+"/user/"+e)},fetchUsers:function(e){return $.ajax({url:BaasBox.endPoint+"/users",method:"GET",data:e})},updateUserProfile:function(e){return $.ajax({url:BaasBox.endPoint+"/me",method:"PUT",contentType:"application/json",data:JSON.stringify(e)})},changePassword:function(e,t){return $.ajax({url:BaasBox.endPoint+"/me/password",method:"PUT",contentType:"application/json",data:JSON.stringify({old:e,"new":t})})},resetPassword:function(){var e=o();return $.get(BaasBox.endPoint+"/user/"+e.username+"/password/reset")},followUser:function(e){return $.post(BaasBox.endPoint+"/follow/"+e)},unfollowUser:function(e){return $.ajax({url:BaasBox.endPoint+"/follow/"+e,method:"DELETE"})},fetchFollowers:function(e){return $.get(BaasBox.endPoint+"/followers/"+e)},fetchFollowing:function(e){return $.get(BaasBox.endPoint+"/following/"+e)},sendPushNotification:function(e){return $.ajax({url:BaasBox.endPoint+"/push/message",method:"POST",contentType:"application/json",data:JSON.stringify(e)})},uploadFile:function(e){return $.ajax({url:BaasBox.endPoint+"/file",type:"POST",data:e,mimeType:"multipart/form-data",contentType:false,cache:false,processData:false})},fetchFile:function(e){return $.get(BaasBox.endPoint+"/file/"+e+"?X-BB-SESSION="+BaasBox.getCurrentUser().token)},deleteFile:function(e){return $.ajax({url:BaasBox.endPoint+"/file/"+e,method:"DELETE"})},fetchFileDetails:function(e){return $.get(BaasBox.endPoint+"/file/details/"+e)},grantUserAccessToFile:function(e,t,n){return $.ajax({url:BaasBox.endPoint+"/file/"+e+"/"+t+"/user/"+n,method:"PUT"})},revokeUserAccessToFile:function(e,t,n){return $.ajax({url:BaasBox.endPoint+"/file/"+e+"/"+t+"/user/"+n,method:"DELETE"})},grantRoleAccessToFile:function(e,t,n){return $.ajax({url:BaasBox.endPoint+"/file/"+e+"/"+t+"/role/"+n,method:"PUT"})},revokeRoleAccessToFile:function(e,t,n){return $.ajax({url:BaasBox.endPoint+"/file/"+e+"/"+t+"/role/"+n,method:"DELETE"})}}}();(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function r(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function s(e){if(e.indexOf('"')===0){e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{e=decodeURIComponent(e.replace(t," "));return u.json?JSON.parse(e):e}catch(n){}}function o(t,n){var r=u.raw?t:s(t);return e.isFunction(n)?n(r):r}var t=/\+/g;var u=e.cookie=function(t,s,a){if(s!==undefined&&!e.isFunction(s)){a=e.extend({},u.defaults,a);if(typeof a.expires==="number"){var f=a.expires,l=a.expires=new Date;l.setDate(l.getDate()+f)}return document.cookie=[n(t),"=",i(s),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure":""].join("")}var c=t?undefined:{};var h=document.cookie?document.cookie.split("; "):[];for(var p=0,d=h.length;p<d;p++){var v=h[p].split("=");var m=r(v.shift());var g=v.join("=");if(t&&t===m){c=o(g,s);break}if(!t&&(g=o(g))!==undefined){c[m]=g}}return c};u.defaults={};e.removeCookie=function(t,n){if(e.cookie(t)===undefined){return false}e.cookie(t,"",e.extend({},n,{expires:-1}));return!e.cookie(t)}})