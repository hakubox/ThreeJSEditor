/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.TubeBufferGeometry = function (editor, object) {

    var signals = editor.signals;

    var container = new UI.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // width

    var widthRow = new UI.Row();
    var width = new UI.Number(parameters.width).onChange(update);

    widthRow.add(new UI.Text('宽度').setWidth('90px'));
    widthRow.add(width);

    container.add(widthRow);

    // height

    var heightRow = new UI.Row();
    var height = new UI.Number(parameters.height).onChange(update);

    heightRow.add(new UI.Text('高度').setWidth('90px'));
    heightRow.add(height);

    container.add(heightRow);

    // depth

    var depthRow = new UI.Row();
    var depth = new UI.Number(parameters.depth).onChange(update);

    depthRow.add(new UI.Text('深度').setWidth('90px'));
    depthRow.add(depth);

    container.add(depthRow);

    // widthSegments

    var widthSegmentsRow = new UI.Row();
    var widthSegments = new UI.Integer(parameters.widthSegments).setRange(1, Infinity).onChange(update);

    widthSegmentsRow.add(new UI.Text('宽度段数').setWidth('90px'));
    widthSegmentsRow.add(widthSegments);

    container.add(widthSegmentsRow);

    // heightSegments

    var heightSegmentsRow = new UI.Row();
    var heightSegments = new UI.Integer(parameters.heightSegments).setRange(1, Infinity).onChange(update);

    heightSegmentsRow.add(new UI.Text('高度段数').setWidth('90px'));
    heightSegmentsRow.add(heightSegments);

    container.add(heightSegmentsRow);

    // depthSegments

    var depthSegmentsRow = new UI.Row();
    var depthSegments = new UI.Integer(parameters.depthSegments).setRange(1, Infinity).onChange(update);

    depthSegmentsRow.add(new UI.Text('深度段数').setWidth('90px'));
    depthSegmentsRow.add(depthSegments);

    container.add(depthSegmentsRow);

    // 段数 segments

    var tubularSegmentsRow = new UI.Row();
    var tubularSegments = new UI.Integer(parameters.tubularSegments).onChange(update);

    tubularSegmentsRow.add(new UI.Text('分段数').setWidth('90px'));
    tubularSegmentsRow.add(tubularSegments);

    container.add(tubularSegmentsRow);

    // 管道直径 radius

    var radiusRow = new UI.Row();
    var radius = new UI.Number(parameters.radius).onChange(update);

    radiusRow.add(new UI.Text('管道直径').setWidth('90px'));
    radiusRow.add(radius);

    container.add(radiusRow);

    // 半径分段数 radius

    var radialSegmentsRow = new UI.Row();
    var radialSegments = new UI.Integer(parameters.radialSegments).onChange(update);

    radialSegmentsRow.add(new UI.Text('半径分段数').setWidth('90px'));
    radialSegmentsRow.add(radialSegments);

    container.add(radialSegmentsRow);

    // 是否闭合 closed

    var closedRow = new UI.Row();
    var closed = new UI.Checkbox(parameters.closed).onChange(update);

    closedRow.add(new UI.Text('是否闭合').setWidth('90px'));
    closedRow.add(closed);

    container.add(closedRow);

    // 管道路径 Path

    var pathTxt = parameters.path.points.map(function (item) {
        return [item.x, item.y, item.z].join(',');
    }).join('\n');

    var pathRow = new UI.Row();
    var path = new UI.TextArea(pathTxt).onChange(update);
    path.setHeight("100px");

    pathRow.add(new UI.Text('管道路径').setWidth('90px'));
    pathRow.add(path);
    pathRow.add(new UI.LinkButton('快速生成管道', function () {
        console.log("生成");
    }).setPaddingLeft('90px'));
    

    container.add(pathRow);

    //

    function update() {
        let geometrypath = path.getValue().split('\n').map(function (item) {
            let _path = item.split(',');
            return new THREE.Vector3(Number(_path[0].trim()), Number(_path[1].trim()), Number(_path[2].trim()));
        });
        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            new THREE.CatmullRomCurve3(geometrypath), tubularSegments.getValue(), radius.getValue(), radialSegments.getValue(), closed.getValue()
        )));
        //
    }

    return container;

};