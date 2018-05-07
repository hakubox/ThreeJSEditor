/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Object = function (editor) {

    var signals = editor.signals;

    var container = new UI.Panel();
    container.setBorderTop('0');
    container.setPaddingTop('20px');
    container.setDisplay('none');

    // Actions

    var objectActions = new UI.Select().setPosition('absolute').setRight('8px').setFontSize('11px');
    objectActions.setOptions({

        'Actions': 'Actions',
        'Reset Position': 'Reset Position',
        'Reset Rotation': 'Reset Rotation',
        'Reset Scale': 'Reset Scale'

    });
    objectActions.onClick(function (event) {

        event.stopPropagation(); // Avoid panel collapsing

    });
    objectActions.onChange(function (event) {

        var object = editor.selected;

        switch (this.getValue()) {

            case 'Reset Position':
                editor.execute(new SetPositionCommand(object, new THREE.Vector3(0, 0, 0)));
                break;

            case 'Reset Rotation':
                editor.execute(new SetRotationCommand(object, new THREE.Euler(0, 0, 0)));
                break;

            case 'Reset Scale':
                editor.execute(new SetScaleCommand(object, new THREE.Vector3(1, 1, 1)));
                break;

        }

        this.setValue('Actions');

    });
    // container.addStatic( objectActions );

    // type

    var objectTypeRow = new UI.Row();
    var objectType = new UI.Text();

    objectTypeRow.add(new UI.Text('类型').setWidth('90px'));
    objectTypeRow.add(objectType);

    container.add(objectTypeRow);

    // uuid

    var objectUUIDRow = new UI.Row();
    var objectUUID = new UI.Input().setWidth('102px').setFontSize('12px').setDisabled(true);
    var objectUUIDRenew = new UI.Button('New').setMarginLeft('7px').onClick(function () {

        objectUUID.setValue(THREE.Math.generateUUID());

        editor.execute(new SetUuidCommand(editor.selected, objectUUID.getValue()));

    });

    objectUUIDRow.add(new UI.Text('ID').setWidth('90px'));
    objectUUIDRow.add(objectUUID);
    objectUUIDRow.add(objectUUIDRenew);

    container.add(objectUUIDRow);

    // name

    var objectNameRow = new UI.Row();
    var objectName = new UI.Input().setWidth('150px').setFontSize('12px').onChange(function () {
        editor.execute(new SetValueCommand(editor.selected, 'name', objectName.getValue()));
    });

    objectNameRow.add(new UI.Text('名称').setWidth('90px'));
    objectNameRow.add(objectName);

    container.add(objectNameRow);

    // position

    var objectPositionRow = new UI.Row();
    var objectPositionX = new UI.Number().setWidth('50px').onChange(update);
    var objectPositionY = new UI.Number().setWidth('50px').onChange(update);
    var objectPositionZ = new UI.Number().setWidth('50px').onChange(update);

    objectPositionRow.add(new UI.Text('坐标').setWidth('90px'));
    objectPositionRow.add(objectPositionX, objectPositionY, objectPositionZ);

    container.add(objectPositionRow);

    // rotation

    var objectRotationRow = new UI.Row();
    var objectRotationX = new UI.Number().setStep(10).setUnit('°').setWidth('50px').onChange(update);
    var objectRotationY = new UI.Number().setStep(10).setUnit('°').setWidth('50px').onChange(update);
    var objectRotationZ = new UI.Number().setStep(10).setUnit('°').setWidth('50px').onChange(update);

    objectRotationRow.add(new UI.Text('旋转').setWidth('90px'));
    objectRotationRow.add(objectRotationX, objectRotationY, objectRotationZ);

    container.add(objectRotationRow);

    // scale

    var objectScaleRow = new UI.Row();
    var objectScaleLock = new UI.Checkbox(true).setPosition('absolute').setLeft('75px');
    var objectScaleX = new UI.Number(1).setRange(0.0001, Infinity).setWidth('50px').onChange(updateScaleX);
    objectScaleX.precision = 4;
    var objectScaleY = new UI.Number(1).setRange(0.0001, Infinity).setWidth('50px').onChange(updateScaleY);
    objectScaleY.precision = 4;
    var objectScaleZ = new UI.Number(1).setRange(0.0001, Infinity).setWidth('50px').onChange(updateScaleZ);
    objectScaleZ.precision = 4;

    objectScaleRow.add(new UI.Text('缩放').setWidth('90px'));
    objectScaleRow.add(objectScaleLock);
    objectScaleRow.add(objectScaleX, objectScaleY, objectScaleZ);

    container.add(objectScaleRow);

    // fov

    var objectFovRow = new UI.Row();
    var objectFov = new UI.Number().onChange(update).setUnit('°');

    objectFovRow.add(new UI.Text('视场角').setWidth('90px').setTitle('Fov'));
    objectFovRow.add(objectFov);

    container.add(objectFovRow);

    // near

    var objectNearRow = new UI.Row();
    var objectNear = new UI.Number().onChange(update);

    objectNearRow.add(new UI.Text('近点').setWidth('90px').setTitle('Near'));
    objectNearRow.add(objectNear);

    container.add(objectNearRow);

    // far

    var objectFarRow = new UI.Row();
    var objectFar = new UI.Number().onChange(update);

    objectFarRow.add(new UI.Text('远点').setWidth('90px').setTitle('Far'));
    objectFarRow.add(objectFar);

    container.add(objectFarRow);

    // intensity

    var objectIntensityRow = new UI.Row();
    var objectIntensity = new UI.Number().setRange(0, Infinity).onChange(update);

    objectIntensityRow.add(new UI.Text('强度').setWidth('90px').setTitle('Intensity'));
    objectIntensityRow.add(objectIntensity);

    container.add(objectIntensityRow);

    // color

    var objectColorRow = new UI.Row();
    var objectColor = new UI.Color().onChange(update);

    objectColorRow.add(new UI.Text('颜色').setWidth('90px').setTitle('Color'));
    objectColorRow.add(objectColor);

    container.add(objectColorRow);

    // ground color

    var objectGroundColorRow = new UI.Row();
    var objectGroundColor = new UI.Color().onChange(update);

    objectGroundColorRow.add(new UI.Text('背景色').setWidth('90px').setTitle('Ground color'));
    objectGroundColorRow.add(objectGroundColor);

    container.add(objectGroundColorRow);

    // distance

    var objectDistanceRow = new UI.Row();
    var objectDistance = new UI.Number().setRange(0, Infinity).onChange(update);

    objectDistanceRow.add(new UI.Text('距离').setWidth('90px').setTitle('Distance'));
    objectDistanceRow.add(objectDistance);

    container.add(objectDistanceRow);

    // angle

    var objectAngleRow = new UI.Row();
    var objectAngle = new UI.Number().setPrecision(3).setRange(0, Math.PI / 2).onChange(update);

    objectAngleRow.add(new UI.Text('角度').setWidth('90px').setTitle('Angle'));
    objectAngleRow.add(objectAngle);

    container.add(objectAngleRow);

    // penumbra

    var objectPenumbraRow = new UI.Row();
    var objectPenumbra = new UI.Number().setRange(0, 1).onChange(update);

    objectPenumbraRow.add(new UI.Text('半阴影').setWidth('90px').setTitle('Penumbra'));
    objectPenumbraRow.add(objectPenumbra);

    container.add(objectPenumbraRow);

    // decay

    var objectDecayRow = new UI.Row();
    var objectDecay = new UI.Number().setRange(0, Infinity).onChange(update);

    objectDecayRow.add(new UI.Text('衰变').setWidth('90px').setTitle('Decay'));
    objectDecayRow.add(objectDecay);

    container.add(objectDecayRow);

    // shadow

    var objectShadowRow = new UI.Row();

    objectShadowRow.add(new UI.Text('阴影').setWidth('90px'));

    var objectCastShadow = new UI.THREE.Boolean(false, '产生').onChange(update).setTitle('cast');
    objectShadowRow.add(objectCastShadow);

    var objectReceiveShadow = new UI.THREE.Boolean(false, '接收').onChange(update).setTitle('receive');
    objectShadowRow.add(objectReceiveShadow);

    container.add(objectShadowRow);

    var objectShadowRadiusRow = new UI.Row();

    objectShadowRadiusRow.add(new UI.Text('&nbsp;&nbsp;└&nbsp;阴影范围').setWidth('90px').setTitle('shadow.radius'));

    var objectShadowRadius = new UI.Number(1).onChange(update);

    objectShadowRadiusRow.add(objectShadowRadius);

    container.add(objectShadowRadiusRow);

    var objectShadowSizeRow = new UI.Row();

    objectShadowSizeRow.add(new UI.Text('&nbsp;&nbsp;└&nbsp;阴影大小').setWidth('90px').setTitle('shadow.mapSize.width'));

    var shadowMapWidth = new UI.Integer(1).setWidth('80px').onChange(update);
    var shadowMapHeight = new UI.Integer(1).setWidth('80px').onChange(update);
    objectShadowSizeRow.add(shadowMapWidth);
    objectShadowSizeRow.add(shadowMapHeight);

    container.add(objectShadowSizeRow);

    // visible

    var objectVisibleRow = new UI.Row();
    var objectVisible = new UI.Checkbox().onChange(update);

    objectVisibleRow.add(new UI.Text('是否可见').setWidth('90px').setTitle('[visible] 是否可见，false则看不见，默认可以看见'));
    objectVisibleRow.add(objectVisible);

    container.add(objectVisibleRow);


    //Custom Map 自定义多面贴图

    var materialCustomMapRow = new UI.Row();
    var materialCustomMapTop = new UI.Texture().onChange(update);
    var materialCustomMapBottom = new UI.Texture().onChange(update);
    var materialCustomMapLeft = new UI.Texture().onChange(update);
    var materialCustomMapRight = new UI.Texture().onChange(update);
    var materialCustomMapFront = new UI.Texture().onChange(update);
    var materialCustomMapBack = new UI.Texture().onChange(update);

    materialCustomMapRow.add(new UI.Text('多面贴图').setWidth('90px'));
    materialCustomMapRow.add(new UI.Text('前').setWidth('15px').setTextAlign("right").setPaddingRight("5px"));
    materialCustomMapRow.add(materialCustomMapFront);
    materialCustomMapRow.add(new UI.Text('后').setWidth('105px').setTextAlign("right").setPaddingRight("5px"));
    materialCustomMapRow.add(materialCustomMapBack);
    materialCustomMapRow.add(new UI.Text('上').setWidth('105px').setTextAlign("right").setPaddingRight("5px"));
    materialCustomMapRow.add(materialCustomMapTop);
    materialCustomMapRow.add(new UI.Text('下').setWidth('105px').setTextAlign("right").setPaddingRight("5px"));
    materialCustomMapRow.add(materialCustomMapBottom);
    materialCustomMapRow.add(new UI.Text('左').setWidth('105px').setTextAlign("right").setPaddingRight("5px"));
    materialCustomMapRow.add(materialCustomMapLeft);
    materialCustomMapRow.add(new UI.Text('右').setWidth('105px').setTextAlign("right").setPaddingRight("5px"));
    materialCustomMapRow.add(materialCustomMapRight);
    container.add(materialCustomMapRow);

    // user data

    var timeout;

    var objectUserDataRow = new UI.Row();
    var objectUserData = new UI.TextArea().setWidth('150px').setHeight('40px').setFontSize('12px').onChange(update);
    objectUserData.onKeyUp(function () {
        try {
            JSON.parse(objectUserData.getValue());
            objectUserData.dom.classList.add('success');
            objectUserData.dom.classList.remove('fail');
        } catch (error) {
            objectUserData.dom.classList.remove('success');
            objectUserData.dom.classList.add('fail');
        }
    });

    objectUserDataRow.add(new UI.Text('用户数据').setWidth('90px').setTitle('user data'));
    objectUserDataRow.add(objectUserData);

    container.add(objectUserDataRow);


    //

    function updateScaleX() {

        var object = editor.selected;

        if (objectScaleLock.getValue() === true) {

            var scale = objectScaleX.getValue() / object.scale.x;

            objectScaleY.setValue(objectScaleY.getValue() * scale);
            objectScaleZ.setValue(objectScaleZ.getValue() * scale);

        }

        update();

    }

    function updateScaleY() {

        var object = editor.selected;

        if (objectScaleLock.getValue() === true) {

            var scale = objectScaleY.getValue() / object.scale.y;

            objectScaleX.setValue(objectScaleX.getValue() * scale);
            objectScaleZ.setValue(objectScaleZ.getValue() * scale);

        }

        update();

    }

    function updateScaleZ() {

        var object = editor.selected;

        if (objectScaleLock.getValue() === true) {

            var scale = objectScaleZ.getValue() / object.scale.z;

            objectScaleX.setValue(objectScaleX.getValue() * scale);
            objectScaleY.setValue(objectScaleY.getValue() * scale);

        }

        update();

    }

    function update() {

        var object = editor.selected;

        if (object !== null) {

            var newPosition = new THREE.Vector3(objectPositionX.getValue(), objectPositionY.getValue(), objectPositionZ.getValue());
            if (object.position.distanceTo(newPosition) >= 0.01) {

                editor.execute(new SetPositionCommand(object, newPosition));

            }

            var newRotation = new THREE.Euler(objectRotationX.getValue() * THREE.Math.DEG2RAD, objectRotationY.getValue() * THREE.Math.DEG2RAD, objectRotationZ.getValue() * THREE.Math.DEG2RAD);
            if (object.rotation.toVector3().distanceTo(newRotation.toVector3()) >= 0.01) {

                editor.execute(new SetRotationCommand(object, newRotation));

            }

            var newScale = new THREE.Vector3(objectScaleX.getValue(), objectScaleY.getValue(), objectScaleZ.getValue());
            if (object.scale.distanceTo(newScale) >= 0.001) {

                editor.execute(new SetScaleCommand(object, newScale));

            }

            if (object.fov !== undefined && Math.abs(object.fov - objectFov.getValue()) >= 0.01) {

                editor.execute(new SetValueCommand(object, 'fov', objectFov.getValue()));
                object.updateProjectionMatrix();

            }

            if (object.near !== undefined && Math.abs(object.near - objectNear.getValue()) >= 0.01) {

                editor.execute(new SetValueCommand(object, 'near', objectNear.getValue()));

            }

            if (object.far !== undefined && Math.abs(object.far - objectFar.getValue()) >= 0.01) {

                editor.execute(new SetValueCommand(object, 'far', objectFar.getValue()));

            }

            if (object.intensity !== undefined && Math.abs(object.intensity - objectIntensity.getValue()) >= 0.01) {

                editor.execute(new SetValueCommand(object, 'intensity', objectIntensity.getValue()));

            }

            if (object.color !== undefined && object.color.getHex() !== objectColor.getHexValue()) {

                editor.execute(new SetColorCommand(object, 'color', objectColor.getHexValue()));

            }

            if (object.groundColor !== undefined && object.groundColor.getHex() !== objectGroundColor.getHexValue()) {

                editor.execute(new SetColorCommand(object, 'groundColor', objectGroundColor.getHexValue()));

            }

            if (object.distance !== undefined && Math.abs(object.distance - objectDistance.getValue()) >= 0.01) {

                editor.execute(new SetValueCommand(object, 'distance', objectDistance.getValue()));

            }

            if (object.angle !== undefined && Math.abs(object.angle - objectAngle.getValue()) >= 0.01) {

                editor.execute(new SetValueCommand(object, 'angle', objectAngle.getValue()));

            }

            if (object.penumbra !== undefined && Math.abs(object.penumbra - objectPenumbra.getValue()) >= 0.01) {

                editor.execute(new SetValueCommand(object, 'penumbra', objectPenumbra.getValue()));

            }

            if (object.decay !== undefined && Math.abs(object.decay - objectDecay.getValue()) >= 0.01) {

                editor.execute(new SetValueCommand(object, 'decay', objectDecay.getValue()));

            }

            if (object.visible !== objectVisible.getValue()) {

                editor.execute(new SetValueCommand(object, 'visible', objectVisible.getValue()));

            }

            if (object.castShadow !== undefined && object.castShadow !== objectCastShadow.getValue()) {

                editor.execute(new SetValueCommand(object, 'castShadow', objectCastShadow.getValue()));

            }

            if (object.receiveShadow !== undefined && object.receiveShadow !== objectReceiveShadow.getValue()) {

                editor.execute(new SetValueCommand(object, 'receiveShadow', objectReceiveShadow.getValue()));
                if(object.material) object.material.needsUpdate = true;

            }

            if (object.shadow !== undefined) {

                if (object.shadow.radius !== objectShadowRadius.getValue()) {
                    editor.execute(new SetValueCommand(object.shadow, 'radius', objectShadowRadius.getValue()));
                }

                if (object.shadow.mapSize.width !== shadowMapWidth.getValue()) {
                    editor.execute(new SetValueCommand(object.shadow.mapSize, 'width', shadowMapWidth.getValue()));
                }

                if (object.shadow.mapSize.height !== shadowMapHeight.getValue()) {
                    editor.execute(new SetValueCommand(object.shadow.mapSize, 'height', shadowMapHeight.getValue()));
                }
            }

            if (object.name == "SkyBox") {
                let _frontValue = materialCustomMapFront.getValue();
                if (_frontValue != null && object.material[0] !== _frontValue) {
                    editor.execute(new SetMaterialMapCommand(object, 'map', _frontValue, 0));
                }
                let _backValue = materialCustomMapBack.getValue();
                if (_backValue != null && object.material[1] !== _backValue) {
                    editor.execute(new SetMaterialMapCommand(object, 'map', _backValue, 1));
                }
                let _topValue = materialCustomMapTop.getValue();
                if (_topValue != null && object.material[2] !== _topValue) {
                    editor.execute(new SetMaterialMapCommand(object, 'map', _topValue, 2));
                }
                let _bottomValue = materialCustomMapBottom.getValue();
                if (_bottomValue != null && object.material[3] !== _bottomValue) {
                    editor.execute(new SetMaterialMapCommand(object, 'map', _bottomValue, 3));
                }
                let _leftValue = materialCustomMapLeft.getValue();
                if (_leftValue != null && object.material[4] !== _leftValue) {
                    editor.execute(new SetMaterialMapCommand(object, 'map', _leftValue, 4));
                }
                let _rightValue = materialCustomMapRight.getValue();
                if (_rightValue != null && object.material[5] !== _rightValue) {
                    editor.execute(new SetMaterialMapCommand(object, 'map', _rightValue, 5));
                }
            }

            try {
                var userData = JSON.parse(objectUserData.getValue());
                if (JSON.stringify(object.userData) != JSON.stringify(userData)) {
                    editor.execute(new SetValueCommand(object, 'userData', userData));
                }
            } catch (exception) {
                console.warn(exception);
            }
        }
    }

    var _meshCount = 1;

    function updateRows(object) {

        var properties = {
            'fov': objectFovRow,
            'near': objectNearRow,
            'far': objectFarRow,
            'intensity': objectIntensityRow,
            'color': objectColorRow,
            'groundColor': objectGroundColorRow,
            'distance': objectDistanceRow,
            'angle': objectAngleRow,
            'penumbra': objectPenumbraRow,
            'decay': objectDecayRow,
            'castShadow': objectShadowRow,
            'receiveShadow': objectReceiveShadow,
            'shadow': objectShadowRadiusRow
        };

        for (var property in properties) {

            properties[property].setDisplay(object[property] !== undefined ? '' : 'none');

        }
    }

    function updateTransformRows(object) {

        if (object instanceof THREE.Light ||
            (object instanceof THREE.Object3D && object.userData.targetInverse)) {

            objectRotationRow.setDisplay('none');
            objectScaleRow.setDisplay('none');

        } else {

            objectRotationRow.setDisplay('');
            objectScaleRow.setDisplay('');

        }

    }

    // events

    signals.objectSelected.add(function (object) {

        if (object !== null) {

            container.setDisplay('block');

            updateRows(object);
            updateUI(object);

        } else {

            container.setDisplay('none');

        }

    });

    signals.objectChanged.add(function (object) {

        if (object !== editor.selected) return;

        updateUI(object);

    });

    signals.refreshSidebarObject3D.add(function (object) {

        if (object !== editor.selected) return;

        updateUI(object);

    });

    function updateUI(object) {

        objectType.setValue(object.type);

        objectUUID.setValue(object.uuid);
        objectName.setValue(object.name);

        objectPositionX.setValue(object.position.x);
        objectPositionY.setValue(object.position.y);
        objectPositionZ.setValue(object.position.z);

        objectRotationX.setValue(object.rotation.x * THREE.Math.RAD2DEG);
        objectRotationY.setValue(object.rotation.y * THREE.Math.RAD2DEG);
        objectRotationZ.setValue(object.rotation.z * THREE.Math.RAD2DEG);

        objectScaleX.setValue(object.scale.x);
        objectScaleY.setValue(object.scale.y);
        objectScaleZ.setValue(object.scale.z);

        if (object.fov !== undefined) {

            objectFov.setValue(object.fov);

        }

        if (object.near !== undefined) {

            objectNear.setValue(object.near);

        }

        if (object.far !== undefined) {

            objectFar.setValue(object.far);

        }

        if (object.intensity !== undefined) {

            objectIntensity.setValue(object.intensity);

        }

        if (object.color !== undefined) {

            objectColor.setHexValue(object.color.getHexString());

        }

        if (object.groundColor !== undefined) {

            objectGroundColor.setHexValue(object.groundColor.getHexString());

        }

        if (object.distance !== undefined) {

            objectDistance.setValue(object.distance);

        }

        if (object.angle !== undefined) {

            objectAngle.setValue(object.angle);

        }

        if (object.penumbra !== undefined) {

            objectPenumbra.setValue(object.penumbra);

        }

        if (object.decay !== undefined) {

            objectDecay.setValue(object.decay);

        }

        if (object.castShadow !== undefined) {

            objectCastShadow.setValue(object.castShadow);

        }

        if (object.receiveShadow !== undefined) {

            objectReceiveShadow.setValue(object.receiveShadow);

        }

        if (object.shadow !== undefined) {

            objectShadowRadius.setValue(object.shadow.radius);

        }

        if (object.shadow !== undefined && object.shadow.mapSize !== undefined) {
            shadowMapWidth.setValue(object.shadow.mapSize.width);
            shadowMapHeight.setValue(object.shadow.mapSize.height);
        }

        if (object.name == "SkyBox") {
            objectName.dom.setAttribute("disabled", "disabled");

            if (object.material[0].map != null) materialCustomMapFront.setValue(object.material[0].map);
            if (object.material[1].map != null) materialCustomMapBack.setValue(object.material[1].map);
            if (object.material[2].map != null) materialCustomMapTop.setValue(object.material[2].map);
            if (object.material[3].map != null) materialCustomMapBottom.setValue(object.material[3].map);
            if (object.material[4].map != null) materialCustomMapLeft.setValue(object.material[4].map);
            if (object.material[5].map != null) materialCustomMapRight.setValue(object.material[5].map);
        } else {
            objectName.dom.removeAttribute("disabled");
        }

        objectVisible.setValue(object.visible);

        try {

            objectUserData.setValue(JSON.stringify(object.userData, null, '  '));

        } catch (error) {

            console.error(error);

        }

        objectUserData.setBorderColor('transparent');
        objectUserData.setBackgroundColor('');

        updateTransformRows(object);

    }

    return container;

};
