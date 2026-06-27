import { describe, expect, it } from 'vitest';
import {
    ERROR_MESSAGE,
    evaluateExpression,
    formatResult,
    hasDivisionByZero,
    replaceTrailingOperator,
} from './calculator-logic.js';

describe('formatResult', () => {
    it('округляет дробные результаты', () => {
        expect(formatResult(0.1 + 0.2)).toBe('0.3');
    });

    it('превращает -0 в 0', () => {
        expect(formatResult(-0)).toBe('0');
    });

    it('использует экспоненциальную запись для длинных чисел', () => {
        expect(formatResult(123456789012345)).toMatch(/e\+?\d+/);
    });
});

describe('hasDivisionByZero', () => {
    it('обнаруживает деление на ноль', () => {
        expect(hasDivisionByZero('10/0')).toBe(true);
        expect(hasDivisionByZero('5+2/0')).toBe(true);
    });

    it('не считает деление на 0.5 ошибкой', () => {
        expect(hasDivisionByZero('10/0.5')).toBe(false);
    });
});

describe('evaluateExpression', () => {
    it('вычисляет базовые операции', () => {
        expect(evaluateExpression('2+3')).toEqual({ ok: true, value: '5' });
        expect(evaluateExpression('10-4')).toEqual({ ok: true, value: '6' });
        expect(evaluateExpression('6*7')).toEqual({ ok: true, value: '42' });
        expect(evaluateExpression('15/3')).toEqual({ ok: true, value: '5' });
    });

    it('поддерживает символ умножения ×', () => {
        expect(evaluateExpression('4×5')).toEqual({ ok: true, value: '20' });
    });

    it('возвращает ошибку при делении на ноль', () => {
        expect(evaluateExpression('8/0')).toEqual({ ok: false, value: ERROR_MESSAGE });
    });

    it('возвращает ошибку для некорректного выражения', () => {
        expect(evaluateExpression('2+')).toEqual({ ok: false, value: ERROR_MESSAGE });
        expect(evaluateExpression('abc')).toEqual({ ok: false, value: ERROR_MESSAGE });
    });
});

describe('replaceTrailingOperator', () => {
    it('заменяет последний оператор', () => {
        expect(replaceTrailingOperator('12+', '-')).toBe('12-');
    });

    it('добавляет оператор, если последний символ — число', () => {
        expect(replaceTrailingOperator('12', '+')).toBe('12+');
    });
});
