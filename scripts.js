/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
function formatDate(date) {
  var dataorig = new Date(date);
  var userTimezoneOffset = dataorig.getTimezoneOffset() * 60000;
  var d = new Date(dataorig.getTime() + userTimezoneOffset);
  
  var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('/');
}


const getList = async () => {
  let url = 'http://127.0.0.1:5000/tarefas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.tarefas.length > 0)
      {
        data.tarefas.forEach(item => insertList(item.nome, item.comentario,formatDate(item.data_conclusao)))
      }
      else{
        alert('Não existem tarefas cadastradas');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputTarefa, inputComment, inputDate ) => {
  const formData = new FormData();
  formData.append('nome', inputTarefa);
  formData.append('comentario', inputComment);
  formData.append('data_conclusao', inputDate);

  let url = 'http://127.0.0.1:5000/tarefa';
  fetch(url, {
    method: 'post',
    body: formData
  })
    /*.then((response) => response.json())*/
    .then((response) => {
      if(!response.ok) {
        if (response.status == 409)
        {
          alert('Nome de tarefa já existe.');
        }
        else{
          alert('Erro ao adicionar! Código de erro:' + response.status);
        }
        
       }
      else {
        insertList(inputTarefa, inputComment ,formatDate(inputDate));
        alert("Item adicionado!");
       return response.json();
     }    
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/tarefa?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, descrição e data conclusão 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  
  let inputTarefa = document.getElementById("newInput").value;
  let inputComment = document.getElementById("newComment").value;
  let inputDate = document.getElementById("newDate").value;

  if (inputTarefa === '') {
    alert("Escreva o nome de uma tarefa!");
    } else {
    postItem(inputTarefa, inputComment, inputDate);
    //alert("Item adicionado!");
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameTarefa,  comment, date) => {
  var item = [nameTarefa, comment, date]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newComment").value = "";
  document.getElementById("newDate").value = "";

  removeElement()
}