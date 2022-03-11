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
const generator = require("@babel/generator").default;
const traverse_decrypt_variable = {
    WhileStatement(path) {
        fix(path)
    },
    ForStatement(path) {
        fix(path)
    },
    ExpressionStatement(path) {
        fix(path)
    },
    VariableDeclaration(path) {
        fix(path)
    }

}

function get_name(a,  b, c){
    To = 0;
    In = "zeWURhDQZoAbrw_F4km9tlOI5ysBHYE0JC67KS8avqz1gdGpNX3uTnL2VMiPcfj$";
    qo = [];
    En = "";
    qo.push(In);
    In = "OnlSegCJXqkRd9UsrtoD57fhyviG0Qc2IWTaP_KNmMLZA18FEzVu3BYjzp4bHw6$";
    qo.push(In);
    In = c;
    Ne = "jGi8LrT1_SpIE7930DOtezvhgzamMZbuwQUBRdYnJlKN4sc6XPoHWCVk52FfqAy$";
    uo = b;
    qo.push(Ne);
    Ne = qo[In];

    while (uo > To) {
        In = a.pop();
        qo = 0;
        be = "";

        while (In > 0) {
            qo = In % (Ne.length + 1);
            be += Ne.charAt(qo - 1);
            In = Math.floor(In / (Ne.length + 1));
        }

        En += be;
        To++;
    }

    return En
}

