'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var immerPeasy = require('immer-peasy');
var React = require('react');
var React__default = _interopDefault(React);
var redux = require('redux');
var reduxThunk = _interopDefault(require('redux-thunk'));
var memoizerific = _interopDefault(require('memoizerific'));
var isPlainObject = _interopDefault(require('is-plain-object'));
var debounce = _interopDefault(require('debounce'));

var StoreContext = React.createContext();

// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser. We need useLayoutEffect to ensure the store
// subscription callback always has the selector from the latest render commit
// available, otherwise a store update may happen between render and the effect,
// which may cause missed updates; we also must ensure the store subscription
// is created synchronously, otherwise a store update may occur before the
// subscription is created and an inconsistent state may be observed

var useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
function createStoreStateHook(Context) {
  return function useStoreState(mapState) {
    var store = React.useContext(Context);
    var mapStateRef = React.useRef(mapState);
    var stateRef = React.useRef();
    var mountedRef = React.useRef(true);
    var subscriptionMapStateError = React.useRef();

    var _useReducer = React.useReducer(function(s) {
        return s + 1;
      }, 0),
      forceRender = _useReducer[1];

    if (
      subscriptionMapStateError.current ||
      mapStateRef.current !== mapState ||
      stateRef.current === undefined
    ) {
      try {
        stateRef.current = mapState(store.getState());
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          var errorMessage =
            'An error occurred trying to map state in a useStoreState hook: ' +
            err.message +
            '.';

          if (subscriptionMapStateError.current) {
            errorMessage +=
              '\nThis error may be related to the following error:\n' +
              subscriptionMapStateError.current.stack +
              '\n\nOriginal stack trace:';
          }

          throw new Error(errorMessage);
        }

        throw subscriptionMapStateError.current || err;
      }
    }

    useIsomorphicLayoutEffect(function() {
      mapStateRef.current = mapState;
      subscriptionMapStateError.current = undefined;
    });
    useIsomorphicLayoutEffect(function() {
      var checkMapState = function checkMapState() {
        try {
          var newState = mapStateRef.current(store.getState());

          if (newState === stateRef.current) {
            return;
          }

          stateRef.current = newState;
        } catch (err) {
          // see https://github.com/reduxjs/react-redux/issues/1179
          // There is a possibility mapState will fail due to stale state or
          // props, therefore we will just track the error and force our
          // component to update. It should then receive the updated state
          subscriptionMapStateError.current = err;
        }

        if (mountedRef.current) {
          forceRender({});
        }
      };

      var unsubscribe = store.subscribe(checkMapState);
      checkMapState();
      return function() {
        mountedRef.current = false;
        unsubscribe();
      };
    }, []);
    return stateRef.current;
  };
}
var useStoreState = createStoreStateHook(StoreContext);
function createStoreActionsHook(Context) {
  return function useStoreActions(mapActions) {
    var store = React.useContext(Context);
    return mapActions(store.getActions());
  };
}
var useStoreActions = createStoreActionsHook(StoreContext);
function createStoreDispatchHook(Context) {
  return function useStoreDispatch() {
    var store = React.useContext(Context);
    return store.dispatch;
  };
}
var useStoreDispatch = createStoreDispatchHook(StoreContext);
function useStore() {
  return React.useContext(StoreContext);
}
function createStoreRehydratedHook(Context) {
  return function useStoreRehydrated() {
    var store = React.useContext(Context);

    var _useState = React.useState(false),
      rehydrated = _useState[0],
      setRehydrated = _useState[1];

    React.useEffect(function() {
      store.persist.resolveRehydration().then(function() {
        return setRehydrated(true);
      });
    }, []);
    return rehydrated;
  };
}
var useStoreRehydrated = createStoreRehydratedHook(StoreContext);
function createTypedHooks() {
  return {
    useStoreActions: useStoreActions,
    useStoreDispatch: useStoreDispatch,
    useStoreState: useStoreState,
    useStoreRehydrated: useStoreRehydrated,
    useStore: useStore,
  };
}

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

  return _extends.apply(this, arguments);
}

var actionSymbol = 'a';
var actionOnSymbol = 'aO';
var computedSymbol = 'c';
var persistSymbol = 'p';
var reducerSymbol = 'r';
var thunkOnSymbol = 'tO';
var thunkSymbol = 't';

