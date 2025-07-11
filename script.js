const apiKeyInput = document.querySelector("#apiKey");
const gameSelect = document.querySelector("#gameSelect");
const questionInput = document.querySelector("#questionInput");
const askButton = document.querySelector("#askButton");
const aiResponse = document.querySelector("#aiResponse");
const form = document.querySelector("form");

const markdownToHTML = (text) => {
  const converter = new showdown.Converter();
  return converter.makeHtml(text);
};
//chave api google AIzaSyD8zKr5ja44qwMm7UqGm03HAg06CIuJRnQ
const perguntarIA = async (question, game, apiKey) => {
  // perguntarIA(question, game, apiKey)
  const model = "gemini-2.0-flash";

  const baseURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const pergunta = `
        ## Espelialidade
        - Você é um especialista assistente de meta para o jogo ${game} 
        
        ## Tarefa
       - Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas 
        
        ## Regras
        - Se você não sabe a resposta, responda com "Não sei" e não tente inventar uma resposta.
        - Se a pergunta não está relacionada ao jogo responda com "Essa pergunta não está relacionada com o jogo."
        - Considere a data atual ${new Date().toLocaleDateString()} e faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
        - Nunca responda itens que vc não tenha certeza de que existe no pach atual.
        
        ## Resposta
        - Economize na resposta e responda no máximo 500 caracteres
        - Responda em markdown
        - Não precisa fazer nenhuma saudação ou  despedida, apenas responda o que o usuário está querendo.
        
        ## Exemplo de resposta
        - Pergunda do usuário: Merlhor build Rengar jungle?
        resposta: A build mais atual é: \n\n **Itens:**\n coloque os itens aqui.\n\n**Runas:\n\nexemplo de runas\n\n

        ---
        Aqui está apargunta do usuário: ${question}
    `;
  const contents = [
    {
      parts: [
        {
          text: pergunta,
        },
      ],
    },
  ];

  const tools = [
    {
      google_search: {},
    },
  ];
  const response = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      tools,
    }),
  });
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

const enviarFormulario = async (event) => {
  event.preventDefault();
  const apiKey = apiKeyInput.value;
  const game = gameSelect.value;
  const question = questionInput.value;

  if (apiKey == "" || game === "" || question == "") {
    alert("Por favor, preencha todos os campos");
    return;
  }
  askButton.disabled = true;
  askButton.textContent = "Perguntando...";
  askButton.classList.add("loading");

  try {
    // perguntar para a IA
    const text = await perguntarIA(question, game, apiKey);

    aiResponse.querySelector(".response-content").innerHTML =
      markdownToHTML(text);
    aiResponse.classList.remove("hidden");
  } catch (error) {
    console.log("Erro: ", error);
  } finally {
    askButton.disabled = false;
    askButton.textContent = "Perguntar";
    askButton.classList.remove("loading");
  }
};
form.addEventListener("submit", enviarFormulario);
