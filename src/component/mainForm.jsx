import React, { Component } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';

import styles from '../App.module.scss';

class MainForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, handleSubmit } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        handleSubmit(values);
      }
    });
  };

  render() {
    const { form, list, download } = this.props;
    return (
      <Form className='ant-advanced-search-form' onSubmit={this.handleSubmit}>
        <h3>检索基础参数</h3>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item key='pid' label='PID'>
              {form.getFieldDecorator('pid', {
                rules: [{ required: true, message: '必填' }],
                initialValue: process.env.NODE_ENV === 'development' ? '0x8F18CFBE' : '0x',
              })(<Input size="small"/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='ec' label='加密常数'>
              {form.getFieldDecorator('ec', {
                rules: [{ required: true, message: '必填' }],
                initialValue: process.env.NODE_ENV === 'development' ? '0xAEB98D74' : '0x',
              })(<Input size="small"/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='usefilters' label='是否使用过滤'>
              {form.getFieldDecorator('usefilters', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 1,
              })(
                <Select size="small">
                  <Select.Option value={1}>是</Select.Option>
                  <Select.Option value={0}>否</Select.Option>
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='minResults' label='最小检索范围'>
              {form.getFieldDecorator('minResults', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 0,
              })(<InputNumber size="small" className={styles.numberWrap} min={0}/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='maxResults' label='最大检索范围'>
              {form.getFieldDecorator('maxResults', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 1500,
              })(<InputNumber size="small" className={styles.numberWrap} min={1}/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='flawlessiv' label='目标保底个体V数'>
              {form.getFieldDecorator('flawlessiv', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 4,
              })(
                <Select size="small">
                  <Select.Option value={1}>保底1V</Select.Option>
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
                <Select size="small">
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
                <Select size="small">
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
                initialValue: process.env.NODE_ENV === 'development' ? 0 : 1,
              })(
                <Select size="small">
                  <Select.Option value={1}>是</Select.Option>
                  <Select.Option value={0}>否</Select.Option>
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='hp' label='HP'>
              {form.getFieldDecorator('IVs[0]', {
                rules: [{ required: true, message: '必填' }],
                initialValue: process.env.NODE_ENV === 'development' ? 16 : 31,
              })(<InputNumber size="small" className={styles.numberWrap} min={0} max={31}/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='atk' label='ATK'>
              {form.getFieldDecorator('IVs[1]', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 31,
              })(<InputNumber size="small" className={styles.numberWrap} min={0} max={31}/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='def' label='DEF'>
              {form.getFieldDecorator('IVs[2]', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 31,
              })(<InputNumber size="small" className={styles.numberWrap} min={0} max={31}/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='spa' label='SPA'>
              {form.getFieldDecorator('IVs[3]', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 31,
              })(<InputNumber size="small" className={styles.numberWrap} min={0} max={31}/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='spd' label='SPD'>
              {form.getFieldDecorator('IVs[4]', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 31,
              })(<InputNumber size="small" className={styles.numberWrap} min={0} max={31}/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='spe' label='SPE'>
              {form.getFieldDecorator('IVs[5]', {
                rules: [{ required: true, message: '必填' }],
                initialValue: process.env.NODE_ENV === 'development' ? 6 : 31,
              })(<InputNumber size="small" className={styles.numberWrap} min={0} max={31}/>)}
            </Form.Item>
          </Col>

          <Col span={24} className={styles.submitBtn}>
            <Button className={styles.formBtn} htmlType='submit'>开始检索</Button>
            <Button
              className={styles.formBtn}
              htmlType='button'
              onClick={download}
              disabled={list.length === 0}
            >导出过滤列表</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(MainForm);
