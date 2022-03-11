/*****************************************************
 *
 *
 * Author:  sml2h3
 * Date:    2021-06-10
 * File:    UnaryFunctionFix
 * Project: ast_tools
 *****************************************************/

/*****************************************************
 *
 *
 * Author:  sml2h3
 * Date:    2021-03-29
 * File:    IfWithExpressFix
 * Project: ast_tools
 *****************************************************/

/*
* example
* if (typeof _$$U === _$Ma[9])
*     _$$U = _$dG(_$$U);
* */

const types = require("@babel/types");
const traverse_express = {
    ExpressionStatement(path) {
        fix(path)
    }
}

function fix(path) {
    const node = path.node;
    const scope = path.scope;
    if (types.isExpressionStatement(node) && types.isUnaryExpression(node.expression) &&
        node.expression.operator === "!" && types.isCallExpression(node.expression.argument) && node.expression.argument.arguments.length === 0 &&
        types.isFunctionExpression(node.expression.argument.callee) && node.expression.argument.callee.id === null &&
        node.expression.argument.callee.params.length === 0
    ) {
        let _body = node.expression.argument.callee.body
        switch (path.parentPath.node.type) {
            case 'BlockStatement':
                var __body = path.parentPath.node.body;
                for (var idx = 0; idx < _body.body.length; idx++){
                    __body.splice(__body.indexOf(node), 0, _body.body[idx])
                }
                __body.splice(__body.indexOf(node), 1)
                break;
            case 'SwitchCase':
                var __body = path.parentPath.node.consequent;
                for (var idx = 0; idx < _body.body.length; idx++){
                    __body.splice(__body.indexOf(node), 0, _body.body[idx])
                }
                __body.splice(__body.indexOf(node), 1)
                break;
        }
    }

}

exports.fix = traverse_express