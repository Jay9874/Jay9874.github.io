import {
  e
} from "./chunk-2N6XALF5.js";
import {
  a
} from "./chunk-VAXAUP7M.js";

// node_modules/@ionic/core/components/p-ijF0iCrA.js
var a2 = "ion-content";
var t = ".ion-content-scroll-host";
var r = `${a2}, ${t}`;
var e2 = (o) => "ION-CONTENT" === o.tagName;
var i = async (s) => e2(s) ? (await new Promise(((a3) => e(s, a3))), s.getScrollElement()) : s;
var n = (o) => o.querySelector(t) || o.querySelector(r);
var m = (o) => o.closest(r);
var c = (o, s) => e2(o) ? o.scrollToTop(s) : Promise.resolve(o.scrollTo({ top: 0, left: 0, behavior: "smooth" }));
var f = (o, s, a3, t2) => e2(o) ? o.scrollByPoint(s, a3, t2) : Promise.resolve(o.scrollBy({ top: a3, left: s, behavior: t2 > 0 ? "smooth" : "auto" }));
var p = (o) => a(o, a2);
var h = (o) => {
  if (e2(o)) {
    const s = o.scrollY;
    return o.scrollY = false, s;
  }
  return o.style.setProperty("overflow", "hidden"), true;
};
var l = (o, s) => {
  e2(o) ? o.scrollY = s : o.style.removeProperty("overflow");
};

export {
  a2 as a,
  t,
  e2 as e,
  i,
  n,
  m,
  c,
  f,
  p,
  h,
  l
};
//# sourceMappingURL=chunk-O2PPMTS3.js.map
