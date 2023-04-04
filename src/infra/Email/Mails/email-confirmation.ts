export const hbs = `<style>
.container {
    width: 800px;
    justify-content: center;
    align-items: center;
    align-content: center;
    display: flex;
    flex-direction: column;
}
</style>


<div class="container">
    <label>Olá <strong>{{name}}</strong>! Tudo bem?</label>

    <h3>Você acabou de alterar seu email no sistema para o email: "{{email}}"</h3>
    <br/>
    <strong>Clique no link para confirmar seu novo email: <a href={{linkConfirm}}>Click here</a></strong>

</div>
    <br/>
    <br/>
    <h3>By <strong>Survello</strong></h3>
</div>`;

export const title = 'Confirmação de email';

export default {
  hbs,
  title,
};
