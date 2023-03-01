export const NewAccountAndConfirmMailHbs = `<style>
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
  <label>Bem vindo ao Survello, Sr. <strong>{{name}}</strong>! Tudo bem?</label>

    <h3>Você acabou de se registar no nosso sistema</h3>
    <br/>
    <strong>Clique no link para confirmar seu email: {{link}}</strong>

</div>
    <br/>
    <br/>
    <h3>By <strong>Survello</strong></h3>
</div>`;

export default {
  NewAccountAndConfirmMailHbs,
};
