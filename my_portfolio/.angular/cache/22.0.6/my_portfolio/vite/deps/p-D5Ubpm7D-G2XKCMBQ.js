import {
  i as i2,
  t
} from "./chunk-AN4BRTIS.js";
import {
  f,
  i,
  m
} from "./chunk-O2PPMTS3.js";
import {
  e,
  l,
  u
} from "./chunk-2N6XALF5.js";
import {
  d,
  o
} from "./chunk-FBOO75ZN.js";
import "./chunk-VAXAUP7M.js";
import "./chunk-GOMI4DH3.js";

// node_modules/@ionic/core/components/p-D5Ubpm7D.js
var l2 = /* @__PURE__ */ new WeakMap();
var u2 = (o2, n, t2, i3 = 0, r = false) => {
  l2.has(o2) !== t2 && (t2 ? f2(o2, n, i3, r) : w(o2, n));
};
var f2 = (o2, n, t2, i3 = false) => {
  const r = n.parentNode, a = n.cloneNode(false);
  a.classList.add("cloned-input"), a.tabIndex = -1, i3 && (a.disabled = true);
  const e2 = "rtl" === o2.ownerDocument.dir;
  a.style.insetInlineStart = e2 ? r.offsetWidth - n.offsetLeft - n.offsetWidth + "px" : `${n.offsetLeft}px`, r.appendChild(a), l2.set(o2, a);
  const s = e2 ? 9999 : -9999;
  o2.style.pointerEvents = "none", n.style.transform = `translate3d(${s}px,${t2}px,0) scale(0)`;
};
var w = (o2, n) => {
  const t2 = l2.get(o2);
  t2 && (l2.delete(o2), t2.remove()), o2.style.pointerEvents = "", n.style.transform = "";
};
var p = "input, textarea, [no-blur], [contenteditable]";
var m2 = "$ionPaddingTimer";
var y = (o2, n, t2) => {
  const i3 = o2[m2];
  i3 && clearTimeout(i3), n > 0 ? o2.style.setProperty("--keyboard-offset", `${n}px`) : o2[m2] = setTimeout((() => {
    o2.style.setProperty("--keyboard-offset", "0px"), t2 && t2();
  }), 120);
};
var b = (o2, n, t2) => {
  o2.addEventListener("focusout", (() => {
    n && y(n, 0, t2);
  }), { once: true });
};
var h = 0;
var S = "data-ionic-skip-scroll-assist";
var v = (o2) => {
  var n;
  if (document.activeElement === o2) return;
  const t2 = o2.getAttribute("id"), i3 = o2.closest(`label[for="${t2}"]`), r = null === (n = document.activeElement) || void 0 === n ? void 0 : n.closest(`label[for="${t2}"]`);
  null !== i3 && i3 === r || (o2.setAttribute(S, "true"), o2.focus());
};
var D = async (o2, n, r, a, e2, s, d2 = false, c = 0, l3 = true) => {
  if (!r && !a) return;
  const f3 = ((o3, n2, t2, i3) => {
    var r2;
    return ((o4, n3, t3, i4) => {
      const r3 = o4.top, a2 = o4.bottom, e3 = n3.top, s2 = e3 + 15, d3 = Math.min(n3.bottom, i4 - t3) - 50 - a2, c2 = s2 - r3, l4 = Math.round(d3 < 0 ? -d3 : c2 > 0 ? -c2 : 0), u3 = Math.min(l4, r3 - e3), f4 = Math.abs(u3);
      return { scrollAmount: u3, scrollDuration: Math.min(400, Math.max(150, f4 / 0.3)), scrollPadding: t3, inputSafeY: 4 - (r3 - s2) };
    })((null !== (r2 = o3.closest("ion-item,[ion-item]")) && void 0 !== r2 ? r2 : o3).getBoundingClientRect(), n2.getBoundingClientRect(), t2, i3);
  })(o2, r || a, e2, c);
  if (r && Math.abs(f3.scrollAmount) < 4) return v(n), void (s && null !== r && (y(r, h), b(n, r, (() => h = 0))));
  if (u2(o2, n, true, f3.inputSafeY, d2), v(n), s && r && (h = f3.scrollPadding, y(r, h)), "undefined" != typeof window) {
    let a2;
    const e3 = async () => {
      void 0 !== a2 && clearTimeout(a2), window.removeEventListener("ionKeyboardDidShow", d3), window.removeEventListener("ionKeyboardDidShow", e3), r && await f(r, 0, f3.scrollAmount, f3.scrollDuration), u2(o2, n, false, f3.inputSafeY), document.activeElement === n && v(n), s && b(n, r, (() => h = 0));
    }, d3 = () => {
      window.removeEventListener("ionKeyboardDidShow", d3), window.addEventListener("ionKeyboardDidShow", e3);
    };
    if (r) {
      const o3 = await i(r);
      if (l3 && f3.scrollAmount > o3.scrollHeight - o3.clientHeight - o3.scrollTop) return "password" === n.type ? (f3.scrollAmount += 50, window.addEventListener("ionKeyboardDidShow", d3)) : window.addEventListener("ionKeyboardDidShow", e3), void (a2 = setTimeout(e3, 1e3));
    }
    e3();
  }
};
var x = async (t2, i3) => {
  if (void 0 === o) return;
  const l3 = "ios" === i3, f3 = "android" === i3, w2 = t2.getNumber("keyboardHeight", 290), m3 = t2.getBoolean("scrollAssist", true), y2 = t2.getBoolean("hideCaretOnScroll", l3), b2 = t2.getBoolean("inputBlurring", false), h2 = t2.getBoolean("scrollPadding", true), v2 = Array.from(o.querySelectorAll("ion-input, ion-textarea")), x2 = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakMap(), M = await t.getResizeMode(), j = async (n) => {
    await new Promise(((o2) => e(n, o2)));
    const t3 = n.shadowRoot || n, i4 = t3.querySelector("input") || t3.querySelector("textarea"), c = m(n), l4 = c ? null : n.closest("ion-footer");
    if (i4) {
      if (c && y2 && !x2.has(n)) {
        const o2 = ((o3, n2, t4) => {
          if (!t4 || !n2) return () => {
          };
          const i5 = (t5) => {
            var i6;
            (i6 = n2) === i6.getRootNode().activeElement && u2(o3, n2, t5);
          }, r = () => u2(o3, n2, false), s = () => i5(true), d2 = () => i5(false);
          return l(t4, "ionScrollStart", s), l(t4, "ionScrollEnd", d2), n2.addEventListener("blur", r), () => {
            u(t4, "ionScrollStart", s), u(t4, "ionScrollEnd", d2), n2.removeEventListener("blur", r);
          };
        })(n, i4, c);
        x2.set(n, o2);
      }
      if ("date" !== i4.type && "datetime-local" !== i4.type && (c || l4) && m3 && !K.has(n)) {
        const t4 = ((n2, t5, i5, r, a, e2, s, c2 = false) => {
          const l5 = e2 && (void 0 === s || s.mode === i2.None);
          let u3 = false;
          const f4 = void 0 !== d ? d.innerHeight : 0, w3 = (o2) => {
            false !== u3 ? D(n2, t5, i5, r, o2.detail.keyboardHeight, l5, c2, f4, false) : u3 = true;
          }, p2 = () => {
            u3 = false, null == d || d.removeEventListener("ionKeyboardDidShow", w3), n2.removeEventListener("focusout", p2);
          }, m4 = async () => {
            t5.hasAttribute(S) ? t5.removeAttribute(S) : (D(n2, t5, i5, r, a, l5, c2, f4), null == d || d.addEventListener("ionKeyboardDidShow", w3), n2.addEventListener("focusout", p2));
          };
          return n2.addEventListener("focusin", m4), () => {
            n2.removeEventListener("focusin", m4), null == d || d.removeEventListener("ionKeyboardDidShow", w3), n2.removeEventListener("focusout", p2);
          };
        })(n, i4, c, l4, w2, h2, M, f3);
        K.set(n, t4);
      }
    }
  };
  b2 && (() => {
    let o2 = true, n = false;
    const t3 = document;
    l(t3, "ionScrollStart", (() => {
      n = true;
    })), t3.addEventListener("focusin", (() => {
      o2 = true;
    }), true), t3.addEventListener("touchend", ((i4) => {
      if (n) return void (n = false);
      const r = t3.activeElement;
      if (!r) return;
      if (r.matches(p)) return;
      const a = i4.target;
      a !== r && (a.matches(p) || a.closest(p) || (o2 = false, setTimeout((() => {
        o2 || r.blur();
      }), 50)));
    }), false);
  })();
  for (const o2 of v2) j(o2);
  o.addEventListener("ionInputDidLoad", ((o2) => {
    j(o2.detail);
  })), o.addEventListener("ionInputDidUnload", ((o2) => {
    ((o3) => {
      if (y2) {
        const n = x2.get(o3);
        n && n(), x2.delete(o3);
      }
      if (m3) {
        const n = K.get(o3);
        n && n(), K.delete(o3);
      }
    })(o2.detail);
  }));
};
export {
  x as startInputShims
};
//# sourceMappingURL=p-D5Ubpm7D-G2XKCMBQ.js.map
