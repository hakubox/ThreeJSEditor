﻿Menubar.Play = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var isPlaying = false;

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( '开始' );
	title.onClick( function () {

		if ( isPlaying === false ) {

			isPlaying = true;
			title.setTextContent( '停止' );
			signals.startPlayer.dispatch();

		} else {

			isPlaying = false;
			title.setTextContent( '开始' );
			signals.stopPlayer.dispatch();

		}

	} );
	container.add( title );

	return container;

};
