/*****************************************************
 *
 *
 * Author:  sml2h3
 * Date:    2021-03-12
 * File:    trademark_fix
 * Project: ast_tools
 *****************************************************/

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const generator = require("@babel/generator").default;

const IfWithExpressFix = require('../libs/common/IfWithExpressFix')
const ForWithExpressFix = require('../libs/common/ForWithExpressFix')
const ForWithForFix = require('../libs/common/ForWithForFix')
const VariableDeclaratorFix = require('../libs/common/VariableDeclaratorFix')
const ConditionalFix = require('../libs/common/ConditionalFix')
const ReturnSeqFix = require('../libs/common/ReturnSeqFix')
const SequenceExpressionFix = require('../libs/common/SequenceExpressionFix')
const AssignmentWithConditionalFix = require('../libs/common/AssignmentWithConditionalFix')
const LogicalExpressionFix = require('../libs/common/LogicalExpressionFix')
const UnaryFunctionFix = require('../libs/common/UnaryFunctionFix')
const CleanNullFix = require('../libs/common/CleanNullIfFix')


function fix(source_code) {
    const ast = parser.parse(source_code)
    // 格式修复
    traverse(ast, IfWithExpressFix.fix)
    traverse(ast, ForWithExpressFix.fix)
    traverse(ast, ForWithForFix.fix)
    traverse(ast, ReturnSeqFix.fix)


    // 内容修复
    traverse(ast, VariableDeclaratorFix.fix)
    traverse(ast, ConditionalFix.fix)

    traverse(ast, SequenceExpressionFix.fix)
    traverse(ast, AssignmentWithConditionalFix.fix)



    global.flag = true;
    while (global.flag){
        global.flag = false
        traverse(ast, LogicalExpressionFix.fix)
        traverse(ast, SequenceExpressionFix.fix)
        traverse(ast, ConditionalFix.fix)

    }

    traverse(ast, UnaryFunctionFix.fix)


    traverse(ast, CleanNullFix.fix)

    const opts = {
        indent: {
            adjustMultilineComment: true,
            style: "        ",
            base: 0
        }
    }
    return generator(ast, opts).code
}

exports.fix = fix