﻿/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.CircleGeometry = function (editor, object) {

    var signals = editor.signals;

    var container = new UI.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // radius

    var radiusRow = new UI.Row();
    var radius = new UI.Number(parameters.radius).onChange(update);

    radiusRow.add(new UI.Text('半径').setWidth('90px').setTitle('[Radius]'));
    radiusRow.add(radius);

    container.add(radiusRow);

    // segments

    var segmentsRow = new UI.Row();
    var segments = new UI.Integer(parameters.segments).setRange(3, Infinity).onChange(update);

    segmentsRow.add(new UI.Text('段数').setWidth('90px').setTitle('[Segments]'));
    segmentsRow.add(segments);

    container.add(segmentsRow);

    // thetaStart

    var thetaStartRow = new UI.Row();
    var thetaStart = new UI.Number(parameters.thetaStart).onChange(update);

    thetaStartRow.add(new UI.Text('开始θ').setWidth('90px').setTitle('[Theta start]'));
    thetaStartRow.add(thetaStart);

    container.add(thetaStartRow);

    // thetaLength

    var thetaLengthRow = new UI.Row();
    var thetaLength = new UI.Number(parameters.thetaLength).onChange(update);

    thetaLengthRow.add(new UI.Text('θ长度').setWidth('90px').setTitle('[Theta length]'));
    thetaLengthRow.add(thetaLength);

    container.add(thetaLengthRow);

    //

    function update() {

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            radius.getValue(),
            segments.getValue(),
            thetaStart.getValue(),
            thetaLength.getValue()
        )));

    }

    return container;

};

Sidebar.Geometry.CircleBufferGeometry = Sidebar.Geometry.CircleGeometry;
