import React, { Component } from 'react';
import axios from 'axios';
import { Table } from 'antd';

import { natures } from './configs/naturesConfig';
import { getUuid } from './services/commonService';
import MainForm from './component/mainForm';
import FilterForm from './component/filterForm';

import styles from './App.module.scss';

class App extends Component {
  columns = [
    {
      title: '帧位',
      dataIndex: 'index',
    },
    {
      title: 'Seed',
      dataIndex: 'seed',
    },
    {
      title: '加密常数',
      dataIndex: 'ec',
    },
    {
      title: 'PID',
      dataIndex: 'pid',
    },
    {
      title: '闪光',
      dataIndex: 'shinyType',
    },
    {
      title: '特性',
      dataIndex: 'ability',
    },
    {
      title: '性别',
      dataIndex: 'gender',
    },
    {
      title: '性格',
      dataIndex: 'nature',
      render: (nature) => natures[nature].name,
    },
    {
      title: '个体',
      dataIndex: 'IVs',
      render: (IVs) => JSON.stringify(IVs),
    },
  ];
  htmlRef = React.createRef();
  list = [];

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      test: '',
      isPagination: false,
      loading: false,
    };
  }

  getFilterList = (body, minResults) => {
    this.setState({ loading: true });
    axios.get(`http://localhost:8888/?${body}`).then((response) => {
      console.log('response', response.data);
      const list = this.getMinList(response.data.filter, minResults);
      this.list = list;
      console.log('list', list);
      this.setState({
        test: response.data.result,
        list: list,
        loading: false,
      });
    }).catch(() => {
      this.setState({
        loading: false,
      });
    });
  };

  getMinList = (list, minResults) => {
    return list.filter((item) => {
      return item.index >= minResults;
    });
  };

  handleSubmit = (values) => {
    let body = '';
    Object.keys(values).forEach((key) => {
      if (typeof values[key] === 'string') {
        body += `${key}=${parseInt(values[key], 16)}&`;
      } else if (values[key] instanceof Array) {
        body += `${key}=${values[key].join(',')}&`;
      } else {
        body += `${key}=${values[key]}&`;
      }
    });

    this.getFilterList(body, values['minResults']);
  };

  download = () => {
    const { list } = this.state;
    let text = '';
    list.forEach((item) => {
      const { index, seed, ec, pid, shinyType, ability, gender, nature, IVs } = item;
      text += `${index}  ${seed}  ${ec}  ${pid}  ${shinyType}  ` +
        `${ability}  ${gender}  ${natures[nature].name}  ${JSON.stringify(IVs)}

`;
    });

    const value = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
    const element = document.createElement('a');
    element.setAttribute('href', value);
    element.setAttribute('download', getUuid());
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  filterIVs = ({ ivs }) => {
    const filter = this.list.filter(({ IVs }) => {
      return this.equal(IVs, ivs);
    });
    this.setState({
      list: filter,
    });
  };

  equal = (a, b) => {
    // 判断数组的长度
    if (a.length !== b.length) {
      return false;
    } else {
      // 循环遍历数组的值进行比较
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }
  };

  render() {
    const { list } = this.state;
    return (
      <div className={styles.container}>
        <MainForm handleSubmit={this.handleSubmit} download={this.download} list={list}/>

        <FilterForm handleSubmit={this.filterIVs}/>

        {this.renderIndividualValue(list)}

        <p>如果用的顺手，打赏一下吧，目前还在更新中，有问题可以给我提一下</p>

        <div className={styles.pay}>
          <img src={require('./assets/images/alipay.jpeg')} alt="alipay"/>
          <img src={require('./assets/images/wepay.png')} alt="wepay"/>
        </div>
      </div>
    );
  }

  renderIndividualValue = (list) => {
    const { isPagination, loading } = this.state;
    return (
      <Table
        ref={this.htmlRef}
        className={styles.tableWrap}
        loading={loading}
        rowKey='seed'
        dataSource={list}
        pagination={{
          pageSize: isPagination ? list.length : 10,
          hideOnSinglePage: true,
        }}
        columns={this.columns}
      />
    );
  };
}

export default App;
