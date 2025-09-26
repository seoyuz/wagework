/* 임금결정현황조사 차트 DATA */

/* 연도별 협약임금 인상률 증감 추이 데이터 */
/*
  rate: 기준년도 인상률 bar용
  rateLine: [기준년도 인상률 line용, 전년도 대비 인상률(기준년도 인상률 - 기준년도 전년도 인상률)]
*/
let agreWageData = [
	{year:"2020", rate: 3.0, rateLine: [3.0,-0.9]},
	{year:"2021", rate: 3.6, rateLine: [3.6,0.6]},
	{year:"2022", rate: 4.7, rateLine: [4.7,1.1]},
	{year:"2023", rate: 4.2, rateLine: [4.2,-0.5]},
	{year:"2024", rate: 3.6, rateLine: [3.6,-0.6]},
/*  모바일에서 차트가 깨져서 최신년도에서 5개년치만 차트로 보여주기
	{year:"2010", rate: 4.8, rateLine: [4.8,3.1]},
	{year:"2011", rate: 5.1, rateLine: [5.1,0.3]},
	{year:"2012", rate: 4.7, rateLine: [4.7,-0.4]},
	{year:"2013", rate: 3.5, rateLine: [3.5,-1.2]},
	{year:"2014", rate: 4.1, rateLine: [4.1,0.6]},
	{year:"2015", rate: 3.7, rateLine: [3.7,-0.4]},
	{year:"2016", rate: 3.3, rateLine: [3.3,-0.4]},
	{year:"2017", rate: 3.6, rateLine: [3.6,0.3]},
	{year:"2018", rate: 4.2, rateLine: [4.2,0.6]},
	{year:"2019", rate: 3.9, rateLine: [3.9,-0.3]},
*/
];

/* 연도별 임금결정률(구 임금교섭 타결률) 증감추이 - 윙차트용 */
let wingData =[
	{ "year" : "2020년", "인상률" : [0, 0.7]},
	{ "year" : "2021년", "인상률" : [5.3, 0]},
	{ "year" : "2022년", "인상률" : [0, 0.3]},
	{ "year" : "2023년", "인상률" : [0, 1.5]},
	{ "year" : "2024년", "인상률" : [2.5, 0]},
];
/* 연도별 임금결정률(구 임금교섭 타결률) 증감추이 복합차트용
  rate: 기준년도 임금결정률 bar용
  rateLine: [기준년도 임금결정률 line용, 전년도 대비 인상률(기준년도 인상률 - 기준년도 전년도 인상률)]
*/
let wageRateData = [
	{year:"2020년", rate: 89.4, rateLine: [89.4,-0.7]},
	{year:"2021년", rate: 94.7, rateLine: [94.7,5.3]},
	{year:"2022년", rate: 94.4, rateLine: [94.4,-0.3]},
	{year:"2023년", rate: 95.9, rateLine: [95.9,1.5]},
	{year:"2024년", rate: 98.4, rateLine: [98.4,2.5]},
];