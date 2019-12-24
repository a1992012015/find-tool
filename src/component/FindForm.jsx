import React, { Component } from 'react';
import { Button, Col, Form, InputNumber, Row } from 'antd';

import styles from '../App.module.scss';

class FindForm extends Component {
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
    const { form } = this.props;
    return (
      <Form className='ant-advanced-search-form' onSubmit={this.handleSubmit}>
        <h3>按照个体检索</h3>
        <h6>此检索只能从基础查询条件查询得到的数据里面检索</h6>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item key='hp' label='性别比例'>
              {form.getFieldDecorator('ivs[0]', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 31,
              })(<InputNumber size="small" className={styles.numberWrap} min={0} max={31}/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='atk' label='ATK'>
              {form.getFieldDecorator('ivs[1]', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 31,
              })(<InputNumber size="small" className={styles.numberWrap} min={0} max={31}/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='def' label='DEF'>
              {form.getFieldDecorator('ivs[2]', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 31,
              })(<InputNumber size="small" className={styles.numberWrap} min={0} max={31}/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='spa' label='SPA'>
              {form.getFieldDecorator('ivs[3]', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 31,
              })(<InputNumber size="small" className={styles.numberWrap} min={0} max={31}/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='spd' label='SPD'>
              {form.getFieldDecorator('ivs[4]', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 31,
              })(<InputNumber size="small" className={styles.numberWrap} min={0} max={31}/>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item key='spe' label='SPE'>
              {form.getFieldDecorator('ivs[5]', {
                rules: [{ required: true, message: '必填' }],
                initialValue: 31,
              })(<InputNumber size="small" className={styles.numberWrap} min={0} max={31}/>)}
            </Form.Item>
          </Col>
        </Row>

        <Col span={24} className={styles.submitBtn}>
          <Button className={styles.formBtn} htmlType='submit'>开始检索</Button>
        </Col>
      </Form>
    );
  }
}

export default Form.create()(FindForm);
