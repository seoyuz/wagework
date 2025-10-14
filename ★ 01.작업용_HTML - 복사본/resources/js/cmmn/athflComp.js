/**
 * 첨부파일 컴포넌트
 * example :
 *    // 첨부파일
      let sampleMulti;
      $(document).ready(function() {
          // 첨부파일 컴포넌트 초기화
          const atchConfig = {moduleId		: "sample_multi"		// (필수)
                            , fileDiv		: "sampleMultiFile"		// (선택)<div class="multi-file-wrap" id="sampleMultiFile"></div> .. 값이 없으면 moduleId를 사용
                            , afidNm		: 'afid'				// (필수)서버에 전달할 변수명과 일치
                            , atchFsnoNm	: 'atchFsno'			// (필수)서버에 전달할 변수명과 일치
                            , fileNm		: "mainAthfl"			// (필수)서버에 전달할 변수명과 일치
                            //, altTextNm	: "sampleTextarea"		// (선택)서버에 전달할 변수명과 일치
                           };
          sampleMulti = new CmmnAthflComp(atchConfig);
      });
 */
class CmmnAthflComp {
        FILE_COMP_ID = "";
        FILE_NAME = "";
        FILE_ALT_TEXT_NAME = "";
        ATTR_AFID_NAME = "";
        ATTR_ATCH_FSNO_NAME = "";
        ADD_BTN_ID = "";
        FILE_STATUS = "";
        ALT_TEXT_USE = false;
        CHKBOX_USE = false;
        COMP_STATUS = "";
        AJAX_ASYNC = true;
        ATCH_MAX_COUNT = -1;	// -1은 제한 없음
        ATCH_CURR_COUNT = 0;
        AFID;
        DRAG_COUNTER = 0;


        _CONST_FILEBOX = "filebox";
        _CONST_FILE_SIZE = "atchFlsz";
        _CONST_GET_UPLOAD_INFO_URL = "/pt/cmmn/getUploadConfig.do";
        _CONST_COMP_STATUS_READONLY = "READONLY";
        _CONST_COMP_STATUS_NORMAL = "NORMAL";
        _CONST_MAX_COUNT_OVER = "maxCountOver";
        _CONST_CSS_EXISTING = "existing";
        _CONST_CSS_READONLY = "disabled-toggle";
        _CONST_CSS_DIV_HIGHLIGHT = "dragdrop";


        _COMP_TYPE_ADD_CONTENTS = "ADD_CONTENTS";
        _COMP_TYPE_SINGLE = "SINGLE";
        _COMP_TYPE_MULTIPLE = "MULTIPLE";

        $FILE_BOX;
        $FILE_LIST_AREA;
        $FILE;
        //$FILE_INFO_AREA;

        //MULTIPLE_FILES_ARRAY = new Array();

        uploadInfo = {
                compType : "SINGLE"
                , eachFlsz : "N/A"
                , eachFlszLong : 0
                , totFlsz : "N/A"
                , totFlszLong : 0
                , allowExt : "N/A"
        }

        // 생성자
        constructor(config) {
            this.FILE_COMP_ID			= config.fileDiv		|| config.moduleId;
            this.FILE_NAME				= config.fileNm			|| "file";
            this.FILE_ALT_TEXT_NAME		= config.altTextNm		|| "";
            this.ATTR_AFID_NAME			= config.afidNm			|| "afid";
            this.ATTR_ATCH_FSNO_NAME	= config.atchFsnoNm		|| "atchFsno";
            this.ALT_TEXT_USE			= (this.FILE_ALT_TEXT_NAME == "") ? false : true;	// FILE_ALT_TEXT_NAME 값이 있는 경우만 사용
            this.AJAX_ASYNC				= config.ajaxAsync		|| true;
            this.ATCH_MAX_COUNT			= config.atchMaxCount	|| -1;
            this.AFID					= config.afid			|| null;

            this.getUploadConfig(config.moduleId);
        }

        getUploadConfig(moduleId) {
            Submit.ajax(undefined
                      , "moduleId="+moduleId
                      , function(result, params) {
                            const data = result.data;
                            this.setUploadConfig(data.uploadInfo);
                        }.bind(this)
                      , 'json'
                      , this._CONST_GET_UPLOAD_INFO_URL
                      , undefined
                      , this.AJAX_ASYNC
                      );
        }

