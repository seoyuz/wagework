function xmlToJson(xml) {
	var obj = {};

	if(xml.nodeType == 1) {
		if(xml.attributes.length > 0) {
			obj["@attributes"] = {};
			for(var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if(xml.nodeType == 3) {
		obj = xml.nodeValue.trim();
	}

	if(xml.hasChildNodes()) {
		var textContent = "";
		var isTextOnly = true;
		for(var i = 0; i< xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;

			if(item.nodeType === 3) {
				textContent += item.nodeValue.trim();
			} else {
				isTextOnly = false;
				if(!obj[nodeName]) {
					obj[nodeName] = xmlToJson(item);
				} else {
					if(!Array.isArray(obj[nodeName])) {
						obj[nodeName] = [obj[nodeName]];
					}
					obj[nodeName].push(xmlToJson(item));
				}
			}
		}

		if(isTextOnly) {
			return textContent || "";
		}
	}

	return obj;
}