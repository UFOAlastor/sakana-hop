const htmlEl = document.documentElement;

let device = String(navigator.userAgent.match(/steam|macos/i)).toLowerCase();

if (
    /iPhone|iPad|iPod/i.test(navigator.userAgent)
    ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
) device = 'ios';

htmlEl.setAttribute('data-device', device)

const sticky = 0.1;
let inertia = 0.04;
const maxR = 60;
const maxY = 110;
const minY = -maxY;

const el = document.querySelector('.main');
const boxEl = document.querySelector('.single-box');

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
    set: (searchParams, prop, value) => {
        searchParams.set(prop, value);
        window.history.replaceState(null, null, `?${searchParams.toString()}`);
        return true;
    }
});

// 自定义惯性
if (params.inertia) {
    inertia = +params.inertia;
}

const Values = {
    chisato: {
        r: 1, // 角度
        y: 40, // 高度
        t: 0, // 垂直速度
        w: 0, // 横向速度
        d: 0.99 // 衰减
    },
    takina: {
        r: 12, // 角度
        y: 2, // 高度
        t: 0, // 垂直速度
        w: 0, // 横向速度
        d: 0.988 // 衰减
    }
};


// 自定义衰减
if (params.decay) {
    let decay = +params.decay;
    for (let key in Values) {
        Values[key].d = decay;
    }
}


const voiceButton = document.querySelector('.set-voice');

const Voices = {
    chisato: new Audio('./model/chinanago.mp3'),
    takina: new Audio('./model/sakana.mp3'),

    isMute: true
};
voiceButton.setAttribute(
    'data-active',
    Voices.isMute
);
Voices.takina.volume = Voices.chisato.volume = 0.8;
Voices.takina.muted = Voices.chisato.muted = true;

const toggleVoiceMute = () => {
    Voices.isMute = voiceButton.getAttribute('data-active') !== 'true';
    voiceButton.setAttribute(
        'data-active',
        Voices.isMute
    );
    Voices.takina.muted = Voices.chisato.muted = Voices.isMute;
};


let running = true;

const deepCopy = v => typeof window.structuredClone === 'function'
    ? window.structuredClone(v)
    : JSON.parse(JSON.stringify(v));

el.classList.add(params.v);
let v = deepCopy(Values[params.v] || Values['takina']);

let width;
let height;


const canvas = document.querySelector('canvas');
// 把摇摇乐的杠子去掉了，位置比较难调，留着太麻烦了
// const ctx = canvas.getContext('2d');

const resize = _ => {
    const { offsetWidth, offsetHeight } = htmlEl;
    width = Math.min(offsetWidth, 800);
    height = 800;

    canvas.width = width;
    canvas.height = height;

    const scalc = offsetWidth / offsetHeight;

    const isSuperVertical = scalc < 0.5757;

    htmlEl.setAttribute('data-is-super-vertical', isSuperVertical);
};

resize();

const rotatePoint = (cx, cy, x, y, angle) => {
    const radians = (Math.PI / 180) * angle;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return {
        x: nx,
        y: ny
    };
}


const draw = _ => {
    let { r, y } = v;
    const x = r * 1;
    el.style.transform = `rotate(${r}deg) translateX(${x}px) translateY(${y}px)`;

    return;
};
const loadImage = (src, onOver) => {
    const el = new Image();
    el.onload = _ => onOver(el);
    el.src = src;
};
let sakanaImageEl;
const init = onOver => {
    onOver();
}
let or = 0;
const cut = 0.1;
const run = _ => {
    if (!running) return;

    let { r, y, t, w, d } = v;

    w = w - r * 2 - or;
    r = r + w * inertia * 1.2;
    v.w = w * d;
    v.r = r;

    t = t - y * 2;
    y = y + t * inertia * 2;
    v.t = t * d;
    v.y = y;

    // 小于一定动作时停止重绘 #20
    if (
        Math.max(
            Math.abs(v.w),
            Math.abs(v.r),
            Math.abs(v.t),
            Math.abs(v.y),
        ) < cut) return running = false;

    requestAnimationFrame(run);
    draw();
};


init(_ => {
    requestAnimationFrame(run);
});
const move = (x, y) => {
    let r = x * sticky;

    r = Math.max(-maxR, r);
    r = Math.min(maxR, r);

    y = y * sticky * 2;

    y = Math.max(minY, y);
    y = Math.min(maxY, y);

    v.r = r;
    v.y = y;
    v.w = 0;
    v.t = 0;
    draw();
}
el.onmousedown = e => {
    e.preventDefault();
    running = false;
    const { pageX, pageY } = e;
    const _downPageX = pageX;
    const _downPageY = pageY;

    // 确保通过用户触发事件获得 audio 播放授权
    Voices.takina.muted = Voices.chisato.muted = Voices.isMute;

    document.onmouseup = e => {
        e.preventDefault();
        document.onmousemove = null;
        document.onmouseup = null;

        running = true;
        playVoice();
        run();
    };
    document.onmousemove = e => {
        const rect = boxEl.getBoundingClientRect();

        const leftCenter = rect.left + rect.width / 2;
        const topCenter = rect.top;

        const { pageX, pageY } = e;

        let x = pageX - leftCenter;
        let y = pageY - _downPageY;
        move(x, y);
    };
};

