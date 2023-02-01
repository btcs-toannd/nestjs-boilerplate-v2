const splitMemo: Record<string, string[]> = {};
const sep = '|';

const deepMerge = <T, K>(a: T, b: K) => {
  if (typeof b === 'undefined') {
    return a;
  }

  if (Array.isArray(a)) {
    return a.map((item: any, index: number) => deepMerge(item, b[index]));
  }

  if (typeof a === 'object') {
    const mergeObj = { ...a, ...b };

    const keys = new Set(Object.keys(a).concat(Object.keys(b)));

    // use deepMerge if both a and b has this key
    Array.from(keys)
      .filter((key) => a[key] && b[key] && typeof a[key] === 'object')
      .forEach((key) => {
        mergeObj[key] = deepMerge(a[key], b[key]);
      });

    return mergeObj;
  }

  return b;
};

const splitComma = (str: string) => {
  if (splitMemo[str]) {
    return splitMemo[str];
  }

  let scopeLevel = 0;

  const arr = str
    .split('')
    .map((ch) => {
      if (ch === '{') {
        scopeLevel += 1;
        return ch;
      }

      if (ch === '}') {
        scopeLevel -= 1;
        return ch;
      }

      if (scopeLevel === 0 && ch === ',') {
        return sep;
      }

      return ch;
    })
    .join('')
    .split(sep);

  splitMemo[str] = arr;

  return arr;
};

export const selectParam = (
  obj: Record<any, any>,
  query?: string | string[],
) => {
  if (typeof obj === 'undefined' || typeof query === 'undefined') {
    return obj;
  }

  // e.g. paths = ['pageInfo', 'edges.{id,name}']
  let paths: string[];

  if (typeof query === 'string') {
    if (query.match(/^{(.+?,?)??}$/)) {
      paths = splitComma(query.slice(1, query.length - 1));
    } else {
      paths = [query];
    }
  } else {
    paths = query;
  }

  return paths
    .map((path) => {
      const dotIndex = path.indexOf('.');
      if (dotIndex < 0) {
        return [path, obj[path]];
      }

      const firstElement = path.slice(0, dotIndex);
      const restPath = path.slice(dotIndex + 1, path.length);

      if (Array.isArray(obj[firstElement])) {
        return [
          firstElement,
          obj[firstElement].map((item) => selectParam(item, restPath)),
        ];
      }

      if (typeof obj[firstElement] === 'object') {
        return [firstElement, selectParam(obj[firstElement], restPath)];
      }

      return [firstElement, undefined];
    })
    .reduce((pv, v) => {
      const [key, val] = v;

      if (typeof val === 'undefined') {
        return pv;
      }

      // eslint-disable-next-line no-param-reassign
      pv[key] = deepMerge(pv[key], val);

      return pv;
    }, {});
};
