import { useState } from "react";

const MAJOR_ARCANA = [
  { name: "El Loco", number: "0", emoji: "🌟", keyword: "Comienzos" },
  { name: "El Mago", number: "I", emoji: "🔮", keyword: "Voluntad" },
  { name: "La Sacerdotisa", number: "II", emoji: "🌙", keyword: "Intuición" },
  { name: "La Emperatriz", number: "III", emoji: "🌿", keyword: "Abundancia" },
  { name: "El Emperador", number: "IV", emoji: "🏛️", keyword: "Estructura" },
  { name: "El Sumo Sacerdote", number: "V", emoji: "📿", keyword: "Tradición" },
  { name: "Los Amantes", number: "VI", emoji: "✨", keyword: "Elección" },
  { name: "El Carro", number: "VII", emoji: "⚡", keyword: "Dirección" },
  { name: "La Fuerza", number: "VIII", emoji: "🦁", keyword: "Coraje" },
  { name: "El Ermitaño", number: "IX", emoji: "🕯️", keyword: "Soledad" },
  { name: "La Rueda de la Fortuna", number: "X", emoji: "☯️", keyword: "Ciclos" },
  { name: "La Justicia", number: "XI", emoji: "⚖️", keyword: "Verdad" },
  { name: "El Colgado", number: "XII", emoji: "💧", keyword: "Pausa" },
  { name: "La Muerte", number: "XIII", emoji: "🌑", keyword: "Transformación" },
  { name: "La Templanza", number: "XIV", emoji: "🌊", keyword: "Equilibrio" },
  { name: "El Diablo", number: "XV", emoji: "🔥", keyword: "Sombra" },
  { name: "La Torre", number: "XVI", emoji: "⛈️", keyword: "Ruptura" },
  { name: "La Estrella", number: "XVII", emoji: "💫", keyword: "Esperanza" },
  { name: "La Luna", number: "XVIII", emoji: "🌒", keyword: "Ilusión" },
  { name: "El Sol", number: "XIX", emoji: "☀️", keyword: "Vitalidad" },
  { name: "El Juicio", number: "XX", emoji: "🎺", keyword: "Renacimiento" },
  { name: "El Mundo", number: "XXI", emoji: "🌍", keyword: "Plenitud" },
];

const SYSTEM_PROMPT = `Actúa como un tarotista digital experto en crecimiento personal y arquetipos. Tu tono debe ser místico pero moderno, minimalista y muy empático. No eres un adivino de feria, eres un guía que ayuda a las personas a encontrar claridad a través de los símbolos del tarot.

Instrucciones:
1. El usuario ya eligió 3 cartas. Interprétalas.
2. Estructura tu respuesta con exactamente este formato JSON (sin markdown, sin backticks, solo JSON puro):
{
  "pasado": "texto para el pasado (máximo 2 oraciones evocadoras)",
  "presente": "texto para el presente (máximo 2 oraciones evocadoras)",
  "futuro": "texto para el futuro como consejo (máximo 2 oraciones evocadoras)",
  "mensaje": "un mensaje final corto y poderoso (1 oración, como un mantra)"
}
3. Usa lenguaje que invite a la reflexión, no a la predicción absoluta.
4. Sé conciso pero poderoso. Cada palabra debe contar.
5. Si el usuario menciona salud grave o temas legales, responde con {"error": "Para temas de salud o legales, el tarot no es el camino. Consulta a un profesional que pueda acompañarte con las herramientas correctas. 💙"}`;

