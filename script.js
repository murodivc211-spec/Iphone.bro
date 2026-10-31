(function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* цвета оформления */
    var THEMES = [
        ["Синий", "#7aa7ff", "#c7a6ff", "#1c2a55", "#2a1d4d"],
        ["Фиолетовый", "#b794ff", "#ff8fd8", "#2d1b55", "#4a1d4d"],
        ["Зелёный", "#5ef0b4", "#7aa7ff", "#103a33", "#1b2a55"],
        ["Оранжевый", "#ffb067", "#ff6b81", "#4a2a14", "#4d1d2e"],
        ["Красный", "#ff6b7a", "#ffb067", "#4d1520", "#3a1d14"]
    ];
    var root = document.documentElement;
    var box = document.getElementById("sw");

    function setTheme(i) {
        var t = THEMES[i];
        root.style.setProperty("--acc", t[1]);
        root.style.setProperty("--acc2", t[2]);
        root.style.setProperty("--g1", t[3]);
        root.style.setProperty("--g2", t[4]);
        box.querySelectorAll("button").forEach(function (b, k) {
            b.setAttribute("aria-pressed", k === i);
        });
    }
    THEMES.forEach(function (t, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "dot";
        b.style.background = "linear-gradient(135deg," + t[1] + "," + t[2] + ")";
        b.setAttribute("aria-label", t[0]);
        b.title = t[0];
        b.onclick = function () { setTheme(i); };
        box.appendChild(b);
    });
    setTheme(0);

    /* счётчики */
    function count(el) {
        var target = +el.dataset.count;
        if (reduce) { el.textContent = target; return; }
        var start = null, dur = 1300;
        function step(ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var e = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * e);
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    /* появление при прокрутке */
    var items = document.querySelectorAll(".rv");
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                en.target.classList.add("in");
                en.target.querySelectorAll("[data-count]").forEach(count);
                io.unobserve(en.target);
            });
        }, { threshold: 0.15 });
        items.forEach(function (el) { io.observe(el); });
    } else {
        items.forEach(function (el) {
            el.classList.add("in");
            el.querySelectorAll("[data-count]").forEach(count);
        });
    }

    /* наклон телефона за пальцем или мышью */
    var stage = document.getElementById("stage");
    var phone = document.getElementById("phone");
    if (stage && phone && !reduce) {
        function tilt(e) {
            var r = stage.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            phone.style.transform = "rotateY(" + (x * 30) + "deg) rotateX(" + (-y * 26) + "deg)";
        }
        function reset() { phone.style.transform = ""; }
        stage.addEventListener("pointermove", tilt);
        stage.addEventListener("pointerleave", reset);
        stage.addEventListener("pointerup", reset);
    }
})();