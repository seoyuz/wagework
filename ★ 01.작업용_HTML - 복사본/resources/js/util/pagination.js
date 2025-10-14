/****************************************************************
 *
 * 파일명 : pagination.js
 * 설  명 : 통합형 임금직무정보시스템 기능 사용 JavaScript
 *
 *    수정일      수정자      Version        Function 명
 * ----------    -------    -------------  ----------------------------
 * 2024.12.21    WhyT       1.0            최초생성
 *
 * **************************************************************/

const config = {
	selectors: {
		  recordSize: '#recordCountPerPage'
		, pagination: '#pagination'
		, paginationInfo: '#paginationInfo'
	},
	template: {
		  prev: '#prve_pagination_tmpl'
		, number: '#pagination_tmpl'
		, next: '#next_pagination_tmpl'
	},
	pageSizeOptions: [10, 30, 50, 100],
	imgagePageSizeOptions: [12, 15, 21, 27]
};


const Pagination = {

	drawRecordSizeOptions: () => {
		const $pageSizeSelect = $(config.selectors.recordSize);

		let arrSize = new Array();;
		config.pageSizeOptions.forEach(size => {
			let jsonSize = { "size": size };
			arrSize.push(jsonSize);
		});

		let htmlOutput = $.templates(config.selectors.recordSize + "_tmpl").render(arrSize);
		$pageSizeSelect.append(htmlOutput);
	},

	drawImgageRecordSizeOptions: (page, id) => {
		let lSelector = config.selectors.recordSize;

		if (!Check.empty(id)) {
			lSelector = id;
		}

		const $pageSizeSelect = $(lSelector);

		let arrSize = new Array();;
		config.imgagePageSizeOptions.forEach(size => {
			let jsonSize = { "size": size };
			arrSize.push(jsonSize);
		});

		let htmlOutput = $.templates(config.selectors.recordSize + "_tmpl").render(arrSize);
		$pageSizeSelect.html(htmlOutput);
	},

	drawPaginationInfo: (data) => {
		let htmlOutput = $.templates(config.selectors.paginationInfo + "_tmpl").render(data);
		$(config.selectors.paginationInfo).html(htmlOutput);
	},

	drawPagination: (name, data) => {
		data.jsFunction = name;

		const SHOW_PAGE_CNT = 5;

		const currentPage = data.currentPageNo;
		const totalPage = data.totalPageCount;

		const pageGroup = Math.ceil(currentPage / SHOW_PAGE_CNT);

		let lastNumber = pageGroup * SHOW_PAGE_CNT;
		if (lastNumber > totalPage) {
			lastNumber = totalPage;
		}

		let firstNumber = lastNumber - (SHOW_PAGE_CNT - 1) > 0 ? lastNumber - (SHOW_PAGE_CNT - 1) : 1;


		$(config.selectors.pagination).empty();

		// 첫 페이지 및 이전페이지
		if (currentPage >= SHOW_PAGE_CNT) {
			let prevHtmlOutput = $.templates(config.template.prev).render(data);
			$(config.selectors.pagination).append(prevHtmlOutput);
		}

		// 번호페이지
		for (let i = firstNumber; i <= lastNumber; i++) {
			let active_class = "";
			if (currentPage === i) {
				active_class = "now";
			}

			let page = {
				  active: active_class
				, pageNo: i
				, jsFunction: name
				, currentPageNo: currentPage
			};

			$(config.selectors.pagination).append($.templates(config.template.number).render(page));
		}

		// 다음 페이지 및 마지막 페이지
		if (lastNumber < totalPage) {
			let nextHtmlOutput = $.templates(config.template.next).render(data);
			$(config.selectors.pagination).append(nextHtmlOutput);
		}
	}
};