        setUploadConfig(uploadInfo) {
            //uploadInfo.compType = "SINGLE";
            this.uploadInfo = {...uploadInfo};

            // multiple 에서는 이미지대체텍스트 사용하지 않음
            if (this.isCompTypeMuitiple() == true) {
                this.FILE_ALT_TEXT_NAME = "";
                this.ALT_TEXT_USE	= false;
                this.CHKBOX_USE	= true
            } else if (this.uploadInfo.compType == this._COMP_TYPE_SINGLE) {
                this.ATCH_MAX_COUNT = 1;
            }

            this.init();
            this.addContents();

            if (this.AFID != null) {
                this.loadData(this.AFID);
            }
        }

        //constructor() => getUploadConfig() => setUploadConfig() => init()
        init() {

            this.ADD_BTN_ID = this.FILE_COMP_ID + "_ADD_BTN";
            const visibleValue = (this.uploadInfo.compType == this._COMP_TYPE_ADD_CONTENTS) ? "" : "display:none";
            const $div = $("<div>", {class : "add-button-box", id : this.ADD_BTN_ID, style : visibleValue});
            const $addBtn = $("<button>", {type : "button", class : "btn add"}).append("콘텐츠 영역 추가");
            $addBtn.on('click', function() {
                this.addContents();
            }.bind(this))
            $div.append($addBtn);

            const $afid = $("<input>", {type : 'hidden', id : this.ATTR_AFID_NAME, name : this.ATTR_AFID_NAME});

            $("#" + this.FILE_COMP_ID).append($afid).append($div);
        }

        link(type, $src, $dest) {
            if (type == "click") {
                $src.on("click", function() {
                    $dest.trigger('click');
                });
            } else if (type == "focus") {
                $src.on("click", function() {
                    $dest.focus();
                });
            } else if (type == "download") {
                $src.on("click", function() {
                    const $downloadObj = $("<a>", {href : "/pt/cmmn/fileDownload.do?athflParam=" + $dest, download : "download"});
                    $("body").append($downloadObj);
                    $downloadObj[0].click();
                    $downloadObj.remove();
                });
            }

        }
        defaultOpt(opt) {

            if (opt == null || opt == undefined) {
                opt = {};
            }

            opt.isSavedFile = opt.isSavedFile || false;
            opt.$replaceFileBox = opt.$replaceFileBox || "LAST";
            return opt;
        }

        checkAtchMaxCount() {
            if (this.ATCH_MAX_COUNT > -1) {

                let isAtchMaxCountOver = false;
                if (this.isCompTypeMuitiple() == true) {
                    this.ATCH_CURR_COUNT = $("#" + this.FILE_COMP_ID).find(".item-file").length;

                    if (this.ATCH_CURR_COUNT > this.ATCH_MAX_COUNT) {	// 초과하는지
                        isAtchMaxCountOver = true;
                    }
                } else {
                    this.ATCH_CURR_COUNT = $("#" + this.FILE_COMP_ID).find("div.filebox").length;
                    if (this.ATCH_CURR_COUNT >= this.ATCH_MAX_COUNT) {	// 최대 개수에 도달하였는지
                        isAtchMaxCountOver = true;
                    }

                }


                if (this.isCompTypeMuitiple() == true) {
                    if (isAtchMaxCountOver == true) {



                        var existCnt = $("#" + this.FILE_COMP_ID).find(".item-file." + this._CONST_CSS_EXISTING).length;
                        var newCnt   = $("#" + this.FILE_COMP_ID).find(".item-file:not(." + this._CONST_CSS_EXISTING + ")").length;

                        //var overCnt = (existCnt + newCnt) - this.ATCH_MAX_COUNT ;
                        //var removeCnt = (overCnt > newCnt) ? newCnt : overCnt;
                        var tmpCnt = this.ATCH_MAX_COUNT - existCnt

                        const dataTransfer = new DataTransfer();
                        for (var i = 0 ; i < tmpCnt ; i++) {
                            dataTransfer.items.add(this.$FILE[0].files[i]);
                        }

                        this.$FILE[0].files = dataTransfer.files;

                        let removeFileItems = function(keepCount) {
                            const $itemFiles = $("#" + this.FILE_COMP_ID).find(".item-file:not(." + this._CONST_CSS_EXISTING + ")");
                            if ($itemFiles.length > keepCount) {
                                $itemFiles.slice(keepCount).remove();
                            }
                        }.bind(this);
                        removeFileItems(dataTransfer.files.length);
                        alert("첨부 가능한 파일 개수를 초과하였습니다.\n 초과된 파일은 취소 됩니다.");
                        return this._CONST_MAX_COUNT_OVER;
                    }

                } else {
                    if (isAtchMaxCountOver == true) {
                        $("#" + this.ADD_BTN_ID).hide()
                    } else {
                        $("#" + this.ADD_BTN_ID).show()
                    }

                }
            }


        }

