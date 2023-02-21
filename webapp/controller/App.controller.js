sap.ui.define([
	"com/app/mindsquare/maintcorderlist/controller/Basecontroller"
], function (Controller, formatter) {
	"use strict";

	return Controller.extend("com.app.mindsquare.maintcorderlist.controller.App", {
		onInit: function () {
			this.onNavToDetail();
		},

		fnOnItemPressed: function (oEvent) {

			var oRouter = this.fnGetRouterInstance();
			oRouter.navTo("OrderDetails", {
				oCtx: oEvent.getSource().getBindingContextPath().substr(1)
			}); //Zugriff auf Route nicht Detail View
		},

		onNavToDetail: function () {
			var oRouter = this.fnGetRouterInstance();
			try {
				var startupParams = this.getOwnerComponent().getComponentData().startupParameters;
				if (startupParams.orderId) {
					oRouter.navTo("OrderDetails", {
						oCtx: "OrderSet('" + startupParams.orderId + "')"
					}); //Zugriff auf Route nicht Detail View
				}
			} catch (e) {

			}
		},

		/* =========================================================== */
		/* Barcode Scanner für QMNUM		   */
		/* =========================================================== */

		onBtnScanPress: function () {
			jQuery.sap.require("sap.ndc.BarcodeScanner");
			sap.ndc.BarcodeScanner.scan(
				function (oResult) { /* process scan result */
					var oBarcode = oResult.text;
					if (oBarcode === null) {
						var msg = "Ungültiger Barcode: " + oResult.text;
						this.showMessageErrorDialog(msg);
						return;
					}
					//hier Filter setzen
					var oFilterData = {
						AUFNR: oBarcode
					};
					this.getView().byId("smartFilterBar").setFilterData(oFilterData);
				}.bind(this),
				function (oError) { /* handle scan error */
					console.log(oError)
				}
			);
		}

	});
});