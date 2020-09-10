import _ from 'lodash';

const setToFormat = (val) => {
  if (_.isObject(val)) {
    return '[complex value]';
  }
  if (typeof val === 'boolean') {
    return val;
  }
  return `'${val}'`;
};

export default (diff) => {
  const iter = (data, path) => data
    .flatMap((item) => {
      const {
        name, status, value, children, oldValue, newValue,
      } = item;
      const newPath = `${path}.${name}`;

      switch (status) {
        case 'added':
          return `Property '${newPath.slice(1)}' was added with value: ${setToFormat(value)}`;
        case 'deleted':
          return `Property '${newPath.slice(1)}' was removed`;
        case 'unknown':
          return iter(children, newPath);
        case 'unmodified':
          return [];
        case 'modified':
          return `Property '${newPath.slice(1)}' was updated from ${setToFormat(oldValue)} to ${setToFormat(newValue)}`;
        default:
          throw new Error(`Unknown status ${status}`);
      }
    });
  return iter(diff, '').join('\n');
};
