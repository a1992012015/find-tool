const addInterceptor = (target, candidate, injectedParameters) => {
  if (!candidate) {
    return;
  }
  const successInterceptor = typeof candidate === 'function' ? candidate : candidate.success;
  const errorInterceptor = candidate && candidate.error;
  target.use(
    successInterceptor && successInterceptor.bind(null, injectedParameters),
    errorInterceptor && errorInterceptor.bind(null, injectedParameters),
  );
};

const bindInterceptors = (
  client,
  injectedParameters,
  middlewareInterceptors = {},
  clientInterceptors = {},
) => {
  [
    ...middlewareInterceptors.request || [],
    ...clientInterceptors.request || [],
  ].forEach((interceptor) => {
    addInterceptor(client.interceptors.request, interceptor, injectedParameters);
  });
  [
    ...middlewareInterceptors.response || [],
    ...clientInterceptors.response || [],
  ].forEach((interceptor) => {
    addInterceptor(client.interceptors.response, interceptor, injectedParameters);
  });
};

export const axiosMiddleware = (clientOptions = []) => {
  let firstCall = true;
  return ({ getState, dispatch }) => (next) => (action) => {
    if (firstCall) {
      firstCall = false;
      clientOptions.forEach(({ client, interceptors }) => {
        const injectToInterceptor = { getState, dispatch };
        const clientInterceptors = client.options && client.options.interceptors;
        bindInterceptors(client, injectToInterceptor, interceptors, clientInterceptors);
      });
    }
    return next(action);
  };
};
