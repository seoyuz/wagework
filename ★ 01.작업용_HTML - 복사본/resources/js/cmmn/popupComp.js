

// 팝업 레이어 접두어
const prefixPopupLayerId = "showPopup";

const prssPopup = (popupList) => {
	for (let i = 0 ; i < popupList.length ; i++) {
		let popupConf = popupList[i];

		let cookieName = popupConf.cookiePrefix + popupConf.ppupSeq;
		let value = Cookie.select(cookieName);

		if (!value || popupConf.cyclSeCd == "C04") {
			switch (popupConf.ppupLinkFomTycd) {
				case "T01":
					showPopup(popupConf);
					break;
				case "T02":
					showLayer(popupConf);
					break;
				default:
					break;
			}
		}
	}
};

/* 팝업 오픈 */
const showPopup = (popupConf) => {
	let ppupHgvl = popupConf.ppupHgvl + 48;
	let option  = "chrome, centerscreen, dependent=yes, left=" + popupConf.ppupLeftVllc +", top=" + popupConf.ppupUpedVllc + ",";
		option += "width=" + popupConf.ppupArvl + ", height=" + ppupHgvl + ", ";
		option += "dialog=yes, modal=yes, location=0, status=0, menubar=0, toolbar=0, scrollbars=yes, ";

	// 리사이징 여부
	if (popupConf.mgAdjtPsblYn == "Y") {
		option += "resizable=yes";
	} else {
		option += "resizable=no";
	}

	let href = POPUP_URL + "?ppupSeq=" + popupConf.ppupSeq;
	let popupOpenWin = window.open(href, "showPopup" + popupConf.ppupSeq, option);
	if (popupOpenWin != null) {
		popupOpenWin.focus();
	}

	return false;
};

/* 레이어 오픈 */
const showLayer = (popupConf) => {

	const ppup_id = "showPpup" + popupConf.ppupSeq;
	const btn_id = "btnPpup" + popupConf.ppupSeq;

	// Create Layer Popup
	const objLayer = document.createElement("div");
	objLayer.setAttribute("id", ppup_id);
	objLayer.classList.add("modal-wrap");

	document.body.append(objLayer);

	// Create Open Button
	const objbtn = document.createElement("button");
	objbtn.setAttribute("id", btn_id);
	objbtn.setAttribute("data-popup", ppup_id);
	objbtn.setAttribute("data-main", "Y");
	objbtn.classList.add("modal-btn");
	objbtn.style.display = "none";

	document.querySelector("#divHidden").append(objbtn);

	let params = { ppupSeq : popupConf.ppupSeq };

	$("#" + ppup_id).load(LAYER_URL, params, (responseTxt, statusTxt, response) => {
		if (statusTxt == "success") {
			document.querySelector("#" + btn_id).click();
		} else {
		}
	});
};

/* 부모창으로 URL 이동하고 창닫기 */
const gfn_popupParent = (aObj) => {

	let href = document.querySelector(aObj).getAttrribute("href");
	if (href) {
		location.href = href;
	}

	gfn_hidePopupLayer(aObj);
};

/* 새창을 열어 URL 이동하고 창닫기 */
const gfn_popupCloseWin = (aObj) => {

	let href = document.querySelector(aObj).getAttrribute("href");
	if (href) {
		let option  = "chrome, centerscreen, dependent=yes, dialog=yes, modal=yes, ";
			option += "resizable=yes, scrollbars=yes, location=yes, status=yes, menubar=yes, toolbar=yes";

		let newPopupWin = window.open(href, "gfn_popupWin", option);
		newPopupWin.focus();
	}

	gfn_hidePopupLayer(aObj);
};

/* 새창을 열어 URL 이동하고 창유지 */
const gfn_popupWin = (aObj) => {

	let href = document.querySelector(aObj).getAttrribute("href");
	if (href) {
		let option  = "chrome, centerscreen, dependent=yes, dialog=yes, modal=yes, ";
			option += "resizable=yes, scrollbars=yes, location=yes, status=yes, menubar=yes, toolbar=yes";

		let newPopupWin = window.open(href, "gfn_popupCloseWin", option);
		newPopupWin.focus();
	}
};

/* 현재 클릭된 오브젝트의 팝업 레이어를 hide 시킨다. */
const gfn_hidePopupLayer = (clickEl) => {
	let $popupLayerSn = null;
	let $targetEl = document.querySelector(clickEl);

	while (!$popupLayerSn) {
		$popupLayerSn = gfn_findPopupLayerId($targetEl);
		$targetEl = $targetEl.parent();
	}

	document.querySelector("#" + prefixPopupLayerId + $popupLayerSn).style.display = "none";
};

/* 현재 POP 내용의 레이어 ID를 찾는다. */
const gfn_findPopupLayerId = ($child) => {
	let $parent = $child.parent();
	let parentId = $parent.getAttrribute("id");

	if (parentId && parentId.indexOf(prefixPopupLayerId) === 0) {
		let len = prefixPopupLayerId.length;
		return parentId.substring(len);
	}

	return null;
};