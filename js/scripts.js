// Inicializa os ícones do Lucide
// Inicialização do tema baseado na preferência salva
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

// Função para alternar entre temas
function toggleTheme() {
    if (document.documentElement.getAttribute('data-theme') === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o tema
    initTheme();
    
    // Adiciona evento ao botão de alternancia de tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    lucide.createIcons();
    
    // Elementos do formulário
    const form = document.getElementById('signupForm');
    const documentInput = document.getElementById('document');
    const documentLabel = document.querySelector('label[for="document"]');
    const cnpjOption = document.getElementById('cnpjOption');
    const cpfOption = document.getElementById('cpfOption');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');

    // Verifica se estamos na página de cadastro antes de adicionar os event listeners
    if (form && cnpjOption && cpfOption) {
        // Botões de alternância de tipo de documento
        cnpjOption.addEventListener('click', function() {
        cnpjOption.classList.add('active');
        cpfOption.classList.remove('active');
        documentLabel.textContent = 'CNPJ';
        documentInput.value = '';
        documentInput.placeholder = ' ';
        // Remove todos os event listeners existentes (técnica simplificada)
        documentInput.replaceWith(documentInput.cloneNode(true));
        // Recupera a referência atualizada
        const updatedDocumentInput = document.getElementById('document');
        // Adiciona o evento para a máscara de CNPJ
        updatedDocumentInput.addEventListener('input', function(e) {
            e.target.value = applyCNPJMask(e.target.value);
        });
    });

    cpfOption.addEventListener('click', function() {
        cpfOption.classList.add('active');
        cnpjOption.classList.remove('active');
        documentLabel.textContent = 'CPF';
        documentInput.value = '';
        documentInput.placeholder = ' ';
        // Remove todos os event listeners existentes (técnica simplificada)
        documentInput.replaceWith(documentInput.cloneNode(true));
        // Recupera a referência atualizada
        const updatedDocumentInput = document.getElementById('document');
        // Adiciona o evento para a máscara de CPF
        updatedDocumentInput.addEventListener('input', function(e) {
            e.target.value = applyCPFMask(e.target.value);
        });
    });

    // Inicializa o select personalizado
    const segmentContainer = document.getElementById('segmentContainer');
    
    // Verifica se o container do select existe
    if (segmentContainer) {
        const segmentSelect = document.getElementById('segment');
        const segmentSelected = segmentContainer.querySelector('.custom-select-selected');
        const segmentSelectedText = segmentSelected.querySelector('.selected-text');
        const segmentSearch = document.getElementById('segmentSearch');
        const segmentOptions = segmentContainer.querySelectorAll('.custom-select-option');
        
        // Função para abrir/fechar o dropdown
        segmentSelected.addEventListener('click', function() {
        segmentContainer.classList.toggle('open');
        if (segmentContainer.classList.contains('open')) {
            segmentSearch.focus();
        }
    });
    
    // Função para filtrar as opções
    segmentSearch.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        
        segmentOptions.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (text.includes(searchText)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        });
    });
    
    // Função para selecionar uma opção
    segmentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            
            // Atualiza o texto selecionado
            segmentSelectedText.textContent = text;
            
            // Atualiza o valor do select oculto
            segmentSelect.value = value;
            
            // Dispara o evento change
            segmentSelect.dispatchEvent(new Event('change'));
            
            // Fecha o dropdown
            segmentContainer.classList.remove('open');
            
            // Marca o container como tendo valor
            segmentContainer.classList.add('has-value');
            
            // Limpa a pesquisa
            segmentSearch.value = '';
            
            // Mostra todas as opções novamente
            segmentOptions.forEach(opt => {
                opt.style.display = '';
            });
        });
    });
    
    // Fecha o dropdown quando clica fora
    document.addEventListener('click', function(e) {
        if (!segmentContainer.contains(e.target)) {
            segmentContainer.classList.remove('open');
            
            // Limpa a pesquisa
            if (segmentSearch) {
                segmentSearch.value = '';
            }
            
            // Mostra todas as opções novamente
            if (segmentOptions) {
                segmentOptions.forEach(opt => {
                    opt.style.display = '';
                });
            }
        }
    });
    } // Fechamento do bloco condicional para o select personalizado

    // Função para exibir toasts no estilo React - REVISADA
    function showToast(type, message) {
        const toastContainer = document.getElementById('toast-container');
        
        // Cria o elemento toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Adiciona o ícone baseado no tipo
        let icon = '';
        switch(type) {
            case 'success':
                icon = '<i class="fas fa-check-circle toast-icon"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-times-circle toast-icon"></i>';
                break;
            case 'info':
                icon = '<i class="fas fa-info-circle toast-icon"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle toast-icon"></i>';
                break;
        }
        
        // Constrói a estrutura do toast
        toast.innerHTML = `
            <div class="toast-content">
                ${icon}
                <div class="toast-message">${message}</div>
            </div>
            <div class="toast-close"><i class="fas fa-times"></i></div>
            <div class="toast-progress">
                <div class="toast-progress-bar"></div>
            </div>
        `;
        
        // Adiciona o toast ao container
        toastContainer.appendChild(toast);
        
        // Força um reflow para que a animação funcione
        void toast.offsetWidth;
        
        // Adiciona a classe show para iniciar a animação
        toast.classList.add('show');
        
        // Configura o evento de clique no botão de fechar
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', function() {
            toast.classList.remove('show');
            
            // Remove o toast após a animação terminar
            setTimeout(() => {
                toast.remove();
            }, 500);
        });
        
        // Remove automaticamente o toast após 5 segundos
        setTimeout(() => {
            if (toast.parentNode) { // Verifica se o toast ainda existe no DOM
                toast.classList.remove('show');
                
                // Remove o toast após a animação terminar
                setTimeout(() => {
                    if (toast.parentNode) { // Verifica novamente antes de remover
                        toast.remove();
                    }
                }, 500);
            }
        }, 5000);
    }
    
    // Função de teste de toast removida da produção
    
    // Função para aplicar a máscara de CNPJ
    function applyCNPJMask(value) {
        // Remove tudo que não é dígito
        value = value.replace(/\D/g, '');
        
        // Limita a 14 dígitos
        value = value.slice(0, 14);
        
        // Adiciona os pontos e hífen
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
        
        return value;
    }
    
    // Função para aplicar a máscara de CPF
    function applyCPFMask(value) {
        // Remove tudo que não é dígito
        value = value.replace(/\D/g, '');
        
        // Limita a 11 dígitos
        value = value.slice(0, 11);
        
        // Adiciona os pontos e hífen
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1-$2');
        
        return value;
    }
    
    // Configurar o campo de documento inicialmente como CNPJ
    documentLabel.textContent = 'CNPJ';
    documentInput.placeholder = ' ';
    
    // Adiciona o evento para a máscara de CNPJ inicialmente
    documentInput.addEventListener('input', function(e) {
        e.target.value = applyCNPJMask(e.target.value);
    });
    
    // Validação para aceitar apenas números na senha
    passwordInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número
    });
    
    // O campo de confirmação de senha
    confirmPasswordInput.addEventListener('input', function() {
        // Remove qualquer caractere que não seja número
        this.value = this.value.replace(/\D/g, ''); 
    });
    
    // Validação quando sai do campo de confirmação de senha
    confirmPasswordInput.addEventListener('blur', function() {
        // Só valida se o campo tiver algum valor
        if (this.value.length > 0) {
            // Compara as senhas
            const password = passwordInput.value;
            const confirmPassword = this.value;
            
            if (password !== confirmPassword) {
                // Adiciona uma classe de erro ao campo
                this.classList.add('input-error');
                
                // Exibe um toast de aviso
                showToast('warning', 'As senhas não coincidem.');
            } else {
                // Remove a classe de erro se existir
                this.classList.remove('input-error');
            }
        }
    });
    
    // O campo de senha
    passwordInput.addEventListener('input', function() {
        // Remove qualquer caractere que não seja número
        this.value = this.value.replace(/\D/g, '');
    });
    
    // Função para permitir apenas números foi incorporada diretamente nos listeners acima
    
    // Toggle para mostrar/ocultar senha
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Atualiza o ícone
        if (type === 'password') {
            this.innerHTML = '<i class="fas fa-eye"></i>';
        } else {
            this.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
    });
    
    toggleConfirmPasswordBtn.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        
        // Atualiza o ícone
        if (type === 'password') {
            this.innerHTML = '<i class="fas fa-eye"></i>';
        } else {
            this.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
    });
    
    // Função para exibir o overlay de carregamento
    function showLoading() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay active';
        overlay.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(overlay);
    }
    
    // Função para ocultar o overlay de carregamento
    function hideLoading() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação de senha
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (password !== confirmPassword) {
            showToast('error', 'As senhas não coincidem.');
            return;
        }
        
        if (password.length < 4) {
            showToast('error', 'A senha deve ter pelo menos 4 dígitos.');
            return;
        }
        
        if (!/^\d+$/.test(password)) {
            showToast('error', 'A senha deve conter apenas números.');
            return;
        }
        
        if (!/^\d+$/.test(password)) {
            showToast('error', 'A senha deve conter apenas números.');
            return;
        }
        
        // Exibe o overlay de carregamento
        showLoading();
        
        // Coleta os dados do formulário
        const formData = {
            segment: document.getElementById('segment').value,
            document: document.getElementById('document').value.replace(/\D/g, ''),
            documentType: cnpjOption.classList.contains('active') ? 'cnpj' : 'cpf',
            companyName: document.getElementById('companyName').value,
            email: document.getElementById('email').value,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        // URL do webhook para envio dos dados (substitua pela URL correta)
        const webhookUrl = 'https://webhook.site/seu-id-unico';
        
        // Função para processar a resposta
        function processResponse(data) {
            // Oculta o overlay de carregamento
            hideLoading();
            
            if (data && data.success) {
                // Limpa o formulário
                form.reset();
                
                // Mostra toast de sucesso
                showToast('success', 'Cadastro realizado com sucesso! Redirecionando...');
                
                // Redireciona após 2 segundos (opcional)
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                // Mostra toast de erro
                const errorMessage = data && data.message 
                    ? data.message 
                    : 'Ocorreu um erro ao processar o cadastro. Tente novamente.';
                
                showToast('error', errorMessage);
            }
        }
        
        // Tenta enviar usando XMLHttpRequest (alternativa ao fetch)
        const xhr = new XMLHttpRequest();
        xhr.open('POST', webhookUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    processResponse(data);
                } catch (e) {
                    // Em caso de erro no parse de JSON
                    processResponse({
                        success: true,
                        message: 'Cadastro recebido com sucesso!'
                    });
                }
            } else {
                // Em caso de erro de HTTP
                processResponse({
                    success: false,
                    message: 'Erro de comunicação com o servidor.'
                });
            }
        };
        
        xhr.onerror = function() {
            // Em caso de erro de rede
            processResponse({
                success: false,
                message: 'Erro de conexão. Verifique sua internet.'
            });
        };
        
        // Envia os dados
        xhr.send(JSON.stringify(formData));
    });
    
    // Link para login
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
    
    } // Fechamento do bloco condicional para a página de cadastro
});