        // 첨부파일 영역을 추가
        addContents(opt) {
            if (this.isCompTypeMuitiple() == true) {
                this._addContents_multiple(opt);

            } else {
                this._addContents_normal(opt);
                this.checkAtchMaxCount();

            }
            this.$FILE_BOX.on ("dragenter", function(event) {
                event.preventDefault();	// 기본동작 방지(파일이 브라우저에서 열리는것 방지)
                this.DRAG_COUNTER++;
                $(event.currentTarget).addClass(this._CONST_CSS_DIV_HIGHLIGHT);
            }.bind(this)).on ("dragover", function(event) {
                event.preventDefault();	// 기본동작 방지(파일이 브라우저에서 열리는것 방지)
            }.bind(this)).on ("dragleave", function(event) {
                this.DRAG_COUNTER--
                if (this.DRAG_COUNTER === 0) {
                    $(event.currentTarget).removeClass(this._CONST_CSS_DIV_HIGHLIGHT);
                }
            }.bind(this)).on ("drop", function(event) {
                event.preventDefault();	// 기본동작 방지(파일이 브라우저에서 열리는것 방지)
                $(event.currentTarget).find("input[type='file']")[0].files = event.originalEvent.dataTransfer.files;	// 드롭된 파일 갖고 오기
                $(event.currentTarget).find("input[type='file']").change();

                this.DRAG_COUNTER = 0
                $(event.currentTarget).removeClass(this._CONST_CSS_DIV_HIGHLIGHT);

            }.bind(this));


        }
        _addContents_multiple(opt) {
            // 기본값
            opt = this.defaultOpt(opt);

            const $filebox = $("<div>", {class : this._CONST_FILEBOX +' image' });
            this.$FILE_BOX = $filebox;

            const $filebox_fileInfo =  $("<div>", {class : 'file-inp ' + ((opt.isSavedFile == true) ? "disabled" : "") });
            const $filebox_fileInfo_span = $("<span>").append("파일은 최대 "+ this.uploadInfo.eachFlsz + "까지 등록 가능합니다.");

            $filebox_fileInfo.append($filebox_fileInfo_span);
            $filebox.append($filebox_fileInfo);

            const $filebox_file = $("<input>", {type : 'file', class : "change-file none", title : '파일선택', name : this.FILE_NAME, multiple : true});
            $filebox.append($filebox_file);
            this.$FILE = $filebox_file;

            const $filebox_fileSearchBtn = $("<label>", {class : "file-btn " + ((opt.isSavedFile == true) ? "disabled" : "")}).append("파일찾기");
            $filebox.append($filebox_fileSearchBtn);

            // 파일선택(readonly에서는 파일 찾기 안함)
            if (opt.isSavedFile == false) {
                this.link('click', $filebox_fileSearchBtn, $filebox_file);
            }

            const $filebox_fileDeleteBtn = $("<button>", {type : 'button', class : "file-reset-btn " + ((opt.isSavedFile == true) ? "disabled" : "")}).append("선택 파일 삭제");
            $filebox.append($filebox_fileDeleteBtn);


            const $filebox_fileList = $("<div>", {class : 'file-list'});

            $filebox.append($filebox_fileList);

            // keep
            this.setFileListArea($filebox_fileList);

            $filebox_file.on('change', function(event) {
                if (opt.isSavedFile == true) return;

                $("#" + this.FILE_COMP_ID).find(".file-list > div.item-file:not(."+this._CONST_CSS_EXISTING + ")").remove();

                this.addLocalFile($filebox_file[0]);
                this.checkAtchMaxCount();
            }.bind(this));

            // 선택 파일 삭제 이벤트
            $filebox_fileDeleteBtn.on('click', function() {
                this.deleteCheckedFile($filebox_file, $filebox_fileList);
            }.bind(this));

            $("#" + this.FILE_COMP_ID).append($filebox);
        }
        _addContents_normal(opt) {

            // 기본값
            opt = this.defaultOpt(opt);

            const $filebox = $("<div>", {class : this._CONST_FILEBOX +' image' });
            this.$FILE_BOX = $filebox;

            const $filebox_fileInfo =  $("<div>", {class : 'file-inp ' + ((opt.isSavedFile == true) ? "disabled" : "") });
            const $filebox_fileInfo_span = $("<span>").append("파일은 최대 "+ this.uploadInfo.eachFlsz + "까지 등록 가능합니다.");

            $filebox_fileInfo.append($filebox_fileInfo_span);
            $filebox.append($filebox_fileInfo);

            const $filebox_file = $("<input>", {type : 'file', class : "change-file none", title : '파일선택', name : this.FILE_NAME});
            $filebox.append($filebox_file);

            const $filebox_fileSearchBtn = $("<label>", {class : "file-btn " + ((opt.isSavedFile == true) ? "disabled" : "")}).append("파일찾기");
            $filebox.append($filebox_fileSearchBtn);

            // 파일선택(readonly에서는 파일 찾기 안함)
            if (opt.isSavedFile == false) {
                this.link('click', $filebox_fileSearchBtn, $filebox_file);
            }

            const $filebox_fileDeleteBtn = $("<button>", {type : 'button', class : "file-reset-btn " + ((opt.isSavedFile == true) ? "" : "") }).append("파일 삭제");
            $filebox.append($filebox_fileDeleteBtn);


            const $filebox_fileList = $("<div>", {class : 'file-list'});
            const $filebox_fileList_atchFsno = $("<input>", {type : 'hidden', class : this.ATTR_ATCH_FSNO_NAME, name : this.ATTR_ATCH_FSNO_NAME});
            $filebox_fileList.append($filebox_fileList_atchFsno);
            const $filebox_fileList_atchFlsz = $("<input>", {type : 'hidden', class : this._CONST_FILE_SIZE, value : 0});
            $filebox_fileList.append($filebox_fileList_atchFlsz);

            if (this.ALT_TEXT_USE == true) {
                const $filebox_fileList_altText = $("<textarea>", {class : 'inp', title : '대체텍스트 입력', placeholder : '이미지 대체 텍스트', name : this.FILE_ALT_TEXT_NAME, maxlength : 1000});
                $filebox_fileList.append($filebox_fileList_altText);
            } else {
                const $filebox_fileList_altText = $("<input>", {type : "hidden", name : this.FILE_ALT_TEXT_NAME});
                $filebox_fileList.append($filebox_fileList_altText);
            }

            $filebox.append($filebox_fileList);

            // keep
            this.setFileListArea($filebox_fileList);


            const $filebox_contentsDelete = $("<div>", {class : 'right-button-box'});
            $filebox.append($filebox_contentsDelete);

            if (this.uploadInfo.compType == this._COMP_TYPE_ADD_CONTENTS) {
                const $filebox_contentsDelete_button = $("<button>", {type : 'button', class : 'btn del'});
                $filebox_contentsDelete_button.append("콘텐츠 영역 삭제");
                $filebox_contentsDelete.append($filebox_contentsDelete_button);
                // 콘텐츠 삭제 이벤트
                $filebox_contentsDelete_button.on('click', function() {
                    $filebox.remove();

                    const count = $("#" + this.FILE_COMP_ID).find('.' + this._CONST_FILEBOX).length;
                    if (count == 0) {
                        this.addContents();
                    } else {
                        this.checkAtchMaxCount();
                    }
                }.bind(this));
            }

            $filebox_file.on('change', function() {
                if (opt.isSavedFile == true) return;
                this.setFileListArea($filebox_fileList);
                this.addLocalFile($filebox_file[0]);
            }.bind(this));


            // 선택 파일 삭제 이벤트
            $filebox_fileDeleteBtn.on('click', function() {
                if (opt.isSavedFile == true) {
                    this.addContents({$replaceFileBox : $filebox});
                    $filebox.remove();
                } else {
                    this.deleteFile($filebox_file, $filebox_fileList);
                }
            }.bind(this));

            if (opt.$replaceFileBox == "LAST") {
                $("#" + this.ADD_BTN_ID).before($filebox);
            } else {
                opt.$replaceFileBox.before($filebox);
            }
        }

