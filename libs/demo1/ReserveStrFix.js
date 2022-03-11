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
const traverse_reserve = {
    ExpressionStatement(path) {
        fix(path)
    }

}

function fix(path) {
    const node = path.node;
    const scope = path.scope;
    if (types.isAssignmentExpression(node.expression) && types.isIdentifier(node.expression.left) &&
        types.isCallExpression(node.expression.right) && node.expression.right.arguments.length === 1 &&
        types.isLiteral(node.expression.right.arguments[0]) && node.expression.right.arguments[0].value === '' &&
        types.isMemberExpression(node.expression.right.callee) && types.isCallExpression(node.expression.right.callee.object) &&
        types.isIdentifier(node.expression.right.callee.property) && node.expression.right.callee.property.name === "join" &&
        node.expression.right.callee.object.arguments.length === 0 && types.isMemberExpression(node.expression.right.callee.object.callee) &&
        types.isIdentifier(node.expression.right.callee.object.callee.property) && node.expression.right.callee.object.callee.property.name === "reverse"
    ) {
        var parent = path.parent.body;
        if (parent.length === undefined){
            parent = parent.body
        }
        var expr_idx = parent.indexOf(node)
        var vari_name = node.expression.left.name;
        var line = null
        var line_id
        var search_flag = false
        for (let idx = expr_idx-1;idx >= 0;idx--){
            if (types.isExpressionStatement(parent[idx])){
                if (types.isAssignmentExpression(parent[idx].expression) && parent[idx].expression.operator === "=" && types.isIdentifier(parent[idx].expression.left)){
                    if (parent[idx].expression.left.name === vari_name){
                        line = parent[idx]
                        line_id = idx
                        search_flag = true
                        break
                    }
                }
            }else if (types.isVariableDeclaration(parent[idx])){
                if (types.isIdentifier(parent[idx].declarations[0].id) && parent[idx].declarations[0].id.name === vari_name){
                    line = parent[idx]
                    line_id = idx
                    search_flag = true
                    break
                }
            }
        }
        if (search_flag){
            if (types.isExpressionStatement(line)){
                var vari_value = line.expression.right.value;
                vari_value = vari_value.split("").reverse().join("");
                parent[line_id].expression.right.value = vari_value
                parent.splice(parent.indexOf(node), 1)
            }else if (types.isVariableDeclaration(line)){
                var vari_value = line.declarations[0].init.value;
                vari_value = vari_value.split("").reverse().join("");
                parent[line_id].declarations[0].init.value = vari_value
                parent.splice(parent.indexOf(node), 1)
            }


        }
    }

}

exports.fix = traverse_reserve