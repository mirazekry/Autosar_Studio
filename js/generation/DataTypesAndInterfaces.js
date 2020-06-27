$(document).ready(function () {
	var btn_id = "generate_DataTypesAndInterfaces_arxml";
	$('body').delegate(`#${btn_id}`, 'click', function () {
		save(); // save actions in connection area to json textarea
		var queryString = decodeURIComponent(window.location.search);
		queryString = queryString.substring(1);
		var queries = queryString.split("&");
		var Projectname = queries.toString().trim();
		var CSlength = CSInterfacesarr.length;
		var SRlength = SRInterfacesarr.length;
		var datatypeslength = datatypesselected.length;
		var ImplementationDataTypesLength = ImplementationDataElements.length;
		// create the XML structure recursively
		var XML = new XMLWriter();
		XML.BeginNode("AUTOSAR");
		XML.Attrib("xsi:schemaLocation", "http://autosar.org/schema/r4.0 AUTOSAR_4-3-0.xsd");
		XML.Attrib("xmlns", "http://autosar.org/schema/r4.0");
		XML.Attrib("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
		// Your structure DataTypesAndInterfaces.xml file here...
		XML.BeginNode("AR-PACKAGES");
		XML.BeginNode("AR-PACKAGE");
		XML.Node("SHORT-NAME", Projectname);
		XML.BeginNode("AR-PACKAGES");

		if (ValuesConfigurations.length != 0) {
			XML.BeginNode("AR-PACKAGE");
			XML.Node("SHORT-NAME", "ImplementationDataTypes");
			XML.BeginNode("ELEMENTS");
			for (i = 0; i < ValuesConfigurations.length; i++) {
				XML.BeginNode("IMPLEMENTATION-DATA-TYPE");

				XML.Node("SHORT-NAME", ValuesConfigurations[i].name);

				XML.Node("CATEGORY", "VALUE");
				XML.BeginNode("SW-DATA-DEF-PROPS");
				XML.BeginNode("SW-DATA-DEF-PROPS-VARIANTS");
				XML.BeginNode("SW-DATA-DEF-PROPS-CONDITIONAL");

				if (datatypesselected.includes(ValuesConfigurations[i].dataType)) {
					XML.BeginNode("BASE-TYPE-REF");
					XML.Attrib("DEST", "SW-BASE-TYPE");
					XML.WriteString(`/${Projectname}/SwBaseTypes/${ValuesConfigurations[i].dataType}${window.closer}`);
					XML.EndNode();		/* BASE-TYPE-REF				 */
				}
				else {
					XML.BeginNode("IMPLEMENTATION-DATA-TYPE-REF");
					XML.Attrib("DEST", "IMPLEMENTATION-DATA-TYPE");
					XML.WriteString(`/${Projectname}/ImplementationDataTypes/${ValuesConfigurations[i].dataType}${window.closer}`);
					XML.EndNode();		/* BASE-TYPE-REF				 */
				}

				XML.EndNode();
				XML.EndNode();
				XML.EndNode();

				XML.EndNode();
			}
			XML.EndNode();
			XML.EndNode();
		}
		if (ArraysConfigurations.length != 0) {
			XML.BeginNode("AR-PACKAGE");
			XML.Node("SHORT-NAME", "ImplementationDataTypes");
			XML.BeginNode("ELEMENTS");
			for (i = 0; i < ArraysConfigurations.length; i++) {
				XML.BeginNode("IMPLEMENTATION-DATA-TYPE");

				XML.Node("SHORT-NAME", ArraysConfigurations[i].name);

				XML.Node("CATEGORY", "ARRAY");
				XML.BeginNode("SUB-ELEMENTS");
				XML.BeginNode("IMPLEMENTATION-DATA-TYPE-ELEMENT");
				XML.Node("SHORT-NAME", "Element");
				console.log(ArraysConfigurations);
				console.log(ImplementationDataElements);
				
				/*for (var a = 0; a < ImplementationDataElements.length; a++) {
					if (ArraysConfigurations[i].name == ImplementationDataElements[a].name)
					{
						XML.Node("CATEGORY", ImplementationDataElements[a].type);
					}
				}*/

				for (var a = 0; a < ImplementationDataElements.length; a++) {
					if ((ArraysConfigurations[i].dataType == ImplementationDataElements[a].name)) {
						XML.Node("CATEGORY", ImplementationDataElements[a].type);
					}
				}
				if(datatypesselected.includes(ArraysConfigurations[i].dataType))
				{
					XML.Node("CATEGORY", "Value");
				}
				
				XML.Node("ARRAY-SIZE", ArraysConfigurations[i].size);
				XML.Node("ARRAY-SIZE-SEMANTICS", "FIXED-SIZE");
				XML.BeginNode("SW-DATA-DEF-PROPS");
				XML.BeginNode("SW-DATA-DEF-PROPS-VARIANTS");
				XML.BeginNode("SW-DATA-DEF-PROPS-CONDITIONAL");

				if (datatypesselected.includes(ArraysConfigurations[i].dataType)) {
					XML.BeginNode("BASE-TYPE-REF");
					XML.Attrib("DEST", "SW-BASE-TYPE");
					XML.WriteString(`/${Projectname}/SwBaseTypes/${ArraysConfigurations[i].dataType}${window.closer}`);
					XML.EndNode();		/* BASE-TYPE-REF				 */
				}
				else {
					XML.BeginNode("IMPLEMENTATION-DATA-TYPE-REF");
					XML.Attrib("DEST", "IMPLEMENTATION-DATA-TYPE");
					XML.WriteString(`/${Projectname}/ImplementationDataTypes/${ArraysConfigurations[i].dataType}${window.closer}`);
					XML.EndNode();		/* BASE-TYPE-REF				 */
				}

				XML.EndNode();		/* SW-DATA-DEF-PROPS-CONDITIONAL */
				XML.EndNode();		/* SW-DATA-DEF-PROPS-VARIANTS Node */
				XML.EndNode();		/* SW-DATA-DEF-PROPS Node */
				XML.EndNode();		/* IMPLEMENTATION-DATA-TYPE-ELEMENT */
				XML.EndNode();		/* SUB-ELEMENTS Node */

				XML.EndNode();		/* Implementation Data Type Node */
			}
			XML.EndNode();
			XML.EndNode();
		}
		if (StructDataElements.length != 0) {
			XML.BeginNode("AR-PACKAGE");
			for (i = 0; i < StructDataElements.length; i++) {
				XML.BeginNode("IMPLEMENTATION-DATA-TYPE");
				XML.Node("SHORT-NAME", StructDataElements[i].name);
				XML.Node("CATEGORY", "STRUCTURE");
				XML.BeginNode("SUB-ELEMENTS");
				for (var j = 0; j < StructDataElements[i].data.length; j++) {
					XML.BeginNode("IMPLEMENTATION-DATA-TYPE-ELEMENT");

					XML.Node("SHORT-NAME", StructDataElements[i].data[j].name);

					if (datatypesselected.includes(StructDataElements[i].data[j].type)) {
						XML.Node("CATEGORY", "Value");
					}

					else {

						for (var a = 0; a < ImplementationDataElements.length; a++) {
							if (StructDataElements[i].data[j].type == ImplementationDataElements[a].name) {
								XML.Node("CATEGORY", ImplementationDataElements[a].type);
							}
						}
					}


					XML.BeginNode("SW-DATA-DEF-PROPS");
					XML.BeginNode("SW-DATA-DEF-PROPS-VARIANTS");
					XML.BeginNode("SW-DATA-DEF-PROPS-CONDITIONAL");

					if (datatypesselected.includes(StructDataElements[i].data[j].type)) {
						XML.BeginNode("BASE-TYPE-REF");
						XML.Attrib("DEST", "SW-BASE-TYPE");
						XML.WriteString(`/${Projectname}/SwBaseTypes/${StructDataElements[i].data[j].type}${window.closer}`);
						XML.EndNode();		/* BASE-TYPE-REF				 */
					}
					else {
						XML.BeginNode("IMPLEMENTATION-DATA-TYPE-REF");
						XML.Attrib("DEST", "IMPLEMENTATION-DATA-TYPE");
						XML.WriteString(`/${Projectname}/ImplementationDataTypes/${StructDataElements[i].data[j].type}${window.closer}`);
						XML.EndNode();		/* BASE-TYPE-REF				 */
					}

					XML.EndNode();		/* MPLEMENTATION-DATA-TYPE-ELEMENT */
					XML.EndNode();
					XML.EndNode();

					XML.EndNode();
				}
				XML.EndNode();		/* SUB-ELEMENTS */

				XML.EndNode();
			}
			XML.EndNode();
		}
		if (datatypeslength != 0) {
			XML.BeginNode("AR-PACKAGE");
			XML.Node("SHORT-NAME", "SwBaseTypes");
			XML.BeginNode("ELEMENTS");
			var TypeSize;
			for (i = 0; i < datatypeslength; i++) {
				XML.BeginNode("SW-BASE-TYPE");
				XML.Node("SHORT-NAME", datatypesselected[i]);
				switch (datatypesselected[i]) {
					case 'boolean':
						TypeSize = 8;
						break;
					case 'uint8':
						TypeSize = 8;
						break;
					case 'sint8':
						TypeSize = 8;
						break;
					case 'uint16':
						TypeSize = 16;
						break;
					case 'sint16':
						TypeSize = 16;
						break;
					case 'uint32':
						TypeSize = 32;
						break;
					case 'sint32':
						TypeSize = 32;
						break;
					case 'float32':
						TypeSize = 32;
						break;
					case 'float64':
						TypeSize = 64;
						break;
				}
				XML.Node("BASE-TYPE-SIZE", TypeSize.toString(10));
				XML.EndNode();
			}

			XML.EndNode();
			XML.EndNode();
		}
		if (CSlength != 0 || SRlength != 0) {
			XML.BeginNode("AR-PACKAGE");
			XML.Node("SHORT-NAME", "PortInterfaces");
			XML.BeginNode("ELEMENTS");
			for (i = 0; i < SRlength; i++) {
				XML.BeginNode("SENDER-RECEIVER-INTERFACE");
				XML.Node("SHORT-NAME", SRInterfacesarr[i].name);
				XML.BeginNode("DATA-ELEMENTS");
				for (j = 0; j < SRInterfacesarr[i].dataelements.length; j++) {
					XML.BeginNode("VARIABLE-DATA-PROTOTYPE");
					XML.Node("SHORT-NAME", SRInterfacesarr[i].dataelements[j].name);
					XML.BeginNode("TYPE-TREF");
					XML.Attrib("DEST", "IMPLEMENTATION-DATA-TYPE");
					XML.WriteString(`/${Projectname}/ImplementationDataTypes/${SRInterfacesarr[i].dataelements[j].type}${window.closer}`);
					XML.EndNode();
					XML.EndNode();
				}
				XML.EndNode();
				XML.EndNode();
			}

			for (i = 0; i < CSlength; i++) {
				XML.BeginNode("CLIENT-SERVER-INTERFACE");
				XML.Node("SHORT-NAME", CSInterfacesarr[i].name);
				XML.BeginNode("OPERATIONS");
				for (j = 0; j < CSInterfacesarr[i].operations.length; j++) {
					XML.BeginNode("CLIENT-SERVER-OPERATION");
					XML.Node("SHORT-NAME", CSInterfacesarr[i].operations[j].name);
					XML.BeginNode("ARGUMENTS");
					for (k = 0; k < CSInterfacesarr[i].operations[j].arguments.length; k++) {
						XML.BeginNode("ARGUMENT-DATA-PROTOTYPE");
						XML.Node("SHORT-NAME", CSInterfacesarr[i].operations[j].arguments[k].name);
						XML.BeginNode("TYPE-TREF");
						XML.Attrib("DEST", "IMPLEMENTATION-DATA-TYPE");
						XML.WriteString(`/${Projectname}/ImplementationDataTypes/${CSInterfacesarr[i].operations[j].arguments[k].datatype}${window.closer}`);
						XML.EndNode();
						XML.BeginNode("DIRECTION");
						XML.Node("DIRECTION", CSInterfacesarr[i].operations[j].arguments[k].argumenttype);
						XML.EndNode();
						XML.EndNode();
					}
					XML.EndNode();
					if (CSInterfacesarr[i].operations[j].errors.length == 0) {
						XML.BeginNode("POSSIBLE-ERROR-REFS");

						for (k = 0; k < CSInterfacesarr[i].operations[j].errors.length; k++) {

							XML.BeginNode("POSSIBLE-ERROR-REF");
							XML.Attrib("DEST", "APPLICATION-ERROR");
							XML.WriteString(`/${Projectname}/Interfaces/${CSInterfacesarr[i].name}/${CSInterfacesarr[i].operations[j].errors[k].name}${window.closer}`);
							XML.EndNode();
						}
						XML.EndNode();
					}
					XML.EndNode();



				}
				XML.EndNode();
				if (CSInterfacesarr[i].possibleerrors.length == 0) {
					XML.BeginNode("POSSIBLE-ERRORS");
					XML.WriteString(`${window.closer}`);
					for (j = 0; j < CSInterfacesarr[i].possibleerrors.length; j++) {
						XML.BeginNode("APPLICATION-ERROR");
						XML.Node("SHORT-NAME", CSInterfacesarr[i].possibleerrors[j].name);
						XML.Node("ERROR-CODE", CSInterfacesarr[i].possibleerrors[j].code);
						XML.EndNode();
					}
					XML.EndNode();
				}
				XML.EndNode();
			}
			XML.EndNode();
			XML.EndNode();
		}
		XML.EndNode();
		XML.EndNode();
		XML.EndNode();
		XML.EndNode();
		XML.Close();

		// init xml export data
		var header_tag = `<?xml version="1.0" encoding="UTF-8"?>`; // header
		var xml_result = header_tag + XML.ToString(); // append internal contect with header
		save_arxml_file(btn_id, formatXml(xml_result, '  '), 'DataTypesAndInterfaces.arxml', 'text/plain'); // save & download file

	})
});
