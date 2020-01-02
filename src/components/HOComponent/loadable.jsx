import React from 'react';
import PropTypes from 'prop-types';

import { RouterLoading } from './routerLoading';
import { BaseComponent } from '../../baseClass/ShouldComponentUpdate';

const ALL_INITIALIZERS = [];
const READY_INITIALIZERS = [];

const load = (loader) => {
  let promise = loader();

  let state = {
    loading: true,
    loaded: null,
    error: null,
  };

  state.promise = promise
    .then(loaded => {
      state.loading = false;
      state.loaded = loaded;
      return loaded;
    })
    .catch(err => {
      state.loading = false;
      state.error = err;
      throw err;
    });

  return state;
};

const loadMap = (obj) => {
  let state = {
    loading: false,
    loaded: {},
    error: null,
  };

  let promises = [];

  try {
    Object.keys(obj).forEach(key => {
      let result = load(obj[key]);

      if (!result.loading) {
        state.loaded[key] = result.loaded;
        state.error = result.error;
      } else {
        state.loading = true;
      }

      promises.push(result.promise);

      result.promise
        .then(res => {
          state.loaded[key] = res;
        })
        .catch(err => {
          state.error = err;
        });
    });
  } catch (err) {
    state.error = err;
  }

  state.promise = Promise.all(promises)
    .then(res => {
      state.loading = false;
      return res;
    })
    .catch(err => {
      state.loading = false;
      throw err;
    });

  return state;
};

const resolves = (obj) => {
  return obj && obj.__esModule ? obj.default : obj;
};

const render = (loaded, props) => {
  return React.createElement(resolves(loaded), props);
};

const createLoadableComponent = (loadFn, options) => {
  if (!options.loading) {
    throw new Error('react-loadable requires a `loading` component');
  }

  let opts = Object.assign(
    {
      loader: null,
      loading: null,
      delay: 200,
      timeout: null,
      render: render,
      webpack: null,
      modules: null,
    },
    options,
  );

  let res = null;

  const init = () => {
    if (!res) {
      res = loadFn(opts.loader);
    }
    return res.promise;
  };

  ALL_INITIALIZERS.push(init);

  if (typeof opts.webpack === 'function') {
    READY_INITIALIZERS.push(() => {
      return init();
    });
  }

  return class LoadableComponent extends BaseComponent {
    constructor(props) {
      super(props);
      init();

      this.state = {
        error: res.error,
        pastDelay: false,
        timedOut: false,
        loading: res.loading,
        loaded: res.loaded,
      };
    }

    _delay = null;
    _timeout = null;
    _mounted = false;

    static contextTypes = {
      loadable: PropTypes.shape({
        report: PropTypes.func.isRequired,
      }),
    };

    static preload = () => {
      return init();
    };

    componentDidMount() {
      this._mounted = true;
      this.loadModule();
    }

    componentWillUnmount() {
      this._mounted = false;
      this.clearTimeouts();
    }

    loadModule = () => {
      if (this.context.loadable && Array.isArray(opts.modules)) {
        opts.modules.forEach(moduleName => {
          this.context.loadable.report(moduleName);
        });
      }

      if (!res.loading) {
        return;
      }

      if (typeof opts.delay === 'number') {
        if (opts.delay === 0) {
          this.setState({ pastDelay: true });
        } else {
          this._delay = setTimeout(() => {
            this.setState({ pastDelay: true });
          }, opts.delay);
        }
      }

      if (typeof opts.timeout === 'number') {
        this._timeout = setTimeout(() => {
          this.setState({ timedOut: true });
        }, opts.timeout);
      }

      res.promise.then(() => {
        this.update(res);
      }).catch(() => {
        this.update(res);
      });
    };

    update = (response) => {
      if (this._mounted) {
        this.setState({
          error: response.error,
          loaded: response.loaded,
          loading: response.loading,
        });

        this.clearTimeouts();
      }
    };

    clearTimeouts = () => {
      clearTimeout(this._delay);
      clearTimeout(this._timeout);
    };

    retry = () => {
      this.setState({ error: null, loading: true, timedOut: false });
      res = loadFn(opts.loader);
      this.loadModule();
    };

    render() {
      if (this.state.loading || this.state.error) {
        return React.createElement(opts.loading, {
          isLoading: this.state.loading,
          pastDelay: this.state.pastDelay,
          timedOut: this.state.timedOut,
          error: this.state.error,
          retry: this.retry,
        });
      } else if (this.state.loaded) {
        return opts.render(this.state.loaded, this.props);
      } else {
        return null;
      }
    }
  };
};

const loadable = (loader) => {
  return createLoadableComponent(load, {
    loader: loader,
    loading: RouterLoading,
  });
};

const LoadableMap = (opts) => {
  if (typeof opts.render !== 'function') {
    throw new Error('LoadableMap requires a `render(loaded, props)` function');
  }

  return createLoadableComponent(loadMap, opts);
};

loadable.Map = LoadableMap;

class Capture extends BaseComponent {
  static propTypes = {
    report: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    loadable: PropTypes.shape({
      report: PropTypes.func.isRequired,
    }).isRequired,
  };

  getChildContext() {
    return {
      loadable: {
        report: this.props.report,
      },
    };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

loadable.Capture = Capture;

const flushInitializers = (initializers) => {
  let promises = [];

  while (initializers.length) {
    let init = initializers.pop();
    promises.push(init());
  }

  return Promise.all(promises).then(() => {
    if (initializers.length) {
      return flushInitializers(initializers);
    } else {
      return null;
    }
  });
};

loadable.preloadAll = () => {
  return new Promise((resolve, reject) => {
    flushInitializers(ALL_INITIALIZERS).then(resolve, reject);
  });
};

loadable.preloadReady = () => {
  return new Promise((resolve) => {
    // We always will resolve, errors should be handled within loading UIs.
    flushInitializers(READY_INITIALIZERS).then(resolve, resolve);
  });
};

export {
  loadable,
};
