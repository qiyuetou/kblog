var main = document.getElementById('main');

var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);


// html2canvas(document.body, {
//     onrendered: function(canvas) {
//         document.body.appendChild(canvas);
//     }
// });

var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 200000);
camera.position.z = 20000;
camera.position.y = 0;
camera.lookAt(new THREE.Vector3(0, 0, 0))
var controls = new THREE.TrackballControls(camera);

main.appendChild(renderer.domElement);

var levelOne = new THREE.Object3D();
scene.add(levelOne);
var levelTwo = new THREE.Object3D();
scene.add(levelTwo);
/*******/
var plane = new THREE.PlaneGeometry(20000, 10000, 40, 20);
var earth = THREE.SceneUtils.createMultiMaterialObject(plane, [
    //color
    new THREE.MeshPhongMaterial({
        color: 0xfefefe,
        transparent: true,
        opacity: 0.1,
        combine: THREE.MultiplyOperation,
        side: THREE.DoubleSide,
        name: 'earth1'
    }),
    //light
    new THREE.MeshBasicMaterial({
        color: 0x002A52,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        name: 'earth2'
    }),
    // wireframe
    new THREE.MeshBasicMaterial({
        color: 0xf0f0f0,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        wireframe: true,
        // side: THREE.FrontSide,
        side: THREE.DoubleSide,
        name: 'earth3'
    }),
]);
earth.name = 'earth';


levelOne.add(earth);
// scene.add(earth);
/*******/


/*******/
// var sky = earth.clone();
// sky.position.z = 2000
// scene.add(sky);

// var ground = earth.clone();
// ground.position.z = -2000
// scene.add(ground);
/*******/

/*** map ****/
var mapGeomerty = new THREE.Geometry();
var dottleMap = showMap();
levelOne.add(dottleMap);

function showMap() {
    var countrys = world.features;
    for (var i in countrys) {
        // return false
        var country = countrys[i];

        var geos = [];

        var countryGeometry = countrys[i].geometry;
        if (countryGeometry.type === 'Polygon') {
            // return false;
            for (j in countryGeometry.coordinates) {
                var coors = countryGeometry.coordinates[j];
                geos.push(getTheLatlog(coors))
            }
        } else {
            for (var j = 0; j < countryGeometry.coordinates.length; j++) {
                for (var k = 0; k < countryGeometry.coordinates[j].length; k++) {
                    var coors = countryGeometry.coordinates[j][k];
                    geos.push(getTheLatlog(coors))
                }
            }
        }

        var rectGeom;
        if (geos.length == 1) {
            rectGeom = geos[0];
        } else {
            rectGeom = geos[0];
            for (var i = 1; i < geos.length; i++) {
                rectGeom.merge(geos[i]);
            }
        }

        var rectMesh = new THREE.Mesh(rectGeom, new THREE.MeshBasicMaterial({
            // color: getColor(),
            color: 'skyblue',
            transparent: true,
            opacity: 0.0,
        }));
        rectMesh.name = 'land';
        rectMesh.userData.cuntryName = country.properties.name;
        rectMesh.position.z = 50;
        // console.log(geos);
        levelOne.add(rectMesh);
    };

    function getTheLatlog(coors) {
        var rectShape = new THREE.Shape();
        rectShape.moveTo(coors[0][0] * 10000 / 180, coors[0][1] * 10000 / 180);

        for (var i = 1; i < coors.length; i++) {
            pushVert(coors[i][0], coors[i][1]);
            rectShape.lineTo(coors[i][0] * 10000 / 180, coors[i][1] * 10000 / 180);
        }

        var rectGeom = new THREE.ExtrudeGeometry(rectShape, {
            amount: 100
        });

        return rectGeom;


    };

    function getColor() {
        return '#' + getRGB() + getRGB() + getRGB()
    }

    function getRGB() {
        var val = (Math.random() * 255 | 0).toString(16);
        val = val.length <= 1 ? '0' + val : val;
        return val;
    };
    //
    function pushVert(lat, log) {
        var poi = new THREE.Vector3(lat * 10000 / 180, log * 10000 / 180, 0);
        mapGeomerty.vertices.push(poi);
    };

    var mapmaterial = new THREE.PointCloudMaterial({
        size: 10,
        color: 'yellow',
    });
    var map = new THREE.PointCloud(mapGeomerty, mapmaterial);
    map.position.z = -100
    return map;

};

