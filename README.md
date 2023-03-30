<h1 align="center">Survello</h1>

<p align="center">
  <a href="#about">Sobre este projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#recursos">Recursoso</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#docs">Docs</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#license">License</a>
</p>

## :notebook: Sobre este projeto

<div id="about"></div>

Template para criação de projetos em nodejs usando typescript e testes automatizados.

## Tecnologias 🐱‍🏍🎂

<div id="tecnologias"></div>

- [Node](http://nodejs.org/) - Nodejs
- [typescript](https://www.typescriptlang.org/) - Super Javascript
- [Jest](https://jestjs.io/) - UnitTest

### Recursos

<div id="recursos"></div>

- [x] Configuração para Typescript
- [x] Configuração para Either

### Docs

<div id="docs"></div>

### How to use

```js
git clone https://github.com/Colgate13/Survello
cd Survello

npm ci i
npm run test

```

### DDD

<img height="500" width="500" src="https://thewisedev.com.br/1a851f5f4c6168cd8b072ca72b4d9fe4.svg">

#### Modules

```
src/modules -> Cada modulo do sistema. toda a funcionalidade especifica dess Ex: src/modules/users
```

#### Modules -> Domain (Camada de Entity/Entidades)

```
src/modules/users/Domain -> Entitys do especificamente do user Ex: src/modules/users/Domain
```

#### Modules -> repositories (Camada de repositorios do user. Ex: pode ser a ponte de aceso ao banco)

```
src/modules/users/repositories -> Casos de uso do Users Ex: src/modules/users/repositories
```

#### Modules -> mappers (Camada de mappers, usam o Domain para mapear dados brutos vindos do banco)

```
src/modules/users/mappers -> Casos de uso do Users Ex: src/modules/users/mappers
```

#### Modules -> UseCases (Camada de Usecases/Camada de Uso)

```
src/modules/users/useCases -> Casos de uso do Users Ex: src/modules/users/useCases
```

#### shared -> shared (Camada de compartilhada entre todo o projeto)

```
src/shared/ -> Interfaces, funcoes ou tudo que todo o projeto precise utilzar.
```

#### infra -> infra (Camada de infraestrutura do projeto. Banco, Servidor HTTPS, Servidor WS)

```
src/infra/ -> Classes que manipulam servidores http, banco. exemplo aqui ficaria as classes do express
```

#### core -> core (Camada de Core. Inicialmente implementacao do Either)

```
src/core/
```

Link para estudar: https://dev.to/attila_vecerek/the-either-monad-3ooc

### Either como usar

```ts
import { Either, left, right } from '../../../core/logic/Either';

export class InvalidUser extends Error {
  constructor() {
    super(`User invalid`);
    this.name = 'InvalidUser';
  }
}

interface IUser {
    name: string;
    email: string;
}

createUser = (userProps): Either<InvalidUser | Error, IUser> => {
  if(!userProps) return left(new InvalidUser())

  return right({
    name: userProps.name;
    email: userProps.email;
  });
};

const user = createUser(userProps);

if(user.isLeft()) // isLeft => com erros

if(user.isRight()) // isRight => Sem nenhum error

```

## License

<div id="license"></div>

MIT [LICENSE](LICENSE.md)
