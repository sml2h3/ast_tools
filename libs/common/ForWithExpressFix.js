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
const traverse_forexpress = {
    ForStatement(path) {
        fix(path)
    }
}

function fix(path) {
    const node = path.node;
    const scope = path.scope;
    if (types.isForStatement(node) &&
        types.isExpressionStatement(node.body)) {
        if (types.isExpressionStatement(node.body) || node.body === null) {
            if (node.consequent === null) {
                path.node.body = types.blockStatement([])
            } else {
                path.node.body = types.blockStatement([node.body])
            }
        }else {
            console.log("发现未知ifwithexpress")
        }
    }
}

exports.fix = traverse_forexpress