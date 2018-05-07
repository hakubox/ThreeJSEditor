/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newMap THREE.Texture
 * @constructor
 */

var SetMaterialCustomMapCommand = function (object, newMap, index) {

    Command.call(this);
    this.type = 'SetMaterialCustomMapCommand';
    var fx = '';
    switch (index) {
        case 0: fx = '前';
        case 1: fx = '后';
        case 2: fx = '上';
        case 3: fx = '下';
        case 4: fx = '左';
        case 5: fx = '右';
        default:
    }
    this.name = '设置天空盒' + fx + '面贴图';
    this.index = index;

    this.object = object;
    this.oldMap = (object !== undefined) ? object.material[index] : undefined;
    this.newMap = newMap;

};

SetMaterialCustomMapCommand.prototype = {

    execute: function () {
        this.object.material[this.index].map = this.newMap;
        this.object.material.needsUpdate = true;
        this.editor.signals.materialChanged.dispatch(this.object.material[this.index]);
        this.editor.signals.objectChanged.dispatch(this.object.material[this.index]);
    },

    undo: function () {
        this.object.material[this.index].map = this.oldMap;
        this.object.material.needsUpdate = true;
        this.editor.signals.materialChanged.dispatch(this.object.material[this.index]);
        this.editor.signals.objectChanged.dispatch(this.object.material[this.index]);
    },

    toJSON: function () {

        var output = Command.prototype.toJSON.call(this);

        output.objectUuid = this.object.uuid;
        output.index = this.index;
        output.newMap = serializeMap(this.newMap);
        output.oldMap = serializeMap(this.oldMap);

        return output;

        // serializes a map (THREE.Texture)

        function serializeMap(map) {

            if (map === null || map === undefined) return null;

            var meta = {
                geometries: {},
                materials: {},
                textures: {},
                images: {}
            };

            var json = map.toJSON(meta);
            var images = extractFromCache(meta.images);
            if (images.length > 0) json.images = images;
            json.sourceFile = map.sourceFile;

            return json;

        }

        // Note: The function 'extractFromCache' is copied from Object3D.toJSON()

        // extract data from the cache hash
        // remove metadata on each item
        // and return as array
        function extractFromCache(cache) {

            var values = [];
            for (var key in cache) {

                var data = cache[key];
                delete data.metadata;
                values.push(data);

            }
            return values;

        }

    },

    fromJSON: function (json) {

        Command.prototype.fromJSON.call(this, json);

        this.object = this.editor.objectByUuid(json.objectUuid);
        this.index = json.index;
        this.oldMap = parseTexture(json.oldMap);
        this.newMap = parseTexture(json.newMap);

        function parseTexture(json) {

            var map = null;
            if (json !== null) {

                var loader = new THREE.ObjectLoader();
                var images = loader.parseImages(json.images);
                var textures = loader.parseTextures([json], images);
                map = textures[json.uuid];
                map.sourceFile = json.sourceFile;

            }
            return map;

        }

    }

};
