/*!
 * Axentax.js v1.0.0
 * Copyright (c) 2024 Mitsuru Yasuda
 * GPL-3.0 License
 *
 * use:
 * - tonaljs { chord, midi } - https://github.com/tonaljs/tonal
 * - decimal.js - https://github.com/MikeMcl/decimal.js
 */
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function e(e3) {
  var t2, n2, i2, r2 = e3.length - 1, o2 = "", s2 = e3[0];
  if (r2 > 0) {
    for (o2 += s2, t2 = 1; r2 > t2; t2++) (n2 = Mn - (i2 = e3[t2] + "").length) && (o2 += f(n2)), o2 += i2;
    (n2 = Mn - (i2 = (s2 = e3[t2]) + "").length) && (o2 += f(n2));
  } else if (0 === s2) return "0";
  for (; s2 % 10 == 0; ) s2 /= 10;
  return o2 + s2;
}
function t(e3, t2, n2) {
  if (e3 !== ~~e3 || t2 > e3 || e3 > n2) throw Error(un + e3);
}
function n(e3, t2, n2, i2) {
  var r2, o2, s2, c2;
  for (o2 = e3[0]; o2 >= 10; o2 /= 10) --t2;
  return 0 > --t2 ? (t2 += Mn, r2 = 0) : (r2 = Math.ceil((t2 + 1) / Mn), t2 %= Mn), o2 = hn(10, Mn - t2), c2 = e3[r2] % o2 | 0, null == i2 ? 3 > t2 ? (0 == t2 ? c2 = c2 / 100 | 0 : 1 == t2 && (c2 = c2 / 10 | 0), s2 = 4 > n2 && 99999 == c2 || n2 > 3 && 49999 == c2 || 5e4 == c2 || 0 == c2) : s2 = (4 > n2 && c2 + 1 == o2 || n2 > 3 && c2 + 1 == o2 / 2) && (e3[r2 + 1] / o2 / 100 | 0) == hn(10, t2 - 2) - 1 || (c2 == o2 / 2 || 0 == c2) && !(e3[r2 + 1] / o2 / 100 | 0) : 4 > t2 ? (0 == t2 ? c2 = c2 / 1e3 | 0 : 1 == t2 ? c2 = c2 / 100 | 0 : 2 == t2 && (c2 = c2 / 10 | 0), s2 = (i2 || 4 > n2) && 9999 == c2 || !i2 && n2 > 3 && 4999 == c2) : s2 = ((i2 || 4 > n2) && c2 + 1 == o2 || !i2 && n2 > 3 && c2 + 1 == o2 / 2) && (e3[r2 + 1] / o2 / 1e3 | 0) == hn(10, t2 - 3) - 1, s2;
}
function i(e3, t2, n2) {
  for (var i2, r2, o2 = [0], s2 = 0, c2 = e3.length; c2 > s2; ) {
    for (r2 = o2.length; r2--; ) o2[r2] *= t2;
    for (o2[0] += en.indexOf(e3.charAt(s2++)), i2 = 0; o2.length > i2; i2++) o2[i2] > n2 - 1 && (void 0 === o2[i2 + 1] && (o2[i2 + 1] = 0), o2[i2 + 1] += o2[i2] / n2 | 0, o2[i2] %= n2);
  }
  return o2.reverse();
}
function r(e3, t2, n2, i2) {
  var r2, o2, s2, c2, a2, u2, f2, l2, d2, m2 = e3.constructor;
  e: if (null != t2) {
    if (!(l2 = e3.d)) return e3;
    for (r2 = 1, c2 = l2[0]; c2 >= 10; c2 /= 10) r2++;
    if (0 > (o2 = t2 - r2)) o2 += Mn, a2 = (f2 = l2[d2 = 0]) / hn(10, r2 - (s2 = t2) - 1) % 10 | 0;
    else if ((c2 = l2.length) > (d2 = Math.ceil((o2 + 1) / Mn))) {
      for (f2 = c2 = l2[d2], r2 = 1; c2 >= 10; c2 /= 10) r2++;
      a2 = 0 > (s2 = (o2 %= Mn) - Mn + r2) ? 0 : f2 / hn(10, r2 - s2 - 1) % 10 | 0;
    } else {
      if (!i2) break e;
      for (; c2++ <= d2; ) l2.push(0);
      f2 = a2 = 0, r2 = 1, s2 = (o2 %= Mn) - Mn + 1;
    }
    if (i2 = i2 || 0 > t2 || void 0 !== l2[d2 + 1] || (0 > s2 ? f2 : f2 % hn(10, r2 - s2 - 1)), u2 = 4 > n2 ? (a2 || i2) && (0 == n2 || n2 == (0 > e3.s ? 3 : 2)) : a2 > 5 || 5 == a2 && (4 == n2 || i2 || 6 == n2 && (o2 > 0 ? s2 > 0 ? f2 / hn(10, r2 - s2) : 0 : l2[d2 - 1]) % 10 & 1 || n2 == (0 > e3.s ? 8 : 7)), 1 > t2 || !l2[0]) return l2.length = 0, u2 ? (l2[0] = hn(10, (Mn - (t2 -= e3.e + 1) % Mn) % Mn), e3.e = -t2 || 0) : l2[0] = e3.e = 0, e3;
    if (0 == o2 ? (l2.length = d2, c2 = 1, d2--) : (l2.length = d2 + 1, c2 = hn(10, Mn - o2), l2[d2] = s2 > 0 ? (f2 / hn(10, r2 - s2) % hn(10, s2) | 0) * c2 : 0), u2) for (; ; ) {
      if (0 == d2) {
        for (o2 = 1, s2 = l2[0]; s2 >= 10; s2 /= 10) o2++;
        for (s2 = l2[0] += c2, c2 = 1; s2 >= 10; s2 /= 10) c2++;
        o2 != c2 && (e3.e++, l2[0] == wn && (l2[0] = 1));
        break;
      }
      if (l2[d2] += c2, l2[d2] != wn) break;
      l2[d2--] = 0, c2 = 1;
    }
    for (o2 = l2.length; 0 === l2[--o2]; ) l2.pop();
  }
  return cn && (e3.e > m2.maxE ? (e3.d = null, e3.e = NaN) : m2.minE > e3.e && (e3.e = 0, e3.d = [0])), e3;
}
function o(t2, n2, i2) {
  if (!t2.isFinite()) return b(t2);
  var r2, o2 = t2.e, s2 = e(t2.d), c2 = s2.length;
  return n2 ? (i2 && (r2 = i2 - c2) > 0 ? s2 = s2.charAt(0) + "." + s2.slice(1) + f(r2) : c2 > 1 && (s2 = s2.charAt(0) + "." + s2.slice(1)), s2 = s2 + (0 > t2.e ? "e" : "e+") + t2.e) : 0 > o2 ? (s2 = "0." + f(-o2 - 1) + s2, i2 && (r2 = i2 - c2) > 0 && (s2 += f(r2))) : c2 > o2 ? ((r2 = o2 + 1) < c2 && (s2 = s2.slice(0, r2) + "." + s2.slice(r2)), i2 && (r2 = i2 - c2) > 0 && (o2 + 1 === c2 && (s2 += "."), s2 += f(r2))) : (s2 += f(o2 + 1 - c2), i2 && (r2 = i2 - o2 - 1) > 0 && (s2 = s2 + "." + f(r2))), s2;
}
function s(e3, t2) {
  var n2 = e3[0];
  for (t2 *= Mn; n2 >= 10; n2 /= 10) t2++;
  return t2;
}
function c(e3, t2, n2) {
  if (t2 > kn) throw cn = 1, n2 && (e3.precision = n2), Error(fn);
  return r(new e3(tn), t2, 1, 1);
}
function a(e3, t2, n2) {
  if (t2 > Pn) throw Error(fn);
  return r(new e3(nn), t2, n2, 1);
}
function u(e3) {
  var t2 = e3.length - 1, n2 = t2 * Mn + 1;
  if (t2 = e3[t2]) {
    for (; t2 % 10 == 0; t2 /= 10) n2--;
    for (t2 = e3[0]; t2 >= 10; t2 /= 10) n2++;
  }
  return n2;
}
function f(e3) {
  for (var t2 = ""; e3--; ) t2 += "0";
  return t2;
}
function l(e3, t2, n2, i2) {
  var r2, o2 = new e3(1), s2 = Math.ceil(i2 / Mn + 4);
  for (cn = 0; ; ) {
    if (n2 % 2 && g((o2 = o2.times(t2)).d, s2) && (r2 = 1), 0 === (n2 = mn(n2 / 2))) {
      n2 = o2.d.length - 1, r2 && 0 === o2.d[n2] && ++o2.d[n2];
      break;
    }
    g((t2 = t2.times(t2)).d, s2);
  }
  return cn = 1, o2;
}
function d(e3) {
  return 1 & e3.d[e3.d.length - 1];
}
function m(e3, t2, n2) {
  for (var i2, r2 = new e3(t2[0]), o2 = 0; ++o2 < t2.length; ) {
    if (!(i2 = new e3(t2[o2])).s) {
      r2 = i2;
      break;
    }
    r2[n2](i2) && (r2 = i2);
  }
  return r2;
}
function h(t2, i2) {
  var o2, s2, c2, a2, u2, f2, l2, d2 = 0, m2 = 0, h2 = 0, v2 = t2.constructor, b2 = v2.rounding, p2 = v2.precision;
  if (!t2.d || !t2.d[0] || t2.e > 17) return new v2(t2.d ? t2.d[0] ? 0 > t2.s ? 0 : 1 / 0 : 1 : t2.s ? 0 > t2.s ? 0 : t2 : NaN);
  for (null == i2 ? (cn = 0, l2 = p2) : l2 = i2, f2 = new v2(0.03125); t2.e > -2; ) t2 = t2.times(f2), h2 += 5;
  for (l2 += s2 = Math.log(hn(2, h2)) / Math.LN10 * 2 + 5 | 0, o2 = a2 = u2 = new v2(1), v2.precision = l2; ; ) {
    if (a2 = r(a2.times(t2), l2, 1), o2 = o2.times(++m2), e((f2 = u2.plus($n(a2, o2, l2, 1))).d).slice(0, l2) === e(u2.d).slice(0, l2)) {
      for (c2 = h2; c2--; ) u2 = r(u2.times(u2), l2, 1);
      if (null != i2) return v2.precision = p2, u2;
      if (d2 >= 3 || !n(u2.d, l2 - s2, b2, d2)) return r(u2, v2.precision = p2, b2, cn = 1);
      v2.precision = l2 += 10, o2 = a2 = f2 = new v2(1), m2 = 0, d2++;
    }
    u2 = f2;
  }
}
function v(t2, i2) {
  var o2, s2, a2, u2, f2, l2, d2, m2, h2, b2, p2, y2 = 1, w2 = t2, M2 = w2.d, k2 = w2.constructor, P2 = k2.rounding, g2 = k2.precision;
  if (0 > w2.s || !M2 || !M2[0] || !w2.e && 1 == M2[0] && 1 == M2.length) return new k2(M2 && !M2[0] ? -1 / 0 : 1 != w2.s ? NaN : M2 ? 0 : w2);
  if (null == i2 ? (cn = 0, h2 = g2) : h2 = i2, k2.precision = h2 += 10, s2 = (o2 = e(M2)).charAt(0), Math.abs(u2 = w2.e) >= 15e14) return m2 = c(k2, h2 + 2, g2).times(u2 + ""), w2 = v(new k2(s2 + "." + o2.slice(1)), h2 - 10).plus(m2), k2.precision = g2, null == i2 ? r(w2, g2, P2, cn = 1) : w2;
  for (; 7 > s2 && 1 != s2 || 1 == s2 && o2.charAt(1) > 3; ) s2 = (o2 = e((w2 = w2.times(t2)).d)).charAt(0), y2++;
  for (u2 = w2.e, s2 > 1 ? (w2 = new k2("0." + o2), u2++) : w2 = new k2(s2 + "." + o2.slice(1)), b2 = w2, d2 = f2 = w2 = $n(w2.minus(1), w2.plus(1), h2, 1), p2 = r(w2.times(w2), h2, 1), a2 = 3; ; ) {
    if (f2 = r(f2.times(p2), h2, 1), e((m2 = d2.plus($n(f2, new k2(a2), h2, 1))).d).slice(0, h2) === e(d2.d).slice(0, h2)) {
      if (d2 = d2.times(2), 0 !== u2 && (d2 = d2.plus(c(k2, h2 + 2, g2).times(u2 + ""))), d2 = $n(d2, new k2(y2), h2, 1), null != i2) return k2.precision = g2, d2;
      if (!n(d2.d, h2 - 10, P2, l2)) return r(d2, k2.precision = g2, P2, cn = 1);
      k2.precision = h2 += 10, m2 = f2 = w2 = $n(b2.minus(1), b2.plus(1), h2, 1), p2 = r(w2.times(w2), h2, 1), a2 = l2 = 1;
    }
    d2 = m2, a2 += 2;
  }
}
function b(e3) {
  return e3.s * e3.s / 0 + "";
}
function p(e3, t2) {
  var n2, i2, r2;
  for ((n2 = t2.indexOf(".")) > -1 && (t2 = t2.replace(".", "")), (i2 = t2.search(/e/i)) > 0 ? (0 > n2 && (n2 = i2), n2 += +t2.slice(i2 + 1), t2 = t2.substring(0, i2)) : 0 > n2 && (n2 = t2.length), i2 = 0; 48 === t2.charCodeAt(i2); i2++) ;
  for (r2 = t2.length; 48 === t2.charCodeAt(r2 - 1); --r2) ;
  if (t2 = t2.slice(i2, r2)) {
    if (r2 -= i2, e3.e = n2 = n2 - i2 - 1, e3.d = [], i2 = (n2 + 1) % Mn, 0 > n2 && (i2 += Mn), r2 > i2) {
      for (i2 && e3.d.push(+t2.slice(0, i2)), r2 -= Mn; r2 > i2; ) e3.d.push(+t2.slice(i2, i2 += Mn));
      t2 = t2.slice(i2), i2 = Mn - t2.length;
    } else i2 -= r2;
    for (; i2--; ) t2 += "0";
    e3.d.push(+t2), cn && (e3.e > e3.constructor.maxE ? (e3.d = null, e3.e = NaN) : e3.constructor.minE > e3.e && (e3.e = 0, e3.d = [0]));
  } else e3.e = 0, e3.d = [0];
  return e3;
}
function y(e3, t2) {
  var n2, r2, o2, c2, a2, u2, f2, d2, m2;
  if (t2.indexOf("_") > -1) {
    if (t2 = t2.replace(/(\d)_(?=\d)/g, "$1"), yn.test(t2)) return p(e3, t2);
  } else if ("Infinity" === t2 || "NaN" === t2) return +t2 || (e3.s = NaN), e3.e = NaN, e3.d = null, e3;
  if (bn.test(t2)) n2 = 16, t2 = t2.toLowerCase();
  else if (vn.test(t2)) n2 = 2;
  else {
    if (!pn.test(t2)) throw Error(un + t2);
    n2 = 8;
  }
  for ((c2 = t2.search(/p/i)) > 0 ? (f2 = +t2.slice(c2 + 1), t2 = t2.substring(2, c2)) : t2 = t2.slice(2), c2 = t2.indexOf("."), r2 = e3.constructor, (a2 = c2 >= 0) && (c2 = (u2 = (t2 = t2.replace(".", "")).length) - c2, o2 = l(r2, new r2(n2), c2, 2 * c2)), c2 = m2 = (d2 = i(t2, n2, wn)).length - 1; 0 === d2[c2]; --c2) d2.pop();
  return 0 > c2 ? new r2(0 * e3.s) : (e3.e = s(d2, m2), e3.d = d2, cn = 0, a2 && (e3 = $n(e3, o2, 4 * u2)), f2 && (e3 = e3.times(54 > Math.abs(f2) ? hn(2, f2) : Nn.pow(2, f2))), cn = 1, e3);
}
function w(e3, t2, n2, i2, r2) {
  var o2, s2, c2, a2, u2 = e3.precision, f2 = Math.ceil(u2 / Mn);
  for (cn = 0, a2 = n2.times(n2), c2 = new e3(i2); ; ) {
    if (s2 = $n(c2.times(a2), new e3(t2++ * t2++), u2, 1), c2 = r2 ? i2.plus(s2) : i2.minus(s2), i2 = $n(s2.times(a2), new e3(t2++ * t2++), u2, 1), void 0 !== (s2 = c2.plus(i2)).d[f2]) {
      for (o2 = f2; s2.d[o2] === c2.d[o2] && o2--; ) ;
      if (-1 == o2) break;
    }
    o2 = c2, c2 = i2, i2 = s2, s2 = o2;
  }
  return cn = 1, s2.d.length = f2 + 1, s2;
}
function M(e3, t2) {
  for (var n2 = e3; --t2; ) n2 *= e3;
  return n2;
}
function k(e3, t2) {
  var n2, i2 = 0 > t2.s, r2 = a(e3, e3.precision, 1), o2 = r2.times(0.5);
  if ((t2 = t2.abs()).lte(o2)) return sn = i2 ? 4 : 1, t2;
  if ((n2 = t2.divToInt(r2)).isZero()) sn = i2 ? 3 : 2;
  else {
    if ((t2 = t2.minus(n2.times(r2))).lte(o2)) return sn = d(n2) ? i2 ? 2 : 3 : i2 ? 4 : 1, t2;
    sn = d(n2) ? i2 ? 1 : 4 : i2 ? 3 : 2;
  }
  return t2.minus(r2).abs();
}
function P(e3, n2, r2, s2) {
  var c2, a2, u2, f2, l2, d2, m2, h2, v2, p2 = e3.constructor, y2 = void 0 !== r2;
  if (y2 ? (t(r2, 1, Zt), void 0 === s2 ? s2 = p2.rounding : t(s2, 0, 8)) : (r2 = p2.precision, s2 = p2.rounding), e3.isFinite()) {
    for (y2 ? (c2 = 2, 16 == n2 ? r2 = 4 * r2 - 3 : 8 == n2 && (r2 = 3 * r2 - 2)) : c2 = n2, 0 > (u2 = (m2 = o(e3)).indexOf(".")) || (m2 = m2.replace(".", ""), (v2 = new p2(1)).e = m2.length - u2, v2.d = i(o(v2), 10, c2), v2.e = v2.d.length), a2 = l2 = (h2 = i(m2, 10, c2)).length; 0 == h2[--l2]; ) h2.pop();
    if (h2[0]) {
      if (0 > u2 ? a2-- : ((e3 = new p2(e3)).d = h2, e3.e = a2, h2 = (e3 = $n(e3, v2, r2, s2, 0, c2)).d, a2 = e3.e, d2 = on), u2 = h2[r2], f2 = c2 / 2, d2 = d2 || void 0 !== h2[r2 + 1], d2 = 4 > s2 ? (void 0 !== u2 || d2) && (0 === s2 || s2 === (0 > e3.s ? 3 : 2)) : u2 > f2 || u2 === f2 && (4 === s2 || d2 || 6 === s2 && 1 & h2[r2 - 1] || s2 === (0 > e3.s ? 8 : 7)), h2.length = r2, d2) for (; ++h2[--r2] > c2 - 1; ) h2[r2] = 0, r2 || (++a2, h2.unshift(1));
      for (l2 = h2.length; !h2[l2 - 1]; --l2) ;
      for (u2 = 0, m2 = ""; l2 > u2; u2++) m2 += en.charAt(h2[u2]);
      if (y2) {
        if (l2 > 1) if (16 == n2 || 8 == n2) {
          for (u2 = 16 == n2 ? 4 : 3, --l2; l2 % u2; l2++) m2 += "0";
          for (l2 = (h2 = i(m2, c2, n2)).length; !h2[l2 - 1]; --l2) ;
          for (u2 = 1, m2 = "1."; l2 > u2; u2++) m2 += en.charAt(h2[u2]);
        } else m2 = m2.charAt(0) + "." + m2.slice(1);
        m2 = m2 + (0 > a2 ? "p" : "p+") + a2;
      } else if (0 > a2) {
        for (; ++a2; ) m2 = "0" + m2;
        m2 = "0." + m2;
      } else if (++a2 > l2) for (a2 -= l2; a2--; ) m2 += "0";
      else l2 > a2 && (m2 = m2.slice(0, a2) + "." + m2.slice(a2));
    } else m2 = y2 ? "0p+0" : "0";
    m2 = (16 == n2 ? "0x" : 2 == n2 ? "0b" : 8 == n2 ? "0o" : "") + m2;
  } else m2 = b(e3);
  return 0 > e3.s ? "-" + m2 : m2;
}
function g(e3, t2) {
  if (e3.length > t2) return e3.length = t2, 1;
}
function $(e3) {
  return new this(e3).abs();
}
function N(e3) {
  return new this(e3).acos();
}
function A(e3) {
  return new this(e3).acosh();
}
function S(e3, t2) {
  return new this(e3).plus(t2);
}
function x(e3) {
  return new this(e3).asin();
}
function I(e3) {
  return new this(e3).asinh();
}
function T(e3) {
  return new this(e3).atan();
}
function C(e3) {
  return new this(e3).atanh();
}
function j(e3, t2) {
  e3 = new this(e3), t2 = new this(t2);
  var n2, i2 = this.precision, r2 = this.rounding, o2 = i2 + 4;
  return e3.s && t2.s ? e3.d || t2.d ? !t2.d || e3.isZero() ? (n2 = 0 > t2.s ? a(this, i2, r2) : new this(0)).s = e3.s : !e3.d || t2.isZero() ? (n2 = a(this, o2, 1).times(0.5)).s = e3.s : 0 > t2.s ? (this.precision = o2, this.rounding = 1, n2 = this.atan($n(e3, t2, o2, 1)), t2 = a(this, o2, 1), this.precision = i2, this.rounding = r2, n2 = 0 > e3.s ? n2.minus(t2) : n2.plus(t2)) : n2 = this.atan($n(e3, t2, o2, 1)) : (n2 = a(this, o2, 1).times(t2.s > 0 ? 0.25 : 0.75)).s = e3.s : n2 = new this(NaN), n2;
}
function O(e3) {
  return new this(e3).cbrt();
}
function E(e3) {
  return r(e3 = new this(e3), e3.e + 1, 2);
}
function D(e3, t2, n2) {
  return new this(e3).clamp(t2, n2);
}
function B(e3) {
  if (!e3 || "object" != typeof e3) throw Error(an + "Object expected");
  var t2, n2, i2, r2 = 1 == e3.defaults, o2 = ["precision", 1, Zt, "rounding", 0, 8, "toExpNeg", -Qt, 0, "toExpPos", 0, Qt, "maxE", 0, Qt, "minE", -Qt, 0, "modulo", 0, 9];
  for (t2 = 0; o2.length > t2; t2 += 3) if (n2 = o2[t2], r2 && (this[n2] = rn[n2]), void 0 !== (i2 = e3[n2])) {
    if (mn(i2) !== i2 || o2[t2 + 1] > i2 || i2 > o2[t2 + 2]) throw Error(un + n2 + ": " + i2);
    this[n2] = i2;
  }
  if (n2 = "crypto", r2 && (this[n2] = rn[n2]), void 0 !== (i2 = e3[n2])) {
    if (1 != i2 && 0 != i2 && 0 !== i2 && 1 !== i2) throw Error(un + n2 + ": " + i2);
    if (i2) {
      if ("undefined" == typeof crypto || !crypto || !crypto.getRandomValues && !crypto.randomBytes) throw Error(ln);
      this[n2] = 1;
    } else this[n2] = 0;
  }
  return this;
}
function F(e3) {
  return new this(e3).cos();
}
function L(e3) {
  return new this(e3).cosh();
}
function G(e3, t2) {
  return new this(e3).div(t2);
}
function _(e3) {
  return new this(e3).exp();
}
function U(e3) {
  return r(e3 = new this(e3), e3.e + 1, 3);
}
function R() {
  var e3, t2, n2 = new this(0);
  for (cn = 0, e3 = 0; arguments.length > e3; ) if ((t2 = new this(arguments[e3++])).d) n2.d && (n2 = n2.plus(t2.times(t2)));
  else {
    if (t2.s) return cn = 1, new this(1 / 0);
    n2 = t2;
  }
  return cn = 1, n2.sqrt();
}
function q(e3) {
  return e3 instanceof Nn || e3 && e3.toStringTag === dn || 0;
}
function K(e3) {
  return new this(e3).ln();
}
function W(e3, t2) {
  return new this(e3).log(t2);
}
function z(e3) {
  return new this(e3).log(2);
}
function X(e3) {
  return new this(e3).log(10);
}
function V() {
  return m(this, arguments, "lt");
}
function J() {
  return m(this, arguments, "gt");
}
function H(e3, t2) {
  return new this(e3).mod(t2);
}
function Y(e3, t2) {
  return new this(e3).mul(t2);
}
function Q(e3, t2) {
  return new this(e3).pow(t2);
}
function Z(e3) {
  var n2, i2, r2, o2, s2 = 0, c2 = new this(1), a2 = [];
  if (void 0 === e3 ? e3 = this.precision : t(e3, 1, Zt), r2 = Math.ceil(e3 / Mn), this.crypto) if (crypto.getRandomValues) for (n2 = crypto.getRandomValues(new Uint32Array(r2)); r2 > s2; ) 429e7 > (o2 = n2[s2]) ? a2[s2++] = o2 % 1e7 : n2[s2] = crypto.getRandomValues(new Uint32Array(1))[0];
  else {
    if (!crypto.randomBytes) throw Error(ln);
    for (n2 = crypto.randomBytes(r2 *= 4); r2 > s2; ) 214e7 > (o2 = n2[s2] + (n2[s2 + 1] << 8) + (n2[s2 + 2] << 16) + ((127 & n2[s2 + 3]) << 24)) ? (a2.push(o2 % 1e7), s2 += 4) : crypto.randomBytes(4).copy(n2, s2);
    s2 = r2 / 4;
  }
  else for (; r2 > s2; ) a2[s2++] = 1e7 * Math.random() | 0;
  for (r2 = a2[--s2], e3 %= Mn, r2 && e3 && (o2 = hn(10, Mn - e3), a2[s2] = (r2 / o2 | 0) * o2); 0 === a2[s2]; s2--) a2.pop();
  if (0 > s2) i2 = 0, a2 = [0];
  else {
    for (i2 = -1; 0 === a2[0]; i2 -= Mn) a2.shift();
    for (r2 = 1, o2 = a2[0]; o2 >= 10; o2 /= 10) r2++;
    Mn > r2 && (i2 -= Mn - r2);
  }
  return c2.e = i2, c2.d = a2, c2;
}
function ee(e3) {
  return r(e3 = new this(e3), e3.e + 1, this.rounding);
}
function te(e3) {
  return (e3 = new this(e3)).d ? e3.d[0] ? e3.s : 0 * e3.s : e3.s || NaN;
}
function ne(e3) {
  return new this(e3).sin();
}
function ie(e3) {
  return new this(e3).sinh();
}
function re(e3) {
  return new this(e3).sqrt();
}
function oe(e3, t2) {
  return new this(e3).sub(t2);
}
function se() {
  var e3 = 0, t2 = arguments, n2 = new this(t2[e3]);
  for (cn = 0; n2.s && ++e3 < t2.length; ) n2 = n2.plus(t2[e3]);
  return cn = 1, r(n2, this.precision, this.rounding);
}
function ce(e3) {
  return new this(e3).tan();
}
function ae(e3) {
  return new this(e3).tanh();
}
function ue(e3) {
  return r(e3 = new this(e3), e3.e + 1, 1);
}
function fe(e3, t2) {
  return new Nn(e3).add(new Nn(t2)).toNumber();
}
function le(e3) {
  return e3.replace(/\s+\)/g, ")").replace(/\(\s+/g, "(").replace(/\s*,\s*/g, ",").replace(/\s+/g, " ");
}
function de(e3) {
  switch (e3) {
    case "Cb":
      return "B";
    case "Db":
      return "C#";
    case "Eb":
      return "D#";
    case "E#":
      return "F";
    case "Fb":
      return "E";
    case "Gb":
      return "F#";
    case "Ab":
      return "G#";
    case "Bb":
      return "A#";
    case "B#":
      return "C";
    default:
      return e3;
  }
}
function me(e3) {
  if (3 === e3.length) {
    const t2 = e3.replace(/^([CDEFGAB])(b#|#b)$/, "$1");
    if (t2 !== e3) return t2;
    {
      const t3 = e3.match(/^([CDEFGAB]#)#$/);
      if (t3) return he(t3[1]);
      {
        const t4 = e3.match(/^([CDEFGAB])bb$/);
        if (t4) return ve(t4[1], 2);
      }
    }
  }
  return de(e3);
}
function he(e3) {
  const t2 = er.iKey, n2 = t2.indexOf(e3) + 1;
  return t2[n2 % 12];
}
function ve(e3, t2 = 1) {
  const n2 = er.iKey, i2 = n2.indexOf(e3) - t2;
  return n2[(12 + i2) % 12];
}
function be(e3) {
  const t2 = [{ sym: "E", note: 64 }, { sym: "B", note: 59 }, { sym: "G", note: 55 }, { sym: "D", note: 50 }, { sym: "A", note: 45 }, { sym: "E", note: 40 }, { sym: "B", note: 35 }, { sym: "F#", note: 30 }, { sym: "C#", note: 25 }], n2 = [];
  for (let i2 = 0; e3.length > i2; i2++) {
    const r2 = e3.length - i2 - 1, o2 = Ir[e3[i2]].indexOf(t2[r2].sym);
    n2.unshift(t2[r2].note - o2);
  }
  return n2;
}
function pe(e3, t2) {
  return Array.from({ length: t2 - e3 + 1 }, (t3, n2) => e3 + n2);
}
function ye(e3, t2) {
  return e3.length > (t2 = Math.abs(t2) % (2 * (e3.length - 1))) || (t2 = 2 * (e3.length - 1) - t2), t2;
}
function we(e3, t2) {
  const n2 = e3.slice(0, t2);
  return e3.slice(t2, e3.length + 1).concat(n2);
}
function Me(e3, t2) {
  const n2 = e3.indexOf(t2), i2 = e3.slice(0, n2);
  return e3.slice(n2, e3.length + 1).concat(i2);
}
function ke(e3, t2, n2, i2 = []) {
  const r2 = [];
  let o2 = "", s2 = e3, c2 = t2, a2 = e3, u2 = t2, f2 = 0;
  for (const t3 of n2) "\n" === t3 ? (s2++, c2 = 1, f2 ? o2 += t3 : (/\S/.test(o2) && r2.push({ token: o2.trim(), line: a2, pos: u2 }), a2 = s2, u2 = c2, o2 = "")) : i2.includes(t3) ? f2 ? o2 += t3 : (/\S/.test(o2) && r2.push({ token: o2.trim(), line: a2, pos: u2 }), a2 = s2, u2 = c2 + (e3 === a2 ? 1 : 0), o2 = "") : "(" === t3 ? f2++ : ")" === t3 ? f2-- : /\s/.test(t3) ? /\S/.test(o2) ? o2 += t3 : u2++ : o2 += t3, c2++;
  return /\S/.test(o2) && r2.push({ token: o2.trim(), line: a2, pos: u2 }), r2;
}
function Pe(e3, t2, n2, i2) {
  const r2 = {};
  let o2 = "";
  if (/!/.test(e3)) {
    const i3 = e3.split("!"), s3 = parseInt(i3[1]);
    if (1 > s3 || s3 > Zi.maxApproachPercent) return new cr(t2, n2, e3, `Invalid shift order '${s3}'. Approach speed must be an integer with a value between 1 and ${Zi.maxApproachPercent}.`);
    r2.percentOfSpeed = s3, o2 = i3[0];
  } else o2 = e3;
  const s2 = o2.split("|"), c2 = i2.map((e4, t3) => {
    const n3 = parseInt(s2[i2.length - 1 - t3]);
    return n3 > Zi.maxTopFret ? -2 : isNaN(n3) ? void 0 : n3;
  });
  return s2.length > i2.length ? new cr(t2, n2, e3, `Invalid velocity value '${o2}'. 
You cannot specify more than the number of strings. Please set the number of strings using "set.turning".`) : c2.includes(-2) ? new cr(t2, n2, e3, `Invalid token '${o2}'. Up to ${Zi.maxTopFret} frets can be used`) : (r2.bowWithFret = c2, new ir(r2));
}
function ge(e3, t2, n2) {
  const i2 = [], r2 = ke(t2, n2 + 3, e3, [","]);
  let o2 = 0, s2 = -1, c2 = 0;
  for (const t3 of r2) {
    const a2 = { row: t3.token, line: t3.line, linePos: t3.pos };
    let u2 = t3.pos, f2 = t3.token, l2 = 0;
    const d2 = t3.token.split(/\s+/).length;
    for (let e4 = 0; d2 > e4; e4++) {
      const e5 = f2.match(/^((?:[^\s]+)(?:\s+|$))/);
      f2 = f2.replace(/^[^\s]+\s+/, "");
      const n3 = e5 ? e5[1] : "", i3 = n3.trimEnd();
      if (/^(\d+)?\.\./.test(i3)) {
        const e6 = i3.match(/^(\d+)?\.\.(\d+)?(\/\d+)?$/);
        if (!e6) return new cr(t3.line, u2, i3, `Invalid bend token '${i3}'. e.g. 0..2/4`);
        if (e6[3]) {
          const n4 = parseInt(e6[3].replace(/\//, ""));
          if (o2 && o2 !== n4) return new cr(t3.line, u2, t3.token, `Different denominators cannot be set. '/${n4}'`);
          if (o2 = parseInt(e6[3].replace(/\//, "")), o2 > Zi.bendMaxFixedUntilDenom) return new cr(t3.line, u2, t3.token, `The division denominator for Bend is ${Zi.bendMaxFixedUntilDenom}, but the setting value is ${o2}.`);
        } else 0 === o2 && (o2 = 16);
        a2.untilRange = [/^\d+$/.test(e6[1]) ? parseInt(e6[1]) : 0, /^\d+$/.test(e6[2]) ? parseInt(e6[2]) : -1, o2];
      } else if ("reset" === i3) if (0 === c2) a2.untilRange = [0, 0, 1], a2.pitch = 0;
      else {
        if (c2 !== r2.length - 1) return new cr(t3.line, u2, t3.token, "Bend 'reset' can only be specified at the beginning or end.");
        a2.untilRange = [-2, -2, 1], a2.pitch = 0;
      }
      else if (/^(-|\+)?(\d+)(\.\d+)?$/.test(i3)) {
        const e6 = parseFloat(i3);
        if (-2 > e6 || e6 > 2) return new cr(t3.line, u2, t3.token, `Invalid bend pitch '${e6}'. Pitch can be set from -2 to 2.`);
        a2.pitch = e6;
      } else if (/^(ast|tri)$/.test(i3)) a2.curve = "try" === i3 ? Vi.tri : Vi.ast;
      else if ("vib" === i3) l2 = 1, a2.method = Xi.vib;
      else if (/^tpl::/.test(i3)) a2.template = i3;
      else if ("cho" !== i3) return new cr(t3.line, u2, t3.token, `Wrong way to bend property '${i3}'`);
      u2 += n3.length;
    }
    if (a2.template) {
      if (a2.untilRange || a2.curve || a2.cycle || a2.pitch || i2.length > 0) return new cr(t3.line, n2, e3, "Bend templates cannot overlap with other settings.");
    } else a2.untilRange || (0 === o2 && (o2 = 8), a2.untilRange = a2.method === Xi.vib ? [0 > s2 ? 0 : s2, -1, o2] : [0, -1, o2]);
    if (void 0 === a2.method && void 0 === a2.pitch && (a2.pitch = 1), 0 !== c2 && -2 !== a2.untilRange[0]) {
      if (-1 === s2) return new cr(t3.line, u2, t3.token, `The previous specification has already specified the end. '${t3.token}'`);
      s2 > a2.untilRange[0] && (a2.untilRange[0] = s2);
    }
    s2 = a2.untilRange[1], i2.push(a2), c2++;
  }
  return new ir(i2);
}
function $e(e3, t2, n2, i2) {
  let r2 = e3.trim();
  const o2 = { line: n2, linePos: i2, row: r2 };
  if (!/\D/.test(r2)) {
    const t3 = Ne(e3, n2, i2);
    return t3.fail() ? t3 : (o2.type = 1, o2.beforeBPM = t3.res, new ir(o2));
  }
  if (/^(-|\+)\d+$/.test(r2)) return new cr(n2, i2, e3, `Invalid bpm token '${e3}'. If you use +- signs, start with '..'.
e.g. bpm(120..-10)`);
  const s2 = r2.match(/\s*(\.\.)\s*?([+-])?(\d+)$/);
  s2 && (o2.type = s2[1] ? 2 : 1, s2[2] && (o2.afterSign = "+" === s2[2] ? 1 : -1), o2.afterBPM = parseInt(s2[3]), r2 = r2.replace(/\s*(\.\.)\s*?[+-]?\d+$/, ""));
  const c2 = r2.match(/^(\+|-)?(\d+)$/);
  return c2 && (o2.type = 3, c2[1] && (o2.beforeSign = "+" === c2[1] ? 1 : -1), o2.beforeBPM = parseInt(c2[2]), r2 = r2.replace(/^(\+|-)?(\d+)$/, "")), 2 !== o2.type && 3 !== o2.type || t2 === An.closingCurlyBrace ? "" !== r2 ? new cr(n2, i2, r2, `Invalid BPM format '${r2}'. e.g. bpm(100..200) or bpm(-20..+20) or bpm(140) etc..`) : new ir(o2) : new cr(n2, i2, e3, `Invalid set position transition bpm '${e3}'. Transition BPM cannot be specified for a single note.`);
}
function Ne(e3, t2, n2) {
  if (e3 = e3.trim(), /[^\d]/.test(e3)) return new cr(t2, -1, null, `Invalid BPM '${e3}', The entered value is outside the accepted range of ${Zi.minBPM}-${Zi.maxBPM}. Please enter a value within this range.`);
  const i2 = parseInt(e3);
  return Zi.minBPM > i2 || i2 > Zi.maxBPM || isNaN(i2) ? new cr(t2, n2, e3, `Invalid BPM '${e3}', The entered value is outside the accepted range of ${Zi.minBPM}-${Zi.maxBPM}. Please enter a value within this range.`) : new ir(i2);
}
function Ae(e3, t2, n2) {
  const i2 = {};
  if ("" === e3) return new cr(t2, n2, e3, "'delay' properties need to be set.");
  if (!/^\d+\/\d+$/.test(e3)) return new cr(t2, n2, e3, `Invalid delay property '${e3}'.`);
  {
    const r2 = Te(e3, t2, n2);
    if (r2.fail()) return r2;
    i2.startUntil = r2.res;
  }
  return 0 === i2.startUntil[0] ? new cr(t2, n2, e3, `Invalid delay property '${e3}'. Molecule cannot be specified as 0.`) : i2.startUntil[0] > i2.startUntil[1] ? new cr(t2, n2, e3, `Invalid delay property '${e3}'. Make the numerator smaller than the denominator because it exceeds the range.`) : new ir(i2);
}
function Se(e3, t2, n2) {
  const i2 = {}, r2 = function(e4, t3, n3) {
    const i3 = [];
    let r3 = "", o3 = t3, s3 = 0, c3 = 0;
    const a3 = () => {
      i3.push({ token: r3, line: s3 + e4, pos: o3 }), o3 += r3.length;
    };
    let u3 = 0;
    const f3 = n3.length;
    for (; f3 > u3; ) {
      const e5 = n3[u3];
      switch (e5) {
        case " ":
          c3 ? r3 += e5 : r3.length && (a3(), r3 = ""), o3++;
          break;
        case "\n":
          c3 ? r3 += e5 : (r3.length && (a3(), r3 = ""), s3++, o3 = 0), o3++;
          break;
        case "(":
          c3++, r3 += e5;
          break;
        case ")":
          c3--, r3 += e5;
          break;
        default:
          r3 += e5;
      }
      u3++;
    }
    return r3.length && a3(), i3;
  }(t2, n2 + 4, e3);
  let o2 = "";
  for (const e4 of r2) {
    const r3 = e4.token, s3 = e4.line, c3 = e4.pos, a3 = r3.match(/^([CDEFGAB](?:#|b)?)(m|M)?$/);
    if (a3) a3[1] && (i2.tonic = de(a3[1])), "m" === a3[2] ? i2.tonal = xn.minor : "M" === a3[2] && (i2.tonal = xn.major);
    else {
      if (/^[CDEFGAB](#|b)?:[01]+$/.test(r3)) return new lr(t2, n2, r3, `CustomScale Not Allowed. '${r3}'`);
      if (/^\d+th$/.test(r3)) {
        const e5 = parseInt(r3.replace(/th$/, ""));
        if (o2 === xn.major || o2 === xn.minor || o2 === Sn.harmonic || o2 === Sn.melodic) {
          if (7 !== e5 && 6 !== e5) return new cr(s3, c3, r3, `Invalid shift order '${r3}'. Set numerical values with 'th' for tonality to 6 or 7; however, note that some sequences are not supported.
e.g. minor 6th`);
          i2.tonalShift = e5;
        } else {
          if ("mode" !== o2) return new cr(s3, c3, r3, `Invalid token '${r3}'. Set numerical values with 'th' after 'major', 'minor', 'mode'.
e.g. harmonic minor 7th mode 5th`);
          if (1 > e5 || e5 > 7) return new cr(s3, c3, r3, `Invalid shift order '${r3}'. Must be an integer with a value between 1 and 7.`);
          i2.modalShift = e5;
        }
      } else switch (r3) {
        case "mode":
          o2 = r3;
          break;
        case Sn.harmonic:
        case Sn.melodic:
          i2.scale = r3;
          break;
        case xn.major:
        case xn.minor:
          i2.tonal = r3;
          break;
        default:
          return new cr(s3, c3, r3, `'${r3}' is an invalid token that cannot be set as a key.
e.g. C# melodic minor 7th mode 3th`);
      }
    }
    o2 = r3;
  }
  if (i2.scale && !i2.tonal) return new cr(t2, n2, i2.scale, `Invalid order '${i2.scale}. 'minor' or 'major' is required after '${i2.scale}'.
e.g. harmonic minor 7th mode 5th`);
  i2.tonic || (i2.tonic = $r.C), i2.scale || (i2.scale = Sn.normal), i2.tonal || (i2.tonal = xn.major);
  const s2 = `${i2.scale} ${i2.tonal} ${c2 = i2.tonalShift, c2 ? c2 + "th" : ""}`.trim();
  var c2;
  const a2 = Ar(s2);
  if (!a2) return new cr(t2, n2, s2, `Invalid scale combination '${s2}'.`);
  i2.modalShift && (a2.evolvedCodePrefix = we(a2.evolvedCodePrefix, i2.modalShift - 1), a2.bin = we(a2.bin, function(e4, t3) {
    const n3 = e4.map((e5, t4) => 1 === e5 ? t4 : -1).filter((e5) => -1 !== e5);
    return t3 > n3.length ? -1 : n3[t3 - 1];
  }(a2.bin, i2.modalShift))), i2.diatonicEvolverValue = a2;
  const u2 = Me(er.iKey, i2.tonic), f2 = u2.map((e4, t3) => 1 === a2.bin[t3] ? e4 : null).filter((e4) => null !== e4);
  return i2.sys = { shiftedKeyArray: u2, note7array: f2 }, new ir(i2);
}
function xe(e3, t2, n2) {
  const i2 = [];
  if (!/\S/.test(e3)) return new cr(t2, n2, "map", "Invalid map syntax. Symbol must be specified for map.");
  const r2 = ke(t2, n2, e3, [","]);
  for (let t3 = 0; r2.length > t3; t3++) {
    const n3 = r2[t3], o2 = [];
    let s2 = 0;
    const c2 = n3.token.match(/((?:-|\+)?\d+)\.\.((?:-|\+)?\d+)(?:\s*step\s*(\d+))?\s*/);
    c2 && (n3.token = n3.token.replace(c2[0], ""));
    const a2 = n3.token.match(/((?:-|\+)?\d+)\s*step\s*((?:-|\+)?\d+)\s*\*\s*((?:-|\+)?\d+)\s*/);
    a2 && (n3.token = n3.token.replace(a2[0], ""));
    const u2 = n3.token.match(/^(\d+)?\s*\*\s*(\d+)$/);
    if (u2 && (n3.token = n3.token.replace(u2[0], "")), "" !== n3.token) {
      const t4 = n3.token.split(/\s+/);
      for (let i3 = 0; t4.length > i3; i3++) {
        const r3 = t4[i3];
        if (Qi.includes(r3)) o2.push(Yi[r3]);
        else {
          if (!/^(\+|-)?\d+$/.test(r3)) return new cr(n3.line, n3.pos, e3, `Invalid Mapping token '${r3}'.
e.g. 3 ss, -2..+2 rev etc..`);
          s2 = parseInt(r3);
        }
      }
    }
    if (u2) {
      const e4 = void 0 === u2[1] ? 0 : parseInt(u2[1]), t4 = parseInt(u2[2]);
      if (t4 > Zi.maxMappedStepOrder) return new cr(n3.line, n3.pos, u2[0], `Invalid map prop '${u2[0]}'. The coefficient limit for this specification is ${Zi.maxMappedStepOrder}.`);
      for (let r3 = 0; t4 > r3; r3++) i2.push({ shift: e4, options: o2, location: { row: n3.token, line: n3.line, linePos: n3.pos } });
    } else if (a2) {
      const e4 = parseInt(a2[1]), t4 = parseInt(a2[2]), r3 = parseInt(a2[3]);
      if (1 > r3) return new cr(n3.line, n3.pos, a2[0], `Invalid Mapping token '${a2[0]}'. Coefficient cannot be less than or equal to zero.
e.g. map(1 step 2 * 3)`);
      if (r3 > Zi.maxMappedStepOrder) return new cr(n3.line, n3.pos, a2[0], `Invalid map order '${a2[0]}'. The coefficient limit for this specification is ${Zi.maxMappedStepOrder}.`);
      let s3 = e4;
      for (let e5 = 0; r3 > e5; e5++) {
        const e6 = { shift: s3, options: o2, location: { row: n3.token, line: n3.line, linePos: n3.pos } };
        s3 += t4, i2.push(e6);
      }
    } else if (c2) {
      const e4 = parseInt(c2[1]), t4 = parseInt(c2[2]);
      let r3 = void 0 !== c2[3] && /^[1-9]/.test(c2[3]) ? parseInt(c2[3]) : 1;
      if (r3 = e4 > t4 ? -Math.abs(r3) : Math.abs(r3), Math.abs(e4 - t4) >= Zi.maxMappedStepOrder) return new cr(n3.line, n3.pos, c2[0], `Invalid map order '${c2[0]}'. Step count range is up to ${Zi.maxMappedStepOrder}.`);
      for (let s3 = e4; r3 > 0 ? t4 >= s3 : s3 >= t4; s3 += r3) i2.push({ shift: s3, options: o2, location: { row: n3.token, line: n3.line, linePos: n3.pos } });
    } else i2.push({ shift: s2, options: o2, location: { row: n3.token, line: n3.line, linePos: n3.pos } });
  }
  return new ir(i2);
}
function Ie(e3, t2, n2) {
  const i2 = e3.split("|"), r2 = i2.find((e4) => "" === e4 || !/^[CDEFGAB](#|b)?$/.test(e4));
  if (r2 || "" === r2) return new cr(t2, n2, e3, `Invalid tuning '${r2}', tuning supports only ${er.iKey.map((e4) => `'${e4}'`)}.` + (/^\||\|$/.test(e3) ? "\nPlease set without '|' on both sides." : "") + "\ne.g. D|A|D|G|A|D or C#|A|D|G|B|E or C#|F#|B|E|A|D|G|B|E");
  if (6 > i2.length || i2.length > Zi.maxBows) return new cr(t2, n2, e3, `Invalid tuning '${i2.join("|")}'. The number of strings that can be set ranges from 6 to ${Zi.maxBows}.`);
  const o2 = i2.map((e4) => me(e4)), s2 = be(o2);
  for (let i3 = 1; s2.length > i3; i3++) if (s2[i3] > s2[i3 - 1]) return new cr(t2, n2, e3, `Invalid tuning ${e3}.
The treble strings cannot be lower than the bass strings.
e.g. C#|F#|B|E|A|D|G|B|E`);
  return new ir(o2);
}
function Te(e3, t2, n2) {
  if (!/^\d+\/\d+$/.test(e3)) return new cr(t2, n2, e3, `Invalid token '${e3}'. specify A as a fraction. e.g. 1/4`);
  const i2 = e3.split("/").map((e4) => parseInt(e4.trim()));
  return i2[0] > Zi.maxUntilNext0 ? new cr(t2, n2, e3, `Invalid token '${i2.join("/")}', numerator value '${i2[0]}' exceeds the allowed maximum of ${Zi.maxUntilNext0}.`) : i2[1] > Zi.maxUntilNext1 || 1 > i2[1] ? new cr(t2, n2, e3, `Invalid token '${i2.join("/")}', The entered value is outside the accepted range of 1-${Zi.maxUntilNext1}. Please enter a value within this range.`) : new ir(i2);
}
function Ce(e3, t2, n2) {
  const i2 = {};
  if ("" === e3) return new cr(t2, n2, e3, "staccato requires property");
  if (!/^\d+\/\d+$/.test(e3)) return new cr(t2, n2, e3, `Invalid staccato property '${e3}'.`);
  {
    const r2 = Te(e3, t2, n2);
    if (r2.fail()) return r2;
    i2.cutUntil = r2.res;
  }
  return 0 === i2.cutUntil[0] ? new cr(t2, n2, e3, `Invalid staccato property '${e3}'. Molecule cannot be specified as 0.`) : i2.cutUntil[0] > i2.cutUntil[1] ? new cr(t2, n2, e3, `Invalid staccato property '${e3}'. Make the numerator smaller than the denominator because it exceeds the range.`) : new ir(i2);
}
function je(e3, t2, n2, i2, r2, o2) {
  if (!/\S/.test(i2)) return new cr(r2, n2, t2, "Invalid step syntax. Symbol must be specified for step.");
  const s2 = function(e4, t3, n3, i3) {
    let r3 = n3, o3 = i3 - 1, s3 = n3, c3 = i3 - 1;
    const a3 = [];
    let u3 = 0, f2 = "", l2 = "";
    for (const n4 of t3) if ("\n" !== n4) if (c3++, /\s/.test(n4)) l2 += " ";
    else {
      if (!/[.MmnDdUuf123456789rRN~^=()]/.test(n4)) return new cr(s3, c3, n4, `Invalid step symbol '${n4}'. Only '.MmnDdUuf123456789rR' can be used with step.`);
      if (/\d/.test(n4) && parseInt(n4) > e4.length) return new cr(s3, c3, n4, `Invalid pos value '${n4}'. The string specification exceeds the number of strings specified in tuning ${e4.length} strings.`);
      if ("(" !== n4) if (")" !== n4) if ("" === f2) r3 = s3, o3 = c3, f2 += n4, l2 += n4;
      else if (u3) f2 += n4, l2 += n4;
      else if (/m|M|n|N|~|=|\^|\./.test(n4)) {
        if ("" === f2) return new cr(s3, c3, n4, `Invalid step symbol '${n4}'. Instrument specification cannot be at the beginning.`);
        f2 += n4, l2 += n4;
      } else a3.push({ sym: f2, startLine: r3, startPos: o3, endPos: o3 + l2.trim().length }), f2 = n4, l2 = n4, r3 = s3, o3 = c3;
      else {
        if ("" === f2) return new cr(s3, c3, n4, `Invalid step symbol '${n4}'. Parentheses must specify a symbol.`);
        if (/^(~|=|\^|\.)/.test(f2)) return new cr(s3, c3, n4, `Invalid step symbol '${f2}'.. Instrument specification cannot be at the beginning.`);
        u3 = 0, a3.push({ sym: f2, startLine: r3, startPos: o3, endPos: o3 + l2.trim().length }), f2 = "", l2 = "";
      }
      else {
        if (u3) return new cr(s3, c3, n4, `Invalid pos value '${n4}'. Parentheses can only be one level deep.`);
        "" !== f2 && (a3.push({ sym: f2, startLine: r3, startPos: o3, endPos: o3 + l2.trim().length }), f2 = "", l2 = ""), u3 = 1;
      }
    }
    else u3 || "" === f2 || (a3.push({ sym: f2, startLine: r3, startPos: o3, endPos: o3 + l2.trim().length }), f2 = "", l2 = ""), s3++, c3 = 0;
    return "" !== f2 && a3.push({ sym: f2, startLine: r3, startPos: o3, endPos: o3 + l2.trim().length }), new ir(a3);
  }(e3, i2, r2, o2);
  if (s2.fail()) return s2;
  const c2 = { parsedStep: [] }, a2 = [], u2 = Array.from({ length: e3.length }, (e4, t3) => t3);
  for (let e4 = 0; s2.res.length > e4; e4++) {
    const t3 = s2.res[e4].sym, n3 = { line: s2.res[e4].startLine, startPos: s2.res[e4].startPos, endPos: s2.res[e4].endPos }, f2 = t3.match(/\d/g);
    if (/f|D|d|U|u/.test(t3)) n3.stringIndexes = u2;
    else if (/R|rn/.test(t3)) n3.stringIndexes = void 0, n3.inst = zi.restNoise;
    else if (/r/.test(t3)) n3.stringIndexes = void 0, n3.inst = zi.rest;
    else {
      if (!f2) return new cr(r2, o2, i2, `Invalid step symbol '${i2}'. Specification violation.`);
      n3.stringIndexes = f2.map((e5) => parseInt(e5) - 1);
    }
    const l2 = t3.replace(/rn/, "").match(/[nmMDdUuN]/g);
    if (l2) {
      if (l2.length > 1) return new cr(r2, o2, i2, `Invalid step symbol '${l2.join("")}'. Multiple inst specifications cannot be specified for one string.`);
      n3.inst = { n: zi.normal, m: zi.mute, M: zi.muteContinue, D: zi.brushing_D, d: zi.brushing_d, U: zi.brushing_U, u: zi.brushing_u, N: zi.normalUnContinueForStep }[l2[0]];
    }
    const d2 = t3.replace(/[fnmMDdUu]/g, "").replace(/\./g, "~").match(/[~^=]+/g);
    d2 && (n3.suffix = d2[0]), a2.push(t3), n3.stepSym = [...a2], c2.parsedStep.push(n3);
  }
  return new ir(c2);
}
function Oe(e3, t2, n2, i2) {
  const r2 = {};
  if ("" !== t2) {
    const e4 = t2.split(",");
    for (const o2 of e4) if (/\D/.test(o2)) {
      if (!/^\d+\/\d+$/.test(o2)) return new cr(n2, i2, t2, `Invalid strum property '${o2}'.`);
      {
        const e5 = Te(o2, n2, i2);
        if (e5.fail()) return e5;
        r2.startUntil = e5.res;
      }
    } else {
      const e5 = parseInt(o2);
      if (0 > e5 || e5 > Zi.maxStrumWidthMSec) return new cr(n2, i2, t2, `Invalid strum msec '${o2}'. Strum must be between 0 and ${Zi.maxStrumWidthMSec}.`);
      r2.strumWidthMSec = e5;
    }
  }
  return r2.startUntil && 0 === r2.startUntil[0] ? new cr(n2, i2, t2, `Invalid strum property '${t2}'. Molecule cannot be specified as 0.`) : r2.startUntil && r2.startUntil[0] > r2.startUntil[1] ? new cr(n2, i2, t2, `Invalid strum property '${t2}'. Make the numerator smaller than the denominator because it exceeds the range.`) : (r2.startUntil || (r2.startUntil = [0, 1]), r2.strumWidthMSec || (r2.strumWidthMSec = e3.settings.play.strum.defaultStrumWidthMSec), new ir(r2));
}
function Ee(e3, t2, n2, i2) {
  const r2 = {}, o2 = function(e4, t3, n3) {
    const i3 = [];
    if (!/\S/.test(n3)) return new ir(i3);
    let r3, o3 = "", s2 = 0, c2 = e4, a2 = t3, u2 = e4, f2 = t3, l2 = 0, d2 = 0, m2 = {};
    const h2 = (e5) => {
      let t4 = o3;
      if (/^\s*\(\s*/.test(o3)) {
        const e6 = function(e7, t5, n4) {
          const i4 = e7.split("\n");
          for (let e8 = 0; i4.length > e8; e8++) {
            const r4 = i4[e8].search(/[^\s(]/);
            if (-1 !== r4) {
              t5 += e8, n4 = r4 + (0 === e8 ? n4 : 1);
              break;
            }
          }
          return { line: t5, pos: n4 };
        }(o3, u2, f2);
        u2 = e6.line, f2 = e6.pos, t4 = o3.replace(/^\s*\(\s*(.+?)\s*\)\s*$/, "$1");
      } else t4 = o3.replace(/^\s*(.+?)\s*$/, "$1");
      if (0 === e5) {
        if (!/\S/.test(t4)) return void (r3 = new cr(u2, f2, t4, "key required."));
        if (/\s/.test(t4)) return void (r3 = new cr(u2, f2, t4, `Invalid token '${t4.replace(/\s/, " ")}'. key is separated.`));
        m2.key = { token: t4, line: u2, pos: f2 };
      } else {
        if (!/\S/.test(t4)) return void (r3 = new cr(u2, f2, t4, "Value required."));
        if (!m2.key) return void (r3 = new cr(u2, f2, t4, "Required in key-value format."));
        m2.val = { token: t4, line: u2, pos: f2 }, i3.push(m2), m2 = {};
      }
      f2 = a2, u2 = c2, o3 = "";
    }, v2 = n3.replace(/(\s*,\s*)+$/, ""), b2 = v2.length;
    for (; b2 > s2; ) {
      const e5 = v2[s2];
      switch (e5) {
        case "\n":
          l2 || (/\S/.test(o3) ? (h2(1), d2 = 0) : (u2++, f2 = 1)), a2 = 1, c2++, o3 += e5;
          break;
        case ":":
          if (l2) o3 += e5;
          else {
            if (1 === d2) {
              r3 = new cr(c2, a2, o3, "Wrong order of value.");
              break;
            }
            h2(0), d2 = 1;
          }
          break;
        case ",":
          if (l2) o3 += e5;
          else {
            if (0 === d2) {
              r3 = new cr(c2, a2, o3, "Wrong order of key.");
              break;
            }
            h2(1), d2 = 0;
          }
          break;
        case "(":
          l2++, o3 += e5;
          break;
        case ")":
          l2--, o3 += e5;
          break;
        case " ":
          /\S/.test(o3) || f2++, o3 += e5;
          break;
        default:
          o3 += e5;
      }
      a2++, s2++;
    }
    return /\S/.test(o3) && h2(1), 0 === d2 && /,\s+$/.test(n3) ? new cr(e4, t3, n3, 'Syntax Error By Style. The final "," is not allowed.') : m2.key && !m2.val ? new cr(m2.key.line, m2.key.pos, m2.key.token, `value of '${m2.key.token}' not found.`) : r3 || new ir(i3);
  }(n2, i2 + 4, t2);
  if (o2.fail()) return o2;
  for (let t3 = 0; o2.res.length > t3; t3++) {
    const n3 = o2.res[t3];
    switch (n3.key.token) {
      case "L":
      case "loc":
      case "location": {
        const e4 = { low: 1, mid: 2, high: 3, higher: 4 }[n3.val.token];
        if (void 0 === e4) return new cr(n3.val.line, n3.val.pos, n3.key.token, `Invalid pos.${n3.key.token} value '${n3.val.token}'. Possible values are 'low', 'mid', 'high', or 'higher'.`);
        r2.location = e4;
        break;
      }
      case "I":
      case "inv":
      case "inversion":
        if (/[^12345]/.test(n3.val.token)) return new cr(n3.val.line, n3.val.pos, n3.val.token, `>>>Invalid pos.${n3.key.token} value '${n3.val.token}'. ${n3.key.token} must be between 1 and 5.`);
        r2.inversion = parseInt(n3.val.token);
        break;
      case "E":
      case "exc":
      case "exclusion":
        if (/^[\s\d,]+$/.test(n3.val.token)) {
          n3.val.token = n3.val.token.replace(/\s|,/g, "");
          const t4 = n3.val.token.split("").map((t5) => {
            const n4 = parseInt(t5);
            return n4 > e3.length ? -1 : n4;
          });
          if (t4.includes(-1)) return new cr(n3.val.line, n3.val.pos, n3.val.token, `strings '${n3.val.token}' don't exist.`);
          r2.exclusion = t4;
          break;
        }
        return new cr(n3.val.line, n3.val.pos, n3.val.token, `Invalid pos.${n3.key.token} value '${n3.val.token}'. ${n3.key.token} must be 1 or 5.`);
      case "U":
      case "use":
      case "useStrings":
        if (/^[\s\d,]+$/.test(n3.val.token)) {
          if (n3.val.token = n3.val.token.replace(/\s|,/g, ""), n3.val.token.length > e3.length) return new cr(n3.val.line, n3.val.pos, n3.val.token, "over length: " + n3.val.token);
          const t4 = n3.val.token.split("").map((t5) => {
            const n4 = parseInt(t5);
            return n4 > e3.length ? -1 : n4;
          });
          if (t4.includes(-1)) return new cr(n3.val.line, n3.val.pos, n3.val.token, `strings ''${n3.val.token}'' don't exist..`);
          r2.useStrings = t4.sort();
        } else {
          if ("full" !== n3.val.token && "f" !== n3.val.token) return new cr(n3.val.line, n3.val.pos, n3.val.token, `Invalid pos.${n3.key.token} value '${n3.val.token}'.`);
          r2.useStrings = e3.map((e4, t4) => t4 + 1);
        }
        break;
      case "R":
      case "req":
      case "required":
        if (/^[\s\d,]+$/.test(n3.val.token)) {
          if (n3.val.token = n3.val.token.replace(/\s|,/g, ""), n3.val.token.length > e3.length) return new cr(n3.val.line, n3.val.pos, n3.val.token, `strings '''${n3.val.token}''' don't exist.`);
          const t4 = n3.val.token.split("").map((t5) => {
            const n4 = parseInt(t5);
            return n4 > e3.length ? -1 : n4;
          });
          if (t4.includes(-1)) return new cr(n3.val.line, n3.val.pos, n3.val.token, `strings ''''${n3.val.token}'''' don't exist.`);
          r2.required = t4.sort();
        } else {
          if ("full" !== n3.val.token && "f" !== n3.val.token) return new cr(n3.val.line, n3.val.pos, n3.val.token, `Invalid pos.${n3.key.token} value '${n3.val.token}'.`);
          r2.required = e3.map((e4, t4) => t4 + 1);
        }
        break;
      case "C":
      case "cov":
      case "cover": {
        const e4 = { true: 0, false: 1, error: 2, err: 2, warn: 3, warning: 3 }[n3.val.token];
        if (void 0 === e4) return new cr(n3.val.line, n3.val.pos, n3.val.token, `Invalid pos.${n3.key.token} value '${n3.val.token}'. Possible values are 'true', 'false', 'warn', or 'error'.`);
        r2.cover = e4;
        break;
      }
      default:
        return new cr(n3.key.line, n3.key.pos, n3.key.token, `Unknown pos key '${n3.key.token}'.`);
    }
  }
  return Object.keys(r2).length ? new ir(r2) : new cr(n2, i2, t2, "'pos' properties need to be set.");
}
function De(e3, t2, n2) {
  const i2 = {}, r2 = ke(t2, n2 + 3, e3, ["!", ",", "."]);
  for (const e4 of r2) if (/^\d+\/\d+$/.test(e4.token)) {
    const t3 = Te(e4.token, e4.line, e4.pos);
    if (t3.fail()) return t3;
    i2.until = t3.res;
  } else if ("off" === e4.token) i2.off = 1;
  else {
    if ("up" !== e4.token) return new cr(e4.line, e4.pos, e4.token, `The stroke property '${e4.token}' is invalid.
e.g. ## stroke(1/8) or stroke(1/8.up) or stroke(off) etc..`);
    i2.up = 1;
  }
  return new ir(i2);
}
function Be(e3, t2, n2) {
  const i2 = {}, r2 = ke(t2, n2, e3, [",", " "]);
  for (let t3 = 0; r2.length > t3; t3++) {
    const n3 = r2[t3];
    if (/^[CDEFGAB](#|b)?$/.test(n3.token)) i2.key = me(n3.token);
    else if (Sr.includes(n3.token)) i2.scale = Sr.indexOf(n3.token), i2.bin = xr[i2.scale].bin;
    else {
      if (!/^\d+$/.test(n3.token)) return new cr(n3.line, n3.pos, e3, `Invalid scale token '${n3.token}'.
e.g. E dorian`);
      if (!/^[01]+$/.test(n3.token)) return new cr(n3.line, n3.pos, e3, `Invalid scale token '${n3.token}'. Customize scale to shape "1" and "0".
e.g. E 101101011010`);
      if (12 !== n3.token.length) return new cr(n3.line, n3.pos, e3, `Invalid scale token '${n3.token}'. Customize the scale to 12 digits.
e.g. E 101101011010`);
      i2.scale = n3.token, i2.bin = n3.token.split("").map((e4) => "1" === e4 ? 1 : 0);
    }
  }
  return i2.key ? void 0 === i2.scale ? new cr(t2, n2, e3, `Invalid scale token '${e3}'. Scales need scale name.
e.g. E minor`) : new ir(i2) : new cr(t2, n2, e3, `Invalid scale token '${e3}'. Scales need keys.
e.g. E minor`);
}
function Fe(e3, t2, n2, i2) {
  const r2 = {}, o2 = ke(t2, n2 - 2, e3, ["!", ","]);
  for (const e4 of o2) {
    if (/^\d+\/\d+$/.test(e4.token)) {
      const t4 = Te(e4.token, e4.line, e4.pos);
      if (t4.fail()) return t4;
      r2.startUntil = t4.res;
      continue;
    }
    const t3 = e4.token.match(/^(fast|mid|slow)(?:\.?(\d+))?$/);
    if (t3) {
      r2.inSpeed = t3[1], t3[2] && (r2.inSpeedLevel = parseInt(t3[2]));
      continue;
    }
    const n3 = e4.token.match(/^(hi|low)(?:\.?(\d+))?$/);
    if (n3) r2.type = "release", r2.arrow = "hi" === n3[1] ? 1 : -1, n3[2] && (r2.releaseWidth = parseInt(n3[2]));
    else if ("continue" !== e4.token) {
      if ("auto" !== e4.token) return new cr(e4.line, e4.pos, e4.token, `The slide property '${e4.token}' is invalid because it is an unknown word.`);
      r2.auto = 1;
    } else r2.continue = 1;
  }
  return r2.type || (r2.type = "to"), r2.startUntil || (r2.startUntil = r2.arrow ? [6, 8] : [1, 2], "to" === r2.type && (r2.auto = 1)), r2.inSpeedLevel || (r2.inSpeedLevel = 48), i2 && (r2.continue = 1), r2.continue && "release" === r2.type && (r2.continue = void 0), new ir(r2);
}
function Le(e3, t2, n2, i2, r2) {
  const o2 = t2.split(/[|,]/).map((t3, n3) => {
    const i3 = t3.trim();
    return "" === i3 ? e3.settings.play.velocities[n3] : /^\d+$/.test(i3) ? parseInt(i3) : NaN;
  }).reverse();
  return o2.some((e4) => void 0 !== e4 && (e4 > 100 || 0 > e4 || isNaN(e4))) ? new cr(i2, r2, t2, `Invalid velocities value '${t2}'. Must be an integer with a value between 0 and 100.`) : o2.length > n2.length ? new cr(i2, r2, t2, `Invalid velocity value '${t2}'. 
You cannot specify more than the number of strings. Please set the number of strings using "set.turning".
e.g. for 7 strings it is "set.turning: D|E|A|D|G|B|E"`) : new ir(o2);
}
function Ge(e3, t2, n2) {
  const i2 = parseInt(e3.replace(/^\s/g, ""));
  return i2 > 100 || !/^s*\d+\s*$/.test(e3) ? new cr(t2, n2, e3, `Invalid velocity value '${e3}'. Must be an integer with a value between 0 and 100.`) : new ir(i2 || 1);
}
function _e(e3) {
  const t2 = e3.token;
  if (/^([./!']+)?([|\dr]+(!\d+)?>>)/.test(e3.token)) {
    const t3 = e3.token.match(/^([./!']+)?([|\dr]+)(!\d+)?>>/);
    if (t3) {
      if (/r/.test(t3[2])) return new cr(e3.line, e3.linePos, e3.token, "The rest 'r' cannot be specified for the approach.");
      e3.styles.push(`approach(${t3[2] + (t3[3] ? t3[3] : "")})`), e3.linesOfStyle.push(e3.line), e3.linePosOfStyle.push(e3.linePos + (t3[1] ? t3[1].length : 0)), e3.token = e3.token.replace(/^([./!']+)?[|\dr]+(!\d+)?>>/, "$1");
    }
  }
  if (/^([/!']+)?\.\./.test(e3.token) && (e3.styles.push("continue"), e3.linesOfStyle.push(e3.line), e3.linePosOfStyle.push(e3.linePos), e3.token = e3.token.replace(/^([/!']+)?\.\./, "$1")), /^'*?\//.test(e3.token) && (e3.styles.push("strum"), e3.linesOfStyle.push(e3.line), e3.linePosOfStyle.push(e3.linePos), e3.token = e3.token.replace(/^('*?)\//, "$1")), /^!?('+)/.test(e3.token) || /^!('+)?/.test(e3.token)) {
    const t3 = e3.token.match(/^(!)?('*)/);
    if (t3) {
      const n2 = t3[2].split("").length;
      if (n2 > 8) return new cr(e3.line, e3.linePos, e3.token, "The prefix >>'<< that specifies stroke cannot exceed 8.");
      const i2 = [16, 12, 8, 6, 4, 3, 2, 1][n2 - 1];
      e3.styles.push(`stroke(${i2 ? "1/" + i2 : ""}${t3[1] ? ".up" : ""})`), e3.linesOfStyle.push(e3.line), e3.linePosOfStyle.push(e3.linePos), e3.token = e3.token.replace(/^!?'*/, "");
    }
  }
  return /^[.!/>]/.test(e3.token) ? />/.test(e3.token) ? new cr(e3.line, e3.linePos, e3.token, `Invalid approach prefix ${t2}.
e.g. ||||2|2>>||||5|5 or ||||2|2!200>>||||5|5 etc..`) : /\.\.\./.test(t2) || /\./.test(e3.token) ? new cr(e3.line, e3.linePos, e3.token, `Invalid continue prefix '${t2}'. Continue dots are only valid for 2 connections.
e.g. ..|3|2|3|2`) : new cr(e3.line, e3.linePos, t2, `Invalid token prefix '${t2}'.
e.g. ..C or ''C or ..''|||2|2| or /|||2|2| or ||||2|2>>||||5|5 or ||||2|2!200>>||||5|5 etc..`) : (e3.prefixLength = t2.length - e3.token.length, or());
}
function Ue(e3, t2, n2, i2, r2) {
  const o2 = e3.marks.styleMappedGroupList, s2 = o2.findIndex((e4) => e4 > 0);
  let c2 = -1;
  if (o2[s2] > 0 ? (c2 = o2[s2] + 1, o2.splice(s2, 0, c2)) : (c2 = 1, o2.splice(1, 0, c2)), i2.decidedProp.noteStr.match(/\/$/)) return new cr(i2.line, i2.linePos, i2.decidedProp.noteStr, `Not found fret token. ${i2.decidedProp.noteStr}
e.g. 6/1-2-3`);
  const a2 = i2.decidedProp.noteStr.replace(/:.*?$/, "").match(/^(.*?)\d\/[^/]+$/);
  let u2 = 0;
  a2 && (u2 = a2[1].length);
  let f2 = 0, l2 = i2.linePos + u2;
  const [d2, m2] = i2.token.split("/"), h2 = parseInt(d2);
  if (1 > h2 || h2 > t2.length) return new cr(i2.line, l2, "" + h2, `Not Found strings '${h2}'. Only the tuning string can be specified.`);
  const v2 = t2.length - h2;
  l2 += d2.length + 1;
  const b2 = Object.keys(i2.decidedProp.styles), p2 = m2.replace(/-+$/, "").split("-");
  for (let e4 = 0; p2.length > e4; e4++) {
    const t3 = p2[e4];
    if ("" === t3) {
      l2++;
      continue;
    }
    const o3 = t3.match(/^(\d+|r|R)([nmMDdUu])?([~^=]+)?$/);
    if (!o3) return new cr(i2.line, l2, t3, `Invalid fret token option '${t3}'. Permitted frets include n,m,M,D,d,U,u,R,r, etc..
e.g. 2/4m-5-7-r-5-7`);
    const s3 = o3[1], a3 = "R" === s3 ? "R" : o3[2], u3 = o3[3], d3 = {};
    b2.forEach((t4) => {
      if (void 0 !== i2.decidedProp.styles[t4]) {
        switch (t4) {
          case "bd":
          case "bpm":
          case "until":
          case "degree":
          case "legato":
          case "scaleX":
          case "staccato":
          case "velocity":
          case "velocityPerBows":
          case "turn":
            d3[t4] = i2.decidedProp.styles[t4];
            break;
          case "mapped":
            d3[t4] = structuredClone(i2.decidedProp.styles[t4]), d3[t4].forEach((e5) => {
              -1 === e5.group && (e5.group = c2);
            });
        }
        if (0 === e4) switch (t4) {
          case "approach":
          case "continue":
          case "delay":
          case "strum":
            d3[t4] = i2.decidedProp.styles[t4];
        }
        e4 === p2.length - 1 && "slide" === t4 && (d3[t4] = i2.decidedProp.styles[t4]);
      }
    });
    const m3 = { n: zi.normal, m: zi.mute, M: zi.muteContinue, R: zi.restNoise, D: zi.brushing_D, d: zi.brushing_d, U: zi.brushing_U, u: zi.brushing_u }[a3];
    m3 === zi.restNoise && (d3.restNoise = 1), d3.inst = void 0 !== m3 ? m3 : void 0 !== i2.decidedProp.styles.inst ? i2.decidedProp.styles.inst : zi.normal, 0 === e4 || !i2.decidedProp.styles.continue || f2 || d3.inst !== zi.normal && d3.inst !== zi.muteContinue ? 0 !== e4 && (f2 = 1) : d3.continue = 1;
    const h3 = "|".repeat(v2) + ("R" === s3 ? "r" : s3) + (0 === v2 ? "|" : "") + (u3 || ""), y2 = structuredClone(i2.decidedProp.extensionViewProp) || {};
    y2.bullet = { row: t3, index: e4 };
    const w2 = { curlyLevel: i2.curlyLevel, type: An.note, typesStyle: [], line: i2.line, linePos: l2, linesOfStyle: [], linePosOfStyle: [], endLine: i2.line, endPos: l2 + t3.length, token: h3, styles: [], decidedProp: { noteStr: i2.decidedProp.noteStr, extensionViewProp: y2, list: void 0, tick: structuredClone(i2.decidedProp.tick), styles: d3, fingering: void 0, chordDicRef: i2.decidedProp.chordDicRef, isBullet: r2.num }, regionRegionForDualConnection: i2.regionRegionForDualConnection, locationInfoRefStackUpList: i2.locationInfoRefStackUpList };
    l2 += t3.length + 1, n2.push(w2);
  }
  return or();
}
function Re(e3, t2) {
  return t2 * (60 / e3) * (1 / Zi.PPS);
}
function qe(e3, t2) {
  return Zi.PPS * e3 / 60 * (t2 / 1e3);
}
function Ke(e3) {
  return Zi.PPS / e3[1] * e3[0];
}
function We(e3) {
  const t2 = function(e4, t3) {
    for (; 0 !== t3; ) {
      const n2 = e4;
      e4 = t3, t3 = n2 % t3;
    }
    return e4;
  }(e3[0], e3[1]);
  return [e3[0] / t2, e3[1] / t2];
}
function ze(e3, t2, n2, i2) {
  let r2 = 0;
  const o2 = t2.match(/[\^=~]+$/);
  if (o2) {
    if (o2[0].length > Zi.maxSuffixExtensionLength) return new cr(n2, i2, t2, `Invalid suffix extension token '${t2}'. Up to ${Zi.maxSuffixExtensionLength} suffix extensions can be used.`);
    const s2 = o2[0].match(/=/g);
    s2 && (e3[1] = 3 * e3[1] * s2.length);
    const c2 = o2[0].match(/~/g);
    c2 && (e3[0] = e3[0] * (c2.length + 1));
    const a2 = o2[0].match(/\^/g);
    a2 && (e3[1] = 2 * e3[1] * a2.length), [e3[0], e3[1]] = We(e3), r2 = 1;
  }
  return new ir(r2);
}
function Xe(e3, t2) {
  for (let n2 = 0; t2.length > n2; n2++) {
    const i2 = t2[n2];
    if (i2.type !== An.regionStart && (i2.type === An.degreeName || i2.type === An.note)) {
      const t3 = i2.decidedProp.styles;
      i2.decidedProp.tick = { untilNext: (t3 == null ? void 0 : t3.until) ? structuredClone(t3.until) : structuredClone(e3.regionList[i2.regionRegionForDualConnection].untilNext) };
      const n3 = ze(i2.decidedProp.tick.untilNext, i2.token, i2.line, i2.linePos);
      if (n3.fail()) return n3;
      n3.res && (i2.token = i2.token.replace(/[\^~=]+$/, ""));
    }
  }
  return or();
}
function Ve(e3, t2, n2) {
  const i2 = [];
  let r2 = e3.regionList.length - 1, o2 = e3.regionList[r2].tuning, s2 = 1;
  const c2 = {};
  for (let a2 = t2.length - 1; a2 >= 0; a2--) {
    const u2 = t2[a2];
    switch (u2.type) {
      case An.closingCurlyBrace: {
        const e4 = u2.styles.map((e5, t4) => {
          const n3 = le(e5);
          return { row: u2.styles[t4], line: u2.linesOfStyle[t4], linePos: u2.linePosOfStyle[t4], s: n3, g: n3.startsWith("bpm(") || n3.startsWith("turn") || n3.startsWith("map(") ? s2++ : 0 };
        }), t3 = e4.map((e5) => e5.g).filter((e5) => e5 > 0);
        e4.forEach((e5) => e5.g = e5.g > 0 ? t3.pop() : 0), i2.push(e4);
        break;
      }
      case An.openingCurlyBrace:
        i2.pop();
        break;
      case An.regionStart:
        r2--, 0 > r2 || (o2 = e3.regionList[r2].tuning);
        break;
      case An.bullet:
      case An.degreeName:
      case An.note: {
        let t3 = {};
        o2 = e3.regionList[u2.regionRegionForDualConnection].tuning;
        for (let e4 = 0; i2.length > e4; e4++) {
          const r3 = i2[e4];
          for (let e5 = r3.length - 1; e5 >= 0; e5--) {
            const i3 = r3[e5];
            let s3 = {};
            if (i3.g > 0) s3 = structuredClone(n2[`${"" + o2}_${i3.s}`]), (s3 == null ? void 0 : s3.bpm) ? s3.bpm.group = i3.g : (s3 == null ? void 0 : s3.turn) ? s3.turn.group = i3.g : (s3 == null ? void 0 : s3.mapped) && (s3.mapped[0].group = i3.g, c2[i3.g] = 1);
            else {
              let e6 = "";
              /^step/.test(i3.s) && (e6 = ":" + i3.line + ":" + i3.linePos), s3 = n2[`${"" + o2}_${i3.s}` + e6];
            }
            if (t3.mapped && s3.mapped) {
              if (s3.mapped[0].row = i3.row, s3.mapped[0].line = i3.line, s3.mapped[0].linePos = i3.linePos, t3.mapped.unshift(s3.mapped[0]), t3.mapped.reduce((e6, t4) => e6 * t4.style.length, 1) > Zi.maxMappedStepOrder) {
                const e6 = t3.mapped[t3.mapped.length - 1];
                return new cr(e6.line, e6.linePos || -1, e6.row || null, `Invalid mapped step order '${e6.row}'. The total number of nested map operations exceeds the limit of '${Zi.maxMappedStepOrder}'.`);
              }
            } else {
              const e6 = Object.keys(s3)[0];
              "object" != typeof s3[e6] || Array.isArray(s3[e6]) || (s3[e6].row = i3.row, s3[e6].line = i3.line, s3[e6].linePos = i3.linePos), t3 = { ...t3, ...s3 };
            }
          }
        }
        for (let e4 = u2.styles.length - 1; e4 >= 0; e4--) {
          let i3 = "";
          /^step/.test(u2.styles[e4]) && (i3 = ":" + u2.linesOfStyle[e4] + ":" + u2.linePosOfStyle[e4]);
          const r3 = structuredClone(n2[`${"" + o2}_${le(u2.styles[e4])}` + i3]);
          if (r3.mapped) {
            if (r3.mapped[0].row = u2.styles[e4], r3.mapped[0].line = u2.linesOfStyle[e4], r3.mapped[0].linePos = u2.linePosOfStyle[e4], c2[s2] = 1, r3.mapped[0].group = s2++, t3.mapped ? t3.mapped.unshift(r3.mapped[0]) : t3.mapped = [r3.mapped[0]], t3.mapped.reduce((e5, t4) => e5 * t4.style.length, 1) > Zi.maxMappedStepOrder) {
              const e5 = t3.mapped[t3.mapped.length - 1];
              return new cr(e5.line, e5.linePos || -1, e5.row || null, `Invalid mapped step order '${e5.row}'. The total number of nested map operations exceeds the limit of '${Zi.maxMappedStepOrder}'.`);
            }
          } else {
            const n3 = Object.keys(r3)[0];
            "object" != typeof r3[n3] || Array.isArray(r3[n3]) || (r3[n3].row = u2.styles[e4], r3[n3].line = u2.linesOfStyle[e4], r3[n3].linePos = u2.linePosOfStyle[e4]), t3 = { ...t3, ...r3 };
          }
        }
        u2.decidedProp.styles = t3;
      }
    }
  }
  return e3.marks.styleMappedGroupList = Object.keys(c2).map((e4) => parseInt(e4)).reverse(), or();
}
function Je(e3, t2, n2, i2) {
  let r2 = [];
  for (const o2 of n2) if (o2.type !== An.regionStart && (o2.decidedProp && /^\|(:.+)?$/.test(o2.decidedProp.noteStr) && o2.styles.push("0/1"), o2.styles.length)) {
    const n3 = o2.styles.length;
    for (let s2 = 0; n3 > s2; s2++) {
      r2 = t2.regionList[o2.regionRegionForDualConnection].tuning;
      const n4 = o2.styles[s2], c2 = le(n4);
      let a2 = "";
      /^step/.test(o2.styles[s2]) && (a2 = ":" + o2.linesOfStyle[s2] + ":" + o2.linePosOfStyle[s2]);
      const u2 = `${"" + r2}_${c2}` + a2;
      if (!i2[u2]) {
        switch (n4) {
          case "n":
            i2[u2] = { inst: zi.normal };
            break;
          case "m":
            i2[u2] = { inst: zi.mute };
            break;
          case "M":
            i2[u2] = { inst: zi.muteContinue };
            break;
          case "rn":
            i2[u2] = { inst: zi.restNoise, restNoise: 1 };
            break;
          case "d":
            i2[u2] = { inst: zi.brushing_d };
            break;
          case "D":
            i2[u2] = { inst: zi.brushing_D };
            break;
          case "u":
            i2[u2] = { inst: zi.brushing_u };
            break;
          case "U":
            i2[u2] = { inst: zi.brushing_U };
            break;
          case "N":
            i2[u2] = { inst: zi.normalUnContinueForStep };
            break;
          case "continue":
            i2[u2] = { continue: 1 };
            break;
          case "leg":
            i2[u2] = { legato: 1 };
        }
        if (i2[u2]) continue;
        if (n4.startsWith("approach")) {
          const e4 = Pe(n4.replace(/^approach\(|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 9, r2);
          if (e4.fail()) return e4;
          i2[u2] = { approach: e4.res };
          continue;
        }
        if (n4.startsWith("bd")) {
          const e4 = ge(n4.replace(/^bd\(?|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2]);
          if (e4.fail()) return e4;
          i2[u2] = { bd: e4.res };
          continue;
        }
        if (n4.startsWith("bpm")) {
          const e4 = $e(n4.replace(/^bpm\(|\)$/g, ""), o2.type, o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 4);
          if (e4.fail()) return e4;
          i2[u2] = { bpm: { style: e4.res, group: -1, groupEndTick: -1 } };
          continue;
        }
        if (n4.startsWith("delay")) {
          const e4 = Ae(c2.replace(/^delay\(?|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 0);
          if (e4.fail()) return e4;
          i2[u2] = { delay: e4.res };
          continue;
        }
        if (n4.startsWith("%(")) {
          const e4 = Se(n4.replace(/^(%)\(?|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] - 2);
          if (e4.fail()) return e4;
          i2[u2] = { degree: e4.res };
          continue;
        }
        if (n4.startsWith("degree(")) {
          const e4 = Se(n4.replace(/^(degree)\(?|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 3);
          if (e4.fail()) return e4;
          i2[u2] = { degree: e4.res };
          continue;
        }
        if (n4.startsWith("map")) {
          const e4 = xe(n4.replace(/^map\(|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 4);
          if (e4.fail()) return e4;
          i2[u2] = { mapped: [{ style: e4.res, group: -1, row: n4, line: o2.linesOfStyle[s2], linePos: o2.linePosOfStyle[s2] }] };
          continue;
        }
        if (n4.startsWith("pos")) {
          const e4 = Ee(r2, n4.replace(/^pos\(?|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2]);
          if (e4.fail()) return e4;
          Object.keys(e4.res).length && (i2[u2] = { pos: e4.res });
          continue;
        }
        if (/^scale\(.*?\)$/.test(n4)) {
          const e4 = Be(n4.replace(/^scale\(?|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 6);
          if (e4.fail()) return e4;
          i2[u2] = { scaleX: e4.res };
          continue;
        }
        if (/^to&($|\(.+?\))$/.test(n4)) {
          const e4 = Fe(n4.replace(/^to&\(?|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 6, 1);
          if (e4.fail()) return e4;
          i2[u2] = { slide: e4.res };
          continue;
        }
        if (/^to($|\(.+?\))$/.test(n4)) {
          const e4 = Fe(n4.replace(/^to\(?|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 5);
          if (e4.fail()) return e4;
          i2[u2] = { slide: e4.res };
          continue;
        }
        if (n4.startsWith("staccato")) {
          const e4 = Ce(c2.replace(/^staccato\(?|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 9);
          if (e4.fail()) return e4;
          i2[u2] = { staccato: e4.res };
          continue;
        }
        if (n4.startsWith("step")) {
          if (o2.type === An.bullet) return new cr(o2.linesOfStyle[s2], o2.linePosOfStyle[s2], o2.token, `Invalid style '${n4}'. Cannot specify a step in bullet format.`);
          const e4 = je(r2, n4, o2.linePosOfStyle[s2] + 1, n4.replace(/^step\(?|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 5);
          if (e4.fail()) return e4;
          i2[u2] = { step: e4.res };
          continue;
        }
        if (n4.startsWith("stroke")) {
          const e4 = De(c2.replace(/^stroke\(?|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 4);
          if (e4.fail()) return e4;
          i2[u2] = { stroke: e4.res };
          continue;
        }
        if (n4.startsWith("strum")) {
          const t3 = Oe(e3, c2.replace(/^strum\(?|\)$/g, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 6);
          if (t3.fail()) return t3;
          i2[u2] = { strum: t3.res };
          continue;
        }
        if (n4.startsWith("turn(") || "turn" === n4) {
          i2[u2] = { turn: { props: n4.replace(/^turn\(?|\)$/g, ""), group: -1 } };
          continue;
        }
        if (n4.startsWith("v(")) {
          const t3 = Le(e3, n4.replace(/v\(|\)$/g, ""), r2, o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 2);
          if (t3.fail()) return t3;
          i2[u2] = { velocityPerBows: t3.res };
          continue;
        }
        if (/^\d+\/\d+$/.test(n4)) {
          const e4 = Te(n4, o2.linesOfStyle[s2], o2.linePosOfStyle[s2]);
          if (e4.fail()) return e4;
          i2[u2] = { until: e4.res };
          continue;
        }
        if (/^v\d+$/.test(n4)) {
          const e4 = Ge(n4.replace(/^v/, ""), o2.linesOfStyle[s2], o2.linePosOfStyle[s2] + 1);
          if (e4.fail()) return e4;
          i2[u2] = { velocity: e4.res };
          continue;
        }
        return new fr(o2.linesOfStyle[s2], o2.linePosOfStyle[s2], n4, `Unknown style '${n4.replace(/\(.+$/, "")}'`);
      }
    }
  }
  return or();
}
function He(e3) {
  return null !== e3 && "object" == typeof e3 && "name" in e3 && "string" == typeof e3.name ? 1 : 0;
}
function Ye(e3) {
  return null !== e3 && "object" == typeof e3 && "step" in e3 && "number" == typeof e3.step && "alt" in e3 && "number" == typeof e3.alt ? 1 : 0;
}
function Qe(e3) {
  const { step: t2, alt: n2, oct: i2, dir: r2 = 1 } = e3, o2 = Tn[t2] + 7 * n2;
  return void 0 === i2 ? [r2 * o2] : [r2 * o2, r2 * (i2 - Cn[t2] - 4 * n2)];
}
function Ze(e3) {
  const [t2, n2, i2] = e3, r2 = jn[function(e4) {
    const t3 = (e4 + 1) % 7;
    return 0 > t3 ? 7 + t3 : t3;
  }(t2)], o2 = Math.floor((t2 + 1) / 7);
  return void 0 === n2 ? { step: r2, alt: o2, dir: i2 } : { step: r2, alt: o2, oct: n2 + 4 * o2 + Cn[r2], dir: i2 };
}
function et(e3) {
  return "string" == typeof e3 ? Bn[e3] || (Bn[e3] = function(e4) {
    const t2 = function(e5) {
      const t3 = Dn.exec("" + e5);
      return null === t3 ? ["", ""] : t3[1] ? [t3[1], t3[2]] : [t3[4], t3[3]];
    }(e4);
    if ("" === t2[0]) return En;
    const n2 = +t2[0], i2 = t2[1], r2 = (Math.abs(n2) - 1) % 7, o2 = Ln[r2];
    if ("M" === o2 && "P" === i2) return En;
    const s2 = "M" === o2 ? "majorable" : "perfectable", c2 = "" + n2 + i2, a2 = 0 > n2 ? -1 : 1, u2 = 8 === n2 || -8 === n2 ? n2 : a2 * (r2 + 1), f2 = function(e5, t3) {
      return "M" === t3 && "majorable" === e5 || "P" === t3 && "perfectable" === e5 ? 0 : "m" === t3 && "majorable" === e5 ? -1 : /^A+$/.test(t3) ? t3.length : /^d+$/.test(t3) ? -1 * ("perfectable" === e5 ? t3.length : t3.length + 1) : 0;
    }(s2, i2), l2 = Math.floor((Math.abs(n2) - 1) / 7);
    return { empty: 0, name: c2, num: n2, q: i2, step: r2, alt: f2, dir: a2, type: s2, simple: u2, semitones: a2 * (Fn[r2] + f2 + 12 * l2), chroma: (a2 * (Fn[r2] + f2) % 12 + 12) % 12, coord: Qe({ step: r2, alt: f2, oct: l2, dir: a2 }), oct: l2 };
  }(e3)) : Ye(e3) ? et(function(e4) {
    const { step: t2, alt: n2, oct: i2 = 0, dir: r2 } = e4;
    if (!r2) return "";
    const o2 = t2 + 1 + 7 * i2;
    return (0 > r2 ? "-" : "") + (0 === o2 ? t2 + 1 : o2) + function(e5, t3) {
      return 0 === t3 ? "majorable" === e5 ? "M" : "P" : -1 === t3 && "majorable" === e5 ? "m" : t3 > 0 ? On("A", t3) : On("d", "perfectable" === e5 ? t3 : t3 + 1);
    }("M" === Ln[t2] ? "majorable" : "perfectable", n2);
  }(e3)) : He(e3) ? et(e3.name) : En;
}
function tt(e3) {
  const t2 = JSON.stringify(e3), n2 = Un.get(t2);
  if (n2) return n2;
  const i2 = "string" == typeof e3 ? function(e4) {
    const t3 = nt(e4);
    if ("" === t3[0] || "" !== t3[3]) return _n;
    const n3 = t3[0], i3 = t3[1], r2 = t3[2], o2 = (n3.charCodeAt(0) + 3) % 7, s2 = Kn(i3), c2 = r2.length ? +r2 : void 0, a2 = Qe({ step: o2, alt: s2, oct: c2 }), u2 = n3 + i3 + r2, f2 = n3 + i3, l2 = (Xn[o2] + s2 + 120) % 12, d2 = void 0 === c2 ? zn(Xn[o2] + s2, 12) - 1188 : Xn[o2] + s2 + 12 * (c2 + 1), m2 = 0 > d2 || d2 > 127 ? null : d2;
    return { empty: 0, acc: i3, alt: s2, chroma: l2, coord: a2, freq: void 0 === c2 ? null : 440 * Math.pow(2, (d2 - 69) / 12), height: d2, letter: n3, midi: m2, name: u2, oct: c2, pc: f2, step: o2 };
  }(e3) : Ye(e3) ? tt(function(e4) {
    const { step: t3, alt: n3, oct: i3 } = e4, r2 = Rn(t3);
    if (!r2) return "";
    const o2 = r2 + qn(n3);
    return i3 || 0 === i3 ? o2 + i3 : o2;
  }(e3)) : He(e3) ? tt(e3.name) : _n;
  return Un.set(t2, i2), i2;
}
function nt(e3) {
  const t2 = Wn.exec(e3);
  return t2 ? [t2[1].toUpperCase(), t2[2].replace(/x/g, "##"), t2[3], t2[4]] : ["", "", "", ""];
}
function it(e3) {
  return Yn.test(e3);
}
function rt(e3) {
  const t2 = it(e3) ? e3 : Qn(e3) ? Jn(e3) : Array.isArray(e3) ? function(e4) {
    if (0 === e4.length) return Vn.chroma;
    let t3;
    const n2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i2 = 0; e4.length > i2; i2++) t3 = tt(e4[i2]), t3.empty && (t3 = et(e4[i2])), t3.empty || (n2[t3.chroma] = 1);
    return n2.join("");
  }(e3) : Zn(e3) ? e3.chroma : Vn.chroma;
  return ei[t2] = ei[t2] || function(e4) {
    const t3 = Hn(e4), n2 = function(e5) {
      const t4 = e5.split("");
      return t4.map((e6, n3) => function(e7, t5) {
        const n4 = t5.length, i3 = (e7 % n4 + n4) % n4;
        return t5.slice(i3, n4).concat(t5.slice(0, i3));
      }(n3, t4).join(""));
    }(e4).map(Hn).filter((e5) => e5 >= 2048).sort()[0], i2 = Jn(n2), r2 = function(e5) {
      const t4 = [];
      for (let n3 = 0; 12 > n3; n3++) "1" === e5.charAt(n3) && t4.push(ti[n3]);
      return t4;
    }(e4);
    return { empty: 0, name: "", setNum: t3, chroma: e4, normalized: i2, intervals: r2 };
  }(t2);
}
function ot(e3, t2, n2) {
  const i2 = function(e4) {
    return oi[e4] || ii;
  }(e3), r2 = tt(t2 || ""), o2 = tt(n2 || "");
  if (i2.empty || t2 && r2.empty || n2 && o2.empty) return ci;
  const s2 = function(e4, t3) {
    const n3 = tt(e4), i3 = tt(t3);
    if (n3.empty || i3.empty) return "";
    const r3 = n3.coord, o3 = i3.coord, s3 = o3[0] - r3[0];
    return function(e5, t4) {
      const [n4, i4 = 0] = e5;
      return et(Ze(t4 || 0 > 7 * n4 + 12 * i4 ? [-n4, -i4, -1] : [n4, i4, 1]));
    }([s3, 2 === r3.length && 2 === o3.length ? o3[1] - r3[1] : -Math.floor(7 * s3 / 12)], i3.height === n3.height && null !== i3.midi && null !== n3.midi && n3.step > i3.step).name;
  }(r2.pc, o2.pc), c2 = i2.intervals.indexOf(s2) + 1;
  if (!o2.empty && !c2) return ci;
  const a2 = Array.from(i2.intervals);
  for (let e4 = 1; c2 > e4; e4++) {
    const e5 = a2[0][1];
    a2.push(`${parseInt(a2[0][0], 10) + 7}${e5}`), a2.shift();
  }
  const u2 = r2.empty ? [] : a2.map((e4) => function(e5, t3) {
    const n3 = tt(e5), i3 = Array.isArray(t3) ? t3 : et(t3).coord;
    if (n3.empty || !i3 || 2 > i3.length) return "";
    const r3 = n3.coord;
    return function(e6) {
      return tt(Ze(e6));
    }(1 === r3.length ? [r3[0] + i3[0]] : [r3[0] + i3[0], r3[1] + i3[1]]).name;
  }(r2, e4));
  e3 = -1 !== i2.aliases.indexOf(e3) ? e3 : i2.aliases[0];
  const f2 = `${r2.empty ? "" : r2.pc}${e3}${o2.empty || 1 >= c2 ? "" : "/" + o2.pc}`, l2 = `${t2 ? r2.pc + " " : ""}${i2.name}${c2 > 1 && n2 ? " over " + o2.pc : ""}`;
  return { ...i2, name: l2, symbol: f2, type: i2.name, root: o2.name, intervals: a2, rootDegree: c2, tonic: r2.name, notes: u2 };
}
function st(e3, t2) {
  const n2 = [], i2 = e3.length - 1, r2 = i2 - (e3.length - t2.notes.length), o2 = (4 > t2.options.searchFretWidth || t2.options.searchFretWidth > 12 ? 4 : t2.options.searchFretWidth) - 1, s2 = {}, c2 = t2.notes.filter((e4) => e4 !== t2.tonic), a2 = c2.filter((e4) => e4 !== t2.perfectFifth), u2 = (e4) => {
    const t3 = Array.from(new Set(e4));
    return a2.every((e5) => t3.includes(e5));
  }, f2 = (i3, r3, a3) => {
    const f3 = [];
    for (let e4 = 0; r3 > e4; e4++) {
      const n3 = [], r4 = i3 + o2;
      for (let o3 = i3; r4 >= o3; o3++) {
        const i4 = t2.basicBoardList[e4][o3];
        i4 && n3.push({ key: i4, string: e4, fret: o3 });
      }
      f3.push(n3);
    }
    const l2 = function(e4) {
      const t3 = e4.filter((e5) => e5.length > 0);
      if (0 === t3.length) return [];
      const n3 = (e5, r4) => {
        e5 !== t3.length ? t3[e5].forEach((t4) => n3(e5 + 1, [...r4, t4])) : i4.push([...r4]);
      }, i4 = [];
      return n3(0, []), i4;
    }(f3);
    l2.filter((e4) => {
      const t3 = e4.map((e5) => `${e5.string},${e5.fret}`).join("+");
      return s2[t3] || !((e5) => {
        const t4 = Array.from(new Set(e5.map((e6) => e6.key)));
        return c2.every((e6) => t4.includes(e6));
      })(e4) ? 0 : (s2[t3] = 1, 1);
    }).forEach((i4) => {
      const [o3, c3] = ((e4, n3, i5) => {
        let [r4, o4] = ((e5, n4, i6) => {
          var _a;
          let r5 = 0, o5 = 0;
          const c4 = Math.min(...e5.map((e6) => e6.fret));
          var a4;
          0 === i6 ? c4 > 0 && (o5 = c4) : o5 = c4, t2.options.notRequiredPerfectFifth && 0 !== i6 && e5[e5.length - 1].key === t2.perfectFifth && e5[e5.length - 2].key !== t2.tonic && !((_a = t2.options.requiredStrings) == null ? void 0 : _a.includes(e5[e5.length - 1].string)) && (e5[e5.length - 1].fret = -1, e5[e5.length - 1].key = "_"), t2.options.requiredStrings && (a4 = [n4, ...e5.map((e6) => e6.string)], t2.options.requiredStrings.every((e6) => a4.includes(e6)) || (r5 -= 8)), t2.options.useHighestTensionPossible && t2.tensionNotes.length && (t2.tensionNotes.includes(e5[0].key) || (r5 -= 4));
          let f5 = 0;
          const l4 = [];
          for (let n5 = e5.length - 1; n5 >= 0; n5--) {
            if ((o5 !== i6 || e5[n5].fret >= 0 && e5[n5].fret !== o5) && f5++, f5 > t2.options.difficulty) {
              r5 -= 1;
              const i7 = u2(l4);
              let c5 = 1;
              if (t2.options.requiredStrings && (c5 = !t2.options.requiredStrings.some((e6) => n5 >= e6)), i7 && e5[n5].fret !== o5) {
                c5 || (r5 -= 2);
                const t3 = structuredClone(e5);
                for (let e6 = n5; e6 >= 0; e6--) t3.shift();
                const i8 = t3.map((e6) => `${e6.string},${e6.fret}`).join("+");
                if (!s2[i8]) {
                  s2[i8] = 1;
                  for (let t4 = n5; t4 >= 0; t4--) e5.shift();
                  return r5 += 1, ["memo", r5];
                }
              }
            }
            l4.push(e5[n5].key);
          }
          return ["memo", r5];
        })(e4, n3, i5);
        return t2.options.requiredStrings && (function(e5, t3) {
          if (e5.length !== t3.length) return 0;
          for (let n4 = 0; e5.length > n4; n4++) if (e5[n4] !== t3[n4]) return 0;
          return 1;
        }([...e4.map((e5) => e5.string), n3], t2.options.requiredStrings) || (o4 -= 2)), 3 > e4.length && (o4 -= 3), [o4, r4];
      })(i4, r3, a3), f4 = Array(e3.length).fill(void 0);
      f4[r3] = a3;
      const l3 = Array(e3.length).fill(void 0);
      l3[r3] = t2.tonic, i4.forEach((e4) => {
        0 > e4.fret || (f4[e4.string] = e4.fret, l3[e4.string] = e4.key);
      });
      const d2 = { positionScore: Math.round((f4.reduce((e4, t3) => (e4 || 0) + (t3 || 0), 0) || 0) / i4.length), score: o3, tab: f4, notes: l3, sym: f4.map((e4) => void 0 !== e4 ? e4 : "").reverse().join("|"), memo: c3 };
      n2.push(d2);
    });
  };
  for (let e4 = i2; e4 >= r2; e4--) {
    const n3 = Math.min(17, Zi.maxTopFret);
    for (let i3 = 0; n3 >= i3; i3++) {
      const n4 = t2.basicBoardList[e4][i3];
      if (!n4 || n4 !== t2.tonic) continue;
      const r3 = 0 === i3 && t2.options.wideUseOpenString ? t2.options.maxSearchRootFret : i3;
      for (let t3 = 0 > i3 - o2 ? 0 : i3 - o2; r3 >= t3; t3++) f2(t3, e4, i3);
    }
  }
  return t2.options.sortByPosition && n2.sort("low" === t2.options.sortByPosition ? (e4, t3) => e4.positionScore - t3.positionScore : (e4, t3) => t3.positionScore - e4.positionScore), n2.sort((e4, t3) => t3.score - e4.score), { fingerings: n2, notes: t2.notes, tonic: t2.tonic, intervals: t2.intervals, tensionNotes: t2.tensionNotes };
}
function ct(e3, t2, n2, i2) {
  const r2 = {}, [o2, s2] = t2.split("/");
  let c2 = "", a2 = "";
  if (/^[1234567]/.test(o2)) r2.numeratorNum = parseInt(o2[0]) - 1, c2 = e3.sys.note7array[r2.numeratorNum];
  else {
    if (!/^[CDEFGAB]/.test(o2)) return new cr(n2, i2, t2, `Invalid numerator '${t2}'. A degree symbol must start with one of 1-7, C-B`);
    c2 = o2;
  }
  if (void 0 !== r2.numeratorNum && ("#" === o2[1] || "b" === o2[1] ? (c2 += o2[1], r2.numeratorTails = o2.length > 2 ? o2.slice(2) : void 0) : r2.numeratorTails = o2.length > 1 ? o2.slice(1) : void 0, c2 = me(c2) + (r2.numeratorTails ? r2.numeratorTails : "") + (1 === o2.length ? e3.diatonicEvolverValue.evolvedCodePrefix[r2.numeratorNum] : "")), s2) {
    if (/^[1234567](#|b)?/.test(s2)) r2.denominatorNum = parseInt(s2[0]) - 1, a2 = e3.sys.note7array[r2.denominatorNum];
    else {
      if (!/^[CDEFGAB](#|b)?/.test(s2)) return new cr(n2, i2, t2, `Invalid denominator '${t2}'. A degree symbol must start with one of 1-7, C-B[1]`);
      a2 = s2;
    }
    if (void 0 !== r2.denominatorNum) {
      if ("#" === s2[1] || "b" === s2[1]) {
        if (a2 += s2[1], s2.length > 2) return new cr(n2, i2, t2, `Invalid denominator '${t2}'.`);
      } else if (s2.length > 1) return new cr(n2, i2, t2, `Invalid denominator '${t2}'. A degree symbol must with one of 1-7(#|b), C-B(#|b).`);
      a2 = me(a2);
    }
    return new ir(c2 + "/" + a2);
  }
  return new ir(c2);
}
function at(e3, t2, n2, i2) {
  if (/^\//.test(t2)) return new cr(n2, i2, t2, `Invalid symbol '${t2}'. The prefix "/" cannot be used in code specifications.`);
  if (/%/.test(e3)) return new cr(n2, i2, t2, `Invalid symbol '${t2}'.`);
  if (!/^[rCDEFGAB]/.test(e3)) return new cr(n2, i2, t2, `Invalid chord name '${e3}'. A chord symbol must start with one of C, D, E, F, G, A, B or r rn of rest.`);
  if (/\//.test(e3)) {
    const r2 = e3.split(/\//);
    if (r2[1] && /^[^CDEFGAB]/.test(r2[1])) return new cr(n2, i2, t2, `Invalid molecule of chord name '${e3}'. A molecule of chord symbol must with one of C, D, E, F, G, A, B.`);
  }
  return or();
}
function ut(e3, t2, n2, i2) {
  const r2 = [], o2 = t2.split("|");
  if (o2.length > e3.length) return new cr(n2, i2, t2, `'${t2}' beyond tuning. Fret designation cannot exceed the number of strings specified in tuning.`);
  let s2 = i2;
  for (let t3 = 0; e3.length > t3; t3++) {
    const e4 = o2[t3];
    if ("" === e4 || void 0 === e4) {
      r2.unshift(void 0), s2 += 1;
      continue;
    }
    if ("r" === e4) {
      r2.unshift(-1), s2 += 2;
      continue;
    }
    if (/\D/.test(e4)) return new cr(n2, s2, e4, `Invalid tab token '${e4}'. Tab can only specify 'r' for frets 0 to 24 or rests.
e.g. 0|2|2|0|0|0 or 0|2 or r|r|2|2 etc..`);
    const i3 = parseInt(e4);
    if (i3 > Zi.maxTopFret) return new cr(n2, s2, e4, `Invalid token '${e4}'. Up to ${Zi.maxTopFret} frets can be used.`);
    r2.unshift(i3), s2 += e4.length + 1;
  }
  return new ir(r2);
}
function ft(e3, t2, n2, i2, r2, o2, s2, c2, a2) {
  return e3.flash.other.push({ name: o2, dualId: t2, regionId: n2, fullNoteIndex: i2, regionNoteIndex: r2, location: { line: c2, linePos: a2 }, dataStr: s2 }), or();
}
function lt(e3, t2, n2, i2, r2, o2, s2) {
  if (0 !== t2) return new cr(o2, s2, null, "@click cannot be set on anything other than the base block.");
  const c2 = r2.replace(/^@click\(\s*|^@click|\s*\)/g, ""), a2 = e3.settings;
  if ("@/click" === c2) return e3.flash.click.push({ stop: { regionIndex: n2, noteIndex: i2 } }), or();
  if ("" === c2) return e3.flash.click.push({ start: { regionIndex: n2, fullNoteIndex: i2, until: e3.mixesList[0].regionList[n2].untilNext, inst: a2.click.inst, velocity: a2.click.velocity } }), or();
  const u2 = Te(c2, o2, s2);
  return u2.fail() ? u2 : 1 > u2.res[0] ? new cr(o2, -1, null, `Invalid click step value '${u2.res[0]}', The entered value is outside the accepted range.`) : (e3.flash.click.push({ start: { regionIndex: n2, fullNoteIndex: i2, until: u2.res, inst: a2.click.inst, velocity: a2.click.velocity } }), or());
}
function dt(e3, t2, n2) {
  var _a, _b;
  let i2 = 0, r2 = 0;
  const o2 = { tabObjId: 0, tickAcrossBlock: Zi.startTick, fullNoteIndex: 0, blockNoteIndex: 0, noteTotalTickInRegion: 0 }, s2 = e3.mixesList[t2];
  for (let c2 = 0; n2.length > c2; c2++) {
    const a2 = n2[c2];
    if (a2.type !== An.regionStart) {
      if (a2.type === An.flash) if ("@offset" === a2.token) s2.regionList[a2.regionRegionForDualConnection].offsetTickWidth = o2.noteTotalTickInRegion, s2.regionList[a2.regionRegionForDualConnection].flashOffsetLocation = { line: a2.line, linePos: a2.linePos, token: a2.token };
      else {
        const n3 = Gr.resolve(e3, t2, a2.regionRegionForDualConnection, o2.fullNoteIndex, o2.blockNoteIndex, a2);
        if (n3.fail()) return n3;
      }
      else if (a2.decidedProp) {
        const n3 = i2 || a2.decidedProp.styles.strum ? 0 : { [zi.normal]: a2.decidedProp.styles.continue ? 1 : 0, [zi.mute]: 0, [zi.muteContinue]: 1, [zi.rest]: 0, [zi.restNoise]: 0, [zi.brushing_d]: 0, [zi.brushing_D]: 0, [zi.brushing_u]: 0, [zi.brushing_U]: 0, [zi.strum]: 0, [zi.normalUnContinueForStep]: 0, [void 0]: a2.decidedProp.styles.continue ? 1 : 0 }[a2.decidedProp.styles.inst];
        i2 = "release" !== ((_a = a2.decidedProp.styles.slide) == null ? void 0 : _a.type) ? 0 : 1, r2 && a2.decidedProp.styles.stroke && (a2.decidedProp.styles.stroke = void 0), r2 = ((_b = a2.decidedProp.styles.slide) == null ? void 0 : _b.continue) ? 1 : 0, ht(e3, t2, e3.mixesList[t2].regionList[a2.regionRegionForDualConnection], a2, n3, o2);
      }
      a2.type === An.closingCurlyBrace && 1 === a2.curlyLevel && (s2.regionList[a2.regionRegionForDualConnection].endLayerTick = o2.tickAcrossBlock, s2.regionList[a2.regionRegionForDualConnection].usedTotalTick = o2.noteTotalTickInRegion, o2.noteTotalTickInRegion = 0, e3.mixesList[t2].regionList[a2.regionRegionForDualConnection].end = { line: a2.endLine, linePos: a2.endPos });
    } else 0 === t2 ? -1 === s2.regionList[a2.regionRegionForDualConnection].startLayerTick && (s2.regionList[a2.regionRegionForDualConnection].startLayerTick = o2.tickAcrossBlock) : (o2.tickAcrossBlock = e3.mixesList[0].regionList[a2.regionRegionForDualConnection].startLayerTick, s2.regionList[a2.regionRegionForDualConnection].startLayerTick = o2.tickAcrossBlock), s2.regionList[a2.regionRegionForDualConnection].start = { line: a2.line, linePos: a2.linePos }, o2.blockNoteIndex = 0;
  }
  return or();
}
function mt(e3, t2) {
  const { flatTOList: n2 } = e3.mixesList[t2], i2 = {}, r2 = {}, o2 = [n2.length ? n2[n2.length - 1].bar.stopTick : Zi.startTick];
  for (let e4 = n2.length - 1; e4 >= 0; e4--) {
    const t3 = n2[e4];
    o2.unshift(t3.bar.startTick), t3.styles.bpm && t3.styles.bpm.group > 0 && (i2[t3.styles.bpm.group] || (i2[t3.styles.bpm.group] = 1, r2[t3.styles.bpm.group] = t3.bar.startTick), t3.styles.bpm.groupEndTick = r2[t3.styles.bpm.group]), t3.styles.turn && t3.styles.turn.group > 0 && !i2[t3.styles.turn.group] && (i2[t3.styles.turn.group] = 1, t3.styles.turn.groupFinal = 1);
  }
  e3.mixesList[t2].marks.fullNoteIndexWithTick = o2;
}
function ht(e3, t2, n2, i2, r2, o2) {
  const s2 = n2.tuning, c2 = e3.settings.play.velocities.slice(0, s2.length), a2 = i2.decidedProp.styles.velocity;
  a2 && c2.forEach((e4, t3) => c2[t3] *= a2 / 100);
  const u2 = i2.decidedProp.styles.velocityPerBows;
  u2 && c2.forEach((e4, t3) => {
    void 0 !== u2[t3] && (c2[t3] *= u2[t3] / 100);
  });
  const f2 = { tick: Ke(i2.decidedProp.tick.untilNext), fretStartTicks: Array(s2.length).fill(void 0), fretStopTicks: Array(s2.length).fill(void 0), startTick: void 0, stopTick: void 0 }, l2 = { noteStr: i2.decidedProp.noteStr, extendInfo: i2.decidedProp.extensionViewProp, syntaxLocation: { row: "", line: i2.line, linePos: i2.linePos, endLine: i2.endLine, endPos: i2.endPos }, tabObjId: o2.tabObjId++, regionIndex: i2.regionRegionForDualConnection, regionNoteIndex: o2.blockNoteIndex, note: i2.decidedProp.list, tab: i2.decidedProp.fingering, trueTab: i2.decidedProp.trueTab, shifted: i2.decidedProp.shifted, velocity: c2.map((e4, t3) => void 0 !== i2.decidedProp.fingering[t3] ? e4 : void 0), continueX: r2, styles: i2.decidedProp.styles, bar: f2, bpm: -1, isArpeggio: i2.decidedProp.isArpeggio ? 1 : 0, isBullet: i2.decidedProp.isBullet || 0, refMovedSlideTarget: [], activeBows: [], refActiveBows: [], slideLandingTab: [], prevTabObj: void 0, nextTabObj: void 0, locationIndexes: i2.locationInfoRefStackUpList, untilNext: i2.decidedProp.tick.untilNext };
  i2.decidedProp.styles.inst !== zi.rest && i2.decidedProp.styles.inst !== zi.restNoise || (l2.isRest = 1), e3.mixesList[t2].flatTOList.push(l2), o2.fullNoteIndex++, o2.blockNoteIndex++, o2.tickAcrossBlock += f2.tick, o2.noteTotalTickInRegion += f2.tick;
}
function vt(e3, t2, n2) {
  var _a, _b, _c, _d;
  const i2 = e3.mixesList[t2], r2 = n2[t2].length;
  for (let o2 = 0; r2 > o2; o2++) {
    const r3 = n2[t2][o2];
    switch (r3.type) {
      case An.degreeName: {
        const t3 = i2.regionList[r3.regionRegionForDualConnection].tuning, n3 = ct(r3.decidedProp.styles.degree || e3.settings.style.degree, r3.token, r3.line, r3.linePos);
        if (n3.fail()) return n3;
        if ("r" === r3.token) r3.decidedProp.fingering = Array(t3.length).fill(void 0), r3.decidedProp.list = r3.token, r3.decidedProp.styles.inst !== zi.restNoise && (r3.decidedProp.styles.inst = zi.rest);
        else {
          const i3 = { sortByPosition: "low", useHighestTensionPossible: 1 };
          ((_a = r3.decidedProp.styles.step) == null ? void 0 : _a.parsedStep) && (i3.requiredStrings = [...(_b = r3.decidedProp.styles.step) == null ? void 0 : _b.parsedStep.reduce((e4, t4) => (t4.stringIndexes && t4.stringIndexes.forEach((t5) => e4.add(t5 + 1)), e4), /* @__PURE__ */ new Set())]);
          const o3 = Br.create(e3.dic.chord, t3, r3.line, r3.linePos, n3.res, i3);
          if (o3.fail()) return o3;
          r3.decidedProp.chordDicRef = o3.res, r3.decidedProp.list = o3.res.symbol, r3.decidedProp.fingering = o3.res.fingerings[0].tab, r3.decidedProp.trueTab = o3.res.fingerings[0].tab;
        }
        break;
      }
      case An.note: {
        const t3 = i2.regionList[r3.regionRegionForDualConnection].tuning;
        if (/\|/.test(r3.token)) {
          r3.decidedProp.list = r3.token;
          const e4 = ut(t3, r3.token, r3.line, r3.linePos + (r3.prefixLength || 0));
          if (e4.fail()) return e4;
          r3.decidedProp.fingering = e4.res, r3.decidedProp.trueTab = e4.res;
        } else {
          const n3 = at(r3.token, r3.decidedProp.noteStr, r3.line, r3.linePos);
          if (n3.fail()) return n3;
          if ("r" === r3.token) r3.decidedProp.fingering = Array(t3.length).fill(void 0), r3.decidedProp.list = r3.token, r3.decidedProp.styles.inst !== zi.restNoise && (r3.decidedProp.styles.inst = zi.rest);
          else {
            const n4 = { sortByPosition: "low", useHighestTensionPossible: 1 };
            ((_c = r3.decidedProp.styles.step) == null ? void 0 : _c.parsedStep) && (n4.requiredStrings = [...(_d = r3.decidedProp.styles.step) == null ? void 0 : _d.parsedStep.reduce((e4, t4) => (t4.stringIndexes && t4.stringIndexes.forEach((t5) => e4.add(t5 + 1)), e4), /* @__PURE__ */ new Set())]);
            const i3 = Br.create(e3.dic.chord, t3, r3.line, r3.linePos, r3.token, n4);
            if (i3.fail()) return i3;
            r3.decidedProp.chordDicRef = i3.res, r3.decidedProp.list = i3.res.symbol, r3.decidedProp.fingering = i3.res.fingerings[0].tab, r3.decidedProp.trueTab = i3.res.fingerings[0].tab;
          }
        }
        break;
      }
      default:
        continue;
    }
  }
  return or();
}
function bt(e3, t2, n2 = 0) {
  let i2 = 0;
  for (const r2 of t2.styles) {
    if (/^\d+\/\d+$/.test(r2)) {
      const n3 = Te(r2, t2.linesOfStyle[i2], t2.linePosOfStyle[i2]);
      if (n3.fail()) return n3;
      e3.untilNext = n3.res;
    } else if (/^\d+$/.test(r2)) {
      if (n2) return new cr(t2.linesOfStyle[i2], t2.linePosOfStyle[i2], r2, "Invalid Region Prop. BPM cannot be specified for dual block.");
      const o2 = Ne(r2, t2.linesOfStyle[i2], t2.linePosOfStyle[i2]);
      if (o2.fail()) return o2;
      e3.bpm = o2.res;
    } else {
      if (!/\|/.test(r2)) return new cr(t2.linesOfStyle[i2], t2.linePosOfStyle[i2], r2, `unknown Block Property '${r2}'.`);
      {
        const n3 = Ie(r2, t2.linesOfStyle[i2], t2.linePosOfStyle[i2]);
        if (n3.fail()) return n3;
        e3.tuning = n3.res;
      }
    }
    i2++;
  }
  return or();
}
function pt(e3, t2, n2, i2, r2) {
  if (/^hash\./.test(i2)) return n2.length > 2047 ? new cr(r2, -1, null, `Invalid ${i2} value '${n2}'.`) : new ir(n2);
  switch (t2) {
    case "tuning":
      return Ie(n2, r2, -1);
    case "until":
      return Te(n2, r2, -1);
    case "degree": {
      const e4 = Se(n2, r2, -1);
      return e4.fail() ? new cr(r2, -1, null, e4.message) : e4;
    }
    case "scale": {
      const e4 = Be(n2, r2, -1);
      return e4.fail() ? new cr(r2, -1, null, e4.message) : e4;
    }
    case "bpm":
      return Ne(n2, r2, -1);
    case "velocity":
      return Ge(n2, r2, -1);
    case "velocities":
      return Le(e3, n2, ["E", "E", "E", "E", "E", "E", "E", "E", "E"], r2, -1);
    case "inst":
    case "accent":
      return /\D/.test(n2) ? new cr(r2, -1, null, `Invalid ${i2} value '${n2}'.`) : new ir(parseInt(n2));
    case "pan":
    case "mappingNotResolved":
      return /^(?:true|false)$/.test(n2) ? new ir("true" === n2 ? 1 : 0) : new cr(r2, -1, null, `Invalid ${i2} value '${n2}'. e.g. set.dual.pan: true`);
    case "panning":
      if (!/^\[[\d.,\s]+\]$/.test(n2)) return new cr(r2, -1, null, `Invalid ${i2} value '${n2}'. e.g. set.dual.panning: [0.5, 0.5, 0.5]`);
      try {
        const e4 = JSON.parse(n2);
        return new ir(e4);
      } catch {
        return new cr(r2, -1, null, `Invalid ${i2} value '${n2}'. e.g. set.dual.panning: [0.5, 0.5, 0.5]`);
      }
    case "key":
      return /^[CDEFGAB](b|#)?$/.test(n2) ? new ir(n2) : new cr(r2, -1, null, `Invalid ${i2} value '${n2}'. e.g. C#`);
    default:
      return new ir(parseInt(n2));
  }
}
function yt(e3, t2) {
  let n2 = t2.startTick, i2 = 1;
  const r2 = e3.settings.click.accent, o2 = e3.settings.click.until[1], s2 = e3.settings.click.velocity / 100;
  let c2 = e3.settings.click.velocity / 100 + 0.3;
  c2 > 1 && (c2 = 1);
  const a2 = e3.settings.click.inst;
  for (; t2.endTick > n2; ) e3.clickPointList.push({ startTick: n2, inst: a2, velocity: i2 === r2 ? c2 : s2 }), n2 += t2.untilRange, ++i2 > o2 && (i2 = 1);
}
function wt(e3, t2, n2, i2) {
  const r2 = e3;
  for (let e4 = t2 - 1; e4 >= 0; e4--) {
    const t3 = r2[e4].bar.fretStartTicks[i2], o2 = r2[e4].bar.fretStopTicks[i2];
    if (!t3 || n2 > t3) {
      if (o2 && o2 >= n2) {
        r2[e4].bar.fretStopTicks[i2] = n2;
        break;
      }
    } else r2[e4].bar.fretStartTicks[i2] = void 0, r2[e4].bar.fretStopTicks[i2] = void 0, r2[e4].tab[i2] = void 0;
  }
}
function Mt(e3, t2, n2, i2, r2) {
  let o2 = -1, s2 = -1;
  if (n2.beforeBPM) if (n2.beforeSign) {
    if (o2 = t2 + n2.beforeBPM * n2.beforeSign, Zi.minBPM > o2 || o2 > Zi.maxBPM) return new hr(n2.line, n2.linePos, n2.row || null, `Invalid BPM value '${n2.row}'. bpm transitioned to an invalid value '${o2}'.`);
  } else o2 = n2.beforeBPM;
  else o2 = t2;
  if (!n2.afterBPM) return new hr(n2.line, n2.linePos, n2.row || null, `Invalid BPM value '${n2.row}'. SystemError.'.`);
  if (n2.afterSign) {
    if (s2 = o2 + n2.afterBPM * n2.afterSign, Zi.minBPM > s2 || s2 > Zi.maxBPM) return new hr(n2.line, n2.linePos, n2.row || null, `Invalid BPM value '${n2.row}'. bpm transitioned to an invalid value '${s2}'.`);
  } else s2 = n2.afterBPM;
  Pt(e3, i2, r2);
  const c2 = r2 - i2, a2 = s2 - o2, u2 = Math.abs(a2) / Zi.bpmTransitionSpan, f2 = c2 / u2, l2 = a2 / u2;
  let d2 = i2, m2 = o2;
  for (let t3 = 0; u2 >= t3 && (e3.push({ tick: Math.floor(d2), bpm: m2, timeMS: -1 }), d2 += f2, m2 += l2, r2 - 1 > d2); t3++) ;
  return e3.push({ tick: Math.floor(r2 - 1), bpm: s2, timeMS: -1 }), or();
}
function kt(e3, t2, n2, i2) {
  if (!t2.beforeBPM || 1 !== t2.type) return new hr(-1, -1, null, "BPM SystemError.");
  Pt(e3, n2, i2), e3.push({ tick: Math.floor(n2), bpm: t2.beforeBPM, timeMS: -1 }), e3.push({ tick: Math.floor(i2 - 1), bpm: t2.beforeBPM, timeMS: -1 });
}
function Pt(e3, t2, n2) {
  for (let i2 = 0; e3.length > i2; i2++) t2 > e3[i2].tick || e3[i2].tick > n2 || (e3.splice(i2, 1), i2--);
}
function gt(e3, t2, n2, i2) {
  return { noteStr: "", syntaxLocation: void 0, tabObjId: t2, regionIndex: e3, regionNoteIndex: n2, note: "", tab: Array(i2).fill(void 0), velocity: Array(i2).fill(void 0), continueX: 0, styles: {}, bar: { tick: void 0, fretStartTicks: Array(i2).fill(void 0), fretStopTicks: Array(i2).fill(void 0), startTick: void 0, stopTick: void 0 }, bpm: -1, isArpeggio: 0, isBullet: 0, refMovedSlideTarget: void 0, activeBows: Array(i2).fill(void 0), refActiveBows: Array(i2).fill(void 0), slideLandingTab: void 0, prevTabObj: void 0, nextTabObj: void 0, untilNext: void 0 };
}
function $t(e3, t2, n2, i2, r2, o2) {
  const { flatTOList: s2, marks: c2 } = t2, { settings: a2 } = e3, u2 = [];
  for (let e4 = n2.tuning.length - 1; e4 >= 0 && isNaN(i2.tab[e4]); e4--) u2.unshift({ bowsIndex: e4, thisStrumStartTick: -1 });
  if (!u2.length || u2.length === n2.tuning.length) return new ir(0);
  const f2 = Math.floor(qe(i2.bpm, o2.strumWidthMSec));
  let l2;
  o2.startUntil[0] > 0 && (l2 = (i2.bar.stopTick - i2.bar.startTick) / o2.startUntil[1] * o2.startUntil[0], i2.bar.fretStartTicks = i2.bar.fretStartTicks.map((e4) => e4 ? i2.bar.startTick + l2 : e4));
  let d2 = -1;
  i2.bar.fretStartTicks.forEach((e4) => {
    e4 && (d2 = Math.max(d2, e4));
  });
  const m2 = d2 - f2, h2 = f2 / u2.length;
  for (let e4 = 0; u2.length > e4; e4++) if (u2[u2.length - 1 - e4].thisStrumStartTick = Math.round(m2 + h2 * e4), 0 > u2[u2.length - 1 - e4].thisStrumStartTick) return new ir(0);
  const v2 = gt(i2.regionIndex, fe(i2.tabObjId, 0.1), fe(i2.regionNoteIndex, 0.1), n2.tuning.length);
  u2.forEach((e4) => {
    v2.tab[e4.bowsIndex] = 0, v2.bar.fretStartTicks[e4.bowsIndex] = e4.thisStrumStartTick, v2.bar.fretStopTicks[e4.bowsIndex] = e4.thisStrumStartTick + 1;
  });
  const b2 = u2.map((e4) => e4.bowsIndex);
  v2.velocity = Array(n2.tuning.length).fill(a2.play.strum.velocity).map((e4, t3) => b2.includes(t3) ? e4 + 2 * t3 : void 0), v2.styles.inst = zi.normal, v2.styles.stroke = { off: 1 }, v2.noteStr = "#strum", i2.styles.strum.t = 1, s2.splice(r2 + 1, 0, v2), c2.fullNoteIndexWithTick.splice(r2 + 1, 0, -1);
  const p2 = u2[u2.length - 1].thisStrumStartTick;
  for (let e4 = 0; 9 > e4; e4++) for (let t3 = r2 - 1; t3 >= 0; t3--) {
    const n3 = s2[t3];
    if (n3.tab.length - 1 >= e4 && void 0 !== n3.bar.fretStartTicks && (n3.bar.fretStartTicks[e4] > p2 && (n3.tab[e4] = void 0, n3.bar.fretStartTicks[e4] = void 0, n3.bar.fretStopTicks[e4] = void 0), p2 > n3.bar.fretStartTicks[e4] && n3.bar.fretStopTicks[e4] > p2)) {
      n3.bar.fretStopTicks[e4] = p2;
      break;
    }
  }
  return new ir(1);
}
function Nt(e3, t2, n2, i2) {
  const r2 = structuredClone(n2);
  r2.refActiveBows = r2.tab.map(() => r2);
  const o2 = [r2];
  return At(e3, o2, t2, r2, 0, structuredClone(i2)), o2.length > 1 ? o2 : null;
}
function At(e3, t2, n2, i2, r2, o2) {
  var _a;
  const s2 = ((_a = i2.styles.strum) == null ? void 0 : _a.t) ? i2.tab : i2.activeBows, c2 = i2.slideLandingTab ? i2.slideLandingTab : [], a2 = "to" === o2.type ? function(e4, t3, n3) {
    const i3 = [];
    let r3 = 0;
    for (let n4 = 0; e4.length > n4; n4++) {
      const o3 = {};
      void 0 !== e4[n4] && e4[n4] !== t3[n4] && (o3.bowIndex = n4, o3.startFret = e4[n4], o3.isOpenBowByStart = !o3.startFret, void 0 !== t3[n4] && (o3.landingFret = t3[n4], o3.isOpenBowByLanding = !o3.landingFret, o3.slideWidth = o3.landingFret - o3.startFret, o3.direction = 0 === o3.slideWidth ? 0 : 0 > o3.slideWidth ? -1 : 1, o3.slideWidth = Math.abs(o3.slideWidth), r3++), i3.push(o3));
    }
    if (!i3.length) return [];
    if (r3) {
      const e5 = i3.filter((e6) => void 0 !== e6.landingFret), t4 = i3.filter((e6) => e6.slideWidth > 1), n4 = Math.max(...t4.map((e6) => e6.slideWidth));
      return e5.forEach((e6) => {
        const t5 = e6.slideWidth - n4;
        t5 && e6.slideWidth > 1 && (e6.slideWidth = n4, e6.startFret += t5 * e6.direction, 1 > e6.startFret && (e6.startFret = 1), e6.startFret > 24 && (e6.startFret = 24));
      }), e5;
    }
    {
      const e5 = t3.filter((e6) => void 0 !== e6);
      if (!e5.length) return [];
      const r4 = [], o3 = [];
      if (i3.forEach((t4) => e5.forEach((e6) => {
        const n4 = e6 - t4.startFret;
        n4 > 0 ? r4.push(n4) : 0 > n4 && o3.push(n4);
      })), !r4.length && !o3.length) return [];
      const s3 = r4.length > o3.length ? 1 : -1, c3 = Math.abs(s3 > 0 ? Math.max(...r4) : Math.min(...o3));
      return n3.continue = void 0, i3.map((e6) => (e6.landingFret = e6.startFret + c3 * s3, e6.direction = s3, e6.slideWidth = c3, e6)).filter((e6) => e6.landingFret >= 0 && 24 > e6.landingFret);
    }
  }(s2, c2, o2) : function(e4, t3, n3) {
    const i3 = [];
    if (void 0 === n3.releaseWidth && !n3.arrow) {
      for (let i4 = 0; e4.length > i4; i4++) if (void 0 !== t3[i4] && void 0 !== e4[i4] && Math.abs(e4[i4] - t3[i4]) > 3) {
        n3.releaseWidth = e4[i4] - t3[i4], n3.arrow = n3.releaseWidth > 0 ? 1 : -1, n3.releaseWidth = Math.abs(n3.releaseWidth);
        break;
      }
    }
    if (void 0 === n3.releaseWidth && !n3.arrow) {
      const i4 = Math.max(...e4.filter((e5) => !!e5)), r3 = Math.min(...t3.filter((e5) => !!e5)), o3 = Math.min(...e4.filter((e5) => !!e5)), s3 = Math.max(...t3.filter((e5) => !!e5));
      Math.abs(i4 - r3) > Math.abs(o3 - s3) ? (n3.releaseWidth = i4 - r3, n3.arrow = n3.releaseWidth > 0 ? 1 : -1, n3.releaseWidth = Math.abs(n3.releaseWidth)) : (n3.releaseWidth = s3 - o3, n3.arrow = n3.releaseWidth > 0 ? 1 : -1, n3.releaseWidth = Math.abs(n3.releaseWidth));
    }
    void 0 !== n3.releaseWidth || n3.arrow || (n3.releaseWidth = 5, n3.arrow = -1);
    for (let t4 = 0; e4.length > t4; t4++) {
      const r3 = {};
      if (void 0 !== e4[t4]) {
        if (0 === r3.startFret) continue;
        r3.bowIndex = t4, r3.startFret = e4[t4], r3.landingFret = r3.startFret + (n3.releaseWidth || 9) * n3.arrow, 0 > r3.landingFret && (r3.landingFret = 0), r3.slideWidth = r3.landingFret - r3.startFret, r3.direction = n3.arrow, r3.slideWidth = Math.abs(r3.slideWidth), r3.startFret !== r3.landingFret && i3.push(r3);
      }
    }
    return i3;
  }(s2, c2, o2);
  if (!a2.length) return i2.slideTrueType = 1, or();
  const u2 = Math.max(...a2.map((e4) => e4.slideWidth));
  let f2 = [];
  const l2 = {};
  if (u2 > 1) {
    const s3 = function(e4, t3, n3, i3) {
      t3.startableTick = Math.max(...n3.map((t4) => {
        var _a2;
        return (_a2 = e4.refActiveBows[t4.bowIndex]) == null ? void 0 : _a2.bar.fretStartTicks[t4.bowIndex];
      }).filter((e5) => !isNaN(e5))), t3.stopableTick = Math.min(e4.bar.stopTick, ...n3.map((t4) => {
        var _a2;
        return (_a2 = e4.refActiveBows[t4.bowIndex]) == null ? void 0 : _a2.bar.fretStopTicks[t4.bowIndex];
      }).filter((e5) => !isNaN(e5)));
      const r3 = e4.bar.startTick + e4.bar.tick / i3[1] * i3[0];
      return t3.startTick = t3.startableTick > r3 ? t3.startableTick : r3, or();
    }(i2, l2, a2, o2.startUntil);
    if (s3.fail()) return s3;
    const c3 = function(e4, t3, n3, i3, r3) {
      const o3 = Math.max(...r3.map((e5) => e5.slideWidth));
      let s4 = [];
      if (1 >= o3) return [];
      if (s4 = St(i3.startTick, i3.stopableTick, o3 - 1, n3), n3.auto || "release" === n3.type) {
        const r4 = t3.bpm;
        if (Re(r4, Math.max(...s4)) > e4.settings.play.slide.realization.autoStartPointAdjustmentThresholdSec) for (const c4 of [2, 4, 6, 8, 12, 16, 23, 32, 64, 128, 256, 568, 1024]) {
          const a3 = t3.bar.startTick + t3.bar.tick / c4 * (c4 - 1), u3 = St(a3, i3.stopableTick, o3 - 1, n3), f3 = Re(r4, Math.max(...u3));
          if (e4.settings.play.slide.realization.autoStartPointAdjustmentThresholdSec > f3) {
            s4 = u3, i3.startTick = a3;
            break;
          }
        }
      }
      return s4;
    }(e3, i2, o2, l2, a2);
    a2.forEach((e4) => {
      i2.refActiveBows[e4.bowIndex].bar.fretStopTicks[e4.bowIndex] = l2.startTick;
    }), f2 = function(e4, t3, n3, i3, r3) {
      var _a2, _b;
      const o3 = "to" === ((_b = (_a2 = t3.styles) == null ? void 0 : _a2.slide) == null ? void 0 : _b.type) ? { min: e4.settings.play.slide.velocity.min, max: e4.settings.play.slide.velocity.max, decrease: e4.settings.play.slide.velocity.decrease } : { min: e4.settings.play.release.velocity.min, max: e4.settings.play.release.velocity.max, decrease: e4.settings.play.release.velocity.decrease }, s4 = [];
      let c4 = 1e-3;
      const a3 = Array(t3.tab.length).fill(void 0);
      i3.flat().forEach((e5) => {
        a3[e5.bowIndex] = t3.refActiveBows[e5.bowIndex].velocity[e5.bowIndex], a3[e5.bowIndex] > o3.max && (a3[e5.bowIndex] = o3.max);
      });
      let u3 = n3.startTick;
      const f3 = Math.max(5, 20 * Re(t3.bpm, u3 - t3.bar.startTick));
      n3.attenuationVelocity = f3;
      for (let e5 = 0; r3.length > e5; e5++) {
        const n4 = r3[e5];
        a3.forEach((e6, t4) => {
          void 0 !== a3[t4] && (a3[t4] = Math.max(a3[t4] - 5, o3.min) - f3);
        });
        const l3 = gt(t3.regionIndex, fe(t3.tabObjId, c4), fe(t3.regionNoteIndex, c4), t3.tab.length);
        l3.styles.inst = zi.normal, l3.noteStr = "#slide", l3.slideTrueType = 3, c4 = fe(1e-3, c4), i3.forEach((t4) => {
          t4.slideWidth > 1 && (l3.tab[t4.bowIndex] = t4.startFret + (1 + e5) * t4.direction, l3.bar.fretStartTicks[t4.bowIndex] = Math.floor(u3), l3.bar.fretStopTicks[t4.bowIndex] = Math.floor(u3 + n4));
        }), l3.velocity = a3.map((e6, t4) => void 0 !== l3.tab[t4] ? e6 : void 0), u3 += n4, s4.push(l3);
      }
      return s4;
    }(e3, i2, l2, a2, c3), t2.splice(r2 + 1, 0, ...f2), n2.fullNoteIndexWithTick.splice(r2 + 1, 0, ...Array(f2.length).fill(-1));
  }
  return i2.nextTabObj && o2.continue && !i2.nextTabObj.isRest && a2.forEach((t3) => {
    i2.nextTabObj.velocity[t3.bowIndex] = Math.max(e3.settings.play.slide.velocity.landing, i2.nextTabObj.velocity[t3.bowIndex] - u2 * e3.settings.play.slide.velocity.decrease) - l2.attenuationVelocity;
  }), i2.slideTrueType = 1, or();
}
function St(e3, t2, n2, i2) {
  const r2 = (t2 - e3) / n2, o2 = i2.inSpeedLevel, s2 = Array(n2).fill(r2);
  if (i2.inSpeed && "mid" !== i2.inSpeed) {
    for (let e4 = 0; s2.length - 1 > e4; e4++) {
      let t3 = o2;
      0 > s2[e4] - o2 && (t3 = s2[e4] / 2), s2[e4] -= t3;
      const n3 = s2.length - e4 - 1;
      for (let i3 = e4 + 1; s2.length > i3; i3++) s2[i3] += t3 / n3;
    }
    "slow" === i2.inSpeed && s2.reverse();
  }
  return s2;
}
function xt(e3, t2, n2, i2, r2) {
  const o2 = structuredClone(n2);
  o2.refActiveBows = o2.tab.map(() => o2);
  const s2 = r2 || [o2];
  return It(e3, s2, t2, o2, 0, structuredClone(i2)), s2.length > 1 ? s2 : null;
}
function It(e3, t2, n2, i2, r2, o2) {
  const s2 = function(e4, t3) {
    const n3 = [];
    let i3 = 0;
    for (let r3 = 0; e4.length > r3; r3++) {
      const o3 = {};
      void 0 !== e4[r3] && e4[r3] !== t3[r3] && (o3.bowIndex = r3, o3.startFret = e4[r3], o3.isOpenBowByStart = !o3.startFret, void 0 !== t3[r3] && (o3.landingFret = t3[r3], o3.isOpenBowByLanding = !o3.landingFret, o3.slideWidth = o3.landingFret - o3.startFret, o3.direction = 0 === o3.slideWidth ? 0 : 0 > o3.slideWidth ? -1 : 1, o3.slideWidth = Math.abs(o3.slideWidth), i3++), n3.push(o3));
    }
    if (!n3.length) return [];
    if (i3) {
      const e5 = n3.filter((e6) => void 0 !== e6.landingFret), t4 = n3.filter((e6) => e6.slideWidth > 1), i4 = Math.max(...t4.map((e6) => e6.slideWidth));
      return e5.forEach((e6) => {
        const t5 = e6.slideWidth - i4;
        t5 && e6.slideWidth > 1 && (e6.slideWidth = i4, e6.startFret += t5 * e6.direction, 1 > e6.startFret && (e6.startFret = 1), e6.startFret > 24 && (e6.startFret = 24));
      }), e5;
    }
    {
      const e5 = t3.filter((e6) => void 0 !== e6);
      if (!e5.length) return [];
      const i4 = [], r3 = [];
      if (n3.forEach((t4) => e5.forEach((e6) => {
        const n4 = e6 - t4.startFret;
        n4 > 0 ? i4.push(n4) : 0 > n4 && r3.push(n4);
      })), !i4.length && !r3.length) return [];
      const o3 = i4.length > r3.length ? 1 : -1, s3 = Math.abs(o3 > 0 ? Math.max(...i4) : Math.min(...r3));
      return n3.map((e6) => (e6.landingFret = e6.startFret + s3 * o3, e6.direction = o3, e6.slideWidth = s3, e6)).filter((e6) => e6.landingFret >= 0 && 24 > e6.landingFret);
    }
  }(o2.bowWithFret, i2.tab);
  if (!s2.length) return i2.slideTrueType = 2, or();
  const c2 = Math.max(...s2.map((e4) => e4.slideWidth)), a2 = {}, u2 = function(e4, t3, n3) {
    t3.startableTick = Math.max(...n3.map((t4) => {
      var _a;
      return (_a = e4.refActiveBows[t4.bowIndex]) == null ? void 0 : _a.bar.fretStartTicks[t4.bowIndex];
    }).filter((e5) => !isNaN(e5))), t3.stopableTick = Math.min(...n3.map((t4) => {
      var _a;
      return (_a = e4.refActiveBows[t4.bowIndex]) == null ? void 0 : _a.bar.fretStopTicks[t4.bowIndex];
    }).filter((e5) => !isNaN(e5)));
    const i3 = e4.bar.startTick + e4.bar.tick / 1 * 0;
    return t3.startTick = t3.startableTick > i3 ? t3.startableTick : i3, or();
  }(i2, a2, s2);
  if (u2.fail()) return u2;
  const { baseTick: f2, maxSplitTick: l2 } = function(e4, t3, n3) {
    let i3 = e4.settings.play.approach.widthOfSlide.baseTick, r3 = e4.settings.play.approach.widthOfSlide.maxSplitTick;
    if (n3) {
      const e5 = n3 / 100;
      i3 *= e5, r3 *= e5;
    }
    return i3 > t3.stopableTick - t3.startableTick && (i3 = t3.stopableTick - t3.startableTick), { baseTick: i3, maxSplitTick: r3 };
  }(e3, a2, o2.percentOfSpeed || 0);
  let d2 = f2 / c2;
  d2 > l2 && (d2 = l2);
  const { slideTabObjList: m2, landingVelocity: h2 } = function(e4, t3, n3, i3, r3, o3) {
    const s3 = { min: e4.settings.play.approach.velocity.min, max: e4.settings.play.approach.velocity.max, decrease: e4.settings.play.approach.velocity.decrease, minLanding: e4.settings.play.approach.velocity.minLanding }, c3 = [];
    let a3 = -1e-3;
    const u3 = e4.settings.play.approach.velocity.decrease, f3 = e4.settings.play.approach.velocity.min;
    let l3 = 0;
    const d3 = i3.map((e5) => e5.bowIndex);
    let m3 = n3.startTick;
    for (let n4 = 0; o3 > n4; n4++) {
      const o4 = gt(t3.regionIndex, fe(t3.tabObjId, a3), fe(t3.regionNoteIndex, a3), t3.tab.length);
      o4.velocity = t3.velocity.map((e5, t4) => d3.includes(t4) ? e5 : void 0), o4.styles.inst = zi.normal, o4.noteStr = "#approach", o4.slideTrueType = 4, a3 = fe(-1e-3, a3), i3.forEach((i4) => {
        if ((i4.slideWidth > 1 || 0 === n4) && (0 === n4 ? (o4.tab[i4.bowIndex] = i4.startFret + n4 * i4.direction, o4.bar.fretStartTicks[i4.bowIndex] = void 0 !== t3.bar.fretStartTicks[i4.bowIndex] ? t3.bar.fretStartTicks[i4.bowIndex] : t3.bar.fretStartTicks.find((e5) => void 0 !== e5)) : (o4.tab[i4.bowIndex] = i4.startFret + n4 * i4.direction, o4.bar.fretStartTicks[i4.bowIndex] = Math.floor(m3)), o4.bar.fretStopTicks[i4.bowIndex] = Math.floor(m3 + r3)), l3) {
          o4.velocity[i4.bowIndex] > e4.settings.play.approach.velocity.max && (o4.velocity[i4.bowIndex] = e4.settings.play.approach.velocity.max);
          const t4 = o4.velocity[i4.bowIndex], n5 = t4 - t4 * (l3 / 100);
          o4.velocity[i4.bowIndex] = n5 > f3 ? n5 : f3;
        }
      }), m3 += r3, l3 += u3, c3.push(o4);
    }
    const h3 = structuredClone(t3.velocity);
    return i3.forEach((t4) => {
      h3[t4.bowIndex] > e4.settings.play.approach.velocity.max && (h3[t4.bowIndex] = e4.settings.play.approach.velocity.max);
      const n4 = h3[t4.bowIndex], i4 = n4 - n4 * (l3 / 100);
      h3[t4.bowIndex] = i4 > s3.minLanding ? i4 : s3.minLanding;
    }), { slideTabObjList: c3, landingVelocity: h3 };
  }(e3, i2, a2, s2, d2, c2);
  return t2.splice(r2, 0, ...m2), n2.fullNoteIndexWithTick.splice(r2, 0, ...Array(m2.length).fill(-1)), i2.velocity = h2, i2.slideTrueType = 2, s2.forEach((e4) => {
    void 0 !== i2.bar.fretStartTicks[e4.bowIndex] && (i2.bar.fretStartTicks[e4.bowIndex] = i2.bar.fretStartTicks[e4.bowIndex] + d2 * c2);
  }), or();
}
function Tt(e3) {
  return 10 * io * e3;
}
function Ct(e3) {
  return e3 > 8191 ? 8191 : -8191 > e3 ? -8191 : Math.floor(e3);
}
function jt(e3, t2, n2, i2, r2, o2 = 0) {
  const s2 = n2 - t2, c2 = o2 ? s2 : s2 / 2;
  if (0 === c2) return [];
  const a2 = Tt(i2), u2 = Tt(r2) - a2;
  for (let n3 = 0; c2 >= n3; n3 += Zi.bendSeparateTick) e3.push({ pitch: Ct(a2 + Math.ceil((Math.sin(n3 / s2 * 2 * Math.PI - Math.PI / 2) + 1) / 2 * u2)), tick: t2 + (o2 ? n3 : 2 * n3) });
  return e3;
}
function Ot(e3, t2, n2, i2, r2, o2 = 0) {
  if (o2) {
    const o3 = n2 - t2;
    return Ot(e3, t2, t2 + o3 / 2 - 1, i2, r2), void Ot(e3, t2 + o3 / 2, n2, r2, i2);
  }
  r2 > i2 ? function(e4, t3, n3, i3, r3) {
    const o3 = n3 - t3;
    if (!o3) return [];
    const s2 = Tt(i3), c2 = Tt(r3) - s2;
    for (let n4 = 0; o3 >= n4; n4 += Zi.bendSeparateTick) e4.push({ tick: n4 + t3, pitch: Ct(s2 + c2 / (o3 * o3) * n4 * n4) });
  }(e3, t2, n2, i2, r2) : function(e4, t3, n3, i3, r3) {
    const o3 = i3, s2 = n3 - t3, c2 = Tt(r3), a2 = Math.floor(Tt(o3)) - c2;
    if (0 === a2) return [];
    for (let n4 = 0; s2 >= n4; n4 += Zi.bendSeparateTick) {
      const i4 = s2 - n4;
      e4.push({ tick: n4 + t3, pitch: Ct(c2 + a2 / (s2 * s2) * i4 * i4) });
    }
  }(e3, t2, n2, i2, r2);
}
function Et(e3, t2) {
  const n2 = { bendNormalList: [], bendChannelList: [] };
  return Dt(n2, { tabObjId: -1, bar: e3, styles: { inst: zi.normal } }, structuredClone(t2)), n2.bendChannelList;
}
function Dt(e3, t2, n2) {
  const i2 = { specifiedPitch: 0, untilStep: 0 }, r2 = { view: [], bend: [] };
  let o2 = 0;
  const s2 = void 0 === t2.styles.inst || t2.styles.inst === zi.normal ? 0 : 1;
  for (let c2 = 0; n2.length > c2; c2++) {
    const a2 = n2[c2], u2 = Bt(i2, t2, a2, r2);
    if (u2.fail()) return u2;
    if (i2.untilStep = a2.untilRange[0], u2.res.length && (e3.bendChannelList.push({ bend: u2.res, hasMute: s2, tabObjId: t2.tabObjId }), r2.bend.push(u2.res), t2.continueX)) {
      const n3 = [];
      u2.res.forEach((e4, i3) => {
        e4.pitch > 0 || (u2.res.length - 1 > i3 && u2.res[i3 + 1].pitch > 0 ? n3.push({ tick: e4.tick, pitch: 0 }) : t2.styles.legato || (o2 = 1, n3.push(e4)));
      }), n3.length && e3.bendNormalList.push({ bend: n3, hasMute: s2, tabObjId: t2.tabObjId });
    }
  }
  if (o2) {
    const n3 = Math.max(...t2.bar.fretStopTicks.map((e4) => void 0 !== e4 ? e4 : -1));
    0 > n3 || e3.bendNormalList.push({ bend: [{ tick: n3, pitch: 0 }], hasMute: s2, tabObjId: t2.tabObjId });
  }
  return or();
}
function Bt(e3, t2, n2, i2) {
  if (void 0 === n2.method) return function(e4, t3, n3, i3) {
    const r2 = [], o2 = function(e5, t4) {
      const n4 = Ke([1, t4[2]]);
      let i4 = e5.bar.startTick + n4 * t4[0], r3 = -1;
      -1 === t4[1] ? r3 = e5.bar.stopTick : -2 === t4[1] ? (i4 = e5.bar.stopTick, r3 = e5.bar.stopTick) : r3 = e5.bar.startTick + n4 * t4[1];
      let o3 = Math.max(...e5.bar.fretStartTicks.map((e6) => void 0 !== e6 ? e6 : -1));
      let s2 = e5.bar.fretStopTicks.filter((e6) => void 0 !== e6).length ? Math.min(...e5.bar.fretStopTicks.filter((e6) => void 0 !== e6)) : -1;
      return -1 !== o3 && s2 > o3 || (o3 = e5.bar.startTick, s2 = e5.bar.stopTick), o3 > r3 || i4 > s2 ? new ir(void 0) : (r3 > s2 && (r3 = s2), o3 > i4 && (i4 = o3), new ir({ startTick: i4, stopTick: r3 }));
    }(t3, n3.untilRange);
    return o2.fail() ? o2 : (void 0 !== o2.res && (o2.res.startTick === o2.res.stopTick ? (r2.push({ tick: o2.res.startTick - 1, pitch: Tt(e4.specifiedPitch) }), r2.push({ tick: o2.res.startTick, pitch: Tt(n3.pitch) })) : n3.curve !== Vi.ast ? jt(r2, o2.res.startTick, o2.res.stopTick, e4.specifiedPitch, n3.pitch) : Ot(r2, o2.res.startTick, o2.res.stopTick, e4.specifiedPitch, n3.pitch), i3.view.push({ startTick: o2.res.startTick, stopTick: o2.res.stopTick, row: n3.row, line: n3.line, linePos: n3.linePos })), e4.specifiedPitch = n3.pitch, new ir(r2));
  }(e3, t2, n2, i2);
  {
    const r2 = 0.3;
    return void 0 === n2.pitch && (n2.pitch = 0 === e3.specifiedPitch ? r2 : e3.specifiedPitch > 0 ? e3.specifiedPitch - r2 : e3.specifiedPitch + r2), function(e4, t3, n3, i3) {
      const r3 = [];
      let o2 = 0;
      if (-1 === n3.untilRange[1]) {
        const e5 = Ke([1, n3.untilRange[2]]);
        n3.untilRange[1] = t3.bar.tick / e5;
      }
      for (let s2 = n3.untilRange[0]; n3.untilRange[1] > s2; s2++) {
        const c2 = Ft(t3, [s2, s2 + 1, n3.untilRange[2]]);
        if (c2.fail()) return c2;
        void 0 !== c2.res && (o2 ? n3.curve !== Vi.ast ? jt(r3, c2.res.startTick, c2.res.stopTick, n3.pitch, e4.specifiedPitch) : Ot(r3, c2.res.startTick, c2.res.stopTick, n3.pitch, e4.specifiedPitch) : n3.curve !== Vi.ast ? jt(r3, c2.res.startTick, c2.res.stopTick, e4.specifiedPitch, n3.pitch) : Ot(r3, c2.res.startTick, c2.res.stopTick, e4.specifiedPitch, n3.pitch), i3.view.push({ startTick: c2.res.startTick, stopTick: c2.res.stopTick, row: n3.row, line: n3.line, linePos: n3.linePos }), o2 = o2 ? 0 : 1);
      }
      return e4.specifiedPitch = o2 ? n3.pitch : e4.specifiedPitch, new ir(r3);
    }(e3, t2, n2, i2);
  }
}
function Ft(e3, t2) {
  const n2 = Ke([1, t2[2]]);
  let i2 = e3.bar.startTick + n2 * t2[0], r2 = -1;
  r2 = -1 === t2[1] ? e3.bar.stopTick : e3.bar.startTick + n2 * t2[1];
  let o2 = Math.max(...e3.bar.fretStartTicks.map((e4) => void 0 !== e4 ? e4 : -1)), s2 = e3.bar.fretStopTicks.filter((e4) => void 0 !== e4).length ? Math.min(...e3.bar.fretStopTicks.filter((e4) => void 0 !== e4)) : -1;
  return -1 !== o2 && s2 > o2 || (o2 = e3.bar.startTick, s2 = e3.bar.stopTick), o2 > r2 || i2 > s2 ? new ir(void 0) : (r2 > s2 && (r2 = s2), o2 > i2 && (i2 = o2), new ir({ startTick: i2, stopTick: r2 }));
}
function Lt(e3, t2, n2) {
  const i2 = function(e4) {
    const t3 = e4[0].regionIndex;
    for (let n3 = 1; e4.length > n3; n3++) {
      const i3 = e4[n3];
      if (t3 !== i3.regionIndex) return new cr(i3.syntaxLocation.line, i3.syntaxLocation.linePos, null, `Invalid legato place '${i3.noteStr}'. Legato cannot be applied across regions.`);
    }
    return or();
  }(t2);
  if (i2.fail()) return i2;
  const r2 = function(e4, t3, n3) {
    const { flatTOList: i3, marks: r3 } = e4, o3 = [], s2 = [], c2 = t3[0].tab, a2 = t3[1].tab;
    for (let e5 = 0; c2.length > e5; e5++) {
      const t4 = c2[e5], n4 = a2[e5];
      if (void 0 === t4 || 0 > t4) {
        if (void 0 !== n4 && n4 >= 0) return new ir(-1);
        o3.push(void 0), s2.push(void 0);
      } else void 0 === n4 || 0 > n4 ? (s2.push(void 0), o3.push(t4)) : (s2.push(t4), o3.push(void 0));
    }
    if (void 0 !== o3.find((e5) => void 0 !== e5)) {
      const e5 = t3[t3.length - 1].bar.stopTick, c3 = gt(t3[0].regionIndex, t3[0].tabObjId, t3[0].regionNoteIndex, t3[0].tab.length);
      c3.bar = structuredClone(t3[0].bar), c3.syntaxLocation = structuredClone(t3[0].syntaxLocation), c3.velocity = structuredClone(t3[0].velocity), c3.styles = t3[0].styles, i3[n3 + 1].prevTabObj = i3[n3], n3 > 0 && (i3[n3].prevTabObj = i3[n3 - 1]), i3.splice(n3, 0, c3), r3.fullNoteIndexWithTick.splice(n3, 0, r3.fullNoteIndexWithTick[n3]), i3[n3].regionNoteIndex = -1, i3[n3].tab = o3, i3[n3].continueX && (i3[n3].bar.stopTick = e5, i3[n3].bar.fretStopTicks.forEach((t4, r4) => {
        void 0 !== i3[n3].bar.fretStopTicks[r4] && (i3[n3].bar.fretStopTicks[r4] = e5);
      })), i3[n3 + 1].tab = s2, i3[n3 + 1].tabObjId += 0.1, i3[n3 + 1].styles.stroke = { off: 1 }, t3[0] = i3[n3 + 1], n3++;
    }
    return new ir(n3);
  }(e3, t2, n2);
  if (r2.fail()) return r2;
  if (-1 === r2.res) return Gt(e3, t2, n2), or();
  const o2 = function(e4) {
    var _a;
    let t3 = "";
    for (let n4 = 0; e4.length > n4; n4++) if (0 === n4) t3 = JSON.stringify(e4[0].tab.map((e5) => void 0 !== e5 ? 1 : 0));
    else if (t3 !== JSON.stringify(e4[n4].tab.map((e5) => void 0 !== e5 ? 1 : 0))) return new ir(void 0);
    const n3 = [];
    let i3 = -1;
    for (let t4 = 0; e4[0].tab.length > t4; t4++) if (n3.length) for (let i4 = 1; e4.length > i4; i4++) {
      const r4 = e4[i4 - 1].tab[t4], o4 = e4[i4].tab[t4];
      if (void 0 !== r4 && void 0 !== o4 && n3[i4 - 1] !== r4 - o4) return new ir(void 0);
    }
    else {
      i3 = t4;
      for (let i4 = 1; e4.length > i4; i4++) {
        const r4 = e4[i4 - 1].tab[t4], o4 = e4[i4].tab[t4];
        void 0 !== r4 && void 0 !== o4 && n3.push(r4 - o4);
      }
    }
    const r3 = [];
    for (let t4 = 0; e4.length > t4; t4++) r3.push(e4[t4].tab[i3]);
    const o3 = Math.min(...r3), s2 = Math.max(...r3);
    if (s2 - o3 > 4) return new ir(void 0);
    const c2 = r3.map((e5) => e5 === s2 ? 2 : e5 === s2 - 1 ? 1 : e5 === s2 - 2 ? 0 : e5 === s2 - 3 ? -1 : -2), a2 = e4[e4.length - 1].bar.stopTick;
    0 !== c2[0] && (e4[0].tabShift = -c2[0]), e4[0].styles.bd = [{ untilRange: [0, 0, 16], pitch: c2[0], isLegato: 1 }], e4[0].bar.stopTick = a2, e4[0].bar.fretStopTicks.forEach((t4, n4) => {
      void 0 !== e4[0].bar.fretStopTicks[n4] && (e4[0].bar.fretStopTicks[n4] = a2);
    });
    for (let t4 = 1; e4.length > t4; t4++) e4[t4].continueX = 1, e4[t4].tab = Array(e4[t4].tab.length).fill(void 0), e4[t4].styles.bd = [{ untilRange: [0, 0, 16], pitch: c2[t4], isLegato: 1 }];
    return (_a = e4[e4.length - 1].styles.bd) == null ? void 0 : _a.push({ untilRange: [-2, -2, 1], pitch: 0, isLegato: 1 }), new ir("success");
  }(t2);
  return o2.fail() ? o2 : (void 0 === o2.res && Gt(e3, t2, r2.res), or());
}
function Gt(e3, t2, n2) {
  const { flatTOList: i2 } = e3, r2 = i2[n2], o2 = Math.round(700 * Re(r2.bpm, r2.bar.tick));
  for (let e4 = 1; t2.length > e4; e4++) t2[e4].velocity = t2[e4].velocity.map((e5) => void 0 !== e5 ? Math.max(55, e5 - o2) : void 0);
}
function _t(e3) {
  var t2, n2;
  return e3.i ? e3 : ("function" == typeof (t2 = e3.default) ? (n2 = function e4() {
    return this instanceof e4 ? Reflect.construct(t2, arguments, this.constructor) : t2.apply(this, arguments);
  }, n2.prototype = t2.prototype) : n2 = {}, Object.defineProperty(n2, "i", { value: 1 }), Object.keys(e3).forEach(function(t3) {
    var i2 = Object.getOwnPropertyDescriptor(e3, t3);
    Object.defineProperty(n2, t3, i2.get ? i2 : { enumerable: 1, get: function() {
      return e3[t3];
    } });
  }), n2);
}
function Ut(e3) {
  function t2() {
    var e4, t3, n3, o3, s2, c2, a2, u2 = {};
    if (u2.deltaTime = r2.readVarInt(), 240 & ~(e4 = r2.readUInt8())) {
      if (128 & e4) s2 = r2.readUInt8(), i2 = e4;
      else {
        if (null === i2) throw "Running status byte encountered before status byte";
        s2 = e4, e4 = i2, u2.running = 1;
      }
      switch (c2 = e4 >> 4, u2.channel = 15 & e4, c2) {
        case 8:
          return u2.type = "noteOff", u2.noteNumber = s2, u2.velocity = r2.readUInt8(), u2;
        case 9:
          return a2 = r2.readUInt8(), u2.type = 0 === a2 ? "noteOff" : "noteOn", u2.noteNumber = s2, u2.velocity = a2, 0 === a2 && (u2.byte9 = 1), u2;
        case 10:
          return u2.type = "noteAftertouch", u2.noteNumber = s2, u2.amount = r2.readUInt8(), u2;
        case 11:
          return u2.type = "controller", u2.controllerType = s2, u2.value = r2.readUInt8(), u2;
        case 12:
          return u2.type = "programChange", u2.programNumber = s2, u2;
        case 13:
          return u2.type = "channelAftertouch", u2.amount = s2, u2;
        case 14:
          return u2.type = "pitchBend", u2.value = s2 + (r2.readUInt8() << 7) - 8192, u2;
        default:
          throw "Unrecognised MIDI event type: " + c2;
      }
    } else {
      if (255 !== e4) {
        if (240 == e4) return u2.type = "sysEx", n3 = r2.readVarInt(), u2.data = r2.readBytes(n3), u2;
        if (247 == e4) return u2.type = "endSysEx", n3 = r2.readVarInt(), u2.data = r2.readBytes(n3), u2;
        throw "Unrecognised MIDI event type byte: " + e4;
      }
      switch (u2.meta = 1, t3 = r2.readUInt8(), n3 = r2.readVarInt(), t3) {
        case 0:
          if (u2.type = "sequenceNumber", 2 !== n3) throw "Expected length for sequenceNumber event is 2, got " + n3;
          return u2.number = r2.readUInt16(), u2;
        case 1:
          return u2.type = "text", u2.text = r2.readString(n3), u2;
        case 2:
          return u2.type = "copyrightNotice", u2.text = r2.readString(n3), u2;
        case 3:
          return u2.type = "trackName", u2.text = r2.readString(n3), u2;
        case 4:
          return u2.type = "instrumentName", u2.text = r2.readString(n3), u2;
        case 5:
          return u2.type = "lyrics", u2.text = r2.readString(n3), u2;
        case 6:
          return u2.type = "marker", u2.text = r2.readString(n3), u2;
        case 7:
          return u2.type = "cuePoint", u2.text = r2.readString(n3), u2;
        case 32:
          if (u2.type = "channelPrefix", 1 != n3) throw "Expected length for channelPrefix event is 1, got " + n3;
          return u2.channel = r2.readUInt8(), u2;
        case 33:
          if (u2.type = "portPrefix", 1 != n3) throw "Expected length for portPrefix event is 1, got " + n3;
          return u2.port = r2.readUInt8(), u2;
        case 47:
          if (u2.type = "endOfTrack", 0 != n3) throw "Expected length for endOfTrack event is 0, got " + n3;
          return u2;
        case 81:
          if (u2.type = "setTempo", 3 != n3) throw "Expected length for setTempo event is 3, got " + n3;
          return u2.microsecondsPerBeat = r2.readUInt24(), u2;
        case 84:
          if (u2.type = "smpteOffset", 5 != n3) throw "Expected length for smpteOffset event is 5, got " + n3;
          return o3 = r2.readUInt8(), u2.frameRate = { 0: 24, 32: 25, 64: 29, 96: 30 }[96 & o3], u2.hour = 31 & o3, u2.min = r2.readUInt8(), u2.sec = r2.readUInt8(), u2.frame = r2.readUInt8(), u2.subFrame = r2.readUInt8(), u2;
        case 88:
          if (u2.type = "timeSignature", 2 != n3 && 4 != n3) throw "Expected length for timeSignature event is 4 or 2, got " + n3;
          return u2.numerator = r2.readUInt8(), u2.denominator = 1 << r2.readUInt8(), 4 === n3 ? (u2.metronome = r2.readUInt8(), u2.thirtyseconds = r2.readUInt8()) : (u2.metronome = 36, u2.thirtyseconds = 8), u2;
        case 89:
          if (u2.type = "keySignature", 2 != n3) throw "Expected length for keySignature event is 2, got " + n3;
          return u2.key = r2.readInt8(), u2.scale = r2.readUInt8(), u2;
        case 127:
          return u2.type = "sequencerSpecific", u2.data = r2.readBytes(n3), u2;
        default:
          return u2.type = "unknownMeta", u2.data = r2.readBytes(n3), u2.metatypeByte = t3, u2;
      }
    }
  }
  for (var n2, i2, r2 = new Rt(e3), o2 = []; !r2.eof(); ) n2 = t2(), o2.push(n2);
  return o2;
}
function Rt(e3) {
  this.buffer = e3, this.bufferLen = this.buffer.length, this.pos = 0;
}
function qt(e3, t2, n2) {
  var i2, r2 = new Wt(), o2 = t2.length, s2 = null;
  for (i2 = 0; o2 > i2; i2++) 0 != n2.running && (n2.running || t2[i2].running) || (s2 = null), s2 = Kt(r2, t2[i2], s2, n2.useByte9ForNoteOff);
  e3.writeChunk("MTrk", r2.buffer);
}
function Kt(e3, t2, n2, i2) {
  var r2, o2, s2 = t2.type, c2 = t2.text || "", a2 = t2.data || [], u2 = null;
  switch (e3.writeVarInt(t2.deltaTime), s2) {
    case "sequenceNumber":
      e3.writeUInt8(255), e3.writeUInt8(0), e3.writeVarInt(2), e3.writeUInt16(t2.number);
      break;
    case "text":
      e3.writeUInt8(255), e3.writeUInt8(1), e3.writeVarInt(c2.length), e3.writeString(c2);
      break;
    case "copyrightNotice":
      e3.writeUInt8(255), e3.writeUInt8(2), e3.writeVarInt(c2.length), e3.writeString(c2);
      break;
    case "trackName":
      e3.writeUInt8(255), e3.writeUInt8(3), e3.writeVarInt(c2.length), e3.writeString(c2);
      break;
    case "instrumentName":
      e3.writeUInt8(255), e3.writeUInt8(4), e3.writeVarInt(c2.length), e3.writeString(c2);
      break;
    case "lyrics":
      e3.writeUInt8(255), e3.writeUInt8(5), e3.writeVarInt(c2.length), e3.writeString(c2);
      break;
    case "marker":
      e3.writeUInt8(255), e3.writeUInt8(6), e3.writeVarInt(c2.length), e3.writeString(c2);
      break;
    case "cuePoint":
      e3.writeUInt8(255), e3.writeUInt8(7), e3.writeVarInt(c2.length), e3.writeString(c2);
      break;
    case "channelPrefix":
      e3.writeUInt8(255), e3.writeUInt8(32), e3.writeVarInt(1), e3.writeUInt8(t2.channel);
      break;
    case "portPrefix":
      e3.writeUInt8(255), e3.writeUInt8(33), e3.writeVarInt(1), e3.writeUInt8(t2.port);
      break;
    case "endOfTrack":
      e3.writeUInt8(255), e3.writeUInt8(47), e3.writeVarInt(0);
      break;
    case "setTempo":
      e3.writeUInt8(255), e3.writeUInt8(81), e3.writeVarInt(3), e3.writeUInt24(t2.microsecondsPerBeat);
      break;
    case "smpteOffset":
      e3.writeUInt8(255), e3.writeUInt8(84), e3.writeVarInt(5), e3.writeUInt8(31 & t2.hour | { 24: 0, 25: 32, 29: 64, 30: 96 }[t2.frameRate]), e3.writeUInt8(t2.min), e3.writeUInt8(t2.sec), e3.writeUInt8(t2.frame), e3.writeUInt8(t2.subFrame);
      break;
    case "timeSignature":
      e3.writeUInt8(255), e3.writeUInt8(88), e3.writeVarInt(4), e3.writeUInt8(t2.numerator), e3.writeUInt8(255 & Math.floor(Math.log(t2.denominator) / Math.LN2)), e3.writeUInt8(t2.metronome), e3.writeUInt8(t2.thirtyseconds || 8);
      break;
    case "keySignature":
      e3.writeUInt8(255), e3.writeUInt8(89), e3.writeVarInt(2), e3.writeInt8(t2.key), e3.writeUInt8(t2.scale);
      break;
    case "sequencerSpecific":
      e3.writeUInt8(255), e3.writeUInt8(127), e3.writeVarInt(a2.length), e3.writeBytes(a2);
      break;
    case "unknownMeta":
      null != t2.metatypeByte && (e3.writeUInt8(255), e3.writeUInt8(t2.metatypeByte), e3.writeVarInt(a2.length), e3.writeBytes(a2));
      break;
    case "sysEx":
      e3.writeUInt8(240), e3.writeVarInt(a2.length), e3.writeBytes(a2);
      break;
    case "endSysEx":
      e3.writeUInt8(247), e3.writeVarInt(a2.length), e3.writeBytes(a2);
      break;
    case "noteOff":
      (u2 = (0 != i2 && t2.byte9 || i2 && 0 == t2.velocity ? 144 : 128) | t2.channel) !== n2 && e3.writeUInt8(u2), e3.writeUInt8(t2.noteNumber), e3.writeUInt8(t2.velocity);
      break;
    case "noteOn":
      (u2 = 144 | t2.channel) !== n2 && e3.writeUInt8(u2), e3.writeUInt8(t2.noteNumber), e3.writeUInt8(t2.velocity);
      break;
    case "noteAftertouch":
      (u2 = 160 | t2.channel) !== n2 && e3.writeUInt8(u2), e3.writeUInt8(t2.noteNumber), e3.writeUInt8(t2.amount);
      break;
    case "controller":
      (u2 = 176 | t2.channel) !== n2 && e3.writeUInt8(u2), e3.writeUInt8(t2.controllerType), e3.writeUInt8(t2.value);
      break;
    case "programChange":
      (u2 = 192 | t2.channel) !== n2 && e3.writeUInt8(u2), e3.writeUInt8(t2.programNumber);
      break;
    case "channelAftertouch":
      (u2 = 208 | t2.channel) !== n2 && e3.writeUInt8(u2), e3.writeUInt8(t2.amount);
      break;
    case "pitchBend":
      (u2 = 224 | t2.channel) !== n2 && e3.writeUInt8(u2), o2 = (r2 = 8192 + t2.value) >> 7 & 127, e3.writeUInt8(127 & r2), e3.writeUInt8(o2);
      break;
    default:
      throw "Unrecognized event type: " + s2;
  }
  return u2;
}
function Wt() {
  this.buffer = [];
}
function zt(e3, t2, n2) {
  var i2, r2, o2, s2, c2, a2, u2;
  if (void 0 === n2 && (n2 = "ticks"), i2 = 0, o2 = r2 = e3.length, r2 > 0 && t2 >= e3[r2 - 1][n2]) return r2 - 1;
  for (; o2 > i2; ) {
    if (a2 = e3[(s2 = Math.floor(i2 + (o2 - i2) / 2)) + 1], (c2 = e3[s2])[n2] === t2) {
      for (u2 = s2; e3.length > u2; u2++) e3[u2][n2] === t2 && (s2 = u2);
      return s2;
    }
    if (t2 > c2[n2] && a2[n2] > t2) return s2;
    c2[n2] > t2 ? o2 = s2 : t2 > c2[n2] && (i2 = s2 + 1);
  }
  return -1;
}
function Xt(e3) {
  return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][e3 % 12];
}
function Vt(e3, t2) {
  var n2, i2;
  for (n2 = 0; e3.length > n2; n2++) Array.isArray(i2 = e3[n2]) ? Vt(i2, t2) : t2.push(i2);
}
function Jt(e3, t2) {
  return { absoluteTime: e3.ticks, channel: t2, controllerType: e3.number, deltaTime: 0, type: "controller", value: Math.floor(127 * e3.value) };
}
function Ht(e3) {
  return { absoluteTime: 0, channel: e3.channel, deltaTime: 0, programNumber: e3.instrument.number, type: "programChange" };
}
function Yt(e3, t2 = 0) {
  const n2 = (e3 === zi.normal || e3 === zi.normalUnContinueForStep ? 0 : 1) + (t2 ? 2 : 0);
  return { [zi.normal]: { midiInst: n2, vel: 0 }, [zi.mute]: { midiInst: n2, vel: -0.3 }, [zi.muteContinue]: { midiInst: n2, vel: -0.3 }, [zi.rest]: { midiInst: n2, vel: 0 }, [zi.restNoise]: { midiInst: n2, vel: 0.28, duration: 1 }, [zi.brushing_d]: { midiInst: n2, vel: -0.4, duration: 1 }, [zi.brushing_D]: { midiInst: n2, vel: -0.25, duration: 1 }, [zi.brushing_u]: { midiInst: n2, vel: -0.4, duration: 1 }, [zi.brushing_U]: { midiInst: n2, vel: -0.25, duration: 1 }, [zi.strum]: { midiInst: n2, vel: -0.25, duration: 1 }, [zi.normalUnContinueForStep]: { midiInst: n2, vel: 0 } }[e3];
}
var Qt, Zt, en, tn, nn, rn, on, sn, cn, an, un, fn, ln, dn, mn, hn, vn, bn, pn, yn, wn, Mn, kn, Pn, gn, $n, Nn, An, Sn, xn, In, Tn, Cn, jn, On, En, Dn, Bn, Fn, Ln, Gn, _n, Un, Rn, qn, Kn, Wn, zn, Xn, Vn, Jn, Hn, Yn, Qn, Zn, ei, ti, ni, ii, ri, oi, si, ci, ai, ui, fi, li, di, mi, hi, vi, bi, pi, yi, wi, Mi, ki, Pi, gi, $i, Ni, Ai, Si, xi, Ii, Ti, Ci, ji, Oi, Ei, Di, Bi, Fi, Li, Gi, _i, Ui, Ri, qi, Ki, Wi, zi = ((e3) => (e3.normal = "normal", e3.mute = "mute", e3.muteContinue = "muteContinue", e3.rest = "rest", e3.restNoise = "restNoise", e3.brushing_d = "brushing_d", e3.brushing_D = "brushing_D", e3.brushing_u = "brushing_u", e3.brushing_U = "brushing_U", e3.strum = "strum", e3.normalUnContinueForStep = "normalUnContinueForStep", e3))(zi || {}), Xi = ((e3) => (e3[e3.vib = 0] = "vib", e3))(Xi || {}), Vi = ((e3) => (e3[e3.ast = 0] = "ast", e3[e3.tri = 1] = "tri", e3))(Vi || {}), Ji = ((e3) => (e3[e3.vib = 0] = "vib", e3[e3.cho = 1] = "cho", e3[e3.end = 2] = "end", e3))(Ji || {}), Hi = ((e3) => (e3[e3.fast = 0] = "fast", e3[e3.slow = 1] = "slow", e3[e3.auto = 2] = "auto", e3))(Hi || {}), Yi = ((e3) => (e3[e3.rev = 0] = "rev", e3[e3.ss = 1] = "ss", e3[e3.sos = 2] = "sos", e3[e3.nos = 3] = "nos", e3))(Yi || {});
const Qi = Object.keys(Yi).filter((e3) => isNaN(+e3) && !isNaN(Yi[e3])), Zi = { dualJoiner: ">>", dualLength: 3, basicTick: 480, PPS: 1920, startTick: 480, bpmTransitionSpan: 2, maxUntilNext0: 128, maxUntilNext1: 128, minBPM: 1, maxBPM: 1e3, maxTopFret: 24, maxBows: 9, maxApproachPercent: 500, maxStrumWidthMSec: 100, maxSuffixExtensionLength: 16, bendSeparateTick: 10, bendMaxFixedUntilDenom: 128, maxMappedStepOrder: 1e3 }, er = { iKey: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], iKey32material: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] };
Zt = 1e9, en = "0123456789abcdef", rn = { precision: 20, rounding: 4, modulo: 1, toExpNeg: -7, toExpPos: 21, minE: -(Qt = 9e15), maxE: Qt, crypto: 0 }, cn = 1, un = (an = "[DecimalError] ") + "Invalid argument: ", fn = an + "Precision limit exceeded", ln = an + "crypto unavailable", mn = Math.floor, hn = Math.pow, vn = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i, bn = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i, pn = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i, yn = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, wn = 1e7, Mn = 7, kn = (tn = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058").length - 1, Pn = (nn = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789").length - 1, (gn = { toStringTag: dn = "[object Decimal]" }).absoluteValue = gn.abs = function() {
  var e3 = new this.constructor(this);
  return 0 > e3.s && (e3.s = 1), r(e3);
}, gn.ceil = function() {
  return r(new this.constructor(this), this.e + 1, 2);
}, gn.clampedTo = gn.clamp = function(e3, t2) {
  var n2 = this, i2 = n2.constructor;
  if (e3 = new i2(e3), t2 = new i2(t2), !e3.s || !t2.s) return new i2(NaN);
  if (e3.gt(t2)) throw Error(un + t2);
  return 0 > n2.cmp(e3) ? e3 : n2.cmp(t2) > 0 ? t2 : new i2(n2);
}, gn.comparedTo = gn.cmp = function(e3) {
  var t2, n2, i2, r2, o2 = this, s2 = o2.d, c2 = (e3 = new o2.constructor(e3)).d, a2 = o2.s, u2 = e3.s;
  if (!s2 || !c2) return a2 && u2 ? a2 !== u2 ? a2 : s2 === c2 ? 0 : !s2 ^ 0 > a2 ? 1 : -1 : NaN;
  if (!s2[0] || !c2[0]) return s2[0] ? a2 : c2[0] ? -u2 : 0;
  if (a2 !== u2) return a2;
  if (o2.e !== e3.e) return o2.e > e3.e ^ 0 > a2 ? 1 : -1;
  for (t2 = 0, n2 = (r2 = c2.length) > (i2 = s2.length) ? i2 : r2; n2 > t2; ++t2) if (s2[t2] !== c2[t2]) return s2[t2] > c2[t2] ^ 0 > a2 ? 1 : -1;
  return i2 === r2 ? 0 : i2 > r2 ^ 0 > a2 ? 1 : -1;
}, gn.cosine = gn.cos = function() {
  var e3, t2, n2 = this, i2 = n2.constructor;
  return n2.d ? n2.d[0] ? (t2 = i2.rounding, i2.precision = (e3 = i2.precision) + Math.max(n2.e, n2.sd()) + Mn, i2.rounding = 1, n2 = function(e4, t3) {
    var n3, i3, r2, o2, s2;
    if (t3.isZero()) return t3;
    for (32 > (i3 = t3.d.length) ? r2 = "" + 1 / M(4, n3 = Math.ceil(i3 / 3)) : (n3 = 16, r2 = "2.3283064365386962890625e-10"), e4.precision += n3, t3 = w(e4, 1, t3.times(r2), new e4(1)), o2 = n3; o2--; ) s2 = t3.times(t3), t3 = s2.times(s2).minus(s2).times(8).plus(1);
    return e4.precision -= n3, t3;
  }(i2, k(i2, n2)), i2.precision = e3, i2.rounding = t2, r(2 == sn || 3 == sn ? n2.neg() : n2, e3, t2, 1)) : new i2(1) : new i2(NaN);
}, gn.cubeRoot = gn.cbrt = function() {
  var t2, n2, i2, o2, s2, c2, a2, u2, f2, l2, d2 = this, m2 = d2.constructor;
  if (!d2.isFinite() || d2.isZero()) return new m2(d2);
  for (cn = 0, (c2 = d2.s * hn(d2.s * d2, 1 / 3)) && Math.abs(c2) != 1 / 0 ? o2 = new m2("" + c2) : (i2 = e(d2.d), (c2 = ((t2 = d2.e) - i2.length + 1) % 3) && (i2 += 1 == c2 || -2 == c2 ? "0" : "00"), c2 = hn(i2, 1 / 3), t2 = mn((t2 + 1) / 3) - (t2 % 3 == (0 > t2 ? -1 : 2)), (o2 = new m2(i2 = c2 == 1 / 0 ? "5e" + t2 : (i2 = c2.toExponential()).slice(0, i2.indexOf("e") + 1) + t2)).s = d2.s), a2 = (t2 = m2.precision) + 3; ; ) if (l2 = (f2 = (u2 = o2).times(u2).times(u2)).plus(d2), o2 = $n(l2.plus(d2).times(u2), l2.plus(f2), a2 + 2, 1), e(u2.d).slice(0, a2) === (i2 = e(o2.d)).slice(0, a2)) {
    if ("9999" != (i2 = i2.slice(a2 - 3, a2 + 1)) && (s2 || "4999" != i2)) {
      +i2 && (+i2.slice(1) || "5" != i2.charAt(0)) || (r(o2, t2 + 1, 1), n2 = !o2.times(o2).times(o2).eq(d2));
      break;
    }
    if (!s2 && (r(u2, t2 + 1, 0), u2.times(u2).times(u2).eq(d2))) {
      o2 = u2;
      break;
    }
    a2 += 4, s2 = 1;
  }
  return cn = 1, r(o2, t2, m2.rounding, n2);
}, gn.decimalPlaces = gn.dp = function() {
  var e3, t2 = this.d, n2 = NaN;
  if (t2) {
    if (n2 = ((e3 = t2.length - 1) - mn(this.e / Mn)) * Mn, e3 = t2[e3]) for (; e3 % 10 == 0; e3 /= 10) n2--;
    0 > n2 && (n2 = 0);
  }
  return n2;
}, gn.dividedBy = gn.div = function(e3) {
  return $n(this, new this.constructor(e3));
}, gn.dividedToIntegerBy = gn.divToInt = function(e3) {
  var t2 = this.constructor;
  return r($n(this, new t2(e3), 0, 1, 1), t2.precision, t2.rounding);
}, gn.equals = gn.eq = function(e3) {
  return 0 === this.cmp(e3);
}, gn.floor = function() {
  return r(new this.constructor(this), this.e + 1, 3);
}, gn.greaterThan = gn.gt = function(e3) {
  return this.cmp(e3) > 0;
}, gn.greaterThanOrEqualTo = gn.gte = function(e3) {
  var t2 = this.cmp(e3);
  return 1 == t2 || 0 === t2;
}, gn.hyperbolicCosine = gn.cosh = function() {
  var e3, t2, n2, i2, o2, s2, c2, a2, u2 = this, f2 = u2.constructor, l2 = new f2(1);
  if (!u2.isFinite()) return new f2(u2.s ? 1 / 0 : NaN);
  if (u2.isZero()) return l2;
  for (i2 = f2.rounding, f2.precision = (n2 = f2.precision) + Math.max(u2.e, u2.sd()) + 4, f2.rounding = 1, 32 > (o2 = u2.d.length) ? t2 = "" + 1 / M(4, e3 = Math.ceil(o2 / 3)) : (e3 = 16, t2 = "2.3283064365386962890625e-10"), u2 = w(f2, 1, u2.times(t2), new f2(1), 1), c2 = e3, a2 = new f2(8); c2--; ) s2 = u2.times(u2), u2 = l2.minus(s2.times(a2.minus(s2.times(a2))));
  return r(u2, f2.precision = n2, f2.rounding = i2, 1);
}, gn.hyperbolicSine = gn.sinh = function() {
  var e3, t2, n2, i2, o2, s2, c2, a2, u2 = this, f2 = u2.constructor;
  if (!u2.isFinite() || u2.isZero()) return new f2(u2);
  if (n2 = f2.rounding, f2.precision = (t2 = f2.precision) + Math.max(u2.e, u2.sd()) + 4, f2.rounding = 1, 3 > (i2 = u2.d.length)) u2 = w(f2, 2, u2, u2, 1);
  else for (u2 = w(f2, 2, u2 = u2.times(1 / M(5, e3 = (e3 = 1.4 * Math.sqrt(i2)) > 16 ? 16 : 0 | e3)), u2, 1), s2 = new f2(5), c2 = new f2(16), a2 = new f2(20); e3--; ) o2 = u2.times(u2), u2 = u2.times(s2.plus(o2.times(c2.times(o2).plus(a2))));
  return f2.precision = t2, f2.rounding = n2, r(u2, t2, n2, 1);
}, gn.hyperbolicTangent = gn.tanh = function() {
  var e3, t2, n2 = this, i2 = n2.constructor;
  return n2.isFinite() ? n2.isZero() ? new i2(n2) : (t2 = i2.rounding, i2.precision = (e3 = i2.precision) + 7, i2.rounding = 1, $n(n2.sinh(), n2.cosh(), i2.precision = e3, i2.rounding = t2)) : new i2(n2.s);
}, gn.inverseCosine = gn.acos = function() {
  var e3, t2 = this, n2 = t2.constructor, i2 = t2.abs().cmp(1), r2 = n2.precision, o2 = n2.rounding;
  return -1 !== i2 ? 0 === i2 ? t2.isNeg() ? a(n2, r2, o2) : new n2(0) : new n2(NaN) : t2.isZero() ? a(n2, r2 + 4, o2).times(0.5) : (n2.precision = r2 + 6, n2.rounding = 1, t2 = t2.asin(), e3 = a(n2, r2 + 4, o2).times(0.5), n2.precision = r2, n2.rounding = o2, e3.minus(t2));
}, gn.inverseHyperbolicCosine = gn.acosh = function() {
  var e3, t2, n2 = this, i2 = n2.constructor;
  return n2.lte(1) ? new i2(n2.eq(1) ? 0 : NaN) : n2.isFinite() ? (t2 = i2.rounding, i2.precision = (e3 = i2.precision) + Math.max(Math.abs(n2.e), n2.sd()) + 4, i2.rounding = 1, cn = 0, n2 = n2.times(n2).minus(1).sqrt().plus(n2), cn = 1, i2.precision = e3, i2.rounding = t2, n2.ln()) : new i2(n2);
}, gn.inverseHyperbolicSine = gn.asinh = function() {
  var e3, t2, n2 = this, i2 = n2.constructor;
  return !n2.isFinite() || n2.isZero() ? new i2(n2) : (t2 = i2.rounding, i2.precision = (e3 = i2.precision) + 2 * Math.max(Math.abs(n2.e), n2.sd()) + 6, i2.rounding = 1, cn = 0, n2 = n2.times(n2).plus(1).sqrt().plus(n2), cn = 1, i2.precision = e3, i2.rounding = t2, n2.ln());
}, gn.inverseHyperbolicTangent = gn.atanh = function() {
  var e3, t2, n2, i2, o2 = this, s2 = o2.constructor;
  return o2.isFinite() ? 0 > o2.e ? (e3 = s2.precision, t2 = s2.rounding, i2 = o2.sd(), 2 * -o2.e - 1 > Math.max(i2, e3) ? r(new s2(o2), e3, t2, 1) : (s2.precision = n2 = i2 - o2.e, o2 = $n(o2.plus(1), new s2(1).minus(o2), n2 + e3, 1), s2.precision = e3 + 4, s2.rounding = 1, o2 = o2.ln(), s2.precision = e3, s2.rounding = t2, o2.times(0.5))) : new s2(o2.abs().eq(1) ? o2.s / 0 : o2.isZero() ? o2 : NaN) : new s2(NaN);
}, gn.inverseSine = gn.asin = function() {
  var e3, t2, n2, i2, r2 = this, o2 = r2.constructor;
  return r2.isZero() ? new o2(r2) : (t2 = r2.abs().cmp(1), n2 = o2.precision, i2 = o2.rounding, -1 !== t2 ? 0 === t2 ? ((e3 = a(o2, n2 + 4, i2).times(0.5)).s = r2.s, e3) : new o2(NaN) : (o2.precision = n2 + 6, o2.rounding = 1, r2 = r2.div(new o2(1).minus(r2.times(r2)).sqrt().plus(1)).atan(), o2.precision = n2, o2.rounding = i2, r2.times(2)));
}, gn.inverseTangent = gn.atan = function() {
  var e3, t2, n2, i2, o2, s2, c2, u2, f2, l2 = this, d2 = l2.constructor, m2 = d2.precision, h2 = d2.rounding;
  if (l2.isFinite()) {
    if (l2.isZero()) return new d2(l2);
    if (l2.abs().eq(1) && Pn >= m2 + 4) return (c2 = a(d2, m2 + 4, h2).times(0.25)).s = l2.s, c2;
  } else {
    if (!l2.s) return new d2(NaN);
    if (Pn >= m2 + 4) return (c2 = a(d2, m2 + 4, h2).times(0.5)).s = l2.s, c2;
  }
  for (d2.precision = u2 = m2 + 10, d2.rounding = 1, e3 = n2 = Math.min(28, u2 / Mn + 2 | 0); e3; --e3) l2 = l2.div(l2.times(l2).plus(1).sqrt().plus(1));
  for (cn = 0, t2 = Math.ceil(u2 / Mn), i2 = 1, f2 = l2.times(l2), c2 = new d2(l2), o2 = l2; -1 !== e3; ) if (o2 = o2.times(f2), s2 = c2.minus(o2.div(i2 += 2)), o2 = o2.times(f2), void 0 !== (c2 = s2.plus(o2.div(i2 += 2))).d[t2]) for (e3 = t2; c2.d[e3] === s2.d[e3] && e3--; ) ;
  return n2 && (c2 = c2.times(2 << n2 - 1)), cn = 1, r(c2, d2.precision = m2, d2.rounding = h2, 1);
}, gn.isFinite = function() {
  return !!this.d;
}, gn.isInteger = gn.isInt = function() {
  return !!this.d && mn(this.e / Mn) > this.d.length - 2;
}, gn.isNaN = function() {
  return !this.s;
}, gn.isNegative = gn.isNeg = function() {
  return 0 > this.s;
}, gn.isPositive = gn.isPos = function() {
  return this.s > 0;
}, gn.isZero = function() {
  return !!this.d && 0 === this.d[0];
}, gn.lessThan = gn.lt = function(e3) {
  return 0 > this.cmp(e3);
}, gn.lessThanOrEqualTo = gn.lte = function(e3) {
  return 1 > this.cmp(e3);
}, gn.logarithm = gn.log = function(t2) {
  var i2, o2, s2, a2, u2, f2, l2, d2, m2 = this, h2 = m2.constructor, b2 = h2.precision, p2 = h2.rounding;
  if (null == t2) t2 = new h2(10), i2 = 1;
  else {
    if (o2 = (t2 = new h2(t2)).d, 0 > t2.s || !o2 || !o2[0] || t2.eq(1)) return new h2(NaN);
    i2 = t2.eq(10);
  }
  if (o2 = m2.d, 0 > m2.s || !o2 || !o2[0] || m2.eq(1)) return new h2(o2 && !o2[0] ? -1 / 0 : 1 != m2.s ? NaN : o2 ? 0 : 1 / 0);
  if (i2) if (o2.length > 1) u2 = 1;
  else {
    for (a2 = o2[0]; a2 % 10 == 0; ) a2 /= 10;
    u2 = 1 !== a2;
  }
  if (cn = 0, f2 = v(m2, l2 = b2 + 5), s2 = i2 ? c(h2, l2 + 10) : v(t2, l2), n((d2 = $n(f2, s2, l2, 1)).d, a2 = b2, p2)) do {
    if (f2 = v(m2, l2 += 10), s2 = i2 ? c(h2, l2 + 10) : v(t2, l2), d2 = $n(f2, s2, l2, 1), !u2) {
      +e(d2.d).slice(a2 + 1, a2 + 15) + 1 == 1e14 && (d2 = r(d2, b2 + 1, 0));
      break;
    }
  } while (n(d2.d, a2 += 10, p2));
  return cn = 1, r(d2, b2, p2);
}, gn.minus = gn.sub = function(e3) {
  var t2, n2, i2, o2, c2, a2, u2, f2, l2, d2, m2, h2, v2 = this, b2 = v2.constructor;
  if (e3 = new b2(e3), !v2.d || !e3.d) return v2.s && e3.s ? v2.d ? e3.s = -e3.s : e3 = new b2(e3.d || v2.s !== e3.s ? v2 : NaN) : e3 = new b2(NaN), e3;
  if (v2.s != e3.s) return e3.s = -e3.s, v2.plus(e3);
  if (h2 = e3.d, u2 = b2.precision, f2 = b2.rounding, !(l2 = v2.d)[0] || !h2[0]) {
    if (h2[0]) e3.s = -e3.s;
    else {
      if (!l2[0]) return new b2(3 === f2 ? -0 : 0);
      e3 = new b2(v2);
    }
    return cn ? r(e3, u2, f2) : e3;
  }
  if (n2 = mn(e3.e / Mn), d2 = mn(v2.e / Mn), l2 = l2.slice(), c2 = d2 - n2) {
    for ((m2 = 0 > c2) ? (t2 = l2, c2 = -c2, a2 = h2.length) : (t2 = h2, n2 = d2, a2 = l2.length), c2 > (i2 = Math.max(Math.ceil(u2 / Mn), a2) + 2) && (c2 = i2, t2.length = 1), t2.reverse(), i2 = c2; i2--; ) t2.push(0);
    t2.reverse();
  } else {
    for ((m2 = (a2 = h2.length) > (i2 = l2.length)) && (a2 = i2), i2 = 0; a2 > i2; i2++) if (l2[i2] != h2[i2]) {
      m2 = h2[i2] > l2[i2];
      break;
    }
    c2 = 0;
  }
  for (m2 && (t2 = l2, l2 = h2, h2 = t2, e3.s = -e3.s), i2 = h2.length - (a2 = l2.length); i2 > 0; --i2) l2[a2++] = 0;
  for (i2 = h2.length; i2 > c2; ) {
    if (l2[--i2] < h2[i2]) {
      for (o2 = i2; o2 && 0 === l2[--o2]; ) l2[o2] = wn - 1;
      --l2[o2], l2[i2] += wn;
    }
    l2[i2] -= h2[i2];
  }
  for (; 0 === l2[--a2]; ) l2.pop();
  for (; 0 === l2[0]; l2.shift()) --n2;
  return l2[0] ? (e3.d = l2, e3.e = s(l2, n2), cn ? r(e3, u2, f2) : e3) : new b2(3 === f2 ? -0 : 0);
}, gn.modulo = gn.mod = function(e3) {
  var t2, n2 = this, i2 = n2.constructor;
  return e3 = new i2(e3), !n2.d || !e3.s || e3.d && !e3.d[0] ? new i2(NaN) : !e3.d || n2.d && !n2.d[0] ? r(new i2(n2), i2.precision, i2.rounding) : (cn = 0, 9 == i2.modulo ? (t2 = $n(n2, e3.abs(), 0, 3, 1)).s *= e3.s : t2 = $n(n2, e3, 0, i2.modulo, 1), t2 = t2.times(e3), cn = 1, n2.minus(t2));
}, gn.naturalExponential = gn.exp = function() {
  return h(this);
}, gn.naturalLogarithm = gn.ln = function() {
  return v(this);
}, gn.negated = gn.neg = function() {
  var e3 = new this.constructor(this);
  return e3.s = -e3.s, r(e3);
}, gn.plus = gn.add = function(e3) {
  var t2, n2, i2, o2, c2, a2, u2, f2, l2, d2, m2 = this, h2 = m2.constructor;
  if (e3 = new h2(e3), !m2.d || !e3.d) return m2.s && e3.s ? m2.d || (e3 = new h2(e3.d || m2.s === e3.s ? m2 : NaN)) : e3 = new h2(NaN), e3;
  if (m2.s != e3.s) return e3.s = -e3.s, m2.minus(e3);
  if (d2 = e3.d, u2 = h2.precision, f2 = h2.rounding, !(l2 = m2.d)[0] || !d2[0]) return d2[0] || (e3 = new h2(m2)), cn ? r(e3, u2, f2) : e3;
  if (c2 = mn(m2.e / Mn), i2 = mn(e3.e / Mn), l2 = l2.slice(), o2 = c2 - i2) {
    for (0 > o2 ? (n2 = l2, o2 = -o2, a2 = d2.length) : (n2 = d2, i2 = c2, a2 = l2.length), o2 > (a2 = (c2 = Math.ceil(u2 / Mn)) > a2 ? c2 + 1 : a2 + 1) && (o2 = a2, n2.length = 1), n2.reverse(); o2--; ) n2.push(0);
    n2.reverse();
  }
  for (0 > (a2 = l2.length) - (o2 = d2.length) && (o2 = a2, n2 = d2, d2 = l2, l2 = n2), t2 = 0; o2; ) t2 = (l2[--o2] = l2[o2] + d2[o2] + t2) / wn | 0, l2[o2] %= wn;
  for (t2 && (l2.unshift(t2), ++i2), a2 = l2.length; 0 == l2[--a2]; ) l2.pop();
  return e3.d = l2, e3.e = s(l2, i2), cn ? r(e3, u2, f2) : e3;
}, gn.precision = gn.sd = function(e3) {
  var t2, n2 = this;
  if (void 0 !== e3 && e3 !== !!e3 && 1 !== e3 && 0 !== e3) throw Error(un + e3);
  return n2.d ? (t2 = u(n2.d), e3 && n2.e + 1 > t2 && (t2 = n2.e + 1)) : t2 = NaN, t2;
}, gn.round = function() {
  var e3 = this, t2 = e3.constructor;
  return r(new t2(e3), e3.e + 1, t2.rounding);
}, gn.sine = gn.sin = function() {
  var e3, t2, n2 = this, i2 = n2.constructor;
  return n2.isFinite() ? n2.isZero() ? new i2(n2) : (t2 = i2.rounding, i2.precision = (e3 = i2.precision) + Math.max(n2.e, n2.sd()) + Mn, i2.rounding = 1, n2 = function(e4, t3) {
    var n3, i3, r2, o2, s2, c2 = t3.d.length;
    if (3 > c2) return t3.isZero() ? t3 : w(e4, 2, t3, t3);
    for (t3 = w(e4, 2, t3 = t3.times(1 / M(5, n3 = (n3 = 1.4 * Math.sqrt(c2)) > 16 ? 16 : 0 | n3)), t3), r2 = new e4(5), o2 = new e4(16), s2 = new e4(20); n3--; ) i3 = t3.times(t3), t3 = t3.times(r2.plus(i3.times(o2.times(i3).minus(s2))));
    return t3;
  }(i2, k(i2, n2)), i2.precision = e3, i2.rounding = t2, r(sn > 2 ? n2.neg() : n2, e3, t2, 1)) : new i2(NaN);
}, gn.squareRoot = gn.sqrt = function() {
  var t2, n2, i2, o2, s2, c2, a2 = this, u2 = a2.d, f2 = a2.e, l2 = a2.s, d2 = a2.constructor;
  if (1 !== l2 || !u2 || !u2[0]) return new d2(!l2 || 0 > l2 && (!u2 || u2[0]) ? NaN : u2 ? a2 : 1 / 0);
  for (cn = 0, 0 == (l2 = Math.sqrt(+a2)) || l2 == 1 / 0 ? (((n2 = e(u2)).length + f2) % 2 == 0 && (n2 += "0"), l2 = Math.sqrt(n2), f2 = mn((f2 + 1) / 2) - (0 > f2 || f2 % 2), o2 = new d2(n2 = l2 == 1 / 0 ? "5e" + f2 : (n2 = l2.toExponential()).slice(0, n2.indexOf("e") + 1) + f2)) : o2 = new d2("" + l2), i2 = (f2 = d2.precision) + 3; ; ) if (o2 = (c2 = o2).plus($n(a2, c2, i2 + 2, 1)).times(0.5), e(c2.d).slice(0, i2) === (n2 = e(o2.d)).slice(0, i2)) {
    if ("9999" != (n2 = n2.slice(i2 - 3, i2 + 1)) && (s2 || "4999" != n2)) {
      +n2 && (+n2.slice(1) || "5" != n2.charAt(0)) || (r(o2, f2 + 1, 1), t2 = !o2.times(o2).eq(a2));
      break;
    }
    if (!s2 && (r(c2, f2 + 1, 0), c2.times(c2).eq(a2))) {
      o2 = c2;
      break;
    }
    i2 += 4, s2 = 1;
  }
  return cn = 1, r(o2, f2, d2.rounding, t2);
}, gn.tangent = gn.tan = function() {
  var e3, t2, n2 = this, i2 = n2.constructor;
  return n2.isFinite() ? n2.isZero() ? new i2(n2) : (t2 = i2.rounding, i2.precision = (e3 = i2.precision) + 10, i2.rounding = 1, (n2 = n2.sin()).s = 1, n2 = $n(n2, new i2(1).minus(n2.times(n2)).sqrt(), e3 + 10, 0), i2.precision = e3, i2.rounding = t2, r(2 == sn || 4 == sn ? n2.neg() : n2, e3, t2, 1)) : new i2(NaN);
}, gn.times = gn.mul = function(e3) {
  var t2, n2, i2, o2, c2, a2, u2, f2, l2, d2 = this, m2 = d2.constructor, h2 = d2.d, v2 = (e3 = new m2(e3)).d;
  if (e3.s *= d2.s, !(h2 && h2[0] && v2 && v2[0])) return new m2(!e3.s || h2 && !h2[0] && !v2 || v2 && !v2[0] && !h2 ? NaN : h2 && v2 ? 0 * e3.s : e3.s / 0);
  for (n2 = mn(d2.e / Mn) + mn(e3.e / Mn), (l2 = v2.length) > (f2 = h2.length) && (c2 = h2, h2 = v2, v2 = c2, a2 = f2, f2 = l2, l2 = a2), c2 = [], i2 = a2 = f2 + l2; i2--; ) c2.push(0);
  for (i2 = l2; --i2 >= 0; ) {
    for (t2 = 0, o2 = f2 + i2; o2 > i2; ) u2 = c2[o2] + v2[i2] * h2[o2 - i2 - 1] + t2, c2[o2--] = u2 % wn | 0, t2 = u2 / wn | 0;
    c2[o2] = (c2[o2] + t2) % wn | 0;
  }
  for (; !c2[--a2]; ) c2.pop();
  return t2 ? ++n2 : c2.shift(), e3.d = c2, e3.e = s(c2, n2), cn ? r(e3, m2.precision, m2.rounding) : e3;
}, gn.toBinary = function(e3, t2) {
  return P(this, 2, e3, t2);
}, gn.toDecimalPlaces = gn.toDP = function(e3, n2) {
  var i2 = this, o2 = i2.constructor;
  return i2 = new o2(i2), void 0 === e3 ? i2 : (t(e3, 0, Zt), void 0 === n2 ? n2 = o2.rounding : t(n2, 0, 8), r(i2, e3 + i2.e + 1, n2));
}, gn.toExponential = function(e3, n2) {
  var i2, s2 = this, c2 = s2.constructor;
  return void 0 === e3 ? i2 = o(s2, 1) : (t(e3, 0, Zt), void 0 === n2 ? n2 = c2.rounding : t(n2, 0, 8), i2 = o(s2 = r(new c2(s2), e3 + 1, n2), 1, e3 + 1)), s2.isNeg() && !s2.isZero() ? "-" + i2 : i2;
}, gn.toFixed = function(e3, n2) {
  var i2, s2, c2 = this, a2 = c2.constructor;
  return void 0 === e3 ? i2 = o(c2) : (t(e3, 0, Zt), void 0 === n2 ? n2 = a2.rounding : t(n2, 0, 8), i2 = o(s2 = r(new a2(c2), e3 + c2.e + 1, n2), 0, e3 + s2.e + 1)), c2.isNeg() && !c2.isZero() ? "-" + i2 : i2;
}, gn.toFraction = function(t2) {
  var n2, i2, r2, o2, s2, c2, a2, f2, l2, d2, m2, h2, v2 = this, b2 = v2.d, p2 = v2.constructor;
  if (!b2) return new p2(v2);
  if (l2 = i2 = new p2(1), r2 = f2 = new p2(0), s2 = (n2 = new p2(r2)).e = u(b2) - v2.e - 1, n2.d[0] = hn(10, 0 > (c2 = s2 % Mn) ? Mn + c2 : c2), null == t2) t2 = s2 > 0 ? n2 : l2;
  else {
    if (!(a2 = new p2(t2)).isInt() || a2.lt(l2)) throw Error(un + a2);
    t2 = a2.gt(n2) ? s2 > 0 ? n2 : l2 : a2;
  }
  for (cn = 0, a2 = new p2(e(b2)), d2 = p2.precision, p2.precision = s2 = b2.length * Mn * 2; m2 = $n(a2, n2, 0, 1, 1), 1 != (o2 = i2.plus(m2.times(r2))).cmp(t2); ) i2 = r2, r2 = o2, l2 = f2.plus(m2.times(o2 = l2)), f2 = o2, n2 = a2.minus(m2.times(o2 = n2)), a2 = o2;
  return o2 = $n(t2.minus(i2), r2, 0, 1, 1), f2 = f2.plus(o2.times(l2)), i2 = i2.plus(o2.times(r2)), f2.s = l2.s = v2.s, h2 = 1 > $n(l2, r2, s2, 1).minus(v2).abs().cmp($n(f2, i2, s2, 1).minus(v2).abs()) ? [l2, r2] : [f2, i2], p2.precision = d2, cn = 1, h2;
}, gn.toHexadecimal = gn.toHex = function(e3, t2) {
  return P(this, 16, e3, t2);
}, gn.toNearest = function(e3, n2) {
  var i2 = this, o2 = i2.constructor;
  if (i2 = new o2(i2), null == e3) {
    if (!i2.d) return i2;
    e3 = new o2(1), n2 = o2.rounding;
  } else {
    if (e3 = new o2(e3), void 0 === n2 ? n2 = o2.rounding : t(n2, 0, 8), !i2.d) return e3.s ? i2 : e3;
    if (!e3.d) return e3.s && (e3.s = i2.s), e3;
  }
  return e3.d[0] ? (cn = 0, i2 = $n(i2, e3, 0, n2, 1).times(e3), cn = 1, r(i2)) : (e3.s = i2.s, i2 = e3), i2;
}, gn.toNumber = function() {
  return +this;
}, gn.toOctal = function(e3, t2) {
  return P(this, 8, e3, t2);
}, gn.toPower = gn.pow = function(t2) {
  var i2, o2, s2, c2, a2, u2, f2 = this, d2 = f2.constructor, m2 = +(t2 = new d2(t2));
  if (!(f2.d && t2.d && f2.d[0] && t2.d[0])) return new d2(hn(+f2, m2));
  if ((f2 = new d2(f2)).eq(1)) return f2;
  if (s2 = d2.precision, a2 = d2.rounding, t2.eq(1)) return r(f2, s2, a2);
  if ((i2 = mn(t2.e / Mn)) >= t2.d.length - 1 && 9007199254740991 >= (o2 = 0 > m2 ? -m2 : m2)) return c2 = l(d2, f2, o2, s2), 0 > t2.s ? new d2(1).div(c2) : r(c2, s2, a2);
  if (0 > (u2 = f2.s)) {
    if (t2.d.length - 1 > i2) return new d2(NaN);
    if (1 & t2.d[i2] || (u2 = 1), 0 == f2.e && 1 == f2.d[0] && 1 == f2.d.length) return f2.s = u2, f2;
  }
  return (i2 = 0 != (o2 = hn(+f2, m2)) && isFinite(o2) ? new d2(o2 + "").e : mn(m2 * (Math.log("0." + e(f2.d)) / Math.LN10 + f2.e + 1))) > d2.maxE + 1 || d2.minE - 1 > i2 ? new d2(i2 > 0 ? u2 / 0 : 0) : (cn = 0, d2.rounding = f2.s = 1, (c2 = h(t2.times(v(f2, s2 + (o2 = Math.min(12, (i2 + "").length)))), s2)).d && n((c2 = r(c2, s2 + 5, 1)).d, s2, a2) && +e((c2 = r(h(t2.times(v(f2, (i2 = s2 + 10) + o2)), i2), i2 + 5, 1)).d).slice(s2 + 1, s2 + 15) + 1 == 1e14 && (c2 = r(c2, s2 + 1, 0)), c2.s = u2, cn = 1, d2.rounding = a2, r(c2, s2, a2));
}, gn.toPrecision = function(e3, n2) {
  var i2, s2 = this, c2 = s2.constructor;
  return void 0 === e3 ? i2 = o(s2, c2.toExpNeg >= s2.e || s2.e >= c2.toExpPos) : (t(e3, 1, Zt), void 0 === n2 ? n2 = c2.rounding : t(n2, 0, 8), i2 = o(s2 = r(new c2(s2), e3, n2), s2.e >= e3 || c2.toExpNeg >= s2.e, e3)), s2.isNeg() && !s2.isZero() ? "-" + i2 : i2;
}, gn.toSignificantDigits = gn.toSD = function(e3, n2) {
  var i2 = this.constructor;
  return void 0 === e3 ? (e3 = i2.precision, n2 = i2.rounding) : (t(e3, 1, Zt), void 0 === n2 ? n2 = i2.rounding : t(n2, 0, 8)), r(new i2(this), e3, n2);
}, gn.toString = function() {
  var e3 = this, t2 = e3.constructor, n2 = o(e3, t2.toExpNeg >= e3.e || e3.e >= t2.toExpPos);
  return e3.isNeg() && !e3.isZero() ? "-" + n2 : n2;
}, gn.truncated = gn.trunc = function() {
  return r(new this.constructor(this), this.e + 1, 1);
}, gn.valueOf = gn.toJSON = function() {
  var e3 = this, t2 = e3.constructor, n2 = o(e3, t2.toExpNeg >= e3.e || e3.e >= t2.toExpPos);
  return e3.isNeg() ? "-" + n2 : n2;
}, $n = /* @__PURE__ */ function() {
  function e3(e4, t3, n3) {
    var i2, r2 = 0, o2 = e4.length;
    for (e4 = e4.slice(); o2--; ) e4[o2] = (i2 = e4[o2] * t3 + r2) % n3 | 0, r2 = i2 / n3 | 0;
    return r2 && e4.unshift(r2), e4;
  }
  function t2(e4, t3, n3, i2) {
    var r2, o2;
    if (n3 != i2) o2 = n3 > i2 ? 1 : -1;
    else for (r2 = o2 = 0; n3 > r2; r2++) if (e4[r2] != t3[r2]) {
      o2 = e4[r2] > t3[r2] ? 1 : -1;
      break;
    }
    return o2;
  }
  function n2(e4, t3, n3, i2) {
    for (var r2 = 0; n3--; ) e4[n3] -= r2, e4[n3] = (r2 = t3[n3] > e4[n3] ? 1 : 0) * i2 + e4[n3] - t3[n3];
    for (; !e4[0] && e4.length > 1; ) e4.shift();
  }
  return function(i2, o2, s2, c2, a2, u2) {
    var f2, l2, d2, m2, h2, v2, b2, p2, y2, w2, M2, k2, P2, g2, $2, N2, A2, S2, x2, I2, T2 = i2.constructor, C2 = i2.s == o2.s ? 1 : -1, j2 = i2.d, O2 = o2.d;
    if (!(j2 && j2[0] && O2 && O2[0])) return new T2(i2.s && o2.s && (j2 ? !O2 || j2[0] != O2[0] : O2) ? j2 && 0 == j2[0] || !O2 ? 0 * C2 : C2 / 0 : NaN);
    for (u2 ? (h2 = 1, l2 = i2.e - o2.e) : (u2 = wn, l2 = mn(i2.e / (h2 = Mn)) - mn(o2.e / h2)), x2 = O2.length, A2 = j2.length, w2 = (y2 = new T2(C2)).d = [], d2 = 0; O2[d2] == (j2[d2] || 0); d2++) ;
    if (O2[d2] > (j2[d2] || 0) && l2--, null == s2 ? (g2 = s2 = T2.precision, c2 = T2.rounding) : g2 = a2 ? s2 + (i2.e - o2.e) + 1 : s2, 0 > g2) w2.push(1), v2 = 1;
    else {
      if (g2 = g2 / h2 + 2 | 0, d2 = 0, 1 == x2) {
        for (m2 = 0, O2 = O2[0], g2++; (A2 > d2 || m2) && g2--; d2++) w2[d2] = ($2 = m2 * u2 + (j2[d2] || 0)) / O2 | 0, m2 = $2 % O2 | 0;
        v2 = m2 || A2 > d2;
      } else {
        for ((m2 = u2 / (O2[0] + 1) | 0) > 1 && (O2 = e3(O2, m2, u2), j2 = e3(j2, m2, u2), x2 = O2.length, A2 = j2.length), N2 = x2, k2 = (M2 = j2.slice(0, x2)).length; x2 > k2; ) M2[k2++] = 0;
        (I2 = O2.slice()).unshift(0), S2 = O2[0], u2 / 2 > O2[1] || ++S2;
        do {
          m2 = 0, 0 > (f2 = t2(O2, M2, x2, k2)) ? (P2 = M2[0], x2 != k2 && (P2 = P2 * u2 + (M2[1] || 0)), (m2 = P2 / S2 | 0) > 1 ? (u2 > m2 || (m2 = u2 - 1), 1 == (f2 = t2(b2 = e3(O2, m2, u2), M2, p2 = b2.length, k2 = M2.length)) && (m2--, n2(b2, p2 > x2 ? I2 : O2, p2, u2))) : (0 == m2 && (f2 = m2 = 1), b2 = O2.slice()), k2 > (p2 = b2.length) && b2.unshift(0), n2(M2, b2, k2, u2), -1 == f2 && 1 > (f2 = t2(O2, M2, x2, k2 = M2.length)) && (m2++, n2(M2, k2 > x2 ? I2 : O2, k2, u2)), k2 = M2.length) : 0 === f2 && (m2++, M2 = [0]), w2[d2++] = m2, f2 && M2[0] ? M2[k2++] = j2[N2] || 0 : (M2 = [j2[N2]], k2 = 1);
        } while ((N2++ < A2 || void 0 !== M2[0]) && g2--);
        v2 = void 0 !== M2[0];
      }
      w2[0] || w2.shift();
    }
    if (1 == h2) y2.e = l2, on = v2;
    else {
      for (d2 = 1, m2 = w2[0]; m2 >= 10; m2 /= 10) d2++;
      y2.e = d2 + l2 * h2 - 1, r(y2, a2 ? s2 + y2.e + 1 : s2, c2, v2);
    }
    return y2;
  };
}(), gn[Symbol.for("nodejs.util.inspect.custom")] = gn.toString, gn[Symbol.toStringTag] = "Decimal", Nn = gn.constructor = function e2(t2) {
  function n2(e3) {
    var t3, i3, r3, o3 = this;
    if (!(o3 instanceof n2)) return new n2(e3);
    if (o3.constructor = n2, q(e3)) return o3.s = e3.s, void (cn ? !e3.d || e3.e > n2.maxE ? (o3.e = NaN, o3.d = null) : n2.minE > e3.e ? (o3.e = 0, o3.d = [0]) : (o3.e = e3.e, o3.d = e3.d.slice()) : (o3.e = e3.e, o3.d = e3.d ? e3.d.slice() : e3.d));
    if ("number" == (r3 = typeof e3)) {
      if (0 === e3) return o3.s = 0 > 1 / e3 ? -1 : 1, o3.e = 0, void (o3.d = [0]);
      if (0 > e3 ? (e3 = -e3, o3.s = -1) : o3.s = 1, e3 === ~~e3 && 1e7 > e3) {
        for (t3 = 0, i3 = e3; i3 >= 10; i3 /= 10) t3++;
        return void (cn ? t3 > n2.maxE ? (o3.e = NaN, o3.d = null) : n2.minE > t3 ? (o3.e = 0, o3.d = [0]) : (o3.e = t3, o3.d = [e3]) : (o3.e = t3, o3.d = [e3]));
      }
      return 0 * e3 != 0 ? (e3 || (o3.s = NaN), o3.e = NaN, void (o3.d = null)) : p(o3, "" + e3);
    }
    if ("string" !== r3) throw Error(un + e3);
    return 45 === (i3 = e3.charCodeAt(0)) ? (e3 = e3.slice(1), o3.s = -1) : (43 === i3 && (e3 = e3.slice(1)), o3.s = 1), yn.test(e3) ? p(o3, e3) : y(o3, e3);
  }
  var i2, r2, o2;
  if (n2.prototype = gn, n2.ROUND_UP = 0, n2.ROUND_DOWN = 1, n2.ROUND_CEIL = 2, n2.ROUND_FLOOR = 3, n2.ROUND_HALF_UP = 4, n2.ROUND_HALF_DOWN = 5, n2.ROUND_HALF_EVEN = 6, n2.ROUND_HALF_CEIL = 7, n2.ROUND_HALF_FLOOR = 8, n2.EUCLID = 9, n2.config = n2.set = B, n2.clone = e2, n2.isDecimal = q, n2.abs = $, n2.acos = N, n2.acosh = A, n2.add = S, n2.asin = x, n2.asinh = I, n2.atan = T, n2.atanh = C, n2.atan2 = j, n2.cbrt = O, n2.ceil = E, n2.clamp = D, n2.cos = F, n2.cosh = L, n2.div = G, n2.exp = _, n2.floor = U, n2.hypot = R, n2.ln = K, n2.log = W, n2.log10 = X, n2.log2 = z, n2.max = V, n2.min = J, n2.mod = H, n2.mul = Y, n2.pow = Q, n2.random = Z, n2.round = ee, n2.sign = te, n2.sin = ne, n2.sinh = ie, n2.sqrt = re, n2.sub = oe, n2.sum = se, n2.tan = ce, n2.tanh = ae, n2.trunc = ue, void 0 === t2 && (t2 = {}), t2 && 1 != t2.defaults) for (o2 = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"], i2 = 0; o2.length > i2; ) t2.hasOwnProperty(r2 = o2[i2++]) || (t2[r2] = this[r2]);
  return n2.config(t2), n2;
}(rn), tn = new Nn(tn), nn = new Nn(nn);
const tr = Object.freeze(Object.defineProperty({ __proto__: null, decimalizeAdd: fe, decimalizeDiv: function(e3, t2) {
  return new Nn(e3).div(new Nn(t2)).toNumber();
}, decimalizeMul: function(e3, t2) {
  return new Nn(e3).mul(new Nn(t2)).toNumber();
}, decimalizeSub: function(e3, t2) {
  return new Nn(e3).minus(new Nn(t2)).toNumber();
}, innerTrimerForStyleKey: le, resolveNonRegularKey2str: de, resolveNonRegularKey3str: me, searchNextKey: he, searchPrevKey: ve }, Symbol.toStringTag, { value: "Module" }));
class nr {
  constructor(e3, t2, n2) {
    __publicField(this, "statusCode");
    __publicField(this, "body");
    __publicField(this, "system");
    __publicField(this, "fail", () => 0);
    this.statusCode = e3, this.body = t2, this.system = n2;
  }
}
class ir {
  constructor(e3) {
    __publicField(this, "res");
    __publicField(this, "fail", () => 0);
    this.res = e3;
  }
}
const rr = new ir(null), or = () => rr;
class sr extends Error {
  constructor(e3, t2, n2, i2) {
    super(i2);
    __publicField(this, "statusCode");
    __publicField(this, "message");
    __publicField(this, "line");
    __publicField(this, "linePos");
    __publicField(this, "token");
    __publicField(this, "fail", () => 1);
    this.message = i2, this.line = e3, this.linePos = t2, this.token = n2;
  }
}
class cr extends sr {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "E400");
    __publicField(this, "statusCode", 400);
  }
}
class ar extends sr {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "E401");
    __publicField(this, "statusCode", 401);
  }
}
class ur extends sr {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "E403");
    __publicField(this, "statusCode", 403);
  }
}
class fr extends sr {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "E404");
    __publicField(this, "statusCode", 404);
  }
}
class lr extends sr {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "E405");
    __publicField(this, "statusCode", 405);
  }
}
class dr extends sr {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "E409");
    __publicField(this, "statusCode", 409);
  }
}
class mr extends sr {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "E418");
    __publicField(this, "statusCode", 418);
  }
}
class hr extends sr {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "E422");
    __publicField(this, "statusCode", 422);
  }
}
class vr extends sr {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "E429");
    __publicField(this, "statusCode", 429);
  }
}
class br extends sr {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "E500");
    __publicField(this, "statusCode", 500);
  }
}
class pr extends cr {
}
class yr extends ar {
}
class wr extends ur {
}
class Mr extends fr {
}
class kr extends dr {
}
class Pr extends vr {
}
class gr extends br {
}
An = ((e3) => (e3[void 0] = "undefined", e3.flash = "flush", e3.note = "note", e3.bullet = "bullet", e3.degreeName = "degree", e3.style = "style", e3.blockStyle = "blockStyle", e3.regionStart = "regionStart", e3.regionProp = "regionProp", e3.comma = "comma", e3.openingCurlyBrace = "openingCurlyBrace", e3.closingCurlyBrace = "closingCurlyBrace", e3))(An || {});
const $r = { C: "C", "C#": "C#", D: "D", "D#": "D#", E: "E", F: "F", "F#": "F#", G: "G", "G#": "G#", A: "A", "A#": "A#", B: "B" };
Sn = ((e3) => (e3.normal = "", e3.harmonic = "harmonic", e3.melodic = "melodic", e3))(Sn || {}), xn = ((e3) => (e3.unknown = "", e3.major = "major", e3.minor = "minor", e3))(xn || {});
const Nr = { major: { evolvedCodePrefix: ["", "m", "m", "", "", "m", "dim"], bin: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1] }, "major 7th": { evolvedCodePrefix: ["maj7", "m7", "m7", "maj7", "7", "m7", "m7b5"], bin: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1] }, "major 6th": { evolvedCodePrefix: ["6", "m7", "m7", "6", "7", "m7", "m7b5"], bin: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1] }, minor: { evolvedCodePrefix: ["m", "m7b5", "", "m", "m", "", "m"], bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0] }, "minor 7th": { evolvedCodePrefix: ["m7", "m7b5", "maj7", "m7", "m7", "maj7", "7"], bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0] }, "minor 6th": { evolvedCodePrefix: ["m7", "m7b5", "6", "m7", "m7", "6", "7"], bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0] }, "harmonic minor": { evolvedCodePrefix: ["m", "dim", "aug", "m", "", "", "dim"], bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1] }, "harmonic minor 7th": { evolvedCodePrefix: ["mmaj7", "m7b5", "maj7#5", "m7", "7", "maj7", "dim7"], bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1] }, "melodic minor": { evolvedCodePrefix: ["m", "m", "aug", "", "", "dim", "dim"], bin: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1] }, "melodic minor 7th": { evolvedCodePrefix: ["mmaj7", "m7", "maj7#5", "7", "7", "m7b5", "m7b5"], bin: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1] }, "harmonic major": { evolvedCodePrefix: ["", "m7b5", "m", "m", "", "aug", "m7b5"], bin: [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1] }, "harmonic major 7th": { evolvedCodePrefix: ["maj7", "m7b5", "m7", "mmaj7", "7", "m7#5", "maj7"], bin: [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1] } }, Ar = (e3) => structuredClone(Nr[e3]), Sr = Object.keys(In = ((e3) => (e3[e3.major = 0] = "major", e3[e3.minor = 1] = "minor", e3[e3.dorian = 2] = "dorian", e3[e3.diminish = 3] = "diminish", e3[e3.halfDiminish = 4] = "halfDiminish", e3[e3.pentatonic = 5] = "pentatonic", e3[e3.harmonicMinor = 6] = "harmonicMinor", e3[e3.melodicMinor = 7] = "melodicMinor", e3[e3.chromatic = 8] = "chromatic", e3))(In || {})).filter((e3) => isNaN(+e3) && !isNaN(In[e3])), xr = { 0: { bin: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1] }, 1: { bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0] }, 2: { bin: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0] }, 3: { bin: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1] }, 4: { bin: [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0] }, 5: { bin: [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0] }, 6: { bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1] }, 7: { bin: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1] }, 8: { bin: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] } }, Ir = { E: ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"], F: ["F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"], "F#": ["F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F"], G: ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#"], "G#": ["G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"], A: ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"], "A#": ["A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"], B: ["B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#"], C: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], "C#": ["C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"], D: ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#"], "D#": ["D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D"] }, Tr = [{ id: 0, oct: 0, keyNum: 0, keySym: "C" }, { id: 1, oct: 0, keyNum: 1, keySym: "C#" }, { id: 2, oct: 0, keyNum: 2, keySym: "D" }, { id: 3, oct: 0, keyNum: 3, keySym: "D#" }, { id: 4, oct: 0, keyNum: 4, keySym: "E" }, { id: 5, oct: 0, keyNum: 5, keySym: "F" }, { id: 6, oct: 0, keyNum: 6, keySym: "F#" }, { id: 7, oct: 0, keyNum: 7, keySym: "G" }, { id: 8, oct: 0, keyNum: 8, keySym: "G#" }, { id: 9, oct: 0, keyNum: 9, keySym: "A" }, { id: 10, oct: 0, keyNum: 10, keySym: "A#" }, { id: 11, oct: 0, keyNum: 11, keySym: "B" }, { id: 12, oct: 1, keyNum: 0, keySym: "C" }, { id: 13, oct: 1, keyNum: 1, keySym: "C#" }, { id: 14, oct: 1, keyNum: 2, keySym: "D" }, { id: 15, oct: 1, keyNum: 3, keySym: "D#" }, { id: 16, oct: 1, keyNum: 4, keySym: "E" }, { id: 17, oct: 1, keyNum: 5, keySym: "F" }, { id: 18, oct: 1, keyNum: 6, keySym: "F#" }, { id: 19, oct: 1, keyNum: 7, keySym: "G" }, { id: 20, oct: 1, keyNum: 8, keySym: "G#" }, { id: 21, oct: 1, keyNum: 9, keySym: "A" }, { id: 22, oct: 1, keyNum: 10, keySym: "A#" }, { id: 23, oct: 1, keyNum: 11, keySym: "B" }, { id: 24, oct: 2, keyNum: 0, keySym: "C" }, { id: 25, oct: 2, keyNum: 1, keySym: "C#" }, { id: 26, oct: 2, keyNum: 2, keySym: "D" }, { id: 27, oct: 2, keyNum: 3, keySym: "D#" }, { id: 28, oct: 2, keyNum: 4, keySym: "E" }, { id: 29, oct: 2, keyNum: 5, keySym: "F" }, { id: 30, oct: 2, keyNum: 6, keySym: "F#" }, { id: 31, oct: 2, keyNum: 7, keySym: "G" }, { id: 32, oct: 2, keyNum: 8, keySym: "G#" }, { id: 33, oct: 2, keyNum: 9, keySym: "A" }, { id: 34, oct: 2, keyNum: 10, keySym: "A#" }, { id: 35, oct: 2, keyNum: 11, keySym: "B" }, { id: 36, oct: 3, keyNum: 0, keySym: "C" }, { id: 37, oct: 3, keyNum: 1, keySym: "C#" }, { id: 38, oct: 3, keyNum: 2, keySym: "D" }, { id: 39, oct: 3, keyNum: 3, keySym: "D#" }, { id: 40, oct: 3, keyNum: 4, keySym: "E" }, { id: 41, oct: 3, keyNum: 5, keySym: "F" }, { id: 42, oct: 3, keyNum: 6, keySym: "F#" }, { id: 43, oct: 3, keyNum: 7, keySym: "G" }, { id: 44, oct: 3, keyNum: 8, keySym: "G#" }, { id: 45, oct: 3, keyNum: 9, keySym: "A" }, { id: 46, oct: 3, keyNum: 10, keySym: "A#" }, { id: 47, oct: 3, keyNum: 11, keySym: "B" }, { id: 48, oct: 4, keyNum: 0, keySym: "C" }, { id: 49, oct: 4, keyNum: 1, keySym: "C#" }, { id: 50, oct: 4, keyNum: 2, keySym: "D" }, { id: 51, oct: 4, keyNum: 3, keySym: "D#" }, { id: 52, oct: 4, keyNum: 4, keySym: "E" }, { id: 53, oct: 4, keyNum: 5, keySym: "F" }, { id: 54, oct: 4, keyNum: 6, keySym: "F#" }, { id: 55, oct: 4, keyNum: 7, keySym: "G" }, { id: 56, oct: 4, keyNum: 8, keySym: "G#" }, { id: 57, oct: 4, keyNum: 9, keySym: "A" }, { id: 58, oct: 4, keyNum: 10, keySym: "A#" }, { id: 59, oct: 4, keyNum: 11, keySym: "B" }, { id: 60, oct: 5, keyNum: 0, keySym: "C" }, { id: 61, oct: 5, keyNum: 1, keySym: "C#" }, { id: 62, oct: 5, keyNum: 2, keySym: "D" }, { id: 63, oct: 5, keyNum: 3, keySym: "D#" }, { id: 64, oct: 5, keyNum: 4, keySym: "E" }, { id: 65, oct: 5, keyNum: 5, keySym: "F" }, { id: 66, oct: 5, keyNum: 6, keySym: "F#" }, { id: 67, oct: 5, keyNum: 7, keySym: "G" }, { id: 68, oct: 5, keyNum: 8, keySym: "G#" }, { id: 69, oct: 5, keyNum: 9, keySym: "A" }, { id: 70, oct: 5, keyNum: 10, keySym: "A#" }, { id: 71, oct: 5, keyNum: 11, keySym: "B" }, { id: 72, oct: 6, keyNum: 0, keySym: "C" }, { id: 73, oct: 6, keyNum: 1, keySym: "C#" }, { id: 74, oct: 6, keyNum: 2, keySym: "D" }, { id: 75, oct: 6, keyNum: 3, keySym: "D#" }, { id: 76, oct: 6, keyNum: 4, keySym: "E" }, { id: 77, oct: 6, keyNum: 5, keySym: "F" }, { id: 78, oct: 6, keyNum: 6, keySym: "F#" }, { id: 79, oct: 6, keyNum: 7, keySym: "G" }, { id: 80, oct: 6, keyNum: 8, keySym: "G#" }, { id: 81, oct: 6, keyNum: 9, keySym: "A" }, { id: 82, oct: 6, keyNum: 10, keySym: "A#" }, { id: 83, oct: 6, keyNum: 11, keySym: "B" }, { id: 84, oct: 6, keyNum: 0, keySym: "C" }, { id: 85, oct: 6, keyNum: 1, keySym: "C#" }, { id: 86, oct: 6, keyNum: 2, keySym: "D" }, { id: 87, oct: 6, keyNum: 3, keySym: "D#" }, { id: 88, oct: 6, keyNum: 4, keySym: "E" }];
class Cr {
  static resolve(e3) {
    for (let t2 = 0; e3.length > t2; t2++) for (let n2 = 0; e3[t2].length > n2; n2++) {
      const i2 = e3[t2][n2];
      switch (i2.type) {
        case An.degreeName: {
          if (i2.decidedProp.noteStr = "%" + i2.token + (i2.styles.length ? ":" + i2.styles.join(":") : ""), /^[/.>]/.test(i2.token)) return new cr(i2.line, i2.linePos, i2.token, `Invalid degree chord symbol '${i2.token}'.. This prefix cannot be used in chord specifications.`);
          const e4 = _e(i2);
          if (e4.fail()) return e4;
          break;
        }
        case An.note:
          if (/\|/.test(i2.token)) {
            i2.decidedProp.noteStr = i2.token + (i2.styles.length ? ":" + i2.styles.join(":") : "");
            const e4 = _e(i2);
            if (e4.fail()) return e4;
          } else {
            if (i2.decidedProp.noteStr = i2.token + (i2.styles.length ? ":" + i2.styles.join(":") : ""), /^(rn|R)[\^~=]*$/.test(i2.token)) {
              const e5 = i2.token.match(/([\^~=]+)$/);
              i2.token = "r" + (e5 ? e5[1] : ""), i2.styles.push("rn"), i2.linesOfStyle.push(i2.line), i2.linePosOfStyle.push(i2.linePos);
            }
            if (/^[/.>]/.test(i2.token)) return new cr(i2.line, i2.linePos, i2.token, `Invalid chord symbol '${i2.token}'.. This prefix cannot be used in chord specifications.`);
            const e4 = _e(i2);
            if (e4.fail()) return e4;
          }
          break;
        case An.bullet: {
          i2.decidedProp.noteStr = i2.token + (i2.styles.length ? ":" + i2.styles.join(":") : "");
          const e4 = _e(i2);
          if (e4.fail()) return e4;
        }
      }
    }
    return or();
  }
}
class jr {
  static apply(e3, t2) {
    const n2 = e3.dualId, i2 = [], r2 = { num: 1 };
    for (let o2 = 0; t2[n2].length > o2; o2++) {
      const s2 = t2[n2][o2];
      if (s2.type === An.bullet) {
        const t3 = Ue(e3, e3.regionList[s2.regionRegionForDualConnection].tuning, i2, s2, r2);
        if (t3.fail()) return t3;
        r2.num++;
      } else i2.push(s2);
    }
    return t2[n2] = i2, or();
  }
}
const Or = Object.freeze(Object.defineProperty({ __proto__: null, calculateTimeForTicks: Re, getSoundLength: function(e3, t2) {
  return 6e4 / e3 / Zi.PPS * t2;
}, getTicksByTime: qe, reduceUntilNextArrByGCD: We, untilNextToTick: Ke }, Symbol.toStringTag, { value: "Module" }));
class Er {
  static resolve(e3, t2) {
    const n2 = {};
    for (let i2 = 0; t2.length > i2; i2++) {
      const r2 = Je(e3, e3.mixesList[i2], t2[i2], n2);
      if (r2.fail()) return r2;
      const o2 = Ve(e3.mixesList[i2], t2[i2], n2);
      if (o2.fail()) return o2;
      const s2 = jr.apply(e3.mixesList[i2], t2);
      if (s2.fail()) return s2;
      const c2 = Xe(e3.mixesList[i2], t2[i2]);
      if (c2.fail()) return c2;
    }
    return e3.styleObjectBank = n2, or();
  }
}
Cn = (Tn = [0, 2, 4, -1, 1, 3, 5]).map((e3) => Math.floor(7 * e3 / 12)), jn = [3, 0, 4, 1, 5, 2, 6], On = (e3, t2) => Array(Math.abs(t2) + 1).join(e3), En = { empty: 1, name: "", acc: "" }, Dn = RegExp("^([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})|(AA|A|P|M|m|d|dd)([-+]?\\d+)$"), Bn = {}, Fn = [0, 2, 4, 5, 7, 9, 11], Ln = "PMMPPMM", Gn = (e3, t2) => Array(Math.abs(t2) + 1).join(e3), _n = { empty: 1, name: "", pc: "", acc: "" }, Un = /* @__PURE__ */ new Map(), Rn = (e3) => "CDEFGAB".charAt(e3), qn = (e3) => 0 > e3 ? Gn("b", -e3) : Gn("#", e3), Kn = (e3) => "b" === e3[0] ? -e3.length : e3.length, Wn = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/, zn = (e3, t2) => (e3 % t2 + t2) % t2, Xn = [0, 2, 4, 5, 7, 9, 11], Vn = { empty: 1, name: "", setNum: 0, chroma: "000000000000", normalized: "000000000000", intervals: [] }, Jn = (e3) => (+e3).toString(2).padStart(12, "0"), Hn = (e3) => parseInt(e3, 2), Yn = /^[01]{12}$/, Qn = (e3) => "number" == typeof e3 && e3 >= 0 && 4095 >= e3, Zn = (e3) => e3 && it(e3.chroma), ei = { [Vn.chroma]: Vn }, ti = ["1P", "2m", "2M", "3m", "3M", "4P", "5d", "5P", "6m", "6M", "7m", "7M"], ni = [["1P 3M 5P", "major", "M ^  maj"], ["1P 3M 5P 7M", "major seventh", "maj7 Δ ma7 M7 Maj7 ^7"], ["1P 3M 5P 7M 9M", "major ninth", "maj9 Δ9 ^9"], ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"], ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"], ["1P 3M 5P 6M 9M", "sixth added ninth", "6add9 6/9 69 M69"], ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"], ["1P 3M 5P 7M 11A", "major seventh sharp eleventh", "maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"], ["1P 3m 5P", "minor", "m min -"], ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"], ["1P 3m 5P 7M", "minor/major seventh", "m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7 -maj7"], ["1P 3m 5P 6M", "minor sixth", "m6 -6"], ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"], ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"], ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"], ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"], ["1P 3m 5d", "diminished", "dim ° o"], ["1P 3m 5d 7d", "diminished seventh", "dim7 °7 o7"], ["1P 3m 5d 7m", "half-diminished", "m7b5 ø -7b5 h7 h"], ["1P 3M 5P 7m", "dominant seventh", "7 dom"], ["1P 3M 5P 7m 9M", "dominant ninth", "9"], ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"], ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"], ["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"], ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"], ["1P 3M 7m 9m", "altered", "alt7"], ["1P 4P 5P", "suspended fourth", "sus4 sus"], ["1P 2M 5P", "suspended second", "sus2"], ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"], ["1P 5P 7m 9M 11P", "eleventh", "11"], ["1P 4P 5P 7m 9m", "suspended fourth flat ninth", "b9sus phryg 7b9sus 7b9sus4"], ["1P 5P", "fifth", "5"], ["1P 3M 5A", "augmented", "aug + +5 ^#5"], ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"], ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"], ["1P 3M 5P 7M 9M 11A", "major sharp eleventh (lydian)", "maj9#11 Δ9#11 ^9#11"], ["1P 2M 4P 5P", "", "sus24 sus4add9"], ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"], ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"], ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"], ["1P 3M 5A 7m 9M", "", "9#5 9+"], ["1P 3M 5A 7m 9M 11A", "", "9#5#11"], ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"], ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"], ["1P 3M 5A 9A", "", "+add#9"], ["1P 3M 5A 9M", "", "M#5add9 +add9"], ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"], ["1P 3M 5P 6M 7M 9M", "", "M7add13"], ["1P 3M 5P 6M 9M 11A", "", "69#11"], ["1P 3m 5P 6M 9M", "", "m69 -69"], ["1P 3M 5P 6m 7m", "", "7b6"], ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"], ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"], ["1P 3M 5P 7M 9m", "", "M7b9"], ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"], ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"], ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"], ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"], ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"], ["1P 3M 5P 7m 9A 13M", "", "13#9"], ["1P 3M 5P 7m 9A 13m", "", "7#9b13"], ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"], ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"], ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"], ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"], ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"], ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"], ["1P 3M 5P 7m 9m 13M", "", "13b9"], ["1P 3M 5P 7m 9m 13m", "", "7b9b13"], ["1P 3M 5P 7m 9m 9A", "", "7b9#9"], ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"], ["1P 3M 5P 9m", "", "Maddb9"], ["1P 3M 5d", "", "Mb5"], ["1P 3M 5d 6M 7m 9M", "", "13b5"], ["1P 3M 5d 7M", "", "M7b5"], ["1P 3M 5d 7M 9M", "", "M9b5"], ["1P 3M 5d 7m", "", "7b5"], ["1P 3M 5d 7m 9M", "", "9b5"], ["1P 3M 7m", "", "7no5"], ["1P 3M 7m 13m", "", "7b13"], ["1P 3M 7m 9M", "", "9no5"], ["1P 3M 7m 9M 13M", "", "13no5"], ["1P 3M 7m 9M 13m", "", "9b13"], ["1P 3m 4P 5P", "", "madd4"], ["1P 3m 5P 6m 7M", "", "mMaj7b6"], ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"], ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"], ["1P 3m 5P 9M", "", "madd9"], ["1P 3m 5d 6M 7M", "", "o7M7"], ["1P 3m 5d 7M", "", "oM7"], ["1P 3m 6m 7M", "", "mb6M7"], ["1P 3m 6m 7m", "", "m7#5"], ["1P 3m 6m 7m 9M", "", "m9#5"], ["1P 3m 5A 7m 9M 11P", "", "m11A"], ["1P 3m 6m 9m", "", "mb6b9"], ["1P 2M 3m 5d 7m", "", "m9b5"], ["1P 4P 5A 7M", "", "M7#5sus4"], ["1P 4P 5A 7M 9M", "", "M9#5sus4"], ["1P 4P 5A 7m", "", "7#5sus4"], ["1P 4P 5P 7M", "", "M7sus4"], ["1P 4P 5P 7M 9M", "", "M9sus4"], ["1P 4P 5P 7m 9M", "", "9sus4 9sus"], ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"], ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"], ["1P 4P 7m 10m", "", "4 quartal"], ["1P 5P 7m 9m 11P", "", "11b9"]], ii = { ...Vn, name: "", quality: "Unknown", intervals: [], aliases: [] }, ri = [], oi = {}, ni.forEach(([e3, t2, n2]) => function(e4, t3, n3) {
  const i2 = function(e5) {
    const t4 = (t5) => -1 !== e5.indexOf(t5);
    return t4("5A") ? "Augmented" : t4("3M") ? "Major" : t4("5d") ? "Diminished" : t4("3m") ? "Minor" : "Unknown";
  }(e4), r2 = { ...rt(e4), name: n3 || "", quality: i2, intervals: e4, aliases: t3 };
  ri.push(r2), r2.name && (oi[r2.name] = r2), oi[r2.setNum] = r2, oi[r2.chroma] = r2, r2.aliases.forEach((e5) => function(e6, t4) {
    oi[t4] = e6;
  }(r2, e5));
}(e3.split(" "), n2.split(" "), t2)), ri.sort((e3, t2) => e3.setNum - t2.setNum), si = {}, [["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"], ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"], ["1P 2M 3m 4P 5P 6m 7m", "minor", "aeolian"], ["1P 2M 3m 3M 5P 6M", "major blues"], ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"], ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"], ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"], ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"], ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"], ["1P 2M 3m 4P 5P 6M 7m", "dorian"], ["1P 2M 3M 4A 5P 6M 7M", "lydian"], ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"], ["1P 2m 3m 4P 5P 6m 7m", "phrygian"], ["1P 2m 3m 4P 5d 6m 7m", "locrian"], ["1P 3M 4P 5P 7M", "ionian pentatonic"], ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"], ["1P 2M 4P 5P 6M", "ritusen"], ["1P 2M 4P 5P 7m", "egyptian"], ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"], ["1P 3m 4P 5P 6m", "vietnamese 1"], ["1P 2m 3m 5P 6m", "pelog"], ["1P 2m 4P 5P 6m", "kumoijoshi"], ["1P 2M 3m 5P 6m", "hirajoshi"], ["1P 2m 4P 5d 7m", "iwato"], ["1P 2m 4P 5P 7m", "in-sen"], ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"], ["1P 3m 4P 6m 7m", "malkos raga"], ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"], ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"], ["1P 3m 4P 5P 6M", "minor six pentatonic"], ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"], ["1P 2M 3M 5P 6m", "flat six pentatonic"], ["1P 2m 3M 5P 6M", "scriabin"], ["1P 3M 5d 6m 7m", "whole tone pentatonic"], ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"], ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"], ["1P 3m 4P 5P 7M", "minor #7M pentatonic"], ["1P 3m 4d 5d 7m", "super locrian pentatonic"], ["1P 2M 3m 4P 5P 7M", "minor hexatonic"], ["1P 2A 3M 5P 5A 7M", "augmented"], ["1P 2M 4P 5P 6M 7m", "piongio"], ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"], ["1P 2M 3M 4A 6M 7m", "prometheus"], ["1P 2m 3M 5d 6m 7m", "mystery #1"], ["1P 2m 3M 4P 5A 6M", "six tone symmetric"], ["1P 2M 3M 4A 5A 6A", "whole tone", "messiaen's mode #1"], ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"], ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"], ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"], ["1P 2m 2A 3M 4A 6m 7m", "altered", "super locrian", "diminished whole tone", "pomeroy"], ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"], ["1P 2M 3M 4P 5P 6m 7m", "mixolydian b6", "melodic minor fifth mode", "hindu"], ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"], ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"], ["1P 2m 3m 4P 5P 6M 7m", "dorian b2", "phrygian #6", "melodic minor second mode"], ["1P 2m 3m 4d 5d 6m 7d", "ultralocrian", "superlocrian bb7", "superlocrian diminished"], ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"], ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"], ["1P 2M 3m 4A 5P 6M 7m", "dorian #4", "ukrainian dorian", "romanian minor", "altered dorian"], ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"], ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"], ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"], ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"], ["1P 2m 3m 4P 5P 6m 7M", "balinese"], ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"], ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"], ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"], ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"], ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"], ["1P 2m 3M 4P 5d 6M 7m", "oriental"], ["1P 2m 3m 3M 4A 5P 7m", "flamenco"], ["1P 2m 3m 4A 5P 6m 7M", "todi raga"], ["1P 2m 3M 4P 5d 6m 7M", "persian"], ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"], ["1P 2M 3M 4P 5A 6M 7M", "major augmented", "major #5", "ionian augmented", "ionian #5"], ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"], ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"], ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"], ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"], ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"], ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"], ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"], ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"], ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"], ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"], ["1P 2m 3m 3M 4A 5P 6M 7m", "half-whole diminished", "dominant diminished", "messiaen's mode #2"], ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"], ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"], ["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"], ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"], ["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"], ["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"]].forEach(([e3, t2, ...n2]) => function(e4, t3, n3 = []) {
  const i2 = { ...rt(e4), name: t3, intervals: e4, aliases: n3 };
  return si[i2.name] = i2, si[i2.setNum] = i2, si[i2.chroma] = i2, i2.aliases.forEach((e5) => function(e6, t4) {
    si[t4] = e6;
  }(i2, e5)), i2;
}(e3.split(" "), t2, n2)), ci = { empty: 1, name: "", symbol: "", root: "", rootDegree: 0, type: "", tonic: null, setNum: NaN, quality: "Unknown", chroma: "", normalized: "", aliases: [], notes: [], intervals: [] };
class Dr {
  static search(e3, t2, n2 = {}) {
    e3 = e3.replace(/mmaj/, "mMaj"), n2.difficulty || (n2.difficulty = 3), n2.maxSearchRootFret || (n2.maxSearchRootFret = 12), n2.searchFretWidth || (n2.searchFretWidth = 4), n2.requiredStrings && (n2.requiredStrings = n2.requiredStrings.map((e4) => e4 - 1).sort());
    let i2 = null;
    /\//.test(e3) && ([e3, i2] = e3.split("/"));
    const r2 = function(e4) {
      if ("" === e4) return ci;
      if (Array.isArray(e4) && 2 === e4.length) return ot(e4[1], e4[0]);
      {
        const [t3, n3] = function(e5) {
          const [t4, n4, i4, r3] = nt(e5);
          return "" === t4 ? ["", e5] : "A" === t4 && "ug" === r3 ? ["", "aug"] : [t4 + n4, i4 + r3];
        }(e4), i3 = ot(n3, t3);
        return i3.empty ? ot(e4) : i3;
      }
    }(e3);
    if (!r2.notes.length) return null;
    if (!r2.tonic) throw "nothing tonic";
    i2 && (r2.notes.unshift(i2), r2.tonic = i2);
    const o2 = r2.notes.map((e4) => me(e4)), s2 = [];
    r2.intervals.forEach((e4, t3) => {
      /9|13|11/.test(e4) && s2.push(o2[t3]);
    });
    let c2 = null;
    r2.intervals.forEach((e4, t3) => {
      "5P" === e4 && (c2 = r2.notes[t3]);
    });
    const a2 = { notes: o2, tonic: me(r2.tonic), intervals: r2.intervals, tensionNotes: s2, perfectFifth: c2, options: n2 };
    return function(e4, t3) {
      const n3 = [];
      for (let i3 = e4.length - 1; i3 >= 0; i3--) {
        const r3 = Ir[e4[i3]], o3 = [];
        for (let e5 = 0; Zi.maxTopFret >= e5; e5++) {
          const n4 = e5 % r3.length;
          o3.push(t3.notes.includes(r3[n4]) ? r3[n4] : null);
        }
        n3.push(o3);
      }
      t3.basicBoardList = n3;
    }(t2, a2), st(t2, a2);
  }
}
class Br {
  static create(e3, t2, n2, i2, r2, o2) {
    const s2 = `${t2.join("")}:${r2}:${JSON.stringify(o2)}`, c2 = e3.get(s2);
    if (c2) return new ir(c2);
    if ("r" === r2) return new ir({ symbol: "r", intervals: [], notes: [], tonic: { iKeyId: 0, sym: "" }, bass: { iKeyId: 0, sym: "" }, fingerings: [], createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    const a2 = Dr.search(r2, t2, o2);
    if (!a2) return new fr(n2, i2, r2, `'${r2}' No fingerable form was found for this code symbol.`);
    if (!a2.fingerings) return new fr(n2, i2, r2, `Not found fingering of '${r2}'. Tuning and chord may not match.`);
    if (!a2.fingerings.length) return new fr(n2, i2, r2, `'${r2}'" No fingerable form was found for this code structure.`);
    const u2 = { symbol: r2, intervals: a2.intervals, notes: a2.notes.map((e4) => me(e4)), tonic: { iKeyId: er.iKey.indexOf(a2.tonic), sym: a2.tonic }, bass: { iKeyId: er.iKey.indexOf(a2.tonic), sym: a2.tonic }, fingerings: a2.fingerings, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() };
    return e3.set(s2, u2), new ir(u2);
  }
}
class Fr {
  static resolve(e3, t2, n2, i2, r2) {
    var _a;
    const o2 = t2.mixesList[n2], { regionList: s2 } = o2, c2 = [];
    let a2 = null;
    for (let e4 = 0; r2.length > e4; e4++) {
      const t3 = r2[e4], n3 = (_a = t3.decidedProp) == null ? void 0 : _a.styles.mapped, o3 = n3 == null ? void 0 : n3.filter((e5) => e5.group === i2).length;
      if (o3) null === a2 && (a2 = e4), c2.push({ index: e4, sym: structuredClone(t3) });
      else if (null !== a2 && t3.type === An.note) break;
    }
    if (!c2.length) return or();
    const u2 = ((e4) => {
      let n3 = t2.settings.style.scale.key + "_" + t2.settings.style.scale.scale;
      return e4.reduce((e5, i3) => {
        const r3 = i3.sym.decidedProp.styles.scaleX || t2.settings.style.scale, o3 = r3.key + "_" + r3.scale;
        return 0 === e5.length || i3.index !== e5[e5.length - 1][e5[e5.length - 1].length - 1].index + 1 || n3 !== o3 ? e5.push([i3]) : e5[e5.length - 1].push(i3), n3 = o3, e5;
      }, []);
    })(c2), f2 = s2[c2[0].sym.regionRegionForDualConnection].tuning, l2 = be(f2), d2 = u2.map((n3) => {
      const i3 = function(e4, t3, n4) {
        const i4 = `${t3.join()} ${n4.key}:${n4.bin.join("")}`;
        if (!e4[i4]) {
          const r4 = be(t3), { boardFullArr: o4, iKeysWithKeyStart: s4, iKeysWithTuningStart: c4 } = function(e5, t4, n5) {
            const i5 = t4.bin, r5 = Me(er.iKey, t4.key), o5 = Me(er.iKey, n5), s5 = i5.map((e6, t5) => 1 === e6 ? r5[t5] : void 0), c5 = e5[0] + Zi.maxTopFret + 1, a4 = e5[e5.length - 1], u3 = we(s5, 12 - Me(er.iKey, Tr[a4].keySym).indexOf(t4.key));
            return { boardFullArr: Array.from({ length: Math.floor((c5 - a4) / 12) }, () => u3).flat().concat(u3.slice(0, (c5 - a4) % 12)), iKeysWithKeyStart: r5, iKeysWithTuningStart: o5 };
          }(r4, n4, t3[0]);
          e4[i4] = { tuningPitches: r4, boardFullArr: o4, iKeysWithKeyStart: s4, iKeysWithTuningStart: c4 };
        }
        return e4[i4];
      }(e3, f2, n3[0].sym.decidedProp.styles.scaleX || t2.settings.style.scale), r3 = [], o3 = n3.map((e4) => {
        const t3 = function(e5, t4) {
          const n4 = [], i4 = [], r4 = [], o4 = [];
          return e5.forEach((e6, s4) => {
            if (void 0 !== e6 && e6 >= 0) {
              const c4 = t4[s4] + e6;
              n4.push(Tr[c4].keySym), i4.push(c4 - t4[t4.length - 1]), r4.push(e6), o4.push(s4);
            }
          }), { originKeyArr: n4, originNoteNumArr: i4, originFretArr: r4, originStringArr: o4 };
        }(e4.sym.decidedProp.fingering, l2);
        return r3.push(...t3.originKeyArr), t3;
      }), s3 = function(e4, t3, n4) {
        const i4 = structuredClone(e4);
        return n4.forEach((n5) => {
          if (!e4.includes(n5)) for (let e5 = t3.indexOf(n5); i4.length > e5; e5 += 12) i4[e5] = n5;
        }), i4;
      }(i3.boardFullArr, i3.iKeysWithTuningStart, r3), { activeInIndexes: c3 } = { activeInIndexes: (a3 = s3).map((e4, t3) => void 0 !== e4 ? t3 : void 0).filter((e4) => void 0 !== e4), activeInKeys: a3.map((e4) => void 0 !== e4 ? e4 : void 0).filter((e4) => void 0 !== e4) };
      var a3;
      return { board: i3.tuningPitches.map((e4) => {
        const t3 = e4 - i3.tuningPitches[i3.tuningPitches.length - 1];
        return pe(t3, t3 + Zi.maxTopFret);
      }), extendScaleFullArr: s3, activeInIndexes: c3, originList: o3, seed: i3 };
    }), m2 = c2[0].sym.decidedProp.styles.mapped, h2 = m2 == null ? void 0 : m2.find((e4) => e4.group === i2);
    if (void 0 === h2) throw "System Error";
    const v2 = d2.map((e4, t3) => function(e5, t4, n3) {
      const i3 = [];
      return t4.forEach((t5) => {
        const r3 = [], o3 = t5.options.includes(Yi.sos), s3 = t5.options.includes(Yi.ss), c3 = t5.options.includes(Yi.rev);
        e5.originList.forEach((i4, c4) => {
          var _a2;
          if (((_a2 = n3[c4].sym.decidedProp.extensionViewProp) == null ? void 0 : _a2.stepInfoId) || s3 || 1 !== i4.originFretArr.length) if (0 === t5.shift) r3.push({ noteNum: void 0, fingering: structuredClone(n3[c4].sym.decidedProp.fingering), shift: t5.shift, mapOpt: t5.options });
          else {
            const i5 = function(e6, t6, n4) {
              const i6 = e6.seed.tuningPitches[e6.seed.tuningPitches.length - 1];
              return e6.originList[t6].originStringArr.map((r4, o4) => {
                const s5 = e6.seed.tuningPitches[r4] - i6, c5 = pe(s5, s5 + Zi.maxTopFret), a3 = c5.map((t7) => void 0 !== e6.extendScaleFullArr[t7] ? t7 : void 0).filter((e7) => void 0 !== e7), u3 = ye(a3, a3.indexOf(e6.originList[t6].originNoteNumArr[o4]) + n4.shift);
                return c5.indexOf(a3[u3]);
              });
            }(e5, c4, t5), s4 = structuredClone(structuredClone(n3[c4].sym.decidedProp.fingering));
            i5.forEach((t6, n4) => {
              o3 && 0 === e5.originList[c4].originFretArr[n4] || (s4[e5.originList[c4].originStringArr[n4]] = t6);
            }), r3.push({ noteNum: void 0, fingering: s4, shift: t5.shift, mapOpt: t5.options });
          }
          else if (o3 && 0 === i4.originFretArr[0]) r3.push({ noteNum: void 0, fingering: structuredClone(n3[c4].sym.decidedProp.fingering), shift: t5.shift, mapOpt: t5.options });
          else if (0 === t5.shift) r3.push({ noteNum: void 0, fingering: structuredClone(n3[c4].sym.decidedProp.fingering), shift: t5.shift, mapOpt: t5.options });
          else {
            const n4 = ye(e5.activeInIndexes, e5.activeInIndexes.indexOf(i4.originNoteNumArr[0]) + t5.shift);
            r3.push({ noteNum: e5.activeInIndexes[n4], fingering: void 0, shift: t5.shift, mapOpt: t5.options });
          }
        }), i3.push(c3 ? r3.reverse() : r3);
      }), i3;
    }(e4, h2.style, u2[t3])), b2 = h2.style.flatMap((e4, t3) => v2.flatMap((e5) => e5[t3].map((e6) => e6)));
    let p2 = 0, y2 = 0;
    const w2 = b2.map((e4, n3) => {
      var _a2;
      n3 % c2.length == 0 && (y2 = 0);
      const r3 = e4.noteNum;
      if (void 0 !== r3) {
        const t3 = e4.mapOpt.includes(Yi.nos);
        let i3 = d2[0].board.findIndex((e5) => e5.includes(r3));
        if (t3 && d2[0].board.length - 1 !== i3 && 0 === d2[0].board[i3].indexOf(r3)) {
          const e5 = d2[0].board.findIndex((e6, t4) => e6.includes(r3) && i3 !== t4);
          0 > e5 || (i3 = e5);
        }
        const o4 = Array(f2.length).fill(void 0);
        o4[i3] = d2[0].board[i3].indexOf(r3), b2[n3].fingering = o4;
      }
      const o3 = (/* @__PURE__ */ new Date()).getTime(), s3 = t2.notStyleCompile ? function(e5) {
        var _a3;
        const t3 = { line: e5.line, linePos: e5.linePos, endLine: e5.endLine, endPos: e5.endPos, decidedProp: { noteStr: e5.decidedProp.noteStr, list: e5.decidedProp.list, tick: { tick: e5.decidedProp.tick.tick, untilNext: e5.decidedProp.tick.untilNext }, styles: {}, shifted: (_a3 = e5.decidedProp.shifted) == null ? void 0 : _a3.map((e6) => ({ shift: e6.shift, options: [...e6.options] })) }, regionRegionForDualConnection: e5.regionRegionForDualConnection, locationInfoRefStackUpList: e5.locationInfoRefStackUpList };
        e5.decidedProp.isArpeggio && (t3.decidedProp.isArpeggio = 1), e5.decidedProp.isBullet && (t3.decidedProp.isBullet = e5.decidedProp.isBullet);
        const n4 = {}, i3 = e5.decidedProp.styles;
        return Object.keys(i3).forEach((e6) => {
          n4[e6] = i3[e6];
        }), t3.decidedProp.styles = n4, t3;
      }(c2[y2].sym) : function(e5) {
        var _a3;
        const t3 = { curlyLevel: e5.curlyLevel, type: e5.type, line: e5.line, linePos: e5.linePos, typesStyle: e5.typesStyle, endLine: e5.endLine, endPos: e5.endPos, token: e5.token, styles: e5.styles, linesOfStyle: e5.linePosOfStyle, linePosOfStyle: e5.linePosOfStyle, endOfMeasure: e5.endOfMeasure, decidedProp: { noteStr: e5.decidedProp.noteStr, extensionViewProp: e5.decidedProp.extensionViewProp, list: e5.decidedProp.list, tick: { tick: e5.decidedProp.tick.tick, untilNext: e5.decidedProp.tick.untilNext }, styles: {}, fingering: [...e5.decidedProp.fingering], trueTab: e5.decidedProp.trueTab ? [...e5.decidedProp.trueTab] : void 0, shifted: (_a3 = e5.decidedProp.shifted) == null ? void 0 : _a3.map((e6) => ({ shift: e6.shift, options: [...e6.options] })), chordDicRef: e5.decidedProp.chordDicRef }, regionRegionForDualConnection: e5.regionRegionForDualConnection, locationInfoRefStackUpList: e5.locationInfoRefStackUpList };
        e5.decidedProp.isArpeggio && (t3.decidedProp.isArpeggio = 1), e5.decidedProp.isBullet && (t3.decidedProp.isBullet = e5.decidedProp.isBullet);
        const n4 = {}, i3 = e5.decidedProp.styles;
        return Object.keys(i3).forEach((e6) => {
          n4[e6] = i3[e6];
        }), t3.decidedProp.styles = n4, t3;
      }(c2[y2].sym);
      return p2 += ((/* @__PURE__ */ new Date()).getTime() - o3) / 1e3, s3.decidedProp.trueTab = c2[y2].sym.decidedProp.trueTab, s3.decidedProp.fingering = b2[n3].fingering, s3.decidedProp.shifted || (s3.decidedProp.shifted = []), s3.decidedProp.shifted.push({ shift: e4.shift, options: e4.mapOpt }), (_a2 = s3.decidedProp.styles.mapped) == null ? void 0 : _a2.forEach((e5) => {
        e5.group === i2 && (e5.group = -2);
      }), y2++, s3;
    });
    return structuredClone(u2).reverse().forEach((e4) => {
      r2.splice(e4[0].index, e4.length);
    }), r2.splice(u2[0][0].index, 0, ...w2), or();
  }
}
class Lr {
  static apply(e3, t2, n2) {
    const i2 = e3.mixesList[t2], { marks: r2 } = i2, o2 = e3.dic.mapSeed, s2 = r2.styleMappedGroupList;
    if (!s2.length) return or();
    for (let i3 = 0; s2.length > i3; i3++) {
      const r3 = Fr.resolve(o2, e3, t2, s2[i3], n2);
      if (r3.fail()) return r3;
    }
    return or();
  }
}
class Gr {
  static resolve(e3, t2, n2, i2, r2, o2) {
    const s2 = o2.token, c2 = o2.line, a2 = o2.linePos;
    if ("@/click" === s2) {
      const r3 = lt(e3, t2, n2, i2, s2, c2, a2);
      if (r3.fail()) return r3;
    } else if (s2.startsWith("@click(")) {
      if (0 !== t2) return new fr(c2, a2, s2, `Unknown annotation token '${s2.replace(/\(.*?$/, "")}'. Click specification is only possible in base blocks.`);
      const r3 = lt(e3, t2, n2, i2, s2, c2, a2);
      if (r3.fail()) return r3;
    } else if ("@click" === s2) {
      if (0 !== t2) return new fr(c2, a2, s2, `Unknown annotation token '${s2.replace(/\(.*?$/, "")}'. Click specification is only possible in base blocks.`);
      const r3 = lt(e3, t2, n2, i2, s2, c2, a2);
      if (r3.fail()) return r3;
    } else {
      if (!s2.startsWith("@offset")) {
        if ("@@" === s2) return new fr(c2, a2, s2, "The start mark @@ of a region must start outside the {} brackets.");
        for (let o3 = 0; e3.allowAnnotations.length > o3; o3++) {
          const u2 = e3.allowAnnotations[o3], f2 = /^@/.test(u2.name) ? u2.name : "@" + u2.name;
          if (s2 === f2 || s2.startsWith(f2 + "(")) {
            if (u2.dualIdRestrictions.length && !u2.dualIdRestrictions.includes(t2)) return new fr(c2, a2, s2, `Invalid annotation token '${s2.replace(/\(.*?$/, "")}'. Click specification is only possible in index ${u2.dualIdRestrictions} blocks.`);
            const o4 = ft(e3, t2, n2, i2, r2, f2, s2, c2, a2);
            return o4.fail() ? o4 : or();
          }
        }
        return new fr(c2, a2, s2, `Unknown annotation token '${s2.replace(/\(.*?$/, "")}'.`);
      }
      {
        const i3 = function(e4, t3, n3, i4, r3, o3, s3) {
          if (0 === t3) return new cr(o3, s3, null, "@offset cannot be set for base block.");
          const c3 = `${t3}_${n3}`;
          return e4.flash.offset[c3] ? new cr(o3, s3, null, "@offset duplicate error. Only one @offset can be set in a block.") : (e4.flash.offset[c3] = { syntaxLocation: { row: r3, line: o3, linePos: s3 }, blockNoteIndex: i4 }, or());
        }(e3, t2, n2, r2, s2, c2, a2);
        if (i3.fail()) return i3;
      }
    }
    return or();
  }
}
class _r {
  static resolve(e3, t2) {
    var _a;
    const { regionLength: n2 } = e3, { regionList: i2, flatTOList: r2 } = e3.mixesList[t2], o2 = Math.max(...i2.map((e4) => e4.tuning.length)), s2 = r2.length;
    let c2 = 0;
    for (let e4 = 0; o2 > e4; e4++) {
      let t3, o3, a2, u2 = n2 - 1, f2 = i2[u2], l2 = f2.startLayerTick + f2.usedTotalTick, d2 = f2.startLayerTick + f2.usedTotalTick;
      for (let t4 = s2 - 1; t4 >= 0; t4--) {
        const n3 = r2[t4];
        let o4;
        u2 !== n3.regionIndex && (u2 = n3.regionIndex, f2 = i2[u2], l2 = f2.startLayerTick + f2.usedTotalTick, 0 == c2 ? d2 = f2.startLayerTick + f2.usedTotalTick : f2.usedTotalTick === f2.offsetTickWidth ? d2 = f2.trueStartLayerTick : i2[u2 + 1].deactive ? d2 = f2.startLayerTick + f2.usedTotalTick : (o4 = n3.bar.stopTick, n3.bar.stopTick = d2)), i2[n3.regionIndex].tuning.length > e4 && (l2 -= n3.bar.tick, void 0 !== n3.tab[e4] && -1 !== n3.tab[e4] && (n3.bar.fretStartTicks[e4] = l2, n3.bar.fretStopTicks[e4] = -1 === d2 ? l2 + n3.bar.tick : d2), n3.bar.startTick = l2, void 0 === n3.bar.stopTick && (n3.bar.stopTick = l2 + n3.bar.tick), n3.bar.stopTick - n3.bar.startTick > n3.bar.tick && (n3.bar.stopTick = n3.bar.startTick + n3.bar.tick), void 0 === n3.tab[e4] && 0 != n3.continueX || (d2 = l2), o4 && (n3.bar.stopTick = o4), c2 = n3.continueX);
      }
      let m2 = 0, h2 = {}, v2 = -1;
      for (let n3 = 0; s2 > n3; n3++) {
        const s3 = r2[n3];
        0 === s3.regionNoteIndex && (f2 = i2[s3.regionIndex], v2 = f2.tuning.length), e4 > i2[s3.regionIndex].tuning.length - 1 || (h2.nextTabObj = s3, s3.isRest || -1 === s3.tab[e4] ? (t3 = void 0, o3 = void 0) : 0 === n3 ? void 0 !== s3.tab[e4] && -1 !== s3.tab[e4] && (t3 = s3.tab[e4], o3 = s3) : 0 == s3.continueX ? void 0 !== s3.tab[e4] && -1 !== s3.tab[e4] ? (t3 = s3.tab[e4], o3 = s3) : (t3 = void 0, o3 = void 0) : void 0 !== s3.tab[e4] && -1 !== s3.tab[e4] ? (t3 = s3.tab[e4], o3 = s3) : s3.styles.strum && (t3 = void 0, o3 = void 0), s3.activeBows[e4] = t3, void 0 === s3.refActiveBows && (s3.refActiveBows = Array(v2).fill(void 0)), s3.refActiveBows[e4] = o3, a2 && (s3.isRest || void 0 === s3.tab.find((e5) => void 0 !== e5 && -1 !== e5) || (a2.slideLandingTab = s3.tab, m2 && a2.styles.slide && (a2.styles.slide.type = "release"), a2 = void 0)), m2 = 1, ((_a = s3.styles) == null ? void 0 : _a.slide) && (a2 = s3, m2 = 0), s3.prevTabObj = h2, h2 = s3);
      }
    }
    return or();
  }
}
class Ur {
  static apply(e3, t2, n2) {
    var _a;
    const i2 = e3.extensionInfo.stepInfoList;
    for (let r2 = 0; n2.length > r2; r2++) {
      const o2 = n2[r2], s2 = (_a = o2.decidedProp) == null ? void 0 : _a.styles;
      if (!(s2 == null ? void 0 : s2.step)) continue;
      const c2 = e3.mixesList[t2].marks.styleMappedGroupList, a2 = c2.findIndex((e4) => e4 > 0);
      let u2 = -1;
      c2[a2] > 0 ? (u2 = c2[a2] + 1, c2.splice(a2, 0, u2)) : (u2 = 1, c2.splice(1, 0, u2));
      const f2 = s2.step.parsedStep, l2 = i2.length;
      i2.push({ tabAll: o2.decidedProp.fingering, parsedStepList: f2 });
      const d2 = Object.keys(o2.decidedProp.styles), m2 = [];
      for (let e4 = 0; f2.length > e4; e4++) {
        const t3 = f2[e4], n3 = o2.decidedProp.fingering.map((e5, n4) => {
          var _a2;
          return ((_a2 = t3.stringIndexes) == null ? void 0 : _a2.includes(n4)) ? e5 : void 0;
        }), i3 = structuredClone(o2.decidedProp.tick);
        if (t3.suffix) {
          const e5 = ze(i3.untilNext, t3.suffix, o2.line, o2.linePos);
          if (e5.fail()) return e5;
        }
        const r3 = {};
        d2.forEach((t4) => {
          if (void 0 !== o2.decidedProp.styles[t4]) {
            switch (t4) {
              case "bd":
              case "bpm":
              case "until":
              case "degree":
              case "scaleX":
              case "staccato":
              case "velocity":
              case "velocityPerBows":
              case "stroke":
              case "turn":
                r3[t4] = o2.decidedProp.styles[t4];
                break;
              case "mapped":
                r3[t4] = structuredClone(o2.decidedProp.styles[t4]), r3[t4].forEach((e5) => {
                  -1 === e5.group && (e5.group = u2);
                });
            }
            if (0 === e4) switch (t4) {
              case "approach":
              case "continue":
              case "delay":
              case "strum":
                r3[t4] = o2.decidedProp.styles[t4];
            }
            e4 === f2.length - 1 && "slide" === t4 && (r3[t4] = o2.decidedProp.styles[t4]);
          }
        }), r3.inst = void 0 !== t3.inst ? t3.inst : void 0 !== o2.decidedProp.styles.inst ? o2.decidedProp.styles.inst : zi.normal, 0 === e4 || r3.inst !== zi.normal && r3.inst !== zi.muteContinue || (r3.continue = 1);
        const s3 = o2.decidedProp.extensionViewProp || {};
        s3.stepInfoId = { id: l2, orderCount: e4 };
        const c3 = { curlyLevel: o2.curlyLevel, type: o2.type, typesStyle: [], line: t3.line, linePos: t3.startPos, linesOfStyle: [], linePosOfStyle: [], endLine: t3.line, endPos: t3.endPos, token: o2.token, styles: [], decidedProp: { noteStr: o2.decidedProp.noteStr, extensionViewProp: s3, list: o2.decidedProp.list, tick: i3, styles: r3, fingering: n3, trueTab: o2.decidedProp.fingering, chordDicRef: o2.decidedProp.chordDicRef, isArpeggio: 1 }, regionRegionForDualConnection: o2.regionRegionForDualConnection };
        c3.locationInfoRefStackUpList = o2.locationInfoRefStackUpList, m2.push(c3);
      }
      n2.splice(r2, 1, ...m2), r2 += m2.length - 1;
    }
    return or();
  }
}
class Rr {
  static resolve(e3, t2) {
    for (let n3 = 0; t2.length > n3; n3++) {
      const i2 = t2[n3], r2 = vt(e3, n3, t2);
      if (r2.fail()) return r2;
      const o2 = Ur.apply(e3, n3, i2);
      if (o2.fail()) return o2;
      if (!e3.notStyleCompile || e3.settings.compile.mappingResolved) {
        const t3 = Lr.apply(e3, n3, i2);
        if (t3.fail()) return t3;
      }
    }
    for (let n3 = 0; Zi.dualLength > n3; n3++) {
      const i2 = dt(e3, n3, t2[n3]);
      if (i2.fail()) return i2;
    }
    const n2 = function(e4) {
      const t3 = e4.mixesList[0].regionList.length;
      for (let n3 = 0; t3 > n3; n3++) {
        for (let t4 = 0; Zi.dualLength > t4; t4++) {
          const i3 = e4.mixesList[t4].regionList[n3];
          if (i3.trueStartLayerTick = i3.startLayerTick, i3.offsetTickWidth && (i3.startLayerTick -= i3.offsetTickWidth, i3.endLayerTick -= i3.offsetTickWidth, 0 > i3.startLayerTick)) {
            if (i3.flashOffsetLocation) return new cr(i3.flashOffsetLocation.line, i3.flashOffsetLocation.linePos, i3.flashOffsetLocation.token, i3.flashOffsetLocation.token + " exceeds previous limit. Create a region with only rests at the start.");
            throw "system error over offset";
          }
        }
        const i2 = Math.max(...e4.mixesList.map((e5) => e5.regionList[n3].endLayerTick));
        if (t3 - 1 !== n3) {
          e4.mixesList[0].regionList[n3].endLayerTick = i2;
          for (let t4 = 0; Zi.dualLength > t4; t4++) {
            const r2 = e4.mixesList[t4].regionList[n3 + 1];
            -1 !== r2.startLayerTick && r2.startLayerTick != r2.endLayerTick || (r2.deactive = 1);
            const o2 = i2 - r2.startLayerTick;
            r2.startLayerTick = i2, r2.endLayerTick += o2;
          }
        }
      }
      return or();
    }(e3);
    if (n2.fail()) return n2;
    for (let t3 = 0; Zi.dualLength > t3; t3++) {
      const n3 = _r.resolve(e3, t3);
      if (n3.fail()) return n3;
      mt(e3, t3);
    }
    return or();
  }
}
class qr {
  static compile(e3, t2) {
    const n2 = function(e4, t3) {
      const n3 = [];
      let i3 = 0;
      for (const r3 of t3[0]) if (r3.type === An.regionStart) {
        const t4 = {}, o3 = bt(t4, r3);
        if (o3.fail()) return o3;
        const s2 = "@@" === r3.token ? "@@" + Math.random() : r3.token;
        if (n3.includes(s2)) return new cr(r3.line, r3.linePos, s2, `Block name '${s2}' is already in use. The same block name cannot be declared at the same time.`);
        n3.push(s2), e4.mixesList[0].regionList.push({ id: i3, name: s2, tuning: t4.tuning ? t4.tuning : e4.settings.style.tuning, bpm: t4.bpm ? t4.bpm : 0 === i3 ? e4.settings.style.bpm : -1, untilNext: t4.untilNext ? t4.untilNext : e4.settings.style.until, startLayerTick: -1, endLayerTick: -1, trueStartLayerTick: -1, trueEndLayerTick: -1, start: {}, end: {}, dualId: 0, usedTotalTick: 0, offsetTickWidth: 0 }), i3++;
      }
      if (!e4.mixesList[0].regionList.length) return new br(-1, -1, null, "At least one 'region' declaration is required.");
      e4.regionLength = e4.mixesList[0].regionList.length;
      for (let r3 = 1; t3.length > r3; r3++) {
        let o3 = -1;
        const s2 = (t4, n4, i4, o4) => {
          e4.mixesList[r3].regionList.push({ id: t4, name: n4, tuning: i4, bpm: -1, untilNext: o4, startLayerTick: -1, endLayerTick: -1, trueStartLayerTick: -1, trueEndLayerTick: -1, start: void 0, end: void 0, dualId: r3, usedTotalTick: 0, offsetTickWidth: 0 });
        };
        for (const i4 of t3[r3]) if (i4.type === An.regionStart) {
          const t4 = {}, c2 = bt(t4, i4, 1);
          if (c2.fail()) return c2;
          const a2 = "@@" === i4.token ? "@@" + Math.random() : i4.token;
          if (n3.includes(a2) && a2 !== Zi.dualJoiner) return new cr(i4.line, i4.linePos, a2, `-Block name '${a2}' is already in use. The same block name cannot be declared at the same time.`);
          if (n3.push(a2), o3 + 1 !== i4.regionRegionForDualConnection) for (let t5 = o3 + 1; i4.regionRegionForDualConnection > t5; t5++) s2(t5, `clone.${r3}.${t5}`, e4.settings.style.tuning, void 0);
          s2(i4.regionRegionForDualConnection, `dual.${r3}.${i4.regionRegionForDualConnection}`, t4.tuning ? t4.tuning : e4.settings.style.tuning, t4.untilNext ? t4.untilNext : e4.settings.style.until), o3 = i4.regionRegionForDualConnection;
        }
        for (let t4 = o3 + 1; i3 > t4; t4++) s2(t4, `clone.${r3}.${t4}`, e4.settings.style.tuning, [0, 0]);
      }
      return or();
    }(e3, t2);
    if (n2.fail()) return n2;
    const i2 = Cr.resolve(t2);
    if (i2.fail()) return i2;
    const r2 = Er.resolve(e3, t2);
    if (r2.fail()) return r2;
    const o2 = Rr.resolve(e3, t2);
    return o2.fail() ? o2 : or();
  }
}
const Kr = { tonalObj: { tonic: "C", scale: Sn.normal, tonal: xn.major, tonalShift: 1, modalShift: 1, name: "C major", diatonicEvolverValue: { evolvedCodePrefix: ["", "m", "m", "", "", "m", "dim"], bin: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1] }, sys: { shiftedKeyArray: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], note7array: ["C", "D", "E", "F", "G", "A", "B"] } }, styleScaleX: { key: $r.C, scale: In.major, bin: xr[In.major].bin } }, Wr = { ver: "1.0", strict: 0, song: { key: null }, style: { degree: structuredClone(Kr.tonalObj), scale: structuredClone(Kr.styleScaleX), tuning: ["E", "A", "D", "G", "B", "E"], until: [4, 4], bpm: 120 }, compile: { mappingResolved: 1 }, downTuning: 0, hash: { compose: "0000000000000000000000000000000000000000000000000000000000000000" }, dual: { pan: 1, panning: [0.5, 0, 1] }, click: { until: [1, 4], inst: 42, velocity: 60, accent: 0 }, play: { velocities: [70, 70, 70, 70, 75, 82, 82, 75, 65], possibleMSEC: { fullPicking: 0.02, trill: 0.015, sweep: 0.012 }, strum: { defaultStrumWidthMSec: 30, velocity: 55 }, approach: { widthOfSlide: { baseTick: 100, maxSplitTick: 24 }, velocity: { max: 65, decrease: 10, min: 45, minLanding: 66 } }, slide: { widthOfSlide: { maxSplitTick: 48, distributionTick: 25 }, velocity: { max: 75, decrease: 10, min: 35, landing: 65 }, realization: { realizationLandingPointOpenBows: 1, autoStartPointAdjustmentThresholdSec: 0.02 } }, release: { widthOfSlide: { maxSplitTick: 48, distributionTick: 25 }, velocity: { max: 55, decrease: 8, min: 0, landing: 50 } } } };
class zr {
  resolve(e3) {
    e3.settings = structuredClone(Wr);
    const t2 = function(e4) {
      const t3 = /* @__PURE__ */ new Map();
      let n2 = 1;
      return e4.syntax = e4.syntax.replace(/.*?\n/gs, (e5) => (e5 = e5.replace(/(?:^set|\sset)\.([^\s^:]+)\s*:\s*([^\n]+)/g, (e6, i2, r2) => (t3.set(i2, { value: r2.trim(), line: n2 }), "")), n2++, e5)), t3;
    }(e3);
    for (const [n2, i2] of t2) {
      const t3 = n2.split(".");
      let r2 = e3.settings;
      for (let e4 = 0; t3.length - 1 > e4; e4++) if (r2 = r2[t3[e4]], void 0 === r2) return new cr(i2.line, -1, null, `Invalid settings because path '${t3.slice(0, e4 + 1).join(".")}' is missing.`);
      {
        const o2 = t3[t3.length - 1];
        if (!(o2 in r2)) return new cr(i2.line, -1, null, `Invalid setting because path '${o2}' is missing.`);
        {
          if (!/\S/.test(i2.value)) return new cr(i2.line, -1, null, "Value must be specified.");
          const t4 = pt(e3, o2, i2.value, n2, i2.line);
          if (t4.fail()) return t4;
          r2[o2] = t4.res;
        }
      }
    }
    return or();
  }
}
class Xr {
  static as(e3) {
    let t2, n2 = "", i2 = 0, r2 = 1, o2 = 2, s2 = 1, c2 = 2, a2 = 0, u2 = 0, f2 = -1, l2 = 0, d2 = 0;
    const m2 = [[], [], []], h2 = [], v2 = [];
    let b2 = 0;
    const p2 = [], y2 = [], w2 = [], M2 = (e4) => {
      var _a;
      const i3 = ((_a = m2[l2]) == null ? void 0 : _a.length) ? m2[l2][m2[l2].length - 1].type : An.undefined;
      let u3 = 0;
      if (void 0 === e4) {
        const r3 = n2[0];
        if ([Zi.dualJoiner].includes(n2)) {
          if (a2 > 0) return void (t2 = new cr(s2, c2, n2, `Invalid token '${n2}' specified in the wrong place. '${n2}' is set outside the region.`));
          if (0 > f2) return void (t2 = new cr(s2, c2, n2, `Invalid token '${n2}'. Required start base region.`));
          if (l2 = d2 + 1, l2 > 2) return void (t2 = new cr(s2, c2, n2, `Invalid syntax '${n2}'. Exceeding the number of dual blocks in a region.`));
          e4 = An.regionStart;
        } else if (":" === r3) {
          const r4 = function(e5, t3, n3, i4) {
            return [An.note, An.bullet, An.degreeName, An.closingCurlyBrace].includes(t3) ? 1 === e5.length ? new cr(n3, i4, e5, "invalid token ':' specified in the wrong place.") : or() : new cr(n3, i4, e5, `invalid token '${e5}' specified in the wrong place. Set the style specification after the note or in {}.`);
          }(n2, i3, s2, c2);
          r4.fail() && (t2 = r4), n2 = n2.replace(/^:+/, ""), e4 = An.style;
        } else if (0 === a2) if ("@@" === n2) {
          const r4 = function(e5, t3, n3, i4) {
            return An.regionStart === t3 ? new cr(n3, i4, e5, `invalid name '${e5}' specified in the wrong place. Duplicate block declaration.`) : or();
          }(n2, i3, s2, c2);
          r4.fail() && (t2 = r4), l2 || f2++, e4 = An.regionStart;
        } else e4 = An.regionProp;
        else "@" === r3 ? e4 = An.flash : /%/.test(n2) ? (e4 = An.degreeName, n2 = n2.replace(/^([!./>']+)?%/, "$1"), u3 = 1) : new RegExp("(?<!\\w)\\d+\\/").test(n2) ? (e4 = An.bullet, u3 = 1) : (e4 = An.note, u3 = 1);
      }
      if (e4 === An.comma) m2[l2][m2[l2].length - 1].endOfMeasure = 1;
      else if (e4 === An.regionProp || e4 === An.style) {
        const u4 = function(e5, t3, n3, i4, r3) {
          return n3 === An.undefined ? new cr(i4, r3, e5, t3 === An.blockStyle ? `Invalid region prefix "${e5}" specified in the wrong place. Duplicate block declaration. 
Default properties of block are set after block name specification.
e.g. @backing 1/4 140 { C Dm }` : `Invalid region prefix '${e5}'. Only '@@' can be used as the region prefix.`) : or();
        }(n2, e4, i3, s2, c2);
        if (u4.fail()) return void (t2 = u4);
        const v3 = 0 === a2 && e4 === An.style ? d2 : l2;
        if (m2[v3][m2[v3].length - 1].type !== An.regionStart && e4 === An.regionProp) return void (t2 = new cr(s2, c2, n2, `Invalid syntax '${n2}'. Style must start with ':'.`));
        const b3 = m2[v3][m2[v3].length - 1], y3 = o2 - (/\)$/.test(n2) ? 0 : 1), w3 = e4 === An.style ? 1 : 0;
        b3.type === An.closingCurlyBrace && (h2[h2.length - 1].styles.push(n2), h2[h2.length - 1].linesOfStyle.push(s2), h2[h2.length - 1].linePosOfStyle.push(c2 + w3), h2[h2.length - 1].endLine = r2, h2[h2.length - 1].endPos = y3), p2.push({ line: s2, linePos: c2 + w3, endLine: r2, endPos: y3, type: e4 === An.regionProp ? An.regionProp : b3.type === An.note || b3.type === An.degreeName || b3.type === An.bullet ? An.style : An.blockStyle, regionId: f2, dualId: v3, sym: n2, tabObjIndexes: [] }), b3.typesStyle.push(e4), b3.styles.push(n2), b3.linesOfStyle.push(s2), b3.linePosOfStyle.push(c2 + w3), b3.endLine = r2, b3.endPos = y3, b3.locationInfoRefStackUpList && b3.locationInfoRefStackUpList.push(p2.length - 1);
      } else {
        if (0 === a2 && i3 !== An.regionStart && i3 !== An.regionProp && e4 === An.openingCurlyBrace) return void (t2 = new cr(s2, c2, "{", `Invalid token '${n2}'. Expected region declaration @@.
e.g. @@ { C D E }`));
        const d3 = o2 - (/\}$/.test(n2) ? 0 : 1);
        let b3;
        if ([An.regionStart, An.note, An.bullet, An.degreeName, An.flash].includes(e4)) b3 = { line: s2, linePos: c2, endLine: r2, endPos: d3, type: e4, regionId: f2, dualId: l2, sym: n2, tabObjIndexes: [] }, p2.push(b3);
        else if (e4 === An.closingCurlyBrace) {
          if (!v2.length) return;
          const e5 = v2[v2.length - 1];
          h2.push({ id: e5.id, regionId: f2, dualId: l2, upperBlock: e5.upperBlock, line: e5.line, linePos: e5.linePos, endLine: r2, endPos: d3, trueBraceEndLine: r2, trueBraceEndPos: d3, styles: [], linesOfStyle: [], linePosOfStyle: [] });
        }
        m2[l2].push({ curlyLevel: a2, type: e4, typesStyle: [], line: s2, linePos: c2, linesOfStyle: [], linePosOfStyle: [], endLine: r2, endPos: d3, token: n2, styles: [], decidedProp: u3 ? { noteStr: void 0, list: void 0, tick: void 0, styles: void 0, fingering: void 0, beforeStop: void 0, chordDicRef: void 0 } : void 0, regionRegionForDualConnection: f2, locationInfoRefStackUpList: b3 ? [p2.length - 1] : void 0 });
      }
      c2 = o2, s2 = r2, e4 = void 0, n2 = "";
    }, k2 = e3.syntax.length;
    for (; k2 > i2; ) {
      const f3 = e3.syntax[i2].replace(/\r\n/g, "\n");
      switch (f3) {
        case "{":
          y2.push({ line: r2, pos: o2 - 1 }), v2.push({ id: b2, upperBlock: v2.map((e4) => e4.id).reverse(), line: s2, linePos: c2 }), b2++, 0 === u2 ? (/\S/.test(n2) && M2(), n2 = "{", M2(An.openingCurlyBrace)) : n2 += "{", a2++;
          break;
        case "}":
          0 === u2 ? (/\S/.test(n2) && M2(), n2 = "}", M2(An.closingCurlyBrace)) : n2 += "}", v2.pop(), a2--, 0 === a2 ? (d2 = l2, l2 = 0) : 0 > a2 && (t2 = new cr(r2, o2 - 1, "}", `'X1 Unexpected EOF while parsing due to missing "{".'`)), y2.pop();
          break;
        case "(":
          w2.push({ line: r2, pos: o2 - 1 }), n2 += f3, u2++;
          break;
        case ")":
          n2 += f3, u2--, 0 === u2 ? M2() : 0 > u2 && (t2 = new cr(r2, o2 - 1, ")", `'Unexpected EOF while parsing due to missing ")".'`)), w2.pop();
          break;
        case ":":
          u2 || (/[^\s:]/.test(n2) ? (M2(), c2--) : c2 = o2 - 1), n2 += f3;
          break;
        case "\n":
          0 === u2 ? (/\S/.test(n2) && M2(), s2++, c2 = 1) : n2 += f3, o2 = 1, r2++;
          break;
        case " ":
        case "	":
          0 === u2 ? /\S/.test(n2) ? M2() : c2++ : n2 += f3;
          break;
        case ",":
          0 === u2 ? (/\S/.test(n2) && M2(), n2 = ",", M2(An.comma)) : n2 += ",";
          break;
        default:
          n2 += f3;
      }
      if (t2) return t2;
      o2++, i2++;
    }
    if (a2) {
      const e4 = y2[y2.length - 1];
      return new cr(e4.line, e4.pos, "{", 'x2 Unexpected EOF while parsing due to missing "}".');
    }
    if (u2) {
      const e4 = w2[w2.length - 1];
      return new cr(e4.line, e4.pos, "(", 'Unexpected EOF while parsing due to missing ")".');
    }
    return e3.locationInfoList = p2, h2.sort((e4, t3) => e4.id - t3.id), e3.braceLocationInfoList = h2, new ir(m2);
  }
}
class Vr {
  static resolve(e3) {
    const t2 = e3.flash.click;
    let n2;
    const i2 = e3.mixesList[0].marks.fullNoteIndexWithTick;
    for (const r2 of t2) if (r2.start) if (void 0 === n2) n2 = { untilRange: Ke(r2.start.until), startTick: i2[r2.start.fullNoteIndex], endTick: -1 };
    else {
      const t3 = i2[r2.start.fullNoteIndex] - 1;
      yt(e3, { ...n2, endTick: t3 }), n2 = { untilRange: Ke(r2.start.until), startTick: i2[r2.start.fullNoteIndex], endTick: -1 };
    }
    else if (n2) {
      const t3 = i2[r2.stop.noteIndex] - 1;
      yt(e3, { ...n2, endTick: t3 }), n2 = void 0;
    }
    if (n2) {
      const t3 = i2[i2.length - 1] - 1;
      yt(e3, { ...n2, endTick: t3 });
    }
  }
}
class Jr {
  static resolve(e3) {
    var _a, _b, _c, _d, _e2, _f, _g, _h;
    const { flatTOList: t2 } = e3;
    let n2, i2 = 0, r2 = 1, o2 = 0;
    const s2 = t2.length;
    for (let c2 = 0; s2 > c2; c2++) {
      const s3 = t2[c2], a2 = s3.styles.stroke, u2 = s3.styles.inst;
      let f2 = a2 == null ? void 0 : a2.until;
      0 === s3.regionNoteIndex && (i2 = e3.regionList[s3.regionIndex].tuning.length);
      const l2 = s3.tab.filter((e4) => 0 === e4 || e4).length;
      if (l2 > 1 && !(a2 == null ? void 0 : a2.off) && !s3.styles.legato) {
        let e4 = [];
        if (0 !== c2 && ((_c = (_b = (_a = s3.prevTabObj) == null ? void 0 : _a.styles) == null ? void 0 : _b.slide) == null ? void 0 : _c.continue)) {
          const t3 = s3.tab;
          e4 = (s3.prevTabObj.activeBows || []).map((e5, n3) => {
            const i3 = t3[n3];
            return void 0 !== e5 && e5 > -1 && void 0 !== i3 && i3 > -1 ? n3 : void 0;
          }).filter((e5) => void 0 !== e5);
        }
        const a3 = s3.bar.fretStartTicks.find((e5) => e5), d2 = a3 - o2;
        if (s3.isArpeggio || s3.isBullet || !((_d = s3.styles) == null ? void 0 : _d.approach)) if (a3 !== Zi.startTick && 2.4 > d2 / s3.bpm) {
          const e5 = 36 + Math.round(64 - d2 / 5);
          f2 = f2 || [1, 16 > e5 ? 16 : e5], r2 = r2 ? 0 : 1;
        } else r2 = 1, f2 = f2 || [1, 48];
        else r2 = 1, f2 = [1, 98];
        r2 = u2 === zi.brushing_u || u2 === zi.brushing_U ? 0 : 1;
        const m2 = Ke(f2), h2 = Math.round((m2 - e4.length) / l2), v2 = a3 - h2 * (l2 - 1), b2 = [];
        let p2 = 0;
        r2 = 1 == ((_f = (_e2 = s3.styles) == null ? void 0 : _e2.stroke) == null ? void 0 : _f.up) ? 0 : 0 == ((_h = (_g = s3.styles) == null ? void 0 : _g.stroke) == null ? void 0 : _h.up) ? 1 : r2;
        let y2 = 0;
        0 !== c2 && (y2 = n2.activeBows.reduce((e5, t3, n3) => t3 !== s3.tab[n3] && void 0 !== s3.tab[n3] ? e5 + 1 : e5, 0));
        for (let t3 = 0; i2 > t3; t3++) {
          const n3 = r2 ? t3 : i2 - t3 - 1;
          void 0 !== s3.bar.fretStartTicks[n3] ? (e4.includes(n3) || (s3.bar.fretStartTicks[n3] -= h2 * p2, 0 > s3.bar.fretStartTicks[n3] && (s3.bar.fretStartTicks[n3] = 0)), p2++, b2.push(s3.bar.fretStartTicks[n3])) : b2.push(v2);
        }
        if (o2 = a3, 0 !== c2) if (2 >= y2 && 0 !== s3.regionNoteIndex || e4.length) for (let e5 = 0; n2.refActiveBows.length > e5; e5++) {
          const n3 = r2 ? e5 : i2 - e5 - 1;
          s3.continueX && void 0 === s3.tab[n3] || wt(t2, c2, b2[e5], n3);
        }
        else for (let e5 = 0; n2.refActiveBows.length > e5; e5++) s3.continueX && void 0 === s3.tab[e5] || wt(t2, c2, v2, e5);
      }
      n2 = s3;
    }
    return or();
  }
}
class Hr {
  static resolve(e3) {
    const { regionList: t2, flatTOList: n2 } = e3.mixesList[0], { bpmPosList: i2 } = e3;
    i2.push({ tick: 0, bpm: e3.settings.style.bpm, timeMS: -1 });
    const r2 = [];
    let o2 = -1, s2 = {};
    const c2 = n2.length;
    for (let e4 = 0; c2 > e4; e4++) {
      const c3 = n2[e4];
      0 === c3.regionNoteIndex && (s2 = t2[c3.regionIndex], -1 !== s2.bpm && (o2 = s2.bpm, i2.push({ tick: s2.startLayerTick, bpm: s2.bpm, timeMS: -1 })));
      const a3 = c3.styles.bpm;
      if (a3 && !r2.includes(a3.group)) if (-1 === a3.group || 1 === a3.style.type) kt(i2, a3.style, c3.bar.startTick, c3.bar.stopTick), o2 = a3.style.afterBPM || a3.style.beforeBPM;
      else {
        r2.push(a3.group);
        const e5 = Mt(i2, o2, a3.style, c3.bar.startTick, a3.groupEndTick);
        if (e5.fail()) return e5;
        o2 = a3.style.afterBPM || a3.style.beforeBPM;
      }
    }
    if (1 === i2.length) for (let t3 = 0; e3.mixesList.length > t3; t3++) {
      const n3 = e3.mixesList[t3].flatTOList, r3 = n3.length;
      for (let e4 = 0; r3 > e4; e4++) n3[e4].bpm = i2[0].bpm;
    }
    else for (let t3 = 0; e3.mixesList.length > t3; t3++) {
      const n3 = e3.mixesList[t3].flatTOList;
      let r3 = 0;
      const o3 = n3.length;
      for (let e4 = 0; o3 > e4; e4++) {
        const t4 = n3[e4], o4 = i2.length;
        for (let e5 = r3; o4 > e5; e5++) {
          if (e5 === o4 - 1) {
            t4.bpm = i2[e5].bpm;
            break;
          }
          if (t4.bar.startTick >= i2[e5].tick && i2[e5 + 1].tick > t4.bar.startTick) {
            t4.bpm = i2[e5].bpm, r3 = e5;
            break;
          }
        }
      }
    }
    let a2 = 0;
    return e3.mixesList.forEach((e4) => {
      if (e4.flatTOList.length) {
        const t3 = e4.flatTOList[e4.flatTOList.length - 1].bar.stopTick;
        void 0 !== t3 && t3 > a2 && (a2 = t3);
      }
    }), a2 > 0 && i2.push({ tick: a2, bpm: i2[i2.length - 1].bpm, timeMS: -1 }), or();
  }
  static mathBPMTime(e3) {
    const { bpmPosList: t2 } = e3;
    let n2 = 0, i2 = 0;
    for (let e4 = 0; t2.length > e4; e4++) {
      const r2 = t2[e4];
      e4 > 0 && (n2 += 6e4 / (480 * t2[e4 - 1].bpm) * (r2.tick - i2)), t2[e4].timeMS = n2, i2 = r2.tick;
    }
    return or();
  }
}
class Yr {
  static resolve(e3) {
    const { flatTOList: t2 } = e3, n2 = t2.length;
    for (let e4 = 0; n2 > e4; e4++) {
      const n3 = t2[e4], i2 = n3.styles.delay;
      if (i2) {
        const e5 = (n3.bar.stopTick - n3.bar.startTick) / i2.startUntil[1] * i2.startUntil[0];
        n3.bar.fretStartTicks = n3.bar.fretStartTicks.map((t3) => t3 ? n3.bar.startTick + e5 : t3);
      }
    }
    return or();
  }
}
class Qr {
  static resolve(e3, t2) {
    const { flatTOList: n2, regionList: i2 } = t2;
    let r2 = {};
    for (let o2 = 0; n2.length > o2; o2++) {
      const s2 = n2[o2];
      0 === s2.regionNoteIndex && (r2 = i2[s2.regionIndex]);
      const c2 = s2.styles.strum;
      c2 && (o2 += $t(e3, t2, r2, s2, o2, c2).res);
    }
    return or();
  }
}
class Zr {
  static resolve(e3, t2) {
    const { flatTOList: n2 } = t2;
    for (let i2 = 0; n2.length > i2; i2++) {
      const r2 = n2[i2], o2 = r2.styles.slide;
      if (o2) {
        const n3 = At(e3, t2.flatTOList, t2.marks, r2, i2, o2);
        if (n3.fail()) return n3;
      }
    }
    return or();
  }
}
class eo {
  static resolve(e3, t2) {
    const { flatTOList: n2 } = t2;
    for (let i2 = 0; n2.length > i2; i2++) {
      const r2 = n2[i2], o2 = r2.styles.approach;
      if (o2 && 2 !== r2.slideTrueType) {
        const n3 = It(e3, t2.flatTOList, t2.marks, r2, i2, o2);
        if (n3.fail()) return n3;
      }
    }
    return or();
  }
}
class to {
  static resolve(e3) {
    const { flatTOList: t2 } = e3, n2 = t2.length;
    for (let e4 = 0; n2 > e4; e4++) {
      const n3 = t2[e4];
      if (n3.isRest && n3.styles.restNoise) {
        const i2 = Array(n3.tab.length).fill(void 0);
        n3.tab = 0 === e4 ? i2.map(() => 0) : structuredClone(t2[e4].prevTabObj.activeBows), n3.tab.forEach((e5, t3) => {
          void 0 !== e5 && (n3.bar.fretStartTicks[t3] = n3.bar.startTick, n3.bar.fretStopTicks[t3] = n3.bar.startTick + 1);
        });
      }
    }
    return or();
  }
}
class no {
  static resolve(e3) {
    const { flatTOList: t2 } = e3, n2 = t2.length;
    for (let e4 = 0; n2 > e4; e4++) {
      const n3 = t2[e4], i2 = n3.styles.staccato;
      if (i2 && !n3.styles.slide) {
        const e5 = (n3.bar.stopTick - n3.bar.startTick) / i2.cutUntil[1] * i2.cutUntil[0];
        n3.bar.fretStopTicks = n3.bar.fretStopTicks.map((t3) => t3 ? n3.bar.startTick + e5 : t3);
      }
    }
    return or();
  }
}
const io = 409.55;
class ro {
  static resolve(e3) {
    const { flatTOList: t2 } = e3;
    for (let n2 = 0; t2.length > n2; n2++) {
      const i2 = t2[n2], r2 = i2.styles.bd;
      if (r2 && r2.length) {
        const t3 = i2.tab.filter((e4) => void 0 !== e4).length > 0;
        if (!i2.continueX && !t3) continue;
        const n3 = Dt(e3.bendBank, i2, r2);
        if (n3.fail()) return n3;
      }
    }
    return or();
  }
}
class oo {
  static resolve(e3) {
    const { flatTOList: t2 } = e3;
    let n2 = 0, i2 = -1, r2 = [];
    for (let o2 = 0; t2.length > o2; o2++) {
      const s2 = t2[o2];
      if (s2.styles.legato && 0 !== s2.regionNoteIndex) n2 || (r2.push(s2.prevTabObj), i2 = o2 - 1, n2 = 1), r2.push(s2);
      else {
        if (n2) {
          const t3 = Lt(e3, r2, i2);
          if (t3.fail()) return t3;
          r2 = [];
        }
        n2 = 0;
      }
    }
    if (n2) {
      const t3 = Lt(e3, r2, i2);
      if (t3.fail()) return t3;
    }
    return or();
  }
}
class so {
  static compile(e3) {
    const t2 = Hr.resolve(e3);
    if (t2.fail()) return t2;
    if (e3.notStyleCompile) return or();
    const n2 = Hr.mathBPMTime(e3);
    if (n2.fail()) return n2;
    Vr.resolve(e3);
    for (let t3 = 0; e3.mixesList.length > t3; t3++) {
      const n3 = e3.mixesList[t3], i2 = oo.resolve(n3);
      if (i2.fail()) return i2;
      const r2 = no.resolve(n3);
      if (r2.fail()) return r2;
      const o2 = Yr.resolve(n3);
      if (o2.fail()) return o2;
      const s2 = Qr.resolve(e3, n3);
      if (s2.fail()) return s2;
      const c2 = Jr.resolve(n3);
      if (c2.fail()) return c2;
      const a2 = Zr.resolve(e3, n3);
      if (a2.fail()) return a2;
      const u2 = eo.resolve(e3, n3);
      if (u2.fail()) return u2;
      const f2 = to.resolve(n3);
      if (f2.fail()) return f2;
      const l2 = ro.resolve(n3);
      if (l2.fail()) return l2;
    }
    return or();
  }
}
ai = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, ui = {}, fi = {}, Rt.prototype.eof = function() {
  return this.pos >= this.bufferLen;
}, Rt.prototype.readUInt8 = function() {
  var e3 = this.buffer[this.pos];
  return this.pos += 1, e3;
}, Rt.prototype.readInt8 = function() {
  var e3 = this.readUInt8();
  return 128 & e3 ? e3 - 256 : e3;
}, Rt.prototype.readUInt16 = function() {
  return (this.readUInt8() << 8) + this.readUInt8();
}, Rt.prototype.readInt16 = function() {
  var e3 = this.readUInt16();
  return 32768 & e3 ? e3 - 65536 : e3;
}, Rt.prototype.readUInt24 = function() {
  return (this.readUInt8() << 16) + (this.readUInt8() << 8) + this.readUInt8();
}, Rt.prototype.readInt24 = function() {
  var e3 = this.readUInt24();
  return 8388608 & e3 ? e3 - 16777216 : e3;
}, Rt.prototype.readUInt32 = function() {
  return (this.readUInt8() << 24) + (this.readUInt8() << 16) + (this.readUInt8() << 8) + this.readUInt8();
}, Rt.prototype.readBytes = function(e3) {
  var t2 = this.buffer.slice(this.pos, this.pos + e3);
  return this.pos += e3, t2;
}, Rt.prototype.readString = function(e3) {
  var t2 = this.readBytes(e3);
  return String.fromCharCode.apply(null, t2);
}, Rt.prototype.readVarInt = function() {
  for (var e3, t2 = 0; !this.eof(); ) {
    if (!(128 & (e3 = this.readUInt8()))) return t2 + e3;
    t2 += 127 & e3, t2 <<= 7;
  }
  return t2;
}, Rt.prototype.readChunk = function() {
  var e3 = this.readString(4), t2 = this.readUInt32();
  return { id: e3, length: t2, data: this.readBytes(t2) };
}, li = function(e3) {
  var t2, n2, i2, r2, o2, s2 = new Rt(e3), c2 = s2.readChunk();
  if ("MThd" != c2.id) throw "Bad MIDI file.  Expected 'MHdr', got: '" + c2.id + "'";
  for (t2 = function(e4) {
    var t3 = new Rt(e4), n3 = { format: t3.readUInt16(), numTracks: t3.readUInt16() }, i3 = t3.readUInt16();
    return 32768 & i3 ? (n3.framesPerSecond = 256 - (i3 >> 8), n3.ticksPerFrame = 255 & i3) : n3.ticksPerBeat = i3, n3;
  }(c2.data), n2 = [], i2 = 0; !s2.eof() && t2.numTracks > i2; i2++) {
    if ("MTrk" != (r2 = s2.readChunk()).id) throw "Bad MIDI file.  Expected 'MTrk', got: '" + r2.id + "'";
    o2 = Ut(r2.data), n2.push(o2);
  }
  return { header: t2, tracks: n2 };
}, Wt.prototype.writeInt8 = Wt.prototype.writeUInt8 = function(e3) {
  this.buffer.push(255 & e3);
}, Wt.prototype.writeInt16 = Wt.prototype.writeUInt16 = function(e3) {
  var t2 = 255 & e3;
  this.writeUInt8(e3 >> 8 & 255), this.writeUInt8(t2);
}, Wt.prototype.writeInt24 = Wt.prototype.writeUInt24 = function(e3) {
  var t2 = e3 >> 8 & 255, n2 = 255 & e3;
  this.writeUInt8(e3 >> 16 & 255), this.writeUInt8(t2), this.writeUInt8(n2);
}, Wt.prototype.writeInt32 = Wt.prototype.writeUInt32 = function(e3) {
  var t2 = e3 >> 16 & 255, n2 = e3 >> 8 & 255, i2 = 255 & e3;
  this.writeUInt8(e3 >> 24 & 255), this.writeUInt8(t2), this.writeUInt8(n2), this.writeUInt8(i2);
}, Wt.prototype.writeBytes = function(e3) {
  this.buffer = this.buffer.concat([].slice.call(e3, 0));
}, Wt.prototype.writeString = function(e3) {
  var t2, n2 = e3.length, i2 = [];
  for (t2 = 0; n2 > t2; t2++) i2.push(e3.codePointAt(t2));
  this.writeBytes(i2);
}, Wt.prototype.writeVarInt = function(e3) {
  var t2, n2;
  if (0 > e3) throw "Cannot write negative variable-length integer";
  if (e3 > 127) {
    for ((n2 = []).push(127 & (t2 = e3)), t2 >>= 7; t2; ) n2.push(127 & t2 | 128), t2 >>= 7;
    this.writeBytes(n2.reverse());
  } else this.writeUInt8(e3);
}, Wt.prototype.writeChunk = function(e3, t2) {
  this.writeString(e3), this.writeUInt32(t2.length), this.writeBytes(t2);
}, di = function(e3, t2) {
  var n2, i2, r2, o2, s2;
  if ("object" != typeof e3) throw "Invalid MIDI data";
  for (t2 = t2 || {}, n2 = e3.header || {}, o2 = (i2 = e3.tracks || []).length, function(e4, t3, n3) {
    var i3, r3 = null == t3.format ? 1 : t3.format, o3 = 128;
    t3.timeDivision ? o3 = t3.timeDivision : t3.ticksPerFrame && t3.framesPerSecond ? o3 = -(255 & t3.framesPerSecond) << 8 | 255 & t3.ticksPerFrame : t3.ticksPerBeat && (o3 = 32767 & t3.ticksPerBeat), (i3 = new Wt()).writeUInt16(r3), i3.writeUInt16(n3), i3.writeUInt16(o3), e4.writeChunk("MThd", i3.buffer);
  }(s2 = new Wt(), n2, o2), r2 = 0; o2 > r2; r2++) qt(s2, i2[r2], t2);
  return s2.buffer;
}, fi.parseMidi = li, fi.writeMidi = di, mi = {}, Object.defineProperty(hi = {}, "i", { value: 1 }), hi.insert = hi.search = void 0, hi.search = zt, hi.insert = function(e3, t2, n2) {
  if (void 0 === n2 && (n2 = "ticks"), e3.length) {
    var i2 = zt(e3, t2[n2], n2);
    e3.splice(i2 + 1, 0, t2);
  } else e3.push(t2);
}, function(e3) {
  var t2, n2, i2;
  Object.defineProperty(e3, "i", { value: 1 }), e3.Header = e3.keySignatureKeys = void 0, t2 = hi, n2 = /* @__PURE__ */ new WeakMap(), e3.keySignatureKeys = ["Cb", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D", "A", "E", "B", "F#", "C#"], i2 = function() {
    function i3(t3) {
      var i4, r2 = this;
      this.tempos = [], this.timeSignatures = [], this.keySignatures = [], this.meta = [], this.name = "", n2.set(this, 480), t3 && (n2.set(this, t3.header.ticksPerBeat), t3.tracks.forEach(function(t4) {
        t4.forEach(function(t5) {
          t5.meta && ("timeSignature" === t5.type ? r2.timeSignatures.push({ ticks: t5.absoluteTime, timeSignature: [t5.numerator, t5.denominator] }) : "setTempo" === t5.type ? r2.tempos.push({ bpm: 6e7 / t5.microsecondsPerBeat, ticks: t5.absoluteTime }) : "keySignature" === t5.type && r2.keySignatures.push({ key: e3.keySignatureKeys[t5.key + 7], scale: 0 === t5.scale ? "major" : "minor", ticks: t5.absoluteTime }));
        });
      }), i4 = 0, t3.tracks[0].forEach(function(e4) {
        i4 += e4.deltaTime, e4.meta && ("trackName" === e4.type ? r2.name = e4.text : "text" !== e4.type && "cuePoint" !== e4.type && "marker" !== e4.type && "lyrics" !== e4.type || r2.meta.push({ text: e4.text, ticks: i4, type: e4.type }));
      }), this.update());
    }
    return i3.prototype.update = function() {
      var e4 = this, t3 = 0, n3 = 0;
      this.tempos.sort(function(e5, t4) {
        return e5.ticks - t4.ticks;
      }), this.tempos.forEach(function(i4, r2) {
        var o2 = i4.ticks / e4.ppq - n3;
        i4.time = 60 / (r2 > 0 ? e4.tempos[r2 - 1].bpm : e4.tempos[0].bpm) * o2 + t3, t3 = i4.time, n3 += o2;
      }), this.timeSignatures.sort(function(e5, t4) {
        return e5.ticks - t4.ticks;
      }), this.timeSignatures.forEach(function(t4, n4) {
        var i4 = n4 > 0 ? e4.timeSignatures[n4 - 1] : e4.timeSignatures[0], r2 = (t4.ticks - i4.ticks) / e4.ppq / i4.timeSignature[0] / (i4.timeSignature[1] / 4);
        i4.measures = i4.measures || 0, t4.measures = r2 + i4.measures;
      });
    }, i3.prototype.ticksToSeconds = function(e4) {
      var n3, i4 = (0, t2.search)(this.tempos, e4);
      return -1 !== i4 ? (n3 = this.tempos[i4]).time + 60 / n3.bpm * ((e4 - n3.ticks) / this.ppq) : e4 / this.ppq * 0.5;
    }, i3.prototype.ticksToMeasures = function(e4) {
      var n3, i4 = (0, t2.search)(this.timeSignatures, e4);
      return -1 !== i4 ? (n3 = this.timeSignatures[i4]).measures + (e4 - n3.ticks) / this.ppq / (n3.timeSignature[0] / n3.timeSignature[1]) / 4 : e4 / this.ppq / 4;
    }, Object.defineProperty(i3.prototype, "ppq", { get: function() {
      return n2.get(this);
    }, enumerable: 0, configurable: 1 }), i3.prototype.secondsToTicks = function(e4) {
      var n3, i4 = (0, t2.search)(this.tempos, e4, "time");
      return Math.round(-1 !== i4 ? (n3 = this.tempos[i4]).ticks + (e4 - n3.time) / (60 / n3.bpm) * this.ppq : e4 / 0.5 * this.ppq);
    }, i3.prototype.toJSON = function() {
      return { keySignatures: this.keySignatures, meta: this.meta, name: this.name, ppq: this.ppq, tempos: this.tempos.map(function(e4) {
        return { bpm: e4.bpm, ticks: e4.ticks };
      }), timeSignatures: this.timeSignatures };
    }, i3.prototype.fromJSON = function(e4) {
      this.name = e4.name, this.tempos = e4.tempos.map(function(e5) {
        return Object.assign({}, e5);
      }), this.timeSignatures = e4.timeSignatures.map(function(e5) {
        return Object.assign({}, e5);
      }), this.keySignatures = e4.keySignatures.map(function(e5) {
        return Object.assign({}, e5);
      }), this.meta = e4.meta.map(function(e5) {
        return Object.assign({}, e5);
      }), n2.set(this, e4.ppq), this.update();
    }, i3.prototype.setTempo = function(e4) {
      this.tempos = [{ bpm: e4, ticks: 0 }], this.update();
    }, i3;
  }(), e3.Header = i2;
}(mi), vi = {}, function(e3) {
  var t2, n2, i2;
  Object.defineProperty(e3, "i", { value: 1 }), e3.ControlChange = e3.controlChangeIds = e3.controlChangeNames = void 0, e3.controlChangeNames = { 1: "modulationWheel", 2: "breath", 4: "footController", 5: "portamentoTime", 7: "volume", 8: "balance", 10: "pan", 64: "sustain", 65: "portamentoTime", 66: "sostenuto", 67: "softPedal", 68: "legatoFootswitch", 84: "portamentoControl" }, e3.controlChangeIds = Object.keys(e3.controlChangeNames).reduce(function(t3, n3) {
    return t3[e3.controlChangeNames[n3]] = n3, t3;
  }, {}), t2 = /* @__PURE__ */ new WeakMap(), n2 = /* @__PURE__ */ new WeakMap(), i2 = function() {
    function i3(e4, i4) {
      t2.set(this, i4), n2.set(this, e4.controllerType), this.ticks = e4.absoluteTime, this.value = e4.value;
    }
    return Object.defineProperty(i3.prototype, "number", { get: function() {
      return n2.get(this);
    }, enumerable: 0, configurable: 1 }), Object.defineProperty(i3.prototype, "name", { get: function() {
      return e3.controlChangeNames[this.number] ? e3.controlChangeNames[this.number] : null;
    }, enumerable: 0, configurable: 1 }), Object.defineProperty(i3.prototype, "time", { get: function() {
      return t2.get(this).ticksToSeconds(this.ticks);
    }, set: function(e4) {
      var n3 = t2.get(this);
      this.ticks = n3.secondsToTicks(e4);
    }, enumerable: 0, configurable: 1 }), i3.prototype.toJSON = function() {
      return { number: this.number, ticks: this.ticks, time: this.time, value: this.value };
    }, i3;
  }(), e3.ControlChange = i2;
}(bi = {}), Object.defineProperty(pi = {}, "i", { value: 1 }), pi.createControlChanges = void 0, yi = bi, pi.createControlChanges = function() {
  return new Proxy({}, { get: function(e3, t2) {
    return e3[t2] ? e3[t2] : yi.controlChangeIds.hasOwnProperty(t2) ? e3[yi.controlChangeIds[t2]] : void 0;
  }, set: function(e3, t2, n2) {
    return yi.controlChangeIds.hasOwnProperty(t2) ? e3[yi.controlChangeIds[t2]] = n2 : e3[t2] = n2, 1;
  } });
}, Object.defineProperty(wi = {}, "i", { value: 1 }), wi.PitchBend = void 0, Mi = /* @__PURE__ */ new WeakMap(), ki = function() {
  function e3(e4, t2) {
    Mi.set(this, t2), this.ticks = e4.absoluteTime, this.value = e4.value;
  }
  return Object.defineProperty(e3.prototype, "time", { get: function() {
    return Mi.get(this).ticksToSeconds(this.ticks);
  }, set: function(e4) {
    var t2 = Mi.get(this);
    this.ticks = t2.secondsToTicks(e4);
  }, enumerable: 0, configurable: 1 }), e3.prototype.toJSON = function() {
    return { ticks: this.ticks, time: this.time, value: this.value };
  }, e3;
}(), wi.PitchBend = ki, Pi = {}, Object.defineProperty(gi = {}, "i", { value: 1 }), gi.DrumKitByPatchID = gi.InstrumentFamilyByID = gi.instrumentByPatchID = void 0, gi.instrumentByPatchID = ["acoustic grand piano", "bright acoustic piano", "electric grand piano", "honky-tonk piano", "electric piano 1", "electric piano 2", "harpsichord", "clavi", "celesta", "glockenspiel", "music box", "vibraphone", "marimba", "xylophone", "tubular bells", "dulcimer", "drawbar organ", "percussive organ", "rock organ", "church organ", "reed organ", "accordion", "harmonica", "tango accordion", "acoustic guitar (nylon)", "acoustic guitar (steel)", "electric guitar (jazz)", "electric guitar (clean)", "electric guitar (muted)", "overdriven guitar", "distortion guitar", "guitar harmonics", "acoustic bass", "electric bass (finger)", "electric bass (pick)", "fretless bass", "slap bass 1", "slap bass 2", "synth bass 1", "synth bass 2", "violin", "viola", "cello", "contrabass", "tremolo strings", "pizzicato strings", "orchestral harp", "timpani", "string ensemble 1", "string ensemble 2", "synthstrings 1", "synthstrings 2", "choir aahs", "voice oohs", "synth voice", "orchestra hit", "trumpet", "trombone", "tuba", "muted trumpet", "french horn", "brass section", "synthbrass 1", "synthbrass 2", "soprano sax", "alto sax", "tenor sax", "baritone sax", "oboe", "english horn", "bassoon", "clarinet", "piccolo", "flute", "recorder", "pan flute", "blown bottle", "shakuhachi", "whistle", "ocarina", "lead 1 (square)", "lead 2 (sawtooth)", "lead 3 (calliope)", "lead 4 (chiff)", "lead 5 (charang)", "lead 6 (voice)", "lead 7 (fifths)", "lead 8 (bass + lead)", "pad 1 (new age)", "pad 2 (warm)", "pad 3 (polysynth)", "pad 4 (choir)", "pad 5 (bowed)", "pad 6 (metallic)", "pad 7 (halo)", "pad 8 (sweep)", "fx 1 (rain)", "fx 2 (soundtrack)", "fx 3 (crystal)", "fx 4 (atmosphere)", "fx 5 (brightness)", "fx 6 (goblins)", "fx 7 (echoes)", "fx 8 (sci-fi)", "sitar", "banjo", "shamisen", "koto", "kalimba", "bag pipe", "fiddle", "shanai", "tinkle bell", "agogo", "steel drums", "woodblock", "taiko drum", "melodic tom", "synth drum", "reverse cymbal", "guitar fret noise", "breath noise", "seashore", "bird tweet", "telephone ring", "helicopter", "applause", "gunshot"], gi.InstrumentFamilyByID = ["piano", "chromatic percussion", "organ", "guitar", "bass", "strings", "ensemble", "brass", "reed", "pipe", "synth lead", "synth pad", "synth effects", "world", "percussive", "sound effects"], gi.DrumKitByPatchID = { 0: "standard kit", 8: "room kit", 16: "power kit", 24: "electronic kit", 25: "tr-808 kit", 32: "jazz kit", 40: "brush kit", 48: "orchestra kit", 56: "sound fx kit" }, Object.defineProperty(Pi, "i", { value: 1 }), Pi.Instrument = void 0, $i = gi, Ni = /* @__PURE__ */ new WeakMap(), Ai = function() {
  function e3(e4, t2) {
    if (this.number = 0, Ni.set(this, t2), this.number = 0, e4) {
      var n2 = e4.find(function(e5) {
        return "programChange" === e5.type;
      });
      n2 && (this.number = n2.programNumber);
    }
  }
  return Object.defineProperty(e3.prototype, "name", { get: function() {
    return this.percussion ? $i.DrumKitByPatchID[this.number] : $i.instrumentByPatchID[this.number];
  }, set: function(e4) {
    var t2 = $i.instrumentByPatchID.indexOf(e4);
    -1 !== t2 && (this.number = t2);
  }, enumerable: 0, configurable: 1 }), Object.defineProperty(e3.prototype, "family", { get: function() {
    return this.percussion ? "drums" : $i.InstrumentFamilyByID[Math.floor(this.number / 8)];
  }, enumerable: 0, configurable: 1 }), Object.defineProperty(e3.prototype, "percussion", { get: function() {
    return 9 === Ni.get(this).channel;
  }, enumerable: 0, configurable: 1 }), e3.prototype.toJSON = function() {
    return { family: this.family, number: this.number, name: this.name };
  }, e3.prototype.fromJSON = function(e4) {
    this.number = e4.number;
  }, e3;
}(), Pi.Instrument = Ai, Object.defineProperty(Si = {}, "i", { value: 1 }), Si.Note = void 0, Ki = /^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i, Wi = { cbb: -2, cb: -1, c: 0, "c#": 1, cx: 2, dbb: 0, db: 1, d: 2, "d#": 3, dx: 4, ebb: 2, eb: 3, e: 4, "e#": 5, ex: 6, fbb: 3, fb: 4, f: 5, "f#": 6, fx: 7, gbb: 5, gb: 6, g: 7, "g#": 8, gx: 9, abb: 7, ab: 8, a: 9, "a#": 10, ax: 11, bbb: 9, bb: 10, b: 11, "b#": 12, bx: 13 }, xi = function(e3) {
  var t2 = Ki.exec(e3), n2 = t2[2];
  return Wi[t2[1].toLowerCase()] + 12 * (parseInt(n2, 10) + 1);
}, Ii = /* @__PURE__ */ new WeakMap(), Ti = function() {
  function e3(e4, t2, n2) {
    Ii.set(this, n2), this.midi = e4.midi, this.velocity = e4.velocity, this.noteOffVelocity = t2.velocity, this.ticks = e4.ticks, this.durationTicks = t2.ticks - e4.ticks;
  }
  return Object.defineProperty(e3.prototype, "name", { get: function() {
    return t2 = Math.floor((e4 = this.midi) / 12) - 1, Xt(e4) + "" + t2;
    var e4, t2;
  }, set: function(e4) {
    this.midi = xi(e4);
  }, enumerable: 0, configurable: 1 }), Object.defineProperty(e3.prototype, "octave", { get: function() {
    return Math.floor(this.midi / 12) - 1;
  }, set: function(e4) {
    this.midi += 12 * (e4 - this.octave);
  }, enumerable: 0, configurable: 1 }), Object.defineProperty(e3.prototype, "pitch", { get: function() {
    return Xt(this.midi);
  }, set: function(e4) {
    this.midi = 12 * (this.octave + 1) + function(e5) {
      return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].indexOf(e5);
    }(e4);
  }, enumerable: 0, configurable: 1 }), Object.defineProperty(e3.prototype, "duration", { get: function() {
    var e4 = Ii.get(this);
    return e4.ticksToSeconds(this.ticks + this.durationTicks) - e4.ticksToSeconds(this.ticks);
  }, set: function(e4) {
    var t2 = Ii.get(this).secondsToTicks(this.time + e4);
    this.durationTicks = t2 - this.ticks;
  }, enumerable: 0, configurable: 1 }), Object.defineProperty(e3.prototype, "time", { get: function() {
    return Ii.get(this).ticksToSeconds(this.ticks);
  }, set: function(e4) {
    var t2 = Ii.get(this);
    this.ticks = t2.secondsToTicks(e4);
  }, enumerable: 0, configurable: 1 }), Object.defineProperty(e3.prototype, "bars", { get: function() {
    return Ii.get(this).ticksToMeasures(this.ticks);
  }, enumerable: 0, configurable: 1 }), e3.prototype.toJSON = function() {
    return { duration: this.duration, durationTicks: this.durationTicks, midi: this.midi, name: this.name, ticks: this.ticks, time: this.time, velocity: this.velocity };
  }, e3;
}(), Si.Note = Ti, Object.defineProperty(vi, "i", { value: 1 }), vi.Track = void 0, Ci = hi, ji = bi, Oi = pi, Ei = wi, Di = Pi, Bi = Si, Fi = /* @__PURE__ */ new WeakMap(), Li = function() {
  function e3(e4, t2) {
    var n2, i2, r2, o2, s2, c2, a2 = this;
    if (this.name = "", this.notes = [], this.controlChanges = (0, Oi.createControlChanges)(), this.pitchBends = [], Fi.set(this, t2), e4 && (n2 = e4.find(function(e5) {
      return "trackName" === e5.type;
    }), this.name = n2 ? n2.text : ""), this.instrument = new Di.Instrument(e4, this), this.channel = 0, e4) {
      for (i2 = e4.filter(function(e5) {
        return "noteOn" === e5.type;
      }), r2 = e4.filter(function(e5) {
        return "noteOff" === e5.type;
      }), o2 = function() {
        var e5, t3, n3 = i2.shift();
        s2.channel = n3.channel, e5 = r2.findIndex(function(e6) {
          return e6.noteNumber === n3.noteNumber && e6.absoluteTime >= n3.absoluteTime;
        }), -1 !== e5 && (t3 = r2.splice(e5, 1)[0], s2.addNote({ durationTicks: t3.absoluteTime - n3.absoluteTime, midi: n3.noteNumber, noteOffVelocity: t3.velocity / 127, ticks: n3.absoluteTime, velocity: n3.velocity / 127 }));
      }, s2 = this; i2.length; ) o2();
      e4.filter(function(e5) {
        return "controller" === e5.type;
      }).forEach(function(e5) {
        a2.addCC({ number: e5.controllerType, ticks: e5.absoluteTime, value: e5.value / 127 });
      }), e4.filter(function(e5) {
        return "pitchBend" === e5.type;
      }).forEach(function(e5) {
        a2.addPitchBend({ ticks: e5.absoluteTime, value: e5.value / 8192 });
      }), c2 = e4.find(function(e5) {
        return "endOfTrack" === e5.type;
      }), this.endOfTrackTicks = void 0 !== c2 ? c2.absoluteTime : void 0;
    }
  }
  return e3.prototype.addNote = function(e4) {
    var t2 = Fi.get(this), n2 = new Bi.Note({ midi: 0, ticks: 0, velocity: 1 }, { ticks: 0, velocity: 0 }, t2);
    return Object.assign(n2, e4), (0, Ci.insert)(this.notes, n2, "ticks"), this;
  }, e3.prototype.addCC = function(e4) {
    var t2 = Fi.get(this), n2 = new ji.ControlChange({ controllerType: e4.number }, t2);
    return delete e4.number, Object.assign(n2, e4), Array.isArray(this.controlChanges[n2.number]) || (this.controlChanges[n2.number] = []), (0, Ci.insert)(this.controlChanges[n2.number], n2, "ticks"), this;
  }, e3.prototype.addPitchBend = function(e4) {
    var t2 = Fi.get(this), n2 = new Ei.PitchBend({}, t2);
    return Object.assign(n2, e4), (0, Ci.insert)(this.pitchBends, n2, "ticks"), this;
  }, Object.defineProperty(e3.prototype, "duration", { get: function() {
    var e4, t2, n2;
    if (!this.notes.length) return 0;
    for (e4 = this.notes[this.notes.length - 1].time + this.notes[this.notes.length - 1].duration, t2 = 0; this.notes.length - 1 > t2; t2++) (n2 = this.notes[t2].time + this.notes[t2].duration) > e4 && (e4 = n2);
    return e4;
  }, enumerable: 0, configurable: 1 }), Object.defineProperty(e3.prototype, "durationTicks", { get: function() {
    var e4, t2, n2;
    if (!this.notes.length) return 0;
    for (e4 = this.notes[this.notes.length - 1].ticks + this.notes[this.notes.length - 1].durationTicks, t2 = 0; this.notes.length - 1 > t2; t2++) (n2 = this.notes[t2].ticks + this.notes[t2].durationTicks) > e4 && (e4 = n2);
    return e4;
  }, enumerable: 0, configurable: 1 }), e3.prototype.fromJSON = function(e4) {
    var t2, n2 = this;
    for (t2 in this.name = e4.name, this.channel = e4.channel, this.instrument = new Di.Instrument(void 0, this), this.instrument.fromJSON(e4.instrument), void 0 !== e4.endOfTrackTicks && (this.endOfTrackTicks = e4.endOfTrackTicks), e4.controlChanges) e4.controlChanges[t2] && e4.controlChanges[t2].forEach(function(e5) {
      n2.addCC({ number: e5.number, ticks: e5.ticks, value: e5.value });
    });
    e4.notes.forEach(function(e5) {
      n2.addNote({ durationTicks: e5.durationTicks, midi: e5.midi, ticks: e5.ticks, velocity: e5.velocity });
    });
  }, e3.prototype.toJSON = function() {
    var e4, t2, n2 = {};
    for (e4 = 0; 127 > e4; e4++) this.controlChanges.hasOwnProperty(e4) && (n2[e4] = this.controlChanges[e4].map(function(e5) {
      return e5.toJSON();
    }));
    return t2 = { channel: this.channel, controlChanges: n2, pitchBends: this.pitchBends.map(function(e5) {
      return e5.toJSON();
    }), instrument: this.instrument.toJSON(), name: this.name, notes: this.notes.map(function(e5) {
      return e5.toJSON();
    }) }, void 0 !== this.endOfTrackTicks && (t2.endOfTrackTicks = this.endOfTrackTicks), t2;
  }, e3;
}(), vi.Track = Li, Gi = {};
const co = _t(Object.freeze(Object.defineProperty({ __proto__: null, flatten: function(e3) {
  var t2 = [];
  return Vt(e3, t2), t2;
} }, Symbol.toStringTag, { value: "Module" })));
_i = ai && ai.o || function(e3, t2, n2) {
  if (n2 || 2 === arguments.length) for (var i2, r2 = 0, o2 = t2.length; o2 > r2; r2++) !i2 && r2 in t2 || (i2 || (i2 = [].slice.call(t2, 0, r2)), i2[r2] = t2[r2]);
  return e3.concat(i2 || [].slice.call(t2));
}, Object.defineProperty(Gi, "i", { value: 1 }), Gi.encode = void 0, Ui = fi, Ri = mi, qi = co, Gi.encode = function(e3) {
  var t2 = { header: { format: 1, numTracks: e3.tracks.length + 1, ticksPerBeat: e3.header.ppq }, tracks: _i([_i(_i(_i(_i([{ absoluteTime: 0, deltaTime: 0, meta: 1, text: e3.header.name, type: "trackName" }], e3.header.keySignatures.map(function(e4) {
    return function(e5) {
      var t3 = Ri.keySignatureKeys.indexOf(e5.key);
      return { absoluteTime: e5.ticks, deltaTime: 0, key: t3 + 7, meta: 1, scale: "major" === e5.scale ? 0 : 1, type: "keySignature" };
    }(e4);
  }), 1), e3.header.meta.map(function(e4) {
    return { absoluteTime: (t3 = e4).ticks, deltaTime: 0, meta: 1, text: t3.text, type: t3.type };
    var t3;
  }), 1), e3.header.tempos.map(function(e4) {
    return function(e5) {
      return { absoluteTime: e5.ticks, deltaTime: 0, meta: 1, microsecondsPerBeat: Math.floor(6e7 / e5.bpm), type: "setTempo" };
    }(e4);
  }), 1), e3.header.timeSignatures.map(function(e4) {
    return function(e5) {
      return { absoluteTime: e5.ticks, deltaTime: 0, denominator: e5.timeSignature[1], meta: 1, metronome: 24, numerator: e5.timeSignature[0], thirtyseconds: 8, type: "timeSignature" };
    }(e4);
  }), 1)], e3.tracks.map(function(e4) {
    return _i(_i(_i([(t3 = e4.name, { absoluteTime: 0, deltaTime: 0, meta: 1, text: t3, type: "trackName" }), Ht(e4)], function(e5) {
      return (0, qi.flatten)(e5.notes.map(function(t4) {
        return function(e6, t5) {
          return [{ absoluteTime: e6.ticks, channel: t5, deltaTime: 0, noteNumber: e6.midi, type: "noteOn", velocity: Math.floor(127 * e6.velocity) }, { absoluteTime: e6.ticks + e6.durationTicks, channel: t5, deltaTime: 0, noteNumber: e6.midi, type: "noteOff", velocity: Math.floor(127 * e6.noteOffVelocity) }];
        }(t4, e5.channel);
      }));
    }(e4), 1), function(e5) {
      var t4, n2 = [];
      for (t4 = 0; 127 > t4; t4++) e5.controlChanges.hasOwnProperty(t4) && e5.controlChanges[t4].forEach(function(t5) {
        n2.push(Jt(t5, e5.channel));
      });
      return n2;
    }(e4), 1), function(e5) {
      var t4 = [];
      return e5.pitchBends.forEach(function(n2) {
        t4.push(function(e6, t5) {
          return { absoluteTime: e6.ticks, channel: t5, deltaTime: 0, type: "pitchBend", value: e6.value };
        }(n2, e5.channel));
      }), t4;
    }(e4), 1);
    var t3;
  }), 1) };
  return t2.tracks = t2.tracks.map(function(e4) {
    e4 = e4.sort(function(e5, t4) {
      return e5.absoluteTime - t4.absoluteTime;
    });
    var t3 = 0;
    return e4.forEach(function(e5) {
      e5.deltaTime = e5.absoluteTime - t3, t3 = e5.absoluteTime, delete e5.absoluteTime;
    }), e4.push({ deltaTime: 0, meta: 1, type: "endOfTrack" }), e4;
  }), new Uint8Array((0, Ui.writeMidi)(t2));
}, function(e3) {
  var t2, n2, i2, r2, o2, s2, c2, a2 = ai && ai.l || function(e4, t3, n3, i3) {
    return new (n3 || (n3 = Promise))(function(r3, o3) {
      function s3(e5) {
        try {
          a3(i3.next(e5));
        } catch (e6) {
          o3(e6);
        }
      }
      function c3(e5) {
        try {
          a3(i3.throw(e5));
        } catch (e6) {
          o3(e6);
        }
      }
      function a3(e5) {
        var t4;
        e5.done ? r3(e5.value) : (t4 = e5.value, t4 instanceof n3 ? t4 : new n3(function(e6) {
          e6(t4);
        })).then(s3, c3);
      }
      a3((i3 = i3.apply(e4, t3 || [])).next());
    });
  }, u2 = ai && ai.h || function(e4, t3) {
    function n3(n4) {
      return function(s4) {
        return function(n5) {
          if (i3) throw new TypeError("Generator is already executing.");
          for (; c3; ) try {
            if (i3 = 1, r3 && (o3 = 2 & n5[0] ? r3.return : n5[0] ? r3.throw || ((o3 = r3.return) && o3.call(r3), 0) : r3.next) && !(o3 = o3.call(r3, n5[1])).done) return o3;
            switch (r3 = 0, o3 && (n5 = [2 & n5[0], o3.value]), n5[0]) {
              case 0:
              case 1:
                o3 = n5;
                break;
              case 4:
                return c3.label++, { value: n5[1], done: 0 };
              case 5:
                c3.label++, r3 = n5[1], n5 = [0];
                continue;
              case 7:
                n5 = c3.ops.pop(), c3.trys.pop();
                continue;
              default:
                if (!((o3 = (o3 = c3.trys).length > 0 && o3[o3.length - 1]) || 6 !== n5[0] && 2 !== n5[0])) {
                  c3 = 0;
                  continue;
                }
                if (3 === n5[0] && (!o3 || n5[1] > o3[0] && o3[3] > n5[1])) {
                  c3.label = n5[1];
                  break;
                }
                if (6 === n5[0] && o3[1] > c3.label) {
                  c3.label = o3[1], o3 = n5;
                  break;
                }
                if (o3 && o3[2] > c3.label) {
                  c3.label = o3[2], c3.ops.push(n5);
                  break;
                }
                o3[2] && c3.ops.pop(), c3.trys.pop();
                continue;
            }
            n5 = t3.call(e4, c3);
          } catch (e5) {
            n5 = [6, e5], r3 = 0;
          } finally {
            i3 = o3 = 0;
          }
          if (5 & n5[0]) throw n5[1];
          return { value: n5[0] ? n5[1] : void 0, done: 1 };
        }([n4, s4]);
      };
    }
    var i3, r3, o3, s3, c3 = { label: 0, sent: function() {
      if (1 & o3[0]) throw o3[1];
      return o3[1];
    }, trys: [], ops: [] };
    return s3 = { next: n3(0), throw: n3(1), return: n3(2) }, "function" == typeof Symbol && (s3[Symbol.iterator] = function() {
      return this;
    }), s3;
  };
  Object.defineProperty(e3, "i", { value: 1 }), e3.Header = e3.Track = e3.Midi = void 0, t2 = fi, n2 = mi, i2 = vi, r2 = Gi, o2 = function() {
    function e4(e5) {
      var r3, o3 = this, s3 = null;
      e5 && (r3 = e5 instanceof ArrayBuffer ? new Uint8Array(e5) : e5, (s3 = (0, t2.parseMidi)(r3)).tracks.forEach(function(e6) {
        var t3 = 0;
        e6.forEach(function(e7) {
          e7.absoluteTime = t3 += e7.deltaTime;
        });
      }), s3.tracks = function(e6) {
        var t3, n3, i3, r4, o4, s4, c3, a3, u3, f2, l2 = [];
        for (t3 = 0; e6.length > t3; t3++) for (n3 = l2.length, i3 = /* @__PURE__ */ new Map(), r4 = Array(16).fill(0), o4 = 0, s4 = e6[t3]; s4.length > o4; o4++) a3 = n3, void 0 !== (u3 = (c3 = s4[o4]).channel) && ("programChange" === c3.type && (r4[u3] = c3.programNumber), f2 = "".concat(r4[u3], " ").concat(u3), i3.has(f2) ? a3 = i3.get(f2) : i3.set(f2, a3 = n3 + i3.size)), l2[a3] || l2.push([]), l2[a3].push(c3);
        return l2;
      }(s3.tracks)), this.header = new n2.Header(s3), this.tracks = [], e5 && (this.tracks = s3.tracks.map(function(e6) {
        return new i2.Track(e6, o3.header);
      }), 1 === s3.header.format && 0 === this.tracks[0].duration && this.tracks.shift());
    }
    return e4.fromUrl = function(t3) {
      return a2(this, void 0, void 0, function() {
        var n3;
        return u2(this, function(i3) {
          switch (i3.label) {
            case 0:
              return [4, fetch(t3)];
            case 1:
              return (n3 = i3.sent()).ok ? [4, n3.arrayBuffer()] : [3, 3];
            case 2:
              return [2, new e4(i3.sent())];
            case 3:
              throw Error("Could not load '".concat(t3, "'"));
          }
        });
      });
    }, Object.defineProperty(e4.prototype, "name", { get: function() {
      return this.header.name;
    }, set: function(e5) {
      this.header.name = e5;
    }, enumerable: 0, configurable: 1 }), Object.defineProperty(e4.prototype, "duration", { get: function() {
      var e5 = this.tracks.map(function(e6) {
        return e6.duration;
      });
      return Math.max.apply(Math, e5);
    }, enumerable: 0, configurable: 1 }), Object.defineProperty(e4.prototype, "durationTicks", { get: function() {
      var e5 = this.tracks.map(function(e6) {
        return e6.durationTicks;
      });
      return Math.max.apply(Math, e5);
    }, enumerable: 0, configurable: 1 }), e4.prototype.addTrack = function() {
      var e5 = new i2.Track(void 0, this.header);
      return this.tracks.push(e5), e5;
    }, e4.prototype.toArray = function() {
      return (0, r2.encode)(this);
    }, e4.prototype.toJSON = function() {
      return { header: this.header.toJSON(), tracks: this.tracks.map(function(e5) {
        return e5.toJSON();
      }) };
    }, e4.prototype.fromJSON = function(e5) {
      var t3 = this;
      this.header = new n2.Header(), this.header.fromJSON(e5.header), this.tracks = e5.tracks.map(function(e6) {
        var n3 = new i2.Track(void 0, t3.header);
        return n3.fromJSON(e6), n3;
      });
    }, e4.prototype.clone = function() {
      var t3 = new e4();
      return t3.fromJSON(this.toJSON()), t3;
    }, e4;
  }(), e3.Midi = o2, s2 = vi, Object.defineProperty(e3, "Track", { enumerable: 1, get: function() {
    return s2.Track;
  } }), c2 = mi, Object.defineProperty(e3, "Header", { enumerable: 1, get: function() {
    return c2.Header;
  } });
}(ui);
class ao {
  static create(e3, t2, n2) {
    const { regionList: i2, flatTOList: r2, bend: o2 } = n2, s2 = function(e4, t3, n3) {
      const i3 = (e5, n4, i4) => {
        const r3 = t3.addTrack();
        return r3.instrument = { number: e5 }, r3.channel = n4 > 7 ? n4 + 2 : n4, r3.addCC({ number: 10, value: i4, ticks: 0 }), r3;
      };
      return [i3(n3.soundfontProp.normal, e4++, n3.pan), i3(n3.soundfontProp.mute, e4++, n3.pan), i3(n3.soundfontProp.normal, e4++, n3.pan), i3(n3.soundfontProp.mute, e4, n3.pan)];
    }(e3, t2, n2), c2 = s2.map(() => []);
    let a2 = [];
    const u2 = r2.length;
    let f2 = -1;
    for (let e4 = 0; u2 > e4; e4++) {
      const t3 = r2[e4];
      t3.regionIndex !== f2 && (a2 = be(i2[t3.regionIndex].tuning), f2 = t3.regionIndex);
      for (let e5 = 0; i2[t3.regionIndex].tuning.length > e5; e5++) {
        const n3 = t3.tab[e5];
        if (void 0 === n3 || -1 === n3) continue;
        const i3 = t3.bar.fretStartTicks[e5], r3 = t3.bar.fretStopTicks[e5], o3 = r3 - i3, u3 = t3.velocity[e5] / 100, f3 = t3.styles.inst || zi.normal, l2 = void 0 !== t3.styles.bd;
        if (isNaN(i3) || isNaN(r3)) throw "tick is Nan - startTick: " + i3 + ", stopTick: " + r3 + ", fret: " + JSON.stringify(t3.tab[e5]) + ", noteStr: " + t3.noteStr + ", bar: " + JSON.stringify(t3.bar);
        if (1 > o3) continue;
        const d2 = Yt(f3, l2), m2 = 0 === d2.vel ? u3 : 0 > d2.vel ? u3 + d2.vel : d2.vel, h2 = { midi: a2[e5] + n3 + ((t3 == null ? void 0 : t3.tabShift) ? t3.tabShift : 0), velocity: m2, ticks: i3, durationTicks: d2.duration || o3 };
        s2[d2.midiInst].addNote(h2), c2[d2.midiInst].push({ ...h2, stopTick: r3 });
      }
    }
    o2.bendNormalList.forEach((e4) => e4.bend.forEach((t3) => {
      s2[0].addPitchBend({ ticks: t3.tick, value: t3.pitch }), e4.hasMute && s2[1].addPitchBend({ ticks: t3.tick, value: t3.pitch });
    })), o2.bendChannelList.forEach((e4) => e4.bend.forEach((t3) => {
      s2[2].addPitchBend({ ticks: t3.tick, value: t3.pitch }), e4.hasMute && s2[3].addPitchBend({ ticks: t3.tick, value: t3.pitch });
    }));
  }
}
class uo {
  static build(e3, t2, n2) {
    const i2 = new ui.Midi();
    n2.length && function(e4, t3) {
      const n3 = t3.addTrack();
      n3.channel = 9, n3.instrument = { number: 115 }, e4.forEach((e5) => {
        n3.addNote({ durationTicks: 2, midi: e5.inst, velocity: e5.velocity, ticks: e5.startTick });
      });
    }(n2, i2);
    for (let t3 = 0; e3.length > t3; t3++) ao.create(4 * t3, i2, e3[t3]);
    t2.forEach((e4) => {
      i2.header.tempos.push({ bpm: e4.bpm, ticks: e4.tick });
    });
    const r2 = [];
    for (let e4 = 0; i2.tracks.length > e4; e4++) {
      const t3 = i2.tracks[e4];
      t3.notes.length && r2.push(t3);
    }
    return i2.tracks = r2, new ir(i2);
  }
}
class fo {
  static convert(e3, t2, n2, i2, r2) {
    const o2 = { syntax: e3 + "\n", settings: {}, regionLength: 0, bpmPosList: [], clickPointList: [], flash: { click: [], offset: {}, other: [] }, dic: { chord: n2, mapSeed: i2 }, mixesList: [0, 1, 2].map((e4) => ({ dualId: e4, regionList: [], flatTOList: [], bendBank: { bendChannelList: [], bendNormalList: [] }, marks: { styleMappedGroupList: [], fullNoteIndexWithTick: [], bendGroupNumberList: [], usedBendRange: [] }, view: { bend: [] } })), warnings: [], extensionInfo: { stepInfoList: [] }, locationInfoList: [], braceLocationInfoList: [], styleObjectBank: {}, allowAnnotations: t2 };
    return r2 && (o2.notStyleCompile = 1), function(e4) {
      !function(e5) {
        e5.syntax = e5.syntax.replace(/\/\/.*$/gm, "").replace(/\/\*([\s\S]*?)\*\//gm, (e6) => e6.replace(/[^\n]/g, " ")).replace(/__end__.*$/gs, "");
      }(e4);
      const t3 = new zr().resolve(e4);
      if (t3.fail()) return t3;
      !function(e5) {
        e5.syntax = e5.syntax.replace(/^([\s\S]*?)__start__/gs, (e6) => e6.replace(/[^\n]/g, " "));
      }(e4);
      const n3 = Xr.as(e4);
      if (n3.fail()) return n3;
      const i3 = qr.compile(e4, n3.res);
      if (i3.fail()) return i3;
      const r3 = so.compile(e4);
      return r3.fail() ? r3 : new ir(e4);
    }(o2);
  }
  static convertToObj(e3, t2, n2, i2, r2, o2) {
    const s2 = (/* @__PURE__ */ new Date()).getTime(), c2 = this.convert(n2, i2, r2, o2, !e3);
    if (c2.fail()) {
      const t3 = { id: e3 ? 1 : 0, error: { message: c2.message, line: c2.line, linePos: c2.linePos, token: c2.token }, response: null };
      return e3 && (t3.midiRequest = 1), t3;
    }
    if (c2.res.dic = null, c2.res.mixesList.forEach((e4) => {
      e4.flatTOList.forEach((e5) => {
        e5.prevTabObj = void 0, e5.nextTabObj = void 0, e5.refActiveBows = void 0, e5.refMovedSlideTarget = void 0;
      });
    }), e3) {
      const e4 = t2 ? (a2 = c2.res, uo.build([0, 1, 2].map((e5) => ({ regionList: a2.mixesList[e5].regionList, flatTOList: a2.mixesList[e5].flatTOList, pan: a2.settings.dual.panning[e5] >= 0 && a2.settings.dual.pan ? a2.settings.dual.panning[e5] : 0.5, soundfontProp: { normal: 24, mute: 28 }, bend: a2.mixesList[e5].bendBank })), a2.bpmPosList, a2.clickPointList)) : null;
      return e4 && e4.fail() ? { id: 1, error: e4, response: null, midiRequest: 1 } : { id: 1, error: null, response: c2.res, midi: e4 ? e4.res.toArray().buffer : null, midiRequest: 1, compileMsec: (/* @__PURE__ */ new Date()).getTime() - s2 };
    }
    return c2.res.syntax = "", { id: 0, error: null, response: c2.res, compileMsec: (/* @__PURE__ */ new Date()).getTime() - s2 };
    var a2;
  }
}
export {
  nr as ApiSuccess,
  Ir as Base12Sym,
  Vi as BendCurveX,
  Ji as BendMethod,
  Xi as BendMethodX,
  Hi as BendSpeed,
  An as CSymbolType,
  fo as Conductor,
  cr as E400,
  ar as E401,
  ur as E403,
  fr as E404,
  lr as E405,
  dr as E409,
  mr as E418,
  hr as E422,
  vr as E429,
  br as E500,
  zi as ESInst,
  sr as ErrorBase,
  Yi as MapOpt,
  Qi as MapOptKeys,
  pr as QE400,
  yr as QE401,
  wr as QE403,
  Mr as QE404,
  kr as QE409,
  Pr as QE429,
  gr as QE500,
  Sr as ScaleNameKeys,
  ir as Success,
  Zi as SysSettings,
  tr as XCommonUtils,
  Or as XTickUtils,
  tr as XUtils,
  Et as bdView,
  xt as inView,
  or as simpleSuccess,
  Nt as toView,
  be as tuningToStringPitch
};
