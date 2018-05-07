/**
 * @author mrdoob / http://mrdoob.com/
 */

var TempScript = function () {

    var container = new UI.Panel();
    container.setId('tempscript');
    container.setPosition('absolute');
    container.setBackgroundColor('#272822');
    container.setDisplay('none');

    var header = new UI.Panel();
    header.setPadding('10px');
    container.add(header);

    var title = new UI.Text().setColor('#fff');
    header.add(title);

    var close = new UI.Button('完成');
    close.setPosition('absolute');
    close.setTop('5px');
    close.setRight('5px');
    close.setCursor('pointer');

    container.open = function (titlename, source) {
        container.setDisplay('');
        codemirror.setValue(source);
        codemirror.clearHistory();
        title.setValue(titlename);
        codemirror.setOption('mode', { name: 'javascript', json: true });
    }

    container.close = function () {
        let script = codemirror.getValue().replace(/\/\/.*?\n/g, '');
        eval(script);
        codemirror.setValue('');
        container.setDisplay('none');
    }

    close.onClick(container.close);
    header.add(close);


    var delay;
    var currentMode;
    var currentScript;

    var codemirror = CodeMirror(container.dom, {
        value: '',
        lineNumbers: true,
        matchBrackets: true,
        indentWithTabs: true,
        tabSize: 4,
        indentUnit: 4,
        hintOptions: {
            completeSingle: false
        }
    });
    codemirror.setOption('theme', 'monokai');

    // prevent backspace from deleting objects
    var wrapper = codemirror.getWrapperElement();
    wrapper.addEventListener('keydown', function (event) {

        event.stopPropagation();

    });

    // validate

    var errorLines = [];
    var widgets = [];

    var validate = function (string) {

        var valid;
        var errors = [];

        return codemirror.operation(function () {

            while (errorLines.length > 0) {

                codemirror.removeLineClass(errorLines.shift(), 'background', 'errorLine');

            }

            while (widgets.length > 0) {

                codemirror.removeLineWidget(widgets.shift());

            }

            //

            switch (currentMode) {

                case 'javascript':

                    try {

                        var syntax = esprima.parse(string, { tolerant: true });
                        errors = syntax.errors;

                    } catch (error) {

                        errors.push({

                            lineNumber: error.lineNumber - 1,
                            message: error.message

                        });

                    }

                    for (var i = 0; i < errors.length; i++) {

                        var error = errors[i];
                        error.message = error.message.replace(/Line [0-9]+: /, '');

                    }

                    break;

                case 'json':

                    errors = [];

                    jsonlint.parseError = function (message, info) {

                        message = message.split('\n')[3];

                        errors.push({

                            lineNumber: info.loc.first_line - 1,
                            message: message

                        });

                    };

                    try {

                        jsonlint.parse(string);

                    } catch (error) {

                        // ignore failed error recovery

                    }

                    break;

                case 'glsl':

                    try {

                        var shaderType = currentScript === 'vertexShader' ?
                            glslprep.Shader.VERTEX : glslprep.Shader.FRAGMENT;

                        glslprep.parseGlsl(string, shaderType);

                    } catch (error) {

                        if (error instanceof glslprep.SyntaxError) {

                            errors.push({

                                lineNumber: error.line,
                                message: "Syntax Error: " + error.message

                            });

                        } else {

                            console.error(error.stack || error);

                        }

                    }

                    if (errors.length !== 0) break;

                    valid = true;
                    var parseMessage = /^(?:ERROR|WARNING): \d+:(\d+): (.*)/g;

                    for (var i = 0, n = programs.length; i !== n; ++i) {

                        var diagnostics = programs[i].diagnostics;

                        if (!diagnostics.runnable) valid = false;

                        var shaderInfo = diagnostics[currentScript];
                        var lineOffset = shaderInfo.prefix.split(/\r\n|\r|\n/).length;

                        while (true) {

                            var parseResult = parseMessage.exec(shaderInfo.log);
                            if (parseResult === null) break;

                            errors.push({

                                lineNumber: parseResult[1] - lineOffset,
                                message: parseResult[2]

                            });

                        } // messages

                        break;

                    } // programs

            } // mode switch

            for (var i = 0; i < errors.length; i++) {

                var error = errors[i];

                var message = document.createElement('div');
                message.className = 'esprima-error';
                message.textContent = error.message;

                var lineNumber = Math.max(error.lineNumber, 0);
                errorLines.push(lineNumber);

                codemirror.addLineClass(lineNumber, 'background', 'errorLine');

                var widget = codemirror.addLineWidget(lineNumber, message);

                widgets.push(widget);

            }

            return valid !== undefined ? valid : errors.length === 0;

        });

    };

    // tern js autocomplete

    var server = new CodeMirror.TernServer({
        caseInsensitive: true,
        plugins: { threejs: null }
    });

    codemirror.setOption('extraKeys', {
        'Ctrl-Space': function (cm) { server.complete(cm); },
        'Ctrl-I': function (cm) { server.showType(cm); },
        'Ctrl-O': function (cm) { server.showDocs(cm); },
        'Alt-.': function (cm) { server.jumpToDef(cm); },
        'Alt-,': function (cm) { server.jumpBack(cm); },
        'Ctrl-Q': function (cm) { server.rename(cm); },
        'Ctrl-.': function (cm) { server.selectName(cm); }
    });

    codemirror.on('cursorActivity', function (cm) {

        if (currentMode !== 'javascript') return;
        server.updateArgHints(cm);

    });

    codemirror.on('keypress', function (cm, kb) {

        if (currentMode !== 'javascript') return;
        var typed = String.fromCharCode(kb.which || kb.keyCode);
        if (/[\w\.]/.exec(typed)) {

            server.complete(cm);

        }

    });

    return container;

};
