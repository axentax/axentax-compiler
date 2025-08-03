import {
  orPush,
  createNumberBetweenArray,
  getReboundIndexValue,
  getReboundResolvedIndex,
  findNthOneIndex,
  shiftArrayAsIndex,
  shiftArray
} from '../../src/conductor/utils/x-array-utils';

describe('x-array-utils', () => {
  test('orPush: 新規配列作成とpush', () => {
    const obj: any = {};
    orPush(obj, 'arr', 1);
    expect(obj.arr).toEqual([1]);
    orPush(obj, 'arr', 2);
    expect(obj.arr).toEqual([1, 2]);
  });

  test('createNumberBetweenArray: 範囲配列生成', () => {
    expect(createNumberBetweenArray(1, 5)).toEqual([1,2,3,4,5]);
    expect(createNumberBetweenArray(0, 0)).toEqual([0]);
    expect(createNumberBetweenArray(-2, 2)).toEqual([-2,-1,0,1,2]);
  });

  test('getReboundIndexValue: 折り返しインデックス値取得', () => {
    const arr = [10, 20, 30, 40];
    expect(getReboundIndexValue(arr, 0)).toBe(10);
    expect(getReboundIndexValue(arr, 3)).toBe(40);
    expect(getReboundIndexValue(arr, 4)).toBe(30);
    expect(getReboundIndexValue(arr, 5)).toBe(20);
    expect(getReboundIndexValue(arr, 6)).toBe(10);
    expect(getReboundIndexValue(arr, -1)).toBe(20);
  });

  test('getReboundResolvedIndex: 折り返しインデックス取得', () => {
    const arr = [10, 20, 30, 40];
    expect(getReboundResolvedIndex(arr, 0)).toBe(0);
    expect(getReboundResolvedIndex(arr, 3)).toBe(3);
    expect(getReboundResolvedIndex(arr, 4)).toBe(2);
    expect(getReboundResolvedIndex(arr, 5)).toBe(1);
    expect(getReboundResolvedIndex(arr, 6)).toBe(0);
    expect(getReboundResolvedIndex(arr, -1)).toBe(1);
  });

  test('findNthOneIndex: n番目の値のインデックス', () => {
    const arr = [0,1,0,1,1,0,1];
    expect(findNthOneIndex(arr, 1, 1)).toBe(1);
    expect(findNthOneIndex(arr, 2, 1)).toBe(3);
    expect(findNthOneIndex(arr, 3, 1)).toBe(4);
    expect(findNthOneIndex(arr, 4, 1)).toBe(6);
    expect(findNthOneIndex(arr, 5, 1)).toBe(-1);
  });

  test('shiftArrayAsIndex: 指定インデックスから配列シフト', () => {
    const arr = [1,2,3,4,5];
    expect(shiftArrayAsIndex(arr, 2)).toEqual([3,4,5,1,2]);
    expect(shiftArrayAsIndex(arr, 0)).toEqual([1,2,3,4,5]);
    expect(shiftArrayAsIndex(arr, 4)).toEqual([5,1,2,3,4]);
  });

  test('shiftArray: 指定値から配列シフト', () => {
    const arr = [1,2,3,4,5];
    expect(shiftArray(arr, 3)).toEqual([3,4,5,1,2]);
    expect(shiftArray(arr, 1)).toEqual([1,2,3,4,5]);
    expect(shiftArray(arr, 5)).toEqual([5,1,2,3,4]);
  });

  test('orPush: 既存配列が空配列のとき', () => {
    const obj: any = { arr: [] };
    orPush(obj, 'arr', 42);
    expect(obj.arr).toEqual([42]);
  });

  test('createNumberBetweenArray: start > end の場合', () => {
    expect(createNumberBetweenArray(5, 1)).toEqual([]);
  });

  test('getReboundIndexValue: 配列長1の場合', () => {
    const arr = [99];
    expect(getReboundIndexValue(arr, 0)).toBe(undefined);
    expect(getReboundIndexValue(arr, 1)).toBe(undefined);
    expect(getReboundIndexValue(arr, -1)).toBe(undefined);
  });

  test('findNthOneIndex: 配列が空の場合', () => {
    expect(findNthOneIndex([], 1, 1)).toBe(-1);
  });

  test('shiftArrayAsIndex: indexが範囲外の場合', () => {
    const arr = [1,2,3];
    expect(shiftArrayAsIndex(arr, 5)).toEqual([1,2,3]);
    expect(shiftArrayAsIndex(arr, -1)).toEqual([3,1,2]);
  });

  test('shiftArray: targetが存在しない場合', () => {
    const arr = [1,2,3];
    expect(shiftArray(arr, 99)).toEqual([3,1,2]);
  });
}); 