sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "br/com/gestao/fioriappadmin303/util/Formatter"], function (BaseController, Filter, FilterOperator, Formatter) {
  "use strict";

  return BaseController.extend("br.com.gestao.fioriappadmin303.controller.Lista", {
    objFormatter: Formatter,

    onInit: function () {
      // Força a inicialização com dados em PT-BR
      var oConfiguration = sap.ui.getCore().getConfiguration();
      oConfiguration.setLanguage("pt-BR");
    },

    onSearchName: function () {
      var idQuery = this.getView().byId("field0"); // Linka a variável idQuery ao elemento de ID field0
      var nameQuery = this.getView().byId("field1"); // Linka a variável nameQuery ao elemento de ID field1

      var oFilter = new Filter({
        /**Lembrar de Ler na documentação sobre os fields de FilterOperator para que consiga pesquisar em lowerCase() */
        filters: [
          new Filter("Productid", FilterOperator.Contains, idQuery.getValue()), // FIltra o "Productid" com uma operação Contains (Contem o valor digitado no idQuery)
          new Filter("Name", FilterOperator.Contains, nameQuery.getValue()), // FIltra o "Productid" com uma operação Contains (Contem o valor digitado no idQuery)
        ], // Filtra o "Name" com uma operação Contains (Contem o valor digitado no nameQuery)
        and: true, // TRUE = cada filtro por si - FALSE = necessário os dois filtros para procurar
      });

      var oTable = this.getView().byId("table1"); // Linka a variável oTable ao elemento de ID table1, no caso, a lista de produtos
      var binding = oTable.getBinding("items"); // Linka a variável binding aos binds da propriedade "ITEMS" do elemento "table1"

      binding.filter(oFilter); // Filtra os elementos da variável binding de acordo com as propriedades da variável oFilter
    },

    onRouting: function () {
      // Button dentro da view LISTA que faz o routing para a view Detalhes
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("Detalhes");
    },

    onSelectedItem: function (event) {
      // Button dentro da view LISTA que faz o routing para a view Detalhes

      // Passo 1 - Captura do Valor do Produto
      var oProductId = event.getSource().getBindingContext().getProperty("Productid"); // event.oQueFoiClicado.EmQualLinha.PropriedadeCorrespondenteNoMetadata / getObject().Projectid
      // var oProductId = event.getSource().getBindingContext("Nome do Model (models>manifest.json)").getProperty("Productid");

      //Passo 2 - Envio para o Route de Detalhes com Parametro
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("Detalhes", { Productid: oProductId });
    },
  });
});

//*** TESTAR SE ESSA FUNÇÃO
//****  PEGA AUTOMATICAMENTE A LINGUA   */
//************************************* */

// onInit: function () {
//   sap.ui.getCore().attachLocalizationChanged(this.onLocalizationChanged, this);
// },

// onLocalizationChanged: function () {
//   var oConfiguration = sap.ui.getCore().getConfiguration();
//   var sLanguage = oConfiguration.getLanguage();
//   // Perform language-specific initialization or logic here
//   oConfiguration.setLanguage(sLanguage);
//   console.log("Language changed to: " + sLanguage);
// },
