'use strict'
// db/emailTemplates.js
// Templates HTML para emails transacionais do Kadu

// Logo inline em SVG — funciona na maioria dos clientes de email
const logoSVG = `
<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr>
    <td align="center">
      <img
        src="https://raw.githubusercontent.com/lvt10/Kadu/main/frontend/src/assets/kadu_icon.png"
        alt="Kadu"
        width="64"
        height="64"
        style="border-radius:16px;display:block;"
      />
    </td>
  </tr>
  <tr>
    <td style="text-align:center;padding-top:8px;">
      <span style="font-family:Arial,sans-serif;font-size:22px;font-weight:800;color:#0e7490;letter-spacing:1px;">Kadu</span>
    </td>
  </tr>
</table>
`

const baseTemplate = (conteudo) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Kadu — Portal do Professor</title>
</head>
<body style="margin:0;padding:0;background-color:#f0fdfa;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0fdfa;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0e7490 0%,#06b6d4 50%,#10b981 100%);border-radius:16px 16px 0 0;padding:40px 48px;text-align:center;">
              ${logoSVG}
              <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:16px 0 0;letter-spacing:0.5px;">Portal do Professor</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:48px;border-left:1px solid #cffafe;border-right:1px solid #cffafe;">
              ${conteudo}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fffe;border:1px solid #cffafe;border-top:none;border-radius:0 0 16px 16px;padding:24px 48px;text-align:center;">
              <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;">
                Este email foi enviado automaticamente pelo sistema Kadu.
              </p>
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                Se você não solicitou isso, ignore este email com segurança.
              </p>
              <p style="color:#cbd5e1;font-size:11px;margin:16px 0 0;">
                © 2026 Kadu. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`

function emailVerificacao(nome, codigo) {
  const conteudo = `
    <h1 style="color:#0f172a;font-size:24px;font-weight:800;margin:0 0 8px;">Confirme seu cadastro</h1>
    <p style="color:#64748b;font-size:16px;margin:0 0 32px;">Olá, <strong style="color:#0f172a;">${nome}</strong>! Bem-vindo(a) ao Kadu.</p>

    <p style="color:#334155;font-size:15px;margin:0 0 24px;">
      Use o código abaixo para confirmar seu email e ativar sua conta:
    </p>

    <!-- Código -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;">
      <tr>
        <td align="center">
          <div style="background:#ecfeff;border:2px solid #06b6d4;border-radius:14px;padding:32px 48px;display:inline-block;">
            <span style="font-family:'Courier New',monospace;font-size:48px;font-weight:800;letter-spacing:16px;color:#0e7490;">${codigo}</span>
          </div>
        </td>
      </tr>
    </table>

    <!-- Info -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fffe;border:1px solid #cffafe;border-radius:10px;margin:0 0 24px;">
      <tr>
        <td style="padding:16px 20px;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:4px 0;">
                <span style="color:#0891b2;font-size:14px;">⏱</span>
                <span style="color:#334155;font-size:14px;margin-left:8px;">Este código expira em <strong>10 minutos</strong></span>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 0;">
                <span style="color:#0891b2;font-size:14px;">🔒</span>
                <span style="color:#334155;font-size:14px;margin-left:8px;">Use apenas uma vez — ele será invalidado após o uso</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="color:#94a3b8;font-size:13px;margin:0;">
      Se você não criou uma conta no Kadu, ignore este email.
    </p>
  `
  return baseTemplate(conteudo)
}

function emailSenhaTemporaria(nome, senhaTemp) {
  const conteudo = `
    <h1 style="color:#0f172a;font-size:24px;font-weight:800;margin:0 0 8px;">Redefinição de senha</h1>
    <p style="color:#64748b;font-size:16px;margin:0 0 32px;">Olá, <strong style="color:#0f172a;">${nome}</strong>!</p>

    <p style="color:#334155;font-size:15px;margin:0 0 24px;">
      Recebemos uma solicitação de redefinição de senha para sua conta. Sua nova senha temporária é:
    </p>

    <!-- Senha -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;">
      <tr>
        <td align="center">
          <div style="background:#ecfeff;border:2px solid #06b6d4;border-radius:14px;padding:28px 48px;display:inline-block;">
            <span style="font-family:'Courier New',monospace;font-size:32px;font-weight:800;letter-spacing:8px;color:#0e7490;">${senhaTemp}</span>
          </div>
        </td>
      </tr>
    </table>

    <!-- Passos -->
    <p style="color:#334155;font-size:15px;font-weight:600;margin:0 0 16px;">Como proceder:</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
      ${[
        ['1', 'Acesse o portal Kadu com seu email'],
        ['2', 'Use a senha temporária acima para entrar'],
        ['3', 'Altere sua senha para uma de sua preferência'],
      ].map(([num, texto]) => `
        <tr>
          <td style="padding:8px 0;vertical-align:top;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width:28px;height:28px;background:linear-gradient(135deg,#06b6d4,#34d399);border-radius:50%;text-align:center;vertical-align:middle;">
                  <span style="color:white;font-size:13px;font-weight:700;">${num}</span>
                </td>
                <td style="padding-left:12px;color:#334155;font-size:14px;vertical-align:middle;">${texto}</td>
              </tr>
            </table>
          </td>
        </tr>
      `).join('')}
    </table>

    <!-- Aviso -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fef9c3;border:1px solid #fde68a;border-radius:10px;margin:0 0 24px;">
      <tr>
        <td style="padding:14px 18px;">
          <span style="font-size:14px;color:#92400e;">
            ⚠️ <strong>Atenção:</strong> Por segurança, recomendamos alterar esta senha após o primeiro acesso.
          </span>
        </td>
      </tr>
    </table>

    <p style="color:#94a3b8;font-size:13px;margin:0;">
      Se você não solicitou a redefinição de senha, entre em contato com o suporte imediatamente.
    </p>
  `
  return baseTemplate(conteudo)
}

module.exports = { emailVerificacao, emailSenhaTemporaria }
