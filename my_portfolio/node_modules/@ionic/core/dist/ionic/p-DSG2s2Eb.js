/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import{a as o,w as s}from"./p-tcQvqkiX.js";import{f as t,s as r}from"./p-Wk5HzclC.js";import{c as a}from"./p-DIuEbVLu.js";const n=()=>{const n=window;n.addEventListener("statusTap",(()=>{o((()=>{const o=document.elementFromPoint(n.innerWidth/2,n.innerHeight/2);if(!o)return;const c=t(o);c&&new Promise((o=>a(c,o))).then((()=>{s((async()=>{c.style.setProperty("--overflow","hidden"),await r(c,300),c.style.removeProperty("--overflow")}))}))}))}))};export{n as startStatusTap}