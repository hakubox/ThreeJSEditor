/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Scene = function (editor) {

    var signals = editor.signals;

    var container = new UI.Panel();
    container.setBorderTop('0');
    container.setPaddingTop('20px');

    // outliner

    function buildOption(object, draggable) {

        var option = document.createElement('div');
        option.draggable = draggable;
        option.innerHTML = buildHTML(object);
        option.value = object.id;

        return option;

    }

    function getMaterialName(material) {

        if (Array.isArray(material)) {

            var array = [];

            for (var i = 0; i < material.length; i++) {

                array.push(material[i].name);

            }

            return array.join(',');

        }

        return material.name;

    }

    function buildHTML(object) {
        var _type = object.name.indexOf("ObjectModel") === 0 ? "ObjectModel" : object.type;
        var html = '<span class="type ' + _type + '"></span> ' + object.name;

        if (object instanceof THREE.Mesh) {

            var geometry = object.geometry;
            var material = object.material;
            html += ' <span class="type ' + geometry.type + '"></span> ' + geometry.name;
            html += ' <span class="type ' + material.type + '"></span> ' + getMaterialName(material);
        }

        html += getScript(object.uuid);

        return html;

    }

    function getScript(uuid) {

        if (editor.scripts[uuid] !== undefined) {

            return ' <span class="type Script"></span>';

        }

        return '';
    }

    var ignoreObjectSelectedSignal = false;

    var outliner = new UI.Outliner(editor);
    outliner.setId('outliner');
    outliner.onChange(function () {

        ignoreObjectSelectedSignal = true;

        editor.selectById(parseInt(outliner.getValue()));

        ignoreObjectSelectedSignal = false;

    });
    outliner.onDblClick(function () {

        editor.focusById(parseInt(outliner.getValue()));

    });
    container.add(outliner);
    container.add(new UI.Break());

    // background

    function onBackgroundChanged() {

        signals.sceneBackgroundChanged.dispatch(backgroundColor.getHexValue());

    }

    var backgroundRow = new UI.Row();

    var backgroundColor = new UI.Color().setValue('#aaaaaa').onChange(onBackgroundChanged);

    backgroundRow.add(new UI.Text('背景色').setWidth('90px'));
    backgroundRow.add(backgroundColor);

    container.add(backgroundRow);

    // fog

    function onFogChanged() {

        signals.sceneFogChanged.dispatch(
            fogType.getValue(),
            fogColor.getHexValue(),
            fogNear.getValue(),
            fogFar.getValue(),
            fogDensity.getValue()
        );

    }

    var fogTypeRow = new UI.Row();
    var fogType = new UI.Select().setOptions({

        'None': '无',
        'Fog': '线性',
        'FogExp2': '指数曲线'

    }).setWidth('150px');
    fogType.onChange(function () {

        onFogChanged();
        refreshFogUI();

    });

    fogTypeRow.add(new UI.Text('迷雾效果').setWidth('90px'));
    fogTypeRow.add(fogType);

    container.add(fogTypeRow);

    // fog color

    var fogPropertiesRow = new UI.Row();
    fogPropertiesRow.setDisplay('none');
    fogPropertiesRow.setMarginLeft('90px');
    container.add(fogPropertiesRow);

    var fogColor = new UI.Color().setValue('#aaaaaa');
    fogColor.onChange(onFogChanged);
    fogPropertiesRow.add(fogColor);

    // fog near

    var fogNear = new UI.Number(0.1).setWidth('40px').setRange(0, Infinity).onChange(onFogChanged);
    fogPropertiesRow.add(fogNear);

    // fog far

    var fogFar = new UI.Number(50).setWidth('40px').setRange(0, Infinity).onChange(onFogChanged);
    fogPropertiesRow.add(fogFar);

    // fog density

    var fogDensity = new UI.Number(0.05).setWidth('40px').setRange(0, 0.1).setPrecision(3).onChange(onFogChanged);
    fogPropertiesRow.add(fogDensity);

    //

    function refreshUI() {

        var camera = editor.camera;
        var scene = editor.scene;

        var options = [];

        options.push(buildOption(camera, false));
        options.push(buildOption(scene, false));

        (function addObjects(objects, pad) {

            for (var i = 0, l = objects.length; i < l; i++) {

                let object = objects[i];
                let option = buildOption(object, true);
                option.style.paddingLeft = (pad * 20) + 'px';

                if (object instanceof THREE.Mesh) {
                    (object.parent.children || []).forEach(function (item, index) {
                        if (item.id == object.id) {
                            let _next = object.parent.children[index + 1];
                            if (_next && (_next instanceof THREE.Mesh)) {


                                let mergeBSP = document.createElement('a');
                                mergeBSP.className = 'linkbutton pullright';
                                mergeBSP.innerHTML = '合并';
                                mergeBSP.title = '使用下方元素合并至当前元素';
                                mergeBSP.addEventListener('click', function (event) {
                                    if (confirm('是否确认使用下方模型合并至当前模型？（注意上下模型的纹理一定要相同才能合并，另外请备份原始模型）')) {
                                        try {
                                            let _initgeometry = new THREE.Geometry();
                                            let _position = Object.assign({}, object.position);
                                            let _position2 = Object.assign({}, _next.position);
                                            _next.position.set(
                                                _next.position.x - object.position.x,
                                                _next.position.y - object.position.y,
                                                _next.position.z - object.position.z);
                                            object.position.set(0, 0, 0);
                                            editor.signals.sceneGraphChanged.dispatch();
                                            let geometry = _next.geometry;
                                            let geometry2 = object.geometry;
                                            if (geometry.type.indexOf("Buffer") >= 0) {
                                                let _arr = Object.keys(geometry.parameters).map(function (item) { return geometry.parameters[item]; })
                                                geometry = new (Function.prototype.bind.apply(THREE[geometry.type.replace("Buffer", "")], [null].concat(_arr)))();
                                            }
                                            if (geometry2.type.indexOf("Buffer") >= 0) {
                                                let _arr = Object.keys(geometry2.parameters).map(function (item) { return geometry2.parameters[item]; })
                                                geometry2 = new (Function.prototype.bind.apply(THREE[geometry2.type.replace("Buffer", "")], [null].concat(_arr)))();
                                            }
                                            _initgeometry.merge(geometry, _next.matrix);
                                            _initgeometry.merge(geometry2, object.matrix);
                                            var _obj = new THREE.Mesh(_initgeometry, object.material);
                                            _obj.position.set(_position.x, _position.y, _position.z);
                                            _obj.name = object.name;
                                            editor.execute(new RemoveObjectCommand(object));
                                            editor.execute(new AddObjectCommand(_obj));
                                            var nextObject = scene.getObjectById(_next.id);
                                            moveObject(_obj, nextObject.parent, nextObject);
                                            editor.execute(new RemoveObjectCommand(_next));
                                            event.stopPropagation();
                                            event.preventDefault();
                                        } catch (e) {
                                            console.error('合并中出现错误，当前模型无法合并。', e);
                                        }
                                        return false;
                                    }
                                }, false);
                                option.appendChild(mergeBSP);



                                let subtractBSP = document.createElement('a');
                                subtractBSP.className = 'linkbutton pullright';
                                subtractBSP.innerHTML = '挖空';
                                subtractBSP.title = '利用下方元素挖空当前元素';
                                subtractBSP.addEventListener('click', function (event) {
                                    if (confirm('是否确认利用下方模型挖空当前模型？')) {
                                        try {
                                            let geometry = _next.geometry;
                                            let geometry2 = object.geometry;
                                            if (geometry.type.indexOf("Buffer") >= 0) {
                                                let _arr = Object.keys(geometry.parameters).map(function (item) { return geometry.parameters[item]; })
                                                _next.geometry = new (Function.prototype.bind.apply(THREE[geometry.type.replace("Buffer", "")], [null].concat(_arr)))();
                                            }
                                            if (geometry2.type.indexOf("Buffer") >= 0) {
                                                let _arr = Object.keys(geometry2.parameters).map(function (item) { return geometry2.parameters[item]; })
                                                object.geometry = new (Function.prototype.bind.apply(THREE[geometry2.type.replace("Buffer", "")], [null].concat(_arr)))();
                                            }

                                            let _bsp = new ThreeBSP(object).subtract(new ThreeBSP(_next));
                                            let _obj = _bsp.toMesh(object.material);
                                            _obj.material.flatshading = THREE.FlatShading;
                                            _obj.geometry.computeFaceNormals();  //重新计算几何体侧面法向量
                                            _obj.geometry.computeVertexNormals();
                                            _obj.material.needsUpdate = true;  //更新纹理
                                            _obj.geometry.buffersNeedUpdate = true;
                                            _obj.geometry.uvsNeedUpdate = true;
                                            _obj.castShadow = true;
                                            _obj.receiveShadow = true;

                                            _obj.name = object.name;
                                            editor.execute(new RemoveObjectCommand(object));
                                            editor.execute(new AddObjectCommand(_obj));

                                            var nextObject = scene.getObjectById(_next.id);
                                            moveObject(_obj, nextObject.parent, nextObject);
                                            event.stopPropagation();
                                            event.preventDefault();
                                        } catch (e) {
                                            console.error('合并中出现错误，当前模型无法挖空。', e);
                                        }
                                        return false;
                                    }
                                }, false);
                                option.appendChild(subtractBSP);
                                return false;
                            }
                        }
                    });
                }
                options.push(option);

                //if (object.name.indexOf("ObjectModel") !== 0) {
                addObjects(object.children, pad + 1);
                //}
            }

        })(scene.children, 1);

        outliner.setOptions(options);

        if (editor.selected !== null) {

            outliner.setValue(editor.selected.id);

        }

        if (scene.background) {

            backgroundColor.setHexValue(scene.background.getHex());

        }

        if (scene.fog) {

            fogColor.setHexValue(scene.fog.color.getHex());

            if (scene.fog instanceof THREE.Fog) {

                fogType.setValue("Fog");
                fogNear.setValue(scene.fog.near);
                fogFar.setValue(scene.fog.far);

            } else if (scene.fog instanceof THREE.FogExp2) {

                fogType.setValue("FogExp2");
                fogDensity.setValue(scene.fog.density);

            }

        } else {

            fogType.setValue("None");

        }

        refreshFogUI();

    }

    function refreshFogUI() {

        var type = fogType.getValue();

        fogPropertiesRow.setDisplay(type === 'None' ? 'none' : '');
        fogNear.setDisplay(type === 'Fog' ? '' : 'none');
        fogFar.setDisplay(type === 'Fog' ? '' : 'none');
        fogDensity.setDisplay(type === 'FogExp2' ? '' : 'none');

    }

    refreshUI();

    // events

    signals.editorCleared.add(refreshUI);

    signals.sceneGraphChanged.add(refreshUI);

    signals.objectChanged.add(function (object) {

        var options = outliner.options;

        for (var i = 0; i < options.length; i++) {

            var option = options[i];

            if (option.value === object.id) {

                option.innerHTML = buildHTML(object);
                return;

            }

        }

    });

    signals.objectSelected.add(function (object) {

        if (ignoreObjectSelectedSignal === true) return;

        outliner.setValue(object !== null ? object.id : null);

    });

    return container;

};
