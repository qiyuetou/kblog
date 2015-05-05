var config = {
    radius: 300
}

var rList = new rendenList();

var main = document.getElementById('main');

var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.z = 1900;
camera.position.y = 0;

controls = new THREE.TrackballControls(camera);

main.appendChild(renderer.domElement);


/** earth **/

var earthGeo = new THREE.SphereGeometry(config.radius, 100, 50);
var earth = THREE.SceneUtils.createMultiMaterialObject(earthGeo, [
    new THREE.MeshPhongMaterial({
        color: 0xfefefe,
        transparent: true,
        opacity: 0.5,
        combine: THREE.MultiplyOperation,
        name: 'earth1'
    }),
    new THREE.MeshBasicMaterial({
        color: 0x002A52,
        transparent: true,
        // depthWrite: false,
        // depthTest: false,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        name: 'earth2'
    }),
    new THREE.MeshBasicMaterial({
        color: 0xf0f0f0,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        wireframe: true,
        side: THREE.FrontSide,
        name: 'earth3'
    }),
]);
earth.name = 'earth';
scene.add(earth);
/** end earth **/


/* light */
var backgroundLight = new THREE.HemisphereLight(0x002A52, 0x000000, 7);
scene.add(backgroundLight);
/* end light */

/* map */
var mapGeomerty = new THREE.Geometry();

//country bands
var mapSwitch = '';
var mapSwitch = 'mine';
var earthPlan;
if (mapSwitch == 'mine') {
    earthPlan = dottedMap()
} else {
    earthPlan = planeMap();
}

earth.add(earthPlan);


function dottedMap() {
    var countrys = world.features;
    for (var i in countrys) {
        var countryGeometry = countrys[i].geometry;

        if (countryGeometry.type === 'Polygon') {
            for (j in countryGeometry.coordinates) {
                var coors = countryGeometry.coordinates[j];
                getTheLatlog(coors)
            }
        } else {
            for (var j = 0; j < countryGeometry.coordinates.length; j++) {
                for (var k = 0; k < countryGeometry.coordinates[j].length; k++) {
                    var coors = countryGeometry.coordinates[j][k];
                    getTheLatlog(coors)
                }
            }
        }
    };

    function getTheLatlog(coors) {
        for (var i = 0; i < coors.length; i++) {
            pushVert(coors[i][0], coors[i][1]);
        }
    };
    //
    function pushVert(lat, log) {
        mapGeomerty.vertices.push(latlogToVec3(lat, log, config.radius + 5));
    };

    var mapmaterial = new THREE.PointCloudMaterial({
        size: 3,
        color: 'yellow',
    });
    var map = new THREE.PointCloud(mapGeomerty, mapmaterial);

    return map;

}

function planeMap() {
    var map = new THREE.Object3D();
    for (var name in country_data) {
        geometry = new Tessalator3D(country_data[name], 0);

        var continents = ["EU", "AN", "AS", "OC", "SA", "AF", "NA"];
        var color = new THREE.Color(0xff0000);
        color.setHSL(continents.indexOf(country_data[name].data.cont) * (1 / 7), Math.random() * 0.25 + 0.65, Math.random() / 2 + 0.25);
        mesh = country_data[name].mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
            color: randomColor()
        }));
        mesh.name = "land";
        mesh.userData.country = name;
        mesh.scale.x = 305;
        mesh.scale.y = 305;
        mesh.scale.z = 305;
        mesh.rotateY(180 * Math.PI / 180);
        map.add(mesh);
    }
    // earth.add(map);
    return map;
}

/* end map */


/*****/
window.addEventListener('mousemove', onMouseMove, false);
var mouse = new THREE.Vector3();
var raycaster = new THREE.Raycaster();

