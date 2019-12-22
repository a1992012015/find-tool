import React, { Component } from 'react';
import axios from 'axios';
import { Button, Col, Form, Input, InputNumber, Row, Select, Table } from 'antd';

import { natures } from './configs/naturesConfig';
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

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      test: '',
      isPagination: false,
      loading: false,
    };
  }

  getFilterList = (body) => {
    // const defaultBody = {
    //   pid: 0x8F18CFBE,
    //   ec: 0xAEB98D74,
    //   IVs: [16, 31, 31, 31, 31, 6],
    //   usefilters: 1,
    //   maxResults: 5000,
    //   flawlessiv: 4,
    //   ha: 1,
    //   randomGender: 1,
    // };
    this.setState({ loading: true });
    axios.get(`http://localhost:8888/?${body}`).then((response) => {
      console.log('response', response.data);
      this.setState({
        test: response.data.result,
        list: response.data.filter,
        loading: false
      });
    }).catch(() => {
      this.setState({
        loading: false
      });
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
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

        console.log(body);

        this.getFilterList(body);
      }
    });
  };

  getAllGender = (data, proportion) => {
    return data;
  };

  getGender = (gender, proportion) => {
    const num = 254;
    switch (proportion) {
      case 0:
        const gender17 = Math.ceil(gender / (num / 8));
        return gender17 > 1;
      case 1:
        const gender13 = Math.ceil(gender / (num / 4));
        return gender13 > 1;
      case 3:
        const gender31 = Math.ceil(gender / (num / 4));
        return gender31 > 3;
      case 4:
        const gender71 = Math.ceil(gender / (num / 4));
        return gender71 > 7;
      case 2:
      default:
        const gender11 = Math.ceil(gender / (num / 2));
        return gender11 > 1;
    }
  };

  changeGender = (value) => {
    this.setState({
      list: this.getAllGender(this.state.list, value),
    });
  };

  downloadPDF = () => {
    console.log('213123123123');
  };

  render() {
    const { list } = this.state;
    const { form } = this.props;
    return (
      <div className={styles.container}>
        <Form className='ant-advanced-search-form' onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item key='pid' label='PID'>
                {form.getFieldDecorator('pid', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: '0x',
                })(<Input/>)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='ec' label='加密常数'>
                {form.getFieldDecorator('ec', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: '0x',
                })(<Input/>)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='usefilters' label='是否使用过滤'>
                {form.getFieldDecorator('usefilters', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 1,
                })(
                  <Select>
                    <Select.Option value={1}>是</Select.Option>
                    <Select.Option value={0}>否</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='maxResults' label='最大检索范围'>
                {form.getFieldDecorator('maxResults', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 1500,
                })(<InputNumber className={styles.numberWrap} min={1}/>)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='flawlessiv' label='目标保底个体V数'>
                {form.getFieldDecorator('flawlessiv', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 4,
                })(
                  <Select>
                    <Select.Option value={2}>保底2V（三星洞）</Select.Option>
                    <Select.Option value={3}>保底3V（四星洞或活动超级巨三星洞）</Select.Option>
                    <Select.Option value={4}>保底4V（五星洞或活动超级巨四星洞）</Select.Option>
                    <Select.Option value={5}>保底5V（活动超级巨五星洞）</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='ha' label='检索梦特'>
                {form.getFieldDecorator('ha', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 1,
                })(
                  <Select>
                    <Select.Option value={1}>是</Select.Option>
                    <Select.Option value={0}>否</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='randomGender' label='性别是否随机'>
                {form.getFieldDecorator('randomGender', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 1,
                })(
                  <Select>
                    <Select.Option value={1}>是</Select.Option>
                    <Select.Option value={0}>否</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='isShinyType' label='只看闪光'>
                {form.getFieldDecorator('isShinyType', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 1,
                })(
                  <Select>
                    <Select.Option value={1}>是</Select.Option>
                    <Select.Option value={0}>否</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='proportion' label='目标性别比例'>
                {form.getFieldDecorator('proportion', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 2,
                })(
                  <Select onSelect={this.changeGender}>
                    <Select.Option value={0}>1(公):7(母)</Select.Option>
                    <Select.Option value={1}>1(公):3(母)</Select.Option>
                    <Select.Option value={2}>1(公):1(母)</Select.Option>
                    <Select.Option value={3}>3(公):1(母)</Select.Option>
                    <Select.Option value={4}>1(公):7(母)</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='hp' label='HP'>
                {form.getFieldDecorator('IVs[0]', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 31,
                })(<InputNumber className={styles.numberWrap} min={0} max={31}/>)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='atk' label='ATK'>
                {form.getFieldDecorator('IVs[1]', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 31,
                })(<InputNumber className={styles.numberWrap} min={0} max={31}/>)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='def' label='DEF'>
                {form.getFieldDecorator('IVs[2]', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 31,
                })(<InputNumber className={styles.numberWrap} min={0} max={31}/>)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='spa' label='SPA'>
                {form.getFieldDecorator('IVs[3]', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 31,
                })(<InputNumber className={styles.numberWrap} min={0} max={31}/>)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='spd' label='SPD'>
                {form.getFieldDecorator('IVs[4]', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 31,
                })(<InputNumber className={styles.numberWrap} min={0} max={31}/>)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item key='spe' label='SPE'>
                {form.getFieldDecorator('IVs[5]', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: 31,
                })(<InputNumber className={styles.numberWrap} min={0} max={31}/>)}
              </Form.Item>
            </Col>

            <Col span={24} className={styles.submitBtn}>
              <Button className={styles.formBtn} htmlType='submit'>开始检索</Button>
              {/*<Button*/}
              {/*  className={styles.formBtn}*/}
              {/*  htmlType='button'*/}
              {/*  onClick={this.downloadPDF}*/}
              {/*  disabled={list.length === 0}*/}
              {/*>导出过滤列表</Button>*/}
            </Col>
          </Row>
        </Form>

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

export default Form.create()(App);
