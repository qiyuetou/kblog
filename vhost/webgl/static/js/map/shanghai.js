// var map = new BMap.Map("map"); // 创建Map实例
// map.centerAndZoom(new BMap.Point(121.500, 31.200), 11); // 初始化地图,设置中心点坐标和地图级别
// map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
// map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
// map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放



var main = document.getElementById('main');

var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);



var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000000);
camera.position.z = 340;
camera.position.y = 0;
camera.lookAt(new THREE.Vector3(0, 0, 0))
var controls = new THREE.TrackballControls(camera);

main.appendChild(renderer.domElement);

var levelOne = new THREE.Object3D();
scene.add(levelOne);
// var levelTwo = new THREE.Object3D();
// scene.add(levelTwo);
/*******/
//http://api.map.baidu.com/staticimage?center=121.5,31.2&width=1000&height=1000&zoom=11
//var texture = THREE.ImageUtils.loadTexture( "textures/water.jpg" );
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set( 4, 4 );
var texture = THREE.ImageUtils.loadTexture("http://api.map.baidu.com/staticimage?center=121.5,31.2&width=1000&height=1000&zoom=11");
var plane = new THREE.PlaneGeometry(150, 150, 20, 20);
var earth = THREE.SceneUtils.createMultiMaterialObject(plane, [
    //map
    // new THREE.MeshPhongMaterial({
    //     map: texture
    // }),
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

var dxs = 13439254;
var dys = 3716124;
// var dx = 150000;
// var dy = 150000;

var fillColors = [
    [73, 174, 34],
    [202, 221, 10],
    [254, 182, 10],
    [253, 54, 32]
];
var zindex = 0;
for (var i in shanghai[3]) {
    var color = fillColors[zindex++];
    addCube(3, i, color)
}



function addCube(index, radius, color) {


    var pois = shanghai[index][radius];
    for (var i in pois) {
        var height = (radius) / 1000
        height = height * (Math.random() * 2);
        var geometry = new THREE.BoxGeometry((radius - 1000) / 1000, (radius - 1000) / 1000, height);
        var material = new THREE.MeshPhongMaterial({
            color: 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')',
            // color: 'red',
            transparent: true,
            opacity: 0.8,
            // blending: THREE.AdditiveBlending,
        });

        var cube = new THREE.Mesh(geometry, material);
        // console.log(pois[i][1])
        cube.position.x = (pois[i][0] - dxs - 150000 / 2) / 1000;
        cube.position.y = (pois[i][1] - dys + 150000 / 2) / 1000;
        cube.position.z = (height / 2)+0.1;
        scene.add(cube);
    }
}



// 13439254,3716124
// 13584150,3572252


levelOne.add(earth);
// scene.add(earth);
/*******/
var texture = THREE.ImageUtils.loadTexture("/images/map/staticimage.png");
var geometry = new THREE.PlaneGeometry(150, 150, 20);
var material = new THREE.MeshBasicMaterial({
    map: texture
});
var plane = new THREE.Mesh(geometry, material);
plane.position.z = -0.1;
levelOne.add(plane);




/* light */
// var backgroundLight = new THREE.HemisphereLight(0x002A52, 0x000000, 70);
var backgroundLight = new THREE.HemisphereLight('skyblue', 0x000000, 5);
backgroundLight.position.x = 1000;
backgroundLight.position.y = 1000;
backgroundLight.position.z = 1000;
// console.log(backgroundLight.position)
scene.add(backgroundLight);
/* end light */

/*****/
// window.addEventListener('mousemove', onMouseMove, false);
var mouse = new THREE.Vector3();
var raycaster = new THREE.Raycaster();

var hoverCountry = {};

var lastCountry;



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
