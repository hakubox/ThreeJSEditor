/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Settings = function (editor) {

    var config = editor.config;
    var signals = editor.signals;

    var container = new UI.Panel();
    container.setBorderTop('0');
    container.setPaddingTop('20px');

    // class

    var options = {
        'css/light.css': 'light',
        'css/dark.css': 'dark'
    };

    var themeRow = new UI.Row();
    var theme = new UI.Select().setWidth('150px');
    theme.setOptions(options);

    if (config.getKey('theme') !== undefined) {
        theme.setValue(config.getKey('theme'));
    }

    theme.onChange(function () {

        var value = this.getValue();

        editor.setTheme(value);
        editor.config.setKey('theme', value);

    });

    themeRow.add(new UI.Text('主题').setWidth('90px'));
    themeRow.add(theme);

    container.add(themeRow);

    // guidhelper size

    var guidHelperSizeRow = new UI.Row();
    var guidHelperSize = new UI.Number().setWidth('50px').onChange(function () {
        var guidHelperSizeVal = guidHelperSize.getValue();
        for (var i = 0; i < editor.sceneHelpers.children.length; i++) {
            if (editor.sceneHelpers.children[i] instanceof THREE.GridHelper) {
                if (guidHelperSizeVal) {
                    editor.sceneHelpers.remove(editor.sceneHelpers.children[i]);
                    grid = new THREE.GridHelper(guidHelperSizeVal, 60, 0x444444, 0x888888);
                    editor.sceneHelpers.add(grid);
                    signals.showGridChanged.dispatch();
                    break;
                }
            }
        }
    });
    guidHelperSize.min = 0.001;
    guidHelperSize.save = function () {
        editor.config.setKey('guidhelpersize', guidHelperSize.getValue());
    };

    if (config.getKey('guidhelpersize') !== undefined) {
        guidHelperSize.setValue(config.getKey('guidhelpersize') || 60);
    }

    guidHelperSizeRow.add(new UI.Text('网格面积').setWidth('90px'));
    guidHelperSizeRow.add(guidHelperSize);

    container.add(guidHelperSizeRow);

    container.add(new Sidebar.Settings.Shortcuts(editor));

    return container;

};