var debug = function debug(state) {
  if (immerPeasy.isDraft(state)) {
    return immerPeasy.original(state);
  }

  return state;
};
var memo = function memo(fn, cacheSize) {
  return memoizerific(cacheSize)(fn);
};
var actionOn = function actionOn(targetResolver, fn) {
  fn[actionOnSymbol] = {
    targetResolver: targetResolver,
  };
  return fn;
};
var action = function action(fn) {
  fn[actionSymbol] = {};
  return fn;
};
var defaultStateResolvers = [
  function(state) {
    return state;
  },
];
var computed = function computed(fnOrStateResolvers, fn) {
  if (typeof fn === 'function') {
    fn[computedSymbol] = {
      stateResolvers: fnOrStateResolvers,
    };
    return fn;
  }

  fnOrStateResolvers[computedSymbol] = {
    stateResolvers: defaultStateResolvers,
  };
  return fnOrStateResolvers;
};
var persist = function persist(model, config) {
  var _extends2;

  // return {
  //   ...model,
  //   [persistSymbol]: config,
  // };
  return typeof window === 'undefined'
    ? model
    : _extends(
        {},
        model,
        ((_extends2 = {}), (_extends2[persistSymbol] = config), _extends2),
      );
};
var thunkOn = function thunkOn(targetResolver, fn) {
  fn[thunkOnSymbol] = {
    targetResolver: targetResolver,
  };
  return fn;
};
var thunk = function thunk(fn) {
  fn[thunkSymbol] = {};
  return fn;
};
var reducer = function reducer(fn) {
  fn[reducerSymbol] = {};
  return fn;
};

var deepCloneStateWithoutComputed = function deepCloneStateWithoutComputed(
  source,
) {
  var recursiveClone = function recursiveClone(current) {
    var next = Object.keys(current).reduce(function(acc, key) {
      if (Object.getOwnPropertyDescriptor(current, key).get == null) {
        acc[key] = current[key];
      }

      return acc;
    }, {});
    Object.keys(next).forEach(function(key) {
      if (isPlainObject(next[key])) {
        next[key] = recursiveClone(next[key]);
      }
    });
    return next;
  };

  return recursiveClone(source);
};
var isPromise = function isPromise(x) {
  return x != null && typeof x === 'object' && typeof x.then === 'function';
};
function get(path, target) {
  return path.reduce(function(acc, cur) {
    return isPlainObject(acc) ? acc[cur] : undefined;
  }, target);
}
function newify(currentPath, currentState, finalValue) {
  if (currentPath.length === 0) {
    return finalValue;
  }

  var newState = _extends({}, currentState);

  var key = currentPath[0];

  if (currentPath.length === 1) {
    newState[key] = finalValue;
  } else {
    newState[key] = newify(currentPath.slice(1), newState[key], finalValue);
  }

  return newState;
}
var set = function set(path, target, value) {
  if (path.length === 0) {
    if (typeof value === 'object') {
      Object.keys(target).forEach(function(key) {
        delete target[key];
      });
      Object.keys(value).forEach(function(key) {
        target[key] = value[key];
      });
    }

    return;
  }

  path.reduce(function(acc, cur, idx) {
    if (idx + 1 === path.length) {
      acc[cur] = value;
    } else {
      acc[cur] = acc[cur] || {};
    }

    return acc[cur];
  }, target);
};
function createSimpleProduce(disableImmer) {
  if (disableImmer === void 0) {
    disableImmer = false;
  }

  return function simpleProduce(path, state, fn) {
    if (disableImmer) {
      var _current = get(path, state);

      var next = fn(_current);

      if (_current !== next) {
        return newify(path, state, next);
      }

      return state;
    }

    if (path.length === 0) {
      var _draft = immerPeasy.createDraft(state);

      var _result = fn(_draft);

      if (_result) {
        return immerPeasy.isDraft(_result)
          ? immerPeasy.finishDraft(_result)
          : _result;
      }

      return immerPeasy.finishDraft(_draft);
    }

    var parentPath = path.slice(0, path.length - 1);
    var draft = immerPeasy.createDraft(state);
    var parent = get(parentPath, state);
    var current = get(path, draft);
    var result = fn(current);

    if (result) {
      parent[path[path.length - 1]] = result;
    }

    return immerPeasy.finishDraft(draft);
  };
}

function createReducer(
  disableImmer,
  actionReducersDict,
  customReducers,
  computedProperties,
) {
  var simpleProduce = createSimpleProduce(disableImmer);

  var runActionReducerAtPath = function runActionReducerAtPath(
    state,
    action,
    actionReducer,
    path,
  ) {
    return simpleProduce(path, state, function(draft) {
      return actionReducer(draft, action.payload);
    });
  };

  var reducerForActions = function reducerForActions(state, action) {
    var actionReducer = actionReducersDict[action.type];

    if (actionReducer) {
      var actionMeta =
        actionReducer[actionSymbol] || actionReducer[actionOnSymbol];
      return runActionReducerAtPath(
        state,
        action,
        actionReducer,
        actionMeta.parent,
      );
    }

    return state;
  };

  var reducerForCustomReducers = function reducerForCustomReducers(
    state,
    action,
  ) {
    return customReducers.reduce(function(acc, _ref) {
      var parentPath = _ref.parentPath,
        key = _ref.key,
        red = _ref.reducer;
      return simpleProduce(parentPath, acc, function(draft) {
        draft[key] = red(draft[key], action);
        return draft;
      });
    }, state);
  };

  var rootReducer = function rootReducer(state, action) {
    var stateAfterActions = reducerForActions(state, action);
    var next =
      customReducers.length > 0
        ? reducerForCustomReducers(stateAfterActions, action)
        : stateAfterActions;

    if (state !== next) {
      computedProperties.forEach(function(_ref2) {
        var parentPath = _ref2.parentPath,
          bindComputedProperty = _ref2.bindComputedProperty;
        bindComputedProperty(get(parentPath, next));
      });
    }

    return next;
  };

  return rootReducer;
}

