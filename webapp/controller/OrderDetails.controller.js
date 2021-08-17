sap.ui.define([
	"com/app/mindsquare/maintcorderlist/controller/Basecontroller",
	//	"com/app/mindsquare/maintcorderlist/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Text",
	"sap/ui/core/routing/History"
], function (Controller, Filter, FilterOperator, Dialog, DialogType, Button, ButtonType, MessageToast, MessageBox, Text,
	History) {
	"use strict";

	return Controller.extend("com.app.mindsquare.maintcorderlist.controller.OrderDetails", {
		//	formatter: formatter,
		onInit: function () {

			var oRouter = this.fnGetRouterInstance();

			oRouter.getRoute("OrderDetails").attachMatched(this.fnOnDetailMatched, this);

		},

		fnOnDetailMatched: function (oEvent) {

			var sEntityPath = "/" + oEvent.getParameter("arguments").oCtx;

			this.getView().bindElement(sEntityPath);

		},

		fnNavBack: function (oEvent) {
			if (!this.oApproveDialog) {
				this.oApproveDialog = new Dialog({
					type: DialogType.Message,
					title: "Warnung",
					content: new Text({
						text: "Alle nicht gespeicherten Änderungen gehen verloren. Fortfahren?"
					}),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Bestätigen",
						press: function () {
							this.getView().getModel().resetChanges();
							var oRouter = this.getOwnerComponent().getRouter();
							oRouter.navTo("RouteApp", {}, true);
							this.oApproveDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Abbrechen",
						press: function () {
							this.oApproveDialog.close();
						}.bind(this)
					})
				});
			}

			this.oApproveDialog.open();

		}
	});

});