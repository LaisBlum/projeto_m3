import readline from "readline";
import fetch from "node-fetch"; // Instale com npm install node-fetch@2

// Criando interface de entrada no terminal
const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let respostas = {};

// Função para perguntar e capturar respostas
function perguntarInsert(tabela) {
    switch (tabela) {
        case "professor":
            prompt.question("Nome do professor: ", (nome) => {
                respostas.nome = nome.trim();
                prompt.question("CPF do professor: ", (cpf) => {
                    respostas.cpf = cpf.trim();
                    finalizarInsert("professor");
                });
            });
            break;

        case "modalidade":
            prompt.question("Nome da modalidade: ", (nome) => {
                respostas.nome = nome.trim();
                finalizarInsert("modalidade");
            });
            break;

        case "turma":
            prompt.question("Id da modalidade: ", (id_modalidade) => {
                respostas.id_modalidade = parseInt(id_modalidade.trim(), 10);
                prompt.question("Id do professor: ", (id_professor) => {
                    respostas.id_professor = parseInt(id_professor.trim(), 10);
                    prompt.question("Horário de início (H:m:s): ", (horario_inicio) => {
                        respostas.horario_inicio = horario_inicio.trim();
                        prompt.question("Horário do fim (H:m:s): ", (horario_fim) => {
                            respostas.horario_fim = horario_fim.trim();
                            finalizarInsert("turma");
                        });
                    });
                });
            });
            break;

        default:
            console.log("Tabela inválida!");
            prompt.close();
    }
}

async function finalizarInsert(tabela) {
    console.log("Respostas coletadas:", respostas);

    // Enviar dados para o servidor via POST
    try {
        const response = await fetch(`http://localhost:3000/insert/${tabela}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(respostas),
        });

        const resultado = await response.text();
        console.log("Resposta do servidor:", resultado);
    } catch (error) {
        console.error("Erro ao enviar dados para o servidor:", error);
    } finally {
        prompt.close();
    }
}

// Função para perguntar e capturar respostas
function perguntarUpdate(tabela) {
    prompt.question("Informe o ID do registro a ser atualizado: ", (id) => {
        respostas.id = parseInt(id.trim(), 10);

        switch (tabela) {
            case "professor":
                prompt.question("Novo nome do professor: ", (nome) => {
                    respostas.nome = nome.trim();
                    prompt.question("Novo CPF do professor: ", (cpf) => {
                        respostas.cpf = cpf.trim();
                        finalizarUpdate("professor");
                    });
                });
                break;

            case "modalidade":
                prompt.question("Novo nome da modalidade: ", (nome) => {
                    respostas.nome = nome.trim();
                    finalizarUpdate("modalidade");
                });
                break;

            case "turma":
                prompt.question("Novo Id da modalidade: ", (id_modalidade) => {
                    respostas.id_modalidade = parseInt(id_modalidade.trim(), 10);
                    prompt.question("Novo Id do professor: ", (id_professor) => {
                        respostas.id_professor = parseInt(id_professor.trim(), 10);
                        prompt.question("Novo horário de início (H:m:s): ", (horario_inicio) => {
                            respostas.horario_inicio = horario_inicio.trim();
                            prompt.question("Novo horário de fim (H:m:s): ", (horario_fim) => {
                                respostas.horario_fim = horario_fim.trim();
                                finalizarUpdate("turma");
                            });
                        });
                    });
                });
                break;

            default:
                console.log("Tabela inválida!");
                prompt.close();
        }
    });
}

async function finalizarUpdate(tabela) {
    console.log("Respostas coletadas:", respostas);

    // Enviar dados para o servidor via PUT
    try {
        const response = await fetch(`http://localhost:3000/update/${tabela}/${respostas.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(respostas),
        });

        const resultado = await response.text();
        console.log("Resposta do servidor:", resultado);
    } catch (error) {
        console.error("Erro ao enviar dados para o servidor:", error);
    } finally {
        prompt.close();
    }
}

// Função para capturar dados do SELECT
async function realizarSelect(tabela) {
    console.log(`Buscando registros na tabela: ${tabela}...`);

    try {
        const response = await fetch(`http://localhost:3000/${tabela}`, {
            method: "GET",
        });

        if (response.status === 200) {
            const resultado = await response.json();
            console.log("Registros encontrados:", resultado);
        } else {
            const mensagemErro = await response.text();
            console.log("Erro do servidor:", mensagemErro);
        }
    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
    } finally {
        prompt.close();
    }
}

// Função para capturar dados do DELETE
function perguntarDelete(tabela) {
    prompt.question("Informe o ID do registro que deseja deletar: ", async (id) => {
        const registroId = parseInt(id.trim(), 10);

        
        // Enviar solicitação ao servidor
        try {
            const response = await fetch(
                `http://localhost:3000/delete/${tabela}/${registroId}`,
                { method: "DELETE" }
            );

            const resultado = await response.text();
            console.log("Resposta do servidor:", resultado);
        } catch (error) {
            console.error("Erro ao enviar dados para o servidor:", error);
        } finally {
            prompt.close();
        }
    });
}

prompt.question('O que vai ser realizado: INSERT, UPDATE, SELECT ou DELETE\n', (opcao) => {
    const crud = opcao.trim().toUpperCase();

    switch(crud){
        case 'INSERT':
            prompt.question('Qual tabela vai ser realizada o INSERT: PROFESSOR, MODALIDADE ou TURMA\n', (tabelas) => {
                const tabela = tabelas.trim().toLowerCase();
                perguntarInsert(tabela);
            });
            break;
        case 'UPDATE':
            prompt.question('Qual tabela vai ser realizada o UPDATE: PROFESSOR, MODALIDADE ou TURMA\n', (tabelas) => {
                const tabela = tabelas.trim().toLowerCase();
                perguntarUpdate(tabela);
            });
            break;
        case 'SELECT':
            prompt.question('Qual tabela vai ser realizada o SELECT: PROFESSOR, MODALIDADE ou TURMA\n', (tabelas) => {
                const tabela = tabelas.trim().toLowerCase();
                realizarSelect(tabela);
            });
            break;
        case 'DELETE':
            prompt.question('Qual tabela vai ser realizada o DELETE: PROFESSOR, MODALIDADE ou TURMA\n', (tabelas) => {
                const tabela = tabelas.trim().toLowerCase();
                perguntarDelete(tabela);
            });
            break;
    };
});