el.ontouchstart = e => {
    e.preventDefault();
    running = false;
    if (!e.touches[0]) return;

    const { pageX, pageY } = e.touches[0];
    const _downPageX = pageX;
    const _downPageY = pageY;

    // 确保通过用户触发事件获得 audio 播放授权
    Voices.takina.muted = Voices.chisato.muted = Voices.isMute;

    document.ontouchend = e => {
        document.ontouchmove = null;
        document.ontouchend = null;

        running = true;
        playVoice();
        run();
    };
    document.ontouchmove = e => {
        if (!e.touches[0]) return;

        const rect = boxEl.getBoundingClientRect();
        // console.log(rect);
        const leftCenter = rect.left + rect.width / 2;
        const topCenter = rect.top;

        const { pageX, pageY } = e.touches[0];

        let x = pageX - leftCenter;
        let y = pageY - _downPageY;
        move(x, y);
    };
};

const playVoice = () => {
    if (Voices.isMute) return;

    if (el.classList.contains('chisato')) {
        if (
            // 'nice chin~a~na~go~' 经验值
            Math.abs(v.r) <= 4
            && Math.abs(v.y) >= 20
        ) {
            console.log('%cchin~a~na~go~', 'color:#FED;background-color:#C34;padding:2px 4px;');
            Voices.chisato.play();
        };
    } else {
        if (
            // 'nice sakana~' 经验值
            v.r >= Values.takina.r
            && (Math.abs(v.y) <= 12 || v.r >= 3 * Math.abs(v.y))
        ) {
            console.log('%csakana~', 'color:#CCC;background-color:#235;padding:2px 4px;');
            Voices.takina.play();
        };
    };
};

const canOrientation = !!(
    window.DeviceOrientationEvent
    &&
    typeof window.DeviceOrientationEvent['requestPermission'] === 'function'
);

htmlEl.setAttribute('data-can-orientation', canOrientation);

const getOrientationPermission = onOver => {
    if (!canOrientation) return onOver();

    window.DeviceOrientationEvent['requestPermission']().then(permissionState => {
        // console.log({permissionState})
        if (permissionState !== 'granted') return //alert('获取权限失败');

        htmlEl.setAttribute('data-permission-state', true);
        onOver();
    });
};


const onDeviceOrientation = (e) => {
    const { alpha, beta, gamma, acceleration } = e;

    // console.log( { alpha, beta, gamma });

    or = -gamma / 2;
    // or = or * (alpha > 180?-1:1);
    or = Math.min(maxR, or);
    or = Math.max(-maxR, or);
};
const setOrientationListener = _ => {
    getOrientationPermission(_ => {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', onDeviceOrientation);
        };
    });
};

let magicForceTimerHandle = undefined;
let magicForceFlag = false;

const magicForce = _ => {

    // 0.1 probability to Switch Character
    if (Math.random() < 0.1) {
        switchValue();
    } else {
        // Add random velocities in the vertical and horizontal directions
        v.t = v.t + (Math.random() - 0.5) * 150;
        v.w = v.w + (Math.random() - 0.5) * 200;
    }

    if (!running) {
        running = true;
        requestAnimationFrame(run);
    }

    // Set a variable delay between applying magic powers
    magicForceTimerHandle = setTimeout(
        magicForce,
        Math.random() * 3000 + 2000
    );
};
const triggerMagicLinkEl = document.querySelector('.trigger-magic-link');
const triggerMagic = _ => {
    // Flip the status flag
    magicForceFlag = !magicForceFlag;

    htmlEl.setAttribute('data-magic-force', magicForceFlag);
    triggerMagicLinkEl.setAttribute('data-active', magicForceFlag);

    clearTimeout(magicForceTimerHandle);

    // Clear the timer or start a timer based on the new flag
    if (magicForceFlag)
        magicForceTimerHandle = setTimeout(magicForce, Math.random() * 1000 + 500);

};

// setOrientationListener();

const switchValue = _ => {
    el.classList.toggle('chisato');

    if (el.classList.contains('chisato')) {
        v = deepCopy(Values['chisato']);
        params.v = 'chisato';
    } else {
        v = deepCopy(Values['takina']);
        params.v = 'takina';
    }
    if (!running) {
        running = true;
        requestAnimationFrame(run);
    }
}

// document.querySelector('.bed').addEventListener('click', e => {
//     e.preventDefault();

//     switchValue();
// })


window.addEventListener('resize', resize);

// pic size enlarge or reduce
function sizeEnlarge () {
    var aim = document.getElementById("main");
    var ori = parseInt(getComputedStyle(aim).getPropertyValue('width'));
    aim.style['width'] = ori + 20 + "px";
    var ori = parseInt(getComputedStyle(aim).getPropertyValue('height'));
    aim.style['height'] = ori + 20 + "px";
    var aim = document.getElementById("bed");
    var ori = parseInt(getComputedStyle(aim).getPropertyValue('width'));
    aim.style['width'] = ori + 20 + "px";
}

function sizeReduce () {
    var aim = document.getElementById("main");
    var ori = parseInt(getComputedStyle(aim).getPropertyValue('width'));
    aim.style['width'] = ori - 20 + "px";
    var ori = parseInt(getComputedStyle(aim).getPropertyValue('height'));
    aim.style['height'] = ori - 20 + "px";
    var aim = document.getElementById("bed");
    var ori = parseInt(getComputedStyle(aim).getPropertyValue('width'));
    aim.style['width'] = ori - 20 + "px";
}