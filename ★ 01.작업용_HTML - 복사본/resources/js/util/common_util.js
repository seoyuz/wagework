/****************************************************************
 *
 * 파일명 : common_util.js
 * 설  명 : 통합형 임금직무정보시스템 기능 사용 JavaScript
 *
 *    수정일      수정자      Version        Function 명
 * ----------    -------    -------------  ----------------------------
 *
 * **************************************************************/
$(document).ready(function() {

	/* 숫자 + - */
	$(document).on("keyup", ".number", function() {
		if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
			return;
		}

		$(this).val($(this).val().replace(/[^0-9\-]/g,""));
	});

	/* 숫자 + . */
	$(document).on("keyup", ".number_dot", function() {
		if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
			return;
		}

		$(this).val($(this).val().replace(/[^0-9\.]/g,""));
	});

	/* 영문과 숫자 입력 */
	$(document).on("keyup", ".engNumber", function() {
		if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
			return;
		}

		$(this).val($(this).val().replace(/[^0-9\a-zA-Z]/g,""));
	});

	/* 3자리 콤마 삽입 numberComma */
	$(document).on("blur, keyup", ".numberComma", function() {

        $(this).val(Str.addComma(Number($(this).val().replace(/[^0-9]/g,""))));
	});

	/* 영문과 숫자 입력 */
	$(document).on("keyup", ".eng", function() {
		if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
			return;
		}

		$(this).val($(this).val().replace(/[^a-zA-Z]/g,""));
	});

	/*오직 숫자만*/
	$(document).on("keyup", ".onlyNum", function() {
		if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
			return;
		}

		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});

	/* 핸드폰 번호 자동 */
	$(document).on("keyup", ".phone", function() {
		if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
			return;
		}

		$(this).val( $(this).val().replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-") );
	});

	/* 영문과 숫자 + -, _ 입력 */
	$(document).on("keyup", ".engNumDashDot", function() {
		if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
			return;
		}

		$(this).val($(this).val().replace(/[^0-9|a-z|A-Z|\-|\_|\.]/g,""));
	});

	/* 영문과 숫자 입력 */
	$(document).on("keyup", ".engNumDot", function() {
		if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
			return;
		}

		$(this).val($(this).val().replace(/[^0-9\a-zA-Z|\.]/g,""));
	});

});


/*
 * URL에서 파라미터 정보 가지고 오기
 */
