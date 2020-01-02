/**
 * 字母转换成颜色值
 * @param name
 * @returns {string}
 */
const avatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

/**
 * 转换颜色的对比色
 * @param hex
 * @returns {string}
 */
const hexToRgb = (hex) => {
  hex = avatarColor(hex);
  const rgb = [];

  hex = hex.substr(1); //去除前缀 # 号

  if (hex.length === 3) {
    // 处理 "#abc" 成 "#aabbcc"
    hex = hex.replace(/(.)/g, '$1$1');
  }

  hex.replace(/../g, color => {
    rgb.push(255 - parseInt(color, 0x10)); //按16进制将字符串转换为数字
  });

  return 'rgb(' + rgb.join(',') + ')';
};

/**
 * 生成唯一hax
 * @param len
 * @param radix
 * @returns {string}
 */
const getUuid = (len = 0, radix = 62) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [];
  if (len) {
    for (let i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)];
    }
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 36);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
};

/**
 * 判断是不是一个JSON
 * @param json
 * @returns {boolean}
 */
const isJSON = json => {
  if (typeof json === 'string') {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};

export {
  avatarColor,
  hexToRgb,
  getUuid,
  isJSON,
};
