sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/format/NumberFormat", "br/com/gestao/fioriappadmin303/util/Formatter", "sap/ui/core/Fragment", "sap/ui/model/json/JSONModel"], function (BaseController, NumberFormat, Formatter, Fragment, JSONModel) {
  "use strict";

  return BaseController.extend("br.com.gestao.fioriappadmin303.controller.Detalhes", {
    objFormatter: Formatter,
    //Criar o Obj Route
    onInit() {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      // Acopla a função no onInit para que toda vez que o Route for chamado a função seja executada
      oRouter.getRoute("Detalhes").attachMatched(this.onBindingProdutoDetalhes, this); // attachMatched = Sempre que o getRoute for chamado ele acopla uma outra função dentro dele

      // -------
      // 1 - Chamar a função para fazer o carregamento dos fragments iniciais
      this._formFragments = {};
      this._showFormFragments("DisplayBasicInfo", "vboxBasicInfo");
      this._showFormFragments("DisplayTechInfo", "vboxTechInfo");

      this._habilitaEdicao(false);
    },
    // 2 - Receber como parametro o nome do Fragment e o nome do ID da VBOX Destino
    _showFormFragments: function (sFragmentName, sVBoxName) {
      var objVBox = this.byId(sVBoxName);
      objVBox.removeAllItems();

      this._getFormAllItems(sFragmentName).then(function (oVBox) {
        objVBox.insertItem(oVBox);
      });
    },

    // 3 - Cria o Objeto Fragment baseado no Nome e Adiciona em um Objeto com uma coleção de Fragments
    _getFormAllItems: function (sFragmentName) {
      var oFormFragment = this._formFragments[sFragmentName];
      var oView = this.getView();
      if (!oFormFragment) {
        oFormFragment = Fragment.load({
          id: oView.getId(),
          name: "br.com.gestao.fioriappadmin303.frags." + sFragmentName,
          controller: this,
        });
        this._formFragments[sFragmentName] = oFormFragment;
      }
      return oFormFragment;
    },

    onBindingProdutoDetalhes: function (oEvent) {
      // Capturando o parametro trafegado no Route Detalhes - ProductID
      var oProduto = oEvent.getParameter("arguments").Productid;

      // Crie um Objeto referente a View Detalhes
      var oView = this.getView();

      // Criar a URL de chamada da nossa entidade de Produtos - stringURL
      var sURL = "/Produtos('" + oProduto + "')"; // Essa forma de tratar a variável oProduto diz ao código que ela vai ser tratada como uma string dentro do URL

      oView.bindElement({
        path: sURL,
        parameters: { expand: "to_cat" },
        events: {
          change: this.onBindingChange.bind(this),
          dataRequested: function () {
            oView.setBusy(true); // deixa a view ocupada até receber a resposta do serviço
          },
          dataReceived: function (data) {
            // quando receber a resposta, tira o setBusy
            oView.setBusy(false);
          },
        },
      });
    },

    onBindingChange: function (oEvent) {
      var oView = this.getView();
      var oElementBinding = oView.getElementBinding();
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      if (!oElementBinding.getBoundContext()) {
        // SE não exister um elemento (registro) válido eu farei uma ação que é redirecionar para uma nova VIEW
        oRouter.getTargets().display("objectNotFound"); // Pega as targets dentro do manifest.json e mostra a view correspondente a target ObjectNotFound
        return;
      } else {
        // Se Não existir, clonamos o registro atual
        this._oProduto = Object.assign({}, oElementBinding.getBoundContext().getObject());
      }
    },
    onNavBack: function () {
      this._habilitaEdicao(false);
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("Lista");
    },
    criarModel: function () {
      // Model Produto
      var oModel = new JSONModel();
      this.getView().setModel(oModel, "MDL_Produto");
    },
    handleEdit: function () {
      // Cria o Model
      this.criarModel();

      // Atribui o Model ao Registro
      var oModelProduto = this.getView().getModel("MDL_Produto");
      oModelProduto.setData(this._oProduto);

      // Habilita a Edição
      this._habilitaEdicao(true);
    },
    handleCancel: function () {
      // Restaura o registro atual
      var oModel = this.getView().getModel();
      oModel.refresh(true);

      this._habilitaEdicao(false); // volta para somente leitura
    },
    handleSave: function () {
      // Salva e Restaura o registro atual
      var oModel = this.getView().getModel();
      oModel.refresh(true);

      this._habilitaEdicao(false); // volta para somente leitura
    },
    _habilitaEdicao: function (bEdit) {
      var oView = this.getView();

      // Botões de Ações
      oView.byId("editButton").setVisible(!bEdit);
      oView.byId("deleteButton").setVisible(bEdit);
      oView.byId("saveButton").setVisible(bEdit);
      oView.byId("cancelButton").setVisible(bEdit);

      // Seções das Páginas - Habilitar ou Desabilitar
      oView.byId("objPage0").setVisible(!bEdit);
      oView.byId("objPage1").setVisible(!bEdit);
      oView.byId("objPage2").setVisible(bEdit);

      if (bEdit) {
        this._showFormFragments("Change", "vboxChangeProduct");
      } else {
        this._showFormFragments("DisplayBasicInfo", "vboxBasicInfo");
        this._showFormFragments("DisplayTechInfo", "vboxTechInfo");
      }
    },
  });
});

/* Function para botão com ação de retornar para outra View
Dentro do XML na propriedade Press do button é possivel colocar ="history.back()" ---- Vou adicionar a função por via de conhecimento

onNavBack: function(){
  var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
  oRouter.navTo("Lista")
} */
