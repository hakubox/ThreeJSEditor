﻿/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Material = function (editor) {

    var signals = editor.signals;

    var currentObject;

    var currentMaterialSlot = 0;

    var container = new UI.Panel();
    container.setBorderTop('0');
    container.setPaddingTop('20px');

    // New / Copy / Paste

    var copiedMaterial;

    var managerRow = new UI.Row();

    // Current material slot

    var materialSlotRow = new UI.Row();

    materialSlotRow.add(new UI.Text('面').setWidth('90px').setTitle('Slot'));

    var materialSlotSelect = new UI.Select().setWidth('170px').setFontSize('12px').onChange(update);
    materialSlotSelect.setOptions({ 0: '' }).setValue(0);
    materialSlotRow.add(materialSlotSelect);

    container.add(materialSlotRow);

    managerRow.add(new UI.Text('').setWidth('90px'));

    managerRow.add(new UI.Button('新建').onClick(function () {

        var material = new THREE[materialClass.getValue()]();
        editor.execute(new SetMaterialCommand(currentObject, material, currentMaterialSlot), '新材质: ' + materialClass.getValue());
        update();

    }));

    managerRow.add(new UI.Button('复制').setMarginLeft('4px').onClick(function () {

        copiedMaterial = currentObject.material;

        if (Array.isArray(copiedMaterial)) {

            if (copiedMaterial.length === 0) return;

            copiedMaterial = copiedMaterial[currentMaterialSlot];

        }

    }));

    managerRow.add(new UI.Button('粘贴').setMarginLeft('4px').onClick(function () {

        if (copiedMaterial === undefined) return;

        editor.execute(new SetMaterialCommand(currentObject, copiedMaterial, currentMaterialSlot), '粘贴材质: ' + materialClass.getValue());
        refreshUI();
        update();

    }));

    container.add(managerRow);


    // type

    var materialClassRow = new UI.Row();
    var materialClass = new UI.Select().setOptions({

        'LineBasicMaterial': '基础直线材质',
        'LineDashedMaterial': '虚线材质',
        'MeshBasicMaterial': '基础材质(简单颜色',
        'MeshDepthMaterial': '深度材质',
        'MeshNormalMaterial': '法向材质',
        'MeshLambertMaterial': '兰伯特材质(暗淡不发光',
        'MeshPhongMaterial': '冯氏材质(发亮的金属',
        'MeshStandardMaterial': '标准材质',
        'MeshPhysicalMaterial': '物理材质',
        'ShaderMaterial': '着色器材质',
        'SpriteMaterial': '精灵材质'

    }).setWidth('150px').setFontSize('12px').onChange(update);

    materialClassRow.add(new UI.Text('类型').setWidth('90px').setTitle('[Type]'));
    materialClassRow.add(materialClass);

    container.add(materialClassRow);

    // uuid

    var materialUUIDRow = new UI.Row();
    var materialUUID = new UI.Input().setWidth('102px').setFontSize('12px').setDisabled(true);
    var materialUUIDRenew = new UI.Button('重设').setMarginLeft('7px').onClick(function () {

        materialUUID.setValue(THREE.Math.generateUUID());
        update();

    });

    materialUUIDRow.add(new UI.Text('UUID').setWidth('90px'));
    materialUUIDRow.add(materialUUID);
    materialUUIDRow.add(materialUUIDRenew);

    container.add(materialUUIDRow);

    // name

    var materialNameRow = new UI.Row();
    var materialName = new UI.Input().setWidth('150px').setFontSize('12px').onChange(function () {

        editor.execute(new SetMaterialValueCommand(editor.selected, 'name', materialName.getValue(), currentMaterialSlot));

    });

    materialNameRow.add(new UI.Text('名称').setWidth('90px').setTitle('[Name]'));
    materialNameRow.add(materialName);

    container.add(materialNameRow);

    // program

    var materialProgramRow = new UI.Row();
    materialProgramRow.add(new UI.Text('Program').setWidth('90px'));

    var materialProgramInfo = new UI.Button('Info');
    materialProgramInfo.setMarginLeft('4px');
    materialProgramInfo.onClick(function () {

        signals.editScript.dispatch(currentObject, 'programInfo');

    });
    materialProgramRow.add(materialProgramInfo);

    var materialProgramVertex = new UI.Button('Vertex');
    materialProgramVertex.setMarginLeft('4px');
    materialProgramVertex.onClick(function () {

        signals.editScript.dispatch(currentObject, 'vertexShader');

    });
    materialProgramRow.add(materialProgramVertex);

    var materialProgramFragment = new UI.Button('Fragment');
    materialProgramFragment.setMarginLeft('4px');
    materialProgramFragment.onClick(function () {

        signals.editScript.dispatch(currentObject, 'fragmentShader');

    });
    materialProgramRow.add(materialProgramFragment);

    container.add(materialProgramRow);

    // color

    var materialColorRow = new UI.Row();
    var materialColor = new UI.Color().onChange(update);

    materialColorRow.add(new UI.Text('颜色').setWidth('90px').setTitle('[Color] 设置材质的颜色。'));
    materialColorRow.add(materialColor);

    container.add(materialColorRow);

    // roughness

    var materialRoughnessRow = new UI.Row();
    var materialRoughness = new UI.Number(0.5).setWidth('60px').setRange(0, 1).onChange(update);

    materialRoughnessRow.add(new UI.Text('粗糙质感').setWidth('90px').setTitle('Roughness'));
    materialRoughnessRow.add(materialRoughness);

    container.add(materialRoughnessRow);

    // metalness

    var materialMetalnessRow = new UI.Row();
    var materialMetalness = new UI.Number(0.5).setWidth('60px').setRange(0, 1).onChange(update);

    materialMetalnessRow.add(new UI.Text('金属质感').setWidth('90px').setTitle('Metalness'));
    materialMetalnessRow.add(materialMetalness);

    container.add(materialMetalnessRow);

    // emissive

    var materialEmissiveRow = new UI.Row();
    var materialEmissive = new UI.Color().setHexValue(0x000000).onChange(update);

    materialEmissiveRow.add(new UI.Text('放射颜色').setWidth('90px').setTitle('[Emissive] 设置材质发射的颜色，不是一种光源，而是一种不受光照影响的颜色。默认为黑色'));
    materialEmissiveRow.add(materialEmissive);

    container.add(materialEmissiveRow);

    // specular

    var materialSpecularRow = new UI.Row();
    var materialSpecular = new UI.Color().setHexValue(0x111111).onChange(update);

    materialSpecularRow.add(new UI.Text('Specular').setWidth('90px'));
    materialSpecularRow.add(materialSpecular);

    container.add(materialSpecularRow);

    // shininess

    var materialShininessRow = new UI.Row();
    var materialShininess = new UI.Number(30).onChange(update);

    materialShininessRow.add(new UI.Text('高光亮度').setWidth('90px').setTitle('[Shininess] 指定高光部分的亮度，默认值为30。'));
    materialShininessRow.add(materialShininess);

    container.add(materialShininessRow);

    // clearCoat

    var materialClearCoatRow = new UI.Row();
    var materialClearCoat = new UI.Number(1).setWidth('60px').setRange(0, 1).onChange(update);

    materialClearCoatRow.add(new UI.Text('ClearCoat').setWidth('90px'));
    materialClearCoatRow.add(materialClearCoat);

    container.add(materialClearCoatRow);

    // clearCoatRoughness

    var materialClearCoatRoughnessRow = new UI.Row();
    var materialClearCoatRoughness = new UI.Number(1).setWidth('60px').setRange(0, 1).onChange(update);

    materialClearCoatRoughnessRow.add(new UI.Text('ClearCoat Roughness').setWidth('90px'));
    materialClearCoatRoughnessRow.add(materialClearCoatRoughness);

    container.add(materialClearCoatRoughnessRow);

    // vertex colors

    var materialVertexColorsRow = new UI.Row();
    var materialVertexColors = new UI.Select().setOptions({
        0: '无',
        1: '面',
        2: '顶点'
    }).onChange(update);

    materialVertexColorsRow.add(new UI.Text('顶点颜色').setWidth('90px').setTitle('[Vertex Colors] 通过这属性，定义顶点的颜色，在canvasRender中不起作用。'));
    materialVertexColorsRow.add(materialVertexColors);

    container.add(materialVertexColorsRow);

    // skinning

    var materialSkinningRow = new UI.Row();
    var materialSkinning = new UI.Checkbox(false).onChange(update);

    materialSkinningRow.add(new UI.Text('皮肤').setWidth('90px').setTitle('[Skinning]'));
    materialSkinningRow.add(materialSkinning);

    container.add(materialSkinningRow);

    // map

    var materialMapRow = new UI.Row();
    var materialMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialMap = new UI.Texture().onChange(update);

    materialMapRow.add(new UI.Text('贴图').setWidth('90px').setTitle('[Map] 设置材质贴图。'));
    materialMapRow.add(materialMapEnabled);
    materialMapRow.add(materialMap);

    container.add(materialMapRow);

    // map - repeat

    var materialMapRepeatRow = new UI.Row();

    materialMapRepeatRow.add(new UI.Text('&nbsp;&nbsp;└&nbsp;重复贴图').setWidth('90px').setTitle('shadow.mapSize.width'));

    var repeatMapX = new UI.Integer(1).setWidth('80px').onChange(update);
    var repeatMapY = new UI.Integer(1).setWidth('80px').onChange(update);
    materialMapRepeatRow.add(repeatMapX);
    materialMapRepeatRow.add(repeatMapY);

    container.add(materialMapRepeatRow);

    // alpha map

    var materialAlphaMapRow = new UI.Row();
    var materialAlphaMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialAlphaMap = new UI.Texture().onChange(update);

    materialAlphaMapRow.add(new UI.Text('透明贴图').setWidth('90px').setTitle('[Alpha Map]'));
    materialAlphaMapRow.add(materialAlphaMapEnabled);
    materialAlphaMapRow.add(materialAlphaMap);

    container.add(materialAlphaMapRow);

    // bump map

    var materialBumpMapRow = new UI.Row();
    var materialBumpMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialBumpMap = new UI.Texture().onChange(update);
    var materialBumpScale = new UI.Number(1).setWidth('30px').onChange(update);

    materialBumpMapRow.add(new UI.Text('凹凸贴图').setWidth('90px').setTitle('[Bump Map]'));
    materialBumpMapRow.add(materialBumpMapEnabled);
    materialBumpMapRow.add(materialBumpMap);
    materialBumpMapRow.add(materialBumpScale);

    container.add(materialBumpMapRow);

    // normal map

    var materialNormalMapRow = new UI.Row();
    var materialNormalMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialNormalMap = new UI.Texture().onChange(update);

    materialNormalMapRow.add(new UI.Text('法线贴图').setWidth('90px').setTitle('[Normal Map]'));
    materialNormalMapRow.add(materialNormalMapEnabled);
    materialNormalMapRow.add(materialNormalMap);

    container.add(materialNormalMapRow);

    // displacement map

    var materialDisplacementMapRow = new UI.Row();
    var materialDisplacementMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialDisplacementMap = new UI.Texture().onChange(update);
    var materialDisplacementScale = new UI.Number(1).setWidth('30px').onChange(update);

    materialDisplacementMapRow.add(new UI.Text('位移贴图').setWidth('90px').setTitle('[Displace Map]'));
    materialDisplacementMapRow.add(materialDisplacementMapEnabled);
    materialDisplacementMapRow.add(materialDisplacementMap);
    materialDisplacementMapRow.add(materialDisplacementScale);

    container.add(materialDisplacementMapRow);

    // roughness map

    var materialRoughnessMapRow = new UI.Row();
    var materialRoughnessMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialRoughnessMap = new UI.Texture().onChange(update);

    materialRoughnessMapRow.add(new UI.Text('粗糙贴图').setWidth('90px').setTitle('[Rough. Map]'));
    materialRoughnessMapRow.add(materialRoughnessMapEnabled);
    materialRoughnessMapRow.add(materialRoughnessMap);

    container.add(materialRoughnessMapRow);

    // metalness map

    var materialMetalnessMapRow = new UI.Row();
    var materialMetalnessMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialMetalnessMap = new UI.Texture().onChange(update);

    materialMetalnessMapRow.add(new UI.Text('金属贴图').setWidth('90px').setTitle('[Metal. Map]'));
    materialMetalnessMapRow.add(materialMetalnessMapEnabled);
    materialMetalnessMapRow.add(materialMetalnessMap);

    container.add(materialMetalnessMapRow);

    // specular map

    var materialSpecularMapRow = new UI.Row();
    var materialSpecularMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialSpecularMap = new UI.Texture().onChange(update);

    materialSpecularMapRow.add(new UI.Text('镜面贴图').setWidth('90px').setTitle('[Specular Map]'));
    materialSpecularMapRow.add(materialSpecularMapEnabled);
    materialSpecularMapRow.add(materialSpecularMap);

    container.add(materialSpecularMapRow);

    // env map

    var materialEnvMapRow = new UI.Row();
    var materialEnvMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialEnvMap = new UI.Texture(THREE.SphericalReflectionMapping).onChange(update);
    var materialReflectivity = new UI.Number(1).setWidth('30px').onChange(update);

    materialEnvMapRow.add(new UI.Text('环境贴图').setWidth('90px').setTitle('[Env Map]'));
    materialEnvMapRow.add(materialEnvMapEnabled);
    materialEnvMapRow.add(materialEnvMap);
    materialEnvMapRow.add(materialReflectivity);

    container.add(materialEnvMapRow);

    // light map

    var materialLightMapRow = new UI.Row();
    var materialLightMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialLightMap = new UI.Texture().onChange(update);

    materialLightMapRow.add(new UI.Text('光照贴图').setWidth('90px').setTitle('[Light Map]'));
    materialLightMapRow.add(materialLightMapEnabled);
    materialLightMapRow.add(materialLightMap);

    container.add(materialLightMapRow);

    // ambient occlusion map

    var materialAOMapRow = new UI.Row();
    var materialAOMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialAOMap = new UI.Texture().onChange(update);
    var materialAOScale = new UI.Number(1).setRange(0, 1).setWidth('30px').onChange(update);

    materialAOMapRow.add(new UI.Text('遮挡贴图').setWidth('90px').setTitle('[AO Map] 设置材质的环境色，和环境光源一起使用，这个颜色会与环境光的颜色相乘。即是对光源作出反应。'));
    materialAOMapRow.add(materialAOMapEnabled);
    materialAOMapRow.add(materialAOMap);
    materialAOMapRow.add(materialAOScale);

    container.add(materialAOMapRow);

    // emissive map

    var materialEmissiveMapRow = new UI.Row();
    var materialEmissiveMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialEmissiveMap = new UI.Texture().onChange(update);

    materialEmissiveMapRow.add(new UI.Text('放射贴图').setWidth('90px').setTitle('[Emissive Map]'));
    materialEmissiveMapRow.add(materialEmissiveMapEnabled);
    materialEmissiveMapRow.add(materialEmissiveMap);

    container.add(materialEmissiveMapRow);

    // side

    var materialSideRow = new UI.Row();
    var materialSide = new UI.Select().setOptions({

        0: '正面 Front',
        1: '反面 Back',
        2: '双面 Double'

    }).setWidth('150px').setFontSize('12px').onChange(update);

    materialSideRow.add(new UI.Text('材质显示面').setWidth('90px').setTitle('[Side] 侧面，设置几何体的哪一面应用这个材质'));
    materialSideRow.add(materialSide);

    container.add(materialSideRow);

    // shading

    var materialShadingRow = new UI.Row();
    var materialShading = new UI.Checkbox(false).setLeft('100px').onChange(update);

    materialShadingRow.add(new UI.Text('平面着色').setWidth('90px').setTitle('[Flat Shaded]'));
    materialShadingRow.add(materialShading);

    container.add(materialShadingRow);

    // blending

    var materialBlendingRow = new UI.Row();
    var materialBlending = new UI.Select().setOptions({

        0: '不混合 No',
        1: '默认 Normal',
        2: '积累 Additive',
        3: '削减 Subtractive',
        4: '多重 Multiply',
        5: '自定义 Custom'

    }).setWidth('150px').setFontSize('12px').onChange(update);

    materialBlendingRow.add(new UI.Text('混合模式').setWidth('90px').setTitle('[Blending] 觉得物体的材质如何和背景融合，默认值为‘Normal’,这种情况下只显示材质的上层。'));
    materialBlendingRow.add(materialBlending);

    container.add(materialBlendingRow);

    // opacity

    var materialOpacityRow = new UI.Row();
    var materialOpacity = new UI.Number(1).setWidth('60px').setRange(0, 1).onChange(update);

    materialOpacityRow.add(new UI.Text('透明度').setWidth('90px').setTitle('[Opacity] 透明度，结合transparent使用，范围为0~1。'));
    materialOpacityRow.add(materialOpacity);

    container.add(materialOpacityRow);

    // transparent

    var materialTransparentRow = new UI.Row();
    var materialTransparent = new UI.Checkbox().setLeft('100px').onChange(update);

    materialTransparentRow.add(new UI.Text('是否透明').setWidth('90px').setTitle('[Transparent] 是否透明，如果为true则结合opacity设置透明度。如果为false则物体不透明。'));
    materialTransparentRow.add(materialTransparent);

    container.add(materialTransparentRow);

    // alpha test

    var materialAlphaTestRow = new UI.Row();
    var materialAlphaTest = new UI.Number().setWidth('60px').setRange(0, 1).onChange(update);

    materialAlphaTestRow.add(new UI.Text('最低透明度').setWidth('90px'));
    materialAlphaTestRow.add(materialAlphaTest);

    container.add(materialAlphaTestRow);

    // wireframe

    var materialWireframeRow = new UI.Row();
    var materialWireframe = new UI.Checkbox(false).onChange(update);
    var materialWireframeLinewidth = new UI.Number(1).setWidth('60px').setRange(0, 100).onChange(update);

    materialWireframeRow.add(new UI.Text('显示线框').setWidth('90px').setTitle('[Wireframe] 如果为true，则将材质渲染成线框，在调试的时候可以起到很好的作用。'));
    materialWireframeRow.add(materialWireframe);
    materialWireframeRow.add(materialWireframeLinewidth);

    container.add(materialWireframeRow);

    //

    function update() {

        var object = currentObject;

        var geometry = object.geometry;
        var material = object.material;

        var previousSelectedSlot = currentMaterialSlot;

        currentMaterialSlot = parseInt(materialSlotSelect.getValue());

        if (currentMaterialSlot !== previousSelectedSlot) refreshUI(true);

        material = editor.getObjectMaterial(currentObject, currentMaterialSlot)

        var textureWarning = false;
        var objectHasUvs = false;

        if (object instanceof THREE.Sprite) objectHasUvs = true;
        if (geometry instanceof THREE.Geometry && geometry.faceVertexUvs[0].length > 0) objectHasUvs = true;
        if (geometry instanceof THREE.BufferGeometry && geometry.attributes.uv !== undefined) objectHasUvs = true;

        if (material) {

            if (material.uuid !== undefined && material.uuid !== materialUUID.getValue()) {

                editor.execute(new SetMaterialValueCommand(currentObject, 'uuid', materialUUID.getValue(), currentMaterialSlot));

            }

            if (material instanceof THREE[materialClass.getValue()] === false) {

                material = new THREE[materialClass.getValue()]();

                editor.execute(new SetMaterialCommand(currentObject, material, currentMaterialSlot), 'New Material: ' + materialClass.getValue());
                // TODO Copy other references in the scene graph
                // keeping name and UUID then.
                // Also there should be means to create a unique
                // copy for the current object explicitly and to
                // attach the current material to other objects.

            }

            if (material.color !== undefined && material.color.getHex() !== materialColor.getHexValue()) {

                editor.execute(new SetMaterialColorCommand(currentObject, 'color', materialColor.getHexValue(), currentMaterialSlot));

            }

            if (material.roughness !== undefined && Math.abs(material.roughness - materialRoughness.getValue()) >= 0.01) {

                editor.execute(new SetMaterialValueCommand(currentObject, 'roughness', materialRoughness.getValue(), currentMaterialSlot));

            }

            if (material.metalness !== undefined && Math.abs(material.metalness - materialMetalness.getValue()) >= 0.01) {

                editor.execute(new SetMaterialValueCommand(currentObject, 'metalness', materialMetalness.getValue(), currentMaterialSlot));

            }

            if (material.emissive !== undefined && material.emissive.getHex() !== materialEmissive.getHexValue()) {

                editor.execute(new SetMaterialColorCommand(currentObject, 'emissive', materialEmissive.getHexValue(), currentMaterialSlot));

            }

            if (material.specular !== undefined && material.specular.getHex() !== materialSpecular.getHexValue()) {

                editor.execute(new SetMaterialColorCommand(currentObject, 'specular', materialSpecular.getHexValue(), currentMaterialSlot));

            }

            if (material.shininess !== undefined && Math.abs(material.shininess - materialShininess.getValue()) >= 0.01) {

                editor.execute(new SetMaterialValueCommand(currentObject, 'shininess', materialShininess.getValue(), currentMaterialSlot));

            }

            if (material.clearCoat !== undefined && Math.abs(material.clearCoat - materialClearCoat.getValue()) >= 0.01) {

                editor.execute(new SetMaterialValueCommand(currentObject, 'clearCoat', materialClearCoat.getValue(), currentMaterialSlot));

            }

            if (material.clearCoatRoughness !== undefined && Math.abs(material.clearCoatRoughness - materialClearCoatRoughness.getValue()) >= 0.01) {

                editor.execute(new SetMaterialValueCommand(currentObject, 'clearCoatRoughness', materialClearCoatRoughness.getValue(), currentMaterialSlot));

            }

            if (material.vertexColors !== undefined) {

                var vertexColors = parseInt(materialVertexColors.getValue());

                if (material.vertexColors !== vertexColors) {

                    editor.execute(new SetMaterialValueCommand(currentObject, 'vertexColors', vertexColors, currentMaterialSlot));

                }

            }

            if (material.skinning !== undefined && material.skinning !== materialSkinning.getValue()) {

                editor.execute(new SetMaterialValueCommand(currentObject, 'skinning', materialSkinning.getValue(), currentMaterialSlot));

            }

            if (material.map !== undefined) {
                var mapEnabled = materialMapEnabled.getValue() === true;
                if (objectHasUvs) {
                    var map = mapEnabled ? materialMap.getValue() : null;
                    if (material.map !== map) {
                        editor.execute(new SetMaterialMapCommand(currentObject, 'map', map, currentMaterialSlot));
                    }
                } else {
                    if (mapEnabled) textureWarning = true;
                }

                if (mapEnabled && (material.map.repeat.x !== repeatMapX.getValue() || material.map.repeat.y !== repeatMapY.getValue())) {
                    var map = mapEnabled ? materialMap.getValue() : null;
                    map.wrapS = THREE.RepeatWrapping;
                    map.wrapT = THREE.RepeatWrapping;
                    map.repeat.x = repeatMapX.getValue() || 1;
                    map.repeat.y = repeatMapY.getValue() || 1;
                    editor.execute(new SetMaterialMapCommand(currentObject, 'repeat', map, currentMaterialSlot));
                    
                }
            }

            if (material.alphaMap !== undefined) {

                var mapEnabled = materialAlphaMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    var alphaMap = mapEnabled ? materialAlphaMap.getValue() : null;
                    if (material.alphaMap !== alphaMap) {

                        editor.execute(new SetMaterialMapCommand(currentObject, 'alphaMap', alphaMap, currentMaterialSlot));
                    }

                } else {

                    if (mapEnabled) textureWarning = true;

                }

            }

            if (material.bumpMap !== undefined) {

                var bumpMapEnabled = materialBumpMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    var bumpMap = bumpMapEnabled ? materialBumpMap.getValue() : null;
                    if (material.bumpMap !== bumpMap) {

                        editor.execute(new SetMaterialMapCommand(currentObject, 'bumpMap', bumpMap, currentMaterialSlot));

                    }

                    if (material.bumpScale !== materialBumpScale.getValue()) {

                        editor.execute(new SetMaterialValueCommand(currentObject, 'bumpScale', materialBumpScale.getValue(), currentMaterialSlot));

                    }

                } else {

                    if (bumpMapEnabled) textureWarning = true;

                }

            }

            if (material.normalMap !== undefined) {

                var normalMapEnabled = materialNormalMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    var normalMap = normalMapEnabled ? materialNormalMap.getValue() : null;
                    if (material.normalMap !== normalMap) {

                        editor.execute(new SetMaterialMapCommand(currentObject, 'normalMap', normalMap, currentMaterialSlot));

                    }

                } else {

                    if (normalMapEnabled) textureWarning = true;

                }

            }

            if (material.displacementMap !== undefined) {

                var displacementMapEnabled = materialDisplacementMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    var displacementMap = displacementMapEnabled ? materialDisplacementMap.getValue() : null;
                    if (material.displacementMap !== displacementMap) {

                        editor.execute(new SetMaterialMapCommand(currentObject, 'displacementMap', displacementMap, currentMaterialSlot));

                    }

                    if (material.displacementScale !== materialDisplacementScale.getValue()) {

                        editor.execute(new SetMaterialValueCommand(currentObject, 'displacementScale', materialDisplacementScale.getValue(), currentMaterialSlot));

                    }

                } else {

                    if (displacementMapEnabled) textureWarning = true;

                }

            }

            if (material.roughnessMap !== undefined) {

                var roughnessMapEnabled = materialRoughnessMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    var roughnessMap = roughnessMapEnabled ? materialRoughnessMap.getValue() : null;
                    if (material.roughnessMap !== roughnessMap) {

                        editor.execute(new SetMaterialMapCommand(currentObject, 'roughnessMap', roughnessMap, currentMaterialSlot));

                    }

                } else {

                    if (roughnessMapEnabled) textureWarning = true;

                }

            }

            if (material.metalnessMap !== undefined) {

                var metalnessMapEnabled = materialMetalnessMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    var metalnessMap = metalnessMapEnabled ? materialMetalnessMap.getValue() : null;
                    if (material.metalnessMap !== metalnessMap) {

                        editor.execute(new SetMaterialMapCommand(currentObject, 'metalnessMap', metalnessMap, currentMaterialSlot));

                    }

                } else {

                    if (metalnessMapEnabled) textureWarning = true;

                }

            }

            if (material.specularMap !== undefined) {

                var specularMapEnabled = materialSpecularMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    var specularMap = specularMapEnabled ? materialSpecularMap.getValue() : null;
                    if (material.specularMap !== specularMap) {

                        editor.execute(new SetMaterialMapCommand(currentObject, 'specularMap', specularMap, currentMaterialSlot));

                    }

                } else {

                    if (specularMapEnabled) textureWarning = true;

                }

            }

            if (material.envMap !== undefined) {

                var envMapEnabled = materialEnvMapEnabled.getValue() === true;

                var envMap = envMapEnabled ? materialEnvMap.getValue() : null;

                if (material.envMap !== envMap) {

                    editor.execute(new SetMaterialMapCommand(currentObject, 'envMap', envMap, currentMaterialSlot));

                }

            }

            if (material.reflectivity !== undefined) {

                var reflectivity = materialReflectivity.getValue();

                if (material.reflectivity !== reflectivity) {

                    editor.execute(new SetMaterialValueCommand(currentObject, 'reflectivity', reflectivity, currentMaterialSlot));

                }

            }

            if (material.lightMap !== undefined) {

                var lightMapEnabled = materialLightMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    var lightMap = lightMapEnabled ? materialLightMap.getValue() : null;
                    if (material.lightMap !== lightMap) {

                        editor.execute(new SetMaterialMapCommand(currentObject, 'lightMap', lightMap, currentMaterialSlot));

                    }

                } else {

                    if (lightMapEnabled) textureWarning = true;

                }

            }

            if (material.aoMap !== undefined) {

                var aoMapEnabled = materialAOMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    var aoMap = aoMapEnabled ? materialAOMap.getValue() : null;
                    if (material.aoMap !== aoMap) {

                        editor.execute(new SetMaterialMapCommand(currentObject, 'aoMap', aoMap, currentMaterialSlot));

                    }

                    if (material.aoMapIntensity !== materialAOScale.getValue()) {

                        editor.execute(new SetMaterialValueCommand(currentObject, 'aoMapIntensity', materialAOScale.getValue(), currentMaterialSlot));

                    }

                } else {

                    if (aoMapEnabled) textureWarning = true;

                }

            }

            if (material.emissiveMap !== undefined) {

                var emissiveMapEnabled = materialEmissiveMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    var emissiveMap = emissiveMapEnabled ? materialEmissiveMap.getValue() : null;
                    if (material.emissiveMap !== emissiveMap) {

                        editor.execute(new SetMaterialMapCommand(currentObject, 'emissiveMap', emissiveMap, currentMaterialSlot));

                    }

                } else {

                    if (emissiveMapEnabled) textureWarning = true;

                }

            }

            if (material.side !== undefined) {

                var side = parseInt(materialSide.getValue());
                if (material.side !== side) {

                    editor.execute(new SetMaterialValueCommand(currentObject, 'side', side, currentMaterialSlot));

                }


            }

            if (material.flatShading !== undefined) {

                var flatShading = materialShading.getValue();
                if (material.flatShading != flatShading) {

                    editor.execute(new SetMaterialValueCommand(currentObject, 'flatShading', flatShading, currentMaterialSlot));

                }

            }

            if (material.blending !== undefined) {

                var blending = parseInt(materialBlending.getValue());
                if (material.blending !== blending) {

                    editor.execute(new SetMaterialValueCommand(currentObject, 'blending', blending, currentMaterialSlot));

                }

            }

            if (material.opacity !== undefined && Math.abs(material.opacity - materialOpacity.getValue()) >= 0.01) {

                editor.execute(new SetMaterialValueCommand(currentObject, 'opacity', materialOpacity.getValue(), currentMaterialSlot));

            }

            if (material.transparent !== undefined && material.transparent !== materialTransparent.getValue()) {

                editor.execute(new SetMaterialValueCommand(currentObject, 'transparent', materialTransparent.getValue(), currentMaterialSlot));

            }

            if (material.alphaTest !== undefined && Math.abs(material.alphaTest - materialAlphaTest.getValue()) >= 0.01) {

                editor.execute(new SetMaterialValueCommand(currentObject, 'alphaTest', materialAlphaTest.getValue(), currentMaterialSlot));

            }

            if (material.wireframe !== undefined && material.wireframe !== materialWireframe.getValue()) {

                editor.execute(new SetMaterialValueCommand(currentObject, 'wireframe', materialWireframe.getValue(), currentMaterialSlot));

            }

            if (material.wireframeLinewidth !== undefined && Math.abs(material.wireframeLinewidth - materialWireframeLinewidth.getValue()) >= 0.01) {

                editor.execute(new SetMaterialValueCommand(currentObject, 'wireframeLinewidth', materialWireframeLinewidth.getValue(), currentMaterialSlot));

            }

            refreshUI();

        }

        if (textureWarning) {

            console.warn("Can't set texture, model doesn't have texture coordinates");

        }

    }

    //

    function setRowVisibility() {

        var properties = {
            'name': materialNameRow,
            'color': materialColorRow,
            'roughness': materialRoughnessRow,
            'metalness': materialMetalnessRow,
            'emissive': materialEmissiveRow,
            'specular': materialSpecularRow,
            'shininess': materialShininessRow,
            'clearCoat': materialClearCoatRow,
            'clearCoatRoughness': materialClearCoatRoughnessRow,
            'vertexShader': materialProgramRow,
            'vertexColors': materialVertexColorsRow,
            'skinning': materialSkinningRow,
            'map': materialMapRow,
            'alphaMap': materialAlphaMapRow,
            'bumpMap': materialBumpMapRow,
            'normalMap': materialNormalMapRow,
            'displacementMap': materialDisplacementMapRow,
            'roughnessMap': materialRoughnessMapRow,
            'metalnessMap': materialMetalnessMapRow,
            'specularMap': materialSpecularMapRow,
            'envMap': materialEnvMapRow,
            'lightMap': materialLightMapRow,
            'aoMap': materialAOMapRow,
            'emissiveMap': materialEmissiveMapRow,
            'side': materialSideRow,
            'flatShading': materialShadingRow,
            'blending': materialBlendingRow,
            'opacity': materialOpacityRow,
            'transparent': materialTransparentRow,
            'alphaTest': materialAlphaTestRow,
            'wireframe': materialWireframeRow
        };

        var material = currentObject.material;

        if (Array.isArray(material)) {

            materialSlotRow.setDisplay('');

            if (material.length === 0) return;

            material = material[currentMaterialSlot];

        } else {

            materialSlotRow.setDisplay('none');

        }

        for (var property in properties) {

            properties[property].setDisplay(material[property] !== undefined ? '' : 'none');

        }

        materialMapRepeatRow.setDisplay(material.map !== undefined ? '' : 'none');
    }


    function refreshUI(resetTextureSelectors) {

        if (!currentObject) return;

        var material = currentObject.material;

        if (Array.isArray(material)) {

            var slotOptions = {};

            currentMaterialSlot = Math.max(0, Math.min(material.length, currentMaterialSlot));

            for (var i = 0; i < material.length; i++) {

                slotOptions[i] = String(i + 1) + ': ' + material[i].name;

            }

            materialSlotSelect.setOptions(slotOptions).setValue(currentMaterialSlot);

        }

        material = editor.getObjectMaterial(currentObject, currentMaterialSlot);

        if (material.uuid !== undefined) {

            materialUUID.setValue(material.uuid);

        }

        if (material.name !== undefined) {

            materialName.setValue(material.name);

        }

        materialClass.setValue(material.type);

        if (material.color !== undefined) {

            materialColor.setHexValue(material.color.getHexString());

        }

        if (material.roughness !== undefined) {

            materialRoughness.setValue(material.roughness);

        }

        if (material.metalness !== undefined) {

            materialMetalness.setValue(material.metalness);

        }

        if (material.emissive !== undefined) {

            materialEmissive.setHexValue(material.emissive.getHexString());

        }

        if (material.specular !== undefined) {

            materialSpecular.setHexValue(material.specular.getHexString());

        }

        if (material.shininess !== undefined) {

            materialShininess.setValue(material.shininess);

        }

        if (material.clearCoat !== undefined) {

            materialClearCoat.setValue(material.clearCoat);

        }

        if (material.clearCoatRoughness !== undefined) {

            materialClearCoatRoughness.setValue(material.clearCoatRoughness);

        }

        if (material.vertexColors !== undefined) {

            materialVertexColors.setValue(material.vertexColors);

        }

        if (material.skinning !== undefined) {

            materialSkinning.setValue(material.skinning);

        }

        if (material.map !== undefined) {
            materialMapEnabled.setValue(material.map !== null);
            if (material.map !== null || resetTextureSelectors) {
                materialMap.setValue(material.map);
            }

            if (material.map != null && material.map.repeat != null) {
                repeatMapX.setValue(material.map.repeat.x);
                repeatMapY.setValue(material.map.repeat.y);
            }
        }

        if (material.alphaMap !== undefined) {
            materialAlphaMapEnabled.setValue(material.alphaMap !== null);
            if (material.alphaMap !== null || resetTextureSelectors) {
                materialAlphaMap.setValue(material.alphaMap);
            }
        }

        if (material.bumpMap !== undefined) {

            materialBumpMapEnabled.setValue(material.bumpMap !== null);

            if (material.bumpMap !== null || resetTextureSelectors) {

                materialBumpMap.setValue(material.bumpMap);

            }

            materialBumpScale.setValue(material.bumpScale);

        }

        if (material.normalMap !== undefined) {

            materialNormalMapEnabled.setValue(material.normalMap !== null);

            if (material.normalMap !== null || resetTextureSelectors) {

                materialNormalMap.setValue(material.normalMap);

            }

        }

        if (material.displacementMap !== undefined) {

            materialDisplacementMapEnabled.setValue(material.displacementMap !== null);

            if (material.displacementMap !== null || resetTextureSelectors) {

                materialDisplacementMap.setValue(material.displacementMap);

            }

            materialDisplacementScale.setValue(material.displacementScale);

        }

        if (material.roughnessMap !== undefined) {

            materialRoughnessMapEnabled.setValue(material.roughnessMap !== null);

            if (material.roughnessMap !== null || resetTextureSelectors) {

                materialRoughnessMap.setValue(material.roughnessMap);

            }

        }

        if (material.metalnessMap !== undefined) {

            materialMetalnessMapEnabled.setValue(material.metalnessMap !== null);

            if (material.metalnessMap !== null || resetTextureSelectors) {

                materialMetalnessMap.setValue(material.metalnessMap);

            }

        }

        if (material.specularMap !== undefined) {

            materialSpecularMapEnabled.setValue(material.specularMap !== null);

            if (material.specularMap !== null || resetTextureSelectors) {

                materialSpecularMap.setValue(material.specularMap);

            }

        }

        if (material.envMap !== undefined) {

            materialEnvMapEnabled.setValue(material.envMap !== null);

            if (material.envMap !== null || resetTextureSelectors) {

                materialEnvMap.setValue(material.envMap);

            }

        }

        if (material.reflectivity !== undefined) {

            materialReflectivity.setValue(material.reflectivity);

        }

        if (material.lightMap !== undefined) {

            materialLightMapEnabled.setValue(material.lightMap !== null);

            if (material.lightMap !== null || resetTextureSelectors) {

                materialLightMap.setValue(material.lightMap);

            }

        }

        if (material.aoMap !== undefined) {

            materialAOMapEnabled.setValue(material.aoMap !== null);

            if (material.aoMap !== null || resetTextureSelectors) {

                materialAOMap.setValue(material.aoMap);

            }

            materialAOScale.setValue(material.aoMapIntensity);

        }

        if (material.emissiveMap !== undefined) {

            materialEmissiveMapEnabled.setValue(material.emissiveMap !== null);

            if (material.emissiveMap !== null || resetTextureSelectors) {

                materialEmissiveMap.setValue(material.emissiveMap);

            }

        }

        if (material.side !== undefined) {

            materialSide.setValue(material.side);

        }

        if (material.flatShading !== undefined) {

            materialShading.setValue(material.flatShading);

        }

        if (material.blending !== undefined) {

            materialBlending.setValue(material.blending);

        }

        if (material.opacity !== undefined) {

            materialOpacity.setValue(material.opacity);

        }

        if (material.transparent !== undefined) {

            materialTransparent.setValue(material.transparent);

        }

        if (material.alphaTest !== undefined) {

            materialAlphaTest.setValue(material.alphaTest);

        }

        if (material.wireframe !== undefined) {

            materialWireframe.setValue(material.wireframe);

        }

        if (material.wireframeLinewidth !== undefined) {

            materialWireframeLinewidth.setValue(material.wireframeLinewidth);

        }

        setRowVisibility();

    }

    // events

    signals.objectSelected.add(function (object) {

        var hasMaterial = false;

        if (object && object.material) {

            hasMaterial = true;

            if (Array.isArray(object.material) && object.material.length === 0) {

                hasMaterial = false;

            }

        }

        if (hasMaterial) {

            var objectChanged = object !== currentObject;

            currentObject = object;
            refreshUI(objectChanged);
            container.setDisplay('');

        } else {

            currentObject = null;
            container.setDisplay('none');

        }

    });

    signals.materialChanged.add(function () {

        refreshUI();

    });

    return container;

};
