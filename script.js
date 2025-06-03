
const divCatalogo = document.getElementById('catalogo');

async function fetchProdutos(){
    try{
      const resposta =  await fetch('https://fakestoreapi.com/products');
      const listaProdutos = resposta.json();
      console.log(listaProdutos);
    } catch (error) {
        console.error("Erro na requisição da API", error);
        divCatalogo.innerHTML = "<h1>Site indisponível, tente novamente</h1>"
    }
}

fetchProdutos();