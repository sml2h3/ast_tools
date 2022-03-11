/**
 * Ai > 6 && (y = d, Re = 1 | y[0], y = void 0, y = Re, ur = y, li = 16034);
 */

// 使用完后需要增加一个Sequence


const types = require("@babel/types");
const traverse_forexpress = {
    ExpressionStatement(path) {
        fix(path)
    }
}

function fix(path) {
    const node = path.node;
    const scope = path.scope;
    if (types.isExpressionStatement(node) &&
        types.isLogicalExpression(node.expression)) {
        let exp = node.expression;
        let ops = exp.operator;

        if (types.isBinaryExpression(exp.left) && types.isSequenceExpression(exp.right)) {
            let test = exp.left;
            if (ops === '&&') {
                let consequent = exp.right;
                path.replaceWith(types.ifStatement(test, types.blockStatement(
                    [
                        types.expressionStatement(
                            consequent
                        )
                    ]
                )))
            } else {
                let alternate = exp.right;
                path.replaceWith(types.ifStatement(test, types.blockStatement(
                    []
                ), types.blockStatement(
                    [types.expressionStatement(
                        alternate
                    )]
                )))
            }
            global.flag = true

        }

        if (types.isBinaryExpression(exp.left) && types.isAssignmentExpression(exp.right)) {
            let test = exp.left;
            if (ops === '&&') {
                let consequent = exp.right;
                path.replaceWith(types.ifStatement(test, types.blockStatement(
                    [
                        types.expressionStatement(
                            consequent
                        )
                    ]
                )))
            } else {
                let alternate = exp.right;
                path.replaceWith(types.ifStatement(test, types.blockStatement(
                    []
                ), types.blockStatement(
                    [types.expressionStatement(
                        alternate
                    )]
                )))
            }
            global.flag = true

        }

    }
}

exports.fix = traverse_forexpress