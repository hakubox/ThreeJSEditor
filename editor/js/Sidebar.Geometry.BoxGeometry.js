/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.BoxGeometry = function (editor, object) {

    var signals = editor.signals;

    var container = new UI.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // width

    var widthRow = new UI.Row();
    var width = new UI.Number(parameters.width).onChange(update);

    widthRow.add(new UI.Text('宽度').setWidth('90px').setTitle('[Width]'));
    widthRow.add(width);

    container.add(widthRow);

    // height

    var heightRow = new UI.Row();
    var height = new UI.Number(parameters.height).onChange(update);

    heightRow.add(new UI.Text('高度').setWidth('90px').setTitle('[Height]'));
    heightRow.add(height);

    container.add(heightRow);

    // depth

    var depthRow = new UI.Row();
    var depth = new UI.Number(parameters.depth).onChange(update);

    depthRow.add(new UI.Text('深度').setWidth('90px').setTitle('[Depth]'));
    depthRow.add(depth);

    container.add(depthRow);

    // widthSegments

    var widthSegmentsRow = new UI.Row();
    var widthSegments = new UI.Integer(parameters.widthSegments).setRange(1, Infinity).onChange(update);

    widthSegmentsRow.add(new UI.Text('宽度面数').setWidth('90px').setTitle('[Width segments]'));
    widthSegmentsRow.add(widthSegments);

    container.add(widthSegmentsRow);

    // heightSegments

    var heightSegmentsRow = new UI.Row();
    var heightSegments = new UI.Integer(parameters.heightSegments).setRange(1, Infinity).onChange(update);

    heightSegmentsRow.add(new UI.Text('高度面数').setWidth('90px').setTitle('[Height segments]'));
    heightSegmentsRow.add(heightSegments);

    container.add(heightSegmentsRow);

    // depthSegments

    var depthSegmentsRow = new UI.Row();
    var depthSegments = new UI.Integer(parameters.depthSegments).setRange(1, Infinity).onChange(update);

    depthSegmentsRow.add(new UI.Text('深度面数').setWidth('90px').setTitle('[Depth segments]'));
    depthSegmentsRow.add(depthSegments);

    container.add(depthSegmentsRow);

    //

    function update() {

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            width.getValue(),
            height.getValue(),
            depth.getValue(),
            widthSegments.getValue(),
            heightSegments.getValue(),
            depthSegments.getValue()
        )));

    }

    return container;

};

Sidebar.Geometry.BoxBufferGeometry = Sidebar.Geometry.BoxGeometry;
