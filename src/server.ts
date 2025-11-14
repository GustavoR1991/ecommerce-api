
// Importa a aplicação Express configurada no arquivo app.ts
import app from "./app";

// Define a porta do servidor, usando a variável de ambiente PORT ou 4000 como padrão
const PORT = process.env.PORT || 4000;

// Inicia o servidor e faz com que ele escute na porta definida
app.listen(PORT, () => {
  // Exibe uma mensagem no console quando o servidor estiver rodando
  console.log(`Server is running on port ${PORT}`);
});
