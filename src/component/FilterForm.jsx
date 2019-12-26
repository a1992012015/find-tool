import React, { Component } from 'react';
import { Col, Form, Row, Select } from 'antd';

class FilterForm extends Component {
  changeGender = (value) => {
    const { handleSubmit } = this.props;
    handleSubmit(value);
  };

  render() {
    const { form, gender } = this.props;
    return (
      <Form className='ant-advanced-search-form'>
        <h3>修改检索条件</h3>
        <h6>此检索只能修改基础查询条件数据的不同条件下的结果</h6>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item key='hp' label='HP'>
              {form.getFieldDecorator('gender', {
                rules: [{ required: true, message: '必填' }],
                initialValue: gender,
              })(
                <Select size="small" onSelect={this.changeGender}>
                  <Select.Option value={0}>只有母</Select.Option>
                  <Select.Option value={1}>1(公):7(母)</Select.Option>
                  <Select.Option value={2}>1(公):3(母)</Select.Option>
                  <Select.Option value={3}>1(公):1(母)</Select.Option>
                  <Select.Option value={4}>3(公):1(母)</Select.Option>
                  <Select.Option value={5}>7(公):1(母)</Select.Option>
                  <Select.Option value={6}>只有公</Select.Option>
                  <Select.Option value={7}>无性别</Select.Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(FilterForm);
