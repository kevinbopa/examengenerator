const navItems = [
  { label: "Accueil", active: true, icon: "⌂" },
  { label: "Mes examens", icon: "▣" },
  { label: "Statistiques", icon: "▥" },
  { label: "Historique", icon: "◷" },
  { label: "Favoris", icon: "♡" },
  { label: "Parametres", icon: "⚙" }
];

export default function AppSidebar({ aiConfigured }) {
  return (
    <aside className="app-sidebar">
      <div className="brand-card">
        <div className="brand-mark">
          <span className="brand-orb brand-orb-main" />
          <span className="brand-orb brand-orb-small" />
        </div>
        <div>
          <h2>AgiliteXP</h2>
          <p>Examen de revision</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button key={item.label} className={`nav-item ${item.active ? "active" : ""}`} type="button">
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <article className="profile-card">
          <div className="profile-row">
            <div className="profile-avatar">AM</div>
            <div>
              <strong>Alex Martin</strong>
              <span>Etudiant</span>
            </div>
          </div>
          <div className="profile-progress-head">
            <span>Progression globale</span>
            <strong>68%</strong>
          </div>
          <div className="profile-progress-bar">
            <span />
          </div>
        </article>

        <article className="ai-sidebar-card">
          <h3>Mode IA {aiConfigured ? "actif" : "pret"}</h3>
          <p>
            Des questions generees intelligemment a partir du chapitre et de la banque actuelle.
          </p>
          <button type="button" className="primary-button compact-button">
            En savoir plus
          </button>
        </article>
      </div>
    </aside>
  );
}