var noopStorage = {
  getItem: function getItem() {
    return undefined;
  },
  setItem: function setItem() {
    return undefined;
  },
  removeItem: function removeItem() {
    return undefined;
  },
};
var localStorage =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
    ? window.localStorage
    : noopStorage;
var sessionStorage =
  typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
    ? window.sessionStorage
    : noopStorage;

function createStorageWrapper(storage, transformers) {
  if (storage === void 0) {
    storage = sessionStorage;
  }

  if (transformers === void 0) {
    transformers = [];
  }

  if (typeof storage === 'string') {
    if (storage === 'localStorage') {
      storage = localStorage;
    } else if (storage === 'sessionStorage') {
      storage = sessionStorage;
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'Invalid storage provider specified for Easy Peasy persist: ' +
            storage +
            '\nValid values include "localStorage", "sessionStorage" or a custom storage engine.',
        );
      }

      storage = noopStorage;
    }
  }

  var outTransformers = transformers.reverse();

  var serialize = function serialize(data, key) {
    var simpleKey = key.substr(key.indexOf('@') + 1);
    var transformed = transformers.reduce(function(acc, cur) {
      return cur.in(acc, simpleKey);
    }, data);
    return storage === localStorage || storage === sessionStorage
      ? JSON.stringify({
          data: transformed,
        })
      : transformed;
  };

  var deserialize = function deserialize(data, key) {
    var simpleKey = key.substr(key.indexOf('@') + 1);
    var result =
      storage === localStorage || storage === sessionStorage
        ? JSON.parse(data).data
        : data;
    return outTransformers.reduce(function(acc, cur) {
      return cur.out(acc, simpleKey);
    }, result);
  };

  var isAsync = isPromise(storage.getItem('_'));
  return {
    isAsync: isAsync,
    getItem: function getItem(key) {
      if (isAsync) {
        return storage.getItem(key).then(function(wrapped) {
          return wrapped != null ? deserialize(wrapped, key) : undefined;
        });
      }

      var wrapped = storage.getItem(key);
      return wrapped != null ? deserialize(wrapped, key) : undefined;
    },
    setItem: function setItem(key, data) {
      return storage.setItem(key, serialize(data, key));
    },
    removeItem: function removeItem(key) {
      return storage.removeItem(key);
    },
  };
}

function extractPersistConfig(path, persistDefinition) {
  if (persistDefinition === void 0) {
    persistDefinition = {};
  }

  return {
    path: path,
    config: {
      blacklist: persistDefinition.blacklist || [],
      mergeStrategy: persistDefinition.mergeStrategy || 'merge',
      storage: createStorageWrapper(
        persistDefinition.storage,
        persistDefinition.transformers,
      ),
      whitelist: persistDefinition.whitelist || [],
    },
  };
}

function resolvePersistTargets(target, whitelist, blacklist) {
  var targets = Object.keys(target);

  if (whitelist.length > 0) {
    targets = targets.reduce(function(acc, cur) {
      if (
        whitelist.findIndex(function(x) {
          return x === cur;
        }) !== -1
      ) {
        return [].concat(acc, [cur]);
      }

      return acc;
    }, []);
  }

  if (blacklist.length > 0) {
    targets = targets.reduce(function(acc, cur) {
      if (
        blacklist.findIndex(function(x) {
          return x === cur;
        }) !== -1
      ) {
        return acc;
      }

      return [].concat(acc, [cur]);
    }, []);
  }

  return targets;
}

