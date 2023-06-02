sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/NumberFormat"
  ],
  function (BaseController, NumberFormat) {
    "use strict";

    return BaseController.extend("br.com.gestao.fioriappreport303.controller.Detalhes", {
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
          parameters: { expand: 'to_cat' },
          events: {
            change: this.onBindingChange.bind(this),
            dataRequested: function () {
              oView.setBusy(true); // deixa a view ocupada até receber a resposta do serviço
            },
            dataReceived: function (data) { // quando receber a resposta, tira o setBusy
              debugger;
              oView.setBusy(false);
            }
          }
        });
      },

      onBindingChange: function (oEvent) {
        var oView = this.getView();
        var oElementBinding = oView.getElementBinding();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        if (!oElementBinding.getBoundContext()) { // SE não exister um elemento (registro) válido eu farei uma ação que é redirecionar para uma nova VIEW
          oRouter.getTargets().display("objectNotFound"); // Pega as targets dentro do manifest.json e mostra a view correspondente a target ObjectNotFound
          return;
        }
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

      floatNumber: function (value) { // APresentar os valores numéricos formatados tipo decimal
        var floatNumber = NumberFormat.getFloatInstance({
          maxFractionDigits: 2,
          minFractionDigits: 2,
          groupingEnabled: true,
          goupingSeparator: ".",
          decimalSeparator: ","
        });

        return floatNumber.format(value);
      }

    });


  }

);

;
