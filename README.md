# Projeto Talker Manager

## Descrição

Foi construída uma aplicação de cadastro de talkers (palestrantes) em que é possível cadastrar, visualizar, pesquisar, editar e excluir informações. Os principais objetivos eram:

- Desenvolver uma API de um CRUD (Create, Read, Update e Delete) de palestrantes (talkers) e;
- Desenvolver alguns endpoints que irão ler e escrever em um arquivo utilizando o módulo fs.

## Rotas criadas

Foram criados os seguintes endpoints:
- GET /talker
- GET /talker/:id
- POST /login
- POST /talker
- PUT /talker/:id
- DELETE /talker/:id
- GET /talker/search?q=searchTerm

## Como rodar

Primeiramente deve-se instalar os pacotes necessários com `npm install`.
Para rodar a aplicação, precisa inicializar o servidor utilizando o Nodemon com o comando `npm run dev`.
