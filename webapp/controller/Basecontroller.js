sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.app.mindsquare.maintcorderlist.controller.Basecontroller", {
		//Zentrale Methode um unsere Router Insatnz auslesen zu können
		fnGetRouterInstance: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}

	});

});