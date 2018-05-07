/**
 * @author mrdoob / http://mrdoob.com/
 */

var Config = function ( name ) {

	var storage = {
		'autosave': true,
        'theme': 'css/light.css',

        'project/title': '',
        'project/editable': false,

        'guidhelpersize': '60',
		'project/renderer': 'WebGLRenderer',
		'project/renderer/antialias': true,
		'project/renderer/gammaInput': false,
		'project/renderer/gammaOutput': false,
		'project/renderer/shadows': true,
		'project/vr': false,

        'settings/history': false,

        'settings/shortcuts/translate': 'w',
        'settings/shortcuts/rotate': 'e',
        'settings/shortcuts/scale': 'r',
        'settings/shortcuts/undo': 'z',
        'settings/shortcuts/focus': 'f',

        'project/title': '',
        'project/orbitcontrols': true,
        'project/orbitcontrols/enablerotate': true,
        'project/orbitcontrols/rotatespeed': 1.0,
        'project/orbitcontrols/enablepan': true,
        'project/orbitcontrols/keypanspeed': 7.0,
        'project/orbitcontrols/enabledamping': true,
        'project/orbitcontrols/dampingfactor': 0.25,
        'project/orbitcontrols/enablezoom': true,
        'project/orbitcontrols/zoomspeed': 1,

        'project/orbitcontrols/mindistance': 0,
        'project/orbitcontrols/maxdistance': 10000,
        'project/orbitcontrols/minpolarangle': 0,
        'project/orbitcontrols/maxpolarangle': Math.PI,
        'project/orbitcontrols/minzoom': 0,
        'project/orbitcontrols/maxzoom': 10000,
	};

	if ( window.localStorage[ name ] === undefined ) {

		window.localStorage[ name ] = JSON.stringify( storage );

	} else {

		var data = JSON.parse( window.localStorage[ name ] );

		for ( var key in data ) {

			storage[ key ] = data[ key ];

		}

	}

	return {

		getKey: function ( key ) {

			return storage[ key ];

		},

		setKey: function () { // key, value, key, value ...

			for ( var i = 0, l = arguments.length; i < l; i += 2 ) {

				storage[ arguments[ i ] ] = arguments[ i + 1 ];

			}

			window.localStorage[ name ] = JSON.stringify( storage );

			console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to LocalStorage.' );

		},

		clear: function () {

			delete window.localStorage[ name ];

		}

	};

};
