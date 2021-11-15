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
			var oLineCtx = oEvent.getSource().getBindingContext();
			var oCtx = oModel.createEntry("/ConfirmationSet", {
				properties: {
					Aufnr: sAufnr,
					Vornr: sVornr
				}
			});
			this._BookTimeDialog.setBindingContext(oCtx);
			this._BookTimeDialog.open();
		},

		onBookTimeClose: function (oEvent) {
			this.getView().getModel().resetChanges();
			this._BookTimeDialog.close();
		},

		handleChange: function (oEvent) {
			sap.ui.getCore().byId("time1").setValue(null);
			sap.ui.getCore().byId("time2").setDateValue(null);
			sap.ui.getCore().byId("time3").setDateValue(null);
		},

		onBookTimePressed: function (oEvent) {
			  
			this.getView().setBusy(true);

			var oModel = this.getView().getModel();
			var oCtx = oEvent.getSource().getBindingContext();
			var oBookTime = oCtx.getObject();

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
					oModel.deleteCreatedEntry(oCtx);
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
			this.getView().getModel().update(oEntry.getPath(), oData, {
				success: function () {
					var oRouter = this.fnGetRouterInstance();
					this.getView().setBusy(false);
					oRouter.navTo("RouteApp");
					MessageToast.show("Aktualisierung erfolgreich");
				}.bind(this),
				error: function (oError) {
					this.getView().setBusy(false);
					MessageToast.show("Es ist ein Fehler ist aufgetreten!");
				}.bind(this)
			});
		}

		/* =========================================================== */
		/* Techn. Platz oder Equipment Funktionen                      */
		/* =========================================================== */
/*
		valueHelp: function (oEvent) {
			var oElementData = oEvent.getSource().data();

			this.valueHelpFunctionalLocationOpenDialog(
				false,
				$.parseJSON(oElementData.functionalLocationSelectionAllowed),
				$.parseJSON(oElementData.equipmentSelectionAllowed),
				$.parseJSON(oElementData.functionalLocationsWithDisabledInstallationSelectionAllowed),
				oElementData.propertyModel,
				oElementData.idPropertyName,
				oElementData.descriptionPropertyName,
				oElementData.parentFunctionalLocationIdPropertyName,
				oElementData.parentFunctionalLocationDescriptionPropertyName,
				oElementData.isEquipmentPropertyName
			);
		},

		// Open Value Help Popup
		valueHelpFunctionalLocationOpenDialog: function (
			// Title of the dialog
			vTitle,
			// Flag whether Functional Locations may be selected
			bFunctionalLocationSelectionAllowed,
			// Flag whether Equipments may be selected
			bEquipmentSelectionAllowed,
			// Flag whether functional locations may be selected
			// that dont allow the installation of other equipments
			bFunctionalLocationsWithDisabledInstallationSelectionAllowed,
			// The name of the model to set the properties of
			// (see next 2 parameters)
			vResultPropertyModel,
			// Property name to set to the ID of the selected item
			// (set when the dialog gets closed)
			// Set to `false` when no value shall get set
			vItemIdResultProperty,
			// Property name to set to the description of the selected item
			// (set when the dialog gets closed)
			// Set to `false` when no value shall get set
			vItemDescriptionResultProperty,
			// Property name to set to the ID of the parent functional location of the item.
			// This only applies whwen the parent element is not an equipment
			// (set when the dialog gets closed)
			// Set to `false` when no value shall get set
			vItemParentFunctionalLocationIdProperty,
			// Property name to set to the Description of the parent functional location of the item.
			// This only applies whwen the parent element is not an equipment
			// (set when the dialog gets closed)
			// Set to `false` when no value shall get set
			vItemParentFunctionalLocationDescriptionProperty,
			// Property name to set to the flag whether the selected item is an equipment or not
			// Set to `false` when no value shall get set
			vIsEquipmentPropertyName
		) {
			// Validate Parameters
			// One of these two parameters has to be true because
			// else no single item could be validly selected
			if (!bFunctionalLocationSelectionAllowed && !bEquipmentSelectionAllowed) {
				throw "At least one of the parameters 'bFunctionalLocationSelectionAllowed' and 'bEquipmentSelectionAllowed' has to be true. Else no item could be validly selected";
			}

			Fragment.load({
				name: "com.app.mindsquare.zpmcreatenotif.fragments.valueHelp",
				controller: this
			}).then(oDialog => {
				// Bind data to fragment, to use it later
				this.valueHelpFunctionalLocationSaveConfig(
					oDialog,
					vTitle,
					bFunctionalLocationSelectionAllowed,
					bEquipmentSelectionAllowed,
					bFunctionalLocationsWithDisabledInstallationSelectionAllowed,
					vResultPropertyModel,
					vItemIdResultProperty,
					vItemDescriptionResultProperty,
					vItemParentFunctionalLocationIdProperty,
					vItemParentFunctionalLocationDescriptionProperty,
					vIsEquipmentPropertyName
				);

				this.getView().addDependent(oDialog);
				oDialog.open();
			});
		},
	*/
	});

});