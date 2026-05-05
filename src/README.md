# Oficina API — Sistema de Ordem de Serviço

## Como rodar

```bash
npm install
# crie o banco no PostgreSQL: CREATE DATABASE oficina_db;
# ajuste usuário/senha no .env.example e renomeie para .env
npm run dev
```

---

## 10 Rotas da API

### TIPOS DE SERVIÇO

| Método | Rota | Descrição |
|--------|------|-----------|
| POST   | /tipos-servico     | Criar tipo de serviço |
| GET    | /tipos-servico     | Listar todos |
| GET    | /tipos-servico/:id | Buscar por ID |
| PUT    | /tipos-servico/:id | Atualizar |
| DELETE | /tipos-servico/:id | Remover |

### ORDENS DE SERVIÇO

| Método | Rota | Descrição |
|--------|------|-----------|
| POST   | /ordens-servico     | Abrir nova OS |
| GET    | /ordens-servico     | Listar todas (filtra por ?status=) |
| GET    | /ordens-servico/:id | Buscar por ID (mostra tempo decorrido) |
| PUT    | /ordens-servico/:id | Atualizar/concluir OS |
| DELETE | /ordens-servico/:id | Remover OS |

---

## Exemplos para o Insomnia

### 1. POST /tipos-servico
```json
{
  "nome": "Troca de óleo",
  "descricao": "Troca de óleo do motor + filtro",
  "valor": 150.00,
  "tempo_estimado_horas": 1.5
}
```

### 2. POST /ordens-servico
```json
{
  "nome_cliente": "João Silva",
  "telefone_cliente": "49999887766",
  "placa_veiculo": "ABC1234",
  "modelo_veiculo": "Gol 1.0",
  "ano_veiculo": 2020,
  "tipo_servico_id": 1,
  "observacoes": "Cliente relatou barulho no motor"
}
```

### 3. GET /ordens-servico?status=aberta
Filtra apenas OSs abertas.

### 4. PUT /ordens-servico/1 — Concluir OS
```json
{
  "status": "concluida"
}
```
→ Calcula automaticamente: duração em horas + valor cobrado + data de saída.

---

## Regras de Negócio implementadas

- Valor e tempo estimado devem ser maiores que zero
- Ano do veículo não pode ser futuro
- Ao concluir a OS: data de saída é registrada automaticamente
- Duração calculada automaticamente (data_saida - data_entrada em horas)
- Valor cobrado copiado do tipo de serviço no momento do fechamento
- OS concluída/cancelada não pode ser editada
- OS concluída não pode ser deletada
- GET por ID mostra tempo decorrido (em horas) para OS ainda abertas
