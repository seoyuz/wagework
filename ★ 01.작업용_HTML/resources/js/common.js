document.addEventListener('DOMContentLoaded', () => {

    // window.addEventListener("resize", function() {
    //     headerDim.style.display = 'none';
    // });

    const mobileDepth1 = document.querySelectorAll('.mobile-gnb .depth1-item > a');
    if(mobileDepth1) {
        mobileDepth1.forEach((link) => {
            if (link.nextElementSibling && link.nextElementSibling.classList.contains('depth2')) {
                link.classList.add('dropdown');
            }
        });
    }

     const mobileGnbBtn = document.querySelector('.mobile-btn');
    const mobileGnb = document.querySelector('.mobile-gnb-wrap');
    let mobileGnbCloseBtn = null;

    mobileGnbBtn.addEventListener('click', function() {
        mobileGnbReset();
        if(mobileGnb.classList.contains('active')){
            mobileGnb.classList.remove('active');
            mobileGnbBtn.querySelector('span').innerText = '전체메뉴';
            mobileGnbBtn.classList.remove('on'); // 닫힐 때 on 클래스 제거
            removeMobileGnbFocusTrap();
            if (mobileGnbCloseBtn) {
                mobileGnbCloseBtn.remove();
                mobileGnbCloseBtn = null;
            }
        } else{
            mobileGnb.classList.add('active');
            mobileGnbBtn.querySelector('span').innerText = '메뉴닫기';
            mobileGnbBtn.classList.add('on'); // 열릴 때 on 클래스 추가
            mobileGnbCloseBtn = document.createElement('button');
            mobileGnbCloseBtn.type = 'button';
            mobileGnbCloseBtn.className = 'mobile-gnb-close';
            mobileGnbCloseBtn.innerText = '메뉴 닫기';
            mobileGnbCloseBtn.setAttribute('aria-label', '메뉴 닫기');
            mobileGnbCloseBtn.addEventListener('click', function() {
                mobileGnb.classList.remove('active');
                mobileGnbBtn.querySelector('span').innerText = '전체메뉴';
                mobileGnbBtn.classList.remove('on'); // 닫힐 때 on 클래스 제거
                removeMobileGnbFocusTrap();
                mobileGnbCloseBtn.remove();
                mobileGnbCloseBtn = null;
                mobileGnbBtn.focus();
            });
            mobileGnb.appendChild(mobileGnbCloseBtn);
            setMobileGnbFocusTrap();
        }
    });

    // 모바일 전체메뉴 웹접근성 개선: 포커스 트랩 및 첫 포커스 이동
    function setMobileGnbFocusTrap() {
        const focusableSelectors = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
        setTimeout(() => {
            const focusableElements = Array.from(mobileGnb.querySelectorAll(focusableSelectors))
                .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

            if (focusableElements.length === 0) return;

            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            function trapFocus(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            }

            // 기존 이벤트 제거 후 재등록(중복 방지)
            if (mobileGnb._trapFocusHandler) {
                mobileGnb.removeEventListener('keydown', mobileGnb._trapFocusHandler);
            }
            mobileGnb.addEventListener('keydown', trapFocus);
            mobileGnb._trapFocusHandler = trapFocus;

            // 첫번째 포커스 요소로 이동 (닫기버튼이 아닌 메뉴 첫 요소)
            firstFocusable.focus();
        }, 200); // 닫기버튼 DOM 추가 후 확실히 실행
    }

    // 포커스 트랩 해제
    function removeMobileGnbFocusTrap() {
        if (mobileGnb._trapFocusHandler) {
            mobileGnb.removeEventListener('keydown', mobileGnb._trapFocusHandler);
            mobileGnb._trapFocusHandler = null;
        }
    }


    const footerSlide = new Swiper(document.querySelector('.footer .swiper-container'), {
        // 기본 사이즈 : 모바일
        slidesPerView: 2.3,
        spaceBetween: 8,
        // loop: true,
        navigation: {
            nextEl: ".footer .swiper-button.next",
            prevEl: ".footer .swiper-button.prev",
        },
        watchSlidesProgress: true, // 250320 (ej)
        on: {
            init: function() { // 250320 (ej)
                footerSwiperReset();
            },
            activeIndexChange: function () {
                footerSwiperReset();
            }
        },
        breakpoints: {
            400: {
                slidesPerView: 2.7,
                spaceBetween: 8,
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 20,
                loop: true,
            },
        }
    });

    // 웹 접근성: 슬라이드 포커스 관리
    function footerSwiperReset() {
        document.querySelectorAll(".site-wrap .swiper-slide a").forEach(link => {
            link.setAttribute('tabindex', '-1');
        });
        document.querySelectorAll(".site-wrap .swiper-slide-visible a").forEach(link => {
            link.setAttribute('tabindex', '0');
        });
    }

    // window.addEventListener(`resize`, function() {
    //     this.document.querySelector('.mobile-gnb-wrap').classList.remove('open');
    //     mobileGnbReset();
    // });

    // 메뉴 초기화 함수
    function mobileGnbReset() {
        mobilegnbDepth1Items.forEach(item => {
            item.classList.remove('active');
            item.title = "메뉴 열기";
        });
        mobilegnbDepth2.forEach(menu => {
            menu.classList.remove('active');
        });
        mobilegnbDepth2Items.forEach(item => {
            item.classList.remove('active');
        });
        mobilegnbDepth3.forEach(menu => {
            menu.classList.remove('active');
        });
    }


    // gnb - pc
    const gnbDepth1Items = document.querySelectorAll('.header-gnb .depth1-item > a');
    const gnbDepth2 = document.querySelectorAll('.header-gnb .depth2');
    const gnbDepth3 = document.querySelectorAll('.header-gnb.depth3');
    const headerDim = document.querySelector(".header .dim");

    window.onresize = function() {
        const width = window.innerWidth;
        if (width >= 769) {
            mobileGnb.classList.remove('active');
            mobileGnbBtn.classList.remove('close');
            mobileGnbBtn.querySelector('span').innerText = '전체메뉴';
        } else {
            resetGnb();
            return;
        }
    };

    // GNB 상태 초기화
    function resetGnb() {
        gnbDepth1Items.forEach(item => item.classList.remove('active'));
        gnbDepth2.forEach(menu => {
            menu.classList.remove('active');
            /*menu.style.display = 'none';*/
            menu.setAttribute('aria-hidden', 'ture');
        });
        headerDim.classList.remove('dim-open');
    }

    // depth1, depth2 이벤트 설정
    gnbDepth1Items.forEach((depth1Item) => {
        const parent = depth1Item.closest('.depth1-item');
        const depth2Menu = parent.querySelector('.depth2');
        const depth3Menu = parent.querySelectorAll('.depth3');
        const depth2Item = parent.querySelector('li');

        // depth2, depth3 활성화 (마우스 오버)
        parent.addEventListener('mouseenter', () => {
            resetGnb();
            // parent.classList.add('active');
            // gnbDepth2.forEach(menu => menu.classList.add('active'));
            if(depth2Menu) {
                depth2Menu.classList.add('active');
               /* depth2Menu.style.display = 'flex';*/
                depth2Menu.setAttribute('aria-hidden', 'false');
                headerDim.classList.add('dim-open');
            }
        });

        // depth2-item
        depth3Menu.forEach((depth3) => {
            const depth2Item = depth3.closest('.depth2-item');
            const link = depth2Item.querySelector('a');
            depth3.addEventListener('mouseenter', () => {
                if (link) {
                    link.classList.add('active');
                }
            });
            depth3.addEventListener('mouseleave', () => {
                if (link) {
                    link.classList.remove('active');
                }
            });

			// 250325 focusout처리 (ej)
            depth3.addEventListener('focusout', () => {
	            setTimeout(() => {
	                if (!document.activeElement.closest('.header-gnb')) {
	                    resetGnb();
	                }
	            }, 0);
			});
        });

		// 250325 focusout처리 (ej)
        if(depth2Menu && depth3Menu.length === 0) {
            depth2Menu.addEventListener('focusout', () => {
	            setTimeout(() => {
	                if (!document.activeElement.closest('.header-gnb')) {
	                    resetGnb();
	                }
	            }, 0);
			});
		}
        // 250325 focusout처리 (ej)
        depth1Item.addEventListener('focusout', () => {
            setTimeout(() => {
                if (!document.activeElement.closest('.header-gnb')) {
                    resetGnb();
                }
            }, 0);
        });

        // depth2, depth3 비활성화 (마우스 아웃)
        parent.addEventListener('mouseleave', () => {
            resetGnb();
        });


        // 탭 포커스 이벤트 (포커스 진입)
        depth1Item.addEventListener('focus', () => {
            resetGnb();
            // parent.classList.add('active');
            // gnbDepth2.forEach(menu => menu.classList.add('active'));
            if(depth2Menu) {
                depth2Menu.classList.add('active');
               /* depth2Menu.style.display = 'flex';*/
                depth2Menu.setAttribute('aria-hidden', 'false');
                headerDim.classList.add('dim-open');
            }
        });

        // 탭 포커스 이벤트 (포커스 나감)
        depth1Item.addEventListener('blur', () => {
            setTimeout(() => {
                if (!document.activeElement.closest('.header-gnb')) {
                    resetGnb();
                }
            }, 0);
        });
    });


    // 메뉴 제외한 부분 클릭 시 GNB 비활성화
    const headerGnb = document.querySelector('.header-gnb');
    document.querySelector('body').addEventListener('click', function (e) {
        if (!headerGnb.contains(e.target)) {
            resetGnb();
        }
    });


    // gnb - mobile
    const mobilegnbDepth1Items = document.querySelectorAll('.mobile-gnb .depth1-item > a');
    const mobilegnbDepth2 = document.querySelectorAll('.mobile-gnb .depth2');
    const mobilegnbDepth2Items = document.querySelectorAll('.mobile-gnb .depth2-item > a');
    const mobilegnbDepth3 = document.querySelectorAll('.mobile-gnb .depth3-wrap');

    // 1 depth
    mobilegnbDepth1Items.forEach((depth1Item, i) => {
        depth1Item.addEventListener('click', () => {
            const nextDepth2Item = depth1Item.nextElementSibling;
            if(nextDepth2Item && nextDepth2Item.classList.contains('depth2')) {
                const isActive = nextDepth2Item.classList.contains('active');
                //초기화 -> .active 제거
                // mobileGnbReset();
                if (!isActive) { // .active가 없을 때
                    depth1Item.classList.add('active');
                    depth1Item.title = "메뉴 닫기";
                    nextDepth2Item.classList.add('active');
                } else { // .active가 있을 때
                    depth1Item.classList.remove('active');
                    depth1Item.title = "메뉴 열기";
                    nextDepth2Item.classList.remove('active');
                }
            }

            // 2depth a태그 다음에 3depth가 있는지 검사
            mobilegnbDepth2Items.forEach((depth2Item, i) => {
                // depth2Item의 다음 요소가 mobilegnbDepth3인지 확인
                const nextElement = depth2Item.nextElementSibling;
                if (nextElement && nextElement.classList.contains('depth3-wrap')) {
                    // 3depth가 있을 때 - 2depth의 href를 '#none'으로 설정
                    depth2Item.setAttribute('href', '#none');
                } else {
                    // 3depth가 없을 때 - 2depth의 ::before를 비활성화할 클래스 추가
                    // depth2Item.classList.add('no-before');
                }
            });

        });

        //다른 1depth 클릭했을 때 전부 초기화하는 코드도 필요함!
    });


    // 2 depth
    mobilegnbDepth2Items.forEach((depth2Item, i) => {
        depth2Item.addEventListener('click', () => {

            // mobilegnbDepth3[i]가 존재하는지 확인
            let isActive2 = depth2Item.classList.contains('active')

            // 초기화 -> 2depth의 a.active 제거
            // mobilegnbDepth2Items.forEach(item => {
            //     item.classList.remove('active');
            //     item.title = "메뉴 열기";
            // });

            mobilegnbDepth3.forEach(menu => {
                menu.classList.remove('active');
            });

            if (!isActive2) { // .active가 없을 때
                depth2Item.classList.add('active');
                depth2Item.title = "메뉴 닫기";
                depth2Item.nextElementSibling.classList.add('active');
            } else { // .active가 있을 때
                depth2Item.classList.remove('active');
                depth2Item.title = "메뉴 열기";
                depth2Item.nextElementSibling.classList.remove('active');
            }
        });
    });


    //통합검색
    const globalSearchBtn = document.querySelector('.header__link--search');
    const globalSearch = document.querySelector('.global-search');
    const globalSearchClose = document.querySelector('.global-search .close');
    // const globalSearchInput = globalSearch.querySelector('.global-search.acitve .search-filtering__input');

    if(globalSearch){
        document.querySelector('body').addEventListener('click', function (e) {
            const isActiveGlobalSearch = globalSearch.classList.contains('active');
            const isClickGlobalSearch = globalSearch.contains(e.target);

            if (isActiveGlobalSearch) {
                if (!isClickGlobalSearch && e.target !== globalSearchBtn) {
                    globalSearch.classList.remove('active');
                }
            }
        });

        globalSearchClose.addEventListener('click', function () {
            globalSearch.classList.remove('active');
            globalSearchBtn.focus();
        });

        globalSearchBtn.addEventListener('click', function (e) {
            const isActiveGlobalSearch = globalSearch.classList.contains('active');
            if (isActiveGlobalSearch) {
                globalSearch.classList.remove('active');
            }  else {
                globalSearch.classList.add('active');
                setFocusTrap();
            }
        });
    }

    function setFocusTrap() {
        const focusableElements = globalSearch.querySelectorAll('input, button, a');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        //첫번째 포커스 요소에
        firstFocusable.addEventListener('keydown', function(e) {
            if(e.shiftKey && e.key === 'Tab'){
                e.preventDefault();
                lastFocusable.focus();
            }
        });
        lastFocusable.addEventListener('keydown', function(e) {
            if(!e.shiftKey && e.key ==='Tab') {
                e.preventDefault();
                firstFocusable.focus();
            }
        });

        firstFocusable.focus();
    }

        // 초기 팝업 상태에서 포커스 트랩 설정
        // function setFocusTrap(popupElement) {
        //     var focusableElements = popupElement.find("button, .datepicker, .datepicker2, input:not([type='hidden']), select, iframe, textarea, [href], [tabindex]:not([tabindex='-1'])");
        //     var firstFocusable = focusableElements.first();
        //     var lastFocusable = focusableElements.last();

        //     // 첫 번째 요소에서 Shift+Tab 시 마지막 요소로 이동
        //     firstFocusable.on('keydown', function(event) {
        //         if (event.shiftKey && event.key === 'Tab') {
        //             event.preventDefault();
        //             lastFocusable.focus();
        //         }
        //     });

        //     // 마지막 요소에서 Tab 시 첫 번째 요소로 이동
        //     lastFocusable.on('keydown', function(event) {
        //         if (!event.shiftKey && event.key === 'Tab') {
        //             event.preventDefault();
        //             firstFocusable.focus();
        //         }
        //     });

        //     // 팝업 열림 시 첫 포커스 위치
        //     firstFocusable.focus();
        // }



    //교육과정신청 상세검색 열기
    const boardSearch = document.querySelector(".search-filtering__detail-button");
    if( boardSearch ){
        document.querySelector(".search-filtering__detail-button").addEventListener("click", function() {
            const button = document.querySelector(".search-filtering__detail-button");
            const detail = document.querySelector(".search-filtering__detail");

            if(!button.classList.contains("active")) {
                button.classList.add("active");
                button.textContent = "상세검색 닫기";
                detail.style.display = "block";
            } else {
                button.classList.remove("active");
                detail.style.display = "none";
                button.textContent = "상세검색 열기";
            }
        });
    }

    // 패밀리 사이트
    const btnFamilySite = document.querySelectorAll('.family-site--button');
    const familySiteList = document.querySelectorAll('.family-site--item');

    btnFamilySite.forEach((openBtn, i) => {
        openBtn.addEventListener('click', function () {
            const isActive = familySiteList[i].classList.contains('active');

            familySiteList.forEach(list =>
                list.classList.remove('active')
            );
            if (!isActive) {
                familySiteList[i].classList.add('active');
                openBtn.title = '닫기';
            } else {
                openBtn.title = '열기';
            }
        });
    });


    //리사이즈 모바일 메뉴 초기화


    //모바일-gnb 열리면 모바일-퀵메뉴 닫히게
    // let mobileGnbOpen = document.querySelector('.mobile-gnb-wrap').classList.contains('open');
    // if(mobileGnbOpen){
    //     document.querySelector('.mobile-quickmenu').style.color ='red';
    //     document.querySelector('.mobile-quickmenu').style.display ='none';
    // } else {
    //
    // };

    /* flicking */
    let scrollStartPos = 0;
    document.querySelectorAll('.flicking').forEach(tableFlicking => {
        if (tableFlicking) {
            wrapFlicking(tableFlicking);
        }
    });
    // document.querySelectorAll('.table-list.flicking').forEach(tableFlicking => {
    //     if (tableFlicking) {
    //         wrapFlicking(tableFlicking);
    //     }
    // });

    document.querySelectorAll('.table-list').forEach(tableList => {
        const hasFlicking = tableList.classList.contains("flicking");
        const tableListTh = tableList.querySelectorAll('thead tr th');

        if (!hasFlicking && tableListTh.length > 3) {
            wrapFlicking(tableList);
        }
    });

    function createWrapper() {
        const outerFlickingWrap = document.createElement('div');
        outerFlickingWrap.className = 'f_wrapper';

        const innerFlickingWrap = document.createElement('div');
        innerFlickingWrap.className = 'f_wrapper_inner';

        const scroller = document.createElement('div');
        scroller.className = 'f_scroller';

        const touch = document.createElement('a');
        touch.className = 'touch';
        touch.href = '#none';
        touch.textContent = '좌우로 스크롤 하세요.';

        scroller.appendChild(touch);
        innerFlickingWrap.appendChild(scroller);
        outerFlickingWrap.appendChild(innerFlickingWrap);

        return { outerFlickingWrap, scroller, touch };
    }

    function wrapFlicking(target) {
        const { outerFlickingWrap, scroller, touch } = createWrapper();

        target.parentNode.insertBefore(outerFlickingWrap, target);
        outerFlickingWrap.appendChild(target);
        scroller.appendChild(target);

        touch.addEventListener('click', () => {
            touch.style.display = 'none';
        });
    }

});





