document.addEventListener('DOMContentLoaded', () => {
	const breadcrumb = document.querySelector('.breadcrumb');
    const breadDepth1 = document.querySelectorAll('.breadcrumb .item');

    if(breadcrumb) {
        breadDepth1.forEach(menu => {
			const depth2Menu = menu.querySelector('.bread-depth2');
			const anchor = menu.querySelector('a');

			// depth2 있는지 검사
			if(depth2Menu) {
				anchor.classList.add('child');
	            menu.addEventListener('click', function() {
					if(!menu.classList.contains('active')){
						breadDepth1.forEach(item => {
							item.classList.remove('active');
							item.querySelector('a').removeAttribute("title");
						});
						menu.classList.add('active');
						menu.querySelector('a').setAttribute('title', '선택됨');
					} else{
						menu.classList.remove('active');
						menu.querySelector('a').setAttribute('title', '');
					}
	            });
            } else {
				// 없을 땐 화살표 제거
				anchor.classList.remove('child');
			}
        });
    }


	//탭메뉴
	const tabMenu = document.querySelectorAll('.tab-menu.level button');
	const tabCont = document.querySelectorAll('.tab-cont');

	// 240214 조건문 추가 yj
	if(tabMenu){
		tabMenu.forEach((btn, i) => {
			btn.addEventListener('click', function () {
				tabMenu.forEach(item =>
					item.classList.remove('active')
				);
				btn.classList.add('active');

				tabCont.forEach(item =>
					item.classList.remove('active')
				);
				tabCont[i].classList.add('active');
			});
		});
	}

	// 모든 .tab__menu를 순회하며 각각에 mobileTabBtn 생성 및 삽입
	document.querySelectorAll('.tab__menu:not(.monthly)').forEach((tabMenu) => {
		// 모바일 탭 버튼 생성
		const mobileTabBtn = document.createElement('button');
		mobileTabBtn.type = 'button';
		mobileTabBtn.className = 'tab__menu--button';

		// 활성화된 탭 메뉴의 텍스트를 버튼에 설정
		const activeMenu = tabMenu.querySelector('.tab__menu--item.active');
		if (activeMenu) {
			mobileTabBtn.innerText = activeMenu.innerText;
		}

		// .tab__menu를 기준으로 삽입
		tabMenu.parentNode.insertBefore(mobileTabBtn, tabMenu); // 부모 기준으로 삽입
		mobileTabBtn.setAttribute('title', '메뉴 열기');

		// 클릭 이벤트 추가
		mobileTabBtn.addEventListener('click', function () {
			mobileTabBtn.classList.toggle('active');
			if (mobileTabBtn.classList.contains('active')) {
				mobileTabBtn.setAttribute('title', '메뉴 닫기');
			} else {
				mobileTabBtn.setAttribute('title', '메뉴 열기');
			}
		});
	});



    // 체크박스 title 속성  추가
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const label = document.querySelector(`label[for="${checkbox.id}"]`);
            if (label) {
                if (checkbox.checked) {
                    label.setAttribute('title', '선택됨');
                } else {
                    label.removeAttribute('title');
                }
            }
        });
    });


	//탭메뉴
	const scrollSections = document.querySelectorAll(".application-detail__wrap > div[id]");
    const menuButton = document.querySelectorAll(".application-edu__wrap .tab__menu--item");

    // 클릭 이벤트 처리
    if (menuButton) {
        menuButton.forEach(btn => {
            btn.addEventListener("click", function (e) {
                // 탭버튼 active
                menuButton.forEach(item => {
                    item.classList.remove("active");
                    item.removeAttribute("title");
                });
                btn.classList.add("active");
                btn.setAttribute("title", "선택됨");

				if(scrollSections){
					// 탭메뉴 스크롤이동
					e.preventDefault();
					const itemId = this.getAttribute("href").substring(1);
					const itemElement = document.getElementById(itemId);
					if (itemElement) {
						let itemPosition = itemElement.offsetTop;
						let offsetPosition = itemPosition;
						window.scrollTo({
							top: offsetPosition,
							behavior: "smooth"
						});
					}
				}
            });
        });
    }

    // 스크롤 이벤트 처리
    window.addEventListener("scroll", function () {
		let isScrollEnabled = false; // 스크롤 이벤트 활성화 여부를 추적

		if(document.querySelector('.contents__left .tab__menu')){
			// 첫 번째 섹션의 상단 위치
			const firstSectionTop = scrollSections[0].offsetTop;

			let currentSectionId = null; // 현재 보이는 섹션의 ID를 추적
			// 각 섹션을 확인하여 현재 보이는 섹션을 찾기
			scrollSections.forEach(section => {
				const sectionTop = section.offsetTop;
				const sectionBottom = sectionTop + section.offsetHeight;

				if (window.scrollY >= sectionTop && window.scrollY <= sectionBottom) {
					currentSectionId = section.id; // 현재 보이는 섹션의 ID 저장
				}
			});


			menuButton.forEach(btn => {
				if (window.scrollY + window.innerHeight >= firstSectionTop) {

					btn.classList.remove('active');

					if (btn.firstElementChild) {
						btn.firstElementChild.classList.add('active');
					}
				}

				const targetId = btn.getAttribute('href').substring(1); // 탭의 ID 추출
				if (currentSectionId === targetId) {
					btn.classList.add('active');
					btn.setAttribute('title', '선택됨');
				} else {
					btn.removeAttribute('title');
					btn.classList.remove('active');
				}

				if (window.scrollY + window.innerHeight >= document.scrollHeight) {
					if (btn.lastElementChild) {
						btn.lastElementChild.classList.add('active');
					}
				}
			});
		}



    });


    // tip 박스 팝업
	const popupBtn = document.querySelector('.popup-button');
	if (popupBtn){
		popupBtn.addEventListener('click', function(e) {
			e.stopPropagation();
			e.preventDefault();

			const el = e.target;
			const lp = el.getAttribute('data-popup');
			const popId = document.getElementById(lp);
			const popTipBox = document.querySelector('.tip-box');

			let isActive = popTipBox.classList.contains('active');
			if(!isActive){
				popTipBox.classList.add('active');
				document.querySelector('.tip__button').title = '신청상태 닫기';

				el.setAttribute('data-focus', lp + 'on');
				popId.setAttribute('tabindex', '0');
				popId.focus();

				//팝업 닫기
				if(document.querySelector('.tip-box__btn--close')){
					if(popTipBox.classList.contains('active')){
						document.querySelector('.tip-box__btn--close').addEventListener('click', function () {
							popTipBox.classList.remove('active');
							document.querySelector('.tip__button').title = '신청상태 더보기';
							document.querySelector('.tip__button').setAttribute('tabindex', '0');
							el.focus();
						});
					}
				} else{
					document.querySelector('body').addEventListener('click', function (e) {
						const isClickTipbox = popTipBox.contains(e.target);

						if(!isClickTipbox) {
							popTipBox.classList.remove('active');
						}
					});
				}
			}
		});
	}


	//아코디언
	const accordion = document.querySelectorAll('.accordion-wrap .accordion');
	if(accordion) {
		accordion.forEach((item) => {
			const accordionBtn = item.querySelector('.accordion-btn');
			const acoordionLimit = item.querySelector('.acoordion-limit');
			const addInfo = document.getElementById("addInfoYn");

			accordionBtn.addEventListener('click', () => {
				const activeCnt = document.querySelectorAll('.accordion.active');

				if(item.classList.contains('active')){
					if(acoordionLimit &&  activeCnt.length >= 4){
						alert("검색조건은 3개까지 선택이 가능합니다.");
						return false;
					}
					if(addInfo) {
						addInfo.disabled = false;
					}
					item.classList.remove('active');
					accordionBtn.innerText = '검색조건 선택';
				} else{
					if(addInfo && acoordionLimit &&  activeCnt.length == 2){
						addInfo.checked = false;
						addInfo.disabled = true;
					}
					if(acoordionLimit &&  activeCnt.length >= 3){
						alert("검색조건은 3개까지 선택이 가능합니다.");
						return false;
					}
					item.classList.add('active');
					accordionBtn.innerText ='검색조건 해제';
				}
			});
		});
	}


	const wageWrap = document.querySelector('.box-solid .wage');
	if(wageWrap){
		const summaryBtn = wageWrap.querySelector('.btn.summary');
		const summaryUl = wageWrap.querySelector('.wage-accordion');
		if(summaryBtn) {
			summaryBtn.addEventListener('click', () => {
				if(summaryUl.classList.contains('active')){
					summaryUl.classList.remove('active');
					summaryBtn.classList.remove('active');
					summaryBtn.innerText = '도움말';
				} else{
					summaryUl.classList.add('active');
					summaryBtn.classList.add('active');
					summaryBtn.innerText = '접어두기';
				}
			});
		}
	}

	const cardnews = document.querySelector('.swiper-container.cardnews');
	if(cardnews) {
		const cardnewsSwiper = new Swiper(cardnews, {
			navigation : {
				nextEl: cardnews.querySelector('.arrow-next'),
				prevEl: cardnews.querySelector('.arrow-prev'),
			},
			pagination: {
				el: cardnews.querySelector('.swiper-pagination'),
				clickable: true,
				renderBullet: function (index, className) {
					return '<button type="button" class="' + className + '">' + (index + 1) + '번 슬라이드' + '</button>';
				},
			},
		})
		const pagingSwiper = new Swiper(cardnews, {
			pagination: {
			  el: ".swiper-fraction",
			  type: "fraction",
			},
		});
	}

});

$(document).ready(function(){
/* s */


	/* scroll event */
	$(window).scroll(function() {

		$('.sub-tab-wrap .ui-subtab-list li:first-child a').addClass('on');
		if($('.sub-tab-wrap .ui-subtab-list').length) {
			if($(window).scrollTop() >= $(".sub-tab-trigger").offset().top) {
				$('.sub-tab-trigger').addClass('add');
				$('.sub-tab-wrap').addClass('fixed');
			} else {
				$('.sub-tab-trigger').removeClass('add');
				$('.sub-tab-wrap').removeClass('fixed');
			}
		}
		$('.sub-cont-tab').each(function() {
			if($(window).scrollTop() >= $(this).offset().top - $('.sub-tab-wrap').height() * 2) {
				var id = $(this).attr('id');
				$('.sub-tab-wrap .ui-subtab-list li a').removeClass('on');
				$('.sub-tab-wrap .ui-subtab-list li a[href="#'+ id +'"]').addClass('on');
			}
		});
	});

/* e */

});