        function limpa_formulário_cep() {
                //Limpa valores do formulário de cep.
                document.getElementById('rua').innerHTML=("");
                document.getElementById('bairro').innerHTML=("");
                document.getElementById('cidade').innerHTML=("");
                document.getElementById('uf').innerHTML=("");
                document.getElementById('ibge').innerHTML=("");
                document.getElementById('tabela').style.display = 'none';
        }

        function meu_callback(conteudo) {
            if (!("erro" in conteudo)) {
                document.getElementById('message').style.color = '#9ACD32';
                document.getElementById('message').innerHTML = 'CEP válido.';
                document.getElementById('tabela').style.display = 'inline';
                //Atualiza os campos com os valores.
                document.getElementById('rua').innerHTML=(conteudo.logradouro);
                document.getElementById('bairro').innerHTML=(conteudo.bairro);
                document.getElementById('cidade').innerHTML=(conteudo.localidade);
                document.getElementById('uf').innerHTML=(conteudo.uf);
                document.getElementById('ibge').innerHTML=(conteudo.ibge);
            } //end if.
            else {
                //CEP não Encontrado.
                limpa_formulário_cep();
                document.getElementById('message').style.color = '#FF0000';
                document.getElementById('message').innerHTML="CEP não encontrado.";
            }
        }

        function pesquisacep(valor) {
            document.getElementById('message').style.color = '#000080';
            document.getElementById('message').innerHTML = '...';

            //Nova variável "cep" somente com dígitos.
            var cep = valor.replace(/\D/g, '');

            //Verifica se campo cep possui valor informado.
            if (cep != "") {

                //Expressão regular para validar o CEP.
                var validacep = /^[0-9]{8}$/;

                //Valida o formato do CEP.
                if(validacep.test(cep)) {

                    //Preenche os campos com "..." enquanto consulta webservice.
                    document.getElementById('rua').innerHTML="...";
                    document.getElementById('bairro').innerHTML="...";
                    document.getElementById('cidade').innerHTML="...";
                    document.getElementById('uf').innerHTML="...";
                    document.getElementById('ibge').innerHTML="...";

                    //Cria um elemento javascript.
                    var script = document.createElement('script');

                    //Sincroniza com o callback.
                    script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

                    //Insere script no documento e carrega o conteúdo.
                    document.body.appendChild(script);

                } //end if.
                else {
                    //cep é inválido.
                    limpa_formulário_cep();
                    document.getElementById('message').style.color = '#FF0000';
                    document.getElementById('message').innerHTML = 'Formato de CEP inválido.';
                }
            } //end if.
            else {
                //cep sem valor, limpa formulário.
                limpa_formulário_cep();
                document.getElementById('message').style.color = '#FF0000';
                document.getElementById('message').innerHTML = 'O campo não possui números. Por favor, preencha o campo e tente novamente.';
            }
        };