        addLocalFile(fileObj) {
            const multiple = fileObj.multiple;

            if (multiple == true && this.uploadInfo.compType != this._COMP_TYPE_MULTIPLE) {
                alert('본 스크립트는 Multiple 속서을 지원하지 않습니다.');
                return;
            }
            const files = fileObj.files;

            if (files.length == 0) {
                alert('선택된 파일이 없습니다.');
                return;
            }

            if (this.isCompTypeMuitiple() == true) {
                // 멀티플

                var filePreviewArray = this.addMultipleFile(files);

                // 파일 정보 표시
                this.localMultipleFileRead(filePreviewArray, files);


                Array.from(files).forEach((file) => {
                    if (this.validateFiles(file) == false) {

                        this.deleteFile(file, this.getFileListArea());
                    }
                });

            } else {
                // 단건
                const file = files[0];

                let $filePreview = this.addFile("", {atchFsno : -1, athflGudnCn : "", athflParam : "", atchFlsz : file.size});

                // 파일 정보 표시
                this.localFileRead($filePreview, file);

                if (this.validateFiles(file) == false) {
                    this.deleteFile($(fileObj), this.getFileListArea());
                }
            }
        }

        validateFiles(file) {
            if (this.isCompTypeMuitiple() == true) {
                //return this._validateFiles_multiple(file);
                return this._validateFiles_normal(file);
            } else {
                return this._validateFiles_normal(file);
            }
        }
        _validateFiles_multiple(files) {

            const eachFlszLong = this.uploadInfo.eachFlszLong;
            const totFlszLong = this.uploadInfo.totFlszLong || eachFlszLong;
            const allowExt = this.uploadInfo.allowExt;

            // 파일 개별 사이즈 체크
            {
                for (var i = 0 ; i < files.length ; i++) {
                    const flsz = files[i].size;
                    if (eachFlszLong < flsz) {
                        alert(this.getMessage('fileSizeOverEach', eachFlszLong, flsz));
                        return false;
                    }
                }
            }

            // 전체 파일 사이즈 체크
            {
                let totFlsz = 0;
                const $fileSizeList = $("#" + this.FILE_COMP_ID).find('.' + this._CONST_FILE_SIZE);
                for(var i = 0 ; i < $fileSizeList.length ; i++) {
                    totFlsz += Number($fileSizeList.val());
                }

                if (totFlszLong < totFlsz) {
                    alert(this.getMessage('fileSizeOverTot', totFlszLong, totFlsz));
                    return false;
                }
            }

            // 파일 허용 확장자 체크
            {
                for (var i = 0 ; i < files.length ; i++) {
                    const fileName = files[i].name;
                    const fileExt = fileName.split(".").pop();

                    if (fileExt == fileName) {	// 확장자가 없는 파일
                        alert(this.getMessage('fileExtionBlank', fileName));
                        return false;
                    }

                    if ((allowExt+".").indexOf("."+fileExt+".") == -1) {
                        alert(this.getMessage('fileExtionNotAllow', fileName));
                        return false;
                    }
                }
            }
        }
        _validateFiles_normal(file) {
            const eachFlszLong = this.uploadInfo.eachFlszLong;
            const totFlszLong = this.uploadInfo.totFlszLong || eachFlszLong;
            const allowExt = this.uploadInfo.allowExt;

            // 파일 개별 사이즈 체크
            {
                const flsz = file.size;
                if (eachFlszLong < flsz) {
                    alert(this.getMessage('fileSizeOverEach', eachFlszLong, flsz));
                    return false;
                }
            }

            // 전체 파일 사이즈 체크
            {
                let totFlsz = 0;
                const $fileSizeList = $("#" + this.FILE_COMP_ID).find('.' + this._CONST_FILE_SIZE);
                for(var i = 0 ; i < $fileSizeList.length ; i++) {
                    totFlsz += Number($fileSizeList.val());
                }

                if (totFlszLong < totFlsz) {
                    alert(this.getMessage('fileSizeOverTot', totFlszLong, totFlsz));
                    return false;
                }
            }

            // 파일 허용 확장자 체크
            {
                const fileName = file.name;
                const fileExt = fileName.split(".").pop();

                if (fileExt == fileName) {	// 확장자가 없는 파일
                    alert(this.getMessage('fileExtionBlank', fileName));
                    return false;
                }

                if ((allowExt+".").indexOf("."+fileExt+".") == -1) {
                    alert(this.getMessage('fileExtionNotAllow', fileName));
                    return false;
                }
            }



            return true;
        }
        getMessage(type, opt1, opt2) {

            if (type == "fileSizeOverEach") {
                let val1 = Str.addComma(opt1);
                let val2 = Str.addComma(opt2);
                val1 = Str.leftPad(val1, val2.length);
                return "첨부 가능한 파일사이즈를 초과 하였습니다.\n최대 : " + val1+ " Byte\n입력 : "+ val2 + " Byte";

            } else if (type == "fileSizeOverTot") {
                let val1 = Str.addComma(opt1);
                let val2 = Str.addComma(opt2);
                val1 = Str.leftPad(val1, val2.length);
                return "첨부 가능한 총 파일사이즈를 초과 하였습니다.\n최대 : " + val1+ " Byte\n입력 : "+ val2 + "  Byte";

            } else if (type == "fileExtionBlank") {
                return "첨부할수 없는 파일입니다.\n파일명 : "+ opt1;

            } else if (type == "fileExtionNotAllow") {
                return "첨부할수 없는 파일입니다.\n파일명 : "+ opt1;

            }

        }

