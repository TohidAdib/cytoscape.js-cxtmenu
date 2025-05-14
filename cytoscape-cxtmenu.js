!function (e, t) {
    'object' == typeof exports && 'object' == typeof module ? module.exports = t() : 'function' == typeof define && define.amd ? define([], t) : 'object' == typeof exports ? exports.cytoscapeCxtmenu = t() : e.cytoscapeCxtmenu = t();
}(self, (() => {
    return e = {
        299: e => {
            e.exports = {
                menuRadius: 256,
                selector: 'node',
                commands: [],
                fillColor: 'rgba(17,20,24,0.7)',
                activeFillColor: 'rgba(95, 107, 124, 0.7)',
                activePadding: 0,
                indicatorSize: 0,
                separatorWidth: 1,
                separatorHoveredCommandsWidth: 4.3,
                separatorColor: '#000',
                spotlightPadding: 4,
                minSpotlightRadius: 102.5,
                maxSpotlightRadius: 102.5,
                openMenuEvents: 'cxttap',
                itemColor: 'white',
                itemTextShadowColor: 'transparent',
                zIndex: 9999,
                atMouse: !1,
            };
        }, 343: (e, t, n) => {
            const o = n(299), i = n(432), {
                removeEles: a,
                setStyles: l,
                createElement: r,
                getPixelRatio: s,
                getOffset: d,
                createArc: c,
                clearArc: u,
                createLine: h,
                clearArcWithStroke: p,
                createArcWithStroke: m,
                clearLine: x,
                createRect: g,
                clearRect: f,
            } = n(974);
            e.exports = function (e) {
                const t = Math.PI / 3;
                let n, y, b, P, v = i({}, o, e), M = this, C = M.container(),
                    w = { options: v, handlers: [], container: r({ class: 'cxtmenu' }) }, S = w.container, I = r(),
                    E = r({ tag: 'canvas' }), T = [], R = [], z = E.getContext('2d'), L = v.menuRadius,
                    O = 2 * (L + v.activePadding) + 2 * L;

                function k(e) {
                    V.drawBg = [e];
                }

                function W(e) {
                    e = void 0 !== e ? e : Z, z.globalCompositeOperation = 'source-over', z.clearRect(0, 0, O, O);
                    let n = 2 * Math.PI / T.length, o = t, i = o + n;
                    for (let e of T) {
                        c(z, {
                            x: 2 * L + v.activePadding,
                            y: 2 * L + v.activePadding,
                        }, L, 2 * Math.PI - o, 2 * Math.PI - i, e.fillColor ? e.fillColor : v.fillColor), o += n, i += n;
                    }
                    !function (e = 0, n = 0) {
                        let o = 2 * Math.PI / T.length, i = t + n, a = i + o;
                        for (let t = 0; t < T.length; t++) {
                            if (t === y) {
                                i += o, a += o;
                                continue;
                            }
                            let n = (i + a) / 2, l = .66 * (L + e) * Math.cos(n), r = .66 * (L + e) * Math.sin(n),
                                s = document.getElementById(`command-${t}`);
                            s && (s.style.marginLeft = l - .33 * L + 'px', s.style.marginTop = -r - .33 * L + 'px'), i += o, a += o;
                        }
                    }(10);
                    const a = v.separatorColor ? v.separatorColor : 'white',
                        l = v.separatorWidth ? v.separatorWidth : 1;
                    o = t, i = o + n;
                    for (let e = 0; e < T.length; e++) {
                        let e = L * Math.cos(o), t = L * Math.sin(o);
                        h(z, {
                            x: 2 * L + v.activePadding,
                            y: 2 * L + v.activePadding,
                        }, { x: 2 * L + v.activePadding + e, y: 2 * L + v.activePadding - t }, l, a), o += n, i += n;
                    }
                    c(z, {
                        x: 2 * L + v.activePadding,
                        y: 2 * L + v.activePadding,
                    }, e + v.spotlightPadding, 0, 2 * Math.PI, 'white'), u(z, {
                        x: 2 * L + v.activePadding,
                        y: 2 * L + v.activePadding,
                    }, e + v.spotlightPadding, 0, 2 * Math.PI);
                }

                function A(e, n, o) {
                    const i = 2 * L + v.activePadding, a = 2 * L + v.activePadding, l = 2 * Math.PI / T.length,
                        r = t + l * y, s = r + l, d = 2 * Math.PI - r, h = 2 * Math.PI - s;
                    u(z, { x: i, y: a }, L + v.activePadding, d, h), $(40), u(z, {
                        x: i,
                        y: a,
                    }, L + 11, d, h), c(z, { x: i, y: a }, L + 10, d, h, v.activeFillColor), c(z, {
                        x: i,
                        y: a,
                    }, L / 2 - 5, d, h, 'white'), u(z, { x: i, y: a }, L / 2 - 5, d, h);
                    const p = L + 10, m = i + p * Math.cos(d), g = a + p * Math.sin(d), b = i + p * Math.cos(h),
                        P = a + p * Math.sin(h);
                    x(z, { x: i, y: a }, { x: m, y: g }, v.separatorHoveredCommandsWidth, '', !1), x(z, {
                        x: i,
                        y: a,
                    }, { x: b, y: P }, v.separatorHoveredCommandsWidth, '', !1);
                    const M = Z + v.spotlightPadding - v.indicatorSize / 4, C = i + e / L * M, w = a + n / L * M,
                        S = Math.PI / 4 - o;
                    f(z, { x: -v.indicatorSize / 2, y: -v.indicatorSize / 2 }, v.indicatorSize, v.indicatorSize, {
                        x: C,
                        y: w,
                    }, S, ''), u(z, { x: i, y: a }, Z + v.spotlightPadding, 0, 2 * Math.PI, !1, !0, !1);
                }

                function B(e, t, n) {
                    V.drawSubmenuBg = [e, t, n];
                }

                function F(e, n, o) {
                    const i = 2 * L + v.activePadding, a = 2 * L + v.activePadding, l = 2 * Math.PI / T.length,
                        r = l / R.length;
                    let s = t + l * y, d = s + l;
                    const f = L + 10, b = 2 * Math.PI - s, P = 2 * Math.PI - d;
                    u(z, { x: i, y: a }, f, b, P), c(z, { x: i, y: a }, f, b, P, v.activeFillColor), c(z, {
                        x: i,
                        y: a,
                    }, L / 2 - 5, b, P, 'white'), $(40), u(z, { x: i, y: a }, L / 2 - 5, b, P);
                    const M = i + f * Math.cos(b), C = a + f * Math.sin(b), w = i + f * Math.cos(P),
                        S = a + f * Math.sin(P);
                    x(z, { x: i, y: a }, { x: M, y: C }, v.separatorHoveredCommandsWidth, '', !1), x(z, {
                        x: i,
                        y: a,
                    }, { x: w, y: S }, v.separatorHoveredCommandsWidth, '', !1);
                    const I = i + e / L * (Z + v.spotlightPadding - v.indicatorSize / 4),
                        E = a + n / L * (Z + v.spotlightPadding - v.indicatorSize / 4), O = Math.PI / 4 - o;
                    z.globalCompositeOperation = 'destination-out', g(z, {
                        x: -v.indicatorSize / 2,
                        y: -v.indicatorSize / 2,
                    }, v.indicatorSize, v.indicatorSize, { x: I, y: E }, O, 'white'), c(z, {
                        x: i,
                        y: a,
                    }, Z + v.spotlightPadding, 0, 2 * Math.PI, 'white', !0, !0, !1);
                    const k = L, W = 1.55 * L, A = (W + k) / 2 + 15, B = 2 * Math.PI - s + .08,
                        F = 2 * Math.PI - d - .08;
                    p(z, { x: i, y: a }, A, W - k, B, F), m(z, { x: i, y: a }, A, W - k, B, F, v.fillColor);
                    let H = t + l * y;
                    const j = A - (W - k) / 2, q = A + (W - k) / 2;
                    for (let e = 1; e < R.length; e++) {
                        H += r;
                        const e = 2 * Math.PI - H, t = i + j * Math.cos(e), n = a + j * Math.sin(e),
                            o = i + q * Math.cos(e), l = a + q * Math.sin(e), s = v.separatorWidth || 1,
                            d = v.separatorColor || 'white';
                        h(z, { x: t, y: n }, { x: o, y: l }, s, d, !1);
                    }
                }

                function H() {
                    z.globalCompositeOperation = 'source-over';
                    const e = 2 * Math.PI / T.length, n = e / R.length;
                    let o = t + e * y + n * b, i = o + n;
                    const a = 2 * L + v.activePadding, l = 2 * L + v.activePadding, r = L, s = 1.55 * L;
                    let d = 2 * Math.PI - o, c = 2 * Math.PI - i;
                    0 === b ? d += .08 : b === R.length - 1 && (c -= .08);
                    let u = R[b]?.fillColor || v.activeFillColor;
                    p(z, { x: a, y: l }, (s + r) / 2 + 15, s - r, d, c), m(z, {
                        x: a,
                        y: l,
                    }, (s + r) / 2 + 15, s - r, d, c, u);
                }

                function $(e = 0, n = 0) {
                    const o = 2 * Math.PI / T.length, i = t + n + o * y, a = (i + (i + o)) / 2,
                        l = .66 * (L + e) * Math.cos(a), r = .66 * (L + e) * Math.sin(a),
                        s = document.getElementById(`command-${y}`);
                    s && (s.style.marginLeft = l - .33 * L + 'px', s.style.marginTop = -r - .33 * L + 'px');
                }

                function j() {
                    let e = s(), t = O, n = O;
                    E.width = t * e, E.height = n * e, E.style.width = t + 'px', E.style.height = n + 'px', z.setTransform(1, 0, 0, 1, 0, 0), z.scale(e, e);
                }

                C.insertBefore(S, C.firstChild), S.appendChild(I), I.appendChild(E), l(S, {
                    position: 'absolute',
                    marginLeft: -O / 4 + 'px',
                    marginTop: -O / 4 + 'px',
                    zIndex: v.zIndex,
                    userSelect: 'none',
                    pointerEvents: 'none',
                }), ['mousedown', 'mousemove', 'mouseup', 'contextmenu'].forEach((e => {
                    S.addEventListener(e, (e => (e.preventDefault(), !1)));
                })), l(I, {
                    display: 'none',
                    width: O + 'px',
                    height: O + 'px',
                    position: 'absolute',
                    zIndex: 1,
                    marginLeft: -v.activePadding + 'px',
                    marginTop: -v.activePadding + 'px',
                    userSelect: 'none',
                }), E.width = O, E.height = O;
                let q, N, Z, G = !0, V = {},
                    X = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || (e => setTimeout(e, 16)),
                    Y = () => {
                        V.drawBg && W.apply(null, V.drawBg), V.drawCommands && A.apply(null, V.drawCommands), V.drawSubmenuBg && F.apply(null, V.drawSubmenuBg), V.drawSubmenuCommands && H.apply(null, V.drawSubmenuCommands), V = {}, G && X(Y);
                    };
                j(), Y();
                let D = {
                    on: function (e, t, n) {
                        let o = n;
                        return 'core' === t && (o = function (e) {
                            if (e.cyTarget === M || e.target === M) {
                                return n.apply(this, [e]);
                            }
                        }), w.handlers.push({
                            events: e,
                            selector: t,
                            fn: o,
                        }), 'core' === t ? M.on(e, o) : M.on(e, t, o), this;
                    },
                };

                function J() {
                    y = void 0, b = void 0;
                }

                function K(e) {
                    let t = document.getElementsByClassName(`cxtmenu-${e}-submenu-content`);
                    for (let e of t) {
                        l(e, { display: 'table-cell' });
                    }
                }

                return function () {
                    let e, o, i, s, c, u = !1, h = () => {
                        e && n.grabify(), o && M.userZoomingEnabled(!0), i && M.userPanningEnabled(!0), s && M.boxSelectionEnabled(!0);
                    };
                    window.addEventListener('resize', j), D.on('resize', (() => {
                        j();
                    })).on(v.openMenuEvents, v.selector, (function (p) {
                        n = this;
                        let m = this, x = this === M;
                        if (u && (I.style.display = 'none', u = !1, h()), 'function' == typeof v.commands) {
                            const e = v.commands(n);
                            e.then ? e.then((e => {
                                T = e, g();
                            })) : (T = e, g());
                        } else {
                            T = v.commands, g();
                        }

                        function g() {
                            if (!T || 0 === T.length) {
                                return;
                            }
                            let h, g, f;
                            o = M.userZoomingEnabled(), M.userZoomingEnabled(!1), i = M.userPanningEnabled(), M.userPanningEnabled(!1), s = M.boxSelectionEnabled(), M.boxSelectionEnabled(!1), e = n.grabbable && n.grabbable(), e && n.ungrabify(), x || !m.isNode() || m.isParent() || v.atMouse ? (h = p.renderedPosition || p.cyRenderedPosition, g = 1, f = 1) : (h = m.renderedPosition(), g = m.renderedWidth(), f = m.renderedHeight()), P = d(C), q = h.x, N = h.y, function () {
                                a('.cxtmenu-item', I);
                                let e = 2 * Math.PI / T.length, n = t, o = n + e;
                                for (let t = 0; t < T.length; t++) {
                                    let i = T[t], a = (n + o) / 2, s = .66 * (L + 10) * Math.cos(a),
                                        d = .66 * (L + 10) * Math.sin(a), c = document.createElement('div');
                                    c.className = 'cxtmenu-item', c.id = `command-${t}`, l(c, {
                                        color: v.itemColor,
                                        cursor: 'default',
                                        display: 'table',
                                        'text-align': 'center',
                                        position: 'absolute',
                                        'text-shadow': '-1px -1px 2px ' + v.itemTextShadowColor + ', 1px -1px 2px ' + v.itemTextShadowColor + ', -1px 1px 2px ' + v.itemTextShadowColor + ', 1px 1px 1px ' + v.itemTextShadowColor,
                                        left: '50%',
                                        top: '50%',
                                        'min-height': .66 * L + 'px',
                                        width: .66 * L + 'px',
                                        height: .66 * L + 'px',
                                        marginLeft: s - .33 * L + 'px',
                                        marginTop: -d - .33 * L + 'px',
                                    });
                                    let u = r({ class: 'cxtmenu-content' });
                                    i.content instanceof HTMLElement || i.content instanceof SVGElement ? u.appendChild(i.content) : u.innerHTML = i.content, l(u, {
                                        width: .66 * L + 'px',
                                        height: .66 * L + 'px',
                                        'vertical-align': 'middle',
                                        display: 'table-cell',
                                    }), l(u, i.contentStyle || {}), !1 === i.enabled && u.setAttribute('class', 'cxtmenu-content cxtmenu-disabled'), I.appendChild(c), c.appendChild(u), n += e, o += e;
                                }
                            }(), function () {
                                let e = 2 * Math.PI / T.length, n = t, o = n + e;
                                for (let t = 0; t < T.length; t++) {
                                    let i = T[t];
                                    if (i.submenu) {
                                        let a = e / i.submenu.length;
                                        o = n + a;
                                        let s = 1.33 * L;
                                        for (let e = 0; e < i.submenu.length; e++) {
                                            let d = i.submenu[e], c = (n + o) / 2, u = s * Math.cos(c),
                                                h = s * Math.sin(c), p = r({ class: 'cxtmenu-item' });
                                            const m = 1.5 * L - L;
                                            let x = u - m / 2, g = -h - m / 2;
                                            l(p, {
                                                color: v.itemColor,
                                                cursor: 'default',
                                                display: 'table',
                                                'text-align': 'center',
                                                position: 'absolute',
                                                'text-shadow': `-1px -1px 2px ${v.itemTextShadowColor}, 1px -1px 2px ${v.itemTextShadowColor}, -1px 1px 2px ${v.itemTextShadowColor}, 1px 1px 1px ${v.itemTextShadowColor}`,
                                                left: '50%',
                                                top: '50%',
                                                'min-height': m + 'px',
                                                width: m + 'px',
                                                height: m + 'px',
                                                marginLeft: x + 'px',
                                                marginTop: g + 'px',
                                                'transform-origin': 'center center',
                                            });
                                            let f = r({ class: `cxtmenu-content cxtmenu-submenu-content cxtmenu-${t}-submenu-content` });
                                            d.content instanceof HTMLElement || d.content instanceof SVGElement ? f.appendChild(d.content) : f.innerHTML = d.content, l(f, {
                                                width: m + 'px',
                                                height: m + 'px',
                                                'vertical-align': 'middle',
                                                display: 'none',
                                            }), l(f, i.contentStyle || {}), !1 === d.enabled && f.setAttribute('class', `cxtmenu-content cxtmenu-submenu-content cxtmenu-${t}-submenu-content cxtmenu-disabled`), I.appendChild(p), p.appendChild(f), n += a, o += a;
                                        }
                                    } else {
                                        n += e, o += e;
                                    }
                                }
                            }(), l(I, {
                                display: 'block',
                                left: h.x - L + 'px',
                                top: h.y - L + 'px',
                            }), Z = Math.max(g, f) / 2, Z = Math.max(Z, v.minSpotlightRadius), Z = Math.min(Z, v.maxSpotlightRadius), k(), y = void 0, u = !0, c = p;
                        }
                    })).on('cxtdrag tapdrag', v.selector = e => {
                        if (!u) {
                            return;
                        }
                        let n = e.originalEvent, o = n.touches && n.touches.length > 0,
                            i = o ? n.touches[0].pageX : n.pageX, a = o ? n.touches[0].pageY : n.pageY;
                        y = void 0;
                        let r = i - P.left - q, s = a - P.top - N;
                        0 === r && (r = .01);
                        let d = Math.sqrt(r * r + s * s), c = (s * s - d * d - r * r) / (-2 * d * r), h = Math.acos(c),
                            p = r * L / d, m = s * L / d;
                        s > 0 && (h = Math.PI + Math.abs(h - Math.PI));
                        let x = 2 * Math.PI / T.length, g = t, f = g + x;
                        for (let e = 0; e < T.length; e++) {
                            let t = T[e];
                            R = t.submenu ? t.submenu : [];
                            let n = g <= h && h <= f || g <= h + 2 * Math.PI && h + 2 * Math.PI <= f;
                            if (!1 === t.enabled && (n = !1), n) {
                                y = e;
                                break;
                            }
                            g += x, f += x;
                        }
                        if (function () {
                            let e = document.getElementsByClassName('cxtmenu-submenu-content');
                            for (let t of e) {
                                l(t, { display: 'none' });
                            }
                        }(), void 0 !== T[y]) {
                            if (d < Z + v.spotlightPadding || d > v.menuRadius && !T[y].submenu) {
                                return k(), void J();
                            }
                            if (d > Z + v.spotlightPadding && d < v.menuRadius) {
                                return k(), void (T[y].submenu ? (K(y), B(p, m, h)) : function (e, t, n) {
                                    V.drawCommands = [e, t, n];
                                }(p, m, h));
                            }
                            if (d < 2 * v.menuRadius && d > v.menuRadius && T[y].submenu) {
                                K(y), R = T[y].submenu, k();
                                let e = x / R.length, n = t, o = n + e;
                                n += x * y, o += x * y;
                                for (let t = 0; t < R.length; t++) {
                                    let i = T[y].submenu[t],
                                        a = n <= h && h <= o || n <= h + 2 * Math.PI && h + 2 * Math.PI <= o;
                                    if (!1 === i.enabled && (a = !1, b = void 0), a) {
                                        b = t;
                                        break;
                                    }
                                    n += e, o += e;
                                }
                                return B(p, m, h), void (V.drawSubmenuCommands = []);
                            }
                        }
                        J(), k();
                    }).on('cxttapend tapend', (function () {
                        if (I.style.display = 'none', void 0 !== y) {
                            let e = T[y].select;
                            e ? (e.apply(n, [n, c]), y = void 0) : T[y].submenu && void 0 !== b && (T[y].submenu[b].select.apply(n, [n, c]), y = void 0, b = void 0);
                        }
                        u = !1, h();
                    }));
                }(), {
                    destroy: () => (G = !1, function () {
                        for (let e of w.handlers) {
                            'core' === e.selector ? M.off(e.events, e.fn) : M.off(e.events, e.selector, e.fn);
                        }
                        window.removeEventListener('resize', j);
                    }(), void S.remove()),
                };
            };
        }, 432: e => {
            e.exports = null != Object.assign ? Object.assign.bind(Object) : function (e, ...t) {
                return t.filter((e => null != e)).forEach((t => {
                    Object.keys(t).forEach((n => e[n] = t[n]));
                })), e;
            };
        }, 497: (e, t, n) => {
            const o = n(343);
            let i = function (e) {
                e && e('core', 'cxtmenu', o);
            };
            'undefined' != typeof cytoscape && i(cytoscape), e.exports = i;
        }, 974: e => {
            const t = function (e, t) {
                let n = Object.keys(t);
                for (let o = 0, i = n.length; o < i; o++) {
                    e.style[n[o]] = t[n[o]];
                }
            }, n = function (e, t, n, o = 1, i = 'black', a = !0) {
                e.strokeStyle = i, e.lineWidth = o, e.beginPath(), e.moveTo(t.x, t.y), e.lineTo(n.x, n.y), e.stroke(), a && e.closePath();
            };
            e.exports = {
                removeEles: function (e, t = document) {
                    let n = t.querySelectorAll(e);
                    for (let e = 0; e < n.length; e++) {
                        let t = n[e];
                        t.parentNode.removeChild(t);
                    }
                }, setStyles: t, createElement: function (e) {
                    e = e || {};
                    let n = document.createElement(e.tag || 'div');
                    return n.className = e.class || '', e.style && t(n, e.style), n;
                }, getPixelRatio: function () {
                    return window.devicePixelRatio || 1;
                }, getOffset: function (e) {
                    let t = e.getBoundingClientRect();
                    return {
                        left: t.left + document.body.scrollLeft + parseFloat(getComputedStyle(document.body)['padding-left']) + parseFloat(getComputedStyle(document.body)['border-left-width']),
                        top: t.top + document.body.scrollTop + parseFloat(getComputedStyle(document.body)['padding-top']) + parseFloat(getComputedStyle(document.body)['border-top-width']),
                    };
                }, createArc: function (e, t, n, o, i, a = '', l = !0, r = !0, s = !0) {
                    e.beginPath(), s && e.moveTo(t.x, t.y), e.arc(t.x, t.y, n, o, i, l), a && (e.fillStyle = a, e.fill()), r && e.closePath();
                }, clearArc: function (e, t, n, o, i, a = !0, l = !0, r = !0) {
                    e.globalCompositeOperation = 'destination-out', e.beginPath(), r && e.moveTo(t.x, t.y), e.arc(t.x, t.y, n, o, i, a), l && e.closePath(), e.fill(), e.globalCompositeOperation = 'source-over';
                }, createLine: n, clearLine: function (e, t, o, i = 1, a = 'black', l = !0) {
                    e.globalCompositeOperation = 'destination-out', n(e, t, o, i, a, l), e.globalCompositeOperation = 'source-over';
                }, clearArcWithStroke: function (e, t, n, o, i, a, l = !0, r = !0) {
                    e.globalCompositeOperation = 'destination-out', e.lineWidth = o, e.beginPath(), e.arc(t.x, t.y, n, i, a, l), e.stroke(), r && e.closePath(), e.globalCompositeOperation = 'source-over';
                }, createArcWithStroke: function (e, t, n, o, i, a, l, r = !0, s = !0) {
                    e.strokeStyle = l, e.lineWidth = o, e.beginPath(), e.arc(t.x, t.y, n, i, a, r), e.stroke(), s && e.closePath();
                }, clearRect: function (e, t, n, o, i, a, l) {
                    e.globalCompositeOperation = 'destination-out', e.fillStyle = l, e.translate(i.x, i.y), e.rotate(a), e.beginPath(), e.fillRect(t.x, t.y, n, o), e.closePath(), e.fill(), e.rotate(-a), e.translate(-i.x, -i.y), e.globalCompositeOperation = "source-over"
                }, createRect: function (e, t, n, o, i, a, l) {
                    e.fillStyle = l, e.translate(i.x, i.y), e.rotate(a), e.beginPath(), e.fillRect(t.x, t.y, n, o), e.closePath(), e.fill(), e.rotate(-a), e.translate(-i.x, -i.y)
                }
            }
        }
    }, t = {}, function n(o) {
        var i = t[o];
        if (void 0 !== i) {
            return i.exports;
        }
        var a = t[o] = { exports: {} };
        return e[o](a, a.exports, n), a.exports
    }(497);
    var e, t
}));