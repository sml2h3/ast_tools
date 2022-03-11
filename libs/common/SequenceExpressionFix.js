/**
 * if (12 == Ai) {
    N = Se[vo], Q = N[Z](), li = Q ? 11460 : 1475;
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
        types.isSequenceExpression(node.expression)) {
        let seqs = node.expression.expressions;
        switch (path.parentPath.type){
            case 'BlockStatement':
                let _body = path.parentPath.node.body;
                for (var ids = 0; ids < seqs.length; ids++) {
                    _body.splice(_body.indexOf(node), 0, types.expressionStatement(seqs[ids]))
                }
                _body.splice(_body.indexOf(node), 1)
                break;
        }
    }
}

exports.fix = traverse_forexpress