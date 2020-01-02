import { fromJS, List, Map } from 'immutable';

import { BaseComponent } from './ShouldComponentUpdate';
import { pokemonConfig } from '../configs/pokemonConfig';
import { naturesConfig } from '../configs/naturesConfig';

class IndividualBase extends BaseComponent {
  pokemon = Map({});
  nature = Map({});
  remark = List([0, 0]);
  maxBest = List([]);
  personality = List([]);
  maxIV = 31;
  initialIV = List().setSize(32).map((v, i) => i);

  /**
   * 开始检索个体值
   * @param values
   */
  getIVs = (values) => {
    this.pokemon = pokemonConfig.get(values.get('pokemon'));
    this.nature = naturesConfig.get(values.get('nature'));
    this.remark = this.getRemarkRange(values.get('remark'));
    this.maxBest = values.get('maxBest');
    this.personality = List(values.get('personality').split('.').map(i => parseInt(i, 10)));
    const abilityFirst = values.getIn(['ability', 0]);
    const ability = values.get('ability');
    let IVS = List().setSize(6);

    for (let i = 0; i < ability.size; i++) {
      for (let j = 0; j < IVS.size; j++) {
        const value = this.arrayIntersect(
          this.initialIV,
          this.calculatesPokemonIVs(
            j,
            ability.getIn([i, 'ivs', j]),
            ability.getIn([i, 'base', j]),
            ability.getIn([i, 'level']),
          ),
        );

        const lastIndividual = IVS.get(j) ? IVS.get(j) : this.initialIV;

        const merge = this.arrayIntersect(lastIndividual, value);

        IVS = IVS.set(j, merge);
      }
    }

    for (let j = 0; j < IVS.size; j++) {
      const [result, value] = this.validateIV(
        IVS.get(j),
        j,
        abilityFirst.getIn(['base', j]),
        abilityFirst.getIn(['level']),
        abilityFirst.getIn(['ivs', j]),
      );

      if (result) {
        IVS = IVS.set(j, value);
      } else {
        return value;
      }
    }

    const [result, value] = this.validateMaxIV(IVS);

    if (!result) {
      return value;
    }

    const plv = this.getNextDiffPoint(abilityFirst, value);

    return Map({ ivs: value, plv: plv });
  };

  /**
   * 获取个体值的最大最小范围
   * @param remark
   * @returns {List<number>}
   */
  getRemarkRange = (remark) => {
    switch (remark) {
    case 0:
      return List([1, 90]);
    case 1:
      return List([91, 120]);
    case 2:
      return List([121, 150]);
    case 3:
    default:
      return List([151, 186]);
    }
  };

  /**
   * 计算个体值
   * @param kind 需要计算的种类
   * @param individualV 个体值
   * @param baseStats 努力值
   * @param level 等级
   * @returns {number}
   */
  getPokemonVI = (kind, individualV, baseStats, level) => {
    const specie = this.pokemon.getIn(['species', kind]);
    const natureFix = this.nature.getIn(['ivs', kind]);
    if (kind === 0) { //HP uses a different formula
      if (this.pokemon.get('id') === '292') {
        return 1;
      } else {
        return (Math.floor(
          ((specie * 2 + (individualV / 1) + Math.floor(baseStats / 4)) * level) / 100)) +
          (level / 1) + 10;
      }
    } else {
      return Math.floor(
        (Math.floor(((specie * 2 + (individualV / 1) + Math.floor(baseStats / 4)) * level) / 100) +
          5) * natureFix);
    }
  };

  /**
   * 校验VI
   * @param result 个体值分布
   * @param kind 需要计算的种类
   * @param baseStats 努力值
   * @param level level
   * @param stat 能力值
   * @returns {*|List<string>}
   */
  validateIV = (result, kind, baseStats, level, stat) => { // IV error handling
    const max = this.getPokemonVI(kind, 31, baseStats, level);
    const min = this.getPokemonVI(kind, 0, baseStats, level);
    if (stat > max || stat < min) {
      return [false, List([`无法计算，应该在${min}和${max}之间，可能输入了错误的基础点数或性格`])];
    }
    for (let i = 0; i < result.size; i++) {
      if (result.get(i) > this.maxIV) { //beyond characteristic upper bound
        result = result.slice(0, i);
      }
    }
    if (
      result.size === 0 ||
      result.get(0) > this.maxIV ||
      result.get(result.size - 1) > this.maxIV
    ) { //out of any bounds
      return [false, List(['无法计算，能力，基础点数，个性或最高能力不正确'])];
    }
    return [true, result];
  };

