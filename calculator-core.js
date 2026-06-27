(function (global) {
    'use strict';

    const ERROR_MESSAGE = 'Ошибка';

    function formatResult(result) {
        const rounded = Math.round(result * 1e10) / 1e10;
        let text = Object.is(rounded, -0) ? '0' : rounded.toString();

        if (text.length > 14) {
            text = result.toExponential(6).replace(/\.?0+e/, 'e');
        }

        return text;
    }

    function hasDivisionByZero(expression) {
        return expression.includes('/0') && !expression.includes('/0.');
    }

    function evaluateExpression(input) {
        try {
            const expression = input.replace(/×/g, '*');

            if (hasDivisionByZero(expression)) {
                return { ok: false, value: ERROR_MESSAGE };
            }

            const result = Function('"use strict"; return (' + expression + ')')();

            if (isNaN(result) || !isFinite(result)) {
                return { ok: false, value: ERROR_MESSAGE };
            }

            return { ok: true, value: formatResult(result) };
        } catch {
            return { ok: false, value: ERROR_MESSAGE };
        }
    }

    function replaceTrailingOperator(input, operator) {
        const lastChar = input[input.length - 1];
        if (['+', '-', '*', '/'].includes(lastChar)) {
            return input.slice(0, -1) + operator;
        }
        return input + operator;
    }

    global.CalculatorCore = {
        ERROR_MESSAGE,
        formatResult,
        hasDivisionByZero,
        evaluateExpression,
        replaceTrailingOperator,
    };
})(typeof globalThis !== 'undefined' ? globalThis : window);
