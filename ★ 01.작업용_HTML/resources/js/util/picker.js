$(function() {

	var picker = new ax5.ui.picker();
	picker.bind({
		target: $('[data-ax5picker="date"]'),

		direction: "top",

			content: {
			width: 170,
			margin: 10,
			type: 'date',
			config: {
				control: {
					left: '<i class="fa fa-chevron-left"></i>',
					monthTmpl: '%s',
					yearTmpl: '%s',
					right: '<i class="fa fa-chevron-right"></i>',
					yearFirst: false // false
				},
				lang: {
					months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
					yearTmpl: "%s년",
					dayTmpl: "%s"
				},
				dateFormat: "yyyy-MM-dd"
			}
		}
	});

	picker.onClick = function() {
		//console.log(this);
	}

	picker.onStateChanged = function() {
		if (this.state == "open") {
			var selectedValue = this.self.getContentValue(this.item["$target"]);
			if (selectedValue) {
				// 국가에 맞게 변경 12345678
				selectedValue = selectedValue.replace(/[^0-9]/g,"");

				// MMddyyyy
				var yyyy = selectedValue.substring(4,8);
				var MM = selectedValue.substring(2,4);
				var dd = selectedValue.substring(0,2);

				selectedValue = ax5.util.date((yyyy+MM+dd), {add:{d:0}, return:'yyyy-MM-dd'})
				this.item.pickerCalendar[0].ax5uiInstance.setConfig({}
					displayDate: selectedValue
				});

				this.item.pickerCalendar[0].ax5uiInstance.setSelection([ax5.util.date(selectedValue, {'add': {d: 0}})]);
			} else {
				this.item.pickerCalendar[0].ax5uiInstance.setSelection([ax5.util.date(new Date(), {'add': {d: 0}})]);
			}
		}
	}


	var groupPicker = new ax5.ui.picker();
	groupPicker.bind({
		target: $('[ax5picker="basic2"]'),
		direction: "top",
		content: {
			width: 200,
			margin: 5,
			type: 'date',
			config: {
				control: {
					left: '<i class="fa fa-chevron-left"></i>',
					monthTmpl: '%s',
					yearTmpl: '%s',
					right: '<i class="fa fa-chevron-right"></i>',
					yearFirst: false // false
				},
				lang: {
					months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
					yearTmpl: "%s년",
					dayTmpl: "%s"
				},
				dateFormat: "yyyy-MM-dd"
			},
		}
	});

	groupPicker.onClick = function() {
		//console.log(this);
	}

	groupPicker.onStateChanged = function() {

		if (this.state == "open") {
			var selectedValue = this.self.getContentValue(this.item["$target"]);
			var selection1 = $('[ax5picker="basic2"] input').eq(0).val()
			var selection2 = $('[ax5picker="basic2"] input').eq(1).val()

			if (selection1) {
				// 국가에 맞게 변경 12345678
				selectedValue = selection1.replace(/[^0-9]/g,"");

				// yyyyMMdd
				var yyyy = selectedValue.substring(4,8);
				var MM = selectedValue.substring(2,4);
				var dd = selectedValue.substring(0,2);

				selectedValue = ax5.util.date((yyyy+MM+dd), {add:{d:0}, return:'yyyy-MM-dd'})
				this.item.pickerCalendar[0].ax5uiInstance.setConfig({
					displayDate: selectedValue
				});

				this.item.pickerCalendar[0].ax5uiInstance.setSelection([ax5.util.date(selectedValue, {'add': {d: 0}})]);
			} else {
				this.item.pickerCalendar[0].ax5uiInstance.setSelection([ax5.util.date(new Date(), {'add': {d: 0}})]);
			}

			if (selection2) {
				// 국가에 맞게 변경 12345678
				selectedValue = selection2.replace(/[^0-9]/g,"");

				// yyyyMMdd
				var yyyy = selectedValue.substring(4,8);
				var MM = selectedValue.substring(2,4);
				var dd = selectedValue.substring(0,2);

				selectedValue = ax5.util.date((yyyy+MM+dd), {add:{d:0}, return:'yyyy-MM-dd'})
				this.item.pickerCalendar[1].ax5uiInstance.setConfig({
					displayDate : selectedValue
				});

				this.item.pickerCalendar[1].ax5uiInstance.setSelection([ax5.util.date(selectedValue, {'add': {d: 0}})]);
			} else {
				this.item.pickerCalendar[1].ax5uiInstance.setSelection([ax5.util.date(new Date(), {'add': {d: 0}})]);
			}
		}

		if (this.state == "changeValue") {
			var selection1 = this.values[0];
			if (selection1) {
				// 국가에 맞게 변경 12345678
				var selectedValue = selection1.replace(/[^0-9]/g,"");

				// yyyyMMdd
				var yyyy = selectedValue.substring(4,8);
				var MM = selectedValue.substring(2,4);
				var dd = selectedValue.substring(0,2);

				selectedValue = ax5.util.date((yyyy+MM+dd), {add:{d:0}, return:'yyyy-MM-dd'})
				this.item.pickerCalendar[0].ax5uiInstance.setConfig(
						{displayDate : selectedValue}
				)

				this.item.pickerCalendar[0].ax5uiInstance.setSelection([ax5.util.date(selectedValue, {'add': {d: 0}})]);
			}

			var selection2 = this.values[1];
			if (selection2) {
				// 국가에 맞게 변경 12345678
				var selectedValue = selection2.replace(/[^0-9]/g,"");

				// yyyyMMdd
				var dd = selectedValue.substring(0,2);
				var MM = selectedValue.substring(2,4);
				var yyyy = selectedValue.substring(4,8);

				selectedValue = ax5.util.date((yyyy+MM+dd), {add:{d:0}, return:'yyyy-MM-dd'})
				this.item.pickerCalendar[1].ax5uiInstance.setConfig(
						{displayDate : selectedValue}
				)

				this.item.pickerCalendar[1].ax5uiInstance.setSelection([ax5.util.date(selectedValue, {'add': {d: 0}})]);
			}
		}
	}

});