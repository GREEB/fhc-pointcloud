import '../scss/styles.scss';
import posData from './pos.json';
import * as THREE from 'three'
import { OrbitControls, MapControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { color, GUI } from 'three/examples/jsm/libs/dat.gui.module'
import round from '../public/images/textures/round.png'
import { io } from "socket.io-client";

let container, stats, guiLet
let camera, scene, renderer, controls, box, geometry, material
let colors = {}
let points;
let pointsCount = 0
let lastBgColor = [50, 50, 50];
let opOp = {
	pointCount: 0
}

init();
animate();

function initGui() {
	guiLet = {
		boxVisible: false,
		colorSchema: 'Height',
		backgroundColor: lastBgColor,
		pointsCount: pointsCount
	};
	const gui = new GUI()
	const optionFolder = gui.addFolder('Options')
	optionFolder.add(guiLet, 'colorSchema', [ 'Height', 'Terrain'] ).onChange(function (v) { changeColor(v) })
	optionFolder.add(material, 'opacity', 0,1).listen()
	optionFolder.add(material, 'size', 0.0001,100).listen()
	optionFolder.addColor(guiLet, 'backgroundColor').name("Background").onChange(function (value) { setBackgroundColor(value) })              
	optionFolder.add(guiLet, 'boxVisible').name("Bounding box").onChange(function (value) { box.visible = value })
	optionFolder.add(opOp, 'pointCount').listen()

	optionFolder.open()
	const cubeFolder = gui.addFolder('Scene')
	cubeFolder.add(scene.rotation, 'x', 0, Math.PI * 2).listen()
	cubeFolder.add(scene.rotation, 'y', 0, Math.PI * 2).listen()
	cubeFolder.add(scene.rotation, 'z', 0, Math.PI * 2).listen()
	const cameraFolder = gui.addFolder('Camera')
	cameraFolder.add(camera.position, 'z').listen()
	cameraFolder.add(camera.position, 'x').listen()
	cameraFolder.add(camera.position, 'y').listen()

}

function init() {
	THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);
	
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 13000);

	scene = new THREE.Scene();


	//scene.fog = new THREE.Fog(0x050505, 2000, 15000);

	//

	const particles = 500000;

	geometry = new THREE.BufferGeometry();

	let positions = new Float32Array(particles * 3);
	colors.default = new Float32Array(particles * 3);
	colors.height = new Float32Array(particles * 3);
	colors.terrain = new Float32Array(particles * 3);

	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors.terrain, 3));
	
	// TODO: Change shape can be done with a texture but not cool maybe shader?
	material = new THREE.PointsMaterial({
		size: 20,
		vertexColors: true,
		blending: THREE.AdditiveBlending,
		transparent: true,
		sizeAttenuation: true,
		opacity: 0.4
	});
	material.blending = THREE.CustomBlending
	material.blendSrc = THREE.OneFactor
	material.blendDst = THREE.OneMinusSrcAlphaFactor
	points = new THREE.Points(geometry, material);
	points.rotation.y = Math.PI;

	scene.add(points);

	geometry.computeBoundingSphere();
	geometry.computeBoundingBox();
	//

	renderer = new THREE.WebGLRenderer({
		preserveDrawingBuffer: false,
		antialias: true
	});
	initGui();

	setBackgroundColor(guiLet.backgroundColor);

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	//

	stats = new Stats();
	document.body.appendChild(stats.dom);

	//

	window.addEventListener('resize', onWindowResize);
	controls = new OrbitControls(camera, renderer.domElement);


	controls.screenSpacePanning = true;


}

// Need to be done after first render
points.geometry.attributes.position.needsUpdate = true; // required after the first render
points.geometry.attributes.color.needsUpdate = true
material.needsUpdate = true;
geometry.needsUpdate = true;

let addPoint = (xyz, heightRGB, terrainRGB) => {
	const positions = points.geometry.attributes.position.array;
	const defaultColor = points.geometry.attributes.color.array
	
	positions[pointsCount] = xyz[0];
	positions[pointsCount + 1] = xyz[1];
	positions[pointsCount + 2] = xyz[2];

	defaultColor[pointsCount] = heightRGB[0]
	defaultColor[pointsCount + 1] = heightRGB[1]
	defaultColor[pointsCount + 2] = heightRGB[2]

	colors.default[pointsCount] = 255
	colors.default[pointsCount + 1] = 255
	colors.default[pointsCount + 2] = 255

	colors.height[pointsCount] = heightRGB[0]
	colors.height[pointsCount + 1] = heightRGB[1]
	colors.height[pointsCount + 2] = heightRGB[2]

	colors.terrain[pointsCount] = terrainRGB[0]
	colors.terrain[pointsCount + 1] = terrainRGB[1]
	colors.terrain[pointsCount + 2] = terrainRGB[2]

	pointsCount += 3
	opOp.pointCount += 3
}


// Test for addPoint function
// for (let i = 0; i < 1000; i++) {
//     addPoint([i, i, 1000])

// }
const parsePoint = (posData) => {
	// each point must be 3D
	let heightRGB = [100 / 255, 100 / 255, posData.y / 510]
	let terrainRGB
	if (posData.s == 1) {
		terrainRGB = [136 / 255, 119 / 255, 89 / 255]
	} else if (posData.s == 2) {
		terrainRGB = [30 / 255, 62 / 255, 73 / 255]
	} else {
		terrainRGB = [205 / 255, 205 / 255, 205 / 255]
	}
	let xyz = [
		parseFloat(posData.y),
		parseFloat(posData.x),
		parseFloat(posData.z)
	]
	
	addPoint(xyz, heightRGB, terrainRGB)
}

// console.log(posData);
for (const pos in posData) {
	if (posData.hasOwnProperty(pos)) {
		parsePoint(posData[pos])
	}
}
points.geometry.attributes.position.needsUpdate = true; // required after the first render
points.geometry.attributes.color.needsUpdate = true
geometry.computeBoundingSphere();
geometry.computeBoundingBox();
box = new THREE.BoxHelper(points, 0x3c3c3c);
box.visible = false
scene.add(box);
camera.position.z = 4522
camera.position.x = 5905
camera.position.y = -2704
controls.target.copy(geometry.boundingBox.getCenter());
scene.rotation.y = Math.PI / 2
// scene.rotation.z = Math.PI / 2


// MISC function
function setBackgroundColor(arrayRGB) {
	lastBgColor = arrayRGB;
	renderer.setClearColor(new THREE.Color().setRGB(arrayRGB[0] / 256, arrayRGB[1] / 256, arrayRGB[2] / 256));
	//renderer.clear(true, true, true);
}
const changeColor = (color) => {
	let sel = color.toLowerCase()
	points.geometry.attributes.color.array = colors[sel]
	points.geometry.attributes.color.needsUpdate = true

}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
	controls.update();

	requestAnimationFrame(animate);
	render();
	stats.update();
}

function render() {
	renderer.render(scene, camera);
}