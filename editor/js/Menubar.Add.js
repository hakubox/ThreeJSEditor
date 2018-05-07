/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Add = function (editor) {

    var container = new UI.Panel();
    container.setClass('menu');

    var title = new UI.Panel();
    title.setClass('title colcount-2');
    title.setTextContent('添加');
    container.add(title);

    var options = new UI.Panel();
    options.setClass('options');
    container.add(options);

    //

    window.meshCount = 0;
    window.lightCount = 0;
    window.cameraCount = 0;

    editor.signals.editorCleared.add(function () {

        meshCount = 0;
        lightCount = 0;
        cameraCount = 0;

    });

    // Group

    var option = new UI.Row();
    option.setClass('option row');
    option.setTextContent('组-Group');
    option.onClick(function () {

        var mesh = new THREE.Group();
        mesh.name = 'Group ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    //

    options.add(new UI.HorizontalRule());

    // Plane

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('平面-Plane');
    option.onClick(function () {

        var geometry = new THREE.PlaneGeometry(2, 2);
        var material = new THREE.MeshStandardMaterial();
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'Plane ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    // Box

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('盒子-Box');
    option.onClick(function () {

        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'Box ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    // Box2

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('六面盒子-Box');
    option.onClick(function () {

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var mesh = new THREE.Mesh(geometry, [
            new THREE.MeshStandardMaterial(),
            new THREE.MeshStandardMaterial(),
            new THREE.MeshStandardMaterial(),
            new THREE.MeshStandardMaterial(),
            new THREE.MeshStandardMaterial(),
            new THREE.MeshStandardMaterial()
        ]);
        mesh.name = 'Box ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    // Circle

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('圆形-Circle');
    option.onClick(function () {

        var radius = 1;
        var segments = 32;

        var geometry = new THREE.CircleGeometry(radius, segments);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'Circle ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    // Cylinder

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('圆柱-Cylinder');
    option.onClick(function () {

        var radiusTop = 1;
        var radiusBottom = 1;
        var height = 2;
        var radiusSegments = 32;
        var heightSegments = 1;
        var openEnded = false;

        var geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'Cylinder ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    // Sphere

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('球体-Sphere');
    option.onClick(function () {

        var radius = 1;
        var widthSegments = 32;
        var heightSegments = 16;
        var phiStart = 0;
        var phiLength = Math.PI * 2;
        var thetaStart = 0;
        var thetaLength = Math.PI;

        var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'Sphere ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    // Icosahedron

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('20面体-Icosahedron');
    option.onClick(function () {

        var radius = 1;
        var detail = 2;

        var geometry = new THREE.IcosahedronGeometry(radius, detail);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'Icosahedron ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    // Torus

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('圆环-Torus');
    option.onClick(function () {

        var radius = 2;
        var tube = 1;
        var radialSegments = 32;
        var tubularSegments = 12;
        var arc = Math.PI * 2;

        var geometry = new THREE.TorusBufferGeometry(radius, tube, radialSegments, tubularSegments, arc);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'Torus ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    // TorusKnot

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('圆环扭节-TorusKnot');
    option.onClick(function () {

        var radius = 2;
        var tube = 0.8;
        var tubularSegments = 64;
        var radialSegments = 12;
        var p = 2;
        var q = 3;

        var geometry = new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'TorusKnot ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);


    // Teapot

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('茶壶-Teapot');
    option.onClick(function () {

        var size = 50;
        var segments = 10;
        var bottom = true;
        var lid = true;
        var body = true;
        var fitLid = false;
        var blinnScale = true;

        var material = new THREE.MeshStandardMaterial();

        var geometry = new THREE.TeapotBufferGeometry(size, segments, bottom, lid, body, fitLid, blinnScale);
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'Teapot ' + (++meshCount);

        editor.addObject(mesh);
        editor.select(mesh);

    });
    options.add(option);


    // Lathe

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('旋转体-Lathe');
    option.onClick(function () {

        var points = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(4, 0),
            new THREE.Vector2(3.5, 0.5),
            new THREE.Vector2(1, 0.75),
            new THREE.Vector2(0.8, 1),
            new THREE.Vector2(0.8, 4),
            new THREE.Vector2(1, 4.2),
            new THREE.Vector2(1.4, 4.8),
            new THREE.Vector2(2, 5),
            new THREE.Vector2(2.5, 5.4),
            new THREE.Vector2(3, 12)
        ];
        var segments = 20;
        var phiStart = 0;
        var phiLength = 2 * Math.PI;

        var geometry = new THREE.LatheBufferGeometry(points, segments, phiStart, phiLength);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ side: THREE.DoubleSide }));
        mesh.name = 'Lathe ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    // Sprite

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('精灵-Sprite');
    option.onClick(function () {

        var sprite = new THREE.Sprite(new THREE.SpriteMaterial());
        sprite.name = 'Sprite ' + (++meshCount);

        editor.execute(new AddObjectCommand(sprite));

    });
    options.add(option);

    // Object

    var _Objects = {
        /** 左侧格栅 */
        leftofficeOrnament: "leftoffice-ornament/leftoffice-ornament",
        /** 前方格栅 */
        frontofficeOrnament: "frontoffice-ornament/frontoffice-ornament",
        /** 左侧工厂格栅 */
        plantOrnament: "leftplant-ornament/leftplant-ornament",
        /** 车棚 */
        carShed: "car-shed/car-shed",
        /** 车1 */
        car1: "car/car1",
        /** 车2 */
        car2: "car/car2",
        /** 车4 */
        car3: "car/car3",
        /** LOGO */
        logo: "logo/xptlogo"
    };

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('OBJ模型');
    option.onClick(function () {
        let _objloader = new THREE.MTLLoader();
        let path = prompt("请输入模型路径（先放到editor/models下。例：car/car1、logo/xptlogo、car-shed/car-shed、leftplant-ornament/leftplant-ornament等）");
        if (path) {
            path = "models/" + path;
            let _objname = path.substr(path.lastIndexOf("/"));
            _objloader.setPath(path.substr(0, path.lastIndexOf("/")));
            _objloader.load(_objname + '.mtl', (function (material) {
                material.preload();
                let objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(material);
                objLoader.setPath(path.substr(0, path.lastIndexOf("/")));
                objLoader.load(_objname + '.obj', (function (_result) {
                    _result.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.material.side = THREE.DoubleSide;//设置贴图模式为双面贴图
                            child.material.transparent = true;//材质允许透明
                            child.material.opacity = 1;//材质默认透明度
                            child.material.castShadow = true;//材质默认透明度
                            child.material.flatShading = THREE.SmoothShading;//平滑渲染
                        }
                    });
                    _result.name = "ObjectModel " + _objname.substr(1) + " " + (++meshCount);
                    editor.execute(new AddObjectCommand(_result), "添加obj模型：" + _objname);
                }));
            }));
        }
    });
    options.add(option);


    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('DAE模型');
    option.onClick(function () {
        let _objloader = new THREE.ColladaLoader();
        let name = prompt("请输入模型路径（先放到editor/models下。例：test等）");
        if (name) {
            path = "models/" + name;
            _objloader.load(path + '.dae', (function (collada) {
                    var animations = collada.animations;
                    var avatar = collada.scene;
                    mixer = new THREE.AnimationMixer(avatar);
                    var action = mixer.clipAction(animations[0]).play();
                    editor.execute(new AddObjectCommand(avatar), "添加dae模型：" + name);
            }));
        }
    });
    options.add(option);
    

    // 文字 Text

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('文字-Text');
    option.onClick(function () {
        let fontName = "gentilis", fontWeight = "regular";
        new THREE.FontLoader().load('../examples/fonts/' + fontName + '_' + fontWeight + '.typeface.json', function (response) {
            var textGeo = new THREE.TextGeometry("three.js", {
                font: response,
                size: 70,
                height: 20,
                bevelSize: 1.5,
                material: 0,
                extrudeMaterial: 1,
                curveSegments: 10
            });
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();
            var mesh = new THREE.Mesh(textGeo, [
                new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
                new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
            ]);
            mesh.name = 'Text ' + (++meshCount);

            editor.execute(new AddObjectCommand(mesh));
        });
    });
    options.add(option);

    // 管道 Tube

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('管道-Tube');
    option.onClick(function () {

        let geometry = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 3, 0), new THREE.Vector3(0, 6, 0)
        ]);
        let mesh = new THREE.Mesh(
            new THREE.TubeBufferGeometry(geometry, 200, 0.5, 200, false),
            new THREE.MeshLambertMaterial({
                transparent: false,
                side: THREE.DoubleSide,
                needsUpdate: true,
                color: 0xffffff
            }));
        mesh.name = 'Curve ' + (++meshCount);

        editor.execute(new AddObjectCommand(mesh));

    });
    options.add(option);

    //

    options.add(new UI.HorizontalRule());

    // PointLight

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('点光源-PointLight');
    option.onClick(function () {

        var color = 0xffffff;
        var intensity = 1;
        var distance = 0;

        var light = new THREE.PointLight(color, intensity, distance);
        light.name = 'PointLight ' + (++lightCount);

        editor.execute(new AddObjectCommand(light));

    });
    options.add(option);

    // SpotLight

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('聚光灯-SpotLight');
    option.onClick(function () {

        var color = 0xffffff;
        var intensity = 1;
        var distance = 0;
        var angle = Math.PI * 0.1;
        var penumbra = 0;

        var light = new THREE.SpotLight(color, intensity, distance, angle, penumbra);
        light.name = 'SpotLight ' + (++lightCount);
        light.target.name = 'SpotLight ' + (lightCount) + ' Target';

        light.position.set(5, 10, 7.5);

        editor.execute(new AddObjectCommand(light));

    });
    options.add(option);

    // DirectionalLight

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('定向光-DirectionalLight');
    option.onClick(function () {

        var color = 0xffffff;
        var intensity = 1;

        var light = new THREE.DirectionalLight(color, intensity);
        light.name = 'DirectionalLight ' + (++lightCount);
        light.target.name = 'DirectionalLight ' + (lightCount) + ' Target';

        light.position.set(5, 10, 7.5);

        editor.execute(new AddObjectCommand(light));

    });
    options.add(option);

    // HemisphereLight

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('半球灯-HemisphereLight');
    option.onClick(function () {

        var skyColor = 0x00aaff;
        var groundColor = 0xffaa00;
        var intensity = 1;

        var light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        light.name = 'HemisphereLight ' + (++lightCount);

        light.position.set(0, 10, 0);

        editor.execute(new AddObjectCommand(light));

    });
    options.add(option);

    // AmbientLight

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('环境光-AmbientLight');
    option.onClick(function () {

        var color = 0x222222;

        var light = new THREE.AmbientLight(color);
        light.name = 'AmbientLight ' + (++lightCount);

        editor.execute(new AddObjectCommand(light));

    });
    options.add(option);

    //

    options.add(new UI.HorizontalRule());

    // PerspectiveCamera

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('透视相机-PerspectiveCamera');
    option.onClick(function () {

        var camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);
        camera.name = 'PerspectiveCamera ' + (++cameraCount);

        editor.execute(new AddObjectCommand(camera));

    });
    options.add(option);

    return container;

};
