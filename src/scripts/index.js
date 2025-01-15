angular.module("listaDeContatos", ["ngMessages"])
angular.module("listaDeContatos").controller("listaDeContatosCtrl", function($scope, $http){

    $scope.app = "Lista de Contatos";
    $scope.contatos = [];

    $scope.contatoEditando = false; 

    var host = "https://listadecontatosapi-production.up.railway.app";

    var carregarContatos = function(){
        $http.get(host + "/usuarios")
            .then(function(response) {
                $scope.contatos = response.data;
                console.log(data);
            })
            .catch(function(error) {
                console.log("Erro ao carregar contatos:", error);
            });
    };      

    $scope.adicionarContato = function(contato){
        if(contato.nome && contato.telefone) {
            $http.post(host + "/usuarios", contato)
                .then(function(response){
                    $scope.contato = {};
                    $scope.contatoForm.$setPristine();
                    carregarContatos();
                });        
        }
    };

    $scope.editarContato = function(contato) {
        $scope.contatos.forEach(function(c) {
            c.selecionado = false;
        });
        contato.selecionado = true;

        $scope.contatoEditando = true;
        $scope.contato = angular.copy(contato); 

        if ($scope.unwatchSelecionado) {
            $scope.unwatchSelecionado(); 
        }    

        $scope.unwatchSelecionado = $scope.$watch(() => contato.selecionado, function (novoValor) {
        if (!novoValor && $scope.contatoEditando) {
            $scope.cancelarEdicao();
        }});
    };

    $scope.cancelarEdicao = function() {
        $scope.contatoEditando = false; 
        $scope.contatos.forEach(function(c) {
            c.selecionado = false;
        });
        $scope.contato = {};
        $scope.contatoForm.$setPristine(); 
    };
    
    
    $scope.salvarContato = function (contato) {
        if ($scope.contatoEditando) {
            $http.put(host + '/usuarios/' + contato.id, contato)
                .then(function (response) {
                    let index = $scope.contatos.findIndex(c => c.id === contato.id);
                    $scope.contatos[index] = response.data;
                    $scope.contatoEditando = false;
    
                    $scope.contatos.forEach(function (c) {
                        c.selecionado = false;
                    });
    
                    delete $scope.contato;
                    $scope.contatoForm.$setPristine();
                })
                .catch(function (error) {
                    console.error('Erro ao editar o contato:', error);
                    alert('Não foi possível editar o contato. Tente novamente.');
                });
        } else {
            $http.post(host + '/usuarios', contato)
                .then(function (response) {
                    $scope.contatos.push(response.data);
                    delete $scope.contato;
                    $scope.contatoForm.$setPristine();
                })
                .catch(function (error) {
                    console.error('Erro ao adicionar o contato:', error);
                });
        }
    };    
    
    $scope.apagarContatos = function (contatos) {
        let contatosSelecionados = contatos.filter(contato => contato.selecionado);
        
        contatosSelecionados.forEach(contato => {
            console.log("Tentando excluir o contato com ID:", contato.id); 
    
            $http.delete(host + `/usuarios/${contato.id}`)
                .then(function (response) {
                    console.log('Contato excluído com sucesso:', contato);
                    $scope.contatos = $scope.contatos.filter(c => c.id !== contato.id);
                    $scope.contato = {};
                    $scope.contatoForm.$setPristine(); 
                    contato.selecionado = false;
                })
                .catch(function (error) {
                    console.error('Erro ao excluir o contato:', error);
                    alert(`Não foi possível excluir o contato: ${contato.nome}`);
                });
        });
    };
    
    $scope.isContatoSelecionado = function(contatos){
        return contatos.some(function(contato){
            return contato.selecionado;
        });
    };

    carregarContatos();
});