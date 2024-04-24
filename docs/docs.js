const varNames = ['x', 'y', 'z', 'w', 'a', 'b', 'c'];
const varType = ['str', 'int', 'float', 'bool', 'color', 'array', 'obj', 'func'];
const objs = ['gearWorks', 'draw', 'Math', 'document', 'console'];

for (let i in varType) {
    document.getElementsByClassName('container')[0].innerHTML = document.getElementsByClassName('container')[0].innerHTML.replaceAll(varType[i], '<span class="vartype">' + varType[i] + '</span>');
    document.getElementsByClassName('container')[0].innerHTML = document.getElementsByClassName('container')[0].innerHTML.replaceAll(varType[i], '<span class="vartype">' + varType[i] + '</span>');
}
for (let i in objs) {
    document.getElementsByClassName('container')[0].innerHTML = document.getElementsByClassName('container')[0].innerHTML.replaceAll(objs[i], '<span class="objs">' + objs[i] + '</span>');
    document.getElementsByClassName('container')[0].innerHTML = document.getElementsByClassName('container')[0].innerHTML.replaceAll(objs[i], '<span class="objs">' + objs[i] + '</span>');
}
for (let i in varNames) {
    document.getElementsByClassName('container')[0].innerHTML = document.getElementsByClassName('container')[0].innerHTML.replaceAll(varNames[i] + ",", '<span class="var">' + varNames[i] + '</span> ' + ',');
    document.getElementsByClassName('container')[0].innerHTML = document.getElementsByClassName('container')[0].innerHTML.replaceAll(varNames[i] + ")", '<span class="var">' + varNames[i] + '</span>' + ')');
}

function createTag(type, inner) {
    let tag = document.createElement(type);
    tag.appendChild(document.createTextNode(inner));
    return tag;
}

document.head.appendChild(createTag('style', `
.var{
    color: #33ECFF;
}
.vartype{
    color: #FF9012;
}
.objs {
    color: #9e3f00;
}
`));