function fix(path) {
    const node = path.node;
    const scope = path.scope;
    if (types.isWhileStatement(node) && types.isBinaryExpression(node.test) &&
        node.test.operator === "<" && types.isIdentifier(node.test.left) &&
        types.isMemberExpression(node.test.right) && node.body.body.length === 3 &&
        types.isExpressionStatement(node.body.body[node.body.body.length - 1]) &&
        types.isUpdateExpression(node.body.body[node.body.body.length - 1].expression )
    ) {
        var parent = path.parent.body;
        if (parent.length === undefined){
            parent = parent.body
        }
        var while_idx = parent.indexOf(node)
        var ids = [];
        path.traverse({
            Identifier(_path){
                if (_path.node.name.length < 3  && ids.indexOf(_path.node.name) < 0){
                    ids.push(_path.node.name)
                }

            }
        })
        if (ids.length === 4){
            ids.splice(2, 1)
            var lines = []
            for (let id in ids){
                id = ids[id]
                var search_flag = false
                for (let idx = while_idx-1;idx >= 0;idx--){
                    if (types.isExpressionStatement(parent[idx])){
                        if (types.isAssignmentExpression(parent[idx].expression) && parent[idx].expression.operator === "=" && types.isIdentifier(parent[idx].expression.left)){
                            if (parent[idx].expression.left.name === id){
                                lines.push(parent[idx])
                                search_flag = true
                                break
                            }
                        }
                    }else if (types.isVariableDeclaration(parent[idx])){
                        if (types.isIdentifier(parent[idx].declarations[0].id) && parent[idx].declarations[0].id.name === id){
                            lines.push(parent[idx])
                            search_flag = true
                            break
                        }
                    }
                }
            }
            var _cal_list = []
            for (let i = 0 ;i < lines.length;i++){
                parent.splice(parent.indexOf(lines[i]), 1)
                _cal_list.push(lines[i])
            }
            _cal_list.push(node)
            _cal_list.push(types.returnStatement(types.identifier(ids[2])))
            var get_param_func = types.expressionStatement(
                types.callExpression(
                    types.functionExpression(
                        null,
                        [],
                        types.blockStatement(
                            [
                                types.functionDeclaration(
                                    types.identifier('getvalue'),
                                    [],
                                    types.blockStatement(
                                        _cal_list
                                    )
                                ),
                                types.returnStatement(
                                    types.identifier('getvalue')
                                )
                            ]
                        )
                    ),
                    []
                )
            )
            get_param_func = generator(get_param_func).code
            var s = eval(get_param_func)()
            parent.splice(parent.indexOf(node), 0, types.variableDeclaration("var", [types.variableDeclarator(types.identifier(ids[2]), types.stringLiteral(s))]))
            parent.splice(parent.indexOf(node), 1)
        }

    }else if (types.isForStatement(node) && types.isVariableDeclaration(node.init) &&
        types.isStringLiteral(node.init.declarations[0].init) && node.init.declarations[0].init.value === ""
    ){

        var parent = path.parent.body;
        if (parent.length === undefined){
            parent = parent.body
        }
        var while_idx = parent.indexOf(node)
        var ids = [];
        path.traverse({
            Identifier(_path){
                if (_path.node.name.length < 3  && ids.indexOf(_path.node.name) < 0){
                    ids.push(_path.node.name)
                }

            }
        })
        if (ids.length === 4){
            ids.splice(3, 1)
            var lines = []
            for (let id in ids){
                id = ids[id]
                var search_flag = false
                for (let idx = while_idx-1;idx >= 0;idx--){
                    if (types.isExpressionStatement(parent[idx])){
                        if (types.isAssignmentExpression(parent[idx].expression) && parent[idx].expression.operator === "=" && types.isIdentifier(parent[idx].expression.left)){
                            if (parent[idx].expression.left.name === id){
                                lines.push(parent[idx])
                                search_flag = true
                                break
                            }
                        }
                    }else if (types.isVariableDeclaration(parent[idx])){
                        if (types.isIdentifier(parent[idx].declarations[0].id) && parent[idx].declarations[0].id.name === id){
                            lines.push(parent[idx])
                            search_flag = true
                            break
                        }
                    }
                }
            }
            var _cal_list = []
            for (let i = 0 ;i < lines.length;i++){
                parent.splice(parent.indexOf(lines[i]), 1)
                _cal_list.push(lines[i])
            }
            _cal_list.push(node)
            _cal_list.push(types.returnStatement(types.identifier(ids[0])))
            var get_param_func = types.expressionStatement(
                types.callExpression(
                    types.functionExpression(
                        null,
                        [],
                        types.blockStatement(
                            [
                                types.functionDeclaration(
                                    types.identifier('getvalue'),
                                    [],
                                    types.blockStatement(
                                        _cal_list
                                    )
                                ),
                                types.returnStatement(
                                    types.identifier('getvalue')
                                )
                            ]
                        )
                    ),
                    []
                )
            )
            get_param_func = generator(get_param_func).code
            var s = eval(get_param_func)()
            parent.splice(parent.indexOf(node), 0, types.variableDeclaration("var", [types.variableDeclarator(types.identifier(ids[0]), types.stringLiteral(s))]))
            parent.splice(parent.indexOf(node), 1)
        }
    } else if (types.isExpressionStatement(node) && types.isAssignmentExpression(node.expression) &&
        types.isCallExpression(node.expression.right) && types.isMemberExpression(node.expression.right.callee) &&
        types.isIdentifier(node.expression.right.callee.object) && node.expression.right.callee.object.name === "w" &&
        types.isIdentifier(node.expression.right.callee.property) &&  node.expression.right.callee.property.name === "pop"
    ){
        var parent = path.parent.body;
        if (parent.length === undefined){
            parent = parent.body
        }
        var ass_idx = parent.indexOf(node)
        if (ass_idx <= 0){

        }
        var del_idx = null
        for (var i = ass_idx - 1; i >= 0; i--){
            var tmp_node = parent[i]
            if (types.isExpressionStatement(tmp_node) && types.isCallExpression(tmp_node.expression) &&
                types.isIdentifier(tmp_node.expression.callee) && tmp_node.expression.callee.name === "e" &&
                tmp_node.expression.arguments.length === 3 && types.isNumericLiteral(tmp_node.expression.arguments[0]) && tmp_node.expression.arguments[0].value === 14 &&
                types.isNumericLiteral(tmp_node.expression.arguments[1]) && tmp_node.expression.arguments[1].value === 2 &&
                types.isUnaryExpression(tmp_node.expression.arguments[2]) && tmp_node.expression.arguments[2].operator === "-" && types.isNumericLiteral(tmp_node.expression.arguments[2].argument) && tmp_node.expression.arguments[2].argument.value === 1
            ){
                del_idx = i
                break
            }
        }
        if (del_idx === null){
            // console.log("bbbbbbbbbbbbbbbbbbb")
        }
        var param_idx = null
        var params = []
        for (var i = ass_idx - 1; i >= 0; i--){
            var tmp_node = parent[i]
            if (types.isExpressionStatement(tmp_node) && types.isCallExpression(tmp_node.expression) &&
                types.isMemberExpression(tmp_node.expression.callee) && types.isIdentifier(tmp_node.expression.callee.object) && tmp_node.expression.callee.object.name === "w" &&
                types.isIdentifier(tmp_node.expression.callee.property) && tmp_node.expression.callee.property.name === "push"
            ){
                for (var a = 0; a < tmp_node.expression.arguments.length; a++){
                    params.push(parseInt(generator(tmp_node.expression.arguments[a]).code))
                }

                param_idx = i
                break
            }
        }
        if (ass_idx > 0 && del_idx !== null && param_idx !== null){
            var c = params.pop()
            var b = params.pop()
            var a = params;
            var result = get_name(a, b , c);
            node.expression.right = types.stringLiteral(result)
            parent.splice(del_idx, 1)
            parent.splice(param_idx, 1)
        }
    }else if (types.isVariableDeclaration(node) && node.declarations.length === 1 && types.isVariableDeclarator(node.declarations[0]) &&
        types.isCallExpression(node.declarations[0].init) && types.isMemberExpression(node.declarations[0].init.callee) &&
        types.isIdentifier(node.declarations[0].init.callee.object) && node.declarations[0].init.callee.object.name === "w" &&
        types.isIdentifier(node.declarations[0].init.callee.property) &&  node.declarations[0].init.callee.property.name === "pop"
    ){
        var parent = path.parent.body;
        if (parent.length === undefined){
            parent = parent.body
        }
        var ass_idx = parent.indexOf(node)
        if (ass_idx <= 0){
            // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        }
        var del_idx = null
        for (var i = ass_idx - 1; i >= 0; i--){
            var tmp_node = parent[i]
            if (types.isExpressionStatement(tmp_node) && types.isCallExpression(tmp_node.expression) &&
                types.isIdentifier(tmp_node.expression.callee) && tmp_node.expression.callee.name === "e" &&
                tmp_node.expression.arguments.length === 3 && types.isNumericLiteral(tmp_node.expression.arguments[0]) && tmp_node.expression.arguments[0].value === 14 &&
                types.isNumericLiteral(tmp_node.expression.arguments[1]) && tmp_node.expression.arguments[1].value === 2 &&
                types.isUnaryExpression(tmp_node.expression.arguments[2]) && tmp_node.expression.arguments[2].operator === "-" && types.isNumericLiteral(tmp_node.expression.arguments[2].argument) && tmp_node.expression.arguments[2].argument.value === 1
            ){
                del_idx = i
                break
            }
        }
        if (del_idx === null){
            // console.log("bbbbbbbbbbbbbbbbbbb")
        }
        var param_idx = null
        var params = []
        for (var i = ass_idx - 1; i >= 0; i--){
            var tmp_node = parent[i]
            if (types.isExpressionStatement(tmp_node) && types.isCallExpression(tmp_node.expression) &&
                types.isMemberExpression(tmp_node.expression.callee) && types.isIdentifier(tmp_node.expression.callee.object) && tmp_node.expression.callee.object.name === "w" &&
                types.isIdentifier(tmp_node.expression.callee.property) && tmp_node.expression.callee.property.name === "push"
            ){
                for (var a = 0; a < tmp_node.expression.arguments.length; a++){
                    params.push(parseInt(generator(tmp_node.expression.arguments[a]).code))
                }

                param_idx = i
                break
            }
        }
        if (ass_idx > 0 && del_idx !== null && param_idx !== null){
            var c = params.pop()
            var b = params.pop()
            var a = params;
            var result = get_name(a, b , c);
            node.declarations[0].init = types.stringLiteral(result)
            parent.splice(del_idx, 1)
            parent.splice(param_idx, 1)
        }
    }
}

exports.fix = traverse_decrypt_variable