/*******/


/* light */
var backgroundLight = new THREE.HemisphereLight(0x002A52, 0x000000, 70);
backgroundLight.position.z = 1000;
scene.add(backgroundLight);
/* end light */

/*****/
window.addEventListener('mousemove', onMouseMove, false);
var mouse = new THREE.Vector3();
var raycaster = new THREE.Raycaster();

var hoverCountry = {};

var lastCountry;

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObject(scene, true);

    if (!intersects[0].object.userData.cuntryName) {
        return false;
    }


    if (intersects[0] && intersects[0].object.name === "land" && !intersects[0].object.userData.isShow) {

        if (lastCountry != intersects[0].object) {
            if (lastCountry) {
                lastCountry.userData.isShow = false;
                (function(lastCountry) {
                    animate.create({
                        target: function(val) {
                            lastCountry.material.opacity = val
                        },
                        from: lastCountry.material.opacity,
                        to: 0,
                        step: 10
                    });
                })(lastCountry);
            }
            lastCountry = intersects[0].object;
        }

        intersects[0].object.userData.isShow = true;
        (function(intersects) {
            animate.create({
                target: function(val) {
                    intersects[0].object.material.opacity = val
                },
                from: intersects[0].object.material.opacity,
                to: 0.8,
                step: 20
            });
        })(intersects)

    }
};

window.addEventListener('click', onClick, false);
// var mouse = new THREE.Vector3();
// var raycaster = new THREE.Raycaster();

var hoverCountry = {};

var xxxxx = false;

function onClick(event) {
    if (xxxxx) {
        return false
    }
    xxxxx = true
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObject(scene, true);

    if (intersects[0] && intersects[0].object.name === "land") {

        // intersects[0].object.position.z = 550;

    }

    animate.create({
        target: function(val) {
            levelOne.position.z = val
        },
        from: levelOne.position.z,
        to: -2000,
        step: 10
    });

    animate.create({
        target: function(val) {
            levelOne.scale.y = val
        },
        from: levelOne.scale.y,
        to: 0.5,
        step: 10
    });

    animate.create({
        target: function(val) {
            levelOne.scale.x = val
                // levelOne.position.z = val
        },
        from: levelOne.scale.x,
        to: 0.5,
        step: 10
    });

    setTimeout(function() {
        levelTwo.add(earth.clone())
    }, 800)

    //small the map
};
/*****/

/*****/
var material = new THREE.LineBasicMaterial({
    color: '#fff'
});
var geometry = new THREE.Geometry();
geometry.vertices.push(
    new THREE.Vector3(30 * 10000 / 180, 25 * 10000 / 180, 200),
    new THREE.Vector3(30 * 10000 / 180, 25 * 10000 / 180, 1000)
);
var line = new THREE.Line(geometry, material);

// scene.add(line);

//
var animate = {
    list: [],
    create: function(obj) {
        obj._step = (obj.to - obj.from) / obj.step;
        obj._now = obj.from;
        this.list.push(obj)
    },
    update: function() {
        for (var i = 0; i < this.list.length; i++) {
            var obj = this.list[i];
            obj._now = obj._now + obj._step;
            if (obj.from > obj.to) {
                if (obj._now <= obj.to) {
                    obj._now = obj.to;
                    this.list.shift(this.list.indexOf(obj));
                }
            } else {
                if (obj._now >= obj.to) {
                    obj._now = obj.to;
                    this.list.shift(this.list.indexOf(obj));
                }
            }
            obj.target(obj._now);
        }
    }
};

//
scene.rotateX(-30 * 2 * Math.PI / 360)
    /**/
function readen() {
    renderer.clear();
    renderer.render(scene, camera);
    requestAnimationFrame(readen);
    controls.update();
    animate.update();
    /**/
    // earth.rotateY(0.001)
}

requestAnimationFrame(readen);
