export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, email, telefone, crm, especialidade, experiencia, motivo } = req.body;

  if (!nome || !email || !telefone) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  const experienciaMap = {
    nunca: 'Nunca prescrevi',
    alguns: 'Já prescrevi em alguns casos',
    regular: 'Prescrevo regularmente'
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Lumi Academy <no-reply@starupit.com.br>',
        to: ['rafael.bandeira@outlook.com'],
        subject: `Nova inscrição — ${nome}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f7f5f0;padding:32px;border-radius:12px"><div style="background:#1a3a2a;padding:24px 28px;border-radius:10px;margin-bottom:24px"><h1 style="color:white;font-size:22px;margin:0">Nova Inscrição — Lumi Academy</h1><p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:14px">Cannabis Medicinal — Guia Completo</p></div><div style="background:white;border-radius:8px;padding:12px 16px;margin-bottom:8px"><span style="font-size:11px;color:#999;text-transform:uppercase">Nome</span><br><strong style="font-size:16px;color:#1a1a1a">${nome}</strong></div><div style="background:white;border-radius:8px;padding:12px 16px;margin-bottom:8px"><span style="font-size:11px;color:#999;text-transform:uppercase">E-mail</span><br><span style="font-size:15px;color:#1a1a1a">${email}</span></div><div style="background:white;border-radius:8px;padding:12px 16px;margin-bottom:8px"><span style="font-size:11px;color:#999;text-transform:uppercase">Telefone</span><br><span style="font-size:15px;color:#1a1a1a">${telefone}</span></div><div style="background:white;border-radius:8px;padding:12px 16px;margin-bottom:8px"><span style="font-size:11px;color:#999;text-transform:uppercase">CRM/CRO</span><br><span style="font-size:15px;color:#1a1a1a">${crm||'—'}</span></div><div style="background:white;border-radius:8px;padding:12px 16px;margin-bottom:8px"><span style="font-size:11px;color:#999;text-transform:uppercase">Especialidade</span><br><span style="font-size:15px;color:#1a1a1a">${especialidade||'—'}</span></div><div style="background:white;border-radius:8px;padding:12px 16px;margin-bottom:8px"><span style="font-size:11px;color:#999;text-transform:uppercase">Experiência</span><br><span style="font-size:15px;color:#1a1a1a">${experienciaMap[experiencia]||'—'}</span></div><div style="background:white;border-radius:8px;padding:12px 16px;margin-bottom:8px"><span style="font-size:11px;color:#999;text-transform:uppercase">Motivação</span><br><span style="font-size:15px;color:#1a1a1a">${motivo||'—'}</span></div><div style="margin-top:24px;padding:16px;background:#f5821f;border-radius:8px;text-align:center"><a href="mailto:${email}" style="color:white;font-weight:600;font-size:15px;text-decoration:none">Responder para ${email}</a></div></div>`
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Erro ao enviar email' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