var hoverCountry = {};

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObject(scene, true);

    if (intersects[0] && intersects[0].object.name === "land") {
        if (hoverCountry.id == intersects[0].object.id) {
            console.log('same')
            return false;
        }

        hoverCountry.id && hoverCountry.scale.set(306, 306, 306);
        hoverCountry = intersects[0].object;
        intersects[0].object.scale.set(310, 310, 310);
        //intersects[0].object.userData.country
        console.log('1111', intersects[0].object.userData.country);
    }

};
/*****/

/** tools */
function latlogToVec3(lat, log, radius) {
    var radius = radius || config.radius;
    var y = radius * Math.sin(log * Math.PI / 180);
    var newRadius = radius * Math.cos(log * Math.PI / 180);

    var x = newRadius * Math.sin(lat * Math.PI / 180);
    var z = newRadius * Math.cos(lat * Math.PI / 180);

    return new THREE.Vector3(x, y, z);
};

function randomColor() {
    var getSingleColor = function() {
        var theNum = Math.random() * 255 | 0;
        theNum = theNum.toString(16);
        theNum = theNum.length <= 1 ? '0' + theNum : theNum;
        theNum = theNum.toUpperCase();
        return theNum;
    }
    return '#' + getSingleColor() + getSingleColor() + getSingleColor();
}

/** line */
var lineGroup = new THREE.Object3D();

for (var i = 0; i < cityLocation.length; i++) {
    var lat = cityLocation[i][0];
    var log = cityLocation[i][1];

    makeFlag(lat, log, 50, lineGroup);
}
earth.add(lineGroup);

function makeFlag(lat, log, height, geo) {
    var geo = geo || new THREE.Object3D();
    var startPoint = latlogToVec3(lat, log, config.radius);
    var endPoint = latlogToVec3(lat, log, config.radius + height);
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({
        // color: randomColor(),
        color: 'skyblue',
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.4
    });

    geometry.vertices.push(startPoint, endPoint);
    var line = new THREE.Line(geometry, material);
    geo.add(line);
    return geo;
};
/***/


// setTimeout(function() {
// line.animate({
// type: 'endToStart'
// });
// }, 1000);


/**
 * line to  two place
 * @param {Object} obj
 * @param {Object} obj.start
 * @param {Object} obj.end
 * @param {Object} obj.subdivide
 * @param {Object} obj.radius
 */

function lineTo(obj) {
    if (!obj.start || !obj.end) {
        return false;
    }

    var subdivide = obj.subdivide || 100;

    var start = obj.start;
    var end = obj.end;

    // earth.add(makeFlag(start[0], start[1], 50));
    // earth.add(makeFlag(end[0], end[1], 50));

    var geometry = new THREE.Geometry();
    var latD = ((start[0] - end[0]) / subdivide).toFixed(4);
    var logD = ((start[1] - end[1]) / subdivide).toFixed(4);

    this.vertices = this.vertices || [];
    for (var i = 0; i < subdivide; i++) {
        var lat = (start[0] - latD * i).toFixed(4);
        var log = (start[1] - logD * i).toFixed(4);
        var point = latlogToVec3(lat, log, obj.radius);
        geometry.vertices.push(point);
        this.vertices.push(point.clone());
        if (i == subdivide - 1) {
            var lat = end[0];
            var log = end[1];
            var point = latlogToVec3(lat, log, obj.radius);
            geometry.vertices.push(point);
            this.vertices.push(point.clone());
        }
    }

    var material = new THREE.LineBasicMaterial({
        // color: randomColor(),
        color: 'white',
        blending: THREE.AdditiveBlending,
    });
    var line = new THREE.Line(geometry, material);
    earth.add(line);

    this.line = line;
};

/**
 * lineTo.animate
 * @param  {Object} obj
 * @param  {Object} obj.type  startToEnd|endToStart
 */