  /**
   * 验证最大个体值
   * @param IVS 个体值分布
   * @returns {*|List<string>}
   */
  validateMaxIV = (IVS) => { //Refines in case max IVs tie
    if (this.maxBest.size > 1) {
      let t = IVS.get(this.maxBest.get(0));
      for (let i = 1; i < this.maxBest.size; i++) {
        t = this.arrayIntersect(t, IVS.get(this.maxBest.get(i)));
        if (!t.getIn([0])) {
          return [false, List(['无法计算，输入的最高能力不正确'])];
        }
      }

      for (let i = 0; i < this.maxBest.size; i++) {
        IVS = IVS.set(this.maxBest.get(i), t);
      }
    }
    return [true, IVS];
  };

  /**
   * 计算交集，计算结果是否匹配一定的范围，找出匹配的结果
   * @param a
   * @param b
   * @returns {List<*>}
   */
  arrayIntersect(a, b) { //arrays must be sorted, a and b are destructed afterwards
    let r = List([]);
    while (a.size > 0 && b.size > 0) {
      if (a.get(0) < b.get(0)) {
        a = a.shift();
      } else if (a.get(0) > b.get(0)) {
        b = b.shift();
      } else {
        const v = a.get(0);
        a = a.shift();
        b = b.shift();
        r = r.push(v);
      }
    }
    return r;
  }

  /**
   * 计算宝可梦的个体值
   * @param kind 需要计算的种类
   * @param stat 能力值
   * @param baseStats 努力值
   * @param level 等级
   * @returns {List<number>}
   */
  calculatesPokemonIVs(kind, stat, baseStats, level) { //Calculates Pokemon IVs - brute force
    const chara = fromJS(
      [
        [0, 5, 10, 15, 20, 25, 30],
        [1, 6, 11, 16, 21, 26, 31],
        [2, 7, 12, 17, 22, 27],
        [3, 8, 13, 18, 23, 28],
        [4, 9, 14, 19, 24, 29],
      ],
    );
    const pots = fromJS(
      [
        [0],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
        [26, 27, 28, 29],
        [30],
        [31],
      ],
    );
    let IV = List([]);

    for (let i = 31; i >= 0; i--) {
      if (this.getPokemonVI(kind, i, baseStats, level) === stat) {
        IV = IV.unshift(i);
      }
    }

    if (kind === 0 && this.pokemon.id === '292') {
      IV = this.initialIV;
    } //鬼蝉

    if (this.personality.get(0) === kind) {
      IV = this.arrayIntersect(IV, chara.get(this.personality.get(1)));
      this.maxIV = IV.getIn([IV.size - 1]);
    }

    // TODO 检索个体值额范围待完善
    if (this.maxBest.includes(kind)) {
      IV = this.arrayIntersect(IV, pots.get(5));
    }
    return IV;
  }

  /**
   * 查找能看出准确个体值的位置
   * @param ability 检索参数
   * @param IVS 个体值分布
   */
  getNextDiffPoint = (ability, IVS) => {
    let plv = List();

    for (let i = 0; i < IVS.size; i++) {
      const level = ability.get('level');
      const base = ability.get('base');

      if (IVS.get(i).size > 1 && level < 100) {
        const value = this.getDiffPoint(level, base, i, IVS);
        plv = plv.set(i, value);
      } else {
        plv = plv.set(i, List(['', '', ''])); //level, branch, eps
      }
    }

    return plv;
  };

  getDiffPoint = (level, base, kind, IVS) => {
    for (let j = level; j <= 100; j++) {
      for (let z = 1; z < IVS.get(kind).size; z++) {
        const a = this.getPokemonVI(kind, IVS.getIn([kind, z - 1]), base.getIn([kind]), j);
        const b = this.getPokemonVI(kind, IVS.getIn([kind, z]), base.getIn([kind]), j);

        if (a === b) {
          for (let y = base.getIn([kind]); y <= 252; y++) {
            for (let x = 1; x < IVS.get(kind).size; x++) {
              const c = this.getPokemonVI(kind, IVS.getIn([kind, x - 1]), y, j);
              const d = this.getPokemonVI(kind, IVS.getIn([kind, x]), y, j);
              if (c !== d) {
                return List([level, '', y, c, d]);
              }
            }
          }
        } else {
          return List([level, '', 0, a, b]);
        }
      }
    }
    return List([0, 0, 0]);
  };
}

export default IndividualBase;
