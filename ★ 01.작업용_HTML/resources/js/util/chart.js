/****************************************************************
 *
 * 파일명 : chart.js
 * 설  명 : 통합형 임금직무정보시스템 차트 기능 사용 JavaScript
 *
 *    수정일      수정자      Version        Function 명
 * ----------    -------    -------------  ----------------------------
 * 2024.12.21    kang.w       1.0            최초생성
 *
 * **************************************************************/

const chart = {
    // 차트 공통 설정
    config: (type) => {
        if(type == 'radar') {
            let chartConfObj = {
            	global: {
                        milestone: "",
                        animation: {
					      show: true,
						},
						padding: {
					    	left: 5,
					    	bottom:3,
					    	top:3
					    }
                },
                data: {
                            json: "",
                            keys: {
                                  x: "",
                                  value: []
                            },
                            type: "radar",
                            noData: "데이터가 없습니다.",
                            useJsonData: true,
                },
                axis:{
                        y: {
                        	domain: {
                                show: false
                            },
                        },
                        x: {
                            domain: {
                                show: false
                            },
                        }
                },
                extend: {
                            radar: {
                                area: true,
                                margin: 0,
                                axis: {
                                    maxValue:0,
                                    minValue:0
                                }
                            }
                },
                legend: {
                            show: false
                },
                tooltip: {
                        custom: function(data) {
                              //console.log("click event : data = ", data);
                              let jKey = Object.keys(data[0].originJson)[1];
                              return '<div style="color: white; border: 1px solid blue;">' +
                              data[0].originJson[chartConfObj.data.keys.x] + " : "  + data[0].value + '</div>';
                        }
                },
            }

            return chartConfObj;
        } else if(type == 'bar') {
            let chartConfObj = {
	            global: {
	                        milestone: "",
	                        animation: {
						      show: true,
							},
							padding: {
						    	left: 5,
						    	bottom:3,
						    	top:3
						    }
	            },
	            data: {
	                        json: "",
	                        keys: {
	                              x: "",
	                              value: []
	                        },
	                        type: "bar",
	                        labels: {
	                        	format: function(value) { return value.toLocaleString(); }
	                        },
	                        noData: "데이터가 없습니다.",
	                        useJsonData: true
	            },
	            legend: {
	                        show: false
	            },
	            grid: {
	            			y: {
	            			},
	                        x: {
	                              show: false
	                        }
	            },
	            axis:{
	                        x:{
	                        		type : 'category',
	                              	domain: {
	                                	show: false
	                              	},
	                              	tick: {
	                              		line: {
	                                		show: false
	                            		}
	                              	},
	                        },
	                        y: {
	                        		zerobased: true,
	                              	domain: {
	                                	show: false
	                                  	},
	                              	tick: {
	                                	line: {
	                                    	show: false
	                                	},
	                                	format : function(d) { return d.toLocaleString() + "";}
	                            	}
	                        }
	            },
	            tooltip: {
	                        custom: function(data) {
	                              let jKey = Object.keys(data[0].originJson)[1];
	                              return '<div style="color: white; border: 1px solid blue; height:25px; line-height:25px; padding-left:5px;">' +
	                              data[0].originJson[chartConfObj.data.keys.x] + " : "  + data[0].value + '</div>';
	                        }
	            },
	            extend: {
	                        bar: {
	                            width: {
	                                  max: 50
	                            },
	                            showZeroValue: true
	                        }
	            }
			}

			return chartConfObj;
		} else if(type == 'line') {
            let chartConfObj = {
	            global: {
	            			milestone: "",
	                        animation: {
						      show: true,
							},
							padding: {
						    	left: 5,
						    	bottom:3,
						    	top:3
						    }
				},
	            data: {
	                        json: "",
	                        keys: {
	                              x: "",
	                              value: []
	                        },
	                        type: "line",
	                        labels: {
	                        	format: function(value) { return value.toLocaleString(); }
	                        },
	                        noData: "데이터가 없습니다.",
	                        useJsonData: true
	            },
	            legend: {
	                        show: false
	            },
	            grid: {
	            			y: {
	            				useLineStyle: true,
	                        	lineStyle: {
									strokeStyle: "dotted",
	                    			strokeColor: "",
	                    			strokeWidth: 1,
	                    			strokeOpacity: 0.5,
	                        	}
	            			},
	                        x: {
	                        	useLineStyle: true,
	                        	lineStyle: {
									strokeStyle: "dotted",
	                    			strokeColor: "",
	                    			strokeWidth: 1,
	                    			strokeOpacity: 0.5,
	                        	}
	                        }
	            },
	            axis: {
	                        x: {
	                        		type : 'category',
	                              	domain: {
	                                	show: false
	                              	},
	                              	tick: {
	                              		line: {
	                                		show: false
	                            		}
	                              	},
	                        },
	                        y: {
	                        		zerobased: true,
	                              	domain: {
	                                	show: false
	                                  	},
	                              	tick: {
	                                	line: {
	                                    	show: false
	                                	},
	                                	format : function(d) { return d.toLocaleString() + "";}
	                                }
	                        }
	            },
	            tooltip: {
	                        custom: function(data) {
	                              //console.log("click event : data = ", data);
	                              let jKey = Object.keys(data[0].originJson)[1];
	                              return '<div style="color: white; border: 1px solid blue; height:25px; line-height:25px; padding-left:5px;">' +
	                              data[0].originJson[chartConfObj.data.keys.x] + " : "  + data[0].value + '</div>';
	                        }
	            }
			}

			return chartConfObj;

		} else if(type == 'wing'){

			let chartConfObj = {
			    global: {
			                milestone: "",
			                animation: {
						      show: true,
							},
							padding: {
						    	left: 10,
						    	bottom:5,
						    	top:10
						    }
			    },
			    data: {
			                json: "",
			                keys: {
			                      x: "",
			                      value: []
			                },
			                type: "wing",
			                labels: {
			                	format: function(value) { return value }
			                },
			                noData: "데이터가 없습니다.",
			                useJsonData: true
			    },
				tooltip: {
					format: {
						value: function(value, ratio, id, index, value2){
							let tooltips ="";
							if(value != 0){
								tooltips = value+"%";
							} else {
								tooltips = "-"+value2+"%";
							}
							return tooltips;
						}
					}
				},
				axis: {
					x: {
						type: "category",
						categories: ["2018년","2019년","2020년","2021년","2022년","2023년","2024년"],
						zerobased: false,
					},
					y: {
						zerobased: false
					},
				},
				grid: {
						x: {
							show: false
						},
/*						y:{
						show: false
						},*/
				},
				extend: {
							bar:{
								width: {max: 50},
								showZeroValue: true,
							},
							wing: {
								startColor: '#254197',
								endColor:'#68d49d',
								showZeroValue: true,
							}
				}

			}
			return chartConfObj;

		}
	},
    // 세로막대형(arg1: div영역 id, arg2:json 객체, arg3:X축 속성명,Y축 value 속성명, arg4: 속성 개별정의, arg5:이정표 출력값)
    typeBarX: (dId, jsData = null, attr = null, attr2 = null, attr3 = null) => {
        // 세로막대형 confg 추가
        let configObj = chart.config('bar');

        // 디폴트 외 다르게 속성을 설정하고 싶은 경우 아래 분기에 로직 추가
        if(attr2) {
            // 임금정보 차트
            if(attr2 == "10") {
            	configObj.axis.y.domain.max = 1100;
                configObj.global.padding.top = -13;
            }

            if(attr2 == "30") {
            	configObj.axis.y.domain.max = 110;
				configObj.global.padding.top = -13;
            }

            if(attr2 == "21") { //임금결정현황조사 - 임금결정 의의 및 연도별 결과
                configObj.data.types = {rate: "bar", rateLine: "spline"};
                configObj.legend.show = true;
                configObj.data.legends = {rate:"연도별인상률", rateLine: "전년도 대비 인상률"};
                configObj.data.labels.format = function(value, id, index, ratio, originJson) {
                	if(id === "rate") {
                		 return value.toLocaleString();
                	}
                	if(id === "rateLine"){
                		return originJson.rateLine[1].toLocaleString();
                	}
                };
                configObj.data.labelsHighlight = [
                	{ id : 'rate', type: ">=", value: 0, color: "white"},
                	{ id : 'rateLine', type: ">=", value: 0, color: "black", fontSize: 15, fontWeight: 'bold'},
                ];
                configObj.axis.y.domain.max = 6;
                configObj.tooltip = {};
                configObj.tooltip.format = {};
                configObj.tooltip.format.value = function(value, ratio, id, index, value2){
                	if(id === "rate") {
                		return value.toLocaleString();
                	}
                	if(id === "rateLine"){
                		return value2.toLocaleString();
                	}
                }
                configObj.extend.bar.dataLabelPosition = "bottom";
                configObj.extend.line = {};
                configObj.extend.line.setLinesWidth = [{"key":"rateLine", "width":3}];
                configObj.extend.point = {r:5, color:"white", strokeColor:"red", strokeWidth:3};
            }
            if(attr2 == "22") { //임금결정현황조사 - 연도별 임금결정률(구 임금교섭 타결률) 증감추이
                configObj.data.types = {rate: "bar", rateLine: "spline"};
                configObj.legend.show = true;
                configObj.data.legends = {rate:"임금결정률", rateLine: "전년도 대비 인상률"};
                configObj.data.labels.format = function(value, id, index, ratio, originJson) {
                	if(id === "rate") {
                		 return value.toLocaleString();
                	}
                	if(id === "rateLine"){
                		return originJson.rateLine[1].toLocaleString();
                	}
                };
                configObj.data.labelsHighlight = [
                	{ id : 'rate', type: ">=", value: 0, color: "white"},
                	{ id : 'rateLine', type: ">=", value: 0, color: "black", fontSize: 15, fontWeight: 'bold'},
                ];
                configObj.tooltip = {};
                configObj.tooltip.format = {};
                configObj.tooltip.format.value = function(value, ratio, id, index, value2){
                	if(id === "rate") {
                		return value.toLocaleString();
                	}
                	if(id === "rateLine"){
                		return value2.toLocaleString();
                	}
                }
                configObj.extend.line = {};
                configObj.extend.bar.dataLabelPosition = "bottom";
                configObj.extend.line.setLinesWidth = [{"key":"rateLine", "width":3}];
                configObj.extend.point = {r:5, color:"white", strokeColor:"red", strokeWidth:3};
            }
        }

        // 이정표 출력값이 있는경우 옵션 추가
        if(attr3) {
            let mtData = {
                show: true,
                json: [{"label":attr3.label, "value":attr3.value,"type": "y1", "color": "red"}],
                showLabel: true
            }
            configObj.global.milestone = mtData;
        }

        // json 데이터 대입
        configObj.data.json = jsData;

        if (attr) {
            configObj.data.keys = attr;
        }

        //configObj.tooltip.mouse = configObj.tooltip.mouse || {x: -50, y: -30};
		sb.chart.render('#'+ dId, configObj);
    },
    // 가로막대형(arg1: div영역 id, arg2:json 객체, arg3:X축 속성명,Y축 value 속성명, arg4: 속성 개별정의)
    typeBarY: (dId, jsData = null, attr = null, attr2 = null) => {
        // 가로막대형 confg 추가
        let configObj = chart.config('bar');

        configObj["data"]["type"] = "bar";
        configObj.axis.rotated = true;
        configObj.axis.xAxisReverse = false;

        // json 데이터 대입
        configObj.data.json = jsData;

        if (attr) {
            configObj.data.keys = attr;
        }

        // 디폴트 외 다르게 속성을 설정하고 싶은 경우 아래 분기에 로직 추가
        if(attr2) {
            // 전직가능직업 차트
            if(attr2 == "10") {
            	configObj.axis.y.domain.max = 100;
                configObj.axis.y.domain.min = 50;
                configObj.global.padding.right = 18;
            }
        }
        configObj.tooltip.mouse = configObj.tooltip.mouse || {x: -50, y: -30};
        sb.chart.render('#'+ dId, configObj);
    },
    // 꺾은선형(arg1: div영역 id, arg2:json 객체, arg3:X축 속성명,Y축 value 속성명, arg4: 속성 개별정의)
    typeBarLine: (dId, jsData = null, attr = null, attr2 = null) => {
        let configObj = chart.config('line');

        // json 데이터 대입
        configObj.data.json = jsData;

        if (attr) {
            configObj.data.keys = attr;
        }

        // 디폴트 외 다르게 속성을 설정하고 싶은 경우 아래 분기에 로직 추가
        if(attr2) {
            // 임금정보 차트
            if(attr2 == "10") {
                configObj.axis.y.domain.max = 1100;
                configObj.global.padding.top = -13;

            }
            // 임금체계 유형, 연봉제, 성과배분제 통계
            if(attr2 == "20") {
				let xLabel = {
                    text: "(단위 : 년)",
                    position: "outer-right"
                }
                configObj.axis.x.label = xLabel;
                let yxLabel = {
                    text: "(단위 : %)",
                    position: "outer-right"
                }
                configObj.axis.y.label = yxLabel;

                configObj.axis.y.max = 100;
                configObj.axis.y.padding = 8;
            }
            // 임금결정현황조사
            if(attr2 == "30") {
            	let xLabel = {
                    text: "(단위 : 년)",
                    position: "outer-right"
                }
                configObj.axis.x.label = xLabel;
                let yxLabel = {
                    text: "(단위 : %)",
                    position: "outer-right"
                }
                configObj.axis.y.label = yxLabel;
                configObj.axis.y.max = 20;
                configObj.axis.y.padding = 1.8;
            }
        }
        configObj.tooltip.mouse = configObj.tooltip.mouse || {x: -50, y: -30};
        sb.chart.render('#'+ dId, configObj);
    },
    typeRadar: (dId, jsData = null, attr = null, attr2 = null, attr3 = null) => {
        let configObj = chart.config('radar');

        // json 데이터 대입
        configObj.data.json = jsData;

        if (attr) {
            configObj.data.keys = attr;
        }

        // json 데이터 대입
        configObj.data.json = jsData;
		configObj.extend.radar.axis.minValue = 50;
		configObj.extend.radar.axis.maxValue = 100;

		sb.chart.render('#'+ dId, configObj);
    },
    // 윙
	typeWing:(dId, jsData = null, attr = null)=>{

		let configObj = chart.config('wing');

		if (attr) {
			configObj.data.keys = attr;
		}
		// json 데이터 대입
		configObj.data.json = jsData;
		sb.chart.render('#'+ dId, configObj);

	},

};