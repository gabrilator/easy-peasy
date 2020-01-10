!(function(e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(
        exports,
        require('immer-peasy'),
        require('react'),
        require('redux'),
        require('redux-thunk'),
        require('memoizerific'),
        require('is-plain-object'),
        require('debounce'),
      )
    : 'function' == typeof define && define.amd
    ? define([
        'exports',
        'immer-peasy',
        'react',
        'redux',
        'redux-thunk',
        'memoizerific',
        'is-plain-object',
        'debounce',
      ], t)
    : t(
        ((e = e || self).EasyPeasy = {}),
        e.produce,
        e.React,
        e.Redux,
        e.ReduxThunk,
        e.memoizerific,
        e.isPlainObject,
        e.debounce,
      );
})(this, function(e, l, a, H, B, U, V, G) {
  'use strict';
  var c = 'default' in a ? a.default : a;
  (B = B && B.hasOwnProperty('default') ? B.default : B),
    (U = U && U.hasOwnProperty('default') ? U.default : U),
    (V = V && V.hasOwnProperty('default') ? V.default : V),
    (G = G && G.hasOwnProperty('default') ? G.default : G);
  var r = a.createContext(),
    s = 'undefined' != typeof window ? a.useLayoutEffect : a.useEffect;
  function t(t) {
    return function(e) {
      var n = a.useContext(t),
        r = a.useRef(e),
        o = a.useRef(),
        i = a.useRef(!0),
        u = a.useRef(),
        c = a.useReducer(function(e) {
          return e + 1;
        }, 0)[1];
      if (u.current || r.current !== e || void 0 === o.current)
        try {
          o.current = e(n.getState());
        } catch (e) {
          throw u.current || e;
        }
      return (
        s(function() {
          (r.current = e), (u.current = void 0);
        }),
        s(function() {
          function e() {
            try {
              var e = r.current(n.getState());
              if (e === o.current) return;
              o.current = e;
            } catch (e) {
              u.current = e;
            }
            i.current && c({});
          }
          var t = n.subscribe(e);
          return (
            e(),
            function() {
              (i.current = !1), t();
            }
          );
        }, []),
        o.current
      );
    };
  }
  var n = t(r);
  function f(t) {
    return function(e) {
      return e(a.useContext(t).getActions());
    };
  }
  var o = f(r);
  function d(e) {
    return function() {
      return a.useContext(e).dispatch;
    };
  }
  var i = d(r);
  function u() {
    return a.useContext(r);
  }
  function p(o) {
    return function() {
      var e = a.useContext(o),
        t = a.useState(!1),
        n = t[0],
        r = t[1];
      return (
        a.useEffect(function() {
          e.persist.resolveRehydration().then(function() {
            return r(!0);
          });
        }, []),
        n
      );
    };
  }
  var v = p(r);
  function K() {
    return (K =
      Object.assign ||
      function(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
        return e;
      }).apply(this, arguments);
  }
  var F = 'a',
    Q = 'aO',
    W = 'c',
    Y = 'p',
    Z = 'r',
    $ = 'tO',
    ee = 't',
    te = function(e) {
      return (e[F] = {}), e;
    },
    h = [
      function(e) {
        return e;
      },
    ],
    ne = function(e) {
      return (function t(n) {
        var r = Object.keys(n).reduce(function(e, t) {
          return (
            null == Object.getOwnPropertyDescriptor(n, t).get && (e[t] = n[t]),
            e
          );
        }, {});
        return (
          Object.keys(r).forEach(function(e) {
            V(r[e]) && (r[e] = t(r[e]));
          }),
          r
        );
      })(e);
    },
    y = function(e) {
      return null != e && 'object' == typeof e && 'function' == typeof e.then;
    };
  function re(e, t) {
    return e.reduce(function(e, t) {
      return V(e) ? e[t] : void 0;
    }, t);
  }
  var oe = function(r, t, o) {
    0 !== r.length
      ? r.reduce(function(e, t, n) {
          return n + 1 === r.length ? (e[t] = o) : (e[t] = e[t] || {}), e[t];
        }, t)
      : 'object' == typeof o &&
        (Object.keys(t).forEach(function(e) {
          delete t[e];
        }),
        Object.keys(o).forEach(function(e) {
          t[e] = o[e];
        }));
  };
  function g(d) {
    return (
      void 0 === d && (d = !1),
      function(e, t, n) {
        if (d) {
          var r = re(e, t),
            o = n(r);
          return r !== o
            ? (function e(t, n, r) {
                if (0 === t.length) return r;
                var o = K({}, n),
                  i = t[0];
                return (
                  1 === t.length ? (o[i] = r) : (o[i] = e(t.slice(1), o[i], r)),
                  o
                );
              })(e, t, o)
            : t;
        }
        if (0 === e.length) {
          var i = l.createDraft(t),
            u = n(i);
          return u ? (l.isDraft(u) ? l.finishDraft(u) : u) : l.finishDraft(i);
        }
        var c = e.slice(0, e.length - 1),
          a = l.createDraft(t),
          s = re(c, t),
          f = n(re(e, a));
        return f && (s[e[e.length - 1]] = f), l.finishDraft(a);
      }
    );
  }
  function ie(e, a, u, c) {
    function s(e, t) {
      var n,
        r,
        o,
        i,
        u = a[t.type];
      if (u) {
        var c = u[F] || u[Q];
        return (
          (n = e),
          (r = t),
          (o = u),
          (i = c.parent),
          f(i, n, function(e) {
            return o(e, r.payload);
          })
        );
      }
      return e;
    }
    var f = g(e);
    return function(e, t) {
      var n,
        i,
        r = s(e, t),
        o =
          0 < u.length
            ? ((n = r),
              (i = t),
              u.reduce(function(e, t) {
                var n = t.parentPath,
                  r = t.key,
                  o = t.reducer;
                return f(n, e, function(e) {
                  return (e[r] = o(e[r], i)), e;
                });
              }, n))
            : r;
      return (
        e !== o &&
          c.forEach(function(e) {
            var t = e.parentPath;
            (0, e.bindComputedProperty)(re(t, o));
          }),
        o
      );
    };
  }
  var m = {
      getItem: function() {},
      setItem: function() {},
      removeItem: function() {},
    },
    S =
      'undefined' != typeof window && void 0 !== window.localStorage
        ? window.localStorage
        : m,
    b =
      'undefined' != typeof window && void 0 !== window.sessionStorage
        ? window.sessionStorage
        : m;
  function ue(u, c) {
    void 0 === u && (u = b),
      void 0 === c && (c = []),
      'string' == typeof u &&
        (u = 'localStorage' === u ? S : 'sessionStorage' === u ? b : m);
    function n(e, t) {
      var n = t.substr(t.indexOf('@') + 1),
        r = u === S || u === b ? JSON.parse(e).data : e;
      return o.reduce(function(e, t) {
        return t.out(e, n);
      }, r);
    }
    var o = c.reverse(),
      r = y(u.getItem('_'));
    return {
      isAsync: r,
      getItem: function(t) {
        if (r)
          return u.getItem(t).then(function(e) {
            return null != e ? n(e, t) : void 0;
          });
        var e = u.getItem(t);
        return null != e ? n(e, t) : void 0;
      },
      setItem: function(e, t) {
        return u.setItem(
          e,
          ((n = t),
          (o = (r = e).substr(r.indexOf('@') + 1)),
          (i = c.reduce(function(e, t) {
            return t.in(e, o);
          }, n)),
          u === S || u === b ? JSON.stringify({ data: i }) : i),
        );
        var n, r, o, i;
      },
      removeItem: function(e) {
        return u.removeItem(e);
      },
    };
  }
  function ce(e, n, r) {
    var t = Object.keys(e);
    return (
      0 < n.length &&
        (t = t.reduce(function(e, t) {
          return -1 !==
            n.findIndex(function(e) {
              return e === t;
            })
            ? [].concat(e, [t])
            : e;
        }, [])),
      0 < r.length &&
        (t = t.reduce(function(e, t) {
          return -1 !==
            r.findIndex(function(e) {
              return e === t;
            })
            ? e
            : [].concat(e, [t]);
        }, [])),
      t
    );
  }
  function ae(l, p, v) {
    var h = Promise.resolve();
    return (
      0 < v.internals.persistenceConfig.length &&
        v.internals.persistenceConfig.forEach(function(e) {
          function n(e, t) {
            if ('overwrite' === i) oe(o, e, t);
            else if ('merge' === i) {
              var n = re(o, e);
              Object.keys(t).forEach(function(e) {
                n[e] = t[e];
              });
            } else if ('mergeDeep' === i) {
              !(function n(r, o) {
                Object.keys(o).forEach(function(e) {
                  var t = o[e];
                  V(t) ? (V(r[e]) || (r[e] = {}), n(r[e], t)) : (r[e] = t);
                });
              })(re(o, e), t);
            }
          }
          var o = e.path,
            t = e.config,
            r = t.blacklist,
            i = t.mergeStrategy,
            u = t.storage,
            c = t.whitelist,
            a = v.internals.defaultState,
            s = ce(ne(re(o, a)), c, r);
          if (u.isAsync) {
            var f = s.reduce(function(e, t) {
              var n = [].concat(o, [t]),
                r = u.getItem(l(n));
              return y(r) && e.push({ key: t, dataPromise: r }), e;
            }, []);
            0 < f.length &&
              (h = Promise.all(
                f.map(function(e) {
                  return e.dataPromise;
                }),
              ).then(function(e) {
                var t = e.reduce(function(e, t, n) {
                  var r = f[n].key;
                  return void 0 !== t && (e[r] = t), e;
                }, {});
                0 !== Object.keys(t).length && (n(a, t), p(a));
              }));
          } else {
            var d = s.reduce(function(e, t) {
              var n = [].concat(o, [t]),
                r = u.getItem(l(n));
              return void 0 !== r && (e[t] = r), e;
            }, {});
            n(a, d), p(a);
          }
        }),
      h
    );
  }
  function se(n, e, r) {
    var o = (n[F] ? '@action' : '@actionOn') + '.' + e.path.join('.'),
      i = n[F] || n[Q];
    (i.actionName = e.key),
      (i.type = o),
      (i.parent = e.parent),
      (i.path = e.path);
    function t(e) {
      var t = { type: o, payload: e };
      return (
        n[Q] &&
          i.resolvedTargets &&
          (e.resolvedTargets = [].concat(i.resolvedTargets)),
        r.dispatch(t)
      );
    }
    return (t.type = o), t;
  }
  function fe(e, t, o, i) {
    var u = (e[ee] ? '@thunk' : '@thunkOn') + '.' + t.path.join('.'),
      c = u + '(start)',
      a = u + '(success)',
      s = u + '(fail)',
      n = e[ee] || e[$];
    (n.type = u),
      (n.actionName = t.key),
      (n.parent = t.parent),
      (n.path = t.path);
    function r(t) {
      function n(e) {
        o.dispatch({ type: s, payload: t, error: e }),
          o.dispatch({ type: u, payload: t, error: e });
      }
      function r(e) {
        o.dispatch({ type: a, payload: t, result: e }),
          o.dispatch({ type: u, payload: t, result: e });
      }
      o.dispatch({ type: c, payload: t });
      try {
        var e = o.dispatch(function() {
          return i(t);
        });
        return y(e)
          ? e
              .then(function(e) {
                return r(e), e;
              })
              .catch(function(e) {
                throw (n(e), e);
              })
          : (r(e), e);
      } catch (e) {
        throw (n(e), e);
      }
    }
    return (
      (r.type = u), (r.startType = c), (r.successType = a), (r.failType = s), r
    );
  }
  function de(e, j, I, A) {
    var o,
      i,
      u,
      x = j,
      D = {},
      T = {},
      _ = {},
      M = {},
      N = [],
      q = [],
      z = {},
      t = {},
      L = [],
      X = [],
      J = { isInReducer: !1, currentState: x };
    return (
      (function E(P, R) {
        return Object.keys(P).forEach(function(t) {
          function e() {
            var e = re(R, j);
            oe(g, x, e && t in e ? e[t] : y);
          }
          var n,
            r,
            o,
            i,
            u,
            c,
            a,
            s,
            f,
            d,
            l,
            p,
            v,
            h,
            y = P[t],
            g = [].concat(R, [t]),
            m = { parent: R, path: g, key: t };
          if (t !== Y)
            if ('function' == typeof y)
              if (y[F] || y[Q]) {
                var S = y,
                  b = se(y, m, A);
                (D[b.type] = b),
                  (_[b.type] = S),
                  'ePRS' !== m.key &&
                    (y[Q] ? (L.push(y), oe(g, z, b)) : oe(g, T, b));
              } else if (y[ee] || y[$]) {
                var O =
                    ((d = m),
                    (l = A),
                    (p = I),
                    (v = T),
                    (h = (f = y)[ee] || f[$]),
                    function(e) {
                      var t = {
                        dispatch: l.dispatch,
                        getState: function() {
                          return re(d.parent, l.getState());
                        },
                        getStoreActions: function() {
                          return v;
                        },
                        getStoreState: l.getState,
                        injections: p,
                        meta: d,
                      };
                      return (
                        f[$] &&
                          h.resolvedTargets &&
                          (e.resolvedTargets = [].concat(h.resolvedTargets)),
                        f(re(d.parent, v), e, t)
                      );
                    }),
                  w = fe(y, m, A, O);
                oe(g, M, O),
                  (D[w.type] = w),
                  y[$] ? (L.push(y), oe(g, z, w)) : oe(g, T, w);
              } else if (y[W]) {
                var k = re(R, x),
                  C =
                    ((r = R),
                    (o = t),
                    (u = J),
                    (c = A),
                    (a = (i = y)[W]),
                    (s = U(1)(i)),
                    function(e) {
                      Object.defineProperty(e, o, {
                        configurable: !0,
                        enumerable: !0,
                        get: function() {
                          var t;
                          if (u.isInReducer) t = u.currentState;
                          else {
                            if (null == c.getState) return;
                            try {
                              t = c.getState();
                            } catch (e) {
                              return;
                            }
                          }
                          var n = re(r, t),
                            e = a.stateResolvers.map(function(e) {
                              return e(n, t);
                            });
                          return s.apply(void 0, e);
                        },
                      });
                    });
                C(k),
                  N.push({ key: t, parentPath: R, bindComputedProperty: C });
              } else y[Z] ? q.push({ key: t, parentPath: R, reducer: y }) : e();
            else if (V(y)) {
              null == re(g, x) && oe(g, x, {}), E(y, g);
            } else e();
          else
            X.push(
              (void 0 === (n = y) && (n = {}),
              {
                path: R,
                config: {
                  blacklist: n.blacklist || [],
                  mergeStrategy: n.mergeStrategy || 'merge',
                  storage: ue(n.storage, n.transformers),
                  whitelist: n.whitelist || [],
                },
              }),
            );
        });
      })(e, []),
      (o = T),
      (i = D),
      (u = t),
      L.forEach(function(e) {
        var n = e[Q] || e[$],
          t = n.targetResolver(re(n.parent, o), o),
          r = (Array.isArray(t) ? t : [t]).reduce(function(e, t) {
            return (
              'function' == typeof t && t.type && i[t.type]
                ? e.push(t.type)
                : 'string' == typeof t && e.push(t),
              e
            );
          }, []);
        (n.resolvedTargets = r).forEach(function(e) {
          var t = u[e] || [];
          t.push(i[n.type]), (u[e] = t);
        });
      }),
      {
        actionCreatorDict: D,
        actionCreators: T,
        actionReducersDict: _,
        computedProperties: N,
        customReducers: q,
        computedState: J,
        defaultState: x,
        listenerActionCreators: z,
        listenerActionMap: t,
        persistenceConfig: X,
      }
    );
  }
  function O(e, t) {
    void 0 === t && (t = {});
    function n(e) {
      return K({}, e, {
        ePRS: te(function(e, t) {
          return t;
        }),
      });
    }
    function r(e) {
      return '[' + j + ']@' + e.join('.');
    }
    function o(e) {
      return x.internals.actionCreatorDict['@action.ePRS'](e);
    }
    function i(e) {
      var t, n, r, o, i, u, c, a, s, f, d, l, p;
      void 0 === e && (e = {}),
        (x.internals =
          ((n = (t = {
            disableImmer: g,
            initialState: e,
            injections: w,
            model: D,
            reducerEnhancer: A,
            references: x,
          }).disableImmer),
          (r = t.initialState),
          (o = t.injections),
          (i = t.model),
          (u = t.reducerEnhancer),
          (c = de(i, r, o, t.references)),
          (a = c.actionCreatorDict),
          (s = c.actionCreators),
          (f = c.actionReducersDict),
          (d = c.computedState),
          (l = c.computedProperties),
          (p = c.customReducers),
          {
            actionCreatorDict: a,
            actionCreators: s,
            computedProperties: l,
            computedState: d,
            defaultState: c.defaultState,
            listenerActionCreators: c.listenerActionCreators,
            listenerActionMap: c.listenerActionMap,
            persistenceConfig: c.persistenceConfig,
            reducer: u(ie(n, f, p, l)),
          }));
    }
    var c,
      a,
      u,
      s,
      f,
      d,
      l = ne(e),
      p = t.compose,
      v = t.devTools,
      h = void 0 === v || v,
      y = t.disableImmer,
      g = void 0 !== y && y,
      m = t.enhancers,
      S = void 0 === m ? [] : m,
      b = t.initialState,
      O = void 0 === b ? {} : b,
      w = t.injections,
      k = t.middleware,
      C = void 0 === k ? [] : k,
      E = t.mockActions,
      P = void 0 !== E && E,
      R = t.name,
      j = void 0 === R ? 'EasyPeasyStore' : R,
      I = t.reducerEnhancer,
      A =
        void 0 === I
          ? function(e) {
              return e;
            }
          : I,
      x = {},
      D = n(l),
      T = [],
      _ =
        ((c = r),
        (a = x),
        G(function() {
          a.internals.persistenceConfig.forEach(function(e) {
            var n = e.path,
              t = e.config,
              r = t.storage,
              o = t.whitelist,
              i = t.blacklist,
              u = a.getState();
            ce(ne(re(n, u)), o, i).forEach(function(e) {
              var t = [].concat(n, [e]);
              r.setItem(c(t), re(t, u));
            });
          });
        }, 1e3)),
      M =
        ((u = _),
        function() {
          return function(n) {
            return function(e) {
              var t = n(e);
              return (
                e &&
                  '@action.ePRS' !== e.type &&
                  0 < s.internals.persistenceConfig.length &&
                  u(t),
                t
              );
            };
          };
        }),
      N =
        ((f = r),
        (d = s = x),
        function() {
          return new Promise(function(c, a) {
            d.internals.persistenceConfig.forEach(function(e) {
              var n = e.path,
                t = e.config,
                r = t.storage,
                o = t.whitelist,
                i = t.blacklist,
                u = ce(re(n, d.getState()), o, i);
              0 < u.length
                ? Promise.all(
                    u.map(function(e) {
                      var t = [].concat(n, [e]);
                      return r.removeItem(f(t));
                    }),
                  ).then(function() {
                    return c();
                  }, a)
                : c();
            });
          });
        }),
      q =
        p ||
        (h &&
        'undefined' != typeof window &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
          ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: j })
          : H.compose);
    i(O);
    var z,
      L,
      X = [
        function(n) {
          return function(t) {
            return function(e) {
              return (
                (L.internals.computedState.currentState = n.getState()),
                (L.internals.computedState.isInReducer = !0),
                t(e)
              );
            };
          };
        },
        B,
      ].concat(C, [
        ((z = L = x),
        function() {
          return function(r) {
            return function(t) {
              var e = r(t);
              if (
                t &&
                z.internals.listenerActionMap[t.type] &&
                0 < z.internals.listenerActionMap[t.type].length
              ) {
                var n = z.internals.actionCreatorDict[t.type];
                z.internals.listenerActionMap[t.type].forEach(function(e) {
                  e({
                    type: n ? n.type : t.type,
                    payload: t.payload,
                    error: t.error,
                    result: t.result,
                  });
                });
              }
              return e;
            };
          };
        }),
        M,
      ]);
    P &&
      X.push(function() {
        return function() {
          return function(e) {
            null != e && T.push(e);
          };
        };
      });
    var J = H.createStore(
      x.internals.reducer,
      x.internals.defaultState,
      q.apply(void 0, [H.applyMiddleware.apply(void 0, X)].concat(S)),
    );
    J.subscribe(function() {
      x.internals.computedState.isInReducer = !1;
    }),
      (x.dispatch = J.dispatch),
      (x.getState = J.getState);
    function U() {
      Object.keys(J.dispatch).forEach(function(e) {
        delete J.dispatch[e];
      }),
        Object.keys(x.internals.actionCreators).forEach(function(e) {
          J.dispatch[e] = x.internals.actionCreators[e];
        });
    }
    U();
    function V(e) {
      var t = J.getState();
      e && delete t[e],
        i(t),
        J.replaceReducer(x.internals.reducer),
        o(x.internals.defaultState),
        U();
    }
    var F = ae(r, o, x);
    return Object.assign(J, {
      addModel: function(e, t) {
        D[e], (D[e] = t), V();
      },
      clearMockedActions: function() {
        T = [];
      },
      getActions: function() {
        return x.internals.actionCreators;
      },
      getListeners: function() {
        return x.internals.listenerActionCreators;
      },
      getMockedActions: function() {
        return [].concat(T);
      },
      persist: {
        clear: N,
        flush: function() {
          return _.flush();
        },
        resolveRehydration: function() {
          return F;
        },
      },
      reconfigure: function(e) {
        (D = n(e)), V();
      },
      removeModel: function(e) {
        D[e] && (delete D[e], V(e));
      },
    });
  }
  l.setAutoFreeze(!1),
    (e.StoreProvider = function(e) {
      var t = e.children,
        n = e.store;
      return c.createElement(r.Provider, { value: n }, t);
    }),
    (e.action = te),
    (e.actionOn = function(e, t) {
      return (t[Q] = { targetResolver: e }), t;
    }),
    (e.computed = function(e, t) {
      return 'function' == typeof t
        ? ((t[W] = { stateResolvers: e }), t)
        : ((e[W] = { stateResolvers: h }), e);
    }),
    (e.createComponentStore = function(u, c) {
      return function(e) {
        var t = a.useMemo(function() {
            return O('function' == typeof u ? u(e) : u, c);
          }, []),
          n = a.useRef(t.getState()),
          r = a.useState(function() {
            return t.getState();
          }),
          o = r[0],
          i = r[1];
        return (
          a.useEffect(
            function() {
              return t.subscribe(function() {
                var e = t.getState();
                n.current !== e && ((n.current = e), i(e));
              });
            },
            [t],
          ),
          [o, t.getActions()]
        );
      };
    }),
    (e.createContextStore = function(o, i) {
      var u = a.createContext();
      return {
        Provider: function(e) {
          var t = e.children,
            n = e.initialData,
            r = a.useMemo(function() {
              return O('function' == typeof o ? o(n) : o, i);
            }, []);
          return c.createElement(u.Provider, { value: r }, t);
        },
        useStore: function() {
          return a.useContext(u);
        },
        useStoreState: t(u),
        useStoreActions: f(u),
        useStoreDispatch: d(u),
        useStoreRehydrated: p(u),
      };
    }),
    (e.createStore = O),
    (e.createTransform = function(r, o, e) {
      void 0 === e && (e = {});
      var t = e.whitelist || null,
        n = e.blacklist || null;
      function i(e) {
        return (t && -1 === t.indexOf(e)) || !(!n || -1 === n.indexOf(e));
      }
      return {
        in: function(e, t, n) {
          return !i(t) && r ? r(e, t, n) : e;
        },
        out: function(e, t, n) {
          return !i(t) && o ? o(e, t, n) : e;
        },
      };
    }),
    (e.createTypedHooks = function() {
      return {
        useStoreActions: o,
        useStoreDispatch: i,
        useStoreState: n,
        useStoreRehydrated: v,
        useStore: u,
      };
    }),
    (e.debug = function(e) {
      return l.isDraft(e) ? l.original(e) : e;
    }),
    (e.memo = function(e, t) {
      return U(t)(e);
    }),
    (e.persist = function(e, t) {
      var n;
      return 'undefined' == typeof window
        ? e
        : K({}, e, (((n = {})[Y] = t), n));
    }),
    (e.reducer = function(e) {
      return (e[Z] = {}), e;
    }),
    (e.thunk = function(e) {
      return (e[ee] = {}), e;
    }),
    (e.thunkOn = function(e, t) {
      return (t[$] = { targetResolver: e }), t;
    }),
    (e.useStore = u),
    (e.useStoreActions = o),
    (e.useStoreDispatch = i),
    (e.useStoreRehydrated = v),
    (e.useStoreState = n),
    Object.defineProperty(e, '__esModule', { value: !0 });
});
//# sourceMappingURL=easy-peasy.umd.js.map
