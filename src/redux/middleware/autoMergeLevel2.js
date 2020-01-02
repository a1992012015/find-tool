const isPlainEnoughObject = (o) => {
  return o !== null && !Array.isArray(o) && typeof o === 'object';
};

const autoMergeLevel2 = (inboundState, originalState, reducedState) => {
  let newState = { ...reducedState };
  // only rehydrate if inboundState exists and is an object
  if (inboundState && typeof inboundState === 'object') {
    Object.keys(inboundState).forEach((key) => {
      // ignore _persist data
      if (key === '_persist') {
        return;
      }
      // if reducer modifies substate, skip auto rehydration
      if (originalState[key] !== reducedState[key]) {
        return;
      }
      if (isPlainEnoughObject(reducedState[key])) {
        // if object is plain enough shallow merge the new values (hence "Level2")
        newState[key] = inboundState[key].merge(newState[key]);
        return;
      }
      // otherwise hard set
      newState[key] = inboundState[key];
    });
  }
  return newState;
};

export {
  autoMergeLevel2,
};