        addServerFile(file) {
            let $filePreview = this.addFile(this._CONST_CSS_EXISTING, file);

            // 파일 정보 표시
            this.serverFileRead($filePreview, file);
        }

        deleteFile(file, $fileList) {


            if (this.isCompTypeMuitiple() == true) {
                const dataTransfer = new DataTransfer();
                Array.from(this.$FILE[0].files).forEach((inpFile) => {
                    if (inpFile.name == file.name) {
                        return;	// continue;
                    } else {
                        dataTransfer.items.add(inpFile);
                    }
                });

                this.$FILE[0].files = dataTransfer.files;

                //this.MULTIPLE_FILES_ARRAY = Array.from(this.$FILE[0].files);

                $fileList.find(".item-file:not(." + this._CONST_CSS_EXISTING + ")").each(function() {
                    $(this).remove();
                });

                this.addLocalFile(this.$FILE[0]);

            } else {
                // 1.파일 객체에서 파일 정보 삭제
                let $file = $(file);
                $file.val("");

                // 2.span 삭제
                $fileList.find(".item-file:not(." + this._CONST_CSS_EXISTING + ")").each(function() {
                    $(this).remove();
                });

                $fileList.find("."+ this.ATTR_ATCH_FSNO_NAME).each(function() {
                    $(this).val("");
                });

                $fileList.find("."+ this._CONST_FILE_SIZE).each(function() {
                    $(this).val(0);
                });
            }


            //this.addFile("", {atchFsno : "", athflGudnCn : "", athflParam : "", atchFlsz : 0})
        }