function createPersistor(persistKey, references) {
  return debounce(function() {
    references.internals.persistenceConfig.forEach(function(_ref) {
      var path = _ref.path,
        config = _ref.config;
      var storage = config.storage,
        whitelist = config.whitelist,
        blacklist = config.blacklist;
      var state = references.getState();
      var persistRoot = deepCloneStateWithoutComputed(get(path, state));
      var targets = resolvePersistTargets(persistRoot, whitelist, blacklist);
      targets.forEach(function(key) {
        var targetPath = [].concat(path, [key]);
        storage.setItem(persistKey(targetPath), get(targetPath, state));
      });
    });
  }, 1000);
}
function createPersistMiddleware(persistor, references) {
  return function() {
    return function(next) {
      return function(action) {
        var state = next(action);

        if (
          action &&
          action.type !== '@action.ePRS' &&
          references.internals.persistenceConfig.length > 0
        ) {
          persistor(state);
        }

        return state;
      };
    };
  };
}
function createPersistenceClearer(persistKey, references) {
  return function() {
    return new Promise(function(resolve, reject) {
      references.internals.persistenceConfig.forEach(function(_ref2) {
        var path = _ref2.path,
          config = _ref2.config;
        var storage = config.storage,
          whitelist = config.whitelist,
          blacklist = config.blacklist;
        var persistRoot = get(path, references.getState());
        var targets = resolvePersistTargets(persistRoot, whitelist, blacklist);

        if (targets.length > 0) {
          Promise.all(
            targets.map(function(key) {
              var targetPath = [].concat(path, [key]);
              return storage.removeItem(persistKey(targetPath));
            }),
          ).then(function() {
            return resolve();
          }, reject);
        } else {
          resolve();
        }
      });
    });
  };
}
function rehydrateStateFromPersistIfNeeded(
  persistKey,
  replaceState,
  references,
) {
  // If we have any persist configs we will attemp to perform a state rehydration
  var resolveRehydration = Promise.resolve();

  if (references.internals.persistenceConfig.length > 0) {
    references.internals.persistenceConfig.forEach(function(persistInstance) {
      var path = persistInstance.path,
        config = persistInstance.config;
      var blacklist = config.blacklist,
        mergeStrategy = config.mergeStrategy,
        storage = config.storage,
        whitelist = config.whitelist;
      var state = references.internals.defaultState;
      var persistRoot = deepCloneStateWithoutComputed(get(path, state));
      var targets = resolvePersistTargets(persistRoot, whitelist, blacklist);

      var applyRehydrationStrategy = function applyRehydrationStrategy(
        originalState,
        rehydratedState,
      ) {
        if (mergeStrategy === 'overwrite') {
          set(path, originalState, rehydratedState);
        } else if (mergeStrategy === 'merge') {
          var target = get(path, originalState);
          Object.keys(rehydratedState).forEach(function(key) {
            target[key] = rehydratedState[key];
          });
        } else if (mergeStrategy === 'mergeDeep') {
          var _target = get(path, originalState);

          var setAt = function setAt(currentTarget, currentNext) {
            Object.keys(currentNext).forEach(function(key) {
              var data = currentNext[key];

              if (isPlainObject(data)) {
                if (!isPlainObject(currentTarget[key])) {
                  currentTarget[key] = {};
                }

                setAt(currentTarget[key], data);
              } else {
                currentTarget[key] = data;
              }
            });
          };

          setAt(_target, rehydratedState);
        }
      };

      if (storage.isAsync) {
        var asyncStateResolvers = targets.reduce(function(acc, key) {
          var targetPath = [].concat(path, [key]);
          var dataPromise = storage.getItem(persistKey(targetPath));

          if (isPromise(dataPromise)) {
            acc.push({
              key: key,
              dataPromise: dataPromise,
            });
          }

          return acc;
        }, []);

        if (asyncStateResolvers.length > 0) {
          resolveRehydration = Promise.all(
            asyncStateResolvers.map(function(x) {
              return x.dataPromise;
            }),
          ).then(function(resolvedData) {
            var next = resolvedData.reduce(function(acc, cur, idx) {
              var key = asyncStateResolvers[idx].key;

              if (cur !== undefined) {
                acc[key] = cur;
              }

              return acc;
            }, {});

            if (Object.keys(next).length === 0) {
              return;
            }

            applyRehydrationStrategy(state, next);
            replaceState(state);
          });
        }
      } else {
        var next = targets.reduce(function(acc, key) {
          var targetPath = [].concat(path, [key]);
          var data = storage.getItem(persistKey(targetPath));

          if (data !== undefined) {
            acc[key] = data;
          }

          return acc;
        }, {});
        applyRehydrationStrategy(state, next);
        replaceState(state);
      }
    });
  }

  return resolveRehydration;
}

function createActionCreator(actionDefinition, meta, references) {
  var prefix = actionDefinition[actionSymbol] ? '@action' : '@actionOn';
  var type = prefix + '.' + meta.path.join('.');
  var actionMeta =
    actionDefinition[actionSymbol] || actionDefinition[actionOnSymbol];
  actionMeta.actionName = meta.key;
  actionMeta.type = type;
  actionMeta.parent = meta.parent;
  actionMeta.path = meta.path;

  var actionCreator = function actionCreator(payload) {
    var action = {
      type: type,
      payload: payload,
    };

    if (actionDefinition[actionOnSymbol] && actionMeta.resolvedTargets) {
      payload.resolvedTargets = [].concat(actionMeta.resolvedTargets);
    }

    var result = references.dispatch(action);
    return result;
  };

  actionCreator.type = type;
  return actionCreator;
}

