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
const traverse_ifblock = {
    IfStatement(path) {
        fix(path)
    }

}

function fix(path) {
    const node = path.node;
    const scope = path.scope;
    if (node.consequent && types.isBlockStatement(node.consequent) && node.consequent.body.length === 0){
        path.replaceWith(types.ifStatement(types.unaryExpression('!',node.test), node.alternate, null))
    }else if (node.alternate && types.isBlockStatement(node.alternate) && node.alternate.body.length === 0){
        path.replaceWith(types.ifStatement(node.test, node.consequent, null))
    }

}

exports.fix = traverse_ifblock