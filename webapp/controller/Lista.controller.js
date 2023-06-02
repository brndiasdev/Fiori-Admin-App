sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function (BaseController, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("br.com.gestao.fioriappreport303.controller.Lista", {
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
            new Filter("Name", FilterOperator.Contains, nameQuery.getValue())], // Filtra o "Name" com uma operação Contains (Contem o valor digitado no nameQuery)
          and: true, // TRUE = cada filtro por si - FALSE = necessário os dois filtros para procurar
        });

        var oTable = this.getView().byId("table1"); // Linka a variável oTable ao elemento de ID table1, no caso, a lista de produtos
        var binding = oTable.getBinding("items"); // Linka a variável binding aos binds da propriedade "ITEMS" do elemento "table1"

        binding.filter(oFilter); // Filtra os elementos da variável binding de acordo com as propriedades da variável oFilter
      },

      date: function (value) {

        var oConfiguration = sap.ui.getCore().getConfiguration(); // salva as configurações do site na variável
        var oLocale = oConfiguration.getLanguage(); // salva a configuração de linguagem do site na variável
        var oPattern = ""; // cria uma variável para comparar a linguagem no IF abaixo

        if (oLocale === "pt-BR") {
          oPattern = "dd/MM/yyyy"
        } else {
          oPattern = "MM/dd/YYYY"
        }

        if (value) {
          var year = new Date().getFullYear(); // Salva o ano atual na variável
          if (year === 9999) {
            return "";
          } else {

            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
              // style: "short",
              pattern: oPattern
            });

            return oDateFormat.format(new Date(value));
          }
        } else { return value; }
      },
      statusProduto: function (value) { // Apresentar o texto do Status mediante a propriedade Status do Model i18n
        var oBundle = this.getView().getModel("i18n").getResourceBundle();

        try {
          return oBundle.getText("status" + value);
        } catch (err) {
          return "";
        }

      },

      stateProduto: function (value) { // Apresentar a cor do State mediante o Status da propriedade
        try {
          if (value === "E") {
            return "Success";
          } else if (value === "P") {
            return "Warning";
          } else if (value === "F") {
            return "Error";
          } else {
            return "None";
          }


        } catch (err) {
          return "None";
        }
      },
      iconeProduto: function (value) { // Apresentar a cor do State mediante o Status da propriedade
        try {
          if (value === "E") {
            return "sap-icon://sys-enter-2";
          } else if (value === "P") {
            return "sap-icon://warning";
          } else if (value === "F") {
            return "sap-icon://error";
          } else {
            return "sap-icon://sys-cancel";
          }


        } catch (err) {
          return "sap-icon://sys-cancel";
        }
      },

      onRouting: function () { // Button dentro da view LISTA que faz o routing para a view Detalhes
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("Detalhes");
      },

      onSelectedItem: function (event) { // Button dentro da view LISTA que faz o routing para a view Detalhes

        // Passo 1 - Captura do Valor do Produto
        var oProductId = event.getSource().getBindingContext().getProperty("Productid"); // event.oQueFoiClicado.EmQualLinha.PropriedadeCorrespondenteNoMetadata / getObject().Projectid
        // var oProductId = event.getSource().getBindingContext("Nome do Model (models>manifest.json)").getProperty("Productid");

        //Passo 2 - Envio para o Route de Detalhes com Parametro
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("Detalhes", { Productid: oProductId });
      }


    })
  }
)



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