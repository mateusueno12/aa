// Função principal para gerar CPF
function gerarCPF() {
    // Gera 9 dígitos aleatórios
    const cpfSemDigitos = [];
    for (let i = 0; i < 9; i++) {
        cpfSemDigitos.push(Math.floor(Math.random() * 10));
    }

    // Calcula o primeiro dígito verificador
    const digito1 = calcularDigitoVerificador(cpfSemDigitos, 10);
    cpfSemDigitos.push(digito1);

    // Calcula o segundo dígito verificador
    const digito2 = calcularDigitoVerificador(cpfSemDigitos, 11);
    cpfSemDigitos.push(digito2);

    // Verifica se não é uma sequência repetida
    if (verificarSequenciaRepetida(cpfSemDigitos)) {
        return gerarCPF(); // Gera novamente se for repetido
    }

    // Formata o CPF
    const cpfFormatado = formatarCPF(cpfSemDigitos);
    document.getElementById('cpfOutput').textContent = cpfFormatado;
    
    // Mostra mensagem de sucesso
    mostrarStatus('✅ CPF válido gerado com sucesso!', 'success');
}

// Função para calcular dígito verificador
function calcularDigitoVerificador(digitos, pesoInicial) {
    let soma = 0;
    let peso = pesoInicial;

    for (let i = 0; i < digitos.length; i++) {
        soma += digitos[i] * peso;
        peso--;
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
}

// Função para verificar se é sequência repetida
function verificarSequenciaRepetida(cpf) {
    const primeiroDigito = cpf[0];
    return cpf.every(digito => digito === primeiroDigito);
}

// Função para formatar CPF no padrão XXX.XXX.XXX-XX
function formatarCPF(cpfArray) {
    const cpfString = cpfArray.join('');
    return cpfString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para copiar CPF para área de transferência
function copiarCPF() {
    const cpf = document.getElementById('cpfOutput').textContent;
    
    if (cpf === '000.000.000-00') {
        mostrarStatus('⚠️ Gere um CPF primeiro!', 'error');
        return;
    }

    // Usa a API Clipboard
    navigator.clipboard.writeText(cpf).then(() => {
        mostrarStatus('📋 CPF copiado para a área de transferência!', 'success');
    }).catch(err => {
        mostrarStatus('❌ Erro ao copiar CPF', 'error');
        // Fallback para navegadores mais antigos
        copiarCPFFallback(cpf);
    });
}

// Função de fallback para copiar CPF em navegadores antigos
function copiarCPFFallback(cpf) {
    const textarea = document.createElement('textarea');
    textarea.value = cpf;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        mostrarStatus('📋 CPF copiado para a área de transferência!', 'success');
    } catch (err) {
        mostrarStatus('❌ Erro ao copiar CPF', 'error');
    }
    
    document.body.removeChild(textarea);
}

// Função para mostrar mensagens de status
function mostrarStatus(mensagem, tipo) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = mensagem;
    statusDiv.className = 'status ' + tipo;
    
    // Esconde a mensagem após 3 segundos
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

// Função para validar se um CPF é válido (útil para testes)
function validarCPF(cpf) {
    // Remove formatação
    const cpfLimpo = cpf.replace(/[^\d]/g, '');
    
    if (cpfLimpo.length !== 11) return false;
    
    // Verifica sequência repetida
    if (verificarSequenciaRepetida(cpfLimpo.split('').map(Number))) return false;
    
    // Separa dígitos
    const digitos = cpfLimpo.substring(0, 9).split('').map(Number);
    const digito1 = parseInt(cpfLimpo.charAt(9));
    const digito2 = parseInt(cpfLimpo.charAt(10));
    
    // Calcula e verifica primeiro dígito
    const calcDigito1 = calcularDigitoVerificador(digitos, 10);
    if (calcDigito1 !== digito1) return false;
    
    // Calcula e verifica segundo dígito
    digitos.push(digito1);
    const calcDigito2 = calcularDigitoVerificador(digitos, 11);
    if (calcDigito2 !== digito2) return false;
    
    return true;
}

// Gera um CPF automaticamente ao carregar a página
window.onload = function() {
    gerarCPF();
};

// Exporta funções para uso global (se necessário em módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gerarCPF,
        validarCPF,
        calcularDigitoVerificador,
        verificarSequenciaRepetida,
        formatarCPF
    };
}
