import React from 'react';

import { BaseComponent } from '../../baseClass/ShouldComponentUpdate';

import styles from './Error.module.scss';

export default class extends BaseComponent {
  render() {
    return <div className={styles['error']}>This is 404!!!</div>;
  }
}
