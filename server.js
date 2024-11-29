import express from "express";
import bodyParser from "body-parser"; // Middleware para interpretar JSON
import connection from "./connection.js";

const app = express();

// Middleware para interpretar JSON no corpo da requisição
app.use(bodyParser.json());

// Rota principal que recebe o nome da tabela
app.get("/:tabela", (req, res) => {
    const tabela = req.params.tabela.toLowerCase();

    let query = "";

    // Montar query com base na tabela
    switch (tabela) {
        case "professor":
            query = "SELECT * FROM professor";
            break;

        case "modalidade":
            query = "SELECT * FROM modalidade";
            break;

        case "turma":
            query = "SELECT t.id AS id_turma, m.nome AS modalidade, p.nome AS professor, t.horario_inicio, t.horario_fim FROM turma t LEFT JOIN modalidade m ON (m.id = t.id_modalidade) LEFT JOIN professor p ON (p.id = t.id_professor)";
            break;

        default:
            res.status(400).send({ error: "Tabela inválida! Tente PROFESSOR, MODALIDADE ou TURMA." });
            return;
    }

    // Executar a consulta no banco
    connection.query(query, (err, result) => {
        if (err) {
            console.error("Erro ao buscar no banco:", err.message);
            res.status(500).send({ error: "Erro ao buscar no banco" });
            return;
        }

        // Retornar os registros como JSON
        if (result.length > 0) {
            res.json(result); // Envia os registros como JSON
        } else {
            res.status(404).send({ message: `Não há registros para exibir na tabela ${tabela.toUpperCase()}.` });
        }
    });
});

// Rota para INSERT
app.post("/insert/:tabela", (req, res) => {
    const tabela = req.params.tabela.toLowerCase();
    const dados = req.body; // Dados enviados pelo cliente

    let query = "";
    let valores = [];

    // Montar query com base na tabela
    switch (tabela) {
        case "professor":
            query = "INSERT INTO professor (nome, cpf) VALUES (?, ?)";
            valores = [dados.nome, dados.cpf];
            break;

        case "modalidade":
            query = "INSERT INTO modalidade (nome) VALUES (?)";
            valores = [dados.nome];
            break;

        case "turma":
            query = `INSERT INTO turma (id_modalidade, id_professor, horario_inicio, horario_fim) VALUES (?, ?, ?, ?)`;
            valores = [
                dados.id_modalidade,
                dados.id_professor,
                dados.horario_inicio,
                dados.horario_fim,
            ];
            break;

        default:
            res.status(400).send("Tabela inválida!");
            return;
    }

    // Executar query no banco
    connection.query(query, valores, (err, result) => {
        if (err) {
            console.error("Erro ao inserir no banco:", err.message);
            res.status(500).send("Erro ao inserir no banco" + err);
            return;
        }
        res.status(201).send(`Registro inserido com sucesso! ID: ${result.insertId}`);
    });
});

// Rota para UPDATE
app.put("/update/:tabela/:id", (req, res) => {
    const tabela = req.params.tabela.toLowerCase();
    const id = parseInt(req.params.id, 10);
    const dados = req.body; // Dados enviados pelo cliente

    let query = "";
    let valores = [];

    // Montar query com base na tabela
    switch (tabela) {
        case "professor":
            query = "UPDATE professor SET nome = ?, cpf = ? WHERE id = ?";
            valores = [dados.nome, dados.cpf, id];
            break;

        case "modalidade":
            query = "UPDATE modalidade SET nome = ? WHERE id = ?";
            valores = [dados.nome, id];
            break;

        case "turma":
            query = `UPDATE turma SET id_modalidade = ?, id_professor = ?, horario_inicio = ?, horario_fim = ? WHERE id = ?`;
            valores = [dados.id_modalidade, dados.id_professor, dados.horario_inicio, dados.horario_fim, id];
            break;

        default:
            res.status(400).send("Tabela inválida!");
            return;
    }

    // Executar query no banco
    connection.query(query, valores, (err, result) => {
        if (err) {
            console.error("Erro ao atualizar o banco:", err.message);
            res.status(500).send("Erro ao atualizar o banco");
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send("Registro não encontrado!");
            return;
        }

        res.send("Registro atualizado com sucesso!");
    });
});

// Rota para DELETE
app.delete("/delete/:tabela/:id", (req, res) => {
    const tabela = req.params.tabela.toLowerCase();
    const id = parseInt(req.params.id, 10);

    let query = "";

    // Montar query com base na tabela
    switch (tabela) {
        case "professor":
            query = "DELETE FROM professor WHERE id = ?";
            break;

        case "modalidade":
            query = "DELETE FROM modalidade WHERE id = ?";
            break;

        case "turma":
            query = "DELETE FROM turma WHERE id = ?";
            break;

        default:
            res.status(400).send("Tabela inválida!");
            return;
    }

    // Executar query no banco
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Erro ao excluir do banco:", err.message);
            res.status(500).send("Erro ao excluir do banco");
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send("Registro não encontrado!");
            return;
        }

        res.send("Registro excluído com sucesso!");
    });
});

app.listen(3000, () => {
    console.log('App rodando na porta 3000');
    connection.connect((err) => {
        if(err) throw err;
        console.log('Database conectado');
    })
});