/**
 * @license React
 * react-pg.node.production.min.server.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var g=require("react"),h=require("pg"),k=require("pg/lib/utils");function l(a){var b={status:0,value:a};a.then(function(a){0===b.status&&(b.status=1,b.value=a)},function(a){0===b.status&&(b.status=2,b.value=a)});return b}function m(a){this.pool=new h.Pool(a);this.createRecordMap=function(){return new Map}}
m.prototype.query=function(a,b){var n=this.pool,d=g.unstable_getCacheForType(this.createRecordMap),e=a;if(null!=b)for(var c=0;c<b.length;c++){var f=d.get(e);if(void 0===f)f=new Map,d.set(e,f);else if(!(f instanceof Map))throw Error("This query has received more parameters than the last time the same query was used. Always pass the exact number of parameters that the query needs.");d=f;e=k.prepareValue(b[c])}c=d.get(e);if(!c)a=n.query(a,b),c=l(a),d.set(e,c);else if(c instanceof Map)throw Error("This query has received fewer parameters than the last time the same query was used. Always pass the exact number of parameters that the query needs.");
if(1===c.status)d=c.value;else throw c.value;return d};exports.Pool=m;
