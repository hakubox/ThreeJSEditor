/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Properties = function (editor) {

    var signals = editor.signals;

    var container = new UI.Span();

    var objectTab = new UI.Text('对象').onClick(onClick);
    objectTab.dom.title = 'OBJECT';
    var geometryTab = new UI.Text('模型').onClick(onClick);
    geometryTab.dom.title = 'GEOMETRY';
    var materialTab = new UI.Text('材质').onClick(onClick);
    materialTab.dom.title = 'MATERIAL';

    var tabs = new UI.Div();
    tabs.setId('tabs');
    tabs.add(objectTab, geometryTab, materialTab);
    container.add(tabs);

    function onClick(event) {

        select(event.target.title);

    }

    //

    var object = new UI.Span().add(
        new Sidebar.Object(editor)
    );
    container.add(object);

    var geometry = new UI.Span().add(
        new Sidebar.Geometry(editor)
    );
    container.add(geometry);

    var material = new UI.Span().add(
        new Sidebar.Material(editor)
    );
    container.add(material);

    //

    function select(section) {

        objectTab.setClass('');
        geometryTab.setClass('');
        materialTab.setClass('');

        object.setDisplay('none');
        geometry.setDisplay('none');
        material.setDisplay('none');

        switch (section) {
            case 'OBJECT':
                objectTab.setClass('selected');
                object.setDisplay('');
                break;
            case 'GEOMETRY':
                geometryTab.setClass('selected');
                geometry.setDisplay('');
                break;
            case 'MATERIAL':
                materialTab.setClass('selected');
                material.setDisplay('');
                break;
        }

    }

    select('OBJECT');

    return container;

};