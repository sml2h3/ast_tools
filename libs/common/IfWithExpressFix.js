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
const traverse_ifexpress = {
    IfStatement(path) {
        fix(path)
    }

}

function fix(path) {
    const node = path.node;
    const scope = path.scope;
    if (types.isIfStatement(node) &&
        (types.isExpressionStatement(node.consequent) || types.isExpressionStatement(node.alternate) || node.consequent === null || node.alternate === null)) {
        if (!types.isBlockStatement(node.consequent) || node.consequent === null) {
            if (node.consequent === null) {
                path.node.consequent = types.blockStatement([])
            } else {
                path.node.consequent = types.blockStatement([node.consequent])
            }
        } else if (!types.isBlockStatement(node.alternate) || node.alternate === null) {
            if (node.alternate === null) {
            } else {
                path.node.alternate = types.blockStatement([node.alternate])
            }
        } else {
            console.log("发现未知ifwithexpress")
        }
    }else if (types.isIfStatement(node) &&
        (types.isReturnStatement(node.consequent) || types.isReturnStatement(node.alternate) || node.consequent === null || node.alternate === null)) {
        if (!types.isBlockStatement(node.consequent) || node.consequent === null) {
            if (node.consequent === null) {
                path.node.consequent = types.blockStatement([])
            } else {
                path.node.consequent = types.blockStatement([node.consequent])
            }
        } else if (!types.isBlockStatement(node.alternate) || node.alternate === null) {
            if (node.alternate === null) {
            } else {
                path.node.alternate = types.blockStatement([node.alternate])
            }
        } else {
            console.log("发现未知ifwithexpress")
        }
    }else{
        console.log("")
    }

}

exports.fix = traverse_ifexpress