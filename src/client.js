/* copyright 2018, stefano bovio @allyoucanmap. */

import {createElement, updateElement} from './utils/DOMUtils';

const dates = [
    'Aug 3',
    'Aug 10',
    'Nov 1',
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

const videos = [
    'bAojxWZRVKk',
    '3eevUjhIlfM',
    'wTAKjBONjJ0'
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
