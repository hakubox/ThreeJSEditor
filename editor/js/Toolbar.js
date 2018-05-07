/**
 * @author mrdoob / http://mrdoob.com/
 */

var Toolbar = function (editor) {

    var signals = editor.signals;

    var container = new UI.Panel();
    container.setId('toolbar');

    var buttons = new UI.Panel();
    container.add(buttons);

    // translate / rotate / scale

    var translate = new UI.Button('translate');
    translate.dom.title = 'W';
    translate.dom.innerHTML = '移动';
    translate.dom.className = 'Button selected';
    translate.onClick(function () {
        signals.transformModeChanged.dispatch('translate');
    });
    buttons.add(translate);

    var rotate = new UI.Button('rotate');
    rotate.dom.innerHTML = '旋转';
    rotate.dom.title = 'E';
    rotate.onClick(function () {

        signals.transformModeChanged.dispatch('rotate');

    });
    buttons.add(rotate);

    var scale = new UI.Button('scale');
    scale.dom.innerHTML = '缩放';
    scale.dom.title = 'R';
    scale.onClick(function () {

        signals.transformModeChanged.dispatch('scale');

    });
    buttons.add(scale);

    buttons.add(new UI.Text(' |&nbsp;'));

    var floor = new UI.Button('floor');
    floor.dom.innerHTML = '置于水平面';
    floor.dom.title = 'T';
    floor.onClick(function () {
        var _obj = editor.selected;
        if (!_obj) {
            alert("请先选择一个对象。");
            return;
        }
        editor.execute(new SetPositionCommand(_obj, new THREE.Vector3(_obj.position.x, 0 + _obj.geometry.parameters.height / 2, _obj.position.z)));
    });
    buttons.add(floor);

    var copy = new UI.Button('copy');
    copy.dom.innerHTML = '复制对象';
    copy.dom.title = 'C';
    copy.onClick(function () {
        var _obj = editor.selected;
        if (!_obj) {
            alert("请先选择一个对象。");
            return;
        }

        if (_obj instanceof THREE.Mesh) {
            let mesh = _obj.clone();
            mesh.geometry = _obj.geometry.clone();
            mesh.name = _obj.name + ' copy';
            editor.execute(new AddObjectCommand(mesh));
        } else if (_obj instanceof THREE.Group) {
            let mesh = _obj.clone();
            mesh.name = _obj.name + ' copy';
            editor.execute(new AddObjectCommand(mesh));
        }
    });
    buttons.add(copy);

    var copy = new UI.Button('copy');
    copy.dom.innerHTML = '执行代码';
    copy.dom.title = 'C';
    copy.onClick(function () {
        tempscript.open('执行临时代码', '\
//执行批量临时代码（不作任何形式的保存及历史操作处理\n\
//主对象：editor');
    });
    buttons.add(copy);

    signals.transformModeChanged.add(function (mode) {

        translate.dom.classList.remove('selected');
        rotate.dom.classList.remove('selected');
        scale.dom.classList.remove('selected');

        switch (mode) {

            case 'translate': translate.dom.classList.add('selected'); break;
            case 'rotate': rotate.dom.classList.add('selected'); break;
            case 'scale': scale.dom.classList.add('selected'); break;

        }

    });

    // grid

    var grid = new UI.Number(25).setWidth('40px').onChange(update);
    buttons.add(new UI.Text('网格: '));
    buttons.add(grid);

    var snap = new UI.THREE.Boolean(false, '单元').onChange(update).setTitle('snap');
    buttons.add(snap);

    var local = new UI.THREE.Boolean(false, '本地').onChange(update).setTitle('local');
    buttons.add(local);

    var showGrid = new UI.THREE.Boolean(true, '显示平面网格').onChange(update);
    buttons.add(showGrid);

    function update() {

        signals.snapChanged.dispatch(snap.getValue() === true ? grid.getValue() : null);
        signals.spaceChanged.dispatch(local.getValue() === true ? "local" : "world");
        signals.showGridChanged.dispatch(showGrid.getValue());

    }

    return container;

};
