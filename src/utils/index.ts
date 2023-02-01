/* eslint-disable no-continue */
import * as crypto from 'crypto';
import { access } from 'fs/promises';
import { camelCase, cloneDeep, pick, snakeCase, uniq } from 'lodash';

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function checkIsNumeric(str) {
  if (typeof str !== 'string') return false;

  return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
}

export function generateWhereStatement(obj) {
  let whereStatement = 'WHERE ';
  const keys = Object.keys(obj);

  // eslint-disable-next-line no-restricted-syntax
  for (let i = 0; i < Object.keys(obj).length; i += 1) {
    whereStatement += ` ${keys[i]} = $${i + 1} AND`;
  }

  return whereStatement.slice(0, -3);
}

export function generateSetStatement(obj) {
  let setStatement = 'SET ';
  const keys = Object.keys(obj);

  // eslint-disable-next-line no-restricted-syntax
  for (let i = 0; i < Object.keys(obj).length; i += 1) {
    const value = obj[keys[i]];
    const valueType = typeof value;
    if (value === null) {
      setStatement += `"${keys[i]}" = NULL, `;
      continue;
    }

    switch (valueType) {
      case 'string':
        setStatement += `"${keys[i]}" = '${obj[keys[i]]}', `;
        break;
      default:
        setStatement += `"${keys[i]}" = ${obj[keys[i]]}, `;
        break;
    }
  }

  return setStatement.slice(0, -2);
}

export function generateInsertStatement(obj) {
  let insertStatement = '(';
  const keys = Object.keys(obj);

  for (let i = 0; i < Object.keys(obj).length; i += 1) {
    insertStatement += `"${keys[i]}", `;
  }

  insertStatement = `${insertStatement.slice(0, -2)})`;
  insertStatement += ' VALUES (';

  for (let i = 0; i < Object.keys(obj).length; i += 1) {
    insertStatement += `$${i + 1}, `;
  }

  insertStatement = `${insertStatement.slice(0, -2)})`;

  return insertStatement;
}

// Array utilities
export function hasDuplicates(a) {
  return uniq(a).length !== a.length;
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Object utilities
export function toCamelCase<T>(obj): T | T[] {
  if (Array.isArray(obj)) {
    return obj.map((v: T) => toCamelCase<T>(v)) as T[];
  }

  if (obj != null && obj.constructor === Object) {
    // TODO: dung for each thay cho reduce
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: toCamelCase(obj[key]),
      }),
      {},
    ) as T;
  }
  return obj;
}

export function toSnakeCase<T>(obj): T | T[] {
  if (Array.isArray(obj)) {
    return obj.map((v: T) => toSnakeCase<T>(v)) as T[];
  }

  if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [snakeCase(key)]: toSnakeCase(obj[key]),
      }),
      {},
    ) as T;
  }
  return obj;
}

export function createSubObject(object, keys) {
  return pick(object, keys);
}

export function removeUndefinedField(obj) {
  const toBeModifiedObj = cloneDeep(obj);

  Object.keys(toBeModifiedObj).forEach((key) => {
    if (toBeModifiedObj[key] === undefined) {
      delete toBeModifiedObj[key];
    }
  });

  return toBeModifiedObj;
}

// Date-time utilities
export function checkValidTokenInSecond(expireTime: number) {
  return Math.floor(Date.now() / 1000) <= expireTime;
}

export function convertTimeStampToSecond(time: number) {
  return Math.floor(Date.now() / 1000) + time;
}

/**
 * Only work with format yyyy/mm/dd
 * @param dateString
 * @returns
 */
export function isValidDate(dateString: string) {
  // First check for the pattern
  if (!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateString)) return false;

  // Parse the date parts to integers
  const parts = dateString.split('/');
  const day = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[0], 10);

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month === 0 || month > 12) return false;

  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
    monthLength[1] = 29;

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
}

/**
 * Take domain of an URL
 * @param url string
 * @returns string | undefined
 */
export function takeDomain(url: string): string | undefined {
  const results = url.match(
    /(?:https?:\/\/)?(?:www\.)?([-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
  );

  return results ? results[1] : undefined;
}

export function escapeRegExp(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

export function hashToken(token): string {
  const hashedToken = crypto
    .createHmac('sha256', process.env.REFRESH_TOKEN_SECRET)
    .update(token)
    .digest('hex');

  return hashedToken;
}

export async function checkIsFileExists(path: string) {
  try {
    await access(path);

    return true;
  } catch (error) {
    return false;
  }
}

export function dateFormatter(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if necessary
  const hours = String(date.getHours()).padStart(2, '0'); // Add leading zero if necessary
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Add leading zero if necessary

  const formattedDate = `${year}${month}${day}${hours}${minutes}`;

  return formattedDate;
}

export function dateTimeFormatter(date: Date): string {
  const callStartTime = new Date(date);
  const year = callStartTime.getFullYear();
  const month = `0${callStartTime.getMonth() + 1}`.slice(-2); // Month is zero-indexed in JavaScript
  const day = `0${callStartTime.getDate()}`.slice(-2);
  const hour = `0${callStartTime.getHours()}`.slice(-2);
  const minute = `0${callStartTime.getMinutes()}`.slice(-2);
  const second = `0${callStartTime.getSeconds()}`.slice(-2);

  const formattedDate = `${year}/${month}/${day} ${hour}:${minute}:${second}`;

  return formattedDate;
}

export function generateTempFileName(directory, prefix) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const tempFileName = `${prefix}_${timestamp}_${random}`;
  const tempFilePath = `${directory}/${tempFileName}`;
  return tempFilePath;
}

export function specialNumberMapper(data) {
  const specialNumbers = data.reduce((acc, item) => {
    const number = item?.cExten?.replace(/[_.!]/g, '');
    if (number === '#67') {
      return acc;
    }

    let context = '';
    if (item?.aContext === 'common' || item?.cName === 'default') {
      context = 'COMMON';
    } else if (item?.cDispName) {
      context = item.cDispName;
    } else {
      context = item.bDispName;
    }

    let description = '';
    if (
      item?.aType === 'Extension' &&
      item?.aTypeId === '7' &&
      item?.aDescription
    ) {
      description = item.aDescription;
    } else if (item?.cDescription) {
      description = item.cDescription;
    } else if (item?.aType && item?.aContext === 'common') {
      description = 'SYSTEM_AUTHOR_SYSTEM';
    } else {
      description = 'IDENTIFICATION_NUMBER_EXTEN';
    }

    return [
      ...acc,
      {
        context,
        number,
        description,
      },
    ];
  }, []);

  return specialNumbers;
}
