const form = document.getElementById("formProduto");

if (form) {
    const mensagem = document.getElementById("mensagem");
    const botaoCadastrar = form.querySelector(".primary");
    const botoesTipo = document.querySelectorAll(".type-card");
    const campoCategoria = document.getElementById("categoria");
    const tipoSelecionado = document.getElementById("tipoSelecionado");
    const campoNome = document.getElementById("nomeProduto");

    const previewFoto = document.getElementById("previewFoto");
    const previewCategoria = document.getElementById("previewCategoria");
    const previewNome = document.getElementById("previewNome");
    const previewDescricao = document.getElementById("previewDescricao");
    const previewPreco = document.getElementById("previewPreco");

    const imagemPadrao = previewFoto.src;

    const tiposProduto = {
        alimentos: {
            titulo: "Cadastro de alimentos",
            placeholder: "Racao premium para pets",
            foto: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=900&q=80",
            categorias: [
                ["Ração", "Racao"],
                ["Petiscos", "Petiscos"]
            ]
        },
        higiene: {
            titulo: "Cadastro de higiene",
            placeholder: "Shampoo para pelos sensiveis",
            foto: "img/higiene-pets.png",
            categorias: [
                ["Limpeza", "Limpeza"]
            ]
        },
        diversao: {
            titulo: "Cadastro de diversão",
            placeholder: "Bola resistente para cachorro",
            foto: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80",
            categorias: [
                ["Brinquedos", "Brinquedos"]
            ]
        },
        saude: {
            titulo: "Cadastro de saúde pet",
            placeholder: "Suplemento vitamínico",
            foto: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&w=900&q=80",
            categorias: [
                ["Farmácia", "Farmacia"]
            ]
        },
        acessorios: {
            titulo: "Cadastro de acessórios",
            placeholder: "Coleira ajustável",
            foto: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=900&q=80",
            categorias: [
                ["Coleiras", "Coleiras"],
                ["Acessórios", "Acessorios"],
                ["Roupas", "Roupas"]
            ]
        }
    };

    let tipoAtual = "alimentos";

    function produtoDoFormulario() {
        const dados = new FormData(form);

        return {
            foto: dados.get("foto").trim(),
            nomeProduto: dados.get("nomeProduto").trim(),
            descricaoProduto: dados.get("descricaoProduto").trim(),
            preco: Number(dados.get("preco")),
            vendedor: dados.get("vendedor").trim(),
            categoria: dados.get("categoria"),
            quantidade: Number.parseInt(dados.get("quantidade"), 10),
            marca: dados.get("marca").trim()
        };
    }

    function exibirMensagem(texto, tipo) {
        mensagem.textContent = texto;
        mensagem.className = `message field-full ${tipo}`;
    }

    function formatarPreco(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(Number.isFinite(valor) ? valor : 0);
    }

    function carregarCategorias(tipo) {
        const config = tiposProduto[tipo];
        campoCategoria.innerHTML = "";

        config.categorias.forEach(([valor, texto]) => {
            const option = document.createElement("option");
            option.value = valor;
            option.textContent = texto;
            campoCategoria.appendChild(option);
        });
    }

    function selecionarTipo(tipo) {
        tipoAtual = tipo;
        const config = tiposProduto[tipo];

        botoesTipo.forEach((botao) => {
            const ativo = botao.dataset.type === tipo;
            botao.classList.toggle("active", ativo);
            botao.setAttribute("aria-selected", String(ativo));
        });

        tipoSelecionado.textContent = config.titulo;
        campoNome.placeholder = config.placeholder;
        carregarCategorias(tipo);

        if (!document.getElementById("foto").value.trim()) {
            previewFoto.src = config.foto;
        }

        atualizarPreview();
    }

    function atualizarPreview() {
        const produto = produtoDoFormulario();
        const imagemTipo = tiposProduto[tipoAtual].foto;

        previewFoto.src = produto.foto || imagemTipo || imagemPadrao;
        previewNome.textContent = produto.nomeProduto || "Novo produto";
        previewDescricao.textContent = produto.descricaoProduto || "A prévia acompanha os dados digitados no formulário.";
        previewCategoria.textContent = produto.categoria || "Categoria";
        previewPreco.textContent = formatarPreco(produto.preco);
    }

    botoesTipo.forEach((botao) => {
        botao.addEventListener("click", () => selecionarTipo(botao.dataset.type));
    });

    form.addEventListener("input", atualizarPreview);
    form.addEventListener("reset", () => {
        setTimeout(() => {
            selecionarTipo(tipoAtual);
            exibirMensagem("", "");
        }, 0);
    });

    previewFoto.addEventListener("error", () => {
        previewFoto.src = tiposProduto[tipoAtual].foto || imagemPadrao;
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        exibirMensagem("", "");

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const produto = produtoDoFormulario();
        botaoCadastrar.disabled = true;
        botaoCadastrar.textContent = "Cadastrando...";

        try {
            const resposta = await fetch("/produto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            });

            if (!resposta.ok) {
                throw new Error("Erro ao cadastrar o produto.");
            }

            form.reset();
            selecionarTipo(tipoAtual);
            exibirMensagem("Produto cadastrado com sucesso.", "success");
        } catch (erro) {
            exibirMensagem("Nao foi possivel cadastrar. Verifique se a aplicacao Java e o MySQL estao ligados.", "error");
        } finally {
            botaoCadastrar.disabled = false;
            botaoCadastrar.textContent = "Cadastrar";
        }
    });

    selecionarTipo(tipoAtual);
}

const formPerfil = document.getElementById("formPerfil");
const mensagemPerfil = document.getElementById("mensagemPerfil");

if (formPerfil) {
    formPerfil.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!formPerfil.checkValidity()) {
            formPerfil.reportValidity();
            return;
        }

        const dados = Object.fromEntries(new FormData(formPerfil).entries());
        localStorage.setItem("dogoutPerfil", JSON.stringify(dados));
        mensagemPerfil.textContent = "Perfil cadastrado com sucesso.";
        mensagemPerfil.className = "message field-full success";
        formPerfil.reset();
    });

    formPerfil.addEventListener("reset", () => {
        setTimeout(() => {
            mensagemPerfil.textContent = "";
            mensagemPerfil.className = "message field-full";
        }, 0);
    });
}

const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dotsArea = carousel.querySelector(".carousel-dots");
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    let current = 0;

    function showSlide(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("active", slideIndex === current);
        });
        dotsArea.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === current);
        });
    }

    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Ir para imagem ${index + 1}`);
        dot.addEventListener("click", () => showSlide(index));
        dotsArea.appendChild(dot);
    });

    prev.addEventListener("click", () => showSlide(current - 1));
    next.addEventListener("click", () => showSlide(current + 1));
    showSlide(0);
});