        localMultipleFileRead(filePreviewArray, files) {

            for (var i = 0 ; i < files.length ; i++) {
                var file = files[i];
                var $filePreview = filePreviewArray[i];
                this.localFileRead($filePreview, file);
            }
        }

        addMultipleFile (files) {
            let filePreviewArray = new Array();
            for (var i = 0 ; i < files.length ; i++) {
                var file = files[i];
                let $filePreview = this.addFile("", {atchFsno : -1, athflGudnCn : "", athflParam : "", atchFlsz : file.size});
                filePreviewArray.push($filePreview);
            }
            return filePreviewArray;
        }

        addFile(existing, file) {
            if (this.isCompTypeMuitiple() == true) {
                return this._addFile_multiple(existing, file);
            } else {
                return this._addFile_normal(existing, file);
            }
        }

        _addFile_multiple(existing = "", file = {atchFsno : -1, athflGudnCn : "", athflParam : "", atchFlsz : 0}) {

            const $fileList = this.getFileListArea();

            const $fileItem = $("<div>", {class : "item-file "+ existing});

            const $filebox_fileList_atchFsno = $("<input>", {type : 'hidden', class : this.ATTR_ATCH_FSNO_NAME, name : this.ATTR_ATCH_FSNO_NAME, value : file.atchFsno});
            $fileItem.append($filebox_fileList_atchFsno);
            const $filebox_fileList_atchFlsz = $("<input>", {type : 'hidden', class : this._CONST_FILE_SIZE, value : file.atchFlsz});
            $fileItem.append($filebox_fileList_atchFlsz);

            const $fileItem_checkboxDiv = $("<div>", {class : "checkbox"});
            $fileItem.append($fileItem_checkboxDiv);

            const $fileItem_checkboxDiv_checkbox = $("<input>", {type : "checkbox"})
            $fileItem_checkboxDiv.append($fileItem_checkboxDiv_checkbox);

            const $fileItem_checkboxDiv_preview = $("<label>", {class : 'none' });
            this.link("click", $fileItem_checkboxDiv_preview, $fileItem_checkboxDiv_checkbox);

            $fileItem_checkboxDiv.append($fileItem_checkboxDiv_preview);

            if (existing == this._CONST_CSS_EXISTING) {

                const $filebox_fileList_download = $("<button>", {type : 'button', class : "btn download2"});
                const $filebox_fileList_download_text = $("<span>", {class : 'blind'}).append("다운로드");
                $filebox_fileList_download.append($filebox_fileList_download_text)
                $fileItem.append($filebox_fileList_download);
                this.link("download", $filebox_fileList_download, file.athflParam);
            }


            $fileList.append($fileItem);

            return $fileItem_checkboxDiv_preview;
        }

