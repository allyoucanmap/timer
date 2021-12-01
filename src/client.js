/* copyright 2018, stefano bovio @allyoucanmap. */

(function() {
    function pad(value, size) {
        var zeros = '';
        for (var i = 0; i < size - (value + '').length; i++) {
            zeros += '0';
        }
        return zeros + value;
    }
    
    function getDatePart(value, uom, size) {
        return value !== undefined
            ? pad(value, size) + uom
            : '';
    }
    
    function getCountdown(now, target, daySize) {
        const distance = target - now;
        const day = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const mseconds = distance;
        return mseconds > 0
            ? getDatePart(day, 'd', daySize) + ' ' +
            getDatePart(hours, 'h', 2) + ' ' +
            getDatePart(minutes, 'm', 2) + ' ' +
            getDatePart(seconds, '', 2)
            : '';
    }

    function getPathData(coordinates, close) {
        var d = '';
        for (var idx = 0; idx < coordinates.length; idx++) {
            const coord = coordinates[idx];
            d += (idx === 0 && 'M' + coord[0] + ' ' + coord[1]
                || idx === coordinates.length - 1 && ' L' + coord[0] + ' ' + coord[1] + (close ? 'Z' : '')
                || ' L' + coord[0] + ' ' + coord[1]);
        }
        return d;
    }

    function getTargetDate(date, year) {
        const now = new Date().getTime();
        const targetDate = new Date(date + ', ' + year + ' 18:30:00');
        return now > targetDate.getTime()
            ? new Date(date + ', ' + (year + 1) + ' 18:30:00')
            : targetDate
    }

    const videos = [
        'bAojxWZRVKk',
        '3eevUjhIlfM',
        'wTAKjBONjJ0',
        'UcaUbmAlUNA',
        'JJVwPM26n9s'
    ];
    
    var video = videos[Math.floor(Math.random() * videos.length)];
    const iframe = document.createElement('iframe');
    
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('allow', 'autoplay');
    iframe.style.position = 'absolute';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    document.body.appendChild(iframe);

    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.top = 0;
    div.style.left = 0;
    div.style.background = '#222222';

    document.body.appendChild(div);

    var toggle = false;

    document.body.onclick = function() {
        toggle = !toggle;
        if (toggle) {
            div.style.opacity = 0.9;
            video = videos[Math.floor(Math.random() * videos.length)];
            iframe.setAttribute('src', 'https://www.youtube.com/embed/' + video + '?autoplay=1&loop=1&playlist=' + video);
        } else {
            div.style.opacity = 1;
            iframe.setAttribute('src', '');
        }
    };

    const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    
    const query = window.location.search && decodeURI(window.location.search.substring(1, window.location.search.length));
    const date = query || 'December 24';
    const today = new Date();
    const year = today.getFullYear();
    const friday = new Date(today.setDate(today.getDate() + (5 + 7 - today.getDay()) % 7)).setHours(18, 30, 00);
    const targetDate = getTargetDate(date, year);
    const end = targetDate.getTime();
    
    const width = 1920;
    const height = 1080;
    const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
    document.body.appendChild(svg);
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

    document.body.style.background = '#222222';

    function CountdownChar(x, y, size) {
        const g = document.createElementNS(SVG_NAMESPACE, 'g');
        svg.appendChild(g);
        g.setAttribute('transform', 'translate(' + x +', ' + y +')')

        const path = document.createElementNS(SVG_NAMESPACE, 'path');
        g.appendChild(path);
        const border = size / 8;
        const topL = getPathData([[border, border], [size/2, border], [size/2, border * 2], [border * 2, border * 2]], true);
        const topR = getPathData([[size / 2, border], [size - border, border], [size - border * 2, border * 2], [size / 2, border * 2]], true);
        const top = topL + topR;
        const leftTop = getPathData([[border, border], [border * 2, border * 2], [border * 2, size - border / 2], [border * 1.5, size], [border, size - border / 2] ], true);
        const rightTop = getPathData([[size - border, border], [size - border * 2, border * 2], [size - border * 2, size - border / 2], [size - border * 1.5, size], [size - border, size - border / 2] ], true);
        const centerL = getPathData([[border * 1.5, size], [border * 2, size - border / 2], [size / 2, size - border / 2], [size / 2, size + border / 2], [border * 2, size + border / 2]], true);
        const centerR = getPathData([[size / 2, size - border / 2], [size - border * 2, size - border / 2], [size - border * 1.5, size], [size - border * 2, size + border / 2], [size / 2, size + border / 2]], true);
        const center = centerL + centerR;
        const bottomL = getPathData([[border, size * 2 - border], [size/2, size * 2 - border], [size/2, size * 2 - border * 2], [border * 2, size * 2 - border * 2]], true);
        const bottomR = getPathData([[size/2, size * 2 - border], [size - border, size * 2 - border], [size - border * 2, size * 2 - border * 2], [size/2, size * 2 - border * 2]], true);
        const bottom = bottomL + bottomR;
        const leftBottom = getPathData([[border, size * 2 - border], [border * 2, size * 2 - border * 2], [border * 2, size + border / 2], [border * 1.5, size], [border, size + border / 2] ], true);
        const rightBottom = getPathData([[size - border, size * 2 - border], [size - border * 2, size * 2 - border * 2], [size - border * 2, size + border / 2], [size - border * 1.5, size], [size - border, size + border / 2] ], true);
        const middleTop = getPathData([[size / 2 - border / 2, border * 2], [size / 2 + border / 2, border * 2], [size / 2 + border / 2, size - border / 2], [size / 2 - border / 2, size - border / 2]], true);
        const middleBottom = getPathData([[size / 2 - border / 2, size + border / 2], [size / 2 + border / 2, size + border / 2], [size / 2 + border / 2, size * 2 - border * 2], [size / 2 - border / 2, size * 2 - border * 2]], true);
        const middle = middleTop + middleBottom;
        const crossBorder = border / Math.sin(Math.PI / 6);
        const crossTL = getPathData([[border * 2, border * 2], [border * 2, border * 2 + crossBorder], [size / 2 - border / 2, size - border / 2], [size / 2 - border / 2, size - border / 2 - crossBorder]], true);
        const crossTR = getPathData([[size - border * 2, border * 2], [size - border * 2, border * 2 + crossBorder], [size / 2 + border / 2, size - border / 2], [size / 2 + border / 2, size - border / 2 - crossBorder]], true);
        const crossBL = getPathData([[border * 2, size * 2 - border * 2], [border * 2, size * 2 - border * 2 - crossBorder], [size / 2 - border / 2, size + border / 2], [size / 2 - border / 2, size + border / 2 + crossBorder]], true);
        const crossBR = getPathData([[size - border * 2, size * 2 - border * 2], [size - border * 2, size * 2 - border * 2 - crossBorder], [size / 2 + border / 2, size + border / 2], [size / 2 + border / 2, size + border / 2 + crossBorder]], true);
        const cross = crossTL + crossTR + crossBL + crossBR;
        path.setAttribute('d', top + leftTop + rightTop + center + bottom + leftBottom + rightBottom + middle + cross);
        path.setAttribute('fill', '#333333');
        path.setAttribute('stroke', '#444444');
        path.setAttribute('stroke-width', 2);

        const chars = {
            '0': top + rightTop + rightBottom + bottom + leftBottom + leftTop,
            '1': rightTop + rightBottom,
            '2': top + rightTop + center + leftBottom + bottom,
            '3': top + rightTop + center + rightBottom + bottom,
            '4': leftTop + rightTop + center + rightBottom,
            '5': top + leftTop + center + rightBottom + bottom,
            '6': top + leftTop + center + leftBottom + rightBottom + bottom,
            '7': top + rightTop + rightBottom,
            '8': top + rightTop + rightBottom + bottom + leftBottom + leftTop + center,
            '9': top + rightTop + rightBottom + bottom + leftTop + center,
            'd': rightTop + center + leftBottom + rightBottom + bottom,
            'h': leftTop + center + leftBottom + rightBottom + rightTop,
            '-': center,
            'f': top + leftTop + center + leftBottom,
            'r': center + top + leftTop + rightTop + leftBottom + crossBR,
            'i': middle,
            'a': leftBottom + center + rightBottom + leftTop + rightTop + top,
            'y': crossTL + crossTR + middleBottom,
            'm': leftTop + leftBottom + rightTop + rightBottom + crossTL + crossTR,
            's': top + crossTL + crossBR + bottom
        };

        const text = document.createElementNS(SVG_NAMESPACE, 'path');
        g.appendChild(text);
        
        text.setAttribute('fill', '#fcc64c');
        text.setAttribute('stroke', '#a71423');
        text.setAttribute('stroke-width', 2);
        text.style.filter = 'url(#glow)';

        this.update = function(value) {
            text.setAttribute('d', chars[value] || '')
        }
    }

    var now = new Date().getTime();
    var countdownDate = getCountdown(now, end, 3);
    var countdownFriday = getCountdown(now, friday, 2);

    const size = width / (countdownDate.length + 2);

    var countdownDateNumbers = [];
    for (var i = 0; i < countdownDate.length; i++) {
        countdownDateNumbers.push(new CountdownChar(size + i * size, size * 2, size));
    }

    var dateText = targetDate.getDate() + '-' + (targetDate.getMonth() + 1) + '-' + targetDate.getFullYear();

    for (var i = 0; i < dateText.length; i++) {
        const currentCharText = dateText[i];
        const countdownChar = new CountdownChar(size + i * size / 2, size, size / 2);
        countdownChar.update(currentCharText);
    }

    var countdownFridayNumbers = [];
    for (var i = 0; i < countdownFriday.length; i++) {
        countdownFridayNumbers.push(new CountdownChar(size * 2 + i * size, size * 6, size));
    }

    var fridayText = 'friday';
    for (var i = 0; i < fridayText.length; i++) {
        const currentCharText = fridayText[i];
        const countdownChar = new CountdownChar(size * 2 + i * size / 2, size * 5, size / 2);
        countdownChar.update(currentCharText);
    }


    function animate() {
        setTimeout(function() {
            requestAnimationFrame(animate);
        }, 1000);
        now = new Date().getTime();
        countdownFriday = getCountdown(now, friday, 2);
        countdownDate = getCountdown(now, end, 3);
        for (var i = 0; i < countdownDate.length; i++) {
            countdownDateNumbers[i].update(countdownDate[i]);
        }
        for (var i = 0; i < countdownFriday.length; i++) {
            countdownFridayNumbers[i].update(countdownFriday[i]);
        }
    }
    animate();
})();