function createThunkHandler(
  thunkDefinition,
  meta,
  references,
  injections,
  actionCreators,
) {
  var thunkMeta =
    thunkDefinition[thunkSymbol] || thunkDefinition[thunkOnSymbol];
  return function(payload) {
    var helpers = {
      dispatch: references.dispatch,
      getState: function getState() {
        return get(meta.parent, references.getState());
      },
      getStoreActions: function getStoreActions() {
        return actionCreators;
      },
      getStoreState: references.getState,
      injections: injections,
      meta: meta,
    };

    if (thunkDefinition[thunkOnSymbol] && thunkMeta.resolvedTargets) {
      payload.resolvedTargets = [].concat(thunkMeta.resolvedTargets);
    }

    return thunkDefinition(get(meta.parent, actionCreators), payload, helpers);
  };
}
function createThunkActionsCreator(
  thunkDefinition,
  meta,
  references,
  thunkHandler,
) {
  var prefix = thunkDefinition[thunkSymbol] ? '@thunk' : '@thunkOn';
  var type = prefix + '.' + meta.path.join('.');
  var startType = type + '(start)';
  var successType = type + '(success)';
  var failType = type + '(fail)';
  var thunkMeta =
    thunkDefinition[thunkSymbol] || thunkDefinition[thunkOnSymbol];
  thunkMeta.type = type;
  thunkMeta.actionName = meta.key;
  thunkMeta.parent = meta.parent;
  thunkMeta.path = meta.path;

  var actionCreator = function actionCreator(payload) {
    var dispatchError = function dispatchError(err) {
      references.dispatch({
        type: failType,
        payload: payload,
        error: err,
      });
      references.dispatch({
        type: type,
        payload: payload,
        error: err,
      });
    };

    var dispatchSuccess = function dispatchSuccess(result) {
      references.dispatch({
        type: successType,
        payload: payload,
        result: result,
      });
      references.dispatch({
        type: type,
        payload: payload,
        result: result,
      });
    };

    references.dispatch({
      type: startType,
      payload: payload,
    });

    try {
      var result = references.dispatch(function() {
        return thunkHandler(payload);
      });

      if (isPromise(result)) {
        return result
          .then(function(resolved) {
            dispatchSuccess(resolved);
            return resolved;
          })
          .catch(function(err) {
            dispatchError(err);
            throw err;
          });
      }

      dispatchSuccess(result);
      return result;
    } catch (err) {
      dispatchError(err);
      throw err;
    }
  };

  actionCreator.type = type;
  actionCreator.startType = startType;
  actionCreator.successType = successType;
  actionCreator.failType = failType;
  return actionCreator;
}

function createListenerMiddleware(references) {
  return function() {
    return function(next) {
      return function(action) {
        var result = next(action);

        if (
          action &&
          references.internals.listenerActionMap[action.type] &&
          references.internals.listenerActionMap[action.type].length > 0
        ) {
          var sourceAction =
            references.internals.actionCreatorDict[action.type];
          references.internals.listenerActionMap[action.type].forEach(function(
            actionCreator,
          ) {
            actionCreator({
              type: sourceAction ? sourceAction.type : action.type,
              payload: action.payload,
              error: action.error,
              result: action.result,
            });
          });
        }

        return result;
      };
    };
  };
}
function bindListenerDefinitions(
  listenerDefinitions,
  actionCreators,
  actionCreatorDict,
  listenerActionMap,
) {
  listenerDefinitions.forEach(function(listenerActionOrThunk) {
    var listenerMeta =
      listenerActionOrThunk[actionOnSymbol] ||
      listenerActionOrThunk[thunkOnSymbol];
    var targets = listenerMeta.targetResolver(
      get(listenerMeta.parent, actionCreators),
      actionCreators,
    );
    var targetTypes = (Array.isArray(targets) ? targets : [targets]).reduce(
      function(acc, target) {
        if (
          typeof target === 'function' &&
          target.type &&
          actionCreatorDict[target.type]
        ) {
          acc.push(target.type);
        } else if (typeof target === 'string') {
          acc.push(target);
        }

        return acc;
      },
      [],
    );
    listenerMeta.resolvedTargets = targetTypes;
    targetTypes.forEach(function(targetType) {
      var listenerReg = listenerActionMap[targetType] || [];
      listenerReg.push(actionCreatorDict[listenerMeta.type]);
      listenerActionMap[targetType] = listenerReg;
    });
  });
}

function createComputedPropertyBinder(
  parentPath,
  key,
  definition,
  computedState,
  references,
) {
  var computedMeta = definition[computedSymbol];
  var memoisedResultFn = memoizerific(1)(definition);
  return function createComputedProperty(o) {
    Object.defineProperty(o, key, {
      configurable: true,
      enumerable: true,
      get: function get$1() {
        var storeState;

        if (computedState.isInReducer) {
          storeState = computedState.currentState;
        } else if (references.getState == null) {
          return undefined;
        } else {
          try {
            storeState = references.getState();
          } catch (err) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Invalid access attempt to a computed property');
            }

            return undefined;
          }
        }

        var state = get(parentPath, storeState);

        var inputs = computedMeta.stateResolvers.map(function(resolver) {
          return resolver(state, storeState);
        });
        return memoisedResultFn.apply(void 0, inputs);
      },
    });
  };
}
function createComputedPropertiesMiddleware(references) {
  return function(store) {
    return function(next) {
      return function(action) {
        references.internals.computedState.currentState = store.getState();
        references.internals.computedState.isInReducer = true;
        return next(action);
      };
    };
  };
}