        _addFile_normal(existing = "", file = {atchFsno : -1, athflGudnCn : "", athflParam : "", atchFlsz : 0}) {

            const $fileList = this.getFileListArea();

            // 단일 첨부파일 인 경우 기존 내용 삭제
            $fileList.html("");

            const $filebox_fileList_atchFsno = $("<input>", {type : 'hidden', class : this.ATTR_ATCH_FSNO_NAME, name : this.ATTR_ATCH_FSNO_NAME, value : file.atchFsno});
            $fileList.append($filebox_fileList_atchFsno);
            const $filebox_fileList_atchFlsz = $("<input>", {type : 'hidden', class : this._CONST_FILE_SIZE, value : file.atchFlsz});
            $fileList.append($filebox_fileList_atchFlsz);

            const $fileItem = $("<div>", {class : "item-file "+ existing + " padding-hidden"});
            //item-file existing padding-hidden

            const $fileItem_checkboxDiv = $("<div>", {class : "checkbox"});
            $fileItem.append($fileItem_checkboxDiv);

            const $fileItem_checkboxDiv_checkbox = $("<input>", {type : "checkbox"})
            $fileItem_checkboxDiv.append($fileItem_checkboxDiv_checkbox);

            const $fileItem_checkboxDiv_preview = $("<label>");

            if (existing == this._CONST_CSS_EXISTING) {
                this.link("download", $fileItem_checkboxDiv_preview, file.athflParam);
            }

            $fileItem_checkboxDiv.append($fileItem_checkboxDiv_preview);

            if (this.ALT_TEXT_USE == true) {
                const $fileItem_altText = $("<textarea>", {class : 'inp', title : '대체텍스트 입력', placeholder : '이미지 대체 텍스트', name : this.FILE_ALT_TEXT_NAME, maxlength : 1000});
                $fileItem_altText.val(file.athflGudnCn)
                $fileItem.append($fileItem_altText);
            } else {
                const $fileItem_altText = $("<input>", {type : "hidden", name : this.FILE_ALT_TEXT_NAME, value : file.athflGudnCn});
                $fileItem.append($fileItem_altText);
            }

            $fileList.append($fileItem);

            return $fileItem_checkboxDiv_preview;
        }

        localFileRead($fileList, file) {

            // FileReader(javascript) 객체
            const reader = new FileReader();
            reader.onload = function(event) {
                const fileName = file.name;

                if (file && file.type.indexOf("image/") == 0 ) {					// 첨부파일 유형이 image 형태인 경우만 처리
                    const $image = $("<img>", {src : event.target.result, alt : fileName});
                    $fileList.append($image).append(fileName);
                } else {
                    const $span = $("<span>", {class : "txt"});
                    $fileList.append($span).append(fileName);
                }
            }.bind(this);
            reader.readAsDataURL(file);
        }

        serverFileRead($filePreview, file) {

            const fileSrc = file.athflParam;
            const fileName = file.realFlnm;
            const isImage = file.isImage;

            if (isImage == true) {
                const $image = $("<img>", {src : "/pt/cmmn/fileDownload.do?athflParam=" + fileSrc, alt : fileName});
                $filePreview.append($image).append(fileName);
            } else {
                const $span = $("<span>", {class : "txt"});
                $filePreview.append($span).append(fileName);
            }

        }

        clear() {
            if (this.isCompTypeMuitiple() == true) {
                $("#" + this.FILE_COMP_ID).find(".file-list").html("");
            } else {
                $("#" + this.FILE_COMP_ID).html("");
                this.init();
            }
        }


        // 서버로부터 첨부파일을 불러 옴
        loadData(afid) {
            Submit.ajax(undefined
                      , "afid=" + afid
                      , function(result, params) {
                            const data = result.data;
                            this.setLoadData(data.fileInfo);
                        }.bind(this)
                      , 'json'
                      , "/pt/cmmn/fileLoad.do");
        }

