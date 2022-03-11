/*****************************************************
 *
 *
 * Author:  sml2h3
 * Date:    2021-03-29
 * File:    ConditionAssertFix
 * Project: ast_tools
 *****************************************************/

const types = require("@babel/types");
const traverse_ConditionalVariableDeclarator = {
    VariableDeclaration(path) {
        fix(path, 'variable')
    },
    ExpressionStatement(path) {
        fix(path, 'assignment')
    }
}

function fix(path, t) {
    const node = path.node;
    const scope = path.scope;
    const seqs = []
    if (t === "variable") {
        let declarations_list = node.declarations;
        if (declarations_list.length < 2){
            return;
        }
        let kind = node.kind;
        for (var ids = 0; ids < declarations_list.length; ids++) {
            var declarator = declarations_list[ids]
            seqs.push(types.variableDeclaration(kind = kind, declarations = [declarator]))
        }
    } else {
        if (types.isSequenceExpression(node.expression)) {
            let assignments = node.expression.expressions;
            if (assignments.length < 2){
                return;
            }
            for (var ids = 0; ids < assignments.length; ids++) {
                var assignment = assignments[ids];
                seqs.push(types.expressionStatement(expression = assignment))
            }
        }
    }
    if (!seqs.length) {
        return
    }

    switch (path.parentPath.type) {
        case 'Program':
        case 'BlockStatement':
            let _path = path.parentPath
            let _node = _path.node
            let _body = _node.body;
            for (var ids = 0; ids < seqs.length; ids++) {
                _body.splice(_body.indexOf(node), 0, seqs[ids])
            }
            _body.splice(_body.indexOf(node), 1)
            break
        case 'ForStatement':
            // 判断是否在init部分
            if (node === path.parentPath.node.init){
                let _node = path.parentPath.node;
                let _init = _node.init;
                let _body = path.parentPath.parent.body;
                for (var ids = 0; ids < seqs.length - 1; ids++) {
                    _body.splice(_body.indexOf(_node), 0, seqs[ids])
                }
                _node.init = seqs[seqs.length - 1]
            }else{
                console.log("逗号表达式处于for循环，但未在init部分")
            }
            break
        case 'SwitchCase':
            let __node = path.parentPath.node;
            let consequent = __node.consequent;
            for (var ids = 0; ids < seqs.length; ids++) {
                consequent.splice(consequent.indexOf(node), 0, seqs[ids])
            }
            consequent.splice(consequent.indexOf(node), 1)
            break
        default:
            console.log(path.parentPath.type)
            debugger
            break
    }


}


exports.fix = traverse_ConditionalVariableDeclarator