function extractDataFromModel(model, initialState, injections, references) {
  var defaultState = initialState;
  var actionCreatorDict = {};
  var actionCreators = {};
  var actionReducersDict = {};
  var actionThunks = {};
  var computedProperties = [];
  var customReducers = [];
  var listenerActionCreators = {};
  var listenerActionMap = {};
  var listenerDefinitions = [];
  var persistenceConfig = [];
  var computedState = {
    isInReducer: false,
    currentState: defaultState,
  };

  var recursiveExtractFromModel = function recursiveExtractFromModel(
    current,
    parentPath,
  ) {
    return Object.keys(current).forEach(function(key) {
      var value = current[key];
      var path = [].concat(parentPath, [key]);
      var meta = {
        parent: parentPath,
        path: path,
        key: key,
      };

      var handleValueAsState = function handleValueAsState() {
        var initialParentRef = get(parentPath, initialState);

        if (initialParentRef && key in initialParentRef) {
          set(path, defaultState, initialParentRef[key]);
        } else {
          set(path, defaultState, value);
        }
      };

      if (key === persistSymbol) {
        persistenceConfig.push(extractPersistConfig(parentPath, value));
        return;
      }

      if (typeof value === 'function') {
        if (value[actionSymbol] || value[actionOnSymbol]) {
          var actionReducer = value;
          var actionCreator = createActionCreator(value, meta, references);
          actionCreatorDict[actionCreator.type] = actionCreator;
          actionReducersDict[actionCreator.type] = actionReducer;

          if (meta.key !== 'ePRS') {
            if (value[actionOnSymbol]) {
              listenerDefinitions.push(value);
              set(path, listenerActionCreators, actionCreator);
            } else {
              set(path, actionCreators, actionCreator);
            }
          }
        } else if (value[thunkSymbol] || value[thunkOnSymbol]) {
          var thunkHandler = createThunkHandler(
            value,
            meta,
            references,
            injections,
            actionCreators,
          );

          var _actionCreator = createThunkActionsCreator(
            value,
            meta,
            references,
            thunkHandler,
          );

          set(path, actionThunks, thunkHandler);
          actionCreatorDict[_actionCreator.type] = _actionCreator;

          if (value[thunkOnSymbol]) {
            listenerDefinitions.push(value);
            set(path, listenerActionCreators, _actionCreator);
          } else {
            set(path, actionCreators, _actionCreator);
          }
        } else if (value[computedSymbol]) {
          var parent = get(parentPath, defaultState);
          var bindComputedProperty = createComputedPropertyBinder(
            parentPath,
            key,
            value,
            computedState,
            references,
          );
          bindComputedProperty(parent);
          computedProperties.push({
            key: key,
            parentPath: parentPath,
            bindComputedProperty: bindComputedProperty,
          });
        } else if (value[reducerSymbol]) {
          customReducers.push({
            key: key,
            parentPath: parentPath,
            reducer: value,
          });
        } else {
          handleValueAsState();
        }
      } else if (isPlainObject(value)) {
        var existing = get(path, defaultState);

        if (existing == null) {
          set(path, defaultState, {});
        }

        recursiveExtractFromModel(value, path);
      } else {
        handleValueAsState();
      }
    });
  };

  recursiveExtractFromModel(model, []);
  bindListenerDefinitions(
    listenerDefinitions,
    actionCreators,
    actionCreatorDict,
    listenerActionMap,
  );
  return {
    actionCreatorDict: actionCreatorDict,
    actionCreators: actionCreators,
    actionReducersDict: actionReducersDict,
    computedProperties: computedProperties,
    customReducers: customReducers,
    computedState: computedState,
    defaultState: defaultState,
    listenerActionCreators: listenerActionCreators,
    listenerActionMap: listenerActionMap,
    persistenceConfig: persistenceConfig,
  };
}

function createStoreInternals(_ref) {
  var disableImmer = _ref.disableImmer,
    initialState = _ref.initialState,
    injections = _ref.injections,
    model = _ref.model,
    reducerEnhancer = _ref.reducerEnhancer,
    references = _ref.references;

  var _extractDataFromModel = extractDataFromModel(
      model,
      initialState,
      injections,
      references,
    ),
    actionCreatorDict = _extractDataFromModel.actionCreatorDict,
    actionCreators = _extractDataFromModel.actionCreators,
    actionReducersDict = _extractDataFromModel.actionReducersDict,
    computedState = _extractDataFromModel.computedState,
    computedProperties = _extractDataFromModel.computedProperties,
    customReducers = _extractDataFromModel.customReducers,
    defaultState = _extractDataFromModel.defaultState,
    listenerActionCreators = _extractDataFromModel.listenerActionCreators,
    listenerActionMap = _extractDataFromModel.listenerActionMap,
    persistenceConfig = _extractDataFromModel.persistenceConfig;

  var rootReducer = createReducer(
    disableImmer,
    actionReducersDict,
    customReducers,
    computedProperties,
  );
  return {
    actionCreatorDict: actionCreatorDict,
    actionCreators: actionCreators,
    computedProperties: computedProperties,
    computedState: computedState,
    defaultState: defaultState,
    listenerActionCreators: listenerActionCreators,
    listenerActionMap: listenerActionMap,
    persistenceConfig: persistenceConfig,
    reducer: reducerEnhancer(rootReducer),
  };
}