(function($){
	$.QueryString = (function(key) {
		if (key == "") {
			return {};
		}

		let rtnVal = {};
		for (let i = 0; i < key.length; i++) {
			let p = key[i].split('=');
			if (p.length != 2) {
				continue;
			}
			rtnVal[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
		return rtnVal;
	}) (window.location.search.substr(1).split('&'))
})(jQuery);


const Check = {
	empty: (val) => {
		return (val == null || val === '' || typeof val == 'undefined' || (Array.isArray(val) && val.length == 0)) ? true : false;
	},
	trimEmpty: (obj, msg) => {
		if (Check.empty($.trim(obj.val()))) {
			alert(msg);
			obj.focus();
			return true;
		}

		return false;
	},
	trimJsEmpty: (obj, msg) => {
		if (Check.empty($.trim(obj.value))) {
			alert(msg);
			obj.focus();
			return true;
		}

		return false;
	},
	pattern: (obj, pattern, msg) => {
		if (!pattern.test(obj.val())) {
			alert(msg);
			obj.focus();
			return true;
		}

		return false;
	},
	byteLength: (str) => {
		for(b=i=0; c = str.charCodeAt(i++); b += c>>11 ? 3 : c>>7 ? 2 : 1);
		return b;
	},
	strMaxLen: (aInputObj, aLimit) => {
		/**
		 * 입력항목의 문자열을 체크하여 Limit을 초과하지 않도록 하며 입력된 글자수를 표시
		 * parameter : aInputObj - 입력항목 Object 명
		 *             aLimit - 입력제한 글자수 ( 0: 입력제한 없음, -(마이너스) 값으로 입력시 alert 창 띄우지 않음)
		 */
		let sData = $('#' + aInputObj).val();
		let size = 0;
		let strLen = 0;
		let fieldSize = "";
		let returnVal = "";
		let bAlert = aLimit < 0 ? false : true;

		aLimit = aLimit < 0 ? - aLimit : aLimit;

		fieldSize = sData.length;

		/** 2018.12.08 YCKANG, 특수기호 XSS 적용에 따른 길이 분기처리 */
		for(let i = 0; i < fieldSize; i++) {
			let ch = sData.charAt(i);
		    if(escape(ch).length > 4) {
		       	size = 3;
		    } else if (ch == '<' || ch == '>') {
				size = 4;
			} else if (ch == '\'') {
				size = 5;
			} else if (ch == '"') {
				size = 6;
			} else if(escape(ch).length > 2) {
		       	if(ch == '\n')// || ch == '\r'){
		       		size = 2;
		       	else
		     		if(ch.charCodeAt(0) < 128)
		     			size = 1;
		     		else
		     			size = 2;
		    } else {
		       	size = 1;
		    }
		    if(aLimit != 0 && aLimit < strLen + size){
		    	if(bAlert) {
		    		let bLen = parseInt(aLimit / 3);
		    		alert('최대 입력가능 ' + aLimit + ' Byte(한글기준' + bLen + '자)를 초과하여 이후 글자수는 자동 삭제됩니다.');
				}

		    	$('#' + aInputObj).val(returnVal);

		    	return strLen;
		    }else{
		    	returnVal = returnVal + ch;
			    strLen = strLen + size;
		    }
		}

		return strLen;
	}
};


const Cookie = {
	create: (cookieName, value, exdays) => {
		// 쿠키 생성
		let exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		let cookieValue = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toGMTString());
		document.cookie = cookieName + "=" + cookieValue;
	},
	delete: (cookieName) => {
		// 쿠키 삭제
		let expireDate = new Date();
		expireDate.setDate(expireDate.getDate() - 1);
		document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
	},
	select: (cookieName) => {
		// 쿠키 조회
		cookieName = cookieName + "=";
		let cookieData = document.cookie;
		let start = cookieData.indexOf(cookieName);
		let cookieValue = "";
		if (start != -1){
			start += cookieName.length;

			let end = cookieData.indexOf(";", start);
			if (end == -1) {
				end = cookieData.length;
			}
			cookieValue = cookieData.substring(start, end);
		}

		return unescape(cookieValue);
	}
};


$.ajaxSettings.traditional = true;

const Submit = {

	ajax: ($formObj, jData, returnMethod, sdataType, url, params, asyncType) => {
		let contentType = "application/x-www-form-urlencoded; charset=utf-8";

		if (typeof url == "undefined" || url == "") {
			url = $formObj.attr("action");
		}

		let method = "post";
		if (typeof $formObj != "undefined" && $formObj != "") {
			method = $formObj.attr("method");

			if ($formObj.data("json") == "Y") {
				contentType = "application/json; charset=utf-8";
			}
		}

		if (typeof sdataType == 'undefined') {
			sdataType = 'html';
		}

		if (Check.empty(asyncType) && asyncType != false) {
			asyncType = true;
		}

		$.ajax({
			dataType	: sdataType
			,	type	: method
			,	url		: url
			,	cache	: false
			,	data	: jData
			,	async	: asyncType
			,	contentType: contentType
			,	beforeSend: function (request) {
				request.setRequestHeader("ajax-forward", "ajax");
			}
			,	success	: function(result) {
				returnMethod(result, params);
			}
		})
		.error(function(xhr, status, error) {
			$.unblockUI();

			let result = JSON.parse(xhr.responseText);

			if (Check.empty(result.message)) {
				alert("통신 오류가 발생하였습니다.\n관리자에게 문의해주세요.")
			} else {
				alert(result.message);
				if(result.resultCode == 440) {
					// 로그인 화면으로 이동(세션이 없는경우)
					if(typeof parent.fn_headerLoginMove() == "undefined") {
						fn_headerLoginMove();
					}
				}
			}
		});
	},
	ajaxFile: ( $formObj, url, returnMethod, params ) => {

		if (typeof url == 'undefined' || url == '') {
			url = $formObj.attr("action");
		}

		const form = $formObj[0];
		const formData = new FormData(form);

		$.ajax({
			url : url
			,	type : "POST"
			,	data : formData
			,	processData : false
			,	contentType : false
			,	cache : false
			,	success : function(result) {
					$.unblockUI();
					returnMethod(result, params);
				}
		})
		.error(function(xhr, status, error) {
			$.unblockUI();
			let result = JSON.parse(xhr.responseText);
			alert(result.message || "통신 오류가 발생하였습니다.\n관리자에게 문의해주세요.");

		});
	}

};

const move = {
	home: () => {
		top.location.href = "/index";
	}
};

const DatePicker = {
	/*
	* 달력 생성기
	* @param sDate 파라미터만 넣으면 1개짜리 달력 생성
	* @example   DatePicker.create($("#datepicker"), null, true);
	*
	* @param sDate,
	* @param eDate 2개 넣으면 연결달력 생성되어 서로의 날짜를 넘어가지 않음
	* @example   DatePicker.create($("#datepicker1"), $("#datepicker2"), true);
	*/
	create: (sDate, eDate, flags) => {
		let flag;
		let sFlag;
		let eFlag;

		if (flags == true) {
			sFlag = '';
			eFlag = '';
			flag = '';
		} else {
			flag = flags;
		}

		if (flag.substr(0,1) == '-') {
			sFlag = flag;
			eFlag = 'today';
		} else if (flag.substr(0,1) == '+') {
			sFlag = 'today';
			eFlag = flag;
		} else {
			sFlag = flag;
			eFlag = flag;
		}

		//(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
		let df = 'yy-mm-dd';
		let showMonYear = false;
		let opt = {
			prevText: 'Last',
			nextText: 'Next',
			currentText: 'Today',
			monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
			monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
			dayNames: ['일', '월', '화', '수', '목', '금', '토'],
			dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
			dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
			buttonImageOnly: false,
			changeMonth: true,
			changeYear: true,
			showMonthAfterYear:showMonYear,
			dateFormat: df
		};

		let s = df,
		from = sDate
			.datepicker(opt)
			.datepicker('setDate', sFlag)
			.on("change", () => {
				if (eDate) {
					to.datepicker("option", "minDate", getDate(this));
				}
			}),
		to = (eDate ? eDate.datepicker(opt)
			.datepicker('setDate', eFlag)
			.on("change", () => {
				from.datepicker("option", "maxDate", getDate(this));
			}) : null);

		const getDate = (element) => {
			let date;
			try {
				date = $.datepicker.parseDate(df, element.value);
			} catch( error ) {
				date = null;
			}

			return date;
		}
	},
	getToday: () => {
		// 오늘날짜 구하기
		let today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth()+1;
		let yyyy = today.getFullYear();

		if (dd < 10) { dd = '0' + dd; }
		if (mm < 10) { mm = '0' + mm; }

		return yyyy + '-' + mm + '-' + dd;
	},
	getAfterToday: (addDay) => {
		// 오늘날짜 기준 이후 날짜 구하기
		let today = new Date();
		let loadDt = new Date();

		loadDt = loadDt.getTime() + (addDay * 24 * 60 * 60 * 1000);
		today.setTime(loadDt);

		let yyyy = today.getFullYear();
		let mm = today.getMonth()+1;
		let dd = today.getDate();

		if (dd < 10) { dd = '0' + dd; }
		if (mm < 10) { mm = '0' + mm; }

		return yyyy + '-' + mm + '-' + dd;
	},
	getWeekNo: (day, mondayStart) => {
		// 주 날짜 변환하기
		let startYearDay;
		let today;
		let setYear;

		if (null != day) {
			var tempVal = day.split('\-');
			startYearDay = '1/1/'+tempVal[2];
			today = tempVal[1] + '/' + tempVal[0] + '/' + tempVal[2];
			setYear = tempVal[2];
		} else {
			today = new Date();
			let yyyy = today.getFullYear();
			let dd = today.getDate();
			let mm = today.getMonth()+1;

			if (dd < 10) { dd = '0' + dd; }
			if (mm < 10) { mm = '0' + mm; }

			startYearDay = yyyy + '/1/1/';
			today = yyyy + '-' + mm + '-' + dd;
			setYear = yyyy;
		}

		let dt = new Date(startYearDay);
		let tDt = new Date(today);
		let diffDay = (tDt-dt) / 86400000;	//1day milisec
		let weekDay = parseInt(diffDay / 7) + 1;

		if (tDt.getDay() < dt.getDay()){
			weekDay += 1;
		}

		if (mondayStart == undefined) {
			mondayStart = false;
		}

		if (mondayStart) {
			weekDay = Math.ceil((((tDt - dt) / 86400000) - 1 + dt.getDay() + 1) / 7);
		}

		return setYear + '-' + weekDay;
	}

};

const Str = {
	repalce: (str, searchStr, replaceStr) => {
		if (!fn_emptyCheck(str)) {
			str = str.split(searchStr).join(replaceStr)
		}
		return str;
	},
	addComma: (argStr, argSize) => {
		/**
		 * 소수점 포함 숫자를 세자리마다 컴마를 찍은 형식으로 바꾸어 준다.
		 * @param argStr : 변환시킬 문자열
		 * @param argSize : 소수점 반올림 자릿수
		 * @returns {String}
		 */
		if (argStr == null) {
			return;
		}

		let rule = /[^0-9-.]/g;  // 숫자, 부호 및 소수점 이외의 데이터 제거
		argStr = argStr.toString();
		let boolMinus = false;

		argStr = argStr.replace(rule, "");

		if ($.isNumeric(argStr)) {
			if (parseFloat(argStr) < 0) {
				boolMinus = true;
				argStr = (parseFloat(argStr) * -1).toString();
			}

			if (argStr.indexOf(".") != -1) {
				let decimal = (argSize != null && argStr.split(".")[1].length > argSize? (parseFloat("0." + argStr.split(".")[1]).toFixed(argSize)).toString().split(".")[1] : argStr.split(".")[1]);

				return (boolMinus ? "-" : "" ) + Str.addFilledComma(argStr.split(".")[0]) + "." + decimal;
			} else {
				return (boolMinus ? "-" : "" ) + Str.addFilledComma(argStr);
			}
		} else {
			return;
		}
	},
	addFilledComma: (num) => {
		num = num+"";
		num = num.replace(/,/gi, '');
		point = num.length%3
		len = num.length;
		str = num.substring(0,point);

		while(point < len) {
			if (str != "") {
				str += ",";
			}
			str += num.substring( point , point+3);
			point +=3;
		}

		return str;
	},
	addPoint: (value) => {
		let retValue = value + "";
		retValue = retValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		return retValue;
	},
	fillZero: (n) => {
		let zero = "";
		n = n.toString();

		if (n.length < 2) {
			for (let i = 0; i < 2 - n.length; i++) {
				zero += "0";
			}
		}

		return zero + n;
	},
	leftPad : (value, len, padChr = " ") => {

		if (value == null || value == undefined) {
			return this.leftPad("", len, padChr);
		}
		if (value.length >= len) {
			return value;
		} else {
			for (var i = value.length ; i <= len ; i++) {
				value = (padChr + value);
			}
			return value;
		}
	}
};

const Clear = {
	selectBox: (objId) => {
		$(objId + " option").remove();
		$(objId).append("<option value=\"\">Selected</option>");
	}
};

const TableRowToJson = (id) => {
	let listJson = [];

	$("#" + id + " > tr").each(function(index, item) {
		let json = {};

		$(this).find("input").each(function(index2, item2) {
			json[$(this).attr("name")] = $(this).val()
		});

		$(this).find("select").each(function(index2, item2) {
			json[$(this).attr("name")] = $(this).val()
		});

		$(this).find("textarea").each(function(index3, item3) {
			json[$(this).attr("name")] = $(this).val()
		});

		listJson.push(json);
	});

	return listJson;
};

const CmmnCd = {
	/*
	* @param obj - 생성될 Object
	* @param name - 생성할 Tag Name
	* @param upprCmmnCd - 조회할 상위공통코드
	* @param cmmnCd - 미리 설정해야되는 값이 있을 경우
	* @example CmmnCd.makeCmmnCdeList($("#tmpCmmnCd"), "tmp"", 'TMP_CD', 'TMP1', 'S');
	*/
	makeCmmnCdSelect: (obj, name, pBestCmmnCd, pUpprCmmnCd, pCmmnCd, title, addClass, optionNm, fnc) => {

		if (!Check.empty(obj) && !Check.empty(pUpprCmmnCd)) {
			$.blockUI();

			let param = {
				  upprCmmnCd: pUpprCmmnCd
				, bestCmmnCd: pBestCmmnCd
			};
			Submit.ajax($("#util_cmmn_cd_form"), param, (_result) => {
				$.unblockUI()

				if (_result.success) {
					let lCmmnCdList = _result.data;
					if (lCmmnCdList != null) {
						for (let i = 0; i < lCmmnCdList.length; i++) {
							lCmmnCdList[i].code = pCmmnCd;
						}

						let lCmmnData = {
							  iptName: name
							, title: title
							, addClass: addClass
							, optionNm: optionNm
							, list: lCmmnCdList
							, function: fnc
						};

						let template = $.templates("#util_cmmn_cd_select_tmpl");
						let htmlOutput = template.render(lCmmnData);
						obj.html(htmlOutput);
					}
				} else {
					$("#util_uppr_cmmn_cd").val("");
				}
			}, "json", "", "", false);
		}
	},
	makeCmmnCdOption: (obj, pBestCmmnCd, pUpprCmmnCd, pCmmnCd, useFirstOption, firstOptionNm) => {

		if (!Check.empty(obj) && !Check.empty(pUpprCmmnCd)) {
			$.blockUI();

			let param = {
				  upprCmmnCd: pUpprCmmnCd
				, bestCmmnCd: pBestCmmnCd
			};
			Submit.ajax($("#util_cmmn_cd_form"), param, (_result) => {
				$.unblockUI()

				if (_result.success) {
					let lCmmnCdList = _result.data;
					if (lCmmnCdList != null) {
						for (let i = 0; i < lCmmnCdList.length; i++) {
							lCmmnCdList[i].code = pCmmnCd;
						}
						if(useFirstOption) {
							lCmmnCdList.unshift({
								  code: ""
								, cdnm: firstOptionNm
							});
						}
						let template = $.templates("#util_cmmn_cd_option_tmpl");
						let htmlOutput = template.render(lCmmnCdList);
						obj.empty();
						obj.append(htmlOutput)
					}
				} else {
					$("#util_uppr_cmmn_cd").val("");
				}

			}, "json", "", "", false);
		}
	},
	makeCmmnCdRadio: (obj, name, pBestCmmnCd, pUpprCmmnCd, pCmmnCd, addClass, fnc, srchYn) => {

		if (!Check.empty(obj) && !Check.empty(pUpprCmmnCd)) {
			$.blockUI();

			let param = {
				  upprCmmnCd: pUpprCmmnCd
				, bestCmmnCd: pBestCmmnCd
			};
			Submit.ajax($("#util_cmmn_cd_form"), param, (_result) => {
				$.unblockUI()

				if (_result.success) {
					let lCmmnCdList = _result.data;
					if (lCmmnCdList != null) {
						for (let i = 0; i < lCmmnCdList.length; i++) {
							lCmmnCdList[i].code = pCmmnCd;
							lCmmnCdList[i].iptName = name;
							lCmmnCdList[i].addClass = addClass;
							lCmmnCdList[i].function = fnc;
						}

						let lCmmnData = {
							  list: lCmmnCdList
							, srchYn: srchYn
							, inputName: name
							, addPlusClass: addClass
						};

						let template = $.templates("#util_cmmn_cd_radio_tmpl");
						let htmlOutput = template.render(lCmmnData);
						obj.html(htmlOutput);
					}
				} else {
					$("#util_uppr_cmmn_cd").val("");
				}

			}, "json", "", "", false);
		}
	},
	makeCmmnCdCheck: (obj, name, pBestCmmnCd, pUpprCmmnCd, pCmmnCd, addClass, fnc, srchYn) => {

		if (!Check.empty(obj) && !Check.empty(pUpprCmmnCd)) {
			$.blockUI();

			let param = {
				  upprCmmnCd: pUpprCmmnCd
				, bestCmmnCd: pBestCmmnCd
			};
			Submit.ajax($("#util_cmmn_cd_form"), param, (_result) => {
				$.unblockUI()

				if (_result.success) {
					let lCmmnCdList = _result.data;
					if (lCmmnCdList != null) {
						for (let i = 0; i < lCmmnCdList.length; i++) {
							lCmmnCdList[i].code = pCmmnCd;
							lCmmnCdList[i].iptName = name;
							lCmmnCdList[i].addClass = addClass;
							lCmmnCdList[i].function = fnc;
						}

						let lCmmnData = {
							  list: lCmmnCdList
							, srchYn: srchYn
							, inputName: name
						};

						let template = $.templates("#util_cmmn_cd_check_tmpl");
						let htmlOutput = template.render(lCmmnData);
						obj.html(htmlOutput);
					}
				} else {
					$("#util_uppr_cmmn_cd").val("");
				}

			}, "json", "", "", false);
		}
	},
	makeCmmnCdLi: (obj, name, pBestCmmnCd, pUpprCmmnCd, pCmmnCd,useFirstOption,firstOptionNm,fnc) => {

		if (!Check.empty(obj) && !Check.empty(pUpprCmmnCd)) {
			$.blockUI();

			let param = {
				  upprCmmnCd: pUpprCmmnCd
				, bestCmmnCd: pBestCmmnCd
			};
			Submit.ajax($("#util_cmmn_cd_form"), param, (_result) => {
				$.unblockUI()

				if (_result.success) {
					let lCmmnCdList = _result.data;
					if (lCmmnCdList != null) {
						for (let i = 0; i < lCmmnCdList.length; i++) {
							lCmmnCdList[i].code = pCmmnCd;
							lCmmnCdList[i].iptName = name;
							lCmmnCdList[i].function = fnc;
						}
						if(useFirstOption) {
							lCmmnCdList.unshift({
								  code: pCmmnCd
								, cmmnCd: ""
								, iptName: name
								, cdnm: firstOptionNm
								, function: fnc
							});
						}
						let lCmmnData = {
							  list: lCmmnCdList
						};

						let template = $.templates("#util_cmmn_cd_li_tmpl");
						let htmlOutput = template.render(lCmmnData);
						obj.html(htmlOutput);
					}
				} else {
					$("#util_uppr_cmmn_cd").val("");
				}
			}, "json", "", "", false);
		}
	},
	allCheck: (pTrgt, pName) => {
		const arrCmmnCdCheckbox = document.getElementsByName(pName);
		arrCmmnCdCheckbox.forEach((cmmnCdCheckbox) => {
			cmmnCdCheckbox.checked = pTrgt.checked;
		});
	},
	allUncheck: (pTrgt, pName) => {
		const is_trgt_checked = pTrgt.checked;
		if (!is_trgt_checked) {
			let all_check_id = pName + "_check_all";
			document.getElementById(all_check_id).checked = false;
		} else {
			let uncheck = 0;
			const arrCmmnCdCheckbox = document.getElementsByName(pName);
			arrCmmnCdCheckbox.forEach((cmmnCdCheckbox) => {
				if (!cmmnCdCheckbox.checked) {
					uncheck++;
				}
			});

			if (uncheck < 1) {
				let all_check_id = pName + "_check_all";
				document.getElementById(all_check_id).checked = true;
			}
		}
	}
};
