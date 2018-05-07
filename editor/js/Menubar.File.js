/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function (editor) {

    var NUMBER_PRECISION = 6;

    function parseNumber(key, value) {

        return typeof value === 'number' ? parseFloat(value.toFixed(NUMBER_PRECISION)) : value;

    }

    //

    var config = editor.config;

    var container = new UI.Panel();
    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title');
    title.setTextContent('文件');
    container.add(title);

    var options = new UI.Panel();
    options.setClass('options');
    container.add(options);

    // New

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('新建');
    option.onClick(function () {

        if (confirm('任何未保存的数据都将丢失，确定吗？')) {
            editor.clear();
            if (confirm('是否创建默认环境光？')) {
                var light = new THREE.AmbientLight(0xFFFFFF);
                light.name = 'AmbientLight';
                light.position.set(0, 5000, 0);
                editor.execute(new AddObjectCommand(light));
            }
            if (confirm('是否创建默认天空盒？')) {
                var mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(10000, 10000, 10000), [
                    new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.BackSide }),
                    new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.BackSide }),
                    new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.BackSide }),
                    new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.BackSide }),
                    new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.BackSide }),
                    new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.BackSide })
                ]);
                mesh.name = 'SkyBox';

                editor.execute(new AddObjectCommand(mesh));
            }
        }

    });
    options.add(option);

    //

    options.add(new UI.HorizontalRule());

    // Import

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', function (event) {

        editor.loader.loadFile(fileInput.files[0]);

    });

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导入');
    option.onClick(function () {

        fileInput.click();

    });
    options.add(option);

    //

    options.add(new UI.HorizontalRule());

    // Export Geometry

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导出形状');
    option.onClick(function () {

        var object = editor.selected;

        if (object === null) {

            alert('No object selected.');
            return;

        }

        var geometry = object.geometry;

        if (geometry === undefined) {

            alert('The selected object doesn\'t have geometry.');
            return;

        }

        var output = geometry.toJSON();

        try {

            output = JSON.stringify(output, parseNumber, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        } catch (e) {

            output = JSON.stringify(output);

        }

        saveString(output, 'geometry.json');

    });
    options.add(option);

    // Export Object

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导出JSON');
    option.onClick(function () {

        var object = editor.selected;

        if (object === null) {

            alert('No object selected');
            return;

        }

        var output = object.toJSON();

        try {

            output = JSON.stringify(output, parseNumber, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        } catch (e) {

            output = JSON.stringify(output);

        }

        saveString(output, 'model.json');

    });
    options.add(option);

    // Export Scene

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导出Scene');
    option.onClick(function () {

        var output = editor.scene.toJSON();

        try {

            output = JSON.stringify(output, parseNumber, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        } catch (e) {

            output = JSON.stringify(output);

        }

        saveString(output, 'scene.json');

    });
    options.add(option);

    //

    options.add(new UI.HorizontalRule());

    // Export GLTF

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导出GLTF');
    option.onClick(function () {

        var exporter = new THREE.GLTFExporter();

        exporter.parse(editor.scene, function (result) {

            saveString(JSON.stringify(result, null, 2), 'scene.gltf');

        });


    });
    options.add(option);

    // Export OBJ

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导出OBJ');
    option.onClick(function () {

        var object = editor.selected;

        if (object === null) {

            alert('No object selected.');
            return;

        }

        var exporter = new THREE.OBJExporter();

        saveString(exporter.parse(object), 'model.obj');

    });
    options.add(option);

    // Export STL

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('导出STL');
    option.onClick(function () {

        var exporter = new THREE.STLExporter();

        saveString(exporter.parse(editor.scene), 'model.stl');

    });
    options.add(option);

    //

    options.add(new UI.HorizontalRule());

    // Publish

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('发布');
    option.onClick(function () {

        var zip = new JSZip();

        //

        var output = editor.toJSON();
        output.metadata.type = 'App';
        delete output.history;

        var vr = config.getKey('project/vr');
        var title = config.getKey('project/title');
        //是否允许控制相机镜头
        var orbitcontrols = config.getKey('project/orbitcontrols');

        output = JSON.stringify(output, parseNumber, '\t');
        output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        zip.file('app.json', output);

        //

        

        var manager = new THREE.LoadingManager(function () {
            save(zip.generate({ type: 'blob' }), (title !== '' ? title : 'download') + '.zip');
        });

        var loader = new THREE.FileLoader(manager);
        loader.load('js/libs/app/index.html', function (content) {

            content = content.replace('<!-- title -->', title);

            var includes = [], includeinit = [];
            if (vr) {
                includes.push('<script src="js/WebVR.js"></script>');
            }
            if (orbitcontrols) {
                includes.push('<script src="js/OrbitControls.js"></script>');
                includeinit.push('window.orbit = (new THREE.OrbitControls(camera));');

                includeinit.push('orbit.enableRotate = ' + config.getKey('project/orbitcontrols/enablerotate') + ';');
                includeinit.push('orbit.rotateSpeed = ' + config.getKey('project/orbitcontrols/rotatespeed') + ';');

                includeinit.push('orbit.enablePan = ' + config.getKey('project/orbitcontrols/enablepan') + ';');
                includeinit.push('orbit.keyPanSpeed = ' + config.getKey('project/orbitcontrols/keypanspeed') + ';');

                includeinit.push('orbit.enableDamping = ' + config.getKey('project/orbitcontrols/enabledamping') + ';');
                includeinit.push('orbit.dampingFactor = ' + config.getKey('project/orbitcontrols/dampingfactor') + ';');

                includeinit.push('orbit.enableZoom = ' + config.getKey('project/orbitcontrols/enablezoom') + ';');
                includeinit.push('orbit.zoomSpeed = ' + config.getKey('project/orbitcontrols/zoomspeed') + ';');

                includeinit.push('orbit.minDistance = ' + config.getKey('project/orbitcontrols/mindistance') + ';');
                includeinit.push('orbit.maxDistance = ' + config.getKey('project/orbitcontrols/maxdistance') + ';');

                includeinit.push('orbit.minPolarAngle = ' + config.getKey('project/orbitcontrols/minpolarangle') + ';');
                includeinit.push('orbit.maxPolarAngle = ' + config.getKey('project/orbitcontrols/maxpolarangle') + ';');

                includeinit.push('orbit.minZoom = ' + config.getKey('project/orbitcontrols/minzoom') + ';');
                includeinit.push('orbit.maxZoom = ' + config.getKey('project/orbitcontrols/maxzoom') + ';');
            }
            content = content.replace('<!-- includes -->', includes.join('\n\t\t'));
            content = content.replace('<!-- includeinit -->', includeinit.join('\n\t\t'));
            zip.file('index.html', content);
        });
        loader.load('js/libs/app.js', function (content) {
            zip.file('js/app.js', content);
        });
        loader.load('../build/three.min.js', function (content) {
            zip.file('js/three.min.js', content);
        });

        if (vr) {
            loader.load('../examples/js/vr/WebVR.js', function (content) {
                zip.file('js/WebVR.js', content);
            });
        }
        if (orbitcontrols) {
            loader.load('js/libs/OrbitControls.js', function (content) {
                zip.file('js/OrbitControls.js', content);
            });
        }
    });
    options.add(option);

	/*
	// Publish (Dropbox)

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Publish (Dropbox)' );
	option.onClick( function () {

		var parameters = {
			files: [
				{ 'url': 'data:text/plain;base64,' + window.btoa( "Hello, World" ), 'filename': 'app/test.txt' }
			]
		};

		Dropbox.save( parameters );

	} );
	options.add( option );
	*/


    //

    var link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link); // Firefox workaround, see #6594

    function save(blob, filename) {

        link.href = URL.createObjectURL(blob);
        link.download = filename || 'data.json';
        link.click();

        // URL.revokeObjectURL( url ); breaks Firefox...

    }

    function saveString(text, filename) {

        save(new Blob([text], { type: 'text/plain' }), filename);

    }

    return container;

};
