/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import{k as o,w as s}from"./p-CHqRYvYm.js";import{a as r,s as t}from"./p-ijF0iCrA.js";import{c as a}from"./p-Baq1XyAy.js";const i=()=>{const i=window;i.addEventListener("statusTap",(()=>{o((()=>{const o=document.elementFromPoint(i.innerWidth/2,i.innerHeight/2);if(!o)return;const n=r(o);n&&new Promise((o=>a(n,o))).then((()=>{s((async()=>{n.style.setProperty("--overflow","hidden"),await t(n,300),n.style.removeProperty("--overflow")}))}))}))}))};export{i as startStatusTap}