        setLoadData(regFileInfo) {

            this.clear();

            if (regFileInfo == null || regFileInfo == undefined) return;
            if (regFileInfo.files == null || regFileInfo.files == undefined) return;

            $("#" + this.ATTR_AFID_NAME).val(regFileInfo.afid);

            for (let i = 0 ; i < regFileInfo.files.length ; i++) {
                if (this.isCompTypeMuitiple() == true) {
                    this.addServerFile(regFileInfo.files[i]);
                } else {
                    this.addContents({isSavedFile : true});
                    this.addServerFile(regFileInfo.files[i]);
                }
            }
            this.applyStatus();
        }

        // 첨부된 파일 중
        deleteCheckedFile($file, $fileList) {
            if (this.isCompTypeMuitiple() == true) {
                let addedIdx = -1;
                let removeAddedFiles = new Array();
                // 2.span 삭제
                $fileList.children().each(function() {
                    if ($(this).is(":not(.existing)")) {
                        addedIdx++;
                    }
                    if ($(this).find("input[type='checkbox']").is(":checked")) {
                        $(this).remove();
                        removeAddedFiles.push(addedIdx);
                    }
                });
                let removeFiles = function(arr,indexes) {
                    return Array.from(arr).filter((_, index) => !indexes.includes(index));
                };
                const newArr = removeFiles($file[0].files, removeAddedFiles);

                //alert(newArr.join());

                const dataTransfer = new DataTransfer();
                Array.from(newArr).forEach((inpFile) => {
                    dataTransfer.items.add(inpFile);
                });

                $file[0].files = dataTransfer.files;

            } else {
                // 1.파일 객체에서 파일 정보 삭제
                const inputFile = $file[0];
                inputFile.value = "";

                // 2.span 삭제
                $fileList.children().each(function() {
                    if ($(this).find("input[type='checkbox']").is(":checked")) {
                        $(this).remove();
                    }
                });

            }
        }

        //setFileInfoArea($fileInfoArea) {
        //	this.$FILE_INFO_AREA = $fileInfoArea;
        //}

        //getFileInfoArea() {
        //	return this.$FILE_INFO_AREA;
        //}

        // 파일 목록 영역 SET
        setFileListArea($fileListArea) {
            this.$FILE_LIST_AREA = $fileListArea;
        }

        // 파일 목록 영역 GET
        getFileListArea() {
            return this.$FILE_LIST_AREA;
        }

        // Readonly 여부 설정
        setReadonly(bReadonly) {
            this.COMP_STATUS = (bReadonly == true) ? this._CONST_COMP_STATUS_READONLY : this._CONST_COMP_STATUS_NORMAL;
            this.applyStatus();
        }

        // 현재 상태 조회
        getStatus() {
            return this.COMP_STATUS || this._CONST_COMP_STATUS_NORMAL;
        }

        // 컴포넌트 상태를 반영 함
        applyStatus() {

            const status_readonly_grp_1 = "input[type='text'], input[type='checkbox']";
            const status_readonly_grp_2 = "input[type='button'], button";
            const status_readonly_grp_3 = "input[type='file']";
            const status_readonly_grp_4 = "div.file-inp, label.file-btn, button.file-reset-btn";

            const status = this.getStatus();
            if (status == this._CONST_COMP_STATUS_READONLY) {
                $("#" + this.FILE_COMP_ID).find(status_readonly_grp_1).prop("readonly", true);
                $("#" + this.FILE_COMP_ID).find(status_readonly_grp_2).hide();
                $("#" + this.FILE_COMP_ID).find(status_readonly_grp_3).on ('click.prevent', function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                });
                if ($("#" + this.FILE_COMP_ID).find(status_readonly_grp_4).hasClass(this._CONST_CSS_READONLY) ==false) {
                    $("#" + this.FILE_COMP_ID).find(status_readonly_grp_4).addClass(this._CONST_CSS_READONLY);
                }

            } else if (status == this._CONST_COMP_STATUS_NORMAL) {
                $("#" + this.FILE_COMP_ID).find(status_readonly_grp_1).prop("readonly", false);
                $("#" + this.FILE_COMP_ID).find(status_readonly_grp_2).show();
                $("#" + this.FILE_COMP_ID).find(status_readonly_grp_3).off ('click.prevent');

                if ($("#" + this.FILE_COMP_ID).find(status_readonly_grp_4).hasClass(this._CONST_CSS_READONLY) == true) {
                    $("#" + this.FILE_COMP_ID).find(status_readonly_grp_4).removeClass(this._CONST_CSS_READONLY);
                }

            }
        }

        isCompTypeMuitiple() {
            return (this.uploadInfo.compType == this._COMP_TYPE_MULTIPLE)
        }

        test() {
            alert(this.$FILE[0].files.length);
        }

}