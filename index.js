// 面向对象版
(function (window) {

    function Course(options) {
        this.init(options);
    }

    Course.prototype = {
        init: function (options) {
            this.createPoints(options);
            var warp = options.warp;
            var list = options.list;
            if (list.length == 2) {
                for (var i = 0; i < 2; i++) {
                    warp.appendChild(list[i].cloneNode(true));
                }
            }
            this.setSize(options);
            this.center = 0;
            this.right = 1;
            this.left = list.length - 1;
            this.setTranslateX(options, 0);
            this.autoPlay(options);
            this.touch(options);
        },
        createPoints: function (options) {
            var list = options.list;
            var point = options.point;
            for (var i = 0; i < list.length; i++) {
                var li = document.createElement("li");
                if (i == 0) {
                    li.classList.add("current");
                }
                point.appendChild(li);
            }
        },
        setSize: function (options) {
            var _this = this;
            var warp = options.warp;
            var list = options.list;
            warp.style.height = '102px';
            list[0].querySelector("img").onload = function () {
                warp.style.height = list[0].offsetHeight + 'px';
            };
            this.screenWidth = document.documentElement.offsetWidth;
            window.addEventListener('resize', function () {
                _this.screenWidth = document.documentElement.offsetWidth;
                warp.style.height = list[0].offsetHeight + 'px';
            });
        },
        autoPlay: function (options) {
            var _this = this;
            _this.timer = setInterval(function () {
                _this.nextShow(options);
            }, 1000);
        },
        nextShow: function (options) {
            var list = options.list;
            this.left = this.center;
            this.center = this.right;
            this.right++;
            if (this.right > list.length - 1) {
                this.right = 0;
            }
            this.setTransition(options, true, true, false);
            this.setTranslateX(options, 0);
            this.setPoints(options);
        },
        prevShow: function (options) {
            var list = options.list;
            this.right = this.center;
            this.center = this.left;
            this.left--;
            if (this.left < 0) {
                this.left = list.length - 1;
            }
            this.setTransition(options, false, true, true);
            this.setTranslateX(options, 0);
            this.setPoints(options);
        },
        setPoints: function (options) {
            var list = options.list;
            var point = options.point;
            var points = point.querySelectorAll("li");
            if (list.length == points.length) {
                for (var i = 0; i < list.length; i++) {
                    points[i].classList.remove("current");
                }
                points[this.center].classList.remove("current");
            } else {
                for (var i = 0; i < points.length; i++) {
                    points[i].classList.remove("current");
                }
                if (this.center >= 2) {;
                    points[this.center - 2].classList.add("current");
                } else {
                    points[this.center].classList.add("current");
                }
            }
        },
        setTranslateX: function (options, dx) {

            var list = options.list;

            list[this.left].style.transform = "translateX(" + (-(this.screenWidth) + dx) + "px)";
            list[this.center].style.transform = "translateX(" + dx + "px)";
            list[this.right].style.transform = "translateX(" + (this.screenWidth + dx) + "px)";
        },
        setTransition: function (options, a, b, c) {

            var list = options.list;

            if (a) {
                list[this.left].classList.add("transitionAll");
            } else {
                list[this.left].classList.remove("transitionAll");
            }
            if (b) {
                list[this.center].classList.add("transitionAll");
            } else {
                list[this.center].classList.remove("transitionAll");
            }
            if (c) {
                list[this.right].classList.add("transitionAll")
            } else {
                list[this.right].classList.remove("transitionAll")
            }
        },
        touch: function (options) {

            var _this = this;

            var course = options.course;


            var startX = 0;
            var startTime = 0;
            var dx = 0;

            course.addEventListener("touchstart", function (e) {
                startX = e.touches[0].pageX;
                startTime = new Date();
                clearInterval(_this.timer);
                _this.setTransition(options, false, false, false);
            });

            course.addEventListener("touchmove", function (e) {
                dx = e.touches[0].pageX - startX;
                _this.setTranslateX(options, dx);
            });

            course.addEventListener("touchend", function (e) {
                var t = new Date() - startTime;
                dx = e.changedTouches[0].pageX - startX;
                if (dx < -(this.screenWidth / 3) || (t < 500 && dx < -30)) {
                    _this.nextShow(options);
                } else if (dx > this.screenWidth / 3 || (t < 500 && dx > 30)) {
                    _this.prevShow(options);
                } else {
                    _this.setTransition(options, true, true, true);
                    _this.setTranslateX(options, 0);
                }
                _this.timer = setInterval(function () {
                    _this.nextShow(options);
                }, 1000);
            });
        }
    };

    window.Course = Course;
})(window);