sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "br/com/gestao/fioriappadmin303/util/Formatter", "sap/ui/core/Fragment", "sap/ui/core/ValueState", "sap/ui/model/json/JSONModel", "br/com/gestao/fioriappadmin303/util/Validator"], function (BaseController, Filter, FilterOperator, Formatter, Fragment, ValueState, JSONModel, Validator) {
  "use strict";

  return BaseController.extend("br.com.gestao.fioriappadmin303.controller.Lista", {
    objFormatter: Formatter,

    onInit: function () {
      sap.ui.getCore().attachValidationError(function (oEvent) {
        oEvent.getParameter("element").setValueState(ValueState.Error);
      });
      sap.ui.getCore().attachValidationSuccess(function (oEvent) {
        // o value state só funciona se o objeto possuir uma constraint dentro do XML
        oEvent.getParameter("element").setValueState(ValueState.Success);
      });
      // Força a inicialização com dados em PT-BR
      // var oConfiguration = sap.ui.getCore().getConfiguration();
      // oConfiguration.setLanguage("pt-BR");
    },

    criarModel: function () {
      // Model Produto
      var oModel = new JSONModel();
      this.getView().setModel(oModel, "MDL_Produto");
    },
    onSearchName: function () {
      var idQuery = this.getView().byId("field0"); // Linka a variável idQuery ao elemento de ID field0
      var nameQuery = this.getView().byId("field1"); // Linka a variável nameQuery ao elemento de ID field1
      var categoryQuery = this.getView().byId("field2");

      var objFilter = { filters: [], and: true };
      objFilter.filters.push(new Filter("Productid", FilterOperator.Contains, idQuery.getValue()));
      objFilter.filters.push(new Filter("Name", FilterOperator.Contains, nameQuery.getValue()));
      objFilter.filters.push(new Filter("Category", FilterOperator.Contains, categoryQuery.getValue()));

      var oFilter = new Filter(objFilter);

      /*
      var oFilter = new Filter({
        // Lembrar de Ler na documentação sobre os fields de FilterOperator para que consiga pesquisar em lowerCase() 
        filters: [
          new Filter("Productid", FilterOperator.Contains, idQuery.getValue()), // FIltra o "Productid" com uma operação Contains (Contem o valor digitado no idQuery)
          new Filter("Name", FilterOperator.Contains, nameQuery.getValue()), // FIltra o "Productid" com uma operação Contains (Contem o valor digitado no idQuery)
        ], // Filtra o "Name" com uma operação Contains (Contem o valor digitado no nameQuery)
        and: true, // TRUE = cada filtro por si - FALSE = necessário os dois filtros para procurar
      }); */

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

    onCategoria: function (oEvent) {
      this._oInput = oEvent.getSource().getId(); // getSource = Origem
      var oView = this.getView();

      if (!this._CategoriaSearchHelp) {
        // se this._CategoriaSearchHelp não existe...
        this._CategoriaSearchHelp = Fragment.load({
          // Importado na função de Origem do Controller - dá load no fragment no ID do oView
          id: oView.getId(),
          name: "br.com.gestao.fioriappadmin303.frags.SH_Categorias",
          controller: this,
        }).then(function (oDialog) {
          oView.addDependent(oDialog); // oDialog = conteúdo do Fragment.load({oDialog})
          return oDialog;
        });
      }

      this._CategoriaSearchHelp.then(function (oDialog) {
        oDialog.getBinding("items").filter([]); // Abre o filtro em Branco, limpando a ultima pesquisa.

        // Abre o Fragment
        oDialog.open();
      });
    },
    onNovoProduto: function (oEvent) {
      //Criar o Model Produto
      this.criarModel();
      var oView = this.getView();

      if (!this._Produto) {
        // se this._CategoriaSearchHelp não existe...
        this._Produto = Fragment.load({
          // Importado na função de Origem do Controller - dá load no fragment no ID do oView
          id: oView.getId(),
          name: "br.com.gestao.fioriappadmin303.frags.Insert",
          controller: this,
        }).then(function (oDialog) {
          oView.addDependent(oDialog); // oDialog = conteúdo do Fragment.load({oDialog})
          return oDialog;
        });
      }

      this._Produto.then(function (oDialog) {
        // Abre o Fragment
        oDialog.open();
      });
    },
    onValueHelpSearch: function (oEvent) {
      var sValue = oEvent.getParameter("value"); // captura o valor digitado pelo usuário

      /* OPÇÃO 1 - Cria um único Filtro
      var oFilter = new Filter("Description", FilterOperator.Contains, sValue); // Cria um Filter que recebe o sValue e associa na Propriedade "Description"
      oEvent.getSource().getBinding("items").filter([oFilter]); */

      //OPÇÃO 2 - Cria um filtro dinâmico, adicionando várias propriedades
      var objFilter = { filters: [], and: false };
      objFilter.filters.push(new Filter("Description", FilterOperator.Contains, sValue));
      objFilter.filters.push(new Filter("Category", FilterOperator.Contains, sValue));

      var oFilter = new Filter(objFilter);
      oEvent.getSource().getBinding("items").filter(oFilter);
    },

    onValueHelpClose: function (oEvent) {
      var oSelectedItem = oEvent.getParameter("selectedItem");
      var oInput = null;

      if (this.byId(this._oInput)) {
        oInput = this.byId(this._oInput);
      } else {
        oInput = sap.ui.getCore().byId(this._oInput);
      }

      if (!oSelectedItem) {
        oInput.resetProperty("value");
        return;
      }
      oInput.setValue(oSelectedItem.getTitle());
    },
    clearFilter: function () {
      var searchFieldId = "field2"; // Replace with the actual ID of your search field

      var oInput = null;

      if (this.byId(searchFieldId)) {
        oInput = this.byId(searchFieldId);
      } else {
        oInput = sap.ui.getCore().byId(searchFieldId);
      }

      if (oInput) {
        oInput.setValue("");
      }
    },
    pressValidation: function () {
      // ↓ Cria o objeto Validator ↓
      var validator = new Validator();
      // ↓ Chama a validação ↓
      if (validator.validate(this.byId("dialog0"))) {
        this.onInsert();
      }
    },
    onInsert: function () {
      var oModel = this.getView().getModel("MDL_Produto").getData();
      // var objNovo = oModel.getData();
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
// }
