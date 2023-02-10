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

			if (this.getView().getModel().hasPendingChanges()) {
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
			} else {

				this.getOwnerComponent().getRouter().navTo("RouteApp", {}, true);
			}

		},

		/* =========================================================== */
		/* Technischer Platz Funktionen                                */
		/* =========================================================== */

		onValueHelpTechPlPress: function (oEvent) {

			if (!this._valueHelpTechPlDialog) {

				this._valueHelpTechPlDialog = sap.ui.xmlfragment("com.app.mindsquare.maintcorderlist.view.fragments.TechPl", this); //oDialog;
				this.getView().addDependent(this._valueHelpTechPlDialog);

			}
			//sap.ui.getCore().byId("ilaList").getBinding("items").filter([new Filter('Codegruppe', FilterOperator.EQ, sNotType)]);
			this._valueHelpTechPlDialog.open();
		},

		onValueHelpTechPlClose: function (oEvent) {

			document.removeEventListener("backbutton", this.onValueHelpTechPlClose.bind(this), false);
			this._valueHelpTechPlDialog.close();
		},

		/* =========================================================== */
		/* Equipment Funktionen                 					   */
		/* =========================================================== */
		onValueHelpEquipPress: function (oEvent) {

			if (!this._valueHelpEquipDialog) {

				this._valueHelpEquipDialog = sap.ui.xmlfragment("com.app.mindsquare.maintcorderlist.view.fragments.Equip", this); //oDialog;
				this.getView().addDependent(this._valueHelpEquipDialog);

			}

			this._valueHelpEquipDialog.open();
		},

		onValueHelpEquipClose: function (oEvent) {

			document.removeEventListener("backbutton", this.onValueHelpEquipClose.bind(this), false);
			this._valueHelpEquipDialog.close();
		},

		/* =========================================================== */
		/* Zeit buchen Funktionen       	                           */
		/* =========================================================== */
		onBookTime: function (oEvent) {

			if (!this._BookTimeDialog) {

				this._BookTimeDialog = sap.ui.xmlfragment("com.app.mindsquare.maintcorderlist.view.fragments.BookTime", this); //oDialog;
				this.getView().addDependent(this._BookTimeDialog);

			}

			var oModel = this.getView().getModel();
			var oCtx = this.getView().getBindingContext();
			var oLineCtx = oEvent.getSource().getBindingContext();
			var sAufnr = oModel.getProperty("AUFNR", oCtx);
			var sVornr = oModel.getProperty("VORNR", oLineCtx);
			var oBookTime = oLineCtx.getObject();
			// var oContext = oModel.createEntry("/ConfirmationSet", {
			// 	properties: {
			// 		Aufnr: sAufnr,
			// 		Vornr: sVornr,
			// 		Idaur: oBookTime.Idaur,
			// 		Isdd: oBookTime.Isdd,
			// 		Iedd: oBookTime.Iedd,
			// 		Ltxa1: oBookTime.Ltxa1,
			// 		Leknw: oBookTime.Leknw,
			// 		Arbpl: oBookTime.Arbpl,
			// 		Werks: oBookTime.Iwerk,
			// 		Learr: oBookTime.Learr
			// 	}
			// });

			var data = new sap.ui.model.json.JSONModel({
				Aufnr: sAufnr,
				Vornr: sVornr,
				Idaur: 0,
				Isdd: oBookTime.Isdd,
				Iedd: oBookTime.Iedd,
				Ltxa1: oBookTime.Ltxa1,
				Leknw: oBookTime.Leknw,
				Arbpl: oBookTime.Arbpl,
				Werks: oBookTime.Iwerk,
				Learr: oBookTime.Learr
			});

			// this._BookTimeDialog.setBindingContext(oContext);
			this._BookTimeDialog.setModel(data);
			this._BookTimeDialog.open();
		},

		onBookTimeClose: function (oEvent) {
			this.getView().getModel().resetChanges();
			this._BookTimeDialog.close();
		},

		handleChange: function (oEvent) {
			sap.ui.getCore().byId("time1").setValue(0);
			sap.ui.getCore().byId("time2").setDateValue(null);
			sap.ui.getCore().byId("time3").setDateValue(null);
		},

		onBookTimePressed: function (oEvent) {

			this.getView().setBusy(true);

			var oModel = this.getView().getModel();
			// var oCtx = oEvent.getSource().getBindingContext();
			var oBookTime = oEvent.getSource().getModel().getData();

			//	var IsddDateTime = oBookTime.Isdd;
			//	var IeddDateTime = new Date + oBookTime.Iedd;

			var oConf = {
				Aufnr: oBookTime.AUFNR,
				Vornr: oBookTime.VORNR,
				Idaur: oBookTime.Idaur,
				Isdd: oBookTime.Isdd,
				Iedd: oBookTime.Iedd,
				Ltxa1: oBookTime.Ltxa1,
				Leknw: oBookTime.Leknw,
				Arbpl: oBookTime.Arbpl,
				Werks: oBookTime.Iwerk,
				Learr: oBookTime.Learr
			};

			// If not deleted this will cause an backend error - therefore we first delete the __metadata property
			//	delete oBookTime.__metadata;
			oModel.create('/ConfirmationSet', oBookTime, {
				success: function (oData, result) {
					// oModel.deleteCreatedEntry(oCtx);
					this.getView().setBusy(false);
					MessageBox.success("Zeitrückmeldung:" + " " + Number(oData.Id) + " " +
						"erfolgreich!", {
							onClose: function () {
								this._BookTimeDialog.close();
							}.bind(this),
							title: "Erfolg"
						});

				}.bind(this),
				error: function () {
					this.getView().setBusy(false);

					MessageBox.alert("Es ist ein Fehler aufgetreten.");
				}.bind(this)
			});
		},
		/* =========================================================== */
		/* Auftrag abschließen Funktionen       		               */
		/* =========================================================== */

		onSaveButtonPressed: function () {
			this.getView().setBusy(true);
			var oModel = this.getView().getModel();
			//1. zu aktualisierenden Modeleintrag auslesen
			var oEntry = this.getView().getBindingContext();
			var oData = oEntry.getObject();

			//2. Key aufbereiten
			/*var sUpdatePath = this.getView().getModel().createKey("/MaintenanceNotificationSet", {
				Id: oEntry.Id
			});*/
		
			// var sUpdatePath = "/" + this.getView().getModel().getParameter("arguments").oCtx;

			//3. Update-Request versenden
			var that = this;
			this.getView().getModel().update(oEntry.getPath(), oData, {
				success: function () {
					oModel.callFunction("/CloseOrder", {
						method: "POST",
						urlParameters: {
							"AUFNR": oData.AUFNR,
							"UNAME": oData.UNAME,
							"VORNR": ""
						},
						success: function () {
							var oRouter = that.fnGetRouterInstance();
							that.getView().setBusy(false);
							oRouter.navTo("RouteApp");
							MessageToast.show("Aktualisierung erfolgreich");
						},
						error: function (oError) {
							that.getView().setBusy(false);
							MessageToast.show("Es ist ein Fehler ist aufgetreten!");
						}
					});

				}.bind(this),
				error: function (oError) {
					this.getView().setBusy(false);
					MessageToast.show("Es ist ein Fehler ist aufgetreten!");
				}.bind(this)
			});
		}
	});

});