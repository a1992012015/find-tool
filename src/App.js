import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import axios from 'axios';
import isElectron from 'is-electron';
import { Table } from 'antd';

import { natures } from './configs/naturesConfig';
import { getUuid } from './services/commonService';
import MainForm from './component/MainForm';
import FindForm from './component/FindForm';

import styles from './App.module.scss';
import FilterForm from './component/FilterForm';

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
      dataIndex: 'proportion',
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
      gender: 3,
    };
  }

  componentDidMount() {
    if (isElectron()) {
      window.ipcRenderer.on('message', (event, text) => {
        console.log('event', event);
        console.log('arguments', arguments);
        console.log('arguments', text);
        // this.tips = text;
      });
      //注意：“downloadProgress”事件可能存在无法触发的问题，只需要限制一下下载网速就好了
      window.ipcRenderer.on('downloadProgress', (event, progressObj) => {
        console.log('progressObj', progressObj);
        console.log('event', event);
        // this.downloadPercent = progressObj.percent || 0;
      });
      window.ipcRenderer.on('isUpdateNow', () => {
        console.log('isUpdateNow');
        window.ipcRenderer.send('isUpdateNow');
      });
    }

  }

  getFilterList = (body, minResults) => {
    this.setState({ loading: true });
    axios.get(`http://localhost:8888/?${body}`).then((response) => {
      console.log('response', response.data);
      let list = this.getMinList(response.data.filter, minResults);
      list = this.changeGender(list, this.state.gender);
      this.list = list;
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

  getSearchList = (values) => {
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

  filterSearchList = (values) => {
    const { list } = this.state;

    this.setState({
      list: this.changeGender(list, values),
    });
  };

  changeGender = (list, value) => {
    return list.map((item) => {
      const { gender } = item;
      const proportion = this.getGender(gender, value);
      item.proportion = proportion === 0 ? '母' : proportion === 1 ? '公' : '无';
      return item;
    });
  };

  getGender = (gender, proportion) => {
    const num = 254;
    let genderNum = 0;
    switch (proportion) {
      case 0:
        return 0;
      case 1:
        genderNum = new BigNumber(gender).div(new BigNumber(num).div(8)).toFormat();
        genderNum = Math.ceil(Number(genderNum));
        return genderNum <= 7 ? 0 : 1;
      case 2:
        genderNum = new BigNumber(gender).div(new BigNumber(num).div(4)).toFormat();
        genderNum = Math.ceil(Number(genderNum));
        return genderNum <= 3 ? 0 : 1;
      case 4:
        genderNum = new BigNumber(gender).div(new BigNumber(num).div(4)).toFormat();
        genderNum = Math.ceil(Number(genderNum));
        return genderNum <= 1 ? 0 : 1;
      case 5:
        genderNum = new BigNumber(gender).div(new BigNumber(num).div(8)).toFormat();
        genderNum = Math.ceil(Number(genderNum));
        return genderNum <= 1 ? 0 : 1;
      case 6:
        return 1;
      case 7:
        return 2;
      case 3:
      default:
        genderNum = new BigNumber(gender).div(new BigNumber(num).div(2)).toFormat();
        genderNum = Math.ceil(Number(genderNum));
        return genderNum <= 1 ? 0 : 1;
    }
  };

  render() {
    const { list, gender } = this.state;
    return (
      <div className={styles.container}>
        <MainForm handleSubmit={this.getSearchList} download={this.download} list={list}/>

        <FindForm handleSubmit={this.filterIVs}/>

        <FilterForm handleSubmit={this.filterSearchList} gender={gender}/>

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
