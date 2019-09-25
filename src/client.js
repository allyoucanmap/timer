/* copyright 2018, stefano bovio @allyoucanmap. */

import {createElement, updateElement} from './utils/DOMUtils';
import * as THREE from 'three';
import { LegacyJSONLoader } from 'three/examples/jsm/loaders/deprecated/LegacyJSONLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import tinycolor from 'tinycolor2';
import * as OIMO from 'oimo';

function  getHorses() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    let canvas = document.createElement('canvas');

    canvas.setAttribute('width', width);
    canvas.setAttribute('width', height);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.position = 'fixed';
    canvas.style.fontSize = 0;

    document.body.style.margin = 0;

    document.body.appendChild(canvas);

    let material = new THREE.MeshPhongMaterial({ color: '#ff0000' });
    let boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    let mouse = new THREE.Vector2();
    let loader = new LegacyJSONLoader();

    /*function getBox(scene, size, position) {
        let mat = material.clone();
        mat.wireframe = true;
        mat.color = new THREE.Color('#000');
        let pole = new THREE.Mesh(boxGeometry, mat);
        pole.scale.x = size[0];
        pole.scale.y = size[1];
        pole.scale.z = size[2];
        pole.position.x = position[0];
        pole.position.y = position[1];
        pole.position.z = position[2];
        scene.add(pole);
        return pole;
    }*/

    function getTerrain(scene) {
        let geometry = new THREE.PlaneGeometry(25, 25, 16, 16);
        geometry.vertices.forEach((vertex) => {
            vertex.z = Math.random() * 1;
        });
        geometry.verticesNeedUpdate = true;
        geometry.computeFaceNormals();
        geometry.computeFlatVertexNormals();
        geometry.elementsNeedUpdate = true;
        let mat = material.clone();
        mat.flatShading = true;
        mat.color = new THREE.Color('#aaffaa');
        let terrain = new THREE.Mesh(geometry, mat);
        scene.add(terrain);
        terrain.rotateX(-Math.PI / 2);
        terrain.scale.multiplyScalar(10);
        return terrain;
    }

    function getPole(scene) {
        let mat = material.clone();
        mat.color = new THREE.Color('#000');
        let pole = new THREE.Mesh(boxGeometry, mat);
        pole.scale.x = 0.05;
        pole.scale.z = 0.05;
        pole.scale.multiplyScalar(10);
        scene.add(pole);
        return pole;
    }

    // let sphereGeometry = new THREE.SphereGeometry(0.5);

    function onMouseMove(event) {
        mouse.x = (event.clientX / width) * 2 - 1;
        mouse.y = -(event.clientY / height) * 2 + 1;
    }

    const backgroundColor = '#f2f2f2';

    let raycaster = new THREE.Raycaster();
    let scene = new THREE.Scene();
    let light = new THREE.HemisphereLight('#fff', 0.9);
    light.position.copy(new THREE.Vector3(0, 150, 0.5));
    light.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(light);
    scene.background = new THREE.Color(backgroundColor);
    // scene.fog = new THREE.Fog(backgroundColor, 10, 750);
    let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    camera.position.x = 100;
    camera.position.y = 150;
    camera.position.z = 100;
    let renderer = new THREE.WebGLRenderer({ 
        canvas
    });
    renderer.setSize(width, height);

    window.addEventListener('resize', function() {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    let controls = new OrbitControls(camera, canvas);
    let clock = new THREE.Clock();

    let terrain = getTerrain(scene);
    let pole = getPole(scene);

    let world = new OIMO.World({
        info: true
    });

    world.add({ size: [250, 20, 250], pos: [0, 0, 0], world });
    // getBox(scene, [250, 20, 250],  [0, 0, 0]);

    world.add({ size: [250, 20, 250], pos: [0, 260, 0], world });
    // getBox(scene, [250, 20, 250],  [0, 260, 0]);

    world.add({ size: [20, 250, 250], pos: [135, 125, 0], world });
    // getBox(scene, [20, 250, 250],  [135, 125, 0]);

    world.add({ size: [20, 250, 250], pos: [-135, 125, 0], world });
    // getBox(scene, [20, 250, 250],  [-135, 125, 0]);


    world.add({ size: [250, 250, 20], pos: [0, 125, 135], world });
    // getBox(scene, [250, 250, 20],  [0, 125, 135]);

    world.add({ size: [180, 250, 20], pos: [-100, 125, -135], world });
    // getBox(scene, [180, 250, 20],  [-100, 125, -135]);

    world.add({ size: [180, 250, 20], pos: [100, 125, -135], world });
    // getBox(scene, [180, 250, 20],  [100, 125, -135]);

    world.add({ size: [100, 180, 20], pos: [0, 50, -135], world });
    // getBox(scene, [100, 180, 20],  [0, 50, -135]);

    world.add({ size: [100, 180, 20], pos: [0, 250, -135], world });
    // getBox(scene, [100, 180, 20],  [0, 250, -135]);

    let portaMat = material.clone();

    function getPortal(pos, scale) {
        let portalMesh = new THREE.Mesh(boxGeometry, portaMat);
        portalMesh.position.copy(new THREE.Vector3(...pos));
        portalMesh.scale.copy(new THREE.Vector3(...scale));
        scene.add(portalMesh);
    }

    getPortal([-10, 150, -135], [5, 20, 5]);
    getPortal([10, 150, -135], [5, 20, 5]);
    getPortal([0, 140, -135], [25, 5, 5]);
    getPortal([0, 160, -135], [25, 5, 5]);
    getPortal([0, 70, -135], [5, 140, 5]);

    let horses = [];
    let buffGeom = null;
    function Horse(scene, position) {


        let mat = material.clone();
        // mat.wireframe = true;
        mat.color = new THREE.Color(tinycolor(`hsl(${Math.floor(Math.random() * 360 )}, 90%, 75%)`).toHexString());
        let horse = new THREE.Mesh(buffGeom, mat);
        horse.scale.multiplyScalar(0.1); // 25 sphere
        horse.name = horses.length;


        let body = world.add({
            type: 'sphere',
            size: [3],
            pos: position || [0, 100, 0],
            move: true,
            world
        });
        scene.add(horse);
        this.update = function() {
            if (!body.sleeping) {
                horse.position.copy(body.getPosition());
                horse.quaternion.copy(body.getQuaternion());

            }
            if (horse.position.y < -500) {
                body.resetPosition(0, 100, 0);
            }
        };

        this.impulse = (pos) => {

            body.applyImpulse(pos,
                new THREE.Vector3()
            .subVectors(camera.position, horse.position)
            .normalize()
            .multiplyScalar(Math.random() + 0.1)
            .normalize()
            .multiplyScalar(10000))
        
        };
        this.select = function() {
            this.impulse(horse.position)
            const newHorse = new Horse(scene, [horse.position.x, horse.position.y, horse.position.z]);
            newHorse.impulse(horse.position);
            horses = [...horses, newHorse];
        };
        this.mesh = () => horse;
    }
    loader.load('data/horse.json', (geom) => {
        buffGeom = new THREE.BufferGeometry().fromGeometry(geom);
        horses = [new Horse(scene)];
    })


    const MAX_POINTS = 500;

    let fenceGeometry = new THREE.BufferGeometry();
    let positions =new Float32Array(MAX_POINTS * 3);
    let fenceMateial = new THREE.LineBasicMaterial({ color: '#000', linewidth: 10 });
    let fenceMesh = new THREE.Line(fenceGeometry, fenceMateial);
    fenceGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

    scene.add(fenceMesh);

    let fenceGeometryA = new THREE.BufferGeometry();
    let positionsA =new Float32Array(MAX_POINTS * 3);
    let fenceMateialA = new THREE.LineBasicMaterial({ color: '#000', linewidth: 10 });
    let fenceMeshA = new THREE.Line(fenceGeometryA, fenceMateialA);
    fenceGeometryA.addAttribute('position', new THREE.BufferAttribute(positionsA, 3));
    scene.add(fenceMeshA);

    let count = 0;
    let countA = 0;

    let posX = 0;
    let posY = 0;
    let posZ = 0;



    function onClick() {
        let x = posX;
        let y = posY;
        let z = posZ;
        let fence = fenceMesh.geometry.attributes.position.array;
        fence[count++] = x;
        fence[count++] = y + 0.75 * 10;
        fence[count++] = z;
        fenceMesh.geometry.attributes.position.needsUpdate = true;

        let fenceA = fenceMeshA.geometry.attributes.position.array;
        fenceA[countA++] = x;
        fenceA[countA++] = y + 0.25 * 10;
        fenceA[countA++] = z;
        fenceMeshA.geometry.attributes.position.needsUpdate = true;

        if (count >= MAX_POINTS * 3) {
            count = 0;
        }
        if (countA >= MAX_POINTS * 3) {
            countA = 0;
        }
        let pol = pole.clone();
        pol.position.copy(new THREE.Vector3(x, y + 0.5 * 10, z));
        scene.add(pol);

        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(horses.map(horse => horse.mesh()));
        if (intersects.length > 0) {
            intersects.forEach(({ object }) => {
                const selected = horses.find((horse) => horse.mesh().name === object.name);
                if (selected) selected.select();
            });
        }
    }



    function animate() {
        requestAnimationFrame(animate);
        world.step();
        horses.forEach((horse) => {
            horse.update();
        });

        raycaster.setFromCamera(mouse, camera);

        let intersects = raycaster.intersectObjects([ terrain ]);

        if (intersects.length > 0) {
            const { x, y, z } = intersects[0].point;
            posX = x;
            posY = y;
            posZ = z;
            pole.position.copy(
                new THREE.Vector3(x, y + 0.5 * 10, z)
            );
        }

        renderer.render( scene, camera );
        controls.update(clock.getDelta());
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);
    animate();
}


const _date = new Date();
const _day = _date.getDay();
const _time = _date.getHours();
const _minutes = _date.getMinutes();
const scavallamento = parseFloat(_day) > 3
|| parseFloat(_day) === 3 && parseFloat(_time) === 14 && parseFloat(_minutes) >= 30
|| parseFloat(_day) === 3 && parseFloat(_time) > 15;

if (scavallamento) {
    getHorses();
} else {
    const videos = [
        'bAojxWZRVKk',
        '3eevUjhIlfM',
        'wTAKjBONjJ0',
        'UcaUbmAlUNA'
    ];
    
    const video = videos[Math.floor(Math.random() * videos.length)];
    
    const iframe = createElement('iframe', {
        src: `https://www.youtube.com/embed/${video}?autoplay=1&loop=1&playlist=${video}`,
        frameborder: 0,
        allow: 'autoplay'
    }, {
        position: 'absolute',
        width: '100%',
        height: '100%'
    });
    
    document.body.appendChild(iframe);
    
    document.body.onclick = () => {
        iframe.src = `https://www.youtube.com/embed/${video}?autoplay=1&loop=1&playlist=${video}`;
    };
}

const dates = [
    'Aug 3',
    'Aug 10',
    'Aug 19',
    'Nov 1',
    'Dec 21',
    'Dec 25'
];

const query = window.location.search && decodeURI(window.location.search.substring(1, window.location.search.length));
let array = ['verde', 7, query];

try {
    const store = JSON.parse(localStorage.getItem('__orologio~values__'));
    array = [...array, ...store.array]
} catch(e) {
    //
}

if (query) {
    localStorage.setItem('__orologio~values__', JSON.stringify({array}));
}

const name = query || array[Math.floor(Math.random() * array.length)] || '7';

const style = createElement('style');
style.innerHTML = require('./css/style.css').toString();
document.head.appendChild(style);

const canvas = createElement('canvas',
{class: 'canvas', width: window.innerWidth, height: window.innerHeight},
{width: window.innerWidth + 'px', height: window.innerHeight + 'px'});
window.onresize = () => {
    updateElement(canvas, {width: window.innerWidth, height: window.innerHeight},
    {width: window.innerWidth + 'px', height: window.innerHeight + 'px'});
};
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

const container = createElement('div', {class: 'container'});
document.body.appendChild(container);
let cnt = 0;
container.onmousemove = (event) => {
    ctx.font = '65px serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign =  'center';
    ctx.fillText(name, event.clientX, event.clientY);

    ctx.font = '64px serif';
    const color = Math.floor(Math.abs(Math.sin(cnt)) * 360);
    ctx.fillStyle = 'hsl(' + color + ', 100%, 75%)';
    ctx.textAlign =  'center';
    ctx.fillText(name, event.clientX, event.clientY);
    cnt += 0.01;
};

const timer = createElement('div', {class: 'timer'});
container.appendChild(timer);

const timerDate = createElement('div', {class: 'timer-date'});
timer.appendChild(timerDate);

const timerFriday = createElement('div', {class: 'timer-friday'});
timer.appendChild(timerFriday);

const today = new Date();
const tday = today.getTime();
const year = today.getFullYear();
const filteredDate = dates.map(d => ({date: new Date(`${d}, ${year} 18:30:00`), value: d}))
    .filter(current => current.date.getTime() - tday > 0)

const date = filteredDate.length === 0 && {date: new Date(`${dates[0]}, ${year} 18:30:00`), value: dates[0]}
|| filteredDate.length === 1 && filteredDate[0]
|| filteredDate.reduce((previous, current) => Math.abs(current.date.getTime() - tday) < Math.abs(previous.date.getTime() - tday) ? current : previous);
const end = date.date.getTime();
today.setHours(18, 30);
const friday = today.setDate(today.getDate() + (5 + 7 - today.getDay()) % 7);

const getCount = target => {
    const now =  new Date().getTime();
    const distance = target - now;
    const day = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const mseconds = distance;
    return mseconds > 0 ? `${day ? day + 'd' : ''} ${hours ? hours + 'h' : ''} ${minutes ? minutes + 'm' : ''} ${seconds ? seconds + 's' : ''} ${mseconds ? mseconds + 'ms' : ''}` : '';
};

setInterval(() => {
    timerDate.innerHTML = '<b>' + date.value + '</b><br/>' + getCount(end);
    timerFriday.innerHTML = 'Next Friday<br/>' + getCount(friday);
});
