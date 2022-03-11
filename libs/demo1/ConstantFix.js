/*****************************************************
 *
 *
 * Author:  sml2h3
 * Date:    2021-03-29
 * File:    ForWithExpressFix
 * Project: ast_tools
 *****************************************************/

/*
* example
* if (typeof _$$U === _$Ma[9])
*     _$$U = _$dG(_$$U);
* */

const types = require("@babel/types");
const traverse_constant = {
    VariableDeclaration(path) {
        fix(path)
    },
    ExpressionStatement(path) {
        fix(path)
    }
}

function fix(path) {
    const node = path.node;
    const scope = path.scope;
    if (types.isExpressionStatement(node) && types.isAssignmentExpression(node.expression)) {
        let expression = node.expression;
        if (expression.operator === "=" && types.isIdentifier(expression.left) && types.isStringLiteral(expression.right)){
            let parent = path.parentPath.node.body;
            let idx = parent.indexOf(node)
            if (parent.length > idx){
                var variable_name = expression.left.name;
                var variable_value = expression.right.value;
                var del_list = []
                for (let sid = idx + 1; sid < parent.length; sid++){
                    if (types.isExpressionStatement(parent[sid]) && types.isAssignmentExpression(parent[sid].expression) &&
                        types.isIdentifier(parent[sid].expression.left) && types.isStringLiteral(parent[sid].expression.right) &&
                        parent[sid].expression.operator === "+=" && parent[sid].expression.left.name === variable_name
                    ){
                        variable_value += parent[sid].expression.right.value
                        del_list.push(parent[sid])
                        // parent.splice(parent.indexOf(parent[sid]), 1)
                    }else if (types.isExpressionStatement(parent[sid]) && types.isAssignmentExpression(parent[sid].expression) &&
                        types.isIdentifier(parent[sid].expression.left) && types.isStringLiteral(parent[sid].expression.right) &&
                        parent[sid].expression.operator === "=" && parent[sid].expression.left.name === variable_name){
                        break
                    }
                }
                for (let did = 0; did < del_list.length; did++){
                    parent.splice(parent.indexOf(del_list[did]), 1)
                }
                expression.right.value = variable_value

            }

        }
    }else if (types.isVariableDeclaration(node) && types.isVariableDeclarator(node.declarations[0])) {
        let expression = node.declarations[0];
        if (types.isIdentifier(expression.id) && types.isStringLiteral(expression.init)){
            let parent = path.parentPath.node.body;
            if (parent.length === undefined){
               parent = parent.body
            }
            let idx = parent.indexOf(node)
            if (parent.length > idx){
                var variable_name = expression.id.name;
                var variable_value = expression.init.value;
                var del_list = []
                for (let sid = idx + 1; sid < parent.length; sid++){
                    if (types.isExpressionStatement(parent[sid]) && types.isAssignmentExpression(parent[sid].expression) &&
                        types.isIdentifier(parent[sid].expression.left) && types.isStringLiteral(parent[sid].expression.right) &&
                        parent[sid].expression.operator === "+=" && parent[sid].expression.left.name === variable_name
                    ){
                        variable_value += parent[sid].expression.right.value
                        del_list.push(parent[sid])
                        // parent.splice(parent.indexOf(parent[sid]), 1)
                    }else if (types.isExpressionStatement(parent[sid]) && types.isAssignmentExpression(parent[sid].expression) &&
                        types.isIdentifier(parent[sid].expression.left) && types.isStringLiteral(parent[sid].expression.right) &&
                        parent[sid].expression.operator === "=" && parent[sid].expression.left.name === variable_name){
                        break
                    }else if (types.isVariableDeclaration(parent[sid]) && types.isAssignmentExpression(parent[sid].declarations[0]) &&
                        types.isIdentifier(parent[sid].declarations[0].id) && types.isStringLiteral(parent[sid].declarations[0].init) &&
                        parent[sid].declarations[0].id.name === variable_name){
                        break
                    }
                }
                for (let did = 0; did < del_list.length; did++){
                    parent.splice(parent.indexOf(del_list[did]), 1)
                }
                expression.init.value = variable_value

            }

        }
    }
}

exports.fix = traverse_constant