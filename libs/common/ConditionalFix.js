/*****************************************************
 *
 *
 * Author:  sml2h3
 * Date:    2021-03-29
 * File:    ConditionalFix
 * Project: ast_tools
 *****************************************************/
/**
 * var _$7Y = _$6Q ? _$6Q._$Z1 : ''; VariableDeclaration
 * _$7Y = _$6Q ? _$6Q._$Z1 : ''; AssignmentExpression
 * **/
const types = require("@babel/types");
const traverse_ifexpress = {
    VariableDeclaration(path) {
        fix(path, 'variable')
    },
    ExpressionStatement(path) {
        fix(path, 'assign')
    },
    ReturnStatement(path) {
        fix(path, 'return')
    }
}

function fix(path, t) {
    const node = path.node;
    const scope = path.scope;
    if (t === 'variable') {
        if (node.declarations.length > 1 || node.declarations.length < 1) {
            console.log("请先进行逗号表达式还原")
            return;
        }
        const kind = node.kind;
        if (types.isVariableDeclarator(node.declarations[0])) {
            const id = node.declarations[0].id;
            const init = node.declarations[0].init;
            if (!types.isConditionalExpression(init)) {
                return
            }
            const test = init.test
            const consequent = init.consequent;
            const alternate = init.alternate;
            path.replaceWith(types.ifStatement(test, types.blockStatement([types.variableDeclaration(kind, [types.variableDeclarator(id, consequent)])]), types.blockStatement([types.variableDeclaration(kind, [types.variableDeclarator(id, alternate)])])))

        } else {
            console.log('VariableDeclaration格式异常，declarations中第0号元素不为VariableDeclarator')
            return;
        }
    } else if (t === 'assign') {
        if (types.isAssignmentExpression(node.expression) && types.isConditionalExpression(node.expression.right)) {
            const id = node.expression.left;
            const right = node.expression.right;
            const test = right.test
            const consequent = right.consequent;
            const alternate = right.alternate;
            path.replaceWith(types.ifStatement(test, types.blockStatement([types.expressionStatement(types.assignmentExpression('=', id, consequent))]), types.blockStatement([types.expressionStatement(types.assignmentExpression('=', id, alternate))])))
        } else if (types.isConditionalExpression(node.expression)) {
            const expression = node.expression;
            const test = expression.test
            const consequent = expression.consequent;
            const alternate = expression.alternate;
            switch (path.parent.type) {


                case 'ReturnStatement':
                    path.parentPath.replaceWith(types.ifStatement(test, types.returnStatement(consequent), types.returnStatement(alternate)))

                    break
                default:
                    path.replaceWith(types.ifStatement(test, types.blockStatement([types.expressionStatement(consequent)]), types.blockStatement([types.expressionStatement(alternate)])))

                    break
            }
        }
    } else if (t === "return") {
        if (types.isConditionalExpression(node.argument)) {
            const argument = node.argument;
            const test = argument.test
            const consequent = argument.consequent;
            const alternate = argument.alternate;
            path.replaceWith(types.ifStatement(test, types.blockStatement([types.returnStatement(consequent)]), types.blockStatement([types.returnStatement(alternate)])))
        }
    }
}

exports.fix = traverse_ifexpress