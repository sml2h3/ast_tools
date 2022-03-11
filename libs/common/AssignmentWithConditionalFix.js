/**
 * li = Q ? 11460 : 1475
 }
 */



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
        types.isAssignmentExpression(node.expression)) {
        let ops = node.expression.operator;
        let left = node.expression.left;
        let right = node.expression.right;
        if (types.isIdentifier(left) && types.isConditional(right) && types.isNumericLiteral(right.consequent) && types.isNumericLiteral(right.alternate)) {
            let right_conseq = right.consequent;
            let right_alter = right.alternate;
            let right_test = right.test;
            switch (path.parentPath.type) {
                case 'BlockStatement':
                    let _body = path.parentPath.node.body;
                    path.replaceWith(types.ifStatement(
                        right_test,
                        types.blockStatement(
                            [types.expressionStatement(
                                types.assignmentExpression(ops, left, right_conseq)
                            )]
                        )
                        ,
                        types.blockStatement([
                            types.expressionStatement(
                                types.assignmentExpression(ops, left, right_alter)
                            )
                        ])

                    ))
                    break;
            }

        }
    }
}

exports.fix = traverse_forexpress