function getRandomCards() {
  const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --ink: #0d0a0e; --parchment: #f5f0e8; --gold: #c9a84c;
    --gold-light: #e8c96a; --mystic: #6b4f8a; --mist: #9b8bb0;
    --smoke: #2a1f35; --cream: #ede8df;
  }
  body { background: var(--ink); color: var(--parchment); font-family: 'Cormorant Garamond', serif; min-height: 100vh; overflow-x: hidden; }
  .app { min-height: 100vh; position: relative; display: flex; flex-direction: column; align-items: center; }
  .stars { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .star { position: absolute; border-radius: 50%; background: white; animation: twinkle var(--dur) ease-in-out infinite alternate; }
  @keyframes twinkle { from { opacity: 0.1; transform: scale(0.8); } to { opacity: 0.7; transform: scale(1.2); } }
  .header { position: relative; z-index: 1; text-align: center; padding: 48px 24px 24px; width: 100%; max-width: 640px; }
  .header-eyebrow { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 6px; color: var(--gold); text-transform: uppercase; margin-bottom: 16px; opacity: 0.8; }
  .header h1 { font-family: 'Cinzel', serif; font-size: clamp(24px, 6vw, 42px); font-weight: 400; letter-spacing: 4px; color: var(--parchment); text-shadow: 0 0 40px rgba(201,168,76,0.3); margin-bottom: 12px; }
  .header-divider { display: flex; align-items: center; gap: 16px; justify-content: center; margin: 16px 0; }
  .header-divider::before { content: ''; flex: 1; max-width: 80px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold)); }
  .header-divider::after { content: ''; flex: 1; max-width: 80px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); }
  .header-divider span { color: var(--gold); font-size: 14px; }
  .header-subtitle { font-size: 16px; font-style: italic; color: var(--mist); line-height: 1.6; font-weight: 300; }
  .input-section { position: relative; z-index: 1; width: 100%; max-width: 560px; padding: 0 24px; margin-bottom: 32px; }
  .question-label { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 4px; color: var(--gold); text-transform: uppercase; margin-bottom: 12px; display: block; opacity: 0.7; }
  .question-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(201,168,76,0.25); border-radius: 2px; padding: 16px 20px; color: var(--parchment); font-family: 'Cormorant Garamond', serif; font-size: 17px; font-style: italic; resize: none; outline: none; transition: border-color 0.3s, background 0.3s; line-height: 1.6; }
  .question-input::placeholder { color: rgba(155,139,176,0.5); }
  .question-input:focus { border-color: rgba(201,168,76,0.6); background: rgba(255,255,255,0.06); }
  .reveal-btn { display: block; margin: 24px auto 0; background: transparent; border: 1px solid var(--gold); color: var(--gold); font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 5px; text-transform: uppercase; padding: 14px 40px; cursor: pointer; transition: all 0.4s; position: relative; overflow: hidden; }
  .reveal-btn::before { content: ''; position: absolute; inset: 0; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform 0.4s; z-index: -1; }
  .reveal-btn:hover { color: var(--ink); }
  .reveal-btn:hover::before { transform: scaleX(1); }
  .reveal-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .reveal-btn:disabled:hover { color: var(--gold); }
  .reveal-btn:disabled::before { transform: scaleX(0) !important; }
  .cards-section { position: relative; z-index: 1; width: 100%; max-width: 620px; padding: 0 24px; }
  .cards-label { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 4px; color: var(--gold); text-transform: uppercase; opacity: 0.6; text-align: center; margin-bottom: 24px; }
  .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 8px; }
  .card-slot { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .card-position { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 3px; color: var(--mist); text-transform: uppercase; opacity: 0.7; }
  .card { aspect-ratio: 2/3.2; width: 100%; border: 1px solid rgba(201,168,76,0.3); border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; position: relative; overflow: hidden; transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
  .card-back { background: linear-gradient(135deg, #1a0f2e 0%, #0d0a0e 50%, #1a1030 100%); animation: cardPulse 3s ease-in-out infinite alternate; }
  @keyframes cardPulse { from { box-shadow: 0 0 20px rgba(107,79,138,0.1); } to { box-shadow: 0 0 30px rgba(107,79,138,0.25), inset 0 0 20px rgba(107,79,138,0.05); } }
  .card-back::before { content: ''; position: absolute; inset: 6px; border: 1px solid rgba(201,168,76,0.15); border-radius: 3px; }
  .card-back-symbol { font-size: 28px; opacity: 0.5; }
  .card-back-text { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 3px; color: rgba(201,168,76,0.4); text-transform: uppercase; }
  .card-face { background: linear-gradient(160deg, #2a1f35 0%, #1a1228 100%); animation: revealCard 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
  @keyframes revealCard { from { transform: rotateY(-90deg); opacity: 0; } to { transform: rotateY(0); opacity: 1; } }
  .card-face:hover { border-color: rgba(201,168,76,0.7); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(107,79,138,0.3); }
  .card-number { font-family: 'Cinzel', serif; font-size: 10px; color: var(--gold); opacity: 0.7; letter-spacing: 2px; }
  .card-emoji { font-size: 30px; line-height: 1; }
  .card-name { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 1px; color: var(--parchment); text-align: center; padding: 0 8px; line-height: 1.4; }
  .card-keyword { font-family: 'Cormorant Garamond', serif; font-size: 11px; font-style: italic; color: var(--mist); opacity: 0.8; }
  .reading-section { position: relative; z-index: 1; width: 100%; max-width: 560px; padding: 32px 24px; }
  .loading-container { text-align: center; padding: 40px 0; }
  .loading-orb { width: 48px; height: 48px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, var(--gold-light), var(--mystic)); margin: 0 auto 20px; animation: orbFloat 2s ease-in-out infinite alternate, orbGlow 2s ease-in-out infinite alternate; }
  @keyframes orbFloat { from { transform: translateY(0); } to { transform: translateY(-8px); } }
  @keyframes orbGlow { from { box-shadow: 0 0 20px rgba(201,168,76,0.3); } to { box-shadow: 0 0 50px rgba(201,168,76,0.6), 0 0 80px rgba(107,79,138,0.3); } }
  .loading-text { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 18px; color: var(--mist); animation: breathe 2s ease-in-out infinite alternate; }
  @keyframes breathe { from { opacity: 0.5; } to { opacity: 1; } }
  .reading-block { margin-bottom: 28px; animation: fadeUp 0.7s ease-out forwards; opacity: 0; }
  .reading-block:nth-child(1) { animation-delay: 0.1s; }
  .reading-block:nth-child(2) { animation-delay: 0.3s; }
  .reading-block:nth-child(3) { animation-delay: 0.5s; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .reading-block-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .reading-label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 4px; color: var(--gold); text-transform: uppercase; opacity: 0.8; }
  .reading-card-ref { font-family: 'Cormorant Garamond', serif; font-size: 13px; font-style: italic; color: var(--mist); opacity: 0.7; }
  .reading-divider { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(201,168,76,0.2), transparent); }
  .reading-text { font-size: 18px; line-height: 1.75; color: var(--cream); font-weight: 300; border-left: 1px solid rgba(201,168,76,0.2); padding-left: 16px; }
  .message-final { margin-top: 36px; padding: 24px; border: 1px solid rgba(201,168,76,0.2); text-align: center; position: relative; animation: fadeUp 0.7s ease-out 0.7s forwards; opacity: 0; background: rgba(201,168,76,0.03); }
  .message-final::before { content: '✦'; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--ink); padding: 0 12px; color: var(--gold); font-size: 14px; }
  .message-final-label { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 5px; color: var(--gold); opacity: 0.6; text-transform: uppercase; margin-bottom: 12px; }
  .message-final-text { font-size: 20px; font-style: italic; color: var(--parchment); line-height: 1.5; font-weight: 300; }
  .reset-btn { display: block; margin: 32px auto 48px; background: transparent; border: none; color: var(--mist); font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 4px; text-transform: uppercase; cursor: pointer; padding: 8px 16px; transition: color 0.3s; opacity: 0.6; }
  .reset-btn:hover { color: var(--gold); opacity: 1; }
  .error-block { padding: 24px; border: 1px solid rgba(155,139,176,0.3); font-size: 17px; font-style: italic; color: var(--mist); line-height: 1.7; text-align: center; animation: fadeUp 0.5s ease-out forwards; }
  .key-hint { text-align: center; margin-top: 16px; font-size: 13px; color: var(--mist); font-style: italic; opacity: 0.6; }
  @media (max-width: 480px) {
    .header { padding: 32px 16px 16px; }
    .input-section, .cards-section, .reading-section { padding: 0 16px; }
    .card-emoji { font-size: 22px; }
    .card-name { font-size: 8px; }
  }
`;

function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100,
    size: Math.random() * 2 + 0.5, dur: (Math.random() * 3 + 2).toFixed(1),
  }));
  return (
    <div className="stars">
      {stars.map((s) => (
        <div key={s.id} className="star" style={{
          left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size,
          "--dur": `${s.dur}s`, animationDelay: `${Math.random() * 3}s`,
        }} />
      ))}
    </div>
  );
}

export default function TarotApp() {
  const apiKey = process.env.REACT_APP_GEMINI_KEY || "";
  const keySaved = true;
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState(getRandomCards());
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(null);
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState("question");

  async function handleReveal() {
    setLoading(true);
    setError(null);
    setReading(null);
    setPhase("reading");

    const prompt = `${SYSTEM_PROMPT}

El usuario pregunta: "${question || "Necesito orientación general en este momento de mi vida."}"

Las 3 cartas elegidas son:
- Pasado: ${cards[0].name} (${cards[0].keyword})
- Presente: ${cards[1].name} (${cards[1].keyword})
- Futuro/Consejo: ${cards[2].name} (${cards[2].keyword})

Responde SOLO con el JSON, sin texto adicional, sin backticks.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.9, maxOutputTokens: 1000 },
          }),
        }
      );
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.error) {
        setError(parsed.error);
        setPhase("question");
      } else {
        setReading(parsed);
      }
    } catch (err) {
      setError("Los astros no hablan con claridad ahora. Revisa tu API Key e intenta de nuevo.");
      setPhase("question");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setCards(getRandomCards());
    setReading(null);
    setError(null);
    setPhase("question");
    setQuestion("");
  }

  const positions = ["Pasado", "Presente", "Futuro"];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <StarField />

        <div className="header">
          <div className="header-eyebrow">Arcanos Mayores</div>
          <h1>T_IA_TAROT</h1>
          <div className="header-divider"><span>✦</span></div>
          <p className="header-subtitle">
            No predigo tu destino.<br />Te ayudo a escuchar lo que ya sabes.
          </p>
        </div>


        {keySaved && phase === "question" && (
          <div className="input-section">
            <label className="question-label">Tu pregunta o intención</label>
            <textarea
              className="question-input"
              rows={3}
              placeholder="¿Qué situación quieres explorar hoy? Puedes dejarlo en blanco para una lectura general..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
        )}

        {keySaved && (
          <div className="cards-section">
            <div className="cards-label">
              {phase === "question" ? "Tus cartas · ya han sido elegidas" : "Tu tirada"}
            </div>
            <div className="cards-grid">
              {cards.map((card, i) => (
                <div className="card-slot" key={i}>
                  <span className="card-position">{positions[i]}</span>
                  {phase === "question" ? (
                    <div className="card card-back">
                      <span className="card-back-symbol">🌑</span>
                      <span className="card-back-text">Arcano</span>
                    </div>
                  ) : (
                    <div className="card card-face">
                      <span className="card-number">{card.number}</span>
                      <span className="card-emoji">{card.emoji}</span>
                      <span className="card-name">{card.name}</span>
                      <span className="card-keyword">{card.keyword}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {keySaved && phase === "question" && (
          <button className="reveal-btn" onClick={handleReveal} disabled={loading}>
            Revelar la lectura
          </button>
        )}

        <div className="reading-section">
          {loading && (
            <div className="loading-container">
              <div className="loading-orb" />
              <p className="loading-text">Los símbolos toman forma...</p>
            </div>
          )}

          {error && <div className="error-block">{error}</div>}

          {reading && (
            <>
              <div className="reading-block">
                <div className="reading-block-header">
                  <span className="reading-label">Pasado · La base</span>
                  <span className="reading-card-ref">— {cards[0].name}</span>
                  <div className="reading-divider" />
                </div>
                <p className="reading-text">{reading.pasado}</p>
              </div>

              <div className="reading-block">
                <div className="reading-block-header">
                  <span className="reading-label">Presente · El desafío</span>
                  <span className="reading-card-ref">— {cards[1].name}</span>
                  <div className="reading-divider" />
                </div>
                <p className="reading-text">{reading.presente}</p>
              </div>

              <div className="reading-block">
                <div className="reading-block-header">
                  <span className="reading-label">Futuro · El consejo</span>
                  <span className="reading-card-ref">— {cards[2].name}</span>
                  <div className="reading-divider" />
                </div>
                <p className="reading-text">{reading.futuro}</p>
              </div>

              <div className="message-final">
                <div className="message-final-label">Mantra de esta lectura</div>
                <p className="message-final-text">"{reading.mensaje}"</p>
              </div>

              <button className="reset-btn" onClick={handleReset}>
                ✦ Nueva lectura ✦
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
