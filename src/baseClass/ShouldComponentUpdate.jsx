import { Component } from 'react';
import { is } from 'immutable';

export class BaseComponent extends Component {
  /* eslint-disable-next-line */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const thisProps = this.props || {};
    const thisState = this.state || {};
    nextState = nextState || {};
    nextProps = nextProps || {};

    if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length) {
      return true;
    }

    for (const key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        if (!is(thisProps[key], nextProps[key])) {
          return true;
        }
      }
    }

    for (const key in nextState) {
      if (nextState.hasOwnProperty(key)) {
        if (!is(thisState[key], nextState[key])) {
          return true;
        }
      }
    }

    return false;
  }
}
