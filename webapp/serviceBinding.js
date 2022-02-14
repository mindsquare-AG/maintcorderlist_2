function initModel() {
	var sUrl = "/sap/opu/odata/mind2/MAINTAIN_ORDER_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}