function createStore(model, options) {
  if (options === void 0) {
    options = {};
  }

  var modelClone = deepCloneStateWithoutComputed(model);
  var _options = options,
    compose = _options.compose,
    _options$devTools = _options.devTools,
    devTools = _options$devTools === void 0 ? true : _options$devTools,
    _options$disableImmer = _options.disableImmer,
    disableImmer =
      _options$disableImmer === void 0 ? false : _options$disableImmer,
    _options$enhancers = _options.enhancers,
    enhancers = _options$enhancers === void 0 ? [] : _options$enhancers,
    _options$initialState = _options.initialState,
    initialState =
      _options$initialState === void 0 ? {} : _options$initialState,
    injections = _options.injections,
    _options$middleware = _options.middleware,
    middleware = _options$middleware === void 0 ? [] : _options$middleware,
    _options$mockActions = _options.mockActions,
    mockActions =
      _options$mockActions === void 0 ? false : _options$mockActions,
    _options$name = _options.name,
    storeName = _options$name === void 0 ? 'EasyPeasyStore' : _options$name,
    _options$reducerEnhan = _options.reducerEnhancer,
    reducerEnhancer =
      _options$reducerEnhan === void 0
        ? function(rootReducer) {
            return rootReducer;
          }
        : _options$reducerEnhan;

  var bindReplaceState = function bindReplaceState(modelDef) {
    return _extends({}, modelDef, {
      ePRS: action(function(_, payload) {
        return payload;
      }),
    });
  };

  var references = {};
  var modelDefinition = bindReplaceState(modelClone);
  var mockedActions = [];

  var persistKey = function persistKey(targetPath) {
    return '[' + storeName + ']@' + targetPath.join('.');
  };

  var persistor = createPersistor(persistKey, references);
  var persistMiddleware = createPersistMiddleware(persistor, references);
  var clearPersistance = createPersistenceClearer(persistKey, references);

  var replaceState = function replaceState(nextState) {
    return references.internals.actionCreatorDict['@action.ePRS'](nextState);
  };

  var bindStoreInternals = function bindStoreInternals(state) {
    if (state === void 0) {
      state = {};
    }

    references.internals = createStoreInternals({
      disableImmer: disableImmer,
      initialState: state,
      injections: injections,
      model: modelDefinition,
      reducerEnhancer: reducerEnhancer,
      references: references,
    });
  };

  var mockActionsMiddleware = function mockActionsMiddleware() {
    return function() {
      return function(action) {
        if (action != null) {
          mockedActions.push(action);
        }

        return undefined;
      };
    };
  };

  var composeEnhancers =
    compose ||
    (devTools &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          name: storeName,
        })
      : redux.compose);
  bindStoreInternals(initialState);
  var easyPeasyMiddleware = [
    createComputedPropertiesMiddleware(references),
    reduxThunk,
  ].concat(middleware, [
    createListenerMiddleware(references),
    persistMiddleware,
  ]);

  if (mockActions) {
    easyPeasyMiddleware.push(mockActionsMiddleware);
  }

  var store = redux.createStore(
    references.internals.reducer,
    references.internals.defaultState,
    composeEnhancers.apply(
      void 0,
      [redux.applyMiddleware.apply(void 0, easyPeasyMiddleware)].concat(
        enhancers,
      ),
    ),
  );
  store.subscribe(function() {
    references.internals.computedState.isInReducer = false;
  });
  references.dispatch = store.dispatch;
  references.getState = store.getState;

  var bindActionCreators = function bindActionCreators() {
    Object.keys(store.dispatch).forEach(function(actionsKey) {
      delete store.dispatch[actionsKey];
    });
    Object.keys(references.internals.actionCreators).forEach(function(key) {
      store.dispatch[key] = references.internals.actionCreators[key];
    });
  };

  bindActionCreators();

  var rebindStore = function rebindStore(removeKey) {
    var currentState = store.getState();

    if (removeKey) {
      delete currentState[removeKey];
    }

    bindStoreInternals(currentState);
    store.replaceReducer(references.internals.reducer);
    replaceState(references.internals.defaultState);
    bindActionCreators();
  };

  var _resolveRehydration = rehydrateStateFromPersistIfNeeded(
    persistKey,
    replaceState,
    references,
  );

  return Object.assign(store, {
    addModel: function addModel(key, modelForKey) {
      if (modelDefinition[key] && process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(
          'easy-peasy: The store model already contains a model definition for "' +
            key +
            '"',
        );
        store.removeModel(key);
      }

      modelDefinition[key] = modelForKey;
      rebindStore();
    },
    clearMockedActions: function clearMockedActions() {
      mockedActions = [];
    },
    getActions: function getActions() {
      return references.internals.actionCreators;
    },
    getListeners: function getListeners() {
      return references.internals.listenerActionCreators;
    },
    getMockedActions: function getMockedActions() {
      return [].concat(mockedActions);
    },
    persist: {
      clear: clearPersistance,
      flush: function flush() {
        return persistor.flush();
      },
      resolveRehydration: function resolveRehydration() {
        return _resolveRehydration;
      },
    },
    reconfigure: function reconfigure(newModel) {
      modelDefinition = bindReplaceState(newModel);
      rebindStore();
    },
    removeModel: function removeModel(key) {
      if (!modelDefinition[key]) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn(
            'easy-peasy: The store model does not contain a model definition for "' +
              key +
              '"',
          );
        }

        return;
      }

      delete modelDefinition[key];
      rebindStore(key);
    },
  });
}

