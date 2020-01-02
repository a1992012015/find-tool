import React, { Fragment } from 'react';
import { fromJS, List, Map } from 'immutable';
import { Alert, Button, Checkbox, Col, Form, InputNumber, Row, Select } from 'antd';

import { pokemonConfig } from '../../configs/pokemonConfig';
import { naturesConfig } from '../../configs/naturesConfig';
import IndividualBase from '../../baseClass/IndividualBase';

import styles from './IndividualValues.module.scss';

class IndividualValues extends IndividualBase {
  constructor(props) {
    super(props);
    this.state = {
      result: Map(),
      error: List(),
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values = fromJS(values);
        const result = this.getIVs(values);
        if (Map.isMap(result)) {
          this.setState({
            result: result,
            error: List(),
          });
        } else {
          this.setState({
            result: Map(),
            error: result,
          });
        }
      }
    });
  };

  filterPokemonList = (input, option) => {
    return option.props.children.indexOf(input) > -1;
  };

  addAbilityForm = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat({ value: 0, key: keys.length });
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  deleteAbilityForm = (index) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter((v) => v.key !== index),
    });
  };

  validatorBase = (rule, value, callback) => {
    const { form } = this.props;

    const field = rule.field;

    const index = parseInt(field.slice(8, 9), 10);

    const values = form.getFieldValue(`ability[${index}][base]`);

    const num = values.reduce((accumulator, current) => (accumulator || 0) + (current || 0));

    if (num >= 0 && num <= 508) {
      callback();
    } else {
      callback(num);
    }
  };

  render() {
    const { form } = this.props;
    const { error, result } = this.state;
    return (
      <Form className={styles.content} onSubmit={this.handleSubmit}>
        <Row type='flex' gutter={10}>
          <Col span={16}>
            <div className={styles.title}>检索条件</div>

            <Row gutter={10}>
              <Col span={8}>
                <Form.Item label='宝可梦'>
                  {form.getFieldDecorator('pokemon', {
                    rules: [{ required: true, message: '必须选择一个宝可梦！' }],
                  })(
                    <Select
                      showSearch
                      placeholder='请输入一个宝可梦'
                      filterOption={this.filterPokemonList}
                      size='small'
                    >
                      {this.renderPokemon()}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='性格'>
                  {form.getFieldDecorator('nature', {
                    rules: [{ required: true, message: '必须选择一个性格！' }],
                  })(
                    <Select placeholder='请选择一个性格' size='small'>
                      {this.renderNature()}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='全体能力评价'>
                  {form.getFieldDecorator('remark')(
                    <Select placeholder='请选择一个评价' size='small'>
                      <Select.Option value={0}>还算可以（0～90）</Select.Option>
                      <Select.Option value={1}>中等偏上（91～120）</Select.Option>
                      <Select.Option value={2}>相当优秀（121～150）</Select.Option>
                      <Select.Option value={3}>了不起（151～186）</Select.Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='个性'>
                  {form.getFieldDecorator('personality', {
                    rules: [{ required: true, message: '必须选择一个个性！' }],
                  })(
                    <Select placeholder='请选择一个个性' size='small'>
                      <Select.Option value='0.0'>非常喜欢吃东西</Select.Option>
                      <Select.Option value='0.1'>经常睡午觉</Select.Option>
                      <Select.Option value='0.2'>常常打瞌睡</Select.Option>
                      <Select.Option value='0.3'>经常乱扔东西</Select.Option>
                      <Select.Option value='0.4'>喜欢悠然自在</Select.Option>
                      <Select.Option value='1.0'>以力气大为傲</Select.Option>
                      <Select.Option value='1.1'>喜欢胡闹</Select.Option>
                      <Select.Option value='1.2'>有点容易生气</Select.Option>
                      <Select.Option value='1.3'>喜欢打架</Select.Option>
                      <Select.Option value='1.4'>血气方刚</Select.Option>
                      <Select.Option value='2.0'>身体强壮</Select.Option>
                      <Select.Option value='2.1'>抗打能力强</Select.Option>
                      <Select.Option value='2.2'>顽强不屈</Select.Option>
                      <Select.Option value='2.3'>能吃苦耐劳</Select.Option>
                      <Select.Option value='2.4'>善于忍耐</Select.Option>
                      <Select.Option value='3.0'>好奇心强</Select.Option>
                      <Select.Option value='3.1'>喜欢恶作剧</Select.Option>
                      <Select.Option value='3.2'>做事万无一失</Select.Option>
                      <Select.Option value='3.3'>经常思考</Select.Option>
                      <Select.Option value='3.4'>一丝不苟</Select.Option>
                      <Select.Option value='4.0'>性格强势</Select.Option>
                      <Select.Option value='4.1'>有一点点爱慕虚荣</Select.Option>
                      <Select.Option value='4.2'>争强好胜</Select.Option>
                      <Select.Option value='4.3'>不服输</Select.Option>
                      <Select.Option value='4.4'>有一点点固执</Select.Option>
                      <Select.Option value='5.0'>喜欢比谁跑得快</Select.Option>
                      <Select.Option value='5.1'>对声音敏感</Select.Option>
                      <Select.Option value='5.2'>冒冒失失</Select.Option>
                      <Select.Option value='5.3'>有点容易得意忘形</Select.Option>
                      <Select.Option value='5.4'>逃得快</Select.Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='最棒能力项'>
                  {form.getFieldDecorator('maxBest')(
                    <Checkbox.Group>
                      <Row>
                        <Col span={8}>
                          <Checkbox value={0}>HP</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value={1}>物攻</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value={2}>物防</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value={3}>特攻</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value={4}>特防</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value={5}>速度</Checkbox>
                        </Col>
                      </Row>
                    </Checkbox.Group>,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row type='flex' gutter={10}>
              <Col span={4} className={styles.colIndividualValues}/>

              <Col span={2} className={styles.colIndividualValues}>
                等级
              </Col>

              <Col span={3} className={styles.colIndividualValues}/>

              <Col span={2} className={styles.colIndividualValues}>
                HP
              </Col>

              <Col span={2} className={styles.colIndividualValues}>
                物攻
              </Col>

              <Col span={2} className={styles.colIndividualValues}>
                物防
              </Col>

              <Col span={2} className={styles.colIndividualValues}>
                特攻
              </Col>

              <Col span={2} className={styles.colIndividualValues}>
                特防
              </Col>

              <Col span={2} className={styles.colIndividualValues}>
                速度
              </Col>

              <Col span={3}/>

              {this.renderAbilityForm()}
            </Row>
          </Col>

          <Col span={8}>
            <div className={styles.title}>输出结果</div>

            <div className={styles.resultBox}>
              <Row type='flex'>
                <Col span={5}>
                  <Form.Item colon={false} label='类型'>
                    分布
                  </Form.Item>
                </Col>

                <Col span={3}>
                  <Form.Item colon={false} label='HP'>
                    {this.renderResultView(result.getIn(['ivs', 0]) || List())}
                  </Form.Item>
                </Col>

                <Col span={3}>
                  <Form.Item colon={false} label='物攻'>
                    {this.renderResultView(result.getIn(['ivs', 1]) || List())}
                  </Form.Item>
                </Col>

                <Col span={3}>
                  <Form.Item colon={false} label='物防'>
                    {this.renderResultView(result.getIn(['ivs', 2]) || List())}
                  </Form.Item>
                </Col>

                <Col span={3}>
                  <Form.Item colon={false} label='特攻'>
                    {this.renderResultView(result.getIn(['ivs', 3]) || List())}
                  </Form.Item>
                </Col>

                <Col span={3}>
                  <Form.Item colon={false} label='特防'>
                    {this.renderResultView(result.getIn(['ivs', 4]) || List())}
                  </Form.Item>
                </Col>

                <Col span={3}>
                  <Form.Item colon={false} label='速度'>
                    {this.renderResultView(result.getIn(['ivs', 5]) || List())}
                  </Form.Item>
                </Col>

                <Col span={5}>
                  等级
                </Col>

                <Col span={3}>
                  {result.getIn(['plv', 0, 0])}
                </Col>

                <Col span={3}>
                  {result.getIn(['plv', 1, 0])}
                </Col>

                <Col span={3}>
                  {result.getIn(['plv', 2, 0])}
                </Col>

                <Col span={3}>
                  {result.getIn(['plv', 3, 0])}
                </Col>

                <Col span={3}>
                  {result.getIn(['plv', 4, 0])}
                </Col>

                <Col span={3}>
                  {result.getIn(['plv', 5, 0])}
                </Col>

                <Col span={5}>
                  基础点数
                </Col>

                <Col span={3}>
                  {result.getIn(['plv', 0, 2])}
                </Col>

                <Col span={3}>
                  {result.getIn(['plv', 1, 2])}
                </Col>

                <Col span={3}>
                  {result.getIn(['plv', 2, 2])}
                </Col>

                <Col span={3}>
                  {result.getIn(['plv', 3, 2])}
                </Col>

                <Col span={3}>
                  {result.getIn(['plv', 4, 2])}
                </Col>

                <Col span={3}>
                  {result.getIn(['plv', 5, 2])}
                </Col>
              </Row>
            </div>

            <Col span={24} className={styles.textView}>
              <Button htmlType='submit'>开始检索</Button>
            </Col>

            <Col span={24} className={styles.textError}>
              {error.map((v) => <Alert key={v} message={v} type='error'/>)}
            </Col>
          </Col>
        </Row>
      </Form>
    );
  }

  renderResultView = (value) => {
    return (
      <Fragment>
        {value.map((v) => <p key={v} className={styles.resultText}>{v}</p>)}

        {value.size === 1 && <p className={styles.ok}>ok</p>}
      </Fragment>
    );
  };

  renderPokemon = () => {
    return pokemonConfig.map((pokemon, index) => {
      return (
        <Select.Option key={`pokemon${index}`} value={index}>{pokemon.get('name')}</Select.Option>
      );
    });
  };

  renderNature = () => {
    return naturesConfig.map((nature, index) => {
      return (
        <Select.Option key={`pokemon${nature.get('key')}`} value={index}>
          {nature.get('name')}
        </Select.Option>
      );
    });
  };

  renderAbilityForm = () => {
    const { form } = this.props;
    form.getFieldDecorator('keys', { initialValue: [{ value: 0, key: 0 }] });
    const keys = form.getFieldValue('keys');
    return keys.map((item) => {
      return (
        <Fragment key={item.key}>
          <Col span={4} className={styles.colIndividualValues}>
            <Form.Item className={styles.textView}>
              <Button
                shape='circle'
                icon='plus'
                size='small'
                htmlType='button'
                onClick={this.addAbilityForm}
              />
              <Button
                shape='circle'
                icon='minus'
                size='small'
                htmlType='button'
                disabled={keys.length <= 1}
                onClick={() => this.deleteAbilityForm(item.key)}
              />
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][level]`, {
                rules: [{ required: true, message: '必填！' }],
              })(<InputNumber size='small' min={1} max={100} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>

          <Col span={3} className={styles.colIndividualValues}>
            <Form.Item className={styles.textView}>
              能力值
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][ivs][0]`, {
                rules: [{ required: true, message: '必填！' }],
              })(<InputNumber size='small' min={1} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][ivs][1]`, {
                rules: [{ required: true, message: '必填！' }],
              })(<InputNumber size='small' min={1} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][ivs][2]`, {
                rules: [{ required: true, message: '必填！' }],
              })(<InputNumber size='small' min={1} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][ivs][3]`, {
                rules: [{ required: true, message: '必填！' }],
              })(<InputNumber size='small' min={1} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][ivs][4]`, {
                rules: [{ required: true, message: '必填！' }],
              })(<InputNumber size='small' min={1} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][ivs][5]`, {
                rules: [{ required: true, message: '必填！' }],
              })(<InputNumber size='small' min={1} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>

          <Col span={3}/>

          <Col span={4} className={styles.colIndividualValues}/>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item className={styles.textView}>
              {item.value}
            </Form.Item>
          </Col>

          <Col span={3} className={styles.colIndividualValues}>
            <Form.Item className={styles.textView}>
              基础点数
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][base][0]`, {
                rules: [
                  { required: true, message: '必填！' },
                  { validator: this.validatorBase, message: '超出！' },
                ],
              })(<InputNumber size='small' min={0} max={252} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][base][1]`, {
                rules: [
                  { required: true, message: '必填！' },
                  { validator: this.validatorBase, message: '超出！' },
                ],
              })(<InputNumber size='small' min={0} max={252} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][base][2]`, {
                rules: [
                  { required: true, message: '必填！' },
                  { validator: this.validatorBase, message: '超出！' },
                ],
              })(<InputNumber size='small' min={0} max={252} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][base][3]`, {
                rules: [
                  { required: true, message: '必填！' },
                  { validator: this.validatorBase, message: '超出！' },
                ],
              })(<InputNumber size='small' min={0} max={252} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][base][4]`, {
                rules: [
                  { required: true, message: '必填！' },
                  { validator: this.validatorBase, message: '超出！' },
                ],
              })(<InputNumber size='small' min={0} max={252} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>

          <Col span={2} className={styles.colIndividualValues}>
            <Form.Item>
              {form.getFieldDecorator(`ability[${item.key}][base][5]`, {
                rules: [
                  { required: true, message: '必填！' },
                  { validator: this.validatorBase, message: '超出！' },
                ],
              })(<InputNumber size='small' min={0} max={252} style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>
        </Fragment>
      );
    });
  };
}

const initialValue = {
  pokemon: 149,
  nature: 18,
  remark: 2,
  personality: '4.1',
  maxBest: [1, 3, 4, 5],
  keys: [
    { value: 0, key: 0 },
    { value: 0, key: 1 },
  ],
  ability: [
    {
      level: 58,
      ivs: [224, 121, 93, 121, 146, 92],
      base: [0, 0, 0, 0, 0, 0],
    },
    {
      level: 58,
      ivs: [225, 121, 94, 121, 146, 92],
      base: [4, 0, 4, 0, 0, 0],
    },
  ],
};

const createAbility = (value, key) => {
  if (typeof value === 'object') {
    const form = {};
    Object.keys(value).forEach((k) => {
      Object.assign(form, createAbility(value[k], `${key}[${k}]`));
    });
    return form;
  } else {
    return {
      [key]: Form.createFormField({
        value: value,
      }),
    };
  }
};

const creatInitialValue = (values) => {
  const formItem = {};
  Object.keys(values).forEach((key) => {
    if (key === 'ability') {
      Object.assign(formItem, createAbility(values[key], key));
    } else {
      formItem[key] = Form.createFormField({
        value: values[key],
      });
    }
  });
  return formItem;
};

export default Form.create({
  mapPropsToFields() {
    if (process.env.NODE_ENV === 'development') {
      return creatInitialValue(initialValue);
    } else {
      return null;
    }
  },
})(IndividualValues);
