/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Project = function (editor) {

    var config = editor.config;
    var signals = editor.signals;

    var rendererTypes = {
        'WebGLRenderer': 'WebGL渲染',
        'WebGLDeferredRenderer': '[x]WebGL延迟渲染',
        'CanvasRenderer': '[x]Canvas渲染',
        'SVGRenderer': '[x]SVG渲染',
        'SoftwareRenderer': '[x]软件渲染',
        'RaytracingRenderer': '[x]光线追踪渲染'
    };

    var container = new UI.Panel();
    container.setBorderTop('0');
    container.setPaddingTop('20px');

    // Title

    var titleRow = new UI.Row();
    var title = new UI.Input(config.getKey('project/title')).setLeft('100px').onChange(function () {

        config.setKey('project/title', this.getValue());

    });

    titleRow.add(new UI.Text('标题').setWidth('90px'));
    titleRow.add(title);

    container.add(titleRow);

    // class

    var options = {};

    for (var key in rendererTypes) {
        if (key.indexOf('WebGL') >= 0 && System.support.webgl === false) continue;
        options[key] = rendererTypes[key];
    }

    var rendererTypeRow = new UI.Row();
    var rendererType = new UI.Select().setOptions(options).setWidth('150px').onChange(function () {
        var value = this.getValue();
        config.setKey('project/renderer', value);
        updateRenderer();
    });

    rendererTypeRow.add(new UI.Text('渲染').setWidth('90px'));
    rendererTypeRow.add(rendererType);

    container.add(rendererTypeRow);

    if (config.getKey('project/renderer') !== undefined) {
        rendererType.setValue(config.getKey('project/renderer'));
    }

    // antialiasing

    var rendererPropertiesRow = new UI.Row().setMarginLeft('90px');

    var rendererAntialias = new UI.THREE.Boolean(config.getKey('project/renderer/antialias'), '抗锯齿').onChange(function () {

        config.setKey('project/renderer/antialias', this.getValue());
        updateRenderer();

    });
    rendererPropertiesRow.add(rendererAntialias);

    // shadow

    var rendererShadows = new UI.THREE.Boolean(config.getKey('project/renderer/shadows'), '阴影').onChange(function () {

        config.setKey('project/renderer/shadows', this.getValue());
        updateRenderer();

    });
    rendererPropertiesRow.add(rendererShadows);

    rendererPropertiesRow.add(new UI.Break());

    // gamma input

    var rendererGammaInput = new UI.THREE.Boolean(config.getKey('project/renderer/gammaInput'), 'γ input').onChange(function () {

        config.setKey('project/renderer/gammaInput', this.getValue());
        updateRenderer();

    });
    rendererPropertiesRow.add(rendererGammaInput);

    // gamma output

    var rendererGammaOutput = new UI.THREE.Boolean(config.getKey('project/renderer/gammaOutput'), 'γ output').onChange(function () {

        config.setKey('project/renderer/gammaOutput', this.getValue());
        updateRenderer();

    });
    rendererPropertiesRow.add(rendererGammaOutput);

    container.add(rendererPropertiesRow);

    // Editable

    var editableRow = new UI.Row();
    var editable = new UI.Checkbox(config.getKey('project/editable')).setLeft('100px').onChange(function () {

        config.setKey('project/editable', this.getValue());

    });

    editableRow.add(new UI.Text('可编辑').setWidth('90px').setTitle('[Editable] 导出后也带编辑按钮可随时编辑。'));
    editableRow.add(editable);

    container.add(editableRow);

    // VR

    var vrRow = new UI.Row();
    var vr = new UI.Checkbox(config.getKey('project/vr')).setLeft('100px').onChange(function () {

        config.setKey('project/vr', this.getValue());
        // updateRenderer();

    });

    vrRow.add(new UI.Text('VR').setWidth('90px').setTitle('VR虚拟现实，需要浏览器支持VR功能。'));
    vrRow.add(vr);

    container.add(vrRow);

    container.add(new UI.HorizontalRule());

    // 发布后是否允许设置镜头

    var orbitControlsRow = new UI.Row();
    orbitControlsRow.add(new UI.Text('允许控制相机').setWidth('90px').setTitle('orbitcontrols'));
    orbitControlsRow.add(new UI.Checkbox(config.getKey('project/orbitcontrols')).setLeft('100px').onChange(function () {
        config.setKey('project/orbitcontrols', this.getValue());
        updateOrbitcontrols();
    }));

    container.add(orbitControlsRow);

    //旋转速度

    var orbitControlsRotateSpeedRow = new UI.Row();
    orbitControlsRotateSpeedRow.add(new UI.Text('旋转速度').setWidth('90px').setTitle('rotateSpeed'));
    orbitControlsRotateSpeedRow.add(new UI.Checkbox(config.getKey('project/orbitcontrols/enablerotate')).setLeft('100px').onChange(function () {
        config.setKey('project/orbitcontrols/enablerotate', this.getValue());
        updateOrbitcontrols();
    }));

    var rotatespeedInput = new UI.Number(config.getKey('project/orbitcontrols/rotatespeed')).setWidth('140px').setMarginLeft('10px').onChange(function () {
        config.setKey('project/orbitcontrols/rotatespeed', this.getValue());
    });
    orbitControlsRotateSpeedRow.add(rotatespeedInput);

    container.add(orbitControlsRotateSpeedRow);

    //移动速度

    var orbitControlsKeyPanSpeedRow = new UI.Row();
    orbitControlsKeyPanSpeedRow.add(new UI.Text('移动速度').setWidth('90px').setTitle('keyPanSpeed'));
    orbitControlsKeyPanSpeedRow.add(new UI.Checkbox(config.getKey('project/orbitcontrols/enablepan')).setLeft('100px').onChange(function () {
        config.setKey('project/orbitcontrols/enablepan', this.getValue());
        updateOrbitcontrols();
    }));

    var keypanspeedInput = new UI.Number(config.getKey('project/orbitcontrols/keypanspeed')).setWidth('140px').setMarginLeft('10px').onChange(function () {
        config.setKey('project/orbitcontrols/keypanspeed', this.getValue());
    });
    orbitControlsKeyPanSpeedRow.add(keypanspeedInput);

    container.add(orbitControlsKeyPanSpeedRow);

    //滚轮滑动速度值

    var orbitControlsZoomSpeedRow = new UI.Row();
    orbitControlsZoomSpeedRow.add(new UI.Text('滚轮滑动速度').setWidth('90px').setTitle('zoomSpeed'));
    orbitControlsZoomSpeedRow.add(new UI.Checkbox(config.getKey('project/orbitcontrols/enablezoom')).setLeft('100px').onChange(function () {
        config.setKey('project/orbitcontrols/enablezoom', this.getValue());
        updateOrbitcontrols();
    }));

    var zoomSpeedInput = new UI.Number(config.getKey('project/orbitcontrols/zoomspeed')).setWidth('140px').setMarginLeft('10px').onChange(function () {
        config.setKey('project/orbitcontrols/zoomspeed', this.getValue());
    });
    orbitControlsZoomSpeedRow.add(zoomSpeedInput);

    container.add(orbitControlsZoomSpeedRow);

    //惯性滑动值

    var orbitControlsDampingFactorRow = new UI.Row();
    orbitControlsDampingFactorRow.add(new UI.Text('惯性滑动').setWidth('90px').setTitle('dampingFactor'));
    orbitControlsDampingFactorRow.add(new UI.Checkbox(config.getKey('project/orbitcontrols/enabledamping')).setLeft('100px').onChange(function () {
        config.setKey('project/orbitcontrols/enabledamping', this.getValue());
        updateOrbitcontrols();
    }));

    var dampingfactorInput = new UI.Number(config.getKey('project/orbitcontrols/dampingfactor')).setWidth('140px').setMarginLeft('10px').onChange(function () {
        config.setKey('project/orbitcontrols/dampingfactor', this.getValue());
    });
    orbitControlsDampingFactorRow.add(dampingfactorInput);

    container.add(orbitControlsDampingFactorRow);

    //相机距离范围

    var orbitControlsDistanceRow = new UI.Row();
    orbitControlsDistanceRow.add(new UI.Text('相机距离范围').setWidth('90px').setTitle('distance'));
    var minDistanceInput = new UI.Number(config.getKey('project/orbitcontrols/mindistance')).setWidth('80px').onChange(function () {
        config.setKey('project/orbitcontrols/mindistance', this.getValue());
    });
    orbitControlsDistanceRow.add(minDistanceInput);
    var maxDistanceInput = new UI.Number(config.getKey('project/orbitcontrols/maxdistance')).setWidth('80px').onChange(function () {
        config.setKey('project/orbitcontrols/maxdistance', this.getValue());
    });
    orbitControlsDistanceRow.add(maxDistanceInput);
    container.add(orbitControlsDistanceRow);

    //相机角度范围

    var orbitControlsPolarAngleRow = new UI.Row();
    orbitControlsPolarAngleRow.add(new UI.Text('相机角度范围').setWidth('90px').setTitle('distance'));
    var minPolarAngleInput = new UI.Number(config.getKey('project/orbitcontrols/minpolarangle')).setWidth('80px').onChange(function () {
        config.setKey('project/orbitcontrols/minpolarangle', this.getValue());
    });
    orbitControlsPolarAngleRow.add(minPolarAngleInput);
    var maxPolarAngleInput = new UI.Number(config.getKey('project/orbitcontrols/maxpolarangle')).setWidth('80px').onChange(function () {
        config.setKey('project/orbitcontrols/maxpolarangle', this.getValue());
    });
    orbitControlsPolarAngleRow.add(maxPolarAngleInput);
    container.add(orbitControlsPolarAngleRow);

    //相机缩放范围

    var orbitControlsZoomRow = new UI.Row();
    orbitControlsZoomRow.add(new UI.Text('相机缩放范围').setWidth('90px').setTitle('zoom'));
    var minZoomInput = new UI.Number(config.getKey('project/orbitcontrols/minzoom')).setWidth('80px').onChange(function () {
        config.setKey('project/orbitcontrols/minzoom', this.getValue());
    });
    orbitControlsZoomRow.add(minZoomInput);
    var maxZoomInput = new UI.Number(config.getKey('project/orbitcontrols/maxzoom')).setWidth('80px').onChange(function () {
        config.setKey('project/orbitcontrols/maxzoom', this.getValue());
    });
    orbitControlsZoomRow.add(maxZoomInput);
    container.add(orbitControlsZoomRow);

    //

    function updateRenderer() {

        createRenderer(rendererType.getValue(), rendererAntialias.getValue(), rendererShadows.getValue(), rendererGammaInput.getValue(), rendererGammaOutput.getValue());


    }

    function updateOrbitcontrols() {
        if (config.getKey('project/orbitcontrols')) {
            [
                orbitControlsRotateSpeedRow, 
                orbitControlsKeyPanSpeedRow,
                orbitControlsDampingFactorRow,
                orbitControlsZoomSpeedRow,
                orbitControlsDistanceRow,
                orbitControlsPolarAngleRow,
                orbitControlsZoomRow
            ].forEach(function (item) { item.setDisplay('') });
        } else {
            [
                orbitControlsRotateSpeedRow,
                orbitControlsKeyPanSpeedRow,
                orbitControlsDampingFactorRow,
                orbitControlsZoomSpeedRow,
                orbitControlsDistanceRow,
                orbitControlsPolarAngleRow,
                orbitControlsZoomRow
            ].forEach(function (item) { item.setDisplay('none') });
        }
    }

    function createRenderer(type, antialias, shadows, gammaIn, gammaOut) {

        if (type === 'WebGLRenderer' && System.support.webgl === false) {
            type = 'CanvasRenderer';
        }

        rendererPropertiesRow.setDisplay(type === 'WebGLRenderer' ? '' : 'none');

        var renderer = type === "RaytracingRenderer" ? new THREE[type]({
            antialias: antialias,
            workers: 4,
            workerPath: 'js/RaytracingWorker.js',
            randomize: true,
            blockSize: 64
        }) : new THREE[type]({ antialias: antialias });
        renderer.gammaInput = gammaIn;
        renderer.gammaOutput = gammaOut;
        if (shadows && renderer.shadowMap) {

            renderer.shadowMap.enabled = true;
            // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        }

        signals.rendererChanged.dispatch(renderer);

    }

    createRenderer(config.getKey('project/renderer'), config.getKey('project/renderer/antialias'), config.getKey('project/renderer/shadows'), config.getKey('project/renderer/gammaInput'), config.getKey('project/renderer/gammaOutput'));

    return container;

};