lineTo.prototype.animate = function(obj) {
    var obj = obj || {};
    var self = this;
    var vertices = this.vertices;
    var total = vertices.length;
    var userVert = [];

    var line = this.line;
    var startPoint = vertices[0];
    var endPoint = vertices[vertices.length - 1];

    var type = obj.type || 'startToEnd';
    var gather = type == 'endToStart' ? endPoint : startPoint;

    for (var i = 0; i < line.geometry.vertices.length; i++) {
        line.geometry.vertices[i].x = gather.x;
        line.geometry.vertices[i].y = gather.y;
        line.geometry.vertices[i].z = gather.z;
    }
    line.geometry.verticesNeedUpdate = true;


    if (self.listID) {
        rList.remove(self.listID);
    }

    var i = 0;
    self.listID = rList.add(function() {
        moveTo(i++);
        // moveTo(i++);
    });

    function moveTo(i) {

        if (type == 'moveto') {
            var skip = 28;
            if (i >= total + skip) {
                rList.remove(self.listID);
                return false;
            }


            var end = (i - skip) < 0 ? 0 : (i - skip);
            for (var j = 0; j < line.geometry.vertices.length; j++) {
                var _x, _y, _z;
                if (j <= end) {
                    _x = vertices[end].x;
                    _y = vertices[end].y;
                    _z = vertices[end].z;
                } else if (j >= i) {
                    _x = vertices[i].x;
                    _y = vertices[i].y;
                    _z = vertices[i].z;
                } else {
                    _x = vertices[j].x;
                    _y = vertices[j].y;
                    _z = vertices[j].z;
                }

                line.geometry.vertices[j].x = _x;
                line.geometry.vertices[j].y = _y;
                line.geometry.vertices[j].z = _z;
            }
            // console.log(pos);

        } else {
            if (i >= total) {
                rList.remove(self.listID);
                return false;
            }
            var nextPos = type == 'endToStart' ? vertices[total - i - 1] : vertices[i];
            var point = line.geometry.vertices.pop();
            point.x = nextPos.x;
            point.y = nextPos.y;
            point.z = nextPos.z;
            line.geometry.vertices.unshift(point);
        }

        line.geometry.verticesNeedUpdate = true;
    }
};




/***/
earth.rotateY(-110 * Math.PI / 180);

/* readen list */
function rendenList() {
    this.list = {};
};

rendenList.prototype.add = (function() {
    var addID = 0;
    return function(fn) {
        addID++;
        this.list[addID] = fn;
        return addID;
    }
})();

rendenList.prototype.remove = function(listID) {
    // console.log('xxx',listID);
    delete this.list[listID];
};

rendenList.prototype.readen = function() {
    for (var i in this.list) {
        var fn = this.list[i];
        fn && fn();
    }
};

/**/
function readen() {
    renderer.clear();
    renderer.render(scene, camera);
    requestAnimationFrame(readen);
    controls.update();
    /* custom readen */
    rList.readen();
    /**/
    earth.rotateY(0.001)
}

requestAnimationFrame(readen);


function showLine() {
    //#1
    var latlon = cityLocation[Math.random() * cityLocation.length | 0];
    // var latlon = cityLocation[1];
    var latlon2 = cityLocation[Math.random() * cityLocation.length | 0];

    // #2
    var latlon = [(Math.random() * 360 - 180).toFixed(2), (Math.random() * 180 - 90).toFixed(2)];
    var latlon2 = [(Math.random() * 360 - 180).toFixed(2), (Math.random() * 180 - 90).toFixed(2)];

    window.ui && ui.tips && ui.tips(latlon, latlon2);
    // console.log(latlon, latlon2);

    var line3 = new lineTo({
        subdivide: 100,
        start: [latlon[0], latlon[1]],
        end: [latlon2[0], latlon2[1]],
        radius: config.radius + 25
    });
    line3.animate({
        type: 'moveto'
    })
}

setInterval(function() {
    showLine();
}, 1500);

setInterval(function() {
    showLine();
}, 1300);

setInterval(function() {
    showLine();
}, 1000);

setInterval(function() {
    showLine();
}, 1300);

setInterval(function() {
    showLine();
}, 1000);
// 
// for (var i = 0; i < 1000; i++) {
// showLine();
// }
