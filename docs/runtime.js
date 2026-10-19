/* Baille — runtime standalone.
   Renderiza as telas (templates com {{...}}, sc-if, sc-for, dc-import) usando Preact
   e navega entre elas como um app de uma página só. */
(function () {
  'use strict';
  var P = window.preact, h = P.h;
  var PAGES = window.__PAGES || {};
  var BOOL = { disabled: 1, checked: 1, readonly: 1, multiple: 1, selected: 1, autofocus: 1, hidden: 1, required: 1 };

  /* ---------- compilação dos templates ---------- */
  function parts(str) {
    var out = [], re = /\{\{\s*([^}]*?)\s*\}\}/g, last = 0, m;
    while ((m = re.exec(str))) { if (m.index > last) out.push(str.slice(last, m.index)); out.push({ e: m[1] }); last = re.lastIndex; }
    if (last < str.length) out.push(str.slice(last));
    return out;
  }
  function camel(s) { return s.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); }); }
  function compileNode(n) {
    if (n.nodeType === 3) { var t = n.nodeValue; return t ? { k: 'x', p: parts(t) } : null; }
    if (n.nodeType !== 1) return null;
    var tag = n.localName;
    if (tag === 'helmet') return null;
    var attrs = [];
    for (var i = 0; i < n.attributes.length; i++) {
      var a = n.attributes[i];
      if (a.name.indexOf('hint-') === 0) continue;
      attrs.push([a.name, parts(a.value), a.value]);
    }
    var kids = compileKids(n.localName === 'template' ? n.content : n);
    if (tag === 'sc-if') return { k: 'if', v: attr(attrs, 'value'), c: kids };
    if (tag === 'sc-for') return { k: 'for', v: attr(attrs, 'list'), as: (attrs.filter(function (a) { return a[0] === 'as'; })[0] || [0, 0, 'it'])[2], c: kids };
    if (tag === 'dc-import') return { k: 'imp', a: attrs };
    return { k: 'el', t: n.namespaceURI === 'http://www.w3.org/2000/svg' ? n.tagName : tag, a: attrs, c: kids, inp: tag === 'input' ? (attrs.filter(function (a) { return a[0] === 'type'; })[0] || [0, 0, 'text'])[2] : tag === 'textarea' ? 'text' : null };
  }
  function attr(attrs, name) { for (var i = 0; i < attrs.length; i++) if (attrs[i][0] === name) return attrs[i][1]; return ['']; }
  function compileKids(n) { var out = []; for (var c = n.firstChild; c; c = c.nextSibling) { var x = compileNode(c); if (x) out.push(x); } return out; }
  function compile(html) { var t = document.createElement('template'); t.innerHTML = html; return compileKids(t.content); }

  /* ---------- avaliação ---------- */
  function look(scope, path) {
    if (path === 'true') return true; if (path === 'false') return false; if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return +path;
    var ks = path.split('.'), v = scope[ks[0]];
    for (var i = 1; i < ks.length && v != null; i++) v = v[ks[i]];
    return v;
  }
  function val(p, scope) {
    if (p.length === 1 && typeof p[0] === 'object') return look(scope, p[0].e);
    var s = '';
    for (var i = 0; i < p.length; i++) { if (typeof p[i] === 'string') s += p[i]; else { var v = look(scope, p[i].e); if (v != null && v !== false) s += v; } }
    return s;
  }
  function render(nodes, scope) {
    var out = [];
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.k === 'x') { var tv = val(n.p, scope); if (tv != null && tv !== false && tv !== '') out.push(String(tv)); }
      else if (n.k === 'if') { if (val(n.v, scope)) out.push.apply(out, render(n.c, scope)); }
      else if (n.k === 'for') {
        var list = val(n.v, scope) || [];
        for (var j = 0; j < list.length; j++) { var sc = Object.create(scope); sc[n.as] = list[j]; out.push.apply(out, render(n.c, sc)); }
      }
      else if (n.k === 'imp') {
        var props = {}, name = '';
        n.a.forEach(function (a) { if (a[0] === 'name') name = a[2]; else props[camel(a[0])] = val(a[1], scope); });
        var C = getComp(name); if (C) out.push(h(C, props));
      }
      else {
        var pr = {};
        for (var k = 0; k < n.a.length; k++) {
          var a = n.a[k], nm = a[0], v = val(a[1], scope);
          if (nm.indexOf('on') === 0) {
            if (typeof v !== 'function') continue;
            if (nm === 'onchange' && n.inp && !/^(file|checkbox|radio)$/.test(n.inp)) nm = 'oninput';
            pr[nm] = v; continue;
          }
          if (nm === 'ref') { if (typeof v === 'function') pr.ref = v; continue; }
          if (BOOL[nm]) { pr[nm] = a[2] === '' ? true : !!v && v !== 'false'; continue; }
          if (v === undefined || v === null) continue;
          pr[nm] = v;
        }
        out.push(h(n.t, pr, render(n.c, scope)));
      }
    }
    return out;
  }

  /* ---------- componentes ---------- */
  function DCLogic(props) { P.Component.call(this, props); }
  DCLogic.prototype = Object.create(P.Component.prototype);
  DCLogic.prototype.constructor = DCLogic;
  DCLogic.prototype.render = function () {
    var C = this.constructor, vals = this.renderVals ? this.renderVals() : {};
    var kids = render(C.__tpl, vals || {});
    return kids.length === 1 ? kids[0] : h(P.Fragment, null, kids);
  };
  window.DCLogic = DCLogic;

  var COMPS = {};
  function getComp(name) {
    if (COMPS[name]) return COMPS[name];
    var pg = PAGES[name]; if (!pg) return null;
    var C;
    try { C = new Function('DCLogic', pg.code + '\n;return Component;')(DCLogic); }
    catch (e) { console.error('Baille: erro ao carregar', name, e); return null; }
    C.__tpl = compile(pg.tpl);
    var dp = {}; try { var dd = JSON.parse(pg.props || '{}'); Object.keys(dd).forEach(function (k) { if (k[0] !== '$' && dd[k] && 'default' in dd[k]) dp[k] = dd[k].default; }); } catch (e) {}
    C.defaultProps = Object.assign({}, C.defaultProps || {}, dp);
    COMPS[name] = C;
    return C;
  }

  /* ---------- estilos das telas ---------- */
  (function () {
    var seen = {}, css = '';
    Object.keys(PAGES).forEach(function (k) {
      var t = document.createElement('template'); t.innerHTML = PAGES[k].helmet || '';
      t.content.querySelectorAll('style').forEach(function (s) { var c = s.textContent; if (!seen[c]) { seen[c] = 1; css += c + '\n'; } });
    });
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  })();

  /* ---------- navegação ---------- */
  function startPage() {
    var hsh = decodeURIComponent((location.hash || '').replace(/^#\/?/, ''));
    if (hsh && PAGES[hsh]) return hsh;
    var done = false, me = null;
    try { done = JSON.parse(localStorage.getItem('baille:tutorialDone') || 'false'); me = JSON.parse(localStorage.getItem('baille:me') || 'null'); } catch (e) {}
    return done && me && me.handle ? 'Feed' : 'Main';
  }
  function App() { P.Component.call(this); this.state = { page: startPage() }; }
  App.prototype = Object.create(P.Component.prototype);
  App.prototype.componentDidMount = function () {
    var self = this;
    window.addEventListener('hashchange', function () {
      var p = decodeURIComponent((location.hash || '').replace(/^#\/?/, ''));
      if (p && PAGES[p] && p !== self.state.page) self.setState({ page: p });
    });
    if (!location.hash) history.replaceState(null, '', '#' + this.state.page);
  };
  App.prototype.render = function () {
    var C = getComp(this.state.page);
    if (!C) return h('div', { style: 'padding:40px;color:#fff' }, 'Tela não encontrada: ' + this.state.page);
    return h('div', { key: this.state.page, class: 'bapp-page' }, h(C, {}));
  };

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var m = href.match(/^(?:\.\/)?([A-Za-z0-9_]+)\.dc\.html$/);
    if (m) {
      e.preventDefault();
      if (PAGES[m[1]]) { if (location.hash.replace(/^#\/?/, '') !== m[1]) location.hash = m[1]; }
    } else if (href.charAt(0) === '#') e.preventDefault();
  });

  P.render(h(App), document.getElementById('app'));
})();
