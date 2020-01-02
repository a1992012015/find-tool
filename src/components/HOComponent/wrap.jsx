import React from 'react';

/**
 * 异步路由动画第一次无法加载解决方案
 * @param WrappedComponent
 * @returns {function(): *}
 */
export const wrap = (WrappedComponent) => () => (
  <div className='wrap-container'>
    <WrappedComponent/>
  </div>
);
