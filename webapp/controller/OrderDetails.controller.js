sap.ui.define([
	"com/app/mindsquare/maintcorderlist/controller/Basecontroller",
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
		onInit: function () {

			var oRouter = this.fnGetRouterInstance();
			oRouter.getRoute("OrderDetails").attachMatched(this.fnOnDetailMatched, this);

		},

		fnOnDetailMatched: function (oEvent) {
			var sEntityPath = "/" + oEvent.getParameter("arguments").oCtx;
			this.getView().bindElement(sEntityPath);

		},

		fnNavBack: function (oEvent) {
			debugger;
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
				try {
					var startupParams = this.getOwnerComponent().getComponentData().startupParameters;
					if (startupParams.orderId) {
						var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
						oCrossAppNavigator.backToPreviousApp();
						oCrossAppNavigator.backToPreviousApp();
						return;
					}
				} catch (e) {
					this.getOwnerComponent().getRouter().navTo("RouteApp", {}, true);
					return;
				}
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
				//Alban Change
				// Idaur: "0",
				IdaurFull: "0",
				//Alban Change
				Isdd: oBookTime.Isdd,
				Iedd: oBookTime.Iedd,
				Ltxa1: oBookTime.Ltxa1,
				Leknw: oBookTime.Leknw,
				Arbpl: oBookTime.Arbpl,
				Werks: oBookTime.Iwerk,
				Learr: oBookTime.Learr
			});
			var that = this;

			sap.ui.getCore().byId("selectArbpl").getBinding("items").attachEvent("dataReceived", function () {
				that.fnonDataRecieved(that)
			});

			// this._BookTimeDialog.setBindingContext(oContext);
			this._BookTimeDialog.setModel(data);
			this._BookTimeDialog.open();
			this.fnonDataRecieved(that)
		},

		fnonDataRecieved: function (that) {
			try {
				var newData = that._BookTimeDialog.getModel().getData();
				var items = sap.ui.getCore().byId("selectArbpl").getItems();
				var selectedItem = items.find((item) => {
					return item.getBindingContext("generalServices").getObject().Selected === true;
				});
				newData.Arbpl = selectedItem.getBindingContext("generalServices").getObject().Vaplz
				that._BookTimeDialog.getModel().setData(newData);
				return newData.Arbpl;
			} catch (e) {
				return "";
			}
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

		fnHelperIsEmpty: function (value) {
			if (value === "" || value === undefined || value === null) {
				return true;
			}
			return false;
		},

		fnBookTimeValidate: function (data) {
			var bCheck = true;
			if (this.getView().getModel("view").getContext("/BookTime/Hours").getObject()) {
				if (this.fnHelperIsEmpty(data.Isdt)) {
					bCheck = false;
					sap.ui.getCore().byId("time2").setValueState("Error");
				}
				if (this.fnHelperIsEmpty(data.Iedt)) {
					bCheck = false;
					sap.ui.getCore().byId("time3").setValueState("Error");
				}
			} else {
				//Alban Change
				// if (this.fnHelperIsEmpty(data.Idaur) || data.Idaur <= 0) {
				if (this.fnHelperIsEmpty(data.IdaurFull) || data.IdaurFull <= 0) {
					//Alban Change 
					bCheck = false;
					sap.ui.getCore().byId("time1").setValueState("Error");
				}
			}

			if (this.fnHelperIsEmpty(data.Arbpl)) {
				bCheck = false;
				sap.ui.getCore().byId("selectArbpl").setValueState("Error");
			}

			if (this.fnHelperIsEmpty(data.Learr)) {
				bCheck = false;
				sap.ui.getCore().byId("selectLearr").setValueState("Error");
			}
			return bCheck;
		},

		onIdaurChange: function (oEvent) {
			sap.ui.getCore().byId("time1").setValueState("None");
		},

		onIsdtChange: function (oEvent) {
			sap.ui.getCore().byId("time2").setValueState("None");
		},

		onIedtChange: function (oEvent) {
			sap.ui.getCore().byId("time3").setValueState("None");
		},

		onArbplChange: function (oEvent) {
			sap.ui.getCore().byId("selectArbpl").setValueState("None");

			//Alban Change 8/21/2023 call backend service to filter leistungsart
			var oObjId = oEvent.getParameters().selectedItem.getAdditionalText();
			var aFilter = [];
			var sPath = "/ActivityTypeSet";
			aFilter.push(new Filter('ObjId', FilterOperator.EQ, oObjId));

			this.getView().getModel("generalServices").read(sPath, {
				filters: [aFilter],
				success: function (oData) {
					var oModel = new JSONModel(oData.results);
					this.getView().setModel(oModel, "learrItemNew");
				}.bind(this),
				error: function (oError) {

				}.bind(this)
			});
			//Alban Change 8/21/2023 call backend service to filter leistungsart
		},

		onLearrChange: function (oEvent) {
			sap.ui.getCore().byId("selectLearr").setValueState("None");
		},

		onBookTimePressed: function (oEvent) {

			var oModel = this.getView().getModel();
			// var oCtx = oEvent.getSource().getBindingContext();
			var oBookTime = oEvent.getSource().getModel().getData();

			//	var IsddDateTime = oBookTime.Isdd;
			//	var IeddDateTime = new Date + oBookTime.Iedd;

			if (!this.fnBookTimeValidate(oBookTime)) {
				return;
			}
			// Convert time to sap format
			try {
				oBookTime.Isdt = oBookTime.Isdt.replaceAll(":", "");
				oBookTime.Iedt = oBookTime.Iedt.replaceAll(":", "");
			} catch (e) {

			}

			oBookTime.IdaurFull = oBookTime.IdaurFull.replace(',', '.');

			// If not deleted this will cause an backend error - therefore we first delete the __metadata property
			//	delete oBookTime.__metadata;
			this.getView().setBusy(true);
			oModel.create("/ConfirmationSet", oBookTime, {
				success: function (oData, result) {
					// oModel.deleteCreatedEntry(oCtx);
					this.getView().setBusy(false);
					MessageBox.success("Zeitrückmeldung erfolgreich!", {
						onClose: function () {
							this._BookTimeDialog.close();
						}.bind(this),
						title: "Erfolg"
					});

				}.bind(this),
				error: function (e) {
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
			var that = this;
			// var sUpdatePath = "/" + this.getView().getModel().getParameter("arguments").oCtx;
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
					MessageToast.show("Erfolgreich beendet!");
				},
				error: function (oError) {
					that.getView().setBusy(false);
					MessageToast.show("Es ist ein Fehler ist aufgetreten!");
				}
			});

			//3. Update-Request versenden
			// var that = this;
			// this.getView().getModel().update(oEntry.getPath(), oData, {
			// 	success: function () {
			// 		var oRouter = that.fnGetRouterInstance();
			// 		that.getView().setBusy(false);
			// 		oRouter.navTo("RouteApp");
			// 		MessageToast.show("Aktualisierung erfolgreich");
			// 	}.bind(this),
			// 	error: function (oError) {
			// 		this.getView().setBusy(false);
			// 		MessageToast.show("Es ist ein Fehler ist aufgetreten!");
			// 	}.bind(this)
			// });
		}
	});

});