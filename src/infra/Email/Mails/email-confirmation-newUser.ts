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

    <h3>Você acabou de se registar no nosso sistema usando o email {{email}}</h3>
    <br/>
    <strong>Clique no link para confirmar sua conta: {{token}}</strong>

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