$(document).ready(function(){

    // mobile gnb click
    $(document).on('click', '.mobile-gnb__button', function () {
        // $(this).addClass("mobile-gnb__close");
        $('.mobile-gnb-wrap').addClass('open');
        // $('.dim').fadeIn();
        //$('.dim_layer').slideDown();
    });

    // mobile gnb click
    // $(document).on('click', '.mobile .mobile-menu', function () {
    //     $('body').addClass('overflow');
    // });

    $(document).on('click', '.mobile-gnb__close', function () {
        // $(this).removeClass("mobile-gnb__close");
        $('.mobile-gnb-wrap').removeClass('open');
        // $('.dim').fadeOut();
        // 241108 yj
        // $('.mobileOn .gnb > ul > li > ul').hide();
        $('.mobileOn .gnb > ul > li > a').removeClass('open');
        //$('.dim_layer').stop().slideUp();
    });


    //layer popup
    // 초기 팝업 상태에서 포커스 트랩 설정
    function setFocusTrap(popupElement) {
        var focusableElements = popupElement.find("button, .datepicker, .datepicker2, input:not([type='hidden']), select, iframe, textarea, [href], [tabindex]:not([tabindex='-1'])");
        var firstFocusable = focusableElements.first();
        var lastFocusable = focusableElements.last();

        // 첫 번째 요소에서 Shift+Tab 시 마지막 요소로 이동
        firstFocusable.on('keydown', function(event) {
            if (event.shiftKey && event.key === 'Tab') {
                event.preventDefault();
                lastFocusable.focus();
            }
        });

        // 마지막 요소에서 Tab 시 첫 번째 요소로 이동
        lastFocusable.on('keydown', function(event) {
            if (!event.shiftKey && event.key === 'Tab') {
                event.preventDefault();
                firstFocusable.focus();
            }
        });

        // 팝업 열림 시 첫 포커스 위치
        firstFocusable.focus();
    }

    // 페이지 로드 시 열린 팝업의 포커스 트랩 적용
    // $(document).ready(function() {
        $('.modal-wrap.open').each(function() {
            setFocusTrap($(this)); // 열린 팝업에 포커스 트랩 적용
        });
    // });

    // 모달 버튼 클릭 시 포커스 트랩 재적용
    $(document).on('click', '.modal-btn', function (event) {
        event.preventDefault();
        var popupId = $(this).attr('data-popup');
        var popupElement = $("#" + popupId);

        var popupMain = $(this).attr('data-main');
        if (Check.empty(popupMain) || popupMain !== "Y") {
            $('.modal-wrap').removeClass('open').fadeOut().attr("tabindex", "-1");
        }

        // 팝업 열기
        popupElement.addClass('open').fadeIn().attr("tabindex", "0");

		// 스크롤방지 설정
		$('body').addClass('overflow');

        // 포커스 트랩 설정
        setFocusTrap(popupElement);
    });

    // 닫기 버튼 클릭 시 포커스 해제
    $(document).on('click', '.modal-close, .b-close', function (event) {
        event.preventDefault();
        var popup = $(this).closest('.modal-wrap');

        // 팝업 닫기
        popup.removeClass('open').fadeOut().attr("tabindex", "-1");

		// 스크롤방지 해제
		$('body').removeClass('overflow');


        // aria-hidden 속성 해제
        $('.skip-links, .masthead, .initial-content, .search-content, .page__footer').removeAttr('aria-hidden');
    });

    //

    $(window).resize(function () {

        // $('.mobile-gnb-wrap').removeClass('open');
        // $('.mobile-menu.gnb-close').removeClass('gnb-close');
        // $('.dim').hide();
        // $('body').removeClass('overflow');
        // $('.mobile-menu').removeClass('active');
        // $('.mobile-gnb-wrap.mobileOn .gnb > ul > li > ul').hide();
        if ($(window).width() < 1200) {
            $('body').removeClass('pc');
            $('body').removeClass('tablet');
            $('body').addClass('mobile');
            $('.mobile-gnb-wrap').addClass('mobileOn');

            $('.hd-search-box').hide();

            /************241108 yj 주석**************/

            /***** kakao inapp broswer bug - 201105 ej *****/
            // var userAgent = navigator.userAgent.toLowerCase();

            // 카카오 인앱 브라우저인지 확인
            // if (userAgent.indexOf('kakaotalk') > -1) {
            //     // 카카오 인앱 브라우저에서 열린 경우
            // } else {
            //     // 일반적인 브라우저에서 열림
            //     $('.mobile-gnb-wrap .gnb > ul > li > a').removeClass('open');
            //     // 241108 yj
            //     // $('.mobile-gnb-wrap .gnb > ul > li > ul').hide();
            // }

            /************241108 yj 주석**************/

        }else {
            $('body').addClass('pc');
            $('body').removeClass('tablet');
            $('body').removeClass('mobile');

            //$('.mobile-menu').hide();
            // $('#wrap').removeClass('mobile');
            $('.mobile-gnb-wrap').removeClass('mobileOn');
            // $('.mobile-gnb-wrap').removeClass('open');
            // $('.dim').hide();
            $(".hd-bottom").mouseover(function() {
                $("body.pc #header").addClass("hover");
                // if($(this).children('.depth2').length) {
                    $('.hd-bottom #gnb .depth2').stop().slideDown(300);
                    $(".hd-bottom-dim").stop().slideDown(300);
                // }
            })
            $(".hd-bottom").mouseout(function() {
                $("body.pc #header").removeClass("hover");
                $('.hd-bottom #gnb .depth2').stop().slideUp(300);
                $(".hd-bottom-dim").stop().slideUp(300);
            })


            $('.mobile-gnb-wrap .gnb > ul > li > ul').show(); // pc
        }
    }).resize();

    //datepicker
    $.datepicker.setDefaults({
        dateFormat: 'yy. mm. dd',	//날짜 포맷이다. 보통 yy-mm-dd 를 많이 사용하는것 같다.
        prevText: '이전 달',	// 마우스 오버시 이전달 텍스트
        nextText: '다음 달',	// 마우스 오버시 다음달 텍스트
        closeText: '닫기', // 닫기 버튼 텍스트 변경
        currentText: '오늘', // 오늘 텍스트 변경
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],	//한글 캘린더중 월 표시를 위한 부분
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],	//한글 캘린더 중 월 표시를 위한 부분
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],	//한글 캘린더 요일 표시 부분
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],	//한글 요일 표시 부분
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],	// 한글 요일 표시 부분
        showMonthAfterYear: true,	// true : 년 월  false : 월 년 순으로 보여줌
        yearSuffix: '년',	//
        showButtonPanel: true,	// 오늘로 가는 버튼과 달력 닫기 버튼 보기 옵션
        // buttonImageOnly: true,	// input 옆에 아이콘으로 캘린더 선택가능하게 하기
        // buttonImage: "../images/sub/ico_calendar.png",	// 조그만한 아이콘 이미지
        // buttonText: "Select date"	// 아이콘 툴팁
        changeMonth: true,
        changeYear: true,
    });

    var startDate =  $(".datepicker").datepicker(); // 시작일 or 단일 데이트피커
    var endDate = $(".datepicker2").datepicker(); // 종료일 있을 경우

    $("input.birth").datepicker({ yearRange: "-100:+0" });


    startDate.datepicker("option", "maxDate", endDate.val());
    startDate.datepicker("option", "onClose", function ( selectedDate ) {
        endDate.datepicker( "option", "minDate", selectedDate );
    });

    endDate.datepicker();
    endDate.datepicker("option", "minDate", startDate.val());



    /* flicking */
    // var scrollStartPos = 0;
    // $('.flicking').each(function (index, element) {
    //     $(this).wrap('<div id="f_wrapper_' + index + '" class="f_wrapper"></div>').wrap('<div class="f_wrapper_inner"></div>').wrap('<div class="f_scroller"></div>').before('<p class="touch">터치해서 좌우로 움직이세요</p>');
    // });


    //첨부파일 커스텀 - 240510 동적팝업 이슈 수정
    $(document).on('change', '.filebox [type="file"]', function() {
        var $target = $(this),
            fileName = $target.val(),
            $fileText = $target.siblings('.file-inp');
        $fileText.text(fileName);
    });
    $(document).on('focusin focusout', '.filebox [type="file"]', function(e) {
        e.type == 'focusin' ?
            $(this).siblings('.file-btn').addClass('file-focus') : $(this).siblings('.file-btn').removeClass('file-focus');
    });


});
