/*****************************************************
 *
 *
 * Author:  sml2h3
 * Date:    2021-03-30
 * File:    ReturnSeqFix
 * Project: ast_tools
 *****************************************************/
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
const traverse_returnSeqFix = {
    ReturnStatement(path) {
        fix(path)
    }
}

function fix(path) {
    const node = path.node;
    const scope = path.scope;
    if (types.isSequenceExpression(node.argument)) {
        const arguments = node.argument.expressions;
        const seqs = []
        const parent = path.parent;
        for (var ids = 0; ids < arguments.length; ids++) {
            var argument = arguments[ids];
            seqs.push(types.expressionStatement(expression = argument))
        }
        switch (parent.type) {
            case 'SwitchCase':
                const consequent = parent.consequent;
                for (var ids = 0; ids < seqs.length - 1; ids++) {
                    consequent.splice(consequent.indexOf(node), 0, seqs[ids])
                }
                node.argument = seqs[seqs.length-1]
                break
            case 'Program':
            case 'BlockStatement':
                const body = parent.body;
                for (var ids = 0; ids < seqs.length - 1; ids++) {
                    body.splice(body.indexOf(node), 0, seqs[ids])
                }
                node.argument = seqs[seqs.length-1]
                break
            default:
                console.log("出现未知拥有逗号表达式的return未处理")
                break
        }

    }
}

exports.fix = traverse_returnSeqFix