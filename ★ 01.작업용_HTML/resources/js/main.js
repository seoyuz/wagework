//main

document.addEventListener('DOMContentLoaded', () => {

    // visual swiper
    const visSwiper = new Swiper('.visual-swiper', {
        slidesPerView: 1,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        // direction: 'vertical',
        simulateTouch: false, // touch 방지
        speed: 1500,
        effect:"fade",
        parallax : true,
        fadeEffect: {
            crossFade: true
        },
        mousewheel: false,
        // parallax: true,
        // loop: true, // 무한 반복
        observer: true,	// 추가
        observeParents: true,	// 추가
        grabCursor: true,
        paginationClickable: true,
        pagination: {
            el: '.visual .visual-pagination',
            // type: 'fraction',
            clickable: true,
            renderBullet: function (index, className) {
                const active = index + 1;
                return '<button type="button" class="' + className + '">' + active + '번째 슬라이드</button>';
            },
        },
        navigation: { // 네비게이션 설정
            nextEl: '.visual-wrap .swiper-button-next', // 다음 버튼 클래스명
            prevEl: '.visual-wrap .swiper-button-prev', // 이번 버튼 클래스명
        },
        a11y: {
            prevSlideMessage: '이전 슬라이드',
            nextSlideMessage: '다음 슬라이드',
            slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.',
        },
        slideToClickedSlide: false, // 클릭 시 이동
        allowTouchMove: true,
        touchEventsTarget: 'wrapper',
        watchSlidesProgress: true, //현재 보이는 슬라이드
        on: {
            init: function() {
                resetTabindex();
            },
            activeIndexChange: function () {
                resetTabindex();
            }
        }
    });
    // 재생 정지
    document.querySelector(".control-button.pause").addEventListener("click", function() {
        document.querySelector(".control-button.pause").style.display = "none";
        document.querySelector(".control-button.play").style.display = "block";
        visSwiper.autoplay.stop();
    });

    document.querySelector(".control-button.play").addEventListener("click", function() {
        document.querySelector(".control-button.play").style.display = "none";
        document.querySelector(".control-button.pause").style.display = "block";
        visSwiper.autoplay.start();
    });
    // 웹접근성
    function resetTabindex() {
        const slides = document.querySelectorAll(".visual-swiper .swiper-slide");
        const activeSlide = document.querySelector(".visual-swiper .swiper-slide-active");

        // 슬라이드가 존재하지 않으면 실행 중단
        if (!slides || slides.length === 0) {
            return;
        }

        // 모든 슬라이드의 링크에서 tabindex를 -1로 설정
        slides.forEach(slide => {
            const link = slide.querySelector('a');
            if (link) link.setAttribute('tabindex', '-1');
        });

        // 활성 슬라이드의 링크 tabindex를 0으로 설정
        if (activeSlide) {
            const activeLink = activeSlide.querySelector('a');
            if (activeLink) activeLink.setAttribute('tabindex', '0');
        }
    }



    // 카드뉴스
    const cardnewsSlide = new Swiper(document.querySelector('.cardnews-swiper'), {
        // loop: true,
        // autoplay:{
        //     delay: 3500,
        // },
        slidesPerView: 2,
        spaceBetween: 20,
        navigation : {
            prevEl: '.cardnews-swiper-wrap .swiper-prev',
            nextEl: '.cardnews-swiper-wrap .swiper-next',
        },
        pagination: {
            el: ".cardnews-swiper-wrap .swiper-pagination",
            type: "fraction",
        },
        watchSlidesProgress: true, // 250320 (ej)
        on: {
            init: function() { // 250320 (ej)
            	setTimeout(() => {
					cardnewsSwiperReset();
				}, 1000);
            },
            activeIndexChange: function () {
                cardnewsSwiperReset();
            }
        },
        breakpoints: {
            390: {
            slidesPerView: 2,
            spaceBetween: 14,
            },
            500: {
            slidesPerView: 3,
            spaceBetween: 14,
            },
            768: {
            slidesPerView: 4,
            spaceBetween: 14,
            },
            1084: {
            slidesPerView: 2,
            spaceBetween: 14,
            },
            1200: {
            slidesPerView: 2,
            spaceBetween: 20,
            }
        }
    });
    // const autoplayCardnew = document.querySelector('.cardnews-swiper-wrap .swiper-btn');
    // autoplayCardnew.addEventListener('click', function (){
    //     let isOn = autoplayCardnew.classList.contains('active')

    //     if(isOn == true){
    //         cardnewsSlide.autoplay.start();
    //         autoplayCardnew.classList.remove('active');
    //         autoplayCardnew.innerHTML = "<i class='blind'>슬라이드 정지</i>";
    //     }else{
    //         cardnewsSlide.autoplay.stop();
    //         autoplayCardnew.classList.add('active')
    //         autoplayCardnew.innerHTML = "<i class='blind'>슬라이드 재생</i>";
    //     }
    // });

    // 웹 접근성: 슬라이드 포커스 관리
    function cardnewsSwiperReset() {
        document.querySelectorAll(".cardnews-swiper-wrap .swiper-slide a").forEach(link => {
            link.setAttribute('tabindex', '-1');
        });
        document.querySelectorAll(".cardnews-swiper-wrap .swiper-slide-visible a").forEach(link => {
            link.setAttribute('tabindex', '0');
        });
    }

    // 251001 품질개선 (yz)
    // 메인화면 진입시 스와이퍼 버튼에 swiper-button-disabled 클래스 제거
    // disabled 속성 제거
    // aria-disabled 속성 false로 변경
    // tabindex 속성 0으로 변경

    // 진입 시 버튼 상태 리셋 -> if문으로 체크하는 방식으로 변경
    const cardnewsPrevBtn = document.querySelector('.cardnews-swiper-wrap .swiper-prev');
    const cardnewsNextBtn = document.querySelector('.cardnews-swiper-wrap .swiper-next');
    
    


    // 관련사이트
    const siteSlide = new Swiper(document.querySelector('.site .swiper-container'), {
        loop: true,
        slidesPerView: 2.2,
        spaceBetween: 18,
        navigation : {
            prevEl: '.site .swiper--prev',
            nextEl: '.site .swiper--next',
        },
        watchSlidesProgress: true, //현재 보이는 슬라이드
        on: {
            init: function() {
                siteSlideTabindex();
            },
            activeIndexChange: function () {
                siteSlideTabindex();
            }
        },
        breakpoints: {
            390: {
            slidesPerView: 2.2,
            spaceBetween: 18,
            },
            768: {
            slidesPerView: 2.2,
            spaceBetween: 18,
            },
            1200: {
            slidesPerView: 6,
            spaceBetween: 20,
            }
        }
    });

    // 웹접근성
    function siteSlideTabindex() {
        // 모든 슬라이드의 링크에서 tabindex를 -1로 초기화
        document.querySelectorAll(".site-slide .swiper-slide a").forEach(link => {
            link.setAttribute('tabindex', '-1');
        });
        document.querySelectorAll(".site-slide .swiper-slide-visible a").forEach(link => {
            link.setAttribute('tabindex', '0');
        });
    }



    // 알림마당 탭
    const tabs = document.querySelectorAll(".board-tab-btn");
    const lists = document.querySelectorAll(".board-list");

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => {
                t.classList.remove("active");
                t.removeAttribute("title");
            });
            tab.classList.add("active");
            tab.setAttribute("title", "선택됨");

            lists.forEach(list => list.classList.remove("active"));
            if (lists[index]) {
                lists[index].classList.add("active");
            }
        });
    });

    // 초기 상태 (첫번째 탭 및 리스트 활성화)
    if (tabs.length > 0 && lists.length > 0) {
        tabs[0].classList.add("active");
        tabs[0].setAttribute("title", "선택됨");
        lists[0].classList.add("active");
    }





    /* [ tweenMax ] s */
    // var controller = new ScrollMagic.Controller();
    // var tween = TweenMax.to("#container", 0.5, {
    //     backgroundColor: "#eef5f9",
    // })
    // var scene = new ScrollMagic.Scene({
    //     triggerElement: ".section05"
    // })
    // .setTween(tween)
    // .addTo(controller)
    // .addIndicators({
    //     name: "1"
    // });

// tweenMax e

});