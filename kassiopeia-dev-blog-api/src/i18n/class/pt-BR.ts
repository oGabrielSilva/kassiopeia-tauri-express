export default {
  $metadata: {
    label: 'Português (Brasil)',
    code: 'pt-BR',
  },
  exceptions: {
    400: 'Erro do cliente',
    401: 'Operação não autorizada',
    404: 'Recurso não encontrado',
    409: 'Foi encontrado um conflito em sua requisição',
    413: 'Carga útil muito grande',
    500: 'Erro interno e inesperado',
    syntax: 'Erro de sintaxe. Requisição mal formada',
  },
  bodyInvalid: 'Corpo da requisição inválido ou vazio',
  emailInvalid: 'Email não é considerado válido',
  passwordUndefined: 'Senha não definida',
  passwordInvalid: 'Senha não é segura o suficiente',
  userAlreadyExists: 'Usuário já está cadastrado na plataforma',
  userNotFound: 'Usuário não está registrado',
  credentialsError: 'Credenciais incorretas',
  partialUpdateEmpty:
    'O usuário está tentando atualizar algo, mas não forneceu as informações necessárias',
  avatarMimetype: 'Avatar precisa ser uma imagem (jpeg, png ou webp)',
  uploadBufferInternalError: 'Oops! Parece que algo deu errado durante o upload',
};