/* eslint-disable react/prop-types */
function createContextStore(model, config) {
  var StoreContext = React.createContext();

  function Provider(_ref) {
    var children = _ref.children,
      initialData = _ref.initialData;
    var store = React.useMemo(function() {
      return createStore(
        typeof model === 'function' ? model(initialData) : model,
        config,
      );
    }, []);
    return React__default.createElement(
      StoreContext.Provider,
      {
        value: store,
      },
      children,
    );
  }

  function useStore() {
    return React.useContext(StoreContext);
  }

  return {
    Provider: Provider,
    useStore: useStore,
    useStoreState: createStoreStateHook(StoreContext),
    useStoreActions: createStoreActionsHook(StoreContext),
    useStoreDispatch: createStoreDispatchHook(StoreContext),
    useStoreRehydrated: createStoreRehydratedHook(StoreContext),
  };
}

/**
 * Some good references on the topic of reinitialisation:
 * - https://github.com/facebook/react/issues/14830
 */

function createComponentStore(model, config) {
  return function useLocalStore(initialData) {
    var store = React.useMemo(function() {
      return createStore(
        typeof model === 'function' ? model(initialData) : model,
        config,
      );
    }, []);
    var previousStateRef = React.useRef(store.getState());

    var _useState = React.useState(function() {
        return store.getState();
      }),
      currentState = _useState[0],
      setCurrentState = _useState[1];

    React.useEffect(
      function() {
        return store.subscribe(function() {
          var nextState = store.getState();

          if (previousStateRef.current !== nextState) {
            previousStateRef.current = nextState;
            setCurrentState(nextState);
          }
        });
      },
      [store],
    );
    return [currentState, store.getActions()];
  };
}

/**
 * This file has been copied from redux-persist.
 * The intention being to support as much of the redux-persist API as possible.
 */
function createTransform(inbound, outbound, config) {
  if (config === void 0) {
    config = {};
  }

  var whitelist = config.whitelist || null;
  var blacklist = config.blacklist || null;

  function whitelistBlacklistCheck(key) {
    if (whitelist && whitelist.indexOf(key) === -1) return true;
    if (blacklist && blacklist.indexOf(key) !== -1) return true;
    return false;
  }

  return {
    in: function _in(data, key, fullState) {
      return !whitelistBlacklistCheck(key) && inbound
        ? inbound(data, key, fullState)
        : data;
    },
    out: function out(data, key, fullState) {
      return !whitelistBlacklistCheck(key) && outbound
        ? outbound(data, key, fullState)
        : data;
    },
  };
}

function StoreProvider(_ref) {
  var children = _ref.children,
    store = _ref.store;
  return React__default.createElement(
    StoreContext.Provider,
    {
      value: store,
    },
    children,
  );
}

/**
 * The auto freeze feature of immer doesn't seem to work in our testing. We have
 * explicitly disabled it to avoid perf issues.
 */

immerPeasy.setAutoFreeze(false);

exports.StoreProvider = StoreProvider;
exports.action = action;
exports.actionOn = actionOn;
exports.computed = computed;
exports.createComponentStore = createComponentStore;
exports.createContextStore = createContextStore;
exports.createStore = createStore;
exports.createTransform = createTransform;
exports.createTypedHooks = createTypedHooks;
exports.debug = debug;
exports.memo = memo;
exports.persist = persist;
exports.reducer = reducer;
exports.thunk = thunk;
exports.thunkOn = thunkOn;
exports.useStore = useStore;
exports.useStoreActions = useStoreActions;
exports.useStoreDispatch = useStoreDispatch;
exports.useStoreRehydrated = useStoreRehydrated;
exports.useStoreState = useStoreState;
//# sourceMappingURL=easy-peasy.cjs.js.map
