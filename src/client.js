/* copyright 2018, stefano bovio @allyoucanmap. */

import {createElement, updateElement} from './utils/DOMUtils';

const dates = [
    'Aug 15',
    'Nov 1',
    'Dec 25'
];

const name = window.location.search && decodeURI(window.location.search.substring(1, window.location.search.length)) || Math.round(Math.random()) === 1 && 7 || 'verde';

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
    const color = Math.floor(30 + Math.abs(Math.sin(cnt)) * 75);
    ctx.fillStyle = 'rgb(' + color + ', ' + color + ', ' + color + ')';
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
const date = dates.map(d => ({date: new Date(`${d}, ${year} 18:30:00`), value: d}))
    .reduce((previous, current) => current.date.getTime() - tday < previous.date.getTime() - tday ? current : previous);

const end = date.date.getTime();
const friday = today.setDate(today.getDate() + (5 + 7 - today.getDay()) % 7);

const getCount = target => {
    const now =  new Date().getTime();
    const distance = target - now;
    const day = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60 * 60 * 24)) / 1000);
    const mseconds = distance;
    return `${day ? day + ' d' : ''} ${hours ? hours + ' h' : ''} ${minutes ? minutes + ' m' : ''} ${seconds ? seconds + ' s' : ''} ${mseconds ? mseconds + ' ms' : ''}`;
};

setInterval(() => {
    timerDate.innerHTML = '<b>' + date.value + '</b><br/>' + getCount(end);
    timerFriday.innerHTML = 'Next Friday<br/>' + getCount(friday);
});
