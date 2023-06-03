sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/format/NumberFormat", "br/com/gestao/fioriappadmin303/util/Formatter"], function (BaseController, NumberFormat, Formatter) {
  "use strict";

  return BaseController.extend("br.com.gestao.fioriappadmin303.controller.Detalhes", {
    objFormatter: Formatter,
    //Criar o Obj Route
    onInit() {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("Detalhes").attachMatched(this.onBindingProdutoDetalhes, this); // attachMatched = Sempre que o getRoute for chamado ele acopla uma outra função dentro dele
      // Acopla a função no onInit para que toda vez que o Route for chamado a função seja executada
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
      }
    },
  });
});
